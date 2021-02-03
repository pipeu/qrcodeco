<template>
  <div>
    <div>
      <!--<p style="font-size: 20px;color: #1b427c;padding: 0 0 0px;">Dados de Cobrança e Nota Fiscal</p>-->
      <div class="row ">
        <div class="col-lg-10 col-md-8 col-xs-9">
          <p style="background-color:#FFFFCC; padding:10px; border:1px solid #EEE; margin-top:15px; font-size: 14px;">
            <strong>ATENÇAO:</strong> O Produto
            será liberado após recebermos a confirmação do pagamento do boleto que geralmente demora <strong>2 dias úteis</strong>.
            Para ter acesso imediato, utilize seu cartão de crédito.
          </p>
        </div>
      </div>

      <div class="row ">
        <div class="col-lg-8 col-md-8 col-xs-9">
          <PipButton @click="processInvoiceSlip" :disabled="isProcessing" >Emitir Boleto</PipButton>
        </div>
      </div>

    </div>

    <div class="error-status-sendresult" id="message-indicator" style="display:none;"></div>

  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import { eventHub } from '@/utils/eventHub'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import orderFuncMixin from '@/mixins/OrderFuncMixin'
  import paymentApi from '@/pipeuapi/payment.js'
  import PipButton from "../pipeu/common/PipButton";

  export default {
    name: 'PipInvoiceSlip',
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

      processInvoiceSlip () {
        console.log('### payment.processInvoiceSlip')
        let vm = this

        eventHub.$emit('before-payment-request')

        paymentApi.createBankSlip(vm.getCheckout(), vm.cpf,
                                  vm.useInvoiceDetails, vm.chargeData).then((res) => {
          let data = res.data
          console.log('paymentApi.createBankSlip order ', data)

          let order = data
          console.log('order.boletoCode', order.boletoCode)

          // Emit updated order to Parent
          vm.$emit('payment-update-order', order);

        }, (error) => {
          vm.handleApiError(error)
        })

      }

    }

  }
</script>
