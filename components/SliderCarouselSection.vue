<template>

  <div class="slider">
    <ul class="slides">
      <li> <img src="https://pipeu-us.s3.amazonaws.com/clients/legastronomia/site/images/hero-home.png"> <!-- random image -->
        <div class="caption center-align">
          <h1>Ateliê de doces</h1>
          <h5 style="margin-top: 45px; line-height: 1.0;">Cupcakes, bolos de aniversário, bolos de chocolate e brownies - escolha algo para qualquer ocasião.</h5>
        </div>
      </li>
      <li> <img src="https://pipeu-us.s3.amazonaws.com/clients/legastronomia/site/images/hero-about.png"> <!-- random image -->
        <div class="caption center-align">
          <h1>Ateliê de doces</h1>
          <h5 style="margin-top: 45px; line-height: 1.0;">Cupcakes, bolos de aniversário, bolos de chocolate e brownies - escolha algo para qualquer ocasião.</h5>
        </div>
      </li>
      <li> <img src="https://pipeu-us.s3.amazonaws.com/clients/legastronomia/site/images/hero-home-mel.png"> <!-- random image -->
        <div class="caption center-align">
          <h1>Ateliê de doces</h1>
          <h5 style="margin-top: 45px; line-height: 1.0;">Cupcakes, bolos de aniversário, bolos de chocolate e brownies - escolha algo para qualquer ocasião.</h5>
        </div>
      </li>
    </ul>
  </div>

</template>
<script>
    /* eslint-disable indent */
    import {mapState} from 'vuex'

    export default {
        name: 'SliderCarouselSection',
        props: {
            sectionValue: {
                type: Object,
                default: function () {
                    return { }
                }
            },
            id: Number
        },

        computed: {
            ...mapState({
                counter: state => state.counter,
                store: state => state.store,
                userAccount: state => state.userAccount,
                userLogged: state => state.userLogged
            })
        },

        methods: {
        },

        mounted () {
            var slider = document.querySelectorAll('.slider')
            M.Slider.init(slider, {
                full_width: true,
                height : 350, // default - height : 400
                interval: 8000 // default - interval: 6000
            })
        },

        created: function () {
            console.log('###### created SliderCarouselSection', this.id)
        }

    }
</script>

