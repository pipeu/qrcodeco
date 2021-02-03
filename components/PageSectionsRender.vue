<template>
    <div>
        <template v-if="this.currentPage">

            <div v-for="section in this.currentPage.pageSections">

                <div v-if="10 === section.sectionTypeId">
                    <component :is="productssection" :id="section.id" :productsSection="section"/>
                </div>
                <div v-if="12 === section.sectionTypeId">
                    <component :is="spotlightsection" :id="section.id" :spotlightSections="section"/>
                </div>
                <div v-if="13 === section.sectionTypeId">
                    <component :is="customHtmlSection" :id="section.id" :customHtmlSection="section"/>
                </div>
                <div v-if="15 === section.sectionTypeId">
                    <component :is="eventsection" :id="section.id" :event="section.event"/>
                </div>
                <div v-if="16 === section.sectionTypeId">
                    <component :is="categoriesSpotlight" :id="section.id" :sectionValue="section"/>
                </div>
                <div v-if="17 === section.sectionTypeId">
                    <component :is="productDetail" :item="JSON.parse(section.sectionValue)"/>
                </div>

                <!-- TODO: Section Search disabled until backend deliver Search Rest service -->
                <div v-if="18 === section.sectionTypeId">
                    <component :is="search" :sectionValue="section.sectionValue"/>
                </div>

                <div v-if="19 === section.sectionTypeId">
                    <component :is="allEventsSection" :sectionValue="section.compositionValue"/>
                </div>

                <div v-if="20 === section.sectionTypeId">
                    <component :is="allSubscriptionsPlansSection" :sectionValue="section.compositionValue"/>
                </div>

                <div v-if="21 === section.sectionTypeId">
                    <!-- 25/08/18 - Render CallToAction component -->
                    <component :is="callToActionComponentRender" :pageSection="section"/>
                </div>

                <div v-if="22 === section.sectionTypeId">
                  <component :is="sliderCarouselComponentRender" :pageSection="section"/>
                </div>

                <div v-if="23 === section.sectionTypeId">
                  <component :is="allStoresSection" :sectionValue="section.compositionValue"/>
                </div>

                <div v-if="24 === section.sectionTypeId">
                    <component :is="gallerySection" :section="section"/>
                </div>

            </div>

        </template>
    </div>
</template>

<script>
    /* eslint-disable indent */

    import {mapMutations, mapGetters} from 'vuex'

    export default {
        name: 'PageSectionsRender',

        props: {
            currentPage: {
                type: Object,
                default: function () {
                    return { }
                }
            },

            id: Number
        },
        data: function () {
            return {
                someData: {}
            }
        },
        async created () {
            // console.log('### PageSectionsRender created')
            // console.log('### PageSectionsRender currentPage:', this.currentPage)
            // console.log('### PageSectionsRender currentPage:', this.currentPage.sections)

            this.spotlightsection = () => import(`~/components/SectionSpotlight.vue`)
            this.productssection = () => import(`~/components/ProductsSection.vue`)
            this.eventsection = () => import(`~/components/EventSection.vue`)
            this.customHtmlSection = () => import(`~/components/CustomHtmlSection.vue`)
            this.categoriesSpotlight = () => import(`~/components/CategoriesSpotlight.vue`)
            this.productDetail = () => import(`~/components/ProductDetail.vue`)
            this.search = () => import(`~/components/Search.vue`)
            this.allEventsSection = () => import(`~/components/AllEventsSection.vue`)
            this.allSubscriptionsPlansSection = () => import(`~/components/AllSubscriptionsPlansSection.vue`)
            this.callToActionComponentRender = () => import(`~/components/render/CallToActionComponentRender.vue`)
            this.sliderCarouselComponentRender = () => import(`~/components/SliderCarouselSection.vue`)
            this.allStoresSection = () => import(`~/components/AllStoresSection.vue`)
            this.gallerySection = () => import(`~/components/GallerySection.vue`)
        },

        async mounted () {
            if (process.client) {
                // console.log('PageSectionsRender => sections', this.currentPage.sections)
            }
        },

        methods: {
            ...mapMutations([
                'increment'
            ]),
            ...mapGetters([
                'getStore', 'getUserAccount', 'getDomain'
            ])
        }
    }
</script>
