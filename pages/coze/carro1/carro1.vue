<!--This Page render any kind or Resource: Page, Merchand, Store, Vendor / resource under https://storename.com.br/[RESOURCE_NAME]-->
<template>
  <div>
    .
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'carro1',

  data: function () {
    return {
    }
  },

  head () {
    return {
      // title: this.getStore.name + ' - ' + this.currentPage.name,
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'https://static.pipeu.co/clients/cozinha/images/icons/icon-72x72.png' },
        { rel: 'canonical', href: this.fullUrlPath } // Very Important: 13/10/2020 - Use canonical to inform search engines which domain and pages are the correct to index duplicated content (cozinha.com.br and coze.com.br co-existing domains)
      ]
    }
  },

  methods: {
    ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getProductsByDetailPageURL', 'getPageByAliasCodeUrl'])
  },

  middleware ({ redirect }) {
    console.log('middleware carro1 redirecting to coze.com.br')
    return redirect('https://coze.com.br');
  },

  async asyncData ({ store, params, query, route, req, error, redirect }) {
    console.log('carro1.vue async data params.pending:', params.pending)
    console.log('carro1.vue async data => route.path:', route.path)


    // // TODO: Check server side to verify if need add canonical or not to inform search engines about duplicated content
    // let fullUrlPath = 'https://coze.com.br' + route.path
    // console.log(' canonical fullUrlPath', fullUrlPath)
    //
    // if (1 === 1) {
    //   console.log('redirecting...')
    //   redirect('/checkoutPayment?tokenId=' + params.pending)
    //   return
    // }

    return {
    }

  },

  async created () {
  },

  async mounted () {
    if (process.client) {
    }
  }

}
</script>
