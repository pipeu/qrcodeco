<template>
  <div>
    <div class="row">
      <div style="font-size:42px; padding:20px 0 10px;">
          <h1 style="font-size: 30px; line-height: 40px; margin-bottom: 20px;">Parabéns {{getUserAccount().firstName}}, sua Compra foi Aprovada !</h1>
      </div>
    </div>
    <div class="text-left">
      <h2>Pedido Aprovado ! Uha !</h2>
      <h3 style="padding: 0px 0 0px;">Detalhes da Compra</h3>
      <table width="100%" class="table">
        <tbody>
        <!--<tr>-->
          <!--<td>Número do Pedido</td>-->
          <!--<td>{{order.orderId}}</td>-->
        <!--</tr>-->
        <tr>
          <td width="50%">Forma de Pagamento</td>
          <td width="50%">
            <template v-if="order.numInvoices == 1">
              À Vista  (1x) {{formatCurrency(order.totalAmount)}}
            </template>
            <template v-else>
              {{order.numInvoices }} x {{formatCurrency(order.invoicesAmount)}}
            </template>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import format from '@/mixins/FormatFuncMixin'
  import orderFuncMixin from '@/mixins/OrderFuncMixin'
  import {mapGetters} from 'vuex'

  export default {
    name: 'OrderApprovedData',
    mixins: [format, orderFuncMixin],
    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getCheckout', 'userHasPrincipalValidCreditCard']),
    }
  }
</script>
