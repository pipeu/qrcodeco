<template>
    <div>
        <div>Pagina: {{$route.params.subPage}}</div>
    </div>
</template>

<script>
    /* eslint-disable indent */
    import {mapGetters} from 'vuex'

    export default {
        name: 'subPage',
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
            console.log('subPage.vue async data ')
            // console.log('subPage params.page:', params.subPage)
        },

        async created () {
            // console.log('### subPage.created')
        },

        async mounted () {
            // const a = await import('assets/js/a.js')
            // a.whatever()
            if (process.client) {
                // console.log('running on Browser, initing clientSide scripts')
            }
        },

        methods: {
            ...mapGetters([
                'getStore', 'getUserAccount', 'getDomain, getProductsByDetailPageURL, getPageByAliasCodeUrl'
            ])
        }
    }
</script>
