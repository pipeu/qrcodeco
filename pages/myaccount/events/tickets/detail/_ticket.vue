<template>
  <div>
    <HeaderPipeu :showCartIcon="false" title="Ingressos" returnPath="/myaccount/events/tickets"></HeaderPipeu>

    <UserEventTickets v-if="ticket && ticket.ticketId" :singleTicket="ticket"></UserEventTickets>
  </div>
</template>

<script>
  /* eslint-disable */
  import pipeuApi from '~/pipeuapi/api.js'

  import basicuicomponent from '@/mixins/BasicUIComponent'
  import AccountHeader from "@/pages/myaccount/AccountHeader";

  import UserEventTickets from "../UserEventTickets";
  import HeaderPipeu from "../../../../../components/HeaderPipeu";

  export default {
    name: 'Ticket',
    components: {HeaderPipeu, UserEventTickets, AccountHeader},
    mixins: [basicuicomponent],

    data () {
      return {
        ticket: {},
      }
    },

    created: function () {
    },

    mounted: function () {
      let vm = this
      console.log('###### Ticket.mounted $route.params.ticket', vm.$route.params.ticket)

      if (vm.$route.params.ticket) {
        console.log('Querying User Tickets by vm.$route.params.ticket', vm.$route.params.ticket)

        pipeuApi.getUserTicketById(vm.$route.params.ticket).then((res) => {
          console.log('### getUserTicketById res.data:', res.data)

          vm.ticket = res.data
        }, (error) => {
          vm.handleApiError(error)
        })
      }
    }

  }
</script>

