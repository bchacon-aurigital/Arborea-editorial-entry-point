const CONFIG = {
  SHARED_SECRET: 'REPLACE_WITH_A_LONG_RANDOM_SECRET',
  SHEET_ID: 'REPLACE_WITH_YOUR_GOOGLE_SHEET_ID',
  TIMEZONE: 'America/Costa_Rica',
  ORDERS_TAB: 'Orders',
  LOG_TAB: 'Log',
  NOTIFY_EMAILS: ['operations@arboreaexperiences.com'],
};

function doGet() {
  return json({ ok: true, service: 'arborea-orders', ts: new Date().toISOString() });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.secret !== CONFIG.SHARED_SECRET) {
      return json({ ok: false, error: 'Unauthorized' });
    }
    if (!payload.submissionId || !payload.service || !payload.name || !payload.casa || !payload.dateNeeded) {
      return json({ ok: false, error: 'Missing required fields' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const existingRow = findLogRow_(payload.submissionId);
      if (existingRow) {
        return json({ ok: true, submissionId: payload.submissionId, dedup: true });
      }

      const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
      const sheet = ensureOrdersSheet_(ss);

      const now = new Date();
      const stamp = Utilities.formatDate(now, CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
      const items = Array.isArray(payload.items) ? payload.items : [];

      sheet.appendRow([
        stamp,
        payload.submissionId,
        payload.service || '',
        payload.name || '',
        payload.casa || '',
        payload.dateNeeded || '',
        items.map(function (it) { return it.price ? (it.label + ' ($' + it.price + ')') : it.label; }).join('\n'),
        payload.total || 0,
        payload.notes || '',
      ]);

      markProcessed_(payload.submissionId, stamp);

      try { sendNotification_(payload, stamp); } catch (err) {}

      return json({ ok: true, submissionId: payload.submissionId });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function ensureOrdersSheet_(ss) {
  let sheet = ss.getSheetByName(CONFIG.ORDERS_TAB);
  if (!sheet) sheet = ss.insertSheet(CONFIG.ORDERS_TAB);
  if (sheet.getLastRow() === 0) {
    const headers = ['Fecha y Hora', 'ID de Pedido', 'Servicio', 'Nombre', 'Casa', 'Fecha Requerida', 'Productos', 'Total (USD)', 'Notas'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 240);
    sheet.setColumnWidth(7, 320);
    sheet.setColumnWidth(9, 260);
  }
  return sheet;
}

function ensureLogSheet_(ss) {
  let sheet = ss.getSheetByName(CONFIG.LOG_TAB);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.LOG_TAB);
    sheet.getRange(1, 1, 1, 2).setValues([['ID de Pedido', 'Procesado el']]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findLogRow_(submissionId) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ensureLogSheet_(ss);
  if (sheet.getLastRow() < 2) return null;
  const finder = sheet.getRange('A2:A' + sheet.getLastRow()).createTextFinder(submissionId).matchEntireCell(true);
  return finder.findNext();
}

function markProcessed_(submissionId, stamp) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ensureLogSheet_(ss);
  sheet.appendRow([submissionId, stamp]);
}

function sendNotification_(payload, stamp) {
  const items = Array.isArray(payload.items) ? payload.items : [];

  let rows = '';
  items.forEach(function (it) {
    rows += '<tr>'
      + '<td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px">' + escapeHtml_(it.label) + '</td>'
      + '<td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:right">' + (it.price ? ('$' + it.price) : '—') + '</td>'
      + '</tr>';
  });

  const html = ''
    + '<div style="font-family:Arial,Helvetica,sans-serif;color:#222E2C;max-width:640px">'
    + '<p style="color:#7D8584;font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 4px">Arbórea · New order</p>'
    + '<h2 style="margin:0 0 16px;font-size:20px">' + escapeHtml_(payload.service || '') + '</h2>'
    + '<p style="margin:0 0 4px"><strong>Name:</strong> ' + escapeHtml_(payload.name || '') + '</p>'
    + '<p style="margin:0 0 4px"><strong>Casa:</strong> ' + escapeHtml_(payload.casa || '') + '</p>'
    + '<p style="margin:0 0 4px"><strong>Date needed:</strong> ' + escapeHtml_(payload.dateNeeded || '') + '</p>'
    + '<p style="margin:0 0 20px;color:#7D8584"><strong>Submitted:</strong> ' + escapeHtml_(stamp) + ' (CR)</p>'
    + '<table style="width:100%;border-collapse:collapse">' + rows + '</table>'
    + '<p style="margin:16px 0 0;font-size:15px"><strong>Total: $' + (payload.total || 0) + '</strong></p>'
    + (payload.notes ? '<p style="margin:16px 0 0;font-size:13px"><strong>Notes:</strong><br>' + escapeHtml_(payload.notes).replace(/\n/g, '<br>') + '</p>' : '')
    + '</div>';

  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAILS.join(','),
    subject: 'New order — ' + (payload.service || '') + ' (' + (payload.name || '') + ')',
    htmlBody: html,
  });
}

function escapeHtml_(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function initSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  ensureOrdersSheet_(ss);
  ensureLogSheet_(ss);
  Logger.log('Orders + Log tabs ready.');
}

function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        secret: CONFIG.SHARED_SECRET,
        submissionId: 'test-' + Utilities.getUuid(),
        service: 'Full Fridge',
        name: 'Test Guest',
        casa: 'casa-mango',
        dateNeeded: Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd'),
        items: [{ label: '3 Days · Family of 4', price: 410 }, { label: 'Wine Package', price: 45 }],
        total: 455,
        notes: 'Test order from testDoPost().',
      }),
    },
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
