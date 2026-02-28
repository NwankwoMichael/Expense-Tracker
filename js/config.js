export const MIN = 1;
export const MAX = 1000;
export const APIKEY = "1a3ddf823d44e1";
export const IPINFO = `https://ipinfo.io/json?token=${APIKEY}`;

/*

Run npm run dev if you chose Vite.

Run npm run lint to check code quality.

Run npm run format to auto-format with Prettier.

🛠️ Expense Tracker Roadmap

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

Helper.js: Perfect place for formatting amounts (currency), validating inputs, or generating unique IDs.

Helpers: formatCurrency()

Config.js: Store constants like categories (Food, Transport, Utilities) and currency symbol.


📅 When to Use date‑fns
Bring it in once you start handling dates beyond simple strings:

Filtering expenses by date range (e.g., “show this month’s expenses”).

Sorting expenses chronologically.

👉 date‑fns shines because it gives you lightweight, modular functions like:

format() → pretty display dates.

isThisMonth() → filter current month’s expenses.

differenceInDays() → calculate gaps between dates.


*/
