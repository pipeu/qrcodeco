<template>
    <div>
        <HeaderPipeu></HeaderPipeu>

        <template v-if="productId > 0">

            <!-- If product type meal-->
            <template v-if="product.type == 7000">

              <client-only>
                <template v-if="$device.isDesktop || $device.isTablet">
                  <PipModal v-model="showModal" modal-style="width: 50%; height: 100%;">
                    <div class="pip-buy-tickets pip-container">
                      <ProductMealDetail :id="productId" :item="product"></ProductMealDetail>
                    </div>
                  </PipModal>

                </template>
                <template v-else>
                  <ProductMealDetail :id="productId" :item="product"></ProductMealDetail>
                </template>
              </client-only>


            </template>
            <template v-else>
              <ProductDetail :id="productId" :item="product"></ProductDetail>
            </template>

        </template>

        <template v-else>
            Produto não Encontrado

        </template>

    </div>
</template>

<script>
    /* eslint-disable indent */
    import {mapGetters} from 'vuex'
    import HeaderPipeu from '../../components/HeaderPipeu'
    import FooterPipeu from '../../components/FooterPipeu'
    import ProductDetail from '../../components/ProductDetail'
    import axios from 'axios'
    import ProductMealDetail from "../../components/ProductMealDetail";
    import PipModal from "../../components/pipeu/common/PipModal";
    import basicuicomponent from '@/mixins/BasicUIComponent'

    export default {
        name: 'product',
        mixins: [basicuicomponent],
        data: function () {
            return {
                productId: -1,
                product: {},
                showModal: true
            }
        },

        components: {
            PipModal,
            ProductMealDetail,
            HeaderPipeu, FooterPipeu, ProductDetail
        },

        async asyncData ({ store, params, query, route, req, error }) {
            console.log('### _product.vue async data ')
            console.log('async data params.product:', params.product)

            // const [productName, id] = params.product.split('-')
            // console.log('params.product -> productName:', productName)
            // console.log('params.product -> id:', id)

            let paramId = (params.product).split(/[- ]+/).pop()
            console.log('paramId:', paramId)

            let product = store.getters.getProductsById(paramId)

            if (!product) {
                console.log('### _product product not found on local user repository, getting from backend')
                let productResponse = await axios.get('/products/' + paramId)
                console.log('response.data', productResponse.data)
                // store.dispatch('addProduct', '')
                product = productResponse.data
            }
            // console.log(`product ${product}`)

            return {
                product: product,
                productId: Number(paramId)
            }
        },

        async mounted () {
            // const a = await import('assets/js/a.js')
            // a.whatever()
            if (process.client) {
                console.log('running on Browser, initing clientSide scripts')
            }
        },

        methods: {
            ...mapGetters([
                'getStore', 'getUserAccount', 'getDomain, getProductsByDetailPageURL'
            ])

        }
    }
</script>
