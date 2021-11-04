import AvatarSVGText from '@/components/AvatarSVGText.vue';

export default {
  title: 'Cynapps/Avatar/AvatarSVGText',
  component: AvatarSVGText,
  argTypes: {
    color: { control: 'color' },
    fontSize: { control: 'text' },
    fontColor: { control: 'text' }
  },
}

const Template: any = (args: any) => ({
  components: { AvatarSVGText },
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<AvatarSVGText v-bind="args" />',
})

export const Primary = Template.bind({});
Primary.args = {
  color: 'blue',
  width: '10em',
  label: 'Label'
}
