<template>

  <div class="pip-login page">

    <HeaderPipeu :showCartIcon="false" title="Senha" returnPath="/myaccount"></HeaderPipeu>

    <div class="">

      <div class="pipeu-conta card pip-container account-container">

        <h1>Altere sua Senha</h1>

        <template v-if="!newPassUpdated">


          <PipInput component-name="currentPass" type="password" label-desc="Senha Atual" v-model="currentPass"></PipInput>

          <PipInput component-name="newPass" type="password" label-desc="Nova Senha" v-model="newPass"></PipInput>


          <PipButton @click="changePass" type="large">Alterar</PipButton>

        </template>

        <template v-else>
          <p>Sua Senha foi alterada com Sucesso !</p>
          <PipButton @click="goToHome">Voltar para o Site</PipButton>
        </template>



      </div>
    </div>

  </div>


</template>

<script>
  /* eslint-disable */
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import {mapGetters} from 'vuex'
  import pipeuApi from '@/pipeuapi/api.js'
  import PipInput from '@/components/pipeu/common/PipInput'
  import PipButton from "../../../components/pipeu/common/PipButton";

  import { eventHub } from '@/utils/eventHub'
  import AccountHeader from "@/pages/myaccount/AccountHeader";
  import HeaderPipeu from "../../../components/HeaderPipeu";

  export default {
    name: 'changePass',
    mixins: [basicuicomponent],

    data () {
      return {
        loading: true,

        currentPass: '',
        newPass: '',

        newPassUpdated: false

      }
    },
    components: {
      HeaderPipeu,
      AccountHeader,
      PipButton,
      PipInput
    },


    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain']),

      changePass () {
        let vm = this

        pipeuApi.updateCurrentPass(vm.currentPass, vm.newPass).then((res) => {

          console.log('pipeuapi.updateCurrentPass response ', res.data)
          vm.newPassUpdated = true

          eventHub.$emit('show-firefight')

          vm.$router.replace({ path: '/myaccount' })

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
