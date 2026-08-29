const formulario = document.querySelector("#form-agendamento");

const campoData = document.querySelector("#data");

const hoje = new Date().toISOString().split("T")[0];

campoData.min = hoje;

const formatarData = (data) => {
    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const atualizarHorarios = () => {

    const dataSelecionada = campoData.value;
    const horario = document.querySelector("#horario");

    const opcoes = [
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00"
    ];

    horario.innerHTML = `
        <option value="">Selecione um horário</option>
    `;

    opcoes.forEach((hora) => {

        if (dataSelecionada === hoje) {

            const agora = new Date();

            const [horaSelecionada, minutoSelecionado] = hora.split(":");

            const horarioSelecionado =
                Number(horaSelecionada) * 60 + Number(minutoSelecionado);

            const horarioAtual =
                agora.getHours() * 60 + agora.getMinutes();

            if (horarioSelecionado <= horarioAtual) {
                return;
            }
        }

        const opcao = document.createElement("option");

        opcao.value = hora;
        opcao.textContent = hora;

        horario.appendChild(opcao);
    });
};

campoData.addEventListener("change", () => {

    document.querySelector("#horario").value = "";

    atualizarHorarios();

});

setInterval(atualizarHorarios, 60000);

formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const servico = document.querySelector("#servico").value;
    const dataSelecionada = document.querySelector("#data").value;
    const horario = document.querySelector("#horario").value;

    if (nome.length < 3) {
        alert("Digite um nome válido.");
        return;
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
        alert("Digite um nome válido. Use apenas letras.");
        return;
    }
    if (dataSelecionada < hoje) {
        alert("a data não pode ser anterior a hoje.");

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

            alert("Esse horário já passou. Escolha outro horário.");

            return;
        }
    }

    const data = formatarData(dataSelecionada);

    const mensagem = `\u{1F488} *BARBER HOUSE*

Olá! Gostaria de solicitar um agendamento. \u{2702}\u{FE0F}

--------------------
\u{1F464} *Cliente:* ${nome}
\u{2702}\u{FE0F} *Serviço:* ${servico}
\u{1F4C5} *Data:* ${data}
\u{1F550} *Horário:* ${horario}
--------------------

Aguardo a confirmação. Obrigado! \u{1F91D}
`;

    const confirmar = confirm(mensagem);

    if (!confirmar) {
        return;
    }

    const telefone = "5519989599594";

    const url = `https://web.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    formulario.reset();
});