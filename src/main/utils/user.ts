import {userInfo} from 'os'

export async function getUser() {
  return userInfo()?.username
}