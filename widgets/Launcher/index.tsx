import App from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { For, createState } from "ags"
import AstalApps from "gi://AstalApps"

export default function Launcher(gdkmonitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
  const Apps = new AstalApps.Apps()
  const [appList, setAppList] = createState(new Array<AstalApps.Application>())
  let win: Astal.Window
  let searchBox: Gtk.Entry
  let scrolled: Gtk.ScrolledWindow

  function launch(app: AstalApps.Application) {
    win.hide()
    app.launch()
  }

  function onKey(_e: Gtk.EventControllerKey, keyval: number, _: number, mod: number) {
    switch (keyval) {
      case Gdk.KEY_Escape:
        win.hide()
        return
    }

    if (mod === Gdk.ModifierType.ALT_MASK) {
      for (const i of Array.from({ length: appList.get().length }, (_, i) => i + 1) as const) {
	  if (keyval === Gdk[`KEY_${i}`]) {
	    return launch(appList.get()[i - 1])
	  }
      }
    }
  }

  function SearchBox() {
    setAppList(Apps.exact_query(""))

    return (
      <entry
	$={self => searchBox = self}
	class="searchBox"
        onNotifyText={({ text }) => setAppList(Apps.exact_query(text))}
        placeholderText="..."
	hexpand
      />
    )
  }

  function AppButton({ app }: { app: AstalApps.Application }) {
    return (
      <button 
        class="appButton"
	onClicked={() => launch(app)}
      >
        <centerbox>
	  <image
	    $type="start"
	    iconName={app.iconName}
	    pixelSize={30}
	  />
	  <label $type="center" label={app.name} />
	</centerbox>
      </button>
    )
  }

  return (
    <window
      $={self => win = self}
      visible={false}
      name="Launcher"
      exclusivity={Astal.Exclusivity.IGNORE}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.EXCLUSIVE}
      application={App}
      onNotifyVisible={({ visible }) => {
        if (visible) {
          searchBox.grab_focus()
	  scrolled.set_vadjustment(null)
	} else searchBox.set_text("")
      }}
      defaultWidth={gdkmonitor.get_geometry().width * 0.4}
      defaultHeight={gdkmonitor.get_geometry().height * 0.35}
    >
      <Gtk.EventControllerKey onKeyPressed={onKey} />
      <box
	orientation={Gtk.Orientation.VERTICAL}
	spacing={5}
      >
        <box spacing={5}>
	  <label
	    class="searchIcon"
	    label=""
	    widthRequest={45}
	  />
          <SearchBox />
	</box>
	<scrolledwindow
	  $={self => scrolled = self}
	  vexpand
	>
	  <box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
	    <For each={appList}>{(app) => <AppButton app={app} />}</For>
	  </box>
	</scrolledwindow>
      </box>
    </window>
  )
}
