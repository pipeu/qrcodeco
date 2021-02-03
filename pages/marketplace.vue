<template>
    <div>

        <!-- Navbar-->
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation"> <i class="fa fa-bars"></i> </button>
            <a class="navbar-brand" href="pipeu-home.html"><img src="images/logo-pipeu-b.png" alt=""></a>

            <a class="navbar-brand" href="#"><i class="fa fa-search"></i></a>

            <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
                <ul class="navbar-nav ml-auto mr-auto mt-2 mt-lg-0">
                    <li class="nav-item active"> <a class="nav-link align-middle" href="#">Home <span class="sr-only">(current)</span></a> </li>
                    <li class="nav-item"> <a class="nav-link" href="#">Novidades</a> </li>
                    <li class="nav-item"> <a class="nav-link" href="#">Ofertas</a> </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Categorias
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <a class="dropdown-item" href="#">Action</a>
                            <a class="dropdown-item" href="#">Another action</a>
                            <a class="dropdown-item" href="#">Something else here</a>
                            <a class="dropdown-item" href="#">Action</a>
                            <a class="dropdown-item" href="#">Another action</a>
                            <a class="dropdown-item" href="#">Something else here</a>
                            <a class="dropdown-item" href="#">Action</a>
                            <a class="dropdown-item" href="#">Another action</a>
                            <a class="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li>
                </ul>

                <a href="pipeu-conta2.html" class="btn  btn-outline-light">Anúncie</a>
                <!--    <form class="form-inline my-2 my-lg-0">
                      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>-->
            </div>

        </nav>

        <div class="container-fluid mt-5">
            <div id="carouselExampleIndicators" class="carousel slide mb-4" data-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div class="carousel-inner">
                    <div class="carousel-item active"> <img class="d-block w-100" src="https://placeimg.com/1200/400/nature/grayscale" alt="First slide"> </div>
                    <div class="carousel-item"> <img class="d-block w-100" src="https://placeimg.com/1200/400/people/grayscale" alt="Second slide"> </div>
                    <div class="carousel-item"> <img class="d-block w-100" src="https://placeimg.com/1200/400/arch/grayscale" alt="Third slide"> </div>
                </div>
                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev"> <span class="carousel-control-prev-icon" aria-hidden="true"></span> <span class="sr-only">Previous</span> </a> <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next"> <span class="carousel-control-next-icon" aria-hidden="true"></span> <span class="sr-only">Next</span> </a> </div>
        </div>
        <div class="container-fluid cfd">
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

            <div class="row mb-4 hide-big">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body"> <a href="pipeu-conta.html" class="btn btn-primary btn-block btn-lg">Anúncie</a></div>
                    </div>
                </div>
            </div>
            <div class="section-title">
                <h1>Novidades  <a href=""><span>Ver mais</span></a></h1>
            </div>
            <div class="row mb-5">
                <div class="col">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/people" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/arch" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col hide">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/tech" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col hide">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/nature" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col hide">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/animals" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            <div class="section-title">
                <h1>Melhores serviços <a href=""><span>Ver mais</span></a></h1>
            </div>
            <div class="row mb-5 ">
                <div class="col">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/tech/sepia" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/nature/sepia" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col hide">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/any/sepia" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col hide">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/people/sepia" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col hide">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/arch/sepia" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="section-title">
                <h1>Ofertas <a href=""><span>Ver mais</span></a></h1>
            </div>
            <div class="row mb-5">
                <div class="col">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/tech/grayscale" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/nature/grayscale" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col hide">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/any/grayscale" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col hide">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/people/grayscale" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col hide">
                    <div class="card pipeu-price"> <a href=""> <img src="https://placeimg.com/600/450/arch/grayscale" alt="" class="img-fluid"></a>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-price">
                                        <p>Lorem Ipsum é simplesmente uma </p>
                                        <h6><a href="#">Tenetur</a></h6>
                                        <h5><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i> <span><a href="">(123)</a></span></h5>
                                        <h3>R$ 289 <a href=""><span><i class="fa fa-heart"></i></span></a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <h4>Categorias <a href=""><span><i class="fa fa-chevron-right"></i></span></a></h4>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="pipeu-cat"> <i class="fa fa-bookmark"></i> </div>
                                </div>
                                <div class="col">
                                    <div class="pipeu-cat"> <i class="fa fa-bell"></i> </div>
                                </div>
                                <div class="col">
                                    <div class="pipeu-cat"> <i class="fa fa-gem"></i> </div>
                                </div>
                                <div class="col">
                                    <div class="pipeu-cat"> <i class="fa fa-hdd"></i> </div>
                                </div>
                                <div class="col">
                                    <div class="pipeu-cat"> <i class="fa fa-lemon"></i> </div>
                                </div>
                                <div class="col">
                                    <div class="pipeu-cat"> <i class="fa fa-lightbulb"></i> </div>
                                </div>
                                <div class="col">
                                    <div class="pipeu-cat"> <i class="fa fa-smile"></i> </div>
                                </div>
                                <div class="col">
                                    <div class="pipeu-cat"> <i class="fa fa-star"></i> </div>
                                </div>
                                <div class="col">
                                    <div class="pipeu-cat"> <i class="fa fa-plus"></i> </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    /* eslint-disable indent,spaced-comment */

    export default {
        name: 'Marketplace'
    }
</script>
