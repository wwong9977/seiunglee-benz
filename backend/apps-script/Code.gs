/**
 * 이세웅 과장 상담 접수 — Google Apps Script 웹앱
 * ------------------------------------------------------------
 * 홈페이지(GitHub Pages)의 상담 폼이 이 웹앱으로 접수 내용을 보내면
 * 과장님 구글 시트의 "상담접수" 탭에 한 줄씩 저장하고 결과(JSON)를 돌려줍니다.
 *
 * - 고객 개인정보는 과장님 구글 계정의 시트에만 저장됩니다 (공개 저장소·브라우저에 남지 않음).
 * - 비밀키가 필요 없습니다. 웹앱 주소(…/exec)만 data.js의 formEndpoint에 넣습니다.
 * - 저장이 실제로 끝난 경우에만 { ok: true } 를 돌려주며, 홈페이지는 이때만 "접수 완료"를 표시합니다.
 *
 * 설치 방법은 같은 폴더의 SETUP.md 참고.
 */

var SHEET_NAME = '상담접수';
var NOTIFY_EMAIL = '';      // 새 접수 알림 메일을 받을 주소. 비워두면 알림 없음 (테스트가 끝난 뒤 입력 권장)
var DUP_WINDOW_MIN = 10;    // 같은 연락처+모델이 이 시간(분) 안에 다시 들어오면 중복으로 보고 저장하지 않음
var MAX_PER_HOUR = 300;     // 전체 접수 시간당 상한 (스팸 폭주 방지)
var RETENTION_DAYS = 30;    // 개인정보 보유기간: 수집일로부터 1개월. 매일 새벽 자동 삭제 (setup 실행 시 예약)

var HEADERS = [
  '접수시각', '접수번호', '상태', '이름', '연락처', '관심모델', '구매방식', '구매시기',
  '회사·협회', '문의내용', '개인정보동의', '마케팅수신동의',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  '광고클릭ID', '네이버키워드', '첫방문페이지', '첫방문시각', '유입사이트', '접수페이지', 'submission_id', '메모'
];

var MODELS = {
  'e-class': 'E-Class', 's-class': 'S-Class', 'glc': 'GLC', 'gle': 'GLE',
  'c-class': 'C-Class', 'glb': 'GLB', 'gls': 'GLS', 'eq': 'EQE·EQS', 'g-class': 'G-Class',
  'glc-ev': 'GLC electric', 'glb-ev': 'GLB electric', 'cla-ev': 'CLA electric', 'other': '기타·미정'
};
var METHODS = ['현금', '할부', '리스', '렌트', '미정', ''];
var TIMINGS = ['1개월 이내', '3개월 이내', '6개월 이내', '미정', ''];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // 1) 스팸 방지 (봇이 채우는 숨김 칸)
    if (d.hp) return out_({ ok: false, error: 'rejected' });

    // 2) 입력값 검증 — 브라우저 검사와 별도로 서버에서도 다시 확인
    var name = clean_(d.name, 20);
    var phone = String(d.phone || '').replace(/\D/g, '');
    var model = String(d.model || '');
    if (name.length < 2) return out_({ ok: false, error: 'invalid_name' });
    if (!/^01[016789]\d{7,8}$/.test(phone)) return out_({ ok: false, error: 'invalid_phone' });
    if (!MODELS.hasOwnProperty(model)) return out_({ ok: false, error: 'invalid_model' });
    if (d.agree_privacy !== true) return out_({ ok: false, error: 'consent_required' });
    var method = METHODS.indexOf(d.method || '') >= 0 ? (d.method || '') : '';
    var timing = TIMINGS.indexOf(d.timing || '') >= 0 ? (d.timing || '') : '';
    var sid = clean_(d.submission_id, 64);
    if (!sid) return out_({ ok: false, error: 'invalid_request' });

    lock.waitLock(10000);
    var cache = CacheService.getScriptCache();

    // 3) 같은 제출을 두 번 보낸 경우 (네트워크 재시도 등) → 이미 저장된 접수번호를 그대로 돌려줌
    var prev = cache.get('sid:' + sid);
    if (prev) return out_({ ok: true, id: prev, duplicate: true });

    // 4) 같은 연락처+모델이 짧은 시간 안에 반복되면 저장하지 않고 성공으로 응답 (고객 화면은 정상 완료)
    var dupKey = 'dup:' + phone + ':' + model;
    var dupId = cache.get(dupKey);
    if (dupId) return out_({ ok: true, id: dupId, duplicate: true });

    // 5) 시간당 상한
    var hourKey = 'h:' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMddHH');
    var cnt = Number(cache.get(hourKey) || 0);
    if (cnt >= MAX_PER_HOUR) return out_({ ok: false, error: 'busy' });

    var sh = sheet_();
    var now = new Date();
    var id = Utilities.formatDate(now, 'Asia/Seoul', 'MMdd') + '-' + Utilities.getUuid().slice(0, 4).toUpperCase();
    var phoneFmt = phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');

    sh.appendRow([
      now, id, '신규', name, phoneFmt, MODELS[model], method, timing,
      clean_(d.company, 60), clean_(d.message, 1000), '동의', d.agree_marketing === true ? '동의' : '미동의',
      clean_(d.utm_source, 120), clean_(d.utm_medium, 120), clean_(d.utm_campaign, 120), clean_(d.utm_content, 120), clean_(d.utm_term, 120),
      clean_(d.fbclid || d.gclid || '', 200), clean_(d.n_keyword || d.n_query || '', 120),
      clean_(d.landing, 120), clean_(d.first_seen, 40), clean_(d.referrer, 120), clean_(d.page, 120), sid, ''
    ]);
    SpreadsheetApp.flush(); // 실제로 기록된 뒤에만 성공 응답

    cache.put('sid:' + sid, id, 21600);
    cache.put(dupKey, id, DUP_WINDOW_MIN * 60);
    cache.put(hourKey, String(cnt + 1), 3600);

    if (NOTIFY_EMAIL) {
      try {
        MailApp.sendEmail(NOTIFY_EMAIL, '[상담 접수] ' + MODELS[model] + ' · ' + name,
          '접수번호: ' + id + '\n이름: ' + name + '\n연락처: ' + phoneFmt + '\n관심 모델: ' + MODELS[model] +
          '\n구매 방식: ' + (method || '-') + '\n구매 시기: ' + (timing || '-') +
          '\n유입: ' + [d.utm_source, d.utm_medium, d.utm_campaign].filter(String).join(' / ') +
          '\n\n시트에서 확인: ' + ss_().getUrl());
      } catch (mailErr) { /* 알림 실패는 접수 성공에 영향 없음 */ }
    }
    return out_({ ok: true, id: id });
  } catch (err) {
    return out_({ ok: false, error: 'server_error' });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/** 브라우저에서 주소를 열었을 때 동작 확인용 (개인정보 없음) */
function doGet() {
  return out_({ ok: true, service: 'lead-intake', sheet: SHEET_NAME });
}

/** 접수 시트 파일: 시트에 붙은 스크립트면 그 시트, 단독 스크립트면 처음 실행 때 '벤츠 상담 접수' 시트를 새로 만들어 기억 */
function ss_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  var ss = SpreadsheetApp.getActive();
  if (!ss) { ss = SpreadsheetApp.create('벤츠 상담 접수'); }
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function sheet_() {
  var ss = ss_();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#f3efe6');
    sh.getRange('E:E').setNumberFormat('@');
  }
  return sh;
}

/** 시트 수식 실행 방지(=, +, -, @ 로 시작하는 값) + 길이 제한 */
function clean_(v, max) {
  var s = String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max || 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** 보유기간(RETENTION_DAYS)이 지난 접수 행을 삭제합니다. setup()이 매일 새벽 4시 자동 실행을 예약합니다. */
function purgeOld() {
  var sh = sheet_();
  var last = sh.getLastRow(); if (last < 2) return;
  var limit = new Date(Date.now() - RETENTION_DAYS * 864e5);
  var times = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = times.length - 1; i >= 0; i--) {
    var t = times[i][0];
    if (t instanceof Date && t < limit) sh.deleteRow(i + 2);
  }
}

/** 설치 직후 한 번 실행: 시트 탭·머리글 생성, 권한 승인, 보유기간 자동 삭제 예약 (테스트 행은 만들지 않음) */
function setup() {
  var sh = sheet_();
  var first = sh.getParent().getSheets()[0];
  if (first.getName() !== SHEET_NAME && first.getLastRow() === 0) sh.getParent().deleteSheet(first); // 빈 기본 탭 정리
  Logger.log('접수 시트: ' + sh.getParent().getUrl());
  var has = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'purgeOld'; });
  if (!has) ScriptApp.newTrigger('purgeOld').timeBased().everyDays(1).atHour(4).inTimezone('Asia/Seoul').create();
}
