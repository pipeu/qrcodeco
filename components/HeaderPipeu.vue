<template>
  <header v-if="store && !isFullScreen">

    <nav :style="headerBackground">

      <div class="nav-wrapper">

        <template v-if="!userAccount">
          <nuxt-link to="/login" class="right" style="margin: 0 18px;"><i class="material-icons">person</i></nuxt-link>
        </template>

        <template v-if="returnPath">
          <ul>
            <li>
              <nuxt-link :to="returnPath">
                <i class="material-icons left">arrow_back</i>
                <div v-if="title" class="nav-title">{{title}}</div>
              </nuxt-link>
            </li>
          </ul>
        </template>
        <template v-else>
          <a href="#" data-target="slide-out" class="sidenav-trigger hide-on-large-only"><i class="material-icons">menu</i></a>
        </template>

        <template v-if="!returnPath">
          <div class="brand-logo">
            <img @click="goToHome()" :src="headerFooterLogoURL" :style="headerBrand()" style="margin-right: 10px; vertical-align: middle; margin: 17px 0;">
          </div>
        </template>

        <template v-if="userAccount">
          <ul class="right hide-on-med-and-down"><!-- Header icons and menu-->
            <li>
              <a data-target="slide-out" class="sidenav-trigger">
                <span><img :src="getUserProfilePhoto(getUserAccount)" alt="" width="30" height="30" style="border-radius: 50%; margin-top: 15px;"></span>
                <i class="material-icons right" style="margin-left: 0px;">arrow_drop_down</i>
              </a>
            </li>
          </ul>
        </template>

        <ul v-if="menu && menu.enabled" class="right hide-on-med-and-down"><!-- customer desktop menu -->
          <li class="nav-item" v-for="(itemMenu, key, index) in menu.items">
            <a class="nav-link" v-bind:href="itemMenu.a.href">{{itemMenu.a.name}}</a>
          </li>
        </ul>

        <ul v-if="showCartIcon && getCheckout && !isPlanSubscriptionCheckout" class="right">
          <li><a @click="showCart()"><i class="material-icons">shopping_cart</i></a></li>
        </ul>

        <ul class="right">
          <li>
            <Chat></Chat>
          </li>
        </ul>

      </div>
    </nav>

    <!-- BreadCrumb Here-->

    <SideMenu :menu="menu"></SideMenu>

    </header>

</template>
<script>
    import {mapGetters, mapState, mapActions} from 'vuex'
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import SideMenu from "./SideMenu";
    import marketingIntegrationsMixin from '@/mixins/MarketingIntegrationsMixin'
    import { eventHub } from '@/utils/eventHub'
    import productsPlansUtils from '@/utils/productsPlansUtils'
    import Chat from "./integrations/Chat"

    export default {
      name: 'HeaderPipeu',
      components: {Chat, SideMenu},
      mixins: [basicuicomponent, marketingIntegrationsMixin],

        data: function () {
            return {
                storeProps: {},
                menu: {},
                headerBackground: 'background-color: #002b4d', // background-color: #002b4d!important;
                headerFooterLogoURL: ''
            }
        },

        created: function () { // NOTE: On element creation we just can receive data in lower case like storedata or userlogged, storeData or userLogged won't work
            if (this.store && this.store.properties) {
                this.storeProps = this.store.properties

                this.headerFooterLogoURL = this.storeProps.logoURL

                if (this.storeProps.headerMenu) {
                    this.menu = this.storeProps.headerMenu
                }

                if (this.storeProps.header) {
                    if (this.storeProps.header.headerBackground) {
                        this.headerBackground = 'background-color: ' + this.storeProps.header.headerBackground
                    }

                    if (this.storeProps.header.logoHeader) {
                        this.headerFooterLogoURL = this.storeProps.header.logoHeader
                    }
                }
            }
            if (process.client) {
                // console.log('### Header -> Initializing PubNub')
                // this.pubnub.load() // Init PubNub realtime presence
            }
        },

        mounted: function () {
            // 03/07/18 - Listen for events like, someone just bought an EventTicket
            // this.$pubnub.addListener({
            //     status: function (statusEvent) {
            //         if (statusEvent.category === 'PNConnectedCategory') {
            //             // handle status
            //             // console.log('# Received status Event PNConnectedCategory')
            //         }
            //     },
            //     message: function (message) {
            //         console.log('New Message!', message)
            //     vm.processMessage(message)
            //     }
            // })

            if (this.userAccount && this.userAccount.id) {
                // console.log('### Setting PubNub Pipeu UserId', this.userAccount.id)
                // this.$pubnub.setUUID(this.userAccount.id)

            } else if (this.$localStorage.get('userUUID')) {
                // console.log('### Setting PubNub Pipeu UUID', this.$localStorage.get('userUUID'))
                // this.$pubnub.setUUID(this.$localStorage.get('userUUID'))
            }

            // console.log('### PubNub subscribing to store Name ', this.store.name)
            // console.log('### PubNub subscribing to store Id ', this.store.id)

            let pubnubChannel = 'store-' + this.store.id
            // console.log('### PubNub pubnubChannel ', pubnubChannel)

            // this.$pubnub.subscribe({ channels: [pubnubChannel ]})
        },

        computed: {
          ...mapGetters(['isFullScreen', 'getUserAccount', 'getCheckout']),
            ...mapActions(['addUserAccount']),
          ...mapState({
            counter: state => state.counter,
            store: state => state.store,
            userAccount: state => state.userAccount,
            userLogged: state => state.userLogged
          }),

          isPlanSubscriptionCheckout () {
            return productsPlansUtils.isPlanSubscriptionCheckout(this.getCheckout)
          }
        },

        methods: {
            goToHome () {
              this.addCheckHideDevTrick() //check/add count to dev console msg trigger
              this.goToPath('/')
            },

            showCart () {
              eventHub.$emit('show-pip-cart-checkout')
            },

            headerBrand () {
                // console.log('### headerBrand:', this.storeProps.header)
                if (this.storeProps.header && this.storeProps.header.headerBrand) {
                    // console.log('### headerBrand.style:', this.storeProps.header.headerBrand)
                    return this.storeProps.header.headerBrand.style
                } else {
                    return 'height: 30px;'
                }
            },

            headerClass () {
                return 'navbar-dark bg-primary fixed-top'
            },

            processMessage (newMessage) {
                // console.log('### processMessage', newMessage)
                let notificationMessage = JSON.parse(newMessage.message)
                if (notificationMessage.storeId === this.store.id) {
                    if (notificationMessage.action === 'NEW_ORDER') {
                        this.$toast.success('Alguém acabou de fazer comprar um Ingresso')
                    }
                }
            }
        },

        props: {
            backButton: {
                default: false,
                type: Boolean
            },
            returnPath: {
              default: undefined,
              type: String
            },
            title: undefined,
            showCartIcon: {
              default: true,
              type: Boolean
            },
        }
}
</script>
<style scoped>
    nav .nav-title {
      display: inline-block;
      font-size: 18px;
      padding: 19px 0;
    }

    @media (min-width: 992px){
        .navbar li {
            margin-left : 0.3em;
            margin-right : 0.3em;
        }
    }


    @media only screen and (min-width: 768px) {
      nav ul li {
        line-height: 64px;
      }
    }


</style>


