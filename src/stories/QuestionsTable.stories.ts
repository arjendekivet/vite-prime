import Table from '@/components/Table.vue';
// import StoryBookApp from '@/stories/StorybookApp.vue';

export default {
  title: 'Cynapps/Questions Table',
  components: { Table },
  argTypes: {
    // hasSelection: { control: 'boolean' },
  },
};

const Template: any = (args: any) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { Table },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<Table v-bind="args" />'
  //template: '<StoryBookApp><Table v-bind="args" /></StoryBookApp>',
});

// Not working yet !!!!
export const Primary = Template.bind({});
Primary.args = {
  dataType: 'questions',
  title: 'Questions'
};
