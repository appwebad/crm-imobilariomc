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
    document.getElementById("imoveisVendidos").textContent = imoveis.filter(i => i.status === "Vendido").length || 0;
    document.getElementById("imoveisAlugados").textContent = imoveis.filter(i => i.status === "Alugado").length || 0;
    document.getElementById("totalClientes").textContent = clientes.length;
    document.getElementById("novosLeads").textContent = clientes.filter(c => new Date(c.dataCadastro) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length || 0;
    document.getElementById("visitasHoje").textContent = negociacoes.filter(n => n.tipo === "Visita" && n.data === new Date().toISOString().slice(0,10)).length;
    document.getElementById("propostasAndamento").textContent = negociacoes.filter(n => n.etapa === "Proposta" || n.status === "Proposta").length || 0;

    // Carregar lista de imóveis recentes
    const listaImoveis = document.getElementById("listaImoveisRecentes");
    if(listaImoveis) {
        listaImoveis.innerHTML = imoveis
            .sort((a,b) => new Date(b.dataCadastro) - new Date(a.dataCadastro))
            .slice(0,5)
            .map(imovel => `
                <li class="flex justify-between items-center border-b pb-2">
                    <div>
                        <p class="font-medium">${imovel.titulo}</p>
                        <p class="text-xs text-gray-500">${imovel.bairro} • ${imovel.categoria}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold">R$ ${Number(imovel.valor).toLocaleString('pt-BR')}</p>
                        <span class="text-xs px-2 py-0.5 rounded ${
                            imovel.status === "Disponível" ? "bg-green-100 text-green-800" :
                            imovel.status === "Reservado" ? "bg-yellow-100 text-yellow-800" :
                            imovel.status === "Vendido" ? "bg-red-100 text-red-800" :
                            imovel.status === "Alugado" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 dark:bg-gray-700"
                        }">${imovel.status}</span>
                    </div>
                </li>
            `).join("") || "<p class='text-center text-gray-500'>Nenhum imóvel cadastrado</p>";
    }

    // Carregar lista de leads recentes
    const listaLeads = document.getElementById("listaLeadsRecentes");
    if(listaLeads) {
        listaLeads.innerHTML = clientes
            .sort((a,b) => new Date(b.dataCadastro) - new Date(a.dataCadastro))
            .slice(0,5)
            .map(cliente => `
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
                        cliente.status === "Frio" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 dark:bg-gray-700"
                    }">${cliente.status || "Morno"}</span>
                </li>
            `).join("") || "<p class='text-center text-gray-500'>Nenhum cliente cadastrado</p>";
    }
}

// Função para fazer upload de imagem e salvar em base64
function salvarImagem(input, campo) {
    const arquivo = input.files[0];
    if(!arquivo) return;

    // Validação de tipo e tamanho
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

// Associar cliente a um imóvel (Match)
function associarClienteImovel(idCliente, idImovel) {
    idCliente = Number(idCliente);
    idImovel = Number(idImovel);
    const cliente = clientes.find(c => c.id === idCliente);
    const imovel = imoveis.find(i => i.id === idImovel);
    
    if(cliente && imovel) {
        cliente.imoveisInteresse = cliente.imoveisInteresse || [];
        
        // Evita duplicatas
        const jaExiste = cliente.imoveisInteresse.some(item => item.id === idImovel);
        if (jaExiste) return true;

        cliente.imoveisInteresse.push({
            id: imovel.id,
            titulo: imovel.titulo,
            valor: imovel.valor,
            data: new Date().toISOString()
        });

        // Registra automaticamente na lista de negociações
        negociacoes.push({
            id: Date.now(),
            clienteId: cliente.id,
            clienteNome: cliente.nome,
            imovelId: imovel.id,
            imovelTitulo: imovel.titulo,
            valor: imovel.valor,
            etapa: "Contato Inicial",
            data: new Date().toISOString().slice(0,10),
            observacoes: "Associação automática pelo sistema"
        });

        salvarDados();
        return true;
    }
    return false;
}

// ==============================================
// ✨ FUNÇÕES DE INTELIGÊNCIA ARTIFICIAL
// ==============================================

// Gerar descrição comercial automática
function gerarDescricaoIA(dadosImovel) {
    const { titulo, categoria, cidade, bairro, quartos, suites, banheiros, garagens, areaTotal, piscina, areaGourmet, varanda, jardim, financiamento, valor, tipo } = dadosImovel;

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
    descricao += `• ${financiamento ? "Aceita financiamento bancário" : "Não aceita financiamento"}`;

    descricao += `\n\n💵 Valor: R$ ${Number(valor).toLocaleString('pt-BR')}`;
    descricao += `\n📞 Entre em contato e agende sua visita!`;

    return descricao;
}

// Versões da descrição para redes sociais
function gerarVersoesAnuncio(descricaoBase, contato = "(81) 99999-1234") {
    return {
        whatsapp: descricaoBase + `\n\n📲 Fale comigo: ${contato}`,
        instagram: descricaoBase.replace(/\n/g, " ").replace(/\*\*/g, "") + `\n\n#imoveis #venda #aluguel #cabo #pernambuco #corretor`,
        facebook: descricaoBase + `\n\n📞 Contato: ${contato} | ImóvelPro CRM`,
        curta: `✨ ${descricaoBase.slice(0, 150)}... Saiba mais e agende sua visita!`
    };
}

// Calcular compatibilidade entre cliente e imóvel
function calcularCompatibilidade(cliente, imovel) {
    let pontuacao = 0;
    const maximo = 100;

    const bairrosPreferidos = cliente.bairrosDesejados ? cliente.bairrosDesejados.split(",").map(b => b.trim().toLowerCase()) : [];
    if (bairrosPreferidos.includes(imovel.bairro.toLowerCase())) pontuacao += 30;

    if (imovel.valor <= cliente.valorMax) pontuacao += 25;

    if (cliente.tipoImovel === "Todos" || cliente.tipoImovel === imovel.categoria) pontuacao += 20;

    if (imovel.quartos >= (cliente.quartosMin || 0)) pontuacao += 15;

    if ((imovel.tipo === "Venda" && cliente.tipo === "Comprador") || (imovel.tipo === "Locação" && cliente.tipo === "Inquilino")) pontuacao += 10;

    return Math.min(pontuacao, maximo);
}

// Sugerir os melhores imóveis para um cliente
function sugerirImoveisParaCliente(cliente, limite = 5) {
    if (!cliente) return [];

    return imoveis
        .filter(imovel => imovel.status === "Disponível")
        .map(imovel => ({
            ...imovel,
            compatibilidade: calcularCompatibilidade(cliente, imovel)
        }))
        .sort((a, b) => b.compatibilidade - a.compatibilidade)
        .slice(0, limite);
}

// Sugerir preço médio de mercado
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

// Classificar leads automaticamente
function classificarLeads() {
    clientes.forEach(cliente => {
        let pontuacao = 0;
        if (cliente.valorMax > 300000) pontuacao += 20;
        if (cliente.whatsapp) pontuacao += 25;
        if (cliente.bairrosDesejados) pontuacao += 25;
        if (["Comprador", "Investidor"].includes(cliente.tipo)) pontuacao += 30;

        cliente.status = pontuacao >= 70 ? "Quente" : pontuacao >= 40 ? "Morno" : "Frio";
    });
    salvarDados();
    return clientes;
}

// ==============================================
// 📤 FUNÇÕES DE EXPORTAÇÃO PARA PLANILHA
// ==============================================

// Função auxiliar para gerar e baixar arquivo
function gerarArquivoDownload(conteudo, nomeArquivo) {
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
}

// Exportar lista de imóveis
function exportarImoveis() {
    let cabecalho = "Código;Título;Categoria;Tipo;Cidade;Bairro;Valor;Área;Quartos;Suítes;Banheiros;Garagens;Status;Financiamento;Data Cadastro\n";
    let linhas = "";

    imoveis.forEach(imovel => {
        linhas += `${imovel.id};"${imovel.titulo || ""}";${imovel.categoria || ""};${imovel.tipo || ""};${imovel.cidade || ""};${imovel.bairro || ""};${imovel.valor || 0};${imovel.areaTotal || 0};${imovel.quartos || 0};${imovel.suites || 0};${imovel.banheiros || 0};${imovel.garagens || 0};${imovel.status || ""};${imovel.financiamento ? "Sim" : "Não"};${imovel.dataCadastro ? new Date(imovel.dataCadastro).toLocaleDateString('pt-BR') : ""}\n`;
    });

    gerarArquivoDownload(cabecalho + linhas, `imoveis_${new Date().toISOString().slice(0,10)}.csv`);
}

// Exportar lista de clientes
function exportarClientes() {
    let cabecalho = "Código;Nome;CPF;Telefone;WhatsApp;Email;Tipo;Valor Máximo;Tipo Imóvel;Bairros Desejados;Status;Data Cadastro\n";
    let linhas = "";

    clientes.forEach(cliente => {
        linhas += `${cliente.id};"${cliente.nome || ""}";${cliente.cpf || ""};${cliente.telefone || ""};${cliente.whatsapp || ""};${cliente.email || ""};${cliente.tipo || ""};${cliente.valorMax || 0};${cliente.tipoImovel || ""};"${cliente.bairrosDesejados || ""}";${cliente.status || ""};${cliente.dataCadastro ? new Date(cliente.dataCadastro).toLocaleDateString('pt-BR') : ""}\n`;
    });

    gerarArquivoDownload(cabecalho + linhas, `clientes_${new Date().toISOString().slice(0,10)}.csv`);
}

// Exportar negociações/funil
function exportarNegociacoes() {
    let cabecalho = "Código;Cliente;Imóvel;Valor;Etapa;Data;Observações\n";
    let linhas = "";

    negociacoes.forEach(neg => {
        linhas += `${neg.id};"${neg.clienteNome || ""}";"${neg.imovelTitulo || ""}";${neg.valor || 0};${neg.etapa || ""};${neg.data || ""};"${neg.observacoes || ""}"\n`;
    });

    gerarArquivoDownload(cabecalho + linhas, `negociacoes_${new Date().toISOString().slice(0,10)}.csv`);
}

// Exportar todos os dados de uma vez
function exportarTodosDados() {
    exportarImoveis();
    setTimeout(() => exportarClientes(), 700);
    setTimeout(() => exportarNegociacoes(), 1400);
}

// Inicializar dados
atualizarDashboard();
