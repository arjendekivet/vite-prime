import Utils from '@/modules/utils'
import Constants from '@/modules/constants'
import User from '@/types/user'

type State = {
  user?: User
}

// initial state
const state: State = {
  user: undefined,
}

// getters
const getters = {
  getUser: (state: State) => {
    return state.user
  },
}

// actions
const actions = {
  getActiveUser({ commit }: any) {
    const lUser = Utils.getFromLocalStorage(Constants.LOCALSTORAGEUSERKEY)
    if (lUser) {
      commit("setUser", JSON.parse(lUser))
    }
  },
  updateUser({ commit }: any, user: User) {
    Utils.addToLocalStorage(Constants.LOCALSTORAGEUSERKEY, JSON.stringify(user))
    commit("setUser", user)
  },
  removeUser({ commit }: any) {
    Utils.removeFromLocalStorage(Constants.LOCALSTORAGEUSERKEY)
    commit("setUser", undefined)
  },
}

// mutations
const mutations = {
  setUser(state: State, user: User) {
    state.user = user
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
