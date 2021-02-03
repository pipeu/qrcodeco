<template>
    <div v-if="getCreditBalance() > 0" style="font-size: 13px;">
        <span style="font-size: 13px;">Coze Créditos</span>
        {{formatCurrency(getCreditBalance())}}
    </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import numeral from 'numeral'
  import { eventHub } from '@/utils/eventHub'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import api from '@/pipeuapi/api'

  export default {
    name: 'CreditBalance',
    mixins: [basicuicomponent],

    async mounted () {
      let vm = this

      try {
        let balance = await vm.$store.dispatch('getSetCreditBalance')

      }catch (e) {
        console.log('Error getting getCreditBalance', e)
      }
    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getCreditBalance']),

      formatAmount (amount) {
        return numeral(amount).format('$ 0,0.00')
      },

    }

  }
</script>

<style>
</style>
