<template>
    <div>
        <div :id="'CUSTOM_HTML_'+ customHtmlSection.id" v-html="customHtmlSection.sectionValue"> <!-- :style="customHtmlSection.style" -->
        </div>
    </div>
</template>
<script>
    /* eslint-disable indent */
    import {mapState} from 'vuex'
    export default {
        name: 'CustomHtmlSection',
        props: {
            customHtmlSection: {
                type: Object,
                default: function () {
                    return { }
                }
            },
            id: Number
        },
        computed: {
            ...mapState({
                counter: state => state.counter,
                store: state => state.store,
                userAccount: state => state.userAccount,
                userLogged: state => state.userLogged
            })
        }
    }
</script>

