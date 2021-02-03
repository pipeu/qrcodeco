<template>
  <div>
    <form novalidate="novalidate" autocomplete="on">

    <div class="row" style="margin-top: -20px; margin-bottom: 10px;">
      <div class="s12">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tbody>

          <template v-if="voucher">
            <tr>
              <td>
                <label >
                  <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/billing/sodexo.jpeg" height="35" alt="" title="Visa" align="absmiddle" style="margin-left:5px;">
                </label>
              </td>
              <td><label >
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/billing/vr-vale-refeicao.jpeg" height="30" alt="" title="MasterCard" align="absmiddle" style="margin-left:0px;">
              </label></td>
              <td><label >
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/billing/alelo-alimentacao-e-refeicao.png" height="35" alt="" title="American Express" align="absmiddle" style="margin-left:25px;">
              </label></td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td>
                <label >
                  <img src="https://s3.amazonaws.com/pipeu-us/images/billing/flag-visa.png" width="40" height="24" alt="" title="Visa" align="absmiddle" style="margin-left:15px;">
                </label>
              </td>
              <td><label >
                <img src="https://s3.amazonaws.com/pipeu-us/images/billing/flag-mastercard.png" width="40" height="24" alt="" title="MasterCard" align="absmiddle" style="margin-left:5px;">
              </label></td>
              <td><label >
                <img src="https://s3.amazonaws.com/pipeu-us/images/billing/flag-amex.png" width="40" height="24" alt="" title="American Express" align="absmiddle" style="margin-left:5px;">
              </label></td>
              <!--<td><label>-->
              <!--<img src="/billing/images/billing-nc-flag-hipercard.png" width="40" height="24" alt="" title="HiperCard" align="absmiddle" style="margin-left:5px;">-->
              <!--</label></td>-->
              <td><label>
                <img src="https://s3.amazonaws.com/pipeu-us/images/billing/flag-elo.png" width="40" height="24" alt="" title="Elo" align="absmiddle" style="margin-left:5px;">
              </label></td>
            </tr>
          </template>

          </tbody>
        </table>
      </div>
    </div>

    <div class="row">
      <div class="col s12 l12">
        <div class='card-wrapper'></div>
      </div>
    </div>

    <div class="row">
      <PipInput style="margin-top: 20px; " class="cc-number" :disabled="isProcessing" component-name="cc" label-desc="Número Cartão" v-model="cc.cc" type="text"></PipInput>

      <PipInput style="padding: 0px; margin-top: 0rem; margin-bottom: 0rem;" :maxlength="30" :disabled="isProcessing" component-name="name" label-desc="Nome no Cartão" v-model="cc.name" type="text"></PipInput>

      <div class="row" style="margin-top: 0.9rem;">
        <div class="col s3">
          <PipInput style="margin-top: 0rem; margin-bottom: 0rem;" type="text" :maxlength="2" :disabled="isProcessing" component-name="month" label-desc="Mês (MM)" v-model="cc.month"></PipInput>
        </div>
        <div class="col s1" style="margin-top: 15px;">
          /
        </div>
        <div class="col s3">
          <PipInput style="margin-top: 0rem; margin-bottom: 0rem;" type="text" :maxlength="2" :disabled="isProcessing" component-name="year" label-desc="Ano (AA)" v-model="cc.year"></PipInput>
        </div>
      </div>
      <PipErrorIndicator componentName="ccExp"></PipErrorIndicator>

      <div class="col s6 l3" style="margin-top: 0rem; margin-bottom: 0rem;">
        <PipInput class="cc-cvc" :disabled="isProcessing" component-name="cvv" label-desc="CVV" v-model="cc.cvv" type="text"></PipInput>
      </div>
      <div class="col s6 l6">
        <!--<client-only>-->
          <!--<popper trigger="hover" :options="{placement: 'top'}">-->
            <!--<div class="popper">-->
              <!--<div class="popper">-->
                <!--<div id="tooltip" class="clearfix">-->
                  <!--<p>Nos Cartões VISA, MASTERCARD, HIPERCARD e ELO<br>-->
                    <!--o código está localizado no verso do cartão e <br>-->
                    <!--corresponde aos 3 Últimos dígitos <br>-->
                    <!--No Cartão AMEX o Código esta localizado na parte frontal do Cartão.</p>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->

            <!--<a href="#" slot="reference" class="cvvHelp">-->
              <!--O que é CVV-->
            <!--</a>-->
          <!--</popper>-->
        <!--</client-only>-->
      </div>

    </div>
    </form>

  </div>

</template>

<script>
  /* eslint-disable */
  /* global Card */
  import { eventHub } from '@/utils/eventHub'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import PipInput from "../pipeu/common/PipInput";
  import Popper from 'vue-popperjs'
  import 'vue-popperjs/dist/css/vue-popper.css'
  import Payment from 'payment'
  import PipErrorIndicator from "../pipeu/common/PipErrorIndicator";

  export default {
    name: 'PipCreditCard',
    components: {
      PipErrorIndicator,
      PipInput,
      'popper': Popper
    },
    mixins: [basicuicomponent],

    data: function() {
      return {
        cc: {
          cc: '',
          name: '',
          ccExp: '',
          month: '',
          year: '',
          cvv: '',
          flagName: '',
          voucher: false
        }
      }
    },

    props: {
      value: { // Initial value passed from v-model from Parent Component
        required: true
      },
      componentName: {
        required: true,
        type: String
      },
      disabled: {
        required: false,
        type: Boolean,
        default () {
          return false
        }
      },
      voucher: {
        required: false,
        type: Boolean,
        default () {
          return false
        }
      }
    },

    created () {
      let vm = this

      if (process.client) {
        window.card = require('card')
      }

      if (vm.value) {
        vm.cc = vm.value
      }

      eventHub.$on('pip-credit-card-validate', () => {
        let vm = this
        vm.validateCreditCard()
      })
    },

    beforeDestroy () {
      eventHub.$off('pip-credit-card-validate');
    },

    mounted () {
      if ((process.client)) {
        console.log('PipCreditCard.vue running on Browser, initing checkout components')

        Payment.formatCardNumber(document.querySelector('.cc-number'), 16)
        // Payment.formatCardExpiry(document.querySelector('.cc-exp'))
        Payment.formatCardCVC(document.querySelector('.cc-cvc'))

        window.card = new Card({
          // a selector or DOM element for the form where users will
          // be entering their information
          form: 'form', // *required*
          // a selector or DOM element for the container
          // where you want the card to appear
          container: '.card-wrapper', // *required*

          // expiryInput: 'input#ccExp', // optional — default input[name="expiry"]
          formSelectors: {
            numberInput: 'input#cc', // optional — default input[name="number"]
            cvcInput: 'input#cvv', // optional — default input[name="cvc"]
            nameInput: 'input#name' // optional - defaults input[name="name"]
          },

          // if true, will log helpful messages for setting up Card
          debug: true // optional - default false
        })
      }
    },

    watch: {
      // 'cc.month': function (newValue) {
      //   eventHub.$emit('ccExp-clear-indicator') // TODO move to inside pipeErrorComponent, if input gain focus clear just one time
      // },

      'cc.cc': function(newValue) {
        // console.log('   >>> ['+this.componentName+'] cc.cc changed:', newValue)
        // let vm = this
        // vm.$emit('input', newValue)
        // vm.removeValidationIndicator ()
      },

      value: function(newValue) {
        // console.log('   >>> PipCreditCard ['+this.componentName+'] PARENT changed value (update model Value ?):', newValue)
        // this.modelValue = newValue
      }

    },

    methods: {

      validateCreditCard () {
        let vm = this
        console.log('>>> PipCreditCard.validateCreditCard')


        let validCCNumber = Payment.fns.validateCardNumber(vm.cc.cc)
        console.log('xx Payment.fns.validateCardNumber', validCCNumber)
        if (!validCCNumber) {
          vm.addPipError('cc', 'Cartão Inválido')
        }

        let validCCName = true
        if (!vm.cc.name || vm.cc.name.length === 0) {
          vm.addPipError('name', 'Digite o Nome no Cartão')
          validCCName = false
        }

        vm.cc.flagName = Payment.fns.cardType(vm.cc.cc)
        console.log('vm.cc.flagName', vm.cc.flagName)

        // TODO: Add CC flags enabled into Store billing parameters
        if (vm.cc.flagName === 'visa') {

        } else if (vm.cc.flagName === 'mastercard') {

        } else if (vm.cc.flagName === 'amex') {

        } else if (vm.cc.flagName === 'unionpay') {
            console.log('vr or unionpay here')
            vm.cc.flagName = 'vr'

        } else if (vm.cc.flagName === 'hipercard') {
            console.log('Sodexo or Hipercard here')
            if (vm.voucher == true) {
              vm.cc.flagName = 'sodexo'
              vm.cc.voucher = true
            }

        } else if (vm.cc.flagName === 'elo') {
          console.log('elo or alelo here')
          if (vm.voucher == true) {
            vm.cc.flagName = 'elo' // alelo must be sent with elo name :/
            vm.cc.voucher = true
          }

        } else {
          if (validCCNumber) {
            validCCNumber = false
            vm.addPipError('cc', 'Infelizmente não aceitamos este Cartão (' + vm.cc.flagName + ')')
          }
        }

        vm.cc.ccExp = vm.cc.month + '/' + vm.cc.year
        console.log('card expiry value', vm.cc.ccExp)

        let validCCExp = Payment.fns.validateCardExpiry(vm.cc.ccExp)
        console.log('validCCExp', validCCExp)
        if (!validCCExp) {
          vm.addPipError('ccExp', 'Validade do Cartão Inválida, exemplo de como deve ser 12/20')
        }

        let monthYearParse = Payment.fns.cardExpiryVal(vm.cc.ccExp)
        console.log('Payment.fns.cardExpiryVal(this.ccExp)', monthYearParse)// '03 / 2025' => {month: 3: year: 2025}
        vm.cc.month = monthYearParse.month
        vm.cc.year = monthYearParse.year


        let validCVC = Payment.fns.validateCardCVC(vm.cc.cvv, vm.cc.flagName)
        console.log('validCVC', validCVC)
        if (!validCVC) {
          vm.addPipError('cvv', 'Código de Segurança inválido')
        }

        if (!vm.cc.cvv || vm.cc.cvv.length <= 2) {
          validCVC = false
          vm.addPipError('cvv', 'Código de Segurança (CVC) precisa ter pelo menos 3 dígitos e 4 para cartão Amex')
        }

        let result = validCCNumber && validCCExp && validCVC && validCCName

        if (!result) {
          // vm.showError('Corrija os Erros em Vermelho')
          eventHub.$emit('pip-credit-card-validate-result', {result:false, cc:vm.cc})
        } else {
          eventHub.$emit('pip-credit-card-validate-result', {result:true, cc:vm.cc})
        }

        vm.$emit('input', vm.cc)

      }

    }

  }
</script>
<style scoped>

  .popper {
    width: 150%;
    background-color: #f9f7dd;
    color: #212529;
    text-align: center;
    padding: 2px;
    display: block;
    border-radius: 3px;
    position: relative;
    font-size: 14px;
    font-weight: 400;
    border: 1px solid #ebebeb;
    z-index: 200000;
    -webkit-box-shadow: #3a3a3a 0 0 6px 0;
    box-shadow: 0 0 6px 0 #3a3a3a;
  }

  .cvvHelp {
    margin: 0 auto;
    display: table;
    width: 110%;
  }
</style>
