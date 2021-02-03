<template>
  <div>
    <UserEventTickets v-if="tickets && tickets.length > 0" :listOfTickets="tickets"></UserEventTickets>
  </div>
</template>

<script>
  import pipeuApi from '~/pipeuapi/api.js'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import UserEventTickets from "../../pages/myaccount/events/tickets/UserEventTickets";

  export default {
    name: 'PaymentApprovedEventTickets',
    components: {UserEventTickets},
    mixins: [basicuicomponent],

    data () {
      return {
        tickets: {},
        activeTicketId: 0
      }
    },
    props: {
      orderId: 0, // If paid ticket

      issuedTickets: {}, // If free ticket tickets is passed as argument

    },

    created: function () {
      if (this.issuedTickets) {
        this.tickets = this.issuedTickets

        // Duplicate JSON
        // this.updatedUserTickets = JSON.parse(JSON.stringify(this.tickets))
      }
    },

    mounted: function () {
      console.log('### PaymentApprovedEventTickets.mounted')

      let vm = this

      if ((process.client)) {
        console.log('this.orderId:', this.orderId)

        // Just get Tickets if is a Paid ticket
        if (this.orderId > 0) {
          console.log('Querying User Tickets by orderId', this.orderId)

          pipeuApi.getUserEventTicketsByOrder(vm.orderId).then((res) => {
            console.log('### api getUserEventTicketsByOrder res.data:', res.data)
            let ticketsData = res.data
            console.log('ticketsData', ticketsData)

            vm.tickets = ticketsData

            // Duplicate JSON
            // vm.updatedUserTickets = JSON.parse(JSON.stringify(ticketsData))
          }, (error) => {
            vm.handleApiError(error, {ignoreNotFound: true})
          })
        }
      }
    },

    methods: {



    }

  }
</script>

