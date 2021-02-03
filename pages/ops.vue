<template>

    <div class="container">
        <!--<div class="row" style="margin-top: 20px">-->
            <!--<div class="col s12 l12 ">-->
              <!--<img src="https://s3.amazonaws.com/pipeu-us/images/dog-triste-branco.svg" alt="" width="100px" class="logo">-->
            <!--</div>-->
        <!--</div>-->
        <div class="row ops-content">
            <div class="col s12 l6 ops">
                <h1 style="margin-bottom: 25px; margin-left: 50px;">Ops !</h1>
                <h4 v-if="error" class="info" style="margin-top: 100px; line-height: 40px;">{{ error.message }}</h4>
                <p v-if="$route.query.message" class="info" style="margin-top: 100px; line-height: 40px;">{{ decodeURIComponent($route.query.message) }}</p>
            </div>
            <div class="col s12 l6 dog-head text-center">
              <img src="https://s3.amazonaws.com/pipeu-us/images/dog-triste-branco.svg" alt="">
            </div>
        </div>
    </div>

</template>
<script>
    /* eslint-disable indent */
    export default {
        name: 'Ops',
        props: ['error'],
        created () {
            console.log('###### Ops.vue: ')
            if (this.error) {
                console.log('###### message ', this.error.message)
                console.log('###### statusCode ', this.error.statusCode)
                if (this.error.errors) {
                    console.log('###### statusCode.keys ', Object.keys(this.error.errors))
                    console.log('###### statusCode.message ', this.error.errors.message)
                }
            }
        }
    }
</script>

<style scoped>
    .title
    {
        margin-top: 15px;
        font-size: 5em;
        padding: 50px;
    }
    .info
    {
        font-weight: 300;
        color: #9aabb1;
        margin: 0;
        padding: 50px;
    }

    body {
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        font-weight: 300;
        color: #333;
        background-color: #edf0f4;
    }
    .ops h1 {
        font-size: 140px;
    }
    .ops h4 {
        font-size: 30px;
    }
    .ops p {
        font-size: 18px;
    }
    .ops-content {
        padding: 150px 0;
    }
    .dog-head img {
        width: 250px;
        margin: auto;
        text-align: center;
    }

    @media only screen and (max-width: 600px) {
        .ops-content {
            padding: 30px 0;
            text-align: center;
        }
        .ops h1 {
            font-size: 70px;
        }
        .ops h4 {
            font-size: 24px;
        }
        .dog-head img {
            width: 200px;
            margin: auto;
            text-align: center;
        }
        .logo {
            width: 100px;
            margin: auto;
            text-align: center;
        }
    }
</style>
