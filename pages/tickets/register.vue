<template>
  <div>

    <HeaderPipeu :showCartIcon="false" title="Registro de Ingressos" returnPath="/tickets/register"></HeaderPipeu>
    <template v-if="ticket && ticket.ticketId">
      <UserEventTickets  :singleTicket="ticket"></UserEventTickets>
    </template>
    <template v-else>

      <template v-if="mounted">
        <div class="pip-tickets pip-container account-container card">

          <div class="row">
            <div class="col s12">
              <h1 style="font-size: 24px;font-weight: 300;margin-bottom: 20px;">Passe a câmera do seu Celular ou de seu Laptop no seu Ingresso Físico</h1>
            </div>
          </div>

            <div class="card">
              <div class="row">
                <client-only>
                  <component v-if="mounted" :is="qrCodeReader" @on-decode="onDecode" component-name="qrCodeReader"></component>
                </client-only>
              </div>
            </div>
        </div>

      </template>
    </template>

    <PipErrorIndicator componentName="message"></PipErrorIndicator>

  </div>
</template>

<script>
  /* eslint-disable */
  import pipeuApi from '~/pipeuapi/api.js'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import AccountHeader from "@/pages/myaccount/AccountHeader";
  import UserEventTickets from "@/pages/myaccount/events/tickets/UserEventTickets";
  import HeaderPipeu from "@/components/HeaderPipeu";
  import PipErrorIndicator from "../../components/pipeu/common/PipErrorIndicator";

  export default {
    name: 'TicketRegister',

    components: {PipErrorIndicator, HeaderPipeu, AccountHeader, UserEventTickets},
    mixins: [basicuicomponent],
    middleware: ['auth'],

    data () {
      return {
        ticket: {},
      }
    },

    created: function () {
    },

    mounted: function () {
      let vm = this
      console.log('###### TicketRegister.mounted')
      if (process.client) {
        this.qrCodeReader = () => import(`~/components/common/QRCodeReader`)
        this.mounted = true
      }
    },

    methods: {
      clear () {
        this.ticket = {}
      },

      onDecode (decodedString) {
        let vm = this
        console.log('>>>>>>> onDecode:', decodedString)
        if (decodedString) {
          vm.getEventTicketByQRCode(decodedString)
        }
      },

      getEventTicketByQRCode (qrCode) {
        let vm = this
        console.log('>>>>>>> getEventTicketByQRCode qrCode:', qrCode)

        pipeuApi.getEventTicketProductUserByQRCode(qrCode).then((res) => {
          let data = res.data
          console.log('### return promisse api.getEventTicketProductUserByQRCode data:', data)
          this.ticket = data

        }, (error) => {
          vm.handleApiError(error, {ignoreNotFound: true})
          if (error.response.status == 404) {
            vm.showError('Ingresso não Encontrado ! :(')
          }
        })
      },
    }

  }
</script>

<style scoped>
  @import "@/pages/myaccount/account.css";

  tr.updated {
    animation: blink 2s ease;
  }
  @keyframes blink {
    0% {
      background-color: lightskyblue;
    }
    100% {
      background-color: white;
    }
  }
  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (max-width: 768px) {
    .card {
      box-shadow: none;
    }

  }



</style>
