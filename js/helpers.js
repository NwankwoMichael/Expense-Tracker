export const getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const formattedDate = function (timestamp) {
  const date = new Date(timestamp);
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return formatted;
};

export const toggler = function (el1, el2, klass1, klass2) {
  el1.classList.toggle(klass1);
  el2.classList.toggle(klass2);
};

export const adder = function (el1, el2, klass1, klass2) {
  el1.classList.add(klass1);
  el2.classList.add(klass2);
};

export const addClass = function (klass, ...elements) {
  elements.forEach((el) => el.classList.add(klass));
};

export const removeClass = function (klass, ...elements) {
  elements.forEach((el) => el.classList.remove(klass));
};

export const hideOverlayAndModals = function (overlay, modal, successMsg) {
  overlay.classList.add("hide");
  modal.classList.add("hide");
  successMsg.classList.add("hidden");
};

export const instigateFilter = function (el1, el2, el3, el4) {
  addClass("hide", el1);
  removeClass("hide", el2);
  addClass("hide", el3);
  addClass("hide", el4);
};

export const undoFilterEffects = function (el1, el2, el3, el4) {
  removeClass("hide", el1);
  addClass("hide", el2);
  removeClass("hide", el3);
  removeClass("hide", el4);
};

export const fetchLocation = async function (url) {
  try {
    const response = await fetch(url);
    const ipAddress = await response.json();
    return ipAddress.country;
  } catch (err) {
    console.error(err);
  }
};

/*

👉 In your Expense Tracker workflow, this would look like:

User opens the app.

App detects country via IP.

App maps country to currency symbol.

Expenses are displayed with that symbol.

User can override in settings if needed.

*/
