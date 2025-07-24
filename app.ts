import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widgets/Bar"
import Launcher from "./widgets/Launcher"
import Settings from "./widgets/Settings"

app.start({
  css: style,
  main() {
    app.get_monitors().map(Bar)
    app.get_monitors().map(Launcher)
    app.get_monitors().map(Settings)
  },
})
