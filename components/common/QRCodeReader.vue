<template>
  <div>
      <qrcode-stream @decode="onDecode"></qrcode-stream>
  </div>
</template>

<script>
  /* eslint-disable */
  import { QrcodeStream } from 'vue-qrcode-reader'

  export default {
    name: 'QRCodeReader',

    components: {QrcodeStream},

    mounted: function () {
      let vm = this
      console.log('###### QRCodeReader.mounted')

    },

    methods: {

      onDecode (decodedString) {
        let vm = this
        console.log('>>>>>>> onDecode:', decodedString)
        this.$emit('on-decode', decodedString)
      },

    }

  }
</script>

