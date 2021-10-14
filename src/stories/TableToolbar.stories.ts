import TableToolbar from '@/components/TableToolbar.vue';

export default {
  title: 'Cynapps/TableToolbar',
  component: TableToolbar,
  argTypes: {
    hasSelection: { control: 'boolean' },
  },
};

const Template: any = (args: any) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { TableToolbar },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<TableToolbar v-bind="args" />',
});

export const Primary = Template.bind({});
Primary.args = {
  hasSelection: true,
};

export const Secondary = Template.bind({});
Secondary.args = {
  hasSelection: false,
};
