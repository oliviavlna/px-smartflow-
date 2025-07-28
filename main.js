window.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "components/header.html");
  loadComponent("sidebar", "components/sidebar.html");
  loadComponent("footer", "components/footer.html");
});

function loadComponent(id, filepath) {
  fetch(filepath)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    });
}

function toggleRoutingMode() {
  const modeDisplay = document.getElementById("routingMode");
  const toggleBtn = document.getElementById("toggleBtn");
  const manualButtons = document.getElementById("manualButtons");

  if (modeDisplay.textContent === "AI Automatic") {
    modeDisplay.textContent = "Manual";
    toggleBtn.textContent = "Switch to AI";
    manualButtons.style.display = "flex";
    localStorage.setItem("routingMode", "Manual");
  } else {
    modeDisplay.textContent = "AI Automatic";
    toggleBtn.textContent = "Switch to Manual";
    manualButtons.style.display = "none";
    localStorage.setItem("routingMode", "AI");
  }
}

function switchRoute(targetJetty) {
  const isJetty3 = targetJetty === 'Jetty 3';

  document.getElementById('activeRoute').textContent = targetJetty;
  localStorage.setItem("currentRoute", targetJetty); // Kunci agar forecast bisa baca

  const now = new Date().toLocaleString();
  const pressure = document.getElementById('pressure')?.textContent || '-';
  const temperature = document.getElementById('temperature')?.textContent || '-';
  const flowrate = document.getElementById('flowrate')?.textContent || '-';

  // Simpan data ke localStorage untuk forecast dan history
  localStorage.setItem("pressure", pressure);
  localStorage.setItem("temperature", temperature);
  localStorage.setItem("flowrate", flowrate);

  // Simpan log ke history
  const logEntry = {
    time: now,
    jetty: targetJetty,
    pressure,
    temperature,
    flowrate,
    valve: `Buka ke ${targetJetty}`
  };
  let logData = JSON.parse(localStorage.getItem("routingHistory") || "[]");
  logData.unshift(logEntry);
  localStorage.setItem("routingHistory", JSON.stringify(logData));

  // Tambah row ke tabel jika ada
  const tbody = document.getElementById('historyTable');
  if (tbody) {
    const rowHTML = `
      <tr>
        <td>${now}</td>
        <td>${targetJetty}</td>
        <td>${pressure}</td>
        <td>${temperature}</td>
        <td>${flowrate}</td>
        <td>Buka ke ${targetJetty}</td>
      </tr>`;
    tbody.insertAdjacentHTML('afterbegin', rowHTML);
  }

  const btnJetty3 = document.getElementById('btnJetty3');
  const btnJetty1 = document.getElementById('btnJetty1');

  if (btnJetty3 && btnJetty1) {
    btnJetty3.disabled = isJetty3;
    btnJetty1.disabled = !isJetty3;
    btnJetty3.classList.toggle('disabled-button', isJetty3);
    btnJetty1.classList.toggle('disabled-button', !isJetty3);
  }

  showNotification(`✅ Routing switched to ${targetJetty}`);
}

// Optional: fungsi notifikasi popup
function showNotification(message) {
  const notif = document.getElementById("notification");
  if (!notif) return;
  notif.innerText = message;
  notif.style.display = "block";
  setTimeout(() => (notif.style.display = "none"), 3000);
}
