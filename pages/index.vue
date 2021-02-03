<template>
    <div>
    <template v-if="getDefaultPage && getDefaultPage.visible === true">
        <HeaderPipeu v-if="showHeaderFooter"></HeaderPipeu>

        <TopBar></TopBar>

        <PageSectionsRender :currentPage="getDefaultPage"></PageSectionsRender>

        <ProductsGroupListView v-if="$route.query.GROUPID" :propProductGroupId="$route.query.GROUPID"></ProductsGroupListView>

        <FooterPipeu v-if="showHeaderFooter"></FooterPipeu>

        </template>
    <template v-else>
      ``
    </template>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import HeaderPipeu from '../components/HeaderPipeu'
    import FooterPipeu from '../components/FooterPipeu'
    import PageSectionsRender from '../components/PageSectionsRender'
    import axios from 'axios'
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import ProductsGroupListView from "../components/ecommerce/ProductsGroupListView"
    import api from '@/pipeuapi/api.js'
    import { eventHub } from '@/utils/eventHub'
    import TopBar from '../components/TopBar';

    export default {
        name: 'index',
        mixins: [basicuicomponent],
        components: {
          TopBar,
            ProductsGroupListView,
            HeaderPipeu, FooterPipeu, PageSectionsRender
        },

        computed: {
            ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getDefaultPage'])
        },

        head () {
            return {
                title: this.getDefaultPage.name,
                meta: [
                        {
                            hid: `description`,
                            name: 'description',
                            content: this.getDefaultPage.description
                        },
                        {
                            hid: `keywords`,
                            name: 'keywords',
                            keywords: 'keywords here'
                        }
                ],
                link: [
                    { rel: 'manifest', href: this.getStore.id + '_manifest.json' },
                    { rel: 'icon', type: 'image/x-icon', href: 'https://static.pipeu.co/clients/cozinha/images/icons/icon-72x72.png' },
                    { rel: 'canonical', href: this.fullUrlPath } // Very Important: 13/10/2020 - Use canonical to inform search engines which domain and pages are the correct to index duplicated content (cozinha.com.br and coze.com.br co-existing domains)
                ]
            }
        },

        data: function () {
            return {
                clientMounted: false,
                showHeaderFooter: true,
                fullUrlPath: ''
            }
        },

        // @! Attention: In NuxtJS we dont have access to this instance in asyncData method
        async asyncData ({ store, params, query, route, req, error }) {
            // console.log('### asyncData index.vue')
            // console.log('index.vue store.getters.getDomain:', store.getters.getDomain)

            let fullUrlPath = 'https://coze.com.br' + route.path
            console.log(' canonical fullUrlPath', fullUrlPath)

            try {
                let includeFields = ''

                let pipeuStore = store.getters.getStore
                // console.log('pipeuStore on Vuex', pipeuStore)
                if (!pipeuStore) {
                  includeFields = '?includeFields=store'
                }

                let {data} = await axios.get('/pages/home/' + store.getters.getDomain + includeFields)

                let showHeaderFooter = true
                if (data.homePage.options && data.homePage.options.hasOwnProperty('showHeaderFooter')) {
                    showHeaderFooter = data.homePage.options.showHeaderFooter
                }

                store.commit('addPage', data.homePage)
                store.commit('setDefaultPage', data.homePage)

                if (!pipeuStore) {
                  pipeuStore = data.store
                  store.commit('setStore', data.store)
                }

                return {
                    showHeaderFooter: showHeaderFooter,
                    fullUrlPath: fullUrlPath
                }
            } catch (e) {
                console.log('index vue error on Getting store and pages', e)
                error({ statusCode: 404, message: 'Nossa equipe já foi acionada' })
            } finally {
            }
        },

        async mounted () {
            let vm = this
            if (process.client) {
            }

            ///// Continuar
            // TODO: Please, finish; create a lightbox informing that the new checkout was created based on the previous one
            if (this.$route.query.ORDERAGAIN) {
                let checkoutTokenId = this.$route.query.ORDERAGAIN

                console.log("### mounted ORDERAGAIN checkoutTokenId", checkoutTokenId);
                try {
                    let {data} = await api.duplicateCheckout(checkoutTokenId)
                    console.log("### return promisse api.duplicateCheckout data:", data);

                    // await vm.addCheckout(data)
                    await vm.$store.dispatch('addCheckout', data)

                    eventHub.$emit('show-pip-cart-checkout')

                }catch (e) {
                    this.handleApiError(e)
                }
            }
        }
    }
</script>
