import DynamicForm from '@/components/form/Form.vue';
import OptionType from '@/types/Option'
import QuestionType from '@/enums/questionTypes'

export default {
  title: 'Cynapps/DynamicForm',
  components: { DynamicForm },
  argTypes: {
    // hasSelection: { control: 'boolean' },
  },
};

const Template: any = (args: any) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { DynamicForm },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<div><DynamicForm v-bind="args" /></div>',
});

const catOne: OptionType[] = [
  { label: 'Duits', value: 'DE' },
  { label: 'Engels', value: 'EN' },
  { label: 'Frans', value: 'FR' },
];

const catTwo: OptionType[] = [
  { label: 'Chapter one', value: 'Ch-1' },
  { label: 'Chapter two', value: 'Ch-2' },
  { label: 'Chapter five', value: 'Ch-5' },
];

const catThree: OptionType[] = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'D', value: 'D' },
  { label: 'F', value: 'F' },
  { label: 'G', value: 'G' },
];

const fields =
  [
    {
      id: '_id',
      isField: true,
      label: 'Id',
      type: 'P_InputText',
      disabled: true,
      icon: { type: 'right', name: 'pi-lock' }
    },
    {
      id: 'title',
      isField: true,
      label: 'Title',
      type: 'P_InputText',
      placeholder: 'Title',
      validators: ['required'],
      icon: { type: 'right', name: 'pi-bookmark' }
    },
    {
      id: 'type',
      isField: true,
      label: 'Question type',
      type: 'P_Dropdown',
      options: QuestionType,
      optionLabel: "label",
      optionValue: "value",
      validators: ['required'],
      icon: { type: 'left', name: 'pi-bookmark' },
      defaultValue: 'open'
    },
    {
      id: 'cat_1',
      isField: true,
      label: 'Category 1',
      type: 'P_Dropdown',
      options: catOne,
      optionLabel: "label",
      optionValue: "value",
      editable: true,
      validators: ['required'],
      dependantFields: ['cat_2'],
    },
    {
      id: 'cat_2',
      isField: true,
      label: 'Category 2',
      type: 'P_Dropdown',
      options: catTwo,
      optionLabel: "label",
      optionValue: "value",
      editable: true,
      dependantFields: ['cat_3'],
    },
    {
      id: 'cat_3',
      isField: true,
      label: 'Category 3',
      type: 'P_Dropdown',
      options: catThree,
      optionLabel: "label",
      optionValue: "value",
      editable: true,
    },
    {
      id: 'due',
      isField: true,
      label: 'Due on',
      type: 'Calendar',
      showIcon: true,
    },
    {
      id: 'description',
      isField: true,
      label: 'Description',
      type: 'P_Textarea',
      placeholder: 'Description',
      maxColumns: 1
    },
    {
      id: 'answer',
      isField: true,
      label: 'Answer',
      type: 'P_Textarea',
      placeholder: 'Answer',
      maxColumns: 1
    }
  ]

export const Primary = Template.bind({});
Primary.args = {
  config: fields,
  dataType: "questions",
  columns: 2,
  title: "Question",
  //id:"id"
  readOnly: false
};
