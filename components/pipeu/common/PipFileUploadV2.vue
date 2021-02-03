<!--Generic Component to make File Uploads in conjunction with vue-dropzone, DropZone and backend PipeU files services using AWS S3-->
<template>

  <div>
    <transition name="pip-modal">

      <div class="pip-modal-mask">
        <div class="pip-modal-wrapper" :style="modelStyle">
          <div class="pip-modal-container">

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
                  <!--<h3>-->
                  Selecionar Foto do Perfil
                  <span style="float: right;"><a @click="handleClose"><i style="font-size: 18px;" class="material-icons">close</i></a></span>
                  <!--</h3>-->
                  <!--</slot>-->
                </template>
              </client-only>
            </div>

            <div v-show="showDropZone" class="pip-modal-content" id="dropZoneContent">

              <div>
                <div class="valign-wrapper" style="min-height: 20vh;">
                  <div class="row center-align">
                    <div class="col l12">

                      <!--min-height: 25vh;-->
                      <form class="dropzone" style="margin-top: 20px; padding: 0;">
                        <!-- Not displayed, just for Dropzone's `dictDefaultMessage` option -->
                        <div id="dropzone-message" style="padding-top: 30px;min-width: 80vw;padding: 15vh;">
                          <!--style="display: none"-->

                          <!--<div class="row">-->
                            <!--<div class="s12 l12">-->
                              <div class="dropzone-title" style="font-size: 25px;">{{options.dictDefaultMessage}}</div>
                              <div class="dropzone-title" style="font-size: 18px; margin-top: 15px; margin-bottom: 15px;">ou</div>
                              <div class="dropzone-title" style="font-size: 16px; font-weight: bold;">Clique para Enviar uma foto do Computador</div>
                            <!--</div>-->
                          <!--</div>-->

                        </div>
                      </form>


                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div v-show="showCrop" class="pip-modal-content" style="background-color: #000000;">
              <!--<div class="container">-->
                <div :key="componentKeyReRender + '-ph-crop'" id="cropContent" style="max-height: 60vh;">

                </div>
              <!--</div>-->
            </div>



            <div class="pip-modal-footer-actions">

              <!--<PipButton type="regular" @click="handleClose">Definir como foto do perfil</PipButton>-->

              <!--<PipButton type="regular" @click="handleClose">Cancelar</PipButton>-->

              <button v-if="showDropZone" :disabled="!file || file.status !== 'success'" @click="dispatchUploadSuccess" type="button" class="btn">
                Definir como foto do perfil
              </button>
              <button v-else :disabled="!file || file.status !== 'success'" @click="confirmCrop" type="button" class="btn">
                Recortar
              </button>



              <button @click="handleClose" type="button" class="btn">
                Cancelar
              </button>

            </div>

          </div>
        </div>
      </div>

    </transition>
  </div>


</template>

<script>
  import { mapGetters } from 'vuex'
  import basicuicomponent from '@/mixins/BasicUIComponent'

  import Dropzone from 'dropzone'
  import '@/node_modules/dropzone/dist/dropzone.css'

  import Cropper from 'cropperjs'
  import '@/node_modules/cropperjs/dist/cropper.css'

  import api from '@/pipeuapi/api'
  import { eventHub } from '@/utils/eventHub'
  import PipButton from "./PipButton";

  Dropzone.autoDiscover = false

  export default {
    name: 'PipFileUploadV2',
    components: {PipButton},
    mixins:[basicuicomponent],

    created: function () {
      console.log('###### PipFileUploadV2.created')
    },

    data: function() {
      return {
        modelValue: this.value,

        file: {},

        modelStyle: 'width: 100%; height: 100%;', // default Mobile

        // showModal: false,

        options: {
          type: 'PROFILE_PHOTO', // or IMAGE or FILE
          dictDefaultMessage: 'Arraste uma Imagem do Perfil para cá',
          addRemoveLinks: true,
          maxFiles: 1
        },


        showDropZone: true,
        showCrop: false,

        cachedFilename: '',
        cropper: undefined

      }
    },

    props: {
      value: {
        required: true
      },

      componentName: {
        required: true,
        type: String
      }
    },

    computed: {
      ...mapGetters(['getStore','getUserAccount','getAppTemplateInstalled','getAuthorizedAppsModules']),
    },

    methods: {
      show () {
        // this.showModal = true
      },

      disable: function() {
        return this.dropzone.disable();
      },
      enable: function() {
        return this.dropzone.enable();
      },

      removeAllFiles: function(bool) {
        this.dropzone.removeAllFiles(bool)
      },


      handleClose () {
        // this.showModal = false

        this.$emit('close')

      },

      dispatchUploadSuccess () {
        let vm = this

        vm.$emit('input', vm.file.fullURL)

        vm.$emit('fileupload-success', vm.file)

        vm.$emit('close')
      },


      confirmCrop () {
        let vm = this
        vm.debH('confirmCrop')
        // Get the canvas with image data from Cropper.js
        var canvas = vm.cropper.getCroppedCanvas({
          width: 256,
          height: 256
        });

        // Turn the canvas into a Blob (file object without a name)
        canvas.toBlob(function(blob) {
          vm.debH('canvas.toBlob (file object without a name) ...:', blob)
          console.dir(blob)

          // Return the file to Dropzone


          // set 'cropped to true' (so that we don't get to that listener again)
          blob.cropped = true;

          // assign original filename
          blob.name = vm.cachedFilename;

          // add cropped file to dropzone
          vm.dropzone.addFile(blob);
          // upload cropped file with dropzone
          vm.dropzone.processQueue();


        });

        // Remove the editor from the view
        // document.body.removeChild(editor);

        // Remove Crop Window
        vm.showDropZone = true

        vm.updateComponentKeyReRender()

        vm.showCrop = false
      },

      showCropWindow (imageFullURL) {

        let vm = this

        this.debH('showCropWindow imageFullURL', imageFullURL)


          // ignore files which were already cropped and re-rendered
          // to prevent infinite loop

          vm.debH('file.cropped:' + vm.file.cropped)

          // if (file.width < 800) {
          //   // validate width to prevent too small files to be uploaded
          //   // .. add some error message here
          //   return;
          // }

          // cache filename to re-assign it to cropped file
          vm.cachedFilename = vm.file.name;

          // remove not cropped file from dropzone (we will replace it later)
          vm.dropzone.removeFile(vm.file);


          vm.showDropZone = false
          vm.showCrop = true


          // // Create the image editor overlay
          // var editor = document.createElement('div');
          // editor.style.position = 'fixed';
          // editor.style.left = 0;
          // editor.style.right = 0;
          // editor.style.top = 0;
          // editor.style.bottom = 0;
          // editor.style.zIndex = 9999;
          // editor.style.backgroundColor = '#000';
          //
          // document.body.appendChild(editor);
          // // Create confirm button at the top left of the viewport
          // var buttonConfirm = document.createElement('button');
          // buttonConfirm.style.position = 'absolute';
          // buttonConfirm.style.left = '10px';
          // buttonConfirm.style.top = '10px';
          // buttonConfirm.style.zIndex = 9999;
          // buttonConfirm.textContent = 'Confirmar';
          // buttonConfirm.className = 'btn';
          //
          // editor.appendChild(buttonConfirm);

          // Create an image node for Cropper.js
          var image = new Image();
          image.src = URL.createObjectURL(vm.file);


          let editor = document.getElementById('cropContent')

          editor.appendChild(image);

          // Create Cropper.js
          vm.cropper = new Cropper(image, { aspectRatio: 1 });

      }


    },

    mounted () {
      const vm = this

      console.log(' PipFileUploadV2.mounted paramOptions:', this.options)

      if (process.client && !vm.isMobile()) {
        if (vm.modalStyle) {
          vm.modelStyle = vm.modalStyle // Defined by User
        } else {
          vm.modelStyle = "width: 90%; height: 95%;" // Default Large Screen size
        }

      }

      let options = {
        url: '/', // The URL will be changed for each new file being processing

        // Since we're going to do a `PUT` upload to S3 directly
        method: 'put',

        // Hijack the xhr.send since Dropzone always upload file by using formData ref: https://github.com/danialfarid/ng-file-upload/issues/743
        sending (file, xhr) {
          vm.debH('dropzone sending method')

          console.dir(file)

          let _send = xhr.send
          xhr.send = () => {
            _send.call(xhr, file)
          }

          // Use internal service to show Loader and toggle global vuex processing state (same used in main axios global, services on App.vue)
          eventHub.$emit('before-request')

          vm.$emit('mydropzone-sending', file, xhr)
        },

        // Upload one file at a time since we're using the S3 pre-signed URL scenario
        parallelUploads: 1,
        uploadMultiple: false,
        maxFiles: 1,

        // Content-Type should be included, otherwise you'll get a signature mismatch error from S3. We're going to update this for each file.
        header: '',

        // Customize the wording
        dictDefaultMessage: vm.options.dictDefaultMessage, // document.querySelector('#dropzone-message').innerHTML,

        // We're going to process each file manually (see `accept` below)
        autoProcessQueue: false,

        // Here we request a signed upload URL when a file being accepted
        accept (file, done) {

          vm.debH('accept file.name:', file.name)

          console.dir(file)

          let fileName = vm.getUserAccount.id + '-' + file.name

          api.getSignedURL(fileName, vm.options.type).then((url) => {
              console.log('PipFileUploadV2.options.accept api.getSignedURL', url)
              file.uploadURL = url
              done()

              vm.debH('dropzone.processFile')

              // Manually process each file
              setTimeout(() => vm.dropzone.processFile(file))
            })
            .catch((err) => {
              done('Failed to get an S3 signed upload URL', err)
            })
        },

        // transformFile: function(file, done) {
        //   vm.debH('transformFile')
        //
        //
        //   // cache filename to re-assign it to cropped file
        //   var cachedFilename = file.name;
        //
        //   // Create Dropzone reference for use in confirm button click handler
        //   var myDropZone = this;
        //
        //   // Create the image editor overlay
        //   var editor = document.createElement('div');
        //   editor.style.position = 'fixed';
        //   editor.style.left = 0;
        //   editor.style.right = 0;
        //   editor.style.top = 0;
        //   editor.style.bottom = 0;
        //   editor.style.zIndex = 9999;
        //   editor.style.backgroundColor = '#000';
        //   document.body.appendChild(editor);
        //   // Create confirm button at the top left of the viewport
        //   var buttonConfirm = document.createElement('button');
        //   buttonConfirm.style.position = 'absolute';
        //   buttonConfirm.style.left = '10px';
        //   buttonConfirm.style.top = '10px';
        //   buttonConfirm.style.zIndex = 9999;
        //   buttonConfirm.textContent = 'Confirm';
        //   editor.appendChild(buttonConfirm);
        //
        //   buttonConfirm.addEventListener('click', function() {
        //
        //     vm.debH('Confirming CROP...')
        //
        //     // Get the canvas with image data from Cropper.js
        //     var canvas = cropper.getCroppedCanvas({
        //       width: 256,
        //       height: 256
        //     });
        //
        //
        //     // Turn the canvas into a Blob (file object without a name)
        //     canvas.toBlob(function(blob) {
        //       vm.debH('canvas.toBlob (file object without a name) ...:', blob)
        //       console.dir(blob)
        //
        //       // Create a new Dropzone file thumbnail
        //       myDropZone.createThumbnail(
        //         blob,
        //         myDropZone.options.thumbnailWidth,
        //         myDropZone.options.thumbnailHeight,
        //         myDropZone.options.thumbnailMethod,
        //         false,
        //         function(dataURL) {
        //           vm.debH('myDropZone.createThumbnail CROP...')
        //
        //           // Update the Dropzone file thumbnail
        //           myDropZone.emit('thumbnail', file, dataURL);
        //
        //           vm.debH('thumbnail sent to dropZone file:', file)
        //           // vm.debH('thumbnail sent to dropZone dataURL:', dataURL)
        //
        //
        //           // set 'cropped to true' (so that we don't get to that listener again)
        //           blob.cropped = true;
        //           // assign original filename
        //           blob.name = cachedFilename;
        //
        //
        //           blob.poraqui = true
        //
        //
        //           // Return the file to Dropzone
        //           //done(blob);
        //           // return vm.dropzone.resizeImage(file, 256, 256, 'crop', done)
        //
        //
        //           // vm.dropzone.removeFile(file);
        //
        //
        //
        //           vm.dropzone.addFile(blob);
        //           // upload cropped file with dropzone
        //           vm.dropzone.processQueue();
        //
        //           //done(blob);
        //
        //         });
        //     });
        //
        //
        //     // Turn the canvas into a Blob (file object without a name)
        //     // canvas.toBlob(function(blob) {
        //     //   vm.debH('canvas.toBlob (file object without a name) ...:', blob)
        //     //   console.dir(blob)
        //     //
        //     //   // set 'cropped to true' (so that we don't get to that listener again)
        //     //   blob.cropped = true;
        //     //   // assign original filename
        //     //   blob.name = cachedFilename;
        //     //
        //     //   // Return the file to Dropzone
        //     //   done(blob);
        //     //
        //     // });
        //
        //
        //
        //     // Remove the editor from the view
        //     document.body.removeChild(editor);
        //
        //   });
        //
        //
        //   // Create an image node for Cropper.js
        //   var image = new Image();
        //   image.src = URL.createObjectURL(file);
        //   editor.appendChild(image);
        //
        //   // Create Cropper.js
        //   var cropper = new Cropper(image, { aspectRatio: 1 });
        //
        //
        //   vm.dropzone.removeFile(file);
        //
        // }




      }


      // addRemoveLinks: true,

      // Instantiate Dropzone
      this.dropzone = new Dropzone('div#dropzone-message', options)




      // this.dropzone.on('thumbnail', function(file) {
      //   vm.debH('ON thumbnail')
      //
      //
      //   // ignore files which were already cropped and re-rendered
      //   // to prevent infinite loop
      //
      //   vm.debH('file.cropped:' + file.cropped)
      //
      //   if (file && file.cropped) {
      //     vm.debH('File wasnt cropped, returning....')
      //     return;
      //   }
      //
      //   // if (file.width < 800) {
      //   //   // validate width to prevent too small files to be uploaded
      //   //   // .. add some error message here
      //   //   return;
      //   // }
      //
      //   // cache filename to re-assign it to cropped file
      //   var cachedFilename = file.name;
      //
      //   // remove not cropped file from dropzone (we will replace it later)
      //   vm.dropzone.removeFile(file);
      //
      //
      //
      //   // Create the image editor overlay
      //   var editor = document.createElement('div');
      //   editor.style.position = 'fixed';
      //   editor.style.left = 0;
      //   editor.style.right = 0;
      //   editor.style.top = 0;
      //   editor.style.bottom = 0;
      //   editor.style.zIndex = 9999;
      //   editor.style.backgroundColor = '#000';
      //   document.body.appendChild(editor);
      //   // Create confirm button at the top left of the viewport
      //   var buttonConfirm = document.createElement('button');
      //   buttonConfirm.style.position = 'absolute';
      //   buttonConfirm.style.left = '10px';
      //   buttonConfirm.style.top = '10px';
      //   buttonConfirm.style.zIndex = 9999;
      //   buttonConfirm.textContent = 'Confirm';
      //   editor.appendChild(buttonConfirm);
      //
      //   buttonConfirm.addEventListener('click', function() {
      //     vm.debH('Confirming CROP...')
      //     // Get the canvas with image data from Cropper.js
      //     var canvas = cropper.getCroppedCanvas({
      //       width: 256,
      //       height: 256
      //     });
      //
      //     // Turn the canvas into a Blob (file object without a name)
      //     canvas.toBlob(function(blob) {
      //       vm.debH('canvas.toBlob (file object without a name) ...:', blob)
      //       console.dir(blob)
      //
      //       // Return the file to Dropzone
      //
      //
      //       // set 'cropped to true' (so that we don't get to that listener again)
      //       blob.cropped = true;
      //       // assign original filename
      //       blob.name = cachedFilename;
      //
      //       // add cropped file to dropzone
      //       vm.dropzone.addFile(blob);
      //       // upload cropped file with dropzone
      //       vm.dropzone.processQueue();
      //
      //
      //     });
      //     // Remove the editor from the view
      //     document.body.removeChild(editor);
      //   });
      //
      //
      //
      //   // Create an image node for Cropper.js
      //   var image = new Image();
      //   image.src = URL.createObjectURL(file);
      //   editor.appendChild(image);
      //
      //   // Create Cropper.js
      //   var cropper = new Cropper(image, { aspectRatio: 1 });
      //
      //
      //
      // })




      vm.dropzone.on('addedfile', function(file) {
        vm.debH('addedfile called')
        if (vm.dropzone.files.length > 1) {
          vm.dropzone.removeFile(vm.dropzone.files[0]);
        }
      })


      vm.dropzone.on('error', function(obj, errorMessage, xhr) {
        eventHub.$emit('request-error')
        vm.debH('dropzone erorr errorMessage:', errorMessage)
        vm.showError('Problema ao Fazer Enviar Arquivo ' + errorMessage) // data.errors.message
      })

      vm.dropzone.on('success', function(file, response) {
        console.log('dropzone success response', response)

        // Use internal service to hide Loader and toggle global vuex processing state
        eventHub.$emit('after-response')

        // If file type is Image then notify pipeu api, set file as public read and get file full URL
        if ((vm.options.type == 'IMAGE' || vm.options.type == 'PROFILE_PHOTO' ) && file && file.status && file.status == 'success') {


          let fileName = vm.getUserAccount.id + '-' + file.name

          // Notify pipeu api file services that client uploaded file with success
          api.notifyFileUploadSuccessGetFullURL(fileName, vm.options.type)
            .then((res) => {
              console.info('Ok AFTER executing notifyFileUploadSuccess res.data', res.data)

              file.fullURL = res.data.fullURL

              // vm.$emit('fileupload-success', file)
              vm.file = file

              //vm.$emit('input', file.fullURL)

              vm.debH('file.cropped', file.cropped)

              if (!file.cropped) {
                vm.showCropWindow(file.fullURL)
              }


            })
            .catch((err) => {
              console.error('Error AFTER executing notifyFileUploadSuccess ', err)
            })


        } else {
          vm.$emit('fileupload-success', file)
          vm.$emit('input', file.name)
        }

      })





      this.dropzone.on('sendingmultiple', function(file, xhr, formData) {
        vm.$emit('mydropzone-sending-multiple', file, xhr, formData)
      })


      // Called when the upload was either successful or erroneous
      this.dropzone.on('complete', function(file) {

        vm.$emit('mydropzone-complete', file)
      })

      this.dropzone.on('completemultiple', function(files) {
        vm.$emit('mydropzone-complete-multiple', files)
      })

      // Set signed upload URL for each file
      vm.dropzone.on('processing', (file) => {
        console.log('dropzone on-processing file.uploadURL', file.uploadURL)
        vm.dropzone.options.url = file.uploadURL

        // console.log('vm.dropzone.options', vm.dropzone.options)
        // console.log('vm.dropzone.header', vm.dropzone.options.headers)
        // vm.dropzone.options.headers = {'Content-Type':'', 'acl':''}

      })
    }
  }
</script>

<style>

  /*.dropzone .dz-preview.dz-image-preview {*/
    /*background: none;*/
  /*}*/
  /*.dropzone .dz-preview {*/
    /*display: block;*/
    /*margin-left: 26vw;*/
  /*}*/


  img {
    max-width: 100%; /* This rule is very important, please do not ignore this! */
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
    /*text-align: right;*/
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


<style lang="stylus">
  primaryBlue = #3498db

  form.dropzone
    transition all 0.2s linear
    border 2px dashed #ccc
    background-color #fafafa
    min-height initial
    &:hover
      border-color primaryBlue
      background-color white
      .dz-message
        .dropzone-title
          color primaryBlue
    .dz-message
      color #666
      span
        line-height 1.8
        font-size 13px
        letter-spacing 0.4px
        span.dropzone-title
          display block
          color #888
          font-size 1.25em
        span.dropzone-info
          display block
          color #a8a8a8
</style>
