<template>

  <div class="pip-login page">

    <div class="container">

      <div class="pipeu-conta card">
        <div class="back"><nuxt-link to="/Login"><i class="material-icons prefix">arrow_back</i></nuxt-link></div>

        <nuxt-link to="/">
          <img :src="getStore().properties.logoURL" :alt="getStore().name" style="height: 120px; width: auto;">
        </nuxt-link>
        <h1>Esqueceu sua Senha ?</h1>

        <template v-if="!resetOk">
          <div class="form-group label-floating">
            <PipInput component-name="email" type="email" label-desc="Digite seu Email" v-model="email"></PipInput>
          </div>

          <PipErrorIndicator componentName="message"></PipErrorIndicator>

          <PipButton @click="changePass" type="large">Re-Criar Senha</PipButton>
        </template>

        <template v-else>
          <p>Enviamos um Email para você com Instruções para Recuperar sua Senha</p>
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
    import PipErrorIndicator from "../../../components/pipeu/common/PipErrorIndicator";

    export default {
        name: 'forgot',
        mixins: [basicuicomponent],

        data () {
            return {
                loading: true,

                email: '',

                resetOk: false
            }
        },
        components: {
          PipErrorIndicator,
          PipButton,
            PipInput,
            HeaderPipeu,
            FooterPipeu
        },

        created: function () {
            console.log('###### forgot.created')
        },

        mounted: function () {
            let vm = this
            this.loading = false
        },

        async asyncData ({ store, params, query, route, req, error }) {
            // console.log('### forgot.vue this.$route.query.email:', decodeURIComponent(route.query.email))
        },

        methods: {
          ...mapGetters([
              'getStore', 'getUserAccount', 'getDomain'
          ]),

          changePass () {
            let vm = this

            pipeuApi.resetPassword(vm.email).then((response) => {

                console.log('pipeuapi.resetPassword response ', response.data)

                vm.resetOk = true
            }, (error) => {
                vm.handleApiError(error)
            })
          }
        }

    }
</script>

<style scoped>
  @import "@/pages/myaccount/account.css";
  .pip-login {
    padding-top: 50px;
  }
  .pip-login h1 {
    font-size: 24px;
    text-align: left;
    padding: 0 0 20px 0;
    margin: 0;
  }
  .card img {
    width: 180px;
    margin-bottom: 20px;
    border-radius: 0px;
  }
  .pip-login .back {
    padding: 0 0 20px 0;
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
    }
    .pip-login {
      padding-top: 0;
    }
  }
</style>
