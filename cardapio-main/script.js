async function carregarProdutos() {

  
  const resposta = await fetch("http://localhost:8080/api/produtos/disponiveis")
  const produtos = await resposta.json()

  
  const grid = document.getElementById("ID_DO_SEU_GRID")
  
  
  grid.innerHTML = ""

 
  produtos.forEach(produto => {
    const card = document.createElement("div")
    card.className = "CLASSE_DO_SEU_CARD"
    card.innerHTML = `
      <h3>${produto.nome_prod}</h3>
      <p>${produto.descricao_prod ?? ""}</p>
      <p>R$ ${produto.preco_prod}</p>
      <button onclick="adicionarCarrinho(
        ${produto.id_prod},
        '${produto.nome_prod}',
        ${produto.preco_prod}
      )">
        Adicionar
      </button>
    `
    grid.appendChild(card)
  })
}


document.addEventListener("DOMContentLoaded", carregarProdutos)

let carrinho = [];
let categoriaAtual = "Café";
let formaPagamento = "";

function mostrarProdutos() {
    const grid = document.getElementById("produtos");
    grid.innerHTML = "";

    produtos
        .filter(p => p.categoria === categoriaAtual)
        .forEach(produto => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${produto.imagem}">
                <h3>${produto.nome}</h3>
                <p>R$ ${produto.preco.toFixed(2)}</p>
                <button onclick="adicionar(${produto.id})">Adicionar</button>
            `;
            grid.appendChild(card);
        });
}

function filtrarCategoria(cat) {
    const container = document.getElementById("produtos");
    container.classList.add("fade-out");

    setTimeout(() => {
        categoriaAtual = cat;
        mostrarProdutos();
        container.classList.remove("fade-out");
    }, 200);
}


function adicionar(id) {
    const item = carrinho.find(p => p.id === id);
    if (item) item.qtd++;
    else carrinho.push({ ...produtos.find(p => p.id === id), qtd: 1 });
    atualizarCarrinho();
}

function diminuir(id) {
    const item = carrinho.find(p => p.id === id);
    if (!item) return;
    item.qtd--;
    if (item.qtd <= 0) carrinho = carrinho.filter(p => p.id !== id);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    lista.innerHTML = "";

    let total = 0;

    carrinho.forEach(item => {
        total += item.qtd * item.preco;
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.qtd}x ${item.nome}
            <button onclick="diminuir(${item.id})">-</button>
            <button onclick="adicionar(${item.id})">+</button>
        `;
        lista.appendChild(li);
    });

    document.getElementById("resumo-itens").innerText =
        carrinho.reduce((s, p) => s + p.qtd, 0) + " item(s)";
    document.getElementById("resumo-total").innerText =
        "R$ " + total.toFixed(2);
}

function toggleCarrinho() {
    const carrinho = document.getElementById("carrinho-fixo");
    carrinho.classList.toggle("aberto");

    document.getElementById("seta-carrinho").textContent =
        carrinho.classList.contains("aberto") ? "▼" : "▲";
}

function finalizarPedido() {
    const mesa = document.getElementById("numeroMesa").value;
    const forma = document.getElementById("forma-pagamento").value;

    if (!mesa) return alert("Informe o número da mesa");
    if (!forma) return alert("Selecione a forma de pagamento");

    let texto = `Mesa ${mesa}\n\nPedido:\n`;
    let total = 0;

    carrinho.forEach(p => {
        texto += `${p.qtd}x ${p.nome} - R$ ${(p.qtd * p.preco).toFixed(2)}\n`;
        total += p.qtd * p.preco;
    });

    texto += `\nTotal: R$ ${total.toFixed(2)}\nPagamento: ${forma}`;

    window.open(`https://wa.me/5511994562789?text=${encodeURIComponent(texto)}`);
}

document.getElementById("btn-finalizar").addEventListener("click", finalizarPedido);

mostrarProdutos();
