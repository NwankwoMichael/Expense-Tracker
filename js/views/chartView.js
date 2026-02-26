import Chart from "chart.js/auto";

class ChartView {
  _chartSectionEl = document.querySelector(".chart-section");
  constructor(canvasId) {
    this.ctx = document.getElementById("expenseChart").getContext("2d");
    this.chart = null;
  }

  // Render overall category breakdown (pie chart)
  renderCategoryChart(labels, data) {
    // Clear old chart
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ["#51cf66", "#339af0", "#fcc419", "#845ef7"],
          },
        ],
      },
    });
  }

  // Render monthly totals (Bar chart)
  renderMonthlyChart(labels, data) {
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Monthly Expenses",
            data: data,
            backgroundColor: "#339af0",
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  addHandlerChartBtnSwitch(handler) {
    if (!this._chartSectionEl) console.error("Chart section not found in DOM");
    this._chartSectionEl.addEventListener("click", function (e) {
      const btnCategory = e.target.closest("#btn-category");
      const btnMonthly = e.target.closest("#btn-monthly");

      if (btnCategory) handler("category");

      if (btnMonthly) handler("monthly");
    });
  }
}

export default new ChartView("expenseChart");
