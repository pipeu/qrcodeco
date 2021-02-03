<template>
  <div>
    <HeaderPipeu :showCartIcon="false"></HeaderPipeu>

    <div v-if="mounted">
      <div class="pipeu-conta card pip-container">
        <h2>Confirme seu Endereço para a Entrega do Produto Abaixo </h2>

        <template v-for="orderItem in products">

          <template v-if="isProduct(orderItem.product.type) || isProductBundle(orderItem.product.type)">
            <h2>{{orderItem.product.name}} </h2>
          </template>

          <template v-if="orderItem.product.additionalProducts && orderItem.product.additionalProducts.length > 0">
            <template v-for="additionalProduct in orderItem.product.additionalProducts">

              <template v-if="isProduct(additionalProduct.type) || isProductBundle(additionalProduct.type)">
                <div class="media" style="margin-bottom: 30px;">
                  <img class="mr-3" :src="additionalProduct.image" style="width: 100px;">
                  <div class="media-body">
                    <h5 class="mt-0"> {{additionalProduct.name}} </h5>{{additionalProduct.description}}</div>
                </div>
              </template>

            </template>
          </template>
        </template>

        <div>
          <PipUserAddress v-model="address"></PipUserAddress>
        </div>

        <PipErrorIndicator componentName="message"></PipErrorIndicator>

        <PipButton @click="nextPage"> Ir para Pagamento</PipButton>

      </div>

    </div>
    <FooterPipeu></FooterPipeu>
  </div>
</template>

<script>

    import {mapGetters} from 'vuex'
    import HeaderPipeu from '@/components/HeaderPipeu'
    import FooterPipeu from '@/components/FooterPipeu'
    import pipeuApi from '@/pipeuapi/api.js'

    import basicuicomponent from '@/mixins/BasicUIComponent'
    import PipButton from "@/components/pipeu/common/PipButton";
    import PipUserAddress from "@/components/pipeu/common/PipUserAddress";
    import PipErrorIndicator from "@/components/pipeu/common/PipErrorIndicator";


    export default {
        name: 'deliveryaddress',

        mixins: [basicuicomponent],

        middleware: ['auth'],
        meta: {
            auth: { authority: 2 }
        },

        data () {
            return {
                products: [],
                order: {},

                address: {}
            }
        },
        components: {
          PipErrorIndicator,
          PipUserAddress,
          PipButton,
          HeaderPipeu, FooterPipeu
        },

        mounted: function () {
          let vm = this
          console.log('deliveryaddress order:', vm.order)
          console.log('deliveryaddress products:', vm.products)


          let user = vm.$store.getters.getUserAccount
          console.log('### deliveryaddress store.getters.getUserAccount: ', user)

          // TODO: Get ShippingAddresses List here

          // If found the address entity then get it, otherwhise get from UserAccount object
          if (user.mainShippingAddress && user.mainShippingAddress.address) {
            console.log('### Found mainShippingAddress at user entity getUserAccount')
            this.address = user.mainShippingAddress
          } else {
            console.log('### NOT Found mainShippingAddress at user entity getUserAccount')
            // TODO: get from personal Data
          }

          vm.mounted = true
        },

        async asyncData ({ store, params, query, route, req, error }) {
            console.log('### deliveryaddress.vue query:', query)
            let products = []

            let orderId = decodeURIComponent(query.ODID) // If orderId in parameters get
            console.log('orderId:', orderId)
            let orderData
            if (orderId) {
                console.log('Querying Orders Rest for id', orderId)
                try {
                    let orderResult = await pipeuApi.getOrder(orderId)
                    orderData = orderResult.data
                    console.log('orderResult', orderResult.data)

                    products = orderData.items

                } catch (e) {
                    console.log(`Error getting order ${orderId}`, e)
                    // error({ statusCode: 404, message: 'Já estamos investigando o problema' })
                    error({ statusCode: 404, message: 'Problema ao Confirmar Endereço de Entrega, não foi possível localizar o Pedido' })
                } finally {
                }
            }
            console.log('product', products)

            return {
                products: products,
                order: orderData
            }

        },

        methods: {
            ...mapGetters([
                'getStore', 'getUserAccount', 'getDomain'
            ]),

            nextPage () {
              let vm = this
              console.log('nextPage')

              // Fixed
              vm.address.mainAddress = true
              vm.address.userConfirmedMainAddress = true

              pipeuApi.updateOrderProductDeliveryAddress(vm.order.orderId, vm.address).then((res) => {
                console.log('updateOrderProductDeliveryAddress res', res, res.data)

                vm.$router.replace({ path: '/' })

              }, (error) => {
                vm.handleApiError(error)
              })

            },


        }

    }
</script>
<style scoped>
  @import "@/pages/myaccount/account.css";

  .pipeu-conta {
    margin-top: 50px;
    width: 100%;
    padding: 50px;
  }
  .pip-login h1 {
    margin: 0;
    padding: 0;
    text-align: left;
    margin-bottom: 40px;

  }
  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (max-width: 768px) {
    .card {
      box-shadow: none;
    }
    .pipeu-conta {
      padding: 15px;
      width: 100%;
      margin: auto;
      margin-top: 20px;
    }
    .pip-login {
      padding-top: 0;
    }
    .input-field {
      position: relative;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    h1 {
      display: none;
    }
  }
</style>
