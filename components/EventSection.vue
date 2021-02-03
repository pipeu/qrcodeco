<template>
<div>
<div v-if="event" id="mobileContainer" class="pip-event pip-container">

  <div class="cover"> <img :src="event.imageUrl" alt=""> </div>

  <div class="container">

    <div id="EventAbout" class="summary">
      <h1>{{event.eventTitle}}</h1>
      <p><i class="material-icons">location_on</i>{{event.locationName}} - {{event.locationCity}} - {{event.locationState}}</p>
      <p><i class="material-icons">location_on</i>{{event.locationAddress}} - {{event.locationAddressExtra}}</p>
      <p>Organizador <a href="#!">{{store.name}}</a></p>
      <p><em class="material-icons">calendar_today</em>{{formatDateTimeWithZoneHHMM(event.startDate)}}<em class="material-icons">access_time</em></p>
      <p><em class="material-icons">calendar_today</em>{{formatDateTimeWithZoneHHMM(event.endDate)}}<em class="material-icons">access_time</em></p>
    </div>

      <div class="description">
        <h2>Sobre o evento</h2>
        <p>{{event.eventDescription}}</p>
      </div>

      <a name="Palestrantes"></a>
      <div v-if="event.speakers" class="speakers">
          <h2>Palestrantes</h2>

          <div class="row" v-for="i in calculateSpeaker">
            <div class="col s6 m3 l3" v-for="item in speakerPerRow(i)">
              <a href="#!">
                <img :src="item.image" alt="">
                <h6>{{item.name}}</h6>
                <p>{{item.title}}</p>
                <!--<p>{{item.minibio}}</p>-->
                <!--<span><a v-bind:href="item.linkedin"><i class="fa fa-linkedin fa-fw"></i></a></span>-->
              </a>
            </div>
          </div>
        </div>

    <div v-if="event.schedule" class="schedule">
      <h2>Agenda</h2>
      <div class="row">
        <div class="col s12">
          <ul class="tabs">
            <li v-for="(item, index) in event.schedule" class="tab col s3">
              <a class="active" :href="'#day-' + index">{{item.day}}</a>
            </li>
          </ul>
        </div>

        <template v-for="(item, index) in event.schedule">
          <div :id="'day-' + index" class="col s12 hour">

            <div class="row" v-for="(itemSchedule, keySchedule, indexSchedule) in item.daySchedule">
              <div class="col s2 m2 l2 center-align">
                <h5>{{itemSchedule.time}}</h5>
              </div>
              <div v-if="itemSchedule.speakerImage" class="col s2 m2 l2 center-align">
                <a href="#!">
                  <img :src="itemSchedule.speakerImage" alt=""></a>
              </div>

              <div class="col s8 m8 l8">
                <h6>{{itemSchedule.speakerName}}</h6>
                <p>{{itemSchedule.title}}</p>
                <!--<p>{{itemSchedule.subTitle}}</p>-->
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="location" v-if="event.location">
      <h2>Localização</h2>

      <p>{{event.locationName}} - {{event.locationAddress}} - {{event.locationAddressExtra}}</p>
      <p>{{event.locationCity}} - {{event.locationState}} - {{event.locationCountry}}</p>

      <template v-if="event.location.googleMapsUrl">
        <iframe :src="event.location.googleMapsUrl" width="100%" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>
      </template>
      <template v-else-if="event.location.locationImage">
        <img v-bind:src="event.location.locationImage" alt="">
      </template>

    </div>


    <div id="eventTickets" v-if="event.productEvents">
        <ProductsList :propProducts="event.productEvents"></ProductsList>
    </div>



    <template v-if="event.producers">
      <a name="Patrocinadores"></a>
      <div class="sponsors">
        <h2>Realizadores</h2>
        <div class="row">
          <div v-for="(item, key, index) in event.producers" class="col s6 m3 l3">
            <a :href="item.siteUrl" target="_blank">
              <img :src="item.imageUrl">
            </a>
          </div>
        </div>
      </div>
    </template>


    <template v-if="event.sponsors">
      <a name="Patrocinadores"></a>
      <div class="sponsors">
        <h2>Patrocinadores</h2>
        <!--<h3>Patrocínio Ouro</h3>-->
        <div class="row">
          <div v-for="(item, key, index) in event.sponsors" class="col s6 m3 l3">
            <a :href="item.siteUrl" target="_blank">
              <img :src="item.imageUrl">
            </a>
          </div>
        </div>
      </div>
    </template>

    <!--<div class="text-center sponsor-cta">-->
      <!--<a class="btn btn-primary btn-lg" href="#" data-toggle="modal" data-target="#myModal">-->
      <!--<i class="fa fa-star"></i> Seja um patrocinador-->
      <!--</a>-->
    <!--</div>-->

    </div>
</div>

  <!--Just show if there are EventTickets to Sell --->
  <!--#Ingressos-->
  <PipButton v-if="event.productEvents && event.productEvents.lenght > 0 " type="big-fixed" @click="scrollToDiv('eventTickets')">Comprar Ingressos</PipButton>


</div>
</template>

<script>
    import {mapState} from 'vuex'
    import axios from 'axios'
    import ProductsList from './ProductsList'
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import PipButton from "./pipeu/common/PipButton";
    import VueScrollTo from 'vue-scrollto'

    export default {
      name: 'EventSection',
      mixins: [basicuicomponent],
        data: function () {
            return {
                itemsPerRow: 2,
                currentCmsSectionPosition: 'EventAbout'
            }
        },

      props: {
        event: {
          type: Object,
          default: function () {
            return {}
          }
        },
        id: Number
      },
        components: {
          PipButton,
            ProductsList
        },
        computed: {
        ...mapState({
          counter: state => state.counter,
          store: state => state.store,
          userAccount: state => state.userAccount,
          userLogged: state => state.userLogged
          }),
          calculateSpeaker () {
              return Math.ceil((this.event.speakers).length / this.itemsPerRow)
          }
         },

        mounted () {
          if (process.client) {
            console.log('EventSection.vue running on Browser, initing clientSide scripts')
            if (false == this.isMobile()) {
              this.itemsPerRow = 4
            }
          }
        },

         beforeMount () {
            let vm = this
            console.log('### beforeMount EventSection')

            if (this.event && !this.event.productEvents) {
                console.log('### ProductEvents (tickets) not found, getting from API')

                axios.get('/products/events/tickets-replaced-by-rules/' + this.event.eventId).then((res) => {
                    // console.log('/products/events/tickets-replaced-by-rules/ response', res)
                    vm.$set(vm.event, 'productEvents', res.data)
                }, (error) => {
                    console.log('register failure response', error)
                })
            }
        },

        // NOTE: On element creation we just can receive data in lower case like customdata or userlogged, customData or userLogged won't work
        created: function () {
            console.log('###### created EventSection:')

            if (this.event) {
                console.log('###### event:', this.event)

                console.log('###### event.name:', this.event.eventName)
            }

            // console.log('this.event', this.event)

            // this.speakers = JSON.parse(this.event.speakers)
            // console.log('this.event.speakers', this.event.speakers)
            // console.log('this.event.speakers.length:', this.event.speakers.length)
        },

        watch: {
            source: function (val) {
                // console.log('###### watch source val', val)
                // this.updateSource(val);
            }
        },

      methods: {
          scrollToDiv (divName) {
            console.log('>>>>>>> scrollToDiv:', divName)

            // // Prevent multiple events scroll to a position more than one time
            // if (divName == this.currentCmsSectionPosition) {
            //   console.log('>>>>>>>>>>>>>>>>>>> Prevent multiple events scroll to a position more than one time')
            //   // return
            // }
            //
            // this.currentCmsSectionPosition = divName

            let scrollOptions = {
              container: 'body',
              easing: 'ease-in',
              offset: 30,
              cancelable: true,
              x: false,
              y: true
            }
            // this.$nextTick(function () {
            VueScrollTo.scrollTo('#' + divName, 500, scrollOptions)
            // })
          },

          eventDescriptionOnImageStyle () {
            if (this.eventDescriptionOnImage()) {
                return '100px 0'
            } else {
                return '200px'
            }
          },
          eventDescriptionOnImage () {
              return !this.event.cmsProperties || this.event.cmsProperties.spotLight && this.event.cmsProperties.eventDescriptionOnImage
          },

          speakerPerRow (index) {
              return (this.event.speakers).slice((index - 1) * this.itemsPerRow, index * this.itemsPerRow)
          }
      }
    }
</script>

<style scoped>


    .calendar img {
        max-width: 100px;
    }
    .calendar h4 {
        font-size: 24px;
    }
    .calendar h5 {
        font-size: 18px;
        font-weight: 600;
        color: #e58224;
    }
    .calendar h3 {
        font-size: 18px;
        font-weight: 600;
        color: #17427d;
        margin: 10px 0;
    }
    .calendar .table tbody>tr>td.vert {
        vertical-align: middle;
    }
    .calendar .table {
        border: 1px solid rgb(221, 221, 221);
    }
    .calendar h2 {
        color: #17427d;
        font-size: 24px;
        font-weight: 600;
        margin: 30px 0;
    }





</style>
