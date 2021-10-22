import Utils from '@/modules/utils'
import Constants from '@/modules/constants'
import User from '@/types/user'

export default function authHeader() {
  const storageItem = Utils.getFromLocalStorage(Constants.LOCALSTORAGEUSERKEY)
  if (storageItem) {
    const user: User = JSON.parse(storageItem)
    if (user && user.accessToken) {
      // for Node.js Express back-end
      return { "x-access-token": user.accessToken };
    }
  }
  return {}
}
