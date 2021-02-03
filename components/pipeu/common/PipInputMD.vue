<template>

  <div class="mdc-text-field">
    <input type="text" id="my-text-field" class="mdc-text-field__input">
    <label class="mdc-floating-label" for="my-text-field">Hint text</label>
    <div class="mdc-line-ripple"></div>
  </div>


</template>

<script>
  /* eslint-disable */
  import { eventHub } from '@/utils/eventHub'

  import {MDCTextField} from '@material/textfield';

  export default {
    name: 'PipInput',

    data: function() {
      return {
        modelValue: this.value, // We can bind parent v-mode in this way, instead of this vm.modelValue = vm.value in created hook
      }
    },

    props: {
      value: { // Initial value passed from v-model from Parent Component
        required: true
      },

      type: {
        required: false,
        type: String,
        default () {
          return 'text'
        }
      },

      componentName: {
        required: true,
        type: String
      },

      labelDesc: {
        required: true,
        type: String
      },

      disabled: {
        required: false,
        type: Boolean,
        default () {
          return false
        }
      },

      rows: {
        required: false,
        type: Number,
        default () {
          return 1
        }
      }

    },

    computed: {

    },

    mounted () {
      let vm = this

      console.log('### Mounted [PipInput '+vm.componentName+'] document.querySelector(\'.mdc-text-field\'):', document.querySelector('.mdc-text-field'))
      const textField = new MDCTextField(document.querySelector('.mdc-text-field'));

    },

    created () {
      let vm = this
      // console.log('### [PipInput '+vm.componentName+'] document.querySelector(\'.mdc-text-field\'):', document.querySelector('.mdc-text-field'))
      // console.log('### [PipInputField '+vm.componentName+'] required:', vm.required)



      // componentName must be exacle the entity attribute name in input field and container indicator id
      // Validation message emitted by parent mixins errorHandling func
      eventHub.$on(vm.componentName + '-indicator', (message) => {
        // console.log('### [PipInput '+vm.componentName+'] -indicator message:', message)

        let element = document.getElementById(vm.componentName)
        if (element) {
          element.classList.add('invalid')
        }

        let elementIndicator = document.getElementById(vm.componentName + '-indicator')
        if (elementIndicator) {
          elementIndicator.innerText = message
        }

      })

    },

    beforeDestroy () {
      eventHub.$off(this.componentName + '-indicator');
    },

    watch: {

      modelValue: function(newValue) {
        // console.log('   >>> PipInput ['+this.componentName+'] modelValue changed:', newValue)
        let vm = this
        vm.$emit('input', newValue)

        vm.removeValidationIndicator ()
      },

      value: function(newValue) {
        // console.log('   >>> PipInput ['+this.componentName+'] PARENT changed value (update model Value ?):', newValue)
      }

    },

    methods: {
      removeValidationIndicator () {
        let vm = this
        let element = document.getElementById(vm.componentName)
        if (element) {
          element.classList.remove('invalid')
        }

        let elementIndicator = document.getElementById(vm.componentName + '-indicator')
        if (elementIndicator) {
          elementIndicator.innerText = ''
        }
      }

    }

  }
</script>

<style scoped>
  @import "@material/textfield/dist/mdc.textfield.css";
</style>
