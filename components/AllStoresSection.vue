<template>
  <div v-if="filterEntities && filterEntities.length > 0">

<!--    <div class="pip-container">-->
<!--      <h1>Crie sua Loja e Venda OnLine em menos de 5 Minutos</h1>-->
<!--      <div class="row">-->
<!--      </div>-->
<!--    </div>-->

    <div class="pip-container pip-event">

      <div class="pip-event-title">
        <h5>Geladeiras em Destaque
        </h5>
      </div>

      <div class="home-events row" v-for="i in Math.ceil( filterEntities.length / entitiesByLine )">

        <!--if Events SectionValue is the Categorie Type  then render a "Page" Event under /event/ url on user click -->
        <!--<div class="col s12 m4 l4">-->
        <div v-for="item in  filterEntities.slice( (i-1)* entitiesByLine, i * entitiesByLine )" v-bind:class="'col l' + (12 / entitiesByLine)" > <!-- Products Per line -->

          <div class="card" style="border-radius: 35px;">
            <div @click="goToStore(item.name)" class="row pip-event-section" style="cursor: pointer;" >
              <div class="col s5 m12 l12">
                <img class="pip-cover-2020" :src="item.properties.logoURL" style="width: 60%; padding-top: 15px; padding-left: 15px;">
              </div>

              <div class="col s6 m10 l10">
                <div class="infos">
                  <div class="pip-event-organizer">Empresa: <a href="">{{item.name}}</a></div>

<!--                  <div class="pip-event-register">-->
<!--                          <span>-->
<!--                          &lt;!&ndash;Implement People registerd with photos and opt-in&ndash;&gt;-->
<!--                            <img src="https://uinames.com/api/photos/female/10.jpg" alt="">-->
<!--                            <img src="https://uinames.com/api/photos/female/11.jpg" alt="">-->
<!--                            <img src="https://uinames.com/api/photos/female/12.jpg" alt="">-->
<!--                          </span>-->
<!--                    &lt;!&ndash;Implement Number of Registerd People&ndash;&gt;-->
<!--                    <span class="pip-event-label">+ 500</span>-->
<!--                    <span class="pip-event-confirm">Reviews</span>-->
<!--                  </div>-->

                </div>
              </div>

              <!--Implement Favorite-->
<!--              <div class="col s1 m2 l2 pip-event-favorite center" style="padding: 0;">-->
<!--              <i class="material-icons">favorite_border</i>-->
<!--              </div>-->

            </div>
          </div>
        </div>

      </div>

    </div>
  </div>

</template>


<script>
  import {mapState} from 'vuex'
  export default {
    name: 'AllStoresSection',
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
      console.log('###### created AllStoresSection this.sectionValue')
    },
    mounted: function () {
      if (process.client) {
        console.log('AllStoresSection running on Browser, initing clientSide scripts')
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
          let filterType = prd.published === true
          allFilters = filterType

          return allFilters
        })
      },
    },
    methods: {
      goToStore (storeName) {
        this.$router.replace({path: '/lojas/' + storeName})
      },

    }

  }
</script>

<style scoped>

  .pip-cover-2020 {
    width: 100%;
    border-radius: 10px 10px 0 0;
  }

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
    line-height: 56px;
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


