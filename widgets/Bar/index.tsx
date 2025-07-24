import app from "ags/gtk4/app"
import { Astal, Gdk } from "ags/gtk4"
import Workspaces from "./modules/Workspaces"
import TimeDate from "./modules/TimeDate"
import Volume from "./modules/Volume"
import Battery from "./modules/Battery"
import QuickSettings from "./modules/QuickSettings"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  function TopBar(gdkmonitor: Gdk.monitor) {
    return (
      <window
	visible
	name="TopBar"
	namespace="TopBar"
	gdkmonitor={gdkmonitor}
	exclusivity={Astal.Exclusivity.EXCLUSIVE}
	anchor={TOP | LEFT | RIGHT}
	layer={Astal.Layer.BACKGROUND}
      >
	<centerbox>
	  <Workspaces $type="start" />
	  <TimeDate $type="center" />
	  <box $type="end" spacing={5}>
	    <Volume />
	    <Battery />
	    <QuickSettings />
	  </box>
	</centerbox>
      </window>
    )
  }

  function BottomBar(gdkmonitor: Gdk.monitor) {
    return (
      <window
	visible
	name="BottomBar"
	namespace="BottomBar"
	gdkmonitor={gdkmonitor}
	exclusivity={Astal.Exclusivity.EXCLUSIVE}
	anchor={BOTTOM | LEFT | RIGHT}
	layer={Astal.Layer.BACKGROUND}
	defaultHeight={37}
      >
	<centerbox>
	</centerbox>
      </window>
    )
  }

  TopBar(gdkmonitor)
  BottomBar(gdkmonitor)
}
