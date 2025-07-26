import { Gtk } from "ags/gtk4"
import { createBinding, With } from "ags"
import AstalBattery from "gi://AstalBattery"

export default function Battery() {
  const Battery = AstalBattery.get_default()

  return (
    <box
      class="battery"
      spacing={10}
    >
      <image
        class="icon"
        iconName={createBinding(Battery, "batteryIconName")}
      />
      <slider
        value={createBinding(Battery, "percentage")}
	sensitive={false}
      />
    </box>
  )
}
