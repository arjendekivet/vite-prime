<template>
  <DataTable :value="cars">
    <Column field="vin" header="Vin"></Column>
    <Column field="year" header="Year"></Column>
    <Column field="brand" header="Brand"></Column>
    <Column field="color" header="Color"></Column>
  </DataTable>

  <DataTable :value="events">
    <Column field="id" header="Id"></Column>
    <Column field="title" header="Title"></Column>
    <Column field="category" header="Category"></Column>
    <Column field="date" header="Date"></Column>
  </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EventService from './services/EventService'
import { Event, EventResponse } from './types/event'

const cars = ref([
  { "brand": "Volkswagen", "year": 2012, "color": "Orange", "vin": "dsad231ff" },
  { "brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345" },
  { "brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr" },
  { "brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh" },
  { "brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34" },
  { "brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj" },
  { "brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr" },
  { "brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34" },
  { "brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5" },
  { "brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s" }
])

const events = ref<Event[]>()
EventService.getEvents(false, 0)
  .then((response) => {
    events.value = response.data
  })
  .catch((error) => {
    console.log(error)
  })

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
