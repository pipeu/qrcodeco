<template>

    <div class="search-home">
        <div class="input-group input-group-lg ">
            <div class="input-group-prepend">
                <button class="btn btn-outline-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Todos</button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="#">Action</a>
                    <a class="dropdown-item" href="#">Another action</a>
                    <a class="dropdown-item" href="#">Something else here</a>
                    <div role="separator" class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#">Separated link</a>
                </div>
            </div>
            <input type="text" class="form-control" aria-label="Text input with dropdown button" placeholder="Buscar serviços...">
            <div class="input-group-append">
                <span class="input-group-text" id="inputGroup-sizing-lg"><i class="fa fa-search"></i></span>
            </div>
        </div>
    </div>

</template>

<script>
    /* eslint-disable indent */
    import {mapState} from 'vuex'

    export default {
        name: 'Search',
        props: {
            sectionValue: String
        },
        async mounted () {
        },
        computed: {
            ...mapState({
                store: state => state.store,
                userAccount: state => state.userAccount
            })
        }
    }
</script>

