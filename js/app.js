(function () {
  'use strict';

  var STORE_KEY = 'aa_state_v1';

  /* ============ State ============ */
  var STATE = {
    p: {
      fullName: '', position: '', dob: '', age: '', sex: '', civilStatus: '',
      religion: '', address: '', mobile: '', email: '', emergencyName: '',
      emergencyRel: '', emergencyNum: '', interviewDate: ASSESS.now(), interviewer: ''
    },
    family: [],
    qa: [],
    comments: '',
    suggestions: '',
    temp: { choleric: [], sanguine: [], melancholic: [], phlegmatic: [] },
    eq: { interpersonal: [], actualization: [], responsibility: [], impulse: [], reality: [] }
  };

  function blankState() {
    var s = JSON.parse(JSON.stringify(STATE));
    s.p.interviewDate = ASSESS.now();
    ASSESS.familyDefaults.forEach(function (f) {
      s.family.push({ relation: f.relation, name: '', age: '', occupation: '', gender: '' });
    });
    ASSESS.questionnaire.forEach(function (q, i) {
      s.qa.push({ num: i + 1, q: q, a: '' });
    });
    ASSESS.eqScales.forEach(function (sc) { s.eq[sc.key] = []; });
    return s;
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return blankState();
      var s = JSON.parse(raw);
      if (!s.p || !s.qa || !s.temp || !s.eq) return blankState();
      return s;
    } catch (e) { return blankState(); }
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(STATE)); } catch (e) {}
  }

  function resetAll() {
    localStorage.removeItem(STORE_KEY);
    location.reload();
  }

  /* ============ Demo mode (for documentation & preview) ============ */
  function demoEnabled() {
    return /[?&]demo\b/.test(location.search);
  }
  function stepParam() {
    var m = location.search.match(/[?&]step=(\d)/);
    return m ? parseInt(m[1], 10) : null;
  }
  function fillDemo() {
    STATE.p.fullName = 'Juan Dela Cruz';
    STATE.p.position = 'Customer Service Staff';
    STATE.p.dob = '02/14/2000';
    STATE.p.age = '25';
    STATE.p.sex = 'Male';
    STATE.p.civilStatus = 'Single';
    STATE.p.religion = 'Roman Catholic';
    STATE.p.address = '123 Mabini St., Cebu City';
    STATE.p.mobile = '0917 123 4567';
    STATE.p.email = 'juan.delacruz@email.com';
    STATE.p.emergencyName = 'Maria Dela Cruz';
    STATE.p.emergencyRel = 'Mother';
    STATE.p.emergencyNum = '0917 555 4444';
    STATE.p.interviewDate = ASSESS.now();
    STATE.p.interviewer = 'Ms. Ana Santos';

    STATE.family = [];
    ASSESS.familyDefaults.forEach(function (f) {
      STATE.family.push({
        relation: f.relation,
        name: 'Sample ' + f.relation,
        age: String(28 + STATE.family.length),
        occupation: f.role === 'father' ? 'Self-Employed' : (f.role === 'mother' ? 'Housewife' : (f.role === 'spouse' ? 'Accountant' : 'Student')),
        gender: f.role === 'mother' ? 'Female' : 'Male'
      });
    });

    STATE.qa.forEach(function (qa, i) {
      var sample = [
        'I am a hardworking and friendly person who enjoys helping others.',
        'I am looking for better career growth and stability.',
        'I have strong communication skills and a service-oriented attitude.',
        'I know the company values quality service and customer satisfaction.',
        'The company offers a positive work environment and growth opportunities.',
        'I can be too detailed at times and want to finish tasks perfectly.',
        'My strengths are patience, teamwork, and a willingness to learn.',
        'I led a school project that improved our team\u2019s turnaround time.',
        'I enjoy a supportive team and meaningful work.',
        'My ideal job allows me to serve people and grow professionally.',
        'There is limited room for growth in my present role.',
        'Yes, but I am ready for the next step in my career.',
        'I stay calm, prioritize tasks, and ask for help when needed.',
        'Currently earning below the market rate.',
        'I expect a competitive salary based on the company\u2019s scale.',
        'No current offers, but I am open to opportunities.',
        'I can start as soon as needed.',
        'I prefer to avoid unproductive meetings.',
        'I have received several service excellence recognitions.',
        'Faith, family, and personal growth.'
      ];
      qa.a = sample[i] || 'Sample answer.';
    });
    STATE.comments = 'The applicant presented herself well and answered questions clearly. Good attitude and willingness to learn.';
    STATE.suggestions = 'Consider for a follow-up interview. Verify references and work history.';

    ASSESS.temperament.forEach(function (t) {
      var pick = t.key === 'choleric' ? 11 : t.key === 'sanguine' ? 8 : t.key === 'melancholic' ? 9 : 7;
      STATE.temp[t.key] = t.words.slice(0, pick);
    });

    ASSESS.eqScales.forEach(function (sc, si) {
      var arr = [];
      sc.questions.forEach(function (q, qi) {
        var v;
        if (si === 0) v = [1, 5, 1, 5, 4, 1, 2, 2, 1][qi];
        else if (si === 1) v = [1, 5, 4, 5, 5, 2, 1, 2, 5][qi];
        else if (si === 2) v = [1, 5, 5, 1, 5, 1, 1, 2, 1][qi];
        else if (si === 3) v = [2, 2, 1, 5, 5, 1, 4, 2, 4][qi];
        else v = [1, 4, 5, 5, 5, 5, 1, 4, 1][qi];
        arr.push(v);
      });
      STATE.eq[sc.key] = arr;
    });
  }

  window.STATE = STATE;

  /* ============ Helpers ============ */
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  function toast(msg, ms) {
    var t = $('toast');
    t.innerHTML = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('show'); }, ms || 2600);
  }

  var STEPS = [
    { title: 'Applicant Details', sub: 'Personal information & interview header details' },
    { title: 'Family Background', sub: 'Household composition of the applicant' },
    { title: 'Interview Questionnaire', sub: 'Responses to the 20 interview questions' },
    { title: 'Temperament Test', sub: 'Word-checklist based temperament profiling' },
    { title: 'Emotional Intelligence', sub: '45-item Emotional Quotient assessment' },
    { title: 'Review & Download', sub: 'Assessment summary and report generation' }
  ];

  var current = 0;

  function goTo(step) {
    current = Math.max(0, Math.min(5, step));
    document.querySelectorAll('.step-panel').forEach(function (el) { el.style.display = 'none'; });
    var panel = document.querySelector('.step-panel[data-panel="' + current + '"]');
    if (panel) panel.style.display = '';
    document.querySelectorAll('.step').forEach(function (el) {
      var s = parseInt(el.getAttribute('data-step'), 10);
      el.classList.toggle('active', s === current);
      el.classList.toggle('done', s < current);
    });
    $('page-title').textContent = STEPS[current].title;
    $('page-sub').textContent = STEPS[current].sub;
    $('progress-fill').style.width = Math.round((current / 5) * 100) + '%';
    $('progress-text').textContent = 'Step ' + (current + 1) + ' of 6';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (current === 5) renderReview();
  }

  /* ============ Step 1: Personal ============ */
  function bindPersonal() {
    Object.keys(STATE.p).forEach(function (key) {
      var idByKey = {
        fullName: 'fullName', position: 'position', dob: 'dob', age: 'age',
        religion: 'religion', address: 'address', mobile: 'mobile', email: 'email',
        emergencyName: 'emergencyName', emergencyRel: 'emergencyRel',
        emergencyNum: 'emergencyNum', interviewDate: 'interviewDate', interviewer: 'interviewer'
      };
      if (idByKey[key] && $(idByKey[key])) {
        $(idByKey[key]).value = STATE.p[key] || '';
        $(idByKey[key]).addEventListener('input', function (e) {
          STATE.p[key] = e.target.value;
          if (key === 'dob') maybeAutoAge();
          save();
        });
      }
    });

    // auto-fill age from DOB (MM/DD/YYYY)
    function maybeAutoAge() {
      var dob = STATE.p.dob;
      var m = dob.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) return;
      var b = new Date(+m[3], +m[1] - 1, +m[2]);
      if (isNaN(b)) return;
      var age = Math.floor((Date.now() - b.getTime()) / (365.25 * 24 * 3600 * 1000));
      if (age >= 0 && age < 120 && !STATE.p.age) {
        STATE.p.age = age;
        $('age').value = age;
        save();
      }
    }

    // sex / civil status pills
    document.querySelectorAll('[data-pills]').forEach(function (group) {
      var key = group.getAttribute('data-pills');
      group.querySelectorAll('.pill').forEach(function (pill) {
        var v = pill.getAttribute('data-val');
        if (STATE.p[key] === v) pill.classList.add('sel');
        pill.addEventListener('click', function () {
          group.querySelectorAll('.pill').forEach(function (x) { x.classList.remove('sel'); });
          pill.classList.add('sel');
          STATE.p[key] = v;
          save();
        });
      });
    });
  }

  /* ============ Step 2: Family ============ */
  function renderFamily() {
    var body = $('familyBody');
    body.innerHTML = '';
    STATE.family.forEach(function (f, i) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><input type="text" class="f-rel" data-idx="' + i + '" list="famRoles" value="' + esc(f.relation) + '" placeholder="Relation"></td>' +
        '<td><input type="text" class="f-name" data-idx="' + i + '" value="' + esc(f.name) + '" placeholder="Name"></td>' +
        '<td><input type="text" class="f-age" data-idx="' + i + '" value="' + esc(f.age) + '" placeholder="Age"></td>' +
        '<td><input type="text" class="f-occ" data-idx="' + i + '" value="' + esc(f.occupation) + '" placeholder="Occupation / Year / Grade"></td>' +
        '<td><select class="f-gen" data-idx="' + i + '">' +
          ['', 'Male', 'Female'].map(function (g) {
            return '<option value="' + g + '"' + (f.gender === g ? ' selected' : '') + '>' + (g || 'Gender') + '</option>';
          }).join('') +
        '</select></td>' +
        '<td><button type="button" class="btn-row-del" data-idx="' + i + '" title="Remove row">&times;</button></td>';
      body.appendChild(tr);
    });
  }

  function bindFamily() {
    document.addEventListener('input', function (e) {
      var t = e.target;
      var idx = t.getAttribute('data-idx');
      if (idx === null) return;
      var fieldMap = { 'f-rel': 'relation', 'f-name': 'name', 'f-age': 'age', 'f-occ': 'occupation' };
      if (fieldMap[t.className]) {
        STATE.family[+idx][fieldMap[t.className]] = t.value;
        save();
      }
    });
    document.addEventListener('change', function (e) {
      var t = e.target;
      if (t.className === 'f-gen') {
        STATE.family[+t.getAttribute('data-idx')].gender = t.value;
        save();
      }
    });
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t.classList.contains('btn-row-del')) {
        var idx = +t.getAttribute('data-idx');
        STATE.family.splice(idx, 1);
        renderFamily();
        save();
      }
    });
    $('btn-add-family').addEventListener('click', function () {
      STATE.family.push({ relation: '', name: '', age: '', occupation: '', gender: '' });
      renderFamily();
      save();
    });
  }

  /* ============ Step 3: Questionnaire ============ */
  function renderQA() {
    var list = $('qaList');
    list.innerHTML = '';
    STATE.qa.forEach(function (qa, i) {
      var div = document.createElement('div');
      div.className = 'qa-item';
      div.innerHTML =
        '<div class="qa-q"><span class="num">' + qa.num + '</span>' + esc(qa.q) + '</div>' +
        '<textarea data-qa="' + i + '" rows="2" placeholder="Answer...">' + esc(qa.a) + '</textarea>';
      list.appendChild(div);
    });
    list.addEventListener('input', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-qa')) {
        STATE.qa[+t.getAttribute('data-qa')].a = t.value;
        save();
      }
    });
    $('comments').value = STATE.comments;
    $('suggestions').value = STATE.suggestions;
    $('comments').addEventListener('input', function (e) { STATE.comments = e.target.value; save(); });
    $('suggestions').addEventListener('input', function (e) { STATE.suggestions = e.target.value; save(); });
  }

  /* ============ Step 4: Temperament ============ */
  function renderTemperament() {
    var grid = $('tempGrid');
    grid.innerHTML = '';
    ASSESS.temperament.forEach(function (t) {
      var card = document.createElement('div');
      card.className = 'temp-card';
      card.id = 'temp-' + t.key;
      var chips = t.words.map(function (w, wi) {
        var sel = (STATE.temp[t.key] || []).indexOf(w) > -1;
        return '<span class="chip' + (sel ? ' sel' : '') + '" data-key="' + t.key + '" data-w="' + wi + '">' + esc(w) + '</span>';
      }).join('');
      card.innerHTML =
        '<div class="temp-head"><h3>' + esc(t.name) + '</h3>' +
        '<span class="temp-count" id="cnt-' + t.key + '">' + (STATE.temp[t.key] || []).length + '</span></div>' +
        '<div class="temp-badge" id="dom-' + t.key + '" style="display:none">&#9733; DOMINANT</div>' +
        '<div>' + chips + '</div>';
      grid.appendChild(card);
    });
    grid.addEventListener('click', function (e) {
      var chip = e.target;
      if (!chip.classList.contains('chip')) return;
      var key = chip.getAttribute('data-key');
      var w = ASSESS.temperament.filter(function (x) { return x.key === key; })[0].words[+chip.getAttribute('data-w')];
      chip.classList.toggle('sel');
      var arr = STATE.temp[key];
      var i = arr.indexOf(w);
      if (chip.classList.contains('sel')) { if (i < 0) arr.push(w); }
      else if (i > -1) arr.splice(i, 1);
      save();
      updateTempUI();
    });
    updateTempUI();
  }

  function updateTempUI() {
    var counts = {};
    ASSESS.temperament.forEach(function (t) {
      counts[t.key] = (STATE.temp[t.key] || []).length;
      var el = $('cnt-' + t.key);
      if (el) el.textContent = counts[t.key];
    });
    var max = Math.max.apply(null, ASSESS.temperament.map(function (t) { return counts[t.key]; }));
    ASSESS.temperament.forEach(function (t) {
      var card = $('temp-' + t.key);
      var badge = $('dom-' + t.key);
      var isDom = counts[t.key] === max && max > 0;
      if (card) card.classList.toggle('dominant', isDom);
      if (badge) badge.style.display = isDom ? 'inline-block' : 'none';
    });
  }

  /* ============ Step 5: Emotional Intelligence ============ */
  function renderEQ() {
    var list = $('eqList');
    list.innerHTML = '';
    ASSESS.eqScales.forEach(function (sc) {
      var wrap = document.createElement('div');
      wrap.className = 'eq-scale';
      wrap.innerHTML =
        '<div class="eq-scale-head"><h3>' + esc(sc.title) + '</h3>' +
        '<span class="eq-live-score blank" id="eqs-' + sc.key + '">0 / 45 &middot; Not started</span></div>';
      sc.questions.forEach(function (q, qi) {
        var row = document.createElement('div');
        row.className = 'eq-q';
        row.innerHTML = '<div class="txt"><span class="qno">' + (qi + 1) + '.</span>' + esc(q) + '</div>';
        var opts = document.createElement('div');
        opts.className = 'eq-opts';
        ASSESS.eqOptions.forEach(function (opt) {
          var sel = (STATE.eq[sc.key] || [])[qi] === opt.value;
          var pill = document.createElement('div');
          pill.className = 'eq-opt' + (sel ? ' sel' : '');
          pill.setAttribute('data-k', sc.key);
          pill.setAttribute('data-q', qi);
          pill.setAttribute('data-v', opt.value);
          pill.innerHTML = '<strong>' + opt.value + '</strong><small>' + opt.label + '</small>';
          opts.appendChild(pill);
        });
        row.appendChild(opts);
        wrap.appendChild(row);
      });
      list.appendChild(wrap);
    });
    list.addEventListener('click', function (e) {
      var t = e.target.closest('.eq-opt');
      if (!t) return;
      var key = t.getAttribute('data-k');
      var qi = +t.getAttribute('data-q');
      var v = +t.getAttribute('data-v');
      var sc = ASSESS.eqScales.filter(function (x) { return x.key === key; })[0];
      var arr = STATE.eq[key];
      while (arr.length < sc.questions.length) arr.push(null);
      arr[qi] = (arr[qi] === v) ? null : v;
      save();
      // re-render just this question's options
      t.parentNode.querySelectorAll('.eq-opt').forEach(function (x) {
        x.classList.toggle('sel', +x.getAttribute('data-v') === arr[qi]);
      });
      updateEqScore(key);
    });
    ASSESS.eqScales.forEach(function (sc) { updateEqScore(sc.key); });
  }

  function updateEqScore(key) {
    var sc = ASSESS.eqScales.filter(function (x) { return x.key === key; })[0];
    var arr = STATE.eq[key] || [];
    var s = 0, n = 0;
    arr.forEach(function (v) { if (v) { s += v; n++; } });
    var el = $('eqs-' + key);
    if (!el) return;
    var band = n === sc.questions.length ? ASSESS.eqInterpret(s) : null;
    if (n === 0) { el.className = 'eq-live-score blank'; el.innerHTML = '0 / 45 &middot; Not started'; }
    else if (!band) { el.className = 'eq-live-score blank'; el.innerHTML = s + ' / 45 &middot; ' + n + '/' + sc.questions.length + ' answered'; }
    else {
      var cls = band.rating === 'EXCELLENT' ? 'done-ok' : (band.rating === 'GOOD' ? 'done-warn' : 'done-bad');
      el.className = 'eq-live-score ' + cls;
      el.innerHTML = s + ' / 45 &middot; ' + band.rating + ' (' + band.note + ')';
    }
  }

  function eqAnsweredCount() {
    var n = 0;
    ASSESS.eqScales.forEach(function (sc) {
      (STATE.eq[sc.key] || []).forEach(function (v) { if (v) n++; });
    });
    return n;
  }

  /* ============ Step 6: Review ============ */
  function renderReview() {
    var stats = $('summaryStats');
    var dom = findDominant();
    var eqb = eqOverallBand();
    var qaAnswered = STATE.qa.filter(function (q) { return q.a && q.a.trim(); }).length;
    var famCount = STATE.family.filter(function (f) { return f.name && f.name.trim(); }).length;

    stats.innerHTML =
      statCard(dom.name, 'Dominant Temperament') +
      statCard(eqb.rating, 'Emotional Intelligence') +
      statCard(qaAnswered + ' / 20', 'Interview Answered') +
      statCard(famCount, 'Family Members Listed');

    var warns = [];
    if (!STATE.p.fullName.trim()) warns.push('Applicant full name is not set. The report will be labelled \u201cApplicant\u201d.');
    var eqN = eqAnsweredCount();
    if (eqN < 45) warns.push('Emotional Intelligence is ' + eqN + ' / 45 answered. Unanswered items will appear as \u201cNot completed\u201d in the report.');
    if (qaAnswered < 20) warns.push('Interview questionnaire is ' + qaAnswered + ' / 20 answered.');

    $('reviewWarnings').innerHTML = warns.map(function (w) {
      return '<div class="warn-banner">&#9888;&nbsp; ' + esc(w) + '</div>';
    }).join('');
  }

  function statCard(v, l) {
    return '<div class="stat-card"><div class="val">' + esc(String(v)) + '</div><div class="lbl">' + esc(l) + '</div></div>';
  }

  function findDominant() {
    var counts = ASSESS.temperament.map(function (t) {
      return { key: t.key, c: (STATE.temp[t.key] || []).length };
    });
    var max = Math.max.apply(null, counts.map(function (x) { return x.c; }));
    var top = counts.filter(function (x) { return x.c === max && max > 0; });
    var name = top.length ? top.map(function (x) {
      return ASSESS.temperament.filter(function (t) { return t.key === x.key; })[0].name;
    }).join(' / ') : 'Not determined';
    return { name: name, count: max };
  }

  function eqOverallBand() {
    var total = 0;
    ASSESS.eqScales.forEach(function (sc) {
      (STATE.eq[sc.key] || []).forEach(function (v) { if (v) total += v; });
    });
    if (total <= 75) return { rating: 'EXCELLENT' };
    if (total <= 150) return { rating: 'GOOD' };
    return { rating: 'POOR' };
  }

  /* ============ Cloud save ============ */
  function sendToCloud(pdf) {
    return Cloud.upload(STATE, pdf).then(function (res) {
      var label = Cloud.savedAtLabel(pdf ? Cloud.payloadFor(STATE, pdf).savedAt : null);
      var link = null;
      if (res && res.pdf && res.pdf.link) link = res.pdf.link;
      var msg = null;
      if (res && res.ok !== false) {
        msg = pdf
          ? 'Saved to cloud: <b>' + esc(pdf.filename) + '</b>'
          : 'Assessment data saved to cloud.';
        if (res && res.message) msg += ' &middot; ' + esc(res.message);
        if (link) msg += '<br><a href="' + esc(link) + '" target="_blank" rel="noopener">Open saved report</a>';
        return { ok: true, label: label, msg: msg, link: link };
      }
      msg = (res && res.error) ? res.error : 'Cloud save failed.';
      return { ok: false, label: label, msg: msg };
    });
  }

  /* ============ PDF ============ */
  function doPDF() {
    var btn = $('btn-pdf');
    btn.disabled = true;
    var orig = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span>&nbsp; Generating PDF...';
    Report.downloadPDF(STATE, function (done, total) {
      btn.innerHTML = '<span class="spinner"></span>&nbsp; Rendering page ' + done + ' of ' + total + '...';
    }).then(function (out) {
      btn.innerHTML = '<span class="spinner"></span>&nbsp; Saving to cloud...';
      return sendToCloud({ filename: out.filename, base64: out.base64 });
    }).then(function (ck) {
      if (ck.ok) {
        toast('Report downloaded &amp; ' + ck.msg, 8000);
      } else {
        console.warn(ck.msg);
        toast('PDF downloaded, but cloud save failed: ' + ck.msg, 5600);
      }
    }).catch(function (err) {
      console.error(err);
      toast('Could not generate the report. See console for details.', 3600);
    }).finally(function () {
      btn.disabled = false;
      btn.innerHTML = orig;
    });
  }

  function doPrint() {
    Report.buildForPrint(STATE);
    sendToCloud(null).then(function (ck) {
      if (!ck.ok) console.warn(ck.msg);
      else toast(ck.msg, 3200);
    }).catch(function (err) { console.error(err); });
    window.print();
  }

  /* ============ Navigation binding ============ */
  function bindNav() {
    document.querySelectorAll('.step').forEach(function (el) {
      el.addEventListener('click', function () { goTo(parseInt(el.getAttribute('data-step'), 10)); });
    });
    document.querySelectorAll('[data-next]').forEach(function (b) {
      b.addEventListener('click', function () { goTo(parseInt(b.getAttribute('data-next'), 10)); });
    });
    document.querySelectorAll('[data-prev]').forEach(function (b) {
      b.addEventListener('click', function () { goTo(parseInt(b.getAttribute('data-prev'), 10)); });
    });
    $('btn-pdf').addEventListener('click', doPDF);
    $('btn-print').addEventListener('click', doPrint);
    $('btn-reset').addEventListener('click', function () {
      if (confirm('Start a new assessment? All entered data in this browser will be cleared.')) resetAll();
    });
  }

  /* ============ Datalist for family relations ============ */
  function addFamilyDatalist() {
    var d = document.createElement('datalist');
    d.id = 'famRoles';
    ASSESS.familyRoleOptions.forEach(function (o) {
      var op = document.createElement('option');
      op.value = o;
      d.appendChild(op);
    });
    document.body.appendChild(d);
  }

  /* ============ Init ============ */
  function init() {
    Object.assign(STATE, load());
    if (demoEnabled()) fillDemo();
    addFamilyDatalist();
    bindPersonal();
    renderFamily();
    bindFamily();
    renderQA();
    renderTemperament();
    renderEQ();
    bindNav();
    var s = stepParam();
    goTo(s === null ? 0 : s);
    save();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
