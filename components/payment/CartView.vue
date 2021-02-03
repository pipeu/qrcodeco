<template>
  <!-- Just Show Cart Items and Show Cart Items if the Checkout is NOT a Plan Subscription Checkout -->
  <div v-if="getCheckout() && !isPlanSubscriptionCheckout">

    <template v-if="showCart">
      <client-only>
        <template v-if="isMobile()">
          <PipModal v-model="showCart" modal-style="width: 50%; height: 100%;">
            <div class="pip-buy-tickets pip-container">
              <CartServices :key="componentKeyReRender + '-pctc-m'"></CartServices>
            </div>
            <PipButton type="big-fixed" :disabled="isProcessing" @click="goToPath('/checkoutPayment?tokenId=' + getCheckout().tokenId + '')">Finalizar Compra</PipButton>
          </PipModal>

        </template>
        <template v-else>
          <CartSideBar v-model="showCart">
            <div class="pip-buy-tickets">
              <CartServices :key="componentKeyReRender + '-pctc-d'"></CartServices>
            </div>
          </CartSideBar>
        </template>
      </client-only>

    </template>
    <template v-else>
      <PipButton type="big-fixed" :disabled="isProcessing" @click="showCart = !showCart">Ver Carrinho</PipButton>
    </template>

  </div>
</template>

<script>
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import {mapGetters, mapActions} from 'vuex'
  import { eventHub } from '@/utils/eventHub'
  import PipButton from "@/components/pipeu/common/PipButton";
  import PipModal from "../pipeu/common/PipModal";
  import Cookie from "js-cookie";
  import CartServices from "../ecommerce/CartServices";
  import PipSideBar from "../pipeu/common/PipSideBar";
  import CartSideBar from "./CartSideBar";
  import productsPlansUtils from '@/utils/productsPlansUtils'

  export default {
    name: 'CartView',
    mixins: [basicuicomponent],

    components: {
      CartSideBar,
      PipSideBar,
      CartServices,
      PipModal,
      PipButton,
    },
    data () {
      return {
        showCart: false,
      }
    },
    computed: {
      isPlanSubscriptionCheckout () {
        return productsPlansUtils.isPlanSubscriptionCheckout(this.getCheckout())
      }
    },

    created () {
      let vm = this
      eventHub.$on('show-pip-cart-checkout', () => {
        console.log('>>> show-pip-cart-checkout')
        // If checkout is already visible try to refresh components due to new items in checkout
        if (vm.showCart === true) {
          vm.updateComponentKeyReRender()
        } else {
          vm.showCart = true
        }
      })
    },

    async mounted () {
      let vm = this
      // console.log('>>> CartView getCheckout:', this.getCheckout())

      // If we don't have checkout on Vuex, is mounting on client side and we have checkout cookie, then get from API
      if (!this.getCheckout() && process.client) {

        // This is a turnaround to resolve a bug and not force user to remove the cookies
        Cookie.remove('checkoutTokenId', { path: '/eventos' });

        let checkoutTokenId = Cookie.get('checkoutTokenId')
        // this.debH('cookies.get(checkoutTokenId)...:', checkoutTokenId)

        if (checkoutTokenId && checkoutTokenId != '' && checkoutTokenId != 'undefined') {
          try {
            let checkoutResponse = await this.getCheckoutByTokenId(checkoutTokenId)
            // vm.deb('CartView.checkoutResponse', checkoutResponse)
          } catch (error) {
            vm.deb('Error getting checkout, possible expired')
            // vm.handleApiError(error)
            // Its safe to ignore api error here if we can't get the checkout object because it can be expired, items without quantity, others
            // In that case we can delete cookies and others object related to old checkout

            // TODO: Transfer this to a Service Class, like AuthService
            Cookie.remove('checkoutTokenId', { path: '/' }); // Attention - Path is Mandatory on set and remove

            let resDelete = await vm.deleteCheckout()
            // vm.deb('CartView.deleteCheckout resDelete', resDelete)
          }
        }
      }
    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getCheckout']),
      ...mapActions(['getCheckoutByTokenId', 'addCartItem', 'updateCartItem', 'deleteCartItem', 'applyCartDiscount', 'deleteCheckout']),

      saveForLater () {
        // Implement
      },
    }
  }
</script>
