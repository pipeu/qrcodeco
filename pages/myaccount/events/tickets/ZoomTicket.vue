<template>

    <div v-if="event && eventUserTicket" class="pip-tickets pip-container account-container card">

      <div class="order">
        <div class="card center">

          <span style="padding-bottom: 10px;">
            <a @click="$emit('close-zoom-ticket')">
              <i style="margin-top: 10px; cursor: pointer;" class="material-icons left">arrow_back</i>
            </a>
          </span>

          <div class="qr">
            <div class="row">
              <div class="col s12">
                <h2>Evento</h2>
                <p>{{trimText(event.eventName, 50, '')}}</p>
                <div class="cover">
                  <a href="#!">
                    <img :src="eventUserTicket.qrCodeImageUrl" alt="">
                  </a>
                </div>

                <template v-if="eventUserTicket.registered">
                  <h2>Nome</h2>
                  <p>{{eventUserTicket.fullName}}</p>

                  <h2>CPF</h2>
                  <p>{{eventUserTicket.cpf}}</p>

                  <!--<div>Email: {{eventUserTicket.email}}</div>-->
                  <!--<div>Telefone: {{eventUserTicket.mobilePhone}}</div>-->
                </template>


              </div>
            </div>
            <div class="row">
              <div class="col s6">
                <h2>Ingresso</h2>
                <p>{{trimText(eventUserTicket.productEvent.name, 50, '')}} </p>
              </div>
              <div class="col s6">
                <h2>Nº do ingresso</h2>
                <p>{{eventUserTicket.ticketId}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>


  </div>
</template>

<script>
  import format from '@/mixins/FormatFuncMixin'

  export default {
    name: 'ZoomTicket',

    mixins: [format],

    props: {
      event: {},
      eventUserTicket: {},
    },

    created: function () {
    },

    mounted: function () {
      let vm = this
      console.log('###### ZoomTicket.mounted ZoomTicket', vm.ZoomTicket)
    },

    methods: {
      zoomTicket (image) {
        console.log('zoomTicket image', image)
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
