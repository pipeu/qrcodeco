<template>
  <div v-if="checkout">
    <h1>Resumo</h1>

    <div v-if="isPlanSubscriptionCheckout" class="ingress">
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

    <div v-else class="ingress">
      <table>
        <tbody>
        <tr>
          <td>Ítens</td>
          <td class="right-align"><strong>{{checkout.totalQuantity}}</strong></td>
        </tr>

        <template v-if="checkout.discount">
          <tr>
            <td>Valor</td>
            <td class="right-align"><strong>{{formatCurrency(checkout.totalAmountWithoutDiscount)}}</strong></td>
          </tr>

          <tr>
            <template v-if="checkout.discount.type == 1">
              <td>Desconto</td>
              <td class="right-align"><strong>- {{formatCurrency(checkout.discount.typeValue)}}</strong></td>
            </template>
            <template v-else>
              <td>Desconto</td>
              <td class="right-align"><strong>- {{checkout.discount.typeValue}}%</strong></td>
            </template>
          </tr>

          <tr v-if="checkout.discountMessage && checkout.discountMessage !== ''">
            <td colspan="2">
              <div v-html="checkout.discountMessage"></div>
            </td>
          </tr>
        </template>

        <tr v-if="checkout.checkoutMessage && checkout.checkoutMessage !== ''">
          <td colspan="2">
            <div v-html="checkout.checkoutMessage"></div>
          </td>
        </tr>

        <template v-if="checkout.freightAddedInTotal === true && checkout.freight > 0">
            <tr style="border: none;">
                <td>Frete</td>
                <td class="right-align"><strong>{{formatCurrency(checkout.freight)}}</strong></td>
            </tr>
            <tr>
                <td colspan="2" style="font-size: 12px;">Frete grátis p/ compras acima {{formatCurrency(checkout.freeFreightMinTotalLabel)}}</td>
            </tr>
        </template>

        <tr style="border: none;">
          <td>Total</td>
          <td class="right-align"><strong>{{formatCurrency(checkout.totalAmount)}}</strong></td>
        </tr>

        <template v-if="creditBalance > 0">

            <tr v-if="userAccount">
                <td style="font-size: 13px;">Coze Créditos</td>
                <td class="right-align"><strong>{{formatCurrency(creditBalance)}}</strong></td>
            </tr>

            <tr style="border: none;">
                <td>Total Geral</td>
                <td class="right-align"><strong>{{formatCurrency(checkout.totalAmountWithCredits)}}</strong></td>
            </tr>

        </template>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import format from '@/mixins/FormatFuncMixin'
  import productsPlansUtils from '@/utils/productsPlansUtils'
  import CreditBalance from '../user/CreditBalance';

  export default {
    name: 'CartSummary',
    components: { CreditBalance },
    mixins: [format],

    computed: {
      ...mapState(['checkout', 'userAccount', 'creditBalance']),

      isPlanSubscriptionCheckout () {
        return productsPlansUtils.isPlanSubscriptionCheckout(this.checkout)
      }
    },

    methods: {
      getRenewalText(item) {
        return productsPlansUtils.getRenewalText(item)
      },
    }
  }
</script>

<style scoped>
    .ingress td {
        padding: 13px 0;
    }
</style>
