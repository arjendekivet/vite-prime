import QuestionsTable from '@/components/tables/QuestionsTable.vue';

export default {
  title: 'Cynapps/Questions Table',
  components: { QuestionsTable },
  argTypes: {
    // hasSelection: { control: 'boolean' },
  },
};

const Template: any = (args: any) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { QuestionsTable },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<QuestionsTable v-bind="args" />',
});

// Not working yet !!!!
export const Primary = Template.bind({});
Primary.args = {};
