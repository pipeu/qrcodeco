<template>

  <div class="pip-login page">

    <div class="" >

      <div class="pipeu-conta card pip-container">

        <h1>Altere sua Senha</h1>

        <template v-if="!newPassUpdated">
          <div class="form-group label-floating">
            <PipInput component-name="pass" type="password" label-desc="Nova Senha" v-model="pass"></PipInput>
          </div>

          <PipButton @click="changePass">Alterar</PipButton>

        </template>

        <template v-else>
          <p>Sua Nova Senha foi Cadastrada com Sucesso !</p>
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
  import HeaderPipeu from '@/components/HeaderPipeu'
  import FooterPipeu from '@/components/FooterPipeu'
  import pipeuApi from '@/pipeuapi/api.js'
  import PipInput from '@/components/pipeu/common/PipInput'
  import PipButton from "../../../components/pipeu/common/PipButton";

  import { eventHub } from '@/utils/eventHub'

  export default {
    name: 'newPass',
    mixins: [basicuicomponent],

    data () {
      return {
        loading: true,

        email: '',
        code: '',

        pass: '',

        newPassUpdated: false

      }
    },
    components: {
      PipButton,
      PipInput,
      HeaderPipeu,
      FooterPipeu
    },

    created: function () {
      console.log('###### newPass.created')
    },

    mounted: function () {
      let vm = this
      this.loading = false
    },

    async asyncData ({ store, params, query, route, req, error }) {
      console.log('### newPass.vue this.$route.query.email:', decodeURIComponent(route.query.email))
      console.log('### newPass.vue this.$route.query.code:', decodeURIComponent(route.query.code))

      if (!route.query.email || !route.query.code) {
        return error({ statusCode: 404, message: 'Erro ao Tentar Alterar a Senha !' })
      }

      let email = decodeURIComponent(route.query.email)
      let code = decodeURIComponent(route.query.code)

      return {
        email: email,
        code: code
      }
    },

    methods: {
      ...mapGetters([
        'getStore', 'getUserAccount', 'getDomain'
      ]),

      changePass () {
        let vm = this

        pipeuApi.changePassword(vm.email, vm.code, vm.pass).then((response) => {

          console.log('pipeuapi.changePassword response ', response.data)

          vm.newPassUpdated = true

          eventHub.$emit('show-firefight')

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
