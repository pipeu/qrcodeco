<template>
    <!-- KONTATO DISABLED - TODO: Parametrizar e put in a component -->
    <!-- <script src="https://s3.amazonaws.com/pipeu-us/product-box/1.0.30/pipeu-embeded-loader-1-0-30v1.js?tag=chat-embeded&domain=localhost&storeid=80&customparameters={'nickname':'','ip':'201.81.169.188'}&email=lffcbr33@hotmail.com&fullname=pat" charset="utf-8"></script>-->
    <div v-if="chatEnabled" class="chat-total-circle">
        <div class="pip-tooltip">
            <a :href="'https://wa.me/'+ getStore().properties.jsonValue.whatsAppNumber + '?text=Oi,%20estou%20interessado%20em%20saber%20mais%20sobre%20o%20' + getStore().name" target="_blank">
                <img src="https://static.pipeu.co/clients/cozinha/images/whatsapp.svg" class="pip-chat-dog">
            </a>
    <!--                    <span class="pip-tooltiptext">Atendimento via WhatsApp</span>-->
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    import { eventHub } from '@/utils/eventHub'
    import {mapGetters} from 'vuex'

    export default {
        name: 'Chat',
        data () {
            return {
                chatEnabled: false
            }
        },
        created () {
            eventHub.$on('show-chat', () => {
                this.chatEnabled = true
            })
            eventHub.$on('hide-chat', () => {
                this.chatEnabled = false
            })
        },
        mounted () {
            if (this.getStore() && this.getStore().properties && this.getStore().properties.jsonValue) {
                if (this.getStore().properties.jsonValue.chatEnabled) {
                    this.chatEnabled = true
                }
            }
        },
        beforeDestroy () {
            eventHub.$off('show-chat')
            eventHub.$off('hide-chat')
        },
        methods: {
            ...mapGetters(['getStore', 'getUserAccount']),

            openChat: function () {
                // emit an event to chat component open.
                console.log('#OPENCHAT emit')
                // chat.bus.$emit('open-chat-by-page')

                // Send event to marketing integrations saying use hit chat Button
                this.sendMarketingEvent({
                    event: 'click_chat_button'
                })
            }
        }
    }
</script>
<style scoped>
    .chat-total-circle {
        /*width: 70px;*/
        /*height: 70px;*/
        /*position: fixed;*/
        /*bottom: 7px;*/
        /*right: 7px;*/
        /*background-color: #fff;*/
        /*text-align: center;*/
        /*!*box-shadow: 0 0 10px 0 rgba(0,0,0,0.3);*!*/
        /*-webkit-border-radius: 50px;*/
        /*border-radius: 50px;*/
        /*z-index: 1000;*/
        /*color: #fff;*/
    }

    .pip-tooltip {
        cursor: pointer;
        position: relative;
        display: inline-block;
    }

    .chat-total-circle img {
        height: 35px;
        padding-top: 5px;
    }

    .pip-chat-dog {
        /*width: 60px;*/
        /*height: 60px;*/
        -webkit-filter: drop-shadow(1px 1px 2px rgb(0,0,0,0.5));
        filter: drop-shadow(1px 1px 2px rgb(0,0,0,0.5));
        margin-top: 5px;
    }

    img {
        border: 0px;
    }

    img {
        border: 0px;

    }
    .pip-tooltip .pip-tooltiptext {
     visibility: hidden;
     width: 100px;
     background-color: #ca386a;
     color: #fff;
     text-align: center;
     border-radius: 6px;
     padding: 5px 0;
     position: absolute;
     z-index: 1;
     top: -50px;
     left: -17px;
     }
</style>
