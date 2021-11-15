// @ts-check
import { ref } from 'vue'
import User from '@/types/user'

const user = ref<User | null>()
const navVisible = ref(true)

const setUser = (pUser: User | null) => {
    user.value = pUser
}

const getUser = () => {
    return user.value
}

const setNavVisible = (bln: boolean) => {
    navVisible.value = bln
}

const toggleNavVisible = () => {
    navVisible.value = !navVisible.value
}

const getNavVisible = () => {
    return navVisible.value
}

export { getUser, setUser, setNavVisible, toggleNavVisible, getNavVisible }
