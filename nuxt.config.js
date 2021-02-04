/* eslint-disable nuxt/no-cjs-in-config */
// import api from './pipeuapi/api.js'

module.exports = {
  mode: 'universal',
  loading: '~/components/loading.vue',
  /*
   ** Headers of the page
   */
  head: {
    title: 'QRCode.co',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Create your QRCode in a few steps' },
      { hid: 'keywords', name: 'keywords', content: 'generate qrcode' },
      { name: 'theme-color', content: '#ff2f38' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://static.pipeu.co/clients/cozinha/images/icons/icon-72x72.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }, // 27/09/18 - Materialize icons

      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css' },
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js', type: 'text/javascript'}
    ]
  },

  /*
   ** Global CSS
   */
  css: [],

  plugins: [
    {src: '~plugins/numeral.js'},
    {src: '~plugins/axios.js'},
    {src: '~plugins/nuxt-client-init.js', ssr: false}, // THIS HAS AN ORDER OF EXECUTION
    {src: '~plugins/vue-localstorage.js', ssr: false},
    {src: '~plugins/vue-js-modal'},
    {src: '~plugins/ga.js', mode: 'client'},
    {src: '~plugins/vue-gtm.js', mode: 'client'}
  ],

  env: {
    PIPEU_API_URL: 'https://pipeu.com.br/rest/api/1.0',
    PIPEU_COMMUNICATIONS_API_URL: 'https://07jeokz8u3.execute-api.us-east-1.amazonaws.com/prod/communications',

    // Dev Pipeu LocalHost - for tests
    // DEV_PIPEU_API_URL: 'http://localhost/rest/api/1.0',
    DEV_PIPEU_API_URL: 'https://pipeu.com.br/rest/api/1.0',

    DEVELOPMENT_STORE_DOMAIN: 'qrcode.co'
  },

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // process.env.NODE_ENV !== 'production' ? '@nuxtjs/eslint-module' :
    ''
  ].filter(Boolean),

  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/toast',
    ['@nuxtjs/pwa', { manifest: false }], // Disable auto generated manifest as we are providing for each store on index.vue dynamic manifest header
    'vue-sweetalert2/nuxt',
    '@nuxtjs/device' // Detect device type using request header
  ],

  workbox: {
    importScripts: [
      'custom-sw.js'
    ]
  },

  toast: {
    position: 'top-right',
    duration: 6000,
    iconPack: 'fontawesome'
  },

  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://qrcode.co',
    cacheTime: 1000 * 60 * 15,
    generate: false, // Enable me when using nuxt generate
    exclude: [
      '/secret',
      '/admin/**'
    ],
    routes: [
      '/coze/loja',
    ]

    // routes: async () => {
    //   const { data } = await api.getProductsQuery(7000,'','')
    //   return data.map((product) => `` + api.normalizeProductUrl(product.name, product.id) ) // `/cardapio/${product.name}`)
    // }

  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
