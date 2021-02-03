<template>
    <div v-if="mounted">

        <HeaderPipeu></HeaderPipeu>

        <!--@!@!@! ATTENTION -->
        <!-- 17/08/18 - SEEMS TO BE A BUG IN VUE reported by the community -->
        <!-- In some cases as bellow v-if doesn't work when ssr return spa to be mounted in client, resulting in vnode erros -->
        <!-- For this reason we'are using v-show here when we needed v-if -->
        <template v-show="events.length > 0">
            <AllEventsSection v-if="events" :sectionValue="events"></AllEventsSection>
        </template>

        <!--02/08/18 - Disabled until we finish Pages - Events and CMS features   -->
        <template v-show="currentPage">
            <PageSectionsRender v-if="currentPage" :currentPage="currentPage"></PageSectionsRender>
        </template>

        <template v-show="eventFromAPI">
            <EventSection v-if="eventFromAPI" :event="eventFromAPI"></EventSection>
        </template>

        <FooterPipeu></FooterPipeu>

    </div>
</template>

<script>
    /* eslint-disable indent,no-trailing-spaces,eqeqeq,space-infix-ops */
    /* 17/08/18 - this Component is specialized in render Events in the following scenarios:
        1) /eventos/ -> Get All Events from API and mount in blocks
        2) /eventos/event-name-url -> Try to locate a Page by url that will be rendered by PageSectionRender
        3) /eventos/event-name-url -> If a Page with the url is not located then try to locate an Event with this URL
    */
    import axios from 'axios'
    import {mapGetters} from 'vuex'
    import HeaderPipeu from '../../components/HeaderPipeu'
    import FooterPipeu from '../../components/FooterPipeu'
    import PageSectionsRender from '../../components/PageSectionsRender'
    import EventSection from '../../components/EventSection'
    import api from '@/pipeuapi/api'
    import AllEventsSection from '../../components/AllEventsSection'
    import moment from 'moment'
    export default {
        name: 'event',
        data: function () {
            return {
                currentPage: undefined,
                eventFromAPI: undefined,
                events: undefined,
                mounted: false
            }
        },
        props: {
            event: {
                type: Object,
                default: function () {
                    return { }
                }
            },
            id: Number
        },
        components: {
            AllEventsSection,
            EventSection,
            HeaderPipeu,
            FooterPipeu,
            PageSectionsRender
        },
        async asyncData ({ store, params, query, route, req, error }) {
            console.log('                                                       ')
            console.log('['+moment().format('L HH:mm')+']' + '_event.vue async data')
            console.log('                                                       ')

            let pageToQuery = route.path

            let selectedPage
            let eventFromAPI
            let events

            if (pageToQuery == '/eventos/' || pageToQuery == '/eventos') {
                console.log('### /eventos/ URL, getting all Events :')
                let resEvents = await api.getAllEvents()
                events = resEvents.data
                // console.log('events:', events)
            } else {
                console.log('### Event URL to be get param.event::', pageToQuery)
                // console.log('params _event[page] param.event:', params.event)
                selectedPage = store.getters.getPageByAliasCodeUrl(params.event) // 'home' for instance
                // <!--02/08/18 - Disabled until we finish Pages - Events and CMS features   -->

                try {
                    if (!selectedPage) {
                        console.log('### getting Page from PagesServcies CMS')

                        let returnData = await axios.get('/pages/getbyalias?alias=' + pageToQuery)
                        console.log('returnData ' + '/pages/getbyalias?alias=' + pageToQuery, returnData)

                        selectedPage = returnData.data
                    }
                } catch (e) {
                    console.log('Page not found on PagesServcies CMS')// ,e
                }

                try {
                    if (!selectedPage) {
                        console.log('### Page not found on PageServices CMS, getting just Event from API')

                        let returnData = await axios.get('/events/getbyalias?alias=' + pageToQuery)
                        // console.log('returnData ' + '/events/getbyalias?alias=' + pageToQuery, returnData)

                        eventFromAPI = returnData.data
                    }
                } catch (e) {
                    console.log('index vue error on - Event not found on EventAPI')// e,
                }
            }

            if (!selectedPage && !eventFromAPI && !events) {
                return error({ statusCode: 404, message: 'Evento não encontrado !' })
            }

            // console.log('selectedPage', selectedPage)
            return {
                currentPage: selectedPage,
                eventFromAPI: eventFromAPI,
                events: events,
                mounted: true
            }
        },

        created () {
            console.log('### _event.created')
        },

        beforeCreate () {
            console.log('### _event.vue - beforeCreate')
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
<style scoped>
    .breadcrumb {
        margin: 0;
    }
    .breadcrumb .breadcrumb-item {
        font-size: 14px;
    }
</style>
