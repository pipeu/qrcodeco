<template>
  <div v-if="sectionValue" class="pip-event pip-container">
    <div class="container">

        <a name="Ingressos"></a>

        <div class="ticket">
          <h2>Assinaturas</h2>

          <div class="row" v-for="i in Math.ceil( sectionValue.length / productsByLine )">

            <div v-for="item in  sectionValue.slice( (i-1)* productsByLine, i * productsByLine )" v-bind:class="'col l' + (12 / productsByLine)"> <!-- Products Per line -->

              <div class="card">

                <div v-if="item.image" class="media">
                  <div class="media-left">
                    <a href="#!">
                      <img style="width: 100%;" class="img" :src="item.image" alt="">
                    </a>
                  </div>
                </div>

                <h3 v-html="item.name"></h3>
                <p v-html="item.description"></p>

                <template v-if="item.detailPage">

                  <template v-if="item.detailPageURL">
                    <nuxt-link class="btn" :to="item.detailPageURL">Saiba Mais</nuxt-link>
                  </template>
                  <template v-else>
                    <nuxt-link class="btn" :to="normalizeProductUrl(item.name, item.id)">Saiba Mais</nuxt-link>
                  </template>

                </template>

                <template v-else-if="item.paymentEnabled">

                  <template v-if="item.totalAmountFirstPeriod === item.totalAmountNextPeriod">

                    <h1>{{formatCurrency(item.totalAmountFirstPeriod)}} </h1>
                    <p>{{getRenewalText(item)}}</p>

                  </template>
                  <template v-else>

                    <h1>{{formatCurrency(item.totalAmountFirstPeriod)}} </h1>
                    <p>no Primeiro Mês</p>


                    <h1>{{formatCurrency(item.totalAmountNextPeriod)}} </h1>
                    <p>{{getRenewalText(item)}} </p>

                  </template>

                  <PipButton @click="checkoutPlanSubscription(item.id)">Assinar</PipButton>

                </template>
                <template v-else>
                    <h2>Em Breve !</h2>
                </template>

              </div>

            </div>

          </div>

        </div>

    </div>
  </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import formatMixin from '@/mixins/FormatFuncMixin'
    import pipeuAPIMixin from '@/mixins/PipeuAPIMixin'
    import { eventHub } from '@/utils/eventHub'
    import PipButton from "@/components/pipeu/common/PipButton"
    import productsPlansUtils from '@/utils/productsPlansUtils'

    export default {
      name: 'AllSubscriptionsPlansSection',
      components: {PipButton},
      mixins: [formatMixin, pipeuAPIMixin],


      props: {
            sectionValue: {
                type: Array,
                default: function () {
                    return { }
                }
            },

            productsByLine: {
              type: Number,
              required: false,
              default: function () {
                return 3
              }
            },

            id: Number
        },

        computed: {
            ...mapState({
                counter: state => state.counter,
                store: state => state.store,
                userAccount: state => state.userAccount,
                userLogged: state => state.userLogged
            })
        },

        methods: {
          ...mapActions(['addPlanSubscriptionToCart']),

          getRenewalText(item) {
             return productsPlansUtils.getRenewalText(item)
          },

            async checkoutPlanSubscription (planId) {
              let vm = this
              console.log('### checkoutPlanSubscription planId:', planId)
              try {

                // Send event to marketing integrations saying use hit checkout Button
                eventHub.$emit('marketing-send-event', {
                    event: 'click_checkout_plan_subscription',
                    'checkout_planId': planId
                  }
                )

                let result = await vm.addPlanSubscriptionToCart(planId)
                console.log('after execute addPlanSubscriptionToCart, lets see the result:', result)

                vm.$router.replace({ path: '/checkoutPayment?tokenId=' + result.data.tokenId + '' })

              } catch (error) {
                vm.handleApiError(error)
              }
            },

            goToPage (page) {
                console.log('### goToPage page', page)
                window.location = page
            },
            goToBilling (productId) {
                console.log('### goToBilling productId', productId)
            },

            normalizeProductUrl (name, id) {
                let finalUrl = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
                finalUrl = finalUrl.replace(/\s/g, '-') // replace spaces to - (dash)
                finalUrl = finalUrl + '-' + id // append id
                finalUrl = '/produtos/' + finalUrl
                return finalUrl
            },
        },

        // NOTE: On element creation we just can receive data in lower case like customdata or userlogged, customData or userLogged won't work
        created: function () {
            console.log('###### created AllSubscriptionsPlansSection this.sectionValue', this.sectionValue)
        },

        mounted: function () {
            if (process.client) {
                // console.log('AllSubscriptionsPlansSection running on Browser, initing clientSide scripts')
            }
        }
    }
</script>

<style scoped>
  .pip-event .ticket .fast-order {
    text-decoration: none;
    color: #000000;
    background-color: #fbca5c;
    text-align: center;
    letter-spacing: .5px;
    transition: background-color .2s ease-out;
    cursor: pointer;
    border-radius: 50px;
    width: 100%;
    font-size: 12px;

    border: none;
    /*border-radius: 2px;*/
    display: inline-block;
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    /*text-transform: uppercase;*/
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;

  }

  .pip-event .ticket .btn {
    text-decoration: none;
    color: #fff;
    background-color: #C83B6B;
    text-align: center;
    letter-spacing: .5px;
    transition: background-color .2s ease-out;
    cursor: pointer;
    border-radius: 50px;
    width: 100%;
    font-size: 12px;
  }
</style>
