import App from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { For, createSettings } from "ags"
import AstalHyprland from "gi://AstalHyprland"
import Gio from "gi://Gio"

export default function Settings(gdkmonitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
  const Hyprland = AstalHyprland.get_default()

  const sections = {
    general: Gtk.ScrolledWindow,
    decoration: Gtk.ScrolledWindow,
    animations: Gtk.ScrolledWindow,
    input: Gtk.ScrolledWindow,
    gestures: Gtk.ScrolledWindow,
    group: Gtk.ScrolledWindow,
    misc: Gtk.ScrolledWindow,
  }

  const s = new Gio.Settings({ schemaId: "nordic-shell" }) 
  const settings = createSettings(s, {
    "general-border-size": "i",
    "general-no-border-on-floating": "b",
    "general-gaps-in": "i",
    "general-gaps-out": "i",
    "general-float-gaps": "i",
    "general-gaps-workspaces": "i",
    "general-col-inactive-border": "s",
    "general-col-active-border": "s",
    "general-col-nogroup-border": "s",
    "general-col-nogroup-border-active": "s",
    "general-layout": "s",
    "general-no-focus-fallback": "b",
    "general-resize-on-border": "b",
    "general-extend-border-grab-area": "i",
    "general-hover-icon-on-border": "b",
    "general-allow-tearing": "b",
    "general-resize-corner": "i",
  })

  async function apply() {
    Object.keys(settings)
      .filter(key => !key.includes("set"))
        .map((key, index) => {
	  const value = settings[key as keyof s].get()
	  const name = key
            .replace(/([a-z])([A-Z])/g, "$1_$2")
              .replace("_", ":")
	        .replace(/(Col)_/, "$1.")
	          .toLowerCase()

	  console.log(`message: 'keyword ${name} ${value}' sent to Hyprland`)
	  console.log(Hyprland.message(`keyword ${name} ${value}`))
    })
  }

  function StringSetting({ setting }: { setting: string }) {
    return (
      <centerbox
        class="settingBox"
        valign={Gtk.Align.CENTER}
	hexpand
      >
        <label
	  $type="start"
	  label={
	    setting.replace(/-/g, " ")
	      .replace(/^\s*\S+\s*/, '')
	        .replace(/(col) /, "$1.")
	  }
        />
	<entry
	  $={self => {
	    s.bind(
	      setting,
	      self,
	      "text",
	      Gio.SettingsBindFlags.DEFAULT
	    )
	  }}
	  $type="end"
	/>
      </centerbox>
    )
  }

  function BooleanSetting({ setting }: { setting: string }) {
    return (
      <centerbox
        class="settingBox"
        valign={Gtk.Align.CENTER}
	hexpand
      >
        <label
	  $type="start"
	  label={
	    setting.replace(/-/g, " ")
	      .replace(/^\s*\S+\s*/, '')}
        />
	<switch
	  $={self => {
	    s.bind(
	      setting,
	      self,
	      "active",
	      Gio.SettingsBindFlags.DEFAULT
	    )
	  }}
	  $type="end"
	  class="switch"
	  widthRequest={50}
	  heightRequest={20}
	/>
      </centerbox>
    )
  }

  apply()

  return (
    <window
      visible={false}
      name="Settings"
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.EXCLUSIVE}
      application={App}
    >
      <box
        class="contentBox"
	widthRequest={gdkmonitor.get_geometry().width * 0.6}
	heightRequest={gdkmonitor.get_geometry().height * 0.6}
	halign={Gtk.Align.CENTER}
	valign={Gtk.Align.CENTER}
      >
        <scrolledwindow
	  $={self => sections.general = self}
	  vexpand
	>
	  <box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
	    {Object.keys(settings)
	      .filter(key => !key.includes("set"))
		.map((key, index) => {
		  const setting = key.replace(/([A-Z])/g, "-$1").toLowerCase()

		  switch (typeof settings[key as keyof s].get()) {
		    case 'number':
		      return <label label={setting} />

		    case 'string':
		      return <StringSetting setting={setting} />

		    case 'boolean':
		      return <BooleanSetting setting={setting} />
		  }
		})
	    }
	  </box>
	</scrolledwindow>
      </box>
    </window>
  )
}
