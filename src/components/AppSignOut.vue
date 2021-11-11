<template>
  <AppTopbar />
  <div class="form p-pt-2">
    <Message
      v-for="msg of messages"
      v-bind="msg"
      :key="msg.id"
      @close="removeMessage(msg.id)"
    >{{ msg.content }}</Message>
  </div>
  <Toolbar class="p-mt-4">
    <template #left>
      <Button
        type="button"
        label="Go to Sign In"
        @click="router.push({ name: 'signin' })"
        icon="pi pi-sign-in"
      />
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import router from '@/router/routes'
// import { setUser } from '@/modules/globalState'
// import Constants from '@/modules/constants'
import { messages, addSuccesMessage } from '@/modules/UseFormMessages'
import AppTopbar from '@/components/AppTopbar.vue'
import Utils from '@/modules/utils'
import _ from 'lodash'
import { onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onBeforeUnmount(() => {
  messages.value = []
})

// Utils.removeFromLocalStorage(Constants.LOCALSTORAGEUSERKEY)
// setUser(null)
store.dispatch('user/removeUser')
addSuccesMessage('You have been signed out ...')

setTimeout(() => router.push({ name: 'signin' }), 2000)

function removeMessage(id: number) {
  Utils.removeMessage(messages, id)
}
</script>

<style lang="scss" scoped>
.form {
  label {
    display: block;
    font-weight: 700;
    margin-top: 1em;
  }
}
</style>