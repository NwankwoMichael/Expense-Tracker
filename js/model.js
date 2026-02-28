import { getRandomInt, fetchLocation, formattedDate } from "./helpers.js";
import { MIN, MAX, IPINFO } from "./config.js";

// EXTERNAL LIBRARIES
import { format } from "date-fns";

// State object
export const state = {
  expenses: [],
  summary: {
    food: { total: 0, average: 0 },
    utilities: { total: 0, average: 0 },
    transport: { total: 0, average: 0 },
    miscellaneous: { total: 0, average: 0 },
  },
  totalExpensesAmount: 0,
  currencySymbol: "$",
};

// Async function for fetching country code
export const initCurrencySymbol = async function () {
  const countryCode = await fetchLocation(IPINFO);
  state.currencySymbol = currencyMap[countryCode] || "$";
};

// Function for calculating total expenses
export const calculateTotalExpenses = function () {
  return state.expenses.reduce(
    (accumulator, exp) => accumulator + Number(exp.amount),
    0,
  );
};

// Function for calculating total expenses of each category
export const totalExpensesPerCategory = function (category) {
  return state.expenses
    .filter((expense) => expense.category === category)
    .reduce((accumulator, expense) => accumulator + Number(expense.amount), 0);
};

export const updateSummary = function () {
  const categories = Object.keys(state.summary);

  categories.forEach((category) => {
    const filtered = state.expenses.filter((exp) => exp.category === category);
    const sum = filtered.reduce((acc, exp) => acc + Number(exp.amount), 0);
    const avg = filtered.length ? sum / filtered.length : 0;

    state.summary[category].total = sum;
    state.summary[category].average = avg;
  });

  state.totalExpensesAmount = calculateTotalExpenses();
};

// Function for adding expenses
export const addExpenses = function (description, amount, category, date) {
  const expense = {
    id: Date.now() + getRandomInt(MIN, MAX),
    description: description,
    amount: amount,
    category: category,
    date: date,
    timestamp: Date.now(),
  };

  state.expenses.push(expense);

  // refresh state
  updateSummary();
};

// function for updating edited expense
export const updateExpense = function (
  id,
  editedDesc,
  editedAmount,
  editedCat,
  editedDate,
) {
  // Get current expense
  const currentExpense = state.expenses.find((expense) => expense.id === id);

  // If id doesn't match any expese
  if (!currentExpense) {
    console.error("Expense with id ${id} not found");
    return;
  }

  // update description if editedDesc exist
  if (editedDesc) currentExpense.description = editedDesc;

  // update amount if editedAmount exist
  if (editedAmount) currentExpense.amount = +editedAmount;

  // update category if editedCat exist
  if (editedCat) currentExpense.category = editedCat;

  // update logical date regardless
  if (editedDate) currentExpense.date = editedDate;

  // Always refresh timestamp to "last modified"
  currentExpense.timestamp = Date.now();

  // Refresh summary after editing
  updateSummary();
};

// localStorage.clear();

export const getExpenses = function () {
  return state.expenses;
};

// Function for editting expense
export const editExpense = function (id, newDesc, newAmount, newCategory) {
  // Find expense by id
  const curExpense = state.expenses.find((exp) => exp.id === id);
  curExpense.description = newDesc;
  curExpense.amount = +newAmount;
  curExpense.category = newCategory;
};

// Function for deleting expense
export const deleteExpense = function (id) {
  const index = state.expenses.findIndex((exp) => exp.id === id);
  if (index !== -1) state.expenses.splice(index, 1);

  // UPDATE SUMMARY
  updateSummary();
};

export const deleteAllExpenses = function () {
  state.expenses = [];

  // Refresh Summary
  updateSummary();
};

// Persist data
export const persistData = function () {
  localStorage.setItem("expenses", JSON.stringify(state.expenses));
  localStorage.setItem("currencySymbol", state.currencySymbol);
};

export const loadData = function () {
  const expenses = JSON.parse(localStorage.getItem("expenses"));
  const symbol = localStorage.getItem("currencySymbol");

  if (expenses) state.expenses = expenses;
  if (symbol) state.currencySymbol = symbol;
};

// Filter by category function
export const filterByCategory = function (category) {
  if (category === "all") {
    return state.expenses;
  } else {
    return state.expenses.filter((exp) => exp.category === category);
  }
};

// Filter by date function
export const filterByDate = function (dateString) {
  return state.expenses.filter((exp) => {
    const expDate = new Date(exp.timestamp).toLocaleDateString();
    expDate === dateString;
  });
};

export const getMonthlySummary = function () {
  const summary = {};
  state.expenses.forEach((exp) => {
    const monthKey = format(new Date(exp.date), "yyyy-MM");
    if (!summary[monthKey]) summary[monthKey] = 0;
    summary[monthKey] += +exp.amount || 0;
  });
  return summary;
};

export const currencyMap = {
  NG: "₦", // Nigeria → Naira
  GH: "₵", // Ghana → Cedi
  US: "$", // USA → Dollar
  DE: "€", // Germany → Euro
  FR: "€", // France → Euro
  IT: "€", // Italy → Euro
  ES: "€", // Spain → Euro
  GB: "£", // United Kingdom → Pound Sterling
};
