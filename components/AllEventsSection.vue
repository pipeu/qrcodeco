<template>




    <div v-if="filterEntities && filterEntities.length > 0">

      <!--<img src="https://i.ibb.co/pr0hxNb/pipeu-cover-1440x600.jpg" alt="" style="width:100%;">-->
      <!--<img src="https://i.ibb.co/JtGwf2C/pipeu-cover1000x600.png" alt="" style="width:100%; height: 550px">-->

      <div class="pip-event-high">
        <div class="pip-container">
          <h1>Organize seu evento e venda ingressos</h1>
          <div class="row">


            <!--<div class="clearfix pip-search">-->

                <!--<div class="input-field col s12 m5 l5">-->
                  <!--<i class="material-icons prefix">search</i>-->
                  <!--<input type="text" id="autocomplete-input" class="autocomplete">-->
                  <!--<label for="autocomplete-input">Pesquisar eventos</label>-->
                <!--</div>-->
              <!--<div class="input-field col s12 m5 l5">-->
                <!--<i class="material-icons prefix">location_on</i>-->
                <!--<input type="text" id="autocomplete-input" class="autocomplete">-->
                <!--<label for="autocomplete-input">Local</label>-->
              <!--</div>-->

                <!--<div class="col s12 m2 l2">-->
                  <!--<div class="" style="margin-top: 20px">-->
                      <!--<a href="#" class="btn">Pesquisar</a>-->
                  <!--</div>-->
                <!--</div>-->

            <!--</div>-->





          </div>
        </div>
      </div>



      <div class="pip-container pip-event">
      <!--<div class="card spotlight">-->

          <!--<img src="https://i.ibb.co/JtGwf2C/pipeu-cover1000x600.png" alt="" style="width: 100%">-->
          <!--&lt;!&ndash;Information about the event&ndash;&gt;-->
          <!--&lt;!&ndash;<div class="summary">&ndash;&gt;-->
            <!--&lt;!&ndash;<h1>Título do evento</h1>&ndash;&gt;-->
            <!--&lt;!&ndash;<p><em class="material-icons">calendar_today</em>07/12/2018 <em class="material-icons">access_time</em>23:00</p>&ndash;&gt;-->
            <!--&lt;!&ndash;<p><i class="material-icons">location_on</i>Sambódromo do Anhembi - São Paulo - SP</p>&ndash;&gt;-->
            <!--&lt;!&ndash;<p>Organizador <a href="pipeu-organizador.html">Nome</a></p>&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--</div>-->


        <div class="pip-event-title">
            <h5>Eventos em destaque
              <!--<span><a href="">ver mais</a></span>-->
            </h5>
        </div>


        <div class="home-events row" v-for="i in Math.ceil( filterEntities.length / entitiesByLine )">

              <!--if Events SectionValue is the Categorie Type  then render a "Page" Event under /event/ url on user click -->
              <!--<div class="col s12 m4 l4">-->
                <div v-for="item in  filterEntities.slice( (i-1)* entitiesByLine, i * entitiesByLine )" v-bind:class="'col l' + (12 / entitiesByLine)" > <!-- Products Per line -->

                  <div class="card">
                    <div @click="goToEvent(item.aliasCodeURL)" class="row pip-event-section" style="cursor: pointer;" >
                      <div class="col s5 m12 l12">
                        <!--<nuxt-link :to="item.aliasCodeURL">-->
                          <img class="pip-event-cover" :src="item.imageUrl" alt="">
                        <!--</nuxt-link>-->
                      </div>
                      <div class="col s6 m10 l10">
                        <div class="infos">
                          <div class="pip-event-name">{{item.eventName}}</div>
                          <!--TODO: Add Date Here-->
                          <!--<div class="pip-event-data">Out 1 e 2, São Paulo</div>-->
                          <div class="pip-event-organizer">Organizador: <a href="">{{store.name}}</a></div>
                          <div class="pip-event-register">
                          <span>
                          <!--Implement People registerd with photos and opt-in-->
                          <!--<img src="https://uinames.com/api/photos/female/10.jpg" alt="">-->
                          <!--<img src="https://uinames.com/api/photos/female/11.jpg" alt="">-->
                          <!--<img src="https://uinames.com/api/photos/female/12.jpg" alt="">-->
                          </span>
                            <!--Implement Number of Registerd People-->
                          <!--<span class="pip-event-label">+ 500</span>-->
                          <!--<span class="pip-event-confirm">Inscritos</span>-->
                          </div>
                        </div>
                      </div>

                      <!--Implement Favorite-->
                      <!--<div class="col s1 m2 l2 pip-event-favorite center" style="padding: 0;">-->
                        <!--<i class="material-icons">-->
                        <!--favorite_border-->
                        <!--</i>-->
                      <!--</div>-->

                    </div>
                  </div>
              </div>

        </div>



       <!--Implement Categories-->
        <!--<div class="pip-event-title">-->
            <!--<h5>Eventos por categorias <span><a href="">ver mais</a></span></h5>-->
        <!--</div>-->
        <!--<div class="row pip-event-category card">-->
            <!--<div class="col s4 center">-->
                <!--<div><i class="material-icons">mic</i></div>-->
                <!--<p>Palestras</p>-->
            <!--</div>-->
            <!--<div class="col s4 center">-->
                <!--<div><i class="material-icons">mic</i></div>-->
                <!--<p>Palestras</p>-->
            <!--</div>-->
            <!--<div class="col s4 center">-->
                <!--<div><i class="material-icons">mic</i></div>-->
                <!--<p>Palestras</p>-->
            <!--</div>-->
            <!--<div class="col s4 center">-->
                <!--<div><i class="material-icons">mic</i></div>-->
                <!--<p>Palestras</p>-->
            <!--</div>-->
            <!--<div class="col s4 center">-->
                <!--<div><i class="material-icons">mic</i></div>-->
                <!--<p>Palestras</p>-->
            <!--</div>-->
            <!--<div class="col s4 center">-->
                <!--<div><i class="material-icons">mic</i></div>-->
                <!--<p>Palestras</p>-->
            <!--</div>-->
        <!--</div>-->


    </div>
    </div>




</template>


<script>
    import {mapState, mapActions} from 'vuex'
    import numeral from 'numeral'
    export default {
        name: 'AllEventsSection',
        props: {
            sectionValue: {
                type: Array,
                default: function () {
                    return { }
                }
            },

            id: Number
        },

        data: function () {
          return {
            entitiesByLine: 4
          }
        },

        created: function () {
          console.log('###### created AllEventsSection this.sectionValue')
        },
        mounted: function () {
          if (process.client) {
            console.log('AllEventsSection running on Browser, initing clientSide scripts')
          }
        },

        computed: {
            ...mapState({
                counter: state => state.counter,
                store: state => state.store,
                userAccount: state => state.userAccount,
                userLogged: state => state.userLogged
            }),

            filterEntities () {
              let vm = this
              return this.sectionValue.filter(function (prd) {
                let allFilters = true

                // Filter visible attribute
                let filterType = prd.enabled === true
                allFilters = filterType

                // @INNOVATION - 23//08/18 - We could Show Tags on the Pages so that clientes could filter products just clicking the Tags
                // // let allowFilterTag = (this.filters.selectedTags && prd.tags) //check if product has any tags

                return allFilters
              })
            },
        },
        methods: {
          ...mapActions({
              setProducts: 'setProducts'
          }),

          goToEvent (url) {
            this.$router.replace({path: url})
          },


        }

    }
</script>

<style scoped>

  .clearfix {
    overflow: auto;
  }
  .clearfix::after {
    content: "";
    clear: both;
    display: table;
  }

    .pip-event-section {

        padding: 13px 0;

    }
    .pip-event-name {
        font-weight: 600;
        line-height: 20px;
        margin-bottom: 10px;
    }
    .pip-event-data {
        color: #999999;
        font-size: 14px;
        margin-bottom: 5px;
    }
    .pip-event-organizer {
        font-size: 14px;
    }
    .pip-event-favorite .material-icons {
        color: #ccc;
        font-size: 24px;
    }
    .pip-event-favorite .material-icons.active {
        color: #c83b6b;
        font-size: 24px;
    }
    .pip-event-register  {
        margin-top: 10px;
    }
    .pip-event-register img {
        height: 25px;
        border-radius: 50%;
        margin-right: -15px;
    }
    .pip-event-label {
        background-color: #c83b6b;
        color: #ffffff;
        border-radius: 20px;
        padding: 5px 10px;
        font-size: 12px;
        font-weight: 400;
    }
    .pip-event-confirm {
        color: #c83b6b;
        font-size: 12px;
        padding-left: 5px;
    }
    .pip-event-title h5 {
        font-size: 20px;
        font-weight: 500;
        padding: 40px 0;
      margin: 0 10px;
        text-transform: uppercase;
    }
    .pip-event-title span {
        font-size: 14px;
        font-weight: 300;
        float: right;
    }
    .pip-event-cover {
        width: 100%;
      height: 150px;
      border-radius: 10px 10px 0 0;
    }
    .pip-event-category {
        background-color: #ffffff;
        padding: 20px 0;
    }
    .pip-event-category p  {
        padding: 0;
        margin: 0;
        font-size: 16px;
        font-weight: 400;
    }
    .pip-event-category i  {
        color: #0085f7;
        font-size: 32px;
    }
    .pip-event-category .col  {
        padding: 20px 0;

    }
    .pip-event-highlight {
        background-color: #ffffff;
        padding-bottom: 20px;
    }
    .pip-event-highlight div>img {
        width: 100%;
    }
    .pip-event-highlight .col {
        padding-top: 20px;
    }
    .row {
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 0;
    }
    ul.pip-indicators  {
        margin: 0;
        padding: 0;
    }
    .pip-indicators {
        text-align: center;

    }
    .pip-indicators .pip-indicator-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 10px;
        width: 10px;
        margin: 0 5px;
        background-color: #eeeeee;
        -webkit-transition: background-color .3s;
        transition: background-color .3s;
        border-radius: 50%;
    }
    .pip-indicators .pip-indicator-item.active {
        background-color: #c83b6b;
    }

    .pip-event .spotlight .summary {
      text-align: left;
      padding: 20px;
      border-bottom: none;
      margin-bottom: 0;
    }
    .pip-event .spotlight .summary h1 {
      font-size: 24px;
    }
    .pip-event .spotlight .summary p {
      color: #505050;
    }


    .card {
      border-radius: 10px;
    }

    .pip-event-high {
     background-image: url("https://i.ibb.co/80fktwL/i-Stock-654134086.jpg");
      background-size: cover;
      padding: 150px 0;
    }
    .pip-event-high  .btn {
      text-decoration: none;
      color: #fff;
      background-color: #C83B6B;
      text-align: center;
      letter-spacing: .5px;
      transition: background-color .2s ease-out;
      cursor: pointer;
      border-radius: 50px;
      width: 100%;
    }
    .pip-event-high h1 {
      font-size: 60px;
      color: #fff;
      padding-bottom: 50px;
      margin:  0 20px;
      font-weight: bold;
      text-shadow: 0 0 2px #000000;

      line-height: 40px;
    }
  .input-field .prefix {
    font-size: 1.5rem;
    top: .5rem;
    color: #c83b6b;
  }
  .pip-search {
    background-color: rgba(255,255,255,.95);
    padding: 10px;
    margin: 0 20px;
    border-radius: 10px;
    -webkit-box-shadow: 0 0 10px 0 rgba(0,0,0,0.5);
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.5);
  }

    /* Medium devices (landscape tablets, 768px and up) */
    @media only screen and (max-width: 768px) {
      .card {
        box-shadow: none;
        border-bottom: 1px solid #eee;
        margin: 0;
        border-radius: 0;
      }
      .home-events .col {
        padding: 0;
      }
      .home-events .card {
        margin: 10px;
        padding: 0 0 20px 0;
        min-height: auto;
      }
      .home-events .card .row {
        margin: 0;
        padding: 0;
      }
      .home-events .infos {
        padding: 0 10px;
      }
      .pip-event-section {
        padding: 10px 0;
      }


      .pip-event-high {
        background-image: url("https://i.ibb.co/80fktwL/i-Stock-654134086.jpg");
        background-size: cover;
        padding: 50px 0;
      }

      .pip-event-high h1 {
        font-size: 40px;
        color: #fff;
        padding-bottom: 50px;
        margin:  0 20px;
        font-weight: bold;
        text-shadow: 0 0 2px #000000;
      }

      .pip-event-cover {
        height: auto;
        border-radius: 10px;

      }
    }
    /* Medium devices (landscape tablets, 768px and up) */
    @media only screen and (min-width: 768px) {
      .home-events .col {
        padding: 0;
      }
      .home-events .card {
        margin: 15px;
        padding: 0;
        min-height: 300px;
      }
      .home-events .card .row {
        margin: 0;
        padding: 0;
      }
      .home-events .infos {
        padding: 10px;
      }
    }
</style>


