import {WindowSender} from './window-sender';
import {v4} from 'uuid';

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
    const argTwo = v4();
    const argThree = {arg: 'hello world'}
    let sender = (...args: any[]) => {
      expect(args[0]).toEqual(argOne);
      expect(args[1]).toEqual(argTwo);
    };
    let resolve = (...args: any[]) => {
      expect(args[0]).toEqual(argThree);
      expect(windowSender['promiseMap'].size).toBe(0);
    }
    windowSender.asyncSend(argOne, argTwo)
      .then(resolve);
    expect(windowSender['promiseMap'].size).toBe(1);
    windowSender.hasFinishedLoading(sender);
    windowSender.callback(argTwo, argThree);
    expect(windowSender['promiseMap'].size).toBe(0);
    // callback shouldn't have been called yet because there are no messages in queue
    // some async process goes on then invokes the callback
    // windowSender.callback(id, arg);
    // promise resolves
  });
  it('should resolve with the sent values after have finished loading has happened', async () => {
    const windowSender = new WindowSender();
    const argOne = 'load-oas';
    const argTwo = v4();
    const argThree = {arg: 'hello world'}
    let callback = (...args: any[]) => {
      expect(args[0]).toEqual(argOne);
      expect(args[1]).toEqual(argTwo);
    };
    let resolve = (...args: any[]) => {
      expect(args[0]).toEqual(argThree);
      expect(windowSender['promiseMap'].size).toBe(0);
    }
    windowSender.hasFinishedLoading(callback);
    windowSender.asyncSend(argOne, argTwo)
      .then(resolve);
    // callback shouldn't have been called yet because there are no messages in queue
    // some async process goes on then invokes the callback
    // windowSender.callback(id, arg);
    // promise resolves
  });
});