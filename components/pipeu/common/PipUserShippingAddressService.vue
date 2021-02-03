<template>
    <div v-if="mounted">
        <PipUserAddress v-model="address"></PipUserAddress>
        <PipErrorIndicator componentName="message"></PipErrorIndicator>
        <!-- Fixed, implement list of previosly shippingAddresses (these info are in database) -->
        <!--<input type="checkbox" class="form-check-input" id="setAsMainAddress" v-model="setAsMainAddress">-->
        <!--<label class="form-check-label" for="setAsMainAddress">Marcar este Endereço como Principal</label>-->
        <PipButton @click="createUpdate"> Atualizar </PipButton>
    </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import pipeuApi from '~/pipeuapi/api.js'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import PipButton from "@/components/pipeu/common/PipButton";
  import PipUserAddress from "@/components/pipeu/common/PipUserAddress";
  import PipErrorIndicator from "@/components/pipeu/common/PipErrorIndicator";
  import auth from '@/store/auth'

  export default {
    name: 'PipUserShippingAddressService',
    mixins: [basicuicomponent],

    data () {
      return {
        address: {}
      }
    },

    props: {
      propAddress: {
        required: false,
        type: Object,
        default () {
          return {}
        }
      }
    },

    components: {
      PipErrorIndicator,
      PipUserAddress,
      PipButton
    },

    created: function () {
      let vm = this
      console.log('###### PipUserShippingAddressService.created vm.propAddress:', vm.propAddress)
      if (vm.propAddress && vm.propAddress.address) {
        vm.address = vm.propAddress
      }
      vm.mounted = true
    },

    mounted: function () {
      let vm = this
    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getPlanById']),
      ...mapActions(['addUserAccount', 'addAuthToken']),

      createUpdate () {
        let vm = this
        console.log('createUpdate')

        // Fixed
        vm.address.mainAddress = true
        vm.address.userConfirmedMainAddress = true

        pipeuApi.updateMainAddress(vm.address).then((res) => {
          console.log('updateMainAddress res', res, res.data)

          auth.me().then( meRes => { // refresh user account to get all addresses
            console.log('>>> promise resolved auth.me meRes', meRes)
            vm.addUserAccount(meRes.data.userAccount)
            vm.$emit('user-shipping-address-updated', res.data)
          })
        }, (error) => {
          vm.handleApiError(error)
        })

      }
    }
  }
</script>
<style scoped>
  @import "@/pages/myaccount/account.css";

  .pipeu-conta {
    /*margin-top: 50px;*/
    width: 100%;
    padding: 15px 50px 15px 50px;
  }
  .pip-login h1 {
    margin: 0;
    padding: 0;
    text-align: left;
    margin-bottom: 40px;

  }
  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (max-width: 768px) {
    .card {
      box-shadow: none;
    }
    .pipeu-conta {
      padding: 15px;
      width: 100%;
      margin: auto;
      margin-top: 20px;
    }
    .pip-login {
      padding-top: 0;
    }
    .input-field {
      position: relative;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    h1 {
      display: none;
    }
  }
</style>
