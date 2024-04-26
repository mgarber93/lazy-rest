import {WindowSender} from './window-sender';

describe('WindowSender', () => {
  it('should send before sender', () => {
    const windowSender = new WindowSender();
    const spy = jest.fn();
    const argOne = 'load-oas';
    const argTwo = {}
    windowSender.send(argOne, argTwo);
    // expect spy to have been called with argOne argTwo
    windowSender.hasFinishedLoading(spy);
    expect(spy).toHaveBeenCalledWith(argOne, argTwo);
  });
  it('should send after sender', () => {
    const windowSender = new WindowSender();
    const spy = jest.fn();
    const argOne = 'load-oas';
    const argTwo = {}
    windowSender.hasFinishedLoading(spy);
    windowSender.send(argOne, argTwo);
    // expect spy to have been called with argOne argTwo
    expect(spy).toHaveBeenCalledWith(argOne, argTwo);
  });
  it('should resolve with the sent values before hasFinishedLoading has been called', async () => {
    const windowSender = new WindowSender();
    const argOne = 'load-oas';
    const argThree = {arg: 'hello world'}
    let sender = (...args: any[]) => {
      expect(args[0]).toEqual(argOne);
    };
    let resolve = (...args: any[]) => {
      expect(args[0]).toEqual(argThree);
      expect(windowSender['promiseMap'].size).toBe(0);
    }
    windowSender.asyncSend(argOne)
      .then(resolve);
    expect(windowSender['promiseMap'].size).toBe(1);
    windowSender.hasFinishedLoading(sender);
    const promiseMap = windowSender['promiseMap']
    const key = [...promiseMap.keys()][0];
    windowSender.callback(key, argThree);
    expect(windowSender['promiseMap'].size).toBe(0);
  });
  it('should resolve with the sent values after have finished loading has happened', async () => {
    debugger
    const windowSender = new WindowSender();
    const argOne = 'load-oas';
    const argThree = {arg: 'hello world'}
    let callback = (...args: any[]) => {
      expect(args[0]).toEqual(argOne);
      expect(typeof args[1]).toEqual("string");
    };
    let resolve = (...args: any[]) => {
      expect(args[0]).toEqual(argThree);
      expect(windowSender['promiseMap'].size).toBe(0);
    }
    windowSender.hasFinishedLoading(callback);
    windowSender.asyncSend(argOne)
      .then(resolve);
  });
});