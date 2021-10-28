import SVGComponent from '@/components/SVGComponent.vue';

export default {
  title: 'Cynapps/SVGComponent',
  component: SVGComponent,
  argTypes: {
    color: { control: 'color' },
    fontSize: { control: 'text' },
    fontColor: { control: 'text' }
  },
}

const Template: any = (args: any) => ({
  components: { SVGComponent },
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<SVGComponent v-bind="args" />',
})

export const Primary = Template.bind({});
Primary.args = {
  color: 'blue',
  width: '10em',
  label: 'Label'
}
