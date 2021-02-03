<template>
  <div class="pip-login page">

    <HeaderPipeu :showCartIcon="false" title="Endereço" returnPath="/myaccount"></HeaderPipeu>

    <div v-if="mounted" class="">

      <div class="pipeu-conta card pip-container account-container">

        <h1>Endereço Principal</h1>

        <!--TODO: List previsoly Addresses so that the User can choice between previosly-->
        <div>
          <PipUserAddress v-model="address"></PipUserAddress>
        </div>

        <PipErrorIndicator componentName="message"></PipErrorIndicator>

        <PipButton @click="update"> Atualizar</PipButton>

      </div>
    </div>


  </div>
</template>

<script>

  import basicuicomponent from '@/mixins/BasicUIComponent'

  import {mapGetters, mapActions} from 'vuex'
  import pipeuApi from '@/pipeuapi/api.js'

  import PipErrorIndicator from "@/components/pipeu/common/PipErrorIndicator";
  import PipButton from "@/components/pipeu/common/PipButton";
  import PipUserAddress from "@/components/pipeu/common/PipUserAddress";

  import AccountHeader from "@/pages/myaccount/AccountHeader";
  import HeaderPipeu from "../../../components/HeaderPipeu";

  import auth from '@/store/auth'

  export default {
    name: 'UserMainAddress',

    mixins: [basicuicomponent],

    middleware: ['auth'],
    meta: {
      auth: { authority: 2 }
    },

    data () {
      return {

        address: {}

      }
    },
    components: {
      HeaderPipeu,
      AccountHeader,
      PipUserAddress,
      PipButton,
      PipErrorIndicator
    },

    created: function () {
      console.log('###### UserMainAddress.created')
    },

    mounted: function () {
      let vm = this

      let user = vm.$store.getters.getUserAccount
      console.log('### store.getters.getUserAccount: ', user)
      let address = {}

      // If found the address entity then get it, otherwhise get from UserAccount object
      if (user.mainShippingAddress && user.mainShippingAddress.address) {
        console.log('### Found mainShippingAddress at user entity getUserAccount')
        this.address = user.mainShippingAddress
      } else {
        console.log('### NOT Found mainShippingAddress at user entity getUserAccount, getting personal Data')
      }

      vm.mounted = true
    },

    watch: {
      'address.zipCode': function (newValue, oldValue) {
        // console.log('watch UserMainAddress address.zipCode newValue', newValue)
      },
      'address.address': function (newValue, oldValue) {
        // console.log('watch UserMainAddress address.address newValue', newValue)
      },
    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain']),
      ...mapActions(['addUserAccount', 'addAuthToken']),

      update () {
        let vm = this
        console.log('update.vue')

        pipeuApi.updateMainAddress(vm.address).then((res) => {
          console.log('updateMainAddress res', res, res.data)

          auth.me().then( meRes => { // refresh user account to get all addresses
            console.log('>>> promise resolved auth.me meRes', meRes)

            vm.addUserAccount(meRes.data.userAccount)

            vm.$toast.success('Ok !')

            vm.$router.replace({ path: '/myaccount' })

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
    margin-top: 50px;
    width: 100%;
    padding: 50px;
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

