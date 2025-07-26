import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { With, createSettings } from "ags"
import { exec, execAsync } from "ags/process"
import AstalHyprland from "gi://AstalHyprland"
import Gio from "gi://Gio"

export default function Settings(gdkmonitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
  const Hyprland = AstalHyprland.get_default()

  const settings = createSettings(
    new Gio.Settings({ schemaId: "nordic-shell" }), {
    int: "i",
    bool: "b",
    string: "s",
  })

  return (
    <window
      visible={false}
      name="Settings"
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      layer={Astal.Layer.OVERLAY}
      application={app}
    >
      <box
        class="contentBox"
	widthRequest={gdkmonitor.get_geometry().width * 0.6}
	heightRequest={gdkmonitor.get_geometry().height * 0.6}
	halign={Gtk.Align.CENTER}
	valign={Gtk.Align.CENTER}
      >
        <box orientation={Gtk.Orientation.VERTICAL}>
	  <box hexpand>
	    <box hexpand halign={Gtk.Align.START}>
	      <With value={settings.int}>
	        {value => <label label={value.toString()} hexpand />}
	      </With>
	    </box>
	    <box hexpand halign={Gtk.Align.END} spacing={5}>
	      <button
		class="button"
		label="-"
		onClicked={() => {
		  settings.setInt((prev) => prev > 0 && prev - 1)
		  exec("hyprctl keyword general:gaps_out " + settings.int.get())
		}}
		widthRequest={40}
	      />
	      <button
		class="button"
		label="+"
		onClicked={() => {
		  settings.setInt((prev) => prev + 1)
		  exec("hyprctl keyword general:gaps_out " + settings.int.get())
		}}
		widthRequest={40}
	      />
	    </box>
	  </box>
	</box>
      </box>
    </window>
  )
}
