<template>

  <div class="input-field">
    <label :for="componentName">{{labelDesc}}</label>
    <input v-mask="'99.999.999/9999-99'"
           @input="$emit('input', modelValue)"
           v-on:focus.prevent="$emit('focus', $event.target.value)" :disabled="disabled" v-model="modelValue" type="text" :name="componentName" :id="componentName"  >
    <span :id="componentName + '-indicator'" class="material-input input-error"></span>

    <!--@change="$emit('update:modelValue', modelValue)"-->
  </div>

</template>

<script>
  /* eslint-disable */
  import { eventHub } from '@/utils/eventHub'
  import MaskedInput from 'vue-text-mask'
  import AwesomeMask from 'awesome-mask'

  export default {
    name: 'PipCNPJInput',

    directives: {
      'mask': AwesomeMask
    },
    components: {
      MaskedInput
    },

    data: function() {
      return {
        modelValue: this.value, // We can bind parent v-mode in this way, instead of this vm.modelValue = vm.value in created hook
      }
    },

    props: {
      value: { // Initial value passed from v-model from Parent Component
        required: true
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
      }

    },

    computed: {

    },

    mounted () {
    },

    // Create a CNPJ validation here
    // eticket.cpf = eticket.cpf.replace(/[_]/g, '')
    // if (!eticket.cpf || eticket.cpf.length !== 14) {
    //   console.log('eticket.cpf.length', eticket.cpf.length)
    //   console.log('eticket.cpf', eticket.cpf)
    //
    //   app.addErrors('eventTicket.cpf', 'Digite o CPF')
    //   return
    // }

    created () {
      let vm = this
      eventHub.$on(vm.componentName + '-indicator', (message) => {
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

    watch:{
      value () {
        // console.log('PipCPFInput value watch, changed: TWO WAY BINDING', this.value)
        // this.modelValue = this.value // TWO WAY Binding
      },
      modelValue () {
        let vm = this
        console.log('PipCNPJInput modelValue watch, changed', this.modelValue)
        vm.removeValidationIndicator ()
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
  .input-error {
    color: #B8211D;
    padding: 5px;
    margin-bottom: 13px;
  }
</style>
