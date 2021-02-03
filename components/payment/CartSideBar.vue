<template>
  <div v-if="showModal" style="position: fixed; right: 0; background-color: #fff; top: 0; width: 400px; height: 100%;-webkit-box-shadow: 0 0 5px 0 rgba(0,0,0,.3);
    box-shadow: 0 0 5px 0 rgba(0,0,0,.3); margin: 0; padding: 0; z-index: 999">
    <transition name="pip-modal">

      <div class="adm-chat-side">
        <div class="adm-chat-container">
          <div class="adm-chat-admin-profile">

            <p style="">
            <i class="material-icons" style="vertical-align: middle">shopping_cart</i> 	Carrinho</p>
            <a @click="handleClose" style="float: right; color: #fff; cursor: pointer;"><i class="material-icons">close</i></a>

          </div>

          <div class="adm-chat-section adm-chat-area">
            <slot></slot>
          </div>

          <div class="adm-chat-footer">
            <PipButton type="large" @click="goToPath('/checkoutPayment?tokenId=' + getCheckout().tokenId + '')">Finalizar Compra</PipButton>
            <button @click="handleClose" style="text-decoration: none;
                color: #ff2f38;
                text-align: center;
                letter-spacing: .5px;
                transition: background-color .2s ease-out;
                cursor: pointer;
                border-radius: 50px;
                width: 100%;
                background-color: #fff;
                padding: 10px;
	              font-size: 16px; border: 1px solid #ff2f38; margin-bottom: 0; margin-top: 10px;">Continuar Comprando</button>
          </div>
        </div>
      </div>

    </transition>
  </div>
</template>

<script>
  import PipButton from "@/components/pipeu/common/PipButton";
  import UtilsMixin from '@/mixins/UtilsMixin'
  import {mapGetters, mapState} from 'vuex'
  export default {
    name: 'CartSideBar',
    components: {PipButton},
    mixins: [UtilsMixin],
    props: {
      value: {
        required: true
      },
    },

    data () {
      return {
        showModal: this.value, // We can bind parent v-mode in this way, instead of this vm.modelValue = vm.value in created hook
      }
    },

    created: function () {
      // console.log('###### CartSideBar')
    },

    mounted: function () {
    },

    beforeMount: function () {
    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getCheckout', 'isProcessing']),

      handleClose () {
        this.showModal = false
        this.$emit('input', this.showModal)

      },

    }

  }
</script>
<style scoped>

  .adm-chat-side {
    display: flex;
    justify-content: flex-end;
    font-family: 'Roboto', sans-serif;
    margin: 0;
    font-weight: 300;
    height: 100%;
    z-index: 9999;
    position: fixed;
    right: 0;
  }
  .adm-chat-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    margin: 0;
    width: 400px;
    -webkit-box-shadow: 0 0 10px 0 rgba(0,0,0,0.3);
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.3);
    position: relative;
  }
  .adm-chat-admin-profile {
    /*background-color: #002c4b;*/
    background-color: #ff2f38;
    color: #fff;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  .adm-chat-admin-profile p {
    color: #fff; float: left; margin: 0; padding: 0 10px; font-size: 14px; font-weight: 400;
  }
  .adm-chat-section {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  .adm-chat-area {
    color: #000;
    background-color: #fff;
    overflow: auto;
    padding: 10px;
  }
  .adm-chat-footer {
    background-color: #fff;
    padding: 10px;
    border-top: 1px solid #eee;
    text-align: center
  }
  .adm-chat-footer a {
    text-decoration: none;
    color: #c83b6b;
  }
  .adm-chat-footer button {
    margin-bottom: 10px
  }


  .pip-buy-tickets .ingress.active {
    border-left: 2px solid #0085f7;
  }

  .pip-buy-tickets .ingress {
    padding: 20px;
    background-color: #fff;
    margin-bottom: 10px;
    box-shadow: 0 0 5px 0 rgba(0,0,0,.2);
    border-radius: 5px;
  }


  .pip-modal-enter {
    opacity: 0;
  }

  .pip-modal-leave-active {
    opacity: 0;
  }

  .pip-modal-enter .pip-modal-container,
  .pip-modal-leave-active .pip-modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

</style>

