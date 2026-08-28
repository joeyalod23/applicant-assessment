window.Cloud = (function () {
  'use strict';

  var APP_URL = 'https://script.google.com/macros/s/AKfycbw2Qj22wvuzjEHrIJgrJ2UTuYAngqSbsX1erXrCP9k-16wW4BiAmzI0sbOwWPt9MCtj/exec';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function now() {
    return new Date().toISOString();
  }

  function payloadFor(state, pdf) {
    return {
      savedAt: now(),
      payloadType: pdf ? 'report' : 'data',
      applicant: {
        fullName: state.p.fullName || '',
        position: state.p.position || '',
        interviewDate: state.p.interviewDate || '',
        interviewer: state.p.interviewer || ''
      },
      data: state,
      pdf: pdf ? { filename: pdf.filename || '', base64: pdf.base64 || '' } : null
    };
  }

  function upload(state, pdf) {
    var body = JSON.stringify(payloadFor(state, pdf));
    return fetch(APP_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: body
    }).then(function (res) {
      return res.text();
    }).then(function (text) {
      // Apps Script returns the stored JSON when doPost succeeds.
      try {
        var parsed = JSON.parse(text);
        return parsed;
      } catch (e) {
        // Non-JSON body: could be a CORS/HTML error page or an Apps Script
        // "script function not found" page. Detect the common cases.
        var msg = 'Unexpected response from the cloud service.';
        if (/script function[^<]* doPost/i.test(text)) {
          msg = 'The cloud service has no doPost handler. Add Code.gs to your Apps Script and redeploy.';
        } else if (/Script function/i.test(text)) {
          msg = 'The cloud service returned an Apps Script error page.';
        } else if (/<html/i.test(text)) {
          msg = 'The cloud service returned an HTML page instead of JSON (check backend deployment).';
        }
        return { ok: false, error: msg, rawHtml: text };
      }
    }).catch(function (err) {
      // Network / CORS failure (e.g. opening this file directly from disk).
      return {
        ok: false,
        error: 'Cloud save failed: ' + (err && err.message ? err.message : String(err)) +
          '. Open the app via a web server / https URL for cloud saves to work.'
      };
    });
  }

  function savedAtLabel(t) {
    try {
      return new Date(t).toLocaleString();
    } catch (e) { return t; }
  }

  return {
    APP_URL: APP_URL,
    payloadFor: payloadFor,
    upload: upload,
    savedAtLabel: savedAtLabel
  };
})();
