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
    <label>Email</label>
    <P_InputText type="text" v-model="fieldValues.email" />
    <label>Roles</label>
    <MultiSelect
      v-model="fieldValues.roles"
      :options="roles"
      optionLabel="label"
      placeholder="Select Roles"
      display="chip"
    />
    <label>Password</label>
    <Password v-model="fieldValues.password" toggleMask></Password>
  </div>
  <Toolbar class="p-mt-4">
    <template #left>
      <Button type="button" label="Sign Up" @click="submitForm()" icon="pi pi-check" />
    </template>
    <template #right>
      <Button
        type="button"
        label="Go To Login"
        @click="router.push({ name: 'signin' })"
        icon="pi pi-sign-in"
      />
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import router from '@/router/routes'
import EventService from '@/services/ApiService'
import { messages, addSubmitMessage, addErrorMessage } from '@/modules/UseFormMessages'
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
    email: undefined,
    roles: [],
  }
)

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Moderator', value: 'moderator' },
  { label: 'User', value: 'user' }
]

function removeMessage(id: number) {
  Utils.removeMessage(messages, id)
}

function submitForm() {
  const submitValue: any = { ...fieldValues.value }
  submitValue['roles'] = _.map(submitValue['roles'], (role) => role.value)

  EventService.postForm('auth/signup', submitValue)
    .then((response) => {
      addSubmitMessage()
      router.push({ name: 'signin' })
    })
    .catch((error) => {
      addErrorMessage(error)
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