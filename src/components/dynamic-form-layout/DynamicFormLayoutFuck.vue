<template>
  <div class="dynamicformlayout">
    <h3 v-if="title">{{ title }}</h3>
    <transition-group name="p-message" tag="div">
      <Message
        v-for="msg of messages"
        v-bind=msg 
        :key="msg.id" 
        @close="Utils.removeMessage(messages, msg.id)"
      >{{ msg.content }}</Message>
    </transition-group>

    <p>hard coded tabpanel</p>
      <!-- <div class="card">
        <h5>Default</h5>
        <TabView ref="tabview1">
      <TabPanel header="Header I">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </TabPanel>
      <TabPanel header="Header II">
        <Accordion :activeIndex="0">
          <AccordionTab header="Header I">
            <InputText id="100" placeholder="InputText test 1 input" />
            <input id="101" type="text" placeholder="test2 input" />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <Accordion>
              <AccordionTab header="NESTED Header I_I">
                <input id="103" placeholder="test 3 input" />
                <input id="104" type="text" placeholder="test4 input" />
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate velit
                  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
              </AccordionTab>
              <AccordionTab header="NESTED Header I_II">
                <input id="105" placeholder="test 5 input" />
                <input id="106" type="text" placeholder="test6 input" />
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate velit
                  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
              </AccordionTab>
            </Accordion>
          </AccordionTab>
          <AccordionTab header="Header II">
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae
              vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
              voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi
              nesciunt. Consectetur, adipisci velit, sed quia non numquam eius
              modi.
            </p>
          </AccordionTab>
          <AccordionTab header="Header III">
            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate
              non provident, similique sunt in culpa qui officia deserunt
              mollitia animi, id est laborum et dolorum fuga. Et harum quidem
              rerum facilis est et expedita distinctio. Nam libero tempore,
              cum soluta nobis est eligendi optio cumque nihil impedit quo
              minus.
            </p>
          </AccordionTab>
        </Accordion>
      </TabPanel>
      <TabPanel header="Header III">
        <p>
          At vero eos et accusamus et iusto odio dignissimos ducimus qui
          blanditiis praesentium voluptatum deleniti atque corrupti quos
          dolores et quas molestias excepturi sint occaecati cupiditate non
          provident, similique sunt in culpa qui officia deserunt mollitia
          animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
          est et expedita distinctio. Nam libero tempore, cum soluta nobis est
          eligendi optio cumque nihil impedit quo minus.
        </p>
      </TabPanel>
        </TabView>
      </div> -->
      <div class="card">
        <h5>"The Recursor????"</h5>
        <Recursor :nodes="fields" :label="fields[0]?.label||'stuff'">
          <!-- <template scope="entity"> -->
            <template v-slot:default="entity"> -->
              <component
                v-bind="entity" 
                :is="dynamicComponentMapper[entity.type.toLowerCase()]"
                :header="entity.label"
              >{{ entity.label }}</component>
            </template>
        </Recursor>
      </div>

      <p>Somethinggggg from DynamicFormlayout</p><br>
    <div class="p-fluid p-formgrid p-grid">
      <!-- iterate over the entries of 'fields', which could either be containers or formfields (for now) -->
      <!-- if a container, within that container do another iteration over container.nodes ... -->
      <!-- if a form field, do the form field templating -->
    <template v-for="entry in fields" :key="entry.id">
        <!-- @before-mount or @beforeMount="genericOnBeforeMount" on component will not work ? -->
        <!-- say TabView (level 1) :tabs="entry.nodes" ?????????? :activeIndex="0" ??????????? -->
        <component v-bind="entry"  :is="dynamicComponentMapper[entry.type.toLowerCase()]" :header="entry.type === 'TabView' ? entry.label : ''">
          
          <!-- within this component, as it's default slot? / content, we have to check if it is a container with nodes we have to iterate -->
          <template v-if="entry.isContainer" >
            <template v-for="item in entry.nodes" :key="item.id">
              <component
                :is="dynamicComponentMapper[item.type.toLowerCase()]"
                v-bind="item"
                :header="item.type === 'TabPanel' ? item.label : ''"
              >
                <template v-if="item.isContainer">
                  <template v-for="subItem in item.nodes" :key="subItem.id">
                    <!-- say Accordion (level 3) -->
                    <component
                      v-bind="subItem"
                      :is="dynamicComponentMapper[subItem.type.toLowerCase()]"
                      :activeIndex="0"
                      :header="
                        subItem.type === 'TabPanel' ||
                        subItem.type === 'AccordionTab' || subItem.type === 'Accordion'
                          ? subItem.label
                          : ''
                      "
                    >
                      <template v-if="subItem.isContainer">
                        <template
                          v-for="subsubItem in subItem.nodes"
                          :key="subsubItem.id"
                        >
                          <!-- say AccordionTab (level 4) -->
                          <component
                            v-bind="subsubItem"
                            :is="dynamicComponentMapper[subsubItem.type.toLowerCase()]"
                            :header="
                              subsubItem.type === 'TabPanel' ||
                              subsubItem.type === 'AccordionTab'
                                ? subsubItem.label
                                : ''
                            "
                          >
                          </component>
                        </template>
                      </template>
                    </component>
                  </template>
                </template>
                <template v-else>
                  <!-- todo when at this level -->
                </template>
              </component>
            </template>
          </template>
        </component>
    </template>
    
    </div>
    <Toolbar>
      <template #left>
        <template v-if="readOnly">
          <Button type="button" label="Edit" @click="readOnly = false" icon="pi pi-pencil" />
        </template>
        <template v-else>
          <Button type="button" label="Submit" @click="submitForm" icon="pi pi-check" />
        </template>
        <Button
          type="button"
          label="Close"
          @click="router.back"
          icon="pi pi-times"
          class="p-button-secondary"
        />
      </template>
    </Toolbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Fieldconfig from '@/types/fieldconfig'
import MessageType from '@/types/message'
import { validate } from '@/modules/validate'
import EventService from '@/services/EventService'
import _ from 'lodash'
import questionTypes from '@/enums/questionTypes'
import router from '@/router/routes';
import Utils from '@/modules/utils'

import Recursor from '@/components/recursor/Recursor.vue'

//These should be brought into scope again explicitely for the :is bindings?....
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';

const messages = ref<MessageType[]>([]);
const count = ref(0);

const fieldValues: any = ref<object>({})
const errorFields: any = ref<object>({})
const errorFieldsInfo: any = ref<object>({})

const dynamicComponentMapper = {
  "accordion": Accordion,
  "accordiontab": AccordionTab,
  "tabview": TabView,
  "tabpanel": TabPanel,
  "inputtext": InputText
  };

type FormProp = {
  fields: any[],
  dataType: string,
  id?: string,
  columns?: number,
  title?: string,
  readOnly?: boolean,
}

const props = withDefaults(defineProps<FormProp>(), {
  columns: 2,
  readOnly: true
})

const emit = defineEmits(['updateFieldValue'])

if (props.id) {
  const record = EventService.getQuestionById(props.id)
    .then((response) => {
      const convertedResponseData = convertResponseData(response.data)
      fieldValues.value = convertedResponseData
    })
    .catch((error) => {
      console.error('There was an error!', error);
    })
} else {
  props.fields.forEach(function (field) {
    if (field.defaultValue) {
      fieldValues.value[field.id] = field.defaultValue
    }
  })
}

function getRequired(field: Fieldconfig) {
  return _.isArray(field.validators) && _.indexOf(field.validators, 'required') > -1 ? ' *' : null
}

function getColumns(columns: number, maxColumns: number | undefined) {
  return maxColumns && maxColumns < columns ? maxColumns : columns
}

function getIconType(field: Fieldconfig) {
  return field.icon && field.icon.type ? 'aki-input-icon-' + field.icon.type : null
}

function getIconName(field: Fieldconfig) {
  return field.icon && field.icon.name
}

function calculateDependantFieldState(field: Fieldconfig, fieldValue: any) {
  field.dependantFields?.forEach(function (fieldId: string) {
    const myField = _.find(props.fields, { id: fieldId })
    if (myField) {
      // ohe: moet dit zijn fieldValue ?? true
      // als fieldValue nu undefined is of null of boolean false of 0 dan geldt die nu as hidden?
      myField.hidden = fieldValue ? false : true

      // empty field that is being hidden
      if (!fieldValue) {
        fieldValues.value[fieldId] = null

        // current field could have dependantFields which have to be hidden now, so call recursively ...
        calculateDependantFieldState(myField, null)
      }
    }
  })
}

/**
 * TODO: do we want to call this update always, id est also when the field does not qualify?
 */
function fieldUpdateHandler(payload: any, field: Fieldconfig) {
  debugger
  validateField(field)
  // Is this necessary and or is it used at this moment? Yes, listened to eg by Question form.
  // Should we only emit when stuff is valid?
  // If we always emit, while also the regular v-model update:<propName>has been triggered 
  // should it be before calling calculateDependantFieldState?
  emit('updateFieldValue', field, payload);

  calculateDependantFieldState(field, payload)
}

function validateField(field: Fieldconfig) {
  const value = fieldValues.value[field.id]

  if (field.validators) {
    const returnValue = validate(value, field.validators)
    // errorFields.value[field.id] = !returnValue.valid
    if (!returnValue.valid) {
      errorFieldsInfo.value[field.id] = returnValue.info
      errorFields.value[field.id] = !returnValue.valid
    } else {
      // errorFieldsInfo.value[field.id] = null
      delete errorFieldsInfo.value[field.id]
      delete errorFields.value[field.id]
    }
  }
}

function convertResponseData(responseData: object): object {
  const converted: any = {}
  _.each(responseData, function (fieldValue: any, key: string) {
    const field = _.find(props.fields, { 'id': key })
    const fieldType: string | undefined = field && field.type

    if (fieldType === 'Calendar') {
      converted[key] = Date.parse(fieldValue) !== NaN ? new Date(fieldValue) : fieldValue
    } else {
      converted[key] = fieldValue
    }
  });
  return converted
}

// Not really used at this point
// function getSubmitValue(myFieldValues: object): object {
//   const submitValue: any = {}
//   _.each(myFieldValues, function (fieldValue: any, key: string) {
//     if (myFieldValues.hasOwnProperty(key)) {
//       submitValue[key] = fieldValue && fieldValue.value ? fieldValue.value : fieldValue
//     }
//   });
//   return submitValue
// }

function addSubmitMessage() {
  messages.value.push(
    { severity: 'success', sticky: false, content: 'Form succesfully saved', id: count.value++ },
  )
}

function addErrorMessage(error: any) {
  messages.value.push(
    { severity: 'error', sticky: true, content: error, id: count.value++ },
  )
}

function submitForm() {
  const hasErrors = Object.keys(errorFields.value).length > 0
  if (hasErrors) {
    addErrorMessage(`The following fields have issues: ${Object.keys(errorFields.value).join(', ')}`)
    return
  }

  // const submitValue: any = getSubmitValue(fieldValues._rawValue)
  const submitValue: any = fieldValues._rawValue
  const id: string = submitValue._id

  if (id) {
    EventService.putForm(props.dataType, id, submitValue)
      .then((response) => {
        const convertedResponseData = convertResponseData(response.data)
        fieldValues.value = convertedResponseData
        addSubmitMessage()
      })
      .catch((error) => {
        addErrorMessage(
          error.response && error.response.data && error.response.data.error
            ? error + " ==> " + error.response.data.error
            : error)
      })
  } else {
    EventService.postForm(props.dataType, submitValue)
      .then((response) => {
        const convertedResponseData = convertResponseData(response.data)
        fieldValues.value = convertedResponseData
        addSubmitMessage()
      })
      .catch((error) => {
        addErrorMessage(
          error.response && error.response.data && error.response.data.error
            ? error + " ==> " + error.response.data.error
            : error)
      })
  }
}

// const formConfig2 = [
//   {
//     id: "tabview1",
//     label: "TabView 1", //label to be mapped onto prop 'header' for the tabPanel
//     type: "TabView",
//     level: 1,
//     isContainer: true,
//     nodes: [
//       {
//         id: "tabpanel1",
//         label: "TabPanel 1", //label to be mapped onto prop 'header' for the tabPanel
//         type: "TabPanel",
//         level: 2,
//         isContainer: true,
//         // header: "TabView 1 TabPanel 1",
//         nodes: [
//           {
//             id: "firstname",
//             label: "Firstname 11111",
//             type: "InputText",

//             level: 3,
//             placeholder: "Firstname",
//           },
//           {
//             id: "lastname",
//             label: "Last Name",
//             type: "InputText",
//             level: 3,
//             placeholder: "Last name",
//           },
//         ],
//       },
//       {
//         id: "tabpanel2",
//         label: "TabPanel 2", //label to be mapped onto prop 'header' for the tabPanel
//         type: "TabPanel",

//         level: 2,
//         isContainer: true,
//         // header: "TabView 1 TabPanel 1",
//         nodes: [
//           {
//             id: "firstname2",
//             label: "Firstname2",
//             type: "InputText",
//             level: 3,
//             placeholder: "Firstname2",
//           },
//         ],
//       },
//       {
//         id: "tabpanel3",
//         label: "TabPanel 3", //label to be mapped onto prop 'header' for the tabPanel
//         type: "TabPanel",
//         level: 2,
//         isContainer: true,
//         // header: "TabView 1 TabPanel 1",
//         nodes: [
//           {
//             id: "acordion1",
//             label: "Accordion XXXXX",
//             type: "Accordion",
//             level: 3,
//             isContainer: false,
//             nodes: [
//               {
//                 id: "acordiontab1",
//                 label: "Accordion Tab XXX",
//                 type: "AccordionTab",
//                 level: 4,
//                 isContainer: true,
//                 nodes: [
//                   {
//                     id: "firstnamertx",
//                     label: "Firstnamertx",
//                     type: "input",
//                     level: 5,
//                     placeholder: "Firstnamertx",
//                     isContainer: false,
//                     nodes: []
//                   },
//                   {
//                     id: "firstnamex",
//                     label: "Firstnamex",
//                     type: "InputText",
//                     level: 5,
//                     placeholder: "Firstnamex",
//                     isContainer: false,
//                     nodes: []
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "tabpanel4",
//         label: "TabPanel 4", //label to be mapped onto prop 'header' for the tabPanel
//         type: "TabPanel",
//         level: 2,
//         isContainer: true,
//         // header: "TabView 1 TabPanel 1",
//         nodes: [
//           {
//             id: "firstname6",
//             label: "Firstname666",
//             type: "InputText",
//             level: 3,
//             placeholder: "Firstname6",
//           },
//         ],
//       },
//     ],
//   },
// ];

</script>

<style lang="scss">
@import "./fieldicons.scss";

.dynamicformlayout {
  textarea {
    resize: none;
  }

  .pi {
    z-index: 1;
  }

  .p-field > label {
    margin-left: 0.25rem;
  }
}
</style>