window.Report = (function () {
  var R = document.getElementById('report');
  var pages = [];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function val(v) {
    var t = String(v == null ? '' : v).trim();
    return t ? esc(t) : '&mdash;';
  }
  function newPage() {
    var d = document.createElement('div');
    d.className = 'report-page';
    pages.push(d);
    R.appendChild(d);
    return d;
  }
  function foot(page, num) {
    page.insertAdjacentHTML('beforeend',
      '<div class="rp-foot"><span>Applicant Assessment Report</span><span>Page ' + num + '</span></div>');
  }
  function brand(page) {
    page.insertAdjacentHTML('beforeend',
      '<div class="rp-brand">' +
        '<div style="display:flex;align-items:center;gap:14px">' +
          '<div class="rp-logo">A</div>' +
          '<div><div class="b1">APPLICANT ASSESSMENT REPORT</div>' +
          '<div class="b2">Professional Evaluation &middot; Staff Recruitment</div></div>' +
        '</div>' +
        '<div class="b3">CONFIDENTIAL</div>' +
      '</div>');
  }
  function section(page, no, title) {
    page.insertAdjacentHTML('beforeend',
      '<div class="rp-section"><span class="no">' + no + '</span>' + esc(title) + '</div>');
  }

  function eqAnswerLabel(v) {
    for (var i = 0; i < ASSESS.eqOptions.length; i++) {
      if (ASSESS.eqOptions[i].value === v) return ASSESS.eqOptions[i].label;
    }
    return '';
  }
  function eqBandColor(rating) {
    if (rating === 'EXCELLENT') return '#059669';
    if (rating === 'GOOD') return '#d97706';
    return '#dc2626';
  }
  function eqScore(state, key) {
    var arr = (state.eq && state.eq[key]) || [];
    var s = 0, n = 0;
    arr.forEach(function (v) { if (v) { s += v; n++; } });
    return { score: s, answered: n };
  }
  function tempCount(state, key) {
    return (state.temp && state.temp[key]) ? state.temp[key].length : 0;
  }
  function findDominant(state) {
    var best = 0, keys = [];
    ASSESS.temperament.forEach(function (t) {
      var c = tempCount(state, t.key);
      if (c > best) { best = c; keys = [t.key]; }
      else if (c === best && c > 0) keys.push(t.key);
    });
    return { keys: keys, count: best };
  }
  function eqOverall(state) {
    var total = 0, answered = 0;
    ASSESS.eqScales.forEach(function (s) {
      var r = eqScore(state, s.key);
      total += r.score; answered += r.answered;
    });
    return { total: total, answered: answered, max: 225 };
  }
  function eqOverallBand(state) {
    var o = eqOverall(state);
    if (o.total <= 75) return { rating: 'EXCELLENT', note: 'Effectively Functioning', color: '#059669' };
    if (o.total <= 150) return { rating: 'GOOD', note: 'Functioning', color: '#d97706' };
    return { rating: 'POOR', note: 'Needs Improvement', color: '#dc2626' };
  }

  /* ---------------- Build ---------------- */
  function build(state) {
    R.innerHTML = '';
    pages = [];

    /* ===== Page 1: Cover ===== */
    var p1 = newPage();
    brand(p1);
    p1.insertAdjacentHTML('beforeend',
      '<div class="rp-title">' + (val(state.p.fullName)) + '</div>' +
      '<div class="rp-subtitle">Candidate Assessment &amp; Evaluation' +
        (state.p.position ? ' &mdash; ' + esc(state.p.position) : '') + '</div>');
    p1.insertAdjacentHTML('beforeend',
      '<table class="rp-meta">' +
        '<tr><td class="l">Position Applied For</td><td>' + val(state.p.position) + '</td>' +
        '<td class="l">Date of Interview</td><td>' + val(state.p.interviewDate) + '</td></tr>' +
        '<tr><td class="l">Age</td><td>' + val(state.p.age) + '</td>' +
        '<td class="l">Sex</td><td>' + val(state.p.sex) + '</td></tr>' +
        '<tr><td class="l">Civil Status</td><td>' + val(state.p.civilStatus) + '</td>' +
        '<td class="l">Interviewer</td><td>' + val(state.p.interviewer) + '</td></tr>' +
        '<tr><td class="l">Mobile Number</td><td>' + val(state.p.mobile) + '</td>' +
        '<td class="l">Email Address</td><td>' + val(state.p.email) + '</td></tr>' +
      '</table>');

    var dom = findDominant(state);
    var eqb = eqOverallBand(state);
    var eqScales = [];
    ASSESS.eqScales.forEach(function (s) {
      var r = eqScore(state, s.key);
      if (r.answered === s.questions.length) eqScales.push({ title: s.title, rating: ASSESS.eqInterpret(r.score).rating });
    });

    p1.insertAdjacentHTML('beforeend',
      '<div class="rp-cards">' +
        '<div class="rp-stat"><div class="l">Dominant Temperament</div><div class="v">' +
          esc(dom.keys.map(function (k) {
            var t = ASSESS.temperament.filter(function (x) { return x.key === k; })[0];
            return t ? t.name : '';
          }).join(' / ')) + '</div></div>' +
        '<div class="rp-stat"><div class="l">Emotional Intelligence</div><div class="v">' + eqb.rating + '</div></div>' +
        '<div class="rp-stat"><div class="l">EQ Scales Evaluated</div><div class="v">' + eqScales.length + ' / 5</div></div>' +
      '</div>');

    p1.insertAdjacentHTML('beforeend',
      '<div class="rp-note">This report consolidates the applicant\'s personal information, family background, interview responses, temperament profile and emotional intelligence assessment. It is intended for interviewer reference and evaluation purposes only and is treated as strictly confidential.</div>');
    foot(p1, 1);

    /* ===== Page 2: Personal Info + Family ===== */
    var p2 = newPage();
    brand(p2);
    section(p2, '1', 'Personal Information');
    var infoRows = [
      ['Full Name', state.p.fullName], ['Date of Birth', state.p.dob], ['Age', state.p.age],
      ['Sex', state.p.sex], ['Civil Status', state.p.civilStatus], ['Religion', state.p.religion],
      ['Present Address', state.p.address], ['Mobile Number', state.p.mobile],
      ['Email Address', state.p.email], ['Position Applied For', state.p.position],
      ['Date of Interview', state.p.interviewDate], ['Interviewer', state.p.interviewer]
    ];
    var html2 = '<table class="rp-table"><thead><tr><th style="width:30%">Field</th><th>Details</th></tr></thead><tbody>';
    infoRows.forEach(function (r) {
      html2 += '<tr><td style="font-weight:700;color:#475569">' + esc(r[0]) + '</td><td>' + val(r[1]) + '</td></tr>';
    });
    html2 += '</tbody></table>';
    p2.insertAdjacentHTML('beforeend', html2);

    section(p2, '2', 'Family Background');
    var famRows = state.family.filter(function (f) {
      return (f.name && f.name.trim()) || (f.occupation && f.occupation.trim());
    });
    var htmlF = '<table class="rp-table"><thead><tr><th>Family Member</th><th>Name</th><th>Age</th><th>Occupation / Year / Grade</th><th>Gender</th></tr></thead><tbody>';
    if (!famRows.length) {
      htmlF += '<tr><td colspan="5" style="text-align:center;color:#94a3b8">No family background provided.</td></tr>';
    } else {
      famRows.forEach(function (f) {
        htmlF += '<tr><td style="font-weight:700">' + val(f.relation) + '</td><td>' + val(f.name) + '</td><td>' + val(f.age) + '</td><td>' + val(f.occupation) + '</td><td>' + val(f.gender) + '</td></tr>';
      });
    }
    htmlF += '</tbody></table>';
    p2.insertAdjacentHTML('beforeend', htmlF);
    foot(p2, 2);

    /* ===== Pages 3-4: Questionnaire ===== */
    var perPage = 10;
    var chunks = [];
    for (var i = 0; i < state.qa.length; i += perPage) chunks.push(state.qa.slice(i, i + perPage));
    chunks.forEach(function (chunk, ci) {
      var page = newPage();
      brand(page);
      section(page, '3', 'Applicant Questionnaire');
      chunk.forEach(function (qa) {
        page.insertAdjacentHTML('beforeend',
          '<div class="rp-qa"><div class="q"><span class="n">' + qa.num + '.</span>' + esc(qa.q) + '</div>' +
          '<div class="a">' + (qa.a && qa.a.trim() ? esc(qa.a) : 'No answer recorded.') + '</div></div>');
      });
      if (ci === chunks.length - 1) {
        page.insertAdjacentHTML('beforeend',
          '<div style="display:flex;gap:16px;margin-top:10px">' +
            '<div style="flex:1"><div class="rp-section" style="background:#0f766e">Interviewer Comments</div>' +
            '<div style="border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-size:12px;color:#334155;min-height:60px">' +
              (state.comments && state.comments.trim() ? esc(state.comments) : 'No comments recorded.') + '</div></div>' +
            '<div style="flex:1"><div class="rp-section" style="background:#0f766e">Interviewer Suggestions</div>' +
            '<div style="border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-size:12px;color:#334155;min-height:60px">' +
              (state.suggestions && state.suggestions.trim() ? esc(state.suggestions) : 'No suggestions recorded.') + '</div></div>' +
          '</div>');
      }
      foot(page, 3 + ci);
    });

    /* ===== Page 5: Temperament ===== */
    var p5 = newPage();
    brand(p5);
    section(p5, '4', 'Temperament Test');
    var domSet = {};
    dom.keys.forEach(function (k) { domSet[k] = true; });
    ASSESS.temperament.forEach(function (t) {
      var c = tempCount(state, t.key);
      var interp = ASSESS.temperamentInterpret(c);
      var isDom = domSet[t.key] && dom.count > 0;
      var pct = Math.round((c / 20) * 100);
      p5.insertAdjacentHTML('beforeend',
        '<div class="rp-temp' + (isDom ? ' dom' : '') + '">' +
          '<div class="row1"><div><span class="nm">' + esc(t.name) + '</span> <span class="tag">&mdash; ' + esc(t.tagline) + '</span></div>' +
          '<div class="ct">' + c + ' / 20</div></div>' +
          '<div class="rp-bar-bg"><div class="rp-bar" style="width:' + pct + '%"></div></div>' +
          '<div style="margin-top:7px"><span class="rp-badge" style="background:' + interp.color + '">' + interp.level.toUpperCase() + '</span>' +
          (isDom ? ' <span class="rp-badge" style="background:#d97706">DOMINANT</span>' : '') + '</div>' +
          '<div class="rp-desc">' + esc(t.description) + '</div>' +
        '</div>');
    });
    if (dom.count > 0) {
      var domNames = dom.keys.map(function (k) {
        var t = ASSESS.temperament.filter(function (x) { return x.key === k; })[0];
        return t ? t.name : '';
      }).join(' and ');
      p5.insertAdjacentHTML('beforeend',
        '<div class="rp-callout"><div class="t">Dominant Temperament: ' + esc(domNames) + '</div>' +
        '<div class="d">The applicant\'s highest score indicates a primary temperament blend. Each person is a blend of all four types; the dominant type highlights natural strengths and tendencies to be considered during evaluation.</div></div>');
    }
    foot(p5, 5);

    /* ===== Pages 6-7: EQ ===== */
    var eqPages = [];
    var scaleChunks = [ASSESS.eqScales.slice(0, 3), ASSESS.eqScales.slice(3)];
    scaleChunks.forEach(function (chunk, ci) {
      var page = newPage();
      brand(page);
      section(page, '5', 'Emotional Intelligence Test');
      chunk.forEach(function (s) {
        var r = eqScore(state, s.key);
        var complete = r.answered === s.questions.length;
        var band = complete ? ASSESS.eqInterpret(r.score) : null;
        var scoreText;
        if (complete) {
          scoreText = 'Score: ' + r.score + ' / 45 &mdash; ' + band.rating + ' (' + band.note + ')';
        } else if (r.answered > 0) {
          scoreText = r.answered + ' / 9 answered';
        } else {
          scoreText = 'Not completed';
        }
        page.insertAdjacentHTML('beforeend',
          '<div class="rp-eq-scale">' +
            '<div class="rp-eq-head"><span class="t">' + esc(s.title) + '</span>' +
            '<span class="s" style="color:' + (band ? eqBandColor(band.rating) : '#94a3b8') + '">' + scoreText +
            '</span></div>' +
            '<table class="rp-eq-table">');
        s.questions.forEach(function (q, qi) {
          var v = (state.eq[s.key] || [])[qi];
          page.insertAdjacentHTML('beforeend',
            '<tr><td class="no">' + (qi + 1) + '</td><td>' + esc(q) + '</td>' +
            '<td class="ans" style="color:' + (v ? '#0f172a' : '#cbd5e1') + '">' + (v ? v + ' &middot; ' + eqAnswerLabel(v) : '&mdash;') + '</td></tr>');
        });
        page.insertAdjacentHTML('beforeend', '</table></div>');
      });

      if (ci === scaleChunks.length - 1) {
        var o = eqOverall(state);
        var completeAll = o.answered === 45;
        page.insertAdjacentHTML('beforeend',
          '<div class="rp-overall"><div class="t">Overall Emotional Quotient: ' +
            (completeAll
              ? o.total + ' / ' + o.max + ' &mdash; ' + eqb.rating + ' (' + eqb.note + ')'
              : o.answered + ' / 45 answered') +
          '</div>' +
          '<div class="d">Sum of all five EQ composite scales. Lower scores indicate stronger emotional functioning across the evaluated dimensions.</div></div>');

        page.insertAdjacentHTML('beforeend',
          '<div class="rp-sig">' +
            '<div class="box"><div class="line"></div><div class="nm">' + (state.p.interviewer ? esc(state.p.interviewer) : '__________________') + '</div><div class="rl">Interviewer</div></div>' +
            '<div class="box"><div class="line"></div><div class="nm">__________________</div><div class="rl">HR / Manager</div></div>' +
            '<div class="box"><div class="line"></div><div class="nm">' + (state.p.interviewDate ? esc(state.p.interviewDate) : '__________________') + '</div><div class="rl">Date</div></div>' +
          '</div>');
      }
      eqPages.push(page);
      foot(page, 6 + ci);
    });

    return pages.length;
  }

  /* ---------------- PDF ---------------- */
  function safeName(name) {
    var s = String(name || 'Applicant').trim().replace(/[\\/:*?"<>|]/g, '_');
    return s || 'Applicant';
  }

  async function downloadPDF(state, cb) {
    build(state);
    var { jsPDF } = window.jspdf;
    var pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    for (var i = 0; i < pages.length; i++) {
      var canvas = await html2canvas(pages[i], {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 794
      });
      var img = canvas.toDataURL('image/jpeg', 0.92);
      if (i > 0) pdf.addPage();
      pdf.addImage(img, 'JPEG', 0, 0, 210, 297);
      if (cb) cb(i + 1, pages.length);
    }
    var nm = safeName(state.p.fullName);
    var fn = (nm !== 'Applicant' ? 'Applicant - ' + nm : 'Applicant') + '.pdf';
    pdf.save(fn);
    var base64 = pdf.output('datauristring').split(',')[1] || '';
    return { filename: fn, base64: base64 };
  }

  function buildForPrint(state) {
    return build(state);
  }

  return {
    build: build,
    downloadPDF: downloadPDF,
    buildForPrint: buildForPrint,
    safeName: safeName
  };
})();
