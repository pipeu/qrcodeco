<template>
  <div>
<!--    <HeaderPipeu></HeaderPipeu>-->
<!--    <template v-if="entities && entities.length > 0">-->

<!--      <MealProductsList-->
<!--                        title="Refeições"-->
<!--                        :propProducts="entities"-->
<!--                        productInfoAlignment="center"-->
<!--                        :productsByLine="2">-->
<!--      </MealProductsList>-->

<!--    </template>-->

<!--    <template v-if="product && product.id">-->

<!--      <client-only>-->
<!--        <template v-if="$device.isDesktop || $device.isTablet">-->
<!--          <PipModal v-model="showModal" modal-style="width: 50%; height: 100%;">-->
<!--            <div class="pip-buy-tickets pip-container">-->
<!--              <ProductMealDetail :id="productId" :item="product"></ProductMealDetail>-->
<!--            </div>-->
<!--          </PipModal>-->

<!--        </template>-->
<!--        <template v-else>-->
<!--          <PipModal v-model="showModal" modal-style="width: 100%; height: 100%;">-->
<!--            <div class="pip-buy-tickets pip-container">-->
<!--              <ProductMealDetail :id="productId" :item="product"></ProductMealDetail>-->
<!--            </div>-->
<!--          </PipModal>-->
<!--        </template>-->
<!--      </client-only>-->
<!--    </template>-->

<!--    <FooterPipeu></FooterPipeu>-->
  </div>
</template>

<script>
    /* eslint-disable indent,no-trailing-spaces,eqeqeq,space-infix-ops */
    /* 19/01/20 - this Component is specialized in render Products Meals types in the following scenarios:
        1) /refeicoes/ -> Get All Products Meals from API and mount in blocks
        2) /refeicoes/new-york-cesar-salad -> load a meal using a popup in desktop/tablet and fullscreen in mobile
    */
    import {mapGetters} from 'vuex'
    import HeaderPipeu from '../../components/HeaderPipeu'
    import FooterPipeu from '../../components/FooterPipeu'
    import ProductDetail from '../../components/ProductDetail'
    import axios from 'axios'
    import api from '@/pipeuapi/api'
    import moment from 'moment'
    import ProductMealDetail from "../../components/ProductMealDetail";
    import PipModal from "../../components/pipeu/common/PipModal";
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import MealProductsList from "../../components/MealProductsList";

    export default {
        name: 'meals',
        mixins: [basicuicomponent],
        data: function () {
            return {
                productId: -1,
                product: {},
                showModal: true,
                entities: undefined,
                mounted: false
            }
        },

        components: {
            MealProductsList,
            HeaderPipeu,
            FooterPipeu, ProductDetail,
            PipModal,
            ProductMealDetail,
        },

        fetch({ redirect }) {
          redirect('/cardapio')
        },

        // async asyncData ({ store, params, query, route, req, error }) {
        //     console.log('['+moment().format('L HH:mm')+']' + '_meals.vue async data')
        //     let pageToQuery = route.path
        //     let entities
        //     let paramId
        //     let product
        //     console.log('### /refeicoes/ URL, getting all Meals :')
        //     let res = await api.getProductsQuery(7000,'','')
        //     entities = res.data
        //
        //     if (pageToQuery == '/refeicoes/' || pageToQuery == '/refeicoes') {
        //
        //     } else {
        //         console.log('async data params.meals:', params.meals)
        //         paramId = (params.meals).split(/[- ]+/).pop()
        //         console.log('paramId:', paramId)
        //         product = store.getters.getProductsById(paramId)
        //         if (!product) {
        //             console.log('### _product product not found on local user repository, getting from backend')
        //             let productResponse = await axios.get('/products/' + paramId)
        //             console.log('response.data', productResponse.data)
        //             // store.dispatch('addProduct', '')
        //             product = productResponse.data
        //         }
        //         console.log(`product ${product}`)
        //     }
        //
        //     if (!entities && !product) {
        //         return error({ statusCode: 404, message: 'Não há refeições disponíveis !' })
        //     }
        //     return {
        //         entities: entities,
        //         product: product,
        //         productId: Number(paramId),
        //         mounted: true
        //     }
        // },
        methods: {
            ...mapGetters(['getStore', 'getUserAccount'])
        }
    }
</script>
<style scoped>
  .breadcrumb {
    margin: 0;
  }
  .breadcrumb .breadcrumb-item {
    font-size: 14px;
  }
</style>
