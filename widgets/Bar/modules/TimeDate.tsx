import { Gtk } from "ags/gtk4"
import { createPoll } from "ags/time"
import GLib from "gi://GLib"

export default function TimeDate() {
  const time = createPoll("", 1000, () => {
    return GLib.DateTime.new_now_local().format("%H:%M")
  })

  const date = createPoll("", 1000, () => {
    return GLib.DateTime.new_now_local().format("%a %b %d")
  })

  return (
    <box spacing={5}>
      <box
        class="time"
	widthRequest={175}
	spacing={10}
	hexpand={false}
      >
        <image
	  class="icon"
	  iconName="clock-app-symbolic"
	  halign={Gtk.Align.END}
	  hexpand
	/>
	<label
	  label={time}
	  halign={Gtk.Align.START}
	  hexpand
	/>
      </box>
      <box
        class="date"
	widthRequest={175}
	spacing={10}
	hexpand={false}
      >
        <image
	  class="icon"
	  iconName="text-calendar-symbolic"
	  halign={Gtk.Align.END}
	  hexpand
	/>
        <label
	  label={date}
	  halign={Gtk.Align.START}
	  hexpand
	/>
      </box>
    </box>
  )
}
