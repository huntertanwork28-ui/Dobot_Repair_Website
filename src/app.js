const STORAGE_KEY = "repair-tracking-portal-state-v12";
const SESSION_KEY = "repair-tracking-portal-session-v1";

const seedState = {
  role: "customer",
  selectedTicketId: "RMA-1001",
  users: [
    {
      email: "customer@example.com",
      password: "demo123",
      role: "customer",
      verified: true,
      name: "Demo Customer",
      company: "Acme Packaging"
    },
    {
      email: "engineer@dobot.demo",
      password: "demo123",
      role: "engineer",
      verified: true,
      name: "Demo Engineer",
      company: "Dobot Service"
    },
    {
      email: "admin@dobot.demo",
      password: "demo123",
      role: "admin",
      verified: true,
      name: "Demo Admin",
      company: "Dobot Service"
    }
  ],
  accountRequests: [
    {
      id: "AR-1001",
      company: "Acme Packaging",
      name: "Jordan Lee",
      email: "jordan.lee@acmepackaging.com",
      phone: "+1 555 0104",
      reference: "SO-2026-1048",
      accessType: "Customer",
      notes: "Needs access to the active CR20A repair case.",
      status: "Pending",
      submittedAt: "2026-07-07"
    }
  ],
  parts: [
    { partNumber: "CR20A-VAC-01", description: "Vacuum gripper seal kit", endCustomerPrice: 126, dealerPrice: 88 },
    { partNumber: "CR-CBL-J6", description: "Internal wrist cable assembly", endCustomerPrice: 240, dealerPrice: 168 },
    { partNumber: "VX500-LENS", description: "VX500 replacement lens", endCustomerPrice: 310, dealerPrice: 224 },
    { partNumber: "SAFE-IO-16", description: "Safety I/O terminal block", endCustomerPrice: 95, dealerPrice: 67 }
  ],
  tickets: [
    {
      id: "RMA-1001",
      salesOrder: "SO-2026-1048",
      serialNumber: "DR-CR20A-1129",
      customer: "Acme Packaging",
      customerType: "endCustomer",
      product: "CR20A Palletizing Solution",
      status: "Repair in Progress",
      warrantyStart: "2025-11-18",
      warrantyEnd: "2027-11-18",
      upsTracking: "1Z999AA10123456784",
      upsStatus: "Delivered",
      shippedAt: "2026-07-01",
      deliveredAt: "2026-07-02",
      receivedAt: "2026-07-02",
      repairSlaDays: 5,
      testingDays: 3,
      testingStartedAt: null,
      partsUsed: ["CR20A-VAC-01"],
      timeline: [
        { label: "RMA submitted", detail: "Customer reported unstable pallet pickup.", date: "2026-06-30", done: true },
        { label: "Inbound shipment created", detail: "UPS label issued.", date: "2026-07-01", done: true },
        { label: "Machine received", detail: "UPS delivered to service center. SLA timer started.", date: "2026-07-02", done: true },
        { label: "Diagnosis started", detail: "Engineer confirmed vacuum loss under load.", date: "2026-07-03", done: true },
        { label: "Repair in progress", detail: "Seal kit replacement and leak test underway.", date: "2026-07-07", done: true },
        { label: "Testing", detail: "Three-day test phase starts after repair sign-off.", date: "Pending", done: false }
      ],
      logs: [
        { author: "Engineer", date: "2026-07-03", text: "Initial inspection found vacuum gripper seal wear. No controller alarm history related to motion limits.", photo: null },
        { author: "Engineer", date: "2026-07-07", text: "Seal kit replacement started. Leak test planned after curing period.", photo: null }
      ],
      messages: [
        { author: "Customer", date: "2026-07-02", text: "Please confirm whether this can be completed before next week's production run." }
      ],
      audit: [
        { date: "2026-07-02", text: "System started SLA timer after UPS delivered status." }
      ]
    },
    {
      id: "RMA-1002",
      salesOrder: "SO-2025-0881",
      serialNumber: "DR-CR5A-8830",
      customer: "Northline Automation",
      customerType: "dealer",
      product: "CR5A 3D Vision Bin Picking",
      status: "Testing",
      warrantyStart: "2024-02-20",
      warrantyEnd: "2026-02-20",
      upsTracking: "1Z888BB20234567891",
      upsStatus: "Delivered",
      shippedAt: "2026-06-25",
      deliveredAt: "2026-06-26",
      receivedAt: "2026-06-26",
      repairSlaDays: 5,
      testingDays: 3,
      testingStartedAt: "2026-07-06",
      partsUsed: ["VX500-LENS"],
      timeline: [
        { label: "RMA submitted", detail: "Dealer reported intermittent vision calibration failure.", date: "2026-06-24", done: true },
        { label: "Machine received", detail: "UPS delivered to service center. SLA timer started.", date: "2026-06-26", done: true },
        { label: "Repair completed", detail: "Lens replaced and calibration passed.", date: "2026-07-03", done: true },
        { label: "Testing", detail: "Three-day test phase, not counted against repair SLA.", date: "2026-07-06", done: true }
      ],
      logs: [
        { author: "Engineer", date: "2026-07-03", text: "Replaced lens module and completed 30-cycle pick validation.", photo: null }
      ],
      messages: [],
      audit: []
    }
  ]
};

let state = loadState();
let session = loadSession();

const els = {
  authScreen: document.querySelector("#authScreen"),
  portalApp: document.querySelector("#portalApp"),
  loginForm: document.querySelector("#loginForm"),
  loginEmail: document.querySelector("#loginEmail"),
  loginPassword: document.querySelector("#loginPassword"),
  loginError: document.querySelector("#loginError"),
  authModeTriggers: document.querySelectorAll("[data-auth-mode]"),
  authPanels: document.querySelectorAll(".auth-panel"),
  registrationForm: document.querySelector("#registrationForm"),
  registerCompany: document.querySelector("#registerCompany"),
  registerName: document.querySelector("#registerName"),
  registerEmail: document.querySelector("#registerEmail"),
  registerPassword: document.querySelector("#registerPassword"),
  registerReference: document.querySelector("#registerReference"),
  registerNotes: document.querySelector("#registerNotes"),
  registrationStatus: document.querySelector("#registrationStatus"),
  verificationForm: document.querySelector("#verificationForm"),
  verifyEmail: document.querySelector("#verifyEmail"),
  verifyCode: document.querySelector("#verifyCode"),
  verificationStatus: document.querySelector("#verificationStatus"),
  forgotPasswordForm: document.querySelector("#forgotPasswordForm"),
  forgotEmail: document.querySelector("#forgotEmail"),
  forgotPasswordStatus: document.querySelector("#forgotPasswordStatus"),
  resetPasswordForm: document.querySelector("#resetPasswordForm"),
  resetEmail: document.querySelector("#resetEmail"),
  resetCode: document.querySelector("#resetCode"),
  resetPassword: document.querySelector("#resetPassword"),
  resetPasswordStatus: document.querySelector("#resetPasswordStatus"),
  navItems: document.querySelectorAll(".nav-item"),
  sections: document.querySelectorAll(".section-page"),
  lookupInput: document.querySelector("#lookupInput"),
  lookupButton: document.querySelector("#lookupButton"),
  ticketList: document.querySelector("#ticketList"),
  ticketCount: document.querySelector("#ticketCount"),
  ticketTitle: document.querySelector("#ticketTitle"),
  ticketSubtitle: document.querySelector("#ticketSubtitle"),
  statusPill: document.querySelector("#statusPill"),
  slaPill: document.querySelector("#slaPill"),
  warrantyState: document.querySelector("#warrantyState"),
  warrantyDates: document.querySelector("#warrantyDates"),
  upsState: document.querySelector("#upsState"),
  upsDates: document.querySelector("#upsDates"),
  slaState: document.querySelector("#slaState"),
  slaDates: document.querySelector("#slaDates"),
  chargeState: document.querySelector("#chargeState"),
  chargeDetail: document.querySelector("#chargeDetail"),
  warrantyDetails: document.querySelector("#warrantyDetails"),
  logisticsDetails: document.querySelector("#logisticsDetails"),
  slaStart: document.querySelector("#slaStart"),
  slaWindow: document.querySelector("#slaWindow"),
  testingWindow: document.querySelector("#testingWindow"),
  slaRisk: document.querySelector("#slaRisk"),
  slaRiskDetail: document.querySelector("#slaRiskDetail"),
  timeline: document.querySelector("#timeline"),
  syncUpsButton: document.querySelector("#syncUpsButton"),
  logForm: document.querySelector("#logForm"),
  logText: document.querySelector("#logText"),
  logPhoto: document.querySelector("#logPhoto"),
  repairLogs: document.querySelector("#repairLogs"),
  messageForm: document.querySelector("#messageForm"),
  messageText: document.querySelector("#messageText"),
  messages: document.querySelector("#messages"),
  customerType: document.querySelector("#customerType"),
  bomUpload: document.querySelector("#bomUpload"),
  partsCatalog: document.querySelector("#partsCatalog"),
  accountRequestForm: document.querySelector("#accountRequestForm"),
  requestCompany: document.querySelector("#requestCompany"),
  requestName: document.querySelector("#requestName"),
  requestEmail: document.querySelector("#requestEmail"),
  requestPhone: document.querySelector("#requestPhone"),
  requestReference: document.querySelector("#requestReference"),
  requestAccessType: document.querySelector("#requestAccessType"),
  requestNotes: document.querySelector("#requestNotes"),
  accountRequestStatus: document.querySelector("#accountRequestStatus"),
  accountRequestQueue: document.querySelector("#accountRequestQueue"),
  adminForm: document.querySelector("#adminForm"),
  warrantyEndInput: document.querySelector("#warrantyEndInput"),
  slaDaysInput: document.querySelector("#slaDaysInput"),
  testingDaysInput: document.querySelector("#testingDaysInput"),
  auditLog: document.querySelector("#auditLog"),
  sessionUser: document.querySelector("#sessionUser"),
  sessionRole: document.querySelector("#sessionRole"),
  logoutButton: document.querySelector("#logoutButton")
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return normalizeState(saved || structuredClone(seedState));
  } catch {
    return normalizeState(structuredClone(seedState));
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeState(nextState) {
  return {
    ...structuredClone(seedState),
    ...nextState,
    users: nextState?.users || structuredClone(seedState.users),
    accountRequests: nextState?.accountRequests || structuredClone(seedState.accountRequests),
    parts: nextState?.parts || structuredClone(seedState.parts),
    tickets: nextState?.tickets || structuredClone(seedState.tickets)
  };
}

function loadSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function saveSession(nextSession) {
  session = nextSession;
  if (nextSession) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

function selectedTicket() {
  return state.tickets.find((ticket) => ticket.id === state.selectedTicketId) || state.tickets[0];
}

function findUser(email) {
  return (state.users || []).find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
}

function formatDate(value) {
  if (!value) return "Not set";
  if (value === "Pending") return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function businessDaysBetween(startIso, endIso) {
  if (!startIso || !endIso) return 0;
  const start = new Date(`${startIso}T12:00:00`);
  const end = new Date(`${endIso}T12:00:00`);
  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return Math.max(0, count - 1);
}

function warrantyStatus(ticket) {
  const now = todayIso();
  return now <= ticket.warrantyEnd ? "In warranty" : "Out of warranty";
}

function slaStatus(ticket) {
  if (!ticket.receivedAt) return { label: "Not started", className: "", detail: "Timer starts after machine is received." };
  if (ticket.status === "Testing") {
    return { label: "Testing", className: "", detail: `${ticket.testingDays} testing days, excluded from repair SLA.` };
  }
  const elapsed = businessDaysBetween(ticket.receivedAt, todayIso());
  const remaining = ticket.repairSlaDays - elapsed;
  if (remaining < 0) return { label: `${Math.abs(remaining)} days overdue`, className: "danger", detail: `${elapsed}/${ticket.repairSlaDays} working days used.` };
  if (remaining <= 1) return { label: `${remaining} day left`, className: "warning", detail: `${elapsed}/${ticket.repairSlaDays} working days used.` };
  return { label: `${remaining} days left`, className: "", detail: `${elapsed}/${ticket.repairSlaDays} working days used.` };
}

function chargeSummary(ticket) {
  const key = ticket.customerType === "dealer" ? "dealerPrice" : "endCustomerPrice";
  const total = ticket.partsUsed
    .map((partNumber) => state.parts.find((part) => part.partNumber === partNumber))
    .filter(Boolean)
    .reduce((sum, part) => sum + Number(part[key] || 0), 0);
  if (warrantyStatus(ticket) === "In warranty") {
    return { label: "Warranty review", detail: `$${total.toFixed(2)} parts value, may be covered.` };
  }
  return { label: `$${total.toFixed(2)}`, detail: `${ticket.customerType === "dealer" ? "Dealer" : "End customer"} pricing selected.` };
}

function canEditLog() {
  return state.role === "engineer" || state.role === "admin";
}

function render() {
  renderAuthGate();
  if (!session) return;
  const ticket = selectedTicket();
  renderNavigation();
  renderVisibility();
  renderTicketList();
  renderHeader(ticket);
  renderCards(ticket);
  renderDetailSections(ticket);
  renderTimeline(ticket);
  renderLogs(ticket);
  renderMessages(ticket);
  renderParts(ticket);
  renderAccountRequests();
  renderAdmin(ticket);
}

function renderAuthGate() {
  els.authScreen.classList.toggle("is-hidden", Boolean(session));
  els.portalApp.classList.toggle("is-hidden", !session);
  if (!session) return;
  state.role = session.role;
  els.sessionUser.textContent = session.email;
  els.sessionRole.textContent = session.role;
  els.sessionRole.className = `badge ${session.role}`;
}

function renderNavigation() {
  els.navItems.forEach((button) => {
    const isAdmin = button.classList.contains("admin-nav");
    button.classList.toggle("is-hidden", isAdmin && state.role !== "admin");
  });
  const adminSection = document.querySelector('[data-section="admin"]');
  if (state.role !== "admin" && adminSection?.classList.contains("active")) {
    activateSection("overview");
  }
}

function renderVisibility() {
  document.querySelectorAll(".engineer-only").forEach((node) => {
    node.classList.toggle("is-hidden", state.role !== "engineer" && state.role !== "admin");
  });
  document.querySelectorAll(".engineer-admin-only").forEach((node) => {
    node.classList.toggle("is-hidden", state.role === "customer");
  });
  document.querySelectorAll(".admin-only").forEach((node) => {
    node.classList.toggle("is-hidden", state.role !== "admin");
  });
  document.querySelectorAll(".customer-parts-note").forEach((node) => {
    node.classList.toggle("is-hidden", state.role !== "customer");
  });
  document.querySelectorAll(".customer-log-note").forEach((node) => {
    node.classList.toggle("is-hidden", state.role !== "customer");
  });
}

function renderTicketList() {
  els.ticketCount.textContent = `${state.tickets.length} cases`;
  els.ticketList.innerHTML = state.tickets
    .map((ticket) => `
      <button class="ticket-card ${ticket.id === state.selectedTicketId ? "active" : ""}" data-ticket="${ticket.id}">
        <strong>${ticket.id}</strong>
        <span>${ticket.product}</span>
        <span>${ticket.customer} - ${ticket.status}</span>
      </button>
    `)
    .join("");
}

function renderHeader(ticket) {
  els.ticketTitle.textContent = `${ticket.id} - ${ticket.product}`;
  els.ticketSubtitle.textContent = `${ticket.customer} - ${ticket.salesOrder} - ${ticket.serialNumber}`;
  els.statusPill.textContent = ticket.status;
  const sla = slaStatus(ticket);
  els.slaPill.textContent = sla.label;
  els.slaPill.className = `sla-pill ${sla.className}`;
}

function renderCards(ticket) {
  const warranty = warrantyStatus(ticket);
  const sla = slaStatus(ticket);
  const charge = chargeSummary(ticket);
  els.warrantyState.textContent = warranty;
  els.warrantyDates.textContent = `${formatDate(ticket.warrantyStart)} to ${formatDate(ticket.warrantyEnd)}`;
  els.upsState.textContent = ticket.upsStatus;
  els.upsDates.textContent = `${ticket.upsTracking} - Delivered ${formatDate(ticket.deliveredAt)}`;
  els.slaState.textContent = sla.label;
  els.slaDates.textContent = sla.detail;
  els.chargeState.textContent = charge.label;
  els.chargeDetail.textContent = charge.detail;
}

function renderDetailSections(ticket) {
  const warranty = warrantyStatus(ticket);
  const sla = slaStatus(ticket);
  els.warrantyDetails.innerHTML = detailRows([
    ["Sales order", ticket.salesOrder],
    ["Serial number", ticket.serialNumber],
    ["Customer", ticket.customer],
    ["Product", ticket.product],
    ["Warranty start", formatDate(ticket.warrantyStart)],
    ["Warranty end", formatDate(ticket.warrantyEnd)],
    ["Coverage", warranty]
  ]);
  els.logisticsDetails.innerHTML = detailRows([
    ["UPS tracking", ticket.upsTracking],
    ["UPS status", ticket.upsStatus],
    ["Shipped", formatDate(ticket.shippedAt)],
    ["Delivered", formatDate(ticket.deliveredAt)],
    ["Received", formatDate(ticket.receivedAt)],
    ["SLA trigger", ticket.receivedAt ? "Machine received" : "Waiting for delivery"]
  ]);
  els.slaStart.textContent = formatDate(ticket.receivedAt);
  els.slaWindow.textContent = `${ticket.repairSlaDays} working days`;
  els.testingWindow.textContent = `${ticket.testingDays} calendar days`;
  els.slaRisk.textContent = sla.label;
  els.slaRiskDetail.textContent = sla.detail;
}

function detailRows(rows) {
  return rows.map(([label, value]) => `<dt>${label}</dt><dd>${escapeHtml(String(value || "Not set"))}</dd>`).join("");
}

function renderTimeline(ticket) {
  els.timeline.innerHTML = `<div class="timeline">${ticket.timeline
    .map((item) => `
      <div class="timeline-item ${item.done ? "done" : ""}">
        <div class="timeline-date">${formatDate(item.date)}</div>
        <div class="timeline-copy">
          <strong>${item.label}</strong>
          <span>${item.detail}</span>
        </div>
      </div>
    `)
    .join("")}</div>`;
}

function renderLogs(ticket) {
  els.logForm.querySelector("button").disabled = !canEditLog();
  els.repairLogs.innerHTML = ticket.logs
    .slice()
    .reverse()
    .map((log) => `
      <article class="log-entry">
        <div class="entry-meta">${log.author} - ${formatDate(log.date)}</div>
        <div>${escapeHtml(log.text)}</div>
        ${log.photo ? `<img src="${log.photo}" alt="Repair evidence" />` : ""}
      </article>
    `)
    .join("");
}

function renderMessages(ticket) {
  els.messages.innerHTML = ticket.messages
    .slice()
    .reverse()
    .map((message) => `
      <article class="message-entry">
        <div class="entry-meta">${message.author} - ${formatDate(message.date)}</div>
        <div>${escapeHtml(message.text)}</div>
      </article>
    `)
    .join("");
}

function renderParts(ticket) {
  els.customerType.value = ticket.customerType;
  const priceKey = ticket.customerType === "dealer" ? "dealerPrice" : "endCustomerPrice";
  els.partsCatalog.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Use</th>
          <th>Part number</th>
          <th>Description</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${state.parts
          .map((part) => `
            <tr>
              <td><input type="checkbox" data-part="${part.partNumber}" ${ticket.partsUsed.includes(part.partNumber) ? "checked" : ""} /></td>
              <td>${part.partNumber}</td>
              <td>${part.description}</td>
              <td>$${Number(part[priceKey]).toFixed(2)}</td>
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
  `;
}

function renderAdmin(ticket) {
  els.warrantyEndInput.value = ticket.warrantyEnd;
  els.slaDaysInput.value = ticket.repairSlaDays;
  els.testingDaysInput.value = ticket.testingDays;
  els.auditLog.innerHTML = ticket.audit
    .slice()
    .reverse()
    .map((entry) => `<div class="audit-entry"><div class="entry-meta">${formatDate(entry.date)}</div>${escapeHtml(entry.text)}</div>`)
    .join("");
}

function renderAccountRequests() {
  const requests = state.accountRequests || [];
  els.accountRequestStatus.innerHTML = requests.length
    ? requests
        .slice()
        .reverse()
        .map((request) => accountRequestCard(request, false))
        .join("")
    : `<p class="empty-note">No account requests have been submitted yet.</p>`;

  els.accountRequestQueue.innerHTML = requests.length
    ? requests
        .slice()
        .reverse()
        .map((request) => accountRequestCard(request, true))
        .join("")
    : `<p class="empty-note">No pending account requests.</p>`;
}

function accountRequestCard(request, includeActions) {
  const actions = includeActions
    ? `<div class="request-actions">
        <button class="secondary" data-request-action="Approved" data-request-id="${request.id}">Approve</button>
        <button class="secondary" data-request-action="Rejected" data-request-id="${request.id}">Reject</button>
      </div>`
    : "";
  return `
    <article class="request-card">
      <div class="request-card-header">
        <div>
          <strong>${escapeHtml(request.company)}</strong>
          <span>${escapeHtml(request.name)} - ${escapeHtml(request.email)}</span>
        </div>
        <span class="badge ${request.status.toLowerCase()}">${escapeHtml(request.status)}</span>
      </div>
      <dl class="mini-detail-list">
        <dt>Request ID</dt><dd>${escapeHtml(request.id)}</dd>
        <dt>Access</dt><dd>${escapeHtml(request.accessType)}</dd>
        <dt>Reference</dt><dd>${escapeHtml(request.reference)}</dd>
        <dt>Submitted</dt><dd>${formatDate(request.submittedAt)}</dd>
        <dt>Phone</dt><dd>${escapeHtml(request.phone || "Not provided")}</dd>
        <dt>Notes</dt><dd>${escapeHtml(request.notes || "No notes")}</dd>
      </dl>
      ${actions}
    </article>
  `;
}

function createAccountRequest({ company, name, email, phone = "", reference, accessType = "Customer", notes }) {
  const nextId = `AR-${String(1001 + (state.accountRequests || []).length).padStart(4, "0")}`;
  const request = {
    id: nextId,
    company,
    name,
    email,
    phone,
    reference,
    accessType,
    notes,
    status: "Pending",
    submittedAt: todayIso()
  };
  state.accountRequests = [...(state.accountRequests || []), request];
  selectedTicket().audit.push({ date: todayIso(), text: `Account request submitted: ${request.id}.` });
  saveState();
  return request;
}

function createVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function registerUser({ company, name, email, password, reference, notes }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = findUser(normalizedEmail);
  if (existingUser?.verified) {
    return { error: "An account already exists for this email." };
  }

  const verificationCode = createVerificationCode();
  const user = {
    email: normalizedEmail,
    password,
    role: existingUser?.role || "customer",
    verified: false,
    verificationCode,
    name,
    company
  };

  state.users = existingUser
    ? state.users.map((item) => (item.email.toLowerCase() === normalizedEmail ? { ...item, ...user } : item))
    : [...(state.users || []), user];

  const request = createAccountRequest({
    company,
    name,
    email: normalizedEmail,
    reference,
    notes,
    accessType: "Customer"
  });
  saveState();
  return { request, verificationCode };
}

function activateAuthMode(mode) {
  els.authPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.authPanel === mode);
  });
  if (mode !== "forgot") {
    els.resetPasswordForm.classList.remove("active");
  }
}

function createPasswordReset(email) {
  const user = findUser(email);
  if (!user) return { error: "No account found for this email." };
  if (!user.verified) return { error: "Please verify this email before resetting the password." };
  user.passwordResetCode = createVerificationCode();
  saveState();
  return { resetCode: user.passwordResetCode };
}

function activateSection(sectionName) {
  els.navItems.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === sectionName);
  });
  els.sections.forEach((section) => {
    section.classList.toggle("active", section.dataset.section === sectionName);
  });
}

function selectTicket(ticketId) {
  state.selectedTicketId = ticketId;
  saveState();
  render();
}

function findTicket(query) {
  const q = query.trim().toLowerCase();
  return state.tickets.find((ticket) =>
    [ticket.id, ticket.salesOrder, ticket.serialNumber, ticket.upsTracking].some((value) => value.toLowerCase() === q)
  );
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

async function fileToDataUrl(file) {
  if (!file) return null;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function parseCsv(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

els.authModeTriggers.forEach((button) => {
  button.addEventListener("click", () => {
    activateAuthMode(button.dataset.authMode);
  });
});

els.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = els.loginEmail.value.trim().toLowerCase();
  const password = els.loginPassword.value.trim();
  if (!email || !password) {
    els.loginError.textContent = "Email and password are required.";
    return;
  }
  const user = findUser(email);
  if (!user || user.password !== password) {
    els.loginError.textContent = "Invalid email or password.";
    return;
  }
  if (!user.verified) {
    els.loginError.textContent = "Please verify this email before signing in.";
    return;
  }
  saveSession({ email: user.email, role: user.role });
  state.role = user.role;
  els.loginError.textContent = "";
  els.loginPassword.value = "";
  saveState();
  render();
});

els.logoutButton.addEventListener("click", () => {
  saveSession(null);
  activateSection("overview");
  render();
});

els.registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = registerUser({
    company: els.registerCompany.value.trim(),
    name: els.registerName.value.trim(),
    email: els.registerEmail.value.trim(),
    password: els.registerPassword.value.trim(),
    reference: els.registerReference.value.trim(),
    notes: els.registerNotes.value.trim()
  });
  if (result.error) {
    els.registrationStatus.textContent = result.error;
    return;
  }
  els.verifyEmail.value = els.registerEmail.value.trim().toLowerCase();
  els.registrationForm.reset();
  els.registrationStatus.textContent = `Request ${result.request.id} submitted. Email verification code: ${result.verificationCode}`;
  activateAuthMode("verify");
  renderAuthGate();
});

els.verificationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = els.verifyEmail.value.trim().toLowerCase();
  const code = els.verifyCode.value.trim();
  const user = findUser(email);
  if (!user) {
    els.verificationStatus.textContent = "No account found for this email.";
    return;
  }
  if (user.verified) {
    els.verificationStatus.textContent = "This email is already verified.";
    return;
  }
  if (user.verificationCode !== code) {
    els.verificationStatus.textContent = "Verification code does not match.";
    return;
  }
  user.verified = true;
  delete user.verificationCode;
  selectedTicket().audit.push({ date: todayIso(), text: `Email verified for ${email}.` });
  saveState();
  els.verificationForm.reset();
  els.verificationStatus.textContent = "Email verified. You can now sign in.";
  els.loginEmail.value = email;
  activateAuthMode("signin");
});

els.forgotPasswordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = els.forgotEmail.value.trim().toLowerCase();
  const result = createPasswordReset(email);
  if (result.error) {
    els.forgotPasswordStatus.textContent = result.error;
    els.resetPasswordForm.classList.remove("active");
    return;
  }
  els.resetEmail.value = email;
  els.forgotPasswordStatus.textContent = `Email verification code: ${result.resetCode}`;
  els.resetPasswordForm.classList.add("active");
});

els.resetPasswordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = els.resetEmail.value.trim().toLowerCase();
  const user = findUser(email);
  if (!user) {
    els.resetPasswordStatus.textContent = "No account found for this email.";
    return;
  }
  if (user.passwordResetCode !== els.resetCode.value.trim()) {
    els.resetPasswordStatus.textContent = "Reset code does not match.";
    return;
  }
  user.password = els.resetPassword.value.trim();
  delete user.passwordResetCode;
  selectedTicket().audit.push({ date: todayIso(), text: `Password reset completed for ${email}.` });
  saveState();
  els.resetPasswordForm.reset();
  els.forgotPasswordForm.reset();
  els.resetPasswordForm.classList.remove("active");
  els.loginEmail.value = email;
  els.resetPasswordStatus.textContent = "Password updated. You can now sign in.";
  activateAuthMode("signin");
});

els.navItems.forEach((button) => {
  button.addEventListener("click", () => {
    activateSection(button.dataset.target);
  });
});

els.ticketList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-ticket]");
  if (card) selectTicket(card.dataset.ticket);
});

els.lookupButton.addEventListener("click", () => {
  const ticket = findTicket(els.lookupInput.value);
  if (ticket) {
    selectTicket(ticket.id);
  } else {
    alert("No matching case found.");
  }
});

els.syncUpsButton.addEventListener("click", () => {
  const ticket = selectedTicket();
  ticket.upsStatus = "Delivered";
  ticket.deliveredAt ||= todayIso();
  ticket.receivedAt ||= ticket.deliveredAt;
  ticket.audit.push({ date: todayIso(), text: "UPS tracking synced. Delivered status confirmed and SLA timer checked." });
  saveState();
  render();
});

els.logForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canEditLog()) return;
  const ticket = selectedTicket();
  const text = els.logText.value.trim();
  if (!text) return;
  const photo = await fileToDataUrl(els.logPhoto.files[0]);
  ticket.logs.push({ author: state.role === "admin" ? "Admin" : "Engineer", date: todayIso(), text, photo });
  ticket.audit.push({ date: todayIso(), text: "Repair log added." });
  els.logText.value = "";
  els.logPhoto.value = "";
  saveState();
  render();
});

els.messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ticket = selectedTicket();
  const text = els.messageText.value.trim();
  if (!text) return;
  ticket.messages.push({ author: state.role === "customer" ? "Customer" : state.role, date: todayIso(), text });
  els.messageText.value = "";
  saveState();
  render();
});

els.customerType.addEventListener("change", () => {
  const ticket = selectedTicket();
  ticket.customerType = els.customerType.value;
  ticket.audit.push({ date: todayIso(), text: `Pricing mode changed to ${ticket.customerType}.` });
  saveState();
  render();
});

els.partsCatalog.addEventListener("change", (event) => {
  if (event.target.type !== "checkbox") return;
  const ticket = selectedTicket();
  const partNumber = event.target.dataset.part;
  ticket.partsUsed = event.target.checked
    ? [...new Set([...ticket.partsUsed, partNumber])]
    : ticket.partsUsed.filter((value) => value !== partNumber);
  ticket.audit.push({ date: todayIso(), text: `Parts selection updated: ${partNumber}.` });
  saveState();
  render();
});

els.bomUpload.addEventListener("change", async () => {
  const file = els.bomUpload.files[0];
  if (!file) return;
  const rows = parseCsv(await file.text());
  const [header, ...body] = rows;
  const indexes = Object.fromEntries(header.map((name, index) => [name, index]));
  state.parts = body.map((row) => ({
    partNumber: row[indexes.partNumber] || row[0],
    description: row[indexes.description] || row[1],
    endCustomerPrice: Number(row[indexes.endCustomerPrice] || row[2] || 0),
    dealerPrice: Number(row[indexes.dealerPrice] || row[3] || 0)
  }));
  selectedTicket().audit.push({ date: todayIso(), text: `BOM uploaded from ${file.name}.` });
  saveState();
  render();
});

els.accountRequestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createAccountRequest({
    company: els.requestCompany.value.trim(),
    name: els.requestName.value.trim(),
    email: els.requestEmail.value.trim(),
    phone: els.requestPhone.value.trim(),
    reference: els.requestReference.value.trim(),
    accessType: els.requestAccessType.value,
    notes: els.requestNotes.value.trim()
  });
  els.accountRequestForm.reset();
  render();
});

els.accountRequestQueue.addEventListener("click", (event) => {
  const button = event.target.closest("[data-request-action]");
  if (!button) return;
  const request = (state.accountRequests || []).find((item) => item.id === button.dataset.requestId);
  if (!request) return;
  request.status = button.dataset.requestAction;
  selectedTicket().audit.push({ date: todayIso(), text: `Account request ${request.id} marked ${request.status}.` });
  saveState();
  render();
});

els.adminForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ticket = selectedTicket();
  ticket.warrantyEnd = els.warrantyEndInput.value;
  ticket.repairSlaDays = Number(els.slaDaysInput.value);
  ticket.testingDays = Number(els.testingDaysInput.value);
  ticket.audit.push({ date: todayIso(), text: "Admin updated warranty or SLA settings." });
  saveState();
  render();
});

render();
