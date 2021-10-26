import Table from '@/components/Table.vue';
// import StoryBookApp from '@/stories/StorybookApp.vue';

const tableData = [{ "_id": "614205906985e00ec0cdb9c7", "title": "Gijs 01", "type": "open", "description": "Gijs 01-2-3-4-5", "created": "2021-09-15T14:39:12.004Z", "created_at": "2021-09-15T14:39:12.006Z", "updated_at": "2021-10-21T21:12:18.874Z", "__v": 9, "cat_1": "DE", "due": "2021-10-13T22:00:00.000Z", "answer": "My answer", "cat_3": null }, { "_id": "6148453e3a86ae3466fa2759", "title": "het pak", "type": "open", "answer": "der Anzug", "created_at": "2021-09-20T08:24:30.618Z", "updated_at": "2021-09-21T21:06:48.694Z", "__v": 4, "cat_1": "DE", "cat_2": "Ch-5", "cat_3": "G", "description": "het pak" }]

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
  title: 'Questions',
  tableData: tableData
};
