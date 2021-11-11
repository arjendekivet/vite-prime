import { createStore, createLogger, Store } from "vuex"
import user from "@/store/modules/user"
import User from '@/types/user'

const debug = process.env.NODE_ENV !== "production"

interface State {
  user: User
}

const store: Store<State> = createStore({
  modules: {
    user,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})

export default store
