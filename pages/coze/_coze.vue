<!--This Page render any kind or Resource: Page, Merchand, Store, Vendor / resource under https://storename.com.br/[RESOURCE_NAME]-->
<template>
  <div>
    .
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import axios from 'axios'

export default {
  name: 'coze',

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

  async middleware ({ redirect }) {
    console.log('middleware coze.com.br, calling api.qrcode to compute scan and then redirect...')

    try {
      let payload = {
        code: "https://qrcode.co/coze/loja",
        store_id: 100,
        store_name: "qrcodeco"
      }
      let {data} = await axios.put('https://api.qrcode.co/scan/increment', payload, {headers: {'Content-Type': 'application/json'}})
      console.log('response from increment scan', data)
    }catch (e) {
      console.log('error computing scan, continue...')
    }

    console.log('middleware redirecting to coze.com.br')
    return redirect('https://coze.com.br');
  },

  async asyncData ({ store, params, query, route, req, error, redirect }) {
    console.log('coze.vue async data params.pending:', params.pending)
    console.log('coze.vue async data => route.path:', route.path)


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
