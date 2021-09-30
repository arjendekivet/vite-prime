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
      <div class="card">
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
            <input id="100" placeholder="test 1 input" />
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
      </div>

    <div class="p-fluid p-formgrid p-grid">
      
      <p>Something from DynamicFormlayout</p>
      <!-- iterate over the entries of 'fields', which could either be containers or formfields (for now) -->
      <!-- if a container, within that container do another iteration over container.items ... -->
      <!-- if a form field, do the form field templating -->
      <!--
      <template v-for="entry in fields">
          <template v-if="entry.isContainer">
            <component v-bind=entry :is="entry.type">
          
              <template v-for="field in entry.items">
              <div
                v-if="!field.hidden"
                :class="`p-field p-text-left ${getIconType(field)} p-col-12 p-md-${12 / getColumns(columns, field.maxColumns)}`"
              >
                <label :for="field.id">{{ field.label }}{{ getRequired(field) }}</label>
                <template v-if="readOnly">
                  <div>{{ fieldValues[field.id] }}</div>
                </template>
                
                <template v-else>
                  <i v-if="getIconName(field)" :class="`pi ${getIconName(field)}`" />
                  <component 
                    v-bind=field
                    :is="field.type"  
                    v-model="fieldValues[field.id]"
                    @update:modelValue="fieldUpdateHandler($event, field)"
                    :class="errorFields[field.id] ? 'p-invalid' : ''"
                    :aria-describedby="`${field.id}-help`"
                  ></component>
                  <small :id="`${field.id}-help`" class="p-error">{{ errorFieldsInfo[field.id] }}</small>
                </template>
              </div>
              </template>
            </component>
          </template>
          <template v-else>
              <div
                v-if="!field.hidden"
                :class="`p-field p-text-left ${getIconType(entry)} p-col-12 p-md-${12 / getColumns(columns, entry.maxColumns)}`"
              >
                <label :for="entry.id">{{ entry.label }}{{ getRequired(entry) }}</label>
                <template v-if="readOnly">
                  <div>{{ fieldValues[entry.id] }}</div>
                </template>
              
                <template v-else>
                  <i v-if="getIconName(entry)" :class="`pi ${getIconName(entry)}`" />
                  <component 
                    v-bind=entry
                    :is="entry.type"  
                    v-model="fieldValues[entry.id]"
                    @update:modelValue="fieldUpdateHandler($event, entry)"
                    :class="errorFields[entry.id] ? 'p-invalid' : ''"
                    :aria-describedby="`${entry.id}-help`"
                  ></component>
                  <small :id="`${entry.id}-help`" class="p-error">{{ errorFieldsInfo[entry.id] }}</small>
                </template>
              </div>
          </template>
      </template>
     -->

      <template v-for="entry in formConfig2" :key="entry.id">
      <!-- @before-mount or @beforeMount="genericOnBeforeMount" on component will not work ? -->
      <!-- say TabView (level 1)-->
      <p>{{ "level 1:" + entry.type }}</p>
      <component v-bind="entry" :is="entry.type">
        <!-- within this component, we have to check if it is a container with items we have to iterate -->
        <!--template v-if="entry.isContainer" -->
          <p>"before for loop over level 2:"</p>
          <template v-for="item in entry.items" :key="item.id">
          
            <p>{{ "level 2:" + item.type }}</p>
            <component
              :is="item.type"
              v-bind="item"
              :header="item.type === 'TabPanel' ? item.label : ''"
            >
              
              <template v-if="item.isContainer">
                <template v-for="subItem in item.items" :key="subItem.id">
                  <!-- say Accordion (level 3) -->
                  <p>{{ "level 2:" + subItem.type }}</p>
                  <component
                    v-bind="subItem"
                    :is="subItem.type"
                    :header="
                      subItem.type === 'TabPanel' ||
                      subItem.type === 'AccordionTab'
                        ? subItem.label
                        : ''
                    "
                  >
                    <template v-if="subItem.isContainer">
                      <template
                        v-for="subsubItem in subItem.items"
                        :key="subsubItem.id"
                      >
                        <!-- say Accordion (level 4) -->
                        <component
                          v-bind="subsubItem"
                          :is="subsubItem.type"
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
          <!--/template-->
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

const messages = ref<MessageType[]>([]);
const count = ref(0);

const fieldValues: any = ref<object>({})
const errorFields: any = ref<object>({})
const errorFieldsInfo: any = ref<object>({})

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

const formConfig2 = [
  {
    id: "tabview1",
    label: "TabView 1", //label to be mapped onto prop 'header' for the tabPanel
    type: "TabView",
    level: 1,
    isContainer: true,
    items: [
      {
        id: "tabpanel1",
        label: "TabPanel 1", //label to be mapped onto prop 'header' for the tabPanel
        type: "TabPanel",
        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "firstname",
            label: "Firstname",
            type: "InputText",

            level: 3,
            placeholder: "Firstname",
          },
          {
            id: "lastname",
            label: "Last Name",
            type: "InputText",
            level: 3,
            placeholder: "Last name",
          },
        ],
      },
      {
        id: "tabpanel2",
        label: "TabPanel 2", //label to be mapped onto prop 'header' for the tabPanel
        type: "TabPanel",

        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "firstname2",
            label: "Firstname2",
            type: "InputText",
            level: 3,
            placeholder: "Firstname2",
          },
        ],
      },
      {
        id: "tabpanel4",
        label: "TabPanel 4", //label to be mapped onto prop 'header' for the tabPanel
        type: "TabPanel",
        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "firstname6",
            label: "Firstname666",
            type: "InputText",
            level: 3,
            placeholder: "Firstname6",
          },
        ],
      },
      {
        id: "tabpanel3",
        label: "TabPanel 3", //label to be mapped onto prop 'header' for the tabPanel
        type: "TabPanel",
        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "acordion1",
            label: "Firstname2",
            type: "Accordion",
            level: 3,
            isContainer: false,
            items: [
              {
                id: "acordiontab1",
                label: "Firstname2",
                type: "AccordionTab",
                level: 4,
                isContainer: true,
                items: [
                  {
                    id: "firstnamex",
                    label: "Firstnamex",
                    type: "InputText",
                    level: 5,
                    placeholder: "Firstnamex",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

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