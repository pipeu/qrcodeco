<template>
  <div>

    <client-only>
      <vue-star></vue-star>
      <PipSnackBar></PipSnackBar>
    </client-only>

    <template v-if="store && store.templateDemo">

      <div class="pip-center" style="background-color: orange; margin: 0px;">
        <p style="color: white; padding: 10px; margin: 0px;">Este é um Site de Demonstração do PipeU</p>
      </div>

    </template>

    <!--<template v-if="store && !store.published && isAdmin()">-->
      <!--<div class="pip-center" style="background-color: #002c4b; margin: 0px; color: white; padding: 10px; margin: 0px;">-->
        <!--Atenção: Sua Loja ainda não foi Publicada, somente você (Administrador) consegue visualizar-->
        <!--&lt;!&ndash;<button @click="publishStore()">Publicar</button>&ndash;&gt;-->
      <!--</div>-->
    <!--</template>-->
    <!--<template v-else-if="store && store.published && isAdmin()">-->
      <!--<div id="storePublishNotification" class="pip-center" style="background-color: #002c4b; margin: 0px; color: white; padding: 10px; margin: 0px;">-->
        <!--Atenção: Sua Loja esta no Ar !-->
        <!--&lt;!&ndash;<button @click="unPublishStore()">Remover do Ar</button>&ndash;&gt;-->
      <!--</div>-->
    <!--</template>-->

    <template v-if="store && store.published"><!--|| isAdmin()-->
      <nuxt/>
    </template>
    <template v-else>
      `
    </template>

    <!--<FooterPipeu></FooterPipeu>-->
  </div>
</template>

<script>

/* eslint-disable */
import {mapState, mapMutations, mapGetters} from 'vuex'
import auth from '~/store/auth.js'
import VueStar from '@/components/common/VueStar'
import { eventHub } from '@/utils/eventHub'
import FooterPipeu from "../components/FooterPipeu";
import PipSnackBar from "../components/pipeu/common/PIpSnackBar";

export default {
  components: {
    PipSnackBar,
    FooterPipeu,
    VueStar
  },
  computed: {
    ...mapState({
      store: state => state.store,
      userAccount: state => state.userAccount
    })
  },

  head () {
      return {
          link: [
              { rel: 'stylesheet', href: this.pipeuCSSFile },
          ]
      }
  },

  data: function () {
      return {
          pipeuCSSFile: ''
      }
  },

  async asyncData ({ store, params, query, route, req, error }) {
      console.log('### default.vue - asyncData store.getters.getStore:', store.getters.getStore)
      console.log('### Getting store custom css if exists')
      let pipeuStore = store.getters.getStore
  },

  created () {
    // console.log('###### default.vue - created hook store.getters.getStore')
    let vm = this

    if (vm.getStore().properties.customCSSURL) {
        // console.log('setting custom default CSS:', vm.getStore().properties.customCSSURL)
        vm.pipeuCSSFile = vm.getStore().properties.customCSSURL
    } else {
        // console.log('setting default Pipeu CSS')
        this.pipeuCSSFile = 'https://pipeu-us.s3.amazonaws.com/assets/css/pipeu.css' // default css
    }

    if (process.client) {
      eventHub.$on('before-request', vm.beforeRequest)
      eventHub.$on('request-error',  vm.requestError)
      eventHub.$on('after-response', vm.afterResponse)
      eventHub.$on('response-error', vm.responseError)

      // setTimeout(function() {
      //   document.getElementById('storePublishNotification').remove();
      // }, 4500)
    }
  },

  beforeDestroy () {
    if (process.client) {
      eventHub.$off('before-request')
      eventHub.$off('request-error')
      eventHub.$off('after-response')
      eventHub.$off('response-error')
    }
  },

  methods: {
    ...mapGetters(['getStore']),
    ...mapMutations(['setStore']),

    beforeRequest () {
      let vm = this
      vm.toggleProcessing()
    },

    requestError () {
      let vm = this
      vm.toggleProcessing()
    },

    afterResponse () {
      let vm = this
      vm.toggleProcessing()
    },
    responseError () {
      let vm = this
      vm.toggleProcessing()
    },

    // 30/08/18 - set state in Store saying some request start or finish an api request
    toggleProcessing () {
      this.$store.commit('toggleProcessing')
    },

    unPublishStore () {
        let vm = this
        auth.unPublishStore().then((res) => {
            console.log('auth.unPublishStore ', res.data)
            vm.setStore (res.data)
            vm.$toast.error('Sua Loja esta OffLine !')
        }, (error) => {
            if (error.response) {
                let errors = error.response.data.errors
                if (error.response.data.message) {
                    vm.$toast.error(error.response.data.message)
                }
            }
        })
    },

    publishStore () {
      let vm = this
      auth.publishStore().then((res) => {
          console.log('auth.publishStore ', res.data)
          vm.setStore (res.data)
          vm.$toast.success('A Loja Agora esta OnLine !')
      }, (error) => {
          if (error.response) {
              let errors = error.response.data.errors
              if (error.response.data.message) {
                  vm.$toast.error(error.response.data.message)
              }
          }
      })
    }
  }
}
</script>
