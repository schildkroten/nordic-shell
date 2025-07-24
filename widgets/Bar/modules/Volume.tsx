import { Gtk } from "ags/gtk4"
import { createBinding } from "ags"
import AstalWp from "gi://AstalWp"

export default function Volume() {
  const Wp = AstalWp.get_default()
  const speaker = Wp.audio.default_speaker
  
  const volume = createBinding(speaker, "volume")
  const icon = createBinding(speaker, "volumeIcon")

  return (
    <box
      class="volume"
      spacing={10}
      hexpand={false}
    >
      <image
        class="icon"
	iconName={icon}
      />
      <slider
	value={volume}
	onChangeValue={({ value }) => speaker.set_volume(value)}
	hexpand
      />
    </box>
  )
}
