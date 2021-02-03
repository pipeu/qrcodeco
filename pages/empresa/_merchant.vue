<template>
    <div>

        <HeaderPipeu></HeaderPipeu>

        <!--<div>Product: {{$route.params.merchant}}</div>-->

        <template v-if="merchant">



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

            <p>Empresa não Encontrada</p>

        </template>

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

    export default {
        name: 'merchant',
        data: function () {
            return {
                merchant: {},
                merchantStorePages: {}
            }
        },

        props: {
            id: Number
        },

        async asyncData ({ store, params, query, route, req, error }) {
            console.log('_merchant.vue async data ')

            // console.dir(params)
            // console.dir(route)
            // console.dir(query)
            // console.dir(req)

            console.log('async data params.merchant:', params.merchant)

            let storeMerchant // = store.getters.getStore.id // .storeMerchandsByName[params.merchant] // 'home' for instance

            if (!storeMerchant) {
                console.log('### storeMerchant not found on local user repository, getting from backend')
                let returnData = await axios.get('/store/merchant/' + params.merchant)
                storeMerchant = returnData.data
            } else {
                console.log('### storeMerchant ' + params.merchant + ' found local')
            }
            console.log('### storeMerchant:', storeMerchant)

            let merchantStorePages = {}
            // let returnMerchantStorePages = await axios.get('/pages/home/' + storeMerchant.domain)
            // let merchantStorePages = returnMerchantStorePages.data
            // console.log('### returnMerchantStorePages.data', returnMerchantStorePages.data)

            return {
                merchant: storeMerchant,
                merchantStorePages: merchantStorePages
            }
        },

        async created () {
            console.log('### _merchant.created')
        },

        async beforeCreate () {
            console.log('### _merchant.vue - beforeCreate')
        },

        async mounted () {
            // const a = await import('assets/js/a.js')
            // a.whatever()
            if (process.client) {
                console.log('running on Browser, initing clientSide scripts')
            }
        },

        components: {
            HeaderPipeu, FooterPipeu, PageSectionsRender
        },
        methods: {
            ...mapGetters([
                'getStore', 'getUserAccount', 'getDomain, getProductsByDetailPageURL, getPageByAliasCodeUrl'
            ])
        }
    }
</script>
