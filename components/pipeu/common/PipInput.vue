<template>
<div class="input-field" style="margin-top: 0.3rem; margin-bottom: 0.3rem;">
    <label :for="componentName">{{labelDesc}}</label>
    <input :class="' ' + propClass"
           @input="$emit('input', modelValue)"
           v-on:keyup.enter="dispatchEnter"
           v-on:focus.prevent="$emit('focus', $event.target.value)" :disabled="disabled" v-model="modelValue" :type="type" :name="componentName" :id="componentName" :maxlength="maxlength"  >
    <span :id="componentName + '-indicator'" class="material-input input-error"></span>
</div>
</template>

<script>
  /* eslint-disable */
  import { eventHub } from '@/utils/eventHub'

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

      propClass: {
        required: false,
        type: String,
        default () {
          return ''
        }
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
      },

        maxlength: {
            required: false,
            type: Number,
            default () {
                return 524288
            }
        },
    },

    created () {
      let vm = this
      // console.log('### [PipInput '+vm.componentName+'] value via parent v-model:', vm.value)
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
        this.removeValidationIndicator ()
      },

      value: function(newValue) {
        // console.log('   >>> PipInput ['+this.componentName+'] PARENT changed value (update model Value ?):', newValue)
        // this.modelValue = this.newValue // TWO WAY Binding
      }
    },

    methods: {
      dispatchEnter () {
        let vm = this
        vm.$emit("on-enter");
      },

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
.input-error {
    color: #B8211D;
    padding: 5px;
    margin-bottom: 13px;
}
</style>
