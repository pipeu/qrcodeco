<template>
    <div>
        <HeaderPipeu></HeaderPipeu>

        <template v-show="stores.length > 0">
          <AllStoresSection v-if="stores" :sectionValue="stores"></AllStoresSection>
        </template>

        <template v-if="store">

            <div class="navbar-header">
                <nuxt-link to="/" class="navbar-brand">
                    {{store.name}}
                </nuxt-link>
            </div>

            <template v-if="storeHomePage">
                <PageSectionsRender :currentPage="storeHomePage"></PageSectionsRender>
            </template>


        </template>

        <!--<template v-else>-->
            <!--Loja não Encontrada-->
        <!--</template>-->

        <FooterPipeu></FooterPipeu>
    </div>
</template>

<script>
    /* eslint-disable indent */
    import {mapGetters} from 'vuex'
    import HeaderPipeu from '../../components/HeaderPipeu'
    import FooterPipeu from '../../components/FooterPipeu'
    import PageSectionsRender from '../../components/PageSectionsRender'
    import axios from 'axios'
    import api from '@/pipeuapi/api.js'
    import AllStoresSection from "../../components/AllStoresSection";

    export default {
        name: 'store',
        data: function () {
            return {
                stores: [],
                store: {},
                storeHomePage: {}
            }
        },

        props: {
            id: Number
        },

        async asyncData ({ store, params, query, route, req, error }) {
            // console.log('_store.vue asyncData')
            // console.dir(params)
            // console.log('async data params.store:', params.store)

            try {

              let storePipeu
              let storeHomePage
              let stores

              // Get All Child stores belonging to the current Store
              if (route.path == '/lojas/' || route.path == '/lojas') {
                console.log('### /lojas/ URL, getting all Stores :')
                let resStores = await api.getChildStoresList()
                stores = resStores.data
                // console.log('stores:', stores)

              } else {
                // Get specific Store by name
                if (!storePipeu && params.store !== null && params.store !== 'null') {
                  console.log('### storePipeu not found on local user repository, getting from backend')
                  let returnData = await axios.get('/store/name/' + params.store)
                  storePipeu = returnData.data
                  console.log('>>> Returning axios.get store/name storePipeu:', storePipeu)

                }

                console.log('### storePipeu:', storePipeu)
                // Get Store home Page
                if (storePipeu) {
                  let returnPipeuStorePages = await axios.get('/pages/home/' + storePipeu.domain)
                  let storeStorePages = returnPipeuStorePages.data
                  storeHomePage = storeStorePages.homePage
                }
              }


              return {
                  stores: stores,
                  store: storePipeu,
                  storeHomePage: storeHomePage
              }

            } catch (e) {
              console.log('store.vue error on Getting store and pages', e)
              error({ statusCode: 404, message: 'Não foi possível carregar a Loja' })
            } finally {
            }
        },

        async created () {
            // console.log('### _store.created')
        },

        async beforeCreate () {
            // console.log('### _store.vue - beforeCreate')
        },

        async mounted () {
            // const a = await import('assets/js/a.js')
            // a.whatever()
            if (process.client) {
                console.log('store:', this.store)
                console.log('storeHomePage:', this.storeHomePage)
            }
        },

        components: {
          AllStoresSection,
            HeaderPipeu, FooterPipeu, PageSectionsRender
        },
        methods: {
            ...mapGetters([
                'getStore', 'getUserAccount', 'getDomain, getProductsByDetailPageURL, getPageByAliasCodeUrl'
            ])
        }
    }
</script>
