/* ==========================================================================
   ANAND SYSTEMS: PREMIUM INTERACTIVE OPERATIONS ENGINE (app.js)
   ========================================================================== */

const USERNAME = "Anandsirigiri07";
let activeReposList = []; // Global repositories database cache

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initPreloader();
  initCommandPalette();
  initCliTerminal();
  syncDeveloperData();
});

/* ==========================================================================
   MODULE 1: THEME STATE MANAGER
   ========================================================================== */

function initThemeManager() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  // Check persisted theme or default to dark
  const currentTheme = localStorage.getItem('anand_systems_theme') || 'dark';
  applyTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
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
  
  // Custom event trigger for terminal/charts to update
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
    "> Resolving developer credentials...",
    "> Establishing secure API sockets...",
    "> Analyzing repository compile metrics...",
    "> Sync completed. Systems online."
  ];

  let currentSlide = 0;
  let progress = 0;

  // Text rotation matching milestones
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

  // Progress Bar loading
  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      
      // Delay fadeout
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 300);
      }, 200);
    }
    bar.style.width = `${progress}%`;
  }, 30);

  title.style.transition = 'opacity 0.2s ease';
}

/* ==========================================================================
   MODULE 3: RAYCAST COMMAND PALETTE (`Ctrl+K` / `Cmd+K`)
   ========================================================================== */

function initCommandPalette() {
  const palette = document.getElementById('command-palette');
  const input = document.getElementById('cmd-search-input');
  const triggerBtn = document.getElementById('palette-trigger-btn');
  const heroBtn = document.getElementById('hero-cmd-btn');
  const list = document.getElementById('cmd-list');

  if (!palette || !input || !list) return;

  // Toggle handlers
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
  if (heroBtn) heroBtn.addEventListener('click', openPalette);

  // Close when clicking overlay
  palette.addEventListener('click', (e) => {
    if (e.target === palette) closePalette();
  });

  // Hotkey binds (Ctrl+K or Cmd+K)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.classList.contains('open') ? closePalette() : openPalette();
    }
    if (e.key === 'Escape') {
      closePalette();
    }
  });

  // Search input typing filter
  input.addEventListener('input', () => {
    renderCommandList(input.value.trim());
  });

  // Define command palette options
  const defaultCommands = [
    { title: "Go to Repositories", subtitle: "Scroll to featured projects", action: () => scrollToSection('projects') },
    { title: "Go to Insights", subtitle: "Scroll to GitHub insights & activity", action: () => scrollToSection('insights') },
    { title: "Go to Experience", subtitle: "Scroll to growth timeline", action: () => scrollToSection('experience') },
    { title: "Go to Achievements", subtitle: "Scroll to certifications & Hackathons", action: () => scrollToSection('achievements') },
    { title: "Go to Contact", subtitle: "Scroll to connection details", action: () => scrollToSection('contact') },
    { title: "Toggle Theme Mode", subtitle: "Swap between Dark & Light themes", action: () => {
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    }},
    { title: "Download PDF Spec Resume", subtitle: "Save technical resume", action: () => {
      const anchor = document.createElement('a');
      anchor.href = 'resume.pdf';
      anchor.download = 'resume.pdf';
      anchor.click();
    }}
  ];

  function renderCommandList(query) {
    list.innerHTML = "";
    const lowerQuery = query.toLowerCase();

    // 1. Filter defaults
    const filteredDefaults = defaultCommands.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) || 
      c.subtitle.toLowerCase().includes(lowerQuery)
    );

    // 2. Filter repos
    const filteredRepos = activeReposList.filter(r => 
      r.name.toLowerCase().includes(lowerQuery) || 
      (r.description && r.description.toLowerCase().includes(lowerQuery))
    ).slice(0, 4);

    // Render defaults
    filteredDefaults.forEach(cmd => {
      const btn = createPaletteItem(cmd.title, cmd.subtitle, "command_key", () => {
        cmd.action();
        closePalette();
      });
      list.appendChild(btn);
    });

    // Render repos matches
    if (filteredRepos.length > 0) {
      const header = document.createElement('div');
      header.className = "text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-2 border-t border-[var(--border)] mt-2 font-mono";
      header.innerText = "GitHub Repositories";
      list.appendChild(header);

      filteredRepos.forEach(repo => {
        const btn = createPaletteItem(`Open Repository: ${repo.name}`, repo.description || "Open project on GitHub", "folder", () => {
          window.open(repo.html_url, '_blank');
          closePalette();
        });
        list.appendChild(btn);
      });
    }

    if (filteredDefaults.length === 0 && filteredRepos.length === 0) {
      list.innerHTML = `<div class="text-xs text-zinc-500 text-center py-6 font-mono">> No matches found for: "${query}"</div>`;
    }
  }

  function createPaletteItem(title, subtitle, icon, onClick) {
    const item = document.createElement('button');
    item.className = "w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 hover:bg-[var(--border)] transition-colors focus:outline-none focus:bg-[var(--border)] text-xs";
    item.innerHTML = `
      <span class="material-symbols-outlined text-zinc-500 text-sm">${icon}</span>
      <div class="flex-grow">
        <span class="font-semibold text-[var(--text-primary)] block">${title}</span>
        <span class="text-[10px] text-zinc-500 block truncate max-w-[450px]">${subtitle}</span>
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
   MODULE 4: INTERACTIVE CLI TERMINAL SHELL
   ========================================================================== */

function initCliTerminal() {
  const input = document.getElementById('cli-input');
  const history = document.getElementById('cli-terminal-history');
  const terminalBody = document.getElementById('cli-terminal-body');

  if (!input || !history || !terminalBody) return;

  // Refocus input on terminal body click
  terminalBody.addEventListener('click', () => {
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      input.value = "";
      
      if (cmd.length === 0) return;
      
      processCommand(cmd);
      // Auto scroll to bottom
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });

  function processCommand(cmd) {
    // 1. Render command line
    const promptLine = document.createElement('div');
    promptLine.className = "flex items-center text-[var(--text-primary)]";
    promptLine.innerHTML = `<span class="text-[var(--accent)] font-bold mr-2">sirigiri@anand_systems:~$</span><span>${cmd}</span>`;
    history.appendChild(promptLine);

    // 2. Interpret command
    const args = cmd.toLowerCase().split(' ');
    const primaryCmd = args[0];
    
    const output = document.createElement('div');
    output.className = "pl-4 text-zinc-400 space-y-1";

    switch(primaryCmd) {
      case 'help':
        output.innerHTML = `
          <div>Available commands:</div>
          <div class="grid grid-cols-2 max-w-xs pl-2 text-[var(--text-primary)]">
            <span>help</span><span class="text-zinc-500">- list instructions</span>
            <span>repos</span><span class="text-zinc-500">- list GitHub repos</span>
            <span>skills</span><span class="text-zinc-500">- print language statistics</span>
            <span>contact</span><span class="text-zinc-500">- output channels</span>
            <span>theme</span><span class="text-zinc-500">- swap display theme</span>
            <span>clear</span><span class="text-zinc-500">- empty console screen</span>
          </div>
        `;
        break;
      case 'repos':
        if (activeReposList.length === 0) {
          output.innerHTML = `<div>> Synchronization in progress. Retry in 1s.</div>`;
        } else {
          let rowsHtml = `<div>Found ${activeReposList.length} public repositories:</div>`;
          activeReposList.slice(0, 8).forEach(r => {
            rowsHtml += `<div class="pl-2">- <span class="text-white font-bold">${r.name}</span> [${r.language || 'Code'}] (★ ${r.stargazers_count || 0})</div>`;
          });
          if (activeReposList.length > 8) {
            rowsHtml += `<div class="text-[10px] text-zinc-500 pl-2">...and ${activeReposList.length - 8} more. Search using command palette (Ctrl+K).</div>`;
          }
          output.innerHTML = rowsHtml;
        }
        break;
      case 'skills':
        if (activeReposList.length === 0) {
          output.innerHTML = `<div>> Calculating language aggregations...</div>`;
        } else {
          const counts = {};
          let total = 0;
          activeReposList.forEach(r => { if (r.language) { counts[r.language] = (counts[r.language] || 0) + 1; total++; } });
          let rowsHtml = `<div>Compiled Language Stack:</div>`;
          Object.entries(counts).sort((a,b)=>b[1]-a[1]).forEach(([lang, count]) => {
            rowsHtml += `<div class="pl-2">- ${lang}: ${Math.round((count/total)*100)}%</div>`;
          });
          rowsHtml += `<div class="text-[10px] text-zinc-500 pt-1 font-sans">Current focus: Mastering Data Structures & Algorithms (DSA) in Java, and contributing to GSSoC.</div>`;
          output.innerHTML = rowsHtml;
        }
        break;
      case 'contact':
        output.innerHTML = `
          <div>Secure Channel: <a href="mailto:anandsirigiri2006@gmail.com" class="text-white underline">anandsirigiri2006@gmail.com</a></div>
          <div>LinkedIn Grid: <a href="https://www.linkedin.com/in/anand-sirigiri-a91910368/" target="_blank" class="text-white underline">Sirigiri Anand Kumar</a></div>
          <div>Git Repository: <a href="https://github.com/Anandsirigiri07" target="_blank" class="text-white underline">@Anandsirigiri07</a></div>
        `;
        break;
      case 'theme':
        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        applyTheme(newTheme);
        output.innerHTML = `<div>Theme changed to: ${newTheme.toUpperCase()}</div>`;
        break;
      case 'clear':
        history.innerHTML = "";
        return;
      default:
        output.innerHTML = `<div class="text-red-400">> command not found: "${cmd}". Type 'help' to review instructions.</div>`;
    }
    history.appendChild(output);
  }
}

/* ==========================================================================
   MODULE 5: GITHUB REAL-TIME DATA PROVIDER
   ========================================================================== */

const USER_FALLBACK_REPOS = [
  {
    name: "SIDDHI",
    stargazers_count: 1,
    forks_count: 0,
    language: "TypeScript",
    description: "AI-powered crime analytics platform for the Karnataka State Police. SIDDHI translates natural language queries into active investigative intelligence through conversational answers, criminal network graphs, and geospatial heatmaps.",
    updated_at: "2026-06-08T00:56:50Z",
    html_url: "https://github.com/Anandsirigiri07/SIDDHI"
  },
  {
    name: "GitNest",
    stargazers_count: 0,
    forks_count: 0,
    language: "JavaScript",
    description: "A lightweight collaborative code hosting platform with repositories, commits, branching, and team workflows including AI-powered developer assistance.",
    updated_at: "2026-06-08T14:54:15Z",
    html_url: "https://github.com/Anandsirigiri07/GitNest"
  },
  {
    name: "Agri-Vision",
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    description: "AI-powered cotton crop analysis system that uses deep learning and computer vision to detect growth stages, identify crop health issues, and provide smart recommendations.",
    updated_at: "2026-05-28T13:56:44Z",
    html_url: "https://github.com/Anandsirigiri07/Agri-Vision"
  },
  {
    name: "ai-content-generator",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    description: "AI Content Generator is a web-based application built using Next.js and TypeScript, designed to create AI-driven content generation tools with modern development frameworks.",
    updated_at: "2026-06-05T10:21:02Z",
    html_url: "https://github.com/Anandsirigiri07/ai-content-generator"
  },
  {
    name: "NagrikSathi",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    description: "Citizen assistance portal mapping public requests and administrative feedback.",
    updated_at: "2026-05-09T16:17:38Z",
    html_url: "https://github.com/Anandsirigiri07/NagrikSathi"
  },
  {
    name: "pockethealth-ai",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    description: "Personal AI health assistant analyzing medical symptoms locally.",
    updated_at: "2026-05-04T08:26:28Z",
    html_url: "https://github.com/Anandsirigiri07/pockethealth-ai"
  },
  {
    name: "SikshanMitra",
    stargazers_count: 0,
    forks_count: 0,
    language: "JavaScript",
    description: "Collaborative school classroom task scheduler and dashboard.",
    updated_at: "2026-06-06T08:47:37Z",
    html_url: "https://github.com/Anandsirigiri07/SikshanMitra"
  },
  {
    name: "voteready-app",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    description: "Democratic participation checking application providing voting location schedules.",
    updated_at: "2026-04-29T12:21:15Z",
    html_url: "https://github.com/Anandsirigiri07/voteready-app"
  }
];

async function syncDeveloperData() {
  // 1. Fetch repositories
  try {
    const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`);
    if (res.ok) {
      activeReposList = await res.json();
    } else {
      console.warn("GitHub REST API rate limits. Loading offline project databases.", res.status);
      activeReposList = USER_FALLBACK_REPOS;
    }
  } catch (e) {
    console.warn("Failed to synchronize active indexes from API. Deploying local fallbacks.", e);
    activeReposList = USER_FALLBACK_REPOS;
  }

  // Render HTML UI components
  renderFeaturedProjects(activeReposList);
  renderCurrentlyBuilding(activeReposList);
  renderLanguagesChart(activeReposList);

  // 2. Fetch recent activity pushed commits
  syncActivityFeed();
}

/* ==========================================================================
   MODULE 6: FEATURED PROJECTS COMPILER
   ========================================================================== */

function renderFeaturedProjects(repos) {
  const container = document.getElementById('featured-projects-grid');
  if (!container) return;

  const prioritizedNames = ["siddhi", "gitnest", "agri-vision", "ai-content-generator", "nagriksathi", "pockethealth-ai", "sikshanmitra", "voteready-app"];
  
  let featured = repos.filter(r => prioritizedNames.includes(r.name.toLowerCase()));
  
  // Sort based on priority list order
  featured.sort((a, b) => {
    const idxA = prioritizedNames.indexOf(a.name.toLowerCase());
    const idxB = prioritizedNames.indexOf(b.name.toLowerCase());
    return (idxA > -1 ? idxA : 999) - (idxB > -1 ? idxB : 999);
  });

  if (featured.length === 0) {
    featured = repos.slice(0, 4);
  }

  container.innerHTML = ""; // Clear loader skeletons

  featured.forEach(repo => {
    const dateFormatted = formatDate(repo.updated_at);
    const primaryLang = repo.language || "TypeScript";
    const langColorClass = getLanguageColorClass(primaryLang);

    const card = document.createElement('div');
    card.className = "dev-card rounded-xl p-6 flex flex-col justify-between h-auto gap-6";
    
    card.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between items-start">
          <h3 class="text-base font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <span class="material-symbols-outlined text-sm text-zinc-500">folder_open</span>
            <span>${repo.name}</span>
          </h3>
          <span class="text-[10px] text-zinc-500 font-mono font-medium">${dateFormatted}</span>
        </div>
        <p class="text-xs text-[var(--text-secondary)] leading-relaxed">${repo.description || "Engineering workspace and module repositories."}</p>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-auto">
        <div class="flex items-center gap-4 text-xs font-mono">
          <span class="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span class="w-2 h-2 rounded-full ${langColorClass}"></span>
            <span>${primaryLang}</span>
          </span>
          <span class="flex items-center gap-1 text-zinc-500">
            <span class="material-symbols-outlined text-[12px] font-bold">star</span>
            <span>${repo.stargazers_count || 0}</span>
          </span>
        </div>
        <a href="${repo.html_url}" target="_blank" class="text-xs text-[var(--accent)] hover:underline font-semibold flex items-center gap-1">
          <span>GitHub</span>
          <span class="material-symbols-outlined text-xs">arrow_forward</span>
        </a>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ==========================================================================
   MODULE 7: CURRENTLY BUILDING LIST
   ========================================================================== */

function renderCurrentlyBuilding(repos) {
  const container = document.getElementById('currently-building-list');
  if (!container) return;

  let recentlyUpdated = [...repos]
    .filter(r => r.name.toLowerCase() !== USERNAME.toLowerCase())
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 4);

  container.innerHTML = ""; // Clear loader skeletons

  recentlyUpdated.forEach(repo => {
    const timeAgo = formatTimeAgo(repo.updated_at);
    const primaryLang = repo.language || "TypeScript";
    const langColorClass = getLanguageColorClass(primaryLang);

    const item = document.createElement('a');
    item.href = repo.html_url;
    item.target = "_blank";
    item.className = "dev-card rounded-xl p-5 hover:border-zinc-500 transition-colors flex flex-col justify-between gap-4";

    item.innerHTML = `
      <div class="space-y-1">
        <h4 class="text-xs font-bold text-[var(--text-primary)] truncate">${repo.name}</h4>
        <p class="text-[10px] text-zinc-500 font-mono">Updated ${timeAgo}</p>
      </div>
      <div class="flex items-center gap-2 text-[10px] font-mono text-[var(--text-secondary)]">
        <span class="w-1.5 h-1.5 rounded-full ${langColorClass}"></span>
        <span>${primaryLang}</span>
      </div>
    `;
    container.appendChild(item);
  });
}

/* ==========================================================================
   MODULE 8: LANGUAGES GRAPH AGGREGATION
   ========================================================================== */

function renderLanguagesChart(repos) {
  const container = document.getElementById('languages-chart-container');
  if (!container) return;

  const counts = {};
  let totalWithLang = 0;

  repos.forEach(repo => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
      totalWithLang++;
    }
  });

  if (totalWithLang === 0) {
    container.innerHTML = `<div class="text-xs text-zinc-500">No language data available.</div>`;
    return;
  }

  // Sort languages descending
  const sortedLangs = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // display top 5 languages

  container.innerHTML = "";

  sortedLangs.forEach(([langName, count]) => {
    const percentage = Math.round((count / totalWithLang) * 100);
    const colorBg = getLanguageBgColorClass(langName);

    const row = document.createElement('div');
    row.className = "space-y-1";

    row.innerHTML = `
      <div class="flex justify-between items-center text-xs">
        <span class="font-medium text-[var(--text-secondary)] font-mono">${langName}</span>
        <span class="text-zinc-500 font-mono">${percentage}%</span>
      </div>
      <div class="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/40">
        <div class="h-full rounded-full ${colorBg}" style="width: ${percentage}%"></div>
      </div>
    `;
    container.appendChild(row);
  });
}

/* ==========================================================================
   MODULE 9: REAL-TIME GITHUB EVENTS LOGGER
   ========================================================================== */

async function syncActivityFeed() {
  const container = document.getElementById('latest-activity-feed');
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/users/${USERNAME}/events`);
    if (res.ok) {
      const events = await res.json();
      renderActivityFeed(events);
    } else {
      useFallbackActivityFeed();
    }
  } catch (e) {
    console.warn("Failed to fetch activity feed from API. Using local system logging.", e);
    useFallbackActivityFeed();
  }
}

function renderActivityFeed(events) {
  const container = document.getElementById('latest-activity-feed');
  if (!container) return;

  const pushEvents = events.filter(e => e.type === "PushEvent").slice(0, 5);

  if (pushEvents.length === 0) {
    useFallbackActivityFeed();
    return;
  }

  container.innerHTML = "";

  pushEvents.forEach(evt => {
    const repoName = evt.repo.name.replace(`${USERNAME}/`, "");
    const timeAgo = formatTimeAgo(evt.created_at);
    
    let commitMsg = "pushed changes to repository";
    if (evt.payload && evt.payload.commits && evt.payload.commits.length > 0) {
      commitMsg = evt.payload.commits[0].message;
    }

    const logRow = document.createElement('div');
    logRow.className = "pb-2.5 border-b border-[var(--border)]/60 last:border-b-0 flex items-start gap-2 leading-relaxed";

    logRow.innerHTML = `
      <span class="text-zinc-600 shrink-0 font-mono">></span>
      <span class="text-[var(--text-secondary)]">
        pushed commit <span class="text-[var(--text-primary)] font-semibold font-mono">"${commitMsg}"</span> to repo 
        <a href="https://github.com/${evt.repo.name}" target="_blank" class="text-[var(--text-primary)] hover:underline font-mono">${repoName}</a>
        <span class="text-zinc-500 font-mono text-[10px] pl-1">${timeAgo}</span>
      </span>
    `;
    container.appendChild(logRow);
  });
}

function useFallbackActivityFeed() {
  const container = document.getElementById('latest-activity-feed');
  if (!container) return;

  const fallbackLogs = [
    `> merged pull request #142 on GirlScript Summer of Code (GSSoC) repository.`,
    `> compiled partition sorting tree algorithms inside Java DSA repository.`,
    `> synchronized secure database repositories index indexes successfully.`,
    `> verified secure credentials for local vaults compilation cycles.`,
    `> compiled crop analysis model weights dataset outputs.`
  ];

  container.innerHTML = "";
  fallbackLogs.forEach(logLine => {
    const dateFormatted = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const logRow = document.createElement('div');
    logRow.className = "pb-2.5 border-b border-[var(--border)]/60 last:border-b-0 flex items-start gap-2";

    logRow.innerHTML = `
      <span class="text-zinc-600 shrink-0 font-mono">></span>
      <span class="text-[var(--text-secondary)]">
        ${logLine} <span class="text-zinc-600 text-[10px] pl-1 font-mono">${dateFormatted} UTC</span>
      </span>
    `;
    container.appendChild(logRow);
  });
}

/* ==========================================================================
   MODULE 10: UTILITIES & DATE CONVERTERS
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
  
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function getLanguageColorClass(langName) {
  const mapping = {
    "TypeScript": "bg-blue-500",
    "JavaScript": "bg-yellow-500",
    "Python": "bg-green-500",
    "Java": "bg-orange-500",
    "C": "bg-red-500",
    "C++": "bg-pink-500",
    "HTML": "bg-red-400",
    "CSS": "bg-purple-500"
  };
  return mapping[langName] || "bg-zinc-500";
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
