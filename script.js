// Banco de dados local (persiste após fechar o navegador)
let imoveis = JSON.parse(localStorage.getItem("imoveis")) || [];
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let negociacoes = JSON.parse(localStorage.getItem("negociacoes")) || [];

// Salvar alterações
function salvarDados() {
    localStorage.setItem("imoveis", JSON.stringify(imoveis));
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("negociacoes", JSON.stringify(negociacoes));
    atualizarDashboard();
}

// Atualizar indicadores do Dashboard
function atualizarDashboard() {
    document.getElementById("totalImoveis").textContent = imoveis.length;
    document.getElementById("imoveisDisponiveis").textContent = imoveis.filter(i => i.status === "Disponível").length;
    document.getElementById("totalClientes").textContent = clientes.length;
    document.getElementById("visitasHoje").textContent = negociacoes.filter(n => n.tipo === "Visita" && n.data === new Date().toISOString().slice(0,10)).length;

    // Carregar lista de imóveis recentes
    const listaImoveis = document.getElementById("listaImoveisRecentes");
    if(listaImoveis) {
        listaImoveis.innerHTML = imoveis.slice(0,5).map(imovel => `
            <li class="flex justify-between items-center border-b pb-2">
                <div>
                    <p class="font-medium">${imovel.titulo}</p>
                    <p class="text-xs text-gray-500">${imovel.bairro} • ${imovel.categoria}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold">R$ ${imovel.valor.toLocaleString('pt-BR')}</p>
                    <span class="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">${imovel.status}</span>
                </div>
            </li>
        `).join("");
    }

    // Carregar lista de leads recentes
    const listaLeads = document.getElementById("listaLeadsRecentes");
    if(listaLeads) {
        listaLeads.innerHTML = clientes.slice(0,5).map(cliente => `
            <li class="flex justify-between items-center border-b pb-2">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-800 dark:text-indigo-200 font-bold text-xs">
                        ${cliente.nome.split(" ")[0][0]}${cliente.nome.split(" ")[1]?.[0] || ""}
                    </div>
                    <div>
                        <p class="font-medium">${cliente.nome}</p>
                        <p class="text-xs text-gray-500">${cliente.tipo}</p>
                    </div>
                </div>
                <span class="text-xs px-2 py-0.5 rounded ${
                    cliente.status === "Quente" ? "bg-red-100 text-red-800" :
                    cliente.status === "Morno" ? "bg-yellow-100 text-yellow-800" :
                    "bg-blue-100 text-blue-800"
                }">${cliente.status}</span>
            </li>
        `).join("");
    }
}

// Função para fazer upload de imagem e salvar em base64
function salvarImagem(input, campo) {
    const arquivo = input.files[0];
    if(!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = function(e) {
        campo.valor = e.target.result;
    };
    leitor.readAsDataURL(arquivo);
}

// Associar cliente a um imóvel (Match)
function associarClienteImovel(idCliente, idImovel) {
    const cliente = clientes.find(c => c.id === idCliente);
    const imovel = imoveis.find(i => i.id === idImovel);
    if(cliente && imovel) {
        cliente.imoveisInteresse = cliente.imoveisInteresse || [];
        cliente.imoveisInteresse.push({
            id: imovel.id,
            titulo: imovel.titulo,
            valor: imovel.valor,
            data: new Date().toISOString()
        });
        salvarDados();
        return true;
    }
    return false;
}

// Inicializar dados
atualizarDashboard();
