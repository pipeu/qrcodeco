<template>
<div>

  <HeaderPipeu :showCartIcon="false" title="Meus Ingressos" returnPath="/"></HeaderPipeu>

  <div class="pip-tickets pip-container account-container card">

    <div class="row">

      <div class="col s12">
        <ul class="tabs">
          <li class="tab col s12"><a class="active">Ingressos</a></li>

          <!--TODO, implement-->
          <!--<li class="tab col s3"><a class="active" href="#activeTickets">Ativos</a></li>-->
          <!--<li class="tab col s3"><a href="#inactiveTickets">Finalizados</a></li>-->
        </ul>
      </div>

      <template v-if="tickets && tickets.length > 0">
        <div class="col s12">
          <div class="tickets-on">

            <div class="row" v-for="(item, index) in tickets">
              <template v-if="item.productEvent">
                <a @click="viewTicket(item)" style="cursor: pointer;">
                  <div class="col s2 l1">
                    <div class="date">
                      <h6>{{formatMonth(item.event.startDate)}}</h6>
                      <h5>{{formatDay(item.event.startDate)}}</h5>
                    </div>
                  </div>
                  <div class="col s3 l2">
                    <!--class="cover"-->
                    <div> <img :src="item.productEvent.image" alt="" width="100%;"> </div>
                  </div>
                  <div class="col s6">
                    <div class="summary">
                      <h1>{{trimText(item.productEvent.name, 50, '')}}</h1>

                      <!--<p><i class="material-icons">calendar_today</i>07/12/2018 <i class="material-icons">access_time</i>23:00</p>-->
                      <p v-if="item.groupTicket && item.groupTotalTickets > 0" class="blue-text">
                          <strong>{{item.groupTotalTickets}} Ingresso(s)</strong>
                      </p>

                      <p v-if="item.status == 3" class="red-text">
                        <strong>Cancelado</strong>
                      </p>

                    </div>
                  </div>
                </a>
              </template>
            </div>

          </div>
        </div>
        <client-only>
          <infinite-loading @infinite="infiniteHandler" ref="infiniteLoading" :distance="distance">
                                <span slot="no-more">
                                  Não existem mais Ingressos :(
                                </span>
          </infinite-loading>
        </client-only>
      </template>
      <template v-else>
        <div class="col s12">
          <div class="pip-empty">
            <a href="#" style="color: inherit">
              <h1><i class="material-icons left">local_play</i></h1>
              <p>Nenhum ingresso</p>
            </a>
          </div>
        </div>
      </template>

      <!--<div id="inactiveTickets" class="col s12">-->
        <!--<div class="pip-empty"> <a href="#" style="color: inherit">-->
          <!--<h1><i class="material-icons left">local_play</i></h1>-->
          <!--<p>Nenhum ingresso finalizado</p>-->
        <!--</a> </div>-->
      <!--</div>-->


    </div>
  </div>

</div>

</template>

<script>

  import basicuicomponent from '@/mixins/BasicUIComponent'
  import formatMixin from '@/mixins/FormatFuncMixin'

  import {mapGetters} from 'vuex'
  import api from '@/pipeuapi/api.js'
  import auth from '@/store/auth.js'
  import PipErrorIndicator from "@/components/pipeu/common/PipErrorIndicator";
  import PipButton from "@/components/pipeu/common/PipButton";
  import AccountHeader from "@/pages/myaccount/AccountHeader";

  import InfiniteLoading from 'vue-infinite-loading';

  import moment from "moment";
  import HeaderPipeu from "../../../../components/HeaderPipeu";

  export default {
    name: 'EventTickets',

    mixins: [basicuicomponent, formatMixin],

    middleware: ['auth'],
    meta: {
      auth: { authority: 2 }
    },

    data () {
      return {
        tickets: [],

        limit: 10,
        offset: 0,
        count: false,
        distance: -Infinity, // InfinityScroll disabled until we load Data

      }
    },
    components: {
      HeaderPipeu,
      AccountHeader,
      PipButton,
      PipErrorIndicator,
      InfiniteLoading
    },

    created: function () {
      console.log('###### EventTickets.created')
    },

    mounted: function () {
      let vm = this

      vm.getTickets()
    },


    methods: {
      ...mapGetters([
        'getStore', 'getUserAccount', 'getDomain'
      ]),

      viewTicket (ticket) {
        if (ticket.status == 1) { // Only issued ticket can be viewed to show details
            if (ticket.groupTicket && ticket.groupTotalTickets > 0 && ticket.groupId) {
                this.$router.replace({ path: '/myaccount/events/tickets/group/' + ticket.groupId  })
            } else {
                this.$router.replace({ path: '/myaccount/events/tickets/detail/' + ticket.ticketId  })
            }
        }
      },

      getTickets() {
        console.log("                 ### getTickets           ");
        let vm = this

        api.getUserTickets(vm.limit, vm.offset, false).then(res => {
            let data = res.data
            console.log("### return promisse api.getUserTickets data:", data);

            vm.tickets = data
            vm.distance = 100 // InfinityScroll enable after we get first data and attach Components
            vm.attachComponents()
          },
          error => {
            vm.handleApiError(error, {ignoreNotFound: true})
          }
        )
      },


      infiniteHandler($state) {
        let vm = this
        console.log("      ### infiniteHandler search           ");

        vm.offset = vm.tickets.length

        api.getUserTickets(vm.limit, vm.offset, false).then(res => {
          let data = res.data
          console.log('### return promisse infiniteHandler api.getUserTickets data:', data)

          if (data.length) {
            vm.tickets = vm.tickets.concat(data)

            $state.loaded()

            if (data.length < vm.limit) { //if new data lenth is lower than the limit means there is no more data on server
              $state.complete();
            }
          } else {
            $state.complete();
          }

          // We can sort data otherwise new data could go to top and with infinite scroll new data needs to be on bottom
          // this.clients = data.sort(vm.sortClients)

          // Call parent (mixin) to attach unreactive components
          // vm.attachComponents()

        },(error) => {
          vm.handleApiError(error, {ignoreNotFound: true})
          $state.complete()
        })
      }


    }

  }
</script>
<style scoped>
  @import "@/pages/myaccount/account.css";
  .pip-empty {
    position: relative;
    text-align: center;
    color: #999;
    margin-top: 50px;
  }
  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (max-width: 768px) {
    .card {
      box-shadow: none;
    }

  }
</style>

