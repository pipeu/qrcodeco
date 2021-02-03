<template>
    <div>
        <div class="row card">

            <div class="col s12 m6 l4">
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/people/Br+Cozinha-122.jpg" class="materialbox responsive-img card">
            </div>

            <div class="col s12 m6 l4">
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/people/Br+Cozinha-131.jpg" class="materialbox responsive-img card">
            </div>

            <div class="col s12 m6 l4">
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/people/Br+Cozinha-132.jpg" class="materialbox responsive-img card">
            </div>

            <div class="col s12 m6 l4">
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/people/Br+Cozinha-141.jpg" class="materialbox responsive-img card">
            </div>

            <div class="col s12 m6 l4">
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/people/Br+Cozinha-142.jpg" class="materialbox responsive-img card">
            </div>


            <div class="col s12 m6 l4">
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/people/Br+Cozinha-151.jpg" class="materialbox responsive-img card">
            </div>

            <div class="col s12 m6 l4">
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/people/Br+Cozinha-161.jpg" class="materialbox responsive-img card">
            </div>

            <div class="col s12 m6 l4">
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/people/Br+Cozinha-162.jpg" class="materialbox responsive-img card">
            </div>

            <div class="col s12 m6 l4">
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/people/Br+Cozinha-163.jpg" class="materialbox responsive-img card">
            </div>

            <div class="col s12 m6 l4">
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/people/Br+Cozinha-171.jpg" class="materialbox responsive-img card">
            </div>

            <div class="col s12 m6 l4">
                <img src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/people/Br+Cozinha-173.jpg" class="materialbox responsive-img card">
            </div>

        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        name: 'GallerySection',
        props: {
            section: {
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
        }
    }
</script>

<style scoped>

</style>
