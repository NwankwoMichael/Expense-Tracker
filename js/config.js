export const MIN = 1;
export const MAX = 1000;

/*

Run npm run start if you chose lite-server.

Run npm run dev if you chose Vite.

Run npm run lint to check code quality.

Run npm run format to auto-format with Prettier.

 -------------------------------------------------
|               Expense Tracker                 |
-------------------------------------------------

[ Add Expense Form ]
-------------------------------------------------
| Description: [___________]                    |
| Amount:      [___________]                    |
| Category:    [Food ▼]                         |
| Date:        [DD/MM/YYYY]                     |
| [ Add Expense Button ]                        |
-------------------------------------------------

[ Expense List ]
-------------------------------------------------
| Date       | Description     | Category | Amount | Actions |
|-------------------------------------------------------------|
| 15/02/2026 | Lunch           | Food     | $12.00 | Edit ❏ Delete ✖ |
| 15/02/2026 | Bus Ticket      | Transport| $2.50  | Edit ❏ Delete ✖ |
| ...                                                     ... |
-------------------------------------------------

[ Summary Section ]
-------------------------------------------------
| Total Expenses: $XX.XX                          |
| By Category:                                    |
|   Food       - $YY.YY                           |
|   Transport  - $ZZ.ZZ                           |
|   Utilities  - $AA.AA                           |
-------------------------------------------------

[ Optional Chart ]
-------------------------------------------------
|   [ Pie Chart / Bar Chart showing categories ] |
-------------------------------------------------



🛠️ Expense Tracker Roadmap
Stage 1: Core Functionality
Build the form (description, amount, category, date).

Add expenses to an array and render them in the list.

Implement delete functionality.

Persist data with localStorage.
👉 Goal: A basic tracker where you can add and remove expenses, and they survive page reloads.

Stage 2: Summaries
Calculate total expenses.

Show category breakdowns (Food, Transport, Utilities, etc.).

Display totals in a summary section.
👉 Goal: See not just the list, but also insights into spending.

Stage 3: Editing & Filtering
Add edit functionality (inline editing of description/amount).

Implement filters (by category or date).
👉 Goal: Manage and refine expenses without deleting/re‑adding.

Stage 4: UX Enhancements
Empty state message when no expenses exist.

Add icons for edit/delete (from your assets folder).

Improve responsiveness with flexbox/grid.
👉 Goal: Make the app feel polished and user‑friendly.

Stage 5: Visualization (Optional but powerful)
Integrate a chart (bar or pie) to visualize spending by category.

Use either the Canvas API or a lightweight library like Chart.js.
👉 Goal: Turn raw numbers into clear visual insights.

Stage 6: Advanced Features (Future Ideas)
Export expenses to CSV/JSON.

Add recurring expenses.

Multi‑currency support (using config.js constants).
👉 Goal: Push the project toward real‑world usability.

✅ Why This Roadmap Works
Incremental: You’ll always have a working app at each stage.

Motivating: Each stage adds visible improvements.

Scalable: You can stop at Stage 3 for a solid app, or keep going for advanced features.





🛠️ MVC Breakdown for Expense Tracker
Model (Data Layer)
Handles the data and business logic.

Expense Object Structure:

js
{
  id: Date.now(),        // unique identifier
  description: "Lunch",
  amount: 12.00,
  category: "Food",
  date: "2026-02-15"
}
Responsibilities:

Store expenses in an array.

Save/load expenses from localStorage.

Provide methods: addExpense(), editExpense(), deleteExpense(), getTotal(), getByCategory(), filterByDate().

View (UI Layer)
Handles rendering and user interface updates.

Responsibilities:

Render the form (inputs for description, amount, category, date).

Render the expense list (table or cards).

Render the summary section (totals and category breakdown).

Render the chart (optional).

Show empty state message if no expenses exist.

Methods:

renderExpenses(expenses)

renderSummary(summaryData)

showEmptyState()

updateForm()

Controller (Logic Layer)
Connects Model and View, handles user interactions.

Responsibilities:

Listen for form submissions → call Model.addExpense().

Listen for edit/delete actions → update Model, then refresh View.

On page load → fetch data from Model and render via View.

Handle filters (category/date) → update View accordingly.

Methods:

init() → load data and render initial UI.

handleAddExpense(event)

handleEditExpense(id)

handleDeleteExpense(id)

handleFilter(category/date)

🔑 Flow Example
User submits form → Controller calls Model.addExpense().

Model updates data + saves to localStorage.

Controller calls View.renderExpenses() with updated data.

View updates the UI.

Summary recalculated via Model.getTotal() and Model.getByCategory().

✅ Why This Helps
Keeps your code modular and easy to debug.

You can expand features (like charts or filters) without breaking the core logic.

Mirrors your Task Manager’s structure, so you’ll feel at home while coding.

👉 With this MVC map, you’re ready to start coding the Expense Tracker step by step.



Expense-Tracker/
│
├── index.html          # Entry point
├── style.css           # Global styles
│
├── js/
│   ├── model.js        # Expense data & localStorage logic
│   ├── view.js         # Rendering UI (form, list, summary, chart)
│   ├── controller.js   # Event handling, connects model & view
│   ├── helper.js       # Utility functions (formatting, validation, etc.)
│   ├── config.js       # Constants (categories, currency symbol, etc.)
│
├── assets/
│   ├── icons/          # SVG/PNG icons for edit/delete/category
│   └── images/         # Optional images (empty state, backgrounds)
│
├── LICENSE             # MIT License
├── README.md           # Documentation
└── .gitignore          # Ignore unnecessary files



🔑 How Each File Plays Together
model.js: Manages expense objects, totals, and persistence.

view.js: Renders the form, list, summary, and chart.

controller.js: Handles user actions (add, edit, delete, filter).

helper.js: Shared functions like formatCurrency(), generateId(), validateInput().

config.js: Constants like CATEGORIES = ["Food", "Transport", "Utilities"], CURRENCY = "$".

assets/: Keeps icons/images separate so your code stays clean.

✅ Why This Is Smart
Scalability: You can add features without cluttering core files.

Reusability: Helpers and config can be reused across multiple projects.

Professional polish: This mirrors how production apps are structured.



Helper.js: Perfect place for formatting amounts (currency), validating inputs, or generating unique IDs.

Config.js: Store constants like categories (Food, Transport, Utilities) and currency symbol.

🎯 Tips for Building
Start small: get the form → list → summary working before adding filters or charts.

Use reduce() for totals and category breakdowns — it’s a great way to practice array methods.

Keep accessibility in mind: aria-labels for buttons, focus states for form inputs.

Test persistence early: make sure expenses survive a page reload via localStorage.


📊 When to Use Chart.js
Use it once you’ve got:

Expenses stored and summarized (totals + category breakdowns).

A working summary section that shows numbers clearly.

👉 At that point, Chart.js becomes valuable because you can visualize spending patterns:

Pie chart → percentage of spending by category.

Bar chart → monthly totals or category comparisons.

💡 Heads‑up moment: When you’ve finished Stage 2 (Summaries) and want to make insights more visual, that’s the right time to add Chart.js.

📅 When to Use date‑fns
Bring it in once you start handling dates beyond simple strings:

Filtering expenses by date range (e.g., “show this month’s expenses”).

Formatting dates for display (15/02/2026 → Feb 15, 2026).

Sorting expenses chronologically.

👉 date‑fns shines because it gives you lightweight, modular functions like:

format() → pretty display dates.

isThisMonth() → filter current month’s expenses.

differenceInDays() → calculate gaps between dates.

💡 Heads‑up moment: When you move into Stage 3 (Editing & Filtering), especially with date filters or nicer formatting, that’s when date‑fns becomes essential.

✅ Summary
Chart.js → after you have totals and category breakdowns (Stage 2).

date‑fns → when you add filtering, sorting, or formatting for dates (Stage 3).

This way, you’re not pulling them in prematurely — you’ll integrate them exactly when they add real value.


*/
