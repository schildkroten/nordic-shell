import { Gtk } from "ags/gtk4"
import { For, createBinding, createComputed } from "ags"
import AstalHyprland from "gi://AstalHyprland"

export default function Workspaces({ length = 10 }) {
  const Hyprland = AstalHyprland.get_default()

  const workspaces = createBinding(Hyprland, "workspaces")

  const fixed = workspaces(() =>
    Array.from(
      { length },
      (_, i) => Hyprland.get_workspace(i + 1) || AstalHyprland.Workspace.dummy(i + 1, null),
    ),
  )

  function WorkspaceButton({ ws }: { ws: AstalHyprland.Workspace }) {
    const fws = createBinding(Hyprland, "focusedWorkspace")
    const clients = createBinding(ws, "clients")

    const icon = createComputed(
      [fws, clients],
      (fws, clients) =>
        ws === fws || clients.length > 0 ? "" : ""
    )

    const classes = createComputed(
      [fws, clients],
      (fws, clients) => [
	"workspaceButton",
	...(clients.length > 0 ? ["occupiedWorkspace"] : []),
	...(fws === ws ? ["focusedWorkspace"] : []),
      ]
    )

    return (
      <button
        label={icon}
        cssClasses={classes}
	onClicked={() => ws.focus()}
	halign={Gtk.Align.CENTER}
	valign={Gtk.Align.CENTER}
	hexpand
      />
    )
  }

  return (
    <box
      class="workspaces"
      widthRequest={300}
      hexpand={false}
    >
      <For each={length <= 0 ? workspace : fixed}>
	{ws => <WorkspaceButton ws={ws} />}
      </For>
    </box>
  )
}
