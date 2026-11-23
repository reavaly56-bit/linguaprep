/* LinguaPrep · Hybrid Sentence Builder Engine v1.2 (Combinatorial Offline + Optional Online AI) */
(() => {
  'use strict';

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // French elision helper (vowels + h muet used in our lexicon)
  const startsVowelFr = (w) => /^[aeiouyàâäéèêëîïôöùûüœh]/i.test(String(w || '').trim());
  const elideFr = (prefix, next) => {
    const n = String(next || '').trim();
    if (!n) return prefix;
    if (startsVowelFr(n)) {
      const map = { je: "j'", Je: "J'", ne: "n'", Ne: "N'", de: "d'", De: "D'", que: "qu'", Que: "Qu'", se: "s'", Se: "S'", me: "m'", te: "t'", le: "l'", la: "l'", Le: "L'", La: "L'", si: n.toLowerCase().startsWith('il') ? "s'" : 'si ' };
      if (map[prefix]) return map[prefix].endsWith(' ') ? map[prefix] + n : map[prefix] + n;
    }
    return prefix + ' ' + n;
  };
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
  const low = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : '');

  // Smart tokenizer for French & English tiles (attaches trailing ? / ! to last word so user doesn't tap lonely punctuation)
  function tokenizeSentence(s) {
    const clean = String(s || '').trim().replace(/\s+/g, ' ');
    if (!clean) return [];
    const raw = clean.split(' ').filter(Boolean);
    const out = [];
    for (const tok of raw) {
      if (/^[?!;:.,]+$/.test(tok) && out.length) {
        out[out.length - 1] += ' ' + tok;
      } else {
        out.push(tok);
      }
    }
    return out;
  }

  // Build unique items by sampling combinations from a generator function
  function sampleFromGen(genFn, targetCount, filterWords = []) {
    const seen = new Set();
    const pool = [];
    const mult = filterWords.length ? 40 : 18;
    const maxAttempts = Math.max(60, targetCount * mult);
    for (let i = 0; i < maxAttempts; i++) {
      const item = genFn();
      if (!item || !item.answer || seen.has(item.answer)) continue;
      seen.add(item.answer);
      pool.push(item);
      if (!filterWords.length && pool.length >= targetCount * 3) break;
    }
    if (filterWords.length) {
      const lowerW = filterWords.map((w) => w.toLowerCase());
      pool.sort((a, b) => {
        const score = (it) => {
          const hay = (it.answer + ' ' + (it.keywords || []).join(' ')).toLowerCase();
          return lowerW.reduce((acc, w) => acc + (hay.includes(w) ? 1 : 0), 0);
        };
        return score(b) - score(a);
      });
    }
    return pool.slice(0, targetCount);
  }

  // ============================================================================
  // FRENCH GRAMMAR TOPICS & COMBINATORIAL GENERATORS (Accent français A1 -> A2 L10)
  // Every single combination is grammatically, semantically & agreement-verified!
  // ============================================================================
  const FR_TOPICS = [
    // --- A1 (minLesson: 0) ---
    {
      id: 'fr-a1-present',
      minLesson: 0,
      unit: 'a1-1',
      est: 273,
      label: 'A1 · Présent, être & 1-я группа',
      title: 'A1 · Настоящее время (être, avoir, глаголы 1-й группы)',
      explain: 'Глаголы 1-й группы (-er) в présent: -e, -es, -e, -ons, -ez, -ent. После être перед профессией артикль не ставится.',
      gen() {
        if (Math.random() < 0.4) {
          const subjs = [
            { fr: 'Je suis', ru: 'Я', f: false },
            { fr: 'Tu es', ru: 'Ты', f: false },
            { fr: 'Mon ami est', ru: 'Мой друг', f: false },
            { fr: 'Ma sœur est', ru: 'Моя сестра', f: true },
            { fr: 'Mon voisin est', ru: 'Мой сосед', f: false },
            { fr: 'Ma cousine est', ru: 'Моя двоюродная сестра', f: true },
            { fr: 'Son père est', ru: 'Его отец', f: false },
          ];
          const profs = [
            { m: 'étudiant', f: 'étudiante', ruM: 'студент', ruF: 'студентка', kw: ['étudiant'] },
            { m: 'ingénieur', f: 'ingénieure', ruM: 'инженер', ruF: 'инженер', kw: ['ingénieur'] },
            { m: 'professeur de français', f: 'professeur de français', ruM: 'преподаватель французского', ruF: 'преподаватель французского', kw: ['professeur', 'français'] },
            { m: 'journaliste', f: 'journaliste', ruM: 'журналист', ruF: 'журналистка', kw: ['journaliste'] },
            { m: 'médecin', f: 'médecin', ruM: 'врач', ruF: 'врач', kw: ['médecin'] },
            { m: 'architecte', f: 'architecte', ruM: 'архитектор', ruF: 'архитектор', kw: ['architecte'] },
          ];
          const places = [
            { fr: 'à Moscou', ru: 'в Москве' },
            { fr: 'à Paris', ru: 'в Париже' },
            { fr: 'à Lyon', ru: 'в Лионе' },
            { fr: 'en France', ru: 'во Франции' },
          ];
          const s = pick(subjs);
          const p = pick(profs);
          const pl = pick(places);
          return {
            ru: `${s.ru} — ${s.f ? p.ruF : p.ruM} ${pl.ru}.`,
            answer: `${s.fr} ${s.f ? p.f : p.m} ${pl.fr}.`,
            distractors: ['un', 'une', 'sommes', 'avez'],
            keywords: p.kw,
            explain: 'A1: после глагола être перед названием профессии без определения артикль НЕ ставится.',
          };
        }
        const subjs = [
          { fr: 'Je', idx: 0, ru: 'Я' },
          { fr: 'Tu', idx: 1, ru: 'Ты' },
          { fr: 'Mon frère', idx: 2, ru: 'Мой брат' },
          { fr: 'Ma sœur', idx: 2, ru: 'Моя сестра' },
          { fr: 'Nous', idx: 3, ru: 'Мы' },
          { fr: 'Vous', idx: 4, ru: 'Вы' },
          { fr: 'Mes amis', idx: 5, ru: 'Мои друзья' },
        ];
        const verbs = [
          { forms: ['habite', 'habites', 'habite', 'habitons', 'habitez', 'habitent'], ru: ['живу', 'живёшь', 'живёт', 'живём', 'живёте', 'живут'], objs: [
            { fr: "près de l'université", ru: 'рядом с университетом' },
            { fr: 'dans le centre-ville', ru: 'в центре города' },
            { fr: 'à Moscou', ru: 'в Москве' },
          ], d: ['habitent', 'au', 'dans'], kw: ['habiter'] },
          { forms: ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent'], ru: ['говорю', 'говоришь', 'говорит', 'говорим', 'говорите', 'говорят'], objs: [
            { fr: 'français avec des amis', ru: 'по-французски с друзьями' },
            { fr: 'bien français et anglais', ru: 'хорошо по-французски и по-английски' },
            { fr: 'avec le professeur', ru: 'с преподавателем' },
          ], d: ['parlez', 'du', 'en'], kw: ['parler', 'français'] },
          { forms: ['travaille', 'travailles', 'travaille', 'travaillons', 'travaillez', 'travaillent'], ru: ['работаю', 'работаешь', 'работает', 'работаем', 'работаете', 'работают'], objs: [
            { fr: 'beaucoup cette semaine', ru: 'много на этой неделе' },
            { fr: 'à la bibliothèque le soir', ru: 'в библиотеке вечером' },
            { fr: 'dans une grande entreprise', ru: 'в крупной компании' },
          ], d: ['travaillons', 'ce', 'très'], kw: ['travailler'] },
          { forms: ['étudie', 'étudies', 'étudie', 'étudions', 'étudiez', 'étudient'], ru: ['изучаю', 'изучаешь', 'изучает', 'изучаем', 'изучаете', 'изучают'], objs: [
            { fr: 'le français à la faculté', ru: 'французский на факультете' },
            { fr: "l'économie et les langues", ru: 'экономику и языки' },
          ], d: ['étudiez', 'du', 'au'], kw: ['étudier'] },
          { forms: ['prépare', 'prépares', 'prépare', 'préparons', 'préparez', 'préparent'], ru: ['готовлю', 'готовишь', 'готовит', 'готовим', 'готовите', 'готовят'], objs: [
            { fr: 'un examen important', ru: 'важный экзамен' },
            { fr: 'le dîner dans la cuisine', ru: 'ужин на кухне' },
          ], d: ['préparons', 'une', 'au'], kw: ['préparer'] },
          { forms: ['écoute', 'écoutes', 'écoute', 'écoutons', 'écoutez', 'écoutent'], ru: ['слушаю', 'слушаешь', 'слушает', 'слушаем', 'слушаете', 'слушают'], objs: [
            { fr: 'la radio française le matin', ru: 'французское радио утром' },
            { fr: 'un dialogue en français', ru: 'диалог на французском' },
          ], d: ['écoutez', 'à la', 'du'], kw: ['écouter'] },
        ];
        const s = pick(subjs);
        const v = pick(verbs);
        const o = pick(v.objs);
        const vf = v.forms[s.idx];
        const phrase = s.fr === 'Je' ? elideFr('Je', vf) : `${s.fr} ${vf}`;
        return {
          ru: `${s.ru} ${v.ru[s.idx]} ${o.ru}.`,
          answer: `${phrase} ${o.fr}.`,
          distractors: v.d,
          keywords: v.kw,
          explain: 'A1: спряжение глаголов 1-й группы (-er) в présent (-e, -es, -e, -ons, -ez, -ent) + элизия je → j\' перед гласной/немым h.',
        };
      },
    },
    {
      id: 'fr-a1-neg',
      minLesson: 0,
      unit: 'a1-3',
      est: 84,
      label: 'A1 · Отрицание ne…pas',
      title: 'A1 · Отрицательная форма ne…pas / n\'…pas',
      explain: 'В отрицании ne (n\' перед гласной/немым h) ставится перед глаголом, pas — после глагола. После глаголов чувств (aimer, détester) определённый артикль сохраняется.',
      gen() {
        const subjs = [
          { fr: 'Je', idx: 0, ru: 'Я' },
          { fr: 'Tu', idx: 1, ru: 'Ты' },
          { fr: 'Il', idx: 2, ru: 'Он' },
          { fr: 'Elle', idx: 2, ru: 'Она' },
          { fr: 'Nous', idx: 3, ru: 'Мы' },
          { fr: 'Vous', idx: 4, ru: 'Вы' },
          { fr: 'Ils', idx: 5, ru: 'Они' },
        ];
        const preds = [
          { f: ['aime', 'aimes', 'aime', 'aimons', 'aimez', 'aiment'], ru: ['люблю', 'любишь', 'любит', 'любим', 'любите', 'любят'], objs: [
            { fr: 'le temps froid', ru: 'холодную погоду', d: ['ne', 'du', 'froide'], kw: ['aimer', 'temps'] },
            { fr: 'le bruit dans la rue', ru: 'шум на улице', d: ['ne', 'du', 'au'], kw: ['aimer', 'bruit'] },
            { fr: 'la pluie en automne', ru: 'дождь осенью', d: ['ne', 'de la', 'à'], kw: ['aimer', 'pluie'] },
          ] },
          { f: ['habite', 'habites', 'habite', 'habitons', 'habitez', 'habitent'], ru: ['живу', 'живёшь', 'живёт', 'живём', 'живёте', 'живут'], objs: [
            { fr: 'dans le centre-ville', ru: 'в центре города', d: ['ne', 'au', 'habites'], kw: ['habiter', 'centre-ville'] },
            { fr: 'loin du métro', ru: 'далеко от метро', d: ['ne', 'de le', 'à'], kw: ['habiter', 'métro'] },
          ] },
          { f: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'], ru: ['знаю', 'знаешь', 'знает', 'знаем', 'знаете', 'знают'], objs: [
            { fr: 'cette adresse', ru: 'этот адрес', d: ['ce', 'cet', 'de'], kw: ['connaître', 'adresse'] },
            { fr: 'ce nouveau quartier', ru: 'этот новый квартал', d: ['cet', 'cette', 'nouvel'], kw: ['connaître', 'quartier'] },
            { fr: 'cette rue calme', ru: 'эту тихую улицу', d: ['ce', 'cet', 'au'], kw: ['connaître', 'rue'] },
          ] },
          { f: ['comprends', 'comprends', 'comprend', 'comprenons', 'comprenez', 'comprennent'], ru: ['понимаю', 'понимаешь', 'понимает', 'понимаем', 'понимаете', 'понимают'], objs: [
            { fr: 'cette question difficile', ru: 'этот трудный вопрос', d: ['ce', 'cet', 'de'], kw: ['comprendre', 'question'] },
            { fr: 'ce texte long', ru: 'этот длинный текст', d: ['cette', 'cet', 'longue'], kw: ['comprendre', 'texte'] },
          ] },
          { f: ['travaille', 'travailles', 'travaille', 'travaillons', 'travaillez', 'travaillent'], ru: ['работаю', 'работаешь', 'работает', 'работаем', 'работаете', 'работают'], objs: [
            { fr: 'le dimanche', ru: 'по воскресеньям', d: ["n'", 'au', 'des'], kw: ['travailler', 'dimanche'] },
            { fr: 'tard le soir', ru: 'поздно вечером', d: ["n'", 'au', 'tôt'], kw: ['travailler', 'soir'] },
          ] },
        ];
        const s = pick(subjs);
        const p = pick(preds);
        const o = pick(p.objs);
        const vf = p.f[s.idx];
        const negVerb = `${elideFr('ne', vf)} pas`;
        return {
          ru: `${s.ru} не ${p.ru[s.idx]} ${o.ru}.`,
          answer: `${s.fr} ${negVerb} ${o.fr}.`,
          distractors: o.d,
          keywords: o.kw,
          explain: 'A1 L3: ne (n\' перед гласной/немым h) + глагол + pas. После aimer определённый артикль (le/la/les) сохраняется!',
        };
      },
    },
    {
      id: 'fr-a1-aller-faire',
      minLesson: 0,
      unit: 'a1-4',
      est: 140,
      label: 'A1 · Aller / Faire / Погода и спорт',
      title: 'A1 · Глаголы aller à, faire du/de la, погода и занятия',
      explain: 'aller + à (+ le = au, + les = aux, + l\'); faire + du / de la / de l\' / des + спорт или занятие.',
      gen() {
        const subjs = [
          { fr: 'Je', va: 'vais', fait: 'fais', ru: 'Я', go: 'иду', do: 'занимаюсь' },
          { fr: 'Tu', va: 'vas', fait: 'fais', ru: 'Ты', go: 'идёшь', do: 'занимаешься' },
          { fr: 'Mon frère', va: 'va', fait: 'fait', ru: 'Мой брат', go: 'идёт', do: 'занимается' },
          { fr: 'Ma sœur', va: 'va', fait: 'fait', ru: 'Моя сестра', go: 'идёт', do: 'занимается' },
          { fr: 'Nous', va: 'allons', fait: 'faisons', ru: 'Мы', go: 'идём', do: 'занимаемся' },
          { fr: 'Vous', va: 'allez', fait: 'faites', ru: 'Вы', go: 'идёте', do: 'занимаетесь' },
          { fr: 'Mes amis', va: 'vont', fait: 'font', ru: 'Мои друзья', go: 'идут', do: 'занимаются' },
        ];
        const places = [
          { fr: 'à la bibliothèque', ru: 'в библиотеку', d: ['au', 'en'], kw: ['bibliothèque', 'aller'] },
          { fr: 'au cinéma ce soir', ru: 'в кино сегодня вечером', d: ['à le', 'dans'], kw: ['cinéma', 'soir'] },
          { fr: 'à la gare en métro', ru: 'на вокзал на метро', d: ['au', 'par'], kw: ['gare', 'métro'] },
          { fr: 'au parc le matin', ru: 'в парк утром', d: ['à le', 'dans'], kw: ['parc', 'matin'] },
          { fr: "à l'université à pied", ru: 'в университет пешком', d: ['au', 'en'], kw: ['université', 'à pied'] },
          { fr: 'au restaurant samedi', ru: 'в ресторан в субботу', d: ['à le', 'le'], kw: ['restaurant', 'samedi'] },
          { fr: 'aux cours de français', ru: 'на занятия по французскому', d: ['à les', 'au'], kw: ['cours', 'français'] },
          { fr: 'à la piscine après les cours', ru: 'в бассейн после занятий', d: ['au', 'en'], kw: ['piscine', 'cours'] },
          { fr: 'au musée avec des amis', ru: 'в музей с друзьями', d: ['à le', 'en'], kw: ['musée', 'amis'] },
          { fr: 'chez le médecin', ru: 'к врачу', d: ['au', 'à le'], kw: ['chez', 'médecin'] },
        ];
        const sports = [
          { fr: 'du vélo le week-end', ru: 'велоспортом по выходным', d: ['le', 'de la'], kw: ['vélo', 'faire'] },
          { fr: 'du sport trois fois par semaine', ru: 'спортом три раза в неделю', d: ['le', 'de'], kw: ['sport', 'faire'] },
          { fr: 'de la natation le matin', ru: 'плаванием по утрам', d: ['du', 'la'], kw: ['natation', 'faire'] },
          { fr: 'des courses au marché', ru: 'покупками на рынке', d: ['les', 'du'], kw: ['courses', 'marché'] },
          { fr: 'du ski en hiver', ru: 'лыжами зимой', d: ['le', 'au'], kw: ['ski', 'hiver'] },
          { fr: 'du tennis au club', ru: 'теннисом в клубе', d: ['de la', 'au'], kw: ['tennis', 'faire'] },
          { fr: 'de la randonnée en été', ru: 'пешими прогулками летом', d: ['du', 'la'], kw: ['randonnée', 'été'] },
          { fr: 'du jogging dans le parc', ru: 'бегом в парке', d: ['de la', 'le'], kw: ['jogging', 'parc'] },
          { fr: 'de la musique le soir', ru: 'музыкой по вечерам', d: ['du', 'la'], kw: ['musique', 'soir'] },
          { fr: 'de la gymnastique à la maison', ru: 'гимнастикой дома', d: ['du', 'la'], kw: ['gymnastique', 'maison'] },
        ];
        const s = pick(subjs);
        if (Math.random() < 0.5) {
          const p = pick(places);
          return {
            ru: `${s.ru} ${s.go} ${p.ru}.`,
            answer: `${s.fr} ${s.va} ${p.fr}.`,
            distractors: p.d,
            keywords: p.kw,
            explain: 'A1: aller (vais, vas, va, allons, allez, vont) + à la / au (à+le) / à l\' / aux (à+les) / chez (к человеку).',
          };
        }
        const sp = pick(sports);
        return {
          ru: `${s.ru} ${s.do} ${sp.ru}.`,
          answer: `${s.fr} ${s.fait} ${sp.fr}.`,
          distractors: sp.d,
          keywords: sp.kw,
          explain: 'A1 L4/L12: faire (fais, fais, fait, faisons, faites, font) + du / de la / des.',
        };
      },
    },
    {
      id: 'fr-a1-det',
      minLesson: 0,
      unit: 'a1-5',
      est: 45,
      label: 'A1 · Указательные и притяжательные',
      title: 'A1 · Ce / cet / cette / ces и mon / ma / mes / son / sa',
      explain: 'ce — м.р. перед согласной; cet — м.р. перед гласной/немым h; cette — ж.р.; ces — мн.ч. Перед ж.р. на гласную вместо ma/ta/sa ставится mon/ton/son!',
      gen() {
        const nouns = [
          { det: 'Cet', n: 'hôtel', ru: 'Этот отель', g: 'm', d: ['Ce', 'Cette'], kw: ['hôtel'] },
          { det: 'Cet', n: 'appartement', ru: 'Эта квартира', g: 'm', d: ['Ce', 'Cette'], kw: ['appartement'] },
          { det: 'Cet', n: 'immeuble', ru: 'Это здание', g: 'm', d: ['Ce', 'Cette'], kw: ['immeuble'] },
          { det: 'Ce', n: 'quartier', ru: 'Этот квартал', g: 'm', d: ['Cet', 'Cette'], kw: ['quartier'] },
          { det: 'Cette', n: 'chambre', ru: 'Эта комната', g: 'f', d: ['Ce', 'Cet'], kw: ['chambre'] },
          { det: 'Cette', n: 'maison', ru: 'Этот дом', g: 'f', d: ['Ce', 'Cet'], kw: ['maison'] },
          { det: 'Mon', n: 'université', ru: 'Мой университет', g: 'f', d: ['Ma', 'Ce'], kw: ['université'] },
          { det: 'Son', n: 'école', ru: 'Его школа', g: 'f', d: ['Sa', 'Cette'], kw: ['école'] },
          { det: 'Mon', n: 'amie', ru: 'Моя подруга', g: 'f', d: ['Ma', 'Mes'], kw: ['amie'], person: true },
          { det: 'Cet', n: 'étudiant', ru: 'Этот студент', g: 'm', d: ['Ce', 'Cette'], kw: ['étudiant'], person: true },
          { det: 'Ces', n: 'livres', ru: 'Эти книги', g: 'mp', d: ['Ce', 'Cette'], kw: ['livres'], thing: true },
          { det: 'Ces', n: 'chambres', ru: 'Эти комнаты', g: 'fp', d: ['Cette', 'Ce'], kw: ['chambres'] },
        ];
        const placeAdjs = [
          { m: 'est très lumineux', f: 'est très lumineuse', mp: 'sont très lumineux', fp: 'sont très lumineuses', ruM: 'очень светлый', ruF: 'очень светлая', ruP: 'очень светлые' },
          { m: 'est très calme', f: 'est très calme', mp: 'sont très calmes', fp: 'sont très calmes', ruM: 'очень тихий', ruF: 'очень тихая', ruP: 'очень тихие' },
          { m: 'est moderne et grand', f: 'est moderne et grande', mp: 'sont modernes et grands', fp: 'sont modernes et grandes', ruM: 'современный и большой', ruF: 'современная и большая', ruP: 'современные и большие' },
          { m: 'est près du métro', f: 'est près du métro', mp: 'sont près du métro', fp: 'sont près du métro', ruM: 'рядом с метро', ruF: 'рядом с метро', ruP: 'рядом с метро' },
        ];
        const personAdjs = [
          { m: 'est très sympathique', f: 'est très sympathique', ruM: 'очень симпатичный', ruF: 'очень симпатичная' },
          { m: 'est très sérieux', f: 'est très sérieuse', ruM: 'очень серьёзный', ruF: 'очень серьёзная' },
          { m: 'parle très bien français', f: 'parle très bien français', ruM: 'очень хорошо говорит по-французски', ruF: 'очень хорошо говорит по-французски' },
        ];
        const thingAdjs = [
          { mp: 'sont très intéressants', ruP: 'очень интересные' },
          { mp: 'sont très utiles pour le cours', ruP: 'очень полезные для занятия' },
          { mp: 'sont sur la table', ruP: 'лежат на столе' },
        ];
        const n = pick(nouns);
        let predFr, predRu;
        if (n.person) {
          const a = pick(personAdjs);
          predFr = a[n.g];
          predRu = n.g === 'f' ? a.ruF : a.ruM;
        } else if (n.thing) {
          const a = pick(thingAdjs);
          predFr = a.mp;
          predRu = a.ruP;
        } else {
          const a = pick(placeAdjs);
          predFr = a[n.g];
          predRu = n.g === 'mp' || n.g === 'fp' ? a.ruP : (n.ru.endsWith('а') || n.ru.endsWith('я') ? a.ruF : a.ruM);
        }
        return {
          ru: `${n.ru} — ${predRu}.`,
          answer: `${n.det} ${n.n} ${predFr}.`,
          distractors: [...n.d, 'est'],
          keywords: n.kw,
          explain: 'A1 L3/L5: cet — м.р. перед гласной/немым h (cet hôtel, cet appartement, cet immeuble); mon/ton/son — перед ж.р. на гласную (mon amie, mon université, son école).',
        };
      },
    },
    {
      id: 'fr-a1-questions',
      minLesson: 0,
      unit: 'a1-6',
      est: 22,
      label: 'A1 · Вопросы (Est-ce que, Où, Quand, Quel)',
      title: 'A1 · Вопросительные конструкции и quel / quelle',
      explain: 'Est-ce que сохраняет прямой порядок слов. Quel / Quelle / Quels / Quelles согласуется с существительным.',
      gen() {
        if (Math.random() < 0.5) {
          const qs = [
            { fr: 'Où est-ce que', ru: 'Где', verbs: [
              { fr: 'vous habitez', ru: 'вы живёте', d: ['habite', 'Quand'] },
              { fr: 'tu travailles', ru: 'ты работаешь', d: ['travaille', 'Que'] },
              { fr: 'vous achetez du pain', ru: 'вы покупаете хлеб', d: ['achète', 'le'] },
              { fr: 'tes amis étudient', ru: 'твои друзья учатся', d: ['étudie', 'Quel'] },
            ] },
            { fr: 'À quelle heure est-ce que', ru: 'В котором часу', verbs: [
              { fr: 'tu arrives', ru: 'ты приезжаешь', d: ['quel', 'arrive'] },
              { fr: 'le cours commence', ru: 'начинается занятие', d: ['quel', 'commencent'] },
              { fr: 'vous déjeunez', ru: 'вы обедаете', d: ['quel', 'déjeune'] },
              { fr: 'le train part', ru: 'отправляется поезд', d: ['quel', 'partent'] },
            ] },
            { fr: 'Quand est-ce que', ru: 'Когда', verbs: [
              { fr: 'tu fais du sport', ru: 'ты занимаешься спортом', d: ['Où', 'le'] },
              { fr: 'vous avez cours de français', ru: 'у вас занятие по французскому', d: ['êtes', 'du'] },
              { fr: 'ton ami revient à Moscou', ru: 'твой друг возвращается в Москву', d: ['reviennent', 'en'] },
            ] },
            { fr: "Qu'est-ce que", ru: 'Что', verbs: [
              { fr: 'tu fais ce soir', ru: 'ты делаешь сегодня вечером', d: ['Est-ce que', 'fait'] },
              { fr: 'vous lisez en ce moment', ru: 'вы читаете сейчас', d: ['Est-ce que', 'lit'] },
              { fr: 'tu prends pour le petit déjeuner', ru: 'ты берёшь на завтрак', d: ['Qui', 'prend'] },
            ] },
          ];
          const q = pick(qs);
          const v = pick(q.verbs);
          return {
            ru: `${q.ru} ${v.ru}?`,
            answer: `${q.fr} ${v.fr} ?`,
            distractors: [...v.d, 'qui'],
            keywords: ['est-ce que', 'question'],
            explain: 'A1: вопросительное слово + est-ce que + подлежащее + глагол (прямой порядок слов).',
          };
        }
        const quelItems = [
          { ru: 'Который час?', ans: 'Quelle heure est-il ?', d: ['Quel', 'Quels', 'est-ce'], kw: ['heure'] },
          { ru: 'Какая сегодня погода?', ans: "Quel temps fait-il aujourd'hui ?", d: ['Quelle', 'est-il', 'fait'], kw: ['temps', 'météo'] },
          { ru: 'Какой у тебя любимый вид спорта?', ans: 'Quel est ton sport préféré ?', d: ['Quelle', 'Quels', 'ta'], kw: ['sport'] },
          { ru: 'Какая твоя любимая книга?', ans: 'Quel est ton livre préféré ?', d: ['Quelle', 'Quelles', 'ta'], kw: ['livre'] },
          { ru: 'Какую музыку ты слушаешь?', ans: 'Quelle musique est-ce que tu écoutes ?', d: ['Quel', 'Quelles', 'écoute'], kw: ['musique'] },
          { ru: 'Какие языки вы изучаете?', ans: 'Quelles langues est-ce que vous étudiez ?', d: ['Quels', 'Quelle', 'étudie'], kw: ['langues'] },
          { ru: 'Какой сегодня день недели?', ans: 'Quel jour sommes-nous ?', d: ['Quelle', 'Quels', 'avons'], kw: ['jour'] },
          { ru: 'Какого числа экзамен?', ans: "Quelle est la date de l'examen ?", d: ['Quel', 'Quelles', 'du'], kw: ['date', 'examen'] },
        ];
        const it = pick(quelItems);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A1: quel (м.р. ед.), quelle (ж.р. ед.), quels (м.р. мн.), quelles (ж.р. мн.) согласуется с существительным.' };
      },
    },

    // --- A2 L1 (minLesson: 1) ---
    {
      id: 'fr-a2-1-refl',
      minLesson: 1,
      unit: 'a2-1',
      est: 192,
      label: 'A2 L1 · Возвратные глаголы',
      title: 'A2 L1 · Возвратные глаголы (présent и passé composé с être)',
      explain: 'Возвратные местоимения: me, te, se, nous, vous, se. В passé composé ВСЕ возвратные глаголы спрягаются с être!',
      gen() {
        const mode = Math.random();
        if (mode < 0.5) {
          // Présent combinatorial
          const subjs = [
            { fr: 'Je', p: 'me', idx: 0, ru: 'Я' },
            { fr: 'Tu', p: 'te', idx: 1, ru: 'Ты' },
            { fr: 'Il', p: 'se', idx: 2, ru: 'Он' },
            { fr: 'Elle', p: 'se', idx: 2, ru: 'Она' },
            { fr: 'Nous', p: 'nous', idx: 3, ru: 'Мы' },
            { fr: 'Vous', p: 'vous', idx: 4, ru: 'Вы' },
            { fr: 'Ils', p: 'se', idx: 5, ru: 'Они' },
          ];
          const verbs = [
            { f: ['lève', 'lèves', 'lève', 'levons', 'levez', 'lèvent'], ru: ['встаю', 'встаёшь', 'встаёт', 'встаём', 'встаёте', 'встают'], ends: [
              { fr: 'à sept heures du matin', ru: 'в семь часов утра' },
              { fr: 'tôt en semaine', ru: 'рано по будням' },
            ], kw: ['se lever'] },
            { f: ['réveille', 'réveilles', 'réveille', 'réveillons', 'réveillez', 'réveillent'], ru: ['просыпаюсь', 'просыпаешься', 'просыпается', 'просыпаемся', 'просыпаетесь', 'просыпаются'], ends: [
              { fr: 'avant le réveil', ru: 'до будильника' },
              { fr: 'tard le dimanche', ru: 'поздно по воскресеньям' },
            ], kw: ['se réveiller'] },
            { f: ['repose', 'reposes', 'repose', 'reposons', 'reposez', 'reposent'], ru: ['отдыхаю', 'отдыхаешь', 'отдыхает', 'отдыхаем', 'отдыхаете', 'отдыхают'], ends: [
              { fr: 'après les cours', ru: 'после занятий' },
              { fr: 'chez soi le soir', ru: 'дома вечером', skip: true },
              { fr: 'un peu après le déjeuner', ru: 'немного после обеда' },
            ], kw: ['se reposer'] },
            { f: ['promène', 'promènes', 'promène', 'promenons', 'promenez', 'promènent'], ru: ['гуляю', 'гуляешь', 'гуляет', 'гуляем', 'гуляете', 'гуляют'], ends: [
              { fr: 'dans le parc le soir', ru: 'в парке вечером' },
              { fr: 'le long de la rivière', ru: 'вдоль реки' },
            ], kw: ['se promener'] },
            { f: ['dépêche', 'dépêches', 'dépêche', 'dépêchons', 'dépêchez', 'dépêchent'], ru: ['тороплюсь', 'торопишься', 'торопится', 'торопимся', 'торопитесь', 'торопятся'], ends: [
              { fr: 'pour arriver à temps', ru: 'чтобы прийти вовремя' },
              { fr: 'chaque matin', ru: 'каждое утро' },
            ], kw: ['se dépêcher'] },
            { f: ['couche', 'couches', 'couche', 'couchons', 'couchez', 'couchent'], ru: ['ложусь спать', 'ложишься спать', 'ложится спать', 'ложимся спать', 'ложитесь спать', 'ложатся спать'], ends: [
              { fr: 'avant minuit', ru: 'до полуночи' },
              { fr: 'tard avant les examens', ru: 'поздно перед экзаменами' },
            ], kw: ['se coucher'] },
          ];
          const s = pick(subjs);
          const v = pick(verbs);
          const e = pick(v.ends.filter((x) => !x.skip));
          return {
            ru: `${s.ru} ${v.ru[s.idx]} ${e.ru}.`,
            answer: `${s.fr} ${s.p} ${v.f[s.idx]} ${e.fr}.`,
            distractors: ['se', 'te', 'suis', 'ont'],
            keywords: v.kw,
            explain: 'A2 L1: возвратные глаголы в présent (me/te/se/nous/vous/se + глагол); обрати внимание на è в je me lève / promène.',
          };
        }
        // Passé composé combinatorial with exact gender/number agreement!
        const subjsPc = [
          { fr: 'Je me suis', g: 'm', ru: 'Я', ruG: 'm' },
          { fr: "Il s'est", g: 'm', ru: 'Он', ruG: 'm' },
          { fr: "Elle s'est", g: 'f', ru: 'Она', ruG: 'f' },
          { fr: 'Nous nous sommes', g: 'mp', ru: 'Мы', ruG: 'p' },
          { fr: 'Ils se sont', g: 'mp', ru: 'Они', ruG: 'p' },
          { fr: 'Elles se sont', g: 'fp', ru: 'Они (девушки)', ruG: 'p' },
        ];
        const verbsPc = [
          { pp: { m: 'promené', f: 'promenée', mp: 'promenés', fp: 'promenées' }, ru: { m: 'погулял', f: 'погуляла', p: 'погуляли' }, endFr: 'dans le parc', endRu: 'в парке', kw: ['se promener', 'parc'] },
          { pp: { m: 'couché', f: 'couchée', mp: 'couchés', fp: 'couchées' }, ru: { m: 'лёг спать', f: 'легла спать', p: 'легли спать' }, endFr: 'très tard', endRu: 'очень поздно', kw: ['se coucher'] },
          { pp: { m: 'réveillé', f: 'réveillée', mp: 'réveillés', fp: 'réveillées' }, ru: { m: 'проснулся', f: 'проснулась', p: 'проснулись' }, endFr: 'à six heures', endRu: 'в шесть часов', kw: ['se réveiller'] },
          { pp: { m: 'reposé', f: 'reposée', mp: 'reposés', fp: 'reposées' }, ru: { m: 'отдохнул', f: 'отдохнула', p: 'отдохнули' }, endFr: 'après le cours', endRu: 'после пары', kw: ['se reposer'] },
          { pp: { m: 'dépêché', f: 'dépêchée', mp: 'dépêchés', fp: 'dépêchées' }, ru: { m: 'поторопился', f: 'поторопилась', p: 'поторопились' }, endFr: 'pour aller à la gare', endRu: 'чтобы пойти на вокзал', kw: ['se dépêcher', 'gare'] },
          { pp: { m: 'habillé', f: 'habillée', mp: 'habillés', fp: 'habillées' }, ru: { m: 'оделся', f: 'оделась', p: 'оделись' }, endFr: 'très vite', endRu: 'очень быстро', kw: ["s'habiller"] },
        ];
        const times = [
          { fr: 'Hier', ru: 'Вчера' },
          { fr: 'Samedi dernier', ru: 'В прошлую субботу' },
          { fr: 'Dimanche', ru: 'В воскресенье' },
        ];
        const s = pick(subjsPc);
        const v = pick(verbsPc);
        const t = pick(times);
        return {
          ru: `${t.ru} ${low(s.ru)} ${v.ru[s.ruG]} ${v.endRu}.`,
          answer: `${t.fr}, ${low(s.fr)} ${v.pp[s.g]} ${v.endFr}.`,
          distractors: ["a", 'avons', 'ont', v.pp.m === v.pp[s.g] ? v.pp.f : v.pp.m],
          keywords: v.kw,
          explain: 'A2 L1: все возвратные глаголы в passé composé спрягаются с ÊTRE, а participe passé согласуется с подлежащим (-e / -s / -es).',
        };
      },
    },
    {
      id: 'fr-a2-1-pc',
      minLesson: 1,
      unit: 'a2-1',
      est: 336,
      label: 'A2 L1 · Passé composé (avoir и être)',
      title: 'A2 L1 · Passé composé: avoir vs être + согласование p.p.',
      explain: 'Глаголы движения (aller, venir, partir, arriver, sortir, entrer, rester, tomber, rentrer) спрягаются с être и согласуют p.p. с подлежащим! Boire → bu, suivre → suivi, voir → vu, lire → lu, prendre → pris.',
      gen() {
        const times = [
          { fr: 'Hier', ru: 'Вчера' },
          { fr: 'La semaine dernière', ru: 'На прошлой неделе' },
          { fr: 'Samedi dernier', ru: 'В прошлую субботу' },
          { fr: 'Ce matin', ru: 'Сегодня утром' },
        ];
        const t = pick(times);
        if (Math.random() < 0.5) {
          // Être verbs with exact agreement
          const subjs = [
            { fr: 'je suis', g: 'm', ru: 'я', ruG: 'm' },
            { fr: 'mon frère est', g: 'm', ru: 'мой брат', ruG: 'm' },
            { fr: 'ma sœur est', g: 'f', ru: 'моя сестра', ruG: 'f' },
            { fr: 'elle est', g: 'f', ru: 'она', ruG: 'f' },
            { fr: 'nous sommes', g: 'mp', ru: 'мы', ruG: 'p' },
            { fr: 'mes amis sont', g: 'mp', ru: 'мои друзья', ruG: 'p' },
            { fr: 'mes amies sont', g: 'fp', ru: 'мои подруги', ruG: 'p' },
          ];
          const verbs = [
            { pp: { m: 'parti', f: 'partie', mp: 'partis', fp: 'parties' }, ru: { m: 'уехал', f: 'уехала', p: 'уехали' }, endFr: 'à Lyon', endRu: 'в Лион', kw: ['partir'] },
            { pp: { m: 'arrivé', f: 'arrivée', mp: 'arrivés', fp: 'arrivées' }, ru: { m: 'пришёл', f: 'пришла', p: 'пришли' }, endFr: "à l'examen à l'heure", endRu: 'на экзамен вовремя', kw: ['arriver', 'examen'] },
            { pp: { m: 'resté', f: 'restée', mp: 'restés', fp: 'restées' }, ru: { m: 'остался', f: 'осталась', p: 'остались' }, endFr: 'à la maison', endRu: 'дома', kw: ['rester', 'maison'] },
            { pp: { m: 'sorti', f: 'sortie', mp: 'sortis', fp: 'sorties' }, ru: { m: 'вышел', f: 'вышла', p: 'вышли' }, endFr: 'sans parapluie', endRu: 'без зонта', kw: ['sortir'] },
            { pp: { m: 'allé', f: 'allée', mp: 'allés', fp: 'allées' }, ru: { m: 'сходил', f: 'сходила', p: 'сходили' }, endFr: 'à la bibliothèque', endRu: 'в библиотеку', kw: ['aller', 'bibliothèque'] },
            { pp: { m: 'rentré', f: 'rentrée', mp: 'rentrés', fp: 'rentrées' }, ru: { m: 'вернулся домой', f: 'вернулась домой', p: 'вернулись домой' }, endFr: 'vers vingt heures', endRu: 'около восьми вечера', kw: ['rentrer'] },
          ];
          const s = pick(subjs);
          const v = pick(verbs);
          return {
            ru: `${t.ru} ${s.ru} ${v.ru[s.ruG]} ${v.endRu}.`,
            answer: `${t.fr}, ${s.fr} ${v.pp[s.g]} ${v.endFr}.`,
            distractors: ['a', 'avons', 'ont', v.pp.m === v.pp[s.g] ? v.pp.f : v.pp.m],
            keywords: v.kw,
            explain: 'A2 L1: глаголы движения/состояния (aller, partir, arriver, rester, sortir, rentrer) в PC спрягаются с ÊTRE + согласование p.p. (-e / -s / -es).',
          };
        }
        // Avoir verbs (boire, suivre, voir, lire, prendre, écrire, acheter)
        const subjsA = [
          { fr: "j'ai", ru: 'я', ruG: 'm' },
          { fr: 'tu as', ru: 'ты', ruG: 'm' },
          { fr: 'il a', ru: 'он', ruG: 'm' },
          { fr: 'elle a', ru: 'она', ruG: 'f' },
          { fr: 'nous avons', ru: 'мы', ruG: 'p' },
          { fr: 'ils ont', ru: 'они', ruG: 'p' },
        ];
        const verbsA = [
          { pp: 'bu', ru: { m: 'выпил', f: 'выпила', p: 'выпили' }, endFr: 'une tasse de café', endRu: 'чашку кофе', d: ['suis', 'boit', 'du'], kw: ['boire', 'café'] },
          { pp: 'suivi', ru: { m: 'прошёл', f: 'прошла', p: 'прошли' }, endFr: 'un cours de français', endRu: 'курс французского', d: ['sommes', 'suivre', 'du'], kw: ['suivre', 'cours'] },
          { pp: 'vu', ru: { m: 'посмотрел', f: 'посмотрела', p: 'посмотрели' }, endFr: 'un film intéressant', endRu: 'интересный фильм', d: ['est', 'voir', 'vues'], kw: ['voir', 'film'] },
          { pp: 'lu', ru: { m: 'прочитал', f: 'прочитала', p: 'прочитали' }, endFr: 'un article sur Paris', endRu: 'статью о Париже', d: ['est', 'lire', 'lues'], kw: ['lire', 'article'] },
          { pp: 'pris', ru: { m: 'взял', f: 'взяла', p: 'взяли' }, endFr: 'le métro pour aller au centre', endRu: 'метро, чтобы поехать в центр', d: ['est', 'prendre', 'du'], kw: ['prendre', 'métro'] },
          { pp: 'écrit', ru: { m: 'написал', f: 'написала', p: 'написали' }, endFr: 'une lettre à la famille', endRu: 'письмо семье', d: ['est', 'écrire', 'écrits'], kw: ['écrire', 'lettre'] },
          { pp: 'acheté', ru: { m: 'купил', f: 'купила', p: 'купили' }, endFr: 'un nouveau dictionnaire', endRu: 'новый словарь', d: ['est', 'nouvel', 'acheter'], kw: ['acheter', 'dictionnaire'] },
        ];
        const s = pick(subjsA);
        const v = pick(verbsA);
        return {
          ru: `${t.ru} ${s.ru} ${v.ru[s.ruG]} ${v.endRu}.`,
          answer: `${t.fr}, ${s.fr} ${v.pp} ${v.endFr}.`,
          distractors: v.d,
          keywords: v.kw,
          explain: 'A2 L1: вспомогательный avoir + неправильные participe passé: boire → bu, suivre → suivi, voir → vu, lire → lu, prendre → pris, écrire → écrit.',
        };
      },
    },

    // --- A2 L2 (minLesson: 2) ---
    {
      id: 'fr-a2-2-partitif',
      minLesson: 2,
      unit: 'a2-2',
      est: 98,
      label: 'A2 L2 · Partitif & количество',
      title: 'A2 L2 · Частичный артикль (du, de la, de l\', des) и слова количества',
      explain: 'Неисчисляемая еда/напитки: du (м.р.), de la (ж.р.), de l\' (гласная), des (мн.ч.). После beaucoup / un peu / trop / assez / un kilo — только DE без артикля!',
      gen() {
        const subjs = [
          { fr: 'Je prends', ru: 'Я беру' },
          { fr: 'Tu achètes', ru: 'Ты покупаешь' },
          { fr: 'Il mange', ru: 'Он ест' },
          { fr: 'Elle veut', ru: 'Она хочет' },
          { fr: 'Nous achetons', ru: 'Мы покупаем' },
          { fr: 'Vous prenez', ru: 'Вы берёте' },
          { fr: 'Ils commandent', ru: 'Они заказывают' },
        ];
        const foods = [
          { fr: 'du fromage et du pain', ru: 'сыр и хлеб', d: ['de', 'le', 'de la'], kw: ['fromage', 'pain'] },
          { fr: 'de la salade et du poisson', ru: 'салат и рыбу', d: ['du', 'la', 'de'], kw: ['salade', 'poisson'] },
          { fr: "de l'eau minérale", ru: 'минеральную воду', d: ['de la', 'du', 'de'], kw: ['eau'] },
          { fr: 'des légumes frais', ru: 'свежие овощи', d: ['les', 'de', 'du'], kw: ['légumes'] },
          { fr: 'du poulet avec du riz', ru: 'курицу с рисом', d: ['de la', 'le', 'de'], kw: ['poulet', 'riz'] },
          { fr: 'de la viande et des pommes de terre', ru: 'мясо и картофель', d: ['du', 'les', 'de'], kw: ['viande'] },
          { fr: 'de la confiture pour le petit déjeuner', ru: 'варенье на завтрак', d: ['du', 'la', 'de'], kw: ['confiture'] },
          { fr: 'du thé vert avec du citron', ru: 'зелёный чай с лимоном', d: ['de la', 'de', 'le'], kw: ['thé', 'citron'] },
          { fr: 'beaucoup de fruits', ru: 'много фруктов', d: ['des', 'du', 'les'], kw: ['beaucoup', 'fruits'] },
          { fr: 'un peu de sucre', ru: 'немного сахара', d: ['du', 'des', 'le'], kw: ['sucre'] },
          { fr: 'un kilo de tomates', ru: 'килограмм помидоров', d: ['des', 'les', 'du'], kw: ['kilo', 'tomates'] },
          { fr: 'une bouteille de lait', ru: 'бутылку молока', d: ['du', 'le', 'des'], kw: ['lait'] },
          { fr: 'assez de pain pour le dîner', ru: 'достаточно хлеба на ужин', d: ['du', 'le', 'des'], kw: ['assez', 'pain'] },
          { fr: "trop d'huile dans la salade", ru: 'слишком много масла в салате', d: ["de l'", 'du', 'la'], kw: ['trop', 'huile'] },
        ];
        const s = pick(subjs);
        const f = pick(foods);
        return {
          ru: `${s.ru} ${f.ru}.`,
          answer: `${s.fr} ${f.fr}.`,
          distractors: f.d,
          keywords: f.kw,
          explain: 'A2 L2: частичный артикль du / de la / de l\' / des; после слов количества (beaucoup, un peu, trop, assez, un kilo, une bouteille) — строго DE (d\') без артикля!',
        };
      },
    },
    {
      id: 'fr-a2-2-neg-de',
      minLesson: 2,
      unit: 'a2-2',
      est: 81,
      label: 'A2 L2 · Отрицание ne…pas de / plus / jamais',
      title: 'A2 L2 · Отрицания ne…pas de, ne…plus de, ne…jamais de, rien, personne',
      explain: 'При отрицании (ne…pas, ne…plus, ne…jamais) неопределённый и частичный артикли заменяются на DE (d\' перед гласной)! Исключение — глагол être.',
      gen() {
        if (Math.random() < 0.72) {
          const subjs = [
            { fr: 'Je', idx: 0, ru: 'Я' },
            { fr: 'Il', idx: 1, ru: 'Он' },
            { fr: 'Elle', idx: 1, ru: 'Она' },
            { fr: 'Nous', idx: 2, ru: 'Мы' },
            { fr: 'Ils', idx: 3, ru: 'Они' },
          ];
          const negs = [
            { fr: 'pas', ru: 'не' },
            { fr: 'plus', ru: 'больше не' },
            { fr: 'jamais', ru: 'никогда не' },
          ];
          const vObjs = [
            { f: ['bois', 'boit', 'buvons', 'boivent'], ru: ['пью', 'пьёт', 'пьём', 'пьют'], o: 'de café le soir', oRu: 'кофе вечером', d: ['du', 'le'], kw: ['boire', 'café'] },
            { f: ['mange', 'mange', 'mangeons', 'mangent'], ru: ['ем', 'ест', 'едим', 'едят'], o: 'de viande', oRu: 'мясо', d: ['de la', 'la'], kw: ['manger', 'viande'] },
            { f: ['prends', 'prend', 'prenons', 'prennent'], ru: ['беру', 'берёт', 'берём', 'берут'], o: 'de dessert', oRu: 'десерт', d: ['un', 'du'], kw: ['prendre', 'dessert'] },
            { f: ['achète', 'achète', 'achetons', 'achètent'], ru: ['покупаю', 'покупает', 'покупаем', 'покупают'], o: "d'alcool", oRu: 'алкоголь', d: ["de l'", 'du'], kw: ['acheter'] },
            { f: ['mets', 'met', 'mettons', 'mettent'], ru: ['кладу', 'кладёт', 'кладём', 'кладут'], o: 'de sucre dans le thé', oRu: 'сахар в чай', d: ['du', 'le'], kw: ['sucre', 'thé'] },
          ];
          const s = pick(subjs);
          const ng = pick(negs);
          const v = pick(vObjs);
          const vf = v.f[s.idx];
          return {
            ru: `${s.ru} ${ng.ru} ${v.ru[s.idx]} ${v.oRu}.`,
            answer: `${s.fr} ${elideFr('ne', vf)} ${ng.fr} ${v.o}.`,
            distractors: [...v.d, 'des'],
            keywords: v.kw,
            explain: 'A2 L2: ne…pas / ne…plus / ne…jamais + DE (d\') вместо un/une/du/de la/des.',
          };
        }
        const extras = [
          { ru: 'У нас нет времени ждать.', ans: "Nous n'avons pas de temps pour attendre.", d: ['du', 'le', 'ne'], kw: ['temps', 'attendre'] },
          { ru: 'Он ничего не купил в магазине.', ans: "Il n'a rien acheté au magasin.", d: ['pas', 'ne', 'à le'], kw: ['rien', 'acheter'] },
          { ru: 'Я никого не встретил на улице.', ans: "Je n'ai rencontré personne dans la rue.", d: ['pas', 'rien', 'ne'], kw: ['personne', 'rencontrer'] },
          { ru: 'Я сажусь за работу сразу после обеда.', ans: 'Je me mets à travailler juste après le déjeuner.', d: ['de', 'au', 'en'], kw: ['se mettre à', 'déjeuner'] },
          { ru: 'Это зависит от дня недели.', ans: 'Ça dépend du jour de la semaine.', d: ['de', 'au', 'le'], kw: ['dépendre'] },
          { ru: 'Мы никого не знаем в этом квартале.', ans: 'Nous ne connaissons personne dans ce quartier.', d: ['pas', 'rien', 'cet'], kw: ['personne', 'quartier'] },
        ];
        const it = pick(extras);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L2: отрицания ne…pas de, ne…rien (перед p.p.), ne…personne (после p.p.), а также глаголы -endre/-ondre и se mettre à.' };
      },
    },

    // --- A2 L3 (minLesson: 3) ---
    {
      id: 'fr-a2-3-imp-pc',
      minLesson: 3,
      unit: 'a2-3',
      est: 55,
      label: 'A2 L3 · Imparfait vs Passé composé',
      title: 'A2 L3 · Выбор времени: Imparfait (фон/привычка) vs Passé composé (событие)',
      explain: 'Imparfait — описание, фон, погода, длительное состояние, повторявшаяся привычка. Passé composé — конкретное, внезапное или завершённое действие.',
      gen() {
        if (Math.random() < 0.65) {
          const bgs = [
            { fr: 'Il pleuvait', ru: 'Шёл дождь', d: ['a plu'] },
            { fr: 'Il faisait beau', ru: 'Было солнечно', d: ['a fait'] },
            { fr: 'Il faisait froid', ru: 'Было холодно', d: ['a fait'] },
            { fr: 'Je lisais le journal', ru: 'Я читал газету', d: ["j'ai lu"] },
            { fr: 'Il travaillait dans sa chambre', ru: 'Он работал в своей комнате', d: ['a travaillé'] },
            { fr: 'Nous préparions le dîner', ru: 'Мы готовили ужин', d: ['avons préparé'] },
            { fr: 'Elle regardait un film', ru: 'Она смотрела фильм', d: ['a regardé'] },
            { fr: 'Nous marchions dans le parc', ru: 'Мы гуляли по парку', d: ['avons marché'] },
          ];
          const events = [
            { fr: 'le téléphone a sonné', ru: 'зазвонил телефон', d: ['sonnait'], kw: ['téléphone', 'sonner'] },
            { fr: 'mon ami est arrivé', ru: 'пришёл мой друг', d: ['arrivait'], kw: ['ami', 'arriver'] },
            { fr: 'nous sommes sortis de la maison', ru: 'мы вышли из дома', d: ['sortions'], kw: ['sortir', 'maison'] },
            { fr: 'la lumière s\'est éteinte', ru: 'погас свет', d: ['s\'éteignait'], kw: ['lumière'] },
            { fr: 'ma sœur a téléphoné', ru: 'позвонила моя сестра', d: ['téléphonait'], kw: ['sœur', 'téléphoner'] },
            { fr: 'un voisin a frappé à la porte', ru: 'сосед постучал в дверь', d: ['frappait'], kw: ['voisin', 'porte'] },
          ];
          const bg = pick(bgs);
          const ev = pick(events);
          return {
            ru: `${bg.ru}, когда ${ev.ru}.`,
            answer: `${bg.fr} quand ${ev.fr}.`,
            distractors: [...bg.d, ...ev.d, 'que'],
            keywords: ev.kw,
            explain: 'A2 L3: фоновое/длительное действие = Imparfait; внезапное событие, прервавшее фон (quand) = Passé composé.',
          };
        }
        const habits = [
          { ru: 'Когда я был маленьким, я жил у бабушки.', ans: "Quand j'étais petit, j'habitais chez ma grand-mère.", d: ["j'ai été", "j'ai habité", 'à'], kw: ['habiter', 'grand-mère'] },
          { ru: 'Раньше мы часто получали письма от семьи.', ans: 'Avant, nous recevions souvent des lettres de la famille.', d: ['avons reçu', 'reçois', 'les'], kw: ['recevoir', 'lettres'] },
          { ru: 'Раньше они жили в маленькой деревне.', ans: 'Avant, ils vivaient dans un petit village.', d: ['ont vécu', 'vivent', 'au'], kw: ['vivre', 'village'] },
          { ru: 'Каждое лето мы ездили на море.', ans: 'Chaque été, nous allions à la mer.', d: ['sommes allés', 'allons', 'au'], kw: ['été', 'mer'] },
          { ru: 'Внезапно он увидел своего старого друга.', ans: 'Soudain, il a vu son vieil ami.', d: ['voyait', 'vieux', 'est'], kw: ['soudain', 'voir', 'ami'] },
          { ru: 'Раньше она всегда выбирала спокойные книги.', ans: 'Avant, elle choisissait toujours des livres calmes.', d: ['a choisi', 'choisit', 'les'], kw: ['choisir', 'livres'] },
          { ru: 'В детстве мы каждое воскресенье навещали дедушку.', ans: 'Dans mon enfance, nous rendions visite à mon grand-père chaque dimanche.', d: ['avons rendu', 'au', 'le'], kw: ['rendre visite', 'dimanche'] },
        ];
        const it = pick(habits);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L3: повторявшаяся привычка в прошлом (avant, chaque été, souvent) → Imparfait; внезапное событие (soudain) → Passé composé.' };
      },
    },
    {
      id: 'fr-a2-3-imperatif',
      minLesson: 3,
      unit: 'a2-3',
      est: 30,
      label: 'A2 L3 · Impératif (повелительное)',
      title: 'A2 L3 · Повелительное наклонение (вкл. возвратные и отрицание)',
      explain: 'У глаголов 1-й группы (-er) в форме tu в impératif конечная -s отпадает (Parle !). У возвратных: Repose-toi ! / Ne te repose pas !',
      gen() {
        const mode = Math.random();
        if (mode < 0.5) {
          const refl = [
            { posTu: 'Repose-toi', negTu: 'Ne te repose pas', posV: 'Reposez-vous', negV: 'Ne vous reposez pas', ruPosTu: 'Отдохни', ruNegTu: 'Не отдыхай', ruPosV: 'Отдохните', ruNegV: 'Не отдыхайте', tailFr: 'un peu après le travail', tailRu: 'немного после работы', kw: ['se reposer'] },
            { posTu: 'Dépêche-toi', negTu: 'Ne te dépêche pas', posV: 'Dépêchez-vous', negV: 'Ne vous dépêchez pas', ruPosTu: 'Поторопись', ruNegTu: 'Не торопись', ruPosV: 'Поторопитесь', ruNegV: 'Не торопитесь', tailFr: 'le matin', tailRu: 'утром', kw: ['se dépêcher'] },
            { posTu: 'Lève-toi', negTu: 'Ne te lève pas', posV: 'Levez-vous', negV: 'Ne vous levez pas', ruPosTu: 'Встань', ruNegTu: 'Не вставай', ruPosV: 'Вставайте', ruNegV: 'Не вставайте', tailFr: 'tôt demain', tailRu: 'рано завтра', kw: ['se lever'] },
            { posTu: 'Couche-toi', negTu: 'Ne te couche pas', posV: 'Couchez-vous', negV: 'Ne vous couchez pas', ruPosTu: 'Ложись спать', ruNegTu: 'Не ложись спать', ruPosV: 'Ложитесь спать', ruNegV: 'Не ложитесь спать', tailFr: 'avant minuit', tailRu: 'до полуночи', kw: ['se coucher'] },
            { posTu: 'Promène-toi', negTu: 'Ne te promène pas', posV: 'Promenez-vous', negV: 'Ne vous promenez pas', ruPosTu: 'Погуляй', ruNegTu: 'Не гуляй', ruPosV: 'Погуляйте', ruNegV: 'Не гуляйте', tailFr: 'dans le parc', tailRu: 'в парке', kw: ['se promener'] },
          ];
          const r = pick(refl);
          const variants = [
            { ru: `${r.ruPosTu} ${r.tailRu}!`, ans: `${r.posTu} ${r.tailFr} !`, d: ['Te', 'Ne', 'vous'] },
            { ru: `${r.ruNegTu} ${r.tailRu}!`, ans: `${r.negTu} ${r.tailFr} !`, d: ['toi', 'se', 'vous'] },
            { ru: `${r.ruPosV} ${r.tailRu}!`, ans: `${r.posV} ${r.tailFr} !`, d: ['Vous', 'toi', 'se'] },
            { ru: `${r.ruNegV} ${r.tailRu}!`, ans: `${r.negV} ${r.tailFr} !`, d: ['toi', 'te', 'se'] },
          ];
          const v = pick(variants);
          return { ru: v.ru, answer: v.ans, distractors: v.d, keywords: r.kw, explain: 'A2 L3: в утвердительном impératif возвратное местоимение после дефиса (-toi / -nous / -vous); в отрицательном — перед глаголом (Ne te … pas !).' };
        }
        const items = [
          { ru: 'Позвони мне сегодня вечером!', ans: 'Appelle-moi ce soir !', d: ['Appelles-moi', 'Me appelle', 'cet'], kw: ['appeler', 'soir'] },
          { ru: 'Не опаздывай на лекцию!', ans: 'Ne sois pas en retard au cours !', d: ["N'es", 'à', 'dans'], kw: ['être', 'retard'] },
          { ru: 'Не волнуйся, всё хорошо!', ans: "Ne t'inquiète pas, tout va bien !", d: ["t'inquiètes", 'inquiète-toi', 'ne'], kw: ["s'inquiéter"] },
          { ru: 'Выберите удобную дату!', ans: 'Choisissez une date pratique !', d: ['Choisis', 'Choissez', 'un'], kw: ['choisir', 'date'] },
          { ru: 'Не забудь ключи от квартиры!', ans: "N'oublie pas les clés de l'appartement !", d: ['oublies', 'des', 'du'], kw: ['oublier', 'clé'] },
          { ru: 'Слушайте преподавателя внимательно!', ans: 'Écoutez le professeur attentivement !', d: ['Écoute', 'au', 'attentif'], kw: ['écouter', 'professeur'] },
          { ru: 'Закончи эту работу до вечера!', ans: 'Finis ce travail avant le soir !', d: ['Fini', 'cet', 'après'], kw: ['finir', 'travail'] },
          { ru: 'Будьте терпеливы и вежливы!', ans: 'Soyez patients et polis !', d: ['Êtes', 'Sois', 'patient'], kw: ['être', 'poli'] },
          { ru: 'Имей терпение!', ans: 'Aie de la patience !', d: ['As', 'Aies', 'du'], kw: ['avoir', 'patience'] },
          { ru: 'Поговори с ним завтра!', ans: 'Parle-lui demain !', d: ['Parles-lui', 'Lui parle', 'le'], kw: ['parler'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L3: у -er в tu отпадает -s (Appelle ! Oublie ! Parle !); особые формы: être → sois/soyons/soyez; avoir → aie/ayons/ayez.' };
      },
    },

    // --- A2 L4 (minLesson: 4) ---
    {
      id: 'fr-a2-4-adj',
      minLesson: 4,
      unit: 'a2-4',
      est: 43,
      label: 'A2 L4 · Женский род и формы прилагательных',
      title: 'A2 L4 · Женский род прилагательных и особые формы (beau/nouveau/vieux)',
      explain: '-eux → -euse, -if → -ive, -el → -elle, -er → -ère, -f → -ve. Перед м.р. на гласную/h: beau → bel, nouveau → nouvel, vieux → vieil!',
      gen() {
        if (Math.random() < 0.5) {
          const people = [
            { fr: 'Mon frère est', ru: 'Мой брат', g: 'm' },
            { fr: 'Ma sœur est', ru: 'Моя сестра', g: 'f' },
            { fr: 'Mon voisin est', ru: 'Мой сосед', g: 'm' },
            { fr: 'Ma voisine est', ru: 'Моя соседка', g: 'f' },
            { fr: 'Ce professeur est', ru: 'Этот преподаватель', g: 'm' },
            { fr: 'Cette étudiante est', ru: 'Эта студентка', g: 'f' },
          ];
          const adjs = [
            { m: 'sérieux et attentif', f: 'sérieuse et attentive', ruM: 'серьёзный и внимательный', ruF: 'серьёзная и внимательная', kw: ['sérieux', 'attentif'] },
            { m: 'sportif et actif', f: 'sportive et active', ruM: 'спортивный и активный', ruF: 'спортивная и активная', kw: ['sportif', 'actif'] },
            { m: 'gentil et généreux', f: 'gentille et généreuse', ruM: 'любезный и щедрый', ruF: 'любезная и щедрая', kw: ['gentil', 'généreux'] },
            { m: 'curieux et ouvert', f: 'curieuse et ouverte', ruM: 'любознательный и открытый', ruF: 'любознательная и открытая', kw: ['curieux', 'ouvert'] },
            { m: 'heureux et tranquille', f: 'heureuse et tranquille', ruM: 'счастливый и спокойный', ruF: 'счастливая и спокойная', kw: ['heureux', 'tranquille'] },
            { m: 'travailleur et fier', f: 'travailleuse et fière', ruM: 'трудолюбивый и гордый', ruF: 'трудолюбивая и гордая', kw: ['travailleur', 'fier'] },
          ];
          const p = pick(people);
          const a = pick(adjs);
          return {
            ru: `${p.ru} — ${p.g === 'f' ? a.ruF : a.ruM}.`,
            answer: `${p.fr} ${a[p.g]}.`,
            distractors: [p.g === 'f' ? a.m.split(' ')[0] : a.f.split(' ')[0], 'sont', 'un'],
            keywords: a.kw,
            explain: 'A2 L4: согласование прилагательных в женском роде: -eux→-euse, -if→-ive, -il→-ille, -eur→-euse, -er→-ère.',
          };
        }
        const specials = [
          { ru: 'Он живёт в красивой старой квартире.', ans: 'Il habite dans un bel appartement ancien.', d: ['beau', 'belle', 'au'], kw: ['beau', 'appartement'] },
          { ru: 'Это мой старый друг из Краснодара.', ans: "C'est mon vieil ami de Krasnodar.", d: ['vieux', 'vieille', 'ma'], kw: ['vieux', 'ami'] },
          { ru: 'Они переезжают в новое здание.', ans: 'Ils déménagent dans un nouvel immeuble.', d: ['nouveau', 'nouvelle', 'au'], kw: ['nouveau', 'immeuble'] },
          { ru: 'У меня есть новый синий свитер.', ans: "J'ai un nouveau pull bleu.", d: ['nouvel', 'bleue', 'une'], kw: ['nouveau', 'pull'] },
          { ru: 'Она носит красивое белое платье.', ans: 'Elle porte une belle robe blanche.', d: ['beau', 'blanc', 'un'], kw: ['robe', 'blanc'] },
          { ru: 'Мы остановились в старом отеле.', ans: 'Nous sommes restés dans un vieil hôtel.', d: ['vieux', 'vieille', 'avons'], kw: ['vieux', 'hôtel'] },
          { ru: 'Это отличный новый компьютер.', ans: "C'est un excellent nouvel ordinateur.", d: ['nouveau', 'nouvelle', 'une'], kw: ['nouveau', 'ordinateur'] },
        ];
        const it = pick(specials);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L4: перед сущ. м.р. на гласную/немое h: beau → bel (un bel appartement), nouveau → nouvel (un nouvel immeuble), vieux → vieil (un vieil ami, un vieil hôtel).' };
      },
    },
    {
      id: 'fr-a2-4-comp',
      minLesson: 4,
      unit: 'a2-4',
      est: 44,
      label: 'A2 L4 · Сравнения (plus/moins/aussi…que)',
      title: 'A2 L4 · Степени сравнения прилагательных, наречий и существительных',
      explain: 'plus / moins / aussi + прил./нареч. + que. Исключения: bon → meilleur(e), bien → mieux! С существительным: plus de / autant de … que. Превосходная степень + DE.',
      gen() {
        const pairs = [
          { aFr: 'Cette chambre', bFr: "l'ancienne", aRu: 'Эта комната', bRu: 'старая', g: 'f', adjs: [
            { m: 'lumineux', f: 'lumineuse', ru: 'светлее', eq: 'такая же светлая', less: 'менее светлая' },
            { m: 'grand', f: 'grande', ru: 'больше', eq: 'такая же большая', less: 'меньше' },
            { m: 'confortable', f: 'confortable', ru: 'удобнее', eq: 'такая же удобная', less: 'менее удобная' },
          ], kw: ['chambre', 'lumineux'] },
          { aFr: 'Le métro', bFr: 'le bus', aRu: 'Метро', bRu: 'автобус', g: 'm', adjs: [
            { m: 'rapide', f: 'rapide', ru: 'быстрее', eq: 'такое же быстрое', less: 'медленнее' },
            { m: 'pratique', f: 'pratique', ru: 'удобнее', eq: 'такое же удобное', less: 'менее удобное' },
            { m: 'cher', f: 'chère', ru: 'дороже', eq: 'такое же дорогое', less: 'дешевле' },
          ], kw: ['métro', 'bus', 'rapide'] },
          { aFr: 'Cet appartement', bFr: 'notre ancien logement', aRu: 'Эта квартира', bRu: 'наше старое жильё', g: 'm', adjs: [
            { m: 'calme', f: 'calme', ru: 'тише', eq: 'такая же тихая', less: 'менее тихая' },
            { m: 'moderne', f: 'moderne', ru: 'современнее', eq: 'такая же современная', less: 'менее современная' },
            { m: 'spacieux', f: 'spacieuse', ru: 'просторнее', eq: 'такая же просторная', less: 'менее просторная' },
          ], kw: ['appartement', 'calme'] },
          { aFr: 'Ma sœur', bFr: 'mon frère', aRu: 'Моя сестра', bRu: 'мой брат', g: 'f', adjs: [
            { m: 'sérieux', f: 'sérieuse', ru: 'серьёзнее', eq: 'такая же серьёзная', less: 'менее серьёзная' },
            { m: 'patient', f: 'patiente', ru: 'терпеливее', eq: 'такая же терпеливая', less: 'менее терпеливая' },
            { m: 'sportif', f: 'sportive', ru: 'спортивнее', eq: 'такая же спортивная', less: 'менее спортивная' },
          ], kw: ['sœur', 'frère'] },
        ];
        if (Math.random() < 0.65) {
          const p = pick(pairs);
          const a = pick(p.adjs);
          const deg = pick(['plus', 'aussi', 'moins']);
          const ruCmp = deg === 'plus' ? `${a.ru}, чем` : deg === 'aussi' ? `${a.eq}, как и` : `${a.less}, чем`;
          return {
            ru: `${p.aRu} ${ruCmp} ${p.bRu}.`,
            answer: `${p.aFr} est ${deg} ${a[p.g]} que ${p.bFr}.`,
            distractors: [deg === 'aussi' ? 'autant' : 'aussi', 'de', p.g === 'f' ? a.m : a.f],
            keywords: p.kw,
            explain: 'A2 L4: plus / moins / aussi + прилагательное (согласуется!) + que. Для равенства с прилагательным — aussi (НЕ autant!).',
          };
        }
        const specials = [
          { ru: 'Он говорит по-французски лучше, чем раньше.', ans: "Il parle français mieux qu'avant.", d: ['meilleur', 'plus bien', 'que'], kw: ['parler', 'mieux'] },
          { ru: 'Этот фильм лучше, чем книга.', ans: 'Ce film est meilleur que le livre.', d: ['mieux', 'plus bon', 'de'], kw: ['film', 'meilleur'] },
          { ru: 'Эта квартира лучше, чем старая.', ans: "Cet appartement est meilleur que l'ancien.", d: ['mieux', 'meilleure', 'Ce'], kw: ['appartement', 'meilleur'] },
          { ru: 'Кухня здесь лучше, чем в общежитии.', ans: 'La cuisine ici est meilleure que dans la résidence.', d: ['meilleur', 'mieux', 'de'], kw: ['cuisine', 'meilleur'] },
          { ru: 'Это самый тихий квартал в городе.', ans: "C'est le quartier le plus calme de la ville.", d: ['plus', 'dans', 'du'], kw: ['quartier', 'calme', 'ville'] },
          { ru: 'Это самая светлая комната в квартире.', ans: "C'est la chambre la plus lumineuse de l'appartement.", d: ['le plus', 'dans', 'lumineux'], kw: ['chambre', 'lumineux'] },
          { ru: 'У него больше книг, чем у меня.', ans: "Il a plus de livres que moi.", d: ['des', 'les', 'autant'], kw: ['plus de', 'livres'] },
          { ru: 'Она работает столько же, сколько её брат.', ans: 'Elle travaille autant que son frère.', d: ['aussi', 'plus', 'de'], kw: ['autant', 'travailler'] },
        ];
        const it = pick(specials);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L4: bon → meilleur(e) (прил.), bien → mieux (нареч.); в превосходной степени после сущ. предлог DE (de la ville); с глаголом — autant que.' };
      },
    },
    {
      id: 'fr-a2-4-adv',
      minLesson: 4,
      unit: 'a2-4',
      est: 52,
      label: 'A2 L4 · Наречия на -ment',
      title: 'A2 L4 · Образование и употребление наречий на -ment',
      explain: 'Наречие образуется от ж.р. прилагательного + -ment (lent → lente → lentement; heureux → heureuse → heureusement). После гласной: vrai → vraiment. -ant/-ent → -amment/-emment.',
      gen() {
        const items = [
          { ru: 'Он легко решил эту задачу.', ans: 'Il a facilement résolu ce problème.', d: ['facile', 'cet', 'est'], kw: ['facilement', 'problème'] },
          { ru: 'К счастью, мой сосед очень спокойный.', ans: 'Heureusement, mon colocataire est très calme.', d: ['Heureux', 'ma', 'calmes'], kw: ['heureusement', 'colocataire'] },
          { ru: 'Она одета очень элегантно.', ans: 'Elle est habillée très élégamment.', d: ['élégante', 'habillé', 'a'], kw: ['habiller', 'élégamment'] },
          { ru: 'Мы действительно хорошо ладим с соседом.', ans: 'Nous nous entendons vraiment bien avec le voisin.', d: ['vrai', 'bon', 'à'], kw: ['vraiment', "s'entendre"] },
          { ru: 'Он говорит медленно, но чётко.', ans: 'Il parle lentement mais clairement.', d: ['lent', 'clair', 'et'], kw: ['lentement', 'clairement'] },
          { ru: 'Она спокойно ответила на все вопросы.', ans: 'Elle a répondu tranquillement à toutes les questions.', d: ['tranquille', 'est', 'de'], kw: ['tranquillement', 'répondre'] },
          { ru: 'Студенты внимательно слушают преподавателя.', ans: 'Les étudiants écoutent attentivement le professeur.', d: ['attentif', 'attentive', 'au'], kw: ['attentivement', 'écouter'] },
          { ru: 'Он вежливо попросил помощи.', ans: "Il a demandé poliment de l'aide.", d: ['poli', 'polie', 'du'], kw: ['poliment', 'demander'] },
          { ru: 'Мы быстро нашли эту улицу.', ans: 'Nous avons rapidement trouvé cette rue.', d: ['rapide', 'ce', 'sommes'], kw: ['rapidement', 'rue'] },
          { ru: 'К сожалению, сегодня идёт дождь.', ans: "Malheureusement, il pleut aujourd'hui.", d: ['Malheureux', 'pleuvait', 'fait'], kw: ['malheureusement', 'pleuvoir'] },
          { ru: 'Она серьёзно готовится к экзамену.', ans: "Elle prépare sérieusement l'examen.", d: ['sérieux', 'sérieuse', 'à'], kw: ['sérieusement', 'examen'] },
          { ru: 'Они свободно говорят по-французски.', ans: 'Ils parlent couramment français.', d: ['courant', 'courante', 'du'], kw: ['couramment', 'parler'] },
        ];
        if (Math.random() < 0.5) {
          const it = pick(items);
          return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L4: наречия на -ment: facile→facilement, heureux→heureusement, vrai→vraiment, lent→lentement, élégant→élégamment, courant→couramment.' };
        }
        // Combinatorial adverb sentences
        const subjs = [
          { fr: 'Je', v: 'travaille', v2: 'parle', ru: 'Я', r1: 'работаю', r2: 'говорю' },
          { fr: 'Il', v: 'travaille', v2: 'parle', ru: 'Он', r1: 'работает', r2: 'говорит' },
          { fr: 'Elle', v: 'travaille', v2: 'parle', ru: 'Она', r1: 'работает', r2: 'говорит' },
          { fr: 'Nous', v: 'travaillons', v2: 'parlons', ru: 'Мы', r1: 'работаем', r2: 'говорим' },
          { fr: 'Vous', v: 'travaillez', v2: 'parlez', ru: 'Вы', r1: 'работаете', r2: 'говорите' },
        ];
        const advs1 = [
          { fr: 'sérieusement', ru: 'серьёзно', d: ['sérieux', 'sérieuse'] },
          { fr: 'calmement', ru: 'спокойно', d: ['calme', 'calmes'] },
          { fr: 'rapidement', ru: 'быстро', d: ['rapide', 'rapides'] },
          { fr: 'régulièrement', ru: 'регулярно', d: ['régulier', 'régulière'] },
        ];
        const advs2 = [
          { fr: 'clairement', ru: 'чётко', d: ['clair', 'claire'] },
          { fr: 'lentement', ru: 'медленно', d: ['lent', 'lente'] },
          { fr: 'poliment', ru: 'вежливо', d: ['poli', 'polie'] },
          { fr: 'franchement', ru: 'откровенно', d: ['franc', 'franche'] },
        ];
        const s = pick(subjs);
        if (Math.random() < 0.5) {
          const a = pick(advs1);
          return { ru: `${s.ru} ${s.r1} ${a.ru} каждый день.`, answer: `${s.fr} ${s.v} ${a.fr} tous les jours.`, distractors: [...a.d, 'tout'], keywords: [a.fr], explain: 'A2 L4: наречие на -ment ставится после простого глагола.' };
        }
        const a = pick(advs2);
        return { ru: `${s.ru} всегда ${s.r2} ${a.ru}.`, answer: `${s.fr} ${s.v2} toujours ${a.fr}.`, distractors: [...a.d, 'jamais'], keywords: [a.fr], explain: 'A2 L4: наречия на -ment образуются от формы женского рода прилагательного (или основы на гласную: poli → poliment).' };
      },
    },

    // --- A2 L5 (minLesson: 5 — CURRENT HOT LESSON!) ---
    {
      id: 'fr-a2-5-rel',
      minLesson: 5,
      unit: 'a2-5',
      est: 112,
      label: 'A2 L5 · Относительные qui / que',
      title: 'A2 L5 · Относительные местоимения QUI (подлежащее) и QUE (прямое дополнение)',
      explain: 'QUI — подлежащее (сразу после него идёт глагол, никогда не сокращается!). QUE (qu\' перед гласной) — прямое дополнение (после него идёт подлежащее; в PC p.p. согласуется!).',
      gen() {
        if (Math.random() < 0.5) {
          // QUI combinatorial
          const nouns = [
            { fr: "L'appartement", ru: 'Квартира', g: 'm', verbs: [
              { fr: 'donne sur le parc', ru: 'выходит на парк', kw: ['donner sur', 'parc'] },
              { fr: 'se trouve près du métro', ru: 'находится рядом с метро', kw: ['métro'] },
              { fr: 'appartient à mes parents', ru: 'принадлежит моим родителям', kw: ['appartenir'] },
            ], endFr: ['est très lumineux', 'est très calme', 'coûte cher'], endRu: ['очень светлая', 'очень тихая', 'стоит дорого'] },
            { fr: 'La chambre', ru: 'Комната', g: 'f', verbs: [
              { fr: 'donne sur le jardin', ru: 'выходит в сад', kw: ['donner sur', 'jardin'] },
              { fr: 'se trouve au troisième étage', ru: 'находится на третьем этаже', kw: ['étage'] },
            ], endFr: ['est très lumineuse', 'est très confortable', 'est petite mais calme'], endRu: ['очень светлая', 'очень удобная', 'маленькая, но тихая'] },
            { fr: 'Le voisin', ru: 'Сосед', g: 'm', verbs: [
              { fr: 'habite au troisième étage', ru: 'живёт на третьем этаже', kw: ['voisin', 'étage'] },
              { fr: 'aide Marco à déménager', ru: 'помогает Марко переезжать', kw: ['aider', 'déménager'] },
              { fr: 'travaille près de chez nous', ru: 'работает рядом с нами', kw: ['travailler'] },
            ], endFr: ['est très gentil', 'est toujours calme', 'parle bien français'], endRu: ['очень любезный', 'всегда спокойный', 'хорошо говорит по-французски'] },
            { fr: 'Les amis', ru: 'Друзья', g: 'mp', verbs: [
              { fr: 'ont aidé Marco à déménager', ru: 'помогли Марко переехать', kw: ['aider', 'déménager'] },
              { fr: 'habitent à la résidence', ru: 'живут в общежитии', kw: ['résidence', 'habiter'] },
            ], endFr: ['sont très sympathiques', 'sont fatigués mais contents'], endRu: ['очень симпатичные', 'устали, но довольны'] },
          ];
          const n = pick(nouns);
          const v = pick(n.verbs);
          const ei = Math.floor(Math.random() * n.endFr.length);
          return {
            ru: `${n.ru}, ${n.g === 'mp' ? 'которые' : n.ru.endsWith('а') ? 'которая' : 'который'} ${v.ru}, ${n.endRu[ei]}.`,
            answer: `${n.fr} qui ${v.fr} ${n.endFr[ei]}.`,
            distractors: ['que', "qu'", 'où'],
            keywords: v.kw,
            explain: 'A2 L5: QUI заменяет подлежащее (сразу после него стоит глагол) и НИКОГДА не сокращается до qu\'!',
          };
        }
        // QUE / QU' combinatorial WITH Passé Composé agreement!
        const objs = [
          { fr: 'La maison', ru: 'Дом', ruRel: 'который', g: 'f', endFr: 'est près du métro', endRu: 'находится рядом с метро', pp: { louer: 'louée', acheter: 'achetée', voir: 'vue', choisir: 'choisie' }, kw: ['maison'] },
          { fr: "L'appartement", ru: 'Квартира', ruRel: 'которую', g: 'm', endFr: 'est au cinquième étage', endRu: 'находится на пятом этаже', pp: { louer: 'loué', acheter: 'acheté', voir: 'vu', choisir: 'choisi' }, kw: ['appartement'] },
          { fr: 'La chambre', ru: 'Комната', ruRel: 'которую', g: 'f', endFr: 'est très lumineuse', endRu: 'очень светлая', pp: { louer: 'louée', acheter: 'achetée', voir: 'vue', choisir: 'choisie' }, kw: ['chambre'] },
          { fr: 'Les clés', ru: 'Ключи', ruRel: 'которые', g: 'fp', endFr: 'sont sur la table', endRu: 'лежат на столе', pp: { trouver: 'trouvées', oublier: 'oubliées', prendre: 'prises' }, kw: ['clés'] },
          { fr: 'Les mots', ru: 'Слова', ruRel: 'которые', g: 'mp', endFr: 'sont très utiles', endRu: 'очень полезные', pp: { apprendre: 'appris', répéter: 'répétés', écrire: 'écrits' }, kw: ['mots'] },
          { fr: 'Les villes', ru: 'Города', ruRel: 'которые', g: 'fp', endFr: 'sont très belles', endRu: 'очень красивые', pp: { visiter: 'visitées', voir: 'vues', choisir: 'choisies' }, kw: ['villes'] },
        ];
        const actors = [
          { fr: 'nous avons', ru: 'мы', el: false, ruV: { louer: 'сняли', acheter: 'купили', voir: 'видели', choisir: 'выбрали', trouver: 'нашли', oublier: 'забыли', prendre: 'взяли', apprendre: 'выучили', répéter: 'повторили', écrire: 'написали', visiter: 'посетили' } },
          { fr: 'il a', ru: 'он', el: true, ruV: { louer: 'снял', acheter: 'купил', voir: 'видел', choisir: 'выбрал', trouver: 'нашёл', oublier: 'забыл', prendre: 'взял', apprendre: 'выучил', répéter: 'повторил', écrire: 'написал', visiter: 'посетил' } },
          { fr: 'elle a', ru: 'она', el: true, ruV: { louer: 'сняла', acheter: 'купила', voir: 'видела', choisir: 'выбрала', trouver: 'нашла', oublier: 'забыла', prendre: 'взяла', apprendre: 'выучила', répéter: 'повторила', écrire: 'написала', visiter: 'посетила' } },
          { fr: "j'ai", ru: 'я', el: false, ruV: { louer: 'снял', acheter: 'купил', voir: 'видел', choisir: 'выбрал', trouver: 'нашёл', oublier: 'забыл', prendre: 'взял', apprendre: 'выучил', répéter: 'повторил', écrire: 'написал', visiter: 'посетил' } },
        ];
        const o = pick(objs);
        const vKey = pick(Object.keys(o.pp));
        const a = pick(actors);
        const rel = a.el ? `qu'${a.fr}` : `que ${a.fr}`;
        const ppForm = o.pp[vKey];
        const ppNoAgree = ppForm.replace(/es$|e$|s$/, '');
        return {
          ru: `${o.ru}, ${o.ruRel} ${a.ru} ${a.ruV[vKey]}, ${o.endRu}.`,
          answer: `${o.fr} ${rel} ${ppForm} ${o.endFr}.`,
          distractors: ['qui', 'où', ppNoAgree !== ppForm ? ppNoAgree : 'ont'],
          keywords: [...o.kw, vKey],
          explain: 'A2 L5: QUE (qu\' перед гласной) = прямое дополнение! Когда прямое дополнение стоит ДО глагола в passé composé, participe passé согласуется с ним в роде и числе!',
        };
      },
    },
    {
      id: 'fr-a2-5-ou',
      minLesson: 5,
      unit: 'a2-5',
      est: 45,
      label: 'A2 L5 · Относительное où (место и время)',
      title: 'A2 L5 · Относительное наречие OÙ (и место, и время!)',
      explain: 'OÙ заменяет обстоятельство МЕСТА (la ville où j\'habite) и ВРЕМЕНИ (le jour où, l\'année où, le moment où — НЕ que и НЕ quand!).',
      gen() {
        if (Math.random() < 0.5) {
          // Place OÙ
          const places = [
            { fr: 'La résidence', ru: 'Общежитие', g: 'f', endFr: "est à cinq minutes de l'institut", endRu: 'находится в пяти минутах от института', kw: ['résidence'] },
            { fr: 'Le quartier', ru: 'Квартал', g: 'm', endFr: 'est très animé', endRu: 'очень оживлённый', kw: ['quartier'] },
            { fr: 'La ville', ru: 'Город', g: 'f', endFr: 'est dans le sud', endRu: 'находится на юге', kw: ['ville'] },
            { fr: "L'immeuble", ru: 'Здание', g: 'm', endFr: 'est moderne et calme', endRu: 'современное и тихое', kw: ['immeuble'] },
            { fr: 'La rue', ru: 'Улица', g: 'f', endFr: 'est près du parc', endRu: 'находится рядом с парком', kw: ['rue'] },
          ];
          const clauses = [
            { fr: "j'habite", ru: 'я живу' },
            { fr: 'Marco habite', ru: 'живёт Марко' },
            { fr: 'mes parents habitent', ru: 'живут мои родители' },
            { fr: 'nous avons loué un studio', ru: 'мы сняли студию' },
            { fr: 'je suis né', ru: 'я родился' },
          ];
          const p = pick(places);
          const c = pick(clauses);
          return {
            ru: `${p.ru}, где ${c.ru}, ${p.endRu}.`,
            answer: `${p.fr} où ${c.fr} ${p.endFr}.`,
            distractors: ['que', 'qui', 'dans'],
            keywords: p.kw,
            explain: 'A2 L5: для обстоятельства места используется относительное наречие OÙ (без лишнего предлога dans!).',
          };
        }
        // Time OÙ
        const times = [
          { fr: 'Je me souviens du jour où', ru: 'Я помню день, когда', kw: ['se souvenir', 'jour'] },
          { fr: "C'est l'année où", ru: 'Это год, когда', kw: ['année'] },
          { fr: 'Au moment où', ru: 'В момент, когда', kw: ['moment'], comma: true },
          { fr: "Je n'oublie pas le soir où", ru: 'Я не забываю вечер, когда', kw: ['soir', 'oublier'] },
        ];
        const events = [
          { fr: 'nous avons déménagé', ru: 'мы переехали', contFr: 'il faisait très beau', contRu: 'стояла прекрасная погода' },
          { fr: 'tu es arrivé à Moscou', ru: 'ты приехал в Москву', contFr: 'il neigeait', contRu: 'шёл снег' },
          { fr: 'nous avons passé le dernier examen', ru: 'мы сдали последний экзамен', contFr: 'nous étions très heureux', contRu: 'мы были очень счастливы' },
          { fr: 'il a ouvert la porte', ru: 'он открыл дверь', contFr: 'il a commencé à pleuvoir', contRu: 'пошёл дождь' },
          { fr: 'je suis entré à la faculté', ru: 'я поступил на факультет', contFr: "j'ai rencontré mes meilleurs amis", contRu: 'я встретил лучших друзей' },
        ];
        const t = pick(times);
        const e = pick(events);
        if (t.comma) {
          return {
            ru: `${t.ru} ${e.ru}, ${e.contRu}.`,
            answer: `${t.fr} ${e.fr}, ${e.contFr}.`,
            distractors: ['que', 'quand', 'qui'],
            keywords: t.kw,
            explain: 'A2 L5: после слов времени (le jour, l\'année, le moment, le soir) ставится OÙ — НЕ quand и НЕ que!',
          };
        }
        return {
          ru: `${t.ru} ${e.ru}.`,
          answer: `${t.fr} ${e.fr}.`,
          distractors: ['que', 'quand', 'qui'],
          keywords: t.kw,
          explain: 'A2 L5: OÙ используется не только для места, но и для времени: le jour où, l\'année où, au moment où!',
        };
      },
    },
    {
      id: 'fr-a2-5-cest',
      minLesson: 5,
      unit: 'a2-5',
      est: 30,
      label: "A2 L5 · Выделительный оборот c'est…qui / que",
      title: "A2 L5 · Выделительная конструкция C'est … qui / C'est … que",
      explain: "Выделяем подлежащее → C'est … QUI (во мн. ч. Ce sont … qui). Выделяем дополнение или обстоятельство места/времени → C'est … QUE.",
      gen() {
        if (Math.random() < 0.5) {
          // C'est ... QUI (subject)
          const subjects = [
            { fr: "C'est Marco qui", ru: 'Именно Марко', pl: false, kw: ['Marco'] },
            { fr: "C'est mon colocataire qui", ru: 'Именно мой сосед по комнате', pl: false, kw: ['colocataire'] },
            { fr: "C'est mon frère qui", ru: 'Именно мой брат', pl: false, kw: ['frère'] },
            { fr: "C'est ma sœur qui", ru: 'Именно моя сестра', pl: false, kw: ['sœur'] },
            { fr: 'Ce sont mes amis qui', ru: 'Именно мои друзья', pl: true, kw: ['amis'] },
          ];
          const preds = [
            { sg: 'déménage dans un nouvel appartement', pl: 'déménagent dans un nouvel appartement', ruSg: 'переезжает в новую квартиру', ruPl: 'переезжают в новую квартиру', d: ['que', 'nouveau'] },
            { sg: "m'aide à préparer l'examen", pl: "m'aident à préparer l'examen", ruSg: 'помогает мне готовиться к экзамену', ruPl: 'помогают мне готовиться к экзамену', d: ['que', 'de'] },
            { sg: 'a trouvé ce logement calme', pl: 'ont trouvé ce logement calme', ruSg: 'нашёл это тихое жильё', ruPl: 'нашли это тихое жильё', d: ['que', 'cet'] },
            { sg: 'connaît bien ce quartier', pl: 'connaissent bien ce quartier', ruSg: 'хорошо знает этот квартал', ruPl: 'хорошо знают этот квартал', d: ['que', 'cet'] },
          ];
          const s = pick(subjects);
          const p = pick(preds);
          return {
            ru: `${s.ru} ${s.pl ? p.ruPl : p.ruSg}.`,
            answer: `${s.fr} ${s.pl ? p.pl : p.sg}.`,
            distractors: [...p.d, 'où'],
            keywords: s.kw,
            explain: "A2 L5: выделяем подлежащее → C'est (Ce sont) … QUI + глагол.",
          };
        }
        // C'est ... QUE (place / time / object)
        const focuses = [
          { fr: "C'est dans cette maison", ru: 'Именно в этом доме', clauses: [
            { fr: "que j'habite depuis trois ans", ru: 'я живу уже три года', kw: ['maison', 'habiter'] },
            { fr: 'que nous avons passé nos vacances', ru: 'мы провели каникулы', kw: ['maison', 'vacances'] },
          ], d: ['qui', 'où', 'ce'] },
          { fr: "C'est lundi", ru: 'Именно в понедельник', clauses: [
            { fr: 'que nous avons un examen de français', ru: 'у нас экзамен по французскому', kw: ['lundi', 'examen'] },
            { fr: 'que Marco a déménagé', ru: 'Марко переехал', kw: ['lundi', 'déménager'] },
          ], d: ['qui', 'le', 'où'] },
          { fr: "C'est à Moscou", ru: 'Именно в Москве', clauses: [
            { fr: "qu'il fait ses études", ru: 'он учится', kw: ['Moscou', 'études'] },
            { fr: 'que nous nous sommes rencontrés', ru: 'мы познакомились', kw: ['Moscou', 'rencontrer'] },
          ], d: ['qui', 'où', 'que'] },
          { fr: "C'est ce quartier", ru: 'Именно этот квартал', clauses: [
            { fr: "que j'ai choisi pour vivre", ru: 'я выбрал для жизни', kw: ['quartier', 'choisir'] },
            { fr: "qu'ils préfèrent", ru: 'они предпочитают', kw: ['quartier', 'préférer'] },
          ], d: ['qui', 'cet', 'où'] },
          { fr: "C'est dans cette résidence", ru: 'Именно в этом общежитии', clauses: [
            { fr: 'que vivent la plupart des étudiants', ru: 'живёт большинство студентов', kw: ['résidence', 'la plupart'] },
            { fr: 'que je me sens très bien', ru: 'я чувствую себя отлично', kw: ['résidence'] },
          ], d: ['qui', 'où', 'ce'] },
        ];
        const f = pick(focuses);
        const c = pick(f.clauses);
        return {
          ru: `${f.ru} ${c.ru}.`,
          answer: `${f.fr} ${c.fr}.`,
          distractors: f.d,
          keywords: c.kw,
          explain: "A2 L5: выделяем дополнение или обстоятельство места/времени → C'est … QUE (НЕ où, даже если речь о месте или времени!).",
        };
      },
    },
    {
      id: 'fr-a2-5-gerondif',
      minLesson: 5,
      unit: 'a2-5',
      est: 44,
      label: 'A2 L5 · Gérondif (en + -ant) и sans + inf.',
      title: 'A2 L5 · Герундий (en + основа nous + -ant) vs отрицание sans + infinitif',
      explain: 'Gérondif = en + основа nous (présent) + -ant (исключения: en étant, en ayant, en sachant). Отрицание («не сделав / не глядя») — ТОЛЬКО sans + infinitif!',
      gen() {
        if (Math.random() < 0.55) {
          // Positive Gérondif combinatorial
          const mains = [
            { fr: "Il va à l'université", ru: 'Он идёт в университет', ger: [
              { fr: 'en écoutant de la musique', ru: 'слушая музыку', d: ['écoutant', 'du'], kw: ['écouter', 'musique'] },
              { fr: 'en répétant les mots nouveaux', ru: 'повторяя новые слова', d: ['répéter', 'des'], kw: ['répéter', 'mots'] },
              { fr: 'en parlant au téléphone', ru: 'разговаривая по телефону', d: ['parler', 'avec'], kw: ['parler', 'téléphone'] },
            ] },
            { fr: 'Nous préparons le dîner', ru: 'Мы готовим ужин', ger: [
              { fr: 'en bavardant dans la cuisine', ru: 'болтая на кухне', d: ['bavarder', 'au'], kw: ['bavarder', 'cuisine'] },
              { fr: 'en écoutant la radio', ru: 'слушая радио', d: ['écouter', 'à la'], kw: ['écouter', 'radio'] },
            ] },
            { fr: 'Elle a souri', ru: 'Она улыбнулась', ger: [
              { fr: 'en ouvrant la porte', ru: 'открывая дверь', d: ['ouvrir', 'ouvrent'], kw: ['sourire', 'ouvrir'] },
              { fr: 'en lisant cette lettre', ru: 'читая это письмо', d: ['lire', 'ce'], kw: ['sourire', 'lire'] },
              { fr: 'en regardant les photos', ru: 'рассматривая фотографии', d: ['regarder', 'des'], kw: ['sourire', 'regarder'] },
            ] },
            { fr: 'Nous apprenons le français', ru: 'Мы учим французский', ger: [
              { fr: 'en faisant beaucoup d\'exercices', ru: 'делая много упражнений', d: ['faire', 'des'], kw: ['faire', 'exercices'] },
              { fr: 'en lisant des textes chaque jour', ru: 'читая тексты каждый день', d: ['lire', 'les'], kw: ['lire', 'textes'] },
              { fr: 'en répétant les règles à haute voix', ru: 'повторяя правила вслух', d: ['répéter', 'dans'], kw: ['répéter', 'règles'] },
            ] },
            { fr: 'Il a rencontré un vieil ami', ru: 'Он встретил старого друга', ger: [
              { fr: 'en se promenant dans le parc', ru: 'гуляя в парке', d: ['se promener', 'promenant'], kw: ['se promener', 'parc'] },
              { fr: 'en sortant du métro', ru: 'выходя из метро', d: ['sortir', 'de'], kw: ['sortir', 'métro'] },
              { fr: 'en traversant la rue', ru: 'переходя улицу', d: ['traverser', 'à'], kw: ['traverser', 'rue'] },
            ] },
          ];
          const m = pick(mains);
          const g = pick(m.ger);
          return {
            ru: `${m.ru}, ${g.ru}.`,
            answer: `${m.fr} ${g.fr}.`,
            distractors: [...g.d, 'sans'],
            keywords: g.kw,
            explain: 'A2 L5: Gérondif = en + основа nous + -ant (у возвратных se стоит после en: en se promenant). Оба действия выполняет одно подлежащее.',
          };
        }
        // Negative sans + infinitif combinatorial!
        const subjs = [
          { fr: 'Il est sorti de la chambre', ru: 'Он вышел из комнаты' },
          { fr: 'Elle est partie', ru: 'Она ушла' },
          { fr: 'Il a traversé la rue', ru: 'Он перешёл улицу' },
          { fr: 'Il a accepté cette offre', ru: 'Он принял это предложение' },
          { fr: 'Nous avons fini le travail', ru: 'Мы закончили работу' },
        ];
        const sansParts = [
          { fr: 'sans dire un mot', ru: 'не сказав ни слова', d: ['en ne disant pas', 'sans disant'], kw: ['sans', 'dire'] },
          { fr: 'sans regarder à gauche', ru: 'не посмотрев налево', d: ['en ne regardant pas', 'sans regardant'], kw: ['sans', 'regarder'] },
          { fr: 'sans hésiter une seconde', ru: 'не колеблясь ни секунды', d: ['en ne hésitant pas', 'sans hésitant'], kw: ['sans', 'hésiter'] },
          { fr: 'sans attendre la réponse', ru: 'не дожидаясь ответа', d: ['en ne attendant pas', 'sans attendant'], kw: ['sans', 'attendre'] },
          { fr: 'sans perdre de temps', ru: 'не теряя времени', d: ['sans perdant', 'du'], kw: ['sans', 'perdre'] },
          { fr: 'sans faire de bruit', ru: 'не производя шума', d: ['sans faisant', 'du'], kw: ['sans', 'bruit'] },
        ];
        const s = pick(subjs);
        const sp = pick(sansParts);
        return {
          ru: `${s.ru}, ${sp.ru}.`,
          answer: `${s.fr} ${sp.fr}.`,
          distractors: [...sp.d, 'ne'],
          keywords: sp.kw,
          explain: 'A2 L5: отрицательное деепричастие («не сделав», «не глядя») во французском передаётся конструкцией SANS + infinitif!',
        };
      },
    },
    {
      id: 'fr-a2-5-quant',
      minLesson: 5,
      unit: 'a2-5',
      est: 20,
      label: 'A2 L5 · La plupart des / дроби / числительные',
      title: 'A2 L5 · Часть целого (la plupart des, la moitié) и числительные',
      explain: 'После части целого (la plupart, la moitié, un tiers, le reste) артикль СОХРАНЯЕТСЯ (des / du / de la)! После beaucoup / peu — только DE. Vingt и cent берут -s только в конце числа.',
      gen() {
        if (Math.random() < 0.5) {
          const parts = [
            { fr: 'La plupart des étudiants', ru: 'Большинство студентов', vFr: ['habitent à la résidence', 'parlent deux langues', 'préfèrent le métro'], vRu: ['живут в общежитии', 'говорят на двух языках', 'предпочитают метро'], d: ['de', 'habite'], kw: ['la plupart', 'étudiants'] },
            { fr: 'La plupart des gens', ru: 'Большинство людей', vFr: ['travaillent en semaine', 'aiment voyager en été', 'habitent dans des immeubles'], vRu: ['работают по будням', 'любят путешествовать летом', 'живут в многоквартирных домах'], d: ['de', 'travaille'], kw: ['la plupart', 'gens'] },
            { fr: 'La moitié de la classe', ru: 'Половина класса', vFr: ['a déjà fini le contrôle', 'habite loin du centre'], vRu: ['уже закончила контрольную', 'живёт далеко от центра'], d: ['de', 'ont'], kw: ['la moitié'] },
            { fr: 'Un tiers des appartements', ru: 'Треть квартир', vFr: ['donnent sur la cour', 'sont au dernier étage'], vRu: ['выходят во двор', 'находятся на последнем этаже'], d: ['de', 'est'], kw: ['un tiers', 'appartement'] },
            { fr: 'Le reste de la journée', ru: 'Остаток дня', vFr: ['était très calme', 'a passé très vite'], vRu: ['был очень спокойным', 'прошёл очень быстро'], d: ['de', 'sont'], kw: ['le reste', 'journée'] },
          ];
          const p = pick(parts);
          const vi = Math.floor(Math.random() * p.vFr.length);
          return {
            ru: `${p.ru} ${p.vRu[vi]}.`,
            answer: `${p.fr} ${p.vFr[vi]}.`,
            distractors: [...p.d, 'du'],
            keywords: p.kw,
            explain: 'A2 L5: после части целого (la plupart, la moitié, un tiers, le reste) артикль СОХРАНЯЕТСЯ (des / de la / du); после la plupart des глагол всегда во мн. ч.!',
          };
        }
        const nums = [
          { ru: 'Эта квартира стоит восемьдесят тысяч рублей.', ans: 'Cet appartement coûte quatre-vingt mille roubles.', d: ['quatre-vingts', 'milles', 'Ce'], kw: ['quatre-vingt', 'mille'] },
          { ru: 'В этом здании двести комнат.', ans: 'Dans cet immeuble il y a deux cents chambres.', d: ['deux cent', 'ce', 'des'], kw: ['deux cents', 'immeuble'] },
          { ru: 'В нашей библиотеке триста двадцать мест.', ans: 'Dans notre bibliothèque il y a trois cent vingt places.', d: ['trois cents', 'vingts', 'des'], kw: ['trois cent vingt'] },
          { ru: 'Его дедушке восемьдесят лет.', ans: 'Son grand-père a quatre-vingts ans.', d: ['quatre-vingt', 'est', 'des'], kw: ['quatre-vingts'] },
          { ru: 'Билет стоит восемьдесят пять евро.', ans: 'Le billet coûte quatre-vingt-cinq euros.', d: ['quatre-vingts-cinq', 'de', 'coûtent'], kw: ['quatre-vingt-cinq'] },
          { ru: 'У меня много друзей, но большинство друзей живут далеко.', ans: "J'ai beaucoup d'amis mais la plupart des amis habitent loin.", d: ['des', "d'", 'habite'], kw: ['beaucoup', 'la plupart'] },
          { ru: 'Мы выучили двести пятьдесят новых слов.', ans: 'Nous avons appris deux cent cinquante nouveaux mots.', d: ['deux cents', 'des', 'sommes'], kw: ['deux cent', 'mots'] },
          { ru: 'Две тысячи студентов учатся на этом факультете.', ans: 'Deux mille étudiants font leurs études à cette faculté.', d: ['Deux milles', 'ce', 'au'], kw: ['deux mille'] },
        ];
        const it = pick(nums);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L5: vingt и cent берут -s только если умножены и стоят в самом КОНЦЕ числа (quatre-vingts, deux cents, но quatre-vingt mille, trois cent vingt). Mille — НИКОГДА без -s!' };
      },
    },
    {
      id: 'fr-a2-5-venir',
      minLesson: 5,
      unit: 'a2-5',
      est: 94,
      label: 'A2 L5 · Venir de / être en train de / управление à, de',
      title: 'A2 L5 · Конструкции и предложное управление урока 5',
      explain: 'venir de + inf. = только что; être en train de + inf. = как раз делать; hésiter à, avoir du mal à, encourager à, il est temps de, au lieu de, changer de (без арт.), traverser (без предлога!).',
      gen() {
        const subjs = [
          { fr: 'Je', vi: 'viens', et: 'suis', av: "J'ai", he: "J'hésite", ru: 'Я', rV: 'только что', rE: 'как раз', rM: 'с трудом', rH: 'не решаюсь' },
          { fr: 'Il', vi: 'vient', et: 'est', av: 'Il a', he: 'Il hésite', ru: 'Он', rV: 'только что', rE: 'как раз', rM: 'с трудом', rH: 'не решается' },
          { fr: 'Elle', vi: 'vient', et: 'est', av: 'Elle a', he: 'Elle hésite', ru: 'Она', rV: 'только что', rE: 'как раз', rM: 'с трудом', rH: 'не решается' },
          { fr: 'Nous', vi: 'venons', et: 'sommes', av: 'Nous avons', he: 'Nous hésitons', ru: 'Мы', rV: 'только что', rE: 'как раз', rM: 'с трудом', rH: 'не решаемся' },
          { fr: 'Ils', vi: 'viennent', et: 'sont', av: 'Ils ont', he: 'Ils hésitent', ru: 'Они', rV: 'только что', rE: 'как раз', rM: 'с трудом', rH: 'не решаются' },
        ];
        const s = pick(subjs);
        const mode = Math.floor(Math.random() * 5);
        if (mode === 0) {
          // venir de + inf
          const acts = [
            { fr: 'déménager dans un nouvel appartement', ru: 'переехал(и) в новую квартиру', kw: ['venir de', 'déménager'] },
            { fr: 'louer une chambre lumineuse', ru: 'снял(и) светлую комнату', kw: ['venir de', 'louer'] },
            { fr: 'finir cet exercice difficile', ru: 'закончил(и) это трудное упражнение', kw: ['venir de', 'finir'] },
            { fr: 'arriver à la gare', ru: 'приехал(и) на вокзал', kw: ['venir de', 'arriver'] },
            { fr: 'prendre des nouvelles de nos amis', ru: 'узнал(и) новости о друзьях', kw: ['venir de', 'nouvelles'] },
          ];
          const a = pick(acts);
          return {
            ru: `${s.ru} ${s.rV} ${a.ru}.`,
            answer: `${s.fr} ${s.vi} ${elideFr('de', a.fr)}.`,
            distractors: ['à', 'en', 'pour'],
            keywords: a.kw,
            explain: 'A2 L5: passé immédiat = venir (au présent) + DE (d\') + infinitif («только что сделать»).',
          };
        }
        if (mode === 1) {
          // être en train de + inf
          const acts = [
            { fr: 'préparer le contrôle de français', ru: 'готовит(ся)/готовимся к контрольной по французскому', kw: ['être en train de', 'préparer'] },
            { fr: 'chercher un logement près du métro', ru: 'ищет/ищем жильё рядом с метро', kw: ['être en train de', 'logement'] },
            { fr: 'ranger la chambre', ru: 'убирает/убираем комнату', kw: ['être en train de', 'ranger'] },
            { fr: 'lire le texte sur Marco', ru: 'читает/читаем текст о Марко', kw: ['être en train de', 'lire'] },
          ];
          const a = pick(acts);
          return {
            ru: `${s.ru} ${s.rE} (в процессе): ${a.ru}.`,
            answer: `${s.fr} ${s.et} en train ${elideFr('de', a.fr)}.`,
            distractors: ['à', 'en', 'avec'],
            keywords: a.kw,
            explain: 'A2 L5: être en train DE + infinitif = быть в процессе действия прямо сейчас.',
          };
        }
        if (mode === 2) {
          // avoir du mal à + inf
          const acts = [
            { fr: 'comprendre ce texte', ru: 'понимает/понимаю этот текст', kw: ['avoir du mal à', 'comprendre'] },
            { fr: 'trouver un bon logement', ru: 'находит/нахожу хорошее жильё', kw: ['avoir du mal à', 'logement'] },
            { fr: 'suivre le professeur', ru: 'следит/слежу за преподавателем', kw: ['avoir du mal à', 'suivre'] },
            { fr: 'imaginer cette situation', ru: 'представляет/представляю эту ситуацию', kw: ['avoir du mal à', 'imaginer'] },
          ];
          const a = pick(acts);
          return {
            ru: `${s.ru} ${s.rM} ${a.ru}.`,
            answer: `${s.av} du mal à ${a.fr}.`,
            distractors: ['de', 'mal', 'au'],
            keywords: a.kw,
            explain: 'A2 L5: avoir DU mal À + infinitif (с трудом что-то делать) — не путать с avoir mal à + часть тела!',
          };
        }
        if (mode === 3) {
          // hésiter à + inf
          const acts = [
            { fr: 'appeler le propriétaire', ru: 'позвонить владельцу', kw: ['hésiter à', 'propriétaire'] },
            { fr: "changer d'appartement", ru: 'сменить квартиру', kw: ['hésiter à', 'changer de'] },
            { fr: 'accepter cette proposition', ru: 'принять это предложение', kw: ['hésiter à', 'accepter'] },
            { fr: 'louer ce studio', ru: 'снять эту студию', kw: ['hésiter à', 'louer'] },
          ];
          const a = pick(acts);
          return {
            ru: `${s.ru} ${s.rH} ${a.ru}.`,
            answer: `${s.he} à ${a.fr}.`,
            distractors: ['de', 'pour', 'en'],
            keywords: a.kw,
            explain: 'A2 L5: hésiter À + infinitif («не решаться сделать что-л.»).',
          };
        }
        const fixed = [
          { ru: 'Вместо того чтобы остаться дома, мы вышли погулять.', ans: 'Au lieu de rester à la maison, nous sommes sortis.', d: ['à', 'que', 'avons'], kw: ['au lieu de'] },
          { ru: 'Вместо того чтобы бронировать отель, мы сняли квартиру.', ans: "Au lieu de réserver un hôtel, nous avons loué un appartement.", d: ['à', 'pour', 'sommes'], kw: ['au lieu de', 'louer'] },
          { ru: 'Пора уходить на пару!', ans: 'Il est temps de partir en cours !', d: ['à', 'pour', 'au'], kw: ['il est temps de'] },
          { ru: 'Пора повторять слова перед срезом!', ans: 'Il est temps de réviser les mots avant le contrôle !', d: ['à', 'pour', 'des'], kw: ['il est temps de'] },
          { ru: 'Он переходит улицу и идёт к метро.', ans: 'Il traverse la rue et va au métro.', d: ['à', 'par', 'à le'], kw: ['traverser', 'rue'] },
          { ru: 'Она решила сменить квартиру.', ans: "Elle a décidé de changer d'appartement.", d: ["l'", 'à', 'du'], kw: ['changer de', 'appartement'] },
          { ru: 'Он передумал в последний момент.', ans: "Il a changé d'avis au dernier moment.", d: ["l'", 'de', 'à le'], kw: ['changer de'] },
          { ru: 'Этот дом принадлежит его семье.', ans: 'Cette maison appartient à sa famille.', d: ['de', 'chez', 'ce'], kw: ['appartenir à'] },
          { ru: 'Друзья поощряют его продолжать учёбу.', ans: "Ses amis l'encouragent à continuer ses études.", d: ['de', 'pour', 'en'], kw: ['encourager à'] },
        ];
        const it = pick(fixed);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L5: au lieu DE, il est temps DE, changer DE (без артикля), appartenir À, encourager qn À, traverser (БЕЗ предлога!).' };
      },
    },

    // --- A2 L6..L10 (FUTURE LESSONS — locked until user moves program boundary!) ---
    {
      id: 'fr-a2-6-futur',
      minLesson: 6,
      unit: 'a2-6',
      est: 90,
      label: 'A2 L6 · Futur simple',
      title: 'A2 L6 · Простое будущее время (Futur simple и si + présent)',
      explain: 'Основа будущего + окончания -ai, -as, -a, -ons, -ez, -ont. Особые основы: être→ser-, avoir→aur-, aller→ir-, faire→fer-, venir→viendr-, pouvoir→pourr-, voir→verr-. После si — présent!',
      gen() {
        const times = [
          { fr: 'Demain', ru: 'Завтра' },
          { fr: 'La semaine prochaine', ru: 'На следующей неделе' },
          { fr: 'Bientôt', ru: 'Скоро' },
        ];
        const subjs = [
          { fr: 'je', idx: 0, ru: 'я' },
          { fr: 'tu', idx: 1, ru: 'ты' },
          { fr: 'il', idx: 2, ru: 'он' },
          { fr: 'nous', idx: 3, ru: 'мы' },
          { fr: 'vous', idx: 4, ru: 'вы' },
          { fr: 'ils', idx: 5, ru: 'они' },
        ];
        const verbs = [
          { f: ['achèterai', 'achèteras', 'achètera', 'achèterons', 'achèterez', 'achèteront'], ru: ['куплю', 'купишь', 'купит', 'купим', 'купите', 'купят'], oFr: 'de nouveaux meubles', oRu: 'новую мебель', d: ['achetons', 'des'], kw: ['acheter', 'meubles'] },
          { f: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'], ru: ['поеду', 'поедешь', 'поедет', 'поедем', 'поедете', 'поедут'], oFr: 'à Paris', oRu: 'в Париж', d: ['allerai', 'en'], kw: ['aller', 'Paris'] },
          { f: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'], ru: ['буду иметь', 'будешь иметь', 'будет иметь', 'будем иметь', 'будете иметь', 'будут иметь'], oFr: 'un appartement spacieux', oRu: 'просторную квартиру', d: ['avoirai', 'une'], kw: ['avoir', 'appartement'] },
          { f: ['viendrai', 'viendras', 'viendra', 'viendrons', 'viendrez', 'viendront'], ru: ['приду', 'придёшь', 'придёт', 'придём', 'придёте', 'придут'], oFr: 'pour le dîner', oRu: 'на ужин', d: ['venirai', 'au'], kw: ['venir', 'dîner'] },
          { f: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'], ru: ['сделаю', 'сделаешь', 'сделает', 'сделаем', 'сделаете', 'сделают'], oFr: 'le ménage dans le salon', oRu: 'уборку в гостиной', d: ['fairai', 'au'], kw: ['faire', 'salon'] },
        ];
        const t = pick(times);
        const s = pick(subjs);
        const v = pick(verbs);
        const vf = v.f[s.idx];
        const sf = s.fr === 'je' ? elideFr('je', vf) : `${s.fr} ${vf}`;
        return {
          ru: `${t.ru} ${s.ru} ${v.ru[s.idx]} ${v.oRu}.`,
          answer: `${t.fr}, ${sf} ${v.oFr}.`,
          distractors: [...v.d, 'sera'],
          keywords: v.kw,
          explain: 'A2 L6: Futur simple (основа + -ai, -as, -a, -ons, -ez, -ont). После условного si вместо futur ставится présent!',
        };
      },
    },
    {
      id: 'fr-a2-7-pqp',
      minLesson: 7,
      unit: 'a2-7',
      est: 6,
      label: 'A2 L7 · Plus-que-parfait',
      title: 'A2 L7 · Предпрошедшее время (Plus-que-parfait)',
      explain: 'avoir / être в imparfait (avais/étais) + participe passé — обозначает действие, произошедшее РАНЬШЕ другого действия в прошлом.',
      gen() {
        const items = [
          { ru: 'Когда мы приехали на вокзал, поезд уже ушёл.', ans: 'Quand nous sommes arrivés à la gare, le train était déjà parti.', d: ['est', 'a', 'partait'], kw: ['gare', 'train', 'partir'] },
          { ru: 'Он показал город, который посетил раньше.', ans: "Il a montré la ville qu'il avait visitée avant.", d: ['a', 'visitait', 'visité'], kw: ['ville', 'visiter'] },
          { ru: 'Она забыла билет, который купила накануне.', ans: "Elle a oublié le billet qu'elle avait acheté la veille.", d: ['a', 'achetait', 'était'], kw: ['billet', 'acheter'] },
          { ru: 'Мы вернулись в кафе, где пообедали днём.', ans: 'Nous sommes revenus au café où nous avions déjeuné.', d: ['avons', 'déjeunions', 'que'], kw: ['café', 'déjeuner'] },
          { ru: 'Он узнал о новости, которую друзья уже обсудили.', ans: 'Il a appris la nouvelle que ses amis avaient déjà discutée.', d: ['ont', 'discutaient', 'discuté'], kw: ['nouvelle', 'discuter'] },
          { ru: 'Когда она пришла, все гости уже ушли.', ans: 'Quand elle est arrivée, tous les invités étaient déjà partis.', d: ['sont', 'avaient', 'parti'], kw: ['arriver', 'partir'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L7: Plus-que-parfait = avait/était + participe passé (действие, предшествующее прошлому).' };
      },
    },
    {
      id: 'fr-a2-7-passif',
      minLesson: 7,
      unit: 'a2-7',
      est: 6,
      label: 'A2 L7 · La voix passive (Пассив)',
      title: 'A2 L7 · Пассивный залог (être + p.p. + par / de)',
      explain: 'être в нужном времени + participe passé (согласуется с подлежащим!) + par (или de для глаголов чувств/состояния).',
      gen() {
        const items = [
          { ru: 'Этот мост был построен в девятнадцатом веке.', ans: 'Ce pont a été construit au dix-neuvième siècle.', d: ['est', 'construite', 'par'], kw: ['pont', 'construire'] },
          { ru: 'Билеты проверяются контролёром.', ans: 'Les billets sont contrôlés par le contrôleur.', d: ['ont', 'contrôlé', 'de'], kw: ['billet', 'contrôler'] },
          { ru: 'Эта книга была переведена на русский язык.', ans: 'Ce livre a été traduit en russe.', d: ['est', 'traduite', 'par'], kw: ['livre', 'traduire'] },
          { ru: 'Все комнаты убраны перед приездом гостей.', ans: "Toutes les chambres sont rangées avant l'arrivée des invités.", d: ['ont', 'rangé', 'par'], kw: ['chambres', 'ranger'] },
          { ru: 'Музей посещают тысячи туристов.', ans: 'Le musée est visité par des milliers de touristes.', d: ['a', 'visitée', 'de'], kw: ['musée', 'visiter'] },
          { ru: 'Этот преподаватель уважаем всеми студентами.', ans: 'Ce professeur est respecté de tous les étudiants.', d: ['a', 'respectée', 'par'], kw: ['professeur', 'respecter'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L7: Пассив = être + participe passé (согласование с подлежащим!) + par (или de с глаголами чувств).' };
      },
    },
    {
      id: 'fr-a2-8-eny',
      minLesson: 8,
      unit: 'a2-8',
      est: 6,
      label: 'A2 L8 · Местоимения EN и Y',
      title: 'A2 L8 · Местоимения EN (de / количество) и Y (место / à)',
      explain: 'EN заменяет de + сущ. / частичный артикль / количество (J\'en achète un kilo). Y заменяет место или à + неодушевлённое (J\'y vais, J\'y pense).',
      gen() {
        const items = [
          { ru: 'Ты идёшь на рынок? — Да, я туда иду.', ans: "Tu vas au marché ? Oui, j'y vais.", d: ["j'en", 'je le', 'là'], kw: ['marché', 'aller'] },
          { ru: 'Ты покупаешь яблоки? — Да, я покупаю их килограмм.', ans: "Tu achètes des pommes ? Oui, j'en achète un kilo.", d: ["j'y", 'les', 'de'], kw: ['acheter', 'pommes'] },
          { ru: 'Он часто об этом думает.', ans: 'Il y pense souvent.', d: ['en', 'le', 'à'], kw: ['penser'] },
          { ru: 'У тебя есть время? — Нет, у меня его нет.', ans: "Tu as du temps ? Non, je n'en ai pas.", d: ["n'y", 'ne le', 'de'], kw: ['temps', 'avoir'] },
          { ru: 'Вы уже были в Лионе? — Да, мы там были прошлым летом.', ans: "Vous êtes déjà allés à Lyon ? Oui, nous y sommes allés l'été dernier.", d: ['en', 'là', 'avons'], kw: ['Lyon', 'aller'] },
          { ru: 'Она пьёт много кофе? — Да, она пьёт его три чашки в день.', ans: 'Elle boit beaucoup de café ? Oui, elle en boit trois tasses par jour.', d: ['y', 'le', 'de'], kw: ['boire', 'café'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L8: Y заменяет à + место/предмет; EN заменяет de + сущ., частичный артикль и количество.' };
      },
    },
    {
      id: 'fr-a2-9-indirect',
      minLesson: 9,
      unit: 'a2-9',
      est: 5,
      label: 'A2 L9 · Косвенная речь',
      title: 'A2 L9 · Косвенная речь и согласование времён',
      explain: 'После глагола в прошлом (il a dit que): présent → imparfait, passé composé → plus-que-parfait, futur → futur dans le passé. Общий вопрос → si.',
      gen() {
        const items = [
          { ru: 'Он сказал, что изучает французский язык.', ans: "Il a dit qu'il étudiait le français.", d: ['étudie', 'a étudié', 'qui'], kw: ['dire', 'étudier'] },
          { ru: 'Она спросила, понимаю ли я правило.', ans: 'Elle a demandé si je comprenais la règle.', d: ['que', 'comprends', 'est-ce que'], kw: ['demander', 'comprendre'] },
          { ru: 'Он ответил, что уже сдал экзамен.', ans: "Il a répondu qu'il avait déjà passé l'examen.", d: ['a passé', 'passait', 'qui'], kw: ['répondre', 'examen'] },
          { ru: 'Они сказали, что приедут завтра.', ans: "Ils ont dit qu'ils viendraient le lendemain.", d: ['viendront', 'viennent', 'demain'], kw: ['dire', 'venir'] },
          { ru: 'Преподаватель спросил, что мы делаем.', ans: 'Le professeur a demandé ce que nous faisions.', d: ['que', 'qu\'est-ce que', 'faisons'], kw: ['demander', 'faire'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L9: при главном глаголе в прошлом présent → imparfait, PC → plus-que-parfait, futur → futur dans le passé; общий вопрос → si.' };
      },
    },
    {
      id: 'fr-a2-10-subjonctif',
      minLesson: 10,
      unit: 'a2-10',
      est: 6,
      label: 'A2 L10 · Subjonctif présent',
      title: 'A2 L10 · Сослагательное наклонение (Il faut que + subjonctif)',
      explain: 'После il faut que, je veux que, je suis content que, bien que используется subjonctif présent (основа ils présent + -e, -es, -e, -ions, -iez, -ent; исключения: sois, aie, fasse, aille, puisse, sache).',
      gen() {
        const items = [
          { ru: 'Нужно, чтобы ты нашёл хорошую работу.', ans: 'Il faut que tu trouves un bon emploi.', d: ['trouve', 'trouveras', 'de'], kw: ['il faut que', 'emploi'] },
          { ru: 'Я хочу, чтобы вы были готовы к собеседованию.', ans: "Je veux que vous soyez prêts pour l'entretien.", d: ['êtes', 'serez', 'prêt'], kw: ['vouloir', 'entretien'] },
          { ru: 'Нужно, чтобы он сделал это сегодня.', ans: "Il faut qu'il fasse cela aujourd'hui.", d: ['fait', 'fera', 'fais'], kw: ['il faut que', 'faire'] },
          { ru: 'Я рад, что ты знаешь это правило.', ans: 'Je suis content que tu saches cette règle.', d: ['sais', 'sauras', 'ce'], kw: ['content', 'savoir'] },
          { ru: 'Нужно, чтобы мы пошли туда вместе.', ans: 'Il faut que nous y allions ensemble.', d: ['allons', 'irons', 'en'], kw: ['il faut que', 'aller'] },
          { ru: 'Хотя он устал, он продолжает работать.', ans: "Bien qu'il soit fatigué, il continue à travailler.", d: ['est', 'sera', 'de'], kw: ['bien que', 'être'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L10: Il faut que / Je veux que / Bien que + subjonctif présent (sois/soyez, fasse, saches, allions).' };
      },
    },
  ];

  // ============================================================================
  // GENERAL ENGLISH GRAMMAR TOPICS & COMBINATORIAL GENERATORS (Winning Strategy U1-U3)
  // ============================================================================
  const EN_TOPICS = [
    // --- UNIT 1 (minLesson: 1) ---
    {
      id: 'en-u1-cs-passive',
      minLesson: 1,
      unit: 'u1',
      est: 78,
      label: 'U1 · Complex Subject (Passive Reporting)',
      title: 'Unit 1 · Complex Subject с пассивными глаголами сообщения',
      explain: 'Subject + is/are said / known / believed / expected / reported / thought + Infinitive (Simple — факт/будущее, Continuous — сейчас, Perfect — в прошлом, Passive — пассив).',
      gen() {
        const repSg = [
          { en: 'is believed', ru: 'Считается, что' },
          { en: 'is known', ru: 'Известно, что' },
          { en: 'is reported', ru: 'Сообщают, что' },
          { en: 'is expected', ru: 'Ожидается, что' },
          { en: 'is thought', ru: 'Полагают, что' },
          { en: 'is said', ru: 'Говорят, что' },
        ];
        const repPl = [
          { en: 'are believed', ru: 'Считается, что' },
          { en: 'are known', ru: 'Известно, что' },
          { en: 'are reported', ru: 'Сообщают, что' },
          { en: 'are expected', ru: 'Ожидается, что' },
          { en: 'are thought', ru: 'Полагают, что' },
          { en: 'are said', ru: 'Говорят, что' },
        ];
        const frames = [
          { pl: false, subj: 'AI', ruSubj: 'ИИ', inf: 'to transform the education system dramatically', ruInf: 'кардинально изменит систему образования', d: ['transforming', 'to have transformed'], kw: ['transform', 'education'] },
          { pl: false, subj: 'This programme', ruSubj: 'эта программа', inf: 'to foster innovation and cooperation', ruInf: 'способствует развитию инноваций и сотрудничества', d: ['fostering', 'to be fostered'], kw: ['foster', 'innovation'] },
          { pl: false, subj: 'The company', ruSubj: 'компания', inf: 'to have adapted its strategy last year', ruInf: 'адаптировала свою стратегию в прошлом году', d: ['to adapt', 'adapting'], kw: ['adapt', 'strategy'] },
          { pl: false, subj: 'A tailored approach', ruSubj: 'индивидуальный подход', inf: 'to enhance productivity significantly', ruInf: 'значительно повышает продуктивность', d: ['enhancing', 'to be enhanced'], kw: ['tailored', 'enhance', 'productivity'] },
          { pl: false, subj: 'The new platform', ruSubj: 'новая платформа', inf: 'to be developed at the moment', ruInf: 'разрабатывается в данный момент', d: ['to develop', 'to be developing'], kw: ['platform', 'develop'] },
          { pl: false, subj: 'The university', ruSubj: 'университет', inf: 'to have introduced a new assessment policy', ruInf: 'ввёл новую политику оценки знаний', d: ['to introduce', 'introducing'], kw: ['assessment', 'policy'] },
          { pl: false, subj: 'The researcher', ruSubj: 'исследователь', inf: 'to have been studying this problem for years', ruInf: 'изучает эту проблему уже много лет', d: ['to study', 'to be studying'], kw: ['researcher', 'problem'] },
          { pl: false, subj: 'The new method', ruSubj: 'новый метод', inf: 'to be tested next term', ruInf: 'будет проверен в следующем семестре', d: ['to test', 'testing'], kw: ['method', 'test'] },
          { pl: true, subj: 'The new measures', ruSubj: 'новые меры', inf: 'to address this urgent issue', ruInf: 'решат эту острую проблему', d: ['addressing', 'to have addressed'], kw: ['address', 'issue'] },
          { pl: true, subj: 'The students', ruSubj: 'студенты', inf: 'to be engaging actively in this project now', ruInf: 'сейчас активно участвуют в этом проекте', d: ['to engage', 'engaging'], kw: ['engage', 'project'] },
          { pl: true, subj: 'Digital tools', ruSubj: 'цифровые инструменты', inf: 'to be used widely in the future', ruInf: 'будут широко использоваться в будущем', d: ['to use', 'using'], kw: ['digital', 'tools'] },
          { pl: true, subj: 'The results', ruSubj: 'результаты', inf: 'to have been checked before publication', ruInf: 'были проверены до публикации', d: ['to check', 'to have checked'], kw: ['results', 'checked'] },
          { pl: true, subj: 'Graduates', ruSubj: 'выпускники', inf: 'to have acquired strong analytical skills', ruInf: 'приобрели сильные аналитические навыки', d: ['to acquire', 'acquiring'], kw: ['skills'] },
        ];
        const f = pick(frames);
        const r = f.pl ? pick(repPl) : pick(repSg);
        return {
          ru: `${r.ru} ${f.ruSubj} ${f.ruInf}.`,
          answer: `${f.subj} ${r.en} ${f.inf}.`,
          distractors: [...f.d, f.pl ? 'is' : 'are'],
          keywords: f.kw,
          explain: 'Unit 1 Grammar File §8: Complex Subject с пассивными глаголами сообщения — выбор формы инфинитива зависит от времени и залога (to do / to be doing / to have done / to be done / to have been done).',
        };
      },
    },
    {
      id: 'en-u1-cs-seem',
      minLesson: 1,
      unit: 'u1',
      est: 48,
      label: 'U1 · Complex Subject (seem / appear)',
      title: 'Unit 1 · Complex Subject с глаголами seem / appear',
      explain: 'seem / appear + Simple Infinitive (состояние/факт), Continuous Infinitive (сейчас в процессе), Perfect Infinitive (уже произошло).',
      gen() {
        const subjs = [
          { en: 'The students', sg: false, ru: 'студенты', rPast: 'успели' },
          { en: 'The researchers', sg: false, ru: 'исследователи', rPast: 'успели' },
          { en: 'The candidate', sg: true, ru: 'кандидат', rPast: 'успел' },
          { en: 'She', sg: true, ru: 'она', rPast: 'успела' },
          { en: 'He', sg: true, ru: 'он', rPast: 'успел' },
          { en: 'The team', sg: true, ru: 'команда', rPast: 'успела' },
        ];
        const infs = [
          { en: 'to have misinterpreted the outcomes', ru: 'неверно истолковать результаты', d: ['to misinterpret', 'misinterpreting'], kw: ['misinterpret', 'outcomes'] },
          { en: 'to have adapted quickly to the new environment', ru: 'быстро приспособиться к новой среде', d: ['to adapt', 'adapting'], kw: ['adapt', 'environment'] },
          { en: 'to be revising the assessment system now', ru: 'сейчас пересматривать систему оценки', d: ['to revise', 'revising'], kw: ['assessment'] },
          { en: 'to have identified the key issue', ru: 'выявить ключевую проблему', d: ['to identify', 'identifying'], kw: ['identify', 'issue'] },
        ];
        const s = pick(subjs);
        const inf = pick(infs);
        const vPair = s.sg ? [['seems', 'Кажется'], ['appears', 'По-видимому']] : [['seem', 'Кажется'], ['appear', 'По-видимому']];
        const [vEn, vRu] = pick(vPair);
        return {
          ru: `${vRu}, что ${s.ru} — ${inf.ru}.`,
          answer: `${s.en} ${vEn} ${inf.en}.`,
          distractors: [...inf.d, 'seeming'],
          keywords: inf.kw,
          explain: 'Unit 1 Grammar File §9: seem / appear + to do (факт), to be doing (сейчас), to have done (ранее), to have been doing (длительность).',
        };
      },
    },
    {
      id: 'en-u1-cs-turn',
      minLesson: 1,
      unit: 'u1',
      est: 56,
      label: 'U1 · Complex Subject (turn out / prove / happen)',
      title: 'Unit 1 · Complex Subject: turn out / prove / happen / chance',
      explain: 'turn out / prove + to-Inf = оказаться; happen / chance + to-Inf = случайно оказаться.',
      gen() {
        const turnSubjs = [
          { en: 'Customized training', ru: 'Индивидуальное обучение', kw: ['customized', 'training'] },
          { en: 'The new approach', ru: 'Новый подход', kw: ['approach'] },
          { en: 'The learning app', ru: 'Учебное приложение', kw: ['learning'] },
          { en: 'Online discussion', ru: 'Онлайн-дискуссия', kw: ['discussion'] },
        ];
        const turnEnds = [
          { en: 'to be very effective', ru: 'очень эффективным', d: ['being', 'was'] },
          { en: 'to be a reliable solution', ru: 'надёжным решением', d: ['being', 'was'] },
          { en: 'to be much more useful than expected', ru: 'гораздо полезнее, чем ожидалось', d: ['being', 'to have been'] },
          { en: 'to have been based on reliable data', ru: 'основано на надёжных данных', d: ['to base', 'basing'] },
        ];
        const happenSubjs = [
          { en: 'She', ru: 'она' },
          { en: 'He', ru: 'он' },
          { en: 'The students', ru: 'студенты' },
          { en: 'The researchers', ru: 'исследователи' },
        ];
        const happenEnds = [
          { en: 'to know the right answer', ru: 'знали/знает правильный ответ', d: ['knowing', 'knew'], kw: ['happen', 'answer'] },
          { en: 'to have faced this problem earlier', ru: 'сталкивались с этой проблемой ранее', d: ['to face', 'facing'], kw: ['happen', 'problem'] },
          { en: 'to be working on another project then', ru: 'работали тогда над другим проектом', d: ['to work', 'working'], kw: ['happen', 'project'] },
        ];
        if (Math.random() < 0.6) {
          const s = pick(turnSubjs);
          const e = pick(turnEnds);
          const v = pick(['turned out', 'proved']);
          return {
            ru: `${s.ru} оказалось ${e.ru}.`,
            answer: `${s.en} ${v} ${e.en}.`,
            distractors: [...e.d, 'proving'],
            keywords: s.kw,
            explain: 'Unit 1 Grammar File §10: turn out / prove (оказаться) + to-Infinitive.',
          };
        }
        const s = pick(happenSubjs);
        const e = pick(happenEnds);
        const v = pick(['happened', 'chanced']);
        return {
          ru: `Случайно оказалось, что ${s.ru} ${e.ru}.`,
          answer: `${s.en} ${v} ${e.en}.`,
          distractors: [...e.d, 'bound'],
          keywords: e.kw,
          explain: 'Unit 1 Grammar File §11: happen / chance + to-Infinitive = случайно оказаться.',
        };
      },
    },
    {
      id: 'en-u1-cs-likely',
      minLesson: 1,
      unit: 'u1',
      est: 46,
      label: 'U1 · Be likely / unlikely / sure / bound',
      title: 'Unit 1 · Complex Subject: be likely / unlikely / bound / sure / certain to',
      explain: 'be likely to (вероятно), be unlikely to (вряд ли), be sure/certain to (наверняка), be bound to (непременно).',
      gen() {
        const mods = [
          { en: 'likely', ru: 'вероятно' },
          { en: 'unlikely', ru: 'вряд ли' },
          { en: 'sure', ru: 'наверняка' },
          { en: 'certain', ru: 'точно' },
          { en: 'bound', ru: 'непременно' },
        ];
        const frames = [
          { subj: 'These changes', be: 'are', ruSubj: 'Эти изменения', inf: 'to have a strong impact on students', ruInf: 'окажут сильное влияние на студентов', d: ['having', 'for'], kw: ['impact', 'students'] },
          { subj: 'Engagement in discussions', be: 'is', ruSubj: 'Участие в дискуссиях', inf: 'to enhance your confidence', ruInf: 'повысит вашу уверенность', d: ['enhancing', 'of'], kw: ['engagement', 'enhance'] },
          { subj: 'The marketplace', be: 'is', ruSubj: 'Рынок', inf: 'to require more flexible skills', ruInf: 'потребует более гибких навыков', d: ['requiring', 'for'], kw: ['marketplace', 'skills'] },
          { subj: 'The students', be: 'are', ruSubj: 'Студенты', inf: 'to make significant progress with this course', ruInf: 'добьются заметного прогресса на этом курсе', d: ['making', 'made'], kw: ['progress', 'course'] },
          { subj: 'The new teaching materials', be: 'are', ruSubj: 'Новые учебные материалы', inf: 'to be revised before next term', ruInf: 'будут пересмотрены до следующего семестра', d: ['to revise', 'revising'], kw: ['materials', 'revised'] },
          { subj: 'They', be: 'are', ruSubj: 'Они', inf: 'to succeed if they foster cooperation', ruInf: 'добьются успеха, если будут развивать сотрудничество', d: ['succeeding', 'for'], kw: ['foster', 'cooperation'] },
          { subj: 'The new system', be: 'is', ruSubj: 'Новая система', inf: 'to be more efficient than the old one', ruInf: 'будет эффективнее старой', d: ['being', 'been'], kw: ['system', 'efficient'] },
          { subj: 'Applications', be: 'are', ruSubj: 'Заявки', inf: 'to be examined carefully by the committee', ruInf: 'будут тщательно рассмотрены комиссией', d: ['to examine', 'examining'], kw: ['applications', 'examined'] },
          { subj: 'New students', be: 'are', ruSubj: 'Новые студенты', inf: 'to experience some difficulties at first', ruInf: 'столкнутся с трудностями вначале', d: ['experiencing', 'to be experienced'], kw: ['students', 'difficulties'] },
          { subj: 'The final results', be: 'are', ruSubj: 'Итоговые результаты', inf: 'to have been announced yet', ruInf: 'уже объявлены', onlyMod: 'unlikely', d: ['to announce', 'announcing'], kw: ['results', 'announced'] },
        ];
        const f = pick(frames);
        const m = f.onlyMod ? mods.find((x) => x.en === f.onlyMod) : pick(mods);
        return {
          ru: `${f.ruSubj}, ${m.ru}, ${f.ruInf}.`,
          answer: `${f.subj} ${f.be} ${m.en} ${f.inf}.`,
          distractors: [...f.d, m.en === 'likely' ? 'bound' : 'likely'],
          keywords: [...f.kw, m.en],
          explain: 'Unit 1 Grammar File §12: be likely (вероятно) / unlikely (вряд ли) / sure / certain / bound (непременно) + to-Infinitive.',
        };
      },
    },
    {
      id: 'en-u1-infinitive',
      minLesson: 1,
      unit: 'u1',
      est: 52,
      label: 'U1 · Формы инфинитива (Active / Passive / Perfect)',
      title: 'Unit 1 · Выбор формы инфинитива (Active vs Passive, Simple vs Perfect)',
      explain: 'Passive Infinitive (to be done / to have been done) — действие направлено на подлежащее; Perfect Infinitive (to have done) — предшествующее действие.',
      gen() {
        if (Math.random() < 0.65) {
          const people = [
            { en: 'She is', ru: 'Она' },
            { en: 'He is', ru: 'Он' },
            { en: 'They are', ru: 'Они' },
            { en: 'We are', ru: 'Мы' },
          ];
          const feels = [
            { en: 'happy', ru: 'рад(а)/рады' },
            { en: 'glad', ru: 'доволен(а)/довольны' },
            { en: 'proud', ru: 'гордится/гордятся' },
          ];
          const infs = [
            { en: 'to have adapted to the new system', ru: 'что адаптировались к новой системе', d: ['to adapt', 'adapting'], kw: ['adapt', 'system'] },
            { en: 'to have completed this challenging course', ru: 'что завершили этот сложный курс', d: ['to complete', 'completing'], kw: ['complete', 'course'] },
            { en: 'to have been invited to the conference', ru: 'что получили приглашение на конференцию', d: ['to invite', 'to have invited'], kw: ['invited', 'conference'] },
            { en: 'to be working on an innovative project', ru: 'что работают сейчас над инновационным проектом', d: ['to work', 'working'], kw: ['innovative', 'project'] },
          ];
          const p = pick(people);
          const f = pick(feels);
          const inf = pick(infs);
          return {
            ru: `${p.ru} ${f.ru}, ${inf.ru}.`,
            answer: `${p.en} ${f.en} ${inf.en}.`,
            distractors: [...inf.d, 'for'],
            keywords: inf.kw,
            explain: 'Unit 1 Grammar File §7: 6 форм инфинитива (Simple / Continuous / Perfect × Active / Passive).',
          };
        }
        const passItems = [
          { ru: 'Эта проблема должна быть решена немедленно.', ans: 'This issue needs to be addressed immediately.', d: ['to address', 'addressing', 'to have addressed'], kw: ['issue', 'address'] },
          { ru: 'Программу следует подобрать под индивидуальные потребности.', ans: 'The programme ought to be tailored to individual needs.', d: ['to tailor', 'tailoring', 'for'], kw: ['tailored', 'programme'] },
          { ru: 'Новые материалы должны быть подготовлены до занятия.', ans: 'The new materials need to be prepared before the lesson.', d: ['to prepare', 'preparing', 'to have prepared'], kw: ['materials', 'prepared'] },
          { ru: 'Этот вопрос заслуживает того, чтобы его обсудили подробно.', ans: 'This question deserves to be discussed in detail.', d: ['to discuss', 'discussing', 'to have discussed'], kw: ['discuss', 'question'] },
        ];
        const it = pick(passItems);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 1 Grammar File §7: Passive Infinitive (to be + V3) после need / ought / deserve / expect.' };
      },
    },

    // --- UNIT 2 (minLesson: 2) ---
    {
      id: 'en-u2-attr',
      minLesson: 2,
      unit: 'u2',
      est: 20,
      label: 'U2 · Причастие как определение (Participle I vs II)',
      title: 'Unit 2 · Participle I (-ing) vs Participle II (V3) как определение',
      explain: 'Participle I (-ing) выражает активное действие/источник чувства; Participle II (V3) — пассивное значение/испытываемое чувство.',
      gen() {
        if (Math.random() < 0.7) {
          const pairs = [
            { a: 'The fascinated tourists', b: 'the amazing landscape', ruA: 'Очарованные туристы', ruB: 'потрясающий пейзаж', v: ['photographed', 'admired', 'described'], vRu: ['сфотографировали', 'любовались', 'описали'], d: ['fascinating', 'amazed'], kw: ['fascinated', 'amazing'] },
            { a: 'The excited travellers', b: 'an inspiring journey', ruA: 'Взволнованные путешественники', ruB: 'вдохновляющее путешествие', v: ['planned', 'started', 'remembered'], vRu: ['спланировали', 'начали', 'вспомнили'], d: ['exciting', 'inspired'], kw: ['excited', 'inspiring'] },
            { a: 'The confused visitors', b: 'the confusing map', ruA: 'Сбитые с толку посетители', ruB: 'запутанную карту', v: ['studied', 'checked', 'discussed'], vRu: ['изучили', 'проверили', 'обсудили'], d: ['confusing', 'confused'], kw: ['confused', 'confusing'] },
            { a: 'The inspired writers', b: 'a compelling story', ruA: 'Вдохновлённые писатели', ruB: 'убедительную историю', v: ['published', 'shared', 'wrote'], vRu: ['опубликовали', 'поделились', 'написали'], d: ['inspiring', 'compelled'], kw: ['inspired', 'compel'] },
            { a: 'Tourists immersed in the culture', b: 'overcrowded resorts', ruA: 'Туристы, погружённые в культуру', ruB: 'переполненных курортов', v: ['avoid', 'dislike', 'criticise'], vRu: ['избегают', 'не любят', 'критикуют'], d: ['immersing', 'overcrowding'], kw: ['immerse', 'overcrowded'] },
          ];
          const p = pick(pairs);
          const vi = Math.floor(Math.random() * p.v.length);
          return {
            ru: `${p.ruA} ${p.vRu[vi]} ${p.ruB}.`,
            answer: `${p.a} ${p.v[vi]} ${p.b}.`,
            distractors: [...p.d, 'having'],
            keywords: p.kw,
            explain: 'Unit 2 Grammar File §1–2: -ed (Participle II) описывает чувство человека или пассивный признак; -ing (Participle I) описывает активный признак/источник впечатления.',
          };
        }
        const fixed = [
          { ru: 'Повышенный боевой дух помог команде победить.', ans: 'The boosted morale helped the team win.', d: ['boosting', 'winning', 'has'], kw: ['boost', 'morale'] },
          { ru: 'Хрупкие экосистемы, повреждённые массовым туризмом, нуждаются в защите.', ans: 'Fragile ecosystems damaged by mass tourism need protection.', d: ['damaging', 'having damaged', 'of'], kw: ['fragile', 'damaged'] },
          { ru: 'Музей, представляющий древние традиции, привлёк множество посетителей.', ans: 'The museum presenting ancient traditions attracted many visitors.', d: ['presented', 'having presented', 'at'], kw: ['museum', 'traditions'] },
          { ru: 'Гид, показывающий туристам старый город, рассказал его историю.', ans: 'The guide showing visitors around the old town explained its history.', d: ['shown', 'having shown', 'to'], kw: ['guide', 'history'] },
          { ru: 'Переполненные города страдают от массового туризма.', ans: 'Overcrowded cities suffer from mass tourism.', d: ['Overcrowding', 'suffered', 'of'], kw: ['overcrowded', 'tourism'] },
        ];
        const it = pick(fixed);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 2 Grammar File §1–2: Participle I (-ing) = активный признак; Participle II (V3) = пассивный признак.' };
      },
    },
    {
      id: 'en-u2-vshiy',
      minLesson: 2,
      unit: 'u2',
      est: 20,
      label: 'U2 · Русские причастия на -вший (ловушка!)',
      title: 'Unit 2 · Перевод русских определений на -вший (who / which + Past)',
      explain: 'ЛОВУШКА Unit 2: Perfect Participle (having done) НИКОГДА не используется как определение! Русские причастия на -вший переводятся придаточным who / which / that + Past Simple / Past Perfect.',
      gen() {
        const subjs = [
          { en: 'The students', rel: 'who', ru: 'Студенты' },
          { en: 'The travellers', rel: 'who', ru: 'Путешественники' },
          { en: 'The volunteers', rel: 'who', ru: 'Волонтёры' },
          { en: 'The researchers', rel: 'who', ru: 'Исследователи' },
        ];
        const actions = [
          { cl: 'embarked on this project last month', ruCl: 'приступившие к этому проекту в прошлом месяце', end: 'already see great results', ruEnd: 'уже видят отличные результаты', d: ['having embarked', 'embarking'], kw: ['embark on'] },
          { cl: 'delved into the history of the city', ruCl: 'углубившиеся в историю города', end: 'discovered hidden places', ruEnd: 'открыли скрытые места', d: ['having delved', 'delving'], kw: ['delve into'] },
          { cl: 'had visited the region before', ruCl: 'посетившие регион ранее', end: 'wrote a detailed guide', ruEnd: 'написали подробный путеводитель', d: ['having visited', 'visiting'], kw: ['visited', 'region'] },
          { cl: 'had completed the environmental project', ruCl: 'завершившие экологический проект', end: 'received special awards', ruEnd: 'получили особые награды', d: ['having completed', 'completing'], kw: ['completed', 'awards'] },
          { cl: 'had protected endangered animals', ruCl: 'защитившие редких животных', end: 'gained international recognition', ruEnd: 'получили международное признание', d: ['having protected', 'protecting'], kw: ['protected'] },
        ];
        const s = pick(subjs);
        const a = pick(actions);
        return {
          ru: `${s.ru}, ${a.ruCl}, ${a.ruEnd}.`,
          answer: `${s.en} ${s.rel} ${a.cl} ${a.end}.`,
          distractors: [...a.d, 'which'],
          keywords: a.kw,
          explain: 'Unit 2 Grammar File §3: для перевода русских определений на -вший (предшествующее действие) используем придаточное who/which + Past (НЕ having done!).',
        };
      },
    },
    {
      id: 'en-u2-adverbial',
      minLesson: 2,
      unit: 'u2',
      est: 24,
      label: 'U2 · Perfect Participle (Having + V3)',
      title: 'Unit 2 · Причастие как обстоятельство (Having done / Having been done / V-ing)',
      explain: 'Предшествующее активное действие → Having + V3; предшествующее пассивное → Having been + V3 (или V3); одновременное → V-ing.',
      gen() {
        const subjs = [
          { en: 'the researchers', ru: 'исследователи' },
          { en: 'the students', ru: 'студенты' },
          { en: 'the travellers', ru: 'путешественники' },
          { en: 'they', ru: 'они' },
        ];
        const pairs = [
          { part: 'Having finished all the preparations,', ruP: 'Завершив все приготовления,', res: 'embarked on the expedition', ruR: 'отправились в экспедицию', d: ['Finishing', 'Finished'], kw: ['embark on'] },
          { part: 'Having collected enough information,', ruP: 'Собрав достаточно информации,', res: 'began writing the final report', ruR: 'начали писать итоговый отчёт', d: ['Collecting', 'Collected'], kw: ['collected', 'report'] },
          { part: 'Having delved into the research,', ruP: 'Углубившись в исследование,', res: 'noticed an important detail', ruR: 'заметили важную деталь', d: ['Delving', 'Delved'], kw: ['delve into'] },
          { part: 'Having explored the underground tunnels,', ruP: 'Исследовав подземные тоннели,', res: 'returned to the surface', ruR: 'вернулись на поверхность', d: ['Exploring', 'Explored'], kw: ['explored'] },
          { part: 'Having boosted sales this quarter,', ruP: 'Повысив продажи в этом квартале,', res: 'expanded the team quickly', ruR: 'быстро расширили команду', d: ['Boosting', 'Boosted'], kw: ['boost', 'sales'] },
        ];
        if (Math.random() < 0.78) {
          const p = pick(pairs);
          const s = pick(subjs);
          return {
            ru: `${p.ruP} ${s.ru} ${p.ruR}.`,
            answer: `${p.part} ${s.en} ${p.res}.`,
            distractors: [...p.d, 'Being'],
            keywords: p.kw,
            explain: 'Unit 2 Grammar File §5: предшествующее активное действие в функции обстоятельства → Having + V3.',
          };
        }
        const passives = [
          { ru: 'Будучи повреждённым во время бури, деревянный мост был закрыт.', ans: 'Having been damaged during the storm, the wooden bridge was closed.', d: ['Damaging', 'Having damaged', 'Being damaging'], kw: ['damaged', 'bridge'] },
          { ru: 'Расположенный рядом с вокзалом, отель очень удобен для путешественников.', ans: 'Located close to the railway station, the hotel is convenient for travellers.', d: ['Locating', 'Having located', 'Being locating'], kw: ['located', 'hotel'] },
          { ru: 'Почувствовав себя вынужденным действовать, он позвонил директору.', ans: 'Feeling compelled to act, he called the director.', d: ['Compelling', 'Felt', 'acting'], kw: ['compel', 'act'] },
          { ru: 'Просматривая старые фотографии, историк заметил интересную деталь.', ans: 'Looking through the old photographs, the historian noticed an interesting detail.', d: ['Having looked', 'Looked', 'Being looked'], kw: ['photographs', 'detail'] },
        ];
        const it = pick(passives);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 2 Grammar File §5: пассивное предшествование → Having been + V3 / V3; одновременное действие → V-ing.' };
      },
    },
    {
      id: 'en-u2-motion',
      minLesson: 2,
      unit: 'u2',
      est: 24,
      label: 'U2 · Глаголы движения и восприятия',
      title: 'Unit 2 · Simple Participle I с глаголами движения и восприятия',
      explain: 'С глаголами движения/восприятия (enter, arrive, leave, reach, see, hear, notice) для непосредственно предшествующего действия используется Simple Participle I (Entering, Seeing), НЕ Having entered!',
      gen() {
        const subjs = [
          { en: 'we', ru: 'мы' },
          { en: 'the travellers', ru: 'путешественники' },
          { en: 'they', ru: 'они' },
          { en: 'the students', ru: 'студенты' },
        ];
        const pairs = [
          { part: 'Entering the city centre,', ruP: 'Войдя в центр города,', res: 'immediately noticed crowds of tourists', ruR: 'сразу заметили толпы туристов', d: ['Having entered', 'Entered'], kw: ['enter', 'tourists'] },
          { part: 'Arriving at the hotel,', ruP: 'Прибыв в отель,', res: 'unpacked and went for a walk', ruR: 'распаковали вещи и пошли гулять', d: ['Having arrived', 'Arrived'], kw: ['arrive', 'hotel'] },
          { part: 'Seeing the warning sign,', ruP: 'Увидев предупреждающий знак,', res: 'immediately turned left', ruR: 'немедленно повернули налево', d: ['Having seen', 'Seen'], kw: ['see', 'sign'] },
          { part: 'Hearing the news,', ruP: 'Услышав эту новость,', res: 'felt compelled to help', ruR: 'почувствовали себя обязанными помочь', d: ['Having heard', 'Heard'], kw: ['hear', 'compel'] },
          { part: 'Leaving the museum,', ruP: 'Выйдя из музея,', res: 'decided to visit the old square', ruR: 'решили посетить старую площадь', d: ['Having left', 'Left'], kw: ['leave', 'museum'] },
          { part: 'Noticing a sudden change in the weather,', ruP: 'Заметив резкую перемену погоды,', res: 'immediately returned to the harbour', ruR: 'сразу вернулись в гавань', d: ['Having noticed', 'Noticed'], kw: ['notice', 'weather'] },
        ];
        const p = pick(pairs);
        const s = pick(subjs);
        return {
          ru: `${p.ruP} ${s.ru} ${p.ruR}.`,
          answer: `${p.part} ${s.en} ${p.res}.`,
          distractors: [...p.d, 'into'],
          keywords: p.kw,
          explain: 'Unit 2 Grammar File §6: с глаголами движения и восприятия (enter, arrive, leave, see, hear, notice) для немедленной реакции используется Simple Participle I (V-ing)!',
        };
      },
    },
    {
      id: 'en-u2-being-when',
      minLesson: 2,
      unit: 'u2',
      est: 20,
      label: 'U2 · Being vs When',
      title: 'Unit 2 · Being (причина) vs When (время / условие)',
      explain: 'Being + сущ./прил. выражает ПРИЧИНУ («поскольку он…»). When + (subj + was/were) выражает ВРЕМЯ/МЕСТО («когда был в…» — Being здесь НЕЛЬЗЯ!).',
      gen() {
        const causePairs = [
          { part: 'Being unfamiliar with the area,', ruP: 'Поскольку не знали местности,', s: ['the traveller', 'the tourists', 'Maria'], res: 'used an offline map', ruR: 'воспользовались офлайн-картой', kw: ['being', 'area'] },
          { part: 'Being worried about overtourism,', ruP: 'Будучи обеспокоены массовым туризмом,', s: ['the mayor', 'local residents', 'the council'], res: 'introduced strict regulations', ruR: 'ввели строгие правила', kw: ['being', 'tourism'] },
          { part: 'Being aware of the fragile ecosystem,', ruP: 'Осознавая хрупкость экосистемы,', s: ['the guide', 'the rangers', 'the volunteers'], res: 'asked visitors to stay on the trail', ruR: 'попросили гостей не сходить с тропы', kw: ['being', 'ecosystem'] },
          { part: 'Being tired after the long hike,', ruP: 'Поскольку устали после долгого похода,', s: ['Anna', 'the hikers', 'they'], res: 'went straight to the guesthouse', ruR: 'сразу пошли в гостевой дом', kw: ['being', 'hike'] },
        ];
        const whenPairs = [
          { part: 'When he was in the mountains,', ruP: 'Когда он был в горах,', s: 'Alex', res: ['became interested in wildlife conservation', 'took dozens of stunning photos'], ruR: ['увлёкся охраной дикой природы', 'сделал десятки потрясающих фото'], kw: ['when', 'mountains'] },
          { part: 'When they were in the national park,', ruP: 'Когда они были в национальном парке,', s: 'the tourists', res: ['saw several rare birds', 'stayed strictly on the marked trail'], ruR: ['увидели редких птиц', 'строго держались размеченной тропы'], kw: ['when', 'park'] },
          { part: 'When she was in Spain,', ruP: 'Когда она была в Испании,', s: 'Maria', res: ['visited several coastal towns', 'immersed herself in local traditions'], ruR: ['посетила несколько прибрежных городков', 'погрузилась в местные традиции'], kw: ['when', 'Spain'] },
          { part: 'When he was on the island,', ruP: 'Когда он был на острове,', s: 'the researcher', res: ['collected data on local traditions', 'interviewed local fishermen'], ruR: ['собрал данные о местных традициях', 'взял интервью у местных рыбаков'], kw: ['when', 'island'] },
        ];
        if (Math.random() < 0.55) {
          const c = pick(causePairs);
          const s = pick(c.s);
          return {
            ru: `${c.ruP} (${s}) ${c.ruR}.`,
            answer: `${c.part} ${s} ${c.res}.`,
            distractors: ['When', 'Having been', 'Been'],
            keywords: c.kw,
            explain: 'Unit 2 Grammar File §7: причина («поскольку…») → Being + прилагательное/существительное.',
          };
        }
        const w = pick(whenPairs);
        const ri = Math.floor(Math.random() * w.res.length);
        return {
          ru: `${w.ruP} ${w.s} ${w.ruR[ri]}.`,
          answer: `${w.part} ${w.s} ${w.res[ri]}.`,
          distractors: ['Being', 'Having been', 'Been'],
          keywords: w.kw,
          explain: 'Unit 2 Grammar File §7: время и место пребывания («когда был в…») → ТОЛЬКО When + clause (НЕ Being!).',
        };
      },
    },
    {
      id: 'en-u2-not-without',
      minLesson: 2,
      unit: 'u2',
      est: 36,
      label: 'U2 · Not + V-ing vs Without + V-ing',
      title: 'Unit 2 · Отрицательные обороты: NOT (причина) vs WITHOUT («не сделав»)',
      explain: 'Not + V-ing выражает ПРИЧИНУ («не зная…»); Without + V-ing — отсутствие сопутствующего действия («не сказав ни слова / не заплатив»).',
      gen() {
        const subjs = [
          { en: 'the tourists', ru: 'туристы' },
          { en: 'the visitors', ru: 'посетители' },
          { en: 'he', ru: 'он' },
          { en: 'she', ru: 'она' },
        ];
        if (Math.random() < 0.5) {
          const notFrames = [
            { p: 'Not knowing the local language,', ruP: 'Не зная местного языка,', res: 'struggled to navigate the city', ruR: 'с трудом ориентировались в городе', kw: ['not', 'language'] },
            { p: 'Not understanding the safety instructions,', ruP: 'Не понимая правил безопасности,', res: 'entered the restricted area', ruR: 'вошли в закрытую зону', kw: ['not', 'instructions'] },
            { p: 'Not having enough experience,', ruP: 'Не имея достаточного опыта,', res: 'found the expedition very difficult', ruR: 'сочли экспедицию очень трудной', kw: ['not', 'experience'] },
            { p: 'Not noticing the warning signs,', ruP: 'Не заметив предупреждающих знаков,', res: 'went too far from the shore', ruR: 'ушли слишком далеко от берега', kw: ['not', 'signs'] },
          ];
          const f = pick(notFrames);
          const s = pick(subjs);
          return {
            ru: `${f.ruP} ${s.ru} ${f.ruR}.`,
            answer: `${f.p} ${s.en} ${f.res}.`,
            distractors: ['Without', 'No', "Don't"],
            keywords: f.kw,
            explain: 'Unit 2 Grammar File §8: Not + V-ing выражает причину («поскольку не…»).',
          };
        }
        const withoutFrames = [
          { res: 'left the meeting without saying a word', ruR: 'ушли со встречи, не сказав ни слова', kw: ['without', 'saying'] },
          { res: 'walked out of the café without paying for the drink', ruR: 'вышли из кафе, не заплатив за напиток', kw: ['without', 'paying'] },
          { res: 'explored the old village without hiring a guide', ruR: 'осмотрели старую деревню, не нанимая гида', kw: ['without', 'hiring'] },
          { res: 'answered the question without looking at the notes', ruR: 'ответили на вопрос, не глядя в заметки', kw: ['without', 'looking'] },
          { res: 'took several pictures without using a flash', ruR: 'сделали несколько снимков, не используя вспышку', kw: ['without', 'using'] },
        ];
        const f = pick(withoutFrames);
        const s = pick(subjs);
        return {
          ru: `${cap(s.ru)} ${f.ruR}.`,
          answer: `${cap(s.en)} ${f.res}.`,
          distractors: ['not', 'to', 'no'],
          keywords: f.kw,
          explain: 'Unit 2 Grammar File §8: Without + V-ing = «не сделав чего-либо» (отсутствие действия).',
        };
      },
    },

    // --- UNIT 3 (minLesson: 3) ---
    {
      id: 'en-u3-forms',
      minLesson: 3,
      unit: 'u3',
      est: 23,
      label: 'U3 · Формы герундия (Active/Passive/Perfect/Not)',
      title: 'Unit 3 · 4 формы герундия и отрицание (NOT + V-ing)',
      explain: 'Simple Active (doing), Simple Passive (being done), Perfect Active (having done), Perfect Passive (having been done). Отрицание: NOT прямо перед герундием.',
      gen() {
        const people = [
          { en: 'She', sg: true, ru: 'Она' },
          { en: 'He', sg: true, ru: 'Он' },
          { en: 'Nobody', sg: true, ru: 'Никто не' },
          { en: 'Many people', sg: false, ru: 'Многие люди' },
        ];
        const frames = [
          { vSg: "can't stand", vPl: "can't stand", ruSg: 'не выносит', ruPl: 'не выносят', g: 'being interrupted during a speech', ruG: 'когда перебивают во время выступления', d: ['interrupting', 'to be interrupt'], kw: ["can't stand", 'being interrupted'] },
          { vSg: 'dislikes', vPl: 'dislike', ruSg: 'не любит', ruPl: 'не любят', g: 'being criticized in public', ruG: 'когда критикуют публично', d: ['criticizing', 'to criticize'], kw: ['being criticized'] },
          { vSg: 'feels anxious about', vPl: 'feel anxious about', ruSg: 'тревожится из-за того', ruPl: 'тревожатся из-за того', g: 'being judged for seeking help', ruG: 'что осудят за обращение за помощью', d: ['judging', 'to judge'], kw: ['being judged'] },
          { vSg: 'regretted', vPl: 'regretted', ruSg: 'пожалел(а)', ruPl: 'пожалели', g: 'not preparing for the exam in advance', ruG: 'что не подготовились к экзамену заранее', d: ['not to prepare', 'to not prepare'], kw: ['regret', 'not preparing'] },
          { vSg: 'denied', vPl: 'denied', ruSg: 'отрицал(а)', ruPl: 'отрицали', g: 'having missed the deadline last week', ruG: 'что пропустили дедлайн на прошлой неделе', d: ['to miss', 'being missed'], kw: ['deny', 'deadline'] },
          { vSg: 'was uncomfortable with', vPl: 'were uncomfortable with', ruSg: 'чувствовал(а) дискомфорт от', ruPl: 'чувствовали дискомфорт от', g: 'being examined by several doctors', ruG: 'осмотра несколькими врачами', d: ['examining', 'to examine'], kw: ['being examined'] },
        ];
        const p = pick(people);
        const f = pick(frames);
        if (p.en === 'Nobody' && (f.vSg === "can't stand" || f.vSg === 'dislikes')) {
          return {
            ru: 'Никто не любит, когда его критикуют публично.',
            answer: 'Nobody enjoys being criticized in public.',
            distractors: ['criticizing', 'to criticize', 'criticized'],
            keywords: ['enjoy', 'being criticized'],
            explain: 'Unit 3 Grammar File §1: Simple Passive Gerund = being + V3.',
          };
        }
        return {
          ru: `${p.ru} ${p.sg ? f.ruSg : f.ruPl}: ${f.ruG}.`,
          answer: `${p.en} ${p.sg ? f.vSg : f.vPl} ${f.g}.`,
          distractors: [...f.d, 'having'],
          keywords: f.kw,
          explain: 'Unit 3 Grammar File §1: Passive Gerund = being + V3; Perfect Gerund = having + V3; отрицание = NOT прямо перед герундием.',
        };
      },
    },
    {
      id: 'en-u3-gerund-verbs',
      minLesson: 3,
      unit: 'u3',
      est: 60,
      label: 'U3 · Глаголы + Gerund (без предлога)',
      title: 'Unit 3 · Глаголы, требующие герундия (avoid, suggest, consider, deny, postpone…)',
      explain: 'После admit, avoid, consider, deny, enjoy, finish, imagine, involve, mind, postpone, put off, resent, risk, suggest ставится только Gerund (V-ing), НЕ to-Infinitive!',
      gen() {
        const subjs = [
          { en: 'They', ru: 'Они', sg: false },
          { en: 'She', ru: 'Она', sg: true },
          { en: 'He', ru: 'Он', sg: true },
          { en: 'We', ru: 'Мы', sg: false },
          { en: 'The students', ru: 'Студенты', sg: false },
          { en: 'The team', ru: 'Команда', sg: true },
        ];
        const frames = [
          { vSg: 'suggests', vPl: 'suggest', ruSg: 'предлагает', ruPl: 'предлагают', obj: 'discussing this issue after class', ruObj: 'обсудить этот вопрос после пары', d: ['to discuss', 'us to discuss'], kw: ['suggest', 'issue'] },
          { vSg: 'avoids', vPl: 'avoid', ruSg: 'избегает', ruPl: 'избегают', obj: 'discussing personal setbacks at work', ruObj: 'обсуждать личные неудачи на работе', d: ['to discuss', 'discuss'], kw: ['avoid', 'setbacks'] },
          { vSg: 'is considering', vPl: 'are considering', ruSg: 'обдумывает', ruPl: 'обдумывают', obj: 'changing daily habits to prevent burnout', ruObj: 'смену привычек ради профилактики выгорания', d: ['to change', 'change'], kw: ['consider', 'burnout'] },
          { vSg: 'postponed', vPl: 'postponed', ruSg: 'отложил(а)', ruPl: 'отложили', obj: 'making a final decision until Monday', ruObj: 'принятие окончательного решения до понедельника', d: ['to make', 'make'], kw: ['postpone', 'decision'] },
          { vSg: 'denied', vPl: 'denied', ruSg: 'отрицал(а)', ruPl: 'отрицали', obj: 'ignoring the warning signs of stress', ruObj: 'что игнорировали признаки стресса', d: ['to ignore', 'ignore'], kw: ['deny', 'stress'] },
          { vSg: 'admitted', vPl: 'admitted', ruSg: 'признал(а)', ruPl: 'признали', obj: 'not checking the instructions carefully', ruObj: 'что не проверили инструкции внимательно', d: ['not to check', 'to not check'], kw: ['admit'] },
          { vSg: 'risks', vPl: 'risk', ruSg: 'рискует', ruPl: 'рискуют', obj: 'losing motivation without enough rest', ruObj: 'потерять мотивацию без достаточного отдыха', d: ['to lose', 'lose'], kw: ['risk', 'rest'] },
          { vSg: 'enjoys', vPl: 'enjoy', ruSg: 'любит', ruPl: 'любят', obj: 'spending quiet time in nature', ruObj: 'проводить спокойное время на природе', d: ['to spend', 'spend'], kw: ['enjoy', 'nature'] },
          { vSg: 'put off', vPl: 'put off', ruSg: 'отложил(а)', ruPl: 'отложили', obj: 'launching the new wellness programme', ruObj: 'запуск новой программы благополучия', d: ['to launch', 'launch'], kw: ['put off'] },
          { vSg: 'recommended', vPl: 'recommended', ruSg: 'рекомендовал(а)', ruPl: 'рекомендовали', obj: 'keeping a diary of emotions', ruObj: 'вести дневник эмоций', d: ['to keep', 'keep'], kw: ['recommend'] },
        ];
        const s = pick(subjs);
        const f = pick(frames);
        return {
          ru: `${s.ru} ${s.sg ? f.ruSg : f.ruPl} ${f.ruObj}.`,
          answer: `${s.en} ${s.sg ? f.vSg : f.vPl} ${f.obj}.`,
          distractors: [...f.d, 'having'],
          keywords: f.kw,
          explain: 'Unit 3 Grammar File §2: admit / avoid / consider / deny / enjoy / postpone / put off / recommend / risk / suggest + Gerund (без предлога и без to-Inf!).',
        };
      },
    },
    {
      id: 'en-u3-prep-fixed',
      minLesson: 3,
      unit: 'u3',
      est: 37,
      label: 'U3 · Предлоги и устойчивые выражения + Gerund',
      title: 'Unit 3 · Предлоги (insist on, object to, succeed in) и выражения (no point in, worth)',
      explain: 'После ВСЕХ предлогов (включая to в object to / look forward to / be used to!) и выражений It\'s worth / There\'s no point in / can\'t help — ставится Gerund!',
      gen() {
        const subjs = [
          { en: 'She', sg: true, ru: 'Она' },
          { en: 'He', sg: true, ru: 'Он' },
          { en: 'They', sg: false, ru: 'Они' },
          { en: 'We', sg: false, ru: 'Мы' },
        ];
        const prepFrames = [
          { vSg: 'succeeded in', vPl: 'succeeded in', ruSg: 'преуспел(а) в том, чтобы', ruPl: 'преуспели в том, чтобы', g: 'bouncing back from the setback', ruG: 'быстро оправиться после неудачи', d: ['on', 'to bounce'], kw: ['succeed in', 'bounce back', 'setback'] },
          { vSg: 'insisted on', vPl: 'insisted on', ruSg: 'настоял(а) на', ruPl: 'настояли на', g: 'doing additional medical tests', ruG: 'проведении дополнительных тестов', d: ['in', 'to do'], kw: ['insist on', 'tests'] },
          { vSg: 'objects to', vPl: 'object to', ruSg: 'возражает против', ruPl: 'возражают против', g: 'postponing the exam again', ruG: 'очередного переноса экзамена', d: ['against', 'to postpone'], kw: ['object to', 'postpone'] },
          { vSg: 'looks forward to', vPl: 'look forward to', ruSg: 'с нетерпением ждёт', ruPl: 'с нетерпением ждут', g: 'visiting the new science centre', ruG: 'посещения нового научного центра', d: ['to visit', 'for'], kw: ['look forward to'] },
          { vSg: 'apologized for', vPl: 'apologized for', ruSg: 'извинился(ась) за', ruPl: 'извинились за', g: 'arriving late for the seminar', ruG: 'опоздание на семинар', d: ['of', 'to arrive'], kw: ['apologize for'] },
          { vSg: 'is used to', vPl: 'are used to', ruSg: 'привык(ла)', ruPl: 'привыкли', g: 'dealing with high pressure at work', ruG: 'справляться с высоким давлением на работе', d: ['to deal', 'deal'], kw: ['be used to'] },
          { vSg: 'has trouble', vPl: 'have trouble', ruSg: 'испытывает трудности с', ruPl: 'испытывают трудности с', g: 'expressing complex emotions clearly', ruG: 'чётким выражением сложных эмоций', d: ['to express', 'in'], kw: ['have trouble'] },
          { vSg: "couldn't help", vPl: "couldn't help", ruSg: 'не мог(ла) не', ruPl: 'не могли не', g: 'smiling on hearing the good news', ruG: 'улыбнуться, услышав хорошие новости', d: ['to smile', 'smile'], kw: ["can't help"] },
        ];
        if (Math.random() < 0.78) {
          const s = pick(subjs);
          const f = pick(prepFrames);
          return {
            ru: `${s.ru} ${s.sg ? f.ruSg : f.ruPl} ${f.ruG}.`,
            answer: `${s.en} ${s.sg ? f.vSg : f.vPl} ${f.g}.`,
            distractors: [...f.d, 'of'],
            keywords: f.kw,
            explain: 'Unit 3 Grammar File §2–3: insist ON, succeed IN, object TO, look forward TO, apologize FOR, be used TO, have trouble, can\'t help + Gerund.',
          };
        }
        const fixed = [
          { ru: 'Нет смысла жаловаться на трудности — лучше действовать.', ans: 'There is no point in complaining about adversity.', d: ['to complain', 'of', 'complain'], kw: ['no point in', 'adversity'] },
          { ru: 'Эту статью действительно стоит прочитать.', ans: 'This article is really worth reading.', d: ['to read', 'read', 'of reading'], kw: ['worth', 'reading'] },
          { ru: 'Ничто не помешало ему добиться процветания.', ans: 'Nothing prevented him from thriving.', d: ['of', 'to thrive', 'out'], kw: ['prevent from', 'thrive'] },
          { ru: 'Журналист обвинил компанию в сокрытии важной информации.', ans: 'The journalist accused the company of hiding important information.', d: ['for', 'to hide', 'in'], kw: ['accuse of'] },
          { ru: 'Бесполезно притворяться, что стресс исчез сам по себе.', ans: 'It is no good pretending that stress disappeared on its own.', d: ['to pretend', 'pretend', 'in'], kw: ['no good'] },
        ];
        const it = pick(fixed);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 3 Grammar File §2–3: There\'s no point IN, be worth, prevent FROM, accuse OF, It\'s no good + Gerund.' };
      },
    },
    {
      id: 'en-u3-change',
      minLesson: 3,
      unit: 'u3',
      est: 29,
      label: 'U3 · Gerund vs Infinitive (смена смысла!)',
      title: 'Unit 3 · Remember / Forget / Stop / Try / Regret / Mean / Go on (+ V-ing vs + to V)',
      explain: 'remember/forget/regret + V-ing = прошлое; + to V = задача/новость. stop + V-ing = прекратить; + to V = остановиться ради цели. try + V-ing = эксперимент; + to V = стараться. mean + V-ing = означать; + to V = намереваться.',
      gen() {
        const subjs = [
          { en: 'She', sg: true, ru: 'Она' },
          { en: 'He', sg: true, ru: 'Он' },
          { en: 'They', sg: false, ru: 'Они' },
        ];
        const comb = [
          { v: 'stopped', g: 'using social media late at night', ru: 'перестали пользоваться соцсетями поздно ночью', d: ['to use', 'use'], kw: ['stop', 'social media'] },
          { v: 'stopped', g: 'to answer an urgent phone call', ru: 'остановились, чтобы ответить на срочный звонок', d: ['answering', 'answer'], kw: ['stop', 'call'] },
          { v: 'clearly remembered', g: 'taking that exam for the first time', ru: 'отчётливо помнили, как впервые сдавали тот экзамен', d: ['to take', 'take'], kw: ['remember', 'exam'] },
          { v: 'tried hard', g: 'to change the daily routine', ru: 'изо всех сил старались изменить распорядок дня', d: ['changing', 'change'], kw: ['try', 'routine'] },
          { v: 'regretted', g: 'not asking for help earlier', ru: 'пожалели, что не попросили о помощи раньше', d: ['not to ask', 'to not ask'], kw: ['regret', 'help'] },
          { v: 'went on', g: 'talking about self-acceptance till the end', ru: 'продолжали говорить о принятии себя до конца', d: ['to talk', 'talk'], kw: ['go on'] },
          { v: 'went on', g: 'to discuss possible solutions', ru: 'перешли к обсуждению возможных решений', d: ['discussing', 'discuss'], kw: ['go on', 'solutions'] },
          { v: 'preferred', g: 'walking to work to taking the bus', ru: 'предпочитали идти на работу пешком, а не ехать на автобусе', d: ['to walk', 'take'], kw: ['prefer'] },
        ];
        if (Math.random() < 0.72) {
          const s = pick(subjs);
          const c = pick(comb);
          return {
            ru: `${s.ru}: ${c.ru}.`,
            answer: `${s.en} ${c.v} ${c.g}.`,
            distractors: [...c.d, 'having'],
            keywords: c.kw,
            explain: 'Unit 3 Grammar File §4: смена значения после remember, forget, stop, try, regret, mean, go on, prefer (+ V-ing vs + to V).',
          };
        }
        const fixed = [
          { ru: 'Не забудь отправить домашнее задание до пятницы.', ans: 'Remember to submit the homework before Friday.', d: ['submitting', 'submit', 'having submitted'], kw: ['remember', 'homework'] },
          { ru: 'Попробуй повторять слова каждый день по пять минут (как способ).', ans: 'Try revising the words for five minutes every day.', d: ['to revise', 'revise', 'revised'], kw: ['try', 'revise'] },
          { ru: 'С сожалением сообщаем вам, что расписание изменилось.', ans: 'We regret to inform you that the schedule has changed.', d: ['informing', 'inform', 'informed'], kw: ['regret', 'inform'] },
          { ru: 'Улучшение самочувствия часто означает изменение повседневных привычек.', ans: 'Improving well-being often means making changes to everyday habits.', d: ['to make', 'make', 'made'], kw: ['mean', 'well-being'] },
          { ru: 'Я не хотел критиковать твой образ жизни.', ans: "I didn't mean to criticise your lifestyle choices.", d: ['criticising', 'criticise', 'criticised'], kw: ['mean', 'lifestyle'] },
        ];
        const it = pick(fixed);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 3 Grammar File §4: remember/regret/mean/try + Gerund vs + to-Infinitive.' };
      },
    },
  ];

  // ============================================================================
  // PUBLIC API FOR OFFLINE GENERATOR
  // ============================================================================
  function getTopics(subject, passedLesson) {
    const all = subject === 'fr' ? FR_TOPICS : subject === 'en' ? EN_TOPICS : [];
    return all.filter((t) => t.minLesson <= passedLesson);
  }

  function getAllTopics(subject) {
    return subject === 'fr' ? FR_TOPICS : subject === 'en' ? EN_TOPICS : [];
  }

  function estimateCount(subject, passedLesson) {
    return getTopics(subject, passedLesson).reduce((acc, t) => acc + (t.est || 20), 0);
  }

  // Fallback builder item from a real textbook card that has an example
  function makeCardContextItem(card, subject) {
    const rawEx = (card.ex || '').split('/')[0].trim();
    if (rawEx && rawEx.length >= 14 && rawEx.length <= 135 && !rawEx.includes('—')) {
      return {
        id: 'b-card-' + card.id,
        topicId: 'vocab-context',
        minLesson: 0,
        unit: card.unit,
        ruleTitle: `${card.tag || 'Лексика'} · Контекст учебника`,
        ru: `Собери фразу со словом «${card.ru}» (${card.term})`,
        answer: rawEx,
        tokens: tokenizeSentence(rawEx),
        distractors: subject === 'fr' ? ['de', 'que', 'au'] : ['to', 'for', 'being'],
        explain: `Слово из учебника: ${card.term} — ${card.ru}${card.coll ? ' · Колл.: ' + card.coll : ''}`,
        keywords: [card.term],
        isAi: false,
      };
    }
    return null;
  }

  function generateOffline({ subject, passedLesson, units = [], topicId = '', focusMode = 'all', targetWords = [], cardsPool = [], count = 8 }) {
    const allowed = getTopics(subject, passedLesson);
    if (!allowed.length) return [];

    let chosen = allowed;
    if (topicId) {
      const exact = allowed.filter((t) => t.id === topicId);
      if (exact.length) chosen = exact;
    } else if (units.length && focusMode === 'all') {
      const uSet = new Set(units);
      const inUnits = allowed.filter((t) => uSet.has(t.unit));
      if (inUnits.length) chosen = inUnits;
    }

    const perTopic = Math.max(3, Math.ceil((count + 6) / chosen.length));
    let rawItems = [];
    chosen.forEach((t) => {
      const sampled = sampleFromGen(() => {
        const g = t.gen();
        if (!g) return null;
        return {
          id: `b-${t.id}-${Math.random().toString(36).slice(2, 7)}`,
          topicId: t.id,
          minLesson: t.minLesson,
          unit: t.unit,
          ruleTitle: t.label,
          ru: g.ru,
          answer: g.answer,
          tokens: tokenizeSentence(g.answer),
          distractors: g.distractors || [],
          explain: g.explain || t.explain,
          keywords: g.keywords || [],
          isAi: false,
        };
      }, perTopic, targetWords);
      rawItems = rawItems.concat(sampled);
    });

    // If user explicitly picked custom words or cards with textbook examples, blend matching context cards!
    if ((focusMode === 'custom' || focusMode === 'green' || focusMode === 'mistakes') && targetWords.length && cardsPool.length) {
      const lower = targetWords.map((w) => w.toLowerCase());
      const ctxItems = [];
      for (const c of cardsPool) {
        const tLow = c.term.toLowerCase();
        if (lower.some((w) => tLow.includes(w) || w.includes(tLow.replace(/\([^)]*\)/g, '').trim()))) {
          const ci = makeCardContextItem(c, subject);
          if (ci) ctxItems.push(ci);
        }
        if (ctxItems.length >= Math.ceil(count / 2)) break;
      }
      if (ctxItems.length) {
        rawItems = [...ctxItems, ...rawItems];
      }
    }

    // Deduplicate & score by targetWords if provided
    const dedup = [];
    const seen = new Set();
    for (const it of rawItems) {
      if (seen.has(it.answer)) continue;
      seen.add(it.answer);
      dedup.push(it);
    }

    if (targetWords.length) {
      const lw = targetWords.map((w) => w.toLowerCase());
      const scored = dedup.map((it) => {
        const hay = (it.answer + ' ' + (it.keywords || []).join(' ')).toLowerCase();
        const sc = lw.reduce((a, w) => a + (hay.includes(w) ? 1 : 0), 0);
        return { it, sc, r: Math.random() };
      });
      scored.sort((a, b) => (b.sc - a.sc) || (a.r - b.r));
      return scored.slice(0, count).map((x) => x.it);
    }

    return shuffle(dedup).slice(0, count);
  }

  // ============================================================================
  // HYBRID ONLINE AI CLIENT (Zero-CORS via AndroidBridge.httpPostJson in APK,
  // standard fetch() in browser; supports DeepSeek / OpenRouter / Gemini / Custom)
  // ============================================================================
  const AI_PRESETS = {
    deepseek: {
      name: 'DeepSeek (работает в РФ без VPN)',
      url: 'https://api.deepseek.com/chat/completions',
      model: 'deepseek-chat',
    },
    openrouter: {
      name: 'OpenRouter (много моделей, есть бесплатные)',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      model: 'google/gemini-2.0-flash-001',
    },
    gemini: {
      name: 'Google Gemini (OpenAI API)',
      url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      model: 'gemini-2.0-flash',
    },
    custom: {
      name: 'Свой OpenAI-совместимый API / прокси',
      url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o-mini',
    },
  };

  const pendingNativeReqs = {};
  window.__onNativeHttp = function (reqId, ok, status, text) {
    const cb = pendingNativeReqs[reqId];
    if (!cb) return;
    delete pendingNativeReqs[reqId];
    cb({ ok: !!ok, status: Number(status || 0), text: String(text || '') });
  };

  function postJson(url, apiKey, payload) {
    const bodyStr = JSON.stringify(payload);
    if (window.AndroidBridge && typeof window.AndroidBridge.httpPostJson === 'function') {
      return new Promise((resolve, reject) => {
        const reqId = 'req_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        const timer = setTimeout(() => {
          if (pendingNativeReqs[reqId]) {
            delete pendingNativeReqs[reqId];
            reject(new Error('Таймаут ответа от ИИ (30 сек)'));
          }
        }, 30000);
        pendingNativeReqs[reqId] = (res) => {
          clearTimeout(timer);
          resolve(res);
        };
        try {
          window.AndroidBridge.httpPostJson(reqId, url, 'Bearer ' + apiKey, bodyStr);
        } catch (e) {
          clearTimeout(timer);
          delete pendingNativeReqs[reqId];
          reject(e);
        }
      });
    }
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: bodyStr,
    }).then(async (r) => ({ ok: r.ok, status: r.status, text: await r.text() }));
  }

  async function callChatApi(aiCfg, systemPrompt, userPrompt) {
    if (!aiCfg || !aiCfg.apiKey || !aiCfg.url || !aiCfg.model) {
      throw new Error('Сначала укажи API-ключ в Настройках → ИИ-репетитор');
    }
    const res = await postJson(aiCfg.url.trim(), aiCfg.apiKey.trim(), {
      model: aiCfg.model.trim(),
      temperature: 0.55,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });
    if (!res.ok) {
      let msg = `Ошибка API (HTTP ${res.status})`;
      try {
        const j = JSON.parse(res.text);
        if (j.error?.message) msg += ': ' + j.error.message.slice(0, 140);
      } catch {}
      throw new Error(msg);
    }
    const data = JSON.parse(res.text);
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Пустой ответ от ИИ');
    return content;
  }

  function extractJsonBlock(text) {
    const cleaned = String(text).replace(/```json\s*/gi, '').replace(/```/g, '').trim();
    const firstArr = cleaned.indexOf('[');
    const firstObj = cleaned.indexOf('{');
    let start = -1;
    let end = -1;
    if (firstArr !== -1 && (firstObj === -1 || firstArr < firstObj)) {
      start = firstArr;
      end = cleaned.lastIndexOf(']');
    } else if (firstObj !== -1) {
      start = firstObj;
      end = cleaned.lastIndexOf('}');
    }
    if (start === -1 || end <= start) throw new Error('ИИ вернул некорректный JSON');
    return JSON.parse(cleaned.slice(start, end + 1));
  }

  function boundaryConstraintPrompt(subject, passedLesson) {
    if (subject === 'fr') {
      const forbidden = [];
      if (passedLesson < 6) forbidden.push('futur simple');
      if (passedLesson < 7) forbidden.push('plus-que-parfait', 'voix passive');
      if (passedLesson < 8) forbidden.push('местоимения en/y', 'futur dans le passé');
      if (passedLesson < 9) forbidden.push('косвенная речь с согласованием времён');
      if (passedLesson < 10) forbidden.push('subjonctif');
      if (passedLesson === 0) forbidden.push('passé composé', 'imparfait', 'gérondif', 'qui/que/où');
      return `Учебник: Accent français (МГИМО). Студент сейчас строго на уровне: ${passedLesson === 0 ? 'A1 (L1–13)' : 'A1 + A2 уроки 1–' + passedLesson}. ` +
        (forbidden.length ? `СТРОГО ЗАПРЕЩЕНО использовать непройденную грамматику: ${forbidden.join(', ')}! ` : '') +
        `Используй только лексику и грамматику пройденных уроков.`;
    }
    const forbiddenEn = [];
    if (passedLesson < 2) forbiddenEn.push('Participle clauses');
    if (passedLesson < 3) forbiddenEn.push('Gerund constructions');
    return `Учебник: Winning Strategy (МГИМО, General English). Пройдено строго: Unit 1–${passedLesson}. ` +
      (forbiddenEn.length ? `НЕ используй: ${forbiddenEn.join(', ')}. ` : '') +
      `Опирайся на активную лексику (AV) и Grammar File пройденных юнитов.`;
  }

  async function testConnection(aiCfg) {
    const reply = await callChatApi(
      aiCfg,
      'Reply with one word: OK',
      'Ping'
    );
    return reply.trim().slice(0, 40);
  }

  async function aiGenerate({ aiCfg, subject, passedLesson, topicTitle, targetWords = [], count = 5 }) {
    const langName = subject === 'fr' ? 'французском' : 'английском';
    const sys = `Ты строгий преподаватель МГИМО. ${boundaryConstraintPrompt(subject, passedLesson)}
Верни ТОЛЬКО валидный JSON-массив из ${count} объектов без пояснений снаружи:
[{"ru":"предложение на русском","answer":"перевод на ${langName}","distractors":["ловушка1","ловушка2"],"ruleTitle":"короткое название правила","explain":"понятное объяснение на русском (1-2 предложения)"}]`;

    const wordsHint = targetWords.length
      ? `Обязательно органично используй эти слова/выражения из учебника: ${targetWords.slice(0, 14).join(', ')}.`
      : 'Используй естественную активную лексику из пройденных уроков.';
    const topicHint = topicTitle ? `Фокус грамматики: ${topicTitle}.` : 'Микс пройденных грамматических правил.';

    const raw = await callChatApi(aiCfg, sys, `${topicHint}\n${wordsHint}\nСгенерируй ровно ${count} естественных, живых предложений уровня среза МГИМО.`);
    const arr = extractJsonBlock(raw);
    if (!Array.isArray(arr) || !arr.length) throw new Error('ИИ не вернул список предложений');

    return arr.slice(0, count).map((it, i) => ({
      id: `ai-${Date.now()}-${i}`,
      topicId: 'ai-live',
      minLesson: 0,
      unit: '',
      ruleTitle: '✨ ИИ · ' + (it.ruleTitle || topicTitle || 'Живая практика'),
      ru: String(it.ru || '').trim(),
      answer: String(it.answer || '').trim(),
      tokens: tokenizeSentence(it.answer),
      distractors: Array.isArray(it.distractors) ? it.distractors.map(String).slice(0, 3) : [],
      explain: String(it.explain || '').trim(),
      keywords: targetWords.slice(0, 5),
      isAi: true,
    })).filter((x) => x.ru && x.answer);
  }

  async function aiCheck({ aiCfg, subject, passedLesson, item, userAnswer }) {
    const sys = `Ты преподаватель МГИМО. ${boundaryConstraintPrompt(subject, passedLesson)}
Проверь перевод студента. Если перевод грамматически и по смыслу верен (даже синонимом или другим порядком слов в рамках пройденного уровня) — засчитай верным.
Верни ТОЛЬКО JSON-объект:
{"verdict":"correct"|"almost"|"wrong","feedback":"короткий и понятный разбор по-русски (2-3 предложения)","better":"идеальный вариант ответа"}`;

    const prompt = `Русский оригинал: ${item.ru}
Эталон: ${item.answer}
Правило: ${item.ruleTitle}
Ответ студента: ${userAnswer}`;

    const raw = await callChatApi(aiCfg, sys, prompt);
    const obj = extractJsonBlock(raw);
    return {
      verdict: ['correct', 'almost', 'wrong'].includes(obj.verdict) ? obj.verdict : 'almost',
      feedback: String(obj.feedback || ''),
      better: String(obj.better || item.answer),
    };
  }

  window.BuilderEngine = {
    AI_PRESETS,
    getTopics,
    getAllTopics,
    estimateCount,
    generateOffline,
    tokenizeSentence,
    testConnection,
    aiGenerate,
    aiCheck,
  };
})();
