import facebookPixel from '~/scripts/facebookPixel.js'
// import googleGTM from '~/scripts/googleGTM.js'
import { eventHub } from '@/utils/eventHub'
import {mapState, mapGetters} from 'vuex'


export default {
  data() {
    return {
      mounted: false,
      gtmIntegration: {},
      facebookIntegration: {}
    }
  },

  created() {
    eventHub.$on('marketing-AddToCart', (event) => {
      let vm = this
      console.log('>>> MarketingIntegrationsMixins marketing-AddToCart received event:', event)
      vm.addToCart(event)
    })

    eventHub.$on('marketing-initiateCheckout', (event) => {
      let vm = this
      console.log('>>> MarketingIntegrationsMixins marketing-initiateCheckout received event:', event)
      vm.initiateCheckout(event)
    })

    eventHub.$on('marketing-send-event', (event) => {
      let vm = this
      console.log('>>> MarketingIntegrationsMixins marketing-send-event event received event:', event)
      vm.sendMarketingEvent(event)
    })

    eventHub.$on('marketing-payment-send-event', (payload) => {
      let vm = this
      console.log('>>> MarketingIntegrationsMixins marketing-payment-send-event received payload:', payload)
      vm.sendOrderApprovedMarketingEvent(payload.order)
    })

  },

  beforeDestroy () {
    eventHub.$off('marketing-send-event')
  },

  computed: {
    ...mapState({
      store: state => state.store,
      userAccount: state => state.userAccount
    }),
    ...mapGetters([
      'isFullScreen', 'isProcessing'
    ])
  },

  mounted() {
    let vm = this

    if (process.client) {

      // 23/08/18
      let clientIntegrations = this.$store.getters.getStore.clientSideIntegrations
      // console.log('### MarketingIntegrationsMixins Mixins -> clientIntegrations', clientIntegrations)

      if (clientIntegrations) {

        let fbPixelIntegration = clientIntegrations.find(item => item.paramName === 'FACEBOOK_PIXEL_ID')
        if (fbPixelIntegration && fbPixelIntegration.paramEnabled) {
          vm.facebookIntegration = fbPixelIntegration
          facebookPixel.attachPixel(fbPixelIntegration.paramValue)
        }

        // 24/08/18 - Google GTM
        let gtmIntegration = clientIntegrations.find(item => item.paramName === 'GOOGLE_TAG_MANAGER_ID')
        if (gtmIntegration && gtmIntegration.paramEnabled) {
          // console.log('gtmIntegration.paramValue:', gtmIntegration.paramValue)
          // console.log('gtmIntegration.paramEnabled:', gtmIntegration.paramEnabled)

          vm.gtmIntegration = gtmIntegration
          // googleGTM.attach(gtmIntegration.paramValue)

        }
      }
    }

  },

  methods: {

    addToCart (checkout) {
      let vm = this
      console.log('@@@ MarketingIntegrationsMixins.AddToCart')

      if (vm.facebookIntegration.paramEnabled) {
        facebookPixel.trackEvent('AddToCart')
      }

      // if (vm.gtmIntegration.paramEnabled) {
      //   googleGTM.sendEvent({
      //     event: 'pipeu_AddToCart'
      //   })
      // }

      this.$gtm.trackEvent({
        event: 'pipeu_AddToCart' // Event type [default = 'interaction'] (Optional)
      })
      // value: Math.trunc(order.totalAmount),

    },

    initiateCheckout (checkout) {
      let vm = this
      console.log('@@@ MarketingIntegrationsMixins.initiateCheckout')

      if (vm.facebookIntegration.paramEnabled) {
        facebookPixel.trackEvent('InitiateCheckout')
      }

      // if (vm.gtmIntegration.paramEnabled) {
        vm.$gtm.trackEvent({
          event: 'pipeu_InitiateCheckout', // Event type [default = 'interaction'] (Optional)
        })
      // }

    },

    // 24/08/18 - Common methods to send events to Store Integrated Marketing Apps like Google GA, GTM, FB Conv, others...
    // Order Approved Marketing Event
    sendOrderApprovedMarketingEvent (order) {
      let vm = this
      // console.log('@@@ MarketingIntegrationsMixins.sendOrderApprovedMarketingEvent')
      // console.log('vm.gtmIntegration.paramEnabled:', vm.gtmIntegration.paramEnabled)

      if (vm.facebookIntegration.paramEnabled) {
        facebookPixel.trackPurchase(order.totalAmount, 'BRL')
      }

      // if (vm.gtmIntegration.paramEnabled) { // Google GTM

        this.$gtm.trackEvent({
          event: 'pipeu_checkout_conv_value', // Event type [default = 'interaction'] (Optional)
          value: order.totalAmount,
          orderId: order.orderId,
        })

      // }

      // if (vm.gtagIntegration.paramEnabled) {
      //   console.log('@@@ MarketingIntegrationsMixins Calling @gtag purchase')
      //   vm.$gtag.purchase({
      //     "transaction_id": order.orderId,
      //     "value": Math.trunc(order.totalAmount)
      //   })
      //   console.log('@@@ MarketingIntegrationsMixins After calling')
      //
      //   // Mais eventos gtag: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce
      //   vm.$gtag.event('purchase', {
      //     'event_category': 'ecommerce',
      //     "transaction_id": order.orderId,
      //     "currency": "BRL",
      //     'value': Math.trunc(order.totalAmount)
      // })
      // }

    },

    // Generic Event
    sendMarketingEvent (eventObject) {
      let vm = this
      console.log('@@@ basicuicomponent.sendMarketingEvent', eventObject)

      // TODO: missing gtag and remarketing lists

      if (vm.facebookIntegration.paramEnabled) {
        facebookPixel.trackEvent(eventObject.event)
      }

      // Google GTM
      // if (vm.gtmIntegration.paramEnabled) {
      //   googleGTM.sendEvent(eventObject)
      // }

    }


  }
}
