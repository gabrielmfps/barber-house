const formulario = document.querySelector("#form-agendamento");

const campoData = document.querySelector("#data");

let mensagem = "";

const hoje = new Date().toISOString().split("T")[0];

campoData.min = hoje;

const funcionamento = {
    0: null, // Domingo
    1: ["09:00", "18:00"], // Segunda
    2: ["09:00", "18:00"], // Terça
    3: ["09:00", "18:00"], // Quarta
    4: ["09:00", "18:00"], // Quinta
    5: ["09:00", "18:00"], // Sexta
    6: ["10:00", "16:00"]  // Sábado
};

const formatarData = (data) => {
    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const atualizarHorarios = () => {

    const dataSelecionada = campoData.value;

    const horario = document.querySelector("#horario");

    const data = new Date(dataSelecionada + "T00:00:00");

    const diaDaSemana = data.getDay();

    const horarioFuncionamento = funcionamento[diaDaSemana];

    horario.innerHTML = `
        <option value="">Selecione um horário</option>
    `;

    if (!horarioFuncionamento) {
        return;
    }

    const [horaAbertura, minutoAbertura] = horarioFuncionamento[0]
        .split(":")
        .map(Number);

    const [horaFechamento, minutoFechamento] = horarioFuncionamento[1]
        .split(":")
        .map(Number);

    const inicio = horaAbertura * 60 + minutoAbertura;

    const fim = horaFechamento * 60 + minutoFechamento;

    for (let minutos = inicio; minutos <= fim; minutos += 60) {

        const hora = String(Math.floor(minutos / 60)).padStart(2, "0");

        const minuto = String(minutos % 60).padStart(2, "0");

        const horarioAtual = `${hora}:${minuto}`;

        if (dataSelecionada === hoje) {

            const agora = new Date();

            const horarioAtualEmMinutos =
                agora.getHours() * 60 + agora.getMinutes();

            if (minutos <= horarioAtualEmMinutos) {
                continue;
            }
        }

        const opcao = document.createElement("option");

        opcao.value = horarioAtual;

        opcao.textContent = horarioAtual;

        horario.appendChild(opcao);
    }
};

const modal = document.querySelector("#modal-confirmacao");

const btnCancelar = document.querySelector("#btn-cancelar");

const btnConfirmar = document.querySelector("#btn-confirmar");

const modalAviso = document.querySelector("#modal-aviso");

const mensagemAviso = document.querySelector("#mensagem-aviso");

const btnFecharAviso = document.querySelector("#btn-fechar-aviso");

const mostrarAviso = (mensagem) => {

    mensagemAviso.textContent = mensagem;

    modalAviso.style.display = "flex";
};

btnFecharAviso.addEventListener("click", () => {

    modalAviso.style.display = "none";

});


campoData.addEventListener("change", () => {

    const partes = campoData.value.split("-");

    // Evita validar enquanto a data estiver sendo digitada
    if (partes.length !== 3 || partes[0].length !== 4) {
        return;
    }

    const ano = Number(partes[0]);

    // Evita problemas quando o navegador interpreta
    // temporariamente o ano como 0002
    if (ano < new Date().getFullYear()) {
        return;
    }

    const data = new Date(campoData.value + "T00:00:00");

    const diaDaSemana = data.getDay();

    if (funcionamento[diaDaSemana] === null) {

        mostrarAviso("Não funcionamos neste dia. Escolha uma data válida.");

        campoData.value = "";

        document.querySelector("#horario").value = "";

        return;
    }

    document.querySelector("#horario").value = "";

    atualizarHorarios();

});


btnCancelar.addEventListener("click", () => {
    modal.style.display = "none";
});

btnConfirmar.addEventListener("click", () => {

    const telefone = "551199999999";

    const url = `https://web.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    modal.style.display = "none";

    formulario.reset();

});

setInterval(atualizarHorarios, 60000);

formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.querySelector("#nome").value.trim()
        .replace(/\s+/g, " ");
    const servico = document.querySelector("#servico").value;
    const dataSelecionada = document.querySelector("#data").value;
    const horario = document.querySelector("#horario").value;

    if (!servico) {

        mostrarAviso("Selecione um serviço disponível.");

        return;
    }

    if (!horario) {

        mostrarAviso("Selecione um horário disponível.");

        return;

    }

    if (nome.length < 3) {

        mostrarAviso("Digite um nome válido.");

        return;
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {

        mostrarAviso("O nome deve conter apenas letras.");

        return;
    }

    const palavrasNome = nome.trim().split(/\s+/);

    if (palavrasNome.length < 2) {

        mostrarAviso("Digite seu nome e sobrenome.");

        return;
    }

    if (dataSelecionada < hoje) {
        mostrarAviso("a data não pode ser anterior a hoje.");

        return;
    }

    if (dataSelecionada === hoje) {

        const agora = new Date();

        const horarioAtual =
            agora.getHours() * 60 + agora.getMinutes();

        const [hora, minuto] = horario.split(":");

        const horarioEscolhido =
            Number(hora) * 60 + Number(minuto);

        if (horarioEscolhido <= horarioAtual) {

            mostrarAviso("Esse horário já passou. Escolha outro horário.");

            return;
        };
    }

    const data = formatarData(dataSelecionada);

    mensagem = `\u{1F488} *BARBER HOUSE*

Olá! Gostaria de solicitar um agendamento. \u{2702}\u{FE0F}

--------------------
\u{1F464} *Cliente:* ${nome}
\u{2702}\u{FE0F} *Serviço:* ${servico}
\u{1F4C5} *Data:* ${data}
\u{1F550} *Horário:* ${horario}
--------------------

Aguardo a confirmação. Obrigado! \u{1F91D}
`;

    document.querySelector("#resumo-nome").textContent = nome;

    document.querySelector("#resumo-servico").textContent = servico;

    document.querySelector("#resumo-data").textContent = data;

    document.querySelector("#resumo-horario").textContent = horario;

    modal.style.display = "flex";

});