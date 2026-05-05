let carrinho = [];
let produtos = [];
let categoriaAtual = "café da manhã";
let formaPagamento = "";

async function carregarProdutos() {

  
  try {

  const resposta = await fetch("http://localhost:8080/api/produtos/disponível")
  const dados = await resposta.json()
  console.log("Dados recebidos:", dados);
  
  // const grid = document.getElementById("produtos")
  
  
  //grid.innerHTML = ""
   
  produtos = dados.map(p => ({
      id:        p.id_prod,
      nome:      p.nome_prod,
      preco:     p.preco_prod,
      categoria: p.categoria_prod,
      imagem:    "imagens/" + p.nome_prod.toLowerCase().replace(/ /g, "") + ".jpg"
    }))
 
    mostrarProdutos();

    } catch (error)
    
    {
        console.error("Erro ao carregar produtos:", error);
        alert("Não foi possível carregar os produtos!!!!!!!!! Verifique sua conexão com o servidor!! .");
    }
}


//document.addEventListener("DOMContentLoaded", carregarProdutos)



function mostrarProdutos() {
    const grid = document.getElementById("produtos");
    grid.innerHTML = "";
    
    const filtrados = produtos.filter(p => p.categoria === categoriaAtual);
     
    if (filtrados.length === 0) {
    grid.innerHTML = "<p>Nenhum produto nessa categoria.</p>";
    return;
  }

    
        
        filtrados.forEach(produto => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${produto.imagem}" onerror="this.style.display='none'">
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

    let total = 0

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

carregarProdutos();