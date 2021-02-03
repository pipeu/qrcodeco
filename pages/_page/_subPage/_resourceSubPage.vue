<template>
    <div>

        Aqui _resourceSubPage

        <div>_resourceSubPage: xxxx:{{$route.params.resourceSubPage}}</div>


    </div>
</template>

<script>
    /* eslint-disable indent */

    import {mapGetters} from 'vuex'

    export default {
        name: 'resourceSubPage',
        data: function () {
            return {
                currentPage: {}
            }
        },

        props: {
            subPage: {
                type: Object,
                default: function () {
                    return { }
                }
            },
            id: Number
        },

        async asyncData ({ store, params, query, route, req, error }) {
            // console.log('resourceSubPage.vue async data ')
            // console.log('resourceSubPage params.page:', params.resourceSubPage)
        },

        async created () {
            // console.log('### resourceSubPage.created')
        },

        async mounted () {
            // const a = await import('assets/js/a.js')
            // a.whatever()
            if (process.client) {
            }
        },

        // components: {
        //     HeaderPipeu, FooterPipeu
        // },
        methods: {
            ...mapGetters([
                'getStore', 'getUserAccount', 'getDomain, getProductsByDetailPageURL, getPageByAliasCodeUrl'
            ])
        }
    }
</script>
