<template>
    <div class="test">
        <Avatar
            :image-url="logo"
            image-size="70%"
            color="blue"
            width="40em"
            label="VUE"
            font-size="1em"
            font-color="white"
            radius="30%"
            border-color="gray"
            border-width="0.2em"
        ></Avatar>
    </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import logo from '@/assets/logo.png'
</script>

<style scoped lang="scss">
.test {
    width: 100%;
    overflow: scroll;
}
</style>