<template>
  <div>
    <JsonEditor v-model:modelValue="json" :readOnly="false"></JsonEditor>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const json = ref({})

json.value = {
  name: 'Taras',
  age: 28,
  address: [
    'Ukraine',
    {
      city: 'Kharkiv',
    },
  ],
  others: {
    id: 1246,
    time: new Date(),
    description: 'last example run',
  },
}

</script>

<style lang="scss">
.dynamicformlayout {
  textarea {
    resize: none;
  }

  .pi {
    z-index: 1;
  }

  .p-field > label {
    margin-left: 0.25rem;
  }
}
</style>