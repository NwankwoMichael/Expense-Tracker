import Chart from "chart.js/auto";

class ChartView {
  _chartSectionEl = document.querySelector(".chart-section");
  _chartPlaceholderEl = document.querySelector(".chart-placeholder");
  _canvasEl = document.getElementById("expenseChart");
  _categoryBtnEl = document.getElementById("btn-category");
  _monthlyBtnEl = document.getElementById("btn-monthly");

  constructor(canvasId) {
    this.ctx = this._canvasEl.getContext("2d");
    this.chart = null;
  }

  // Utility: show placeholder message
  _showPlaceholder(message = "No expense yet - add one to see your chart") {
    this._chartPlaceholderEl.textContent = message;
    this._chartPlaceholderEl.classList.remove("fade");
    this._canvasEl.classList.add("fade");
    this._categoryBtnEl.style.display = "none";
    this._monthlyBtnEl.style.display = "none";
  }

  // Utility: clear placeholder and restore canvas
  _clearPlaceholder() {
    this._chartPlaceholderEl.classList.add("fade");
    this._canvasEl.classList.remove("fade");
    this.ctx = this._canvasEl.getContext("2d");
    this._categoryBtnEl.style.display = "block";
    this._monthlyBtnEl.style.display = "block";
  }

  // Render overall category breakdown (pie chart)
  renderCategoryChart(labels, data) {
    if (!data || data.length === 0) {
      this._showPlaceholder();
      return;
    }

    this._clearPlaceholder();

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
    if (!data || data.length === 0) {
      this._showPlaceholder();
      return;
    }

    this._clearPlaceholder();

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
