<template>
</template>

<script>

import {mapGetters, mapActions} from 'vuex'
import basicuicomponent from '@/mixins/BasicUIComponent'
import api from '@/pipeuapi/api'

export default {
    name: 'CheckoutPlan',

    mixins: [basicuicomponent],

    middleware: ['auth'],
    meta: {
        auth: { authority: 2 }
    },

    async asyncData ({ store, params, query, route, req, error, redirect }) {
        console.log('### checkoutPlan asyncData query:', query)

        let plan

        if (query.PLANID === undefined || query.PLANID === null || query.PLANID === '') {
          return error({ statusCode: 400, message: encodeURIComponent('Código do Plano de Assinatura não informado !') })
        }

        let planId = decodeURIComponent(query.PLANID)
        console.log('planId:', planId)

        try {
          let res = await api.getPlan(planId)
          console.log('### return promisse api.getPlan data:', res.data)

          store.dispatch('addPlan', res.data)

          plan = res.data
        } catch (e) {
          return error({ statusCode: 400, message: 'Tivemos um Problema ao Carregar o Plano de Assinatura, tente mais tarde !' })
        }


        if (!plan) {
            return error({ statusCode: 404, message: 'Problema ao Calcular Checkout, não foi possível localizar o Plano de Assinatura' })
        }


        try {

          let {data} = await store.dispatch('addPlanSubscriptionToCart', plan.id)
          console.log('addPlanSubscriptionToCart data:', data);

          return redirect('/checkoutPayment', { tokenId: data.tokenId + '' })

        } catch (error) {
          // vm.handleApiError(error)
          return redirect('/ops', { message: encodeURIComponent('Error adding Plan Subscription to Cart ! ;)') })
        }


    },

    methods: {
        ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getPlanById']),
        ...mapActions(['addUserAccount', 'addAuthToken', 'addPlanSubscriptionToCart', 'addProduct']),


    }

}
</script>

