import {WindowSender} from './window-sender';
import {v4} from 'uuid';

describe('WindowSender', () => {
  it('should resolve with the sent values before hasFinishedLoading has been called', async () => {
    const windowSender = new WindowSender();
    const argOne = 'load-oas';
    const argTwo = v4();
    const argThree = {arg: 'hello world'}
    let callback = (...args: any[]) => {
      expect(args[0]).toEqual(argOne);
      expect(args[1]).toEqual(argTwo);
      expect(args[2]).toEqual(argThree);
    };
    windowSender.asyncSend(argOne, argTwo, argThree)
      .then(callback);
    expect(windowSender['promiseMap'].size).toBe(1);
    windowSender.hasFinishedLoading(callback);
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
      expect(args[2]).toEqual(argThree);
    };
    windowSender.hasFinishedLoading(callback);
    windowSender.asyncSend(argOne, argTwo, argThree)
      .then(callback);
    expect(windowSender['promiseMap'].size).toBe(1);
    // callback shouldn't have been called yet because there are no messages in queue
    // some async process goes on then invokes the callback
    // windowSender.callback(id, arg);
    // promise resolves
  });
});