import { Gtk } from "ags/gtk4"
import { createBinding, createComputed } from "ags"
import AstalWp from "gi://AstalWp"

export default function QuickSettings() {
  const Wp = AstalWp.get_default()
  const speaker = Wp.audio.default_speaker
  const mic = Wp.audio.default_microphone

  const speakerVolume = createBinding(speaker, "volume")
  const speakerMute = createBinding(speaker, "mute")

  const speakerIcon = createComputed(
    [speakerVolume, speakerMute],
    (volume, mute) =>
      mute || volume === 0 ? "󰝟" : "󰕾"
  )

  const micVolume = createBinding(mic, "volume")
  const micMute = createBinding(mic, "mute")

  const micIcon = createComputed(
    [micVolume, micMute],
    (volume, mute) =>
      mute || volume === 0 ? "󰍭" : "󰍬"
  )

  return (
    <menubutton
      class="quickSettings"
      widthRequest={40}
    >
      <label
        class="icon"
	label=""
      />
      <popover>
        <box
	  class="quickSettingsWindow"
	  widthRequest={350}
	  heightRequest={200}
	  spacing={10}
	>
	  <box
	    class="bar"
	    orientation={Gtk.Orientation.VERTICAL}
	    widthRequest={30}
	    vexpand={false}
	  >
	    <slider
	      value={speakerVolume}
	      orientation={Gtk.Orientation.VERTICAL}
	      inverted
	      onChangeValue={({ value }) => speaker.set_volume(value)}
	      valign={Gtk.Align.END}
	      vexpand
	    />
	    <button
	      class="volumeButton"
	      label={speakerIcon}
	      onClicked={() => speaker.set_mute(!speaker.get_mute())}
	      valign={Gtk.Align.CENTER}
	      vexpand
	    />
	  </box>
	  <box
	    class="bar"
	    orientation={Gtk.Orientation.VERTICAL}
	    widthRequest={30}
	    vexpand={false}
	  >
	    <slider
	      value={micVolume}
	      orientation={Gtk.Orientation.VERTICAL}
	      inverted
	      onChangeValue={({ value }) => mic.set_volume(value)}
	      valign={Gtk.Align.END}
	      vexpand
	    />
	    <button
	      class="volumeButton"
	      label={micIcon}
	      onClicked={() => mic.set_mute(!mic.get_mute())}
	      valign={Gtk.Align.CENTER}
	      vexpand
	    />
	  </box>
	</box>
      </popover>
    </menubutton>
  )
}
