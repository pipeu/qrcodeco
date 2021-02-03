<template>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import api from '@/pipeuapi/api'

  export default {
      name: 'Checkout',
      mixins: [basicuicomponent],

      middleware: ['auth'],
      meta: {
          auth: { authority: 2 }
      },

      async asyncData ({ store, params, query, route, req, error, redirect }) {
          console.log('### checkout.vue query:', query)

          let qtt = 1

          // IsNan this seems to be NOT the definitive verification for isNan: Number.isNaN(parseFloat(SOMETHING))
          console.log('query.QTT:', query.QTT)
          console.log('Number.isNaN(parseFloat(query.QTT))):', Number.isNaN(parseFloat(query.QTT)))

          if (query.QTT != undefined && !Number.isNaN(parseFloat(query.QTT))) {
            qtt = decodeURIComponent(query.QTT)
          }
          console.log('qtt:', qtt)

          let product

          // Automatic Lote Replacement
          // 16/06/18 - Verify if the request payment product is a LinkedGroup id (like Main conference ticket group) where it needed to be replaced
          let groupId = decodeURIComponent(query.GRPID)

          if (groupId && groupId !== undefined && groupId !== 'undefined') {
            console.log('### This is a linkedGroup payment request, getting group to get the right product groupId:', groupId)
            try {
              let {data} = await api.getLinkedProductGroupByGroupId(groupId)
              product = data
              // store.dispatch('addProduct', product)
              console.log('### found product on linkedGroup product.name :', product.name)
            } catch (e) {
              return error({ statusCode: 404, message: 'Problema ao Finalizer Compra, não foi possível localizar o Produto deste Grupo' })
            }
          } else {

            if (query.ID === undefined || query.ID === null || query.ID === '') {
              return error({ statusCode: 400, message: encodeURIComponent('Código do Produto não informado !') })
            }

            let productId = decodeURIComponent(query.ID)
            console.log('productId:', productId)
            try {
              let {data} = await api.getProduct(productId)
              product = data
              console.log('product.name:', product.name)
              // store.dispatch('addProduct', product)
            } catch (e) {
              console.log('error e', e)
              return error({ statusCode: 400, message: 'Problema ao Finalizer Compra, não foi possível localizar o Produto' })
            }

          }

          if (!product) {
            return error({ statusCode: 404, message: 'Problema não encontrado !' })
          }


        if (product.free) {
          console.log('################### Free Product, redirecting to checkoutFreeProduct')
          console.log('################### Free Product, redirecting to checkoutFreeProduct')
          console.log('################### Free Product, redirecting to checkoutFreeProduct')
          console.log('################### Free Product, redirecting to checkoutFreeProduct')
          console.log('################### Free Product, redirecting to checkoutFreeProduct')
          return redirect('/checkoutFreeProduct?ID=' + product.id + '&QTT=' + qtt)
        }

        try {

          let {data} = await store.dispatch('addCartItem', {productId:product.id, quantity:qtt})
          console.log('addCartItem data:', data);

          return redirect('/checkoutPayment', { tokenId: data.tokenId + '' })

        } catch (error) {

          let errorMessage = 'Error adding Product to Cart ! ;)'

          console.log('checkout.vue error.response.data:', error.response.data)
          if (error.response.data && error.response.data.errors && error.response.data.errors.message) {
            console.log('checkout.vue error.response.data.errors.message:', error.response.data.errors.message)

            errorMessage = error.response.data.errors.message
          }

          // vm.handleApiError(error)
          return redirect('/ops', { message: encodeURIComponent(errorMessage) })
        }
      },

      methods: {
        ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getPlanById']),
        ...mapActions(['addUserAccount', 'addAuthToken', 'addPlanSubscriptionToCart', 'addProduct', 'addUpdateCartItem', 'addCartItem']),
      }

  }
</script>

