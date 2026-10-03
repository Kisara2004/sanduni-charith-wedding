// Paste this into Extensions > Apps Script from your Google Sheet.
// Replace the value below with the same long private value used for RSVP_SHARED_SECRET in Vercel.
const RSVP_SHARED_SECRET = 'PASTE_A_LONG_PRIVATE_SECRET_HERE';

function doPost(event) {
  const data = JSON.parse(event.postData.contents || '{}');
  if (data.secret !== RSVP_SHARED_SECRET) return reply({ ok: false });

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('RSVP') || spreadsheet.insertSheet('RSVP');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Submitted at', 'Name', 'Attending', 'Guests', 'Phone', 'Message']);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([new Date(), data.name, data.attendance, data.guests, data.phone, data.message]);
  return reply({ ok: true });
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
