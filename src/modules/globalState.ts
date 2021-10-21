// @ts-check
import { ref } from 'vue'
import User from '@/types/user'

const user = ref<User | null>()

const setUser = (pUser: User | null) => {
    user.value = pUser
}

const getUser = () => {
    return user.value
}

export { getUser, setUser }
