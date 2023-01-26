import { DefaultOptions, TrackerConfig, Options } from "../types/index"
import { createHistoryEvent } from "../utils/pv"

const mouseEventList: string[] = [
  "click",
  "dblclick",
  "contextmenu",
  "mousedown",
  "mouseup",
  "mouseenter",
  "mouseout",
  "mouseover",
]

export default class Tracker {
  public data: Options
  constructor(options: Options) {
    this.data = Object.assign(this.initDef(), options)
    this.installTracker()
  }

  private initDef(): DefaultOptions {
    // 重写浏览器   方法：
    window.history["pushState"] = createHistoryEvent("pushState")
    window.history["replaceState"] = createHistoryEvent("replaceState")
    return <DefaultOptions>{
      sdkVersion: TrackerConfig.version,
      // 默认不开启
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
    }
  }

  // setUserId setExtra 暴露给外部使用的api 设置用户uid
  public setUserId<T extends DefaultOptions["uuid"]>(uuid: T) {
    this.data.uuid = uuid
  }

  public setExtra<T extends DefaultOptions["extra"]>(extra: T) {
    this.data.extra = extra
  }

  // 时间捕获器
  private captureEvents<T>(
    mouseEventList: string[],
    targetKey: string, // 后端自定义
    data?: T
  ) {
    mouseEventList.forEach((event) => {
      window.addEventListener(event, () => {
        console.log(event, "addEventListener")
        this.reportTracker({
          event,
          targetKey,
          data,
        })
      })
    })
  }

  // dom 上报
  private targetKeyReport() {
    mouseEventList.forEach((event) => {
      window.addEventListener(event, (e) => {
        const target = e.target as HTMLElement
        const targetKey = target.getAttribute("target-key")
        if (targetKey) {
          this.reportTracker({
            event,
            targetKey,
          })
        }
      })
    })
  }

  private jsError() {
    this.errorReport()
    this.promiseErrorReport()
  }

  // js error 上报
  private errorReport() {
    console.log("errorReport")
    window.addEventListener(
      "error",
      (event) => {
        console.log("addEventListener error", event)

        this.reportTracker({
          eventType: "error",
          targetKey: "message",
          message: event.message,
        })
      },
      true
    )
  }

  // promise error 上报
  private promiseErrorReport() {
    window.addEventListener("unhandledrejection", (event) => {
      event.promise.catch((error) => {
        this.reportTracker({
          eventType: "promise",
          targetKey: "message",
          message: error,
        })
      })
    })
  }

  private installTracker() {
    if (this.data.historyTracker) {
      this.captureEvents(
        ["pushState", "replaceState", "popState", "back"],
        "history-pv"
      )
    }
    if (this.data.hashTracker) {
      this.captureEvents(["hashChange"], "history-uv")
    }
    if (this.data.domTracker) {
      this.targetKeyReport()
    }
    if (this.data.jsError) {
      this.jsError()
    }
  }

  // 手动上报
  public sendTracker<T>(data: T) {
    this.reportTracker(data)
  }

  // 上报 使用 navigator.sendBeacon 即使页面关闭 也能完成上报
  private reportTracker<T>(data: T) {
    const params = Object.assign(this.data, data, {
      time: new Date().getTime(),
    })
    const headers = {
      type: "application/x-www-form-urlencoded",
    }
    const blob = new Blob([JSON.stringify(params)], headers)
    // sendBeacon 不能接收 json 格式，所以传 Blob
    navigator.sendBeacon(this.data.requestUrl, blob)
  }
}
