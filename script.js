// Dados salvos no navegador (persistem mesmo fechando a página)
let imoveis = JSON.parse(localStorage.getItem("imoveis")) || [
    {nome: "Apto 3 quartos — Farol", detalhes: "85m² • 1 suíte • 2 vagas", preco: 450000, status: "Disponível"},
    {nome: "Casa — Ponta Verde", detalhes: "180m² • 4 quartos • piscina", preco: 980000, status: "Proposta"}
];

let leads = JSON.parse(localStorage.getItem("leads")) || [
    {nome: "Roberto Lima", perfil: "Apto 3q • até R$560k", valorMax: 560000, status: "Quente"},
    {nome: "Lucia Neves", perfil: "Casa • até R$590k", valorMax: 590000, status: "Morno"}
];

// Atualizar listas na tela
function atualizarTela() {
    // Lista de Imóveis
    const listaImoveis = document.getElementById("listaImoveis");
    listaImoveis.innerHTML = "";
    imoveis.forEach(imovel => {
        const li = document.createElement("li");
        li.className = "item-imovel";
        li.innerHTML = `
            <div>
                <h4>${imovel.nome}</h4>
                <p>${imovel.detalhes}</p>
            </div>
            <div class="preco">
                <p>R$ ${(imovel.preco / 1000).toFixed(0)}k</p>
                <small>${imovel.status}</small>
            </div>
        `;
        listaImoveis.appendChild(li);
    });

    // Lista de Leads
    const listaLeads = document.getElementById("listaLeads");
    listaLeads.innerHTML = "";
    leads.forEach(lead => {
        const li = document.createElement("li");
        li.className = "item-lead";
        li.innerHTML = `
            <div class="avatar">${lead.nome.split(" ")[0][0]}${lead.nome.split(" ")[1][0]}</div>
            <div>
                <h4>${lead.nome}</h4>
                <p>${lead.perfil}</p>
            </div>
            <span class="status ${lead.status.toLowerCase()}">${lead.status}</span>
        `;
        listaLeads.appendChild(li);
    });

    // Salvar dados no armazenamento
    localStorage.setItem("imoveis", JSON.stringify(imoveis));
    localStorage.setItem("leads", JSON.stringify(leads));
}

// Funções dos Modais
function abrirFormImovel() { document.getElementById("modalImovel").style.display = "block"; }
function abrirFormLead() { document.getElementById("modalLead").style.display = "block"; }
function fecharModal(id) { document.getElementById(id).style.display = "none"; }

// Salvar novo imóvel
document.getElementById("formImovel").addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = e.target;
    imoveis.push({
        nome: dados[0].value,
        detalhes: dados[1].value,
        preco: Number(dados[2].value),
        status: dados[3].value
    });
    atualizarTela();
    fecharModal("modalImovel");
    e.target.reset();
});

// Salvar novo lead
document.getElementById("formLead").addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = e.target;
    leads.push({
        nome: dados[0].value,
        perfil: dados[1].value,
        valorMax: Number(dados[2].value),
        status: dados[3].value
    });
    atualizarTela();
    fecharModal("modalLead");
    e.target.reset();
});

// Exportar para Planilha (formato CSV)
function exportarParaPlanilha() {
    let conteudo = "DADOS IMÓVELPRO CRM\n\n";

    // Imóveis
    conteudo += "IMÓVEIS\nNome;Detalhes;Preço (R$);Status\n";
    imoveis.forEach(i => {
        conteudo += `${i.nome};${i.detalhes};${i.preco};${i.status}\n`;
    });

    conteudo += "\nLEADS\nNome;Perfil;Valor Máximo (R$);Status\n";
    leads.forEach(l => {
        conteudo += `${l.nome};${l.perfil};${l.valorMax};${l.status}\n`;
    });

    // Criar arquivo para download
    const blob = new Blob([conteudo], {type: "text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `imovelpro_dados_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// Iniciar tela
atualizarTela();
