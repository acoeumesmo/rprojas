
document.addEventListener("DOMContentLoaded", () => {
    const btnRun = document.getElementById("btn-run");
    const loading = document.getElementById("loading");
    const resultsContainer = document.getElementById("results");

    async function runAnalysis() {
        loading.style.display = "block";
        resultsContainer.style.display = "none";

        const response = await fetch("/admin/run-analysis", {
            method: "POST"
        });

        const data = await response.json();

        loading.style.display = "none";

        if (!data.success) {
            alert("Erro ao executar análise: " + data.error);
            return;
        }

        loadResults();

        if (data.pdf) {
            const link = document.getElementById("download-pdf");
            if (link) {
                link.href = "/download/" + data.pdf;
                link.classList.remove("d-none");
            }
        }
    }

    async function loadResults() {
        const response = await fetch("/api/relatorio-data");
        const json = await response.json();
        const items = json.items;

        resultsContainer.style.display = "block";

        renderTable(items);
        renderSummary(items);
        renderChart(items);
    }

    function renderTable(items) {
        const tbody = document.querySelector("#table-details tbody");
        tbody.innerHTML = "";

        items.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.Texto || row.texto || ""}</td>
                <td>${row.Sentimento || ""}</td>
                <td>${(row.Confianca * 100).toFixed(2)}%</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderSummary(items) {
        const summaryList = document.getElementById("summaryList");
        summaryList.innerHTML = "";

        const total = items.length;
        const pos = items.filter(r => r.Sentimento === "Positivo").length;
        const neg = items.filter(r => r.Sentimento === "Negativo").length;
        const neu = items.filter(r => r.Sentimento === "Neutro").length;

        summaryList.innerHTML = `
            <li>Total: <b>${total}</b></li>
            <li>Positivos: <b>${pos}</b></li>
            <li>Negativos: <b>${neg}</b></li>
            <li>Neutros: <b>${neu}</b></li>
        `;
    }

    function renderChart(items) {
        const ctx = document.getElementById("chart");

        const counts = {
            Positivo: items.filter(r => r.Sentimento === "Positivo").length,
            Negativo: items.filter(r => r.Sentimento === "Negativo").length,
            Neutro: items.filter(r => r.Sentimento === "Neutro").length,
        };

        if (window.chartInstance) {
            window.chartInstance.destroy();
        }

        window.chartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: Object.keys(counts),
                datasets: [
                    {
                        data: Object.values(counts),
                        backgroundColor: ["#22c55e", "#ef4444", "#6b7280"],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" }
                }
            }
        });
    }

    if (btnRun) {
        btnRun.addEventListener("click", runAnalysis);
    }
});
