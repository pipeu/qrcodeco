<template>
    <div>
        <p style="background-color:#FFFFCC; padding:5px; border:1px solid #EEE; margin-top:5px; font-size: 14px;">
            Seu Pedido será finalizado usando o crédito que você possui
        </p>

        <div style="margin:15px 0px 15px;" align="center">
            <PipButton @click="processUserCredit" :disabled="isProcessing" >Confirmar Pedido</PipButton>
        </div>
    </div>

</template>
<script>
  import {mapGetters} from 'vuex'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import orderFuncMixin from '@/mixins/OrderFuncMixin'
  import paymentApi from '@/pipeuapi/payment.js'
  import PipButton from "../pipeu/common/PipButton";

  export default {
    name: 'UserCreditPaymentMethod',
    components: {PipButton},
    mixins: [basicuicomponent, orderFuncMixin],

    props: {
      cpf: {
        required: true
      },
      useInvoiceDetails: false,
      chargeData: {}
    },

    methods: {
      ...mapGetters(['getCheckout']),

      processUserCredit () {
        console.log('### payment.processUserCredit')
        let vm = this

        paymentApi.processUserCredit(vm.getCheckout(), vm.cpf,
          vm.useInvoiceDetails, vm.chargeData).then((res) => {
          console.log('paymentApi.processUserCredit response ', res.data)

          let order = res.data

          // Emit updated order to Parent
          vm.$emit('payment-update-order', order);

        }, (error) => {
          vm.handleApiError(error, { alertMessage: 'Ops!, verifique o Problema Abaixo'})
        })
      },
    }

  }
</script>

<style scoped>
    .pip-buy-tickets .ingress p {
        margin-bottom: 30px;
        color: #212020;
    }

    .pip-whats {
        height: 25px;
        -webkit-filter: drop-shadow(1px 1px 2px rgb(0,0,0,0.5));
        filter: drop-shadow(1px 1px 2px rgb(0,0,0,0.5));
        margin-top: 1px;
        margin-right: 5px;
    }
</style>
