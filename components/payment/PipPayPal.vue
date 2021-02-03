<template>
  <div>
    <div id="paypal-button"></div>
    <div v-if="paypalErrorMessage">{{paypalErrorMessage}}</div>
  </div>
</template>

<script>
  /* eslint-disable */
  /* global paypal */

  import {mapGetters} from 'vuex'
  import { eventHub } from '@/utils/eventHub'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import orderFuncMixin from '@/mixins/OrderFuncMixin'
  import paypalcheckout from '~/scripts/paypalJS.js'
  import paymentApi from '@/pipeuapi/payment.js'

  export default {
    name: 'PipPayPal',
    mixins: [basicuicomponent, orderFuncMixin],

    data: function() {
      return {
        paypal: {
          enabled: false,
          env: 'sandbox',
          sandbox: '',
          production: ''
        },
        paymentID: '',
        paypalErrorMessage: '',
        newOrderId: ''
      }
    },

    props: {
      cpf: {
        required: true
      }
    },

    mounted () {
      let vm = this
      // console.log('PipPayPal.vue running on Browser, initing checkout components')

      let clientIntegrations = this.$store.getters.getStore.clientSideIntegrations
      // console.log('### clientIntegrations', clientIntegrations)

      if (clientIntegrations) {

        let paypalClientId = clientIntegrations.find(item => item.paramName === 'PAYPAL_CLIENT_ID')
        let paypalEnv = clientIntegrations.find(item => item.paramName === 'PAYPAL_ENVIRONMENT')

        if (paypalClientId && paypalEnv) {
          this.paypal.enabled = paypalClientId.paramEnabled
          this.paypal.env = paypalEnv.paramValue
          this.paypal.sandbox = paypalClientId.paramValue // TODO: Refactor on Server Side, using same value for SandBox or Production, the difference is the flag ENV
          this.paypal.production = paypalClientId.paramValue
        }
      }

      if (process.browser && this.paypal.enabled) {

        paypalcheckout.get().then((google) => {
          // Do your library stuff in here
          vm.deb('### paypalcheckout LOADED !')

          let client = {
            sandbox: vm.paypal.sandbox,
            production: vm.paypal.production
          }

          paypal.Button.render({
            env: vm.paypal.env, // sandbox | production
            commit: true,
            client,
            locale: 'pt_BR',
            style: { color: 'gold', size: 'medium', shape: 'pill' }, // size: 'responsive'

            onCancel: function (data, actions) {
              console.log('### onCancel')
              // Show a cancel page or return to cart
            },

            payment: function () {
              console.log('# Paypal.payment')

              eventHub.$emit('before-payment-request')

              return paymentApi.createPaypal(vm.getCheckout(), vm.cpf).then((res) => {
                console.log('paymentApi.createPaypal res ', res.data)
                let data = res.data

                console.log('data.paymentID:' + data.paypalPaymentID)
                console.log('data.orderId:' + data.orderId)

                vm.paymentID = data.paypalPaymentID
                vm.newOrderId = data.orderId

                return vm.paymentID

              }, (error) => {
                vm.handleApiError(error, { alertMessage: 'Ops!, verifique o Problema Abaixo'})
              })
            },
            onAuthorize: function (data) {
              console.log('###onAuthorize data:', data)
              console.log('sending orderId also to server vm.orderId:', vm.newOrderId)

              return paymentApi.processPaypal(vm.getCheckout(), vm.cpf,
                                              data.paymentID, data.payerID,
                                              vm.newOrderId).then((res) => {
                console.log('paymentApi.processPaypal res ', res.data)

                let order = res.data
                console.log('order', order)

                // Emit updated order to Parent
                vm.$emit('payment-update-order', order);

                if (vm.order.orderStatus != 2) {
                  vm.showError('Compra não Aprovada pelo Paypal, tente outro método de pagamento')
                }

              }, (error) => {
                vm.handleApiError(error)
              })
            },
            onError: function (err) {
              console.log('### handler meu codigo onError ', err)
              // Show an error page here, when an error occurs

              vm.paymentID = ''
              vm.newOrderId = ''

              // Emit updated order to Parent
              this.$emit('payment-update-order', order);

              vm.paypalErrorMessage = 'Erro ao Pagar com Paypal, tente outra forma de Pagamento'
              vm.showError('Problema com Paypal, tente outra Forma de Pagamento')
            }
          }, '#paypal-button')

        })
      }

      vm.mounted = true
    },

    methods: {
      ...mapGetters(['getCheckout'])
    }

  }
</script>

