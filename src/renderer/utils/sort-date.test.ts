import {newestToOldest} from './sort-date'

describe('sort date', () => {
  it('should sort dates newest to oldest', () => {
    const dates = [
      'Sat Mar 23 2024 23:46:43 GMT-0400 (Eastern Daylight Time)',
      'Sun Mar 24 2024 00:07:23 GMT-0400 (Eastern Daylight Time)',
      'Sun Mar 24 2024 00:12:26 GMT-0400 (Eastern Daylight Time)',
      'Sun Mar 24 2024 00:17:46 GMT-0400 (Eastern Daylight Time)'
    ]
    const sorted = dates.sort(newestToOldest)
    expect(sorted).toStrictEqual([
      'Sun Mar 24 2024 00:17:46 GMT-0400 (Eastern Daylight Time)',
      'Sun Mar 24 2024 00:12:26 GMT-0400 (Eastern Daylight Time)',
      'Sun Mar 24 2024 00:07:23 GMT-0400 (Eastern Daylight Time)',
      'Sat Mar 23 2024 23:46:43 GMT-0400 (Eastern Daylight Time)',
    ])
  })
})