/*
 * @Description: pageView 监听 用户每次访问的记录
 * @Author: your name
 * @Date: 2022-09-26 14:51:29
 * @LastEditors: your name
 * @LastEditTime: 2022-09-26 14:58:11
 */
export const createHistoryEvent = <T extends keyof History>(type: T) => {

  const origin = history[type]

  return function (this: any) {
    const res = origin.apply(this, arguments)

    // Event 创建一个自定义事件
    // dispatchEvent 派发事件
    // addEventListener 监听事件
    // removeEventListener 删除事件
    const e = new Event(type)

    window.dispatchEvent(e)

    return res
  }
}

createHistoryEvent('pushState')