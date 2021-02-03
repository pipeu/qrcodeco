<template>
    <div class="pip-login page">
        <div class="container">
            <div class="pipeu-conta card">
              <div class="back"><nuxt-link to="/"><i class="material-icons prefix">arrow_back</i></nuxt-link></div>
                <nuxt-link to="/">
                    <img :src="getStore().properties.logoURL" :alt="getStore().name" style="height: 120px; width: auto;">
                </nuxt-link>

                <h1>Olá, Acesse sua conta</h1>

                <PipInput component-name="email" type="email" label-desc="Email" v-model="email" tabindex="1"></PipInput>
                <PipInput @on-enter="login" component-name="pass" type="password" label-desc="Senha" v-model="pass" tabindex="2"></PipInput>

                <PipErrorIndicator componentName="message"></PipErrorIndicator>

                <p><a href="/myaccount/pass/forgot">Esqueceu sua senha</a></p>
                <PipButton type="large" :disabled="isProcessing" @click="login">Entrar</PipButton>
                <p style="font-size: 16px; margin:30px 0 0;">Não têm Conta? <nuxt-link style="font-weight: 400; text-transform: uppercase"  :to="'/Register?redirect=' + redirectPage">Crie sua conta.</nuxt-link></p>

            </div>
        </div>
    </div>
</template>

<script>
    import HeaderPipeu from '../components/HeaderPipeu'
    import FooterPipeu from '../components/FooterPipeu'
    import auth from '~/store/auth.js'
    import {mapMutations, mapGetters, mapActions} from 'vuex'
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import PipInput from '@/components/pipeu/common/PipInput'
    import PipErrorIndicator from '@/components/pipeu/common/PipErrorIndicator'
    import AuthService from '@/services/AuthService'
    import PipButton from "../components/pipeu/common/PipButton";
    import Cookie from "js-cookie"

    export default {
        name: 'Login',
        mixins: [basicuicomponent],
        data () {
            return {
                email: '',
                pass: '',
                redirectPage: '/'
            }
        },
       components: {
          PipButton, HeaderPipeu, FooterPipeu, PipInput, PipErrorIndicator
       },
        created: function () {
            if (this.$route.query.next) {
                this.redirectPage = this.$route.query.next
            }
        },

        mounted: function () {
            // setTimeout(function() {
            //   // after 1000 ms we add the class animated to the login/register card
            //   $('.card').removeClass('card-hidden');
            // }, 700)
            this.attachComponents()
        },

        methods: {
            ...mapActions(['addUserAccount']),
            ...mapGetters(['getStore', 'getUserAccount', 'getDomain'
            ]),
            async login () {
                let vm = this
                // vm.deb('Login.vue ### login email:' + this.email + ' pass:' + this.pass)

                try {
                  let authService = new AuthService(vm.$store)
                  let response = await authService.login(this.email, this.pass)
                  // console.log('Login.vue login response:', response)

                  // #feature_13 - SDAR (Store Domain Admin Redirect), means some Store Admin wants to login on Admin App
                  // If he is under pipeu.co domain for instance he is redirect to his custom domain admin app URL, ie mystore.pipeu.co/app
                  if (this.$route.query.SDAR !== undefined && this.$route.query.SDAR.length > 0) {
                      // console.log('@@@@@ login SDAR param, redirecting Admin to his custom domain admin app:', this.$store.getters.getStore.url + decodeURIComponent(this.$route.query.SDAR))

                      if (process.env.NODE_ENV === 'development') {
                          window.location = 'http://localhost:8081' + decodeURIComponent(this.$route.query.SDAR) + '?stId=' + vm.$store.getters.getStore.id

                      } else {
                          window.location = 'https://' + window.location.hostname  + decodeURIComponent(this.$route.query.SDAR) + '?stId=' + vm.$store.getters.getStore.id
                      }

                  } else if (this.$route.query.next !== undefined) {
                      // console.log('### redirecting to nextRouter')
                      this.$router.replace({path: decodeURIComponent(this.$route.query.next)})

                  // 11/10/19 - if ATA (Attach Token Alias) means ser logged with success and wanna to be redirected to another domain with token alias to retrieve there and login again (Single Sign On simulation)
                  } else if (this.$route.query.ATA !== undefined && this.$route.query.eredirect !== undefined) {
                      // console.log('ATA redirect, getting temp alias token and then redirect')

                      auth.getTempAliasToken().then((res) => {
                          // console.log('### Return getTempAliasToken', res)
                          let resData = res.data

                          if (process.env.NODE_ENV === 'development') {
                              Cookie.set(auth.API.TOKEN_KEY, '') // saving token in cookie for server rendering
                          }
                          window.location.href = decodeURIComponent(this.$route.query.eredirect) + '?AT=' + resData.data.aliasToken

                      },(error) => {
                          console.log('error on goToStore ',error)
                      })

                  } else if (this.$route.query.eredirect !== undefined) {
                      window.location = decodeURIComponent(this.$route.query.eredirect)

                  } else {
                      this.$router.replace({ path: '/' })
                  }
                } catch (e) {
                  // console.log('error on Login.vue', JSON.stringify(e))
                  vm.handleApiError(e)
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
    width: 140px;
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
