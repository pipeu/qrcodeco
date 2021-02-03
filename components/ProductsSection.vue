<template>
<div>
    <template v-if="productsSection.productSectionType == 3">

      <MealProductsList :id="id"
                        :title="productsSection.description"
                        :propProducts="Object.values(productsSection.productsGroup.productsList)"
                        :productInfoAlignment="productsSection.productInfoAlignment"
                        :productsByLine="productsSection.productsByLine">
      </MealProductsList>

    </template>
    <template v-else>

      <div class="pip-event pip-container">
        <div class="container">

          <ProductsList :title="productsSection.description"
                        :propProducts="Object.values(productsSection.productsGroup.productsList)"
                        :productInfoAlignment="productsSection.productInfoAlignment"
                        :productsByLine="productsSection.productsByLine">
          </ProductsList>

        </div>
      </div>

    </template>
</div>
</template>

<script>
    import {mapState, mapActions, mapGetters} from 'vuex'
    import ProductsList from './ProductsList'
    import formatFuncMixin from '@/mixins/FormatFuncMixin'
    import MealProductsList from "./MealProductsList";

export default {
    name: 'ProductsSection',
    mixins: [formatFuncMixin],
    data () {
        return {
            selectedQuantity: 1
        }
    },
    props: {
        productsSection: {
          type: Object,
          default: function () {
            return { }
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

     components: {
         MealProductsList,
         ProductsList
    },

    methods: {
        ...mapActions({
            setProducts: 'setProducts'
        })
    },

    async mounted () {
    },

    // NOTE: On element creation we just can receive data in lower case like customdata or userlogged, customData or userLogged won't work
    created: function () {
      // As we received section with products we avoid go to server get products again if this product exists on the previos section, otherwise we fetch from server
      this.setProducts(this.productsSection.productsGroup.productsList)
    }
}
</script>
