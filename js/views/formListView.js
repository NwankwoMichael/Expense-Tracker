import {
  formattedDate,
  toggler,
  addClass,
  removeClass,
  adder,
  hideOverlayAndModals,
  instigateFilter,
  undoFilterEffects,
} from "../helpers.js";

// DOM ELEMENTS
class FormListView {
  _formEl = document.querySelector(".form");
  _appEl = document.querySelector(".app-container");
  _descriptionEl = document.querySelector("#description");
  _amountEl = document.querySelector("#amount");
  _categoryEl = document.querySelector("#category");
  _dateEl = document.querySelector("#date");
  _listSectionEl = document.querySelector(".list-section");
  _expenseList = document.querySelector(".expense-table");
  _tbodyEl = document.querySelector(".table-body");
  _overlayEl = document.querySelector(".overlay");
  _deleteAllBtnEl = document.querySelector(".btn-delete_all");
  _modalEl = document.querySelector(".modal");
  _successMsgModalEl = document.querySelector(".success-msg-modal");
  _formEditContainerEl = document.querySelector(".form-edit-container");
  _cancelEditBtnEl = document.querySelector(".cancel-edit-btn");
  _editFormEl = document.querySelector(".form-edit");
  _editedDescEl = document.querySelector("#edit-desc");
  _editedAmountEl = document.querySelector("#edit-amount");
  _editedCategoryEl = document.querySelector("#edit-category");
  _editedDateEl = document.querySelector("#edit-date");
  _filterContainerEl = document.querySelector(".filter-container");
  _filterOverlayEl = document.querySelector(".filter-overlay");
  _summarySectionEl = document.querySelector(".summary-section");

  // METHOD FOR GETTING FORM INPUT DATA
  getFormData() {
    const descValue = this._descriptionEl.value;
    const amountValue = this._amountEl.value;
    const categoryValue = this._categoryEl.value;
    const dateValue = this._dateEl.value;

    if (
      descValue === "" ||
      amountValue === "" ||
      categoryValue === "" ||
      dateValue === ""
    )
      return console.error("Empty inputfield");

    return {
      description: descValue,
      amount: +amountValue,
      category: categoryValue,
      date: dateValue,
    };
  }

  formatMarkupCategory(category) {
    const lower = category.toLowerCase();

    if (lower === "miscellaneous") return lower.slice(0, 4);
    else return lower;
  }

  _generateMarkup(data) {
    // Cewate row
    const tr = document.createElement("tr");
    tr.classList.add("expense-row");
    tr.dataset.id = data.id;
    tr.dataset.category = this.formatMarkupCategory(data.category);

    //  Date cell
    const tdDate = document.createElement("td");
    tdDate.classList.add("expense-date");
    tdDate.textContent = formattedDate(data.date);
    tr.append(tdDate);

    // Description cell
    const tdDesc = document.createElement("td");
    tdDesc.classList.add("expense-description");
    tdDesc.textContent = data.description;
    tr.append(tdDesc);

    const tdCategory = document.createElement("td");
    tdCategory.classList.add(
      `expense-category-${this.formatMarkupCategory(data.category)}`,
    );
    tdCategory.textContent = data.category;
    tr.append(tdCategory);

    // Amount cell
    const tdAmount = document.createElement("td");
    tdAmount.classList.add("expense-amount");
    tdAmount.textContent = `#${data.amount}`;
    tr.append(tdAmount);

    // Action cell
    const tdActions = document.createElement("td");
    tdActions.classList.add("expense-actions");

    const btnEdit = document.createElement("button");
    btnEdit.classList.add("btn-edit");
    btnEdit.setAttribute("aria-label", "Edit expense");
    btnEdit.innerHTML = `<i class="fa fa-edit"></i>`;

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("btn-delete");
    btnDelete.setAttribute("aria-label", "Delete expense");
    btnDelete.innerHTML = `<i class="fa fa-trash"></i>`;

    tdActions.append(btnEdit, btnDelete);
    tr.append(tdActions);

    // Return the row node
    return tr;
  }

  clearInputFields(...elements) {
    elements.forEach((el) => (el.value = ""));
  }

  generateSummary(state) {
    const categories = Object.keys(state.summary);

    let html = `
        <h2 class="sub-header">Summary (All Categories)</h2>

       <!-- Overall total -->
         <div class="summary-total">
          <strong>Total Expenses</strong> <span class="currency total-expenses-span">#${state.totalExpensesAmount}</span>
         </div>

         <div class="summary-container">
         <div class=summary-block">
            <h3 class="summary-type">Overall Breakdown</h3>
        <ul class="summary-breakdown">
        `;

    categories.forEach((category) => {
      if (!state.summary) return console.error("State dot summary not found");

      const catData = state.summary[category];
      const percent = state.totalExpensesAmount
        ? ((catData.total / state.totalExpensesAmount) * 100).toFixed(1)
        : 0;

      html += `
              <li class="summary-item expense-category-${this.formatMarkupCategory(category)}">
              <div class="summary-header">
              <span class="category-name">${this.formatMarkupCategory(category)}</span> - 
              <span class="currency">#${catData.total}</span>
              <span class="summary-percent">(${percent}%)</span>
              </div>
              <div class="summary-average">
              Avg per item: <span class="currency">#${catData.average.toFixed(2)}</span>
              </div>
              <div class="summary-bar">
                <div class="summary-bar-fill expense-category-${this.formatMarkupCategory(category)}" style="width:${percent}%"></div>
              </div>
              </li>
              `;
    });

    html += `
              </ul>
            </div>
         `;

    this._summarySectionEl.innerHTML = "";

    this._summarySectionEl.insertAdjacentHTML("beforeend", html);
  }

  generateFilteredSummary(category, state) {
    const capitalized = category[0].toUpperCase() + category.slice(1);

    const html = `
    <h2 class="summary-header">Summary (Filtered: ${capitalized})</h2>
    <div class="summary-total">
    <strong>Total ${capitalized} Expenses</strong> <span class="currency total-expenses-span">${state.summary[category].total.toFixed(2)}</span>
    </div>
    <div class="summary-average">
    Avg per item: <span class="currency">${state.summary[category].average.toFixed(2)}</span>
    </div>
    <div class="summary-bar">
    <div class="summary-bar-fill expense-category-${this.formatMarkupCategory(category)}" style="width:${((state.summary[category].total / state.totalExpensesAmount) * 100).toFixed(1)}%"></div>
    </div>
    <div class="summary-context">
    <small>Overall total accross all categories: #${state.totalExpensesAmount}</small>
    </div>
    `;
    this._summarySectionEl.innerHTML = "";
    this._summarySectionEl.insertAdjacentHTML("beforeend", html);
  }

  // METHODS FOR RENDERING EXPENSE LIST
  reRenderExpenseList(expenses, state) {
    if (expenses.length === 0) {
      // Checking the length of expenses
      this._toggleDeleteAllButton(expenses);
      return;
    }
    const lastExpense = expenses[expenses.length - 1];

    const row = this._generateMarkup(lastExpense);

    this._tbodyEl.appendChild(row);

    // Refresh summary after adding new expense
    this.generateSummary(state);

    this.clearInputFields(
      this._descriptionEl,
      this._amountEl,
      this._categoryEl,
      this._dateEl,
    );

    // Checking the length of expenses
    this._toggleDeleteAllButton(expenses);
  }

  renderAllExpenseList(expenses, state) {
    this._tbodyEl.innerHTML = "";

    expenses.forEach((expense) => {
      // Generate row dynamically
      const row = this._generateMarkup(expense);

      // Append row to tbody
      this._tbodyEl.appendChild(row);
    });

    // Refresh summary after rendering all expenses
    this.generateSummary(state);

    // Checking the length of expenses
    this._toggleDeleteAllButton(expenses);
  }

  renderUpdatedRow(id, expenses, state) {
    // Get the updated expense object
    const updatedExpense = expenses.find((expense) => expense.id === id);
    if (!updatedExpense) return;

    // Get the current row in the DOM
    const curExpenseRow = this._tbodyEl.querySelector(
      `.expense-row[data-id="${id}"]`,
    );
    if (!curExpenseRow) return;

    // Generate new markup for the updated expenses
    const updatedRow = this._generateMarkup(updatedExpense);

    // Replace old row with updated row
    curExpenseRow.replaceWith(updatedRow);

    // Add highligt effect
    const newRow = this._tbodyEl.querySelector(`.expense-row[data-id="${id}"]`);
    newRow.classList.add("updated");

    // remove effect after timeout elaspse
    setTimeout(() => newRow.classList.remove("updated"), 1500);

    // Refresh summary after editing an expense
    this.generateSummary(state);
  }

  renderFilteredExpenseList(category, expenses, state) {
    this._tbodyEl.innerHTML = "";

    const filtered = expenses.filter((exp) => exp.category === category);

    filtered.forEach((exp) => {
      const row = this._generateMarkup(exp);
      this._tbodyEl.appendChild(row);
    });

    this.generateFilteredSummary(category, state);
    this._toggleDeleteAllButton(filtered);
  }

  _toggleDeleteAllButton(expenses) {
    // Checking length of expenses
    if (expenses.length === 0) {
      // inserting an expense not found message
      this._tbodyEl.innerHTML = `
    <tr>
       <td collapse="5" class="no-expense">No expenses found</td>
    </tr>`;

      // Hiding the deleteAll Button
      addClass("hidden", this._deleteAllBtnEl);
    } else {
      const noExpenseRow = this._tbodyEl.querySelector(".no-expense");
      if (noExpenseRow) noExpenseRow.remove();

      // Display the deleteAll button
      removeClass("hidden", this._deleteAllBtnEl);
    }
  }

  displaySuccessModal() {
    this._overlayEl.classList.remove("hide");
    this._modalEl.classList.add("hide");
    this._successMsgModalEl.classList.remove("hidden");
  }

  // HANDLER METHOD FOR FORM SUBMISSION
  addHandlerFormInput(handler) {
    this._formEl.addEventListener("submit", function (e) {
      e.preventDefault();

      const addBtn = e.target.querySelector(".btn-add");
      if (!addBtn) return;
      handler();
    });
  }

  // HANDLER FOR LISTENING FOR THE CLICK OF EDIT && DELETE BUTTON
  addHandlerExpenseListDelegation(handler) {
    this._tbodyEl.addEventListener("click", (e) => {
      let btn, id;
      const editBtn = e.target.closest(".btn-edit");
      const deleteBtn = e.target.closest(".btn-delete");

      if (!editBtn && !deleteBtn) return;

      if (editBtn) {
        // Display edit form
        toggler(this._formEditContainerEl, this._overlayEl, "hidden", "hide");

        // Store expense id in the form container for later
        const row = editBtn.closest(".expense-row");
        this._formEditContainerEl.dataset.id = row.dataset.id;

        // Copy the properties of the current row to the edit form
        const descContent = row.querySelector(
          ".expense-description",
        ).textContent;

        const amountContent = row
          .querySelector(".expense-amount")
          .textContent.slice(1);

        const catContent = row.querySelector(
          `.expense-category-${row.dataset.category}`,
        ).textContent;

        const dateContent = row.querySelector(".expense-date").textContent;

        // converting to ISO format date
        const isoDate = new Date(dateContent).toISOString().slice(0, 10);

        this._editedDescEl.value = descContent;

        this._editedAmountEl.value = amountContent;

        this._editedCategoryEl.value = catContent;

        this._editedDateEl.value = isoDate;

        return;
      }

      if (deleteBtn) {
        btn = "delete";
        id = deleteBtn.closest(".expense-row").dataset.id;
      }
      handler(btn, +id);
    });
  }

  // HANDLER METHOD FOR LISTENING FOR CLICK ON CANCEL BUTTON
  addHandlerCancelEdit() {
    this._cancelEditBtnEl.addEventListener("click", (e) => {
      toggler(this._formEditContainerEl, this._overlayEl, "hidden", "hide");
    });
  }

  // HANDLER METHOD FOR LISTENING FOR CLICKS ON DELETEALL BUTTON
  addHandlerDeleteAllExpenses() {
    this._deleteAllBtnEl.addEventListener("click", (e) => {
      toggler(this._overlayEl, this._modalEl, "hide", "hide");
      addClass("hidden", this._deleteAllBtnEl);
      return;
    });
  }

  // HANDLER METHOD FOR LISTENING FOR WHEN OVERLAY IS CLICKED
  addHandlerOverlay() {
    this._overlayEl.addEventListener("click", (e) => {
      hideOverlayAndModals(
        this._overlayEl,
        this._modalEl,
        this._successMsgModalEl,
      );
      addClass("hidden", this._formEditContainerEl);
      removeClass("hidden", this._deleteAllBtnEl);

      return;
    });
  }

  // HANDLER FOR LISTENING FOR CLICK ON BUTTONS THAT AFFECTS THE MODAL
  addHandlerModal(handler) {
    this._modalEl.addEventListener("click", (e) => {
      const closeModal = e.target.closest(".close-modal");
      const noBtn = e.target.closest(".no-btn");
      const yesBtn = e.target.closest(".yes-btn");

      if (noBtn && yesBtn && closeModal) return;

      if (closeModal) {
        toggler(this._overlayEl, this._modalEl, "hide", "hide");
        removeClass("hidden", this._deleteAllBtnEl);
        return;
      }

      if (noBtn) {
        toggler(this._overlayEl, this._modalEl, "hide", "hide");
        removeClass("hidden", this._deleteAllBtnEl);
        return;
      }

      if (yesBtn) {
        toggler(this._overlayEl, this._modalEl, "hide", "hide");
        this.displaySuccessModal();

        removeClass("hidden", this._deleteAllBtnEl);
      }

      handler();
    });
  }

  // HANDLER FOR LISTENING FOR OK BUTTON CLICK
  addHandlerOkBtn(h) {
    this._successMsgModalEl.addEventListener("click", (e) => {
      const okBtn = e.target.closest(".ok-btn");

      if (!okBtn) return;

      if (okBtn)
        toggler(this._overlayEl, this._successMsgModalEl, "hide", "hidden");
    });
  }

  // Handler for editform submit
  addHandlerEditForm(handler) {
    this._editFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      // e.stopPropagation();
      let id, editedDescription, editedAmount, editedCategory, editedDate;

      // Initialize edit submit btn
      const editSubmitBtn = e.target.querySelector(".edit-submit-btn");

      // Guard clause
      if (!editSubmitBtn) return;

      id = editSubmitBtn.closest(".form-edit-container").dataset.id;

      if (editSubmitBtn) {
        // Updating current with edited inputs
        editedDescription = this._editedDescEl.value;
        editedAmount = this._editedAmountEl.value;
        editedCategory = this._editedCategoryEl.value;
        editedDate = this._editedDateEl.value; ///////// POSSIBLE BUG

        // Checking that atleast one input is filled
        if (
          !editedDescription ||
          !editedAmount ||
          !editedCategory ||
          !editedDate
        )
          return console.error("Empty edited form");

        // Clear edit form input field
        this.clearInputFields(
          this._editedDescEl,
          this._editedAmountEl,
          this._editedCategoryEl,
          this._editedDateEl,
        );

        // Hide overlay and edit form
        adder(this._formEditContainerEl, this._overlayEl, "hidden", "hide");
      }

      handler(+id, editedDescription, editedAmount, editedCategory, editedDate);
    });
  }

  addHandlerFilter(handler) {
    this._filterContainerEl.addEventListener("click", (e) => {
      let btn;
      const filterBtn = e.target.closest(".filter-btn");
      const expenseListHeader = e.target
        .closest(".list-section")
        .querySelector(".sub-header");
      const allBtn = e.target.closest(".all");
      const foodFilterBtn = e.target.closest(".food-filter");
      const utilitiesFilterBtn = e.target.closest(".utilities-filter");
      const transportFilterBtn = e.target.closest(".transport-filter");
      const miscFilterBtn = e.target.closest(".misc-filter");
      const cancelFilterBtn = e.target.closest(".cancel-filter");

      // Guard clause
      if (
        !filterBtn &&
        !allBtn &&
        !foodFilterBtn &&
        !utilitiesFilterBtn &&
        !transportFilterBtn &&
        !miscFilterBtn &&
        !cancelFilterBtn
      )
        return;

      if (filterBtn) {
        // Initiate filter effects
        instigateFilter(
          expenseListHeader,
          this._filterOverlayEl,
          this._deleteAllBtnEl,
          filterBtn,
        );

        // Push the filter overlay up
        this._filterOverlayEl.style.top = "-2rem";

        return;
      }

      if (allBtn) {
        const filterBttn = allBtn
          .closest(".filter-container")
          .querySelector(".filter-btn");

        undoFilterEffects(
          expenseListHeader,
          this._filterOverlayEl,
          this._deleteAllBtnEl,
          filterBttn,
        );

        btn = "all";
      }

      if (foodFilterBtn) btn = "food";

      if (utilitiesFilterBtn) btn = "utilities";

      if (transportFilterBtn) btn = "transport";

      if (miscFilterBtn) btn = "miscellaneous";

      if (cancelFilterBtn) {
        // Initialize filter button
        const filterButton = cancelFilterBtn
          .closest(".filter-overlay")
          .closest(".filter-container")
          .querySelector(".filter-btn");

        // Undo filter effects
        undoFilterEffects(
          expenseListHeader,
          this._filterOverlayEl,
          this._deleteAllBtnEl,
          filterButton,
        );

        btn = "cancel";
      }

      if (btn) handler(btn);
    });
  }

  // HANDLER FOR THE LOAD EVENT
  addHandlerLoadPage(handler) {
    window.addEventListener("load", handler);
  }
}

export default new FormListView();
