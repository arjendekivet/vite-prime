<template>
    <div class="wrapper" :style="compWrapperStyle">
        <div class="image-circle" :style="compCircleStyle"></div>
        <div class="center" :style="compTextStyle">{{ label }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'


type Props = {
    imageUrl?: string,
    imageSize?: string,
    borderColor?: string,
    borderWidth?: string,
    color?: string,
    width?: string,
    label?: string,
    fontSize?: string,
    fontColor?: string,
    radius?: string,
}

const props = withDefaults(defineProps<Props>(), {
    color: '#00CDA3',
    fontSize: '1.25em',
    fontColor: 'white',
})

const compCircleStyle = computed(() => {
    const arrStyle = []
    if (props.imageUrl) {
        arrStyle.push(`background-image: url(${props.imageUrl})`)
    }
    if (props.imageSize) {
        arrStyle.push(`background-size: ${props.imageSize}`)
    }
    if (props.color) {
        arrStyle.push(`background-color: ${props.color}`)
    }
    if (props.radius) {
        arrStyle.push(`border-radius: ${props.radius}`)
    }

    //borderWidth !!!!!!!!
    const borderColor = props.borderColor || props.color
    const borderWidth = props.borderWidth
    if (borderWidth) {
        arrStyle.push(`box-shadow: inset 0px 0px 0px ${borderWidth} ${borderColor}`)
        arrStyle.push(`-moz-box-shadow: inset 0px 0px 0px ${borderWidth} ${borderColor}`)
        arrStyle.push(`-webkit-box-shadow: inset 0px 0px 0px ${borderWidth} ${borderColor}`)
    }
    return arrStyle.join('; ')
})

const compWrapperStyle = computed(() => {
    const arrStyle = []
    if (props.width) {
        arrStyle.push(`max-width: ${props.width}`)
    }
    return arrStyle.join('; ')
})

const compTextStyle = computed(() => {
    const arrStyle = []
    if (props.fontSize) {
        arrStyle.push(`font-size: ${props.fontSize}`)
    }
    if (props.fontColor) {
        arrStyle.push(`color: ${props.fontColor}`)
    }
    return arrStyle.join('; ')
})
</script>

<style lang="scss" scoped>
.image-circle {
    width: 100%;
    padding-top: 100%;
    background-size: cover;
    background-position-x: center;
    background-position-y: center;
    background-repeat: no-repeat;
    border-radius: 50%;
}
.wrapper {
    position: relative;
}

.center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    color: white;
    font-size: 6em;
    overflow: hidden;
    font-weight: 600;
    transform: translate(-50%, -50%);
}
</style>