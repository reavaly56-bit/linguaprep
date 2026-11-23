/* LinguaPrep · МГИМО — Core Application Engine */
(() => {
  'use strict';

  const STORAGE_KEY = 'linguaprep_state_v1';
  const SUBJECT_ORDER = ['fr', 'en', 'econ', 'komkor', 'hr'];
  const FR_ACCENTS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'ù', 'û', 'ô', 'î', 'ï', 'œ', "'"];

  // Minimal clean SVG icons
  const ICO = {
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    learn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    cheat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
    progress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    vol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    chev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
    back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="15 18 9 12 15 6"/></svg>',
    undo: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>',
    play: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>',
    wand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 4V2m0 14v-2M8 9h2m10 0h2m-4.2 3.8 1.4 1.4M12.2 6.2 10.8 4.8m7 1.4 1.4-1.4M3 21l9-9"/></svg>',
    lock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  };

  const $ = (s, root = document) => root.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const todayStr = () => new Date().toISOString().slice(0, 10);
  const daysBetween = (d1, d2) => Math.ceil((new Date(d2 + 'T00:00:00') - new Date(d1 + 'T00:00:00')) / 86400000);

  // Default state
  function defaultState() {
    const sel = {};
    SUBJECT_ORDER.forEach((id) => {
      const d = window.STUDY_DATA[id];
      sel[id] = d ? (d.defaultUnits || d.units.map((u) => u.id)).slice() : [];
    });
    return {
      subject: 'fr',
      tab: 'learn',
      theme: 'light',
      dir: 'ru', // 'ru' (RU->Foreign, best for exams!), 'foreign' (Foreign->RU), 'mix'
      frGreenOnly: false,
      enAvOnly: false,
      frPassedLesson: 5, // Passed up to A2 Lesson 5 (strict program barrier!)
      enPassedLesson: 3, // Passed up to Unit 3
      wakeLock: true,
      ttsMode: 'auto', // 'auto' (live voice + offline cache + system fallback) | 'system' (offline system TTS only)
      selectedUnits: sel,
      srs: {},          // cardId -> { box: 0..4, due: 'YYYY-MM-DD', seen: n }
      mistakes: {},     // subject -> [ { key, kind, prompt, answer, ru, explain } ]
      exams: [],        // [ { id, subject, title, date } ]
      quizHistory: [],  // [ { date, subject, score, total, pct } ]
      streak: { count: 0, lastDate: '' },
      cheatSub: 'vocab',
      cheatSearch: '',
      cheatShowFuture: false,
      builderMode: 'tiles', // 'tiles' | 'input'
      ai: {
        preset: 'deepseek',
        url: 'https://api.deepseek.com/chat/completions',
        model: 'deepseek-chat',
        apiKey: '',
      },
    };
  }

  function loadState() {
    const def = defaultState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return def;
      const parsed = JSON.parse(raw);
      return {
        ...def,
        ...parsed,
        selectedUnits: { ...def.selectedUnits, ...(parsed.selectedUnits || {}) },
        srs: parsed.srs || {},
        mistakes: parsed.mistakes || {},
        exams: Array.isArray(parsed.exams) ? parsed.exams : [],
        quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : [],
        streak: parsed.streak || def.streak,
        ai: { ...def.ai, ...(parsed.ai || {}) },
      };
    } catch {
      return def;
    }
  }

  let state = loadState();
  let session = null;
  let timerId = null;
  let wakeLockSentinel = null;
  let toastTimer = null;

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function markActiveToday() {
    const t = todayStr();
    if (state.streak.lastDate === t) return;
    if (state.streak.lastDate && daysBetween(state.streak.lastDate, t) === 1) {
      state.streak.count += 1;
    } else {
      state.streak.count = 1;
    }
    state.streak.lastDate = t;
    saveState();
  }

  function showToast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
  }

  // Wake Lock API (+ native AndroidBridge fallback)
  async function acquireWakeLock() {
    if (!state.wakeLock) return;
    try { window.AndroidBridge?.setKeepScreenOn?.(true); } catch {}
    if (!('wakeLock' in navigator)) return;
    try { wakeLockSentinel = await navigator.wakeLock.request('screen'); } catch {}
  }
  function releaseWakeLock() {
    try { window.AndroidBridge?.setKeepScreenOn?.(false); } catch {}
    if (wakeLockSentinel) {
      try { wakeLockSentinel.release(); } catch {}
      wakeLockSentinel = null;
    }
  }

  // TTS Audio (native Android TextToSpeech in APK, Web Speech API in browser)
  function speak(text, lang) {
    const clean = String(text)
      .replace(/\([^)]*\)/g, '')
      .replace(/\b(qch|qn|sth|sb|smb)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    const spoken = clean || String(text);
    const targetLang = lang || curData().lang || 'en-GB';
    if (window.AndroidBridge && typeof window.AndroidBridge.speakWithMode === 'function') {
      try {
        window.AndroidBridge.speakWithMode(spoken, targetLang, state.ttsMode || 'auto');
        return;
      } catch {}
    } else if (window.AndroidBridge && typeof window.AndroidBridge.speak === 'function') {
      try {
        window.AndroidBridge.speak(spoken, targetLang);
        return;
      } catch {}
    }
    if (!('speechSynthesis' in window)) {
      showToast('Озвучка не поддерживается устройством');
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(spoken);
      u.lang = targetLang;
      u.rate = 0.94;
      window.speechSynthesis.speak(u);
    } catch {
      showToast('Не удалось воспроизвести');
    }
  }

  // Theme
  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    $('#themeBtn').innerHTML = state.theme === 'dark' ? ICO.sun : ICO.moon;
    const meta = $('#metaTheme');
    if (meta) meta.content = state.theme === 'dark' ? '#0B0E14' : '#F4F6F9';
    try { window.AndroidBridge?.setTheme?.(state.theme === 'dark'); } catch {}
  }

  // Current subject & STRICT program boundary helpers
  const curData = () => window.STUDY_DATA[state.subject];

  function passedLessonFor(subjId = state.subject) {
    if (subjId === 'fr') return Number(state.frPassedLesson ?? 5);
    if (subjId === 'en') return Number(state.enPassedLesson ?? 3);
    return 999;
  }

  function setPassedLessonFor(subjId, num) {
    const n = Number(num);
    if (subjId === 'fr') state.frPassedLesson = n;
    else if (subjId === 'en') state.enPassedLesson = n;
    // Clamp selected units strictly within new boundary; if empty, select boundary lesson!
    const allowed = new Set(allowedUnits(subjId));
    const curSel = (state.selectedUnits[subjId] || []).filter((id) => allowed.has(id));
    if (curSel.length) {
      state.selectedUnits[subjId] = curSel;
    } else {
      state.selectedUnits[subjId] = currentBoundaryUnitIds(subjId);
    }
    saveState();
  }

  function isUnitLocked(u, subjId = state.subject) {
    const d = window.STUDY_DATA[subjId];
    if (!d || !d.hasProgramBoundary) return false;
    return typeof u.lessonNum === 'number' && u.lessonNum > passedLessonFor(subjId);
  }

  function allowedUnits(subjId = state.subject) {
    const d = window.STUDY_DATA[subjId];
    if (!d) return [];
    return d.units.filter((u) => !isUnitLocked(u, subjId)).map((u) => u.id);
  }

  function currentBoundaryUnitIds(subjId = state.subject) {
    const d = window.STUDY_DATA[subjId];
    if (!d) return [];
    const pl = passedLessonFor(subjId);
    const exact = d.units.filter((u) => u.lessonNum === pl).map((u) => u.id);
    return exact.length ? exact : allowedUnits(subjId);
  }

  function activeUnits(subjId = state.subject) {
    const allowed = allowedUnits(subjId);
    const allowSet = new Set(allowed);
    const sel = (state.selectedUnits[subjId] || []).filter((id) => allowSet.has(id));
    return sel.length ? sel : currentBoundaryUnitIds(subjId);
  }

  function filteredCards(subjId = state.subject) {
    const d = window.STUDY_DATA[subjId];
    const uSet = new Set(activeUnits(subjId));
    let arr = d.cards.filter((c) => uSet.has(c.unit));
    if (subjId === 'fr' && state.frGreenOnly) {
      const greens = arr.filter((c) => c.green);
      if (greens.length) arr = greens;
    }
    if (subjId === 'en' && state.enAvOnly) {
      const avs = arr.filter((c) => c.av);
      if (avs.length) arr = avs;
    }
    return arr;
  }

  function filteredItems(key, subjId = state.subject) {
    const d = window.STUDY_DATA[subjId];
    const list = d[key] || [];
    const allowSet = new Set(allowedUnits(subjId));
    const pl = passedLessonFor(subjId);
    // Step 1: STRICT program boundary filter (future lessons NEVER leak into trainers!)
    const allowedList = list.filter((x) => {
      if (typeof x.minLesson === 'number' && x.minLesson > pl) return false;
      if (x.unit && !allowSet.has(x.unit)) return false;
      return true;
    });
    // Step 2: Prefer active selected units, fallback ONLY to allowedList (never future!)
    const uSet = new Set(activeUnits(subjId));
    const matched = allowedList.filter((x) => !x.unit || uSet.has(x.unit));
    return matched.length ? matched : allowedList;
  }

  function boundaryInfo(subjId = state.subject) {
    const d = window.STUDY_DATA[subjId];
    if (!d || !d.hasProgramBoundary || !d.lessonBoundaries) return null;
    const pl = passedLessonFor(subjId);
    const cur = d.lessonBoundaries.find((b) => b.num === pl) || d.lessonBoundaries[d.lessonBoundaries.length - 1];
    const lockedCount = d.units.filter((u) => isUnitLocked(u, subjId)).length;
    return { cur, pl, lockedCount, all: d.lessonBoundaries };
  }

  function hasAiKey() {
    return !!(state.ai && state.ai.apiKey && state.ai.apiKey.trim().length > 6);
  }

  // Safe rich renderer for full grammar rules (bold + Markdown tables + clean paragraphs)
  function renderRuleBody(body) {
    const lines = String(body || '').split('\n');
    const out = [];
    let i = 0;
    const inlineFmt = (s) => esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    while (i < lines.length) {
      const ln = lines[i].trim();
      if (!ln) { i++; continue; }
      if (ln.startsWith('|')) {
        const tblLines = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tblLines.push(lines[i].trim());
          i++;
        }
        const rows = tblLines
          .filter((r) => !/^\|[\s\-:|]+\|$/.test(r))
          .map((r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
        if (rows.length) {
          const head = rows[0];
          const bodyRows = rows.slice(1);
          out.push(
            `<div class="rule-tbl-wrap"><table class="rule-tbl"><thead><tr>${head.map((c) => `<th>${inlineFmt(c)}</th>`).join('')}</tr></thead>` +
            (bodyRows.length ? `<tbody>${bodyRows.map((r) => `<tr>${r.map((c) => `<td>${inlineFmt(c)}</td>`).join('')}</tr>`).join('')}</tbody>` : '') +
            `</table></div>`
          );
        }
        continue;
      }
      const pLines = [];
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('|')) {
        pLines.push(inlineFmt(lines[i]));
        i++;
      }
      if (pLines.length) out.push(`<p>${pLines.join('\n')}</p>`);
    }
    return `<div class="rule-rich">${out.join('')}</div>`;
  }

  // SRS helper (simple transparent intervals: box 0=today, 1=1d, 2=3d, 3=7d, 4=14d, 5=30d)
  const BOX_DAYS = [0, 1, 3, 7, 14, 30];
  function updateSRS(cardId, rating) {
    const prev = state.srs[cardId] ? { ...state.srs[cardId] } : null;
    const cur = prev || { box: 0, due: todayStr(), seen: 0 };
    let nextBox = cur.box;
    if (rating === 'again') nextBox = 0;
    else if (rating === 'hard') nextBox = Math.max(1, cur.box);
    else if (rating === 'good') nextBox = Math.min(5, cur.box + 1);
    const d = new Date();
    d.setDate(d.getDate() + BOX_DAYS[nextBox]);
    state.srs[cardId] = {
      box: nextBox,
      due: d.toISOString().slice(0, 10),
      seen: cur.seen + 1,
    };
    markActiveToday();
    saveState();
    return prev;
  }

  function cardStatus(cardId) {
    const rec = state.srs[cardId];
    if (!rec || !rec.seen) return 'new';
    if (rec.box >= 3) return 'known';
    return 'review';
  }

  function subjectStats(subjId) {
    const d = window.STUDY_DATA[subjId];
    const cards = filteredCards(subjId);
    let known = 0, review = 0, fresh = 0;
    cards.forEach((c) => {
      const st = cardStatus(c.id);
      if (st === 'known') known++;
      else if (st === 'review') review++;
      else fresh++;
    });
    return { total: cards.length, allTotal: d.cards.length, known, review, fresh };
  }

  // Mistakes queue
  function addMistake(subjId, item) {
    const list = state.mistakes[subjId] || [];
    if (!list.some((x) => x.key === item.key)) {
      list.unshift(item);
      state.mistakes[subjId] = list.slice(0, 80);
      saveState();
    }
  }
  function removeMistake(subjId, key) {
    const list = state.mistakes[subjId] || [];
    state.mistakes[subjId] = list.filter((x) => x.key !== key);
    saveState();
  }

  // Answer normalization for dictation & typing exercises
  function normAnswer(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/\([^)]*\)/g, ' ')
      .replace(/[«»"'’‘`.,!?;:—–\-]/g, ' ')
      .replace(/^to\s+/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function checkTypedAnswer(userInput, expected, altAnswers = []) {
    const u = normAnswer(userInput);
    if (!u) return false;
    const candidates = [expected, ...(altAnswers || [])];
    // Also split expected by / or ; if short vocab
    if (expected.length < 70) {
      expected.split(/[;/]/).forEach((p) => { if (p.trim().length > 1) candidates.push(p.trim()); });
    }
    return candidates.some((c) => normAnswer(c) === u);
  }

  // Insert accent character at cursor
  function insertAtCursor(input, ch) {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = input.value.slice(0, start) + ch + input.value.slice(end);
    input.focus();
    input.setSelectionRange(start + ch.length, start + ch.length);
  }

  // ============================================================================
  // RENDERING SHELL & NAVIGATION
  // ============================================================================
  function renderShell() {
    const d = curData();
    $('#headerDot').style.background = d.accentColor;
    $('#headerSub').textContent = d.subtitle;
    $('#headerTitle').textContent = d.name;

    // Subject switcher pills
    $('#subjectRail').innerHTML = SUBJECT_ORDER.map((id) => {
      const s = window.STUDY_DATA[id];
      const active = id === state.subject ? ' active' : '';
      return `<button type="button" class="subj-pill${active}" data-subj="${id}">
        <span class="dot" style="background:${s.accentColor}"></span>${esc(s.shortName)}
      </button>`;
    }).join('');

    $('#subjectRail').querySelectorAll('.subj-pill').forEach((btn) => {
      btn.onclick = () => {
        state.subject = btn.dataset.subj;
        state.cheatSub = 'vocab';
        state.cheatSearch = '';
        saveState();
        renderAll();
      };
    });

    // Bottom nav active state
    document.querySelectorAll('.nav-tab').forEach((btn) => {
      const active = btn.dataset.tab === state.tab;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-current', active ? 'page' : 'false');
    });
  }

  function renderAll() {
    applyTheme();
    renderShell();
    const view = $('#mainView');
    if (state.tab === 'learn') renderLearnTab(view);
    else if (state.tab === 'cheat') renderCheatTab(view);
    else renderProgressTab(view);
  }

  // ============================================================================
  // TAB 1: LEARN (SUBJECT HUB)
  // ============================================================================
  function renderLearnTab(root) {
    const d = curData();
    const selU = activeUnits();
    const cards = filteredCards();
    const stats = subjectStats(state.subject);
    const colls = filteredItems('collocations');
    const trickies = filteredItems('tricky');
    const exs = filteredItems('exercises');
    const mistakes = state.mistakes[state.subject] || [];
    const nextExam = state.exams
      .filter((e) => e.subject === state.subject && daysBetween(todayStr(), e.date) >= 0)
      .sort((a, b) => a.date.localeCompare(b.date))[0];

    const selectedLabels = d.units.filter((u) => selU.includes(u.id)).map((u) => u.label);
    const labelPreview = selectedLabels.length <= 4
      ? selectedLabels.join(', ')
      : `${selectedLabels.slice(0, 3).join(', ')} +${selectedLabels.length - 3}`;

    let examHtml = '';
    if (nextExam) {
      const left = daysBetween(todayStr(), nextExam.date);
      const rem = Math.max(1, stats.total - stats.known);
      const perDay = Math.ceil(rem / Math.max(1, left));
      examHtml = `<div class="exam-banner">
        <span>${esc(nextExam.title)} · через ${left} дн.</span>
        <span>~${perDay} карт./день</span>
      </div>`;
    }

    // Subject-specific modes
    let specialModesHtml = '';
    if (state.subject === 'fr') {
      const availVerbs = d.conjugations.filter((v) => v.minLesson <= state.frPassedLesson).length;
      const availTexts = (d.texts || []).filter((t) => (t.minLesson || 1) <= state.frPassedLesson).length;
      const tensesList = state.frPassedLesson >= 10
        ? 'présent, PC, imparfait, impératif, futur, subjonctif'
        : state.frPassedLesson >= 6
          ? 'présent, PC, imparfait, impératif, futur simple'
          : state.frPassedLesson === 0
            ? 'présent, impératif (уровень A1)'
            : `présent, PC, imparfait, impératif (до L${state.frPassedLesson})`;
      specialModesHtml = `
        <button type="button" class="mode-row" data-mode="conjugation">
          <div class="mode-icon accent">${ICO.grid}</div>
          <div class="mode-body">
            <div class="mode-title">Спряжения глаголов</div>
            <div class="mode-desc">${esc(tensesList)}</div>
          </div>
          <div class="mode-right">${availVerbs} гл. ${ICO.chev}</div>
        </button>
        ${availTexts ? `
        <button type="button" class="mode-row" data-mode="fr_texts">
          <div class="mode-icon good">${ICO.list}</div>
          <div class="mode-body">
            <div class="mode-title">Тексты и активные слова</div>
            <div class="mode-desc">Тезисы пройденных текстов + чек-лист зелёных слов</div>
          </div>
          <div class="mode-right">${availTexts} ${ICO.chev}</div>
        </button>` : ''}`;
    } else if (state.subject === 'econ') {
      specialModesHtml = `
        <button type="button" class="mode-row" data-mode="econ_maps">
          <div class="mode-icon good">${ICO.map}</div>
          <div class="mode-body">
            <div class="mode-title">Перевод и Concept Maps</div>
            <div class="mode-desc">Интерактивные карты Text I–V + перевод фраз</div>
          </div>
          <div class="mode-right">${d.conceptMaps.length} карт ${ICO.chev}</div>
        </button>`;
    } else if (state.subject === 'komkor') {
      specialModesHtml = `
        <button type="button" class="mode-row" data-mode="komkor_cliches">
          <div class="mode-icon accent">${ICO.mail}</div>
          <div class="mode-body">
            <div class="mode-title">Конструктор клише</div>
            <div class="mode-desc">6 блоков делового письма + квиз ситуаций</div>
          </div>
          <div class="mode-right">6 блоков ${ICO.chev}</div>
        </button>`;
    }
    // Note: Home Reading intentionally has NO retelling plan per user request!

    // Program Boundary Banner (FR & General EN)
    const bInfo = boundaryInfo();
    const boundaryHtml = bInfo ? `
      <div class="boundary-bar">
        <div class="boundary-left">
          <div class="boundary-kicker">Программа вуза · где я сейчас</div>
          <div class="boundary-val">${esc(bInfo.cur.label)}${bInfo.lockedCount ? ` · 🔒 ${bInfo.lockedCount} на будущее` : ' · всё открыто'}</div>
          <div class="boundary-sub">${esc(bInfo.cur.desc)}</div>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="changeBoundaryBtn">Сдвинуть</button>
      </div>
    ` : '';

    // Hybrid Sentence Builder card (FR & General EN)
    const builderTopics = window.BuilderEngine ? window.BuilderEngine.getTopics(state.subject, passedLessonFor()) : [];
    const builderEst = window.BuilderEngine && window.BuilderEngine.estimateCount ? window.BuilderEngine.estimateCount(state.subject, passedLessonFor()) : 0;
    const builderModeHtml = builderTopics.length ? `
      <button type="button" class="mode-row" data-mode="builder">
        <div class="mode-icon accent">${ICO.wand}</div>
        <div class="mode-body">
          <div class="mode-title">Конструктор предложений ${hasAiKey() ? '<span class="ai-pill" style="padding:1px 7px;font-size:10.5px;margin-left:4px">✨ ИИ</span>' : ''}</div>
          <div class="mode-desc">~${builderEst.toLocaleString('ru-RU')}+ фраз офлайн до ${bInfo ? esc(bInfo.cur.label) : 'текущего урока'} · плитки, ввод${hasAiKey() ? ' + ИИ' : ' (+ опция ИИ)'}</div>
        </div>
        <div class="mode-right">${builderTopics.length} тем ${ICO.chev}</div>
      </button>
    ` : '';

    const curBoundIds = currentBoundaryUnitIds();
    const allowIds = allowedUnits();
    const isCurPreset = selU.length === curBoundIds.length && curBoundIds.every((id) => selU.includes(id));
    const isAllPassedPreset = selU.length === allowIds.length && allowIds.every((id) => selU.includes(id));

    root.innerHTML = `
      ${boundaryHtml}

      <!-- Unit Filter Card -->
      <div class="card card-compact">
        <div class="filter-row">
          <div class="filter-summary">
            <div class="filter-title">Темы тренировки: ${esc(labelPreview)}</div>
            <div class="filter-sub">${cards.length} карт. · ${exs.length} упр. · ${colls.length} колл.</div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="pickUnitsBtn">Выбрать</button>
        </div>
        ${bInfo ? `
        <div class="chip-row">
          <button type="button" class="pill${isCurPreset ? ' active' : ''}" id="presetCurBtn">Только ${esc(bInfo.cur.label)}</button>
          <button type="button" class="pill${isAllPassedPreset ? ' active' : ''}" id="presetPassedBtn">Всё пройденное</button>
        </div>` : ''}
        <div class="chip-row">
          ${state.subject === 'fr' ? `<button type="button" class="pill${state.frGreenOnly ? ' green-active' : ''}" id="greenToggle">Только зелёные</button>` : ''}
          ${state.subject === 'en' ? `<button type="button" class="pill${state.enAvOnly ? ' green-active' : ''}" id="enAvToggle">Только AV</button>` : ''}
          <button type="button" class="pill" id="dirToggle">${state.dir === 'ru' ? 'RU → ' + d.langLabel : state.dir === 'foreign' ? d.langLabel + ' → RU' : 'Вперемешку'}</button>
          ${mistakes.length ? `<button type="button" class="pill bad" id="mistakesBtn">Ошибки · ${mistakes.length}</button>` : ''}
        </div>
      </div>

      <!-- Hero Card: 5 minutes before class -->
      <div class="card">
        <div class="hero-head">
          <div>
            <h2 class="hero-title">5 минут до пары</h2>
            <p class="hero-sub">Быстрый микс из 12 заданий по слабым местам</p>
          </div>
          <span class="counter-badge">${stats.known}/${stats.total}</span>
        </div>
        ${examHtml}
        <button type="button" class="btn btn-primary btn-block" id="quick5Btn">
          ${ICO.play} Поехали!
        </button>
      </div>

      <div class="section-label">Режимы подготовки</div>

      <div class="mode-list">
        ${builderModeHtml}

        <button type="button" class="mode-row" data-mode="cards">
          <div class="mode-icon accent">${ICO.cards}</div>
          <div class="mode-body">
            <div class="mode-title">Карточки (SRS)</div>
            <div class="mode-desc">Умное повторение · «не знаю / путаюсь / знаю»</div>
          </div>
          <div class="mode-right">${cards.length} ${ICO.chev}</div>
        </button>

        <button type="button" class="mode-row" data-mode="dictation">
          <div class="mode-icon">${ICO.edit}</div>
          <div class="mode-body">
            <div class="mode-title">Диктант (ввод)</div>
            <div class="mode-desc">${state.subject === 'fr' ? 'Ввод перевода + панель акцентов é è ê ç' : 'Ввод перевода как на письменном срезе'}</div>
          </div>
          <div class="mode-right">${cards.length} ${ICO.chev}</div>
        </button>

        <button type="button" class="mode-row" data-mode="collocations">
          <div class="mode-icon">${ICO.link}</div>
          <div class="mode-body">
            <div class="mode-title">Коллокации и предлоги</div>
            <div class="mode-desc">Устойчивые сочетания и правильные предлоги</div>
          </div>
          <div class="mode-right">${colls.length} ${ICO.chev}</div>
        </button>

        <button type="button" class="mode-row" data-mode="tricky">
          <div class="mode-icon warn">${ICO.alert}</div>
          <div class="mode-body">
            <div class="mode-title">Коварные пары и ловушки</div>
            <div class="mode-desc">Частые ошибки срезов с разбором правила</div>
          </div>
          <div class="mode-right">${trickies.length} ${ICO.chev}</div>
        </button>

        <button type="button" class="mode-row" data-mode="exercises">
          <div class="mode-icon good">${ICO.book}</div>
          <div class="mode-body">
            <div class="mode-title">Упражнения из учебника</div>
            <div class="mode-desc">С проверкой по ключам и пояснением «почему»</div>
          </div>
          <div class="mode-right">${exs.length} ${ICO.chev}</div>
        </button>

        <button type="button" class="mode-row" data-mode="quiz">
          <div class="mode-icon warn">${ICO.clock}</div>
          <div class="mode-body">
            <div class="mode-title">Симулятор среза / квиза</div>
            <div class="mode-desc">Таймер 10–15 мин · микс тем · итоговая оценка</div>
          </div>
          <div class="mode-right">Старт ${ICO.chev}</div>
        </button>

        ${specialModesHtml}
      </div>

      ${d.note ? `<div class="note-strip">${esc(d.note)}</div>` : ''}
    `;

    const cb = $('#changeBoundaryBtn');
    if (cb) cb.onclick = openBoundaryModal;
    const pCur = $('#presetCurBtn');
    if (pCur) pCur.onclick = () => {
      state.selectedUnits[state.subject] = currentBoundaryUnitIds();
      saveState();
      renderLearnTab(root);
    };
    const pAll = $('#presetPassedBtn');
    if (pAll) pAll.onclick = () => {
      state.selectedUnits[state.subject] = allowedUnits();
      saveState();
      renderLearnTab(root);
    };
    $('#pickUnitsBtn').onclick = openUnitPicker;
    const gt = $('#greenToggle');
    if (gt) gt.onclick = () => {
      state.frGreenOnly = !state.frGreenOnly;
      saveState();
      renderLearnTab(root);
    };
    const eat = $('#enAvToggle');
    if (eat) eat.onclick = () => {
      state.enAvOnly = !state.enAvOnly;
      saveState();
      renderLearnTab(root);
    };
    $('#dirToggle').onclick = () => {
      const order = ['ru', 'foreign', 'mix'];
      state.dir = order[(order.indexOf(state.dir) + 1) % order.length];
      saveState();
      renderLearnTab(root);
    };
    const mb = $('#mistakesBtn');
    if (mb) mb.onclick = startMistakesSession;

    $('#quick5Btn').onclick = () => startQuick5();

    root.querySelectorAll('.mode-row').forEach((btn) => {
      btn.onclick = () => {
        const m = btn.dataset.mode;
        if (m === 'builder') startBuilderSession();
        else if (m === 'cards') startCardsSession();
        else if (m === 'dictation') startDictationSession();
        else if (m === 'collocations') startCollocationSession();
        else if (m === 'tricky') startTrickySession();
        else if (m === 'exercises') startExerciseSession();
        else if (m === 'quiz') openQuizSetup();
        else if (m === 'conjugation') startConjugationSession();
        else if (m === 'fr_texts') startFrTextsSession();
        else if (m === 'econ_maps') startEconMapsSession();
        else if (m === 'komkor_cliches') startKomkorClichesSession();
      };
    });
  }

  // ============================================================================
  // PROGRAM BOUNDARY MODAL (WHERE AM I IN THE SYLLABUS?)
  // ============================================================================
  function openBoundaryModal() {
    const d = curData();
    const bInfo = boundaryInfo();
    if (!bInfo) return;

    openModal(`
      <div class="modal-head">
        <h3 class="modal-title">Где я сейчас · ${esc(d.shortName)}</h3>
        <button type="button" class="btn btn-secondary btn-sm" id="closeMod">Закрыть</button>
      </div>
      <div class="small muted">Выбери последний урок, который вы уже проходите в вузе. Всё, что дальше, останется в Шпаргалке «на будущее», но <b>никогда</b> не попадёт в карточки, конструктор, спряжения и срез.</div>
      <div class="mode-list">
        ${bInfo.all.map((b) => {
          const isCur = b.num === bInfo.pl;
          const isFuture = b.num > bInfo.pl;
          return `
            <button type="button" class="mode-row" data-bnum="${b.num}" style="${isCur ? 'border-color:var(--accent);background:color-mix(in srgb, var(--accent) 8%, var(--surface))' : ''}">
              <div class="mode-body">
                <div class="mode-title">${esc(b.label)} ${isCur ? '<span class="pill active" style="padding:1px 8px;min-height:20px;font-size:11px;margin-left:4px">Сейчас</span>' : isFuture ? '<span class="badge-future" style="margin-left:4px">На будущее</span>' : ''}</div>
                <div class="mode-desc">${esc(b.desc)}</div>
              </div>
            </button>
          `;
        }).join('')}
      </div>
    `);
    $('#closeMod').onclick = closeModal;
    $('#modalSheet').querySelectorAll('[data-bnum]').forEach((btn) => {
      btn.onclick = () => {
        const n = Number(btn.dataset.bnum);
        setPassedLessonFor(state.subject, n);
        // Also switch active selection cleanly to the new current lesson
        state.selectedUnits[state.subject] = currentBoundaryUnitIds(state.subject);
        saveState();
        closeModal();
        renderAll();
        const picked = bInfo.all.find((x) => x.num === n);
        showToast(`Граница программы: ${picked ? picked.label : n}`);
      };
    });
  }

  // ============================================================================
  // UNIT PICKER MODAL (RESPECTS PROGRAM BOUNDARY!)
  // ============================================================================
  function openUnitPicker() {
    const d = curData();
    const bInfo = boundaryInfo();
    const sel = new Set(activeUnits());
    const groups = {};
    d.units.forEach((u) => {
      if (!groups[u.group]) groups[u.group] = [];
      groups[u.group].push(u);
    });

    function draw() {
      const body = Object.entries(groups).map(([grp, list]) => `
        <div>
          <div class="section-label" style="margin-bottom:8px">${esc(grp)}</div>
          <div class="chip-row" style="margin-top:0">
            ${list.map((u) => {
              const locked = isUnitLocked(u);
              return `
                <button type="button" class="pill${locked ? ' locked' : sel.has(u.id) ? ' active' : ''}" data-uid="${u.id}" data-locked="${locked ? '1' : '0'}">
                  ${locked ? '🔒 ' : ''}${esc(u.label)}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `).join('');

      const presetFr = state.subject === 'fr' && state.frPassedLesson > 0
        ? `<button type="button" class="btn btn-secondary btn-sm" id="presetA2Passed">Пройденное A2 (L1–L${state.frPassedLesson})</button>`
        : '';

      openModal(`
        <div class="modal-head">
          <h3 class="modal-title">Выбор уроков · ${esc(d.shortName)}</h3>
          <button type="button" class="btn btn-secondary btn-sm" id="closeMod">Готово</button>
        </div>
        ${bInfo && bInfo.lockedCount ? `<div class="small muted">🔒 Будущие уроки (после ${esc(bInfo.cur.label)}) скрыты от тренажёров. <button type="button" class="pill soft-accent" id="jumpBoundBtn" style="padding:2px 8px;min-height:24px;font-size:11.5px;margin-left:4px">Сдвинуть границу</button></div>` : ''}
        <div class="row-gap">
          <button type="button" class="btn btn-secondary btn-sm" id="selAll">${bInfo ? 'Всё пройденное' : 'Выбрать всё'}</button>
          <button type="button" class="btn btn-secondary btn-sm" id="selNone">Снять всё</button>
          ${presetFr}
        </div>
        ${body}
        <button type="button" class="btn btn-primary btn-block" id="applyUnits">Применить (${sel.size})</button>
      `);

      const jb = $('#jumpBoundBtn');
      if (jb) jb.onclick = () => { closeModal(true); openBoundaryModal(); };

      $('#modalSheet').querySelectorAll('[data-uid]').forEach((b) => {
        b.onclick = () => {
          if (b.dataset.locked === '1') {
            showToast(`Урок пока скрыт границей (${bInfo ? bInfo.cur.label : ''}). Нажми «Сдвинуть границу»`);
            return;
          }
          const id = b.dataset.uid;
          if (sel.has(id)) sel.delete(id); else sel.add(id);
          draw();
        };
      });
      $('#selAll').onclick = () => { allowedUnits().forEach((id) => sel.add(id)); draw(); };
      $('#selNone').onclick = () => { sel.clear(); draw(); };
      const pa = $('#presetA2Passed');
      if (pa) pa.onclick = () => {
        sel.clear();
        for (let i = 1; i <= state.frPassedLesson; i++) sel.add(`a2-${i}`);
        draw();
      };
      const apply = () => {
        if (!sel.size) { showToast('Выбери хотя бы один урок'); return; }
        state.selectedUnits[state.subject] = Array.from(sel);
        saveState();
        closeModal();
        renderAll();
      };
      $('#applyUnits').onclick = apply;
      $('#closeMod').onclick = apply;
    }
    draw();
  }

  // ============================================================================
  // TAB 2: CHEATSHEET (ШПАРГАЛКА)
  // ============================================================================
  function renderCheatTab(root) {
    const d = curData();
    const tabs = [
      { id: 'vocab', label: 'Словарь' },
      { id: 'grammar', label: 'Правила' },
    ];
    if (state.subject === 'fr') tabs.push({ id: 'conj', label: 'Спряжения' });
    if (state.subject === 'econ') tabs.push({ id: 'maps', label: 'Concept Maps' });
    if (state.subject === 'komkor') tabs.push({ id: 'cliches', label: 'Клише' });

    if (!tabs.some((t) => t.id === state.cheatSub)) state.cheatSub = 'vocab';

    let content = '';
    if (state.cheatSub === 'vocab') {
      const q = (state.cheatSearch || '').toLowerCase().trim();
      const allowSet = new Set(allowedUnits());
      let cards = filteredCards();
      if (q) {
        cards = d.cards.filter((c) => {
          if (!state.cheatShowFuture && !allowSet.has(c.unit)) return false;
          if (state.subject === 'fr' && state.frGreenOnly && !c.green) return false;
          if (state.subject === 'en' && state.enAvOnly && !c.av) return false;
          return c.term.toLowerCase().includes(q) || c.ru.toLowerCase().includes(q) || (c.coll && c.coll.toLowerCase().includes(q));
        });
      }
      const shown = cards.slice(0, 80);
      content = `
        <div class="search-wrap">
          <input type="search" class="search-input" id="cheatSearch" placeholder="Поиск слова на ${d.langLabel} или русском..." value="${esc(state.cheatSearch)}">
        </div>
        <div class="row-between small muted" style="flex-wrap:wrap;gap:6px">
          <span>Найдено: ${cards.length}${cards.length > 80 ? ' (показаны первые 80)' : ''}</span>
          <div class="row-gap" style="gap:6px">
            ${state.subject === 'fr' ? `<button type="button" class="pill${state.frGreenOnly ? ' green-active' : ''}" id="cheatGreen">Только зелёные</button>` : ''}
            ${state.subject === 'en' ? `<button type="button" class="pill${state.enAvOnly ? ' green-active' : ''}" id="cheatEnAv">Только AV</button>` : ''}
            ${d.hasProgramBoundary ? `<button type="button" class="pill${state.cheatShowFuture ? ' warn' : ''}" id="cheatFutureToggle">${state.cheatShowFuture ? '🔒 С будущими' : 'Только пройденное'}</button>` : ''}
          </div>
        </div>
        <div class="mode-list">
          ${shown.map((c) => {
            const isFut = !allowSet.has(c.unit);
            return `
            <div class="dict-item">
              <div style="min-width:0">
                <div class="dict-term">${esc(c.term)} ${c.green ? '<span class="pill green-active" style="padding:1px 7px;min-height:20px;font-size:11px">зелёное</span>' : ''} ${c.av ? '<span class="pill soft-accent" style="padding:1px 7px;min-height:20px;font-size:11px">AV</span>' : ''} ${isFut ? '<span class="badge-future">🔒 будущее</span>' : ''}</div>
                <div class="dict-ru">${esc(c.ru)}</div>
                ${c.coll ? `<div class="dict-meta"><b>Колл.:</b> ${esc(c.coll)}</div>` : ''}
                ${c.ex ? `<div class="dict-meta">${esc(c.ex)}</div>` : ''}
              </div>
              <button type="button" class="tts-btn" data-say="${esc(c.term)}" aria-label="Произнести">${ICO.vol}</button>
            </div>`;
          }).join('')}
        </div>
      `;
    } else if (state.cheatSub === 'grammar') {
      const q = (state.cheatSearch || '').toLowerCase().trim();
      const pl = passedLessonFor();
      const allowSet = new Set(allowedUnits());
      const selSet = new Set(activeUnits());
      const allSheets = d.cheatsheets || [];

      const matchSheet = (sh) => {
        if (!q) return sh;
        const blocks = sh.blocks.filter((b) =>
          b.heading.toLowerCase().includes(q) || b.body.toLowerCase().includes(q) || sh.title.toLowerCase().includes(q)
        );
        return blocks.length ? { ...sh, blocks } : null;
      };

      const passedSheets = [];
      const futureSheets = [];
      allSheets.forEach((sh) => {
        const isFut = (typeof sh.minLesson === 'number' && sh.minLesson > pl) || (sh.unit && !allowSet.has(sh.unit));
        const m = matchSheet(sh);
        if (!m) return;
        if (isFut) futureSheets.push(m);
        else passedSheets.push(m);
      });

      // Put currently active units first so current lesson is immediately open at the top!
      passedSheets.sort((a, b) => (selSet.has(b.unit) ? 1 : 0) - (selSet.has(a.unit) ? 1 : 0));

      const renderSheetCard = (sh, idx, isFut) => `
        <details class="accordion"${(!isFut && (idx === 0 || !!q)) || (isFut && !!q) ? ' open' : ''}>
          <summary>
            <span>${esc(sh.title)} ${isFut ? '<span class="badge-future" style="margin-left:6px">🔒 На будущее</span>' : ''}</span>
            ${ICO.chev}
          </summary>
          <div class="accordion-body">
            ${sh.blocks.map((b) => `
              <div class="rule-block">
                <h4>${esc(b.heading)}</h4>
                ${renderRuleBody(b.body)}
                ${!isFut && b.builderTopic && window.BuilderEngine ? `<button type="button" class="rule-practice-btn" data-practice-topic="${esc(b.builderTopic)}">⚡ Отработать это правило</button>` : ''}
              </div>
            `).join('')}
          </div>
        </details>
      `;

      content = `
        <div class="search-wrap">
          <input type="search" class="search-input" id="cheatSearch" placeholder="Поиск по правилам (qui, gérondif, gerund, complex subject...)" value="${esc(state.cheatSearch)}">
        </div>
        <div class="small muted">Пройденные разделы: ${passedSheets.length}${futureSheets.length ? ` · На будущее 🔒: ${futureSheets.length}` : ''}</div>
        ${passedSheets.map((sh, idx) => renderSheetCard(sh, idx, false)).join('')}
        ${futureSheets.length ? `
          <div class="section-label" style="margin-top:6px">🔒 На будущее (пока не попадают в тренажёры)</div>
          ${futureSheets.map((sh, idx) => renderSheetCard(sh, idx, true)).join('')}
        ` : ''}
      `;
    } else if (state.cheatSub === 'conj' && state.subject === 'fr') {
      const q = (state.cheatSearch || '').toLowerCase().trim();
      const verbs = d.conjugations.filter((v) => !q || v.inf.toLowerCase().includes(q) || v.ru.toLowerCase().includes(q) || v.similar.toLowerCase().includes(q));
      content = `
        <div class="search-wrap">
          <input type="search" class="search-input" id="cheatSearch" placeholder="Поиск глагола (venir, prendre, жить...)" value="${esc(state.cheatSearch)}">
        </div>
        ${verbs.map((v) => `
          <details class="accordion">
            <summary>
              <span><b>${esc(v.inf)}</b> <span class="muted small">· ${esc(v.ru)}</span></span>
              <span class="pill ${v.aux === 'être' ? 'warn' : 'soft-accent'}" style="min-height:24px;padding:2px 8px;font-size:11px">${v.aux}</span>
            </summary>
            <div class="accordion-body">
              <div class="conj-grid">
                ${v.present.map((p) => `<div class="conj-cell">${esc(p)}</div>`).join('')}
              </div>
              <div class="small" style="display:flex;flex-direction:column;gap:4px;margin-top:6px">
                <div><b>Passé composé:</b> ${esc(v.pc.join(' · '))}</div>
                <div><b>Imparfait:</b> ${esc(v.imparfait.join(' · '))}</div>
                <div><b>Impératif:</b> ${esc(v.imperatif.join(' · '))}</div>
                <div><b>Participe passé:</b> ${esc(v.pp)}</div>
                ${state.frPassedLesson >= 6 ? `<div><b>Futur simple:</b> ${esc(v.futur)}</div>` : `<div class="muted">Futur simple (с урока 6): ${esc(v.futur)}</div>`}
                ${state.frPassedLesson >= 10 ? `<div><b>Subjonctif:</b> ${esc(v.subjonctif)}</div>` : ''}
                ${v.similar ? `<div class="muted">+ так же: ${esc(v.similar)}</div>` : ''}
              </div>
              <button type="button" class="tts-btn" style="align-self:flex-start" data-say="${esc(v.present.join('. '))}">${ICO.vol} Прослушать présent</button>
            </div>
          </details>
        `).join('')}
      `;
    } else if (state.cheatSub === 'maps' && state.subject === 'econ') {
      content = `<div class="card"><p class="muted small" style="margin:0 0 10px">Нажми, чтобы открыть интерактивные карты со скрытием веток и тренажёром перевода.</p><button type="button" class="btn btn-primary btn-block" id="openMapsBtn">Открыть Concept Maps (Text I–V)</button></div>`;
    } else if (state.cheatSub === 'cliches' && state.subject === 'komkor') {
      content = d.cliches.map((st) => `
        <details class="accordion" open>
          <summary><span>${esc(st.stage)}</span>${ICO.chev}</summary>
          <div class="accordion-body">
            ${st.items.map((it) => `
              <div style="padding-top:8px;border-top:1px solid var(--border)">
                <div class="row-between">
                  <b class="small">${esc(it.en)}</b>
                  <button type="button" class="tts-btn" style="min-height:28px;padding:3px 8px" data-say="${esc(it.en)}">${ICO.vol}</button>
                </div>
                <div class="small muted">${esc(it.ru)}</div>
              </div>
            `).join('')}
          </div>
        </details>
      `).join('');
    }

    root.innerHTML = `
      <div class="seg" id="cheatSeg">
        ${tabs.map((t) => `<button type="button" class="${t.id === state.cheatSub ? 'active' : ''}" data-csub="${t.id}">${esc(t.label)}</button>`).join('')}
      </div>
      ${content}
    `;

    $('#cheatSeg').querySelectorAll('button').forEach((b) => {
      b.onclick = () => {
        state.cheatSub = b.dataset.csub;
        state.cheatSearch = '';
        saveState();
        renderCheatTab(root);
      };
    });

    const si = $('#cheatSearch');
    if (si) {
      si.oninput = () => {
        state.cheatSearch = si.value;
        renderCheatTab(root);
        const again = $('#cheatSearch');
        if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
      };
    }

    const cg = $('#cheatGreen');
    if (cg) cg.onclick = () => { state.frGreenOnly = !state.frGreenOnly; saveState(); renderCheatTab(root); };
    const cea = $('#cheatEnAv');
    if (cea) cea.onclick = () => { state.enAvOnly = !state.enAvOnly; saveState(); renderCheatTab(root); };
    const cft = $('#cheatFutureToggle');
    if (cft) cft.onclick = () => { state.cheatShowFuture = !state.cheatShowFuture; saveState(); renderCheatTab(root); };

    root.querySelectorAll('[data-practice-topic]').forEach((b) => {
      b.onclick = () => startBuilderSession({ topicId: b.dataset.practiceTopic });
    });

    const om = $('#openMapsBtn');
    if (om) om.onclick = startEconMapsSession;

    root.querySelectorAll('[data-say]').forEach((b) => {
      b.onclick = (e) => { e.stopPropagation(); speak(b.dataset.say, d.lang); };
    });
  }

  // ============================================================================
  // TAB 3: PROGRESS & EXAM COUNTDOWN
  // ============================================================================
  function renderProgressTab(root) {
    const curStats = subjectStats(state.subject);
    const curMistakes = state.mistakes[state.subject] || [];
    const examsSorted = state.exams.slice().sort((a, b) => a.date.localeCompare(b.date));

    root.innerHTML = `
      <!-- Top Summary Tiles -->
      <div class="card">
        <div class="row-between" style="margin-bottom:10px">
          <div style="font-weight:700;font-size:16px">Статистика · ${esc(curData().shortName)}</div>
          <span class="pill soft-accent">Серия: ${state.streak.count} дн.</span>
        </div>
        <div class="stat-grid">
          <div class="stat-tile"><div class="stat-num" style="color:var(--good)">${curStats.known}</div><div class="stat-lbl">Выучено</div></div>
          <div class="stat-tile"><div class="stat-num" style="color:var(--warn)">${curStats.review}</div><div class="stat-lbl">На повторе</div></div>
          <div class="stat-tile"><div class="stat-num">${curStats.fresh}</div><div class="stat-lbl">Новые</div></div>
        </div>
        ${curMistakes.length ? `<button type="button" class="btn btn-bad btn-block" style="margin-top:12px" id="progMistakesBtn">Отработать ошибки (${curMistakes.length})</button>` : ''}
      </div>

      <!-- Exam Countdown Planner -->
      <div class="card">
        <div class="row-between" style="margin-bottom:10px">
          <div>
            <div style="font-weight:700;font-size:16px">Счётчик «До среза»</div>
            <div class="small muted">Делит объём на ежедневную норму</div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="addExamBtn">+ Срез</button>
        </div>
        ${examsSorted.length ? examsSorted.map((ex) => {
          const left = daysBetween(todayStr(), ex.date);
          const st = subjectStats(ex.subject);
          const rem = Math.max(0, st.total - st.known);
          const daily = left > 0 ? Math.ceil(rem / left) : rem;
          const sName = window.STUDY_DATA[ex.subject]?.shortName || ex.subject;
          return `
            <div class="subj-prog-row">
              <div class="row-between">
                <div>
                  <b>${esc(ex.title)}</b> <span class="small muted">· ${esc(sName)}</span>
                  <div class="small muted">${left > 0 ? `Осталось ${left} дн. (${ex.date}) · норма ~${daily} карт./день` : left === 0 ? 'Сегодня!' : 'Дата прошла'}</div>
                </div>
                <button type="button" class="btn btn-outline btn-sm" data-del-exam="${ex.id}">Удалить</button>
              </div>
            </div>
          `;
        }).join('') : '<div class="small muted">Пока нет дат срезов. Нажми «+ Срез», чтобы рассчитать дневной темп.</div>'}
      </div>

      <!-- All 5 Subjects Overview -->
      <div class="card">
        <div style="font-weight:700;font-size:16px;margin-bottom:6px">Все 5 направлений</div>
        ${SUBJECT_ORDER.map((id) => {
          const d = window.STUDY_DATA[id];
          const st = subjectStats(id);
          const pct = st.total ? Math.round((st.known / st.total) * 100) : 0;
          return `
            <div class="subj-prog-row" style="cursor:pointer" data-jump="${id}">
              <div class="row-between">
                <span class="row-gap" style="gap:7px"><span class="subject-dot" style="background:${d.accentColor}"></span><b>${esc(d.name)}</b></span>
                <span class="small muted" style="font-variant-numeric:tabular-nums">${st.known} / ${st.total} (${pct}%)</span>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${d.accentColor}"></div></div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Quiz Simulator History -->
      <div class="card">
        <div style="font-weight:700;font-size:16px;margin-bottom:8px">Последние симуляторы срезов</div>
        ${state.quizHistory.length ? state.quizHistory.slice(0, 8).map((q) => {
          const sName = window.STUDY_DATA[q.subject]?.shortName || q.subject;
          const badge = q.pct >= 85 ? 'green-active' : q.pct >= 65 ? 'warn' : 'bad';
          return `
            <div class="row-between" style="padding:8px 0;border-top:1px solid var(--border)">
              <div>
                <b>${esc(sName)}</b> <span class="small muted">· ${esc(q.date)}</span>
                <div class="small muted">${q.score} из ${q.total} верно</div>
              </div>
              <span class="pill ${badge}">${q.pct}%</span>
            </div>
          `;
        }).join('') : '<div class="small muted">Здесь появятся результаты твоих тренировочных срезов.</div>'}
      </div>
    `;

    const pm = $('#progMistakesBtn');
    if (pm) pm.onclick = startMistakesSession;

    $('#addExamBtn').onclick = openAddExamModal;
    root.querySelectorAll('[data-del-exam]').forEach((b) => {
      b.onclick = () => {
        state.exams = state.exams.filter((x) => x.id !== b.dataset.delExam);
        saveState();
        renderProgressTab(root);
      };
    });
    root.querySelectorAll('[data-jump]').forEach((row) => {
      row.onclick = () => {
        state.subject = row.dataset.jump;
        state.tab = 'learn';
        saveState();
        renderAll();
      };
    });
  }

  function openAddExamModal() {
    const defDate = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
    openModal(`
      <div class="modal-head">
        <h3 class="modal-title">Добавить срез / экзамен</h3>
        <button type="button" class="btn btn-secondary btn-sm" id="closeMod">Закрыть</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <label class="small muted">Предмет
          <select class="input-field" id="exSubj" style="margin-top:4px">
            ${SUBJECT_ORDER.map((id) => `<option value="${id}"${id === state.subject ? ' selected' : ''}>${esc(window.STUDY_DATA[id].name)}</option>`).join('')}
          </select>
        </label>
        <label class="small muted">Название
          <input type="text" class="input-field" id="exTitle" style="margin-top:4px" placeholder="Например: Срез A2 Урок 5" value="Срез · ${esc(curData().shortName)}">
        </label>
        <label class="small muted">Дата
          <input type="date" class="input-field" id="exDate" style="margin-top:4px" value="${defDate}">
        </label>
        <button type="button" class="btn btn-primary btn-block" id="saveExamBtn">Сохранить дату</button>
      </div>
    `);
    $('#closeMod').onclick = closeModal;
    $('#saveExamBtn').onclick = () => {
      const title = $('#exTitle').value.trim() || 'Срез';
      const date = $('#exDate').value;
      const subject = $('#exSubj').value;
      if (!date) return;
      state.exams.push({ id: 'ex-' + Date.now(), subject, title, date });
      saveState();
      closeModal();
      showToast('Срез добавлен');
      renderAll();
    };
  }

  // ============================================================================
  // SETTINGS MODAL (Gear Icon)
  // ============================================================================
  function openSettingsModal() {
    const presets = window.BuilderEngine ? window.BuilderEngine.AI_PRESETS : {};
    const ai = state.ai || { preset: 'deepseek', url: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat', apiKey: '' };

    openModal(`
      <div class="modal-head">
        <h3 class="modal-title">Настройки</h3>
        <button type="button" class="btn btn-secondary btn-sm" id="closeMod">Готово</button>
      </div>

      <div>
        <div class="setting-row">
          <div>
            <b>Французский: где я сейчас</b>
            <div class="small muted">Скрывает непройденные уроки и времена из тренажёров</div>
          </div>
          <select class="input-field" id="setFrLesson" style="width:108px;padding:8px">
            <option value="0"${state.frPassedLesson === 0 ? ' selected' : ''}>Весь A1</option>
            ${[1,2,3,4,5,6,7,8,9,10].map((n) => `<option value="${n}"${state.frPassedLesson === n ? ' selected' : ''}>A2 L${n}</option>`).join('')}
          </select>
        </div>

        <div class="setting-row">
          <div>
            <b>General EN: где я сейчас</b>
            <div class="small muted">Граница пройденных юнитов Winning Strategy</div>
          </div>
          <select class="input-field" id="setEnLesson" style="width:108px;padding:8px">
            ${[1,2,3].map((n) => `<option value="${n}"${state.enPassedLesson === n ? ' selected' : ''}>Unit ${n}</option>`).join('')}
          </select>
        </div>

        <div class="setting-row">
          <div>
            <b>Не гасить экран в тренировке</b>
            <div class="small muted">Держит экран активным во время сессии</div>
          </div>
          <button type="button" class="pill${state.wakeLock ? ' active' : ''}" id="setWake">${state.wakeLock ? 'Вкл' : 'Выкл'}</button>
        </div>

        <div class="setting-row">
          <div>
            <b>Озвучка (голос)</b>
            <div class="small muted">Живой голос с автокэшем работает на Huawei для FR и EN без Google-пакетов</div>
          </div>
          <select class="input-field" id="setTtsMode" style="width:136px;padding:8px;font-size:13px">
            <option value="auto"${(state.ttsMode || 'auto') === 'auto' ? ' selected' : ''}>Живой + кэш</option>
            <option value="system"${state.ttsMode === 'system' ? ' selected' : ''}>Системный</option>
          </select>
        </div>

        <!-- Hybrid AI Tutor Config -->
        <div class="ai-box" style="margin:10px 0">
          <div class="row-between">
            <b>✨ ИИ-репетитор (Гибрид, опционально)</b>
            <span class="pill ${hasAiKey() ? 'green-active' : ''}" style="min-height:22px;padding:2px 8px;font-size:11px">${hasAiKey() ? 'Подключён' : 'Офлайн'}</span>
          </div>
          <div class="small muted">Без ключа всё работает 100% офлайн. С ключом открываются живые фразы от ИИ и умная проверка свободного перевода. Ключ хранится только на телефоне и не попадает в JSON-бэкап.</div>
          <label class="small muted">Провайдер
            <select class="input-field" id="aiPreset" style="margin-top:4px;padding:8px">
              ${Object.entries(presets).map(([k, v]) => `<option value="${k}"${ai.preset === k ? ' selected' : ''}>${esc(v.name)}</option>`).join('')}
            </select>
          </label>
          <label class="small muted">API URL
            <input type="text" class="input-field" id="aiUrl" style="margin-top:4px;padding:8px;font-size:13px" value="${esc(ai.url)}">
          </label>
          <label class="small muted">Модель
            <input type="text" class="input-field" id="aiModel" style="margin-top:4px;padding:8px;font-size:13px" value="${esc(ai.model)}">
          </label>
          <label class="small muted">API-ключ
            <input type="password" class="input-field" id="aiKey" style="margin-top:4px;padding:8px;font-size:13px" placeholder="sk-..." value="${esc(ai.apiKey || '')}">
          </label>
          <div class="row-gap">
            <button type="button" class="btn btn-primary btn-sm" id="saveAiBtn">Сохранить</button>
            <button type="button" class="btn btn-secondary btn-sm" id="testAiBtn">Проверить связь</button>
            ${hasAiKey() ? '<button type="button" class="btn btn-outline btn-sm" id="clearAiBtn">Удалить ключ</button>' : ''}
          </div>
          <div class="small muted" id="aiStatusLine"></div>
        </div>

        <div class="setting-row">
          <div>
            <b>Бэкап прогресса (JSON)</b>
            <div class="small muted">Сохранить или восстановить прогресс (без API-ключа)</div>
          </div>
          <div class="row-gap">
            <button type="button" class="btn btn-secondary btn-sm" id="exportBtn">Экспорт</button>
            <button type="button" class="btn btn-secondary btn-sm" id="importBtn">Импорт</button>
            <input type="file" id="importFile" accept=".json" hidden>
          </div>
        </div>

        <div class="setting-row">
          <div>
            <b>Очистить историю и прогресс</b>
            <div class="small muted">Сбросит карточки и ошибки, но сохранит даты срезов и настройки</div>
          </div>
          <button type="button" class="btn btn-bad btn-sm" id="resetProgBtn">Сбросить</button>
        </div>
      </div>
    `);

    $('#closeMod').onclick = closeModal;
    $('#setFrLesson').onchange = (e) => {
      setPassedLessonFor('fr', Number(e.target.value));
      renderAll();
      showToast(`Французский: до ${state.frPassedLesson === 0 ? 'A1' : 'A2 L' + state.frPassedLesson}`);
    };
    $('#setEnLesson').onchange = (e) => {
      setPassedLessonFor('en', Number(e.target.value));
      renderAll();
      showToast(`General EN: до Unit ${state.enPassedLesson}`);
    };
    $('#setWake').onclick = () => {
      state.wakeLock = !state.wakeLock;
      saveState();
      openSettingsModal();
    };
    const stts = $('#setTtsMode');
    if (stts) stts.onchange = (e) => {
      state.ttsMode = e.target.value;
      saveState();
      showToast(state.ttsMode === 'auto' ? 'Озвучка: живой голос + офлайн-кэш' : 'Озвучка: только системный голос');
    };
    $('#aiPreset').onchange = (e) => {
      const p = presets[e.target.value];
      if (p) {
        $('#aiUrl').value = p.url;
        $('#aiModel').value = p.model;
      }
    };
    const readAiForm = () => ({
      preset: $('#aiPreset').value,
      url: $('#aiUrl').value.trim(),
      model: $('#aiModel').value.trim(),
      apiKey: $('#aiKey').value.trim(),
    });
    $('#saveAiBtn').onclick = () => {
      state.ai = readAiForm();
      saveState();
      renderAll();
      showToast(hasAiKey() ? 'ИИ-репетитор подключён' : 'Настройки сохранены (офлайн)');
      openSettingsModal();
    };
    $('#testAiBtn').onclick = async () => {
      const cfg = readAiForm();
      state.ai = cfg;
      saveState();
      const stEl = $('#aiStatusLine');
      stEl.textContent = 'Проверяю подключение…';
      try {
        const reply = await window.BuilderEngine.testConnection(cfg);
        stEl.innerHTML = `<span style="color:var(--good)"><b>Связь есть!</b> Ответ: ${esc(reply)}</span>`;
      } catch (err) {
        stEl.innerHTML = `<span style="color:var(--bad)">${esc(err.message || String(err))}</span>`;
      }
    };
    const clAi = $('#clearAiBtn');
    if (clAi) clAi.onclick = () => {
      state.ai.apiKey = '';
      saveState();
      renderAll();
      showToast('API-ключ удалён');
      openSettingsModal();
    };
    $('#exportBtn').onclick = () => {
      const safeState = { ...state, ai: { ...state.ai, apiKey: '' } };
      const json = JSON.stringify(safeState, null, 2);
      const fname = `linguaprep-backup-${todayStr()}.json`;
      if (window.AndroidBridge && typeof window.AndroidBridge.saveBackup === 'function') {
        window.AndroidBridge.saveBackup(json, fname);
        return;
      }
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fname;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Бэкап скачан');
    };
    $('#importBtn').onclick = () => $('#importFile').click();
    $('#importFile').onchange = (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          state = { ...defaultState(), ...imported };
          saveState();
          closeModal();
          renderAll();
          showToast('Прогресс восстановлен');
        } catch {
          showToast('Ошибка чтения файла');
        }
      };
      reader.readAsText(f);
    };
    $('#resetProgBtn').onclick = () => {
      if (!confirm('Сбросить прогресс по карточкам, ошибкам и квизам? Даты срезов и настройки останутся.')) return;
      state.srs = {};
      state.mistakes = {};
      state.quizHistory = [];
      state.streak = { count: 0, lastDate: '' };
      saveState();
      closeModal();
      renderAll();
      showToast('Прогресс очищен');
    };
  }

  // Modal helpers + Hardware Back button support (race-free transitions!)
  let uiDepth = 0;
  function openModal(html) {
    const wasHidden = $('#modalBackdrop').hidden;
    $('#modalSheet').innerHTML = html;
    $('#modalBackdrop').hidden = false;
    if (wasHidden) {
      uiDepth++;
      history.pushState({ ui: 'modal', depth: uiDepth }, '');
    }
  }
  function closeModal(skipHistory = false) {
    if ($('#modalBackdrop').hidden) return;
    $('#modalBackdrop').hidden = true;
    $('#modalSheet').innerHTML = '';
    if (!skipHistory && history.state?.ui === 'modal') {
      uiDepth = Math.max(0, uiDepth - 1);
      history.back();
    }
  }
  $('#modalBackdrop').onclick = (e) => {
    if (e.target === $('#modalBackdrop')) closeModal();
  };

  // ============================================================================
  // SESSION LIFECYCLE
  // ============================================================================
  function openSession(sessObj, replaceHistory = false) {
    clearInterval(timerId);
    timerId = null;
    session = sessObj;
    $('#sessionOverlay').hidden = false;
    document.body.style.overflow = 'hidden';
    if (replaceHistory) {
      history.replaceState({ ui: 'session', depth: uiDepth }, '');
    } else {
      uiDepth++;
      history.pushState({ ui: 'session', depth: uiDepth }, '');
    }
    acquireWakeLock();
    renderSession();
  }

  function closeSession(skipHistory = false) {
    clearInterval(timerId);
    timerId = null;
    releaseWakeLock();
    try { window.AndroidBridge?.stopSpeak?.(); } catch {}
    session = null;
    $('#sessionOverlay').hidden = true;
    $('#sessionOverlay').innerHTML = '';
    $('#toast').hidden = true;
    document.body.style.overflow = '';
    if (!skipHistory && history.state?.ui === 'session') {
      uiDepth = Math.max(0, uiDepth - 1);
      history.back();
    }
    renderAll();
  }

  window.addEventListener('popstate', (e) => {
    const st = e.state;
    if (!$('#modalBackdrop').hidden && st?.ui !== 'modal') {
      closeModal(true);
    } else if (session && st?.ui !== 'session') {
      closeSession(true);
    }
  });

  // Native Android Back button hook
  window.__appBack = function () {
    if (!$('#modalBackdrop').hidden) {
      closeModal();
      return true;
    }
    if (session) {
      closeSession();
      return true;
    }
    if (state.tab !== 'learn') {
      state.tab = 'learn';
      renderAll();
      return true;
    }
    return false;
  };

  function sessionHeaderHtml(title, progressText, canUndo = false, timerText = '') {
    return `
      <div class="session-bar">
        <button type="button" class="back-btn" id="sessBack">${ICO.back} Назад</button>
        <div class="session-meta">
          ${timerText ? `<span class="timer-pill" id="timerVal">${timerText}</span>` : ''}
          <span>${esc(title)}${progressText ? ' · ' + esc(progressText) : ''}</span>
        </div>
        <div class="row-gap" style="gap:6px">
          ${canUndo ? `<button type="button" class="icon-btn" id="sessUndo" title="Отменить шаг" aria-label="Отменить">${ICO.undo}</button>` : ''}
          <button type="button" class="icon-btn" id="sessTheme" aria-label="Тема">${state.theme === 'dark' ? ICO.sun : ICO.moon}</button>
        </div>
      </div>
    `;
  }

  function bindSessionBar(onUndo) {
    $('#sessBack').onclick = () => closeSession();
    $('#sessTheme').onclick = () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      saveState();
      applyTheme();
      renderSession();
    };
    const u = $('#sessUndo');
    if (u && onUndo) u.onclick = onUndo;
  }

  // ============================================================================
  // MODE 1: FLASHCARDS (SRS)
  // ============================================================================
  function pickCardQueue(limit = 25) {
    const cards = filteredCards();
    const today = todayStr();
    // Priority: due review -> new -> learned
    const due = [], fresh = [], rest = [];
    cards.forEach((c) => {
      const r = state.srs[c.id];
      if (!r || !r.seen) fresh.push(c);
      else if (r.due <= today || r.box < 2) due.push(c);
      else rest.push(c);
    });
    return [...shuffle(due), ...shuffle(fresh), ...shuffle(rest)].slice(0, limit);
  }

  function sideForCard() {
    if (state.dir === 'mix') return Math.random() < 0.5 ? 'ru' : 'foreign';
    return state.dir;
  }

  function startCardsSession() {
    const q = pickCardQueue(30).map((c) => ({ c, side: sideForCard() }));
    if (!q.length) { showToast('Нет карточек в выбранных уроках'); return; }
    openSession({
      type: 'cards',
      title: 'Карточки',
      queue: q,
      i: 0,
      flipped: false,
      good: 0,
      hard: 0,
      again: 0,
      history: [],
    });
  }

  function renderCardsSession(ov) {
    const d = curData();
    if (session.i >= session.queue.length) {
      return renderSessionSummary(ov, {
        title: 'Карточки пройдены',
        good: session.good + session.hard,
        total: session.queue.length,
        sub: `Знаю: ${session.good} · Путаюсь: ${session.hard} · Повторить: ${session.again}`,
        onAgain: startCardsSession,
      });
    }
    const item = session.queue[session.i];
    const c = item.c;
    const askRu = item.side === 'ru';
    const frontText = askRu ? c.ru : c.term;
    const backText = askRu ? c.term : c.ru;
    const frontLang = askRu ? 'RU' : d.langLabel;
    const backLang = askRu ? d.langLabel : 'RU';
    const pct = Math.round((session.i / session.queue.length) * 100);
    const showForeign = session.flipped || !askRu;

    ov.innerHTML = `<div class="session-inner">
      ${sessionHeaderHtml(session.title, `${session.i + 1} / ${session.queue.length}`, session.history.length > 0)}
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>

      <div class="flashcard${session.flipped ? ' flipped' : ''}" id="fcCard">
        <div class="fc-top">
          <span class="fc-tag">${session.flipped ? backLang : frontLang} · ${esc(c.tag || c.unit)}</span>
          ${showForeign ? `<button type="button" class="tts-btn" id="fcSpeak">${ICO.vol} Слушать</button>` : '<span></span>'}
        </div>
        <div class="fc-main">
          <div class="fc-word">${esc(session.flipped ? backText : frontText)}</div>
          ${session.flipped ? `
            <div class="fc-extra">
              <div><b>${esc(frontLang)}:</b> ${esc(frontText)}</div>
              ${c.def ? `<div><b>Опр.:</b> ${esc(c.def)}</div>` : ''}
              ${c.coll ? `<div><b>Колл.:</b> ${esc(c.coll)}</div>` : ''}
              ${c.ex ? `<div><b>Пример:</b> ${esc(c.ex)}</div>` : ''}
              ${c.note ? `<div><b>Заметка:</b> ${esc(c.note)}</div>` : ''}
            </div>
          ` : ''}
        </div>
        <div class="fc-hint">${session.flipped ? 'Оцени, насколько уверенно вспомнил' : 'Нажми на карточку, чтобы перевернуть'}</div>
      </div>

      <div class="srs-actions">
        <button type="button" class="srs-btn bad" data-rate="again"><strong>Не знаю</strong><span>повтор сразу</span></button>
        <button type="button" class="srs-btn warn" data-rate="hard"><strong>Путаюсь</strong><span>через 1 дн.</span></button>
        <button type="button" class="srs-btn good" data-rate="good"><strong>Знаю</strong><span>дальше</span></button>
      </div>
    </div>`;

    bindSessionBar(() => {
      const last = session.history.pop();
      if (!last) return;
      if (last.prevSrs) state.srs[last.cardId] = last.prevSrs;
      else delete state.srs[last.cardId];
      if (last.appended) session.queue.pop();
      session[last.rating]--;
      session.i = last.idx;
      session.flipped = true;
      saveState();
      renderSession();
      showToast('Шаг отменён');
    });

    $('#fcCard').onclick = () => {
      session.flipped = !session.flipped;
      renderSession();
    };
    const sp = $('#fcSpeak');
    if (sp) sp.onclick = (e) => { e.stopPropagation(); speak(c.term, d.lang); };

    ov.querySelectorAll('[data-rate]').forEach((b) => {
      b.onclick = () => {
        const rating = b.dataset.rate;
        const prevSrs = updateSRS(c.id, rating);
        let appended = false;
        if (rating === 'again') {
          addMistake(state.subject, { key: 'card:' + c.id, kind: 'card', prompt: c.ru, answer: c.term, ru: c.ru, explain: c.coll || c.def || c.tag || '' });
          if (session.queue.length < 45) {
            session.queue.push({ c, side: item.side });
            appended = true;
          }
        } else if (rating === 'good') {
          removeMistake(state.subject, 'card:' + c.id);
        }
        session[rating]++;
        session.history.push({ idx: session.i, cardId: c.id, prevSrs, rating, appended });
        session.i++;
        session.flipped = false;
        renderSession();
      };
    });
  }

  // ============================================================================
  // MODE 2: DICTATION (TYPING + FRENCH ACCENTS)
  // ============================================================================
  function startDictationSession() {
    const q = pickCardQueue(15);
    if (!q.length) { showToast('Нет слов в выбранных уроках'); return; }
    openSession({
      type: 'dictation',
      title: 'Диктант',
      queue: q,
      i: 0,
      ok: 0,
      checked: false,
      isRight: false,
      userVal: '',
      hintShown: false,
      miss: [],
      history: [],
    });
  }

  function renderDictationSession(ov) {
    const d = curData();
    if (session.i >= session.queue.length) {
      return renderSessionSummary(ov, {
        title: 'Диктант завершён',
        good: session.ok,
        total: session.queue.length,
        miss: session.miss,
        onAgain: startDictationSession,
      });
    }
    const c = session.queue[session.i];
    const pct = Math.round((session.i / session.queue.length) * 100);
    const hintStr = c.term.slice(0, Math.min(4, Math.ceil(c.term.length / 3))) + '…';

    ov.innerHTML = `<div class="session-inner">
      ${sessionHeaderHtml(session.title, `${session.i + 1} / ${session.queue.length}`, session.history.length > 0)}
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>

      <div class="prompt-box">
        <div class="row-between">
          <span class="fc-tag">Переведи на ${d.langLabel} · ${esc(c.tag || c.unit)}</span>
          ${!session.checked ? `<button type="button" class="pill" id="hintBtn">${session.hintShown ? esc(hintStr) : 'Подсказка'}</button>` : ''}
        </div>
        <p class="prompt-text">${esc(c.ru)}</p>

        <input type="text" class="input-field" id="dictInput" autocomplete="off" autocorrect="off" spellcheck="false"
          placeholder="Введи перевод..." value="${esc(session.userVal)}"${session.checked ? ' disabled' : ''}>

        ${state.subject === 'fr' && !session.checked ? `
          <div class="accent-bar" id="accentBar">
            ${FR_ACCENTS.map((ch) => `<button type="button" class="accent-key" data-ch="${esc(ch)}">${esc(ch)}</button>`).join('')}
          </div>
        ` : ''}

        ${!session.checked ? `
          <button type="button" class="btn btn-primary btn-block" id="checkBtn">Проверить</button>
        ` : `
          <div class="feedback-box ${session.isRight ? 'ok' : 'no'}">
            <div class="row-between">
              <span class="feedback-title">${session.isRight ? 'Верно!' : 'Есть расхождение'}</span>
              <button type="button" class="tts-btn" id="dictSpeak">${ICO.vol} Слушать</button>
            </div>
            <div class="feedback-ans">${esc(c.term)}</div>
            ${c.coll ? `<div class="small muted">Колл.: ${esc(c.coll)}</div>` : ''}
          </div>
          <div class="row-gap">
            ${!session.isRight ? `<button type="button" class="btn btn-secondary" style="flex:1" id="overrideBtn">Засчитать верно</button>` : ''}
            <button type="button" class="btn btn-primary" style="flex:1" id="nextBtn">${session.i + 1 >= session.queue.length ? 'Результат' : 'Дальше'}</button>
          </div>
        `}
      </div>
    </div>`;

    bindSessionBar(() => {
      const last = session.history.pop();
      if (!last) return;
      if (last.wasRight) session.ok--;
      else session.miss.pop();
      session.i = last.idx;
      session.checked = false;
      session.userVal = '';
      session.hintShown = false;
      renderSession();
      showToast('Шаг отменён');
    });

    const inp = $('#dictInput');
    if (!session.checked && inp) {
      inp.focus();
      inp.onkeydown = (e) => { if (e.key === 'Enter') $('#checkBtn').click(); };
      const ab = $('#accentBar');
      if (ab) ab.querySelectorAll('.accent-key').forEach((k) => {
        k.onclick = () => insertAtCursor(inp, k.dataset.ch);
      });
      $('#hintBtn').onclick = () => { session.hintShown = true; session.userVal = inp.value; renderSession(); };
      $('#checkBtn').onclick = () => {
        session.userVal = inp.value.trim();
        session.isRight = checkTypedAnswer(session.userVal, c.term);
        session.checked = true;
        if (session.isRight) {
          session.ok++;
          updateSRS(c.id, 'good');
          removeMistake(state.subject, 'card:' + c.id);
        } else {
          session.miss.push({ prompt: c.ru, answer: c.term });
          updateSRS(c.id, 'again');
          addMistake(state.subject, { key: 'card:' + c.id, kind: 'card', prompt: c.ru, answer: c.term, ru: c.ru, explain: c.coll || c.tag || '' });
        }
        renderSession();
      };
    } else if (session.checked) {
      $('#dictSpeak').onclick = () => speak(c.term, d.lang);
      const ovb = $('#overrideBtn');
      if (ovb) ovb.onclick = () => {
        session.isRight = true;
        session.ok++;
        session.miss.pop();
        updateSRS(c.id, 'good');
        removeMistake(state.subject, 'card:' + c.id);
        renderSession();
        showToast('Засчитано!');
      };
      $('#nextBtn').onclick = () => {
        session.history.push({ idx: session.i, wasRight: session.isRight });
        session.i++;
        session.checked = false;
        session.userVal = '';
        session.hintShown = false;
        renderSession();
      };
    }
  }

  // ============================================================================
  // MODE 3 & 4: COLLOCATIONS & TRICKY PAIRS (UNIFIED CHOICE DRILL ENGINE)
  // ============================================================================
  function startCollocationSession() {
    const items = shuffle(filteredItems('collocations')).map((x) => ({
      key: 'coll:' + x.id,
      tag: 'Коллокация / предлог',
      prompt: x.prompt,
      options: shuffle(x.options),
      answer: x.answer,
      speakText: x.full,
      ru: x.ru,
      explain: x.rule,
    }));
    if (!items.length) { showToast('Нет коллокаций для выбранных тем'); return; }
    openChoiceSession('Коллокации', items);
  }

  function startTrickySession() {
    const items = shuffle(filteredItems('tricky')).map((x) => ({
      key: 'tricky:' + x.id,
      tag: x.pair,
      prompt: x.prompt,
      options: shuffle(x.options),
      answer: x.answer,
      speakText: x.answer,
      ru: '',
      explain: x.explain,
    }));
    if (!items.length) { showToast('Нет коварных пар'); return; }
    openChoiceSession('Коварные пары', items);
  }

  function openChoiceSession(title, items) {
    openSession({
      type: 'choice',
      title,
      queue: items,
      i: 0,
      ok: 0,
      picked: null,
      miss: [],
      history: [],
    });
  }

  function renderChoiceSession(ov) {
    const d = curData();
    if (session.i >= session.queue.length) {
      return renderSessionSummary(ov, {
        title: `${session.title}: готово`,
        good: session.ok,
        total: session.queue.length,
        miss: session.miss,
        onAgain: () => openChoiceSession(session.title, shuffle(session.queue)),
      });
    }
    const q = session.queue[session.i];
    const pct = Math.round((session.i / session.queue.length) * 100);
    const fmtPrompt = esc(q.prompt).replace(/___/g, '<span class="blank-hi">___</span>');

    ov.innerHTML = `<div class="session-inner">
      ${sessionHeaderHtml(session.title, `${session.i + 1} / ${session.queue.length}`, session.history.length > 0)}
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>

      <div class="prompt-box">
        <span class="fc-tag">${esc(q.tag)}</span>
        <p class="prompt-text">${fmtPrompt}</p>
        <div class="choices">
          ${q.options.map((opt, idx) => {
            let cls = '';
            if (session.picked !== null) {
              if (opt === q.answer) cls = ' ok';
              else if (opt === session.picked) cls = ' no';
            }
            return `<button type="button" class="choice-btn${cls}" data-opt="${idx}"${session.picked !== null ? ' disabled' : ''}>${esc(opt)}</button>`;
          }).join('')}
        </div>

        ${session.picked !== null ? `
          <div class="feedback-box ${session.picked === q.answer ? 'ok' : 'no'}">
            <div class="row-between">
              <span class="feedback-title">${session.picked === q.answer ? 'Точно!' : 'Правильно: ' + esc(q.answer)}</span>
              ${q.speakText ? `<button type="button" class="tts-btn" id="chSpeak">${ICO.vol}</button>` : ''}
            </div>
            ${q.ru ? `<div><b>Перевод:</b> ${esc(q.ru)}</div>` : ''}
            <div class="small">${esc(q.explain)}</div>
          </div>
          <button type="button" class="btn btn-primary btn-block" id="nextBtn">${session.i + 1 >= session.queue.length ? 'Результат' : 'Дальше'}</button>
        ` : ''}
      </div>
    </div>`;

    bindSessionBar(() => {
      const last = session.history.pop();
      if (!last) return;
      if (last.wasRight) session.ok--; else session.miss.pop();
      session.i = last.idx;
      session.picked = null;
      renderSession();
      showToast('Шаг отменён');
    });

    if (session.picked === null) {
      ov.querySelectorAll('[data-opt]').forEach((b) => {
        b.onclick = () => {
          const val = q.options[Number(b.dataset.opt)];
          session.picked = val;
          markActiveToday();
          if (val === q.answer) {
            session.ok++;
            removeMistake(state.subject, q.key);
          } else {
            session.miss.push({ prompt: q.prompt, answer: q.answer });
            addMistake(state.subject, { key: q.key, kind: 'choice', prompt: q.prompt, answer: q.answer, ru: q.ru || '', explain: q.explain });
          }
          renderSession();
        };
      });
    } else {
      const sp = $('#chSpeak');
      if (sp) sp.onclick = () => speak(q.speakText, d.lang);
      $('#nextBtn').onclick = () => {
        session.history.push({ idx: session.i, wasRight: session.picked === q.answer });
        session.i++;
        session.picked = null;
        renderSession();
      };
    }
  }

  // ============================================================================
  // MODE 5: TEXTBOOK EXERCISES
  // ============================================================================
  function startExerciseSession() {
    const list = shuffle(filteredItems('exercises')).slice(0, 20);
    if (!list.length) { showToast('Нет упражнений в выбранных уроках'); return; }
    openSession({
      type: 'exercises',
      title: 'Упражнения',
      queue: list,
      i: 0,
      ok: 0,
      checked: false,
      isRight: false,
      userVal: '',
      miss: [],
      history: [],
    });
  }

  function renderExerciseSession(ov) {
    const d = curData();
    if (session.i >= session.queue.length) {
      return renderSessionSummary(ov, {
        title: 'Упражнения выполнены',
        good: session.ok,
        total: session.queue.length,
        miss: session.miss,
        onAgain: startExerciseSession,
      });
    }
    const ex = session.queue[session.i];
    const pct = Math.round((session.i / session.queue.length) * 100);
    const fmtPrompt = esc(ex.prompt).replace(/___/g, '<span class="blank-hi">___</span>');
    const isChoice = ex.type === 'choice' && ex.options && ex.options.length;

    ov.innerHTML = `<div class="session-inner">
      ${sessionHeaderHtml(session.title, `${session.i + 1} / ${session.queue.length}`, session.history.length > 0)}
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>

      <div class="prompt-box">
        <div class="row-gap" style="gap:6px">
          <span class="pill soft-accent" style="min-height:24px;padding:2px 9px;font-size:11.5px">${esc(ex.source)}</span>
        </div>
        <p class="prompt-text">${fmtPrompt}</p>
        ${ex.ru && !session.checked && ex.prompt.includes('___') ? `<div class="small muted">Смысл: ${esc(ex.ru)}</div>` : ''}

        ${isChoice ? `
          <div class="choices">
            ${ex.options.map((opt, idx) => {
              let cls = '';
              if (session.checked) {
                if (opt === ex.answer) cls = ' ok';
                else if (opt === session.userVal) cls = ' no';
              }
              return `<button type="button" class="choice-btn${cls}" data-opt="${idx}"${session.checked ? ' disabled' : ''}>${esc(opt)}</button>`;
            }).join('')}
          </div>
        ` : `
          <input type="text" class="input-field" id="exInput" autocomplete="off" autocorrect="off" spellcheck="false"
            placeholder="Впиши ответ..." value="${esc(session.userVal)}"${session.checked ? ' disabled' : ''}>
          ${state.subject === 'fr' && !session.checked ? `
            <div class="accent-bar" id="accentBar">
              ${FR_ACCENTS.map((ch) => `<button type="button" class="accent-key" data-ch="${esc(ch)}">${esc(ch)}</button>`).join('')}
            </div>
          ` : ''}
          ${!session.checked ? `
            <div class="row-gap">
              <button type="button" class="btn btn-primary" style="flex:1" id="checkBtn">Проверить</button>
              <button type="button" class="btn btn-secondary" id="revealBtn">Ответ</button>
            </div>
          ` : ''}
        `}

        ${session.checked ? `
          <div class="feedback-box ${session.isRight ? 'ok' : 'no'}">
            <div class="row-between">
              <span class="feedback-title">${session.isRight ? 'Верно!' : 'Ключ из учебника:'}</span>
              <button type="button" class="tts-btn" id="exSpeak">${ICO.vol}</button>
            </div>
            <div class="feedback-ans">${esc(ex.answer)}</div>
            ${ex.ru ? `<div class="small"><b>Перевод:</b> ${esc(ex.ru)}</div>` : ''}
            ${ex.explain ? `<div class="small"><b>Почему:</b> ${esc(ex.explain)}</div>` : ''}
          </div>
          <div class="row-gap">
            ${!session.isRight && !isChoice ? `<button type="button" class="btn btn-secondary" style="flex:1" id="overrideBtn">Засчитать верно</button>` : ''}
            <button type="button" class="btn btn-primary" style="flex:1" id="nextBtn">${session.i + 1 >= session.queue.length ? 'Результат' : 'Дальше'}</button>
          </div>
        ` : ''}
      </div>
    </div>`;

    bindSessionBar(() => {
      const last = session.history.pop();
      if (!last) return;
      if (last.wasRight) session.ok--; else session.miss.pop();
      session.i = last.idx;
      session.checked = false;
      session.userVal = '';
      renderSession();
      showToast('Шаг отменён');
    });

    const recordResult = (right) => {
      session.isRight = right;
      session.checked = true;
      markActiveToday();
      if (right) {
        session.ok++;
        removeMistake(state.subject, 'ex:' + ex.id);
      } else {
        session.miss.push({ prompt: ex.prompt, answer: ex.answer });
        addMistake(state.subject, { key: 'ex:' + ex.id, kind: 'ex', prompt: ex.prompt, answer: ex.answer, ru: ex.ru || '', explain: ex.explain || '' });
      }
      renderSession();
    };

    if (!session.checked) {
      if (isChoice) {
        ov.querySelectorAll('[data-opt]').forEach((b) => {
          b.onclick = () => {
            session.userVal = ex.options[Number(b.dataset.opt)];
            recordResult(session.userVal === ex.answer);
          };
        });
      } else {
        const inp = $('#exInput');
        inp.focus();
        inp.onkeydown = (e) => { if (e.key === 'Enter') $('#checkBtn').click(); };
        const ab = $('#accentBar');
        if (ab) ab.querySelectorAll('.accent-key').forEach((k) => {
          k.onclick = () => insertAtCursor(inp, k.dataset.ch);
        });
        $('#checkBtn').onclick = () => {
          session.userVal = inp.value.trim();
          recordResult(checkTypedAnswer(session.userVal, ex.answer, ex.altAnswers));
        };
        $('#revealBtn').onclick = () => {
          session.userVal = inp.value.trim();
          recordResult(false);
        };
      }
    } else {
      $('#exSpeak').onclick = () => speak(ex.answer, d.lang);
      const ovb = $('#overrideBtn');
      if (ovb) ovb.onclick = () => {
        session.isRight = true;
        session.ok++;
        session.miss.pop();
        removeMistake(state.subject, 'ex:' + ex.id);
        renderSession();
        showToast('Засчитано!');
      };
      $('#nextBtn').onclick = () => {
        session.history.push({ idx: session.i, wasRight: session.isRight });
        session.i++;
        session.checked = false;
        session.userVal = '';
        renderSession();
      };
    }
  }

  // ============================================================================
  // MODE 6: QUIZ / EXAM SIMULATOR & QUICK 5-MIN MIX
  // ============================================================================
  function buildMixedQuestions(count) {
    const d = curData();
    const cards = filteredCards();
    const allCards = d.cards;
    const qs = [];

    // 1) Vocab choice questions (RU -> Foreign)
    const vCount = Math.max(4, Math.round(count * 0.45));
    pickCardQueue(vCount).forEach((c) => {
      const distractors = shuffle(allCards.filter((x) => x.id !== c.id && x.term !== c.term)).slice(0, 3).map((x) => x.term);
      qs.push({
        key: 'card:' + c.id,
        tag: `Лексика · ${c.tag || c.unit}`,
        prompt: `Как перевести: «${c.ru}»?`,
        options: shuffle([c.term, ...distractors]),
        answer: c.term,
        speakText: c.term,
        ru: c.ru,
        explain: c.coll || c.def || 'Из словаря курса',
      });
    });

    // 2) Collocations
    shuffle(filteredItems('collocations')).slice(0, Math.max(2, Math.round(count * 0.2))).forEach((x) => {
      qs.push({
        key: 'coll:' + x.id,
        tag: 'Коллокация / предлог',
        prompt: x.prompt,
        options: shuffle(x.options),
        answer: x.answer,
        speakText: x.full,
        ru: x.ru,
        explain: x.rule,
      });
    });

    // 3) Tricky pairs
    shuffle(filteredItems('tricky')).slice(0, Math.max(2, Math.round(count * 0.2))).forEach((x) => {
      qs.push({
        key: 'tricky:' + x.id,
        tag: `Ловушка · ${x.pair}`,
        prompt: x.prompt,
        options: shuffle(x.options),
        answer: x.answer,
        speakText: x.answer,
        ru: '',
        explain: x.explain,
      });
    });

    // 4) Choice exercises
    shuffle(filteredItems('exercises').filter((e) => e.type === 'choice' && e.options)).slice(0, 4).forEach((e) => {
      qs.push({
        key: 'ex:' + e.id,
        tag: e.source,
        prompt: e.prompt,
        options: shuffle(e.options),
        answer: e.answer,
        speakText: e.answer,
        ru: e.ru,
        explain: e.explain,
      });
    });

    // 5) French conjugations if subject is fr
    if (state.subject === 'fr') {
      buildConjQuestions(Math.max(2, Math.round(count * 0.2))).forEach((cq) => {
        qs.push({
          key: 'conj:' + cq.inf + ':' + cq.tense,
          tag: `Спряжение · ${cq.tense}`,
          prompt: `${cq.inf} (${cq.ru}) → ${cq.pronoun}`,
          options: cq.options,
          answer: cq.answer,
          speakText: cq.answer,
          ru: '',
          explain: cq.explain,
        });
      });
    }

    return shuffle(qs).slice(0, count);
  }

  function startQuick5() {
    const qs = buildMixedQuestions(12);
    if (!qs.length) { showToast('Выбери хотя бы один урок'); return; }
    openChoiceSession('5 минут до пары', qs);
  }

  function openQuizSetup() {
    let qCount = 20;
    let mins = 12;
    function draw() {
      openModal(`
        <div class="modal-head">
          <h3 class="modal-title">Симулятор среза · ${esc(curData().shortName)}</h3>
          <button type="button" class="btn btn-secondary btn-sm" id="closeMod">Отмена</button>
        </div>
        <div class="small muted">Микс из выбранных тем: лексика, предлоги, коварные пары, упражнения${state.subject === 'fr' ? ' и спряжения' : ''}.</div>
        <div>
          <div class="section-label" style="margin-bottom:6px">Количество заданий</div>
          <div class="seg" id="qCntSeg">
            ${[10, 20, 30].map((n) => `<button type="button" class="${qCount === n ? 'active' : ''}" data-n="${n}">${n}</button>`).join('')}
          </div>
        </div>
        <div>
          <div class="section-label" style="margin-bottom:6px">Таймер</div>
          <div class="seg" id="qTimeSeg">
            ${[[10, '10 мин'], [15, '15 мин'], [0, 'Без таймера']].map(([m, l]) => `<button type="button" class="${mins === m ? 'active' : ''}" data-m="${m}">${l}</button>`).join('')}
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-block" id="goQuizBtn">${ICO.play} Начать срез</button>
      `);
      $('#closeMod').onclick = closeModal;
      $('#qCntSeg').querySelectorAll('button').forEach((b) => { b.onclick = () => { qCount = Number(b.dataset.n); draw(); }; });
      $('#qTimeSeg').querySelectorAll('button').forEach((b) => { b.onclick = () => { mins = Number(b.dataset.m); draw(); }; });
      $('#goQuizBtn').onclick = () => {
        closeModal(true);
        const qs = buildMixedQuestions(qCount);
        openSession({
          type: 'quiz',
          title: 'Симулятор среза',
          queue: qs,
          i: 0,
          ok: 0,
          picked: null,
          miss: [],
          history: [],
          secsLeft: mins ? mins * 60 : null,
          savedResult: false,
        }, true);
        if (mins) {
          timerId = setInterval(() => {
            if (!session || session.type !== 'quiz') { clearInterval(timerId); return; }
            session.secsLeft--;
            const tv = $('#timerVal');
            if (tv) tv.textContent = fmtTime(Math.max(0, session.secsLeft));
            if (session.secsLeft <= 0) {
              clearInterval(timerId);
              session.i = session.queue.length;
              renderSession();
              showToast('Время вышло!');
            }
          }, 1000);
        }
      };
    }
    draw();
  }

  function fmtTime(s) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }

  function renderQuizSession(ov) {
    if (session.i >= session.queue.length) {
      clearInterval(timerId);
      const pct = session.queue.length ? Math.round((session.ok / session.queue.length) * 100) : 0;
      if (!session.savedResult) {
        session.savedResult = true;
        state.quizHistory.unshift({ date: todayStr(), subject: state.subject, score: session.ok, total: session.queue.length, pct });
        state.quizHistory = state.quizHistory.slice(0, 20);
        saveState();
      }
      const grade = pct >= 90 ? 'Отлично (A)' : pct >= 75 ? 'Хорошо (B)' : pct >= 60 ? 'Удовл. (C)' : 'Нужно дотянуть';
      return renderSessionSummary(ov, {
        title: `Срез завершён · ${grade}`,
        good: session.ok,
        total: session.queue.length,
        sub: `Результат: ${pct}% · сохранено в Прогрессе`,
        miss: session.miss,
        onAgain: openQuizSetup,
      });
    }
    // Reuse clean choice rendering with live timer
    const d = curData();
    const q = session.queue[session.i];
    const pct = Math.round((session.i / session.queue.length) * 100);
    const fmtPrompt = esc(q.prompt).replace(/___/g, '<span class="blank-hi">___</span>');
    const tStr = session.secsLeft !== null ? fmtTime(Math.max(0, session.secsLeft)) : '';

    ov.innerHTML = `<div class="session-inner">
      ${sessionHeaderHtml(session.title, `${session.i + 1}/${session.queue.length}`, false, tStr)}
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>

      <div class="prompt-box">
        <span class="fc-tag">${esc(q.tag)}</span>
        <p class="prompt-text">${fmtPrompt}</p>
        <div class="choices">
          ${q.options.map((opt, idx) => {
            let cls = '';
            if (session.picked !== null) {
              if (opt === q.answer) cls = ' ok';
              else if (opt === session.picked) cls = ' no';
            }
            return `<button type="button" class="choice-btn${cls}" data-opt="${idx}"${session.picked !== null ? ' disabled' : ''}>${esc(opt)}</button>`;
          }).join('')}
        </div>
        ${session.picked !== null ? `
          <div class="feedback-box ${session.picked === q.answer ? 'ok' : 'no'}">
            <div class="feedback-title">${session.picked === q.answer ? 'Верно' : 'Ответ: ' + esc(q.answer)}</div>
            <div class="small">${esc(q.explain)}</div>
          </div>
          <button type="button" class="btn btn-primary btn-block" id="nextBtn">${session.i + 1 >= session.queue.length ? 'Итоги среза' : 'Дальше'}</button>
        ` : ''}
      </div>
    </div>`;

    bindSessionBar();
    if (session.picked === null) {
      ov.querySelectorAll('[data-opt]').forEach((b) => {
        b.onclick = () => {
          const val = q.options[Number(b.dataset.opt)];
          session.picked = val;
          markActiveToday();
          if (val === q.answer) {
            session.ok++;
            removeMistake(state.subject, q.key);
          } else {
            session.miss.push({ prompt: q.prompt, answer: q.answer });
            addMistake(state.subject, { key: q.key, kind: 'quiz', prompt: q.prompt, answer: q.answer, ru: q.ru || '', explain: q.explain });
          }
          renderSession();
        };
      });
    } else {
      $('#nextBtn').onclick = () => { session.i++; session.picked = null; renderSession(); };
    }
  }

  // ============================================================================
  // MISTAKES DRILL SESSION
  // ============================================================================
  function startMistakesSession() {
    const list = state.mistakes[state.subject] || [];
    if (!list.length) { showToast('Ошибок нет!'); return; }
    const d = curData();
    const qs = shuffle(list).map((m) => {
      const others = shuffle(d.cards.filter((c) => c.term !== m.answer)).slice(0, 3).map((c) => c.term);
      return {
        key: m.key,
        tag: 'Работа над ошибками',
        prompt: m.prompt,
        options: shuffle([m.answer, ...others]),
        answer: m.answer,
        speakText: m.answer,
        ru: m.ru,
        explain: m.explain || 'Верный ответ снимет ошибку из списка.',
      };
    });
    openChoiceSession('Ошибки', qs);
  }

  // ============================================================================
  // SPECIAL MODULE (FR): CONJUGATION TRAINER (LESSON-GATED!)
  // ============================================================================
  function buildConjQuestions(count = 15, chosenTenses = null) {
    const fr = window.STUDY_DATA.fr;
    const avail = fr.conjugations.filter((v) => v.minLesson <= state.frPassedLesson);
    const allowedTenses = chosenTenses || [
      'Présent',
      'Passé composé',
      'Imparfait',
      'Impératif',
      ...(state.frPassedLesson >= 6 ? ['Futur simple'] : []),
      ...(state.frPassedLesson >= 10 ? ['Subjonctif'] : []),
    ];
    const items = [];
    const pronouns = ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];
    const allForms = avail.flatMap((v) => [...v.present, ...v.pc, ...v.imparfait, v.futur]);

    for (let k = 0; k < count * 2 && items.length < count; k++) {
      const v = avail[Math.floor(Math.random() * avail.length)];
      const tense = allowedTenses[Math.floor(Math.random() * allowedTenses.length)];
      let pronoun = '', answer = '', explain = '';
      if (tense === 'Présent') {
        const pi = Math.floor(Math.random() * 6);
        pronoun = pronouns[pi];
        answer = v.present[pi];
        explain = `Présent (${v.inf}): ${v.present.join(' · ')}`;
      } else if (tense === 'Passé composé') {
        const pi = Math.floor(Math.random() * 3);
        pronoun = ['je', 'il', 'nous'][pi];
        answer = v.pc[pi];
        explain = `Вспомогательный глагол: ${v.aux} · participe passé: ${v.pp}`;
      } else if (tense === 'Imparfait') {
        const pi = Math.floor(Math.random() * 3);
        pronoun = ['je', 'nous', 'ils'][pi];
        answer = v.imparfait[pi];
        explain = `Основа от nous в présent (${v.present[3]}) + -ais/-ions/-aient`;
      } else if (tense === 'Impératif') {
        const pi = Math.floor(Math.random() * 3);
        if (v.imperatif[pi] === '—') continue;
        pronoun = ['tu', 'nous', 'vous'][pi];
        answer = v.imperatif[pi];
        explain = `Impératif (${v.inf}): ${v.imperatif.join(' / ')}`;
      } else if (tense === 'Futur simple') {
        pronoun = 'je';
        answer = v.futur;
        explain = `Futur simple (с урока 6): ${v.futur}`;
      } else if (tense === 'Subjonctif') {
        pronoun = 'que je';
        answer = v.subjonctif;
        explain = `Subjonctif (урок 10): ${v.subjonctif}`;
      }
      const dist = shuffle(allForms.filter((f) => f && f !== answer)).slice(0, 3);
      items.push({ inf: v.inf, ru: v.ru, tense, pronoun, answer, options: shuffle([answer, ...dist]), explain });
    }
    return items;
  }

  function startConjugationSession() {
    openSession({
      type: 'conjugation',
      title: 'Спряжения FR',
      mode: 'choice', // 'choice' | 'input'
      queue: buildConjQuestions(15),
      i: 0,
      ok: 0,
      checked: false,
      isRight: false,
      userVal: '',
      miss: [],
      history: [],
    });
  }

  function renderConjugationSession(ov) {
    if (session.i >= session.queue.length) {
      return renderSessionSummary(ov, {
        title: 'Спряжения пройдены',
        good: session.ok,
        total: session.queue.length,
        miss: session.miss,
        onAgain: startConjugationSession,
      });
    }
    const q = session.queue[session.i];
    const pct = Math.round((session.i / session.queue.length) * 100);

    ov.innerHTML = `<div class="session-inner">
      ${sessionHeaderHtml(session.title, `${session.i + 1} / ${session.queue.length}`, session.history.length > 0)}
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>

      <div class="seg" id="conjModeSeg">
        <button type="button" class="${session.mode === 'choice' ? 'active' : ''}" data-cm="choice">Выбор</button>
        <button type="button" class="${session.mode === 'input' ? 'active' : ''}" data-cm="input">Ввод с акцентами</button>
      </div>

      <div class="prompt-box">
        <div class="row-between">
          <span class="pill soft-accent" style="min-height:24px;padding:2px 9px;font-size:12px">${esc(q.tense)}</span>
          <span class="small muted">до A2 L${state.frPassedLesson}</span>
        </div>
        <p class="prompt-text">${esc(q.inf)} <span class="muted">(${esc(q.ru)})</span> → <span class="blank-hi">${esc(q.pronoun)}</span></p>

        ${session.mode === 'choice' ? `
          <div class="choices">
            ${q.options.map((opt, idx) => {
              let cls = '';
              if (session.checked) {
                if (opt === q.answer) cls = ' ok';
                else if (opt === session.userVal) cls = ' no';
              }
              return `<button type="button" class="choice-btn${cls}" data-opt="${idx}"${session.checked ? ' disabled' : ''}>${esc(opt)}</button>`;
            }).join('')}
          </div>
        ` : `
          <input type="text" class="input-field" id="conjInput" autocomplete="off" autocorrect="off" spellcheck="false"
            placeholder="Например: ${esc(q.pronoun)} ..." value="${esc(session.userVal)}"${session.checked ? ' disabled' : ''}>
          ${!session.checked ? `
            <div class="accent-bar" id="accentBar">
              ${FR_ACCENTS.map((ch) => `<button type="button" class="accent-key" data-ch="${esc(ch)}">${esc(ch)}</button>`).join('')}
            </div>
            <button type="button" class="btn btn-primary btn-block" id="checkBtn">Проверить</button>
          ` : ''}
        `}

        ${session.checked ? `
          <div class="feedback-box ${session.isRight ? 'ok' : 'no'}">
            <div class="row-between">
              <span class="feedback-title">${session.isRight ? 'Верно!' : 'Правильно:'}</span>
              <button type="button" class="tts-btn" id="cjSpeak">${ICO.vol}</button>
            </div>
            <div class="feedback-ans">${esc(q.answer)}</div>
            <div class="small">${esc(q.explain)}</div>
          </div>
          <button type="button" class="btn btn-primary btn-block" id="nextBtn">${session.i + 1 >= session.queue.length ? 'Результат' : 'Дальше'}</button>
        ` : ''}
      </div>
    </div>`;

    bindSessionBar(() => {
      const last = session.history.pop();
      if (!last) return;
      if (last.wasRight) session.ok--; else session.miss.pop();
      session.i = last.idx;
      session.checked = false;
      session.userVal = '';
      renderSession();
    });

    $('#conjModeSeg').querySelectorAll('button').forEach((b) => {
      b.onclick = () => { session.mode = b.dataset.cm; session.checked = false; session.userVal = ''; renderSession(); };
    });

    const checkRes = (right) => {
      session.isRight = right;
      session.checked = true;
      markActiveToday();
      if (right) session.ok++;
      else session.miss.push({ prompt: `${q.inf} (${q.tense}, ${q.pronoun})`, answer: q.answer });
      renderSession();
    };

    if (!session.checked) {
      if (session.mode === 'choice') {
        ov.querySelectorAll('[data-opt]').forEach((b) => {
          b.onclick = () => {
            session.userVal = q.options[Number(b.dataset.opt)];
            checkRes(session.userVal === q.answer);
          };
        });
      } else {
        const inp = $('#conjInput');
        inp.focus();
        inp.onkeydown = (e) => { if (e.key === 'Enter') $('#checkBtn').click(); };
        $('#accentBar').querySelectorAll('.accent-key').forEach((k) => {
          k.onclick = () => insertAtCursor(inp, k.dataset.ch);
        });
        $('#checkBtn').onclick = () => {
          session.userVal = inp.value.trim();
          checkRes(checkTypedAnswer(session.userVal, q.answer));
        };
      }
    } else {
      $('#cjSpeak').onclick = () => speak(q.answer, 'fr-FR');
      $('#nextBtn').onclick = () => {
        session.history.push({ idx: session.i, wasRight: session.isRight });
        session.i++;
        session.checked = false;
        session.userVal = '';
        renderSession();
      };
    }
  }

  // ============================================================================
  // SPECIAL MODULE (FR ONLY — NOT HR!): FRENCH TEXTS & GREEN WORDS CHECKLIST
  // ============================================================================
  function startFrTextsSession() {
    const texts = (window.STUDY_DATA.fr.texts || []).filter((t) => (t.minLesson || 1) <= state.frPassedLesson);
    if (!texts.length) {
      showToast('Тексты A2 откроются с границы A2 L1');
      return;
    }
    const curU = `a2-${state.frPassedLesson}`;
    const defaultIdx = Math.max(0, texts.findIndex((t) => t.unit === curU));
    openSession({
      type: 'fr_texts',
      title: 'Тексты FR',
      idx: defaultIdx,
      checkedWords: {},
    });
  }

  function renderFrTextsSession(ov) {
    const texts = (window.STUDY_DATA.fr.texts || []).filter((t) => (t.minLesson || 1) <= state.frPassedLesson);
    const t = texts[session.idx] || texts[0];
    const checked = session.checkedWords[t.id] || {};
    const usedCnt = Object.values(checked).filter(Boolean).length;

    ov.innerHTML = `<div class="session-inner">
      ${sessionHeaderHtml('Тексты FR · Активные слова', '')}
      <div class="subject-rail" style="padding:0 0 4px">
        ${texts.map((x, k) => `<button type="button" class="subj-pill${k === session.idx ? ' active' : ''}" data-ti="${k}">${esc(x.unit.toUpperCase())}</button>`).join('')}
      </div>

      <div class="card">
        <h3 style="margin:0 0 6px;font-size:17px">${esc(t.title)}</h3>
        ${t.characters ? `<div class="small muted" style="margin-bottom:8px"><b>Персонажи:</b> ${esc(t.characters)}</div>` : ''}
        <div style="font-size:14px;line-height:1.5">${esc(t.summary)}</div>
      </div>

      <div class="card">
        <div class="row-between" style="margin-bottom:10px">
          <div>
            <b>Обязательные зелёные слова</b>
            <div class="small muted">Отмечай тапом по ходу устного ответа</div>
          </div>
          <span class="counter-badge">${usedCnt}/${t.activeWords.length}</span>
        </div>
        <div class="chip-row" style="margin-top:0">
          ${t.activeWords.map((w, wi) => `
            <button type="button" class="check-chip${checked[wi] ? ' checked' : ''}" data-wi="${wi}">
              <span><b>${esc(w.fr)}</b> — ${esc(w.ru)}</span>
            </button>
          `).join('')}
        </div>
        ${usedCnt > 0 ? `<button type="button" class="btn btn-secondary btn-sm" style="margin-top:12px" id="resetChecks">Сбросить отметки</button>` : ''}
      </div>
    </div>`;

    bindSessionBar();
    ov.querySelectorAll('[data-ti]').forEach((b) => {
      b.onclick = () => { session.idx = Number(b.dataset.ti); renderSession(); };
    });
    ov.querySelectorAll('[data-wi]').forEach((b) => {
      b.onclick = () => {
        const wi = Number(b.dataset.wi);
        if (!session.checkedWords[t.id]) session.checkedWords[t.id] = {};
        session.checkedWords[t.id][wi] = !session.checkedWords[t.id][wi];
        renderSession();
      };
    });
    const rc = $('#resetChecks');
    if (rc) rc.onclick = () => { session.checkedWords[t.id] = {}; renderSession(); };
  }

  // ============================================================================
  // SPECIAL MODULE (ECON): INTERACTIVE CONCEPT MAPS & TRANSLATION TRAINER
  // ============================================================================
  function startEconMapsSession() {
    openSession({
      type: 'econ_maps',
      title: 'Эконом. перевод',
      sub: 'maps', // 'maps' | 'translate'
      mapIdx: 1,   // default Text II (L7)
      hiddenBranches: {},
      trIdx: 0,
      trRevealed: false,
      trInput: '',
    });
  }

  function renderEconMapsSession(ov) {
    const econ = window.STUDY_DATA.econ;
    const maps = econ.conceptMaps;
    const trs = econ.translations;

    let body = '';
    if (session.sub === 'maps') {
      const m = maps[session.mapIdx] || maps[0];
      const hid = session.hiddenBranches[m.id] || {};
      const allHidden = m.branches.every((_, bi) => hid[bi]);
      body = `
        <div class="subject-rail" style="padding:0 0 4px">
          ${maps.map((x, k) => `<button type="button" class="subj-pill${k === session.mapIdx ? ' active' : ''}" data-mi="${k}">${esc(x.unit.toUpperCase())}</button>`).join('')}
        </div>

        <div class="card">
          <div class="row-between" style="margin-bottom:6px">
            <span class="pill soft-accent" style="min-height:24px;padding:2px 9px;font-size:11.5px">${esc(m.structure)}</span>
            <button type="button" class="btn btn-secondary btn-sm" id="toggleAllBr">${allHidden ? 'Показать все' : 'Скрыть ветки (тест)'}</button>
          </div>
          <h3 style="margin:6px 0;font-size:16.5px">${esc(m.title)}</h3>
          <div class="small" style="margin-bottom:6px"><b>Topic:</b> ${esc(m.topic)}</div>
          <div class="small muted"><b>Main idea:</b> ${esc(m.mainIdea)}</div>
          <div class="chip-row">
            ${m.signalWords.map((w) => `<span class="pill" style="min-height:24px;padding:2px 8px;font-size:11.5px">${esc(w)}</span>`).join('')}
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:9px">
          ${m.branches.map((br, bi) => `
            <div class="cm-branch">
              <button type="button" class="cm-branch-head" data-br="${bi}">
                <span>${esc(br.title)}</span>
                <span class="small muted">${hid[bi] ? 'Нажми, чтобы открыть' : 'Скрыть'}</span>
              </button>
              ${!hid[bi] ? `
                <div class="cm-branch-body">
                  ${br.items.map((it) => `<div class="cm-item">${esc(it)}</div>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else {
      const tr = trs[session.trIdx % trs.length];
      body = `
        <div class="prompt-box">
          <div class="row-between">
            <span class="pill soft-accent" style="min-height:24px;padding:2px 9px;font-size:11.5px">${tr.dir === 'en-ru' ? 'EN → RU' : 'RU → EN'} · ${esc(tr.unit.toUpperCase())}</span>
            <span class="small muted">${(session.trIdx % trs.length) + 1} / ${trs.length}</span>
          </div>
          <p class="prompt-text" style="font-size:16.5px">${esc(tr.source)}</p>
          <textarea class="input-field" id="trBox" rows="3" placeholder="Напиши свой вариант перевода (или переведи устно)...">${esc(session.trInput)}</textarea>
          ${!session.trRevealed ? `
            <button type="button" class="btn btn-primary btn-block" id="trReveal">Показать эталон и правило</button>
          ` : `
            <div class="feedback-box info">
              <div class="row-between">
                <span class="feedback-title">Эталонный перевод</span>
                <button type="button" class="tts-btn" id="trSpeak">${ICO.vol}</button>
              </div>
              <div class="feedback-ans" style="font-size:14.5px">${esc(tr.answer)}</div>
              <div class="small muted"><b>Приём:</b> ${esc(tr.rule)}</div>
            </div>
            <div class="row-gap">
              <button type="button" class="btn btn-secondary" style="flex:1" id="trPrev">Назад</button>
              <button type="button" class="btn btn-primary" style="flex:1" id="trNext">Следующее</button>
            </div>
          `}
        </div>
      `;
    }

    ov.innerHTML = `<div class="session-inner">
      ${sessionHeaderHtml('Перевод и Concept Maps', '')}
      <div class="seg" id="econSeg">
        <button type="button" class="${session.sub === 'maps' ? 'active' : ''}" data-es="maps">Concept Maps (Text I–V)</button>
        <button type="button" class="${session.sub === 'translate' ? 'active' : ''}" data-es="translate">Тренажёр перевода</button>
      </div>
      ${body}
    </div>`;

    bindSessionBar();
    $('#econSeg').querySelectorAll('button').forEach((b) => {
      b.onclick = () => { session.sub = b.dataset.es; renderSession(); };
    });

    if (session.sub === 'maps') {
      const m = maps[session.mapIdx] || maps[0];
      ov.querySelectorAll('[data-mi]').forEach((b) => {
        b.onclick = () => { session.mapIdx = Number(b.dataset.mi); renderSession(); };
      });
      $('#toggleAllBr').onclick = () => {
        const hid = session.hiddenBranches[m.id] || {};
        const allH = m.branches.every((_, bi) => hid[bi]);
        const next = {};
        m.branches.forEach((_, bi) => { next[bi] = !allH; });
        session.hiddenBranches[m.id] = next;
        renderSession();
      };
      ov.querySelectorAll('[data-br]').forEach((b) => {
        b.onclick = () => {
          const bi = Number(b.dataset.br);
          if (!session.hiddenBranches[m.id]) session.hiddenBranches[m.id] = {};
          session.hiddenBranches[m.id][bi] = !session.hiddenBranches[m.id][bi];
          renderSession();
        };
      });
    } else {
      const tr = trs[session.trIdx % trs.length];
      const tb = $('#trBox');
      if (tb) tb.oninput = () => { session.trInput = tb.value; };
      const rev = $('#trReveal');
      if (rev) rev.onclick = () => { session.trRevealed = true; markActiveToday(); renderSession(); };
      const sp = $('#trSpeak');
      if (sp) sp.onclick = () => speak(tr.dir === 'en-ru' ? tr.source : tr.answer, 'en-GB');
      const prev = $('#trPrev');
      if (prev) prev.onclick = () => { session.trIdx = (session.trIdx - 1 + trs.length) % trs.length; session.trRevealed = false; session.trInput = ''; renderSession(); };
      const next = $('#trNext');
      if (next) next.onclick = () => { session.trIdx = (session.trIdx + 1) % trs.length; session.trRevealed = false; session.trInput = ''; renderSession(); };
    }
  }

  // ============================================================================
  // SPECIAL MODULE (KOMKOR): BUSINESS LETTER CLICHÉ BUILDER & QUIZ
  // ============================================================================
  function startKomkorClichesSession() {
    const cliches = window.STUDY_DATA.komkor.cliches || [];
    const allItems = cliches.flatMap((st) => st.items.map((it) => ({ ...it, stage: st.stage })));
    const quizQs = shuffle(allItems).slice(0, 12).map((it) => {
      const dist = shuffle(allItems.filter((x) => x.en !== it.en)).slice(0, 3).map((x) => x.en);
      return {
        prompt: `Ситуация: ${it.situation}`,
        ru: it.ru,
        stage: it.stage,
        answer: it.en,
        options: shuffle([it.en, ...dist]),
      };
    });
    openSession({
      type: 'komkor_cliches',
      title: 'Конструктор клише',
      sub: 'builder', // 'builder' | 'quiz'
      quizQs,
      qi: 0,
      ok: 0,
      picked: null,
    });
  }

  function renderKomkorClichesSession(ov) {
    const cliches = window.STUDY_DATA.komkor.cliches || [];
    let body = '';
    if (session.sub === 'builder') {
      body = cliches.map((st, idx) => `
        <details class="accordion"${idx < 2 ? ' open' : ''}>
          <summary><span>${esc(st.stage)}</span>${ICO.chev}</summary>
          <div class="accordion-body">
            ${st.items.map((it) => `
              <div style="padding-top:9px;border-top:1px solid var(--border)">
                <div class="row-between">
                  <b style="font-size:14px">${esc(it.en)}</b>
                  <button type="button" class="tts-btn" style="min-height:28px;padding:3px 8px" data-say="${esc(it.en)}">${ICO.vol}</button>
                </div>
                <div class="small muted">${esc(it.ru)}</div>
                <div class="small" style="color:var(--accent);margin-top:2px">${esc(it.situation)}</div>
              </div>
            `).join('')}
          </div>
        </details>
      `).join('');
    } else if (session.qi >= session.quizQs.length) {
      body = `
        <div class="card" style="text-align:center">
          <div class="score-big">${session.ok} / ${session.quizQs.length}</div>
          <p class="muted">Квиз по деловым клише завершён</p>
          <button type="button" class="btn btn-primary btn-block" id="restartCk">Пройти ещё раз</button>
        </div>
      `;
    } else {
      const q = session.quizQs[session.qi];
      body = `
        <div class="prompt-box">
          <div class="row-between">
            <span class="fc-tag">${esc(q.stage)}</span>
            <span class="small muted">${session.qi + 1} / ${session.quizQs.length}</span>
          </div>
          <p class="prompt-text">${esc(q.prompt)}</p>
          <div class="choices">
            ${q.options.map((opt, idx) => {
              let cls = '';
              if (session.picked !== null) {
                if (opt === q.answer) cls = ' ok';
                else if (opt === session.picked) cls = ' no';
              }
              return `<button type="button" class="choice-btn${cls}" data-opt="${idx}"${session.picked !== null ? ' disabled' : ''}>${esc(opt)}</button>`;
            }).join('')}
          </div>
          ${session.picked !== null ? `
            <div class="feedback-box ${session.picked === q.answer ? 'ok' : 'no'}">
              <div class="feedback-title">${session.picked === q.answer ? 'Точно!' : 'Правильная формула:'}</div>
              <div class="feedback-ans">${esc(q.answer)}</div>
              <div class="small">${esc(q.ru)}</div>
            </div>
            <button type="button" class="btn btn-primary btn-block" id="ckNext">Дальше</button>
          ` : ''}
        </div>
      `;
    }

    ov.innerHTML = `<div class="session-inner">
      ${sessionHeaderHtml('Конструктор клише', '')}
      <div class="seg" id="kkSeg">
        <button type="button" class="${session.sub === 'builder' ? 'active' : ''}" data-ks="builder">Блоки письма (6)</button>
        <button type="button" class="${session.sub === 'quiz' ? 'active' : ''}" data-ks="quiz">Квиз ситуаций</button>
      </div>
      ${body}
    </div>`;

    bindSessionBar();
    $('#kkSeg').querySelectorAll('button').forEach((b) => {
      b.onclick = () => { session.sub = b.dataset.ks; renderSession(); };
    });
    ov.querySelectorAll('[data-say]').forEach((b) => {
      b.onclick = () => speak(b.dataset.say, 'en-GB');
    });
    if (session.sub === 'quiz') {
      const rck = $('#restartCk');
      if (rck) rck.onclick = startKomkorClichesSession;
      else if (session.picked === null) {
        const q = session.quizQs[session.qi];
        ov.querySelectorAll('[data-opt]').forEach((b) => {
          b.onclick = () => {
            session.picked = q.options[Number(b.dataset.opt)];
            if (session.picked === q.answer) session.ok++;
            markActiveToday();
            renderSession();
          };
        });
      } else {
        $('#ckNext').onclick = () => { session.qi++; session.picked = null; renderSession(); };
      }
    }
  }

  // ============================================================================
  // SHARED SESSION SUMMARY SCREEN
  // ============================================================================
  function renderSessionSummary(ov, { title, good, total, sub = '', miss = [], onAgain }) {
    const pct = total ? Math.round((good / total) * 100) : 100;
    ov.innerHTML = `<div class="session-inner">
      ${sessionHeaderHtml(title, 'Итог')}
      <div class="card" style="text-align:center;padding:24px 18px">
        <div class="score-big">${good} из ${total}</div>
        <div style="font-size:15px;font-weight:600;color:var(--accent);margin-top:4px">${pct}%</div>
        ${sub ? `<p class="muted small" style="margin:8px 0 0">${esc(sub)}</p>` : ''}
      </div>

      ${miss.length ? `
        <div class="card">
          <div style="font-weight:700;margin-bottom:8px">Повторить (${miss.length})</div>
          ${miss.map((m) => `
            <div style="padding:8px 0;border-top:1px solid var(--border)">
              <div class="small muted">${esc(m.prompt)}</div>
              <div style="font-weight:650;margin-top:2px">${esc(m.answer)}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div style="display:flex;flex-direction:column;gap:8px">
        ${miss.length && (state.mistakes[state.subject] || []).length ? `<button type="button" class="btn btn-primary btn-block" id="sumFixBtn">Отработать ошибки</button>` : ''}
        <button type="button" class="btn btn-secondary btn-block" id="sumAgainBtn">Ещё раз</button>
        <button type="button" class="btn btn-outline btn-block" id="sumExitBtn">На главную</button>
      </div>
    </div>`;

    bindSessionBar();
    const fb = $('#sumFixBtn');
    if (fb) fb.onclick = () => { closeSession(true); startMistakesSession(); };
    $('#sumAgainBtn').onclick = () => { closeSession(true); if (onAgain) onAgain(); };
    $('#sumExitBtn').onclick = () => closeSession();
  }

  // ============================================================================
  // HYBRID SENTENCE BUILDER (OFFLINE PARAMETRIC + OPTIONAL ONLINE AI)
  // ============================================================================
  function getBuilderTargetWords(focusMode, customWords) {
    if (focusMode === 'custom') return customWords || [];
    if (focusMode === 'green') {
      const cards = filteredCards();
      const filtered = state.subject === 'fr' ? cards.filter((c) => c.green) : cards.filter((c) => c.av);
      return shuffle(filtered).slice(0, 12).map((c) => c.term.replace(/\([^)]*\)/g, '').trim());
    }
    if (focusMode === 'mistakes') {
      const ms = state.mistakes[state.subject] || [];
      return ms.slice(0, 12).map((m) => String(m.answer || '').replace(/\([^)]*\)/g, '').trim()).filter(Boolean);
    }
    return [];
  }

  function prepareTileBank(item) {
    const all = [...(item.tokens || []), ...(item.distractors || [])];
    return shuffle(all.map((text, idx) => ({ id: idx, text })));
  }

  function startBuilderSession(opts = {}) {
    const subj = state.subject;
    const pl = passedLessonFor(subj);
    const topics = window.BuilderEngine ? window.BuilderEngine.getTopics(subj, pl) : [];
    if (!topics.length) {
      showToast('Конструктор доступен для Французского и General EN');
      return;
    }
    const topicId = opts.topicId || '';
    const focusMode = opts.focusMode || 'all';
    const customWords = opts.customWords || [];
    const targetWords = getBuilderTargetWords(focusMode, customWords);
    const queue = window.BuilderEngine.generateOffline({
      subject: subj,
      passedLesson: pl,
      units: activeUnits(subj),
      topicId,
      focusMode,
      targetWords,
      cardsPool: filteredCards(subj),
      count: 8,
    });
    if (!queue.length) {
      showToast('Нет шаблонов для выбранных параметров');
      return;
    }
    openSession({
      type: 'builder',
      title: 'Конструктор',
      subject: subj,
      mode: state.builderMode || 'tiles', // 'tiles' | 'input'
      topicId,
      focusMode,
      customWords,
      queue,
      i: 0,
      ok: 0,
      miss: [],
      placed: [],
      bank: prepareTileBank(queue[0]),
      checked: false,
      isCorrect: false,
      userText: '',
      aiBusy: false,
      aiFeedback: null,
    });
  }

  function reloadBuilderQueue(customQueue = null) {
    if (!session || session.type !== 'builder') return;
    const pl = passedLessonFor(session.subject);
    const targetWords = getBuilderTargetWords(session.focusMode, session.customWords);
    const q = customQueue || window.BuilderEngine.generateOffline({
      subject: session.subject,
      passedLesson: pl,
      units: activeUnits(session.subject),
      topicId: session.topicId,
      focusMode: session.focusMode,
      targetWords,
      cardsPool: filteredCards(session.subject),
      count: 8,
    });
    if (!q.length) {
      showToast('Не нашлось фраз под фильтр');
      return;
    }
    session.queue = q;
    session.i = 0;
    session.ok = 0;
    session.miss = [];
    session.placed = [];
    session.bank = prepareTileBank(q[0]);
    session.checked = false;
    session.isCorrect = false;
    session.userText = '';
    session.aiFeedback = null;
    renderSession();
  }

  function openBuilderWordsModal() {
    if (!session || session.type !== 'builder') return;
    const d = window.STUDY_DATA[session.subject];
    const cards = filteredCards(session.subject);
    let focus = session.focusMode;
    let picked = new Set(session.customWords || []);
    let qSearch = '';

    function draw() {
      const q = qSearch.toLowerCase().trim();
      const shown = cards.filter((c) => !q || c.term.toLowerCase().includes(q) || c.ru.toLowerCase().includes(q)).slice(0, 60);
      openModal(`
        <div class="modal-head">
          <h3 class="modal-title">Фокус слов · Конструктор</h3>
          <button type="button" class="btn btn-secondary btn-sm" id="closeMod">Готово</button>
        </div>
        <div class="chip-row" style="margin-top:0">
          <button type="button" class="pill${focus === 'all' ? ' active' : ''}" data-fm="all">Все пройденные</button>
          <button type="button" class="pill${focus === 'green' ? ' green-active' : ''}" data-fm="green">${session.subject === 'fr' ? 'Только зелёные' : 'Только AV'}</button>
          <button type="button" class="pill${focus === 'mistakes' ? ' bad' : ''}" data-fm="mistakes">Из ошибок (${(state.mistakes[session.subject] || []).length})</button>
          <button type="button" class="pill${focus === 'custom' ? ' active' : ''}" data-fm="custom">Свои слова (${picked.size})</button>
        </div>
        ${focus === 'custom' ? `
          <input type="search" class="search-input" id="bwSearch" placeholder="Найти слово из пройденных уроков..." value="${esc(qSearch)}">
          <div class="small muted">Выбери до 10 слов (выбрано: ${picked.size}):</div>
          <div class="word-pick-list">
            ${shown.map((c) => {
              const cleanT = c.term.replace(/\([^)]*\)/g, '').trim();
              const on = picked.has(cleanT);
              return `<button type="button" class="pill${on ? ' active' : ''}" data-cw="${esc(cleanT)}" style="font-size:12px;min-height:30px;padding:4px 9px">${esc(cleanT)}</button>`;
            }).join('')}
          </div>
        ` : ''}
        <button type="button" class="btn btn-primary btn-block" id="applyBwBtn">Собрать предложения</button>
      `);

      $('#modalSheet').querySelectorAll('[data-fm]').forEach((b) => {
        b.onclick = () => { focus = b.dataset.fm; draw(); };
      });
      const bs = $('#bwSearch');
      if (bs) {
        bs.oninput = () => {
          qSearch = bs.value;
          draw();
          const ag = $('#bwSearch');
          if (ag) { ag.focus(); ag.setSelectionRange(ag.value.length, ag.value.length); }
        };
      }
      $('#modalSheet').querySelectorAll('[data-cw]').forEach((b) => {
        b.onclick = () => {
          const w = b.dataset.cw;
          if (picked.has(w)) picked.delete(w);
          else if (picked.size < 10) picked.add(w);
          else showToast('Максимум 10 слов за раз');
          draw();
        };
      });
      const apply = () => {
        session.focusMode = focus;
        session.customWords = Array.from(picked);
        closeModal();
        reloadBuilderQueue();
      };
      $('#applyBwBtn').onclick = apply;
      $('#closeMod').onclick = closeModal;
    }
    draw();
  }

  function renderBuilderSession(ov) {
    const s = session;
    const d = window.STUDY_DATA[s.subject];
    const pl = passedLessonFor(s.subject);
    const topics = window.BuilderEngine.getTopics(s.subject, pl);

    if (s.i >= s.queue.length) {
      const pct = s.queue.length ? Math.round((s.ok / s.queue.length) * 100) : 0;
      ov.innerHTML = `<div class="session-inner">
        ${sessionHeaderHtml('Конструктор · Итог', '')}
        <div class="card" style="text-align:center;padding:24px 18px">
          <div class="score-big">${pct}%</div>
          <div class="muted" style="margin-top:4px">${s.ok} из ${s.queue.length} собрано верно</div>
          <div class="small muted" style="margin-top:8px">Граница программы: ${s.subject === 'fr' ? (pl === 0 ? 'A1' : 'A2 L' + pl) : 'Unit ' + pl}</div>
        </div>
        ${s.miss.length ? `
          <div class="card">
            <div style="font-weight:700;margin-bottom:8px">Повторить (${s.miss.length})</div>
            ${s.miss.map((m) => `
              <div style="padding:8px 0;border-top:1px solid var(--border)">
                <div class="small muted">${esc(m.prompt)}</div>
                <div style="font-weight:650;margin-top:2px">${esc(m.answer)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div style="display:flex;flex-direction:column;gap:8px">
          <button type="button" class="btn btn-primary btn-block" id="bldMoreOffline">Ещё 8 новых предложений (офлайн)</button>
          <button type="button" class="btn btn-secondary btn-block" id="bldMoreAi">✨ Сгенерировать 5 живых фраз с ИИ</button>
          <button type="button" class="btn btn-outline btn-block" id="bldExit">На главную</button>
        </div>
      </div>`;
      bindSessionBar();
      $('#bldMoreOffline').onclick = () => reloadBuilderQueue();
      $('#bldMoreAi').onclick = () => triggerBuilderAiGenerate();
      $('#bldExit').onclick = () => closeSession();
      return;
    }

    const item = s.queue[s.i];
    const pct = Math.round((s.i / s.queue.length) * 100);
    const placedIds = new Set(s.placed.map((p) => p.id));
    const focusLabel = s.focusMode === 'custom'
      ? `Свои (${s.customWords.length})`
      : s.focusMode === 'green'
        ? (s.subject === 'fr' ? 'Зелёные' : 'AV')
        : s.focusMode === 'mistakes'
          ? 'Ошибки'
          : 'Все слова';

    ov.innerHTML = `<div class="session-inner">
      ${sessionHeaderHtml('Конструктор', `${s.i + 1}/${s.queue.length}`)}
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>

      <!-- Compact Controls Bar -->
      <div class="card card-compact" style="gap:8px;display:flex;flex-direction:column">
        <div class="seg" id="bldModeSeg">
          <button type="button" class="${s.mode === 'tiles' ? 'active' : ''}" data-bm="tiles">🧩 Плитки</button>
          <button type="button" class="${s.mode === 'input' ? 'active' : ''}" data-bm="input">⌨️ Ввод</button>
        </div>
        <div class="row-gap" style="justify-content:space-between">
          <select class="input-field" id="bldTopicSel" style="flex:1;min-width:160px;padding:7px 9px;font-size:13px">
            <option value="">Микс пройденных правил (${topics.length})</option>
            ${topics.map((t) => `<option value="${t.id}"${s.topicId === t.id ? ' selected' : ''}>${esc(t.label)}</option>`).join('')}
          </select>
          <button type="button" class="pill${s.focusMode !== 'all' ? ' active' : ''}" id="bldWordsBtn">🎯 ${esc(focusLabel)}</button>
          <button type="button" class="ai-pill" id="bldAiGenBtn" ${s.aiBusy ? 'disabled' : ''}>${s.aiBusy ? '⏳ ИИ…' : '✨ ИИ'}</button>
        </div>
      </div>

      <!-- Task Card -->
      <div class="prompt-box">
        <div class="row-between">
          <span class="pill ${item.isAi ? 'soft-accent' : ''}" style="min-height:24px;padding:2px 9px;font-size:11.5px">${esc(item.ruleTitle)}</span>
          ${s.checked ? `<button type="button" class="tts-btn" id="bldSpeak">${ICO.vol}</button>` : ''}
        </div>
        <div class="prompt-text">${esc(item.ru)}</div>

        ${s.mode === 'tiles' ? `
          <div class="tile-tray${s.placed.length ? ' filled' : ''}" id="bldTray">
            ${s.placed.length
              ? s.placed.map((p, pi) => `<button type="button" class="word-tile placed" data-rem="${pi}" ${s.checked ? 'disabled' : ''}>${esc(p.text)}</button>`).join('')
              : '<span class="small muted" style="align-self:center">Нажимай на слова ниже, чтобы собрать перевод…</span>'}
          </div>
          <div class="tile-bank" id="bldBank">
            ${s.bank.map((b) => `<button type="button" class="word-tile${placedIds.has(b.id) ? ' used' : ''}" data-add="${b.id}" ${s.checked || placedIds.has(b.id) ? 'disabled' : ''}>${esc(b.text)}</button>`).join('')}
          </div>
          ${!s.checked ? `
            <div class="row-gap">
              <button type="button" class="btn btn-primary" style="flex:1" id="bldCheckTiles" ${s.placed.length ? '' : 'disabled'}>Проверить</button>
              <button type="button" class="btn btn-secondary" id="bldClearTiles" ${s.placed.length ? '' : 'disabled'}>Очистить</button>
            </div>
          ` : ''}
        ` : `
          <input type="text" class="input-field" id="bldInput" placeholder="Напечатай перевод на ${d.langLabel}..." value="${esc(s.userText)}" autocomplete="off" autocorrect="off" spellcheck="false" ${s.checked ? 'disabled' : ''}>
          ${s.subject === 'fr' && !s.checked ? `
            <div class="accent-bar" id="bldAccents">
              ${FR_ACCENTS.map((ch) => `<button type="button" class="accent-key" data-ch="${esc(ch)}">${esc(ch)}</button>`).join('')}
            </div>
          ` : ''}
          ${!s.checked ? `
            <div class="row-gap">
              <button type="button" class="btn btn-primary" style="flex:1" id="bldCheckInput">Проверить</button>
              ${hasAiKey() ? `<button type="button" class="btn btn-secondary" id="bldAiCheckBtn" ${s.aiBusy ? 'disabled' : ''}>${s.aiBusy ? '⏳' : '✨ ИИ-проверка'}</button>` : ''}
            </div>
          ` : ''}
        `}

        ${s.checked ? `
          <div class="feedback-box ${s.isCorrect ? 'good' : 'bad'}">
            <div><b>${s.isCorrect ? 'Верно!' : 'Есть ошибка'}</b></div>
            <div>Эталон: <b>${esc(item.answer)}</b></div>
            ${s.aiFeedback ? `<div style="margin-top:4px">✨ <b>Разбор ИИ:</b> ${esc(s.aiFeedback.feedback)}${s.aiFeedback.better && normAnswer(s.aiFeedback.better) !== normAnswer(item.answer) ? '<br>Вариант ИИ: <b>' + esc(s.aiFeedback.better) + '</b>' : ''}</div>` : ''}
            ${item.explain ? `<div class="small" style="margin-top:4px">${esc(item.explain)}</div>` : ''}
          </div>
          <div class="row-gap">
            ${!s.isCorrect && s.mode === 'input' ? `<button type="button" class="btn btn-secondary btn-sm" id="bldOverride">Засчитать верно</button>` : ''}
            <button type="button" class="btn btn-primary" style="flex:1" id="bldNext">${s.i + 1 < s.queue.length ? 'Дальше →' : 'К итогам'}</button>
          </div>
        ` : ''}
      </div>
    </div>`;

    bindSessionBar();

    // Switch tiles / input mode
    $('#bldModeSeg').querySelectorAll('button').forEach((b) => {
      b.onclick = () => {
        s.mode = b.dataset.bm;
        state.builderMode = s.mode;
        saveState();
        renderSession();
      };
    });

    // Change topic filter
    $('#bldTopicSel').onchange = (e) => {
      s.topicId = e.target.value;
      reloadBuilderQueue();
    };

    $('#bldWordsBtn').onclick = openBuilderWordsModal;
    $('#bldAiGenBtn').onclick = () => triggerBuilderAiGenerate();

    const sp = $('#bldSpeak');
    if (sp) sp.onclick = () => speak(item.answer, d.lang);

    if (s.mode === 'tiles' && !s.checked) {
      ov.querySelectorAll('[data-add]').forEach((b) => {
        b.onclick = () => {
          const id = Number(b.dataset.add);
          const tok = s.bank.find((x) => x.id === id);
          if (tok && !s.placed.some((p) => p.id === id)) {
            s.placed.push(tok);
            renderSession();
          }
        };
      });
      ov.querySelectorAll('[data-rem]').forEach((b) => {
        b.onclick = () => {
          s.placed.splice(Number(b.dataset.rem), 1);
          renderSession();
        };
      });
      $('#bldClearTiles').onclick = () => { s.placed = []; renderSession(); };
      $('#bldCheckTiles').onclick = () => {
        const built = s.placed.map((p) => p.text).join(' ');
        const ok = checkTypedAnswer(built, item.answer);
        finishBuilderStep(ok, item, built);
      };
    } else if (s.mode === 'input' && !s.checked) {
      const inp = $('#bldInput');
      if (inp) {
        inp.oninput = () => { s.userText = inp.value; };
        inp.onkeydown = (e) => { if (e.key === 'Enter') $('#bldCheckInput').click(); };
      }
      const acc = $('#bldAccents');
      if (acc) {
        acc.querySelectorAll('button').forEach((b) => {
          b.onclick = () => { insertAtCursor(inp, b.dataset.ch); s.userText = inp.value; };
        });
      }
      $('#bldCheckInput').onclick = () => {
        const val = (inp ? inp.value : s.userText).trim();
        if (!val) { showToast('Введи перевод'); return; }
        s.userText = val;
        const ok = checkTypedAnswer(val, item.answer);
        finishBuilderStep(ok, item, val);
      };
      const aiChk = $('#bldAiCheckBtn');
      if (aiChk) {
        aiChk.onclick = async () => {
          const val = (inp ? inp.value : s.userText).trim();
          if (!val) { showToast('Сначала введи свой перевод'); return; }
          s.userText = val;
          s.aiBusy = true;
          renderSession();
          try {
            const res = await window.BuilderEngine.aiCheck({
              aiCfg: state.ai,
              subject: s.subject,
              passedLesson: pl,
              item,
              userAnswer: val,
            });
            s.aiBusy = false;
            s.aiFeedback = res;
            finishBuilderStep(res.verdict === 'correct', item, val);
          } catch (err) {
            s.aiBusy = false;
            renderSession();
            showToast(err.message || 'Ошибка ИИ-проверки');
          }
        };
      }
    }

    if (s.checked) {
      const ovr = $('#bldOverride');
      if (ovr) ovr.onclick = () => {
        if (!s.isCorrect) {
          s.isCorrect = true;
          s.ok++;
          s.miss = s.miss.filter((m) => m.answer !== item.answer);
          removeMistake(s.subject, 'bld:' + item.answer);
          renderSession();
        }
      };
      $('#bldNext').onclick = () => {
        s.i++;
        s.checked = false;
        s.isCorrect = false;
        s.placed = [];
        s.userText = '';
        s.aiFeedback = null;
        if (s.i < s.queue.length) {
          s.bank = prepareTileBank(s.queue[s.i]);
        }
        renderSession();
      };
    }
  }

  function finishBuilderStep(ok, item) {
    session.checked = true;
    session.isCorrect = ok;
    markActiveToday();
    if (ok) {
      session.ok++;
      removeMistake(session.subject, 'bld:' + item.answer);
    } else {
      session.miss.push({ prompt: item.ru, answer: item.answer });
      addMistake(session.subject, {
        key: 'bld:' + item.answer,
        kind: 'builder',
        prompt: item.ru,
        answer: item.answer,
        ru: item.ru,
        explain: item.explain || item.ruleTitle,
      });
    }
    renderSession();
  }

  async function triggerBuilderAiGenerate() {
    if (!session || session.type !== 'builder') return;
    if (!hasAiKey()) {
      openModal(`
        <div class="modal-head">
          <h3 class="modal-title">✨ ИИ-репетитор не подключён</h3>
          <button type="button" class="btn btn-secondary btn-sm" id="closeMod">Закрыть</button>
        </div>
        <div class="small muted">Сейчас конструктор работает в быстром <b>офлайн-режиме</b>. Если хочешь дополнительно генерировать бесконечные живые фразы через DeepSeek / OpenRouter / Gemini — вставь API-ключ в Настройках.</div>
        <button type="button" class="btn btn-primary btn-block" id="goAiSettings">Открыть настройки ИИ</button>
      `);
      $('#closeMod').onclick = closeModal;
      $('#goAiSettings').onclick = () => { closeModal(true); openSettingsModal(); };
      return;
    }
    const s = session;
    const pl = passedLessonFor(s.subject);
    const topics = window.BuilderEngine.getTopics(s.subject, pl);
    const topObj = topics.find((t) => t.id === s.topicId);
    const words = getBuilderTargetWords(s.focusMode, s.customWords);
    const sampleVocab = words.length ? words : shuffle(filteredCards(s.subject)).slice(0, 10).map((c) => c.term.replace(/\([^)]*\)/g, '').trim());

    s.aiBusy = true;
    renderSession();
    try {
      const items = await window.BuilderEngine.aiGenerate({
        aiCfg: state.ai,
        subject: s.subject,
        passedLesson: pl,
        topicTitle: topObj ? topObj.title : '',
        targetWords: sampleVocab,
        count: 5,
      });
      s.aiBusy = false;
      reloadBuilderQueue(items);
      showToast(`ИИ собрал ${items.length} свежих фраз ✨`);
    } catch (err) {
      s.aiBusy = false;
      renderSession();
      showToast(err.message || 'Не удалось связаться с ИИ');
    }
  }

  function renderSession() {
    if (!session) return;
    const ov = $('#sessionOverlay');
    if (session.type === 'cards') renderCardsSession(ov);
    else if (session.type === 'dictation') renderDictationSession(ov);
    else if (session.type === 'choice') renderChoiceSession(ov);
    else if (session.type === 'exercises') renderExerciseSession(ov);
    else if (session.type === 'quiz') renderQuizSession(ov);
    else if (session.type === 'conjugation') renderConjugationSession(ov);
    else if (session.type === 'fr_texts') renderFrTextsSession(ov);
    else if (session.type === 'econ_maps') renderEconMapsSession(ov);
    else if (session.type === 'komkor_cliches') renderKomkorClichesSession(ov);
    else if (session.type === 'builder') renderBuilderSession(ov);
  }

  // ============================================================================
  // INIT
  // ============================================================================
  $('#icoLearn').innerHTML = ICO.learn;
  $('#icoCheat').innerHTML = ICO.cheat;
  $('#icoProgress').innerHTML = ICO.progress;
  $('#settingsBtn').innerHTML = ICO.gear;

  $('#themeBtn').onclick = () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState();
    applyTheme();
  };
  $('#settingsBtn').onclick = openSettingsModal;

  document.querySelectorAll('.nav-tab').forEach((btn) => {
    btn.onclick = () => {
      state.tab = btn.dataset.tab;
      saveState();
      renderAll();
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
  });

  // Register Service Worker for offline PWA
  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !window.AndroidBridge) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  renderAll();
})();
