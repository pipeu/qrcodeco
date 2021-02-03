<template>
  <div class="pip-bg">

    <HeaderPipeu :showCartIcon="false"></HeaderPipeu>

    <div v-if="mounted" class="pip-buy-tickets pip-container">

            <div class="row">
              <div style="font-size:24px; padding:20px 0 10px;">
                <div class="container">
                  <h1 v-if="productDeliveryConfirmed" style="font-size: 30px; margin-left: -40px;">Parabéns {{getUserAccount().firstName}}, seu Ingresso foi Emitido com Sucesso !</h1>
                  <h1 v-else>{{getUserAccount().fullName}}, confirme seus Dados para Emitir seu Pedido !</h1>
                </div>
              </div>
            </div>

            <div class="container-fluid container-payment">
                <div class="container">

                        <div class="row">

                          <div class="col s12 m12 l12">
                            <h1>Pedidos</h1>

                              <div class="ingress active">
                                <div class="row">
                                  <div class="col s10">


                                    <div class="media" style="margin-bottom: 30px;">
                                      <img v-if="productDefault.image" class="mr-3" :src="productDefault.image" style="width: 100px;">
                                      <div class="media-body">
                                        <h5 class="mt-0"> {{productDefault.name}} </h5>
                                        <!--{{productDefault.description}}-->
                                      </div>
                                    </div>

                                    <!--<h1>{{productDefault.name}}</h1>-->
                                    <!--<p>{{productDefault.description}}</p>-->

                                    <template v-if="productDefault.additionalProducts && productDefault.additionalProducts.length > 0">
                                      <p>Este produto contém ítens adicionais sem custo</p>
                                      <template v-for="additionalProduct in productDefault.additionalProducts">

                                        <template v-if="isProduct(additionalProduct.type) || isProductBundle(additionalProduct.type)">

                                          <div class="media" style="margin-bottom: 30px;">
                                            <img v-if="additionalProduct.image" class="mr-3" :src="additionalProduct.image" style="width: 70px;">
                                            <div class="media-body">
                                              <h5 class="mt-0"> {{additionalProduct.name}} </h5>
                                              <!--{{additionalProduct.description}}-->
                                            </div>
                                          </div>

                                        </template>

                                      </template>
                                    </template>

                                  </div>

                                </div>

                                <div class="row">
                                  <div class="col s6">
                                    <h2>{{formatCurrency(productDefault.amount)}}</h2>
                                  </div>
                                  <div class="col s3 right-align">
                                    <div class="quantity">

                                        {{quantity}}

                                    </div>

                                  </div>
                                </div>
                              </div>
                          </div>

                          <div v-if="!productDeliveryConfirmed" class="col s12 m12 l12">
                            <h1>Dados para Emissão do Ingresso</h1>
                            <div class="ingress active">

                              <div class="row">
                                <div class="col s10">

                                  <PipCPFInput component-name="cpf" label-desc="Complete seu CPF" v-model="cpf"></PipCPFInput>

                                </div>
                              </div>
                            </div>
                          </div>

                          <div class="col s12">
                                <div v-if="!productDeliveryConfirmed">

                                  <p style="font-size: 20px;color: #1b427c;padding: 0 0 25px;">Emitir Produto</p>

                                  <div class="row fg-mb">
                                    <div class="col-lg-8 col-md-8 col-xs-9">
                                      <!--<i class="fa fa-circle-o-notch fa-spin"></i>-->
                                      <button :disabled="processing" type="button"  @click="processRequest" class="btn btn-primary btn-lg btn-block">Confirmar</button>


                                    </div>
                                  </div>

                                </div>

                                <!--<template v-if="isDigitalProduct"> &lt;!&ndash; && productDefault.digitalGoodType === 1 &ndash;&gt;-->
                                <!--<tr>-->
                                <!--<td colspan="2">O Link para Download do Arquivo será enviado por Email e também disponível em sua Conta (Minha Conta)</td>-->
                                <!--</tr>-->
                                <!--</template>-->
                          </div>


                        </div>


                        <template v-if="productDeliveryConfirmed">


                          <div class="row">
                            <div class="col s12 m12 l12">
                              <UserEventTickets v-if="tickets" :listOfTickets="tickets"></UserEventTickets>
                            </div>
                          </div>


                          <div class="pip-container">
                            <div class="row">
                              <div class="col s12 m12 l12">

                                <h2 style="padding-top: 10px; padding-bottom: 10px;">Informações Importantes</h2>
                                <p class="mt-3 mb-2">
                                  <PipButton @click="printPage"><i class="fa fa-print"></i> Imprimir Página</PipButton>
                                </p>

                                  <div class="ingress active">
                                    <div class="row">
                                      <div class="col s12 l12">
                                        <h1>{{productDefault.name}}</h1>
                                        <p>{{productDefault.description}}</p>
                                        <div v-if="productDefault.paymentSuccessImportantNotes && productDefault.paymentSuccessImportantNotes.length > 0"
                                             style="white-space: pre-wrap; word-wrap: break-word;font-family: inherit;">{{(productDefault.paymentSuccessImportantNotes).trim()}}
                                        </div>
                                      </div>
                                    </div>

                                  </div>

                                <p class="mt-2"><strong>* Enviamos um email para {{getUserAccount().email}} com os dados do Pedido</strong></p>

                              </div>
                            </div>
                          </div>




                        </template>


                </div>
            </div>

            <!--<FooterPipeu></FooterPipeu>-->

        </div>
    </div>
</template>

<script>
    import {mapGetters, mapState} from 'vuex'
    import HeaderPipeu from '../components/HeaderPipeu'
    import FooterPipeu from '../components/FooterPipeu'
    import axios from 'axios'
    import MaskedInput from 'vue-text-mask'
    import paymentApi from '~/pipeuapi/payment.js'
    import numeral from 'numeral'

    import basicuicomponent from '@/mixins/BasicUIComponent'
    import PipCPFInput from "../components/pipeu/common/PipCPFInput";
    import PipButton from "../components/pipeu/common/PipButton";
    import UserEventTickets from "./myaccount/events/tickets/UserEventTickets";

    export default {
        name: 'checkoutFreeProduct',
        mixins: [basicuicomponent],
        middleware: ['auth'],
        components: {
          UserEventTickets,
          PipButton,
          PipCPFInput,
            HeaderPipeu, FooterPipeu, MaskedInput // , InvoiceData
        },
        head () {
            return {
                title: 'Finalizar Pedido'
            }
        },
        data () {
            return {
                productDefault: {},
                productCode: 0,

                quantity: 1, // param.QTT

                tickets: {},

                cpf: '',
                zipCode: '',
                address: '',
                addressNumber: '',
                addressNumberComp: '',
                neighborhood: '',
                city: '',
                state: '',
                country: 'BR',

                processing: false,
                productDeliveryConfirmed: false
            }
        },
        computed: {
            ...mapState({
                store: state => state.store,
                userAccount: state => state.userAccount
            })
        },

        created: function () {
            console.log('###### checkoutFreeProduct.created')
            console.log(`this.getUserAccount(): ${this.getUserAccount().fullName}`)
            console.log('this.$route.query.QTT:', decodeURIComponent(this.$route.query.QTT))

            if (this.$route.query.QTT) {
                this.quantity = decodeURIComponent(this.$route.query.QTT)
            } else {
                this.quantity = 1
            }

        },

        async mounted () {

            let vm = this


            if ((process.client) && !this.productDeliveryConfirmed) {
                console.log('payment.vue running on Browser, initing components')
            }

            this.cpf = this.$store.getters.getUserAccount.cpf
            this.zipCode = this.$store.getters.getUserAccount.zipCode
            this.address = this.$store.getters.getUserAccount.address
            this.addressNumber = this.$store.getters.getUserAccount.addressNumber
            this.addressNumberComp = this.$store.getters.getUserAccount.addressNumberComp
            this.neighborhood = this.$store.getters.getUserAccount.neighborhood
            this.city = this.$store.getters.getUserAccount.city
            this.state = this.$store.getters.getUserAccount.state

            vm.attachComponents()

            vm.mounted = true
        },

        async asyncData ({ store, params, query, route, req, error }) {
            console.log('### ProductDelivery.asyncData query:', query)
            let product
            // 16/06/18 - Verify if the request payment product is a LinkedGroup id (like Main conference ticket group) where it needed to be replaced
            let groupId = decodeURIComponent(query.GRPID)
            console.log('groupId:', groupId)
            if (groupId && groupId !== undefined && groupId !== 'undefined') {
                console.log('### This is a linkedGroup payment request, getting group to get the right product')

                try {
                    let productResult = await api.getLinkedProductGroupByGroupId(groupId)

                    console.log('response.data', productResult.data)
                    product = productResult.data
                } catch (e) {
                    console.log(e)
                    error({ statusCode: 404, message: 'Produto Indisponível para compra' })
                }
            } else {

                let productId = decodeURIComponent(query.ID)
                console.log('productId:', productId)

                product = store.getters.getProductsById(productId)
                let productResult
                if (!product) {
                    console.log('### checkoutFreeProduct product not found on local user repository, getting from backend')
                    try {
                        productResult = await axios.get('/products/' + productId)
                        // TODO:  store.dispatch('addProduct', '')
                        product = productResult.data
                    } catch (e) {
                        error({statusCode: 404, message: 'Problema ao Finalizer Pedido'})
                    }
                }

            }

            console.log('query.QTT', query.QTT)
            let pQTT = 1
            if (query.QTT) {
                pQTT = decodeURIComponent(query.QTT)
            }
            console.log('pQTT:', pQTT)

            return {

                productDefault: product,

                zipCode: store.getters.getUserAccount.zipCode,
                address: store.getters.getUserAccount.address,
                addressNumber: store.getters.getUserAccount.addressNumber,
                addressNumberComp: store.getters.getUserAccount.addressNumberComp,
                neighborhood: store.getters.getUserAccount.neighborhood,
                city: store.getters.getUserAccount.city,
                state: store.getters.getUserAccount.state,
                country: store.getters.getUserAccount.country
            }
        },

        methods: {
            ...mapGetters(['getStore', 'getUserAccount', 'getDomain']),

            processRequest () {
                console.log('### processRequest')
                let app = this

                app.cpf = app.cpf.replace(/[_]/g, '')
                if (!app.cpf || app.cpf.length !== 14) {

                    app.processing = false
                    app.addErrors('cpf', 'Digite o CPF')
                    app.$toast.error('Digite o CPF')
                    return
                }

                let result = true

                if (!result) {
                    app.$toast.error('Corrija os Erros em Vermelho')

                    app.processing = false

                } else {
                    app.errors.clear()


                    //03/07/18 Fixed just for Event Tickets for now
                    paymentApi.issueFreeEventTicket(this.productDefault.id, this.cpf, this.quantity).then((response) => {

                        console.log('paymentApi.issueFreeEventTicket response ', response.data)
                        let data = response.data
                        console.log('data', data)

                        app.productDeliveryConfirmed = true

                        // app.order = data.order
                        // console.log('order', app.order)

                        if (data) {
                            app.$toast.success('Pedido Aprovado !')

                            this.tickets = data


                        } else {
                            app.$toast.error('Pedido não Aprovado !')
                        }


                    }, (error) => {
                      app.handleApiError(error)
                    })
                }
            },

            formatAmount (amount) {
                return numeral(amount).format('$ 0,0.00')
            },
            printPage () {
                window.print()
            }
        }

    }
</script>

<style scoped>
    .note pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: inherit;
    }

    input.invalid {
        border: 2px solid red;
    }
    .validation.failed:after {
        color: red;
        content: 'Validation failed';
    }
    .validation.passed:after {
        color: green;
        content: 'Validation passed';
    }

    .fg-mb {
        margin-bottom: 20px;
    }

    .container-payment {
        background-color: #f8f8f8;
        padding: 20px 0px 20px 0px;
        margin-bottom: 20px;
    }

    .text-center {
        text-align: left;
        margin-left: 250px;
    }

    .input-error {
        color: #B8211D;
        padding: 5px;
        margin-bottom: 13px;
    }

    .account-error {
        color: #e40903;
        padding: 5px;
        margin-bottom: 13px;
    }




</style>
