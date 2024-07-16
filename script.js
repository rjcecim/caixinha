document.getElementById('investmentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const valorInvestidoElement = document.getElementById('valorInvestido');
    const dataInvestimentoElement = document.getElementById('dataInvestimento');
    const cdiAnualElement = document.getElementById('cdiAnual');

    const valorInvestido = parseFloat(valorInvestidoElement.value.replace(/[^0-9,-]+/g, '').replace(',', '.'));
    const dataInvestimento = new Date(dataInvestimentoElement.value);
    const cdiAnual = parseFloat(cdiAnualElement.value.replace(/[^0-9,-]+/g, '').replace(',', '.')) / 100;

    const impostoRenda = 0.225;
    const diasUteisAno = 252;

    // Calculando a taxa de rendimento diário
    const taxaDiaria = Math.pow(1 + cdiAnual, 1 / diasUteisAno) - 1;

    let rendimentoDiarioBruto = valorInvestido * taxaDiaria;
    let rendimentoDiarioLiquido = rendimentoDiarioBruto * (1 - impostoRenda);

    const projectionList = document.getElementById('projectionList');
    projectionList.innerHTML = '';

    // Lista de feriados nacionais (ano de exemplo: 2024)
    const feriados = [
        '2024-01-01', // Confraternização Universal
        '2024-02-12', // Carnaval
        '2024-02-13', // Carnaval
        '2024-04-19', // Sexta-feira Santa
        '2024-04-21', // Tiradentes
        '2024-05-01', // Dia do Trabalho
        '2024-06-20', // Corpus Christi
        '2024-09-07', // Independência do Brasil
        '2024-10-12', // Nossa Senhora Aparecida
        '2024-11-02', // Finados
        '2024-11-15', // Proclamação da República
        '2024-12-25'  // Natal
    ].map(date => new Date(date));

    // Função para verificar se é um dia útil
    function isDiaUtil(date) {
        const day = date.getDay();
        const isFeriado = feriados.some(feriado => 
            feriado.getDate() === date.getDate() &&
            feriado.getMonth() === date.getMonth() &&
            feriado.getFullYear() === date.getFullYear()
        );
        return day !== 0 && day !== 6 && !isFeriado; // 0 = domingo, 6 = sábado, exclui feriados
    }

    // Calcular a última data do mês seguinte
    const ultimoDiaProximoMes = new Date(dataInvestimento.getFullYear(), dataInvestimento.getMonth() + 2, 0);

    // Gerar projeção para os próximos dias úteis até o último dia do mês seguinte
    let dataAtual = new Date(dataInvestimento);
    let diasContados = 0;
    while (dataAtual <= ultimoDiaProximoMes) {
        dataAtual.setDate(dataAtual.getDate() + 1);
        if (isDiaUtil(dataAtual)) {
            diasContados++;
            const rendimentoAcumulado = rendimentoDiarioLiquido * diasContados;

            const listItem = document.createElement('li');
            listItem.textContent = `Dia ${dataAtual.toLocaleDateString()}: R$ ${rendimentoAcumulado.toFixed(2)}`;
            projectionList.appendChild(listItem);
        }
    }

    // Restaurar os valores das entradas
    valorInvestidoElement.value = 'R$ ' + valorInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    cdiAnualElement.value = (cdiAnual * 100).toFixed(2).replace('.', ',') + '%';
});

document.getElementById('valorInvestido').addEventListener('input', function(event) {
    let value = event.target.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2) + '';
    value = value.replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    event.target.value = 'R$ ' + value;
});

document.getElementById('cdiAnual').addEventListener('input', function(event) {
    let value = event.target.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2) + '';
    value = value.replace(".", ",");
    event.target.value = value + '%';
});
