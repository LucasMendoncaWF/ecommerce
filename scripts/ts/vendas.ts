
interface Client {
  Title: string,
  ClientCode: string,
  Id: number
}

interface Category {
  Title: string
}

interface Family {
  Title: string
}

interface Store {
  Title: string,
  Seller: string,
  Client: Client,
  CNPJ: string,
  Adress: string,
  City: string,
  UF: string,
  PostalCode: string,
  District: string,
  IE: string,
  Id: number,
  Discount: number
}

interface Produto {
  IconeSrc: string,
  Description: string,
  Title: string,
  Price: number,
  Id: number,
  Category: Category
  Family: Family
}

let sellItems = () => {
  //Variaveis da página
  let formAberto = true;
  let discount = 0;
  let possuiItens = false;
  //Consulta os clientes em lista

  $('body').on("click", (e) => {
    $('.cart-circle').removeClass('cart-open');
    $('.cart-shadow').removeClass('cart-popup');
    $('.cart').hide();
    let product = $('.product');
    product
      .removeClass('clicado')
      .children('.product-fade')
      .removeClass('clicado-fade');
  });
  $('.cart-circle').on('click', (e) => {
    e.stopPropagation();
    let product = $('.product');
    product
      .removeClass('clicado')
      .children('.product-fade')
      .removeClass('clicado-fade');
  });
  //Botão de ok para fechar popup de mensagem de sucesso
  $('.popup-sucsess-ok').on("click", (e) => {
    e.preventDefault();
    $('#popup-sucsess').hide();
    location.reload();
  });

  //Abre o carrinho da lateral direita
  let cartOpen = () => {
    $('.cart-icon').click(() => {
      mostraEscondeCarrinho();
    });

    $('.cart-faixa-x').click(() => {
      mostraEscondeCarrinho();
    });
  }
  //Mostra ou esconde o carrinho ao clicar no botão com o icone de carrinho ou no X
  let mostraEscondeCarrinho = () => {
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
  }

  //Função de filtro dos produtos
  let filter = () => {
    //Verifica qual a familia e a caregoria selecionada
    let filtroFamilia = $('#familia');
    let filtroCategorias = $('#categoria');
    let products = $('.product');
    products.removeClass('clear-float');
    //Verifica os filtros e as propriedades nos produtos
    if (filtroFamilia.val() == 'Todos' && filtroCategorias.val() == 'Todos') {
      products.removeClass('filtrado');
      for (let product = 0; product < products.length; product++) {
        if (product % 6 == 0) {
          products.eq(product).addClass('clear-float');
        }
      }
    }
    else {
      if (filtroCategorias.val() == 'Todos') {
        for (let product = 0; product < products.length; product++) {
          if (products.eq(product).attr('family') == filtroFamilia.val()) {
            products.eq(product).removeClass('filtrado');
          } else {
            products.eq(product).addClass('filtrado');
          }
        }
      }
      if (filtroFamilia.val() == 'Todos') {
        for (let product = 0; product < products.length; product++) {
          if (products.eq(product).attr('category') == filtroCategorias.val()) {
            products.eq(product).removeClass('filtrado');
          } else {
            products.eq(product).addClass('filtrado');
          }
        }
      }
      if (filtroFamilia.val() != 'Todos' && filtroCategorias.val() != 'Todos') {
        for (let product = 0; product < products.length; product++) {
          if (products.eq(product).attr('category') == filtroCategorias.val() && products.eq(product).attr('family') == filtroFamilia.val()) {
            products.eq(product).removeClass('filtrado');
          } else {
            products.eq(product).addClass('filtrado');
          }
        }
      }
      for (let product = 0; product < products.not('.filtrado').length; product++) {
        if (product % 6 == 0) {
          products.not('.filtrado').eq(product).addClass('clear-float');
        }
      }
    }
  }

  //Consulta os produtos na lista de produtos
  let products = [];
  let htmlProdutos;
  let getProducts = () => {
    let index = 0;
    $.ajax({
      url: "http://localhost:3000/Produtos", success: function (produtosEncontrados) {
        for (let productData of produtosEncontrados) {
          let imagem = productData.ImageSrc != undefined ? productData.ImageSrc : '../images/itemdefault.png';
          products.push({ Title: productData.Title, Icone: imagem });
          //Aplica o produto a página
          htmlProdutos = `<div class='product'>               
                  <div class='product-image' style="background-image:url('${imagem}')"></div>
                  <div class='product-data'>
                   <div class='product-name'>${productData.Title}</div>
                   <div class='product-price'>R$${numberToReal(productData.Price)}</div>
                  </div>
                  <div class='product-button'><img class='cart-icone-add' src='../images/cart.png'/></div>
                  <div class='product-fade'>
                    <div class='popup-qtd'>
                      <label>Quantidade</label>
                      <input type='number' min='1' class='qtd-caixas-product' value='0'/>
                      <div class='error-add'>Por favor, digite um número maior que 0</div>
                      <button class='add-to-cart' type='button' product-index='${index}'>Adicionar ao Carrinho</button>
                    </div>
                    <div class='product-fade-circle'></div>
                  </div>
                </div>`;
          index++;
          $('.produtos-carregados').append(htmlProdutos);
          if (index == produtosEncontrados.length) {
            addToCart();
          }
        }
        $('#produtos').show();
      }
    });
  }

  //Adiciona o produto ao carrinho     
  let addToCart = () => {
    //Exibe a popup de quantidade de caixas no produto
    $('.product').click((e) => {
      e.stopPropagation();
      $('.cart-circle').removeClass('cart-open');
      $('.cart').hide();
      const elm = $(e.currentTarget);
      let product = $('.product');
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
    $('.add-to-cart').click((e) => {
      $('.cart-shadow').removeClass('cart-popup');
      let produtoPopup = $(e.currentTarget).parent('.popup-qtd');
      let fade = produtoPopup.parent('.product-fade');
      let produto = fade.parent('.product');
      let qtd: number = + produtoPopup.children('.qtd-caixas-product').val();
      produtoPopup.children('.qtd-caixas-product').val(0);
      if (qtd < 1) {
        produtoPopup.children('.error-add').addClass('error');
      } else {
        if ($('.cart-item').length == 0) {
          $('.cart-circle ').toggle();
        }
        produtoPopup.children('.error-add').removeClass('error');
        produto.removeClass('clicado');
        fade.removeClass('clicado-fade');
        let productIndex = $(e.currentTarget).attr('product-index');
        $(`#cart-item-${products[productIndex].Id}`).detach();
        //Aplica o produto na div de produtos do carrinho
        let htmlCart = `<div class='cart-item' product-index='${productIndex}' SKU='${products[productIndex].SKU}' product-id='${products[productIndex].Id}' id='cart-item-${products[productIndex].Id}'>
              <div class="remove-item remove-${products[productIndex].Id}" title='Remover do carrinho'>
                <span class="x-button">X</span>
              </div>
              <div class='cart-item-image' style="background-image:url('${products[productIndex].Icone}')"></div>
              <div class='product-name' title="${products[productIndex].Title}">${products[productIndex].Title}</div>
              <div class='product-price' >R$${numberToReal(qtd * products[productIndex].Preco)}</div>
              <div class='qtd-div'>
                <label>Quantidade</label>
                <input type='number' min='1' class='qtd-caixas' value='${qtd}' default-price='${products[productIndex].Preco}'/>  
              </div>
              <div class="clear-float"></div>
              <hr class='product-line'/>
          </div>`;
        $('#cart-items').append(htmlCart);
        e.stopPropagation();
        $('.cart-buttons').prop('disabled', false);
        $('.cart-buttons').removeClass('botao-desabilitado');
        if ($('.cart-open').length == 0) {
          $('.cart-icon').addClass('cart-blink');
        }
        $(`.remove-${products[productIndex].Id}`).click((e) => {
          let elemPai = $(e.currentTarget).parent();
          let valorARemover = realToFloat(elemPai.children('.product-price').text().split('R$')[1]);
          let valorTotalCarrinho = realToFloat($('#cart-total').text().split('Total: R$')[1]);
          let valorFinal = "Total: R$" + numberToReal(valorTotalCarrinho - valorARemover);
          $('#cart-total').text(valorFinal);
          if ($('.cart-item').length == 1) { $('.cart-circle ').toggle(); }
          elemPai.detach();
        });
        if (!possuiItens) {
          carrinhoButtons();
          possuiItens = true;
        }

        let totalCaixas = 0;
        let caixas = $('.qtd-caixas');
        for (let caixa = 0; caixa < caixas.length; caixa++) {
          totalCaixas += + caixas.eq(caixa).val();
        }

        let valorTotal = 0;
        let cartItem = $('.cart-item');
        for (let item = 0; item < cartItem.length; item++) {
          valorTotal += realToFloat(cartItem.eq(item).children('.product-price').text().split('R$')[1]);
        }
        $('#cart-total').text('Total: R$' + numberToReal(valorTotal));
        carrinhoPrices();
        if (cartItem.length > 1) {
          cartItem.children('label').addClass('label-items');
        } else {
          cartItem.children('label').removeClass('label-items');
        }
      }
    });
  }
  //transforma real em float
  let realToFloat = (real) => {
    return + real.replace(/\./g, '').replace(/\,/g, '.')
  }
  //transforma numero para moeda BR
  let numberToReal = (numero) => {
    numero = numero.toFixed(2).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
  }

  //Altera o valor de acordo com o número de caixas no input do produto no carrinho
  let carrinhoPrices = () => {
    $('.qtd-caixas').change((e) => {
      let caixas = $('.qtd-caixas');
      let caixaItemAtual: number = + $(e.currentTarget).val();
      let price = numberToReal((parseFloat($(e.currentTarget).attr('default-price')) * caixaItemAtual));
      $(e.currentTarget).parent('.qtd-div').parent('.cart-item').children('.product-price').text('R$' + price);
      let cartItem = $('.cart-item');
      let valorTotal = 0;
      for (let item = 0; item < cartItem.length; item++) {
        //Realiza a conta do valor total de acordo com o preço de cada item
        valorTotal += + realToFloat(cartItem.eq(item).children('.product-price').text().split('R$')[1]);
      }
      $('#cart-total').text('Total: R$' + numberToReal(valorTotal));
    });
  }
  //Botoões do carrinho
  $('.cart-buttons').prop('disabled', true);
  let carrinhoButtons = () => {
    console.log('Pedido Enviado');
  }

  //Realiza as funções iniciais
  cartOpen();
  getProducts();
}
sellItems();
