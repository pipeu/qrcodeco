<template>
  <div :key="componentKeyReRender" v-if="mounted">
    <div class="row fg-mb">
      <div class="col-lg-4 col-md-7 col-xs-3">
        <input :disabled="processing" type="text" class="form-control"  @keyup="changeZipCode" id="zipCode" name="zipCode"
               v-mask="'99999-999'"
               v-model="address.zipCode"
               placeholder="Cep">
      </div>
    </div>

    <PipErrorIndicator componentName="zipCode"></PipErrorIndicator>

    <PipInput component-name="address" label-desc="Endereço" v-model="address.address"></PipInput>
    <PipInput  component-name="addressNumber" type="Number" label-desc="Número" v-model="address.addressNumber"></PipInput>
    <PipInput  component-name="addressNumberComp" label-desc="Complemento" v-model="address.addressNumberComp"></PipInput>
    <template v-if="!hideNeighCityState">
      <PipInput  component-name="neighborhood" label-desc="Bairro" v-model="address.neighborhood"></PipInput>
      <PipInput  component-name="city" label-desc="Cidade" v-model="address.city"></PipInput>
      <PipStateSelect  component-name="state" v-model="address.state"></PipStateSelect>
    </template>

  </div>
</template>

<script>
  import AwesomeMask from 'awesome-mask'
  import pipeuApi from '@/pipeuapi/api.js'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import PipErrorIndicator from "@/components/pipeu/common/PipErrorIndicator";
  import PipStateSelect from "@/components/pipeu/common/PipStateSelect";
  import PipInput from "@/components/pipeu/common/PipInput";

  export default {
    name: 'PipUserAddress',
    components: {PipInput, PipStateSelect, PipErrorIndicator},
    mixins: [basicuicomponent],

    data () {
      return {
        loading: true,
        address: {
          tokenId: '',
          mainAddress: true,
          userConfirmedMainAddress: true,

          zipCode: '',
          address: '',
          addressNumber: '',
          addressNumberComp: '',
          neighborhood: '',
          city: '',
          state: '',
        }
      }
    },

    props: {
      processing: Boolean,
      value: { // Initial value passed from v-model from Parent Component
        required: true
      },
      hideNeighCityState: false
    },

    directives: {
      'mask': AwesomeMask
    },

    created: function () {
      let vm = this
    },

    mounted () {
      let vm = this
      if (vm.value) {
        vm.address = vm.value
      }
      this.mounted = true
    },

    watch: {
      // whenever question changes, this function will run
      'address.zipCode': function (newValue, oldValue) {
        // console.log('watch zipCode oldValue', oldValue)
        // console.log('watch zipCode newValue', newValue)
        // if (this.mounted) {
        //   this.changeZipCode()
        // }

      },
      'address.address': function (newValue, oldValue) {
        // console.log('watch PipUserAddress address.address newValue', newValue)
      }
    },

    methods: {
      changeZipCode: function (e) {
        // console.log('changeZipCode')
        let auxZipCode = this.address.zipCode.replace(/[_-]/g, '')
        if (auxZipCode.length === 8) {
          this.queryZipCode(auxZipCode)
        }
      },

      queryZipCode (zipCode) {
        let vm = this
        console.log('queryZipCode' + zipCode)
        pipeuApi.fetchZipCode(zipCode).then((res) => {
          // console.log('response fetchZipCode', res.data)

          vm.address.address = res.data.logradouro
          vm.address.neighborhood = res.data.bairro
          vm.address.city = res.data.localidade
          vm.address.state = res.data.uf

          vm.$emit('input', vm.address)

          vm.$nextTick(function () {
            vm.updateComponentKeyReRender()
            vm.attachComponents()
          })
        }, (error) => {
          console.log('login failure response', error)
        })
      }
    }
  }
</script>

