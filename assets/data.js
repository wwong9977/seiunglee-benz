/* =========================================================
   이세웅 과장 상담 홈페이지 — 데이터 파일 (이 파일만 수정하면 됩니다)
   - 화면 코드(app.js)는 건드리지 않고 이 값만 바꿔 업데이트합니다.
   - status: "확인됨" | "확인 필요"  → "확인 필요"는 화면에 표시됩니다.
   - 날짜 형식: "YYYY-MM-DD"
   ========================================================= */

window.SITE = {
  /* ---------- 1. 담당자·연결 설정 (미확인 값은 빈칸 유지) ---------- */
  config: {
    advisorName: "이세웅",
    advisorTitle: "과장",
    showroom: "HS더클래스 효성 구리전시장",
    showroomAddress: "",          // 확인 필요: 전시장 주소
    phone: "010-4748-9977",        // 아임웹 게시 글 기준
    kakaoUrl: "https://pf.kakao.com/_xfxNFX/chat", // 아임웹 게시 글 기준
    blogUrl: "",                  // 확인 필요: 네이버 블로그 주소
    siteUrl: "https://seiunglee.imweb.me",
    profilePhoto: "assets/img/profile.jpg",
    logoLight: "assets/img/logo-light.png",
    heroPhoto: "assets/img/hero-gle-coupe.jpg",
    heroCaption: "실제 출고 차량 · GLE 450 4MATIC Coupé AMG Line (구리)",
    regions: ["구리", "남양주", "다산", "서울 동북권", "전국 상담 가능"],

    /* 상담 접수 연결: 비어 있으면 '테스트 모드'로 동작(저장·전송 안 함) */
    formEndpoint: "",             // 예) Google Apps Script 웹앱 URL
    privacyOwner: "이세웅 (HS더클래스 효성 구리전시장)", // 개인정보 처리 책임자 표기 — 확인 필요
    retentionText: "상담 종료 후 1년 이내 파기 (확인 필요)",

    /* 성과 측정: 실제 설치 전에는 false 유지 */
    ga4Installed: false,
    metaPixelInstalled: false,
    naverWcsInstalled: false
  },

  /* ---------- 2. 가격 기준 ---------- */
  priceBasis: {
    label: "차량가: 메르세데스-벤츠 일반 소비자 판매 가격표 (2026.11.04) · 27년식 기준",
    checkedAt: "2026-11-10",
    status: "확인됨",
    note: "27년식 가격이 없는 모델(GLE 등)은 26년식 재고 가격으로 표시. 탁송료·등록비 별도."
  },

  /* ---------- 3. 모델 ---------- */
  models: [
    /* main:true = 홈 핵심 차종·차종 가이드에 표시 / ev:true = 전기차 사전계약 */
    {
      id: "e-class", main: true, image: "assets/img/cat-e-pair.jpg", coreImage: "assets/img/cat-e-side.jpg", name: "E-Class", kind: "세단", page: "e-class.html",
      tagline: "가장 많이 비교되는 비즈니스 세단",
      trims: ["E 200 Exclusive", "E 200 AMG Line", "E 300 4MATIC", "E 350 e 4MATIC", "E 450 4MATIC"],
      priceFrom: 77500000, priceStatus: "27년식",
      fit: "출퇴근·업무 이동이 많고, 편안함과 품격을 함께 원하는 분"
    },
    {
      id: "s-class", main: true, image: "assets/img/cat-s-front.jpg", coreImage: "assets/img/cat-s-amg.jpg", name: "S-Class", kind: "세단", page: "",
      tagline: "The New S-Class 27년식 · 재구매·법인 상담",
      trims: ["S 350 d 4MATIC", "S 450 4MATIC", "S 450 4MATIC Long", "S 500 4MATIC Long", "S 580 4MATIC Long"],
      priceFrom: 154000000, priceStatus: "27년식",
      fit: "뒷좌석 탑승이 잦은 대표·임원, 장거리 이동이 많은 분"
    },
    {
      id: "glc", main: true, image: "assets/img/cat-glc-pair.jpg", coreImage: "assets/img/cat-glc-coupe.jpg", name: "GLC", kind: "SUV · Coupé", page: "",
      tagline: "도심형 중형 SUV · SUV와 쿠페 선택",
      trims: ["GLC 220 d 4MATIC", "GLC 300 4MATIC", "GLC 300 4MATIC Coupé"],
      priceFrom: 82200000, priceStatus: "27년식",
      fit: "가족 1~3인, 도심 주행 위주, 적당한 차체를 원하는 분"
    },
    {
      id: "gle", main: true, image: "assets/img/cat-gle-suv.jpg", coreImage: "assets/img/cat-gle-coupe-rear.jpg", name: "GLE", kind: "SUV · Coupé", page: "",
      tagline: "넉넉한 공간의 대형 SUV",
      trims: ["GLE 300 d 4MATIC", "GLE 350 4MATIC", "GLE 450 4MATIC", "GLE 450 4MATIC Coupé"],
      priceFrom: 118000000, priceStatus: "26년식",
      fit: "가족 여행·장거리, 넉넉한 2열과 적재공간이 필요한 분"
    },
    { id: "c-class", name: "C-Class", kind: "세단", image: "assets/img/cat-c.jpg" },
    { id: "glb", name: "GLB", kind: "SUV", image: "assets/img/cat-glb.jpg" },
    { id: "gls", name: "GLS", kind: "대형 SUV", image: "assets/img/cat-gls.jpg" },
    { id: "eq", name: "EQE · EQS", kind: "전기차", image: "assets/img/cat-eqs.jpg" },
    { id: "g-class", name: "G-Class", kind: "SUV", image: "assets/img/cat-g.jpg" },
    { id: "glc-ev", ev: true, name: "GLC electric", kind: "전기 SUV", image: "assets/img/cat-glc-ev.jpg" },
    { id: "glb-ev", ev: true, name: "GLB electric", kind: "전기 SUV", image: "assets/img/cat-glb-ev.jpg" },
    { id: "cla-ev", ev: true, name: "CLA electric", kind: "전기 세단", image: "assets/img/cat-cla-ev.jpg" }
  ],

  /* ---------- 4. 이달의 프로모션 ----------
     출처: MBK 11월 고객 리테일 프로모션·MBM 프로모션(2026.11.02) / 10월 자료(2026.10.01)와 비교
     base=현금 기본할인, mbm=MBM 금융 특별할인, ret=재구매(Cash Retention), trade=Trade-in, conquest=타 프리미엄 브랜드 보유
     ※ 재구매(+Trade-in)와 Conquest는 둘 중 하나만 적용 → 최대값은 큰 쪽으로 자동 계산
     validTo가 지나면 자동으로 '현재 혜택'에서 내려갑니다. */
  promoMeta: {
    month: "2026년 11월", validFrom: "2026-11-01", validTo: "2026-11-30",
    source: "메르세데스-벤츠 코리아 11월 리테일 프로모션 (2026.11.02) · 벤츠파이낸셜·벤츠모빌리티 11월 금융 프로모션",
    compareWith: "10월 자료 (2026.10.01 기준)",
    common: "화면의 할인은 현금 할인과 금융(MBM) 이용 시 추가 할인만 더한 값입니다. 재구매·Trade-in·타 브랜드 보유·MOU 혜택은 견적 계산기에서 해당되는 것만 골라 더해 보세요. 재고·출고 시점에 따라 달라질 수 있습니다."
  },
  promotions: [
    /* base=현금 할인, mbm=금융(MBM) 이용 시 추가 → 화면의 '할인'은 base+mbm만 사용
       ret/trade/conquest(재구매·Trade-in·타 브랜드)는 견적 계산기에서 고객이 선택 */
    /* ----- E-Class 27년식 ----- */
    { model:"e-class", trim:"E 200 Exclusive", my:"MY27", price:77500000, base:14, mbm:4, ret:1, trade:1, conquest:0,
      finance:"24개월 무이자 할부 (선수금 75%) · 일반할부 연 5.80% · 특별 리스", better:["MY27 조건 11월 신설","24개월 무이자 신설"] },
    { model:"e-class", trim:"E 200 AMG Line", my:"MY27", price:81000000, base:14, mbm:3, ret:1, trade:1, conquest:0,
      finance:"24개월 무이자 할부 (선수금 75%) · 일반할부 연 5.82% · 특별 리스", better:["MY27 조건 11월 신설","24개월 무이자 신설"] },
    { model:"e-class", trim:"E 300 4MATIC Exclusive", my:"MY27", price:94800000, base:8, mbm:4, ret:1, trade:1, conquest:0,
      finance:"일반할부 연 6.60% (60개월·선수금 30%)", better:["재구매·Trade-in 혜택 신설"] },
    { model:"e-class", trim:"E 300 4MATIC AMG Line", my:"MY27", price:100100000, base:8, mbm:4, ret:1, trade:1, conquest:0,
      finance:"일반할부 연 6.60% (60개월·선수금 30%)", better:["재구매·Trade-in 혜택 신설"] },
    { model:"e-class", trim:"E 450 4MATIC AMG Line", my:"MY27", price:117200000, base:10, mbm:0, ret:1, trade:1, conquest:0,
      finance:"일반할부 연 7.43% (60개월·선수금 30%)", better:["재구매·Trade-in 혜택 신설"] },
    { model:"e-class", trim:"E 450 4MATIC Exclusive", my:"MY27", price:129500000, base:10, mbm:0, ret:1, trade:1, conquest:0,
      finance:"일반할부 연 7.43% (60개월·선수금 30%)", better:["재구매·Trade-in 혜택 신설"] },
    /* E-Class 26년식 재고 */
    { model:"e-class", trim:"E 300 4MATIC Exclusive", my:"MY26", stock:true, price:94800000, base:10, mbm:4, ret:1, trade:1, conquest:0,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 5.33%", better:["24개월 무이자 신설"] },
    { model:"e-class", trim:"E 300 4MATIC AMG Line", my:"MY26", stock:true, price:99000000, base:10, mbm:4, ret:1, trade:1, conquest:0,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 5.33%", better:["24개월 무이자 신설"] },
    { model:"e-class", trim:"E 350 e 4MATIC Exclusive", my:"MY26", stock:true, price:100000000, base:14, mbm:0, ret:1, trade:1, conquest:0, finance:"일반할부 연 7.43% (60개월·선수금 30%)", better:[] },
    { model:"e-class", trim:"E 450 4MATIC AMG Line", my:"MY26", stock:true, price:116000000, base:11, mbm:0, ret:1, trade:1, conquest:0, finance:"일반할부 연 7.43% (60개월·선수금 30%)", better:[] },
    { model:"e-class", trim:"E 450 4MATIC Exclusive", my:"MY26", stock:true, price:129600000, base:11, mbm:0, ret:1, trade:1, conquest:0, finance:"일반할부 연 7.43% (60개월·선수금 30%)", better:[] },


    /* ----- S-Class 27년식 (현금·금융 할인 없음 → 재구매·Trade-in 중심) ----- */
    { model:"s-class", trim:"S 350 d 4MATIC", my:"MY27", price:154000000, base:0, mbm:0, ret:2, trade:1, conquest:0,
      finance:"일반할부 연 7.43% · 재구매 고객 운용리스 특별 조건",
      extraText:"재구매+ : 보유 E-Class 이상 고객은 재구매 횟수에 따라 보증연장 최대 +2년/+7만km · 타 프리미엄 브랜드 보유 고객 보증연장 +1년/+3만km",
      better:["재구매+ 프로그램 신설"] },
    { model:"s-class", trim:"S 450 4MATIC", my:"MY27", price:162400000, base:0, mbm:0, ret:2, trade:1, conquest:0, finance:"일반할부 연 7.43% · 재구매 고객 운용리스 특별 조건", better:["재구매+ 프로그램 신설"] },
    { model:"s-class", trim:"S 450 4MATIC Long Exclusive", my:"MY27", price:175400000, base:0, mbm:0, ret:2, trade:1, conquest:0, finance:"일반할부 연 7.43% · 재구매 고객 운용리스 특별 조건", better:["재구매+ 프로그램 신설"] },
    { model:"s-class", trim:"S 450 4MATIC Long AMG Line", my:"MY27", price:195400000, base:0, mbm:0, ret:2, trade:1, conquest:0, finance:"일반할부 연 7.43% · 재구매 고객 운용리스 특별 조건", better:["재구매+ 프로그램 신설"] },
    { model:"s-class", trim:"S 500 4MATIC Long", my:"MY27", price:220000000, base:0, mbm:0, ret:2, trade:1, conquest:0, finance:"일반할부 연 7.43% · 재구매 고객 운용리스 특별 조건", better:["재구매+ 프로그램 신설"] },
    { model:"s-class", trim:"S 580 4MATIC Long", my:"MY27", price:270000000, base:0, mbm:0, ret:2, trade:1, conquest:0, finance:"일반할부 연 7.43% · 재구매 고객 운용리스 특별 조건", better:["재구매+ 프로그램 신설"] },
    /* ----- GLC 27년식 ----- */
    { model:"glc", trim:"GLC 300 4MATIC Coupé AVANTGARDE", my:"MY27", price:86600000, base:7, mbm:1, ret:1, trade:1, conquest:1,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 5.65% · 특별 리스", better:["기본 할인 5% → 7%","금융 할인 +1% 신설","24개월 무이자 신설"] },
    { model:"glc", trim:"GLC 300 4MATIC Coupé AMG Line", my:"MY27", price:96900000, base:7, mbm:1, ret:1, trade:1, conquest:1,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 5.65% · 특별 리스", better:["기본 할인 5% → 7%","금융 할인 +1% 신설","24개월 무이자 신설"] },
    { model:"glc", trim:"GLC 300 4MATIC AVANTGARDE", my:"MY27", price:82500000, base:7, mbm:1, ret:1, trade:1, conquest:1, finance:"일반할부 연 6.60% (60개월·선수금 30%)", better:["금융 할인 +1% 신설"] },
    { model:"glc", trim:"GLC 300 4MATIC AMG Line", my:"MY27", price:95500000, base:7, mbm:1, ret:1, trade:1, conquest:1, finance:"일반할부 연 6.60% (60개월·선수금 30%)", better:["금융 할인 +1% 신설"] },
    /* GLC 26년식 재고 */
    { model:"glc", trim:"GLC 300 4MATIC AMG Line", my:"MY26", stock:true, price:92500000, base:12, mbm:4, ret:1, trade:1, conquest:1,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 5.28%", better:["24개월 무이자 신설"] },
    { model:"glc", trim:"GLC 300 4MATIC AVANTGARDE", my:"MY26", stock:true, price:82500000, base:7, mbm:4, ret:1, trade:1, conquest:1,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 5.39%", better:["24개월 무이자 신설"] },
    { model:"glc", trim:"GLC 300 4MATIC Coupé AMG Line", my:"MY26", stock:true, price:96900000, base:9, mbm:4, ret:1, trade:1, conquest:1,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 5.28%", better:["24개월 무이자 신설"] },

    /* ----- GLE (27년식 가격 미발표 → 26년식 재고 기준) ----- */
    { model:"gle", trim:"GLE 450 4MATIC Coupé AMG Line", my:"MY26", stock:true, price:142500000, base:15, mbm:4, ret:1, trade:1, conquest:1,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 3.86%",
      better:["기본 할인 12% → 15%","24·36개월 무이자 신설","할부 금리 5.23% → 3.86%"] },
    { model:"gle", trim:"GLE 450 4MATIC", my:"MY26", stock:true, price:129000000, base:12, mbm:4, ret:1, trade:1, conquest:1,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 3.86%", better:["24·36개월 무이자 신설","할부 금리 5.23% → 3.86%"] },
    { model:"gle", trim:"GLE 450 4MATIC AMG Line", my:"MY26", stock:true, price:139000000, base:12, mbm:4, ret:1, trade:1, conquest:1,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 3.86%", better:["24·36개월 무이자 신설","할부 금리 5.23% → 3.86%"] },
    { model:"gle", trim:"GLE 450 d 4MATIC Coupé AMG Line", my:"MY26", stock:true, price:134000000, base:12, mbm:0, ret:1, trade:1, conquest:1,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.26% · 특별 리스", better:[] },
    { model:"gle", trim:"GLE 300 d 4MATIC", my:"MY26", stock:true, price:119200000, base:8, mbm:0, ret:1, trade:1, conquest:1, finance:"일반할부 연 7.43% (60개월·선수금 30%)", better:[] },
    /* ----- 벤츠파이낸셜 11월 요약표로 추가된 무이자 모델 (26년식 재고) ----- */
    { model:"e-class", trim:"Mercedes-AMG E 53 4MATIC+", my:"MY26", stock:true, price:148400000, base:10, mbm:0, ret:2, trade:1, conquest:0,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.26% · 특별 리스", better:["24·36개월 무이자"] },
    { model:"glc", trim:"GLC 300 4MATIC Coupé AVANTGARDE", my:"MY26", stock:true, price:86600000, base:7, mbm:4, ret:1, trade:1, conquest:1,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 5.39%", better:["24개월 무이자"] },
    { model:"gle", trim:"GLE 350 4MATIC", my:"MY26", stock:true, price:118000000, base:10, mbm:0, ret:1, trade:1, conquest:1,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.26% · 특별 리스", better:["24·36개월 무이자"] },
    { model:"gle", trim:"Mercedes-AMG GLE 53 4MATIC+", my:"MY26", stock:true, price:166000000, base:8, mbm:0, ret:2, trade:1, conquest:1,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.26% · 특별 리스", better:["24·36개월 무이자"] },
    { model:"gle", trim:"Mercedes-AMG GLE 53 4MATIC+ Coupé", my:"MY26", stock:true, price:170000000, base:5, mbm:0, ret:2, trade:1, conquest:1,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.26% · 특별 리스", better:["24·36개월 무이자"] },
    { model:"gle", trim:"The new GLE 450 4MATIC AMG Line / Coupé", my:"MY27", price:null, base:0, mbm:0, ret:1, trade:1, conquest:1,
      finance:"", better:["MY27 신규 (가격·출고 일정 상담)"] },
    /* ----- 그 외 무이자 모델 (벤츠파이낸셜 11월 요약표 · 가격은 요약표/가격표 기준) ----- */
    { model:"c-class", trim:"C 200 AVANTGARDE", my:"MY26", stock:true, price:65100000, base:10, mbm:4, ret:1, trade:1, conquest:0,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 5.33% · 특별 리스", better:["24개월 무이자"] },
    { model:"c-class", trim:"C 200 AMG Line", my:"MY26", stock:true, price:68300000, base:10, mbm:4, ret:1, trade:1, conquest:0,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 5.33% · 특별 리스", better:["24개월 무이자"] },
    { model:"glb", trim:"GLB 250 4MATIC", my:"MY26", stock:true, price:72000000, base:13, mbm:4, ret:1, trade:1, conquest:0,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 5.26% · 특별 리스", better:["24개월 무이자"] },
    { model:"glb", trim:"Mercedes-AMG GLB 35 4MATIC", my:"MY26", stock:true, price:79500000, base:9, mbm:4, ret:2, trade:1, conquest:0,
      finance:"24개월 무이자 할부 (선수금 65%) · 일반할부 연 4.08% · 특별 리스", better:["24개월 무이자"] },
    { model:"gls", trim:"GLS 450 4MATIC", my:"MY26", stock:true, price:154000000, base:8, mbm:0, ret:2, trade:1, conquest:0,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.26% · 특별 리스", better:["24·36개월 무이자"] },
    { model:"gls", trim:"GLS 580 4MATIC", my:"MY26", stock:true, price:193400000, base:9, mbm:0, ret:2, trade:1, conquest:0,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.26% · 특별 리스", better:["24·36개월 무이자"] },
    { model:"gls", trim:"Mercedes-AMG GLS 63 4MATIC+", my:"MY26", stock:true, price:210000000, base:1, mbm:0, ret:2, trade:1, conquest:0,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.47% · 특별 리스", better:["24·36개월 무이자"] },
    { model:"eq", trim:"EQS 400", my:"MY27", price:null, image:"assets/img/cat-eqs.jpg", base:0, mbm:0, ret:2, trade:1, conquest:0,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.19% · 특별 리스", better:["24·36개월 무이자"] },
    { model:"eq", trim:"EQS 450 4MATIC SUV", my:"MY26", stock:true, price:166000000, image:"assets/img/cat-eqs-suv.jpg", base:10, mbm:0, ret:2, trade:1, conquest:0,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.19% · 특별 리스", better:["24·36개월 무이자"] },
    { model:"eq", trim:"EQS 580 4MATIC SUV", my:"MY26", stock:true, price:192000000, image:"assets/img/cat-eqs-suv.jpg", base:10, mbm:0, ret:2, trade:1, conquest:0,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.19% · 특별 리스", better:["24·36개월 무이자"] },
    { model:"eq", trim:"EQE 350+", my:"MY26", stock:true, price:110000000, image:"assets/img/cat-eqe.jpg", base:10, mbm:0, ret:1, trade:1, conquest:0,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.19% · 특별 리스", better:["24·36개월 무이자"] },
    { model:"g-class", trim:"Mercedes-AMG G 63", my:"MY26", stock:true, price:262600000, image:"assets/img/cat-g63.jpg", base:0, mbm:0, ret:2, trade:1, conquest:0,
      finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 4.50% · 특별 리스", better:["24·36개월 무이자"] },
  ],

  /* ---------- 4-1. MOU · 제휴(Affinity) 혜택 ----------
     출처: MBK Fleet Corporate & Affinity Sales Program 업데이트 (MBFU_2607_1, 2026.07.01 시행)
     ※ 제휴 기업 목록(2025.11.27판)은 계약기간이 2026.04.12로 끝나 있어 화면에 회사명을 싣지 않고, 회사명을 받아 직접 확인 */
  mou: {
    basis: "메르세데스-벤츠 코리아 Fleet Corporate & Affinity Sales Program (2026.07.01 시행)",
    cards: [
      { title: "제휴사 임직원·회원", rate: "+2%", desc: "MOU를 맺은 기업의 임직원 또는 협회 회원", note: "정규직·계약직 대상 (위촉직 제외)" },
      { title: "제휴사 CEO", rate: "+5%", desc: "MOU를 맺은 기업·협회의 대표", note: "사업자등록증상 대표 또는 최대주주·등기 임원 증빙" },
      { title: "법인 구매", rate: "최대 15%", desc: "VIP 기업 목록 법인 13%(1~5대), 6대 이상 15% · 중소법인 2대 이상 +3%", note: "이달 프로모션이 더 높으면 프로모션 적용" }
    ],
    rules: [
      "본인 또는 가족(부모·형제자매·자녀·배우자·배우자의 부모·형제자매) 명의로 단독·공동 구매 가능",
      "제휴 혜택은 회계연도 내 1대, 차량 등록일로부터 6개월 보유 조건",
      "재직·회원 증빙 서류를 차량 대금 완납 전에 제출해야 적용",
      "이달 프로모션에 추가로 적용되며, 다른 혜택과의 중복 여부는 차종·조건별로 확인해 드립니다"
    ]
  },

  /* ---------- 전기차 사전계약 (카탈로그 2026.10 · 11월 프로모션 기준) ---------- */
  ev: [
    { id:"glc-ev", name:"The all-new electric GLC", tag:"사전계약 상담 중", image:"assets/img/cat-glc-ev.jpg", image2:"assets/img/cat-glc-ev-city.jpg",
      trims:["GLC 300 4MATIC electric", "GLC 300 4MATIC electric AMG Line", "GLC 400 4MATIC electric"],
      specs:[["1회 충전 주행거리","448km (복합, GLC 300 4MATIC electric)"],["모터 최고출력","310kW (GLC 300 4MATIC electric)"],["구동","사륜구동 4MATIC"],["급속 충전","800V · 최대 320kW (GLC 400: 330kW), 10→80% 약 22분"]],
      offer:"11월: 기존 벤츠 재구매 +1%, Trade-in +1%", lead:"GLC의 공간과 실용성을 그대로, 완전 전동화로 새로 나온 중형 전기 SUV" },
    { id:"glb-ev", name:"The all-new electric GLB", tag:"사전계약 상담 중", image:"assets/img/cat-glb-ev.jpg", image2:"assets/img/cat-glb-ev-front.jpg",
      trims:["GLB 200 electric", "GLB 250+ electric"],
      specs:[["급속 충전","800V · 최대 320kW, 10→80% 약 22분"],["트림","GLB 200 electric · GLB 250+ electric"],["주행거리·제원","트림별 인증 제원 상담 시 안내"]],
      offer:"11월: GLB 250+ electric 현금 100만원 할인, 재구매 +1%, Trade-in +1%", lead:"각진 SUV 디자인과 넉넉한 실내, 가족용 전기 SUV" },
    { id:"cla-ev", name:"The all-new electric CLA", tag:"사전계약 상담 중", image:"assets/img/cat-cla-ev.jpg", image2:"assets/img/cat-cla-ev-side.jpg",
      trims:["CLA 200 electric Essential", "CLA 200 electric Advanced", "CLA 200 electric AMG Line", "CLA 250+ electric", "CLA 250+ electric AMG Line"],
      specs:[["1회 충전 주행거리","474km (복합, CLA 250+ electric)"],["모터 최고출력","200kW (CLA 250+ electric)"],["구동","후륜구동"],["급속 충전","800V · 최대 320kW, 10→80% 약 22분"]],
      offer:"11월: CLA 200·CLA 250+ electric 현금 100만원 할인, 재구매 +1%, Trade-in +1%", lead:"벤츠 전기 세단의 새 기준, 쿠페형 실루엣의 엔트리 전기 세단" }
  ],

  /* 10월 대비 좋아진 점 (홈 요약) */
  improvements: [
    { model:"gle", text:"GLE 450 AMG Line Coupé(MY26) 기본 할인 12% → 15%" },
    { model:"gle", text:"GLE 450 SUV·Coupé 24·36개월 무이자 신설, 일반할부 금리 5.23% → 3.86%" },
    { model:"gle", text:"무이자 대상 확대: GLE 350·GLE 450 d 쿠페·AMG GLE 53, AMG E 53, GLS, EQE·EQS, AMG G 63 (24·36개월), C-Class·GLB (24개월)" },
    { model:"glc", text:"GLC 300 Coupé(MY27) 기본 할인 5% → 7%, 금융 특별할인 +1%·24개월 무이자 신설" },
    { model:"e-class", text:"E 200(MY27) 조건 신설·24개월 무이자 · E 300(MY26) 24개월 무이자 신설" },
    { model:"s-class", text:"신형 S-Class(MY27) 재구매+ 프로그램·타 브랜드 고객 보증연장 신설" }
  ],

  /* 사은품(골든타임) — 재고 소진 시 대체 가능 */
  goldenTime: {
    validFrom:"2026-11-01", validTo:"2026-11-30",
    text:"같은 달 안에 계약금 입금부터 잔금 납입까지 7일 이내로 진행하면 차량 유형별 사은품 1개 선택 (골프백·여행용 백·캠핑 용품 등, 재고 소진 시 대체품)"
  },

  /* ---------- 4-2. 첫 화면 혜택 슬라이드 (promotions에서 model+trim+my로 찾아 계산) ---------- */
  heroOffers: [
    { model:"e-class", trim:"E 200 Exclusive", my:"MY27", label:"E-Class 27년식", image:"assets/img/cat-e-blue.jpg" },
    { model:"gle", trim:"GLE 450 4MATIC Coupé AMG Line", my:"MY26", label:"GLE 쿠페 · 무이자 24·36개월", image:"assets/img/cat-gle-coupe.jpg" },
    { model:"glc", trim:"GLC 300 4MATIC Coupé AVANTGARDE", my:"MY27", label:"GLC 쿠페 27년식 할인 상향", image:"assets/img/cat-glc-coupe-front.jpg" },
    { model:"e-class", trim:"E 300 4MATIC AMG Line", my:"MY27", label:"E 300 4MATIC 27년식", image:"assets/img/cat-e-pair.jpg" }
  ],

  /* ---------- 4-3. 신차·사전계약 소식 ---------- */
  news: [
    { tag:"사전계약 재구매 혜택", title:"The New S-Class (MY27)", text:"기존 E-Class 이상 보유 고객은 재구매 횟수에 따라 보증연장이 최대 +2년/+7만km까지 늘어납니다. 타 프리미엄 브랜드 보유 고객도 보증연장 +1년/+3만km.", model:"s-class", image:"assets/img/cat-s-news.jpg" },
    { tag:"MY27 상담 시작", title:"The new GLE (MY27)", text:"GLE 450 4MATIC AMG Line·Coupé MY27이 11월 조건표에 새로 올라왔습니다. 가격·출고 일정과 MY26 재고 조건을 나란히 비교해 드립니다.", model:"gle" },
    { tag:"11월 신설", title:"Electric CLA · GLB 250+ electric", text:"전기 CLA(CLA 200·CLA 250+)와 GLB 250+ electric에 11월부터 100만원 현금 할인이 생겼습니다. 보조금은 지역·시점에 따라 달라 함께 확인해 드립니다.", model:"other" },
    { tag:"E 200 연식 변경", title:"E 200은 MY27로", text:"E 200 MY26 판매가 끝나 MY27로 진행합니다. MY27 E 200도 24개월 무이자 대상이며 금융 이용 시 Exclusive +4%, AMG Line +3%가 더해집니다.", model:"e-class" }
  ],

  /* ---------- 4-4. 이달의 구매전략 (직접 작성) ---------- */
  report: {
    month: "2026년 11월",
    title: "11월, 이렇게 사면 유리합니다",
    points: [
      { h:"SUV를 본다면 GLE 쿠페부터 비교", p:"GLE 450은 SUV 12%, 쿠페 15%로 쿠페 기본 할인이 더 큽니다. 둘 다 24·36개월 무이자(선수금 65%) 또는 연 3.86% 할부(60개월·선수금 30%)를 고를 수 있어, 10월보다 금융 조건이 확실히 좋아졌습니다." },
      { h:"E 200은 금융 이용 여부가 관건", p:"27년식 E 200은 현금 14%에 금융 이용 시 Exclusive +4%, AMG Line +3%입니다. 24개월 무이자는 선수금 75% 조건이라, 선수금이 부담되면 연 5.8%대 할부나 특별 리스와 총비용으로 비교해야 합니다." },
      { h:"GLC 쿠페 MY27은 지금이 상향 시점", p:"MY27 GLC 300 쿠페 기본 할인이 5%에서 7%로 올랐고, 금융 특별할인 +1%와 24개월 무이자가 새로 붙었습니다." },
      { h:"기존 벤츠·타 브랜드 보유 여부 먼저 확인", p:"벤츠 재구매 +1%, 인증중고차 매각(Trade-in) +1%, BMW·아우디·제네시스 등 보유 시 GLC·GLE +1%. 둘 중 유리한 쪽으로 적용합니다." },
      { h:"회사 MOU와 계약 속도", p:"MOU 제휴사 임직원이면 +2%가 더해질 수 있고, 같은 달 안에 계약금부터 잔금까지 7일 안에 마치면 사은품(골든타임)도 받을 수 있습니다." }
    ]
  },

  /* ---------- 4-5. 구매 전 확인할 혜택 ---------- */
  checks: [
    { t:"금융 프로그램", d:"무이자(선수금 65~75%)·저금리 할부, 특별 리스, 장기렌트를 같은 차로 나란히 비교" },
    { t:"벤츠 금융 재이용", d:"기존 벤츠파이낸셜·벤츠모빌리티 이용 고객은 할부 금리 약 0.4% 인하 (리텐션)" },
    { t:"장기렌트 (벤츠모빌리티)", d:"대부분 모델에서 장기렌트 이용 시 3% 할인 · 조건은 상담 시 확인" },
    { t:"재구매 · Trade-in", d:"기존 벤츠 보유 +1%, 인증중고차로 매각 시 +1%" },
    { t:"타 브랜드 보유", d:"GLC·GLE 구매 시 BMW·아우디·제네시스·볼보·포르쉐·랜드로버·렉서스 보유 +1%" },
    { t:"MOU 제휴사", d:"임직원·회원 +2%, 대표 +5% · 가족 명의 가능" },
    { t:"골든타임 사은품", d:"계약금~잔금 7일 이내 완료 시 사은품 1개 선택" },
    { t:"벤츠 신한카드", d:"카드 종류별 혜택은 구매 시점 기준으로 상담 시 안내" }
  ],

  /* ---------- 5. 출고 후기 (실제 고객 사례만 · 공개 동의 확인) ---------- */
  reviews: [
    { model:"s-class", car:"S 450 4MATIC Long Exclusive", color:"블랙", region:"남양주 다산 · 소개 고객", tag:"S-Class 재구매 · 법인리스",
      worry:"오래 타던 S-Class의 교체 시기, 다른 차로는 바꾸기 어렵다는 고민",
      reason:"새로 바뀐 S-Class의 실내 디자인과 익숙한 승차감",
      process:"기존 출고 고객의 소개로 상담 → 법인리스로 진행 → 블랙 컬러 출고",
      photo:"assets/img/rv-s450-black.jpg", date:"2026-10-30",
      link:"story-175339397.html" },
    { model:"s-class", car:"S 450 4MATIC Long Exclusive", color:"웜그레이", region:"인천 송도 · 소개 고객", tag:"비대면 상담 · 개인사업자 리스",
      worry:"사업 운영 상황과 자금 계획에 맞는 구매 방식 선택",
      reason:"새로 나온 웜그레이 컬러와 S-Class의 품격",
      process:"상담·계약 비대면 진행 → 개인사업자 리스 → 송도로 직접 찾아가 출고",
      photo:"assets/img/rv-s450-grey.jpg", date:"2026-10-30",
      link:"story-175339181.html" },
    { model:"e-class", car:"E 200 AMG Line", color:"화이트", region:"울산 · 원거리 고객", tag:"카톡 상담 하루 만에 계약 · 1주일 출고",
      worry:"울산 거주·해외 출장으로 전시장 방문이 어려운 상황",
      reason:"선물용 차량으로 스포티한 AMG Line 디자인",
      process:"카카오톡으로 할인·법인리스 견적 안내 → 하루 만에 계약 → 울산까지 직접 방문 출고",
      photo:"assets/img/rv-e200-ulsan.jpg", date:"2026-10-30",
      link:"story-175338884.html" },
    { model:"gle", car:"GLE 450 4MATIC Coupé AMG Line", color:"화이트", region:"구리 · 전시장 방문 고객", tag:"방문부터 1주일 만에 출고",
      worry:"기존 소형 전기차의 주행 가능 거리가 아쉬움",
      reason:"SUV의 여유와 쿠페 디자인을 함께 갖춘 GLE 쿠페",
      process:"전시장 방문 상담 → 프로모션·실구매 견적 비교 → 계약 1주일 만에 출고",
      photo:"assets/img/rv-gle-coupe.jpg", date:"2026-10-30",
      link:"story-175338499.html" },
    { model:"e-class", car:"E 200 AMG Line", color:"블랙", region:"구리 · 전시장 방문 고객", tag:"방문 당일 계약",
      worry:"E-Class 디자인·주요 사양과 구매 조건 비교",
      reason:"AMG Line의 스포티한 외관과 실내",
      process:"전시장 상담 → 당일 계약 → 배정·출고 일정 안내 → 기능 설명 후 인도",
      photo:"assets/img/rv-e200-black.jpg", date:"2026-10-16",
      link:"story-175125600.html" },
    { model:"gle", car:"GLE 450 d 4MATIC", color:"블랙", region:"구리전시장 출고 준비", tag:"출고 준비 완료",
      worry:"", reason:"블랙 외장·블랙 실내 조합의 프리미엄 SUV", process:"인도 전 외관·실내 점검과 출고 준비",
      photo:"assets/img/rv-gle450d.jpg", date:"2026-10-12",
      link:"story-175066766.html" }
  ],
  /* E-Class 상세 페이지 실제 사진 (구리전시장 출고·출고 준비 차량) */
  eclassGallery: [
    { src:"assets/img/ec-1.jpg", cap:"E-Class 화이트 · 출고 준비" },
    { src:"assets/img/ec-4.jpg", cap:"E 200 AMG Line 블랙 · 정면" },
    { src:"assets/img/ec-3.jpg", cap:"E 200 AMG Line 블랙 · 측면" },
    { src:"assets/img/ec-2.jpg", cap:"E 200 AMG Line 블랙 · 후면" },
    { src:"assets/img/ec-5.jpg", cap:"E 200 AMG Line 실내" },
    { src:"assets/img/ec-6.jpg", cap:"E 200 AMG Line 운전석" }
  ],

  /* ---------- 6. E-Class 상세 ---------- */
  eclass: {
    trims: [
      { name: "E 200 Exclusive", my: "27년식", price: 77500000, power: "4기통 가솔린 · 204 ps", drive: "후륜", point: "클래식한 디자인 · 편안한 승차감" },
      { name: "E 200 AMG Line", my: "27년식", price: 81000000, power: "4기통 가솔린 · 204 ps", drive: "후륜", point: "스포티한 내·외관 디자인" },
      { name: "E 300 4MATIC Exclusive", my: "27년식", price: 94800000, power: "4기통 가솔린 · 258 ps", drive: "4MATIC", point: "출력 여유 · 사계절 안정감" },
      { name: "E 300 4MATIC AMG Line", my: "27년식", price: 100100000, power: "4기통 가솔린 · 258 ps", drive: "4MATIC", point: "4MATIC + AMG Line 디자인" },
      { name: "E 350 e 4MATIC Exclusive", my: "26년식", price: 100000000, power: "플러그인 하이브리드 · 313 ps", drive: "4MATIC", point: "충전 환경이 있으면 전기 주행" },
      { name: "E 450 4MATIC AMG Line", my: "27년식", price: 117200000, power: "6기통 가솔린 · 381 ps", drive: "4MATIC", point: "6기통 + AMG Line" },
      { name: "E 450 4MATIC Exclusive", my: "27년식", price: 129500000, power: "6기통 가솔린 · 381 ps", drive: "4MATIC", point: "E-Class 상위 가솔린" }
    ],
    faq: [
      ["E 200과 E 300 4MATIC, 무엇을 기준으로 고르나요?", "도심 위주·합리적인 가격이 우선이면 E 200, 출력 여유와 겨울철·고속 안정감(사륜구동)을 원하면 E 300 4MATIC을 비교해 보세요. 할인율과 재고가 트림·연식마다 달라 실제 구매가는 상담 시 함께 계산해 드립니다."],
      ["Exclusive와 AMG Line은 성능 차이가 있나요?", "같은 파워트레인 기준으로는 주로 디자인 구성(그릴·범퍼·휠·실내 마감)의 차이입니다. 세부 사양은 연식별로 달라질 수 있어 상담 시 사양표로 비교해 드립니다."],
      ["E 350 e는 충전이 꼭 필요한가요?", "충전 없이도 하이브리드로 주행할 수 있지만, 전기 주행의 장점을 살리려면 자택·직장 충전 환경이 있는 편이 좋습니다."],
      ["할인율과 월 납입금은 어떻게 다른가요?", "할인율은 차량가에서 빠지는 금액이고, 월 납입금은 선수금·기간·금리·잔존가치에 따라 정해지는 금융 조건입니다. 할인이 크다고 월 납입금이 항상 낮은 것은 아니어서 두 가지를 따로 비교해 드립니다."],
      ["원하는 색상 재고가 있는지 알 수 있나요?", "희망 트림·외장·내장 색상을 남겨주시면 확인 가능한 재고와 예상 출고 시점을 안내해 드립니다."]
    ]
  },

  /* ---------- 7. 홈 FAQ ---------- */
  faq: [
    ["표시된 최대 할인은 누구나 받을 수 있나요?", "아닙니다. 최대 할인은 금융상품 이용, 재구매, 법인, 타 브랜드 보유 등 조건을 모두 충족한 경우입니다. 고객님 조건에서 실제 적용되는 항목만 골라 견적을 드립니다."],
    ["현금·할부·리스·렌트 중 무엇이 유리한가요?", "명의(개인·개인사업자·법인), 이용 기간, 비용 처리 여부, 보유 자금에 따라 달라집니다. 같은 차량으로 2~3가지 방식을 나란히 비교해 드립니다. 세금 관련 판단은 담당 세무사 확인을 권해 드립니다."],
    ["구리 전시장에 방문해야 하나요?", "견적·계약 안내는 전화·카카오로도 가능하며, 시승과 차량 확인은 방문 일정을 맞춰 드립니다. 원거리 고객 출고도 상담 가능합니다."],
    ["상담 신청하면 바로 계약해야 하나요?", "아닙니다. 견적 확인만으로도 충분히 상담 가능합니다."]
  ]
};
