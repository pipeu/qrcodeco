<template>
  <div>
      <template v-if="principalCC && principalCC.id > 0">
        <div class="row">
          <ul class="collection card-edit">
            <li class="collection-item">
              <div>
                <span><img :src="getFlagImage(principalCC)" alt=""></span>
                <span style="font-size: 14px;">{{principalCC.maskedCC}}</span>
                <div>
                  <p style="display: inline-block; margin-bottom: 0px; text-align: left; margin-left: 29px;"><span class="principal blue">Principal</span></p>
                  <p v-if="principalCC.voucher" style="display: inline-block; margin-bottom: 0px; text-align: left; margin-left: 29px;"><span class="principal orange">Voucher</span></p>
                </div>
              </div>
            </li>
          </ul>
          <p v-if="principalCC.voucher" style="font-size: 11px;">Atencão: o CPF do titual do cartão deverá ser o mesmo de quem esta efetuando a compra</p>
        </div>
        <PipButton :disabled="isProcessing" @click="processPaymentWithPrincipalCreditCard">Confirmar Pedido</PipButton>
      </template>

      <p v-if="errorMessage" class="account-error" style="margin-top: 10px; color: red;">{{errorMessage}}</p>

      <p style="font-size: 12px; display: inline-block; color: #666666;">Servidor seguro</p>
      <img style="margin-left: 10px; vertical-align: middle;" src="https://pipeu-us.s3.amazonaws.com/images/billing/icon_lock_12x15_yellow.png">

      <h2 class="validation"></h2>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import { eventHub } from '@/utils/eventHub'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import orderFuncMixin from '@/mixins/OrderFuncMixin'
  import paymentApi from '@/pipeuapi/payment.js'
  import PipButton from "../pipeu/common/PipButton";
  import api from '@/pipeuapi/api.js'

  export default {
    name: 'CreditCardPayment',
    mixins: [basicuicomponent, orderFuncMixin],

    components: {
      PipButton
    },

    data: function() {
      return {
        principalCC: {},
        paymentMethod: 2, //Default CreditCard
        paymentType: 1, //Payment Type One or many installments
        cc: {
          cc: '',
          name: '',
          ccExp: '',
          month: '',
          year: '',
          cvv: '',
          flagName: ''
        },
        errorMessage: '', //Any error message returned by payment methods
      }
    },

    props: {
      OCB: '',
      cpf: {
        required: true
      },
      useInvoiceDetails: false,
      chargeData: {},
      installments: {
        required: true
      },
      // installments: 1, // In this Way he got an Error hands side is not an Object
    },

    created () {
      let vm = this

      // eventHub.$on('pip-credit-card-validate-result', (res) => { // {result:false, cc:vm.cc}
      //   console.log('>>> pip-credit-card-validate-result res:', res)
      //   vm.cc = res.cc
      //   if (res.result) {
      //     this.processCreditCard()
      //   }
      // })

      eventHub.$on('dispatch-credit-card-payment-process', () => {
        vm.processPaymentWithPrincipalCreditCard()
      })
    },

    mounted () {
      let vm = this
      // console.log('>>> CreditCardPayment.vue running on Browser, initing checkout components OCB:' + this.OCB)
      if (vm.userHasPrincipalValidCreditCard()) {
        vm.getPrincipalMaskedCreditCardSavedByUser()
      }
      vm.mounted = true
    },

      methods: {
      ...mapGetters(['userHasPrincipalValidCreditCard', 'getCheckout']),

      getPrincipalMaskedCreditCardSavedByUser() {
        let vm = this
        api.getPrincipalMaskedCreditCardSavedByUser().then(res => {
            let data = res.data
            // console.log("### return promisse api.getPrincipalMaskedCreditCardSavedByUser data:", data);
            vm.principalCC = data
            vm.attachComponents()
            if (vm.OCB == 1) {
              vm.processPaymentWithPrincipalCreditCard()
            }
          },
          error => {
            vm.handleApiError(error, {ignoreNotFound: true})
          }
        )
      },

      validateCreditCard () {
        let vm = this
        console.log('>>> payment.validateCreditCard vm.cc', vm.cc)
        eventHub.$emit('pip-credit-card-validate') // Emit Validation to CreditCard Component that will emit the event pip-credit-card-validate-result with true of false
      },

      processPaymentWithPrincipalCreditCard () {
        let vm = this

        if (this.installments > 1) {
          this.paymentType = 2 // Order paymentType parcelado
        } else {
          this.paymentType = 1
        }

        eventHub.$emit('before-payment-request')

        // Timeout in 20 Seconds to simulate async processing in background
        // TODO: Implement Queue in Server Side to receive the order and then subscribers process the orders

        paymentApi.processPaymentWithPrincipalCreditCard(vm.getCheckout(), vm.cpf,
                                                        vm.paymentType, vm.installments,
                                                        vm.useInvoiceDetails, vm.chargeData).then(res => {

          let order = res.data
          vm.$emit('payment-update-order', order); // Emit updated order to Parent

          if (order.orderStatus === 2) {

          } else if (order.orderStatus === 4) {
            vm.$toast.error('Recebemos seu Pedido !')

          } else {
            vm.$toast.error('Compra não Aprovada !')
            // Show message near Send Payment with gateway response reason
            vm.errorMessage = order.ccTransaction.resultadoSolicitacaoAprovacao
          }

        }, (error) => {
          vm.handleApiError(error, { alertMessage: 'Ops!, verifique o Problema Abaixo'})

          if (error.code === 'ECONNABORTED' || error.response.status === 504) {
            vm.$toast.success('Recebemos seu Pedido !')
            let order = {
              orderStatus: 4
            }
            vm.$emit('payment-update-order', order);
          }
        })

      },
    }
  }
</script>

<style scoped>
  .principal {
    line-height: 16px;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 300;
    margin: auto;
    padding: 3px 5px;
    width: 16px;
    height: 16px;
  }
</style>
