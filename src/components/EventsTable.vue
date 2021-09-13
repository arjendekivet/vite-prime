<template>
    <DataTable :value="events" v-model:selection="selectedEvents" data-key="id">
        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
        <Column field="id" header="Id"></Column>
        <Column field="title" header="Title" :sortable="true"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="date" header="Date"></Column>
    </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EventService from '@/services/EventService'
import { Event, EventResponse } from '@/types/event'

const events = ref<Event[]>()
const selectedEvents = ref<Event[]>();

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

</script>