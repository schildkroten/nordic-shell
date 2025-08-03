import App from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { For, createSettings } from "ags"
import AstalHyprland from "gi://AstalHyprland"
import Gio from "gi://Gio"

export default function Settings(gdkmonitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
  const Hyprland = AstalHyprland.get_default()

  const settings = {
    general: createSettings(
      new Gio.Settings({ schemaId: "nordic-shell.hyprland.general" }),
      {
	"border-size": "i",
	"no-border-on-floating": "b",
	"gaps-in": "i",
	"gaps-out": "i",
	"float-gaps": "i",
	"gaps-workspaces": "i",
	"col-inactive-border": "s",
	"col-active-border": "s",
	"col-nogroup-border": "s",
	"col-nogroup-border-active": "s",
	"layout": "s",
	"no-focus-fallback": "b",
	"resize-on-border": "b",
	"extend-border-grab-area": "i",
	"hover-icon-on-border": "b",
	"allow-tearing": "b",
	"resize-corner": "i"
      }
    ),
    decoration: createSettings(
      new Gio.Settings({ schemaId: "nordic-shell.hyprland.decoration" }),
      {
	"rounding": "i",
	"rounding-power": "d",
	"active-opacity": "d",
	"inactive-opacity": "d",
	"fullscreen-opacity": "d",
	"dim-inactive": "b",
	"dim-strength": "d",
	"dim-special": "d",
	"dim-around": "d",
	"screen-shader": "s",
	"border-part-of-window": "b",
      }
    ),
  }

  const test = Object.freeze(settings.general)
  settings.general.setGapsOut(10)
  console.log(settings.general === test)

  async function apply() {
    Object.keys(settings).map(section => {
      Object.keys(settings[section])
        .filter(key => !key.includes("set"))
	  .map(key => {
	    const value = settings[section][key].get()
	    const setting = key.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/(col)_/g, "$1.").toLowerCase()

	    console.log(Hyprland.message(`keyword ${section}:${setting} ${value}`))
          })
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
	  label={setting}
        />
	<entry
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
	  label={setting}
        />
	<switch
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
	  vexpand
	>
	  <box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
	    {}
	  </box>
	</scrolledwindow>
	<scrolledwindow
	  vexpand
	>
	  <box>
	    {}
	  </box>
	</scrolledwindow>
      </box>
    </window>
  )
}
