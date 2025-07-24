import { Gtk } from "ags/gtk4"
import { createBinding } from "ags"
import AstalBattery from "gi://AstalBattery"

export default function Battery() {
  const Battery = AstalBattery.get_default()

  const charge = createBinding(Battery, "percentage")
  const icon = createBinding(Battery, "iconName")

  return (
    <box
      class="battery"
      spacing={10}
      hexpand={false}
    >
      <image
        class="icon"
        iconName={icon}
      />
      <slider
        value={charge}
	sensitive={false}
	hexpand
      />
    </box>
  )
}
