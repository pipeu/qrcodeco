<template>
  <div v-if="checkout && mounted">

    <div v-if="ttbItems" class="row">
      <div class="col s12 m12 l12">
        <div id="timer" class="pip-timer">
          <span><i class="material-icons">shopping_cart</i></span><span>Seu carrinho expira em</span>
          <span id="minutes">{{ minutes }}</span>
          <span id="middle">:</span>
          <span id="seconds">{{ seconds }}</span>
        </div>
      </div>
    </div>

    <div class="row">

      <div v-if="isPlanSubscriptionCheckout" class="col s12 m12 l12">

        <div class="ingress">
          <div class="row">

            <div class="col s2 l2">
              <img :src="checkout.plan.image" style="width: 100%; padding-right: 20px;">
            </div>
            <div class="col s10 l10">
              <div>
                <span>{{checkout.plan.name }}</span>
              </div>
              <!--<template v-if="checkout.plan.description && checkout.plan.description.length > 80">-->
                <!--<span>{{ checkout.plan.description.substring(checkout.plan.description, 80) }}</span>-->
              <!--</template>-->
              <!--<template v-else>-->
                <!--<span>{{ checkout.plan.description }}</span>-->
              <!--</template>-->

              <!--<span v-if="item.ticketType == 'PAID'" class="label green" > Pago </span>-->

              <template v-if="checkout.plan.totalAmountFirstPeriod === checkout.plan.totalAmountNextPeriod">
                <h1>{{formatCurrency(checkout.plan.totalAmountFirstPeriod)}} </h1>
                <p>{{getRenewalText(checkout.plan)}}</p>
              </template>
              <template v-else>

                <h1>{{formatCurrency(checkout.plan.totalAmountFirstPeriod)}} </h1>
                <p>no Primeiro Mês</p>
                <h1>{{formatCurrency(checkout.plan.totalAmountNextPeriod)}} </h1>
                <p>{{getRenewalText(checkout.plan)}} </p>
              </template>
            </div>
          </div>
        </div>

      </div>

      <div v-else class="col s12 m12 l12">
        <h1>Pedidos</h1>
        <template v-for="item in checkout.items">
          <div class="ingress">
            <div class="row">

              <div class="col s2 l2">
                <img :src="item.product.image" style="width: 100%; padding-right: 20px; ">
              </div>
              <div class="col s8 l8">

                  <div style="padding-bottom: 10px; font-weight: bold;">{{item.product.name }}</div>

                <!--<span v-if="item.ticketType == 'PAID'" class="label green" > Pago </span>-->

                <template v-if="item.product.additionalProducts && item.product.additionalProducts.length > 0">

                  <p style="margin-bottom: 10px; margin-top: 10px;">Ítens adicionais sem custo</p>

                  <template v-for="additionalProduct in item.product.additionalProducts">
                    <template v-if="isProduct(additionalProduct.type) || isProductBundle(additionalProduct.type)">

                      <div class="row" style="margin-top: 20px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                        <div class="col s2 l2">
                          <img :src="additionalProduct.image" style="width: 100%; padding-right: 10px;">
                        </div>
                        <div class="col s10 l10">
                          {{additionalProduct.name}}
                        </div>
                      </div>
                    </template>
                  </template>
                </template>

              </div>

              <div v-if="!readOnly" class="col s2 right-align">
                <a style="cursor: pointer;" @click="deleteCheckoutItem(item)">
                  <i style="font-size: 17px;" class="material-icons">delete</i>
                </a>
              </div>
            </div>

            <div class="row" style="margin-top: 20px; border-top: 1px solid #eeeeee; padding-top: 20px;">
              <div class="col s6 l6">
                <!--style="margin-top: 20px;"-->
                <h2 style="font-size: 17px; color: #ff2f38;">{{formatCurrency(item.product.amount)}}</h2>
              </div>

              <div class="col s6 l6 right-align">

                  <template v-if="item.product.maxQuantityPerOrder > 1">

                    <div class="row">

                        <div class="col s4">
                          <PipButton type="regular" :disabled="isProcessing" @click="decrease(item)" customCSS="background-color: #ff2f38;">-</PipButton>
                        </div>
                        <div class="col s4 center-align" style="margin-top: 5px; font-size: 1.5rem;">
                          <span style="margin-left: 7px;"><b>{{item.quantity}}</b></span>
                        </div>
                        <div class="col s4">
                          <PipButton type="regular" :disabled="isProcessing" @click="increase(item)" customCSS="background-color: #ff2f38;">+</PipButton>
                        </div>

                    </div>

                  </template>
                  <template v-else>
                    Qtde {{item.quantity}}
                  </template>

              </div>
            </div>
          </div>
        </template>
      </div>

        <div v-if="!isPlanSubscriptionCheckout" class="col s12 m12 l12">
          <CartSummary></CartSummary>
        </div>

        <template v-if="checkout && checkout.requireDelivery === true">
          <div class="col s12 m12 l12">
            <DeliverySchedule></DeliverySchedule>
          </div>

          <div class="col s12 m12 l12">
            <div class="ingress">
              <h2 style="margin-bottom: 20px; ">Observações</h2>
              <div class="row">
                <PipTextArea :disabled="isProcessing" :rows="5" component-name="customerNotes" label-desc="Exemplo: Entregar de Manhã" v-model="checkout.customerNotes"></PipTextArea>
                <!--maxlength="140"-->
              </div>
            </div>
          </div>
        </template>

      </div>

  </div>
</template>

<script>
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import {mapGetters, mapState} from 'vuex'
  import {mapActions} from 'vuex'
  import { eventHub } from '@/utils/eventHub'
  import PipInput from "@/components/pipeu/common/PipInput";
  import PipSelectV2 from "@/components/pipeu/common/PipSelectV2";
  import PipButton from "@/components/pipeu/common/PipButton";
  import Cookie from "js-cookie";
  import productsPlansUtils from '@/utils/productsPlansUtils'
  import CartSummary from "../payment/CartSummary";
  import DeliverySchedule from "./DeliverySchedule";
  import PipTextArea from "../pipeu/common/PipTextArea";

  export default {
    name: 'CartServices',
    mixins: [basicuicomponent],

    components: {
      PipTextArea,
      DeliverySchedule,
      CartSummary,
      PipButton,
      PipInput,
      PipSelectV2
    },

    props: {
      readOnly: {
        required: false,
        type: Boolean,
        default () {
          return false
        }
      }
    },

    data () {
      return {
        ttbItems: false, // Time to Buy Items (Items that were reserved and has a time to buy)
        checkout: {},
        title: '',
        totalTime: (15 * 60),

        audio: {}
      }
    },
    computed: {
      ...mapState({
        store: state => state.store,
        userAccount: state => state.userAccount
      }),

      minutes: function() {
        const minutes = Math.floor(this.totalTime / 60);
        return this.padTime(minutes);
      },

      seconds: function() {
        const seconds = this.totalTime - (this.minutes * 60);
        return this.padTime(seconds);
      },

      isPlanSubscriptionCheckout () {
        return productsPlansUtils.isPlanSubscriptionCheckout(this.checkout)
      }
    },

    created () {
      let vm = this
      eventHub.$on('cart-add-item', (item) => {
        console.log('>>> CartServices.cart-add-item listener item:', item)
        // If existing items in Cart then add new one
        if (vm.checkout.items && vm.checkout.items.length > 0) {
          vm.updateCheckoutItem(item)
        } else { // else create a new Cart with a new item
          vm.addProduct(item) // {productId:productId, quantity:quantity}
        }
      })

      // consumer of event
      eventHub.$on('before-payment-request', () => {
        // console.log('>>>>> before-payment-request')
        vm.resetTimer()
        vm.ttbItems = false
      })
    },

    async mounted () {
      let vm = this
      // console.log('#### CartServices.mounted this.getUserAccount():', this.getUserAccount())
      if (process.client) {
        vm.audio = new Audio('https://s3.amazonaws.com/pipeu-us/sounds/209578__zott820__cash-register-purchase.wav')
        vm.audio.type = 'audio/wav';
        if (this.getCheckout()) {
          vm.renderCart(this.getCheckout())

          vm.mounted = true

          // Attention
          vm.$nextTick(function () {
            vm.updateComponentKeyReRender()
          })

          // console.log('vm.getCheckout().ttl:', vm.getCheckout().ttl)
          if (vm.getCheckout().ttl && vm.getCheckout().ttl > 0 && vm.getCheckout().ttlVisible === true) {
            let diffInSeconds = Math.round((Date.now()/1000)-(this.getCheckout().ttl/1000))
            diffInSeconds = diffInSeconds * -1
            if (diffInSeconds > 0) {
              vm.totalTime = diffInSeconds
              vm.startTimer()
              vm.ttbItems = true
            } else {
              // TTL expired
              vm.deleteCheckoutGoToHome()
            }
          }
        }
      }
    },

    watch: {
      'checkout.customerNotes': {
        handler: function(newValue) {
          this.updateCheckoutCustomerNotes(newValue)
        }
      },

      'checkout.selectedDeliveryDay': {
        handler: function(newValue) {
          // console.log('>>>>>>>>>>>>>>>>>>>>>>> ### checkout.selectedDeliveryDay newValue:', newValue)
        },
        deep: true
      }
    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getCheckout']),
      ...mapActions(['getCheckoutByTokenId', 'addCartItem', 'updateCartItem', 'deleteCartItem', 'applyCartDiscount', 'addUserAccount', 'deleteCheckout', 'updateCheckoutCustomerNotes']),

      increase(item) {
        item.quantity = item.quantity + 1
        this.updateCheckoutItem(item)
      },
      decrease(item) {
        if (item.quantity > 1) {
          item.quantity = item.quantity - 1
          this.updateCheckoutItem(item)
        }
      },

      deleteCheckoutGoToHome() {
        try {
          // TODO: Call Checkout Services here and then Vuex if its the case
          this.deleteCheckout()
          Cookie.remove('checkoutTokenId', { path: '/' }); // Attention - Path is Mandatory on set and remove
        }catch (e) {
          // We can ignore error on api delete checkout, since server also delete checkout
          console.log(e)
        }
        this.$router.replace({ path: '/' })
      },

      getRenewalText(item) {
        return productsPlansUtils.getRenewalText(item)
      },

      playDiscountSoundThenToast(message) {
        let vm = this
        // vm.deb('Entered rule')
        var playPromise = vm.audio.play();
        if (playPromise !== undefined) {
          playPromise.then(function () {
            console.log('Playing....');
          }).catch(function (error) {
            vm.err('Failed to play....' + error);
          }).finally(vm.$toast.success(message))
        }
      },

      renderCart (checkout) {
        let vm = this
        // console.log('>>>>>>> CartServcies.renderCart previous vm.checkout:', vm.checkout)
        // console.log('>>>>>>> CartServcies.renderCart checkout:', checkout)
        // vm.debH('[!vm.checkout]:' + (!vm.checkout))
        // vm.deb('[vm.checkout.autoDiscountApplied === false]:' + (vm.checkout.autoDiscountApplied === false))
        // vm.deb('[!vm.checkout.discount]:' + (!vm.checkout.discount))
        // vm.deb('vm.checkout.autoDiscountApplied === false:', vm.checkout.autoDiscountApplied === false)
        // vm.deb('checkout.autoDiscountApplied === true:', checkout.autoDiscountApplied === true)

        if ( vm.checkout && vm.checkout.items && vm.checkout.items.length > 0 ) {
          if (vm.checkout.autoDiscountApplied === false && checkout.autoDiscountApplied === true) {
            vm.playDiscountSoundThenToast('Desconto Aplicado com Sucesso :)')
          }
          if (vm.checkout.playDiscountSound === false && checkout.playDiscountSound === true) {
            vm.playDiscountSoundThenToast(checkout.checkoutMessage)
          }
        }

        vm.checkout = checkout

        if (vm.checkout.items && vm.checkout.items.length > 0) {
          vm.createSetQuantityOptions(vm.checkout)
        }
        vm.mounted = true

        // Attention
        vm.$nextTick(function () {
          vm.updateComponentKeyReRender()
        })
      },

      goToCheckout () {
        console.log('### goToCheckout')
        let vm = this
        vm.$router.replace({ path: '/checkoutPayment?tokenId=' + vm.checkout.tokenId + '' })
      },

      async addProduct (item) {
        let vm = this
        console.log('### addProduct item:', item)
        try {
          let res = await this.addCartItem(item)

          vm.renderCart(res.data)

        } catch(e)  {
          vm.handleApiError(e)
        }
      },

      async deleteCheckoutItem(item) {
        let vm = this
        try {
          let res = await this.deleteCartItem({checkoutTokenId: vm.checkout.tokenId, item: item})
          if (res.data.items && res.data.items.length > 0) {
            vm.renderCart(res.data)

          } else {
            vm.checkout = {}
            // TODO: Transfer this to a Service Class, like AuthService
            Cookie.remove('checkoutTokenId', { path: '/' }); // Attention - Path is Mandatory on set and remove
          }

        } catch (error) {
          vm.handleApiError(error)
        }
      },

      async updateCheckoutItem(item) {
        let vm = this
        // console.log('>>> updateCheckoutItem item:', item)
        try {
          let res = await this.updateCartItem({checkoutTokenId: vm.checkout.tokenId, item: item})
          console.log('updateCheckoutItem.res.data', res.data)

          vm.renderCart(res.data)

        } catch (error) {
          vm.handleApiError(error)
        }
      },

      createSetQuantityOptions (checkout) {
        let vm = this

        for (let item of checkout.items) {
          vm.$set(item, 'quantityOptions', vm.getProductQuantityOptions(item))
        }
      },

      getProductQuantityOptions(item) {
        let vm = this
        // console.log('>>> getProductQuantityOptions item ', item)
        // console.log('>>> getProductQuantityOptions item.product.maxQuantityPerOrder ', item.product.maxQuantityPerOrder)

        let options = {
          label: '',
          materialIcon: '',
          items: []
        }

        let count
        for (count = 1; count <= item.product.maxQuantityPerOrder; count++) {
          let minMaxQttPerItem = vm.calculateMinMaxQuantityPerOrder(item.product, count)
          if (minMaxQttPerItem <= item.product.maxQuantityPerOrder) {
            let optionsItem = {
              value: minMaxQttPerItem,
              text: minMaxQttPerItem,
              description: ''
            }
            options.items.push(optionsItem)
          }
        }

        return options
      },

      calculateMinMaxQuantityPerOrder(prd, currentCount) {
        if (prd.minQuantityPerOrder > 1) {
          return currentCount + (prd.minQuantityPerOrder - 1)
        } else {
          return currentCount
        }
      },

      startTimer() {
        this.timer = setInterval(() => this.countdown(), 1000);
        this.title = "Greatness is within sight!!"
      },

      stopTimer() {
        clearInterval(this.timer);
        this.timer = null;
        this.title = "Never quit, keep going!!"
      },

      resetTimer() {
        this.totalTime = 0;
        clearInterval(this.timer);
        this.timer = null;
        this.title = "Let the countdown begin!!"
      },

      padTime(time) {
        return (time < 10 ? '0' : '') + time;
      },

      countdown() {
        if(this.totalTime >= 1){
          this.totalTime--;
        } else{
          this.resetTimer()
          // expired
          this.deleteCheckoutGoToHome()
        }
      },

      validate () {
        console.log('### validate')
        return true
      },

      saveForLater () {
        // Implement
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
  .pip-timer {
    background-color: #e6f0fc;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #0085f7;
  }
  .pip-timer .material-icons {
    vertical-align: middle;
    padding-right: 10px;
    color: #0085f7;
  }
  .pip-timer #r {
    color: #0085f7;
    font-weight: bold;
    font-size: 18px;
  }
  .pip-timer-off {
    background-color: #e6f0fc;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid indianred;
    color: #c83b6b;
  }
  .pip-timer-off .material-icons {
    vertical-align: middle;
    padding-right: 10px;
    color: #c83b6b;
  }
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
