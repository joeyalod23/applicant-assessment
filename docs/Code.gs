/**
 * Google Apps Script backend for the Applicant Assessment System.
 *
 * Storage: DRIVE ONLY (no spreadsheet).
 * - Saves each generated report PDF into a Google Drive folder named "Applicant Reports".
 *
 * SETUP (one time):
 *   1. Open the Apps Script project that backs your /exec URL
 *      (script.google.com -> your project -> Extensions / Editor).
 *   2. Delete any existing Code.gs content and paste this whole file in.
 *   3. Click Deploy -> Manage deployments -> find your existing web app deployment
 *      -> Edit -> set a new Version  -> Deploy. (Re-deploying is REQUIRED to push
 *      new code to the /exec URL.)
 *   4. If prompted, authorize the script to access Google Drive.
 *
 * NOTES:
 *   - The frontend (js/cloud.js) POSTs JSON to /exec with this shape:
 *       { savedAt, payloadType, applicant{...}, data{...},
 *         pdf: { filename, base64 } }
 *   - Apps Script follows a redirect: ContentService returns JSON.
 */

var FOLDER_NAME = 'Applicant Reports';

function doGet() {
  return asJson({ ok: true, message: 'Applicant Assessment cloud service is running.' });
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    var pdfInfo = null;
    if (payload && payload.pdf && payload.pdf.base64) {
      pdfInfo = savePdf(payload.pdf);
    }

    return asJson({
      ok: true,
      message: 'Report saved to Drive.',
      pdf: pdfInfo,
      applicant: payload ? payload.applicant : null,
      savedAt: payload ? payload.savedAt : null
    });
  } catch (err) {
    return asJson({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function savePdf(pdf) {
  var name = sanitize(pdf.filename || 'Applicant Assessment Report.pdf');
  var blob = Utilities.newBlob(
    Utilities.base64Decode(pdf.base64),
    'application/pdf',
    name
  );
  var folder = ensureFolder();
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { id: file.getId(), name: name, link: file.getUrl(), folder: FOLDER_NAME };
}

function ensureFolder() {
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(FOLDER_NAME);
}

function sanitize(name) {
  return String(name || 'Report.pdf')
    .replace(/[\\/:*?"<>|]/g, '_')
    .slice(0, 120) || 'Report.pdf';
}

function asJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
