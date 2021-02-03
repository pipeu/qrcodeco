<template>
  <div>

    <!--<AccountHeader title="Minha Conta" :hideMenuOnMobile="false" returnPath="/"></AccountHeader>-->
    <HeaderPipeu :showCartIcon="false" title="Minha Conta" returnPath="/"></HeaderPipeu>


    <div class="pip-account pip-container account-container card">
      <div class="collection">
        <nuxt-link to="/myaccount/account" class="collection-item"><i class="material-icons left">person</i>Dados pessoais</nuxt-link>
        <nuxt-link to="/myaccount/address" class="collection-item"><i class="material-icons left">place</i>Meu endereço</nuxt-link>
        <nuxt-link to="/myaccount/pass/changePass" class="collection-item"><i class="material-icons left">lock</i>Alterar senha</nuxt-link>

        <nuxt-link to="/myaccount/paymentPreferencies" class="collection-item"><i class="material-icons left">payment</i>Formas de pagamento</nuxt-link>

        <!--<a href="pipeu-conta-config-5.html" class="collection-item"><i class="material-icons left">notifications</i>Notifições</a>-->

        <a @click="logout" style="cursor: pointer;" class="collection-item"><i class="material-icons left">power_settings_new</i>Sair da conta</a>
      </div>
    </div>


  </div>
</template>

<script>
  import {mapMutations, mapGetters, mapActions} from 'vuex'

  import AccountHeader from "@/pages/myaccount/AccountHeader";

  import basicuicomponent from '@/mixins/BasicUIComponent'
  import PipInput from '@/components/pipeu/common/PipInput'
  import PipErrorIndicator from '@/components/pipeu/common/PipErrorIndicator'
  import PipButton from "@/components/pipeu/common/PipButton";

  import PipRadioGroup from "@/components/pipeu/common/PipRadioGroup";
  import PipCPFInput from "@/components/pipeu/common/PipCPFInput";
  import HeaderPipeu from "../../components/HeaderPipeu";

  import auth from '@/store/auth.js'


  export default {
    name: 'Account',

    mixins: [basicuicomponent],

    middleware: ['auth'],

    data () {
      return {
        user: {
          fullName: '',
          email: '',
          mobilePhone: '',
          cpf: '',
          gender: ''
        }
      }
    },
    components: {
      HeaderPipeu,
      PipCPFInput,
      PipRadioGroup,
      AccountHeader,
      PipButton,
      PipInput, PipErrorIndicator
    },

    created: function () {
      console.log('###### _myaccount.created')
    },

    mounted: function () {
      let vm = this
      console.log('mounted vm.getUserAccount():', vm.getUserAccount())
      vm.user = vm.clone(vm.getUserAccount())
      vm.mounted = true
    },

    methods: {
      ...mapActions(['addUserAccount', 'addAuthToken']),
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain']),

      logout () {
        let vm = this
        auth.logout().then((response) => {
          console.log('logout auth response')

          vm.$store.commit('SET_USER_ACCOUNT', null)

          vm.$router.replace({ path: '/' })

        }, (error) => {
          console.log('logout failure response', error)
        })
      },
    }

  }
</script>

<style scoped>
  @import "@/pages/myaccount/account.css";
  .pip-container {
    padding: 50px;
  }

  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (max-width: 768px) {
    .card {
      box-shadow: none;
    }
    .pip-container {
      padding: 0;
    }
  }
</style>
