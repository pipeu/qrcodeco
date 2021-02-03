<template>
    <div v-if="mounted">

        <HeaderPipeu></HeaderPipeu>

        <!--@!@!@! ATTENTION -->
        <!-- 17/08/18 - SEEMS TO BE A BUG IN VUE reported by the community -->
        <!-- In some cases as bellow v-if doesn't work when ssr return spa to be mounted in client, resulting in vnode erros -->
        <!-- For this reason we'are using v-show here when we needed v-if -->
        <template v-show="subscriptions.length > 0">

            <!--v-if="subscriptions"-->
            <component :is="allSubscriptionsPlansSection" :sectionValue="subscriptions"/>


        </template>



        <!--02/08/18 - Disabled until we finish Pages - Events and CMS features   -->
        <!--Here we can have in future a highly customized Page made on CMS with the subscription plan details and store customization-->
        <!--<template v-show="currentPage">-->
            <!--<PageSectionsRender v-if="currentPage" :currentPage="currentPage"></PageSectionsRender>-->
        <!--</template>-->

        <!-- Here we can handle in future a Subscripiton Plan in a detailed Page like _product or _subscription-->
        <!--<template v-show="eventFromAPI">-->
            <!--<EventSection v-if="eventFromAPI" :event="eventFromAPI"></EventSection>-->
        <!--</template>-->





        <FooterPipeu></FooterPipeu>

    </div>
</template>

<script>
    /* eslint-disable indent,no-trailing-spaces,eqeqeq,space-infix-ops */

    /* 17/08/18 - this Component is specialized in render Events in the following scenarios:
        1) /assinaturas/ -> Get All Subscriptions from API and mount in blocks
        // TODO: bellow is not implemented yet
        2) /assinaturas/event-name-url -> Try to locate a Page by url that will be rendered by PageSectionRender
        3) /assinaturas/event-name-url -> If a Page with the url is not located then try to locate an Event with this URL
    */

    import {mapGetters} from 'vuex'
    import HeaderPipeu from '../../components/HeaderPipeu'
    import FooterPipeu from '../../components/FooterPipeu'
    import PageSectionsRender from '../../components/PageSectionsRender'
    import EventSection from '../../components/EventSection'
    import api from '@/pipeuapi/api'

    import moment from 'moment'

    export default {
        name: 'subscriptions',
        data: function () {
            return {
                // currentPage: undefined,
                // eventFromAPI: undefined,
                subscriptions: undefined,
                mounted: false
            }
        },

        props: {
            subscription: { // this will hold url param because this page is a _subscription dynamic page
                type: Object,
                default: function () {
                    return { }
                }
            },
            id: Number
        },

        components: {
            EventSection,
            HeaderPipeu,
            FooterPipeu,
            PageSectionsRender
        },

        async asyncData ({ store, params, query, route, req, error }) {
            console.log('                                                       ')
            console.log('['+moment().format('L HH:mm')+']' + '_subscription.vue async data')
            console.log('                                                       ')

            let pageToQuery = route.path

            // let selectedPage
            // let eventFromAPI
            let subscriptions

            if (pageToQuery == '/assinaturas/' || pageToQuery == '/assinaturas') {
                console.log('### /assinaturas/ URL, getting all Subscriptions :')

                let resEvents = await api.getPlansActive()

                subscriptions = resEvents.data
                // console.log('subscriptions:', subscriptions)
            } else {
                // console.log('### Event URL to be get param.event::', pageToQuery)
                // console.log('params _subscription[page] param.event:', params.event)
                // selectedPage = store.getters.getPageByAliasCodeUrl(params.event) // 'home' for instance
                // <!--02/08/18 - Disabled until we finish Pages - Events and CMS features   -->

                // try {
                //     if (!selectedPage) {
                //         console.log('### getting Page from PagesServcies CMS')
                //         let returnData = await axios.get('/pages/getbyalias?alias=' + pageToQuery)
                //         console.log('returnData ' + '/pages/getbyalias?alias=' + pageToQuery, returnData)
                //
                //         selectedPage = returnData.data
                //     }
                // } catch (e) {
                //     console.log('Page not found on PagesServcies CMS')// ,e
                // }
                //
                // try {
                //     if (!selectedPage) {
                //         console.log('### Page not found on PageServices CMS, getting just Event from API')
                //         let returnData = await axios.get('/plans/getbyalias?alias=' + pageToQuery)
                //         // console.log('returnData ' + '/events/getbyalias?alias=' + pageToQuery, returnData)
                //         eventFromAPI = returnData.data
                //     }
                // } catch (e) {
                //     console.log('index vue error on - Event not found on EventAPI')// e,
                // }

            }

            if (!subscriptions) { // !selectedPage && !eventFromAPI &&
                return error({ statusCode: 404, message: 'Não existem Planos de Assinaturas disponíveis !' })
            }

            // console.log('selectedPage', selectedPage)
            return {
                // currentPage: selectedPage,
                // eventFromAPI: eventFromAPI,
                subscriptions: subscriptions,
                mounted: true
            }
        },

        created () {
            console.log('### _subscription.created')

            this.allSubscriptionsPlansSection = () => import(`~/components/AllSubscriptionsPlansSection`)
        },

        beforeCreate () {
            console.log('### _subscription.vue - beforeCreate')
        },

        mounted () {
            // const a = await import('assets/js/a.js')
            // a.whatever()
            if (process.client) {
                console.log('running on Browser, initing clientSide scripts')
            }
        },
        methods: {
            ...mapGetters([
                'getStore', 'getUserAccount', 'getDomain, getProductsByDetailPageURL, getPageByAliasCodeUrl'
            ])
        }
    }
</script>
