/* ==========================================================================
   ANAND PORTFOLIO OS: PREMIUM PERSONAL PORTFOLIO LOGIC (app.js)
   ========================================================================== */

const GITHUB_USERNAME = "Anandsirigiri07";

// Local state cache
let workstationData = {
  status: {
    text: "Solving heap allocations & contribution streams",
    indicator: "online",
    updatedAt: new Date().toISOString()
  },
  metrics: {
    coffeeCount: 2,
    currentFocus: "Java Algorithms & Active Contributor Streams",
    commitsToday: 3
  },
  currentlyBuilding: [],
  workStream: []
};

let activeReposList = []; // Original repos cache

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initPreloader();
  initCommandPalette();
  initEditModal();
  initCliTerminal();
  syncWorkstationData();
});

/* ==========================================================================
   MODULE 1: THEME STATE MANAGER
   ========================================================================== */
function initThemeManager() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('anand_systems_theme') || 'dark';
  applyTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  });
}

function applyTheme(theme) {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    if (toggleBtn) {
      toggleBtn.innerHTML = `<span class="material-symbols-outlined text-lg">dark_mode</span>`;
      toggleBtn.setAttribute('title', 'Switch to Dark Mode');
    }
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    if (toggleBtn) {
      toggleBtn.innerHTML = `<span class="material-symbols-outlined text-lg">light_mode</span>`;
      toggleBtn.setAttribute('title', 'Switch to Light Mode');
    }
  }
  localStorage.setItem('anand_systems_theme', theme);
  document.dispatchEvent(new CustomEvent('themechanged', { detail: { theme } }));
}

/* ==========================================================================
   MODULE 2: SYSTEMS SYNC PRELOADER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');
  const title = document.getElementById('preloader-typed-title');
  if (!preloader || !bar || !title) return;

  const slides = [
    "> Retrieving developer metrics...",
    "> Fetching original GitHub repositories...",
    "> Workspace online. Resume loaded."
  ];

  let currentSlide = 0;
  let progress = 0;

  const slideInterval = setInterval(() => {
    currentSlide++;
    if (currentSlide < slides.length) {
      title.style.opacity = '0';
      setTimeout(() => {
        title.innerText = slides[currentSlide];
        title.style.opacity = '1';
      }, 150);
    } else {
      clearInterval(slideInterval);
    }
  }, 300);

  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 12;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 300);
      }, 150);
    }
    bar.style.width = `${progress}%`;
  }, 35);

  title.style.transition = 'opacity 0.2s ease';
}

/* ==========================================================================
   MODULE 3: REAL-TIME DATA PROVIDER & SYNC
   ========================================================================== */
async function syncWorkstationData() {
  try {
    const response = await fetch('/api/data');
    if (response.ok) {
      workstationData = await response.json();
    } else {
      loadLocalStorageFallback();
    }
  } catch (error) {
    console.warn("Express backend offline. Loading client local storage fallback.", error);
    loadLocalStorageFallback();
  }

  updateTelemetryUI();
  renderCurrentlyBuilding();
  renderWorkStreamFeed();

  // Load and filter GitHub repos
  await syncGithubMetrics();
}

function loadLocalStorageFallback() {
  const local = localStorage.getItem('anand_workstation_data');
  if (local) {
    try {
      workstationData = JSON.parse(local);
    } catch (e) {
      console.error("Failed to parse local storage data:", e);
    }
  }
}

async function saveWorkstationData() {
  workstationData.status.updatedAt = new Date().toISOString();

  // Save to local storage first
  localStorage.setItem('anand_workstation_data', JSON.stringify(workstationData));

  // POST save endpoint
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workstationData)
    });

    if (response.ok) {
      const result = await response.json();
      workstationData = result.data;
      appendTerminalMessage("System config successfully saved to portfolio database.");
    } else {
      appendTerminalMessage("Warning: Server refused saving. Kept in browser memory.");
    }
  } catch (error) {
    console.warn("Failed to POST save. Kept in local browser cache.", error);
    appendTerminalMessage("Saved configuration to browser cache.");
  }

  updateTelemetryUI();
  renderCurrentlyBuilding();
  renderWorkStreamFeed();
}

/* ==========================================================================
   MODULE 4: TELEMETRY & LAYOUT RENDERERS
   ========================================================================== */
function updateTelemetryUI() {
  const headerIndicator = document.getElementById('header-status-indicator');
  const telemetryLight = document.getElementById('telemetry-status-light');
  const indType = workstationData.status.indicator || 'online';

  [headerIndicator, telemetryLight].forEach(el => {
    if (!el) return;
    el.className = `pulse-indicator ${indType}`;
  });

  const statusText = document.getElementById('telemetry-status-text');
  if (statusText) statusText.innerText = workstationData.status.text;

  const focusText = document.getElementById('telemetry-current-focus');
  if (focusText) focusText.innerText = workstationData.metrics.currentFocus;

  const coffeeText = document.getElementById('telemetry-coffee-count');
  if (coffeeText) coffeeText.innerText = `${workstationData.metrics.coffeeCount} cup${workstationData.metrics.coffeeCount === 1 ? '' : 's'}`;

  const commitsText = document.getElementById('telemetry-commits-today');
  if (commitsText) commitsText.innerText = `${workstationData.metrics.commitsToday} today`;

  const updatedText = document.getElementById('telemetry-updated-at');
  if (updatedText) updatedText.innerText = `UPDATED ${formatTimeAgo(workstationData.status.updatedAt).toUpperCase()}`;
}

function renderCurrentlyBuilding() {
  const container = document.getElementById('currently-building-list');
  if (!container) return;

  if (!workstationData.currentlyBuilding || workstationData.currentlyBuilding.length === 0) {
    container.innerHTML = `<div class="text-xs font-mono text-zinc-500 col-span-2">No active build operations.</div>`;
    return;
  }

  container.innerHTML = "";

  workstationData.currentlyBuilding.forEach(proj => {
    const card = document.createElement('div');
    card.className = "portfolio-card p-5 flex flex-col justify-between h-auto gap-4";

    const isHigh = proj.progress > 70;
    const progressColor = isHigh ? 'text-[var(--accent-secondary)]' : 'text-[var(--accent)]';
    const progressBg = isHigh ? 'bg-[var(--accent-secondary)]' : 'bg-[var(--accent)]';

    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="text-xs font-bold text-[var(--text-primary)] font-mono flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full ${progressBg} animate-pulse"></span>
              <span>${proj.name}</span>
            </h4>
          </div>
          <span class="px-2 py-0.5 rounded text-[8px] font-mono border border-[var(--border)] bg-zinc-950/20 text-zinc-400 uppercase">${proj.tag || 'Active'}</span>
        </div>
        <p class="text-[11px] text-[var(--text-secondary)] leading-relaxed">${proj.status}</p>
      </div>

      <div class="space-y-1.5">
        <div class="flex justify-between items-center text-[10px] font-mono">
          <span class="text-zinc-500 text-[9px] uppercase">progress</span>
          <span class="${progressColor} font-bold">${proj.progress}%</span>
        </div>
        <div class="w-full h-1 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/40">
          <div class="h-full rounded-full ${progressBg}" style="width: ${proj.progress}%;"></div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderWorkStreamFeed() {
  const container = document.getElementById('latest-activity-feed');
  if (!container) return;

  if (!workstationData.workStream || workstationData.workStream.length === 0) {
    container.innerHTML = `<div class="text-xs font-mono text-zinc-500">> Activity log empty.</div>`;
    return;
  }

  container.innerHTML = "";

  workstationData.workStream.forEach(log => {
    const timeAgo = formatTimeAgo(log.timestamp);
    const catColors = {
      feature: "text-blue-400 border-blue-400/30 bg-blue-500/10",
      bugfix: "text-red-400 border-red-400/30 bg-red-500/10",
      dsa: "text-green-400 border-green-400/30 bg-green-500/10",
      learning: "text-cyan-400 border-cyan-400/30 bg-cyan-500/10"
    };
    const colorClass = catColors[log.category.toLowerCase()] || "text-zinc-400 border-zinc-700 bg-zinc-800/20";

    const row = document.createElement('div');
    row.className = "pb-2.5 border-b border-[var(--border)]/60 last:border-b-0 flex items-start gap-3 leading-relaxed text-[11px]";

    row.innerHTML = `
      <span class="text-zinc-600 shrink-0 font-mono pt-0.5">></span>
      <div class="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span class="text-[var(--text-secondary)] font-mono">
          <span class="px-1.5 py-0.5 border text-[8px] font-bold rounded uppercase ${colorClass} mr-1.5 font-sans">${log.category}</span>
          ${log.text}
        </span>
        <span class="text-zinc-500 font-mono text-[9px] shrink-0 sm:text-right">${timeAgo}</span>
      </div>
    `;

    container.appendChild(row);
  });
}

/* ==========================================================================
   MODULE 5: GITHUB INTEGRATION (FILTERING FORKS OUT)
   ========================================================================== */
const USER_FALLBACK_REPOS = [
  {
    name: "portfolio",
    fork: false,
    stargazers_count: 0,
    language: "HTML",
    description: "Sleek professional portfolio displaying live status nodes and filtered codebase integrations.",
    updated_at: "2026-06-10T12:00:00Z",
    html_url: `https://github.com/${GITHUB_USERNAME}/portfolio`
  },
  {
    name: "NagrikSathi",
    fork: false,
    stargazers_count: 0,
    language: "TypeScript",
    description: "Citizen assistance portal mapping administrative public requests and routing feedbacks.",
    updated_at: "2026-05-09T16:17:38Z",
    html_url: `https://github.com/${GITHUB_USERNAME}/NagrikSathi`
  },
  {
    name: "pockethealth-ai",
    fork: false,
    stargazers_count: 0,
    language: "TypeScript",
    description: "Offline health diagnostic analyzer checking symptoms locally using LLM integrations.",
    updated_at: "2026-05-04T08:26:28Z",
    html_url: `https://github.com/${GITHUB_USERNAME}/pockethealth-ai`
  },
  {
    name: "SikshanMitra",
    fork: false,
    stargazers_count: 0,
    language: "JavaScript",
    description: "Collaborative school classroom scheduler, task monitor and dashboard.",
    updated_at: "2026-06-06T08:47:37Z",
    html_url: `https://github.com/${GITHUB_USERNAME}/SikshanMitra`
  },
  {
    name: "voteready-app",
    fork: false,
    stargazers_count: 0,
    language: "TypeScript",
    description: "Democratic voter coordinator providing local polling booth location coordinates.",
    updated_at: "2026-04-29T12:21:15Z",
    html_url: `https://github.com/${GITHUB_USERNAME}/voteready-app`
  },
  {
    name: "ACP_Mini_project",
    fork: false,
    stargazers_count: 0,
    language: "C",
    description: "Assorted core computer programming utilities and logical structures in C.",
    updated_at: "2026-06-09T10:00:00Z",
    html_url: `https://github.com/${GITHUB_USERNAME}/ACP_Mini_project`
  }
];

async function syncGithubMetrics() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    if (res.ok) {
      const rawRepos = await res.json();
      // STAGE FILTER: STRICTLY REMOVE FORKED REPOSITORIES
      activeReposList = rawRepos.filter(r => r.fork === false);
    } else {
      activeReposList = USER_FALLBACK_REPOS;
    }
  } catch (e) {
    activeReposList = USER_FALLBACK_REPOS;
  }

  // Filter out any other unwanted test repos if necessary
  const blacklistedNames = ["my1strepo", "introtogitgithub-anandsirigiri07"];
  activeReposList = activeReposList.filter(r => !blacklistedNames.includes(r.name.toLowerCase()));

  renderFeaturedProjects();
  renderLanguagesChart();
}

function renderFeaturedProjects() {
  const container = document.getElementById('featured-projects-grid');
  if (!container) return;

  container.innerHTML = "";

  // Render top 4 original repos
  const featured = activeReposList.slice(0, 4);

  featured.forEach(repo => {
    const dateFormatted = formatDate(repo.updated_at);
    const primaryLang = repo.language || "HTML";
    const colorBg = getLanguageBgColorClass(primaryLang);

    const card = document.createElement('div');
    card.className = "portfolio-card p-5 flex flex-col justify-between h-auto gap-4";
    
    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between items-start font-mono">
          <h4 class="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-zinc-500">folder</span>
            <span>${repo.name}</span>
          </h4>
          <span class="text-[9px] text-zinc-500">${dateFormatted}</span>
        </div>
        <p class="text-[11px] text-[var(--text-secondary)] leading-relaxed h-10 overflow-hidden line-clamp-2">${repo.description || "Self-authored codebase repository."}</p>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-[var(--border)] mt-auto text-[10px] font-mono">
        <span class="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <span class="w-2 h-2 rounded-full ${colorBg}"></span>
          <span>${primaryLang}</span>
        </span>
        <a href="${repo.html_url}" target="_blank" class="text-[var(--accent)] hover:underline flex items-center gap-0.5 font-bold">
          <span>SOURCE</span>
          <span class="material-symbols-outlined text-[10px]">arrow_forward</span>
        </a>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderLanguagesChart() {
  const container = document.getElementById('languages-chart-container');
  if (!container) return;

  const counts = {};
  let total = 0;

  activeReposList.forEach(repo => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
      total++;
    }
  });

  if (total === 0) {
    container.innerHTML = `<div class="text-xs text-zinc-500 font-mono">No data available.</div>`;
    return;
  }

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  container.innerHTML = "";

  sorted.forEach(([lang, count]) => {
    const pct = Math.round((count / total) * 100);
    const colorBg = getLanguageBgColorClass(lang);

    const row = document.createElement('div');
    row.className = "space-y-1";

    row.innerHTML = `
      <div class="flex justify-between items-center text-[10px] font-mono">
        <span class="text-[var(--text-secondary)]">${lang}</span>
        <span class="text-zinc-500">${pct}%</span>
      </div>
      <div class="w-full h-1 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/40">
        <div class="h-full rounded-full ${colorBg}" style="width: ${pct}%"></div>
      </div>
    `;
    container.appendChild(row);
  });
}

/* ==========================================================================
   MODULE 6: CENTERED EDIT MODAL
   ========================================================================== */
function initEditModal() {
  const modal = document.getElementById('edit-modal-overlay');
  const trigger = document.getElementById('admin-panel-trigger');
  const doubleClickTarget = document.getElementById('live-status-card');
  const closeBtn = document.getElementById('edit-modal-close');
  const cancelBtn = document.getElementById('edit-modal-cancel');
  const saveBtn = document.getElementById('admin-save-btn');

  if (!modal || !trigger || !closeBtn || !cancelBtn || !saveBtn) return;

  const openModal = () => {
    modal.classList.add('open');
    populateModalFields();
  };

  const closeModal = () => {
    modal.classList.remove('open');
  };

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Double click live status card to trigger edit modal
  if (doubleClickTarget) {
    doubleClickTarget.addEventListener('dblclick', openModal);
  }

  function populateModalFields() {
    document.getElementById('admin-status-text').value = workstationData.status.text;
    document.getElementById('admin-status-indicator').value = workstationData.status.indicator;
    document.getElementById('admin-coffee-count').value = workstationData.metrics.coffeeCount;
    document.getElementById('admin-commits-today').value = workstationData.metrics.commitsToday;
    document.getElementById('admin-current-focus').value = workstationData.metrics.currentFocus;

    const projContainer = document.getElementById('admin-projects-list');
    projContainer.innerHTML = "";

    workstationData.currentlyBuilding.forEach((proj, idx) => {
      const pDiv = document.createElement('div');
      pDiv.className = "p-3 bg-zinc-950/20 border border-[var(--border)] rounded-xl space-y-2 text-[11px]";

      pDiv.innerHTML = `
        <div class="flex justify-between items-center font-mono">
          <span class="text-[10px] text-[var(--accent)] font-bold">${proj.name}</span>
          <input type="text" id="admin-proj-tag-${idx}" class="text-[9px] bg-zinc-950 border border-[var(--border)] px-1.5 py-0.5 rounded text-zinc-300 w-16" value="${proj.tag || 'Active'}">
        </div>
        
        <div class="space-y-1">
          <label class="text-[9px] text-zinc-500 block">Status details</label>
          <input type="text" id="admin-proj-status-${idx}" class="portfolio-input" value="${proj.status}">
        </div>

        <div class="space-y-1">
          <div class="flex justify-between text-[9px] text-zinc-500 font-mono">
            <span>Progress Gauge</span>
            <span id="admin-proj-prog-val-${idx}" class="font-bold text-[var(--text-primary)]">${proj.progress}%</span>
          </div>
          <input type="range" id="admin-proj-prog-${idx}" min="0" max="100" class="portfolio-slider" value="${proj.progress}" oninput="document.getElementById('admin-proj-prog-val-${idx}').innerText = this.value + '%'">
        </div>
      `;

      projContainer.appendChild(pDiv);
    });
  }

  saveBtn.addEventListener('click', () => {
    workstationData.status.text = document.getElementById('admin-status-text').value.trim();
    workstationData.status.indicator = document.getElementById('admin-status-indicator').value;
    workstationData.metrics.coffeeCount = parseInt(document.getElementById('admin-coffee-count').value) || 0;
    workstationData.metrics.commitsToday = parseInt(document.getElementById('admin-commits-today').value) || 0;
    workstationData.metrics.currentFocus = document.getElementById('admin-current-focus').value.trim();

    workstationData.currentlyBuilding.forEach((proj, idx) => {
      const status = document.getElementById(`admin-proj-status-${idx}`).value.trim();
      const progress = parseInt(document.getElementById(`admin-proj-prog-${idx}`).value) || 0;
      const tag = document.getElementById(`admin-proj-tag-${idx}`).value.trim();

      proj.status = status;
      proj.progress = progress;
      proj.tag = tag;
    });

    saveWorkstationData();
    closeModal();
  });
}

/* ==========================================================================
   MODULE 7: INTERACTIVE CONSOLE
   ========================================================================== */
function initCliTerminal() {
  const input = document.getElementById('cli-input');
  const history = document.getElementById('cli-terminal-history');
  const terminalBody = document.getElementById('cli-terminal-body');

  if (!input || !history || !terminalBody) return;

  terminalBody.addEventListener('click', () => {
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const commandLine = input.value.trim();
      input.value = "";
      
      if (commandLine.length === 0) return;
      
      parseConsoleCommand(commandLine);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });
}

function appendTerminalMessage(htmlText) {
  const history = document.getElementById('cli-terminal-history');
  const terminalBody = document.getElementById('cli-terminal-body');
  if (!history || !terminalBody) return;

  const row = document.createElement('div');
  row.className = "pl-3 text-zinc-500 font-mono text-[11px] leading-relaxed";
  row.innerHTML = `> ${htmlText}`;
  history.appendChild(row);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function parseConsoleCommand(rawCmd) {
  const history = document.getElementById('cli-terminal-history');
  if (!history) return;

  const promptRow = document.createElement('div');
  promptRow.className = "flex items-center text-[var(--text-primary)] font-mono text-[11px] font-semibold pt-1";
  promptRow.innerHTML = `<span class="text-[var(--accent)] mr-2">sirigiri:~$</span><span>${escapeHtml(rawCmd)}</span>`;
  history.appendChild(promptRow);

  const tokens = rawCmd.split(' ');
  const cmd = tokens[0].toLowerCase();
  
  switch(cmd) {
    case 'help':
      appendTerminalMessage(`
        <div class="text-[var(--text-primary)] font-bold">Commands manual:</div>
        <div class="grid grid-cols-2 max-w-sm pl-2 gap-y-0.5 text-[10px]">
          <span class="text-[var(--accent)] font-bold">coffee++ / commits++</span>
          <span class="text-zinc-500">- increment metrics</span>
          
          <span class="text-[var(--accent)] font-bold">status [online|busy|offline] "[msg]"</span>
          <span class="text-zinc-500">- change live status</span>
          
          <span class="text-[var(--accent)] font-bold">focus "[focus text]"</span>
          <span class="text-zinc-500">- update current focus</span>
          
          <span class="text-[var(--accent)] font-bold">log "[log text]"</span>
          <span class="text-zinc-500">- add event log</span>
          
          <span class="text-[var(--accent)] font-bold">admin</span>
          <span class="text-zinc-500">- toggle edit settings modal</span>
          
          <span class="text-[var(--accent)] font-bold">repos / skills</span>
          <span class="text-zinc-500">- list code bases & percentages</span>
          
          <span class="text-[var(--accent)] font-bold">theme / clear</span>
          <span class="text-zinc-500">- toggle layout / wipe console</span>
        </div>
      `);
      break;

    case 'coffee++':
      workstationData.metrics.coffeeCount++;
      saveWorkstationData();
      appendTerminalMessage(`Coffee count incremented: <span class="text-[var(--text-primary)] font-bold">${workstationData.metrics.coffeeCount} cups</span>.`);
      break;

    case 'commits++':
      workstationData.metrics.commitsToday++;
      saveWorkstationData();
      appendTerminalMessage(`Commits today incremented: <span class="text-[var(--text-primary)] font-bold">${workstationData.metrics.commitsToday} commits</span>.`);
      break;

    case 'status':
      if (tokens.length < 3) {
        appendTerminalMessage(`<span class="text-red-400">Syntax: status [online|busy|offline] "Activity details..."</span>`);
        return;
      }
      const ind = tokens[1].toLowerCase();
      if (!['online', 'busy', 'offline'].includes(ind)) {
        appendTerminalMessage(`<span class="text-red-400">Error: Status indicator must be online, busy, or offline</span>`);
        return;
      }
      
      const statusText = rawCmd.substring(rawCmd.indexOf(tokens[1]) + tokens[1].length).trim().replace(/"/g, '');
      
      workstationData.status.indicator = ind;
      workstationData.status.text = statusText;
      saveWorkstationData();
      appendTerminalMessage(`Status updated: <span class="text-white font-bold">${ind.toUpperCase()}</span> - "${statusText}".`);
      break;

    case 'focus':
      if (tokens.length < 2) {
        appendTerminalMessage(`<span class="text-red-400">Syntax: focus "Target details..."</span>`);
        return;
      }
      const focusText = rawCmd.substring(rawCmd.indexOf(tokens[0]) + tokens[0].length).trim().replace(/"/g, '');
      workstationData.metrics.currentFocus = focusText;
      saveWorkstationData();
      appendTerminalMessage(`Focus target set to: "${focusText}".`);
      break;

    case 'log':
      if (tokens.length < 2) {
        appendTerminalMessage(`<span class="text-red-400">Syntax: log "Log text details..."</span>`);
        return;
      }
      const logText = rawCmd.substring(rawCmd.indexOf(tokens[0]) + tokens[0].length).trim().replace(/"/g, '');
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "feature",
        text: logText
      };
      workstationData.workStream.unshift(newLog);
      saveWorkstationData();
      appendTerminalMessage(`Appended new work log: "${logText}"`);
      break;

    case 'admin':
      const modal = document.getElementById('edit-modal-overlay');
      if (modal) {
        const isOpen = modal.classList.contains('open');
        if (isOpen) {
          modal.classList.remove('open');
          appendTerminalMessage("Modal closed.");
        } else {
          modal.classList.add('open');
          // Trigger click to populate
          const trigger = document.getElementById('admin-panel-trigger');
          if (trigger) trigger.click();
          appendTerminalMessage("Opening settings modal.");
        }
      }
      break;

    case 'repos':
      if (activeReposList.length === 0) {
        appendTerminalMessage("No cached repository data available.");
      } else {
        let lines = `Showing ${activeReposList.length} original public codebases (excluding forks):`;
        activeReposList.forEach(r => {
          lines += `<br/>- <span class="text-[var(--text-primary)] font-bold">${r.name}</span> [${r.language || 'Code'}]`;
        });
        appendTerminalMessage(lines);
      }
      break;

    case 'skills':
      if (activeReposList.length === 0) {
        appendTerminalMessage("Syncing repositories data...");
      } else {
        const counts = {};
        let total = 0;
        activeReposList.forEach(r => { if (r.language) { counts[r.language] = (counts[r.language] || 0) + 1; total++; } });
        let lines = `Original stack density rates:`;
        Object.entries(counts).sort((a,b)=>b[1]-a[1]).forEach(([lang, count]) => {
          lines += `<br/>- ${lang}: ${Math.round((count/total)*100)}%`;
        });
        appendTerminalMessage(lines);
      }
      break;

    case 'theme':
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
      appendTerminalMessage(`Theme changed: ${isDark ? 'LIGHT' : 'DARK'}`);
      break;

    case 'clear':
      history.innerHTML = "";
      break;

    default:
      appendTerminalMessage(`<span class="text-red-400">Command not recognized: "${escapeHtml(cmd)}". Try 'help' for instructions.</span>`);
  }
}

/* ==========================================================================
   MODULE 8: COMMAND PALETTE
   ========================================================================== */
function initCommandPalette() {
  const palette = document.getElementById('command-palette');
  const input = document.getElementById('cmd-search-input');
  const triggerBtn = document.getElementById('palette-trigger-btn');
  const list = document.getElementById('cmd-list');

  if (!palette || !input || !list) return;

  const openPalette = () => {
    palette.classList.add('open');
    input.value = "";
    renderCommandList("");
    setTimeout(() => input.focus(), 100);
  };

  const closePalette = () => {
    palette.classList.remove('open');
  };

  if (triggerBtn) triggerBtn.addEventListener('click', openPalette);

  palette.addEventListener('click', (e) => {
    if (e.target === palette) closePalette();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.classList.contains('open') ? closePalette() : openPalette();
    }
    if (e.key === 'Escape') closePalette();
  });

  input.addEventListener('input', () => {
    renderCommandList(input.value.trim());
  });

  const defaultCommands = [
    { title: "Open Settings / Edit Modal", subtitle: "Modify live status coordinates directly", action: () => {
      const trigger = document.getElementById('admin-panel-trigger');
      if (trigger) trigger.click();
    }},
    { title: "Increment Coffee Intake", subtitle: "Log another coffee telemetry unit", action: () => {
      parseConsoleCommand("coffee++");
    }},
    { title: "Increment Commits Today", subtitle: "Log another commit telemetry event", action: () => {
      parseConsoleCommand("commits++");
    }},
    { title: "Scroll to Original Projects", subtitle: "Browse non-forked code bases", action: () => scrollToSection('projects') },
    { title: "Scroll to Timeline Chronology", subtitle: "Check academic timeline", action: () => scrollToSection('experience') },
    { title: "Focus Console Terminal", subtitle: "Wipe / type command commands", action: () => {
      scrollToSection('cli-shell');
      setTimeout(() => document.getElementById('cli-input').focus(), 350);
    }},
    { title: "Toggle Portfolio Color Mode", subtitle: "Swap between Dark & Light themes", action: () => {
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    }}
  ];

  function renderCommandList(query) {
    list.innerHTML = "";
    const lowerQuery = query.toLowerCase();

    const filtered = defaultCommands.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) || 
      c.subtitle.toLowerCase().includes(lowerQuery)
    );

    filtered.forEach(cmd => {
      const btn = createPaletteItem(cmd.title, cmd.subtitle, "command_key", () => {
        cmd.action();
        closePalette();
      });
      list.appendChild(btn);
    });

    if (filtered.length === 0) {
      list.innerHTML = `<div class="text-xs text-zinc-500 text-center py-6 font-mono">> No matches found for: "${query}"</div>`;
    }
  }

  function createPaletteItem(title, subtitle, icon, onClick) {
    const item = document.createElement('button');
    item.className = "palette-btn text-xs font-mono text-[var(--text-secondary)] hover:text-white";
    item.innerHTML = `
      <span class="material-symbols-outlined text-zinc-500 text-sm">${icon}</span>
      <div class="flex-grow">
        <span class="font-semibold text-[var(--text-primary)] block">${title}</span>
        <span class="text-[9px] text-zinc-500 block truncate">${subtitle}</span>
      </div>
    `;
    item.addEventListener('click', onClick);
    return item;
  }

  function scrollToSection(id) {
    const sec = document.getElementById(id);
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ==========================================================================
   MODULE 9: UTILITY METHODS
   ========================================================================== */
function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatTimeAgo(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function getLanguageBgColorClass(langName) {
  const mapping = {
    "TypeScript": "bg-blue-500",
    "JavaScript": "bg-yellow-400",
    "Python": "bg-green-400",
    "Java": "bg-orange-400",
    "C": "bg-red-400",
    "C++": "bg-pink-400",
    "HTML": "bg-red-300",
    "CSS": "bg-purple-400"
  };
  return mapping[langName] || "bg-zinc-500";
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
