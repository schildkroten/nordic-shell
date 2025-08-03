import { Gtk } from "ags/gtk4"
import { For, createBinding, createComputed } from "ags"
import AstalHyprland from "gi://AstalHyprland"

export default function Workspaces({ length = 10 }) {
  const Hyprland = AstalHyprland.get_default()

  const workspaces = createBinding(Hyprland, "workspaces")
  const focusedWorkspace = createBinding(Hyprland, "focusedWorkspace")

  const fixedWorkspaces = workspaces(() =>
    Array.from(
      { length },
      (_, i) => Hyprland.get_workspace(i + 1) || AstalHyprland.Workspace.dummy(i + 1, null),
    ),
  )

  return (
    <box
      class="workspaces"
      widthRequest={300}
      hexpand={false}
    >
      <For each={length <= 0 ? workspace : fixedWorkspaces}>
	{workspace => {
	    const clients = createBinding(workspace, "clients")
	    return (
	      <button
		label={createComputed(
		  [focusedWorkspace, clients],
		  (focusedWorkspace, clients) =>
		    workspace === focusedWorkspace || clients.length > 0 ? "" : ""
		)}
		cssClasses={createComputed(
		  [focusedWorkspace, clients],
		  (focusedWorkspace, clients) => [
		    "workspaceButton",
		    ...(clients.length > 0 ? ["occupiedWorkspace"] : []),
		    ...(focusedWorkspace === workspace ? ["focusedWorkspace"] : []),
		  ]
		)}
		onClicked={workspace.focus}
		hexpand
	      />
	    )
	  }
	}
      </For>
    </box>
  )
}
