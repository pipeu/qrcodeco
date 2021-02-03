<template>

<div v-if="active" id="snackbar" class="show">

  <!-- The actual snackbar -->
  <i class="material-icons left">timer</i><strong>Muita procura</strong>
  122 ingressos vendidos nas últimas 24 horas

</div>

</template>

<script>
  import { eventHub } from '@/utils/eventHub'

  export default {
    name: 'PipSnackBar',
    methods: {
      toggle () {
        this.active = !this.active
      },

      startAnimation () {
        let vm = this
        return new Promise((resolve) => {

          vm.toggle()

          let wait = setTimeout(() => {
            clearTimeout(wait);
            resolve('resolved after 4 seconds');
          }, 4000)

        })
      },


      myFunction() {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
      }

    },
    data () {
      return {
        active: false
      }
    },
    created () {
      // console.log('>>> PipSnackBar')

      eventHub.$on('show-pip-snackbar', (payload) => {
        console.log('>>> Event Received show-pip-snackbar payload:', payload)
        let vm = this
        this.startAnimation().then((response) => {
          vm.toggle()
        })
      })

    },
    mounted () {
    },
    beforeDestroy () {
      eventHub.$off('show-pip-snackbar')
    }
  }
</script>

<style scoped>
  /* The snackbar - position it at the bottom and in the middle of the screen */
  #snackbar {
    visibility: hidden; /* Hidden by default. Visible on click */
    background-color: #0085f7; /* Black background color */
    color: #fff; /* White text color */
    border-radius: 2px; /* Rounded borders */
    padding: 10px; /* Padding */
    position: fixed; /* Sit on top of the screen */
    z-index: 2000; /* Add a z-index if needed */
    top: 60px; /* 30px from the bottom */
    margin: auto;
    width: 300px;
    min-height: 60px;
    right: 10px;
    -webkit-box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
    border-radius: 5px;
    line-height: 18px;
    font-size: 14px;
  }
  /* Show the snackbar when clicking on a button (class added with JavaScript) */
  #snackbar.show {
    visibility: visible; /* Show the snackbar */
    /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
  However, delay the fade out process for 2.5 seconds */
    -webkit-animation: fadein 0.5s, fadeout 0.5s 3.5s;
    animation: fadein 0.5s, fadeout 0.5s 3.5s;
  }
  #snackbar strong {
    font-weight: bold;
    color: yellow;
  }
  #snackbar .material-icons {
    vertical-align: middle;
    font-size: 24px;
  }
  /* Animations to fade the snackbar in and out */
  @-webkit-keyframes fadein {
    from {
      top: 0;
      opacity: 0;
    }
    to {
      top: 60px;
      opacity: 1;
    }
  }
  @keyframes fadein {
    from {
      top: 0;
      opacity: 0;
    }
    to {
      top: 60px;
      opacity: 1;
    }
  }
  @-webkit-keyframes fadeout {
    from {
      top: 60px;
      opacity: 1;
    }
    to {
      top: 0;
      opacity: 0;
    }
  }
  @keyframes fadeout {
    from {
      top: 60px;
      opacity: 1;
    }
    to {
      top: 0;
      opacity: 0;
    }
  }
</style>

