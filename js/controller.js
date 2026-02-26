import * as model from "./model.js";
import chartView from "./views/chartView.js";
import formListView from "./views/formListView.js";

const controlChartView = function (mode = "category") {
  if (model.state.expenses.length === 0) return;

  if (mode === "category") {
    const categories = {
      food: 0,
      utilities: 0,
      transport: 0,
      miscellaneous: 0,
    };
    const category = Object.keys(categories);
    category.forEach((cat) => {
      categories[cat] = model.state.expenses
        .filter((exp) => exp.category === cat)
        .reduce((acc, exp) => acc + exp.amount, 0);
    });

    // Labels = categories
    const labels = Object.keys(categories);

    //   Data = amounts
    const data = Object.values(categories);

    //   Render chart
    chartView.renderCategoryChart(labels, data);
  }

  if (mode === "monthly") {
    // Get monthly summary object via getMonthly
    const summary = model.getMonthlySummary();
    const labels = Object.keys(summary);
    const data = Object.values(summary);

    chartView.renderMonthlyChart(labels, data);
    console.log(labels);
  }
};

const controlFormView = function () {
  // Get form input
  const data = formListView.getFormData();

  if (!data) return;

  //   Add expense to state.expenses && update total expenses
  model.addExpenses(data.description, data.amount, data.category, data.date);

  //   Persist data
  model.persistData();

  //   Render View
  formListView.reRenderExpenseList(model.state.expenses, model.state);

  controlChartView();
};

const controlExpensesDelete = function (btn, id) {
  if (btn == "delete") {
    //    Delete row via it id
    model.deleteExpense(id);

    // Update summary
    model.updateSummary();

    // Pesist state
    model.persistData();

    // Render updated view
    formListView.renderAllExpenseList(model.getExpenses(), model.state);

    // Display chart
    controlChartView();
  }
};

const controlEditForm = function (
  id,
  editedDescription,
  editedAmount,
  editedCategory,
  editedDate,
) {
  // update the expense in state.expenses
  model.updateExpense(
    id,
    editedDescription,
    editedAmount,
    editedCategory,
    editedDate,
  );

  // Refresh summary
  model.updateSummary();

  // Persist data
  model.persistData();

  // Render updated row
  formListView.renderUpdatedRow(id, model.state.expenses, model.state);
};

const controlModal = function () {
  // Delete all expenses
  model.deleteAllExpenses();

  // Update summary
  model.updateSummary();

  // Persist state
  model.persistData();

  // Render View
  formListView.renderAllExpenseList(model.state.expenses, model.state);
};

// Needs fixing
const controlFilter = function (btn) {
  const filterActive = btn === "cancel" || btn === "all" ? false : true;

  if (btn === "cancel" || btn === "all") {
    formListView.renderAllExpenseList(model.state.expenses, model.state);
    return;
  }

  if (filterActive) {
    // Call filterByCategory
    const category = model.filterByCategory(btn);

    // REnder Filtered Expenses
    formListView.renderFilteredExpenseList(
      btn,
      model.state.expenses,
      model.state,
    );
    return;
  }
};

const controlLoadPage = function (state) {
  //   load data
  model.loadData();

  // Add totalAmount per category
  model.updateSummary();

  //   Render view
  formListView.renderAllExpenseList(model.getExpenses(), model.state);

  //   Display chart
  controlChartView();
};

const init = function () {
  formListView.addHandlerFormInput(controlFormView);
  chartView.addHandlerChartBtnSwitch(controlChartView);
  formListView.addHandlerDeleteAllExpenses();
  formListView.addHandlerExpenseListDelegation(controlExpensesDelete);
  formListView.addHandlerEditForm(controlEditForm);
  formListView.addHandlerCancelEdit();
  formListView.addHandlerModal(controlModal);
  formListView.addHandlerOkBtn();
  formListView.addHandlerOverlay();
  formListView.addHandlerFilter(controlFilter);
  formListView.addHandlerLoadPage(controlLoadPage);
};
init();
