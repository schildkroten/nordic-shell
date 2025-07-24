import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createSettings } from "ags"
import Gio from "gi://Gio?version=2.0"

export default function Settings(gdkmonitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

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
      </box>
    </window>
  )
}
