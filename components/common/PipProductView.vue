<template>

  <div v-if="product && mounted" class="card">

      <div v-if="product.image" class="media">
          <div class="media-left">
              <a href="#!">
                  <img style="width: 100%;" class="img" :src="product.image" alt="">
              </a>
          </div>
      </div>

      <h3 v-html="product.name"></h3>
      <p v-html="product.description"></p>

      <template v-if="product.detailPage">

          <template v-if="product.detailPageURL">
              <nuxt-link class="btn" :to="product.detailPageURL">Saiba Mais</nuxt-link>
          </template>
          <template v-else>
              <nuxt-link class="btn" :to="normalizeProductUrl(product.name, product.id)">Saiba Mais</nuxt-link>
          </template>

      </template>

      <template v-else-if="product.paymentEnabled">

        <h1>{{formatAmount(product.amount)}}</h1>


        <!-- Its working fine, need to change the UX, Elisson will do it -->
        <!--<PipButton v-if="userHasPrincipalValidCreditCard()" @click="clickCheckout(product.id, selectedQuantity)" class="fast-order">Comprar com 1 Clique</PipButton>-->


        <!--<a @click="addToCart(product.id, selectedQuantity)" class="btn">Incluir no Carrinho</a>-->
        <PipButton type="outline" @click="addToCart(product.id, selectedQuantity)">Adicionar</PipButton>

        <!--<client-only>-->
          <!--<PipSelectV2 v-if="product.maxQuantityPerOrder > 0" :componentName="'qtde' + product.id + '-' + quantity" :options="quantityOptions" v-model="selectedQuantity"></PipSelectV2>-->
          <!--<select v-model="selectedQuantity">-->
              <!--<template v-for="count in product.maxQuantityPerOrder">-->
                  <!--<option v-if="calculateMinMaxQuantityPerOrder(product, count) <= product.maxQuantityPerOrder" :value="calculateMinMaxQuantityPerOrder(product, count)">-->
                      <!--{{ calculateMinMaxQuantityPerOrder(product, count) }}-->
                  <!--</option>-->
              <!--</template>-->
          <!--</select>-->
        <!--</client-only>-->
      </template>
      <template v-else>

          <template v-if="product.free">
            <PipButton @click="registerFreeTicket(product.id)">Inscrever-se</PipButton>
          </template>
          <template v-else>

            <h2>Em Breve !</h2>
            <!--<div class="row">-->
              <!--<div class="col l6">-->
                  <!--<a v-on:click="call()" class="btn"><i class="fa fa-phone" data-fa-transform="rotate-90"></i> Ligar</a>-->
              <!--</div>-->
              <!--<div class="col l6">-->
                  <!--<a  v-on:click="openChat()" class="btn"><i class="fa fa-comment"></i> Chat &nbsp;</a>-->
              <!--</div>-->
            <!--</div>-->

          </template>

      </template>

  </div>
</template>


<script>
    import {mapState, mapActions, mapGetters} from 'vuex'
    import numeral from 'numeral'
    import { eventHub } from '@/utils/eventHub'
    import PipSelectV2 from "../pipeu/common/PipSelectV2";
    import PipButton from "../pipeu/common/PipButton";
    import pipeuAPIMixin from '@/mixins/PipeuAPIMixin'

    /// Init Development Checkout MultiProduct
    export default {
        name: 'PipProductView',
        mixins: [pipeuAPIMixin],
        data () {
            return {
                mounted: false,

                selectedQuantity: 1,
                paymentRequestAPIEnabled: false,

                quantityOptions: {
                  items: [
                    { value: "1", text: '1', name: 'opt-1', default: true, description: '' },
                    { value: "2", text: '3', name: 'opt-2', description: '' },
                    { value: "3", text: '3', name: 'opt-3', description: '' },
                    { value: "4", text: '4', name: 'opt-4', description: '' },
                    { value: "5", text: '5', name: 'opt-5', description: ''},
                    { value: "6", text: '6', name: 'opt-6', description: ''},
                    { value: "7", text: '7', name: 'opt-7', description: ''}
                  ]
                },
            }
        },
        props: {

            viewType: {
                type: String,
                required: false,
                default: function () {
                    return 'default'
                }
            },

            product: {
                type: Object,
                required: true,
                default: function () {
                    return null
                }
            },

            productInfoAlignment: {
                type: String,
                required: false,
                default: function () {
                    return 'bottom'
                }
            },

            id: Number,

            quantity: {
              type: Number,
              required: false,
              default: -1
            }
        },

        computed: {
            ...mapState({
                counter: state => state.counter,
                store: state => state.store,
                userAccount: state => state.userAccount,
                userLogged: state => state.userLogged
            })
        },

        components: {
          PipButton,
          PipSelectV2
        },

        methods: {
            ...mapActions(['addUpdateCartItem']),
            ...mapGetters(['getStore', 'getUserAccount', 'getDomain, getProductsByDetailPageURL','userHasPrincipalValidCreditCard']),

            registerFreeTicket (productId) {
              console.log('### registerFreeTicket')
              let vm = this
              vm.$router.replace({ path: '/checkoutFreeProduct?ID=' + productId + '&QTT=1'})
              // redirect('/checkoutFreeProduct?ID=' + product.id + '&QTT=' + qtt)
            },

            //#Checkout_Multi_Product
            async addToCart (productId, quantity) {
              let vm = this
              try {
                let result = await this.addUpdateCartItem({productId:productId, quantity:quantity})
                eventHub.$emit('show-pip-cart-checkout')
              } catch (error) {
                vm.handleApiError(error)
              }
            },

            // One Click Buy
            async clickCheckout (productId, quantity) {
              let vm = this
              try {
                console.log('### clickCheckout')
                // Send event to marketing integrations saying use hit checkout Button
                eventHub.$emit('marketing-send-event', {event: 'click_checkout_product', 'checkout_productId': productId})

                let result = await vm.addUpdateCartItem({productId:productId, quantity:quantity})
                console.log('after execute addUpdateCartItem, lets see the result:', result)

                vm.$router.replace({ path: '/checkoutPayment?tokenId=' + result.data.tokenId + '&OCB=1' })

              } catch (error) {
                vm.handleApiError(error)
              }
            },

            calculateMinMaxQuantityPerOrder (prd, currentCount) {
                if (prd.minQuantityPerOrder > 1) {
                    return currentCount + (prd.minQuantityPerOrder - 1)
                } else {
                    return currentCount
                }
            },

            /**
             * 14/02/18 - Normalize the product name to be used in URL removing accents, replacing spaces with dash and appending the product id on the end
             */
            normalizeProductUrl (name, id) {
                let finalUrl = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
                finalUrl = finalUrl.replace(/\s/g, '-') // replace spaces to - (dash)
                finalUrl = finalUrl + '-' + id // append id
                finalUrl = '/produtos/' + finalUrl
                return finalUrl
            },

            formatAmount (amount) {
                return numeral(amount).format('$ 0,0.00')
            },

            openChat: function () {
                // emit an event to chat component open.
                console.log('#OPENCHAT emit')
                chat.bus.$emit('open-chat-by-page')

                // Send event to marketing integrations saying use hit chat Button
                eventHub.$emit('marketing-send-event', {event: 'click_chat_button'})
            },

            call () {
                console.log('### call')

                // Send event to marketing integrations saying use hit call Button
                eventHub.$emit('marketing-send-event', {event: 'click_call_seller'})

                this.$modal.show('dialog', {
                    title: 'Contato com o Vendedor',
                    text: '' + this.getStore().phoneOffice,
                    buttons: [
                        {
                            title: 'Fechar'
                        }
                    ]
                })
            }

        },

        async mounted () {
            this.mounted = true
        },

        // NOTE: On element creation we just can receive data in lower case like customdata or userlogged, customData or userLogged won't work
        created: function () {
            let vm = this

            // If min quantity then default will be minQtt
            if (vm.product && vm.product.minQuantityPerOrder > 1) {
                vm.selectedQuantity = vm.product.minQuantityPerOrder
            }

            if (vm.quantity > -1) { // if passed prop greater then default value (-1)

                // If min quantity and param qtt is present check if its lower, if so then min will be min quantity
                if (vm.product.minQuantityPerOrder > 1 && vm.quantity < vm.product.minQuantityPerOrder) {
                    vm.selectedQuantity = vm.product.minQuantityPerOrder
                } else {
                    vm.selectedQuantity = vm.quantity // Set passed prop
                }
            }

        }
    }
</script>

<style scoped>
  .pip-event .ticket .fast-order {
    text-decoration: none;
    color: #000000;
    background-color: #fbca5c;
    text-align: center;
    letter-spacing: .5px;
    transition: background-color .2s ease-out;
    cursor: pointer;
    border-radius: 50px;
    width: 100%;
    font-size: 12px;

    border: none;
    /*border-radius: 2px;*/
    display: inline-block;
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    /*text-transform: uppercase;*/
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;

  }

</style>
