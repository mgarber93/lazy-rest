import "reflect-metadata"
import {WindowSender} from './window-sender'
import {channelAllowList} from '../../window-callback/window-callback-api'

jest.mock('use-resize-observer', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
}))

describe('WindowSender', () => {
  it('should resolve with the sent values before hasFinishedLoading has been called', async () => {
    const windowSender = new WindowSender()
    const argOne = channelAllowList[1]
    const argThree = {arg: 'hello world'}
    const sender = (...args: any[]) => {
      expect(args[0]).toEqual(argOne)
    }
    const resolve = (...args: any[]) => {
      expect(args[0]).toEqual(argThree)
      expect(windowSender['promiseMap'].size).toBe(0)
    }
    windowSender.asyncSend(argOne)
      .then(resolve)
    expect(windowSender['promiseMap'].size).toBe(1)
    windowSender.hasFinishedLoading(sender)
    const promiseMap = windowSender['promiseMap']
    const key = [...promiseMap.keys()][0]
    windowSender.callback(key, argThree)
    expect(windowSender['promiseMap'].size).toBe(0)
  })
  it('should resolve with the sent values after have finished loading has happened', async () => {
    const windowSender = new WindowSender()
    const argOne = channelAllowList[1]
    const argThree = {arg: 'hello world'}
    const callback = (...args: any[]) => {
      expect(args[0]).toEqual(argOne)
      expect(typeof args[1]).toEqual("string")
    }
    const resolve = (...args: any[]) => {
      expect(args[0]).toEqual(argThree)
      expect(windowSender['promiseMap'].size).toBe(0)
    }
    windowSender.hasFinishedLoading(callback)
    windowSender.asyncSend(argOne)
      .then(resolve)
  })
})
