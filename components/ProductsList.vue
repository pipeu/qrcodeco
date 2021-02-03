<template>
<div>
  <v-dialog/>

  <template v-if="filteredProducts">
  <a name="Ingressos"></a>

    <div class="ticket">
      <h2 v-if="title">{{title}}</h2>

      <div class="row" v-for="i in Math.ceil( Object.values(filteredProducts).length / productsByLine )">
          <template v-if="productInfoAlignment === 'bottom'">

              <div v-for="item in  Object.values(filteredProducts).slice( (i-1)* productsByLine, i * productsByLine )" v-bind:class="'col l' + (12 / productsByLine)"> <!-- Products Per line -->
                  <template v-if="item.visible">
                      <PipProductView :product="item" :productInfoAlignment="productInfoAlignment"></PipProductView>
                  </template>
              </div>

          </template>
          <template v-else>

              <template v-for="item in  Object.values(filteredProducts).slice( (i-1)* productsByLine, i * productsByLine )">
                  <template v-if="item.visible">
                      <PipProductView :product="item" :productInfoAlignment="productInfoAlignment"></PipProductView>
                  </template>
              </template>

          </template>

      </div>
  </div>
  </template>

</div>
</template>

<script>
    import {mapState, mapActions, mapGetters} from 'vuex'
    import PipProductView from '@/components/common/PipProductView'

    export default {
        name: 'ProductsList',
        components: {PipProductView},

        props: {
            title: {
                type: String,
                required: false,
                default: function () {
                    return null
                }
            },

            propProducts: {
                type: Array,
                default: function () {
                    return []
                }
            },

            productInfoAlignment: {
                type: String,
                required: false,
                default: function () {
                    return 'bottom'
                }
            },
            productsByLine: {
                type: Number,
                required: false,
                default: function () {
                    return 3
                }
            }
        },

        computed: {
            ...mapState({
                counter: state => state.counter,
                store: state => state.store,
                userAccount: state => state.userAccount,
                userLogged: state => state.userLogged
            }),

            filteredProducts () {
                let vm = this
                return this.propProducts.filter(function (prd) {
                    let allFilters = true

                    // Filter visible attribute
                    let filterType = prd.visible == true
                    allFilters = filterType

                    // @INNOVATION - 23//08/18 - We could Show Tags on the Pages so that clientes could filter products just clicking the Tags
                    // // let allowFilterTag = (this.filters.selectedTags && prd.tags) //check if product has any tags
                    //
                    // let hasFilteredTags = vm.filters.selectedTags.length > 0
                    // // console.log(' hasFilteredTags', hasFilteredTags)
                    //
                    // let productHasTags = prd.tags != undefined && prd.tags.length > 0
                    // // console.log(' productHasTags', productHasTags)
                    //
                    // let productMatchCheckedTags = false
                    // if (hasFilteredTags && productHasTags) {
                    //     productMatchCheckedTags = vm.filters.selectedTags.some(r=> prd.tags.indexOf(r) >= 0)
                    //     // console.log(' YES productMatchCheckedTags', productMatchCheckedTags)
                    // }
                    //
                    // if (hasFilteredTags) {
                    //     allFilters = allFilters && productMatchCheckedTags
                    // }

                    return allFilters
                })
            }
        },

        methods: {
            ...mapActions({
                setProducts: 'setProducts'
            }),

            ...mapGetters([
                'getStore', 'getUserAccount', 'getDomain, getProductsByDetailPageURL'
            ])
        },

        mounted () {
        },

        // NOTE: On element creation we just can receive data in lower case like customdata or userlogged, customData or userLogged won't work
        created: function () {
            // console.log('###### created ProductsList:', this.propProducts)
            // console.log('###### created ProductsList productInfoAlignment:', this.productInfoAlignment)
            // console.log('###### created ProductsList productsByLine:', this.productsByLine)
            // console.log('###### created ProductsList productsByLine:', this.title)
            if (this.propProducts) {
                this.setProducts(this.propProducts)
            }
        }
    }
</script>

<style scoped>

    .title {
        font-size: 48px;
        font-weight: 300;
        padding-bottom: 50px;
        color: #17427d;
    }


</style>
