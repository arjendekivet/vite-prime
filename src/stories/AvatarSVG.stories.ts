import AvatarSVG from '@/components/AvatarSVG.vue';

export default {
  title: 'Cynapps/Avatar/AvatarSVG',
  component: AvatarSVG,
  argTypes: {
    color: { control: 'color' },
    fontSize: { control: 'text' },
    fontColor: { control: 'text' }
  },
}

const Template: any = (args: any) => ({
  components: { AvatarSVG },
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<AvatarSVG v-bind="args" />',
})

export const Primary = Template.bind({});
Primary.args = {
  color: 'blue',
  width: '10em',
  label: 'Label'
}
