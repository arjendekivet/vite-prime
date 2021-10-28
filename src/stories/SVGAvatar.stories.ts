import SVGAvatar from '@/components/SVGAvatar.vue';

export default {
  title: 'Cynapps/SVGAvatar',
  component: SVGAvatar,
  argTypes: {
    color: { control: 'color' },
    fontSize: { control: 'text' },
    fontColor: { control: 'text' }
  },
}

const Template: any = (args: any) => ({
  components: { SVGAvatar },
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<SVGAvatar v-bind="args" />',
})

export const Primary = Template.bind({});
Primary.args = {
  color: 'blue',
  width: '10em',
  label: 'Label'
}
