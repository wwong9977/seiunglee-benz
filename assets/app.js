/* 화면 동작 스크립트 — 일반 운영 시 수정할 필요 없음. 내용은 data.js에서 관리 */
(function () {
  const S = window.SITE, C = S.config;
  const LIVE = () => document.body.dataset.mode === "live";
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const man = (won) => Math.floor(won / 10000).toLocaleString("ko-KR") + "만원";
  const todayStr = () => { const d = new Date(Date.now() + 9 * 3600e3); return d.toISOString().slice(0, 10); }; // KST
  const active = (p) => { const t = todayStr(); return (p.validFrom || S.promoMeta.validFrom) <= t && t <= (p.validTo || S.promoMeta.validTo); };
  const loyalty = (p) => Math.max((p.ret || 0) + (p.trade || 0), p.conquest || 0);
  const maxRate = (p) => (p.base || 0) + (p.mbm || 0) + loyalty(p);
  const headRate = (p) => (p.base || 0) + (p.mbm || 0); // 화면 표시용: 현금 + 금융(MBM)만
  const myLabel = (p) => (p.my === "MY27" ? "27년식" : p.my === "MY26" ? "26년식" + (p.stock ? " 재고" : "") : p.my);
  const discOf = (price, rate) => Math.floor((price * rate) / 100 / 10000) * 10000;
  const modelName = (id) => (S.models.find((m) => m.id === id) || {}).name || id;
  const store = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- 측정(이벤트) ---------- */
  window.dataLayer = window.dataLayer || [];
  const log = [];
  function track(name, params = {}) {
    const ev = { event: name, ...params, ...utm() };
    window.dataLayer.push(ev);
    try { if (C.ga4Installed && window.gtag) gtag("event", name, params); } catch (e) {}
    try { if (C.metaPixelInstalled && window.fbq) { if (name === "lead_submit_success") fbq("track", "Lead"); else fbq("trackCustom", name, params); } } catch (e) {}
    log.unshift(new Date().toLocaleTimeString("ko-KR") + "  " + name + " " + JSON.stringify(params));
    const d = $("#dbg"); if (d) d.innerHTML = "<b>측정 이벤트 로그 (테스트)</b>" + log.slice(0, 30).map((l) => "<div>" + esc(l) + "</div>").join("");
  }

  /* ---------- UTM 보존 ---------- */
  function utm() {
    const raw = store.get("lead_src");
    return raw ? JSON.parse(raw) : {};
  }
  (function captureUtm() {
    const q = new URLSearchParams(location.search), keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "n_keyword"];
    const found = {}; keys.forEach((k) => { if (q.get(k)) found[k] = q.get(k).slice(0, 120); });
    if (Object.keys(found).length || !store.get("lead_src")) {
      found.landing = location.pathname.split("/").pop() || "index.html";
      found.referrer = document.referrer ? new URL(document.referrer).hostname : "";
      if (Object.keys(found).length > 2 || !store.get("lead_src")) store.set("lead_src", JSON.stringify(found));
    }
  })();

  /* ---------- 토스트 ---------- */
  let tt;
  function toast(msg) { const t = $("#toast"); if (!t) return; t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 3200); }

  /* ---------- 공통: 연락 버튼 ---------- */
  function wireContacts() {
    $$("[data-action=call]").forEach((a) => {
      if (C.phone) { a.href = "tel:" + C.phone.replace(/[^0-9+]/g, ""); a.setAttribute("aria-label", "전화 상담 " + C.phone); }
      a.addEventListener("click", (e) => { track("call_click", { location: a.dataset.loc || "" }); if (!C.phone) { e.preventDefault(); toast("전화번호 설정 전입니다 · data.js의 phone 값을 입력하세요"); } });
    });
    $$("[data-action=kakao]").forEach((a) => {
      if (C.kakaoUrl) { a.href = C.kakaoUrl; a.target = "_blank"; a.rel = "noopener"; }
      a.addEventListener("click", (e) => { track("kakao_click", { location: a.dataset.loc || "" }); if (!C.kakaoUrl) { e.preventDefault(); toast("카카오채널 주소 설정 전입니다 · data.js의 kakaoUrl 값을 입력하세요"); } });
    });
    $$("[data-phone-text]").forEach((el) => (el.textContent = C.phone || "전화번호 확인 필요"));
    document.addEventListener("click", (e) => {
      const q = e.target.closest("[data-quote]"); if (q) { e.preventDefault(); const [m, t, y] = q.dataset.quote.split("|"); openQuote(m, t, y, "card"); return; }
      const b = e.target.closest("[data-consult]"); if (b) { e.preventDefault(); openConsult(b.dataset.consult, b.dataset.loc || ""); }
    });
    const mb = $("#menuBtn"), mn = $("#mnav");
    if (mb) mb.addEventListener("click", () => { const o = mn.classList.toggle("open"); mb.setAttribute("aria-expanded", o); });
    if (mn) $$("a", mn).forEach((a) => a.addEventListener("click", () => mn.classList.remove("open")));
    const db = $("#dbgBtn"); if (db) db.addEventListener("click", () => $("#dbg").classList.toggle("open"));
    const st = $("#measureState");
    if (st) st.textContent = `GA4 ${C.ga4Installed ? "설치" : "미설치"} · 메타 픽셀 ${C.metaPixelInstalled ? "설치" : "미설치"} · 상담 접수 ${C.formEndpoint ? "연결됨" : "테스트 모드"}`;
  }

  /* 모델 상담 버튼 → 폼 관심 모델 자동 선택 */
  function openConsult(modelId, loc) {
    track("model_consult_click", { model: modelId, location: loc });
    const sel = $("#f-model");
    if (sel && modelId) { sel.value = modelId; sel.dispatchEvent(new Event("change")); }
    const f = $("#consult"); if (f) f.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { const n = $("#f-name"); if (n) n.focus({ preventScroll: true }); }, 600);
  }

  /* ---------- 프로모션 카드 ---------- */
  function promoCard(p) {
    const hr = headRate(p);
    const better = (p.better || []).map((b) => `<span class="flag up">▲ ${esc(b)}</span>`).join(" ");
    const adds = [p.ret ? `재구매 +${p.ret}%` : "", p.trade ? `Trade-in +${p.trade}%` : "", p.conquest ? `타 브랜드 보유 +${p.conquest}%` : ""].filter(Boolean).join(" · ");
    const d = p.price && hr ? discOf(p.price, hr) : 0;
    const zero = /무이자/.test(p.finance || "") ? (p.finance.match(/^[^(·]*무이자[^(·]*/) || [""])[0].replace("할부", "").trim() : "";
    const priceLine = p.price ? (hr ? `<p class="pc-price"><span>${man(p.price)}</span> → <b>${man(p.price - d)}</b></p>` : `<p class="pc-price"><b>${man(p.price)}</b>${p.priceNote ? ` <small>${esc(p.priceNote)}</small>` : ""}</p>`) : `<p class="pc-price"><b>가격 상담</b></p>`;
    return `<article class="pcard">
      <div class="top"><div><h3>${esc(p.trim)}</h3><div class="my">${esc(modelName(p.model))} · ${esc(myLabel(p))}${zero ? ` · <span class="pc-zero">${esc(zero)}</span>` : ""}</div></div></div>
      ${better ? `<div class="pc-flags">${better}</div>` : ""}
      <div class="rates" role="group" aria-label="할인 구성">
        <div><small>현금 할인</small><strong>${p.base ? p.base + "%" : "—"}</strong></div>
        <div><small>금융 이용 시${p.mbmNote ? "*" : ""}</small><strong>${p.mbm ? "+" + p.mbm + "%" : "—"}</strong></div>
        <div class="max"><small>합계</small><strong>${hr ? hr + "%" : "—"}</strong></div>
      </div>
      ${priceLine}
      <details class="pc-more"><summary>조건·금융 자세히</summary>
        ${p.mbmNote ? `<p class="cond">* 금융 이용 시: ${esc(p.mbmNote)}</p>` : ""}
        ${adds ? `<div class="cond"><b>해당되면 추가</b> · ${esc(adds)}${p.conquest ? " (재구매와 타 브랜드는 둘 중 하나)" : ""}${p.extraText ? "<br>" + esc(p.extraText) : ""}</div>` : ""}
        ${p.finance ? `<div class="cond"><b>금융 조건</b> · ${esc(p.finance)}</div>` : ""}
        <p class="pc-note">${p.price && hr ? `현금${p.mbm ? "+금융" : ""} 할인 ${man(d)} 기준 · ` : ""}탁송·등록비 별도 · 월 납입금이 아닌 차량가 기준</p>
      </details>
      ${p.price ? `<button class="btn btn-dark btn-sm" data-quote="${esc(p.model)}|${esc(p.trim)}|${esc(p.my)}">견적 계산 · 상담</button>` : `<button class="btn btn-dark btn-sm" data-consult="${esc(p.model)}" data-loc="promo">가격·조건 상담</button>`}
    </article>`;
  }
  function promoGroup(list) {
    const now = list.filter((p) => !p.stock), stock = list.filter((p) => p.stock);
    return (now.length ? `<h3 class="pg-h">27년식</h3><div class="grid c3">${now.map(promoCard).join("")}</div>` : "") +
      (stock.length ? `<h3 class="pg-h">26년식 재고 <small>재고 소진 시 종료</small></h3><div class="grid c3">${stock.map(promoCard).join("")}</div>` : "");
  }
  function renderPromos(el, only) {
    if (!el) return;
    const all = S.promotions.filter(active), first = only || S.models[0].id;
    const tabModels = S.models.filter((m) => all.some((p) => p.model === m.id));
    const basis = `<div class="basis"><span><b>${esc(S.promoMeta.month)} 혜택</b></span><span>적용 기간 ${S.promoMeta.validFrom.replace(/-/g, ".")} ~ ${S.promoMeta.validTo.replace(/-/g, ".")}</span><span>할인 기준: ${esc(S.promoMeta.source)}</span><span>${esc(S.priceBasis.label)}</span></div>`;
    if (!all.length) { el.innerHTML = basis + `<div class="empty">이번 달 혜택을 정리하고 있습니다. 현재 조건은 상담으로 바로 안내해 드립니다.</div>`; return; }
    const tabs = only ? "" : `<div class="tabs" role="tablist">${tabModels.map((m, i) => `<button class="tab" role="tab" aria-selected="${i === 0}" data-tab="${m.id}">${esc(m.name)}</button>`).join("")}</div>`;
    el.innerHTML = basis + tabs + `<div id="promoGrid">${promoGroup(all.filter((p) => p.model === first))}</div><p class="note">※ ${esc(S.promoMeta.common)}</p>` +
      (S.goldenTime && todayStr() <= S.goldenTime.validTo ? `<p class="note">※ 11월 사은품: ${esc(S.goldenTime.text)}</p>` : "");
    $$(".tab", el).forEach((t) => t.addEventListener("click", () => {
      $$(".tab", el).forEach((x) => x.setAttribute("aria-selected", x === t));
      $("#promoGrid", el).innerHTML = promoGroup(all.filter((p) => p.model === t.dataset.tab));
      track("promo_tab", { model: t.dataset.tab });
    }));
  }
  function renderImprovements(el, only) {
    if (!el || todayStr() > S.promoMeta.validTo) { if (el) el.remove(); return; }
    const list = S.improvements.filter((i) => !only || i.model === only);
    el.innerHTML = `<h3 style="font-size:15px;margin-bottom:10px">10월보다 좋아진 11월 조건</h3><ul style="list-style:none;display:grid;gap:6px">${list.map((i) => `<li style="font-size:14px;display:flex;gap:8px"><span style="color:#8b6a2f">▲</span><span>${esc(i.text)}</span></li>`).join("")}</ul>`;
  }

  /* ---------- 모델 카드 ---------- */
  const carSvg = `<svg viewBox="0 0 400 120" fill="none" stroke="#c9ccd2" stroke-width="1.4" aria-hidden="true"><path d="M20 92c0-10 6-16 18-19l46-8 40-26c10-6 22-9 34-9h76c14 0 26 5 36 13l26 22 52 7c14 2 22 10 22 22v6H20z"/><circle cx="96" cy="96" r="17"/><circle cx="306" cy="96" r="17"/></svg>`;
  function slot(cap, cls = "", src = "", note = "") {
    if (src) return `<figure class="photo ${cls}"><img src="${esc(src)}" alt="${esc(cap)}" loading="lazy" decoding="async">${note ? `<figcaption>${esc(note)}</figcaption>` : ""}</figure>`;
    return `<div class="slot ${cls}" role="img" aria-label="${esc(cap)}">${carSvg}<span class="cap">📷 ${esc(cap)}</span></div>`;
  }
  function renderModels(el) {
    if (!el) return;
    el.innerHTML = S.models.filter((m) => m.main).map((m) => {
      const pr = m.priceFrom ? `${man(m.priceFrom)}부터 <span class="flag dark">${esc(m.priceStatus)}</span>` : `가격 <span class="flag dark">확인 필요</span>`;
      const best = S.promotions.filter((p) => p.model === m.id && active(p)).reduce((a, p) => Math.max(a, headRate(p)), 0);
      return `<article class="mcard">${slot(m.name + " 이미지", "", m.image, "카탈로그 이미지 · 판매 차량과 색상·사양이 다를 수 있습니다")}
        <div class="body"><span class="kind">${esc(m.kind)}</span><h3>${esc(m.name)}</h3><p class="tl">${esc(m.tagline)}</p>
        <p class="trims">${m.trims.map(esc).join(" · ")}</p><p class="price">${pr}</p>
        ${best ? `<p class="price" style="color:var(--gold)">이달 현금+금융 최대 ${best}% <small style="color:var(--mut)">(트림·연식별 상이)</small></p>` : ""}
        <p class="fit">${esc(m.fit)}</p>
        <div class="acts">${m.page ? `<a class="btn btn-line btn-sm" href="${m.page}">자세히 보기</a>` : `<span class="btn btn-line btn-sm" style="opacity:.5" title="2차 제작 예정">상세 준비 중</span>`}<button class="btn btn-gold btn-sm" data-consult="${m.id}" data-loc="model_card">견적 상담</button></div></div></article>`;
    }).join("");
  }

  /* ---------- 출고 후기 ---------- */
  function renderReviews(el, only) {
    if (!el) return;
    const list = S.reviews.filter((r) => !only || r.model === only);
    el.innerHTML = list.map((r) => `<article class="rcard">${slot(r.car + " " + (r.color || "") + " 실제 출고 사진", "", r.photo)}
      <div class="body"><span class="kind" style="font-size:12px;color:var(--gold)">${esc(r.tag)}</span><h3>${esc(r.car)}${r.color ? " · " + esc(r.color) : ""}</h3><p class="meta">${esc(r.region)} · ${esc((r.date || "").replace(/-/g, "."))}</p>
      <ol class="steps">${r.worry ? `<li><b>고민</b>${esc(r.worry)}</li>` : ""}<li><b>선택 이유</b>${esc(r.reason)}</li><li><b>진행</b>${esc(r.process)}</li></ol>
      <div class="acts" style="display:flex;gap:8px;margin-top:auto">${r.link ? `<a class="btn btn-line btn-sm" style="flex:1" href="${esc(r.link)}">이야기 읽기</a>` : ""}<button class="btn btn-gold btn-sm" style="flex:1" data-consult="${r.model}" data-loc="review">${esc(modelName(r.model))} 상담</button></div></div></article>`).join("");
  }
  function renderGallery(el) {
    if (!el || !S.eclassGallery) return;
    el.innerHTML = S.eclassGallery.map((g) => `<figure class="gal"><img src="${esc(g.src)}" alt="${esc(g.cap)}" loading="lazy" decoding="async"><figcaption>${esc(g.cap)}</figcaption></figure>`).join("");
  }

  /* ---------- FAQ ---------- */
  function renderFaq(el, items) { if (el) el.innerHTML = items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join(""); }

  /* ---------- 상담 폼 ---------- */
  function initForm(defaultModel) {
    const f = $("#leadForm"); if (!f) return;
    const sel = $("#f-model");
    const og = (label, arr) => `<optgroup label="${label}">${arr.map((m) => `<option value="${m.id}">${esc(m.name)}</option>`).join("")}</optgroup>`;
    sel.innerHTML = `<option value="">선택해 주세요</option>` + og("주요 모델", S.models.filter((m) => m.main)) + og("그 외 모델", S.models.filter((m) => !m.main && !m.ev)) + og("전기차 사전계약", S.models.filter((m) => m.ev)) + `<option value="other">기타 모델 / 미정</option>`;
    if (defaultModel) sel.value = defaultModel;
    $("#f-test").hidden = !!C.formEndpoint || LIVE();
    $$("[data-cfg=privacyOwner]").forEach((e) => (e.textContent = C.privacyOwner));
    $$("[data-cfg=retention]").forEach((e) => (e.textContent = C.retentionText));
    const started = Date.now();
    let sid = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
    let busy = false, doneIds = new Set();
    const msg = $("#fmsg");
    const phoneEl = $("#f-phone");
    phoneEl.addEventListener("input", () => { let d = phoneEl.value.replace(/\D/g, "").slice(0, 11); phoneEl.value = d.length > 7 ? d.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3") : d.length > 3 ? d.replace(/(\d{3})(\d+)/, "$1-$2") : d; });
    let startedTracked = false;
    f.addEventListener("focusin", () => { if (!startedTracked) { startedTracked = true; track("form_start", { model: sel.value }); } });

    function setErr(id, bad) { const w = $("#" + id).closest(".fld") || $("#" + id).closest(".consent"); w.classList.toggle("invalid", bad); $("#" + id).setAttribute("aria-invalid", bad); }
    function validate() {
      const name = $("#f-name").value.trim(), phone = phoneEl.value.replace(/\D/g, ""), model = sel.value, agree = $("#f-agree").checked;
      setErr("f-name", name.length < 2); setErr("f-phone", !/^01[016789]\d{7,8}$/.test(phone)); setErr("f-model", !model);
      $("#agreeErr").style.display = agree ? "none" : "block";
      const ok = name.length >= 2 && /^01[016789]\d{7,8}$/.test(phone) && model && agree;
      if (!ok) { const first = $("[aria-invalid=true]", f) || (!agree && $("#f-agree")); if (first) first.focus(); }
      return ok;
    }
    function show(type, html) { msg.className = "fmsg show " + type; msg.innerHTML = html; msg.focus(); }

    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (busy) return;
      if (!validate()) return;
      if ($("#f-hp").value || Date.now() - started < 2500) { show("err", "잠시 후 다시 시도해 주세요."); return; } // 스팸 방지
      if (doneIds.has(sid)) { show("ok", "이미 접수된 상담입니다. 추가 문의는 전화·카카오로 연락 주세요."); return; }
      const data = {
        submission_id: sid, name: $("#f-name").value.trim(), phone: phoneEl.value, model: sel.value,
        method: (f.querySelector("[name=method]:checked") || {}).value || "", timing: (f.querySelector("[name=timing]:checked") || {}).value || "",
        message: $("#f-msg").value.trim().slice(0, 1000), company: ($("#f-company") || {}).value || "", agree_privacy: true, agree_marketing: $("#f-mkt").checked,
        page: location.pathname.split("/").pop() || "index.html", submitted_at: new Date().toISOString(), ...utm()
      };
      const btn = $("#f-submit"); busy = true; btn.disabled = true; btn.textContent = "접수 중…";
      try {
        if (!C.formEndpoint && LIVE()) {
          const sum = `${data.name} / ${data.phone} / ${modelName(data.model)}${data.message ? " / " + data.message.split("\n")[0] : ""}`;
          show("err", `<b>온라인 접수 연결을 준비하고 있습니다.</b><br>아래 내용을 카카오톡이나 전화로 보내주시면 바로 확인해 드립니다.<pre>${esc(sum)}</pre><a class="btn btn-gold btn-sm" href="${esc(C.kakaoUrl)}" target="_blank" rel="noopener">카카오톡 상담</a> <a class="btn btn-line btn-sm" href="tel:${esc(C.phone.replace(/[^0-9]/g, ""))}">전화 ${esc(C.phone)}</a>`);
          track("lead_submit_unavailable", { model: data.model });
        } else if (!C.formEndpoint) {
          await new Promise((r) => setTimeout(r, 500));
          const preview = { ...data, phone: data.phone.replace(/(\d{3})-?\d{3,4}-?(\d{4})/, "$1-****-$2") };
          show("test", `<b>테스트 모드 — 실제로 저장·전송되지 않았습니다.</b><br>연결 후 아래 내용이 관리 시트에 저장됩니다.<pre>${esc(JSON.stringify(preview, null, 2))}</pre>`);
          track("lead_submit_test", { model: data.model });
        } else {
          const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 12000);
          const res = await fetch(C.formEndpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(data), signal: ctrl.signal });
          clearTimeout(to);
          const j = await res.json().catch(() => ({}));
          if (!res.ok || !j.ok) throw new Error(j.error || "저장 확인 실패");
          doneIds.add(sid);
          show("ok", `<b>상담 신청이 접수되었습니다.</b><br>${esc(C.advisorName)} ${esc(C.advisorTitle)}이 확인 후 연락드리겠습니다. (접수번호 ${esc(j.id || sid.slice(0, 8))})`);
          track("lead_submit_success", { model: data.model, method: data.method });
          f.reset(); sel.value = data.model; sid = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
        }
      } catch (err) {
        show("err", `<b>접수가 완료되지 않았습니다.</b> 입력하신 내용은 그대로 남아 있습니다.<br><button type="button" class="btn btn-dark btn-sm" id="retry" style="margin-top:8px">다시 시도</button> 또는 전화·카카오로 문의해 주세요.`);
        $("#retry").addEventListener("click", () => f.requestSubmit());
        track("lead_submit_error", { reason: String(err.message || err).slice(0, 60) });
      } finally { busy = false; btn.disabled = false; btn.textContent = "상담 신청하기"; }
    });
  }

  /* MOU 회사명 검색 (목록: mou-list.js) */
  const ALIAS = [["sk", "에스케이"], ["lg", "엘지"], ["kt", "케이티"], ["cj", "씨제이"], ["nh", "엔에이치"], ["hs", "에이치에스"], ["gs", "지에스"], ["ls", "엘에스"], ["kb", "케이비"], ["hd", "에이치디"], ["sm", "에스엠"], ["db", "디비"], ["bnk", "비엔케이"], ["itx", "아이티엑스"]];
  function norm(t) {
    let x = String(t || "").toLowerCase().replace(/\(주\)|㈜|주식회사|유한책임회사|유한회사|\(유한\)|\(사\)|사단법인|재단법인/g, "").replace(/[\s()·.,&\-]/g, "");
    ALIAS.forEach(([e, k]) => { x = x.split(e).join(k); });
    return x;
  }
  let mouIdx = null;
  function mouSearch(q) {
    const L = window.MOU_LIST; if (!L) return null;
    if (!mouIdx) mouIdx = L.items.map((it) => ({ n: it.n, k: norm(it.n) }));
    const k = norm(q); if (k.length < 2) return [];
    return mouIdx.filter((it) => it.k.includes(k) || (it.k.length >= 3 && k.includes(it.k))).map((it) => it.n).slice(0, 8);
  }
  function renderMou(el) {
    if (!el || !S.mou) return;
    const M = S.mou, L = window.MOU_LIST;
    el.innerHTML = `<div class="grid c3">${M.cards.map((c) => `<div class="mou-card"><span class="kind">${esc(c.title)}</span><strong>${esc(c.rate)}</strong><p>${esc(c.desc)}</p><small>${esc(c.note)}</small></div>`).join("")}</div>
      <div class="mou-box"><div><h3>우리 회사도 MOU 제휴사일까요?</h3><p>회사·협회명을 입력하면 이세웅 과장이 관리하는 제휴 목록${L ? `(${L.items.length}개사)` : ""}에서 바로 찾아 드립니다. 목록에 없어도 최신 현황으로 다시 확인해 드리고, 아직 제휴 전이라면 MOU 체결 진행도 도와드립니다.</p></div>
      <form class="mou-form" id="mouForm" role="search"><label class="sr" for="mou-co">재직 중인 회사·협회명</label><input id="mou-co" placeholder="예) 효성, 네이버, SK에너지" maxlength="60" autocomplete="organization"><button class="btn btn-gold" type="submit">확인하기</button></form>
      <div class="mou-result" id="mouResult" aria-live="polite"></div></div>
      <ul class="mou-rules">${M.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ul><p class="note" style="color:var(--mut)">기준: ${esc(M.basis)}${L ? ` · 제휴 목록 ${esc(L.updated.replace(/-/g, "."))} 기준 + 추가분` : ""}. 최종 적용 여부는 재직·회원 증빙 확인 후 확정됩니다.</p>`;
    const toForm = (co) => {
      const c = $("#f-company"); if (c) c.value = co;
      const m = $("#f-msg"); if (m && !m.value.includes("[MOU 확인]")) m.value = `[MOU 확인] ${co}\n` + m.value;
      const f = $("#consult"); if (f) f.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => { const n = $("#f-name"); if (n) n.focus({ preventScroll: true }); }, 600);
    };
    $("#mouForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const co = $("#mou-co").value.trim(), out = $("#mouResult");
      if (co.length < 2) { $("#mou-co").focus(); toast("회사·협회명을 2글자 이상 입력해 주세요"); return; }
      const hit = mouSearch(co) || [];
      track("mou_search", { found: hit.length > 0 });
      out.className = "mou-result show " + (hit.length ? "ok" : "no");
      out.innerHTML = hit.length
        ? `<b>✓ 제휴 목록에서 확인됐어요</b><p>${hit.map(esc).join(", ")}</p><p class="sm">임직원·회원이시면 이달 프로모션에 <b>+2%</b> 추가 할인 대상이 될 수 있어요. 재직 증빙 후 확정됩니다.</p><button type="button" class="btn btn-gold btn-sm" id="mouGo">이 회사로 견적 상담 신청</button>`
        : `<b>목록에서 찾지 못했어요</b><p class="sm">회사명이 다르게 등록돼 있거나 최근 체결된 곳일 수 있어요. 남겨주시면 최신 현황으로 직접 확인해 드립니다.</p><button type="button" class="btn btn-line btn-sm" id="mouGo">MOU 확인 요청하기</button>`;
      $("#mouGo").addEventListener("click", () => { track("mou_to_form", { found: hit.length > 0 }); toForm(hit[0] || co); });
    });
  }

  /* ---------- 첫 화면 혜택 슬라이드 (현금+금융 기준) ---------- */
  const findPromo = (h) => S.promotions.find((p) => p.model === h.model && p.trim === h.trim && p.my === h.my && active(p));
  function renderHero(el) {
    if (!el || !S.heroOffers) return;
    const slides = S.heroOffers.map((h) => ({ h, p: findPromo(h) })).filter((x) => x.p && x.p.price && headRate(x.p));
    if (!slides.length) { el.innerHTML = ""; return; }
    el.innerHTML = `<div class="hs-track" id="hsTrack">${slides.map(({ h, p }, i) => {
      const hr = headRate(p), d = discOf(p.price, hr);
      return `<article class="hs-slide" aria-roledescription="slide" aria-label="${i + 1} / ${slides.length}">
        <div class="hs-img"><img src="${esc(h.image)}" alt="${esc(modelName(p.model))} 이미지" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}><span class="hs-imgnote">카탈로그 이미지</span></div>
        <div class="hs-body">
          <span class="hs-badge">${esc(h.label)}</span>
          <p class="hs-trim">${esc(S.promoMeta.month)} · ${esc(p.trim)} <small>${esc(myLabel(p))}</small></p>
          <p class="hs-amt"><b>${man(d)}</b> 할인</p>
          <p class="hs-cond">현금 ${p.base}%${p.mbm ? ` + 금융 이용 시 ${p.mbm}%` : ""} = ${hr}%${loyalty(p) ? ` · 재구매·Trade-in 등은 견적 계산기에서 추가` : ""}</p>
          <div class="hs-prices"><div><small>차량가</small><s>${man(p.price)}</s></div><div class="fin"><small>할인 후</small><strong>${man(p.price - d)}</strong></div></div>
          ${p.finance ? `<p class="hs-fin"><small>금융</small> ${esc(p.finance.split("(")[0].replace(/ 또는.*/, "").trim())}</p>` : ""}
          <p class="hs-note">가격표 2026.11.04 기준 · 탁송·등록비 별도 · 최종 금액은 견적서로 확정</p>
        </div></article>`; }).join("")}</div>
      <div class="hs-ctrl"><div class="hs-dots" role="tablist">${slides.map((_, i) => `<button type="button" role="tab" aria-label="${i + 1}번 혜택" aria-selected="${i === 0}" data-i="${i}"></button>`).join("")}</div>
      <div class="hs-arrows"><button type="button" class="hs-prev" aria-label="이전 혜택">‹</button><button type="button" class="hs-next" aria-label="다음 혜택">›</button></div></div>
      <div class="hs-ctas"><button class="btn btn-gold" id="hsCta">이 차로 견적 받기 →</button><a class="hs-all" href="promotion.html">11월 혜택 전체 보기 →</a></div>`;
    const tr = $("#hsTrack", el), dots = $$(".hs-dots button", el); let cur = 0;
    const go = (i) => { cur = (i + slides.length) % slides.length; tr.scrollTo({ left: tr.clientWidth * cur, behavior: "smooth" }); };
    tr.addEventListener("scroll", () => { const i = Math.round(tr.scrollLeft / tr.clientWidth); if (i !== cur) cur = i; dots.forEach((d, k) => d.setAttribute("aria-selected", k === cur)); }, { passive: true });
    dots.forEach((d) => d.addEventListener("click", () => go(+d.dataset.i)));
    $(".hs-prev", el).addEventListener("click", () => go(cur - 1)); $(".hs-next", el).addEventListener("click", () => go(cur + 1));
    $("#hsCta", el).addEventListener("click", () => { const p = slides[cur].p; openQuote(p.model, p.trim, p.my, "hero_offer"); });
  }

  /* 핵심 차종 카드: 모델별 27년식 중 현금+금융이 가장 큰 트림 (27년식 할인이 없으면 26년식 재고) */
  function bestOf(model) {
    const all = S.promotions.filter((x) => active(x) && x.model === model && x.price && headRate(x));
    const now = all.filter((x) => !x.stock).sort((a, b) => headRate(b) - headRate(a));
    if (now[0] || all[0]) return now[0] || all.sort((a, b) => headRate(b) - headRate(a))[0];
    // 현금·금융 할인이 없는 모델(예: S-Class 27년식) → 가장 낮은 가격의 27년식
    return S.promotions.filter((x) => active(x) && x.model === model && x.price && !x.stock).sort((a, b) => a.price - b.price)[0];
  }
  function renderCore(el) {
    if (!el) return;
    el.innerHTML = S.models.filter((m) => m.main).map((m) => {
      const p = bestOf(m.id); if (!p) return "";
      const hr = headRate(p), fin = p.price - discOf(p.price, hr);
      if (!hr) return `<article class="core"><div class="core-img"><img src="${esc(m.coreImage || m.image)}" alt="${esc(m.name)} 이미지" loading="lazy"></div>
        <div class="core-body"><div class="core-badges"><span class="my">${esc(myLabel(p))}</span>${(p.better || []).slice(0, 1).map((b) => `<span>${esc(b)}</span>`).join("")}</div>
        <h3>The New ${esc(m.name)}</h3>
        <p class="core-rate"><b style="font-size:22px">재구매 최대 ${loyalty(p)}%</b></p>
        <p class="core-sub">${esc(p.trim)} ${man(p.price)}부터 · 재구매 고객 보증연장</p>
        <button class="core-go" data-quote="${esc(p.model)}|${esc(p.trim)}|${esc(p.my)}">견적 계산하기 →</button></div></article>`;
      return `<article class="core"><div class="core-img"><img src="${esc(m.coreImage || m.image)}" alt="${esc(m.name)} 이미지" loading="lazy"></div>
        <div class="core-body"><div class="core-badges"><span class="my">${esc(myLabel(p))}</span>${(p.better || []).slice(0, 1).map((b) => `<span>${esc(b)}</span>`).join("")}</div>
        <h3>${esc(p.trim)}</h3>
        <p class="core-rate"><b>${hr}%</b> <span>${man(fin)}</span></p>
        <p class="core-sub">차량가 ${man(p.price)} · 현금 ${p.base}%${p.mbm ? ` + 금융 ${p.mbm}%` : ""}</p>
        <button class="core-go" data-quote="${esc(p.model)}|${esc(p.trim)}|${esc(p.my)}">견적 계산하기 →</button></div></article>`;
    }).join("");
  }

  /* ---------- 견적 계산기 ---------- */
  let Q = null;
  function renderQuote(el) {
    if (!el) return;
    const list = S.promotions.filter((p) => active(p) && p.price);
    el.innerHTML = `<div class="qz">
      <div class="qz-in">
        <div class="fld"><label for="q-model">모델</label><select id="q-model">${S.models.filter((m) => list.some((p) => p.model === m.id)).map((m) => `<option value="${m.id}">${esc(m.name)}</option>`).join("")}</select></div>
        <div class="fld"><label for="q-trim">트림 · 연식</label><select id="q-trim"></select></div>
        <fieldset class="qz-opts"><legend>해당되는 혜택을 선택하세요</legend>
          <label><input type="checkbox" id="q-mbm" checked> <span>벤츠 금융(MBM) 이용 <b id="q-mbm-r"></b></span></label>
          <label><input type="checkbox" id="q-ret"> <span>기존 벤츠 보유 (재구매) <b id="q-ret-r"></b></span></label>
          <label><input type="checkbox" id="q-trade"> <span>기존 벤츠를 인증중고차로 매각 (Trade-in) <b id="q-trade-r"></b></span></label>
          <label id="q-con-w"><input type="checkbox" id="q-con"> <span>BMW·아우디·제네시스 등 타 브랜드 보유 <b id="q-con-r"></b></span></label>
          <label><input type="checkbox" id="q-mou"> <span>MOU 제휴사 임직원·회원 <b>+2%</b> <em>확인 후 적용</em></span></label>
        </fieldset>
      </div>
      <div class="qz-out" aria-live="polite">
        <p class="qz-trim" id="q-name"></p>
        <div class="qz-row"><span>차량가</span><b id="q-price"></b></div>
        <div class="qz-row"><span>할인율 합계</span><b id="q-rate"></b></div>
        <div class="qz-row"><span>예상 할인액</span><b id="q-disc"></b></div>
        <div class="qz-row big"><span>예상 차량 구매가</span><b id="q-final"></b></div>
        <p class="qz-break" id="q-break"></p>
        <p class="qz-fin" id="q-fin"></p>
        <button class="btn btn-gold" id="q-go" type="button" style="width:100%">이 조건으로 견적 받기</button>
        <p class="qz-note">가격표 2026.11.04 · 11월 조건 기준 예상치입니다. 탁송·등록비·보험은 별도이며, 재구매·Trade-in·타 브랜드·MOU는 서류 확인 후 확정됩니다. 재구매와 타 브랜드 혜택은 함께 받을 수 없습니다.</p>
      </div></div>`;
    const mSel = $("#q-model"), tSel = $("#q-trim");
    const fillTrims = (model, pick) => {
      const ts = list.filter((p) => p.model === model).sort((a, b) => (a.stock ? 1 : 0) - (b.stock ? 1 : 0));
      tSel.innerHTML = ts.map((p, i) => `<option value="${i}">${esc(p.trim)} · ${esc(myLabel(p))}</option>`).join("");
      tSel._list = ts;
      if (pick) { const k = ts.findIndex((p) => p.trim === pick.trim && p.my === pick.my); if (k >= 0) tSel.value = k; }
      calc();
    };
    const calc = () => {
      const p = tSel._list[+tSel.value]; if (!p) return; Q = p;
      const set = (id, r, on) => { const w = $(id).closest("label"); $(id + "-r").textContent = r ? `+${r}%` : ""; w.style.display = r ? "" : "none"; if (!r) $(id).checked = false; };
      set("#q-mbm", p.mbm); set("#q-ret", p.ret); set("#q-trade", p.trade); set("#q-con", p.conquest);
      const ret = $("#q-ret").checked, trade = $("#q-trade").checked, con = $("#q-con").checked, mbm = $("#q-mbm").checked, mou = $("#q-mou").checked;
      const parts = [["현금", p.base]];
      if (mbm && p.mbm) parts.push(["금융", p.mbm]);
      if (ret && p.ret) parts.push(["재구매", p.ret]);
      if (trade && p.trade) parts.push(["Trade-in", p.trade]);
      if (con && p.conquest) parts.push(["타 브랜드", p.conquest]);
      if (mou) parts.push(["MOU", 2]);
      const rate = parts.reduce((a, x) => a + x[1], 0), d = discOf(p.price, rate);
      $("#q-name").textContent = `${modelName(p.model)} · ${p.trim} (${myLabel(p)})`;
      $("#q-price").textContent = man(p.price) + (p.priceNote ? ` (${p.priceNote})` : "");
      $("#q-rate").textContent = rate + "%";
      $("#q-disc").textContent = "−" + man(d);
      $("#q-final").textContent = man(p.price - d);
      $("#q-break").textContent = parts.filter((x) => x[1]).map((x) => `${x[0]} ${x[1]}%`).join(" + ");
      $("#q-fin").textContent = p.finance ? "금융: " + p.finance : "";
      Q.__sum = { rate, d, parts };
    };
    mSel.addEventListener("change", () => { fillTrims(mSel.value); track("quote_model", { model: mSel.value }); });
    tSel.addEventListener("change", calc);
    $("#q-ret").addEventListener("change", () => { if ($("#q-ret").checked) $("#q-con").checked = false; calc(); });
    $("#q-trade").addEventListener("change", () => { if ($("#q-trade").checked) $("#q-con").checked = false; calc(); });
    $("#q-con").addEventListener("change", () => { if ($("#q-con").checked) { $("#q-ret").checked = false; $("#q-trade").checked = false; } calc(); });
    ["#q-mbm", "#q-mou"].forEach((id) => $(id).addEventListener("change", calc));
    $("#q-go").addEventListener("click", () => {
      if (!Q) return;
      const sm = Q.__sum, m = $("#f-msg"), sel = $("#f-model");
      if (sel) sel.value = Q.model;
      const line = `[견적 요청] ${Q.trim} (${myLabel(Q)}) · ${sm.parts.filter((x) => x[1]).map((x) => x[0] + " " + x[1] + "%").join("+")} = ${sm.rate}% · 예상 ${man(Q.price - sm.d)}`;
      if (m) m.value = line + "\n" + m.value.replace(/^\[견적 요청\].*\n?/, "");
      if ($("#q-mou").checked && $("#f-company") && !$("#f-company").value) $("#f-company").focus();
      track("quote_to_form", { model: Q.model, rate: sm.rate });
      const f = $("#consult"); if (f) f.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => { const n = $("#f-name"); if (n) n.focus({ preventScroll: true }); }, 600);
    });
    el._pick = (model, trim, my) => { mSel.value = model; fillTrims(model, { trim, my }); };
    const only = document.body.dataset.model; mSel.value = only || S.models[0].id; fillTrims(mSel.value);
  }
  function openQuote(model, trim, my, loc) {
    track("quote_open", { model, location: loc || "" });
    const el = $("#quote");
    if (!el) { location.href = "index.html#quote"; return; }
    if (el._pick) el._pick(model, trim, my);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderNews(el) {
    if (!el || !S.news) return;
    el.innerHTML = S.news.map((n) => `<article class="news">${n.image ? `<div class="news-img"><img src="${esc(n.image)}" alt="${esc(n.title)}" loading="lazy"></div>` : ""}<div class="news-body"><span class="news-tag">${esc(n.tag)}</span><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p><button class="news-go" data-consult="${n.model === "other" ? "other" : n.model}" data-loc="news">상담 받기 →</button></div></article>`).join("");
  }
  function renderReport(el) {
    if (!el || !S.report) return;
    const R = S.report;
    el.innerHTML = `<ol class="rp">${R.points.map((x, i) => `<li><span class="rp-n">${String(i + 1).padStart(2, "0")}</span><div><h3>${esc(x.h)}</h3><p>${esc(x.p)}</p></div></li>`).join("")}</ol>`;
  }
  function renderChecks(el) {
    if (!el || !S.checks) return;
    el.innerHTML = S.checks.map((c, i) => `<div class="chk"><span>${String(i + 1).padStart(2, "0")}</span><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p></div>`).join("");
  }

  /* 첫 화면 차별점 띠: 실제 출고 사진 */
  function renderStrip(el) {
    if (!el) return;
    el.innerHTML = `<div class="st-msg"><b>전국 어디든, 이세웅 과장이 직접 출고합니다.</b>
      <ul><li>울산·인천 송도까지 직접 찾아가 출고</li><li>카카오톡 상담 하루 만에 계약</li><li>계약 1주일 만에 출고한 사례</li><li>S-Class 재구매·소개 고객</li></ul></div>
      <div class="st-row">${S.reviews.map((r) => `<a class="st-item" href="#reviews-sec"><img src="${esc(r.photo)}" alt="${esc(r.car)} 실제 출고" loading="lazy"><span>${esc(r.region.split(" · ")[0])} · ${esc(r.car.replace(" 4MATIC", "").replace(" Exclusive", " EX"))}</span></a>`).join("")}</div>`;
  }

  /* 무이자 가능 차량 목록 */
  const imgFor = (p) => {
    const t = p.trim.toLowerCase(), c = /coupé|coupe| cp/.test(t);
    if (p.image) return p.image;
    const m = S.models.find((x) => x.id === p.model);
    return { "e-class": "assets/img/cat-e-blue.jpg", "s-class": "assets/img/cat-s-amg.jpg",
      glc: c ? "assets/img/cat-glc-coupe.jpg" : "assets/img/cat-glc-suv.jpg",
      gle: c ? "assets/img/cat-gle-coupe.jpg" : "assets/img/cat-gle-suv.jpg" }[p.model] || (m && m.image) || "";
  };
  function renderZero(el) {
    if (!el) return;
    const list = S.promotions.filter((p) => active(p) && /무이자/.test(p.finance || ""));
    if (!list.length) { el.closest("section").remove(); return; }
    const months = (p) => (/24·36/.test(p.finance) ? "24·36개월" : "24개월");
    const down = (p) => ((p.finance.match(/선수금 (\d+)%/) || [])[1] || "");
    const chips = ["all", ...S.models.map((m) => m.id).filter((id) => list.some((p) => p.model === id))];
    const card = (p) => { const hr = headRate(p), fin = p.price ? p.price - discOf(p.price, hr) : 0;
      return `<article class="zr"><img src="${imgFor(p)}" alt="" loading="lazy">
        <div class="zr-b"><div class="zr-top"><span class="zr-m">${months(p)} 무이자</span><span class="zr-my">${esc(myLabel(p))}</span></div>
        <h3>${esc(p.trim)}</h3>
        <p class="zr-d">${down(p) ? `선수금 ${down(p)}%` : ""}${hr ? ` · 할인 ${hr}%` : ""}</p>
        <p class="zr-p">${p.price ? (hr ? `<s>${man(p.price)}</s> <b>${man(fin)}</b>` : `<b>${man(p.price)}</b>`) : `<b>가격 상담</b>`}</p></div>
        ${p.price ? `<button class="zr-go" data-quote="${esc(p.model)}|${esc(p.trim)}|${esc(p.my)}" aria-label="${esc(p.trim)} 견적 계산">견적 →</button>` : `<button class="zr-go" data-consult="${esc(p.model)}" data-loc="zero">상담 →</button>`}</article>`; };
    const draw = (id, all) => {
      const l = list.filter((p) => id === "all" || p.model === id);
      const show = all ? l : l.slice(0, 6);
      $("#zrGrid", el).innerHTML = show.map(card).join("");
      const more = $("#zrMore", el); more.hidden = all || l.length <= 6; more.textContent = `무이자 차량 ${l.length - 6}대 더 보기`;
    };
    el.innerHTML = `<div class="tabs" role="tablist">${chips.map((id, i) => `<button class="tab" role="tab" aria-selected="${i === 0}" data-z="${id}">${id === "all" ? `전체 ${list.length}` : esc(modelName(id))}</button>`).join("")}</div>
      <div class="zr-grid" id="zrGrid"></div><button class="btn btn-line btn-sm" id="zrMore" type="button" style="margin-top:12px"></button>
      <p class="note">무이자 할부는 선수금 조건(65~75%)이 있으며, 금융 심사 결과에 따라 이용이 제한될 수 있습니다. 할인 후 금액은 현금+금융 할인 기준(탁송·등록비 별도).</p>`;
    let cur = "all";
    $$("[data-z]", el).forEach((b) => b.addEventListener("click", () => { cur = b.dataset.z; $$("[data-z]", el).forEach((x) => x.setAttribute("aria-selected", x === b)); draw(cur, false); track("zero_tab", { model: cur }); }));
    $("#zrMore", el).addEventListener("click", () => draw(cur, true));
    draw("all", false);
  }

  /* ---------- 전기차 사전계약 ---------- */
  function renderEvTeaser(el) {
    if (!el || !S.ev) return;
    el.innerHTML = S.ev.map((v) => `<a class="evt" href="ev.html#${v.id}"><img src="${esc(v.image)}" alt="${esc(v.name)}" loading="lazy"><div><span>${esc(v.tag)}</span><h3>${esc(v.name.replace("The all-new ", ""))}</h3><p>${esc(v.lead)}</p></div></a>`).join("");
  }
  function renderEv(el) {
    if (!el || !S.ev) return;
    el.innerHTML = S.ev.map((v) => `<section class="ev" id="${v.id}" aria-labelledby="${v.id}-h">
      <div class="ev-img"><img src="${esc(v.image)}" alt="${esc(v.name)}" loading="lazy"><span class="hs-imgnote">카탈로그 이미지</span></div>
      <div class="ev-body"><span class="news-tag">${esc(v.tag)}</span><h2 id="${v.id}-h">${esc(v.name)}</h2><p class="ev-lead">${esc(v.lead)}</p>
        <div class="ev-trims">${v.trims.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <dl class="ev-specs">${v.specs.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join("")}</dl>
        <p class="ev-offer">🎁 ${esc(v.offer)}</p>
        <div class="ev-acts"><button class="btn btn-gold" data-pre="${v.id}">사전계약 상담 신청</button><a class="btn btn-line" href="#" data-action="kakao" data-loc="ev_${v.id}">카카오로 문의</a></div>
      </div></section>`).join("");
    $$("[data-pre]", el).forEach((b) => b.addEventListener("click", () => {
      const v = S.ev.find((x) => x.id === b.dataset.pre); track("ev_precontract_click", { model: v.id });
      const sel = $("#f-model"); if (sel) sel.value = v.id;
      const m = $("#f-msg"); if (m && !/^\[사전계약\]/.test(m.value)) m.value = `[사전계약] ${v.name} · 희망 트림: \n` + m.value;
      const f = $("#consult"); if (f) f.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => { const n = $("#f-name"); if (n) n.focus({ preventScroll: true }); }, 600);
    }));
  }

  /* ---------- 시작 ---------- */
  window.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page, only = document.body.dataset.model || "";
    renderHero($("#heroSlider"));
    renderQuote($("#quote"));
    renderStrip($("#strip"));
    renderCore($("#core"));
    renderZero($("#zero"));
    renderEvTeaser($("#evTeaser"));
    renderEv($("#evList"));
    renderNews($("#news"));
    renderReport($("#report"));
    renderChecks($("#checks"));
    renderPromos($("#promos"), only);
    renderImprovements($("#better"), only);
    renderModels($("#models"));
    renderMou($("#mou-body"));
    renderReviews($("#reviews"), only);
    renderGallery($("#gallery"));
    $$("[data-photo=profile]").forEach((i) => { if (C.profilePhoto) i.src = C.profilePhoto; });
    renderFaq($("#faq"), page === "e-class" ? S.eclass.faq : S.faq);
    if (page === "e-class") renderTrims();
    initForm(only);
    wireContacts();
    track("page_view", { page });
  });

  function renderTrims() {
    const el = $("#trims"); if (!el) return;
    el.innerHTML = S.eclass.trims.map((t) => `<div class="trow"><h3>${esc(t.name)} <small style="color:var(--mut);font-weight:500;font-size:12px">${esc(t.my || "")}</small></h3><div class="pr">${man(t.price)}</div>
      <div class="spec">${esc(t.power)} · ${esc(t.drive)}</div>
      <div class="pt"><span>${esc(t.point)}</span><button class="btn btn-line btn-sm" data-quote="e-class|${esc(t.name)}|${t.my === "26년식" ? "MY26" : "MY27"}">견적 계산</button></div></div>`).join("") +
      `<p class="note" style="color:var(--mut)">${esc(S.priceBasis.label)} · ${esc(S.priceBasis.checkedAt)} 확인 · 탁송·등록비 별도</p>`;
  }
})();
