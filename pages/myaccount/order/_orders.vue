<template>
  <div>
    <HeaderPipeu :showCartIcon="false" title="Pedidos" returnPath="/"></HeaderPipeu>

    <div class="pip-tickets pip-container account-container card">

      <div class="row">

<!--        <div class="col s12">-->
<!--          <ul class="tabs">-->
<!--            <li class="tab col s12"><a class="active">Pedidos</a></li>-->
<!--            &lt;!&ndash;TODO, implement&ndash;&gt;-->
<!--            &lt;!&ndash;<li class="tab col s3"><a class="active" href="#activeTickets">Ativos</a></li>&ndash;&gt;-->
<!--            &lt;!&ndash;<li class="tab col s3"><a href="#inactiveTickets">Finalizados</a></li>&ndash;&gt;-->
<!--          </ul>-->
<!--        </div>-->

      <template v-if="entities && entities.length > 0">
        <div class="col s12">
          <div class="tickets-on">

            <template v-for="(order, index) in entities">

              <div class="row" style="border-top: 1px solid #f6b2b5; border-bottom: 0px solid #eee;">
                <div class="col s12 l12">
                  <div class="status">
                    <div style="float: right; margin-top: 5px; color: #999"><span>{{formatDateTimeWithZoneHHMM(order.entryDate)}}</span></div>
                    <p><span>Pedido</span> <strong>{{order.orderId}}</strong></p>
                    <p><span>Valor</span> {{formatCurrency(order.totalAmount)}}</p>
<!--                    <p><span><img :src="getPaymentMethodFlagImage(order.paymentMethod)" height="20px;" style="vertical-align: middle" alt=""></span> &lt;!&ndash; <span>**** 4321</span>&ndash;&gt;</p>-->
                    <p v-if="order.orderStatus == 2" style="color: forestgreen; font-weight: bold;"><i class="material-icons">check_circle</i> {{order.orderStatusDesc }} </p>
                    <p v-else-if="order.orderStatus == 1" style="color: blueviolet; font-weight: bold;"><i class="material-icons">watch_later</i> {{order.orderStatusDesc }} </p>
                    <p v-else-if="order.orderStatus == 3" style="color: red; font-weight: bold;"><i class="material-icons">cancel</i> {{order.orderStatusDesc }} </p>
                    <p v-else-if="order.orderStatus == 4" style="color: orangered; font-weight: bold;"><i class="material-icons">supervised_user_circle</i> {{order.orderStatusDesc }}</p>
                    <p v-else> {{order.orderStatusDesc }} </p>
                  </div>
                </div>
              </div>

              <div v-if="order.checkoutTokenId"  style="padding: 0px 10px; border-bottom: 0px solid #eee;">

                  <PipButton customCSS="background-color: #ff2f38;" type="regular" :disabled="isProcessing" @click="orderAgain(order.checkoutTokenId)">Repetir Pedido</PipButton>

              </div>

              <div class="row" style="background-color: #fbf7f7;">
                <p style="margin-top: 15px; margin-bottom: 30px;"><strong>Ítens do Pedido</strong></p>
                <template v-for="item in order.items">

                <!--TODO: See Order Detail-->
                <!--<a @click="viewTicket(item)" style="cursor: pointer;">-->

                  <div class="col s2 l1">
                    <div> <img :src="item.product.image" alt="" style="width: 100%;"> </div>
                  </div>

                  <div class="col s10 l11">
                    <div class="status">
                      <h1>{{trimText(item.product.name, 50, '')}}</h1>
                        <p>Quantidade {{item.quantity}}</p>
                    </div>
                  </div>
                <!--</a>-->

                </template>
                </div>
            </template>

          </div>
        </div>

        <client-only>
          <infinite-loading @infinite="infiniteHandler" ref="infiniteLoading" :distance="distance">
          <span slot="no-more"></span>
          <span slot="no-more">Não existem mais Pedidos :(</span>
          <span slot="no-results"></span>
          </infinite-loading>
        </client-only>

      </template>
      <template v-else>
        <div class="col s12">
          <div class="pip-empty">
            <a href="#" style="color: inherit">
              <h1><i class="material-icons left">local_play</i></h1>
              <p>Nenhum Pedido</p>
            </a>
          </div>
        </div>
      </template>

      </div>
    </div>
    <FooterPipeu></FooterPipeu>
  </div>
</template>

<script>

  import basicuicomponent from '@/mixins/BasicUIComponent'
  import formatMixin from '@/mixins/FormatFuncMixin'
  import {mapActions, mapGetters} from 'vuex'
  import api from '@/pipeuapi/api.js'
  import auth from '@/store/auth.js'
  import PipErrorIndicator from "@/components/pipeu/common/PipErrorIndicator"
  import PipButton from "@/components/pipeu/common/PipButton"
  import AccountHeader from "@/pages/myaccount/AccountHeader"
  import InfiniteLoading from 'vue-infinite-loading'
  import HeaderPipeu from "../../../components/HeaderPipeu"
  import FooterPipeu from "../../../components/FooterPipeu"
  import { eventHub } from '@/utils/eventHub'

  export default {
    name: 'Orders',
    mixins: [basicuicomponent, formatMixin],
    middleware: ['auth'],
    meta: {
      auth: { authority: 2 }
    },

    data () {
      return {
        entities: [],
        limit: 30,
        offset: 0,
        count: false,
        distance: -Infinity, // InfinityScroll disabled until we load Data
      }
    },
    components: {
      FooterPipeu,
      HeaderPipeu,
      AccountHeader,
      PipButton,
      PipErrorIndicator,
      InfiniteLoading
    },

    mounted: function () {
      let vm = this
      vm.getOrders()
    },

    methods: {
      ...mapActions(['addCheckout']),
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain']),

      async orderAgain(tokenId) {
        let vm = this
        console.log("### OrderAgain:", tokenId);
        try {
          let {data} = await api.duplicateCheckout(tokenId)
          console.log("### return promisse api.duplicateCheckout data:", data);

          await vm.addCheckout(data)
          eventHub.$emit('show-pip-cart-checkout')

        }catch (e) {
          this.handleApiError(e)
        }
      },

      getOrders() {
        let vm = this
        api.getUserOrders(vm.limit, vm.offset, false).then(res => {
            let data = res.data
            console.log("### return promisse api.getUserOrders data:", data);
            vm.entities = data
            // vm.attachComponents()
            vm.distance = 100 // InfinityScroll enable after we get first data and attach Components
          },
          error => {
            vm.handleApiError(error, {ignoreNotFound: true})
          }
        )
      },

      infiniteHandler($state) {
        let vm = this
        console.log("      ### infiniteHandler search           ");
        vm.offset = vm.entities.length
        api.getUserOrders(vm.limit, vm.offset, false).then(res => {
          let data = res.data
          console.log('### return promisse infiniteHandler api.getUserOrders data:', data)

          if (data.length) {
            vm.entities = vm.entities.concat(data)
            $state.loaded()
            if (data.length < vm.limit) { //if new data lenth is lower than the limit means there is no more data on server
              $state.complete();
            }
          } else {
            $state.complete();
          }

          // We can sort data otherwise new data could go to top and with infinite scroll new data needs to be on bottom
          // this.clients = data.sort(vm.sortClients)
          // Call parent (mixin) to attach unreactive components
          // vm.attachComponents()

        },(error) => {
          vm.handleApiError(error, {ignoreNotFound: true})
          $state.complete()
        })
      }


    }

  }
</script>
<style scoped>
  @import "@/pages/myaccount/account.css";
  hr {
    border: 0;
    height: 1px;
    background: #eee;
  }
  .pip-tickets .status {
    padding-left: 10px;
  }
    .pip-tickets .status p {
        line-height: 24px;
    }
    .pip-tickets .status h1 {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .pip-tickets .status strong {
      font-weight: bold;

    }
  .pip-tickets .status .material-icons {
    vertical-align: middle;
    font-size: 18px;
  }
  .pip-tickets .tickets-on .date h6 {
    color: #999;
    text-transform: uppercase;
    margin-bottom: 5px;
    font-size: 12px;
  }
  .pip-tickets .tickets-on .date h5 {
    font-size: 18px;
  }
  .pip-tickets .tickets-on .row {
    padding: 15px 10px;
    border-bottom: 1px solid #eee;
    margin: 0;
  }
  .pip-tickets .tickets-on .row:hover {
    background-color: #f9f9f9;
  }
  .card img {
    width: 30px;
    margin-bottom: 0;
    border-radius: 0px;
  }
  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (max-width: 768px) {
    .card {
      box-shadow: none;
    }
  }
  .pip-empty {
    position: relative;
    text-align: center;
    color: #999;
    margin-top: 50px;
  }

  .pip-tickets .tickets-on .row .col {
    padding: 0;
    margin-bottom: 20px;
  }


</style>

