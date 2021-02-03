<template>
    <div v-if="promoEnabled && (showPromoCode || isFirstAccess())" style="position: relative;height: 100%; background-color: black; color: white; padding: 0.8rem; font-size: 13px;">
        <table>
            <tbody>
            <tr>
                <td style="vertical-align: middle; min-width:30px; width: 10px;">
                    <i class="material-icons">insert_emoticon</i>
                </td>
                <td>
                    Use o Cupom <span style="font-weight: bold;">PRIMEIRACOMPRA</span> e garanta 15% de Desconto em seu Primeiro Pedido
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  import {mapGetters, mapState, mapActions} from 'vuex'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import { eventHub } from '@/utils/eventHub'

  export default {
    name: 'TopBar',
    mixins: [basicuicomponent],

    data: function () {
      return {
        promoEnabled: false,
        showPromoCode: false
      }
    },

    created() { // NOTE: On element creation we just can receive data in lower case like storedata or userlogged, storeData or userLogged won't work
      if (process.client) {
        // console.log('### Header -> Initializing PubNub')
        // this.pubnub.load() // Init PubNub realtime presence
      }
    },

    mounted () {
      let existingUser = false

      if (this.userAccount && this.userAccount.id) {
        // console.log('### TopBar mounted UserId', this.userAccount.id)
        existingUser = true
      }

      if (this.$localStorage.get('userId')) {
        existingUser = true
      }

      if (this.$localStorage.get('customerAddress')) {
        existingUser = true
      }

      if (!this.userAccount && !this.$localStorage.get('userId') && !this.$localStorage.get('customerAddress')) {
        console.log('Dont have account, userID and neither customerAddress, firstAcess, addFirstAccess')
        this.addFirstAccess('true')
      }

      if (false == existingUser) {
        this.showPromoCode = true
      }

    },

    methods: {
      ...mapGetters(['isFirstAccess']),
      ...mapActions(['addFirstAccess']),


      showCart () {
        eventHub.$emit('show-pip-cart-checkout')
      },

      processMessage (newMessage) {
        // console.log('### processMessage', newMessage)
        let notificationMessage = JSON.parse(newMessage.message)
        if (notificationMessage.storeId === this.store.id) {
          if (notificationMessage.action === 'NEW_ORDER') {
            this.$toast.success('Alguém acabou de fazer comprar um Ingresso')
          }
        }
      }

    }

  }
</script>
