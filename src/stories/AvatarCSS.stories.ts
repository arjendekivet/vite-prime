import AvatarCSS from '@/components/Avatar.vue';

export default {
  title: 'Cynapps/Avatar/AvatarCSS',
  component: AvatarCSS,
  argTypes: {
    color: { control: 'color' },
    fontSize: { control: 'text' },
    fontColor: { control: 'text' },
    imageSize: { control: 'text' },
    borderColor: { control: 'color' },
    radius: { control: 'text' },
    borderWidth: { control: 'text' },
  },
}

const Template: any = (args: any) => ({
  components: { AvatarCSS },
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<AvatarCSS v-bind="args" />',
})

export const Primary = Template.bind({});
Primary.args = {
  imageUrl: 'https://i.pinimg.com/474x/7e/79/1d/7e791da660ab1d2c7b2f5c4039d4d54c.jpg',
  imageSize: 'cover',
  color: 'blue',
  maxWidth: '20em',
  label: 'HP',
  fontSize: '6em',
  fontColor: 'blue',
  borderWidth: '0em',
}

export const Secundary = Template.bind({});
Secundary.args = {
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/512px-Vue.js_Logo_2.svg.png',
  imageSize: '70%',
  color: 'blue',
  maxWidth: '30em',
  label: 'VUE',
  fontSize: '3em',
  fontColor: 'white',
  radius: '20%',
  borderColor: 'gray',
  borderWidth: '1em',
}
