<template>
  <div>


  </div>

</template>

<script>
  import { eventHub } from '@/utils/eventHub'
  import basicuicomponent from '@/mixins/BasicUIComponent'

  export default {
    name: 'PaymentRequestAPI',
    mixins: [basicuicomponent],

    created () {
      let vm = this
    },

    mounted () {
      let vm = this
      console.log('PaymentRequestAPI.vue running on Browser')

      if (process.browser) {

      }

    },


    watch: {
    },

    methods: {

      validate () {
        let vm = this


      },

      // Here for tests
      payNow () {
        const supportedPaymentMethods = [
          {
            supportedMethods: 'basic-card'
          }
        ]

        const allDisplayItems = [
          {
            label: 'Subtotal',
            amount: {
              currency: 'USD',
              value: 10
            }
          }, {
            label: 'Discount (10%)',
            amount: {
              currency: 'USD',
              value: -1
            }
          }, {
            label: 'Tax',
            amount: {
              currency: 'USD',
              value: 0.68
            }
          }
        ]

        const paymentDetails = {
          total: {
            label: 'Total',
            amount: {
              currency: 'BRL',
              value: 10
            }
          },
          displayItems: allDisplayItems
        }

        // Options isn't required.
        const options = {
          requestPayerName: true,
          requestPayerPhone: true,
          requestPayerEmail: true
        }

        const request = new PaymentRequest(
          supportedPaymentMethods,
          paymentDetails,
          options
        )

        request.show()
          .then((paymentResponse) => {
            console.log('paymentResponse', paymentResponse)

            // The user filled in the required fields and completed the flow
            // Get the details from `paymentResponse` and complete the transaction.
            return paymentResponse.complete()
          })
          .catch((err) => {
            // The API threw an error or the user closed the UI
            console.log('err', err)
          })
      }

    }

  }
</script>

