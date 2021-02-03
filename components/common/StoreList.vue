<template>
  <div v-if="userAccount.storesRoles && userAccount.storesRoles.length > 0 && show && mounted">

    <transition name="pip-modal">

      <div class="pip-modal-mask">
        <div class="pip-modal-wrapper" :style="modelStyle">

          <div class="pip-modal-header">

            <client-only>
              <template v-if="isMobile()">
                  <span style="padding-bottom: 10px;">
                  <a @click="handleClose">
                    <i style="margin-top: -10px;" class="material-icons left">arrow_back</i>
                  </a>
                  </span>
              </template>
              <template v-else>
                <!--<slot name="header">-->

                <!--<span style="float: right;"><a @click="handleClose"><i class="material-icons">close</i></a></span>-->

                <span style="">
                  <i class="material-icons" style="vertical-align: middle">store</i> 	Selecione uma Loja</span>
                <a @click="handleClose" style="float: right; color: #fff; cursor: pointer;"><i class="material-icons">close</i></a>

                <!--</slot>-->
              </template>
            </client-only>

          </div>

          <div class="pip-modal-container">
            <div class="pip-modal-content" style="overflow-y: auto;">

              <div class="pip-buy-tickets pip-container">

                <div class="row">
                  <div class="col s12 m12 l12">

                    <template v-if="userAccount.storesRoles && userAccount.storesRoles.length > 0">

                      <template v-for="storeRole in userAccount.storesRoles">

                        <!--Skip current logged Store-->
                        <template v-if="storeRole.storeId != store.id">

                          <div class="card-panel first-steps">

                            <div class="row" style="margin-top: 15px;">

                              <div class="col l4">
                                <p>{{storeRole.storeName}}</p>
                              </div>

                              <div class="col l4">
                                <p>{{storeRole.storeUrl}}</p>
                              </div>

                              <div class="col l4">
                                <a @click="goToStore(storeRole)" target="_blank" class="waves-effect waves-light btn blue">Ir para Loja</a>
                              </div>

                            </div>

                          </div>
                        </template>


                      </template>

                    </template>




                  </div>
                </div>

              </div>


            </div>

          </div>
        </div>
      </div>

    </transition>


  </div>

</template>

<script>
  import api from '@/pipeuapi/api.js'
  import basicuicomponent from '@/mixins/BasicUIComponent'

  import {mapGetters, mapState} from 'vuex'
  import {mapActions} from 'vuex'

  import { eventHub } from '@/utils/eventHub'
  import PipButton from "@/components/pipeu/common/PipButton";

  export default {
    name: 'StoreList',

    mixins: [basicuicomponent],

    components: {
      PipButton
    },

    data () {
      return {


        show: true,
        modelStyle: 'width: 100%; height: 100%;', // default Mobile

        title: '',
      }
    },
    computed: {
      ...mapState({
        store: state => state.store,
        userAccount: state => state.userAccount
      })
    },

    created () {
      let vm = this
    },


    mounted () {
      let vm = this
      this.debH('#### StoreList.mounted')

      // W and H in Mobile is always 100%
      if (process.client && !vm.isMobile()) {
        vm.modelStyle = 'width: 50%; height: 65%;' // Default no mobile
      }

      vm.mounted = true
    },

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getCheckout']),
      ...mapActions(['getCheckoutByTokenId', 'addCartItem', 'updateCartItem', 'deleteCartItem', 'applyCartDiscount', 'addUserAccount', 'addUpdateCartItem']),


      handleClose () {
        this.show = false
      },

      goToStore (store) {
        this.$emit('go-to-store', store)
      }

    }

  }
</script>

<style scoped>

  .fixed-footer {
    background-color: #fff;
    /*position: fixed;*/
    bottom: 0;
    text-align: center;
    padding: 20px;
    box-shadow: 0 0 5px 0 rgba(0,0,0,.3);
    /* max-width: 600px; */
  }


  @media only screen and (max-width: 768px) {
    .fixed-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      /* max-width: 600px; */
    }
  }


  .productItem {
    padding: 20px;
    background-color: #fff;
    /*margin-bottom: 10px;*/
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
    border-radius: 5px;
    z-index: 100;
  }

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



  .pip-modal {
    position: fixed;
    top: 20px;
    left: 0;
    right: 0;
    background-color: #fafafa;
    padding: 0;
    max-height: 99%;
    width: 85%;
    margin: auto;
    overflow-y: auto;
    border-radius: 2px;
    will-change: top, opacity;
  }

  .pip-modal-mask {
    position: fixed;
    z-index: 1050;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .8);
    display: block;
    transition: opacity .3s ease;
  }

  .pip-modal-wrapper {
    margin: auto; /* 15% from the top and centered */
    height: 100%;
    /*padding: 20px;*/
    display: block;
    vertical-align: middle;
  }

  .pip-modal-header {
    background-color: #002c4b;
    padding: 25px;
    color: #fff;
  }

  .pip-modal-header a {
    color: #fff;
    cursor: pointer;
    font-size: 16px;
  }

  .pip-modal-container {
    width: 100%;
    height: 100%;
    margin: 0px auto;
    padding: 0;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
    overflow: auto;
    position: relative;
  }

  .pip-modal-container h3 {
    font-size: 16px;
    /*background-color: #1976D2;*/
    color: #fff;
    /*padding: 25px;*/
    /*margin: 0;*/

  }
  .pip-modal-container h3 .material-icons {
    font-size: 18px;
    vertical-align: middle;
  }
  .pip-modal-body {
    margin: 20px 0;
  }

  .pip-modal-default-button {
    float: right;
  }

  .pip-modal-footer-actions {
    padding: 15px;
    text-align: right;
    width: 100%;
    border-top: 1px solid #eee;

    /*border-top: 1px solid #e5e5e5;*/
  }
  /*
   * The following styles are auto-applied to elements with
   * transition="pip-modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the pip-modal transition by editing
   * these styles.
   */

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

  @media only screen and (max-width : 768px) {
    /*.pip-modal-container {*/
    /*width: 100%;*/
    /*}*/

    .pip-modal-container {
      padding-bottom: 20vh;
    }

  }


</style>
