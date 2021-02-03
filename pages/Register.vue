<template>
<div class="pip-login page">
  <div class="container">
    <div class="pipeu-conta card">
      <div class="back"><nuxt-link to="/Login"><i class="material-icons prefix">arrow_back</i></nuxt-link></div>
      <nuxt-link to="/">
          <img :src="getStore().properties.logoURL" :alt="getStore().name" style="height: 120px; width: auto;">
      </nuxt-link>

      <h1>Olá, Crie sua conta</h1>
      <div>
        <PipInput component-name="email" type="email" label-desc="Email" v-model="email"></PipInput>
      </div>
      <div>
        <PipInput component-name="fullName" label-desc="Nome Completo" v-model="fullName"></PipInput>
      </div>

      <div>
        <PipInput component-name="mobilePhone" type="number" label-desc="Celular" v-model="mobilePhone"></PipInput>
      </div>
      <div>
        <PipInput component-name="password" type="password" label-desc="Senha" v-model="password"></PipInput>
      </div>

      <PipErrorIndicator componentName="message"></PipErrorIndicator>

      <PipButton @click="register" :disabled="isProcessing" type="large"> Entrar</PipButton>
      <p style="font-size: 16px; margin:30px 0 0;">Já têm uma conta? <nuxt-link :to="'/Login?next=' + redirectPage" style="font-weight: 400; text-transform: uppercase">Entre</nuxt-link></p>

  </div>
</div>

</div>
</template>

<script>
    /* eslint-disable */
    import AuthService from '@/services/AuthService'
    import HeaderPipeu from '../components/HeaderPipeu'
    import FooterPipeu from '../components/FooterPipeu'
    import {mapMutations, mapGetters, mapActions} from 'vuex'
    import auth from '~/store/auth.js'
    import Cookie from 'js-cookie'
    import pipeuApi from '~/pipeuapi/api.js'
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import PipInput from '@/components/pipeu/common/PipInput'
    import PipErrorIndicator from '@/components/pipeu/common/PipErrorIndicator'
    import PipButton from "../components/pipeu/common/PipButton";

    export default {
        name: 'Register',
        mixins: [basicuicomponent],

        data () {
            return {
                email: '',
                password: '',
                fullName: '',
                mobilePhone: '',
                redirectPage: '/'
            }
        },
        components: {
          PipButton,
            HeaderPipeu, FooterPipeu, PipInput, PipErrorIndicator
        },

        created: function () {
            // console.log('###### Register.created')
            // console.log('this.$route.query.next:', decodeURIComponent(this.$route.query.next))
            // console.log('this.$route.query:', decodeURIComponent(this.$route.query))
            // console.log('this.$route.query:', decodeURIComponent(this.$route.query['ID']))
            // console.log('this.$route.query.fullPath:', decodeURIComponent(this.$route.fullPath))

            let redirect = (decodeURIComponent(this.$route.fullPath)).indexOf('redirect=')
            // console.log('this.$route.query.fullPath redirect indexOf:', redirect)
            // console.log('this.$route.query.redirect:', decodeURIComponent(this.$route.query.redirect))

            if (this.$route.query.next) {
              this.redirectPage = this.$route.query.next
            }
        },


        methods: {
            ...mapActions(['addUserAccount', 'addAuthToken','getUserObjects']),
            ...mapMutations(['increment']),
            ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getAFAID']),

            // TODO: Move this to AuthServices
            async register () {
                let vm = this

                try {
                    let affiliateAdId = 0
                    if (vm.$localStorage.get('AFAID')) {
                      affiliateAdId = vm.$localStorage.get('AFAID')
                      // vm.debH('Found affiliateAdId on localStorage, sending on signup')
                    }

                    let affiliateId = 0
                    if (vm.$localStorage.get('AFID')) {
                      affiliateId = vm.$localStorage.get('AFID')
                      // vm.debH('Found affiliate on localStorage, sending on signup')
                    }

                    let response = await pipeuApi.register(this.email, this.fullName, this.mobilePhone, this.password, affiliateAdId, affiliateId)

                    // Refactor Here, same func is done in Login Service
                    await vm.addUserAccount(response.data.userAccount)

                    let jwt = response.data.userAccount.token

                    auth.setAuthToken(jwt)

                    // 27/03/18 - Set token on Cookie for SSR (if user do a refresh on browser for instance)
                    Cookie.set(auth.API.TOKEN_KEY, jwt) // saving token in cookie for server rendering

                    await this.addAuthToken(jwt)

                    try {
                      // await vm.getUserObjects('getUserObjects') // - User don't have any data on server yet, there is no reason to try to get user data or stored creditcards

                      let authService = new AuthService(vm.$store)
                      authService.setAuthToken(jwt)
                      await authService.tryUpdateShippingAddress()

                    } catch (e) {
                      console.log(e) // We can ignore if we can't get this info
                    }

                    if (this.$route.query.next !== undefined) {
                      this.$router.replace({path: decodeURIComponent(this.$route.query.next)})

                    } else if (this.$route.query.redirect !== undefined) {
                      this.$router.replace({path: decodeURIComponent(this.$route.query.redirect)})

                    } else {
                      this.$router.replace({path: '/'})
                    }

                } catch (e) {
                  console.log('Error on Register', JSON.stringify(e))
                  vm.handleApiError(e, { alertMessage: 'Ops!, verifique o Problema Abaixo'})
                }

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
    .input-field {
      position: relative;
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
</style>
