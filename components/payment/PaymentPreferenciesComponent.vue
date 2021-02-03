<template>
  <div>
      <ul v-if="entities && entities.length > 0" class="collection card-edit">
        <li @click="setAsPrincipalSelectPaymentMethod(item)" v-for="item in entities" :key="item.id" class="collection-item" style="cursor: pointer;">
          <div>
            <span><img :src="getFlagImage(item)" alt=""></span>
            <span style="font-size: 14px;">{{item.maskedCC}}</span>
            <span>

              <template v-if="checkoutSelectMode">
                <a class='right' style="color: #000;"><i class="material-icons">chevron_right</i></a>
              </template>
              <template v-else>
                <a class='dropdown-trigger right' style="color: #000;" href='#' v-bind:data-target="'payment-pref-sidemenu-' + item.id"><i class="material-icons">more_vert</i></a>
                <ul v-bind:id="'payment-pref-sidemenu-' + item.id" class='dropdown-content'>
                   <li v-if="!item.principal"> <a @click="setCreditCardAsPrincipal(item)">Definir como Principal</a> </li>
                  <li class="divider"></li>
                  <li> <a @click="deleteCreditCard(item)"> Remover</a> </li>
                </ul>
              </template>

            </span>
            <div>
              <p style="margin-bottom: 0px; text-align: left; margin-left: 29px; display: inline-block" v-if="item.principal"><span class="principal blue">Principal</span></p>
              <p style="margin-bottom: 0px; text-align: left; margin-left: 29px; display: inline-block" v-if="item.voucher"><span class="principal orange">Voucher</span></p>
            </div>
          </div>
        </li>
      </ul>

      <div class="collection">
        <a  @click="addUpdateCreditCard(null)" style="cursor: pointer; font-size: 14px;" class="collection-item">
          <i class="material-icons left">payment</i>Cartão Crédito<i class="material-icons right">add</i></a>

        <a v-if="options.voucher" @click="addUpdateCreditCard(null, true)" style="cursor: pointer; font-size: 14px;" class="collection-item">
          <i class="material-icons left">payment</i>VR / Sodexo / Alelo<i class="material-icons right">add</i></a>

        <a v-if="options.pos" @click="$emit('payment-method-selected', {code: 11})" style="cursor: pointer; font-size: 14px;" class="collection-item">
          <i class="material-icons left">payment</i>TICKET / BEN / VeroCard<i class="material-icons right">chevron_right</i>
        </a>
        <a v-if="options.pos" @click="$emit('payment-method-selected', {code: 11})" style="cursor: pointer; font-size: 14px;" class="collection-item">
          <i class="material-icons left">payment</i>Débito / Crédito na Máquina<i class="material-icons right">chevron_right</i>
        </a>

        <template v-if="checkoutSelectMode">
          <!--<a @click="payNow()" class="collection-item"><i class="fab fa-google left pip-awesome"></i>Google Pay<i class="material-icons right">chevron_right</i></a>-->

          <a v-if="options.wireTransfer" @click="$emit('payment-method-selected', {code: 9})" style="cursor: pointer; font-size: 14px;" class="collection-item">
              <i class="material-icons left">account_balance</i>Transferência Bancária<i class="material-icons right">chevron_right</i>
          </a>

          <a v-if="options.paypal" @click="$emit('payment-method-selected', {code: 5})" style="cursor: pointer; font-size: 14px;" class="collection-item">
            <i class="material-icons left">local_parking</i>Paypal<i class="material-icons right">chevron_right</i>
          </a>

          <a v-if="options.picpay" @click="$emit('payment-method-selected', {code: 10})" style="cursor: pointer; font-size: 14px;" class="collection-item">
            <i class="material-icons left">qr_code</i>PicPay<i class="material-icons right">chevron_right</i>
          </a>

          <a v-if="options.invoiceSlipEnabled" @click="$emit('payment-method-selected', {code: 1, payload: 'todo-send-pre-saved-boleto-data'})" style="cursor: pointer; font-size: 14px;" class="collection-item">
            <i class="material-icons left">account_balance</i>Boleto<i class="material-icons right">chevron_right</i>
          </a>
        </template>

      </div>

    <PipModal v-if="showCCAdmin" v-model="showCCAdmin" title="Novo Cartão de Crédito" modalStyle="max-width: 500px; width: 100%; height: 100%; max-height: 795px;">
      <div class="creditcard">
        <PipCreditCard v-model="cc" :voucher="isVoucher" component-name="creditCard"></PipCreditCard>
        <PipButton :disabled="isProcessing" @click="validateCreditCard">Salvar</PipButton>
        <p style="font-size: 12px; display: inline-block; color: #666666;">Servidor seguro</p>
        <img style="margin-left: 10px; vertical-align: middle;" src="https://pipeu-us.s3.amazonaws.com/images/billing/icon_lock_12x15_yellow.png">
      </div>
    </PipModal>

</div>
</template>

<script>
  import {mapMutations, mapGetters, mapActions} from 'vuex'
  import api from '@/pipeuapi/api.js'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import PipInput from '@/components/pipeu/common/PipInput'
  import PipErrorIndicator from '@/components/pipeu/common/PipErrorIndicator'
  import PipButton from "@/components/pipeu/common/PipButton";
  import AccountHeader from "@/pages/myaccount/AccountHeader";
  import PipRadioGroup from "@/components/pipeu/common/PipRadioGroup";
  import PipCPFInput from "@/components/pipeu/common/PipCPFInput";
  import PipModal from "@/components/pipeu/common/PipModal";
  import PipCreditCard from "@/components/payment/PipCreditCard";
  import { eventHub } from '@/utils/eventHub'

  export default {
    name: 'PaymentPreferenciesComponent',
    mixins: [basicuicomponent],

    props: {
      checkoutSelectMode: {
        required: false,
        type: Boolean,
        default () {
          return false
        }
      },

      options: {
        required: true,
        type: Object,
        default () {
          return null
        }
      }
    },

    data () {
      return {
        entities: [],
        cc: {},
        showCCAdmin: false,
        isVoucher: false
      }
    },
    components: {
      PipCreditCard,
      PipModal,
      PipCPFInput,
      PipRadioGroup,
      AccountHeader,
      PipButton,
      PipInput, PipErrorIndicator
    },

    created: function () {
      let vm = this
      eventHub.$on('pip-credit-card-validate-result', (res) => { // {result:false, cc:vm.cc}
        console.log('>>> pip-credit-card-validate-result res:', res)
        vm.cc = res.cc
        if (res.result) {
          if (vm.cc) {
            vm.cc.voucher = this.isVoucher
            vm.addPrincipalCreditCard(vm.cc)
          }
        }
      })

    },

    beforeDestroy () {
      eventHub.$off('pip-credit-card-validate-result');
    },

    mounted: function () {
      let vm = this
      // if(vm.userHasPrincipalValidCreditCard()) {
      //   vm.getEntities()
      // } else {
      //   vm.attachComponents()
      // }
      vm.getEntities()
      vm.mounted = true
    },

    watch: {
      'cc': function(newValue) {
        console.log('   >>> Watch PaymentPreferenciesComponent cc changed:', newValue)
      }
    },

    methods: {
      ...mapActions(['addUserAccount', 'addAuthToken']),
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'userHasPrincipalValidCreditCard']),

      setAsPrincipalSelectPaymentMethod (item) {
        if (!this.checkoutSelectMode) {
          return
        }

        api.setCreditCardAsPrincipal(item.id).then(res => {
          this.setPrincipalCreditCardSelectedPaymentMethod(item)
        }, (error) => {
          vm.handleApiError(error)
        })
      },

      getEntities() {
        console.log("                 ### getEntities           ");
        let vm = this
        api.getListOfMaskedCreditCardSavedByUser().then(res => {
            let data = res.data
            vm.entities = data
            vm.attachComponents()
          },
          error => {
            vm.handleApiError(error, {ignoreNotFound: true, mainEntity: true})
          }
        )
      },

      addUpdateCreditCard(cc, isVoucher = false) {
        console.log('>>> addUpdateCreditCard')
        this.cc = cc
        this.showCCAdmin = true
        this.isVoucher = isVoucher
      },

      validateCreditCard () {
        let vm = this
        console.log('>>> payment.validateCreditCard vm.cc', vm.cc)
        eventHub.$emit('pip-credit-card-validate') // Emit Validation to CreditCard Component that will emit the event pip-credit-card-validate-result with true of false
      },

      setPrincipalCreditCardSelectedPaymentMethod (cc) {
        this.$store.dispatch('userHasPrincipalValidCreditCard').then(res => {

          this.$emit('payment-method-selected', {code: 2, payload: cc})

          // let OCB = (dispatchOCB && dispatchOCB == 1  ) ? 1:0
          // this.$emit('payment-method-selected', {code: 2, payload: cc, OCB: OCB})
        })
      },

      addPrincipalCreditCard (cc) {
        let vm = this
        console.log('addPrincipalCreditCard')

        let clonedEntity = vm.clone(cc)
        clonedEntity.cc = clonedEntity.cc.split(' ').join('')

        api.addPrincipalCreditCard(clonedEntity).then(res => {
          console.log('addPrincipalCreditCard res', res, res.data)

          vm.$toast.success('Ok !')
          vm.cc = {}
          vm.showCCAdmin = false

          vm.getEntities()
          this.setPrincipalCreditCardSelectedPaymentMethod(res.data)

        }, (error) => {
          vm.handleApiError(error)
        })
      },

      async addCreditCardAsync (cc) {
        let vm = this
        console.log('addCreditCardAsync')

        let clonedEntity = vm.clone(cc)
        clonedEntity.cc = clonedEntity.cc.split(' ').join('')

        try {
          let {data} = await api.addPrincipalCreditCard(clonedEntity)

          console.log('addCreditCardAsync res data', data)
          vm.$toast.success('Ok !')
          vm.cc = {}
          vm.showCCAdmin = false


          let resultHasPrincipalCC = await vm.$store.dispatch('userHasPrincipalValidCreditCard')
          console.log('>>> userHasPrincipalValidCC:', resultHasPrincipalCC)

          if (resultHasPrincipalCC) {
            return data
          } else {
            throw new Error('Error Adding new CreditCard from Google Pay')
          }

        } catch (e) {
          console.log('>>> Error addCreditCardAsync', e)
          throw e
        }
      },

      deleteCreditCard (cc) {
        let vm = this

        let msg = 'Você confirma Remover este Cartão de Crédito ?'
        if (cc.principal) {
          msg = 'Você confirma Remover o Cartão de Crédito Principal de sua Conta ?'
        }

        vm.confirm(msg, '').then((response) => {
          console.log('confirm result calling deleteCreditCard res', response)

          api.deleteCreditCard(cc.id).then((res) => {
            console.log('### deleteCreditCard res.data:', res.data)

            vm.$toast.success('Ok !')
            vm.getEntities()

          }, (error) => {
            vm.handleApiError(error)
          })
        });
      },

      setCreditCardAsPrincipal (cc) {
        let vm = this
        let msg = 'Você confirma definir este Cartão como Principal ?'

        vm.confirm(msg, '').then((response) => {
          console.log('confirm result calling setCreditCardAsPrincipal res', response)

          api.setCreditCardAsPrincipal(cc.id).then((res) => {
            console.log('### setCreditCardAsPrincipal res.data:', res.data)
            vm.$toast.success('Ok !')
            vm.getEntities()
          }, (error) => {
            vm.handleApiError(error)
          })
        });
      },

      payNow () {
        let vm = this
        const supportedPaymentMethods = [
          {
            supportedMethods: 'basic-card'
          }
        ]

        const allDisplayItems = [
          {
            label: 'Subtotal',
            amount: {
              currency: 'BRL',
              value: 10
            }
          }, {
            label: 'Discount (10%)',
            amount: {
              currency: 'BRL',
              value: -1
            }
          }
          // , {
          //   label: 'Tax',
          //   amount: {
          //     currency: 'USD',
          //     value: 0.68
          //   }
          // }
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
          paymentDetails
        )
        // ,options

        request.show()
          .then((paymentResponse) => {
            console.log('paymentResponse', paymentResponse.details)

            if (paymentResponse && paymentResponse.details) {
              let newCC = {
                  cc: paymentResponse.details.cardNumber,
                  name: paymentResponse.details.cardholderName,
                  ccExp: '',
                  month: paymentResponse.details.expiryMonth,
                  year: paymentResponse.details.expiryYear,
                  cvv: paymentResponse.details.cardSecurityCode,
                  flagName: '',
              }

              const Payment = require('payment')

              newCC.flagName = Payment.fns.cardType(newCC.cc)
              console.log('>>> newCC.flagName:', newCC.flagName)

              vm.addCreditCardAsync(newCC).then(res => {
                console.log('@@@ result from addCreditCardAsync res:', res)

                console.log(' $emiting (\'payment-method-selected\', {code: 2, payload: item})  ')
                vm.$emit('payment-method-selected', {code: 2, payload: res})

                eventHub.$emit('dispatch-credit-card-payment-process')

                // let OCB = (dispatchOCB && dispatchOCB == 1  ) ? 1:0
                // this.$emit('payment-method-selected', {code: 2, payload: cc, OCB: OCB})
              })
            }

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

  .creditcard {
    padding: 15px;
    width: 100%;
    margin: auto;
    margin-top: 15px;
  }

</style>
