import {mapGetters, mapState} from 'vuex'
export default {

  computed: {
    ...mapState(['order'])
  },

  watch: {
    order: function (newValue, oldValue) {
      // console.log('>>>>> watch checkoutFuncMixin.order newValue', newValue)
    }
  },

  methods: {
    ...mapGetters(['getOrder']),

    // Order Confirmed means it was Paid or Is Waiting Approval or Pending Payment
    orderConfirmed () {
      if ( this.orderApproved() || this.orderPendingApproval() || this.orderIssuedWaitingPayment() ) {
        return true
      } else {
        return false
      }
    },

    orderIssuedWaitingPayment () {
      if ( this.order && this.order.orderStatus) {
        // If paymentMethod equals Boleto, Wire Transfer or PicPay and orderStatus = 1 means waiting payment
        if ( ((this.order.paymentMethod === 1 || this.order.paymentMethod === 9 || this.order.paymentMethod === 10 || this.order.paymentMethod === 11 )  && this.order.orderStatus === 1)) {
          return true
        }
      }
      return false
    },

    orderPendingApproval () {
      if (this.order && this.order.orderStatus && this.order.orderStatus === 4) {
        return true
      } else {
        return false
      }
    },

    // Order was paid
    orderApproved () {
      // console.log('### checkoutFuncMixin orderApproved this.order:', this.order)
      if (this.order && this.order.orderStatus && this.order.orderStatus === 2) {
        return true
      } else {
        return false
      }
    }

  }
}
