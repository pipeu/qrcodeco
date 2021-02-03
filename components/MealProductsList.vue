<template>
  <div class="pip-cafe pip-container">
  <div class="row">

    <v-dialog/>

    <template v-if="filteredProducts">
      <div class="restaurant-menu-group scrollspy" :id="'scroll-group-' + id">

        <h2 v-if="title" tabindex="0" class="restaurant-menu-group__title">{{title}}</h2>

        <ul class="restaurant-menu-group__container">

          <template v-for="item in Object.values(filteredProducts)">
            <li tabindex="-1" style="background-color: white;">

                <nuxt-link :to="normalizeProductUrl(item.name, item.id)" style="cursor: pointer;">

                  <div class="cozi-card cozi-card--has-image" @click="showProduct(item)">

                      <h3 class="cozi-card__info"><div class="cozi-card__info--top"> <!--  overflow: hidden; text-overflow: ellipsis;-webkit-line-clamp: 2;-->
                    <span class="cozi-card__description" style=" -webkit-box-orient: vertical; display: -webkit-box;">
                    {{item.name}}</span>
                      <span v-html="item.descriptionDetail" class="cozi-card__details" style="overflow: hidden; text-overflow: ellipsis; -webkit-box-orient: vertical; display: -webkit-box; -webkit-line-clamp: 2;"></span>
                    </div>

                      <span class="cozi-card__price" data-test-id="cozi-card-price">
                        <span class="cozi-card__price--discount">{{formatCurrency(item.amount)}}
                          <span v-if="item.oldPrice > 0" class="cozi-card__price--original">{{formatCurrency(item.oldPrice)}}</span>
                        </span>
                      </span>

                      </h3>

                    <div class="cozi-card__container-image">
                      <img :alt="item.name" :src="item.image" class="marmita-image--responsive cozi-card__image">
                    </div>
                  </div>

                </nuxt-link>


            <template v-if="0 === item.quantity">
                <div class="row">
                    <div class="col s7 l5">
                        <PipButton type="regular" :disabled="true" customCSS="background-color: #000000;">Logo teremos mais</PipButton>
                    </div>
                </div>
            </template>
            <template v-else>

                <template v-if="productAlreadyInCheckout(item)">
                    <template v-if="item.maxQuantityPerOrder > 1">
                        <div class="row">
                            <div class="col s4 l4">

                                <div class="row">
                                    <div class="col s4">
                                        <PipButton style="margin-left: 5px; margin-bottom: 5px;" type="regular" :disabled="isProcessing" @click="decrease(getOrderItemFromCheckout(item))" customCSS="background-color: #ff2f38;">-</PipButton>
                                    </div>
                                    <div class="col s4 center-align" style="margin-top: 5px; font-size: 1.5rem;">
                                        <span style="margin-left: 18px;"><strong><b>{{getOrderItemFromCheckout(item).quantity}}</b></strong></span>
                                    </div>
                                    <div class="col s4">
                                        <PipButton style="margin-left: 5px; margin-bottom: 5px;" type="regular" :disabled="isProcessing" @click="increase(getOrderItemFromCheckout(item))" customCSS="background-color: #ff2f38;">+</PipButton>
                                    </div>
                                </div>

                            </div>
                            <div class="col s8 l8">
                                &nbsp;
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="row">
                            <div class="col s5 l4">
                                <PipButton style="margin-left: 5px; margin-bottom: 5px;" type="regular" :disabled="true" customCSS="background-color: #ff2f38;">Adicionado</PipButton>
                            </div>
                        </div>
                    </template>

                </template>
                <template v-else>
                    <PipButton style="margin-left: 20px; margin-bottom: 20px;" type="outline" :disabled="isProcessing" @click="addToCart(item, 1)" customCSS="border: 1px solid #ff2f38; color: #ff2f38;">Adicionar</PipButton>
                </template>
            </template>

            </li>
          </template>

        </ul>

<!--        <h3 style="font-size: 11px; line-height: 16px; margin-left: 10px;">-->
<!--          * Todos os ítens são embalados Individualmente em embalagens que se decompõe facilmente na Natureza-->
<!--        </h3>-->

      </div>
    </template>


  </div>
  </div>
</template>

<script>
    import {mapState, mapActions, mapGetters} from 'vuex'
    import ProductMealDetail from "@/components/ProductMealDetail";
    import PipModal from "@/components/pipeu/common/PipModal";
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import PipButton from "./pipeu/common/PipButton"
    import { eventHub } from '@/utils/eventHub'

    export default {
        name: 'MealProductsList',
        components: {PipButton, PipModal, ProductMealDetail},
        mixins: [basicuicomponent],
        props: {
            title: {
                type: String,
                required: false,
                default: function () {
                    return null
                }
            },

            id: Number,

            propProducts: {
                type: Array,
                default: function () {
                    return []
                }
            },

            productInfoAlignment: {
                type: String,
                required: false,
                default: function () {
                    return 'bottom'
                }
            },
            productsByLine: {
                type: Number,
                required: false,
                default: function () {
                    return 3
                }
            }
        },
        data: function () {
            return {
                productId: -1,
                product: {},
                showModal: true,
                mounted: false
            }
        },
        computed: {
            ...mapState({
                counter: state => state.counter,
                store: state => state.store,
                userAccount: state => state.userAccount,
                userLogged: state => state.userLogged
            }),

            filteredProducts () {
                let vm = this
                return this.propProducts.filter(function (prd) {
                    let allFilters = true

                    // Filter visible attribute
                    let filterType = prd.visible == true
                    allFilters = filterType

                    return allFilters
                })
            }
        },

        methods: {
            ...mapActions(['setProducts', 'addUpdateCartItem', 'updateCustomerAddress', 'updateCartItem']),
            ...mapGetters(['getStore', 'getUserAccount', 'getDomain, getProductsByDetailPageURL', 'getCustomerAddress', 'getCheckout']),

            getOrderItemFromCheckout(product) {
                return this.getCheckout().items.find(orderItem => orderItem.productId == product.id)
            },

            productAlreadyInCheckout(product) {
                let vm = this
                if (vm.getCheckout() && vm.getCheckout().items && vm.getCheckout().items.length) {
                    const orderItem = vm.getCheckout().items.find(orderItem => orderItem.productId == product.id)
                    if (orderItem) {
                        return true
                    } else {
                        return false
                    }
                }
                return false
            },

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
            async updateCheckoutItem(item) {
                let vm = this
                console.log('>>> updateCheckoutItem item:', item)
                try {
                    let res = await this.updateCartItem({checkoutTokenId: vm.getCheckout().tokenId, item: item})
                    console.log('updateCheckoutItem.res.data', res.data)

                    this.$emit('cart-item-updated')

                } catch (error) {
                    vm.handleApiError(error)
                }
            },

            closeModal () {
                this.product = {}
            },
            showProduct (item) {
                this.showModal = true
                this.product = item
            },

            async addToCart (product, quantity) {
                let vm = this
                const productId = product.id

                if (product.requireDelivery === true) {
                    // If product require delivery and the address was verified regarding radius distance between store hq and customer address (against user logged or not)
                    let user = vm.getUserAccount()

                    if ( ( user && user.mainShippingAddress && user.mainShippingAddress.address && user.mainShippingAddress.userHasValidRadiusDeliveryAddress && user.mainShippingAddress.userHasValidRadiusDeliveryAddress === true ) ||
                        ( vm.getCustomerAddress() && vm.getCustomerAddress().userHasValidRadiusDeliveryAddress === true) ) {
                        // console.log('User has address Validated (in radius for delivery) !')
                    } else {
                        // console.log('User DO NOT have address Validated (in radius for delivery) !')
                        // show popup so that user can validate delivery address by typing zipcode or get logged in
                        eventHub.$emit('show-validate-delivery-address', { product: product, quantity: quantity})
                        return;
                    }
                }

                // Send event to marketing integrations saying use hit checkout Button
                eventHub.$emit('marketing-send-event', {event: 'click_checkout_product', 'checkout_productId': productId})

                try {
                    let result = await this.addUpdateCartItem({productId:productId, quantity:quantity})

                    if (process.client && !vm.isMobile()) {
                        eventHub.$emit('show-pip-cart-checkout')
                    }

                    this.$emit('cart-item-added')

                } catch (error) {
                    vm.handleApiError(error)
                }
            }

        },

        // NOTE: On element creation we just can receive data in lower case like customdata or userlogged, customData or userLogged won't work
        created: function () {
            // console.log('###### created MealProductsList id:', this.id)
            if (this.propProducts) {
                this.setProducts(this.propProducts)
            }
        }
    }
</script>

<style scoped>

  .restaurant-promotions {
    background: white;
    padding: 0 0 15px 0;
    width: 100%;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: "SulSans", Helvetica, sans-serif;
    overflow-x: hidden;
    font-size: 16px;
    height: 100%;
    scroll-behavior: auto;
  }

  .restaurant-menu-group {
    position: relative;
  }

  .restaurant-menu-group__title {
      position: relative;
      font-weight: 500;
      font-size: 1.7rem;
      line-height: 2.1rem;
      padding: 20px 20px;
      margin: 0;
      color: #000;
      width: 100%;
  }

  h2 {
    display: block;
    font-size: 1.1em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  .restaurant-menu-group__container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    grid-gap: 0;
    margin: 0;
  }
  @media only screen and (min-width: 768px) {
    .restaurant-menu-group__container {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 25px;
      grid-auto-rows: minmax(150px, auto);
    }
  }

  ul > li {
    list-style: none;
  }

  li {
    display: list-item;
    text-align: -webkit-match-parent;
    border-bottom: 1px solid #eee;
  }

  @media only screen and (min-width: 375px) {
    .cozi-card--has-image {
      grid-template-columns: 1fr 120px;
    }
  }

  .cozi-card--has-image {
    grid-template-columns: 1fr 100px;
    grid-gap: 15px;
  }

  @media only screen and (max-width: 767px) {
    .cozi-card {
      position: relative;
    }
  }


  .cozi-card {
    position: relative;
    display: grid;
    min-height: 147px;
    width: 100%;
    background: #ffffff;
    padding: 20px;
    text-decoration: none;
    transition: 200ms;
    overflow: hidden;
  }


  .cozi-card__info {
    display: grid;
    grid-template-rows: 1fr 20px;
    margin: 0;
  }

  h3 {
    display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    /* font-weight: bold; */
  }

  .cozi-card__info--top {
    margin-bottom: 23px;
  }

  .cozi-card__description {
      display: grid;
      color: #595959;
      font-weight: 400;
      font-size: 1.2rem;
      line-height: 1.5rem;
      margin-bottom: 20px;
  }

  .cozi-card__details {
      font-size: 0.95rem;
      line-height: 1.5rem;
      font-weight: lighter;
      color: #595959;
  }

  .cozi-card__price {
    font-size: 1rem;
    line-height: 1.25rem;
    font-weight: 400;
    color: #3e3e3e;
  }

  .cozi-card__price--discount {
    color: #ff2f38;
  }

  .cozi-card__price {
    font-size: 1rem;
    line-height: 1.25rem;
    font-weight: 400;
    color: #3e3e3e;
  }

  .cozi-card__price--original {
    position: relative;
    font-size: 0.75rem;
    line-height: 1.25rem;
    color: #717171;
    text-decoration: line-through;
    margin-left: 5px;
  }

  .cozi-card .cozi-card__container-image {
    position: relative;
  }

  @media only screen and (min-width: 375px) {
    .cozi-card__image {
      width: 120px;
      height: 100px;
    }
  }

  .cozi-card__image {
    width: 100px;
    /*height: 75px;*/
    -o-object-fit: cover;
    object-fit: cover;
    border-radius: 4px;
    pointer-events: none;
    align-self: flex-start;
  }

  .marmita-image--responsive {
    width: 100%;
  }

  img {
    border-style: none;
  }

  * {
    box-sizing: border-box;
  }

  li {
    display: list-item;
    text-align: -webkit-match-parent;
  }

  .cozi-card--horizontal {
    border-top: 1px solid rgb(238, 238, 238);
  }


</style>
