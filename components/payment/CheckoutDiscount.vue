<template>
  <div v-if="checkout && mounted">

      <template v-if="checkout && checkout.discount">

        <div class="row" style="border-bottom: 1px solid #cccccc; margin-bottom: 20px; ">
          <div class="col s10 l10">
              <h1 style="margin-top: 15px; margin-bottom: 15px;">Desconto Aplicado com Sucesso</h1>
          </div>
        </div>

      </template>
      <template v-else>

        <div class="row" style="border-bottom: 1px solid #cccccc; margin-bottom: 20px; ">
          <div class="col s10 l10">
            <a @click="showDiscount = !showDiscount" style="cursor: pointer;">
              <h1 style="margin-top: 15px; margin-bottom: 15px;">Usar Cupom de Desconto</h1>
            </a>
          </div>

          <div class="col s2 l2">
            <a @click="showDiscount = !showDiscount" style="cursor: pointer;" class="right">
              <i style="margin-top: 15px; margin-bottom: 15px; text-align: right;" class="material-icons">expand_more</i>
            </a>
          </div>
        </div>

        <template v-if="showDiscount"> <!-- Plan Subscription don't have discount feature -->
          <div class="col s12 m12 l12">
            <!--<h1>Cupom de desconto</h1>-->
            <div class="ingress">
              <div class="row"> <!--v-if="!isProcessing"-->
                <div class="col s12">
                  <div class="row">
                    <!--<template v-if="!checkout.discount">-->
                    <div class="col s8">
                      <!--<i class="material-icons prefix">loyalty</i>-->
                      <PipInput :disabled="isProcessing" component-name="code" label-desc="Digite o Código" v-model="code" type="text"></PipInput>
                    </div>
                    <div class="col s4 center" style="margin-top: 15px;">
                      <button :disabled="isProcessing" type="button" v-on:click="applyDiscountCode" class="btn btn-outline">Aplicar</button>
                    </div>
                    <!--</template>-->
                    <!--<template v-else>-->
                    <!--{{checkout.discountMessage}}-->
                    <!--</template>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

      </template>

  </div>
</template>

<script>
  import basicuicomponent from '@/mixins/BasicUIComponent'

  import {mapGetters, mapActions} from 'vuex'

  import { eventHub } from '@/utils/eventHub'
  import PipInput from "@/components/pipeu/common/PipInput";
  import PipButton from "@/components/pipeu/common/PipButton";
  import PipModal from "../pipeu/common/PipModal";

  export default {
    name: 'CheckoutDiscount',
    mixins: [basicuicomponent],

    components: {
      PipModal,
      PipButton,
      PipInput,
    },


    data () {
      return {
        showDiscount: false,

        checkout: {},

        code: '',

        oneClickBuyEnabled: false,

      }
    },

    watch: {
      checkout: {
        handler: function(newValue) {
        },
        deep: true
      }
    },


    created () {
      let vm = this
    },


    async mounted () {
      let vm = this
      // console.log('#### CheckoutDiscount.mounted this.getUserAccount():', this.getUserAccount())

      if (process.client) {

        if (this.getCheckout()) {

          vm.renderCart(this.getCheckout())

          vm.mounted = true

          // Attention
          vm.$nextTick(function () {
            vm.updateComponentKeyReRender()
          })

        }

        if (window.PaymentRequest) {
          // Use Payment Request API
          // console.log('Uha, PaymentRequest API is Enabled')
          // this.paymentRequestAPIEnabled = true
        }
      }

    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getCheckout']),
      ...mapActions(['getCheckoutByTokenId', 'addCartItem', 'updateCartItem', 'deleteCartItem', 'applyCartDiscount', 'addUserAccount']),

      renderCart (checkout) {
        let vm = this
        vm.checkout = checkout
        vm.mounted = true

        // Attention
        vm.$nextTick(function () {
          vm.updateComponentKeyReRender()
        })
      },

      async applyDiscountCode() {
        let vm = this

        //TODO: Fix API return correct code error message

        if (!vm.code || vm.code.length === 0) {
          vm.addPipError('code', 'Digite o código do Cupom')
          return
        }

        try {
          // Download Play Sound Effect
          var audio = new Audio('https://s3.amazonaws.com/pipeu-us/sounds/209578__zott820__cash-register-purchase.wav')

          let res = await vm.applyCartDiscount({checkoutTokenId: vm.checkout.tokenId, discountCode: vm.code})
          console.log('res.data', res.data)

          vm.renderCart(res.data)
          vm.$toast.success('Desconto Aplicado com Sucesso :)')

          audio.play()

        } catch(e)  {
          console.log('Error adding Product to Checkout')
          vm.handleApiError(e)
        }
      },

    }
  }
</script>

<style scoped>

  .note pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
  }

  .btn-outline {
    text-decoration: none;
    color: #0085f7;
    background-color: #fff;
    text-align: center;
    letter-spacing: 0.2px;
    -webkit-transition: background-color .2s ease-out;
    transition: background-color .2s ease-out;
    cursor: pointer;
    border-radius: 50px;
    width: 100%;
    border: 1px solid #0085f7;
    box-shadow: none;
  }



</style>
