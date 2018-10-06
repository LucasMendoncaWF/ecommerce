var sellItems = function () {
    //Variaveis da página
    var formAberto = true;
    var discount = 0;
    var possuiItens = false;
    //Consulta os clientes em lista
    $('body').on("click", function (e) {
        $('.cart-circle').removeClass('cart-open');
        $('.cart-shadow').removeClass('cart-popup');
        $('.cart').hide();
        var product = $('.product');
        product
            .removeClass('clicado')
            .children('.product-fade')
            .removeClass('clicado-fade');
    });
    $('.cart-circle').on('click', function (e) {
        e.stopPropagation();
        var product = $('.product');
        product
            .removeClass('clicado')
            .children('.product-fade')
            .removeClass('clicado-fade');
    });
    //Abre o carrinho da lateral direita
    var cartOpen = function () {
        $('.cart-icon').click(function () {
            mostraEscondeCarrinho();
        });
        $('.cart-faixa-x').click(function () {
            mostraEscondeCarrinho();
        });
    };
    //Mostra ou esconde o carrinho ao clicar no botão com o icone de carrinho ou no X
    var mostraEscondeCarrinho = function () {
        $('.cart').slideToggle();
        $('.cart-circle').toggleClass('cart-open').toggleClass('cart-circle-mobile');
        $('.cart-title').toggleClass('cart-title-mobile');
        $('.cart-icon').toggleClass('cart-icon-mobile');
        $('.cart-faixa').toggleClass('cart-faixa-mobile');
        $('.cart-faixa-x').toggleClass('cart-faixa-x-visible');
        $('.cart-shadow').toggleClass('cart-shadow-mobile');
        $('.cart').toggleClass('cart-mobile');
        if ($('.cart-blink').length > 0) {
            $('.cart-icon').toggleClass('cart-blink');
        }
    };
    //Função de filtro dos produtos
    $('#categoria').change(function (e) {
        //Verifica qual a familia e a caregoria selecionada
        var filtroCategorias = $(e.currentTarget);
        var products = $('.product');
        products.removeClass('clear-float');
        //Verifica os filtros e as propriedades nos produtos
        if (filtroCategorias.val() == 'Todos') {
            products.removeClass('filtrado');
            for (var product = 0; product < products.length; product++) {
                if (product % 6 == 0) {
                    products.eq(product).addClass('clear-float');
                }
            }
        }
        else {
            for (var product = 0; product < products.length; product++) {
                if (products.eq(product).attr('category') == filtroCategorias.val()) {
                    products.eq(product).removeClass('filtrado');
                }
                else {
                    products.eq(product).addClass('filtrado');
                }
            }
            for (var product = 0; product < products.not('.filtrado').length; product++) {
                if (product % 6 == 0) {
                    products.not('.filtrado').eq(product).addClass('clear-float');
                }
            }
        }
    });
    //Consulta os produtos na lista de produtos
    var products = [];
    var htmlProdutos;
    var getProducts = function () {
        var index = 0;
        $.ajax({
            url: "http://lucasmendoncapportfolio.atwebpages.com/json/produtos.json", success: function (produtosEncontrados) {
                var produtos = produtosEncontrados["Produtos"];
                for (var _i = 0, produtos_1 = produtos; _i < produtos_1.length; _i++) {
                    var productData = produtos_1[_i];
                    var imagem = productData.ImageSrc != '' ? productData.ImageSrc : '../images/itemdefault.png';
                    var bgColor = productData.BgColor != '' ? productData.BgColor : '#fff';
                    products.push({ Title: productData.Title, Icone: imagem, Preco: productData.Price, Id: productData.Id, BgColor: bgColor });
                    //Aplica o produto a página
                    htmlProdutos = "<div class='product' category='" + productData.Category + "'>               \n                  <div class='product-image' style=\"background-color:" + bgColor + ";background-image:url('" + imagem + "')\"></div>\n                  <div class='product-data'>\n                   <div class='product-name'>" + productData.Title + "</div>\n                   <div class='product-price'>R$" + numberToReal(productData.Price) + "</div>\n                  </div>\n                  <div class='product-button'><img class='cart-icone-add' src='../images/cart.png'/></div>\n                  <div class='product-fade'>\n                    <div class='popup-qtd'>\n                      <label>Quantidade</label>\n                      <input type='number' min='1' class='qtd-produtosQtd-product' value='0'/>\n                      <div class='error-add'>Por favor, digite um n\u00FAmero maior que 0</div>\n                      <button class='add-to-cart' type='button' product-index='" + index + "'>Adicionar ao Carrinho</button>\n                    </div>\n                    <div class='product-fade-circle'></div>\n                  </div>\n                </div>";
                    index++;
                    $('.produtos-carregados').append(htmlProdutos);
                    if (index == produtosEncontrados.length) {
                        addToCart();
                    }
                }
                $('#produtos').show();
            }
        });
    };
    //Adiciona o produto ao carrinho     
    var addToCart = function () {
        //Exibe a popup de quantidade de produtosQtd no produto
        $('.product').click(function (e) {
            e.stopPropagation();
            $('.cart-circle').removeClass('cart-open');
            $('.cart').hide();
            var elm = $(e.currentTarget);
            var product = $('.product');
            product
                .removeClass('clicado')
                .children('.product-fade')
                .removeClass('clicado-fade');
            elm
                .addClass('clicado')
                .children('.product-fade')
                .addClass('clicado-fade');
            e.stopPropagation();
        });
        //Adiciona o produto ao carrinho
        $('.add-to-cart').click(function (e) {
            $('.cart-shadow').removeClass('cart-popup');
            var produtoPopup = $(e.currentTarget).parent('.popup-qtd');
            var fade = produtoPopup.parent('.product-fade');
            var produto = fade.parent('.product');
            var qtd = +produtoPopup.children('.qtd-produtosQtd-product').val();
            produtoPopup.children('.qtd-produtosQtd-product').val(0);
            if (qtd < 1) {
                produtoPopup.children('.error-add').addClass('error');
            }
            else {
                if ($('.cart-item').length == 0) {
                    $('.cart-circle ').toggle();
                }
                produtoPopup.children('.error-add').removeClass('error');
                produto.removeClass('clicado');
                fade.removeClass('clicado-fade');
                var productIndex = $(e.currentTarget).attr('product-index');
                $("#cart-item-" + products[productIndex].Id).detach();
                //Aplica o produto na div de produtos do carrinho
                var htmlCart = "<div class='cart-item' product-index='" + productIndex + "' product-id='" + products[productIndex].Id + "' id='cart-item-" + products[productIndex].Id + "'>\n              <div class=\"remove-item remove-" + products[productIndex].Id + "\" title='Remover do carrinho'>\n                <span class=\"x-button\">X</span>\n              </div>\n              <div class='cart-item-image' style=\"background-color:" + products[productIndex].BgColor + ";background-image:url('" + products[productIndex].Icone + "')\"></div>\n              <div class='product-name' title=\"" + products[productIndex].Title + "\">" + products[productIndex].Title + "</div>\n              <div class='product-price' >R$" + numberToReal(qtd * products[productIndex].Preco) + "</div>\n              <div class='qtd-div'>\n                <label>Quantidade</label>\n                <input type='number' min='1' class='qtd-produtosQtd' value='" + qtd + "' default-price='" + products[productIndex].Preco + "'/>  \n              </div>\n              <div class=\"clear-float\"></div>\n              <hr class='product-line'/>\n          </div>";
                $('#cart-items').append(htmlCart);
                e.stopPropagation();
                $('.cart-buttons').prop('disabled', false);
                $('.cart-buttons').removeClass('botao-desabilitado');
                if ($('.cart-open').length == 0) {
                    $('.cart-icon').addClass('cart-blink');
                }
                $(".remove-" + products[productIndex].Id).click(function (e) {
                    var elemPai = $(e.currentTarget).parent();
                    var valorARemover = realToFloat(elemPai.children('.product-price').text().split('R$')[1]);
                    var valorTotalCarrinho = realToFloat($('#cart-total').text().split('Total: R$')[1]);
                    var valorFinal = "Total: R$" + numberToReal(valorTotalCarrinho - valorARemover);
                    $('#cart-total').text(valorFinal);
                    if ($('.cart-item').length == 1) {
                        $('.cart-circle ').toggle();
                    }
                    elemPai.detach();
                });
                var valorTotal = 0;
                var cartItem = $('.cart-item');
                for (var item = 0; item < cartItem.length; item++) {
                    valorTotal += realToFloat(cartItem.eq(item).children('.product-price').text().split('R$')[1]);
                }
                $('#cart-total').text('Total: R$' + numberToReal(valorTotal));
                carrinhoPrices();
                if (cartItem.length > 1) {
                    cartItem.children('label').addClass('label-items');
                }
                else {
                    cartItem.children('label').removeClass('label-items');
                }
            }
        });
    };
    //transforma real em float
    var realToFloat = function (real) {
        return +real.replace(/\./g, '').replace(/\,/g, '.');
    };
    //transforma numero para moeda BR
    var numberToReal = function (numero) {
        numero = numero.toFixed(2).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    };
    //Altera o valor de acordo com o número de produtosQtd no input do produto no carrinho
    var carrinhoPrices = function () {
        $('.qtd-produtosQtd').change(function (e) {
            var produtosQtd = $('.qtd-produtosQtd');
            var produtoItemAtual = +$(e.currentTarget).val();
            var price = numberToReal((parseFloat($(e.currentTarget).attr('default-price')) * produtoItemAtual));
            $(e.currentTarget).parent('.qtd-div').parent('.cart-item').children('.product-price').text('R$' + price);
            var cartItem = $('.cart-item');
            var valorTotal = 0;
            for (var item = 0; item < cartItem.length; item++) {
                //Realiza a conta do valor total de acordo com o preço de cada item
                valorTotal += +realToFloat(cartItem.eq(item).children('.product-price').text().split('R$')[1]);
            }
            $('#cart-total').text('Total: R$' + numberToReal(valorTotal));
        });
    };
    //Botoões do carrinho
    $('.cart-buttons').prop('disabled', true);
    $('#cart-finish').click(function (e) {
        $('#popup-sucsess').show();
        $('.cart-item').detach();
        mostraEscondeCarrinho();
        setTimeout(function () { $('.loading').hide(); $('.popup-sucsess-ok, .popup-sucsess-message').show(); }, 3000);
    });
    $('#cart-empty').click(function (e) {
        $('.cart-item').detach();
        mostraEscondeCarrinho();
        $('.cart-circle').hide();
    });
    $('.popup-sucsess-ok').click(function (e) {
        e.preventDefault();
        location.reload();
    });
    //Realiza as funções iniciais
    cartOpen();
    getProducts();
};
sellItems();
