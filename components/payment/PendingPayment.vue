<template>
  <div v-if="orderIssuedWaitingPayment()">

    <!-- If order pending payment is Invoice Slip show options-->
    <template v-if="order.paymentMethod === 1">

      <p style="font-size: 20px;color: #1b427c;padding: 0 0 25px;">Ordem de Compra Confirmada</p>

      <table width="100%" class="table">
        <tbody>
        <tr>
          <td colspan="2">Imprima o Boleto e pague em qualquer agência bancária, casas lotéricas ou pela Internet até a data de vencimento.</td>
        </tr>

        <!--<tr>-->
        <!--<td>Número do Pedido</td>-->
        <!--<td>{{order.orderId}}</td>-->
        <!--</tr>-->

        <!--<template v-if="isDigitalProduct(productDefault.type)"> &lt;!&ndash; && productDefault.digitalGoodType === 1 &ndash;&gt;-->
        <!--<tr>-->
        <!--<td colspan="2">O Link para Download do Arquivo será enviado por Email e também disponível em sua Conta (Minha Conta)</td>-->
        <!--</tr>-->
        <!--</template>-->

        </tbody>
      </table>

      <div class="row ">
        <div class="col-lg-10 col-md-8 col-xs-9">
          <p style="background-color:#FFFFCC; padding:10px; border:1px solid #EEE; margin-top:15px; font-size: 14px;">
            <strong>ATENÇAO:</strong> O Produto
            será liberado após recebermos a confirmação do pagamento do boleto que geralmente demora <strong>2 dias úteis</strong>.
            Para ter acesso imediato, utilize seu cartão de crédito.
          </p>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8 col-md-8 col-xs-9">
          <PipButton type="popup" :linkURL="order.boletoCode">Imprimir Boleto</PipButton>
        </div>
      </div>
    </template>

    <template v-else-if="order.paymentMethod === 9">

      <p style="font-size: 16px;">
        <strong>Seu Pedido foi Confirmado com Sucesso.</strong>
      </p>


      <p style="font-size: 14px;">
        Para concluir sua compra você precisa fazer uma transferência bancária / depósito no valor de <strong>{{formatCurrency(order.totalAmount)}}</strong> na Conta Abaixo:
      </p>

      <p style="background-color:#FFFFCC; padding:5px; border:1px solid #EEE; margin-top:5px; font-size: 14px;">
        <strong> Tipo: </strong>Conta Corrente<br>
        <strong> Banco: </strong>341 (Itaú)<br>
        <strong> CNPJ: </strong>33.192.514/0001-45<br>
        <strong> Nome: </strong>COZINHA MARKETPLACE E SERVICOS DIGITAIS LTDA (Pipeu)<br>
        <strong> Agência: </strong>7660<br>
        <strong> Conta: </strong>28030-1<br>
      </p>


      <p style="background-color:#FFFFCC; padding:5px; border:1px solid #EEE; margin-top:15px; font-size: 14px;">
        Por favor, nos envie o Comprovante de Pagamento para alguns dos contatos abaixo, assim agilizamos a entrega do seu pedido:
        <strong> Telefone / WhatsApp:</strong>

        <a :href="'https://wa.me/'+ store.properties.jsonValue.whatsAppNumber + '?text=Oi,%20estou%20interessado%20em%20fazer%20o%20pagamento%20através%20de%20transferência%20bancária%20para%20o%20' + store.name" target="_blank">
          <img src="https://static.pipeu.co/clients/cozinha/images/whatsapp.svg" class="pip-whats">{{formatPhoneNumberForDomesticUser(store.properties.jsonValue.whatsAppNumber)}}
        </a>
        <!--      (11) 9953-56972-->
        <br>
        <strong> Email:</strong> oi@cozinha.com.br<br>
      </p>

      <p style="margin-top:10px; font-size: 15px;">
        <strong>
        Seu pedido será enviado assim que confirmarmos o pagamento.
        </strong>
      </p>

    </template>

    <template v-else-if="order.paymentMethod === 10">
      <template v-if="order && order.picPayTx && order.picPayTx.qrcode">

        <div class="row">
          <div class="col s12 l12 center-align">
            <img src="https://pipeu-us.s3.amazonaws.com/images/billing/picpay.svg?rev=1" class="logo">
          </div>
        </div>

        <div class="row">
          <div class="col s12 l12 center-align">
            <a :href="order.picPayTx.paymentUrl">
              <img :src="order.picPayTx.qrcode.base64" style="width: 150px;">
            </a>
          </div>
        </div>

        <div class="row" style="margin-bottom: 25px;">
          <div class="col s12 l12 center-align">
            <a :href="order.picPayTx.paymentUrl" style="font-size: 12px;">Clique para Abrir o aplicativo
            </a>
          </div>
        </div>

        <div class="row">
          <strong>
          Abra o PicPay em seu Telefone e finalize este Pagamento
          </strong>
        </div>

      </template>
<!--      <template v-else>-->
<!--        Erro ao processar pedido com PicPay, por favor utilize outro método de Pagamento-->
<!--      </template>-->

    </template>

    <template v-else-if="order.paymentMethod === 11">

      <p style="font-size: 16px;">
        <strong>Seu Pedido foi Confirmado com Sucesso.</strong>
      </p>


      <p style="font-size: 14px;">
        Agora é só aguardar a Entrega.
        Nosso motorista irá levar a Máquina de Cartão para o pagamento do pedido no valor de <strong>{{formatCurrency(order.totalAmount)}}</strong>
      </p>

      <p style="background-color:#FFFFCC; padding:5px; border:1px solid #EEE; margin-top:15px; font-size: 14px;">
        Em caso de dúvidas entre em contato conosco pelo <strong> Telefone / WhatsApp:</strong><br>

        <a :href="'https://wa.me/'+ store.properties.jsonValue.whatsAppNumber + '?text=Oi,%20estou%20interessado%20em%20fazer%20o%20pagamento%20através%20de%20transferência%20bancária%20para%20o%20' + store.name" target="_blank">
          <img src="https://static.pipeu.co/clients/cozinha/images/whatsapp.svg" class="pip-whats">{{formatPhoneNumberForDomesticUser(store.properties.jsonValue.whatsAppNumber)}}
        </a>
        <!--      (11) 9953-56972-->
        <br>
        <strong> Email:</strong> oi@cozinha.com.br<br>
      </p>

      <p style="margin-top:10px; font-size: 15px;">
        <strong>
        Seu pedido deverá ser pago na entrega
        </strong>
      </p>

    </template>

  </div>
</template>

<script>

  import {mapActions} from 'vuex'
  import { eventHub } from '@/utils/eventHub'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import orderFuncMixin from '@/mixins/OrderFuncMixin'
  import PipButton from "../pipeu/common/PipButton";
  import api from '@/pipeuapi/api'

  export default {
    name: 'PendingPayment',
    components: {PipButton},
    mixins: [basicuicomponent, orderFuncMixin],

    data: function() {
      return {
        picpayInterval: -1,
      }
    },

    watch: {
      order: function (newValue, oldValue) {
      }
    },

    created () {
      eventHub.$on('picpay-payment-approved-interval', () => {
      })

      console.log('>>> PendingPayment.picpay-payment-approved-interval')
      let vm = this
      if (vm.picpayInterval == -1 && vm.order.paymentMethod === 10) {
        console.log('creating picpay interval...')
        this.picpayInterval = setInterval(() => {
          vm.checkPicPayPayment()
        }, 15000)
      }
    },

    beforeDestroy () {
      clearInterval(this.picpayInterval)
    },

    methods: {
      ...mapActions(['updateOrder']),

      async checkPicPayPayment() {
        console.log('checkPicPayPayment each 15 seconds...')
        let vm = this
        console.log('Querying getPicPayOrder Rest for id', vm.order.orderId)
        try {
          let {data} = await api.getPicPayOrder(vm.order.orderId)
          console.log('res getPicPayOrder data', data)

          // If status has changed then update vuex
          if (data.orderStatus !== vm.order.orderStatus) {
            clearInterval(vm.picpayInterval)
            await this.updateOrder(data) // update order on vuex
          } else {
            console.log('Order status is the same data.orderStatus:', data.orderStatus)
          }

        } catch (e) {
          console.log(`Error getting order ${orderId}`, e)
        }
      }

    }
  }
</script>

<style>
  .logo {
    height: 40px;
    transition: all 0.25s ease-in-out 0s;
  }

  .pip-buy-tickets .ingress p {
    margin-bottom: 30px;
    color: #212020;
  }

  .pip-whats {
    height: 25px;
    -webkit-filter: drop-shadow(1px 1px 2px rgb(0,0,0,0.5));
    filter: drop-shadow(1px 1px 2px rgb(0,0,0,0.5));
    margin-top: 1px;
    margin-right: 5px;
  }
</style>
