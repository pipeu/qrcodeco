<template>

    <div> <!-- class="container-fluid cfd" -->

        <!--<v-dialog/>-->

        <!--<div class="container-fluid mb-4">-->
            <!--<nav aria-label="breadcrumb">-->
                <!--<ol class="breadcrumb">-->
                    <!--<li class="breadcrumb-item"><nuxt-link to="/" > {{getStore().name}} </nuxt-link></li>-->
                    <!--<li class="breadcrumb-item"><a href="">Produtos</a></li>-->
                    <!--<li class="breadcrumb-item active" aria-current="page">{{$route.params.product}}</li>-->
                <!--</ol>-->
            <!--</nav>-->
        <!--</div>-->

        <template v-if="product && product.visible">


            <div class="container card-serv">
                <div class="pipeu-servico">
                    <PipProductView viewType="carrousel" :product="product"></PipProductView>
                </div>
            </div>

            <template v-if="product.descriptionHtml">
                <client-only>
                    <div id="descriptionHtml" v-html="product.descriptionHtml"></div>
                </client-only>
            </template>

        </template>
        <template v-else>
            Produto não Encontrado
        </template>

    </div>
</template>

<script>
    /* eslint-disable indent,no-multiple-empty-lines,no-multi-spaces,padded-blocks */
    import {mapGetters} from 'vuex'
    import PipProductView from './common/PipProductView'

    export default {
        name: 'ProductDetail',
        data () {
            return {
                product: null
            }
        },
        props: {
            id: Number,
            item: Object
        },

        created () {
        },

        mounted () {
            // console.log('### ProductDetail.vue mounted - this.id', this.id)
            // console.log('### ProductDetail.vue mounted - this.item', this.item)

            if (this.item) {
                this.product = this.item
            }

        },

        components: {
            PipProductView
        },

        methods: {
            ...mapGetters([
                'getStore', 'getUserAccount', 'getDomain, getProductsByDetailPageURL'
            ])
        }

    }
</script>
<style>
    .breadcrumb {
        padding: 4px 0;
        margin-bottom: 0;
        list-style: none;
        background-color:transparent ;
        border-radius: 4px;

    }

    .breadcrumb a {
        color: #ffffff;
    }
    .breadcrumb a:hover {
        text-decoration: none;
        color: #ccc;
    }
    .breadcrumb>.active {
        color: #ccc;
    }



</style>