import App from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widgets/Bar"
import Launcher from "./widgets/Launcher"
import Settings from "./widgets/Settings"

App.start({
  css: style,
  main() {
    App.get_monitors().map(Bar)
    App.get_monitors().map(Launcher)
    App.get_monitors().map(Settings)
  },
})
