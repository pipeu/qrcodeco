<template>

<div>

  <select :disabled="disabled" @change="$emit('update:state', $event.target.value)"  style="width: auto" class="form-control input-md" >

    <option value="AC" :selected="'AC' == state">Acre</option>

    <option value="AL" :selected="'AL' == state">Alagoas</option>

    <option value="AM" :selected="'AM' == state">Amazonas</option>

    <option value="AP" :selected="'AP' == state">Amapá</option>

    <option value="BA" :selected="'BA' == state">Bahia</option>

    <option value="CE" :selected="'CE' == state">Ceará</option>

    <option value="DF" :selected="'DF' == state">Distrito Federal</option>

    <option value="ES" :selected="'ES' == state">Espírito Santo</option>

    <option value="GO" :selected="'GO' == state">Goiás</option>

    <option value="MA" :selected="'MA' == state">Maranhão</option>

    <option value="MG" :selected="'MG' == state">Minas Gerais</option>

    <option value="MS" :selected="'MS' == state">Mato Grosso do Sul</option>

    <option value="MT" :selected="'MT' == state">Mato Grosso</option>

    <option value="PA" :selected="'PA' == state">Pará</option>

    <option value="PB" :selected="'PB' == state">Paraíba</option>

    <option value="PE" :selected="'PE' == state">Pernambuco</option>

    <option value="PI" :selected="'PI' == state">Piauí</option>

    <option value="PR" :selected="'PR' == state">Paraná</option>

    <option value="RJ" :selected="'RJ' == state">Rio de Janeiro</option>

    <option value="RN" :selected="'RN' == state">Rio Grande do Norte</option>

    <option value="RO" :selected="'RO' == state">Rondônia</option>

    <option value="RR" :selected="'RR' == state">Roraima</option>

    <option value="RS" :selected="'RS' == state">Rio Grande do Sul</option>

    <option value="SC" :selected="'SC' == state">Santa Catarina</option>

    <option value="SE" :selected="'SE' == state">Sergipe</option>

    <option value="SP" :selected="'SP' == state">São Paulo</option>

    <option value="TO" :selected="'TO' == state">Tocantins</option>
  </select>

  <PipErrorIndicator :componentName="componentName"></PipErrorIndicator>

</div>

</template>

<script>
  import PipErrorIndicator from "@/components/pipeu/common/PipErrorIndicator";

  export default {
    name: 'PipStateSelect',
    components: {PipErrorIndicator},
    data: function() {
      return {
        state: this.value, // We can bind parent v-mode in this way, instead of this vm.modelValue = vm.value in created hook
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

      disabled: {
        required: false,
        type: Boolean,
        default () {
          return false
        }
      },

    },

    computed: {

    },

    mounted () {
    },

    created () {
      let vm = this
    },

    watch: {

      state: function(newValue) {
        console.log('   >>> PipSate:', newValue)
        let vm = this

        // vm.$emit('input', newValue)
        // vm.removeValidationIndicator ()

      },

      value: function(newValue) {
        // console.log('   >>> PipInput ['+this.componentName+'] PARENT changed value (update model Value ?):', newValue)
      }

    },

    // methods: {
    //   removeValidationIndicator () {
    //     let vm = this
    //     let element = document.getElementById(vm.componentName)
    //     if (element) {
    //       element.classList.remove('invalid')
    //     }
    //
    //     let elementIndicator = document.getElementById(vm.componentName + '-indicator')
    //     if (elementIndicator) {
    //       elementIndicator.innerText = ''
    //     }
    //   }
    //
    // }

  }
</script>

