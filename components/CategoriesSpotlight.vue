<template>
    <div v-if="section">
        <div class="row" style="padding-left: 20px;">
            <div v-for="(item, key, index) in section.items" class="col">
                <span style="padding-right: 10px;" v-if="key > 0">|</span>
                <a :href="'#scroll-group-' + item.href">{{item.title}}</a>
            </div>
        </div>
    </div>
</template>


<script>
    /* eslint-disable indent */
    import {mapState, mapActions} from 'vuex'

    export default {
        name: 'CategoriesSpotlightSection',

        props: {
            sectionValue: {
                type: Object,
                default: function () {
                    return { }
                }
            },
            id: Number
        },

        data () {
            return {
              section: {}
            }
        },

        computed: {

        },

        methods: {
            goToPage (page) {
                console.log('### goToPage page', page)
                window.location = page
            },
        },

        // NOTE: On element creation we just can receive data in lower case like customdata or userlogged, customData or userLogged won't work
        created () {
            // console.log('###### created CategoriesSpotlight this.sectionValue', this.sectionValue)
            if (this.sectionValue && this.sectionValue.sectionValue) {
              this.section = JSON.parse(this.sectionValue.sectionValue)
            }
            // console.log('###### this.section', this.section)
        },
        mounted () {
            if (process.client) {

            }
        }
    }
</script>

<style scoped>
</style>
