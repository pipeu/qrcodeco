<template>
    <div :id="'SECTION_SPOTLIGHT_'+ spotlightSections.id" class="spotlight" :style="spotlightSections.style">
        <div :class="!this.spotlightSections.backgroundImageShadow?'container':'image-shadow'">
        <div class="row">
            <div :class="'spotlight-' + spotlightSections.size" style="text-align: center;">
                <div :class="'spotlight-' + spotlightSections.size + '-title'" :id="'PANEL_SPOTLIGHT_TITLE_' + spotlightSections.id"        v-html="spotlightSections.title" ></div>
                <div :class="'spotlight-' + spotlightSections.size + '-subTitle'" :id="'PANEL_SPOTLIGHT_SUBTITLE_' + spotlightSections.id" v-html="spotlightSections.subTitle"></div>

<!--                <a v-if="spotlightSections.jsonValue && spotlightSections.jsonValue.cta" class="waves-effect waves-light btn-large" :href="spotlightSections.jsonValue.cta.href"-->
<!--                   :style="spotlightSections.jsonValue.cta.style">{{spotlightSections.jsonValue.cta.text}}-->
<!--                </a>-->
                <template v-if="spotlightSections.jsonValue && spotlightSections.jsonValue.cta">
                    <nuxt-link :to="spotlightSections.jsonValue.cta.href" class="waves-effect waves-light btn-large" :style="spotlightSections.jsonValue.cta.style">
                        {{spotlightSections.jsonValue.cta.text}}
                    </nuxt-link>
                </template>

                <template v-if="spotlightSections.spotLightType == 3"><!-- SpotLightImage-->
                    <span v-for="spotImage in spotlightSections.jsonValue.SpotLightImages" style="padding: 0 20px;">
                        <a v-bind:href="spotImage.image.href">
                            <img :src="store.url + spotImage.image.image" alt="" >
                        </a>
                    </span>
                </template>
                <template v-if="spotlightSections.spotLightType == 4"><!-- CTA Product-->
                    <a v-bind:href="store.url + '/checkout?ID=' + spotlightSections.jsonValue.productId"
                       class="btn btn-primary btn-lg" style="color: #fff; margin-top: 20px;">
                        <i class="fa fa-shopping-cart"></i> Comprar
                    </a>
                </template>
            </div>
        </div>
      </div>
    </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    name: 'SectionSpotlight',
    props: {
      spotlightSections: {
        type: Object,
        default: function () {
          return { }
        }
      },
      id: Number,
      customdata: String
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
      getImageShadow: function () {
        var shadowValule = this.spotlightSections.backgroundImageShadow
        if (shadowValule) {
          return 'image-shadow'
        } else {
          return ''
        }
      }
    }
}
</script>

<style scoped>
  .spotlight {
      margin-bottom: 30px;
      /*width: 100%;*/
  }
  #tint {
  }
  .image-shadow {
    background-color: #000000;
    background: rgba(52, 47, 54, 0.7);
    z-index: 0;
  }
  .spotlight-large {
    /*color: #fff;*/
    padding: 100px 0;
  }
  .spotlight-large-title {
    font-size: 60px;
    font-weight: bold;
    font-weight: 700;
    margin-bottom: 50px;
    line-height: 1.0;
  }

  .spotlight-large-subTitle {
    font-size: 23px;
    margin-bottom: 70px;
    line-height: 1.1;
  }
  .spotlight-medium {
    /*color:#ffffff;*/
    padding: 100px 0;
  }
  .spotlight-medium-title {
      font-size:42px;
      font-weight: bold;
      padding:20px 0 10px;
  }
  .spotlight-medium-subTitle {
      font-size:20px;
      padding-bottom:20px;
  }
  .spotlight-small {
    /*color:#ffffff;*/
    padding: 50px 0;
  }
  .spotlight-small-title {
    font-size:32px;
    font-weight: bold;
    padding:20px 0 10px;
    line-height: 33px;
  }
  .spotlight-small-subTitle {
    font-size:24px;
    padding-bottom:20px;
  }
</style>
