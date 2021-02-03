<template>
  <div>

    <template v-if="zoomTicketShow">

      <ZoomTicket :event="event" :event-user-ticket="ticket" @close-zoom-ticket="zoomTicketShow = !zoomTicketShow"></ZoomTicket>

    </template>
    <template v-else>

      <div class="pip-tickets pip-container card" style="padding: 50px;margin-top: 50px;">

        <div v-if="event" class="order">

          <div class="card">
            <div class="row">
              <div class="col s3">
                <!--class="cover"-->
                <div> <img :src="event.imageUrl" alt="" width="80px;"> </div>
              </div>
              <div class="col s9">
                <div class="summary">
                  <h1>{{trimText(event.eventName, 50, '')}}</h1>
                  <p>{{trimText(event.eventDescription, 50, '')}}</p>
                  <p>
                    <nuxt-link :to="event.aliasCodeURL">
                      Detalhe do Evento
                    </nuxt-link>
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s9">
                <h2>Local</h2>
                <p>{{event.locationName}} </p>
                <p>{{event.locationAddress}} - {{event.locationAddressExtra}} </p>
                <p>{{event.locationCity}} - {{event.locationState}} - {{event.locationCountry}} </p>
              </div>

              <div v-if="event.location.googleMapsUrl" class="col s3">
                <p>
                  <nuxt-link :to="event.location.googleMapsUrl">
                    Ver Mapa
                  </nuxt-link>
                </p>
              </div>
            </div>

            <div class="row qr">
              <div class="col s8">
                <h2>Data e Hora </h2>
                <p><strong>{{formatDateTimeWithZoneHHMM(event.startDate)}} até <br> {{formatDateTimeWithZoneHHMM(event.endDate)}}</strong></p>
              </div>

              <!--TODO: Separete Hour for EventTickets with scheduled hour ?-->
              <!--<div class="col s4">-->
                <!--<h2>Horário</h2>-->
                <!--<p>15h às 19h </p>-->
              <!--</div>-->

              <!--<div class="col s4">-->
                <!--<h2>Tipo de ingresso</h2>-->
                <!--<p>Workshops </p>-->
              <!--</div>-->
            </div>

            <div v-if="order" class="row qr">
              <div class="col s4">
                <h2>Pedido</h2>
                <p>#{{order.orderId}} </p>
              </div>

              <div class="col s4">
                <h2>Valor</h2>
                <p>{{formatCurrency(order.totalAmount)}}</p>
              </div>
            </div>
          </div>


          <template v-if="tickets && tickets.length > 0">

            <p v-if="tickets[0].groupTicket && tickets[0].groupTotalTickets > 0">
              <strong>{{tickets[0].groupTotalTickets}} Ingresso(s)</strong>
            </p>


            <div v-for="(eventUserTicket, index) in tickets" :class="{updated: eventUserTicket.updated}" class="card"> <!-- Tickets -->
              <div class="qr">
                <div class="row">
                  <a @click="zoomTicket(eventUserTicket)">
                    <div class="col s4">
                      <div class="cover"><img :src="eventUserTicket.qrCodeImageUrl" alt=""></div>
                    </div>
                    <div class="col s8">
                      <template v-if="eventUserTicket.registered">
                        <h2>Nome</h2>
                        <p>{{eventUserTicket.fullName}}</p>

                        <h2>CPF</h2>
                        <p>{{eventUserTicket.cpf}}</p>

                        <!--<div>Email: {{eventUserTicket.email}}</div>-->
                        <!--<div>Telefone: {{eventUserTicket.mobilePhone}}</div>-->


                      </template>
                      <h2>Ingresso</h2>
                      <p>{{trimText(eventUserTicket.productEvent.name, 50, '')}} </p>
                      <h2>Nº do ingresso</h2>
                      <p>{{eventUserTicket.ticketId}}</p>

                      <template v-if="eventUserTicket.code">
                        <h2>Código do Ingresso</h2>
                        <p>{{eventUserTicket.code}}</p>
                      </template>

                    </div>
                  </a>
                </div>

                <div class="row">
                  <div class="col s12 l6">
                    <PipButton @click="changeTicket(eventUserTicket)">
                      {{eventUserTicket.registered?'Alterar':'Cadastrar Participante'}}
                    </PipButton>
                  </div>
                </div>

              </div>
            </div>
          </template>

        </div>
        <div v-else class="order">
          Evento não localizado !
        </div>

        <PipModal title="Editar Ingresso" modalStyle="max-width: 500px; width: 100%; height: 100%; max-height: 515px;" v-if="showTicketAdmin" v-model="showTicketAdmin">
          <ticket-admin @updateTicket="updateTicket" v-model="ticket"></ticket-admin>
        </PipModal>

      </div>

    </template>

  </div>

</template>

<script>
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import PipModal from "@/components/pipeu/common/PipModal";
  import TicketAdmin from "./ticketAdmin";
  import HeaderPipeu from "../../../../components/HeaderPipeu";
  import PipButton from "../../../../components/pipeu/common/PipButton";
  import ZoomTicket from "./ZoomTicket";

  export default {
    name: 'UserEventTickets',
    components: {ZoomTicket, PipButton, HeaderPipeu, TicketAdmin, PipModal},
    mixins: [basicuicomponent],

    data () {
      return {
        zoomTicketShow: false,

        tickets: [],
        event: undefined,
        order: undefined,

        showTicketAdmin: false,
        ticket: {}
      }
    },
    props: {
      listOfTickets: Array,

      singleTicket: {},
    },

    created: function () {
    },

    mounted: function () {
      let vm = this
      console.log('###### UserEventTickets.mounted this.listOfTickets', vm.listOfTickets)
      console.log('###### UserEventTickets.mounted this.singleTicket', vm.singleTicket)

      if (vm.listOfTickets && vm.listOfTickets.length > 0) {
          vm.tickets = vm.listOfTickets

          // TODO: Verify if a Ticket Group can have tickets from different Events and/or different Orders
            vm.event = vm.tickets[0].event
            vm.order = vm.tickets[0].order

      } else if (vm.singleTicket && vm.singleTicket.ticketId) {
        vm.event = vm.singleTicket.event
        vm.order = vm.singleTicket.order
        vm.tickets.push(vm.singleTicket)
      }
    },

    methods: {
      zoomTicket (ticket) {
        console.log('zoomTicket ticket', ticket)
        this.ticket = ticket
        this.zoomTicketShow = true
      },

      changeTicket(ticket) {
        console.log('>>> changeTicket')
        this.ticket = ticket
        this.showTicketAdmin = true
      },

      updateTicket(updatedTicket) {
        let vm = this
        console.log('TicketsGroup updateTicket updatedTicket', updatedTicket)
        this.showTicketAdmin = false
        this.ticket = {}

        let index = vm.tickets.findIndex(obj => obj.ticketId == updatedTicket.ticketId)
        console.log('found index:', index)

        if (index >= 0) {
          vm.$set(vm.tickets, index, updatedTicket)
          vm.$set(updatedTicket, 'updated', true)

          setTimeout(function(){
            vm.$set(updatedTicket, 'updated', false)
          }, 2000);
        }
      }
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
