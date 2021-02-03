<template>
  <div>
    <client-only>
    <template v-if="product && product.visible">
      <div class="dish__container">
        <div class="cozi-content">
          <div class="cozi-content__wrapper-container">

            <div v-if="product.mealGrabAndGo" class="cozi-content__container cozi-content__restaurant">
              <a class="cozi-restaurant" href="#">
                <span class="cozi-restaurant__name">
                  <template>
                    <span class="icon-marmita icon-marmita--restaurant">* </span>Retirar na Geladeira&nbsp;
                  </template>
                </span>
                <b> {{store.name}} </b>
                <span class="cozi-restaurant__delivery-time">250 Calorias</span>
              </a></div>

            <div class="cozi-content__container cozi-content__img-container" data-test-id="cozi-content__img-container">
<!--              <button type="button" aria-label="Blueberry pancake breakfast" class="marmita-image-expandable__button" data-test-id="cozi-content__img marmita-image-expandable__button">-->
                <img alt="Blueberry pancake breakfast" :src="product.image" class="cozi-content__img marmita-image-expandable__image" style="width: 100%;">
<!--              </button>-->
            </div>

            <div class="cozi-content__title">{{product.name}}</div>
            <span v-html="product.descriptionDetail" class="cozi-content__container cozi-content__details" data-test-id="cozi-content__details"></span>

              <span class="cozi-content__container cozi-card__price" style="margin-top: 12px;">
                <span class="cozi-card__price--discount">{{formatCurrency(product.amount)}}
                  <span v-if="product.oldPrice > 0" class="cozi-card__price--original">{{formatCurrency(product.oldPrice)}}</span>
                </span>
              </span>

          </div>

            <div v-if="mealInfo && mealInfo.ingredients" :key="componentKeyReRender + '-meal-detail'" class="row">
                <div class="col s12 l8">

                    <div class="food-nutri">
                        <table width="100%" border="0">
                            <tbody>
                            <tr>
                                <td class="facts">
                                    <div class="card center">
                                    <h6>Carboidrato</h6>
                                    <h5>{{mealInfo.carbo.total}} g</h5>
                                    <div class="perc brown">
                                        <h4>{{mealInfo.carbo.dailyPercent}}%</h4>
                                    </div>
                                </div></td>

                                <td class="facts"><div class="card center">
                                    <h6>Proteínas</h6>
                                    <h5>{{mealInfo.protein.total}} g</h5>
                                    <div class="perc green">
                                        <h4>{{mealInfo.protein.dailyPercent}}%</h4>
                                    </div>
                                </div></td>

                                <td class="facts">
                                    <div class="card center">
                                    <h6>Fibras</h6>
                                    <h5>{{mealInfo.fiber.total}} g</h5>
                                    <div class="perc yellow blue-grey"i>
                                        <h4>{{mealInfo.fiber.dailyPercent}}%</h4>
                                    </div>
                                </div></td>

                                <td class="facts">
                                    <div class="card center">
                                    <h6>Sódio</h6>
                                    <h5>{{mealInfo.sodium.total}} mg</h5>
                                    <div class="perc orange">
                                        <h4>{{mealInfo.sodium.dailyPercent}}%</h4>
                                    </div>
                                </div></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

<!--                    <div class="food-info">-->
<!--                        <h5>Peso</h5>-->
<!--                        <p>{{mealInfo.weight}}</p>-->
<!--                    </div>-->

                    <div class="food-info">
                        <h5>Ingredientes</h5>
                        <p>{{mealInfo.ingredients}}</p>
                    </div>
                </div>
                <div class="col s12 l4">
                    <div class="food-nutri-facts">
                        <div class="card">
                            <h4>Informação Nutricional</h4>
                            <p>Porção referência de <strong>{{mealInfo.weight}} g</strong></p>
                            <table width="100%" border="0" class="highlight">
                                <thead>
                                <tr>
                                    <th>&nbsp;</th>
                                    <th>Qtd</th>
                                    <th>VD*</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>V. energético</td>
                                    <td>{{mealInfo.calories.total}} kcal</td>
                                    <td><strong>{{mealInfo.calories.dailyPercent}}%</strong></td>
                                </tr>
                                <tr>
                                    <td>Carboidrato</td>
                                    <td>{{mealInfo.carbo.total}} g</td>
                                    <td><strong>{{mealInfo.carbo.dailyPercent}}%</strong></td>
                                </tr>
                                <tr>
                                    <td>Proteínas</td>
                                    <td>{{mealInfo.protein.total}} g</td>
                                    <td><strong>{{mealInfo.protein.dailyPercent}}%</strong></td>
                                </tr>
                                <tr>
                                    <td>Gorduras Totais</td>
                                    <td>{{mealInfo.totalFat.total}} g</td>
                                    <td><strong>{{mealInfo.totalFat.dailyPercent}}%</strong></td>
                                </tr>
                                <tr>
                                    <td>Gorduras Trans</td>
                                    <td>{{mealInfo.transFat.total}} g</td>
                                    <td><strong>{{mealInfo.transFat.dailyPercent}}%</strong></td>
                                </tr>
                                <tr>
                                    <td>Gorduras Saturada</td>
                                    <td>{{mealInfo.saturatedFat.total}} g</td>
                                    <td><strong>{{mealInfo.saturatedFat.dailyPercent}}%</strong></td>
                                </tr>
                                <tr>
                                    <td>Fibras</td>
                                    <td>{{mealInfo.fiber.total}} g</td>
                                    <td><strong>{{mealInfo.fiber.dailyPercent}}%</strong></td>
                                </tr>
                                <tr>
                                    <td>Sódio</td>
                                    <td>{{mealInfo.sodium.total}} mg</td>
                                    <td><strong>{{mealInfo.sodium.dailyPercent}}%</strong></td>
                                </tr>
                                </tbody>
                            </table>
                            <div class="food-nutri-footer">
                                <p>Valores diários de referência com base em uma dieta de 2000 kcal ou 8400J.
                                    Seus valores diários podem ser maiores ou menores dependendo de suas necessidades energéticas. (**) VD não estabelecido. (***) Informação Não Disponível no momento</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




        </div>

        <template v-if="product.paymentEnabled">
          <div class="cozi-action">
              <div class="cozi-tooltip">
                <div class="cozi-action__add-wrapper">

                  <div class="row">
                    <div class="col s2">
                      <PipButton type="regular" @click="decrease">-</PipButton>
                    </div>
                    <div class="col s1" style="margin-top: 5px;">
                      <span><strong><b>{{selectedQuantity}}</b></strong></span>
                    </div>
                    <div class="col s2">
                      <PipButton type="regular" @click="increase">+</PipButton>
                    </div>
                    <div class="col s7">
                      <PipButton style="margin-left: 30px;" type="large" @click="addToCart(product, selectedQuantity)">Adicionar</PipButton>
                    </div>
                  </div>
              </div>
              </div>
          </div>

        </template>
        <template v-else>
            Produto ainda não disponível para venda.
        </template>
      </div>

        <div itemscope itemtype="http://schema.org/Product">
            <meta itemprop="brand" content="Coze">
            <meta itemprop="name" :content="product.name">
            <meta itemprop="description" :content="product.descriptionDetail">
            <meta itemprop="productID" :content="product.id">
            <meta itemprop="url" :content="store.url + '/cardapio/' + normalizeProductUrl(product.name, product.id)">
            <meta itemprop="image" :content="product.image">

            <!--            "5814"-->
            <meta itemprop="google_product_category" content="Food, Beverages & Tobacco > Food Items > Prepared Foods">

            <div itemprop="offers" itemscope itemtype="http://schema.org/Offer">
                <link itemprop="availability" href="http://schema.org/InStock">
                <link itemprop="itemCondition" href="http://schema.org/NewCondition">
                <meta itemprop="price" :content="product.amount">
                <meta itemprop="priceCurrency" content="BRL">
                <meta itemprop="priceValidUntil" content="2022-12-31">
            </div>
        </div>

    </template>
    <template v-else>
      Produto não Encontrado
    </template>
    </client-only>


  </div>
</template>

<script>
    /* eslint-disable indent,no-multiple-empty-lines,no-multi-spaces,padded-blocks */
    import {mapGetters, mapActions} from 'vuex'
    import PipProductView from './common/PipProductView'
    import numeral from 'numeral'
    import PipButton from "./pipeu/common/PipButton";
    import { eventHub } from '@/utils/eventHub'
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import PipSelectV2 from "./pipeu/common/PipSelectMD"
    import apiv2 from '@/pipeuapi/apiv2'

    export default {
        name: 'ProductMealDetail',
        mixins: [basicuicomponent],
        data () {
            return {
                product: null,
                selectedQuantity: 1,
                mealInfo: null
            }
        },
        props: {
            id: Number,
            item: Object,
            backUrl: {
                required: false,
                type: String
            }
        },

          // head () {
          //   return {
          //     title: this.product.name,
          //     meta: [
          //       {
          //         hid: `description`,
          //         name: 'description',
          //         content: this.product.description
          //       },
          //       {
          //         hid: `keywords`,
          //         name: 'keywords',
          //         keywords: 'keywords here'
          //       }
          //     ]
          //   }
          // },

        async mounted () {
            let vm = this

            if (this.item) {
                this.product = this.item
            }
            this.mounted = true

            try {
              let resV2 = await apiv2.getProduct(vm.product.uuid)
              console.log('apiv2.getProduct from new api res:', resV2)
              console.log('apiv2.getProduct from new api res.data:', resV2.data)

              if (resV2 && resV2.data && resV2.data.Item) { // Dynamo returns Item key name
                let productV2 = resV2.data.Item
                if ( productV2.mealInfo ) {
                  vm.mealInfo = productV2.mealInfo
                  console.log('### Found mealInfo on productsAPI V2, setting :', vm.mealInfo)
                }
              }

              vm.$nextTick(function () {
                vm.updateComponentKeyReRender()
              })

            }catch (e) {
              console.log('Error getting Meal Info from new API', e)
            }

            // Send event to marketing integrations saying view this product
            eventHub.$emit('marketing-send-event', {event: 'ViewContent', 'productId': vm.product.id, 'productName': vm.product.name})

        },

        components: {
            PipSelectV2,
            PipButton,
            PipProductView
        },

        methods: {
            ...mapActions(['addUpdateCartItem', 'updateCustomerAddress']),
            ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getProductsByDetailPageURL', 'getCustomerAddress']),

            formatAmount (amount) {
                return numeral(amount).format('$ 0,0.00')
            },

            async addToCart (product, quantity) {
                let vm = this
                const productId = product.id

                if (product.requireDelivery === true) {
                    // If product require delivery and the address was verified regarding radius distance between store hq and customer address (against user logged or not)
                    let user = vm.getUserAccount()

                    if ( ( user && user.mainShippingAddress && user.mainShippingAddress.address && user.mainShippingAddress.userHasValidRadiusDeliveryAddress && user.mainShippingAddress.userHasValidRadiusDeliveryAddress === true ) ||
                         ( vm.getCustomerAddress() && vm.getCustomerAddress().userHasValidRadiusDeliveryAddress === true) ) {
                        // console.log('User has address Validated (in radius for delivery) !')
                    } else {
                        // console.log('User DO NOT have address Validated (in radius for delivery) !')
                        // show popup so that user can validate delivery address by typing zipcode or get logged in
                        eventHub.$emit('show-validate-delivery-address', { product: product, quantity: quantity})
                        return;
                    }
                }

                try {
                    let result = await this.addUpdateCartItem({productId:productId, quantity:quantity})
                    // eventHub.$emit('show-pip-cart-checkout')
                    // vm.$router.push({path: '/'})

                    if (vm.backUrl && vm.backUrl.length > 0) {
                      vm.$router.push({path: vm.backUrl})
                    } else {
                      this.$emit('cart-item-added') // this event just close de modal
                    }

                    // Send event to marketing integrations saying use hit checkout Button
                    eventHub.$emit('marketing-AddToCart', {event: 'addToCart', 'productId': productId, 'productName': product.name})


                } catch (error) {
                    vm.handleApiError(error)
                }
            },

            increase() {
              this.selectedQuantity = this.selectedQuantity + 1
            },
            decrease() {
                if (this.selectedQuantity > 1)
                    this.selectedQuantity = this.selectedQuantity - 1
            },
            getProductQuantityOptions(item) {
                let vm = this
                let options = {
                    label: '',
                    materialIcon: '',
                    items: []
                }
                let count
                // Add 0
                options.items.push({
                    value: 0,
                    text: 0,
                    description: ''
                })
                for (count = 1; count <= item.maxQuantityPerOrder; count++) {
                    let minMaxQttPerItem = vm.calculateMinMaxQuantityPerOrder(item, count)
                    if (minMaxQttPerItem <= item.maxQuantityPerOrder) {
                        let optionsItem = {
                            value: minMaxQttPerItem,
                            text: minMaxQttPerItem,
                            description: ''
                        }
                        options.items.push(optionsItem)
                    }
                }
                return options
            },
            calculateMinMaxQuantityPerOrder(prd, currentCount) {
                if (prd.minQuantityPerOrder > 1) {
                    return currentCount + (prd.minQuantityPerOrder - 1)
                } else {
                    return currentCount
                }
            }
        }

    }
</script>
<style>
    .card {
        border-radius: 0px;
    }

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


  * {
    box-sizing: border-box;
  }

  .dish__container {
    height: calc(100% - 70px);
  }
  body {
    font-family: "SulSans", Helvetica, sans-serif;
    overflow-x: hidden;
    font-size: 16px;
    height: 100%;
    scroll-behavior: auto;
  }

  .cozi-content__wrapper-container {
    display: flex;
    flex-direction: column;
    padding: 0 0 16px;
    margin: 0 0 16px 0;
  }

  .cozi-content__container {
    padding: 0 20px;
  }

  .cozi-restaurant {
    border: 1px solid rgba(63, 62, 62, 0.1);
    margin: 0;
    padding: 10px;
    width: 100%;
    overflow: visible;
    background: transparent;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    text-decoration: none;
  }

  a {
    cursor: default;
  }

  a {
    background-color: transparent;
  }

  .cozi-restaurant__name {
    color: #ea1d2c;
    display: flex;
    align-items: center;
  }

  .cozi-restaurant__delivery-time, .cozi-restaurant__name {
    font-size: 0.75rem;
    font-weight: 400;
    text-decoration: none;
    line-height: 1;
  }

  .cozi-restaurant__delivery-time {
    color: #717171;
  }

  .cozi-restaurant__delivery-time, .cozi-restaurant__name {
    font-size: 0.75rem;
    font-weight: 400;
    text-decoration: none;
    line-height: 1;
  }

  .cozi-content__img-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    max-width: 100%;
    /*max-height: 150px;*/
    overflow: hidden;
    border-radius: 4px;
    margin: 16px 0 18px;
  }

  .cozi-content__container {
    padding: 0 20px;
  }

  @media only screen and (max-width: 959px) {
    .cozi-content__title {
      border-bottom: none;
      position: relative !important;
      top: initial !important;
      left: initial !important;
      width: auto !important;
      padding: 2px 20px;
      margin: 20px 0 0;
    }
  }

  .cozi-content__title {
    font-size: 1.125rem;
    font-weight: 500;
    color: #3e3e3e;
    background: #fff;
    z-index: 30;
    width: 100%;
    padding: 2px 20px;
    left: 0 !important;
  }

  .cozi-content__details {
    font-size: 0.875rem;
    margin: 10px 0 0;
    font-weight: 300;
    line-height: 1.22;
    color: #717171;
  }

  .cozi-content__container {
    padding: 0 20px;
  }

  .cozi-content__container-price {
    margin-top: 12px;
    font-size: 0.875rem;
    color: #3e3e3e;
  }

  .cozi-content__container {
    padding: 0 20px;
  }

  .cozi-observation-form {
    display: block;
    margin-bottom: 15px;
    padding: 0 20px;
  }
  .cozi-observation-form__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 20px 0 10px;
  }

  .cozi-observation-form__label {
    margin: 0;
    font-weight: 500;
    font-size: 1rem;
    color: #717171;
  }

  .cozi-content__container {
    padding: 0 20px;
  }



  .cozi-content__img-container .marmita-image-expandable__button {
    overflow: hidden;
    border-radius: 4px;
  }
  button, [type="button"], [type="reset"], [type="submit"] {
    -webkit-appearance: button;
  }
  .marmita-image-expandable__button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: none;
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: visible;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: normal;
    cursor: zoom-in;
  }
  button, select {
    text-transform: none;
  }
  button, input {
    overflow: visible;
  }
  button, input, optgroup, select, textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }
  user agent stylesheet
  button {
    -webkit-appearance: button;
    -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;
    color: buttontext;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: center;
    align-items: flex-start;
    cursor: default;
    background-color: buttonface;
    box-sizing: border-box;
    margin: 0em;
    font: 400 11px system-ui;
    padding: 1px 7px 2px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(216, 216, 216) rgb(209, 209, 209) rgb(186, 186, 186);
    border-image: initial;
  }

  .cozi-action .cozi-tooltip {
    align-items: center;
    background: #fff;
    border-top: 2px solid #f5f0eb;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    padding: 20px 20px;
    height: 100px;
    /*width: 100%;*/
    z-index: 30;
    position: fixed;
  }
  .cozi-action__update-wrapper, .cozi-action__add-wrapper {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
  }
  .cozi-action__counter {
    display: inline-flex;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    margin-right: 10px;
  }
  .cozi-action__update-wrapper .btnmeal.btnmeal--full-width, .cozi-action__update-wrapper .btnmeal--default, .cozi-action__add-wrapper .btnmeal.btnmeal--full-width, .cozi-action__add-wrapper .btnmeal--default {
    width: 100%;
    margin: 0;
    text-align: center;
  }
  button, [type="button"], [type="reset"], [type="submit"] {
    -webkit-appearance: button;
  }
  .btnmeal--default {
    background: #ea1d2c;
    color: #fff;
  }
  .btnmeal {
    background: transparent;
    text-decoration: none;
    color: #ea1d2c;
    border: none;
    padding: 0 20px;
    border-radius: 4px;
    margin: 3px 0;
    height: 50px;
    font-weight: 500;
    transition: 100ms;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: default;
  }
  button, select {
    text-transform: none;
  }
  button, input {
    overflow: visible;
  }
  button, input, optgroup, select, textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }

  .marmita-image--responsive {
    width: 100%;
  }

  @media only screen and (min-width: 375px) {
    .cozi-card__image {
      width: 120px;
      height: 90px;
    }
  }

  .cozi-card__image {
    width: 100px;
    height: 100px;
    -o-object-fit: cover;
    object-fit: cover;
    border-radius: 4px;
    pointer-events: none;
    align-self: flex-start;
  }




  .food {
      background-color: #f9f9f9;
  }

  hr.style1{
      border-top:1px solid #eee;
      margin: 20px 0;
  }

  .food .container-photo  {
      width: 70%;
      margin: auto;

  }

  .food .container-photo .row .col {
      padding: 0;

  }

  .food .btn {
      border: 1px solid #FF3931;
      background-color: transparent;
      color: #FF3931;
      font-weight: bold;
      box-shadow: none;
  }


  .food h4 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 30px
  }
  .food h5 {
      font-size: 18px;
      color: #FF3931;
      margin-bottom: 30px
  }
  .food-price span {
      padding: 0 20px;
      font-weight: bold
  }
  .food-price {
      border-bottom: 1px solid #eee;
      padding-bottom: 30px
  }
  .food-nutri h6 {
      font-size: 12px;
      padding:5px;
  }

  .food-nutri h5 {
      font-size: 18px;
      font-weight: bold;
      color: inherit;
      margin: 0;
      padding:10px;
  }

  .food-nutri h4 {
      font-size: 16px;
      color: #fff;
      padding:5px;
  }
  .food-nutri tr {
      border: none;
  }
  .food-info h5 {
      font-size: 18px;
      color: inherit;
      font-weight: bold;
      margin: 0;
      margin-bottom: 7px;
  }
  .food-info p {
      margin-bottom: 20px
  }

  .food-nutri-facts h4 {
      margin: 0;
      font-size: 18px;
      padding: 10px;
      border-bottom: 4px solid #FF3931;
  }
  .food-nutri-facts .card {
      padding: 10px;
  }

  .food-nutri-facts p {
      padding: 10px;
      background-color: #f9f9f9;
      border-bottom: 1px solid #eee;
      font-size: 14px;
  }
  .food-nutri-facts table {
      font-size: 14px;
  }
  .food-nutri-footer {
      border-top:  4px solid  #FF3931;
  }
  .food-nutri-footer p {
      font-size: 12px;
      color: #999;
      padding: 20px
  }

    .facts {
        padding: 15px 5px;
        display: table-cell;
        text-align: left;
        vertical-align: middle;
        border-radius: 2px;
    }

    .cozi-card__price {
        font-size: 1rem;
        line-height: 1.25rem;
        font-weight: 400;
        color: #3e3e3e;
    }

    .cozi-card__price--discount {
        color: #ff2f38;
    }

    .cozi-card__price {
        font-size: 1rem;
        line-height: 1.25rem;
        font-weight: 400;
        color: #3e3e3e;
    }

    .cozi-card__price--original {
        position: relative;
        font-size: 0.75rem;
        line-height: 1.25rem;
        color: #717171;
        text-decoration: line-through;
        margin-left: 5px;
    }

</style>
