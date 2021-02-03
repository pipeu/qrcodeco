<template>
  <div class="pip-login page">

    <HeaderPipeu :showCartIcon="false" title="Formas de Pagamento" returnPath="/myaccount"></HeaderPipeu>

    <div class="pip-account pip-container account-container">

      <PaymentPreferenciesComponent :options="options"></PaymentPreferenciesComponent>

    </div>


  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import HeaderPipeu from "../../components/HeaderPipeu";
  import PaymentPreferenciesComponent from "../../components/payment/PaymentPreferenciesComponent";


  export default {
    name: 'PaymentPreferencies',

    data () {
      return {
        entities: [],
        cc: {},
        showCCAdmin: false,

        options: {
          creditCard: true,
          invoiceSlipEnabled: false,
          paypal: false,
          wireTransfer: false,
          pos: false
        },

      }
    },
    components: {
      PaymentPreferenciesComponent,
      HeaderPipeu,
    },

    created: function () {
      let vm = this
      console.log('###### PaymentPreferencies.created')
    },

    mounted: function () {
      let vm = this

      vm.mounted = true
    },



    methods: {
      ...mapActions(['addUserAccount', 'addAuthToken']),
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain']),


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


  .principal {
    line-height: 16px;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 300;
    margin: auto;
    padding: 3px 5px;
    width: 16px;
    height: 16px;
  }

  .creditcard {
    padding: 15px;
    width: 100%;
    margin: auto;
    margin-top: 15px;
  }

</style>
