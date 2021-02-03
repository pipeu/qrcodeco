<template>

  <div style="padding: 25px;">

    <PipInput component-name="fullName" label-desc="Nome" v-model="ticket.fullName"></PipInput>

    <PipInput component-name="email" label-desc="Email" v-model="ticket.email"></PipInput>

    <PipInput component-name="mobilePhone" label-desc="Tel Celular" v-model="ticket.mobilePhone"></PipInput>

    <PipInput component-name="cpf" label-desc="CPF" v-model="ticket.cpf"></PipInput>

    <!--<div class="row">-->
      <PipButton @click="update">Atualizar Ingresso</PipButton>
    <!--</div>-->

  </div>

</template>


<script>

  import pipeuApi from '@/pipeuapi/api.js'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import PipErrorIndicator from "@/components/pipeu/common/PipErrorIndicator";
  import PipInput from "@/components/pipeu/common/PipInput";
  import PipButton from "@/components/pipeu/common/PipButton";


  export default {
    name: 'ticketAdmin',

    mixins: [basicuicomponent],

    props: {
      value: {
        required: true,
        default: {}
      }
    },

    data () {
      return {
        cmd: 'change',
        id: 0,

        generateQRCode: false,
        sendEmail: false,
        autoCheckIn: true,

        // @IMPORTANT - We always must define all the properties of an object on the Data, because otherwise when we replace this object Vue with a new
        // propertie VUE will not copy the get and set REACTIVITY methods
        ticket: {
          eventId: 0,
          ticketId: 0,
          status: 0,
          eventCheckedIn: false,
          eticket: '',
          qrCodeImageUrl: '',
          productId: 0,
          productEvent: {},
          userId: 0,
          orderId: 0,
          groupTicket: false,
          accountCreated: false,
          registered: false,
          fullName: '',
          email: '',
          mobilePhone: '',
          cpf: '',
          cnpf: '',
          blindSupport: false,
          translationSupport: false
        },

      }
    },
    components: {
      PipButton,
      PipErrorIndicator,
      PipInput
    },

    created: function () {
      console.log('###### Ticket.created this.value', this.value)

      if(this.value && this.value.ticketId) {
        this.ticket = this.clone(this.value)
        // @IMPORTANT - For some reason here the REACTIVITY is been copied to this.ticket and this is WRONG because this is MUTATING PARENT DIRECTLY
        // Usually we get WARNS on the console, but here VUE is not warning us (maybe because this is an item from an ARRAY)
      }

    },

    beforeMount: function () {
      if(this.value && this.value.ticketId && this.value.ticketId > 0) {
      }
    },

    mounted: function () {
    },


    methods: {

      update () {
        let vm = this

        vm.confirm('Você confirma Alterar os Dados do Ingresso ?', '').then((response) => {
          console.log('confirm result calling updateTicket res', response)

          pipeuApi.updateEventTicket(vm.ticket.ticketId, vm.ticket).then((res) => {
            console.log('### update userEventTickets response.data:', res.data)

            vm.$toast.success('Ok !')

            vm.$emit('updateTicket', res.data)

          }, (error) => {
            vm.handleApiError(error)
          })

        });


      }

    }

  }
</script>
