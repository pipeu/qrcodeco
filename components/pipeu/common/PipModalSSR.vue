<template>
    <div v-if="showModal">
        <transition name="pip-modal">
            <div class="pip-modal-mask">
                <div class="pip-modal-wrapper" :style="modelStyle">
                    <div class="pip-modal-container">

                        <div class="pip-modal-header">

                            <template v-if="mobile">
                                <span style="padding-bottom: 10px;"><a @click="handleClose"><i style="margin-top: -10px;" class="material-icons left">arrow_back</i></a></span>
                                <span style="float: right;"><a style="margin-right: 110px; font-weight: 200;" @click="handleClose">Detalhe do Produto</a></span>
                            </template>
                            <template v-else>
                                <h3>
                                    <i v-if="materialIcon" class="material-icons">{{materialIcon}}</i> {{title}}
                                    <span style="float: right;">
                                        <a @click="handleClose"><i class="material-icons">close</i></a>
                                    </span>
                                </h3>
                            </template>

                        </div>

                        <!--style="overflow-y: auto;"-->
                        <div class="pip-modal-content">
                            <slot></slot>
                        </div>

                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
  import basicuicomponent from '@/mixins/BasicUIComponent'

  export default {
    name: 'PipModalSSR',
    mixins: [basicuicomponent],

    props: {
      value: {
        required: true
      },
      modalStyle: {
        required: false,
        type: String
      },
      title: '',
      materialIcon: null,
      backUrl: {
        required: false,
        type: String
      }
    },

    data () {
      return {
        modelStyle: 'width: 100%; height: 100%;', // default Mobile, W and H in Mobile is always 100%
        showModal: this.value, // We can bind parent v-mode in this way, instead of this vm.modelValue = vm.value in created hook
        mobile: true
      }
    },

    mounted: function () {
      let vm = this

      if (process.client) {

        vm.mobile = vm.isMobile()

        if (!vm.mobile) { // if is desktop or table resize window
          vm.modelStyle = "width: 50%; height: 100%;"
        }
      }

      console.log('PipModalSSR backUrl:', this.backUrl)
      console.log('PipModalSSR mobile:', this.mobile)
      console.log('PipModalSSR modelStyle:', this.modelStyle)
    },

    methods: {
      handleClose () {
        if (this.backUrl && this.backUrl.length > 0) {
          this.$router.push({path: this.backUrl})
        } else {
          this.showModal = false
          this.$emit('input', this.showModal)
          this.$emit('closeModal')
        }
      }
    }

  }
</script>
<style scoped>
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
        /*overflow-y: auto;*/
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
        background-color: rgba(0, 0, 0, .5);
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
        /*@COZI - TODO parametrizar */
        background-color: #ff2f38;
        /*background-color: #000000;*/
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

    @media only screen and (max-width : 992px) {
        .pip-modal-container {
            width: 100%;
        }
    }

</style>
