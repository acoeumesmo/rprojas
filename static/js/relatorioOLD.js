document.addEventListener("DOMContentLoaded", () => {
    const btnRun = document.getElementById("btn-run");
    const loading = document.getElementById("loading");
    const resultsContainer = document.getElementById("results");

    btnRun.addEventListener("click", async () => {
        loading.style.display = "block";
        resultsContainer.style.display = "none";

        const response = await fetch("/admin/run-analysis", {
            method: "POST"
        });

        const data = await response.json();
        loading.style.display = "none";

        if (!data.success) {
            alert("Erro ao processar: " + data.error);
            return;
        }

        // Carrega dados finais
        loadResults();
    });
});

// =============== BUSCAR DADOS PARA TABELA E GRÁFICO ===============
async function loadResults() {
    const response = await fetch("/api/relatorio-data");
    const json = await response.json();
    const items = json.items;

    const results = document.getElementById("results");
    results.style.display = "block";

    renderTable(items);
    renderChart(items);
    renderSummary(items);
}

// ========== TABELA ==========
function renderTable(items) {
    const tbody = document.querySelector("#table-details tbody");
    tbody.innerHTML = "";

    items.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.Texto || row.texto || ""}</td>
            <td>${row.Sentimento}</td>
            <td>${(row.Confianca * 100).toFixed(2)}%</td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== GRÁFICO ==========
function renderChart(items) {
    const ctx = document.getElementById("chart");

    const counts = {
        "Positivo": items.filter(x => x.Sentimento === "Positivo").length,
        "Negativo": items.filter(x => x.Sentimento === "Negativo").length,
        "Neutro": items.filter(x => x.Sentimento === "Neutro").length,
    };

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts)
            }]
        }
    });
}

// ========== RESUMO ==========
function renderSummary(items) {
    const summary = document.getElementById("summaryList");
    summary.innerHTML = "";

    const total = items.length;
    const pos = items.filter(x => x.Sentimento === "Positivo").length;
    const neg = items.filter(x => x.Sentimento === "Negativo").length;
    const neu = items.filter(x => x.Sentimento === "Neutro").length;

    summary.innerHTML = `
        <li>Total analisado: <b>${total}</b></li>
        <li>Positivos: <b>${pos}</b></li>
        <li>Negativos: <b>${neg}</b></li>
        <li>Neutros: <b>${neu}</b></li>
    `;
}


/*
// Aguarda o documento estar pronto
App.onReady(function() {
  const btn = document.getElementById('btn-run');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  // const emailBtn = document.getElementById('sendEmailBtn');
  // const emailInput = document.getElementById('emailInput');


  async function refresh() {
    try {
      const res = await fetch('/api/relatorio-data');
      if (!res.ok) { results.style.display = 'none'; return; }
      const data = await res.json();
      const items = data.items || [];

      // Cria resumo de sentimentos
      const summary = items.reduce((acc, item) => {
        acc[item.Sentimento] = (acc[item.Sentimento] || 0) + 1;
        return acc;
      }, {});

      // Atualiza lista de resumo
      const labels = Object.keys(summary);
      const values = labels.map(l => summary[l]);
      document.getElementById('summaryList').innerHTML = labels.map(l =>
        `<li>${l}: ${summary[l]} (${((summary[l]/items.length)*100).toFixed(1)}%)</li>`
      ).join('');

      // Atualiza gráfico
      const ctx = document.getElementById('chart').getContext('2d');
      if (window._chart) window._chart.destroy();
      window._chart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data: values, backgroundColor: ['#10b981','#9ca3af','#ef4444'] }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      });

      // Atualiza tabela de detalhes
      const tbody = document.querySelector('#table-details tbody');
      tbody.innerHTML = '';
      items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${(item.texto||'').slice(0,140)}</td><td>${item.Sentimento||''}</td><td>${item.Confianca||''}</td>`;
        tbody.appendChild(tr);
      });

      results.style.display = 'block';
    } catch (e) {
      console.error(e);
    }
  }

  // Evento de clique para rodar a análise
  if (btn) btn.addEventListener('click', async () => {
    btn.disabled = true;
    loading.style.display = 'block';
    try {
      const res = await fetch('/admin/run-analysis', { method: 'POST' });
      if (!res.ok) {
        const txt = await res.text();
        App.showToast('Erro: ' + txt, 'danger');
      } else {
        App.showToast('Análise concluída', 'success');
        await refresh();
      }
    } catch (e) {
      App.showToast('Falha na análise', 'danger');
    } finally {
      btn.disabled = false;
      loading.style.display = 'none';
    }
  });
  
  // Evento de clique para enviar relatório por e-mail 
  if (emailBtn) emailBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!email) {
      App.showToast('Digite um e-mail válido', 'warning');
      return;
    }
    emailBtn.disabled = true;
    try {
      const res = await fetch('/send-report-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) App.showToast('Relatório enviado por e-mail', 'success');
      else App.showToast('Erro ao enviar e-mail', 'danger');
    } catch (e) {
      App.showToast('Erro ao enviar e-mail', 'danger');
    } finally {
      emailBtn.disabled = false;
    }
  });
   

  // Atualiza os dados ao carregar a página
  refresh();
}); */
