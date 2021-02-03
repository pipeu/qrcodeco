<template>
  <div v-if="productsGroup && show && mounted">

    <transition name="pip-modal">

      <div class="pip-modal-mask">
        <div class="pip-modal-wrapper" :style="modelStyle">

          <div class="pip-modal-header">

            <client-only>
              <template v-if="isMobile()">
                  <span style="padding-bottom: 10px;">
                  <a @click="handleClose">
                    <i style="margin-top: -10px;" class="material-icons left">arrow_back</i>
                  </a>
                  </span>
              </template>
              <template v-else>
                <!--<slot name="header">-->

                <!--<span style="float: right;"><a @click="handleClose"><i class="material-icons">close</i></a></span>-->

                <span style="">
                  <i class="material-icons" style="vertical-align: middle">shopping_cart</i> 	Selecionar quantidade/tipos de ingressos</span>
                <a @click="handleClose" style="float: right; color: #fff; cursor: pointer;"><i class="material-icons">close</i></a>

                <!--</slot>-->
              </template>
            </client-only>

          </div>

          <div class="pip-modal-container">
            <div class="pip-modal-content" style="overflow-y: auto;">

              <div class="pip-buy-tickets pip-container">

                <div class="row">
                  <div class="col s12 m12 l12">
                    <!--<h1>Selecionar quantidade/tipos de ingressos</h1>-->

                    <template v-for="item in Object.values(productsGroup.productsList)">
                      <div class="ingress">
                        <div class="row">

                          <!--<div class="col s2 l2">-->
                          <!--<img :src="item.image" style="width: 100%; padding-right: 20px; ">-->
                          <!--</div>-->

                          <div class="col s8 l8">

                            <div style="padding-bottom: 10px; font-weight: bold;">{{item.name }}</div>

                            <!--<span v-if="item.ticketType == 'PAID'" class="label green" > Pago </span>-->

                            <template v-if="item.additionalProducts && item.additionalProducts.length > 0">

                              <p style="margin-bottom: 10px; margin-top: 10px;">Ítens adicionais sem custo</p>

                              <template v-for="additionalProduct in item.additionalProducts">
                                <template v-if="isProduct(additionalProduct.type) || isProductBundle(additionalProduct.type)">

                                  <div class="row" style="margin-top: 20px; border-top: 1px solid #eeeeee; padding-top: 20px;">

                                    <!--<div class="col s2 l2">-->
                                    <!--<img :src="additionalProduct.image" style="width: 100%; padding-right: 10px;">-->
                                    <!--</div>-->

                                    <div class="col s10 l10">
                                      {{additionalProduct.name}}
                                    </div>
                                  </div>
                                </template>
                              </template>
                            </template>

                          </div>

                        </div>


                        <div class="row">

                          <div class="col s7 l7">
                            <h2 style="font-size: 17px;">{{formatCurrency(item.amount)}}</h2>

                            <template v-if="item.minQuantityPerOrder > 1">
                              <h2 style="font-size: 15px; color: #C83B6B;">Quantidade mínima {{item.minQuantityPerOrder}}</h2>
                            </template>

                          </div>

                          <div class="col s5 l5 right-align">
                            <div class="quantity">


                                <div class="row">
                                  <div class="col s6 l6">
                                  </div>
                                  <div class="col s6 l3">
                                    <PipSelectV2 @select-change="addToCart(item.id, selectedQuantity)" :key="componentKeyReRender" :componentName="'itemQuantity-'+item.id" :options="getProductQuantityOptions(item)" v-model="selectedQuantity"></PipSelectV2>
                                  </div>
                                </div>

                            </div>

                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>

              </div>


            </div>

          </div>


            <div style="padding-bottom: 80px;">
              <div class="productItem fixed-footer">

                <!--<div v-if="getCheckout() && getCheckout().items" class="col s12 m12 l12">-->
                  <!--&lt;!&ndash;<CartSummary></CartSummary>&ndash;&gt;-->
                <!--</div>-->

                <div>
                  <PipButton :disabled="!getCheckout() || getCheckout().items === 0" type="large" @click="goToPath('/checkoutPayment?tokenId=' + getCheckout().tokenId + '')">Ir para Pagamento</PipButton>

                </div>

              </div>
            </div>

        </div>
      </div>

    </transition>


  </div>

</template>

<script>
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import api from '@/pipeuapi/api.js'
  import {mapGetters, mapState} from 'vuex'
  import {mapActions} from 'vuex'
  import { eventHub } from '@/utils/eventHub'
  import PipInput from "@/components/pipeu/common/PipInput";
  import PipSelectV2 from "@/components/pipeu/common/PipSelectV2"
  import PipButton from "@/components/pipeu/common/PipButton"

  export default {
    name: 'ProductsGroupListView',
    mixins: [basicuicomponent],

    components: {
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
      },

      propProductGroupId: {
        required: true
      }
    },

    data () {
      return {
        selectedQuantity: 0,
        productsGroup: {},
        show: true,
        modelStyle: 'width: 100%; height: 100%;', // default Mobile
        ttbItems: false, // Time to Buy Items (Items that were reserved and has a time to buy) - TODO:
        checkout: {},
        title: '',
        totalTime: (25 * 60)
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

    },

    created () {
      let vm = this
    },


    async mounted () {
      let vm = this
      this.debH('#### ProductsGroupListView.mounted')

      vm.getEntities(vm.propProductGroupId)

      // W and H in Mobile is always 100%
      if (process.client && !vm.isMobile()) {
          vm.modelStyle = 'width: 50%; height: 65%;' // Default no mobile
      }

      if (process.client) {

        // if (vm.ttbItems) {
        //   vm.startTimer()
        // }
        // // Test SnackBar
        // eventHub.$emit('show-pip-snackbar')

      }
    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getCheckout']),
      ...mapActions(['getCheckoutByTokenId', 'addCartItem', 'updateCartItem', 'deleteCartItem', 'applyCartDiscount', 'addUserAccount', 'addUpdateCartItem']),

      async getEntities(groupId) {
        console.log("                 ### getEntities           groupId:", groupId);
        let vm = this
        try {
          let {data} = await api.getProductGroupById(groupId)
          vm.productsGroup = data
          console.log('### found getProductGroupById ', vm.productsGroup)
          console.log('Object.values(vm.productsGroup.productsList):', Object.values(vm.productsGroup.productsList))
          vm.mounted = true

        } catch (error) {
          vm.handleApiError(error)
        }
      },

      filteredProducts () {
        let vm = this
        return Object.values(vm.productsGroup.productsList).filter(function (prd) {
          let allFilters = true
          // Filter visible attribute
          let filterType = prd.visible == true
          allFilters = filterType
          // Others products filters here or already get filtered from API ?

          return allFilters
        })
      },

      showCart () {
        this.show = false
        eventHub.$emit('show-pip-cart-checkout')
      },

      //#Checkout_Multi_Product
      async addToCart (productId, quantity) {
        let vm = this

        try {

          let result = await this.addUpdateCartItem({productId:productId, quantity:quantity})
          console.log('addUpdateCartItem result:', result);

        } catch (error) {
          vm.handleApiError(error)
        }

      },

      getProductQuantityOptions(item) {
        let vm = this

        let options = {
          label: '',
          materialIcon: '',
          items: []
        }

        let count

        // Add 0
        options.items.push({
          value: 0,
          text: 0,
          description: ''
        })

        for (count = 1; count <= item.maxQuantityPerOrder; count++) {

          let minMaxQttPerItem = vm.calculateMinMaxQuantityPerOrder(item, count)

          if (minMaxQttPerItem <= item.maxQuantityPerOrder) {
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
        this.resetButton = true;
        this.title = "Greatness is within sight!!"
      },
      stopTimer() {
        clearInterval(this.timer);
        this.timer = null;
        this.resetButton = true;
        this.title = "Never quit, keep going!!"
      },
      resetTimer() {
        this.totalTime = (25 * 60);
        clearInterval(this.timer);
        this.timer = null;
        this.resetButton = false;
        this.title = "Let the countdown begin!!"
      },
      padTime(time) {
        return (time < 10 ? '0' : '') + time;
      },
      countdown() {
        if(this.totalTime >= 1){
          this.totalTime--;
        } else{
          this.totalTime = 0;
          this.resetTimer()
        }
      },


      validate () {
        console.log('### validate')

        return true
      },


      saveForLater () {
        // Implement
      },


      handleClose () {
        this.show = false
        // this.$emit('input', this.showModal)
      }

    }

  }
</script>

<style scoped>

  .fixed-footer {
    background-color: #fff;
    /*position: fixed;*/
    bottom: 0;
    text-align: center;
    padding: 20px;
    box-shadow: 0 0 5px 0 rgba(0,0,0,.3);
    /* max-width: 600px; */
  }


  @media only screen and (max-width: 768px) {
    .fixed-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      /* max-width: 600px; */
    }
  }


  .productItem {
    padding: 20px;
    background-color: #fff;
    /*margin-bottom: 10px;*/
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
    border-radius: 5px;
    z-index: 100;
  }

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



  .pip-modal {
    position: fixed;
    top: 20px;
    left: 0;
    right: 0;
    background-color: #fafafa;
    padding: 0;
    max-height: 99%;
    width: 85%;
    margin: auto;
    overflow-y: auto;
    border-radius: 2px;
    will-change: top, opacity;
  }

  .pip-modal-mask {
    position: fixed;
    z-index: 1050;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .8);
    display: block;
    transition: opacity .3s ease;
  }

  .pip-modal-wrapper {
    margin: auto; /* 15% from the top and centered */
    height: 100%;
    /*padding: 20px;*/
    display: block;
    vertical-align: middle;
  }

  .pip-modal-header {
    background-color: #002c4b;
    padding: 25px;
    color: #fff;
  }

  .pip-modal-header a {
    color: #fff;
    cursor: pointer;
    font-size: 16px;
  }

  .pip-modal-container {
    width: 100%;
    height: 100%;
    margin: 0px auto;
    padding: 0;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
    overflow: auto;
    position: relative;
  }

  .pip-modal-container h3 {
    font-size: 16px;
    /*background-color: #1976D2;*/
    color: #fff;
    /*padding: 25px;*/
    /*margin: 0;*/

  }
  .pip-modal-container h3 .material-icons {
    font-size: 18px;
    vertical-align: middle;
  }
  .pip-modal-body {
    margin: 20px 0;
  }

  .pip-modal-default-button {
    float: right;
  }

  .pip-modal-footer-actions {
    padding: 15px;
    text-align: right;
    width: 100%;
    border-top: 1px solid #eee;

    /*border-top: 1px solid #e5e5e5;*/
  }
  /*
   * The following styles are auto-applied to elements with
   * transition="pip-modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the pip-modal transition by editing
   * these styles.
   */

  .pip-modal-enter {
    opacity: 0;
  }

  .pip-modal-leave-active {
    opacity: 0;
  }

  .pip-modal-enter .pip-modal-container,
  .pip-modal-leave-active .pip-modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  @media only screen and (max-width : 768px) {
    /*.pip-modal-container {*/
      /*width: 100%;*/
    /*}*/

    .pip-modal-container {
      padding-bottom: 20vh;
    }

  }


</style>
