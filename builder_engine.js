/* LinguaPrep · Hybrid Sentence Builder Engine (Offline Parametric + Optional Online AI) */
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

  // Smart tokenizer for French & English tiles (keeps punctuation cleanly attached or separate)
  function tokenizeSentence(s) {
    const clean = String(s || '').trim().replace(/\s+/g, ' ');
    if (!clean) return [];
    // Split on spaces; keep French elisions like "l'appartement", "c'est", "qu'il" intact as readable tiles
    return clean.split(' ').filter(Boolean);
  }

  // Build unique items by sampling combinations from a generator function
  function sampleFromGen(genFn, targetCount, filterWords = []) {
    const seen = new Set();
    const pool = [];
    const maxAttempts = Math.max(40, targetCount * 14);
    for (let i = 0; i < maxAttempts; i++) {
      const item = genFn();
      if (!item || !item.answer || seen.has(item.answer)) continue;
      seen.add(item.answer);
      pool.push(item);
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
  // FRENCH GRAMMAR TOPICS & PARAMETRIC GENERATORS (Accent français A1 -> A2 L10)
  // Every single combination is grammatically, semantically & agreement-verified!
  // ============================================================================
  const FR_TOPICS = [
    // --- A1 (minLesson: 0) ---
    {
      id: 'fr-a1-present',
      minLesson: 0,
      unit: 'a1-1',
      label: 'A1 · Présent, être & 1-я группа',
      title: 'A1 · Настоящее время (être, avoir, 1-я группа)',
      explain: 'Глаголы 1-й группы (-er) в présent: -e, -es, -e, -ons, -ez, -ent. После être перед профессией артикль не ставится.',
      gen() {
        const mode = Math.floor(Math.random() * 2);
        if (mode === 0) {
          const subjs = [
            { fr: 'Je suis', ru: 'Я', f: false },
            { fr: 'Mon ami est', ru: 'Мой друг', f: false },
            { fr: 'Ma sœur est', ru: 'Моя сестра', f: true },
            { fr: 'Mon voisin est', ru: 'Мой сосед', f: false },
          ];
          const profs = [
            { m: 'étudiant à Moscou.', f: 'étudiante à Moscou.', ru: 'учится (студент) в Москве.', kw: ['étudiant', 'Moscou'] },
            { m: 'ingénieur à Paris.', f: 'ingénieure à Paris.', ru: 'инженер в Париже.', kw: ['ingénieur', 'Paris'] },
            { m: 'professeur de français.', f: 'professeur de français.', ru: 'преподаватель французского.', kw: ['professeur', 'français'] },
            { m: 'journaliste à Lyon.', f: 'journaliste à Lyon.', ru: 'журналист в Лионе.', kw: ['journaliste'] },
          ];
          const s = pick(subjs);
          const p = pick(profs);
          const ans = `${s.fr} ${s.f ? p.f : p.m}`;
          return {
            ru: `${s.ru} — ${p.ru}`,
            answer: ans,
            distractors: ['un', 'une', 'sommes', 'avez'],
            keywords: p.kw,
            explain: 'После глагола être перед названием профессии артикль опускается (без определения).',
          };
        }
        const subjs = [
          { fr: 'Je', v: 'habite', v2: 'parle', v3: 'travaille', ru: 'Я', r1: 'живу', r2: 'говорю', r3: 'работаю' },
          { fr: 'Nous', v: 'habitons', v2: 'parlons', v3: 'travaillons', ru: 'Мы', r1: 'живём', r2: 'говорим', r3: 'работаем' },
          { fr: 'Ils', v: 'habitent', v2: 'parlent', v3: 'travaillent', ru: 'Они', r1: 'живут', r2: 'говорят', r3: 'работают' },
          { fr: 'Vous', v: 'habitez', v2: 'parlez', v3: 'travaillez', ru: 'Вы', r1: 'живёте', r2: 'говорите', r3: 'работаете' },
        ];
        const s = pick(subjs);
        const variants = [
          { fr: `${s.fr === 'Je' ? "J'habite" : s.fr + ' ' + s.v} près de l'université.`, ru: `${s.ru} ${s.r1} рядом с университетом.`, d: ['habites', 'à la', 'dans'], kw: ['habiter', 'université'] },
          { fr: `${s.fr} ${s.v2} français avec mes amis.`, ru: `${s.ru} ${s.r2} по-французски с друзьями.`, d: ['parlez', 'du', 'en'], kw: ['parler', 'français', 'amis'] },
          { fr: `${s.fr} ${s.v3} beaucoup cette semaine.`, ru: `${s.ru} много ${s.r3} на этой неделе.`, d: ['travaillons', 'ce', 'très'], kw: ['travailler', 'semaine'] },
        ];
        const v = pick(variants);
        return { ru: v.ru, answer: v.fr, distractors: v.d, keywords: v.kw, explain: 'A1: спряжение глаголов 1-й группы (-er) в présent + элизия je → j\' перед гласной/немым h.' };
      },
    },
    {
      id: 'fr-a1-neg',
      minLesson: 0,
      unit: 'a1-3',
      label: 'A1 · Отрицание ne…pas',
      title: 'A1 · Отрицательная форма ne…pas / n\'…pas',
      explain: 'В отрицании ne (n\' перед гласной) ставится перед глаголом, pas — после глагола.',
      gen() {
        const items = [
          { ru: 'Я не знаю этот адрес.', ans: "Je ne connais pas cette adresse.", d: ['ce', 'cet', 'de'], kw: ['connaître', 'adresse'] },
          { ru: 'Он не любит холодную погоду.', ans: "Il n'aime pas le temps froid.", d: ['ne', 'du', 'froide'], kw: ['aimer', 'temps', 'froid'] },
          { ru: 'Мы не живём в центре города.', ans: "Nous n'habitons pas dans le centre-ville.", d: ['ne', 'habite', 'au'], kw: ['habiter', 'centre-ville'] },
          { ru: 'Она не работает по воскресеньям.', ans: "Elle ne travaille pas le dimanche.", d: ["n'", 'au', 'des'], kw: ['travailler', 'dimanche'] },
          { ru: 'Это не мой словарь.', ans: "Ce n'est pas mon dictionnaire.", d: ['ne', 'ma', 'un'], kw: ['dictionnaire'] },
          { ru: 'Они не понимают этот вопрос.', ans: "Ils ne comprennent pas cette question.", d: ['ce', 'comprenons', 'de'], kw: ['comprendre', 'question'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A1 L3: ne + глагол + pas (перед гласной/немым h → n\'). После глаголов чувств (aimer) определённый артикль сохраняется!' };
      },
    },
    {
      id: 'fr-a1-aller-faire',
      minLesson: 0,
      unit: 'a1-4',
      label: 'A1 · Aller / Faire / Погода и спорт',
      title: 'A1 · Глаголы aller à, faire du/de la, погода',
      explain: 'aller + à (+ le = au, + les = aux); faire + du / de la / de l\' + вид спорта/занятие.',
      gen() {
        const subjs = [
          { fr: 'Je', va: 'vais', fait: 'fais', ru: 'Я', go: 'иду', do: 'занимаюсь' },
          { fr: 'Nous', va: 'allons', fait: 'faisons', ru: 'Мы', go: 'идём', do: 'занимаемся' },
          { fr: 'Mon frère', va: 'va', fait: 'fait', ru: 'Мой брат', go: 'идёт', do: 'занимается' },
          { fr: 'Mes amis', va: 'vont', fait: 'font', ru: 'Мои друзья', go: 'идут', do: 'занимаются' },
        ];
        const s = pick(subjs);
        const places = [
          { fr: 'à la bibliothèque', ru: 'в библиотеку', d: ['au', 'en'], kw: ['bibliothèque', 'aller'] },
          { fr: 'au cinéma ce soir', ru: 'в кино сегодня вечером', d: ['à le', 'dans'], kw: ['cinéma', 'soir'] },
          { fr: 'à la gare en métro', ru: 'на вокзал на метро', d: ['au', 'par'], kw: ['gare', 'métro'] },
          { fr: 'au parc le matin', ru: 'в парк утром', d: ['à le', 'dans'], kw: ['parc', 'matin'] },
        ];
        const sports = [
          { fr: 'du vélo', ru: 'велоспортом', d: ['le', 'de la'], kw: ['vélo', 'faire'] },
          { fr: 'du sport', ru: 'спортом', d: ['le', 'de'], kw: ['sport', 'faire'] },
          { fr: 'de la natation', ru: 'плаванием', d: ['du', 'la'], kw: ['natation', 'faire'] },
          { fr: 'des courses', ru: 'покупками', d: ['les', 'du'], kw: ['courses', 'faire'] },
        ];
        if (Math.random() < 0.5) {
          const p = pick(places);
          return { ru: `${s.ru} ${s.go} ${p.ru}.`, answer: `${s.fr} ${s.va} ${p.fr}.`, distractors: p.d, keywords: p.kw, explain: 'A1: aller (je vais, tu vas, il va, nous allons, vous allez, ils vont) + à la / au (à + le).' };
        }
        const sp = pick(sports);
        return { ru: `${s.ru} ${s.do} ${sp.ru}.`, answer: `${s.fr} ${s.fait} ${sp.fr}.`, distractors: sp.d, keywords: sp.kw, explain: 'A1 L4/L12: faire + du (м.р.) / de la (ж.р.) / des (мн.ч.).' };
      },
    },
    {
      id: 'fr-a1-det',
      minLesson: 0,
      unit: 'a1-5',
      label: 'A1 · Указательные и притяжательные',
      title: 'A1 · Ce / cet / cette / ces и mon / ma / mes',
      explain: 'ce — м.р. перед согласной; cet — м.р. перед гласной/немым h; cette — ж.р.; ces — мн.ч. Перед ж.р. на гласную вместо ma/ta/sa ставится mon/ton/son!',
      gen() {
        const items = [
          { ru: 'Этот отель находится рядом с вокзалом.', ans: "Cet hôtel est près de la gare.", d: ['Ce', 'Cette', 'au'], kw: ['hôtel', 'gare'] },
          { ru: 'Эта квартира очень светлая.', ans: "Cet appartement est très lumineux.", d: ['Ce', 'Cette', 'lumineuse'], kw: ['appartement', 'lumineux'] },
          { ru: 'Моя подруга живёт в этой комнате.', ans: "Mon amie habite dans cette chambre.", d: ['Ma', 'ce', 'cet'], kw: ['amie', 'chambre'] },
          { ru: 'Эти книги очень интересные.', ans: "Ces livres sont très intéressants.", d: ['Ce', 'Cette', 'est'], kw: ['livres', 'intéressant'] },
          { ru: 'Его университет очень большой.', ans: "Son université est très grande.", d: ['Sa', 'grand', 'ce'], kw: ['université', 'grand'] },
          { ru: 'Этот студент хорошо говорит по-французски.', ans: "Cet étudiant parle bien français.", d: ['Ce', 'Cette', 'parlent'], kw: ['étudiant', 'français'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A1 L3/L5: cet (м.р. перед гласной/h: cet hôtel, cet appartement, cet étudiant); mon/ton/son перед ж.р. на гласную (mon amie, son université).' };
      },
    },
    {
      id: 'fr-a1-questions',
      minLesson: 0,
      unit: 'a1-6',
      label: 'A1 · Вопросы (Est-ce que, Où, Quand, Quel)',
      title: 'A1 · Вопросительные конструкции',
      explain: 'Est-ce que + прямой порядок слов; Quel/Quelle/Quels/Quelles согласуется с существительным.',
      gen() {
        const items = [
          { ru: 'Который час?', ans: "Quelle heure est-il ?", d: ['Quel', 'Quels', 'est-ce'], kw: ['heure'] },
          { ru: 'В котором часу ты приезжаешь?', ans: "À quelle heure est-ce que tu arrives ?", d: ['quel', 'qui', 'arrive'], kw: ['heure', 'arriver'] },
          { ru: 'Где вы живёте?', ans: "Où est-ce que vous habitez ?", d: ['Quand', 'Que', 'habite'], kw: ['habiter'] },
          { ru: 'Какая сегодня погода?', ans: "Quel temps fait-il aujourd'hui ?", d: ['Quelle', 'est-il', 'fait'], kw: ['temps', 'météo'] },
          { ru: 'Что ты делаешь вечером?', ans: "Qu'est-ce que tu fais le soir ?", d: ['Est-ce que', 'qui', 'fait'], kw: ['faire', 'soir'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A1: quel (м.р.) / quelle (ж.р.: quelle heure); est-ce que сохраняет прямой порядок слов.' };
      },
    },

    // --- A2 L1 (minLesson: 1) ---
    {
      id: 'fr-a2-1-refl',
      minLesson: 1,
      unit: 'a2-1',
      label: 'A2 L1 · Возвратные глаголы',
      title: 'A2 L1 · Возвратные глаголы (se lever, se réveiller, se reposer)',
      explain: 'Возвратное местоимение меняется по лицам (me, te, se, nous, vous, se). В passé composé ВСЕ возвратные глаголы спрягаются с être!',
      gen() {
        const items = [
          { ru: 'Я встаю в семь часов утра.', ans: "Je me lève à sept heures du matin.", d: ['se', 'lèves', 'au'], kw: ['se lever', 'matin'] },
          { ru: 'Мы просыпаемся рано по будням.', ans: "Nous nous réveillons tôt en semaine.", d: ['se', 'vous', 'tard'], kw: ['se réveiller', 'semaine'] },
          { ru: 'Вечером он отдыхает после занятий.', ans: "Le soir il se repose après les cours.", d: ['me', 'reposes', 'avant'], kw: ['se reposer', 'cours'] },
          { ru: 'Вчера она прогулялась в парке.', ans: "Hier elle s'est promenée dans le parc.", d: ["s'a", 'promené', 'au'], kw: ['se promener', 'parc'] },
          { ru: 'Вчера мы легли спать поздно.', ans: "Hier nous nous sommes couchés tard.", d: ['avons', 'couché', 'tôt'], kw: ['se coucher', 'tard'] },
          { ru: 'Она не торопится утром.', ans: "Elle ne se dépêche pas le matin.", d: ['se ne', 'dépêches', 'de'], kw: ['se dépêcher', 'matin'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L1: возвратные глаголы — me/te/se/nous/vous/se; в отрицании ne…pas охватывает и местоимение, и глагол; в PC — всегда с être.' };
      },
    },
    {
      id: 'fr-a2-1-pc',
      minLesson: 1,
      unit: 'a2-1',
      label: 'A2 L1 · Passé composé (avoir и être)',
      title: 'A2 L1 · Passé composé (avoir vs être + согласование)',
      explain: 'Глаголы движения (aller, venir, partir, arriver, sortir, entrer, rester, tomber…) спрягаются с être, и participe passé согласуется с подлежащим в роде и числе.',
      gen() {
        const items = [
          { ru: 'Вчера я выпил чашку кофе.', ans: "Hier j'ai bu une tasse de café.", d: ['suis', 'boit', 'du'], kw: ['boire', 'café'] },
          { ru: 'На прошлой неделе она уехала в Лион.', ans: "La semaine dernière elle est partie à Lyon.", d: ['a', 'parti', 'en'], kw: ['partir', 'semaine'] },
          { ru: 'Они пришли на экзамен вовремя.', ans: "Ils sont arrivés à l'examen à l'heure.", d: ['ont', 'arrivé', 'en'], kw: ['arriver', 'examen'] },
          { ru: 'Мы прошли курс французского.', ans: "Nous avons suivi un cours de français.", d: ['sommes', 'suivre', 'du'], kw: ['suivre', 'cours'] },
          { ru: 'Мои подруги остались дома.', ans: "Mes amies sont restées à la maison.", d: ['ont', 'resté', 'restés'], kw: ['rester', 'maison'] },
          { ru: 'Ты уже посмотрел этот фильм?', ans: "Tu as déjà vu ce film ?", d: ['es', 'voir', 'cet'], kw: ['voir', 'film'] },
          { ru: 'Он вышел из дома без зонта.', ans: "Il est sorti de la maison sans parapluie.", d: ['a', 'sortie', 'du'], kw: ['sortir', 'maison'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L1: с être (aller, partir, arriver, rester, sortir…) p.p. согласуется с подлежащим (-e / -s / -es). Boire → bu, suivre → suivi, voir → vu.' };
      },
    },

    // --- A2 L2 (minLesson: 2) ---
    {
      id: 'fr-a2-2-partitif',
      minLesson: 2,
      unit: 'a2-2',
      label: 'A2 L2 · Partitif & количество',
      title: 'A2 L2 · Частичный артикль (du, de la, de l\', des) и количество',
      explain: 'Для неисчисляемой еды/напитков: du (м.р.), de la (ж.р.), de l\' (гласная), des (мн.ч.). После beaucoup / un peu / trop / un kilo — только DE без артикля!',
      gen() {
        const subjs = [
          { fr: 'Je prends', ru: 'Я беру' },
          { fr: 'Nous achetons', ru: 'Мы покупаем' },
          { fr: 'Il mange', ru: 'Он ест' },
          { fr: 'Elle veut', ru: 'Она хочет' },
        ];
        const foods = [
          { fr: 'du fromage et du pain', ru: 'сыр и хлеб', d: ['de', 'le', 'de la'], kw: ['fromage', 'pain'] },
          { fr: 'de la salade et du poisson', ru: 'салат и рыбу', d: ['du', 'la', 'de'], kw: ['salade', 'poisson'] },
          { fr: "de l'eau minérale", ru: 'минеральную воду', d: ['de la', 'du', 'de'], kw: ['eau'] },
          { fr: 'des légumes frais', ru: 'свежие овощи', d: ['les', 'de', 'du'], kw: ['légumes'] },
          { fr: 'beaucoup de fruits', ru: 'много фруктов', d: ['des', 'du', 'les'], kw: ['beaucoup', 'fruits'] },
          { fr: 'un peu de sucre', ru: 'немного сахара', d: ['du', 'des', 'le'], kw: ['sucre'] },
        ];
        const s = pick(subjs);
        const f = pick(foods);
        return { ru: `${s.ru} ${f.ru}.`, answer: `${s.fr} ${f.fr}.`, distractors: f.d, keywords: f.kw, explain: 'A2 L2: частичный артикль du / de la / de l\' / des; после слов количества (beaucoup, un peu, trop) — только de без артикля!' };
      },
    },
    {
      id: 'fr-a2-2-neg-de',
      minLesson: 2,
      unit: 'a2-2',
      label: 'A2 L2 · Отрицание ne…pas de / plus / jamais',
      title: 'A2 L2 · Отрицание с частичным артиклем (ne…pas de)',
      explain: 'При отрицании (ne…pas, ne…plus, ne…jamais) неопределённый и частичный артикли заменяются на DE (d\' перед гласной)! Исключение — глагол être.',
      gen() {
        const items = [
          { ru: 'Я не пью кофе вечером.', ans: "Je ne bois pas de café le soir.", d: ['du', 'le', 'des'], kw: ['boire', 'café'] },
          { ru: 'Она больше не ест мяса.', ans: "Elle ne mange plus de viande.", d: ['de la', 'pas', 'la'], kw: ['manger', 'viande'] },
          { ru: 'У нас нет времени ждать.', ans: "Nous n'avons pas de temps pour attendre.", d: ['du', 'le', 'ne'], kw: ['temps', 'attendre'] },
          { ru: 'Он никогда не берёт десерт.', ans: "Il ne prend jamais de dessert.", d: ['un', 'du', 'pas'], kw: ['prendre', 'dessert'] },
          { ru: 'Они не покупают алкоголь.', ans: "Ils n'achètent pas d'alcool.", d: ["de l'", 'du', 'ne'], kw: ['acheter'] },
          { ru: 'Я сажусь за работу сразу после обеда.', ans: "Je me mets à travailler juste après le déjeuner.", d: ['de', 'au', 'en'], kw: ['se mettre à', 'déjeuner'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L2: ne…pas / ne…plus / ne…jamais + DE (d\') вместо un/une/du/de la/des.' };
      },
    },

    // --- A2 L3 (minLesson: 3) ---
    {
      id: 'fr-a2-3-imp-pc',
      minLesson: 3,
      unit: 'a2-3',
      label: 'A2 L3 · Imparfait vs Passé composé',
      title: 'A2 L3 · Выбор времени: Imparfait (фон/привычка) vs Passé composé (действие)',
      explain: 'Imparfait — описание, фон, погода, повторявшаяся привычка. Passé composé — конкретное, однократное, завершённое событие.',
      gen() {
        const items = [
          { ru: 'Шёл дождь, когда мы вышли из дома.', ans: "Il pleuvait quand nous sommes sortis de la maison.", d: ['a plu', 'sortions', 'avons'], kw: ['pleuvoir', 'sortir', 'maison'] },
          { ru: 'Когда я был маленьким, я жил у бабушки.', ans: "Quand j'étais petit, j'habitais chez ma grand-mère.", d: ["j'ai été", "j'ai habité", 'à'], kw: ['habiter', 'grand-mère'] },
          { ru: 'Он читал газету, когда зазвонил телефон.', ans: "Il lisait le journal quand le téléphone a sonné.", d: ['a lu', 'sonnait', 'un'], kw: ['lire', 'journal', 'téléphone'] },
          { ru: 'Раньше мы часто получали письма от семьи.', ans: "Avant nous recevions souvent des lettres de la famille.", d: ['avons reçu', 'reçois', 'les'], kw: ['recevoir', 'lettre', 'famille'] },
          { ru: 'Было солнечно, и мы решили пойти в парк.', ans: "Il faisait beau et nous avons décidé d'aller au parc.", d: ['a fait', 'décidions', 'de'], kw: ['faire beau', 'décider', 'parc'] },
          { ru: 'Внезапно он увидел своего старого друга.', ans: "Soudain il a vu son vieil ami.", d: ['voyait', 'vieux', 'est'], kw: ['soudain', 'voir', 'ami'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L3: Imparfait = фон, описание, привычка (avant, souvent); Passé composé = внезапное или завершённое действие (quand, soudain).' };
      },
    },
    {
      id: 'fr-a2-3-imperatif',
      minLesson: 3,
      unit: 'a2-3',
      label: 'A2 L3 · Impératif (повелительное)',
      title: 'A2 L3 · Повелительное наклонение (вкл. возвратные)',
      explain: 'У глаголов 1-й группы (-er) в форме tu в impératif конечная -s отпадает (Parle ! Ne parle pas !). У возвратных: Lève-toi ! / Ne te lève pas !',
      gen() {
        const items = [
          { ru: 'Позвони мне сегодня вечером!', ans: "Appelle-moi ce soir !", d: ['Appelles-moi', 'Me appelle', 'cet'], kw: ['appeler', 'soir'] },
          { ru: 'Не опаздывай на лекцию!', ans: "Ne sois pas en retard au cours !", d: ['N\'es', 'à', 'dans'], kw: ['être', 'retard', 'cours'] },
          { ru: 'Не волнуйся, всё будет хорошо!', ans: "Ne t'inquiète pas, tout va bien !", d: ["t'inquiètes", 'inquiète-toi', 'ne'], kw: ["s'inquiéter"] },
          { ru: 'Отдохни немного после работы!', ans: "Repose-toi un peu après le travail !", d: ['Te repose', 'Reposes-toi', 'du'], kw: ['se reposer', 'travail'] },
          { ru: 'Выберите удобную дату!', ans: "Choisissez une date pratique !", d: ['Choisis', 'Choissez', 'un'], kw: ['choisir', 'date'] },
          { ru: 'Не забудь ключи от квартиры!', ans: "N'oublie pas les clés de l'appartement !", d: ['oublies', 'des', 'du'], kw: ['oublier', 'clé', 'appartement'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L3: impératif — без местоимения подлежащего; у -er в tu нет -s; у возвратных местоимение после дефиса (Repose-toi !), в отрицании — перед глаголом (Ne t\'inquiète pas !).' };
      },
    },

    // --- A2 L4 (minLesson: 4) ---
    {
      id: 'fr-a2-4-comp',
      minLesson: 4,
      unit: 'a2-4',
      label: 'A2 L4 · Сравнения (plus/moins/aussi…que)',
      title: 'A2 L4 · Степени сравнения прилагательных и наречий',
      explain: 'plus / moins / aussi + прил./нареч. + que. Исключения: bon → meilleur(e), bien → mieux! С существительным: plus de / autant de … que.',
      gen() {
        const items = [
          { ru: 'Эта комната светлее, чем старая.', ans: "Cette chambre est plus lumineuse que l'ancienne.", d: ['aussi', 'lumineux', 'de'], kw: ['chambre', 'lumineux', 'ancien'] },
          { ru: 'Метро быстрее, чем автобус.', ans: "Le métro est plus rapide que le bus.", d: ['meilleur', 'de', 'rapides'], kw: ['métro', 'rapide', 'bus'] },
          { ru: 'Он говорит по-французски лучше, чем раньше.', ans: "Il parle français mieux qu'avant.", d: ['meilleur', 'plus bien', 'que'], kw: ['parler', 'mieux', 'avant'] },
          { ru: 'Этот фильм лучше, чем книга.', ans: "Ce film est meilleur que le livre.", d: ['mieux', 'plus bon', 'de'], kw: ['film', 'meilleur', 'livre'] },
          { ru: 'Моя сестра такая же серьёзная, как и брат.', ans: "Ma sœur est aussi sérieuse que mon frère.", d: ['autant', 'sérieux', 'de'], kw: ['sœur', 'sérieux', 'frère'] },
          { ru: 'Это самый тихий квартал в городе.', ans: "C'est le quartier le plus calme de la ville.", d: ['plus', 'dans', 'du'], kw: ['quartier', 'calme', 'ville'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L4: plus/moins/aussi + прил. + que; bon → meilleur (прил.), bien → mieux (нареч.); в превосходной степени предлог DE (de la ville).' };
      },
    },
    {
      id: 'fr-a2-4-adv',
      minLesson: 4,
      unit: 'a2-4',
      label: 'A2 L4 · Прилагательные и наречия на -ment',
      title: 'A2 L4 · Женский род прилагательных и наречия -ment',
      explain: 'Наречие образуется от ж.р. прилагательного + -ment (lent → lente → lentement; heureux → heureuse → heureusement). Прил. на гласную: vrai → vraiment.',
      gen() {
        const items = [
          { ru: 'Он легко решил эту задачу.', ans: "Il a facilement résolu ce problème.", d: ['facile', 'cet', 'est'], kw: ['facilement', 'problème'] },
          { ru: 'К счастью, мой сосед очень спокойный.', ans: "Heureusement, mon colocataire est très calme.", d: ['Heureux', 'ma', 'calmes'], kw: ['heureusement', 'colocataire', 'calme'] },
          { ru: 'Она одета очень элегантно.', ans: "Elle est habillée très élégamment.", d: ['élégante', 'habillé', 'a'], kw: ['habiller', 'élégamment'] },
          { ru: 'Мы действительно хорошо ладим с соседом.', ans: "Nous nous entendons vraiment bien avec le voisin.", d: ['vrai', 'bon', 'à'], kw: ['vraiment', "s'entendre", 'voisin'] },
          { ru: 'Он говорит медленно, но чётко.', ans: "Il parle lentement mais clairement.", d: ['lent', 'clair', 'et'], kw: ['lentement', 'clairement'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L4: наречия на -ment (facilement, heureusement, vraiment, lentement, élégamment).' };
      },
    },

    // --- A2 L5 (minLesson: 5 — CURRENT HOT LESSON!) ---
    {
      id: 'fr-a2-5-rel',
      minLesson: 5,
      unit: 'a2-5',
      label: 'A2 L5 · Относительные qui / que',
      title: 'A2 L5 · Относительные местоимения QUI (подлежащее) и QUE (прямое дополнение)',
      explain: 'QUI — подлежащее (сразу после него идёт глагол, никогда не сокращается!). QUE (qu\' перед гласной) — прямое дополнение (после него идёт подлежащее).',
      gen() {
        const items = [
          { ru: 'Квартира, которая выходит на парк, очень тихая.', ans: "L'appartement qui donne sur le parc est très calme.", d: ['que', 'où', 'dans'], kw: ['appartement', 'donner sur', 'parc', 'calme'] },
          { ru: 'Дом, который мы сняли, находится рядом с метро.', ans: "La maison que nous avons louée est près du métro.", d: ['qui', 'loué', 'au'], kw: ['maison', 'louer', 'métro'] },
          { ru: 'Сосед, который живёт на третьем этаже, очень любезный.', ans: "Le voisin qui habite au troisième étage est très gentil.", d: ['que', 'qu\'', 'dans'], kw: ['voisin', 'étage', 'gentil'] },
          { ru: 'Комната, которую он ищет, должна быть светлой.', ans: "La chambre qu'il cherche doit être lumineuse.", d: ['qui', 'que', 'lumineux'], kw: ['chambre', 'chercher', 'lumineux'] },
          { ru: 'Книга, которую я тебе дал, лежит на столе.', ans: "Le livre que je t'ai donné est sur la table.", d: ['qui', 'où', 'dans'], kw: ['livre', 'donner', 'table'] },
          { ru: 'Друзья, которые помогли Марко переехать, устали.', ans: "Les amis qui ont aidé Marco à déménager sont fatigués.", d: ['que', 'de', 'ont'], kw: ['amis', 'aider', 'déménager'] },
          { ru: 'Слова, которые мы выучили, очень полезные.', ans: "Les mots que nous avons appris sont très utiles.", d: ['qui', 'où', 'sommes'], kw: ['mots', 'apprendre', 'utile'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L5: QUI + глагол (подлежащее); QUE (qu\') + подлежащее + глагол (прямое дополнение; в PC p.p. согласуется с предшествующим дополнением!).' };
      },
    },
    {
      id: 'fr-a2-5-ou',
      minLesson: 5,
      unit: 'a2-5',
      label: 'A2 L5 · Относительное où (место и время)',
      title: 'A2 L5 · Относительное наречие OÙ (и место, и время!)',
      explain: 'OÙ заменяет обстоятельство МЕСТА (la ville où j\'habite) и ВРЕМЕНИ (le jour où, le moment où, l\'année où)!',
      gen() {
        const items = [
          { ru: 'Общежитие, где я живу, находится в пяти минутах от института.', ans: "La résidence où j'habite est à cinq minutes de l'institut.", d: ['que', 'qui', 'en'], kw: ['résidence', 'habiter', 'minutes'] },
          { ru: 'Я помню день, когда мы переехали.', ans: "Je me souviens du jour où nous avons déménagé.", d: ['que', 'quand', 'qui'], kw: ['se souvenir', 'jour', 'déménager'] },
          { ru: 'Квартал, где живёт Марко, очень оживлённый.', ans: "Le quartier où Marco habite est très animé.", d: ['que', 'qui', 'dans'], kw: ['quartier', 'habiter', 'animé'] },
          { ru: 'В момент, когда он открыл дверь, пошёл дождь.', ans: "Au moment où il a ouvert la porte, il a commencé à pleuvoir.", d: ['que', 'qui', 'de'], kw: ['moment', 'ouvrir', 'porte'] },
          { ru: 'Город, где я родился, находится на юге.', ans: "La ville où je suis né est dans le sud.", d: ['que', 'qui', 'au'], kw: ['ville', 'naître', 'sud'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L5: OÙ используется не только для места (la résidence où), но и для времени (le jour où, au moment où) — НЕ que и НЕ quand!' };
      },
    },
    {
      id: 'fr-a2-5-cest',
      minLesson: 5,
      unit: 'a2-5',
      label: 'A2 L5 · Выделительный оборот c\'est…qui / que',
      title: 'A2 L5 · Выделительная конструкция C\'est … qui / C\'est … que',
      explain: 'Выделяем подлежащее → C\'est … QUI (Ce sont … qui). Выделяем дополнение или обстоятельство → C\'est … QUE.',
      gen() {
        const items = [
          { ru: 'Именно Марко переезжает в новую квартиру.', ans: "C'est Marco qui déménage dans un nouvel appartement.", d: ['que', 'nouveau', 'au'], kw: ['déménager', 'appartement'] },
          { ru: 'Именно в этом доме я живу уже три года.', ans: "C'est dans cette maison que j'habite depuis trois ans.", d: ['qui', 'où', 'ce'], kw: ['maison', 'habiter', 'depuis'] },
          { ru: 'Именно в понедельник у нас экзамен по французскому.', ans: "C'est lundi que nous avons un examen de français.", d: ['qui', 'le', 'du'], kw: ['lundi', 'examen', 'français'] },
          { ru: 'Именно мой сосед помогает мне готовиться.', ans: "C'est mon colocataire qui m'aide à me préparer.", d: ['que', 'de', 'ma'], kw: ['colocataire', 'aider', 'préparer'] },
          { ru: 'Именно эта улица ведёт к станции метро.', ans: "C'est cette rue qui mène à la station de métro.", d: ['que', 'ce', 'au'], kw: ['rue', 'station', 'métro'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L5: C\'est … QUI выделяет подлежащее; C\'est … QUE выделяет дополнение или обстоятельство времени/места.' };
      },
    },
    {
      id: 'fr-a2-5-gerondif',
      minLesson: 5,
      unit: 'a2-5',
      label: 'A2 L5 · Gérondif (en + -ant) и sans + inf.',
      title: 'A2 L5 · Герундий (en + основа nous + -ant) vs sans + infinitif',
      explain: 'Gérondif = en + основа nous (présent) + -ant (исключения: en étant, en ayant, en sachant). Отрицание («не сделав / не глядя») = SANS + infinitif!',
      gen() {
        const items = [
          { ru: 'Он идёт в университет, слушая музыку.', ans: "Il va à l'université en écoutant de la musique.", d: ['écoutant', 'à', 'du'], kw: ['université', 'écouter', 'musique'] },
          { ru: 'Он вышел из комнаты, не сказав ни слова.', ans: "Il est sorti de la chambre sans dire un mot.", d: ['en ne disant pas', 'sans disant', 'a'], kw: ['sortir', 'chambre', 'dire', 'mot'] },
          { ru: 'Мы учим новые слова, повторяя их вслух.', ans: "Nous apprenons de nouveaux mots en les répétant à haute voix.", d: ['des', 'répéter', 'dans'], kw: ['apprendre', 'mots', 'répéter'] },
          { ru: 'Он перешёл улицу, не посмотрев налево.', ans: "Il a traversé la rue sans regarder à gauche.", d: ['en ne regardant pas', 'par', 'regarde'], kw: ['traverser', 'rue', 'regarder'] },
          { ru: 'Читая текст, он подчёркивает обязательные слова.', ans: "En lisant le texte, il souligne les mots obligatoires.", d: ['En lire', 'Lisant', 'des'], kw: ['lire', 'texte', 'mots'] },
          { ru: 'Она улыбнулась, открывая дверь.', ans: "Elle a souri en ouvrant la porte.", d: ['ouvrir', 'ouvrent', 'est'], kw: ['sourire', 'ouvrir', 'porte'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L5: en + -ant (одновременность/способ); отрицательное деепричастие — ТОЛЬКО sans + infinitif (sans dire, sans regarder).' };
      },
    },
    {
      id: 'fr-a2-5-quant',
      minLesson: 5,
      unit: 'a2-5',
      label: 'A2 L5 · La plupart des / дроби / числительные',
      title: 'A2 L5 · Часть целого (la plupart des, la moitié) и числительные',
      explain: 'После части целого (la plupart, la moitié, un tiers, le reste) артикль СОХРАНЯЕТСЯ (des / du / de la)! После beaucoup / peu — только DE. Vingt и cent берут -s в конце числа.',
      gen() {
        const items = [
          { ru: 'Большинство студентов живут в общежитии.', ans: "La plupart des étudiants habitent à la résidence.", d: ['de', 'habite', 'au'], kw: ['la plupart', 'étudiants', 'résidence'] },
          { ru: 'Половина комнаты занята книгами.', ans: "La moitié de la chambre est occupée par des livres.", d: ['de', 'occupé', 'avec'], kw: ['moitié', 'chambre', 'livres'] },
          { ru: 'У меня много друзей, но большинство друзей живут далеко.', ans: "J'ai beaucoup d'amis mais la plupart des amis habitent loin.", d: ['des', "d'", 'habite'], kw: ['beaucoup', 'la plupart', 'amis'] },
          { ru: 'Эта квартира стоит восемьдесят тысяч рублей.', ans: "Cet appartement coûte quatre-vingt mille roubles.", d: ['quatre-vingts', 'milles', 'Ce'], kw: ['appartement', 'coûter', 'quatre-vingt'] },
          { ru: 'В этом здании двести комнат.', ans: "Dans cet immeuble il y a deux cents chambres.", d: ['deux cent', 'ce', 'des'], kw: ['immeuble', 'deux cents', 'chambre'] },
          { ru: 'Остаток дня он провёл дома.', ans: "Il a passé le reste de la journée chez lui.", d: ['de', 'est', 'dans'], kw: ['reste', 'journée', 'passer'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L5: la plupart DES + глагол во мн.ч.; la moitié DE LA; vingt/cent с -s только в конце числа (deux cents, но quatre-vingt mille).' };
      },
    },
    {
      id: 'fr-a2-5-venir',
      minLesson: 5,
      unit: 'a2-5',
      label: 'A2 L5 · Venir de / être en train de / управление à, de',
      title: 'A2 L5 · Конструкции и управление глаголов урока 5',
      explain: 'venir de + inf. = только что сделать; être en train de + inf. = как раз делать; hésiter à, avoir du mal à, il est temps de, au lieu de, traverser без предлога!',
      gen() {
        const items = [
          { ru: 'Он только что переехал в новую квартиру.', ans: "Il vient de déménager dans un nouvel appartement.", d: ['à', 'nouveau', 'viennent'], kw: ['venir de', 'déménager', 'appartement'] },
          { ru: 'Мы как раз готовимся к контрольной.', ans: "Nous sommes en train de préparer le contrôle.", d: ['à', 'avons', 'du'], kw: ['être en train de', 'préparer'] },
          { ru: 'Я с трудом понимаю этот текст.', ans: "J'ai du mal à comprendre ce texte.", d: ['de', 'mal', 'cet'], kw: ['avoir du mal à', 'comprendre', 'texte'] },
          { ru: 'Он не решается позвонить владельцу.', ans: "Il hésite à appeler le propriétaire.", d: ['de', 'pour', 'au'], kw: ['hésiter à', 'appeler', 'propriétaire'] },
          { ru: 'Вместо того чтобы остаться дома, мы вышли погулять.', ans: "Au lieu de rester à la maison, nous sommes sortis.", d: ['à', 'que', 'avons'], kw: ['au lieu de', 'rester', 'sortir'] },
          { ru: 'Пора уходить на пару!', ans: "Il est temps de partir en cours !", d: ['à', 'pour', 'au'], kw: ['il est temps de', 'partir', 'cours'] },
          { ru: 'Он переходит улицу и идёт к метро.', ans: "Il traverse la rue et va au métro.", d: ['à', 'par', 'à le'], kw: ['traverser', 'rue', 'métro'] },
          { ru: 'Она решила сменить квартиру.', ans: "Elle a décidé de changer d'appartement.", d: ["l'", 'à', 'du'], kw: ['changer de', 'appartement'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L5: venir de + inf, être en train de + inf, avoir du mal à, hésiter à, au lieu de, il est temps de, changer de (без арт.), traverser (без предлога).' };
      },
    },

    // --- A2 L6..L10 (FUTURE LESSONS — locked until user moves program boundary!) ---
    {
      id: 'fr-a2-6-futur',
      minLesson: 6,
      unit: 'a2-6',
      label: 'A2 L6 · Futur simple',
      title: 'A2 L6 · Простое будущее время (Futur simple)',
      explain: 'Основа будущего + окончания -ai, -as, -a, -ons, -ez, -ont. Неправильные основы: être → ser-, avoir → aur-, aller → ir-, faire → fer-, venir → viendr-.',
      gen() {
        const items = [
          { ru: 'Завтра мы купим новую мебель для гостиной.', ans: "Demain nous achèterons de nouveaux meubles pour le salon.", d: ['achetons', 'des', 'achèterions'], kw: ['acheter', 'meubles', 'salon'] },
          { ru: 'На следующей неделе он поедет в Париж.', ans: "La semaine prochaine il ira à Paris.", d: ['va', 'allera', 'en'], kw: ['aller', 'Paris'] },
          { ru: 'Скоро у тебя будет просторная квартира.', ans: "Bientôt tu auras un appartement spacieux.", d: ['as', 'avoiras', 'une'], kw: ['avoir', 'appartement'] },
          { ru: 'Вечером они придут к нам на ужин.', ans: "Ce soir ils viendront chez nous pour dîner.", d: ['viennent', 'veniront', 'à'], kw: ['venir', 'dîner'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L6: Futur simple (основа + -ai, -as, -a, -ons, -ez, -ont).' };
      },
    },
    {
      id: 'fr-a2-7-pqp',
      minLesson: 7,
      unit: 'a2-7',
      label: 'A2 L7 · Plus-que-parfait',
      title: 'A2 L7 · Предпрошедшее время (Plus-que-parfait)',
      explain: 'avoir/être в imparfait + participe passé — обозначает действие, которое произошло РАНЬШЕ другого действия в прошлом.',
      gen() {
        const items = [
          { ru: 'Когда мы приехали на вокзал, поезд уже ушёл.', ans: "Quand nous sommes arrivés à la gare, le train était déjà parti.", d: ['est', 'a', 'partait'], kw: ['gare', 'train', 'partir'] },
          { ru: 'Он показал город, который посетил раньше.', ans: "Il a montré la ville qu'il avait visitée avant.", d: ['a', 'visitait', 'visité'], kw: ['ville', 'visiter'] },
          { ru: 'Она забыла билет, который купила накануне.', ans: "Elle a oublié le billet qu'elle avait acheté la veille.", d: ['a', 'achetait', 'était'], kw: ['billet', 'acheter'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L7: Plus-que-parfait (avait / était + p.p.) = предпрошедшее действие.' };
      },
    },
    {
      id: 'fr-a2-7-passif',
      minLesson: 7,
      unit: 'a2-7',
      label: 'A2 L7 · La voix passive (Пассив)',
      title: 'A2 L7 · Пассивный залог (être + p.p. + par)',
      explain: 'être в нужном времени + participe passé (согласуется с подлежащим!) + par (или de).',
      gen() {
        const items = [
          { ru: 'Этот мост был построен в девятнадцатом веке.', ans: "Ce pont a été construit au dix-neuvième siècle.", d: ['est', 'construite', 'par'], kw: ['pont', 'construire', 'siècle'] },
          { ru: 'Билеты проверяются контролёром.', ans: "Les billets sont contrôlés par le contrôleur.", d: ['ont', 'contrôlé', 'de'], kw: ['billet', 'contrôler'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L7: Пассив = être + p.p. (согласование) + par.' };
      },
    },
    {
      id: 'fr-a2-8-eny',
      minLesson: 8,
      unit: 'a2-8',
      label: 'A2 L8 · Местоимения EN и Y',
      title: 'A2 L8 · Местоимения EN (de / количество) и Y (место / à)',
      explain: 'EN заменяет de + существительное или количество (J\'en achète deux). Y заменяет место или à + неодушевлённое (J\'y vais).',
      gen() {
        const items = [
          { ru: 'Ты идёшь на рынок? — Да, я туда иду.', ans: "Tu vas au marché ? Oui, j'y vais.", d: ["j'en", 'je le', 'là'], kw: ['marché', 'aller'] },
          { ru: 'Ты покупаешь яблоки? — Да, я покупаю их килограмм.', ans: "Tu achètes des pommes ? Oui, j'en achète un kilo.", d: ["j'y", 'les', 'de'], kw: ['acheter', 'pommes', 'kilo'] },
          { ru: 'Он часто об этом думает.', ans: "Il y pense souvent.", d: ['en', 'le', 'à'], kw: ['penser'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L8: Y заменяет à + место/предмет; EN заменяет de + сущ. / частичный артикль / количество.' };
      },
    },
    {
      id: 'fr-a2-9-indirect',
      minLesson: 9,
      unit: 'a2-9',
      label: 'A2 L9 · Косвенная речь',
      title: 'A2 L9 · Косвенная речь и согласование времён',
      explain: 'После глагола в прошлом (il a dit que): présent → imparfait, passé composé → plus-que-parfait, futur → futur dans le passé.',
      gen() {
        const items = [
          { ru: 'Он сказал, что изучает французский язык.', ans: "Il a dit qu'il étudiait le français.", d: ['étudie', 'a étudié', 'qui'], kw: ['dire', 'étudier', 'français'] },
          { ru: 'Она спросила, понимаю ли я правило.', ans: "Elle a demandé si je comprenais la règle.", d: ['que', 'comprends', 'est-ce que'], kw: ['demander', 'comprendre', 'règle'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L9: в косвенной речи при главном глаголе в прошлом présent сдвигается в imparfait; общий вопрос вводится через si.' };
      },
    },
    {
      id: 'fr-a2-10-subjonctif',
      minLesson: 10,
      unit: 'a2-10',
      label: 'A2 L10 · Subjonctif présent',
      title: 'A2 L10 · Сослагательное наклонение (Il faut que + subjonctif)',
      explain: 'После il faut que, je veux que, bien que используется subjonctif présent (основа ils présent + -e, -es, -e, -ions, -iez, -ent; исключения: sois, aie, fasse, aille).',
      gen() {
        const items = [
          { ru: 'Нужно, чтобы ты нашёл хорошую работу.', ans: "Il faut que tu trouves un bon emploi.", d: ['trouve', 'trouveras', 'de'], kw: ['il faut que', 'trouver', 'emploi'] },
          { ru: 'Я хочу, чтобы вы были готовы к собеседованию.', ans: "Je veux que vous soyez prêts pour l'entretien.", d: ['êtes', 'serez', 'prêt'], kw: ['vouloir', 'être', 'entretien'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'A2 L10: Il faut que / Je veux que + subjonctif présent.' };
      },
    },
  ];

  // ============================================================================
  // GENERAL ENGLISH GRAMMAR TOPICS & GENERATORS (Winning Strategy Units 1–3)
  // ============================================================================
  const EN_TOPICS = [
    // --- UNIT 1 (minLesson: 1) ---
    {
      id: 'en-u1-cs-passive',
      minLesson: 1,
      unit: 'u1',
      label: 'U1 · Complex Subject (Passive Reporting)',
      title: 'Unit 1 · Complex Subject с пассивными глаголами сообщения',
      explain: 'Subject + is/are said / known / believed / expected / reported + Infinitive (Simple — вообще/будущее, Continuous — сейчас, Perfect — в прошлом).',
      gen() {
        const items = [
          { ru: 'Считается, что ИИ кардинально изменит систему образования.', ans: 'AI is believed to transform the education system dramatically.', d: ['transforming', 'to have transformed', 'believes'], kw: ['transform', 'education', 'believed'] },
          { ru: 'Известно, что эта программа способствует развитию инноваций.', ans: 'This programme is known to foster innovation.', d: ['fostering', 'to be fostered', 'knows'], kw: ['foster', 'innovation', 'programme'] },
          { ru: 'Сообщают, что компания адаптировала свою стратегию в прошлом году.', ans: 'The company is reported to have adapted its strategy last year.', d: ['to adapt', 'adapting', 'reported'], kw: ['adapt', 'strategy', 'reported'] },
          { ru: 'Ожидается, что новые меры решат эту проблему.', ans: 'The new measures are expected to address this issue.', d: ['addressing', 'to have addressed', 'expecting'], kw: ['address', 'issue', 'expected'] },
          { ru: 'Считается, что индивидуальный подход повышает продуктивность.', ans: 'A tailored approach is thought to enhance productivity.', d: ['enhancing', 'to be enhanced', 'thinks'], kw: ['tailored', 'enhance', 'productivity'] },
          { ru: 'Говорят, что студенты сейчас активно участвуют в этом проекте.', ans: 'The students are said to be engaging actively in this project.', d: ['to engage', 'engaging', 'to have engaged'], kw: ['engage', 'project'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 1 Grammar File §8: Complex Subject с пассивными глаголами сообщения (is believed/known/reported/expected/said + нужная форма инфинитива).' };
      },
    },
    {
      id: 'en-u1-cs-seem',
      minLesson: 1,
      unit: 'u1',
      label: 'U1 · Complex Subject (seem / appear)',
      title: 'Unit 1 · Complex Subject с глаголами seem / appear',
      explain: 'seem / appear + Simple Infinitive (состояние/факт), Continuous Infinitive (в процессе сейчас), Perfect Infinitive (уже произошло).',
      gen() {
        const items = [
          { ru: 'Кажется, они неправильно истолковали результаты.', ans: 'They seem to have misinterpreted the outcomes.', d: ['to misinterpret', 'misinterpreting', 'seeming'], kw: ['misinterpret', 'outcomes', 'seem'] },
          { ru: 'По-видимому, это препятствует развитию творческих способностей.', ans: 'This appears to hinder creativity.', d: ['hindering', 'to have hindered', 'appeared'], kw: ['hinder', 'creativity', 'appear'] },
          { ru: 'Кажется, преподаватель сейчас пересматривает систему оценки.', ans: 'The teacher seems to be revising the assessment system.', d: ['to revise', 'revising', 'to have revised'], kw: ['assessment', 'seem'] },
          { ru: 'По-видимому, он быстро приспособился к новой среде.', ans: 'He appears to have adapted quickly to the new environment.', d: ['to adapt', 'adapting', 'for'], kw: ['adapt', 'environment', 'appear'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 1 Grammar File §9: seem / appear + to do (сейчас/вообще), to be doing (в процессе), to have done (ранее).' };
      },
    },
    {
      id: 'en-u1-cs-turn',
      minLesson: 1,
      unit: 'u1',
      label: 'U1 · Complex Subject (turn out / prove / happen)',
      title: 'Unit 1 · Complex Subject: turn out / prove / happen / chance',
      explain: 'turn out / prove + to-Inf = оказаться; happen / chance + to-Inf = случайно оказаться.',
      gen() {
        const items = [
          { ru: 'Индивидуальное обучение оказалось очень эффективным.', ans: 'Customized training turned out to be very effective.', d: ['being', 'was', 'to have'], kw: ['customized', 'training', 'turn out'] },
          { ru: 'Случайно оказалось, что она знает правильный ответ.', ans: 'She happened to know the right answer.', d: ['knowing', 'knew', 'bound'], kw: ['happen', 'answer'] },
          { ru: 'Новый подход оказался надёжным решением.', ans: 'The new approach proved to be a reliable solution.', d: ['being', 'proving', 'was'], kw: ['prove', 'approach', 'solution'] },
          { ru: 'Если вы случайно столкнётесь с этим термином, проверьте его значение.', ans: 'If you happen to refer to this term, check its meaning.', d: ['referring', 'referred', 'likely'], kw: ['happen', 'refer to', 'term'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 1 Grammar File §10–11: turn out / prove (оказаться) и happen / chance (случайно) + to-Infinitive.' };
      },
    },
    {
      id: 'en-u1-cs-likely',
      minLesson: 1,
      unit: 'u1',
      label: 'U1 · Be likely / unlikely / sure / bound',
      title: 'Unit 1 · Complex Subject: be likely / unlikely / bound / sure to',
      explain: 'be likely to (вероятно), be unlikely to (вряд ли), be sure/certain to (наверняка), be bound to (непременно).',
      gen() {
        const items = [
          { ru: 'Эти изменения вряд ли окажут негативное влияние на студентов.', ans: 'These changes are unlikely to have a negative impact on students.', d: ['likely', 'having', 'to'], kw: ['unlikely', 'impact', 'students'] },
          { ru: 'Участие в дискуссиях непременно повысит вашу уверенность.', ans: 'Engagement in discussions is bound to enhance your confidence.', d: ['enhancing', 'happened', 'of'], kw: ['engagement', 'bound', 'enhance'] },
          { ru: 'Рынок, вероятно, потребует более гибких навыков.', ans: 'The marketplace is likely to require more flexible skills.', d: ['requiring', 'bound', 'for'], kw: ['marketplace', 'likely', 'skills'] },
          { ru: 'Они наверняка добьются успеха, если будут развивать сотрудничество.', ans: 'They are sure to succeed if they foster cooperation.', d: ['succeeding', 'bound', 'for'], kw: ['sure', 'foster', 'cooperation'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 1 Grammar File §12: be likely / unlikely / sure / certain / bound + to-Infinitive.' };
      },
    },
    {
      id: 'en-u1-infinitive',
      minLesson: 1,
      unit: 'u1',
      label: 'U1 · Формы инфинитива (Active / Passive / Perfect)',
      title: 'Unit 1 · Выбор формы инфинитива (Active vs Passive, Simple vs Perfect)',
      explain: 'Выбирай Passive Infinitive (to be done), когда действие направлено на подлежащее, и Perfect Infinitive (to have done), когда действие предшествует.',
      gen() {
        const items = [
          { ru: 'Эта проблема должна быть решена немедленно.', ans: 'This issue needs to be addressed immediately.', d: ['to address', 'addressing', 'to have addressed'], kw: ['issue', 'address'] },
          { ru: 'Она рада, что адаптировалась к новой системе.', ans: 'She is glad to have adapted to the new system.', d: ['to adapt', 'adapting', 'for'], kw: ['adapt', 'system'] },
          { ru: 'Программу следует подобрать под индивидуальные потребности.', ans: 'The programme ought to be tailored to individual needs.', d: ['to tailor', 'tailoring', 'for'], kw: ['tailored', 'programme', 'needs'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 1 Grammar File §7: 6 форм инфинитива (Simple/Continuous/Perfect × Active/Passive).' };
      },
    },

    // --- UNIT 2 (minLesson: 2) ---
    {
      id: 'en-u2-attr',
      minLesson: 2,
      unit: 'u2',
      label: 'U2 · Причастие как определение (Participle I vs II)',
      title: 'Unit 2 · Participle I (-ing) vs Participle II (V3) в функции определения',
      explain: 'Participle I (-ing) — активное действие/свойство; Participle II (V3) — пассивное значение/результат.',
      gen() {
        const items = [
          { ru: 'Туристы, погружённые в местную культуру, узнают намного больше.', ans: 'Tourists immersed in the local culture learn much more.', d: ['immersing', 'into', 'having immersed'], kw: ['immerse', 'culture', 'tourists'] },
          { ru: 'Переполненные города страдают от массового туризма.', ans: 'Overcrowded cities suffer from mass tourism.', d: ['Overcrowding', 'suffered', 'of'], kw: ['overcrowded', 'tourism'] },
          { ru: 'Убедительная статья заставила многих пересмотреть свои планы.', ans: 'The compelling article made many people reconsider their plans.', d: ['compelled', 'to reconsider', 'reconsidering'], kw: ['compel', 'article'] },
          { ru: 'Повышенный боевой дух помог команде победить.', ans: 'The boosted morale helped the team win.', d: ['boosting', 'winning', 'has'], kw: ['boost', 'morale'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 2 Grammar File §1–2: Participle I (-ing) = активный признак, Participle II (V3) = пассивный признак.' };
      },
    },
    {
      id: 'en-u2-vshiy',
      minLesson: 2,
      unit: 'u2',
      label: 'U2 · Русские причастия на -вший (ловушка!)',
      title: 'Unit 2 · Перевод русских причастий на -вший (who / which + Past)',
      explain: 'ЛОУВШКА Unit 2: Perfect Participle (having done) НИКОГДА не используется как определение! Русские причастия на -вший переводятся придаточным who / which + Past Simple.',
      gen() {
        const items = [
          { ru: 'Студенты, приступившие к этому проекту в прошлом месяце, уже видят результаты.', ans: 'The students who embarked on this project last month already see results.', d: ['having embarked', 'embarking', 'in'], kw: ['embark on', 'project', 'students'] },
          { ru: 'Путешественники, углубившиеся в историю города, открыли скрытые места.', ans: 'The travellers who delved into the history of the city discovered hidden places.', d: ['having delved', 'delving', 'in'], kw: ['delve into', 'history'] },
          { ru: 'Люди, посетившие Венецию летом, жаловались на толпы.', ans: 'The people who visited Venice in summer complained about the crowds.', d: ['having visited', 'visiting', 'of'], kw: ['visited', 'Venice'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 2 Grammar File §3: для перевода русских определений на -вший используем who / which + Past Simple (НЕ having done!).' };
      },
    },
    {
      id: 'en-u2-adverbial',
      minLesson: 2,
      unit: 'u2',
      label: 'U2 · Perfect Participle (Having + V3)',
      title: 'Unit 2 · Причастие как обстоятельство (Having done / V3)',
      explain: 'Если действие предшествует главному → Having + V3 (актив) или Having been + V3 / V3 (пассив).',
      gen() {
        const items = [
          { ru: 'Завершив все приготовления, они приступили к новой карьере.', ans: 'Having finished all the preparations, they embarked on a new career.', d: ['Finishing', 'Finished', 'in'], kw: ['embark on', 'career'] },
          { ru: 'Углубившись в исследование, она нашла важную деталь.', ans: 'Having delved into the research, she found an important detail.', d: ['Delved', 'Delving', 'in'], kw: ['delve into', 'research'] },
          { ru: 'Почувствовав себя вынужденным действовать, он позвонил директору.', ans: 'Feeling compelled to act, he called the director.', d: ['Compelling', 'Felt', 'acting'], kw: ['compel', 'act'] },
          { ru: 'Повысив продажи в этом квартале, компания расширила штат.', ans: 'Having boosted sales this quarter, the company expanded its staff.', d: ['Boosted', 'Being boosted', 'to boost'], kw: ['boost', 'sales'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 2 Grammar File §5: предшествующее активное действие → Having + V3; одновременное → V-ing; пассив → V3.' };
      },
    },
    {
      id: 'en-u2-motion',
      minLesson: 2,
      unit: 'u2',
      label: 'U2 · Глаголы движения и восприятия',
      title: 'Unit 2 · Simple Participle I с глаголами движения и восприятия',
      explain: 'С глаголами движения и восприятия (enter, arrive, leave, see, hear, notice) для непосредственно предшествующего действия используется Simple Participle I (Entering, Hearing), а НЕ Having entered!',
      gen() {
        const items = [
          { ru: 'Войдя в центр города, мы сразу заметили толпы туристов.', ans: 'Entering the city centre, we immediately noticed crowds of tourists.', d: ['Having entered', 'Entered', 'into'], kw: ['enter', 'tourists'] },
          { ru: 'Прибыв в отель, они сразу погрузились в атмосферу города.', ans: 'Arriving at the hotel, they immediately immersed themselves in the atmosphere.', d: ['Having arrived', 'Arrived', 'into'], kw: ['arrive', 'immerse'] },
          { ru: 'Услышав эту новость, он почувствовал себя вынужденным помочь.', ans: 'Hearing the news, he felt compelled to help.', d: ['Having heard', 'Heard', 'helping'], kw: ['hear', 'compel'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 2 Grammar File §6: enter, arrive, see, hear → Simple Participle I (V-ing), не Perfect!' };
      },
    },
    {
      id: 'en-u2-being-when',
      minLesson: 2,
      unit: 'u2',
      label: 'U2 · Being vs When',
      title: 'Unit 2 · Being (причина) vs When (время / условие)',
      explain: 'Being + существительное/прилагательное выражает ПРИЧИНУ («поскольку он является…»). When + сущ./прил. выражает ВРЕМЯ/УСЛОВИЕ («когда ты…»).',
      gen() {
        const items = [
          { ru: 'Будучи туристом (когда вы турист) за границей, уважайте местные традиции.', ans: 'When a tourist abroad, respect local traditions.', d: ['Being', 'Having been', 'Been'], kw: ['when', 'tourist'] },
          { ru: 'Поскольку он опытный гид, он знал каждую улицу.', ans: 'Being an experienced guide, he knew every street.', d: ['When', 'Having been', 'Was'], kw: ['being', 'guide'] },
          { ru: 'Когда ты в стрессе, сложно принимать взвешенные решения.', ans: 'When stressed, it is hard to make balanced decisions.', d: ['Being', 'Stressing', 'Been'], kw: ['when', 'stressed'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 2 Grammar File §7: Being = причина («поскольку…»); When = время/условие («когда…»).' };
      },
    },
    {
      id: 'en-u2-not-without',
      minLesson: 2,
      unit: 'u2',
      label: 'U2 · Not + V-ing vs Without + V-ing',
      title: 'Unit 2 · Отрицательные обороты: NOT (причина) vs WITHOUT («не сделав»)',
      explain: 'Not + V-ing выражает причину («не зная…»); Without + V-ing — отсутствие сопутствующего действия («не сказав ни слова»).',
      gen() {
        const items = [
          { ru: 'Не зная местного языка, он с трудом ориентировался.', ans: 'Not knowing the local language, he struggled to navigate.', d: ['Without', 'No', "Don't"], kw: ['not', 'navigate', 'language'] },
          { ru: 'Он ушёл с собрания, не сказав ни слова.', ans: 'He left the meeting without saying a word.', d: ['not', 'to say', 'said'], kw: ['without', 'saying'] },
          { ru: 'Не желая беспокоить соседей, она выключила музыку.', ans: 'Not wanting to disturb the neighbours, she turned off the music.', d: ['Without', 'No', 'disturbing'], kw: ['not', 'wanting'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 2 Grammar File §8: Not + V-ing = причина; Without + V-ing = «не сделав чего-л.».' };
      },
    },

    // --- UNIT 3 (minLesson: 3) ---
    {
      id: 'en-u3-forms',
      minLesson: 3,
      unit: 'u3',
      label: 'U3 · Формы герундия (Active/Passive/Perfect/Not)',
      title: 'Unit 3 · 4 формы герундия и отрицание (NOT + V-ing)',
      explain: 'Simple Active (doing), Simple Passive (being done), Perfect Active (having done), Perfect Passive (having been done). Отрицание: NOT прямо перед герундием.',
      gen() {
        const items = [
          { ru: 'Она не выносит, когда её перебивают во время выступления.', ans: "She can't stand being interrupted during a speech.", d: ['interrupting', 'to be interrupt', 'having interrupted'], kw: ["can't stand", 'being interrupted'] },
          { ru: 'Он пожалел, что не подготовился к экзамену заранее.', ans: 'He regretted not preparing for the exam in advance.', d: ['not to prepare', 'to not prepare', 'prepares'], kw: ['regret', 'not preparing'] },
          { ru: 'Она отрицала, что пропустила дедлайн на прошлой неделе.', ans: 'She denied having missed the deadline last week.', d: ['to miss', 'being missed', 'missed'], kw: ['deny', 'deadline'] },
          { ru: 'Никто не любит, когда его критикуют публично.', ans: 'Nobody enjoys being criticized in public.', d: ['criticizing', 'to criticize', 'criticized'], kw: ['enjoy', 'being criticized'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 3 Grammar File §1: Passive Gerund = being + V3; Perfect Gerund = having + V3; отрицание = not + Gerund.' };
      },
    },
    {
      id: 'en-u3-gerund-verbs',
      minLesson: 3,
      unit: 'u3',
      label: 'U3 · Глаголы + Gerund (без предлога)',
      title: 'Unit 3 · Глаголы, требующие герундия (avoid, suggest, consider, risk…)',
      explain: 'После admit, avoid, consider, deny, enjoy, finish, imagine, involve, mind, postpone, risk, suggest ставится только Gerund (V-ing), НЕ to-Infinitive!',
      gen() {
        const items = [
          { ru: 'Они предложили обсудить этот вопрос после пары.', ans: 'They suggested discussing this issue after class.', d: ['to discuss', 'us to discuss', 'discuss'], kw: ['suggest', 'issue'] },
          { ru: 'Она избегает обсуждения личных трудностей на работе.', ans: 'She avoids discussing personal setbacks at work.', d: ['to discuss', 'discuss', 'discussed'], kw: ['avoid', 'setbacks'] },
          { ru: 'Он обдумывает возможность сменить образ жизни.', ans: 'He is considering changing his lifestyle.', d: ['to change', 'change', 'changed'], kw: ['consider', 'lifestyle'] },
          { ru: 'Работа в команде предполагает поддержку друг друга.', ans: 'Teamwork involves supporting one another.', d: ['to support', 'support', 'supported'], kw: ['involve', 'support'] },
          { ru: 'Мы отложили принятие решения до понедельника.', ans: 'We postponed making a decision until Monday.', d: ['to make', 'make', 'made'], kw: ['postpone', 'decision'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 3 Grammar File §2: suggest / avoid / consider / involve / postpone + Gerund (после suggest нельзя sb + to V!).' };
      },
    },
    {
      id: 'en-u3-prep-fixed',
      minLesson: 3,
      unit: 'u3',
      label: 'U3 · Предлоги и устойчивые выражения + Gerund',
      title: 'Unit 3 · Предлоги (insist on, object to, succeed in) и выражения (no point in, worth)',
      explain: 'После ВСЕХ предлогов (включая to в object to / look forward to!) и выражений It\'s worth / There\'s no point in / can\'t help — ставится Gerund!',
      gen() {
        const items = [
          { ru: 'Нет смысла жаловаться на трудности — лучше действовать.', ans: 'There is no point in complaining about adversity.', d: ['to complain', 'of', 'complain'], kw: ['no point in', 'adversity'] },
          { ru: 'Я с нетерпением жду встречи с вами на следующей неделе.', ans: 'I look forward to meeting you next week.', d: ['to meet', 'meet', 'for'], kw: ['look forward to', 'meeting'] },
          { ru: 'Она преуспела в том, чтобы быстро оправиться после неудачи.', ans: 'She succeeded in bouncing back from the setback.', d: ['on', 'to bounce', 'of'], kw: ['succeed in', 'bounce back', 'setback'] },
          { ru: 'Он настоял на проведении дополнительных тестов.', ans: 'He insisted on doing additional tests.', d: ['in', 'to do', 'for'], kw: ['insist on', 'tests'] },
          { ru: 'Они возражают против переноса экзамена.', ans: 'They object to postponing the exam.', d: ['against', 'to postpone', 'of'], kw: ['object to', 'postpone'] },
          { ru: 'Эту статью действительно стоит прочитать.', ans: 'This article is really worth reading.', d: ['to read', 'read', 'of reading'], kw: ['worth', 'reading'] },
          { ru: 'Ничто не помешало ему добиться успеха.', ans: 'Nothing prevented him from thriving.', d: ['of', 'to thrive', 'out'], kw: ['prevent from', 'thrive'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 3 Grammar File §2–3: insist on, succeed in, object to, look forward to, prevent from, There\'s no point in, be worth + Gerund.' };
      },
    },
    {
      id: 'en-u3-change',
      minLesson: 3,
      unit: 'u3',
      label: 'U3 · Gerund vs Infinitive (смена смысла!)',
      title: 'Unit 3 · Remember / Forget / Stop / Try / Regret (+ V-ing vs + to V)',
      explain: 'remember/forget/regret + V-ing = прошлое; + to V = задача/сообщить новость. stop + V-ing = прекратить; stop + to V = остановиться ради цели. try + V-ing = эксперимент; try + to V = стараться.',
      gen() {
        const items = [
          { ru: 'Не забудь отправить домашнее задание до пятницы.', ans: 'Remember to submit the homework before Friday.', d: ['submitting', 'submit', 'having submitted'], kw: ['remember', 'homework'] },
          { ru: 'Я отчётливо помню, как впервые сдавал этот экзамен.', ans: 'I clearly remember taking this exam for the first time.', d: ['to take', 'take', 'took'], kw: ['remember', 'exam'] },
          { ru: 'Он остановился по дороге, чтобы передохнуть.', ans: 'He stopped on the way to rest.', d: ['resting', 'rest', 'having rested'], kw: ['stop', 'rest'] },
          { ru: 'Она перестала беспокоиться о мелочах.', ans: 'She stopped worrying about small things.', d: ['to worry', 'worry', 'worried'], kw: ['stop', 'worry'] },
          { ru: 'Попробуй повторять слова каждый день по пять минут (как способ).', ans: 'Try revising the words for five minutes every day.', d: ['to revise', 'revise', 'revised'], kw: ['try', 'revise'] },
          { ru: 'С сожалением сообщаем вам, что расписание изменилось.', ans: 'We regret to inform you that the schedule has changed.', d: ['informing', 'inform', 'informed'], kw: ['regret', 'inform'] },
        ];
        const it = pick(items);
        return { ru: it.ru, answer: it.ans, distractors: it.d, keywords: it.kw, explain: 'Unit 3 Grammar File §4: смена значения после remember, forget, stop, try, regret.' };
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

  // Fallback builder item from a real textbook card that has an example or collocation
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
    } else if (units.length) {
      const uSet = new Set(units);
      const inUnits = allowed.filter((t) => uSet.has(t.unit));
      // If selected units have dedicated topics, prioritize them; also include earlier foundational if <2 topics
      if (inUnits.length) chosen = inUnits;
    }

    const perTopic = Math.max(2, Math.ceil((count + 4) / chosen.length));
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
    generateOffline,
    tokenizeSentence,
    testConnection,
    aiGenerate,
    aiCheck,
  };
})();
