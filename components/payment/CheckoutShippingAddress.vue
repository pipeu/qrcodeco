<template>
  <div v-if="getCheckout && mounted">
        <div class="ingress">
          <!--<h1>Endereço de Entrega</h1>-->

          <template v-for="address in getUserAccount().shippingAddresses">
            <div class="row">
              <div class="col s10">
                <p style="border-bottom:1px solid #eee; padding-bottom: 20px;">
                  <label :for="address.tokenId">
                    <input type="radio" :disabled="isProcessing" @change="setSelectedValue(address.tokenId)" class="with-gap" v-model="shippingAddressTokenId" :value="address.tokenId" name="rdoShippingAddresses" :id="address.tokenId" />
                    <span> {{address.address}} </span>
                    <template v-if="address.mainAddress === true"><span style="margin-bottom: 0px; text-align: left; margin-left: 29px;" class="principal blue">Principal</span></template>
                  </label>
                </p>

              </div>

              <div class="col s2 right-align">
                <a class='dropdown-trigger right' style="color: #000;" href='#' v-bind:data-target="'shipping-address-sidemenu-' + address.tokenId"><i class="material-icons">more_vert</i></a>
                <ul v-bind:id="'shipping-address-sidemenu-' + address.tokenId" class='dropdown-content'>
                  <li> <a @click="editShippingAddress(address)">Editar</a> </li>
                  <!--<li v-if="!address.mainAddress"> <a @click="setShippingAddressAsMain(item)">Definir como Principal</a> </li>-->
                  <li class="divider"></li>
                  <li> <a @click="deleteShippingAddress(address.tokenId)"> Remover</a> </li>
                </ul>
              </div>
            </div>
          </template>

          <div class="collection">
            <a  @click="editShippingAddress({})" class="collection-item">Adicionar Endereço<i class="material-icons right">add</i></a>
          </div>
        </div>

    <PipModal v-if="showShippingAddress" v-model="showShippingAddress" title="Endereço de Entrega" modalStyle="max-width: 500px; width: 100%; height: 100%; max-height: 775px;">
      <PipUserShippingAddressService class="pipeu-conta card pip-container" @user-shipping-address-updated="updateShippingAddress" :propAddress="shippingAddress"></PipUserShippingAddressService>
    </PipModal>

  </div>
</template>

<script>
  import basicuicomponent from '@/mixins/BasicUIComponent'

  import {mapGetters, mapState} from 'vuex'
  import {mapActions} from 'vuex'

  import { eventHub } from '@/utils/eventHub'
  import PipInput from "@/components/pipeu/common/PipInput";
  import PipButton from "@/components/pipeu/common/PipButton";
  import PipModal from "../pipeu/common/PipModal";

  import PipUserShippingAddressService from "../pipeu/common/PipUserShippingAddressService";
  import api from '@/pipeuapi/api.js'

  export default {
    name: 'CheckoutShippingAddress',
    mixins: [basicuicomponent],

    components: {
      PipUserShippingAddressService,
      PipModal,
      PipButton,
      PipInput,
    },

    data () {
      return {
        shippingAddressTokenId: '',
        showShippingAddress: false,
        shippingAddress: {},
        existingOrderId: 0, // For an existing Order
        code: '',
        oneClickBuyEnabled: false,
      }
    },
    computed: {
      ...mapState({
        store: state => state.store,
        userAccount: state => state.userAccount
      })
    },

    watch: {
      // @! Important: To watch just an Object property we need to create a computed property and then watch it
      shippingAddressTokenId: function (newValue, oldValue) {
        this.updateShippingAddressToken(newValue)
      }
    },

    async mounted () {
        let vm = this

        if (vm.getCheckout()) {
          vm.mounted = true

          // Attention
          vm.$nextTick(function () {
            vm.updateComponentKeyReRender()
          })
        }

        if (window.PaymentRequest) {
          // Use Payment Request API
          // console.log('Uha, PaymentRequest API is Enabled')
          // this.paymentRequestAPIEnabled = true
        }

        // If there are products with deliveries try to set default delivery address
        // console.log('#### vm.getCheckout().shippingAddressTokenId:', vm.getCheckout().shippingAddressTokenId)
        // console.log('#### vm.getUserAccount().mainShippingAddress:', vm.getUserAccount().mainShippingAddress)
        if (!vm.getCheckout().shippingAddressTokenId && vm.getUserAccount().mainShippingAddress && vm.getUserAccount().mainShippingAddress.address) {
          //set default mainAddress
          vm.shippingAddressTokenId = vm.getUserAccount().mainShippingAddress.tokenId

          vm.getCheckout().shippingAddressTokenId = vm.getUserAccount().mainShippingAddress.tokenId
          vm.$emit('checkout-step-completed','SHIPPING_ADDRESS')
        }


    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getCheckout']),
      ...mapActions(['getCheckoutByTokenId', 'addCartItem', 'updateCartItem', 'deleteCartItem', 'applyCartDiscount', 'addUserAccount', 'updateCheckoutShippingAddressToken', 'updateCheckoutOptions']),

      setSelectedValue (val) {
        // console.log('setSelectedValue val', val)
        this.shippingAddressTokenId = val
      },

      // Update checkout on vuex store and external api to reflect another delivery address
      async updateShippingAddressToken(shippingAddressTokenId) {
        let vm = this
        console.log('updateShippingAddressToken shippingAddressTokenId:', shippingAddressTokenId)
        let checkout = await this.updateCheckoutShippingAddressToken(shippingAddressTokenId)
        await this.updateCheckoutOptions(checkout)
      },

      editShippingAddress(shippingAddress) {
        let vm = this
        console.log('>>> editShippingAddress shippingAddress:', shippingAddress)
        vm.shippingAddress = shippingAddress
        console.log('>>> vm.shippingAddress:', vm.shippingAddress)
        vm.showShippingAddress = true
      },

      updateShippingAddress (shippingAddress) {
        let vm = this
        console.log('### updateShippingAddress shippingAddress:', shippingAddress)
        vm.showShippingAddress = false

        this.shippingAddressTokenId = shippingAddress.tokenId

        vm.$emit('checkout-step-completed','SHIPPING_ADDRESS')
        vm.attachComponents()
        eventHub.$emit('show-firefight')
      },

      deleteShippingAddress (tokenId) {
        let vm = this
        let msg = 'Você confirma Remover este Endereço ?'

        vm.confirm(msg, '').then((response) => {
          console.log('confirm result calling deleteAddress res', response)
          // 1 -> ShippingAddress
          api.deleteAddress(1, tokenId).then((res) => {
            console.log('### deleteAddress res.data:', res.data)

            vm.$toast.success('Ok !')
            vm.addUserAccount(res.data)

            // Possible Bug, if this was a main shipping address this could cause a false existing address true
            this.shippingAddressTokenId = ''

            vm.attachComponents()

          }, (error) => {
            vm.handleApiError(error)
          })
        });
      },

      validate () {
        console.log('### validate')
        return true
      },
    }

  }
</script>

<style scoped>

  .note pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
  }

  .principal {
    line-height: 16px;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 300;
    margin: auto;
    padding: 3px 5px;
    width: 16px;
    height: 16px;
  }

  .pip-padding {
    padding: 0!important;
  }

  .btn-outline {
    text-decoration: none;
    color: #0085f7;
    background-color: #fff;
    text-align: center;
    letter-spacing: 0.2px;
    -webkit-transition: background-color .2s ease-out;
    transition: background-color .2s ease-out;
    cursor: pointer;
    border-radius: 50px;
    width: 100%;
    border: 1px solid #0085f7;
    box-shadow: none;
  }



</style>
