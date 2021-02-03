<!-- Checkout Unique ID (this same Checkout can be persisted to be sent by email or restored from another browser session)-->
<template>
  <div class="pip-bg">

    <HeaderPipeu :showCartIcon="false"></HeaderPipeu>

    <TopBar></TopBar>

    <div v-if="mounted" class="pip-buy-tickets pip-container">

        <!-- Initial Checkout State, Order not Confirmed (not paid, not pending, not waiting payment) -->
        <template v-if="!orderConfirmed()">

          <div class="row">
            <div class="pixcomm-head">
              <h1 style="line-height: 40px;">{{getUserAccount().firstName}}, Finalize sua Compra</h1>
              <!--<p>Informe os Dados de pagamento</p>-->
            </div>

            <template v-if="existingOrderId > 0">
              <div id="warningBar" class="pixcomm-head" style="background-color: #f57b21; height: 50px;">
                <p style="font-size: 14px; margin-top: 10px; font-weight: 400;">
                  Você esta realizando o Pagamento de um Pedido de compra já existente que não foi pago, caso opte por Boleto Bancário desconsidere boletos emitidos anteriormente</p>
              </div>
            </template>
          </div>

          <!--Main Row-->
          <div class="row">
            <div class="col s12 m12 l8 pip-padding" style="padding: 0;">

                <!-- If order not confirmed and order has items with deliveries, show Deliveries Data input-->
                <div class="row" style="margin-bottom: 20px;">
                  <div v-if="checkout && checkout.requireDelivery === true" class="col s12 m12 l12">
                    <!--<h1>Seu Carrinho possui Produtos que exigem Entrega</h1>-->
                    <h1 style="margin-bottom: 20px;">
                      <span style="font-size: 36px; font-weight: bold; vertical-align: middle; color: #ff2f38; margin-right: 10px;">
                        <!--1-->
                        {{checkoutStepGetNumber('SHIPPING_ADDRESS')}}
                      </span>
                      Endereço de Entrega
                    </h1>
                    <CheckoutShippingAddress @checkout-step-completed=updateCheckoutStep()></CheckoutShippingAddress>
                  </div>
                </div>

                <!-- If order not confirmed, show Charge Data input-->
                <div class="col s12 m12 l12" style="margin-bottom: 20px;" :style="checkoutStepEnabledDisabled('CHARGE_DATA')">
                  <h1 style="margin-bottom: 20px;">
                    <span style="font-size: 36px; font-weight: bold; vertical-align: middle; color: #ff2f38; margin-right: 10px;">
                      <!--2-->
                      {{checkoutStepGetNumber('CHARGE_DATA')}}
                    </span>
                    Dados de Cobrança
                  </h1>

                  <div class="ingress">
                    <div class="row">
                      <div class="col s10">
                        <ChargeData
                          :cpf.sync="cpf"
                          :processing.sync="isProcessing"
                          :entityType.sync="entityType"
                          :useInvoiceDetails.sync="useInvoiceDetails"
                          :mandatoryInvoiceDetails="mandatoryInvoiceDetails"
                          :registryCode.sync="registryCode"
                          :name.sync="name"
                          v-model="billingAddress">
                        </ChargeData>
                      </div>
                    </div>
                  </div>
                </div>

              <template v-if="checkout.fullPaymentWithCredits === true && checkout.totalAmountWithCredits <= 0">

                <div class="col s12 m12 l12" :style="checkoutStepEnabledDisabled('PAYMENT_METHOD')">
                  <h1 style="margin-bottom: 20px;">
                    <span style="font-size: 36px; font-weight: bold; vertical-align: middle; color: #ff2f38; margin-right: 10px;">
                      <!--3-->
                      {{checkoutStepGetNumber('PAYMENT_METHOD')}}
                    </span>
                    Método de Pagamento
                  </h1>
                </div>

                <div class="col s12 m12 l12">
                  <div class="ingress">
                    <h1 style="margin-top: 0px;font-weight: 400;margin-bottom: 20px;">Usar Coze Créditos</h1>

                    <div class="ingress">
                      <a style="cursor: pointer; font-weight: bold; font-size: 14px;">Você não Precisa pagar nada pelo seu Pedido, você possui {{formatCurrency(creditBalance)}} de Crédito em sua Conta :) </a>
                    </div>

                    <UserCreditPaymentMethod :cpf="cpf"
                            :useInvoiceDetails="useInvoiceDetails"
                            :chargeData="getChargeData()"
                            @payment-update-order="updateOrderInParent">
                    </UserCreditPaymentMethod>

                  </div>
                </div>

              </template>

              <template v-else>

                <!--Payment Method Options-->
                <div class="col s12 m12 l12" :style="checkoutStepEnabledDisabled('PAYMENT_METHOD')">
                  <h1 style="margin-bottom: 20px;">
                    <span style="font-size: 36px; font-weight: bold; vertical-align: middle; color: #ff2f38; margin-right: 10px;">
                      <!--3-->
                      {{checkoutStepGetNumber('PAYMENT_METHOD')}}
                    </span>
                    Método de Pagamento
                  </h1>

                  <div v-if="defaultPaymentMethod == 0" class="ingress">
                    <PaymentPreferenciesComponent :options="checkoutPaymentOptions" @payment-method-selected="selectedPaymentMethodPreferencie" :checkoutSelectMode="true"></PaymentPreferenciesComponent>
                    <a style="cursor: pointer; font-weight: bold; font-size: 14px;" v-if="defaultPaymentMethod > 0 && !isProcessing" @click="resetDefaultPaymentMethod()">Alterar forma de pagamento</a>
                  </div>
                </div>

                <!--Credit Card Payment Method-->
                <!-- v-show here is very important because it will not destroy and re-recreate the component, in that way we can keep state-->
                <div v-show="defaultPaymentMethod == 2" class="col s12 m12 l12">
                  <div class="ingress">
                    <h1 style="margin-top: 0px;font-weight: 400;margin-bottom: 20px;">Cartão de Crédito</h1>

                    <!--// TODO: Create a PaymentMethodInstallments component-->
                    <!--&& !isPlanSubscriptionCheckout --->
                    <template v-if="paymentTypeInstallmentsEnabled && checkout.maxNumInstallments > 1">
                      <div class="col l7 s12">
                        <!--The key propertie is VERY important, it will fore Re-rendering if we change the id, to fix 3Party components issues like Materialize -->
                        <PipSelectV2 :disabled="isProcessing" :key="componentKeyReRender + '-ptic'" componentName="paymentTypeInstallments" :options="paymentTypeInstallmentsOptions" v-model="installments"></PipSelectV2>
                      </div>
                    </template>

                    <div class="row">
                      <div class="col l7 s12">
                        <CreditCardPayment
                          :key="componentKeyReRender + '-ccpc'"
                          :OCB="OCB"
                          :cpf="cpf"
                          :useInvoiceDetails="useInvoiceDetails"
                          :chargeData="getChargeData()"
                          :installments="installments"
                          @payment-update-order="updateOrderInParent">
                        </CreditCardPayment>
                      </div>
                    </div>

                    <a style="cursor: pointer; font-weight: bold; font-size: 14px;" v-if="defaultPaymentMethod > 0 && !isProcessing" @click="resetDefaultPaymentMethod()">Alterar forma de pagamento</a>
                  </div>
                </div>


                <!--Invoice Slip Payment Method-->
                <div v-show="defaultPaymentMethod == 1" class="col s12 m12 l12">
                  <div class="ingress">
                    <h1 style="margin-top: 0px;font-weight: 400;margin-bottom: 20px;">Boleto</h1>

                    <PipInvoiceSlip :cpf="cpf"
                                    :useInvoiceDetails="useInvoiceDetails"
                                    :chargeData="getChargeData()"
                                    @payment-update-order="updateOrderInParent">
                    </PipInvoiceSlip>

                    <div style="margin-top: 30px; margin-left: 15px;">
                      <a style="cursor: pointer; font-weight: bold; font-size: 14px;" v-if="defaultPaymentMethod > 0 && !isProcessing" @click="resetDefaultPaymentMethod()">Alterar forma de pagamento</a>
                    </div>

                  </div>
                </div>

                <!--PayPal Payment Method-->
                <div v-show="defaultPaymentMethod == 5" class="col s12 m12 l12">
                  <div class="ingress">
                    <h1 style="margin-top: 0px;font-weight: 400;margin-bottom: 20px;">PayPal</h1>
                    <template>
                      <PipPayPal :cpf="cpf"
                                 @payment-update-order="updateOrderInParent">
                      </PipPayPal>
                    </template>
                    <div style="margin-top: 30px; margin-left: 15px;">
                      <a style="cursor: pointer; font-weight: bold; font-size: 14px;" v-if="defaultPaymentMethod > 0 && !isProcessing" @click="resetDefaultPaymentMethod()">Alterar forma de pagamento</a>
                    </div>
                  </div>
                </div>

                <div v-show="defaultPaymentMethod == 10" class="col s12 m12 l12">
                  <div class="ingress">

  <!--                  <h1 style="margin-top: 0px;font-weight: 400;margin-bottom: 20px;">PicPay</h1>-->
                    <img src="https://pipeu-us.s3.amazonaws.com/images/billing/picpay.svg" style="fill: #21c25e;height: 40px;transition: all .25s ease-in-out; margin-left: 15px; margin-bottom: 20px;">

                    <template>
                      <PipPicPay :cpf="cpf"
                                 @payment-update-order="updateOrderInParent">
                      </PipPicPay>
                    </template>
                    <div style="margin-top: 30px; margin-left: 15px;">
                      <a style="cursor: pointer; font-weight: bold; font-size: 14px;" v-if="defaultPaymentMethod > 0 && !isProcessing" @click="resetDefaultPaymentMethod()">Alterar forma de pagamento</a>
                    </div>
                  </div>
                </div>

                <div v-show="defaultPaymentMethod == 9" class="col s12 m12 l12">
                  <div class="ingress">
                    <h1 style="margin-top: 0px;font-weight: 400;margin-bottom: 20px;">Transferência Bancária</h1>

                    <PipWireTransfer :cpf="cpf"
                                    :useInvoiceDetails="useInvoiceDetails"
                                    :chargeData="getChargeData()"
                                    @payment-update-order="updateOrderInParent">
                    </PipWireTransfer>

                    <div style="margin-top: 30px; margin-left: 15px;">
                      <a style="cursor: pointer; font-weight: bold; font-size: 14px;" v-if="defaultPaymentMethod > 0 && !isProcessing" @click="resetDefaultPaymentMethod()">Alterar forma de pagamento</a>
                    </div>
                  </div>
                </div>

                <div v-show="defaultPaymentMethod == 11" class="col s12 m12 l12">
                  <div class="ingress">
                    <h1 style="margin-top: 0px;font-weight: 400;margin-bottom: 20px;">TICKET, BEN, VeroCard, Crédito ou Débito</h1>

                    <PipPOS :cpf="cpf"
                                     :useInvoiceDetails="useInvoiceDetails"
                                     :chargeData="getChargeData()"
                                     @payment-update-order="updateOrderInParent">
                    </PipPOS>

                    <div style="margin-top: 30px; margin-left: 15px;">
                      <a style="cursor: pointer; font-weight: bold; font-size: 14px;" v-if="defaultPaymentMethod > 0 && !isProcessing" @click="resetDefaultPaymentMethod()">Alterar forma de pagamento</a>
                    </div>
                  </div>
                </div>

              </template>


            </div>

            <div class="col s12 m12 l4" style="position: sticky; top: 0;">
                <PipSideBar v-model="showCart">
                  <div class="pip-buy-tickets">
                    <CartServices :readOnly="true" :key="componentKeyReRender + '-pctc-dc'"></CartServices>
                    <div v-if="!isPlanSubscriptionCheckout" class="row" style="margin-bottom: 20px;">
                      <CheckoutDiscount :read-only="true"></CheckoutDiscount>
                    </div>
                  </div>
                </PipSideBar>
            </div>

          </div><!-- End Main Row -->
        </template>


      <template v-if="orderConfirmed()">
        <!--<h1>Resultado do Pedido </h1>-->
          <div class="row">
            <div class="col s12 m12 l8 pip-padding" style="padding: 0;">

              <div class="ingress">
              <template v-if="orderApproved()">
                <OrderApprovedData></OrderApprovedData>

              </template>
              <template v-else-if="orderPendingApproval()">

                <PendingApproval></PendingApproval>

              </template>

              <template v-else-if="orderIssuedWaitingPayment()">
                <PendingPayment></PendingPayment>
              </template>

              </div>
            </div>

            <div v-if="order && order.orderId" class="col s12 m12 l4">
              <div class="ingress">
                <table>
                  <tbody>
                  <tr>
                    <td>Número Pedido</td>
                    <td class="right-align"><strong>{{order.orderId}}</strong></td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td class="right-align"><strong>{{order.orderStatusDesc}}</strong></td>
                  </tr>
                  <tr style="border: none;">
                    <td>Total</td>
                    <td class="right-align"><strong>{{formatCurrency(order.totalAmount)}}</strong></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </template>

      <!-- 12 Column -->
      <!--Order Approved Product Details-->
      <template v-if="orderApproved()">

        <div v-if="verifyProductTypeInOrder(1000)" class="row">
          <div class="col s12 m12 l12">
            <!--<h2>Ingressos</h2>-->
            <PaymentApprovedEventTickets :orderId="order.orderId"></PaymentApprovedEventTickets>
          </div>
        </div>
        <!--02/06/18 - Disabled-->
        <!--<div class="row">-->
        <!--<InvoiceData :orderId="order.orderId"></InvoiceData>-->
        <!--</div>-->

        <div class="pip-container">
          <div class="row">
            <div class="col s12 m12 l12">

              <h2 style="padding-top: 10px; padding-bottom: 10px;">Informações Importantes</h2>
              <p class="mt-3 mb-2">
                <PipButton type="regular" @click="printPage"><i class="fa fa-print"></i> Imprimir Página</PipButton>
              </p>

              <template v-for="item in order.items">
                <div class="ingress">
                  <div class="row">
                    <div class="col s12 l12">
                      <h1>{{item.product.name}}</h1>
                      <p>{{item.product.description}}</p>
                      <div v-if="item.product.paymentSuccessImportantNotes && item.product.paymentSuccessImportantNotes.length > 0" style="white-space: pre-wrap; word-wrap: break-word;font-family: inherit;">
                        {{(item.product.paymentSuccessImportantNotes).trim()}}
                      </div>
                    </div>
                  </div>

                </div>
              </template>

              <div class="ingress">
                <div class="row">
                  <div class="col s12 l12">
                    <p v-if="requireDelivery === true">
                      Seu Pedido será Entregue no dia {{formatDateWithZoneDDMMYYYY(selectedDeliveryDate)}} das 08:00 às 19:00
                    </p>
                    <p>
                      <strong>* Enviamos um email para {{getUserAccount().email}} com os dados do Pedido e da Entrega</strong>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </template>


    </div>
  </div>
</template>

<script>
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import {mapGetters, mapState, mapActions} from 'vuex'
  import HeaderPipeu from '../components/HeaderPipeu'
  import MaskedInput from 'vue-text-mask'
  import paymentApi from '~/pipeuapi/payment.js'
  import ChargeData from '../components/user/ChargeData'
  import api from '@/pipeuapi/api'
  import { eventHub } from '@/utils/eventHub'
  import PipCreditCard from "../components/payment/PipCreditCard"
  import PipPayPal from "../components/payment/PipPayPal";
  import PendingApproval from "../components/payment/PendingApproval";
  import OrderApprovedData from "../components/payment/OrderApprovedData";
  import PipWireTransfer from "../components/payment/PipWireTransfer";
  import PipInvoiceSlip from "../components/payment/PipInvoiceSlip";
  import PipInput from "../components/pipeu/common/PipInput";
  import CreditCardPayment from "../components/payment/CreditCardPayment";
  import PipSelectV2 from "@/components/pipeu/common/PipSelectV2";
  import PaymentApprovedEventTickets from "../components/payment/PaymentApprovedEventTickets";
  import PipButton from "../components/pipeu/common/PipButton";
  import CheckoutDiscount from "../components/payment/CheckoutDiscount";
  import PaymentPreferenciesComponent from "../components/payment/PaymentPreferenciesComponent";
  import orderFuncMixin from '@/mixins/OrderFuncMixin'
  // import InvoiceData from '../components/user/InvoiceData'

  import productsPlansUtils from '@/utils/productsPlansUtils'
  import PipSideBar from "../components/pipeu/common/PipSideBar";
  import CheckoutShippingAddress from "../components/payment/CheckoutShippingAddress";

  import Cookie from "js-cookie";
  import PendingPayment from "../components/payment/PendingPayment";

  import CartServices from "@/components/ecommerce/CartServices";
  import PipPicPay from "../components/payment/PipPicPay";
  import PipPOS from "../components/payment/PipPOS";
  import TopBar from '../components/TopBar';
  import UserCreditPaymentMethod from '../components/payment/UserCreditPaymentMethod';

  export default {
    name: 'Payment',
    mixins: [basicuicomponent, orderFuncMixin],
    middleware: ['auth'],
    meta: {
      auth: { authority: 2 }
    },
    components: {
      UserCreditPaymentMethod,
      TopBar,
      PipPOS,
      PipPicPay,
      PendingPayment,
      CheckoutShippingAddress,
      PipSideBar,
      PaymentPreferenciesComponent,
      CheckoutDiscount,
      PipButton,
      PaymentApprovedEventTickets,
      CreditCardPayment,
      PipInput,
      PipInvoiceSlip,
      PipWireTransfer,
      OrderApprovedData,
      PendingApproval,
      PipPayPal,
      PipCreditCard,
      ChargeData,
      HeaderPipeu,

      MaskedInput,
      PipSelectV2,
      CartServices
    },

    head () {
      return {
        title: 'Finalizar Compra',
        link: [
          { rel: 'icon', type: 'image/x-icon', href: 'https://static.pipeu.co/clients/cozinha/images/icons/icon-72x72.png' }
        ]
      }
    },

    data () {
      return {
        checkoutStep: 1,
        showCart: true,
        OCB: '',
        plan: {},
        existingOrderId: 0, // For an existing Order
        checkoutProperties: {},

        checkoutPaymentOptions: {
          creditCard: true,
          invoiceSlipEnabled: true,
          paypal: true,
          wireTransfer: false,
          picpay: false,
          pos: false
        },

        defaultPaymentMethod: 0,
        paymentTypeInstallmentsEnabled: true,
        paymentTypeInstallmentsOptions: {
          label: 'Forma de pagamento',
          materialIcon: '',
          items: []
        },
        installmentsValues: {}, // Installments Values from Product
        installments: 1, // user installments choiced

        oneClickBuyEnabled: false,
        quantity: 1, // param.QTT
        cpf: '',
        useInvoiceDetails: false,
        mandatoryInvoiceDetails: false,

        entityType: 'F',
        registryCode: '',
        name: '',

        // feature_fix_11
        billingAddress: {
          zipCode: '',
          address: '',
          addressNumber: '',
          addressNumberComp: '',
          neighborhood: '',
          city: '',
          state: '',
          country: 'BR'
        },

        paymentRequestAPIEnabled: false,
        paypalEnabled: false,

        requireDelivery: false,
        selectedDeliveryDate: undefined
      }
    },
    computed: {
      ...mapState(['store', 'userAccount', 'checkout', 'order', 'creditBalance']),

      isPlanSubscriptionCheckout () {
        return productsPlansUtils.isPlanSubscriptionCheckout(this.checkout)
      }
    },

    watch: {
      checkout: function (newValue, oldValue) {
        if (newValue && newValue.installmentsValues) {
          this.updatePaymentTypeInstallmentsOptions(newValue.installmentsValues)
        }
      },

      defaultPaymentMethod: function (newValue, oldValue) {
        if (newValue == 1) { // If invoiceSlip than enable ChargeData fields that are mandatory in BR
          this.setMandatoryInvoiceDetails(true)
        } else {
          this.setMandatoryInvoiceDetails(false)
        }
      },

      installmentsValues: {
        handler: function(newValue) {
          this.updatePaymentTypeInstallmentsOptions(newValue)
        },
        deep: true
      }
    },

    async mounted () {
      let vm = this

      // console.log('#### CheckoutPayment.mounted vm.$store.getters.userHasPrincipalValidCreditCard:', vm.$store.getters.userHasPrincipalValidCreditCard)
      console.log('CheckoutPayment.mounted')
      console.log('CheckoutPayment.mounted checkout.fullPaymentWithCredits:', vm.checkout.fullPaymentWithCredits)
      console.log('CheckoutPayment.mounted checkout.totalAmountWithCredits:', vm.checkout.totalAmountWithCredits)
      console.log('CheckoutPayment.mounted creditBalance:', vm.creditBalance)

      let defaultPrimaryPaymentMethod = vm.$store.getters.userHasPrincipalValidCreditCard
      if (defaultPrimaryPaymentMethod === true) {
        vm.defaultPaymentMethod = 2
      } else {
        vm.defaultPaymentMethod = 0
      }

      let clientIntegrations = this.$store.getters.getStore.clientSideIntegrations
      if (clientIntegrations) {
        let paypalClientId = clientIntegrations.find(item => item.paramName === 'PAYPAL_CLIENT_ID')
        if (paypalClientId) {
          this.paypalEnabled = paypalClientId.paramEnabled
        }
      }

      if (process.client) {
        if (window.PaymentRequest) {
          // Use Payment Request API
          console.log('Uha, PaymentRequest API is Enabled')
          this.paymentRequestAPIEnabled = true
        }

        if (vm.getCheckout().installmentsValues && Object.keys(vm.getCheckout().installmentsValues) ) {
          // vm.debH('calling updatePaymentTypeInstallmentsOptions')
          vm.updatePaymentTypeInstallmentsOptions(vm.getCheckout().installmentsValues)
        }
      }

      vm.mounted = true
    },

    async asyncData ({ store, params, query, route, req, redirect, error }) {
      // console.log('### checkoutPayment.vue query:', query)

      let checkout = store.getters.getCheckout

      // console.log('### store.getters.getCheckout() :', checkout)
      // console.log('### query.tokenId :', query.tokenId)
      // console.log('### query.OCB :', query.OCB)

      if (!checkout && query.tokenId) {
        try {
          let cartResp = await store.dispatch('getCheckoutByTokenId', query.tokenId)
          checkout = cartResp.data
        } catch (e) {
          error({statusCode: 400, message: 'Error on Getting Cart !'})
          return
        }
      }

      if (!checkout) {
        error({statusCode: 400, message: 'Error on Getting Cart !'})
        return
      }

      let checkoutProperties
      try {
        let resCheckoutProperties = await paymentApi.getCheckoutProperties()
        checkoutProperties = resCheckoutProperties.data
      } catch (e) {
        error({statusCode: 404, message: 'Pagamento não Configurado, Contate nosso Suporte para Configurar o Pagamento'})
        return
      }

      // TODO: Customize per Store (there is already a service for that on server)
      let checkoutPaymentOptions = {
        creditCard: true,
        invoiceSlipEnabled: false,
        paypal: false,
        wireTransfer: false,
        picpay: false,
        pos: false
      }

      // If checkout in Plan Subscription then disable Allow just CreditCard
      if (productsPlansUtils.isPlanSubscriptionCheckout(checkout)) {
        checkoutPaymentOptions = {
          creditCard: true,
          invoiceSlipEnabled: false,
          paypal: false,
          wireTransfer: false,
          picpay: false,
          pos: false
        }
      }

      // TODO: Customize per Store
      // 27.11.19 - @hardcoded - disable pixelshow boleto
      let pipeuStore = store.getters.getStore

      if (11 == pipeuStore.id) {
          checkoutPaymentOptions = {
              creditCard: true,
              invoiceSlipEnabled: false,
              paypal: true,
              wireTransfer: false,
              picpay: false,
              pos: false
          }
      }
      if (80 == pipeuStore.id) {
        checkoutPaymentOptions = {
          creditCard: true,
          voucher: true,
          invoiceSlipEnabled: false,
          paypal: true,
          wireTransfer: true,
          picpay: true,
          pos: true
        }
      }



      // let orderId = 383 // For testes
      let orderId = query.ODID // If orderId in parameters get

      let orderData = null
      if (orderId) {
        console.log('Querying Orders Rest for id', orderId)
        try {
          let orderResult = await api.getOrder(orderId)
          orderData = orderResult.data
          console.log('orderResult', orderResult.data)
        } catch (e) {
          console.log(`Error getting order ${orderId}`, e)
          error({ statusCode: 404, message: 'Não foi possível recuperar o Pedido, já estamos investigando o problema' })
          return
        }
      }
      // store.state.order = orderData
      store.dispatch('updateOrder', orderData) // Update Vuex with null order (new checkout payment workflow or an existing order passed as argument)


      return {
        OCB: query.OCB,

        entityType: 'F', //Fixed default ChargeData
        registryCode: store.getters.getUserAccount.cpf,
        name: store.getters.getUserAccount.fullName,

        cpf: store.getters.getUserAccount.cpf,
        billingAddress: store.getters.getUserBillingAddress, // feature_fix_11

        checkoutProperties: checkoutProperties,
        checkoutPaymentOptions: checkoutPaymentOptions
      }
    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getCheckout', 'userHasPrincipalValidCreditCard']),
      ...mapActions(['getCheckoutByTokenId', 'deleteCheckout', 'updateOrder']),

      updateCheckoutStep () {
        // console.log('##### >>>>> updateCheckoutStep')
      },

      checkoutStepEnabledDisabled (stepName) {
        let vm = this
      },

      checkoutStepGetNumber (stepName) {
        let vm = this
        let stepNumber = 0

        if (stepName === 'SHIPPING_ADDRESS') {
          stepNumber = 1

        }else if (stepName === 'CHARGE_DATA') {
          stepNumber = 2
          if (vm.getCheckout() && vm.getCheckout().requireDelivery === false) {
            stepNumber = 1
          }

        } else if (stepName === 'PAYMENT_METHOD') {
          stepNumber = 3
          if (vm.getCheckout() && vm.getCheckout().requireDelivery === false) {
            stepNumber = 2
          }
        }
        return stepNumber
      },

      // {code: 2, payload: item, OCB: true}
      selectedPaymentMethodPreferencie (data) {
        let vm = this

        if (data.OCB && data.OCB === 1) {
          vm.OCB = 1
        }

        vm.defaultPaymentMethod = data.code

        // Attention
        vm.$nextTick(function () {
          vm.updateComponentKeyReRender()
        })
      },

      resetDefaultPaymentMethod () {
        console.log('resetDefaultPaymentMethod')
        let vm = this
        vm.defaultPaymentMethod = 0
      },

      verifyProductTypeInOrder(productType) {
        // console.log('>>> verifyProductTypeInOrder productType:', productType)

        for (let item of this.order.items) {
          if (item.product.type == productType) {
            return true
          }
        }
      },


      // TODO: Create a PaymentMethodInstallments component
      updatePaymentTypeInstallmentsOptions (values) {
        let vm = this
        // console.log('>>> updatePaymentTypeInstallmentsOptions values ', values)

        // vm.debH('vm.paymentTypeInstallmentsOptions.items.length:' + vm.paymentTypeInstallmentsOptions.items.length)
        let forceReRender = false
        if (vm.paymentTypeInstallmentsOptions.items.length > 0) {
          forceReRender = true
        }

        // Remove all items
        vm.paymentTypeInstallmentsOptions.items.splice(0, vm.paymentTypeInstallmentsOptions.items.length)

        Object.keys(values).forEach((key)=>{

          let option = { value: key, text: key + ' x ' +  vm.formatCurrency(values[key]) , description: ''}
          vm.paymentTypeInstallmentsOptions.items.push(option)

          // Just re-render if the component already had some data
          if (forceReRender) {
            // Attention
            vm.$nextTick(function () {
              vm.updateComponentKeyReRender()
            })
          }

        })
      },

      setMandatoryInvoiceDetails (value) {
        this.mandatoryInvoiceDetails = value
        this.useInvoiceDetails = value
      },

      validate () {
        console.log('### validate')
        let vm = this
        let fieldValue = vm.cpf.replace(/[_]/g, '')
        if (!fieldValue || fieldValue.length !== 14) {
          vm.showValidationError('cpf', 'Digite o CPF')
          return false
        }
        console.log('### vm.useInvoiceDetails:', vm.useInvoiceDetails)
        if (vm.useInvoiceDetails) {
          if (vm.entityType === 'J') {
            fieldValue = vm.registryCode.replace(/[_]/g, '')
            console.log('registryCode after parsing:', fieldValue)
            if (!fieldValue || fieldValue.length !== 18) {
              vm.showValidationError('registryCode', 'Digite o CNPJ')
              return false
            }
          } else {
            fieldValue = vm.registryCode.replace(/[_]/g, '')
            if (!fieldValue || fieldValue.length !== 14) {
              vm.showValidationError('registryCode', 'Digite o CPF')
              return false
            }
          }
          if (!vm.name || vm.name === '') {
            vm.showValidationError('name', 'Digite o Nome')
            return false
          }
          fieldValue = vm.billingAddress.zipCode.replace(/[_-]/g, '')
          console.log('zipCode:', fieldValue)
          console.log('zipCode.length:', fieldValue.length)
          if (!fieldValue || fieldValue.length !== 8) {
            vm.showValidationError('zipCode', 'Digite o CEP')
            return false
          }
          if (!vm.billingAddress.address || vm.billingAddress.address === '') {
            vm.showValidationError('address', 'Digite o Endereço.')
            return false
          }
          if (!vm.billingAddress.addressNumber || vm.billingAddress.addressNumber === '') {
            vm.showValidationError('addressNumber', 'Digite o Número')
            return false
          }
          if (!vm.billingAddress.neighborhood || vm.billingAddress.neighborhood === '') {
            vm.showValidationError('neighborhood', 'Digite o Bairro')
            return false
          }
        }

        return true
      },

      // feature_fix_11
      getChargeData () {
        let chargeData = {
          entityType: this.entityType,
          registryCode: this.registryCode,
          name: this.name,
          address: this.billingAddress
        }
        return chargeData
      },

      printPage () {
        window.print()
      },

      // Called by Payment Components on procesing order
      updateOrderInParent (pOrder) {
        let vm = this
        vm.updateOrder(pOrder) // Update Vuex

        vm.$nextTick()

        if (pOrder.orderStatus === 2 || pOrder.paymentMethod === 11) { // We must send convertions for other pm to fb and google
          vm.setOrderApproved(pOrder)
        }

        if (vm.orderConfirmed()) {

          vm.requireDelivery = vm.getCheckout().requireDelivery
          if (vm.requireDelivery === true) {
            vm.selectedDeliveryDate = Object.values(vm.getCheckout().deliveryDateOptions).find(obj => obj.day == vm.getCheckout().selectedDeliveryDay)
          }

          try {
            this.deleteCheckout() // Delete Checkout just if order approved
            Cookie.remove('checkoutTokenId', { path: '/' }); // Attention - Path is Mandatory on set and remove
          }catch (e) {
            // We can ignore error on api delete checkout, since server also delete checkout
            console.log(e)
          }
        }
      },

      setOrderApproved (pOrder) {
        let vm = this
        vm.$toast.success('Pagamento Aprovado !')
        eventHub.$emit('show-firefight')
        // Send order to create marketing event to send to Google, Fb, others
        eventHub.$emit('marketing-payment-send-event', {order: pOrder} )

        vm.$store.dispatch('getSetCreditBalance')
      }

    }
  }
</script>

<style scoped>
  @media only screen and (max-width: 768px) {
    .pixcomm-head h1 {
      font-size:24px;
      padding:0 0 0 20px;
    }
  }
  @media only screen and (min-width: 768px) {
    .pixcomm-head h1 {
      font-size:42px;
      padding:0 0 20px 20px;
    }
  }

  /*@media only screen and (max-width: 768px) {*/
    /*.pixcomm-head h1 {*/
      /*font-size:32px;*/
      /*padding:20px 0 10px;*/
    /*}*/

  /*}*/


  /*.pixcomm-head h1 {*/
    /*font-size:42px;*/
    /*padding:20px 0 10px;*/
  /*}*/
  .pixcomm-head p {
    font-size:18px;
    padding-bottom:20px;
  }

  .note pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
  }

  input.invalid {
    border: 2px solid red;
  }
  .validation.failed:after {
    color: red;
    content: 'Validation failed';
  }
  .validation.passed:after {
    color: green;
    content: 'Validation passed';
  }

  .fg-mb {
    margin-bottom: 20px;
  }

  .container-payment {
    background-color: #f8f8f8;
    padding: 20px 0px 20px 0px;
    margin-bottom: 20px;
  }

  .text-center {
    text-align: left;
    margin-left: 250px;
  }

  .input-error {
    color: #B8211D;
    padding: 5px;
    margin-bottom: 13px;
  }

  .account-error {
    color: #e40903;
    padding: 5px;
    margin-bottom: 13px;
  }


  .pip-padding {
    padding: 0!important;
  }

</style>
