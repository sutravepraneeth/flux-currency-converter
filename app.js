const currencies = ["USD","EUR","GBP","INR","JPY","AUD","CAD","CHF","CNY","AED","SGD","NZD"];
const names = {USD:"US Dollar",EUR:"Euro",GBP:"British Pound",INR:"Indian Rupee",JPY:"Japanese Yen",AUD:"Australian Dollar",CAD:"Canadian Dollar",CHF:"Swiss Franc",CNY:"Chinese Yuan",AED:"UAE Dirham",SGD:"Singapore Dollar",NZD:"New Zealand Dollar"};
const $ = id => document.getElementById(id);
const base = $("base"), amount = $("amount"), button = $("convertBtn"), statusText = $("status");
function fillBase() {
  base.innerHTML = "";
  currencies.forEach(code => {
    const opt = document.createElement("option");
    opt.value = code; opt.textContent = `${code} · ${names[code]}`;
    base.appendChild(opt);
  });
}
fillBase();
function formatNumber(n) {
  return new Intl.NumberFormat(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
}
function renderRows(value, baseCode, rates) {
  const tbody = $("results");
  tbody.replaceChildren();
  $("rateBase").textContent = baseCode;
  currencies.forEach((code, index) => {
    const rate = code === baseCode ? 1 : Number(rates[code]);
    const tr = document.createElement("tr");
    tr.style.animationDelay = `${Math.min(index * 25, 250)}ms`;
    const currencyCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "currency-badge"; badge.textContent = code;
    currencyCell.append(badge, document.createTextNode(names[code]));
    const amountCell = document.createElement("td");
    amountCell.textContent = `${formatNumber(value * rate)} ${code}`;
    const rateCell = document.createElement("td");
    rateCell.textContent = `${Number(rate).toPrecision(7)}`;
    tr.append(currencyCell, amountCell, rateCell);
    tbody.appendChild(tr);
  });
}
button.addEventListener("click", async () => {
  const value = Number(amount.value), baseCode = base.value;
  if (!Number.isFinite(value) || value < 0) {
    statusText.textContent = "Enter a valid amount that is zero or greater.";
    amount.focus(); return;
  }
  button.disabled = true;
  button.querySelector("span:first-child").textContent = "Fetching rates…";
  statusText.textContent = "Connecting to the exchange-rate service…";
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(baseCode)}`);
    if (!response.ok) throw new Error(`Service responded with ${response.status}.`);
    const data = await response.json();
    if (data.result !== "success" || !data.rates) throw new Error("Exchange-rate service did not return rates.");
    for (const code of currencies) {
      if (code !== baseCode && !Number.isFinite(Number(data.rates[code]))) throw new Error(`Rate unavailable for ${code}.`);
    }
    renderRows(value, baseCode, data.rates);
    statusText.textContent = `Conversion complete. ${data.time_last_update_utc ? "Rate data updated: " + data.time_last_update_utc : ""}`;
  } catch (error) {
    statusText.textContent = "Could not fetch rates. Check your internet connection and try again.";
    console.error(error);
  } finally {
    button.disabled = false;
    button.querySelector("span:first-child").textContent = "Convert to all currencies";
  }
});
amount.addEventListener("keydown", event => { if (event.key === "Enter") button.click(); });
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  window.deferredInstallPrompt = event;
  $("installBtn").hidden = false;
});
$("installBtn").addEventListener("click", async () => {
  if (!window.deferredInstallPrompt) {
    statusText.textContent = "Open your browser menu and choose Install app or Add to Home Screen.";
    return;
  }
  window.deferredInstallPrompt.prompt();
  await window.deferredInstallPrompt.userChoice;
  window.deferredInstallPrompt = null;
  $("installBtn").hidden = true;
});
window.addEventListener("appinstalled", () => {
  $("installBtn").hidden = true;
  statusText.textContent = "Flux was installed successfully.";
});
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(err => console.warn("Service worker registration failed:",err)));
}
