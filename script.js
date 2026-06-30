```javascript
// script.js

const properties = [
  ["🏠", "Apto 3 quartos — Farol", "85m² · 1 suíte · 2 vagas", "R$ 450k", "Disponível"],
  ["🏡", "Casa — Ponta Verde", "180m² · 4 quartos · piscina", "R$ 980k", "Negociação"],
  ["🏢", "Comercial — Centro", "120m² · andar corrido", "R$ 320k", "Disponível"],
  ["🌴", "Terreno — Jatiúca", "400m² · esquina", "R$ 210k", "Reservado"],
  ["🌾", "Sítio — Murici", "3ha · casa sede", "R$ 1,2M", "Disponível"]
];

const funnel = [
  ["Novo lead", 38, "blue"],
  ["Contato", 30, "yellow"],
  ["Visita", 20, "blue"],
  ["Proposta", 11, "yellow"],
  ["Negociação", 7, "black"],
  ["Contrato", 4, "blue"],
  ["Fechado", 3, "black"]
];

const matches = [
  ["Maria Silva", "Apto 3q · Farol · R$500k", "96%"],
  ["Pedro Alves", "Casa · Ponta Verde · R$1M", "89%"],
  ["Ana Costa", "Apto 2q · Jatiúca · R$350k", "82%"],
  ["Carlos Melo", "Comercial · Centro · R$400k", "75%"]
];

const agenda = [
  ["09:00", "Visita — Apto Farol", "Maria Silva · Rua X, 100", "blue"],
  ["11:30", "Reunião — Proposta", "Pedro Alves · Online", "yellow"],
  ["14:00", "Visita — Casa Ponta Verde", "Ana Costa · Av. Y, 500", "yellow"],
  ["16:30", "Assinatura contrato", "Carlos Melo · Escritório", "blue"]
];

const leads = [
  ["RL", "Roberto Lima", "Apto 3q · até R$600k", "Quente"],
  ["LN", "Lucia Neves", "Casa · até R$800k", "Morno"],
  ["FB", "Fernando Brito", "Investidor · Comercial", "Investidor"],
  ["JS", "Juliana Santos", "Apto 2q · Locação", "Novo"]
];

const navButtons = document.querySelectorAll(".nav");
const pages = document.querySelectorAll(".page");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(item => item.classList.remove("active"));
    pages.forEach(page => page.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.page).classList.add("active");
  });
});

function renderProperties() {
  const container = document.getElementById("propertyList");
  const cadastro = document.getElementById("listaCadastro");

  container.innerHTML = "";
  cadastro.innerHTML = "";

  properties.forEach(item => {
    const html = `
      <div class="row">
        <div class="icon">${item[0]}</div>
        <div>
          <h4>${item[1]}</h4>
          <p>${item[2]}</p>
        </div>
        <div class="price">
          ${item[3]}
          <span class="status">${item[4]}</span>
        </div>
      </div>
    `;

    container.innerHTML += html;
    cadastro.innerHTML += html;
  });
}

function renderFunnel() {
  const container = document.getElementById("funnel");
  container.innerHTML = "";

  funnel.forEach(item => {
    container.innerHTML += `
      <div class="funnel-item">
        <span>${item[0]}</span>
        <div class="bar ${item[2]}" style="width:${item[1] * 2.4}%"></div>
        <strong>${item[1]}</strong>
      </div>
    `;
  });
}

function renderMatches() {
  const container = document.getElementById("matchList");
  container.innerHTML = "";

  matches.forEach(item => {
    container.innerHTML += `
      <div class="row">
        <div class="icon">👤</div>
        <div>
          <h4>${item[0]}</h4>
          <p>${item[1]}</p>
        </div>
        <strong class="percent">${item[2]}</strong>
      </div>
    `;
  });
}

function renderAgenda() {
  const container = document.getElementById("scheduleList");
  const full = document.getElementById("agendaFull");

  container.innerHTML = "";
  full.innerHTML = "";

  agenda.forEach(item => {
    const html = `
      <div class="row">
        <strong>${item[0]}</strong>
        <div>
          <h4><span class="dot ${item[3]}"></span>${item[1]}</h4>
          <p>${item[2]}</p>
        </div>
      </div>
    `;

    container.innerHTML += html;
    full.innerHTML += html;
  });
}

function renderLeads() {
  const container = document.getElementById("leadList");
  const all = document.getElementById("allLeads");

  container.innerHTML = "";
  all.innerHTML = "";

  leads.forEach(item => {
    const html = `
      <div class="row">
        <div class="icon">${item[0]}</div>
        <div>
          <h4>${item[1]}</h4>
          <p>${item[2]}</p>
        </div>
        <strong>${item[3]}</strong>
      </div>
    `;

    container.innerHTML += html;
    all.innerHTML += html;
  });
}

document.getElementById("formImovel").addEventListener("submit", function(e) {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const bairro = document.getElementById("bairro").value;
  const valor = document.getElementById("valor").value;
  const status = document.getElementById("status").value;

  properties.unshift(["🏠", `${titulo} — ${bairro}`, "Cadastro novo · dados completos", valor, status]);

  renderProperties();
  this.reset();
  alert("Imóvel cadastrado com sucesso!");
});

document.getElementById("search").addEventListener("input", function() {
  const term = this.value.toLowerCase();
  const result = document.getElementById("consultaResultado");

  const filtered = [...properties, ...leads].filter(item =>
    item.join(" ").toLowerCase().includes(term)
  );

  result.innerHTML = "";

  filtered.forEach(item => {
    result.innerHTML += `
      <div class="row">
        <div class="icon">🔎</div>
        <div>
          <h4>${item[1]}</h4>
          <p>${item[2]}</p>
        </div>
        <strong>${item[3]}</strong>
      </div>
    `;
  });
});

function acaoIA(tipo) {
  const resultado = document.getElementById("resultadoIA");

  const textos = {
    "descrição": "Descrição gerada: Excelente imóvel em Maceió, com localização estratégica, ótimo potencial de valorização e estrutura ideal para moradia ou investimento.",
    "match": "Match IA: Cliente Maria Silva possui 96% de compatibilidade com Apto 3 quartos no Farol, considerando valor, localização e perfil de busca.",
    "anúncio": "Anúncio criado: Seu novo imóvel em Maceió está aqui! Agende uma visita e conheça uma oportunidade exclusiva com a ImóvelPro.",
    "leads": "Classificação: Roberto Lima é lead quente. Recomenda-se contato imediato via WhatsApp e oferta de visita ainda hoje.",
    "preço": "Sugestão de preço: Para imóveis no Farol, recomenda-se margem inicial de negociação entre 5% e 8%, mantendo preço competitivo.",
    "resumo": "Resumo do atendimento: Cliente interessado em apartamento 3 quartos, orçamento até R$600k, preferência pelo bairro Farol ou Ponta Verde."
  };

  resultado.textContent = textos[tipo];

  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.getElementById("ia").classList.add("active");
  document.querySelectorAll(".nav").forEach(btn => btn.classList.remove("active"));
}

renderProperties();
renderFunnel();
renderMatches();
renderAgenda();
renderLeads();
```
