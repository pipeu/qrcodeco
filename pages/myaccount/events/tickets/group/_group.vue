<template>
  <div>

    <HeaderPipeu :showCartIcon="false" title="Ingressos do Grupo" returnPath="/myaccount/events/tickets"></HeaderPipeu>

    <UserEventTickets v-if="tickets && tickets.length > 0" :listOfTickets="tickets"></UserEventTickets>

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
    name: 'TicketsGroup',
    components: {HeaderPipeu, UserEventTickets, AccountHeader},
    mixins: [basicuicomponent],


    data () {
      return {
        tickets: [],
        groupId: 0
      }
    },
    props: {
      propGroupId: 0
    },

    created: function () {
    },

    mounted: function () {
      let vm = this
      console.log('###### TicketsGroup.mounted this.propGroupId', vm.propGroupId)
      console.log('###### TicketsGroup.mounted $route.params.group', vm.$route.params.group)

        // Get all tickets belonging to a groupId
        if (vm.propGroupId > 0 || vm.$route.params.group) {
          vm.groupId = vm.propGroupId || vm.$route.params.group
          console.log('Querying User Tickets by groupId', vm.groupId)

          pipeuApi.getUserTicketsByGroupId(vm.groupId).then((res) => {
            console.log('### getUserTicketsByGroupId res.data:', res.data)

            vm.tickets = res.data

          }, (error) => {
            vm.handleApiError(error)
          })
        }
    }

  }
</script>

