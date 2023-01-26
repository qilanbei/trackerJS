/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key 点击事件上报
 * @sdkVersionsdk版本
 * @extra透传字段
 * @jsError js 和 promise 报错异常上报
 */
export interface DefaultOptions {
  uuid: string | undefined
  requestUrl: string | undefined
  historyTracker: boolean
  hashTracker: boolean
  domTracker: boolean
  sdkVersion: string | number
  extra: Record<string, any> | undefined
  jsError: boolean
}

// 版本
export enum TrackerConfig {
  version = "1.0.0",
}

// 挑选出来一个类型参数必传，其余都通过 Partial  改成可选了
export interface Options extends Partial<DefaultOptions> {
  requestUrl: string
}
