<template>
  <AppTopbar />
  <div class="form p-pt-2">
    <Message
      v-for="msg of messages"
      v-bind="msg"
      :key="msg.id"
      @close="removeMessage(msg.id)"
    >{{ msg.content }}</Message>
    <label>Username</label>
    <P_InputText type="text" v-model="fieldValues.username" />
    <label>Password</label>
    <Password
      v-model="fieldValues.password"
      :feedback="false"
      toggleMask
      v-on:keyup.enter="submitForm()"
    ></Password>
  </div>
  <Toolbar class="p-mt-4">
    <template #left>
      <Button type="button" label="Sign In" @click="submitForm()" icon="pi pi-check" />
    </template>
    <template #right>
      <Button
        type="button"
        label="Create Account"
        @click="router.push({ name: 'signup' })"
        icon="pi pi-user-plus"
      />
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import router from '@/router/routes'
import EventService from '@/services/ApiService'
import { setUser } from '@/modules/globalState'
import Constants from '@/modules/constants'
import { messages, addSuccesMessage, addErrorMessage } from '@/modules/UseFormMessages'
import AppTopbar from '@/components/AppTopbar.vue'
import Utils from '@/modules/utils'
import _ from 'lodash'

onBeforeUnmount(() => {
  messages.value = []
})

const fieldValues: any = ref(
  {
    username: undefined,
    password: undefined,
  }
)

function removeMessage(id: number) {
  Utils.removeMessage(messages, id)
}

function submitForm() {
  const submitValue: any = { ...fieldValues.value }

  EventService.postForm('auth/signin', submitValue)
    .then((response) => {
      if (response.data.accessToken) {
        Utils.addToLocalStorage(Constants.LOCALSTORAGEUSERKEY, JSON.stringify(response.data))
        setUser(response.data)
        addSuccesMessage('Successfully logged in ...')
        router.push({ name: 'home' })
      }
    })
    .catch((error) => {
      addErrorMessage(
        error.response && error.response.data && error.response.data.message
          ? error + " ==> " + error.response.data.message
          : error)
    })
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