import App from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { For, createSettings } from "ags"
import AstalHyprland from "gi://AstalHyprland"
import GLib from "gi://GLib"
import Gio from "gi://Gio"

export default function Settings(gdkmonitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
  const Hyprland = AstalHyprland.get_default()

  const sections = {
    general: Gtk.ScrolledWindow,
    decoration: Gtk.ScrolledWindow,
  }

  const settings = {
    general: createSettings(
      new Gio.Settings({ schemaId: "nordic-shell.general" }),
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
      new Gio.Settings({ schemaId: "nordic-shell.decoration" }),
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

  function switchSection(section: string) {
    Object.keys(sections).map(section => {
      sections[section].visible = false
    })

    sections[section].visible = true
  }

  function Section({ section, ...props }: { section: string }) {
    return (
      <scrolledwindow $={self => sections[section] = self} visible={false} hexpand vexpand {...props}>
        <box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
	  {Object.keys(settings[section])
            .filter(key => !key.includes("set"))
	      .map(key => {
		const s = new Gio.Settings({ schemaId: `nordic-shell.${section}` })
		const setting = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()

		switch (typeof settings[section][key].get()) {
		  case "number":
		    const settingsSchemaKey = s.settingsSchema.get_key(setting)
		    const range = settingsSchemaKey.get_range().recursiveUnpack()

		    return (
		      <centerbox>
			<label $type="start" label={key} />
			<Gtk.SpinButton
			  $={self => s.bind(setting, self, "value", Gio.SettingsBindFlags.DEFAULT)}
			  $type="end"
			  digits={!Number.isInteger(settings[section][key].get()) ? 1 : 0}
			  widthChars={3}
			>
			  <Gtk.Adjustment
			    lower={range[0] === "range" ? range[1][0] : 0}
			    upper={range[0] === "range" ? range[1][1] : 100}
			    stepIncrement={!Number.isInteger(settings[section][key].get()) ? 0.1 : 1}
			  />
			</Gtk.SpinButton>
		      </centerbox>
		    )

		  case "string":
		    return (
		      <centerbox>
			<label $type="start" label={key} />
			<entry
			  $={self => s.bind(setting, self, "text", Gio.SettingsBindFlags.DEFAULT)}
			  $type="end"
			  class="entry"
			/>
		      </centerbox>
		    )
		  
		  case "boolean":
		    return (
		      <centerbox>
			<label $type="start" label={key} />
			<switch
			  $={self => s.bind(setting, self, "active", Gio.SettingsBindFlags.DEFAULT)}
			  $type="end"
			  class="switch"
			  widthRequest={50}
			  heightRequest={20}
			/>
		      </centerbox>
		    )

		  default:
		    return <label label={key} />
		}
	      })
	  }
	</box>
      </scrolledwindow>
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
     	<box orientation={Gtk.Orientation.VERTICAL} vexpand>
	  <button
	    label="general"
	    onCLicked={() => switchSection("general")}
	    valign={Gtk.Align.START}
	  />
	  <button
	    label="decoration"
	    onClicked={() => switchSection("decoration")}
	    valign={Gtk.Align.START}
	  />
	  <button
	    label="Apply"
	    onClicked={apply}
	    valign={Gtk.Align.END}
	    vexpand
	  />
	</box>
	<Section visible={true} section="general" />
	<Section section="decoration" />
      </box>
    </window>
  )
}
