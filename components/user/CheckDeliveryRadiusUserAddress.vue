<template>
    <div v-if="showModal">
            <client-only>
                <InnerLoader></InnerLoader>

                <PipModal v-model="showModal" title="Endereço de Entrega" modalStyle="max-width: 411px; width: 100%; height: 100%; max-height: 750px;">

                    <div class="pip-login page" :key="componentKeyReRender" v-if="mounted">
                        <div class="container">
                            <div class="pipeu-conta" style="margin-top: 10px;">
                                <template v-if="!canBeDelivered">
                                    <div v-if="!itCantBeDelivered" class="row" style="margin-top: 0px; margin-bottom: 10px;">
                                        <div class="col s12 m12 l12">
                                            <strong>Vamos checar se conseguimos te entregar, digite seu CEP</strong>
                                        </div>
                                    </div>
                                    <div v-if="itCantBeDelivered" class="row" style="margin-top: 20px; margin-bottom: 10px;">
                                        <div class="col s12 m12 l12">
                                            <h1 style="line-height: 1.0;">:(<br>Poxa, ainda não estamos enviando para seu endereço</h1>
                                        </div>
                                    </div>
                                    <div v-if="!itCantBeDelivered" class="row">
                                        <div class="col s12 m12 l12">
                                            <input :disabled="isProcessing" v-focus type="text" class="form-control"
                                                   @keyup="changeZipCode" ref="zipCode" id="zipCode" name="zipCode" v-mask="'99999-999'" v-model="address.zipCode" placeholder="Cep">
                                            <PipErrorIndicator componentName="message"></PipErrorIndicator>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="row" style="margin-top: 0px; margin-bottom: 0px;">
                                        <div class="col s12 m12 l12">
                                            <h1 style="line-height: 1.1;">Eba !<br>Seu endereço esta disponível para Entrega</h1>
                                        </div>
                                    </div>
                                    <div v-if="!completedAddress" class="row" style="margin-top: 10px; margin-bottom: 5px;">
                                        <div class="col s12 m12 l12">
                                            <PipUserAddress v-model="address" hideNeighCityState="true"></PipUserAddress>
                                            <PipErrorIndicator componentName="message"></PipErrorIndicator>
                                        </div>
                                    </div>

                                    <div v-if="canBeDelivered" class="row">
                                        <div class="col s12 m12 l12">
                                            <PipButton :disabled="(!validMandatoryAddress) || isProcessing" type="large" @click="done">Escolher Refeições</PipButton>
                                        </div>
                                    </div>
                                </template>

                            </div>
                        </div>
                    </div>


                    <div style="padding: 70px 0;">
                        <div class="container">
                            <div class="row">

                                <div v-if="getUserAccount() && getUserAccount().id > 0" style="bottom: 10px; text-align: center;">
                                    <span style="font-size: 16px; display: table; margin-left: auto; padding: 20px; font-weight: bold;">
                                        {{getUserAccount().firstName}}, digite seu CEP para podermos validar seu Endereço
                                    </span>
                                </div>

                                <div v-else class="have-account" style="bottom: 10px; text-align: center;">
                                    <span style="font-size: 16px; display: table; margin-left: auto;">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Já têm uma conta?
                                        <nuxt-link to="/Login?next=/cardapio" style="font-weight: 400; text-transform: uppercase">Entre</nuxt-link></span>
                                </div>

                            </div>
                        </div>
                    </div>

                </PipModal>
            </client-only>
    </div>
</template>

<script>
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import {mapGetters, mapActions} from 'vuex'
    import { eventHub } from '@/utils/eventHub'
    import PipButton from "@/components/pipeu/common/PipButton"
    import PipModal from "../pipeu/common/PipModal"
    import AwesomeMask from 'awesome-mask'
    import pipeuApi from '@/pipeuapi/api.js'
    import PipErrorIndicator from "@/components/pipeu/common/PipErrorIndicator"
    import PipInput from "@/components/pipeu/common/PipInput"
    import PipUserAddress from "../pipeu/common/PipUserAddress"
    import InnerLoader from "../common/animations/InnerLoader"
    import auth from '@/store/auth'

    export default {
        name: 'CheckDeliveryRadiusUserAddress',
        mixins: [basicuicomponent],
        components: {
            InnerLoader,
            PipUserAddress,
            PipModal,
            PipButton,
            PipInput,
            PipErrorIndicator
        },
        data () {
            return {
                cartItemToBeAdded: {},
                showModal: false,
                loading: true,
                address: {
                    tokenId: '',
                    mainAddress: true,
                    userConfirmedMainAddress: true,
                    zipCode: '',
                    address: '',
                    addressNumber: '',
                    addressNumberComp: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                    // indicates that this address was validated by server and pipeu api regarding store max delivery radius distance
                    userHasValidRadiusDeliveryAddress: false,
                    deliveryRegion: 'REGION-1'
                },
                canBeDelivered: false,
                itCantBeDelivered: false,
                completedAddress: false,
            }
        },

        computed: {
            validMandatoryAddress () {
                return this.address &&
                    ( (this.address.zipCode && this.address.zipCode.length == 9) &&
                        (this.address.address && this.address.address.length > 0) &&
                        (this.address.addressNumber && this.address.addressNumber.length > 0) )
            }
        },

        watch: {
            'address.zipCode': function (newValue, oldValue) {
                // console.log('watch zipCode oldValue', oldValue)
                eventHub.$emit('message-clear-indicator') // TODO move to inside pipeErrorComponent, if input gain focus clear just one time
            }
        },

        directives: {
            focus: {
                // directive definition
                inserted: function (el) {
                    el.focus()
                }
            },
            'mask': AwesomeMask
        },

        created () {
            let vm = this
            eventHub.$on('show-validate-delivery-address', (cartItemToBeAdded) => {
                // vm.deb('>>> show-validate-delivery-address cartItem', JSON.stringify(cartItemToBeAdded))
                vm.cartItemToBeAdded = cartItemToBeAdded
                // If checkout is already visible try to refresh components due to new items in checkout
                if (vm.showModal === true) {
                    vm.updateComponentKeyReRender()
                } else {
                    vm.showModal = true
                }
            })
        },

        async mounted () {
            let vm = this
            this.mounted = true
        },

        methods: {
            ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getCheckout']),
            ...mapActions(['updateCustomerAddress', 'addUserAccount', 'addUpdateCartItem']),

            changeZipCode: function (e) {
                // console.log('changeZipCode')
                let auxZipCode = this.address.zipCode.replace(/[_-]/g, '')
                if (auxZipCode && auxZipCode.length === 8) {
                    this.queryZipCode(auxZipCode)
                }
            },

            async done () {
                let vm = this

                // Fixed
                vm.address.mainAddress = true
                vm.address.userConfirmedMainAddress = true

                await this.updateCustomerAddress(this.address)

                // If user logged update address
                if (vm.getUserAccount() && vm.getUserAccount().id > 0) {
                    let respUpdateAddress = await pipeuApi.updateMainAddress(vm.address)
                    console.log('updateMainAddress respUpdateAddress', respUpdateAddress, respUpdateAddress.data)

                    let meRes = await auth.me() // refresh user account to get all addresses
                    console.log('>>> promise resolved auth.me meRes', meRes.data)
                    vm.addUserAccount(meRes.data.userAccount)
                }

                // If cartItemToBeAdded then add in cart
                if (vm.cartItemToBeAdded &&  vm.cartItemToBeAdded.product) {
                    let result = await this.addUpdateCartItem({productId: vm.cartItemToBeAdded.product.id, quantity: vm.cartItemToBeAdded.quantity})
                    if (process.client && !vm.isMobile()) {
                        eventHub.$emit('show-pip-cart-checkout')
                    }
                }

                this.showModal = false
            },

            async queryZipCode (zipCode) {
                let vm = this
                try {
                    let {data} = await pipeuApi.fetchZipCode(zipCode)
                    // console.log('response fetchZipCode', data)

                    if (data && data.erro && data.erro === true) {
                        vm.$nextTick(function() {
                            vm.$refs.zipCode.focus()
                        })
                        let error = { message: 'CEP não encontrado ! :('}
                        throw error
                    }

                    vm.address.address = data.logradouro
                    vm.address.neighborhood = data.bairro
                    vm.address.city = data.localidade
                    vm.address.state = data.uf

                    vm.$emit('input', vm.address)

                    vm.$nextTick(function () {
                        vm.updateComponentKeyReRender()
                        vm.attachComponents()
                    })

                    try {
                        eventHub.$emit('show-innerloader')
                        let {data} = await pipeuApi.checkStoreMaxRadiusForDelivery(vm.getStore().id, vm.address)
                        eventHub.$emit('hide-innerloader')

                        console.log('response checkStoreMaxRadiusForDelivery', data)

                        if (data && data.result && data.result.canBeDelivered && data.result.canBeDelivered === true) {
                            eventHub.$emit('show-firefight')
                            vm.itCantBeDelivered = false
                            vm.canBeDelivered = true
                            vm.address.userHasValidRadiusDeliveryAddress = true

                            vm.address.deliveryRegion = data.result.deliveryRegion

                        } else {
                            await this.updateCustomerAddress(null)
                            vm.itCantBeDelivered = true
                            vm.canBeDelivered = false
                            vm.address.deliveryRegion = 'REGION-1'
                        }

                    }catch (e) {
                        eventHub.$emit('hide-innerloader')
                        console.log('login failure response', error)
                    }

                }catch (e) {
                    vm.debH('cep not found')
                    vm.handleApiError(e)
                }
            }
        }
    }
</script>

<style scoped>
    .have-account {
        /*width: 70px;*/
        /*height: 70px;*/
        position: relative;
        bottom: 7px;
        right: 7rem;
        /*background-color: #fff;*/
        text-align: center;
        /*box-shadow: 0 0 10px 0 rgba(0,0,0,0.3);*/
        /*-webkit-border-radius: 50px;*/
        /*border-radius: 50px;*/
        /*z-index: 1000;*/
        /*color: #fff;*/
    }

    .footer-login {
        padding-bottom: 80px;
    }

    .footer-login .fixed-button {
        background-color: #fff;
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        padding: 20px;
        box-shadow: 0 0 5px 0 rgba(0,0,0,.3);

        /*max-width: 600px;*/
    }

    .footer-login .fixed-button .btn {
        text-decoration: none;
        color: #fff;
        background-color: #0085f7;
        text-align: center;
        letter-spacing: .5px;
        transition: background-color .2s ease-out;
        cursor: pointer;
        border-radius: 50px;
        width: 100%;
        text-transform: none;
    }
</style>
