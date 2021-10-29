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

const InlineTemplate: any = (args: any) => ({
  components: { AvatarCSS },
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<AvatarCSS v-bind="args" /><AvatarCSS v-bind="args" /><AvatarCSS v-bind="args" />',
})

export const Primary = Template.bind({});
Primary.args = {
  imageUrl: '/harry.jpeg',
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
  imageUrl: '/logo.png',
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

export const Inline = InlineTemplate.bind({});
Inline.args = {
  inline: true,
  imageUrl: '/harry.jpeg',
  imageSize: 'cover',
  color: 'blue',
  width: '80px',
  fontSize: '1em',
  fontColor: 'blue',
  borderWidth: '0em',
}
