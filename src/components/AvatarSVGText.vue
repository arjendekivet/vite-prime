<template>
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" :style="svgStyle">
        <circle cx="50" cy="50" r="50" :fill="color" />
        <text
            x="50%"
            y="50%"
            text-anchor="middle"
            :fill="fontColor"
            :font-size="fontSize"
            font-weight="600"
            font-family="Arial"
            dy=".3em"
        >{{ label }}</text>
    </svg>
</template>

<script setup lang="ts">
type Props = {
    color?: string,
    width?: string,
    label?: string,
    fontSize?: string,
    fontColor?: string
}

const props = withDefaults(defineProps<Props>(), {
    color: '#00CDA3',
    width: '10em',
    fontSize: '1.25em',
    fontColor: 'white'
})

const svgStyle: any = `max-width: ${props.width}`
</script>

<style lang="scss" scoped>
svg {
    width: 100%;
}
</style>