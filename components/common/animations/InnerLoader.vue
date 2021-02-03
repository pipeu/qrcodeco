<template>
    <div class="pip_loader_overlay" v-if="active">
        <div class="pip_loading"></div>
    </div>
</template>

<script>
    /* eslint-disable */
    import { eventHub } from '../../../utils/eventHub'
    export default {
        name: 'InnerLoader',
        data () {
            return {
                active: false
            }
        },
        created () {
            eventHub.$on('show-innerloader', () => {
                this.active = true
            })
            eventHub.$on('hide-innerloader', () => {
                this.active = false
            })
        },
        beforeDestroy () {
            eventHub.$off('show-innerloader')
            eventHub.$off('hide-innerloader')
        }
    }
</script>
<style scoped>
    .loading-page {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        text-align: center;
        padding-top: 200px;
        font-size: 30px;
        font-family: sans-serif;
    }
    /* Loader */
    .pip_loading {
        width:100px;
        height:100px;
        border:2px solid #9c27b0;
        border-top-color:#f50;
        border-radius:100%;
        /* here we center it*/
        position:fixed;
        top:0;
        right:0;
        left:0;
        bottom:0;
        margin:auto;
        /* Tha animation*/
        animation: round 1s linear infinite;
        z-index:9999;
    }
    @keyframes round {
        from{transform: rotate(0deg)}
        to{transform: rotate(360deg)}
    }
    .pip_loader_overlay {
        height:100%;
        width:100%;
        background:#f5f5f5;
        opacity:1;
        left:0;
        top:0;
        z-index:9999;
    }
</style>
