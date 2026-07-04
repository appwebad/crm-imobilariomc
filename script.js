// Banco de dados local
let imoveis = JSON.parse(localStorage.getItem("imoveis")) || [];
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let negociacoes = JSON.parse(localStorage.getItem("negociacoes")) || [];
let corretores = JSON.parse(localStorage.getItem("corretores")) || [];
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
    { id: 1, nome: "Administrador", email: "admin@imovelpro.com", senha: "admin123", tipo: "admin", creci: "00000" }
];

// Salvar todos os dados
function salvarDados() {
    localStorage.setItem("imoveis", JSON.stringify(imoveis));
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("negociacoes", JSON.stringify(negociacoes));
    localStorage.setItem("corretores", JSON.stringify(corretores));
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    atualizarDashboard();
}

// Atualizar indicadores do Dashboard
function atualizarDashboard() {
    const elTotalImoveis = document.getElementById("totalImoveis");
    const elDisponiveis = document.getElementById("imoveisDisponiveis");
    const elVendidos = document.getElementById("imoveisVendidos");
    const elAlugados = document.getElementById("imoveisAlugados");
    const elTotalClientes = document.getElementById("totalClientes");
    const elVisitasHoje = document.getElementById("visitasHoje");
    const elPropostas = document.getElementById("propostasAndamento");

    if (elTotalImoveis) elTotalImoveis.textContent = imoveis.length;
    if (elDisponiveis) elDisponiveis.textContent = imoveis.filter(i => i.status === "Disponível").length;
    if (elVendidos) elVendidos.textContent = imoveis.filter(i => i.status === "Vendido").length;
    if (elAlugados) elAlugados.textContent = imoveis.filter(i => i.status === "Alugado").length;
    if (elTotalClientes) elTotalClientes.textContent = clientes.length;
    if (elVisitasHoje) elVisitasHoje.textContent = negociacoes.filter(n => n.tipo === "Visita" && n.data === new Date().toISOString().slice(0,10)).length;
    if (elPropostas) elPropostas.textContent = negociacoes.filter(n => n.etapa === "Proposta").length;

    // Lista de imóveis recentes
    const listaImoveis = document.getElementById("listaImoveisRecentes");
    if(listaImoveis) {
        listaImoveis.innerHTML = imoveis
            .sort((a,b) => new Date(b.dataCadastro) - new Date(a.dataCadastro))
            .slice(0,5)
            .map(imovel => `
                <li class="flex justify-between items-center border-b border-gray-700 pb-2">
                    <div>
                        <p class="font-medium">${imovel.titulo}</p>
                        <p class="text-xs text-gray-400">${imovel.bairro} • ${imovel.categoria}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-green-400">R$ ${Number(imovel.valor).toLocaleString('pt-BR')}</p>
                        <span class="text-xs px-2 py-0.5 rounded ${
                            imovel.status === "Disponível" ? "bg-green-800 text-green-100" :
                            imovel.status === "Reservado" ? "bg-yellow-800 text-yellow-100" :
                            imovel.status === "Vendido" ? "bg-red-800 text-red-100" :
                            "bg-blue-800 text-blue-100"
                        }">${imovel.status}</span>
                    </div>
                </li>
            `).join("") || "<p class='text-center text-gray-400'>Nenhum imóvel cadastrado</p>";
    }

    // Lista de clientes recentes
    const listaLeads = document.getElementById("listaLeadsRecentes");
    if(listaLeads) {
        listaLeads.innerHTML = clientes
            .sort((a,b) => new Date(b.dataCadastro) - new Date(a.dataCadastro))
            .slice(0,5)
            .map(cliente => `
                <li class="flex justify-between items-center border-b border-gray-700 pb-2">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-100 font-bold text-xs">
                            ${cliente.nome.split(" ")[0][0]}${cliente.nome.split(" ")[1]?.[0] || ""}
                        </div>
                        <div>
                            <p class="font-medium">${cliente.nome}</p>
                            <p class="text-xs text-gray-400">${cliente.tipo}</p>
                        </div>
                    </div>
                    <span class="text-xs px-2 py-0.5 rounded ${
                        cliente.status === "Quente" ? "bg-red-800 text-red-100" :
                        cliente.status === "Morno" ? "bg-yellow-800 text-yellow-100" :
                        "bg-blue-800 text-blue-100"
                    }">${cliente.status || "Morno"}</span>
                </li>
            `).join("") || "<p class='text-center text-gray-400'>Nenhum cliente cadastrado</p>";
    }
}

// Função para upload de imagem
function salvarImagem(input, campo) {
    const arquivo = input.files[0];
    if(!arquivo) return;

    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    if (!tiposPermitidos.includes(arquivo.type)) {
        alert("Formato inválido! Use JPG, PNG ou WebP.");
        input.value = "";
        return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
        alert("Imagem muito grande! Tamanho máximo: 5MB.");
        input.value = "";
        return;
    }

    const leitor = new FileReader();
    leitor.onload = function(e) {
        campo.valor = e.target.result;
    };
    leitor.readAsDataURL(arquivo);
}

// Associar cliente e imóvel
function associarClienteImovel(idCliente, idImovel) {
    idCliente = Number(idCliente);
    idImovel = Number(idImovel);
    const cliente = clientes.find(c => c.id === idCliente);
    const imovel = imoveis.find(i => i.id === idImovel);
    
    if(cliente && imovel) {
        cliente.imoveisInteresse = cliente.imoveisInteresse || [];
        const jaExiste = cliente.imoveisInteresse.some(item => item.id === idImovel);
        if (jaExiste) return true;

        cliente.imoveisInteresse.push({
            id: imovel.id,
            titulo: imovel.titulo,
            valor: imovel.valor,
            data: new Date().toISOString()
        });

        negociacoes.push({
            id: Date.now(),
            clienteId: cliente.id,
            clienteNome: cliente.nome,
            imovelId: imovel.id,
            imovelTitulo: imovel.titulo,
            valor: imovel.valor,
            etapa: "Contato Inicial",
            data: new Date().toISOString().slice(0,10),
            observacoes: "Associação automática"
        });

        salvarDados();
        return true;
    }
    return false;
}

// ==============================================
// 🤖 FUNÇÕES DE INTELIGÊNCIA ARTIFICIAL
// ==============================================
function gerarDescricaoIA(dadosImovel) {
    const { titulo, categoria, cidade, bairro, quartos, suites, banheiros, garagens, areaTotal, piscina, areaGourmet, varanda, jardim, aceitaFinanciamento, valor, tipo } = dadosImovel;

    let descricao = `🏡 **${titulo}**\n\n`;
    descricao += `Excelente ${categoria} para ${tipo === "Venda" ? "compra" : tipo === "Locação" ? "locação" : "venda ou locação"}, localizado no bairro ${bairro}, em ${cidade}.\n\n`;
    descricao += `✅ Características:\n`;
    if (quartos) descricao += `• ${quartos} quarto${quartos > 1 ? "s" : ""}`;
    if (suites) descricao += `, sendo ${suites} suíte${suites > 1 ? "s" : ""}`;
    descricao += `\n• ${banheiros || 0} banheiro${banheiros > 1 ? "s" : ""}\n`;
    descricao += `• ${garagens || 0} vaga${garagens > 1 ? "s" : ""} de garagem\n`;
    if (areaTotal) descricao += `• Área total de ${areaTotal}m²\n`;

    descricao += `\n✅ Diferenciais:\n`;
    if (piscina) descricao += `• Piscina\n`;
    if (areaGourmet) descricao += `• Área gourmet\n`;
    if (varanda) descricao += `• Varanda espaçosa\n`;
    if (jardim) descricao += `• Jardim\n`;
    descricao += `• Localização privilegiada, próximo a comércio, escolas e serviços\n`;
    descricao += `• ${aceitaFinanciamento ? "Aceita financiamento bancário" : "Não aceita financiamento"}`;

    descricao += `\n\n💵 Valor: R$ ${Number(valor).toLocaleString('pt-BR')}`;
    descricao += `\n📞 Entre em contato e agende sua visita!`;

    return descricao;
}

function gerarVersoesAnuncio(descricaoBase, contato = "(81) 99999-1234") {
    return {
        whatsapp: descricaoBase + `\n\n📲 Fale comigo: ${contato}`,
        instagram: descricaoBase.replace(/\n/g, " ").replace(/\*\*/g, "") + `\n\n#imoveis #venda #aluguel #cabodesantoagostinho #pernambuco #corretordeimoveis`,
        facebook: descricaoBase + `\n\n📞 Contato: ${contato} | ImóvelPro CRM`
    };
}

function sugerirPrecoMercado(dadosImovel) {
    const semelhantes = imoveis.filter(i =>
        i.categoria === dadosImovel.categoria &&
        i.bairro === dadosImovel.bairro &&
        Math.abs(i.areaTotal - dadosImovel.areaTotal) <= 25 &&
        i.status !== "Vendido"
    );

    if (semelhantes.length === 0) return null;

    const media = semelhantes.reduce((soma, i) => soma + i.valor, 0) / semelhantes.length;
    const valorM2 = media / dadosImovel.areaTotal;

    return {
        mediaMercado: Math.round(media),
        valorPorM2: Math.round(valorM2),
        quantidadeAnalisada: semelhantes.length
    };
}

// ==============================================
// 📤 EXPORTAÇÃO DE DADOS
// ==============================================
function gerarArquivoDownload(conteudo, nomeArquivo) {
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
}

function exportarImoveis() {
    let cabecalho = "Código;Título;Categoria;Tipo;Cidade;Bairro;Valor;Área;Quartos;Suítes;Banheiros;Garagens;Status;Financiamento;Data Cadastro\n";
    let linhas = "";
    imoveis.forEach(imovel => {
        linhas += `${imovel.id};"${imovel.titulo || ""}";${imovel.categoria || ""};${imovel.tipo || ""};${imovel.cidade || ""};${imovel.bairro || ""};${imovel.valor || 0};${imovel.areaTotal || 0};${imovel.quartos || 0};${imovel.suites || 0};${imovel.banheiros || 0};${imovel.garagens || 0};${imovel.status || ""};${imovel.aceitaFinanciamento ? "Sim" : "Não"};${imovel.dataCadastro ? new Date(imovel.dataCadastro).toLocaleDateString('pt-BR') : ""}\n`;
    });
    gerarArquivoDownload(cabecalho + linhas, `imoveis_${new Date().toISOString().slice(0,10)}.csv`);
}

// Inicializar sistema
atualizarDashboard();
