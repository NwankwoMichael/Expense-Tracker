# Expense Tracker

A simple expense tracking web application built with **JavaScript**, **Vite**, and **Chart.js**.  
It allows users to add, edit, and delete expenses, filter by category, and view summaries with dynamic charts.

## ✨ Features

- Add, edit, and delete expenses
- Filter expenses by category (Food, Utilities, Transport, Miscellaneous)
- Dynamic summaries:
  - Overall totals
  - Category-specific summaries when filtered
  - Monthly breakdowns
- Interactive charts powered by Chart.js
- Date handling with date-fns
- Clean UI with Font Awesome icons
- Data persistence via localStorage

## 🌐 Live Demo

Check out the hosted version here:  
[Expense Tracker Live](https://nwankwomichael.github.io/Expense-Tracker/)

## 🚀 Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/NwankwoMichael/expense-tracker.git
cd expense-tracker
npm install
```

## 🛠 Tech Stack

Vite – fast dev server and build tool

Chart.js – charts and visualizations

date-fns – date formatting and manipulation

Font Awesome – icons

## 📚 Lessons Learned

MVC-like separation of concerns (Model, View, Controller)

Dynamic rendering for filtered vs. unfiltered states

Data aggregation for charts (categories, monthly summaries)

Debugging common pitfalls (typos, NaN values, filter state resets)

## 🔮 Future Improvements

Sorting & Searching: Allow users to sort expenses by amount/date or search by description.

Custom Categories: Let users create and manage their own categories beyond the defaults.

Export Options: Provide CSV or PDF export of expense data.

UI Enhancements: Add animations, transitions, and improved color coding for categories.

Mobile Responsiveness: Optimize layout for smaller screens.
