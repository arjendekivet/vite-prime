<template>
  <DataTable :value="events">
    <Column field="id" header="Id"></Column>
    <Column field="title" header="Title" :sortable="true"></Column>
    <Column field="category" header="Category"></Column>
    <Column field="date" header="Date"></Column>
  </DataTable>
  <span>--{{ foo }}--</span>
  <Button @click="log"></Button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EventService from '@/services/EventService'
import { Event, EventResponse } from '@/types/event'

const props = defineProps({
  foo: { type: String, default: 'test' }
})

const emit = defineEmits<{
  (e: 'pipo', value: Record<'id', number>): void
}>()

function log() {
  emit('pipo', { id: 4 })
  console.log('called ....')
}

const events = ref<Event[]>()
EventService.getEvents(false, 0)
  .then((response) => {
    const names = response.data.map(function (item) {
      if (item.date && item.date !== '') {
        item.date = new Date(item.date).toLocaleDateString('nl-NL')
      }

      return item;
    });
    events.value = response.data
  })
  .catch((error) => {
    console.log(error)
  })

console.log(props.foo)
console.log(this)

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  & .test {
    color: red;
  }
}
.box {
  border: solid blue 1px;
}
</style>
