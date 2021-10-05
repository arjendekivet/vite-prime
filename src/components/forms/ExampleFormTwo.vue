<template>
  <div>
    <DynamicFormLayoutTwo
      v-for="config in formConfig"
      :config="config"
      :columns="2"
      data-type="examples"
      title="My Title"
    />
  </div>
</template>

<script setup lang="ts">
import DynamicFormLayoutTwo from '@/components/dynamic-form-layout/DynamicFormLayoutTwo.vue'
import Fieldconfig from '@/types/fieldconfig'
import formConfig from '@/data/FormLayoutOne'

</script>