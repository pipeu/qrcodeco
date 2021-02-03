<template>
    <div>
        <HeaderPipeu></HeaderPipeu>

        <TopBar></TopBar>

        <PageSectionsRender :currentPage="cardapioPage"></PageSectionsRender>

        <template v-if="product && product.id">
            <PipModalSSR v-model="showModal" back-url="/cardapio" @closeModal="closeModal" modal-style="width: 100%; height: 100%;">
                <div class="pip-buy-tickets pip-container">
                    <ProductMealDetail back-url="/cardapio" @cart-item-added="closeModal" :id="product.id" :item="product"></ProductMealDetail>
                </div>
            </PipModalSSR>
        </template>

        <FooterPipeu></FooterPipeu>

    </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import HeaderPipeu from '@/components/HeaderPipeu'
  import FooterPipeu from '@/components/FooterPipeu'
  import PageSectionsRender from '@/components/PageSectionsRender'
  import axios from 'axios'
  import ProductMealDetail from '../../components/ProductMealDetail'
  import PipModalSSR from '../../components/pipeu/common/PipModalSSR';
  import TopBar from '../../components/TopBar';

  export default {
    name: 'Cardapio',

    components: {
      TopBar,
      PipModalSSR,
      ProductMealDetail,
      HeaderPipeu, FooterPipeu, PageSectionsRender
    },

    data() {
      return {
        cardapioPage: {},
        product: {},
        showModal: true,
        title: '',
        content: '',
        fullUrlPath: ''
      }
    },

    props: {
      page: {
        type: Object,
        default: function () {
          return { }
        }
      },
      id: Number
    },

    head () {
      return {
        title: this.title,
        meta: [
          {
            hid: `cardapio-page`,
            name: 'description',
            content: this.content
          }
        ],
        link: [
          {
            rel: 'canonical', // Very Important: 13/10/2020 - Use canonical to inform search engines which domain and pages are the correct to index duplicated content (cozinha.com.br and coze.com.br co-existing domains)
            href: this.fullUrlPath
          }
        ]
      }
    },

    async asyncData ({ store, params, query, route, req, error }) {
        console.log('_cardapio.vue')

        let cardapioPage = store.getters.getCardapio
        let product

        let title = store.getters.getStore.name + ' - ' + ' Cardápio'
        let content = 'Cardápio' // todo: get from backend

        let fullUrlPath = 'https://coze.com.br' + route.path
        console.log(' canonical fullUrlPath', fullUrlPath)

        try {
          if (params.cardapio && params.cardapio.length > 0) {

            let paramId = (params.cardapio).split(/[- ]+/).pop()
            // console.log('trying to get product paramId from backend:', paramId)

            let productResponse = await axios.get('/products/' + paramId)
            product = productResponse.data
          }
        } catch (e) {
          console.log('Error getting product detail')
        }

        if (product && product.name) {
          // console.log('Found meal detail (product) URL, showing meal and not getting all cardapio')
          title = store.getters.getStore.name + ' - ' + ' Cardápio - ' + product.name
        } else {

          if (!cardapioPage) {
            // console.log('Not found cardapioPage on Vuex store')

            try {
              let {data} = await axios.get('/pages/getbyalias?alias=' + '/cardapio')
              cardapioPage = data

              store.dispatch('addCardapio', cardapioPage)

            } catch (e) {
              console.log('Error getting cardapio')
              error({ statusCode: 404, message: 'Ocorreu um probleminha aqui, caso deseje nos contate pelo WhatsApp (11)9953-56972' })
              return
            }

          } else {
            console.log('Found cardapioPage on Vuex store')
          }
        }

      return {
        cardapioPage: cardapioPage,
        product: product,
        title: title,
        content: content,
        fullUrlPath: fullUrlPath
      }
    },

    async created () {
    },

    async mounted () {
      let vm = this

      if (process.client) {
        let cardapioPage = vm.$store.getters.getCardapio

        // It will get all cardapio if first user access was directly on an meal detail url and just in desktop (to show all cardapio on background while showing the meal in a popup)
        if ( (vm.$device.isDesktop || vm.$device.isTablet) && !cardapioPage) {
          let {data} = await axios.get('/pages/getbyalias?alias=' + '/cardapio')
          // console.log('cardapio not found after mount, getting from backend and set on vuex', data)

          vm.cardapioPage = data
          vm.$store.dispatch('addCardapio', data)
        }

        this.$nextTick(function() {
          var scrollSpy = document.querySelectorAll('.scrollspy')

          for (var i = 0; i < scrollSpy.length; i++){
            let instance = M.ScrollSpy.init(scrollSpy[i])
          }
        })


      }
    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount']),

      closeModal () {
        this.product = {}
      },
      showProduct (item) {
        this.showModal = true
        this.product = item
      }
    }

  }
</script>
