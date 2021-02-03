<!--This Page render any kind or Resource: Page, Merchand, Store, Vendor / resource under https://storename.com.br/[RESOURCE_NAME]-->
<template>
  <div>
    <HeaderPipeu></HeaderPipeu>

    <!--<div>Pagina: {{$route.params.page}}</div>-->

    <template v-if="currentPage">
        <PageSectionsRender :currentPage="currentPage"></PageSectionsRender>
    </template>

    <template v-else-if="store">
      <p>{{store.name}}</p>
      <p>{{store.url}}</p>

      <p>Carregar Store Aqui embaixo </p>
      <div class="navbar-header">
        <!--<a class="navbar-brand" v-bind:href="store.url">-->
        <!--<img :src="store.properties.logoURL" alt=""  style="height: 40px;"> -->
        <!--</a>-->

        <nuxt-link to="/" class="navbar-brand">
          <img :src="store.properties.logoURL" alt=""  style="height: 40px;">
        </nuxt-link>
      </div>

      <!-- @!@! Esta dando um erro fatal aqui no build para producao -->
      <!--<template v-if="merchantStorePages">-->

      <!--&lt;!&ndash; &ndash;&gt;-->
      <!--&lt;!&ndash; Merchand terá pages ? &ndash;&gt;-->
      <!--&lt;!&ndash; Acho q sim, pois sera como um site estatico da empresa &ndash;&gt;-->
      <!--&lt;!&ndash;<PageSectionsRender :currentPage="merchantStorePages"></PageSectionsRender>&ndash;&gt;-->
      <!--</template>-->

    </template>

    <template v-else-if="merchant">

      <p>{{merchant.name}}</p>
      <p>{{merchant.url}}</p>
      <p>{{merchant.city}} / {{merchant.state}}</p>

      <p>Carregar a Empresa Aqui embaixo </p>

      <div class="navbar-header">

        <!--<a class="navbar-brand" v-bind:href="store.url">-->
        <!--<img :src="store.properties.logoURL" alt=""  style="height: 40px;"> -->
        <!--</a>-->

        <nuxt-link to="/" class="navbar-brand">
          <img :src="merchant.properties.logoURL" alt=""  style="height: 40px;">
        </nuxt-link>
      </div>


      <!-- @!@! Esta dando um erro fatal aqui no build para producao -->
      <!--<template v-if="merchantStorePages">-->

      <!--&lt;!&ndash; &ndash;&gt;-->
      <!--&lt;!&ndash; Merchand terá pages ? &ndash;&gt;-->
      <!--&lt;!&ndash; Acho q sim, pois sera como um site estatico da empresa &ndash;&gt;-->
      <!--&lt;!&ndash;<PageSectionsRender :currentPage="merchantStorePages"></PageSectionsRender>&ndash;&gt;-->

      <!--</template>-->

    </template>

    <template v-else>
      Pagina não Encontrada
    </template>

    <FooterPipeu></FooterPipeu>

  </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import HeaderPipeu from '../components/HeaderPipeu'
    import FooterPipeu from '../components/FooterPipeu'
    import PageSectionsRender from '../components/PageSectionsRender'
    import axios from 'axios'

    export default {
        name: 'page',

        components: {
          HeaderPipeu, FooterPipeu, PageSectionsRender
        },

        data: function () {
            return {
                currentPage: {},
                store: {},
                merchant: {},
                fullUrlPath: ''
            }
        },

        props: {
            page: {
                type: Object,
                default: function () {
                    return { }
                }
            },
            id: Number
        },

        head () {
          return {
            // title: this.getStore.name + ' - ' + this.currentPage.name,
            meta: [
              {
                hid: `description`,
                name: 'description',
                content: this.currentPage.description
              }
            ],
            link: [
              { rel: 'icon', type: 'image/x-icon', href: 'https://static.pipeu.co/clients/cozinha/images/icons/icon-72x72.png' },
              { rel: 'canonical', href: this.fullUrlPath } // Very Important: 13/10/2020 - Use canonical to inform search engines which domain and pages are the correct to index duplicated content (cozinha.com.br and coze.com.br co-existing domains)
            ]
          }
        },

        methods: {
          ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getProductsByDetailPageURL', 'getPageByAliasCodeUrl'])
        },

        async asyncData ({ store, params, query, route, req, error }) {
            console.log('page.vue async data params.page:', params.page)
            console.log('page.vue async data => route.path:', route.path)

            let resourceName = route.path
            let page
            let storeObject
            let storeMerchant

            // TODO: Check server side to verify if need add canonical or not to inform search engines about duplicated content
            let fullUrlPath = 'https://coze.com.br' + route.path
            console.log(' canonical fullUrlPath', fullUrlPath)


            //TODO: Move this business rule to server side
            if (resourceName && resourceName !== '/' && params.page !== '__webpack_hmr') { // Handle dev hot reloading
                  console.log(`### resource ${resourceName} not found on local user repository, getting from backend:`)

                  try {
                    let {data} = await axios.get('/pages/getbyalias?alias=' + resourceName)
                    // console.log('>>> Found Page on backend...:', data)
                    page = data
                  } catch (e) {
                    console.log('_page.vue page not found on api')
                  }

                  try {
                    if (!page) { // If no page with the resource name was found on server try to find a merchand by name
                      console.log('### trying to find Store on api with resource name:', resourceName.replace('/', ''))
                      let {data} = await axios.get('/store/name/' + resourceName.replace('/', ''))
                      storeObject = data
                      // console.log('>>> Store found on backend...:', data)
                    }
                  } catch (e) {
                    console.log('store not found on api')
                  }
                  try {
                      if (!page && !storeObject) { // If no page with the resource name was found on server try to find a merchand by name
                        console.log('### trying to find merchand on api with resource name params.merchant:', resourceName.replace('/', ''))
                        let {data} = await axios.get('/store/merchant/' + resourceName.replace('/', ''))
                        storeMerchant = data
                        console.log('>>> Merchand found on backend...:', data)
                      }
                    } catch (e) {
                      console.log('merchant not found on api')
                    }
              }

              // if (!page && !storeMerchant) {
              //   console.log('_page.vue vue error on Getting page')
              //   error({ statusCode: 404, message: 'Essa página parece não existir !' })
              //   return
              // }
              return {
                    currentPage: page,
                    store: storeObject,
                    merchant: storeMerchant,
                    fullUrlPath: fullUrlPath
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
