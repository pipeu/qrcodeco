<template>

      <div  v-if="pageSection && pageSection.enabled" class="pip-login page">

        <div class="container">

          <div class="pipeu-conta card">


                <!-- 25/08/18 - TODO: Here in section we could receive CTA form mconfiguration, properteis and custom fields-->
                <div :style="pageSection.style">

                    <h1 v-if="pageSection.title">{{pageSection.title}}</h1>
                    <h2 v-if="pageSection.subTitle">{{pageSection.subTitle}}</h2>

                    <component :is="callToActionComponent"
                               :storeid="'' + store.id"
                               :domain="store.domain"
                               :emailto="store.emailSenderAddress"
                               :customparameters="getCustomParameters"
                               formtitle="Entre em Contato"
                               :fullname="getFullName"
                               :email="getEmail"
                    />

                    <!--Form fields, style, title and others can be customized in CTASection on PipeU API-->
                    <!--:customfields=""-->
                    <!--customparameters=[{'nickname':'vamobrazil08','ip':'192.xxx'}]&email=luiz@pixfly.com&fullname=Luiz Filipe"-->

                </div>
            </div>

        </div>

    </div>

</template>
<script>
    /* eslint-disable indent */
    import {mapState} from 'vuex'

    export default {
        name: 'CallToActionComponentRender',
        props: {
            pageSection: {
                type: Object,
                default: function () {
                    return { }
                }
            }
        },

        computed: {
            ...mapState({
                counter: state => state.counter,
                store: state => state.store,
                userAccount: state => state.userAccount,
                userLogged: state => state.userLogged
            }),
            getEmail () {
                if (this.userAccount && this.userAccount.email) {
                    return this.userAccount.email
                } else {
                    return ''
                }
            },
            getFullName () {
                if (this.userAccount && this.userAccount.fullName) {
                    return this.userAccount.fullName
                } else {
                    return ''
                }
            },
            getCustomParameters () {
                let customParameters = [{'source': 'pipeU'}]
                return JSON.stringify(customParameters)
            }
        },
        methods: {
        },
        async created () {
            let vm = this
            console.log('###### created CallToActionComponentRender')
            console.log('###### created CallToActionComponentRender pageSection:', vm.pageSection)

            if (vm.pageSection && vm.pageSection.enabled) {
                this.callToActionComponent = () => import(`~/components/common/ContactForm.vue`)
            }
        }

    }
</script>

