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
      frPassedLesson: 5, // Passed up to A2 Lesson 5 (no futur simple until L6!)
      wakeLock: true,
      selectedUnits: sel,
      srs: {},          // cardId -> { box: 0..4, due: 'YYYY-MM-DD', seen: n }
      mistakes: {},     // subject -> [ { key, kind, prompt, answer, ru, explain } ]
      exams: [],        // [ { id, subject, title, date } ]
      quizHistory: [],  // [ { date, subject, score, total, pct } ]
      streak: { count: 0, lastDate: '' },
      cheatSub: 'vocab',
      cheatSearch: '',
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
    if (window.AndroidBridge && typeof window.AndroidBridge.speak === 'function') {
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

  // Current subject helpers
  const curData = () => window.STUDY_DATA[state.subject];
  function activeUnits(subjId = state.subject) {
    const d = window.STUDY_DATA[subjId];
    const sel = state.selectedUnits[subjId] || [];
    return sel.length ? sel : d.units.map((u) => u.id);
  }

  function filteredCards(subjId = state.subject) {
    const d = window.STUDY_DATA[subjId];
    const uSet = new Set(activeUnits(subjId));
    let arr = d.cards.filter((c) => uSet.has(c.unit));
    if (subjId === 'fr' && state.frGreenOnly) {
      const greens = arr.filter((c) => c.green);
      if (greens.length) arr = greens;
    }
    return arr;
  }

  function filteredItems(key, subjId = state.subject) {
    const d = window.STUDY_DATA[subjId];
    const list = d[key] || [];
    const uSet = new Set(activeUnits(subjId));
    const matched = list.filter((x) => !x.unit || uSet.has(x.unit));
    return matched.length ? matched : list;
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
      const tensesList = state.frPassedLesson >= 10
        ? 'présent, PC, imparfait, impératif, futur, subjonctif'
        : state.frPassedLesson >= 6
          ? 'présent, PC, imparfait, impératif, futur simple'
          : 'présent, PC, imparfait, impératif (до L5)';
      specialModesHtml = `
        <button type="button" class="mode-row" data-mode="conjugation">
          <div class="mode-icon accent">${ICO.grid}</div>
          <div class="mode-body">
            <div class="mode-title">Спряжения глаголов</div>
            <div class="mode-desc">${esc(tensesList)}</div>
          </div>
          <div class="mode-right">${availVerbs} гл. ${ICO.chev}</div>
        </button>
        <button type="button" class="mode-row" data-mode="fr_texts">
          <div class="mode-icon good">${ICO.list}</div>
          <div class="mode-body">
            <div class="mode-title">Тексты и активные слова</div>
            <div class="mode-desc">Тезисы текста + чек-лист зелёных слов</div>
          </div>
          <div class="mode-right">${d.texts.length} ${ICO.chev}</div>
        </button>`;
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

    root.innerHTML = `
      <!-- Unit Filter Card -->
      <div class="card card-compact">
        <div class="filter-row">
          <div class="filter-summary">
            <div class="filter-title">Выбранные темы: ${esc(labelPreview)}</div>
            <div class="filter-sub">${cards.length} карт. · ${exs.length} упр. · ${colls.length} колл.</div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="pickUnitsBtn">Выбрать</button>
        </div>
        <div class="chip-row">
          ${state.subject === 'fr' ? `<button type="button" class="pill${state.frGreenOnly ? ' green-active' : ''}" id="greenToggle">Только зелёные</button>` : ''}
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

    $('#pickUnitsBtn').onclick = openUnitPicker;
    const gt = $('#greenToggle');
    if (gt) gt.onclick = () => {
      state.frGreenOnly = !state.frGreenOnly;
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
        if (m === 'cards') startCardsSession();
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
  // UNIT PICKER MODAL
  // ============================================================================
  function openUnitPicker() {
    const d = curData();
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
            ${list.map((u) => `
              <button type="button" class="pill${sel.has(u.id) ? ' active' : ''}" data-uid="${u.id}">
                ${esc(u.label)}
              </button>
            `).join('')}
          </div>
        </div>
      `).join('');

      const presetFr = state.subject === 'fr'
        ? `<button type="button" class="btn btn-secondary btn-sm" id="presetA2Passed">Пройденное A2 (L1–L${state.frPassedLesson})</button>`
        : '';

      openModal(`
        <div class="modal-head">
          <h3 class="modal-title">Выбор уроков · ${esc(d.shortName)}</h3>
          <button type="button" class="btn btn-secondary btn-sm" id="closeMod">Готово</button>
        </div>
        <div class="row-gap">
          <button type="button" class="btn btn-secondary btn-sm" id="selAll">Выбрать всё</button>
          <button type="button" class="btn btn-secondary btn-sm" id="selNone">Снять всё</button>
          ${presetFr}
        </div>
        ${body}
        <button type="button" class="btn btn-primary btn-block" id="applyUnits">Применить (${sel.size})</button>
      `);

      $('#modalSheet').querySelectorAll('[data-uid]').forEach((b) => {
        b.onclick = () => {
          const id = b.dataset.uid;
          if (sel.has(id)) sel.delete(id); else sel.add(id);
          draw();
        };
      });
      $('#selAll').onclick = () => { d.units.forEach((u) => sel.add(u.id)); draw(); };
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
      let cards = filteredCards();
      if (q) {
        cards = d.cards.filter((c) =>
          c.term.toLowerCase().includes(q) || c.ru.toLowerCase().includes(q) || (c.coll && c.coll.toLowerCase().includes(q))
        );
      }
      const shown = cards.slice(0, 80);
      content = `
        <div class="search-wrap">
          <input type="search" class="search-input" id="cheatSearch" placeholder="Поиск слова на ${d.langLabel} или русском..." value="${esc(state.cheatSearch)}">
        </div>
        <div class="row-between small muted">
          <span>Найдено: ${cards.length}${cards.length > 80 ? ' (показаны первые 80)' : ''}</span>
          ${state.subject === 'fr' ? `<button type="button" class="pill${state.frGreenOnly ? ' green-active' : ''}" id="cheatGreen">Только зелёные</button>` : ''}
        </div>
        <div class="mode-list">
          ${shown.map((c) => `
            <div class="dict-item">
              <div style="min-width:0">
                <div class="dict-term">${esc(c.term)} ${c.green ? '<span class="pill green-active" style="padding:1px 7px;min-height:20px;font-size:11px">зелёное</span>' : ''}</div>
                <div class="dict-ru">${esc(c.ru)}</div>
                ${c.coll ? `<div class="dict-meta"><b>Колл.:</b> ${esc(c.coll)}</div>` : ''}
                ${c.ex ? `<div class="dict-meta">${esc(c.ex)}</div>` : ''}
              </div>
              <button type="button" class="tts-btn" data-say="${esc(c.term)}" aria-label="Произнести">${ICO.vol}</button>
            </div>
          `).join('')}
        </div>
      `;
    } else if (state.cheatSub === 'grammar') {
      const sheets = filteredItems('cheatsheets');
      content = sheets.map((sh, idx) => `
        <details class="accordion"${idx === 0 ? ' open' : ''}>
          <summary><span>${esc(sh.title)}</span>${ICO.chev}</summary>
          <div class="accordion-body">
            ${sh.blocks.map((b) => `<div class="rule-block"><h4>${esc(b.heading)}</h4><p>${esc(b.body)}</p></div>`).join('')}
          </div>
        </details>
      `).join('');
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
    openModal(`
      <div class="modal-head">
        <h3 class="modal-title">Настройки</h3>
        <button type="button" class="btn btn-secondary btn-sm" id="closeMod">Готово</button>
      </div>

      <div>
        <div class="setting-row">
          <div>
            <b>Французский: пройденный урок A2</b>
            <div class="small muted">Фильтрует времена в спряжениях (до L5 без futur simple)</div>
          </div>
          <select class="input-field" id="setFrLesson" style="width:92px;padding:8px">
            ${[1,2,3,4,5,6,7,8,9,10].map((n) => `<option value="${n}"${state.frPassedLesson === n ? ' selected' : ''}>A2 L${n}</option>`).join('')}
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
            <b>Бэкап прогресса (JSON)</b>
            <div class="small muted">Сохранить или восстановить все данные</div>
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
      state.frPassedLesson = Number(e.target.value);
      saveState();
      renderAll();
      showToast(`Французский: до A2 L${state.frPassedLesson}`);
    };
    $('#setWake').onclick = () => {
      state.wakeLock = !state.wakeLock;
      saveState();
      openSettingsModal();
    };
    $('#exportBtn').onclick = () => {
      const json = JSON.stringify(state, null, 2);
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
    const texts = window.STUDY_DATA.fr.texts || [];
    const defaultIdx = Math.max(0, texts.findIndex((t) => t.unit === 'a2-5'));
    openSession({
      type: 'fr_texts',
      title: 'Тексты FR',
      idx: defaultIdx,
      checkedWords: {},
    });
  }

  function renderFrTextsSession(ov) {
    const texts = window.STUDY_DATA.fr.texts || [];
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
