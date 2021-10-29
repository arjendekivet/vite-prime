<template>
    <div class="test">
        <div>
            <Avatar
                :image-url="harry"
                color="blue"
                width="20em"
                label="HP"
                font-size="5em"
                font-color="white"
                radius="30%"
                border-color="gray"
                border-width="0.2em"
            ></Avatar>
        </div>
        <div class="inline">
            <Avatar
                :image-url="harry"
                color="#007bff"
                width="36px"
                label="HP"
                font-size=".75em"
                font-color="white"
                radius="10%"
                border-color="gray"
                border-width="0em"
                :inline="true"
            ></Avatar>
            <Avatar
                :image-url="Arjen"
                color="#007bff"
                width="36px"
                font-size=".75em"
                font-color="white"
                radius="10%"
                border-color="gray"
                border-width="0em"
                :inline="true"
            ></Avatar>
            <Avatar
                color="#007bff"
                width="36px"
                label="AK"
                font-size=".75em"
                font-color="white"
                radius="10%"
                border-color="gray"
                border-width="0em"
                :inline="true"
            ></Avatar>
            <Avatar
                :image-url="logo"
                image-size="70%"
                color="#007bff"
                width="36px"
                radius="10%"
                :inline="true"
            ></Avatar>
        </div>
        <div>
            <Avatar
                :image-url="logo"
                image-size="70%"
                color="#007bff"
                width="10em"
                radius="10%"
                :inline="true"
            ></Avatar>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import harry from '@/assets/harry.jpeg'
import Arjen from '@/assets/Arjen.jpg'
import logo from '@/assets/logo.png'
</script>

<style scoped lang="scss">
.test {
    // width: 100%;
    > div {
        border: solid black 1px;
    }
}
.inline {
    div {
        margin: 0.25em;
    }
}
</style>