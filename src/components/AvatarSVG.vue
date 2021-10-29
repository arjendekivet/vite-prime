<template>
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <svg x="0">
            <circle cx="50" cy="50" r="50" fill="darkorange" />
        </svg>
        <svg x="15" y="15">
            <defs>
                <clipPath id="myCircle">
                    <circle cx="35" cy="35" r="35" fill="green" />
                </clipPath>
            </defs>
            <image :xlink:href="logo" clip-path="url(#myCircle)" style="width: 100%" />
        </svg>
    </svg>

    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <svg x="0">
            <circle cx="50" cy="50" r="50" class="myCircle" />
        </svg>
        <svg>
            <defs>
                <clipPath id="myCircle2">
                    <circle cx="50" cy="50" r="50" />
                </clipPath>
            </defs>
            <image
                x="20"
                y="20"
                :xlink:href="logo"
                clip-path="url(#myCircle2)"
                style="width: 60; height: 60"
                background-color="#FFF"
            />
        </svg>
    </svg>
</template>

<script setup lang="ts">
import logo from '@/assets/arjen.jpg'

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

.myCircle {
    fill: orange;
    stroke: red;
    stroke-width: 5;
}
</style>