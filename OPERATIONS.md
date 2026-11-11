# 매월 업데이트 안내 (운영 가이드)

홈페이지의 가격·혜택·후기는 거의 모두 **`assets/data.js` 한 파일**에서 나옵니다.
여기만 고치면 홈, 이달 혜택, E-Class, 전기차, **광고 상담 페이지(consult.html)**, 견적 계산기, 상담 폼에 함께 반영됩니다.

> 다음 달 자료(프로모션 PDF, 금융 요약표, 가격표)를 Claude에게 전달하면 아래 항목을 대신 고치고 미리보기로 확인한 뒤 반영합니다.

---

## 1. 매달 꼭 바꾸는 것 — `assets/data.js`

| 무엇 | 항목 | 예시 / 설명 |
|---|---|---|
| 이달 혜택 기간 | `promoMeta.month` / `validFrom` / `validTo` | `"2026년 12월"`, `"2026-12-01"`, `"2026-12-31"` |
| 자료 기준일 | `promoMeta.basisDate`, `promoMeta.source` | 리테일 프로모션 자료 날짜와 이름 |
| 지난달 표기 | `promoMeta.compareLabel` | `"11월"` → 화면에 "11월보다 좋아진 12월 조건" |
| 가격표 기준일 | `priceBasis.date`, `priceBasis.label` | 새 가격표가 나왔을 때만 |
| 트림별 할인 | `promotions` 목록 | 한 줄 = 트림 1개 (아래 표 참고) |
| 지난달 대비 개선점 | `improvements` | 없으면 `[]` 로 비우면 자동으로 숨김 |
| 사은품(골든타임) | `goldenTime.validFrom/validTo/text` | 없으면 기간을 지난 날짜로 두면 숨김 |
| 첫 화면 슬라이드 | `heroOffers` | `promotions`에 있는 트림·연식과 똑같이 적어야 표시됨 |
| 신차 소식 | `news` | 기간이 지나면 자동으로 숨김 |
| 이달의 구매전략 | `report` | 기간이 지나면 자동으로 숨김 |

### `promotions` 한 줄의 의미
```js
{ model:"gle", trim:"GLE 450 4MATIC", my:"MY26", stock:true, price:129000000,
  base:12, mbm:4, ret:1, trade:1, conquest:1,
  finance:"24·36개월 무이자 할부 (선수금 65%) · 일반할부 연 3.86%", better:["24·36개월 무이자 신설"] }
```
| 칸 | 뜻 |
|---|---|
| `model` | `e-class` `s-class` `glc` `gle` `c-class` `glb` `gls` `eq` `g-class` 중 하나 |
| `my` / `stock` | 연식 `MY27`·`MY26`, 재고 조건이면 `stock:true` |
| `price` | 차량가(원). 미정이면 `null` → "가격 상담" 표시 |
| `base` / `mbm` | 현금 할인 % / 벤츠 금융 이용 시 추가 % (화면의 할인 금액 = 이 둘의 합) |
| `ret` / `trade` / `conquest` | 재구매 % / Trade-in % / 타 브랜드 보유 % (견적 계산기에서 고객이 선택) |
| `finance` | 금융 조건 문장. "24개월 무이자 할부 (선수금 65%)" 형식을 지키면 무이자 목록·광고 페이지에 자동 표시 |
| `validFrom` / `validTo` (선택) | 이 트림만 기간이 다를 때. 없으면 `promoMeta` 기간을 따름 |

**만료 처리:** `validTo`가 지나면 혜택 카드·슬라이드·무이자 목록·광고 페이지 혜택이 **자동으로 내려가고** "이번 달 혜택을 정리하고 있습니다 → 상담 안내"로 바뀝니다. 화면의 "11월" 같은 월 표기도 자동으로 "이달"로 바뀝니다. 지난달 혜택이 현재 혜택처럼 보이는 일은 없습니다.

## 2. 출고 후기 추가 — `assets/data.js`의 `reviews`
맨 위에 한 덩어리를 복사해 넣으면 홈·출고 이야기 목록·광고 페이지(모델별)에 함께 나옵니다.
- 사진: `assets/img/` 에 올리고 `photo`(카드 사진), `thumb`(목록 사진)에 경로 입력
- 상세 글이 있으면 `story-번호.html` 파일과 `link`를 함께 추가 (상세 글 페이지는 Claude가 만듭니다)
- **실제 고객 사례만, 공개 동의를 받은 것만** 올립니다. 성함은 가려서 표기합니다.

## 3. 모델 정보 — `models`
`main:true`인 4개(E-Class·S-Class·GLC·GLE)가 홈 핵심 차종과 **광고 상담 페이지 모델 선택**에 나옵니다. `priceFrom`(시작 가격)과 `priceStatus`(연식)를 가격표에 맞춰 둡니다.

## 4. 연락처·접수 설정 — `config`
| 항목 | 설명 |
|---|---|
| `phone`, `kakaoUrl` | 전화번호·카카오 채널 대화 주소 (모든 버튼에 자동 반영) |
| `formEndpoint` | 상담 접수 웹앱 주소. 비우면 접수 중단(전화·카카오 안내로 전환). 설정: `backend/apps-script/SETUP.md` |
| `retentionText`, `privacyOwner` | 개인정보 안내에 표시되는 보유기간·처리 담당 |
| `metaPixelInstalled` | 메타 픽셀 설치 여부 (현재 2103643920279636) |

## 5. 페이지 제목에 월이 들어가는 곳
페이지 제목·검색 설명은 "이달의 할인"처럼 월을 빼 두어 매달 고칠 필요가 없습니다. 본문의 "11월" 표기는 `<span data-promo-m>`로 감싸져 있어 `promoMeta` 기간에 맞춰 자동으로 바뀝니다.
※ `e-class.html` 트림 가이드의 "11월 현재 MY27로 판매하며, 24개월 무이자 대상" 문장은 직접 확인 후 수정이 필요합니다.

## 6. 파일을 고친 뒤
1. `python3 tools/make_model_pages.py` 실행 → 차종별 페이지(s-class.html, glc.html 등)의 트림별 가격표를 data.js 기준으로 다시 만듭니다 (차종 소개 문구는 이 파일 안의 PAGES에서 수정)
1. (차종 사진을 바꿨다면) `python3 tools/make_og.py` 실행 → 차종별 카톡·SNS 공유 썸네일 갱신
1. `python3 tools/bump_versions.py` 실행 → 방문자 브라우저가 새 파일을 받도록 버전 갱신
2. 미리보기로 확인 후 반영 (Claude가 진행)

## 7. 광고 링크 만드는 법
광고 상담 페이지 주소 뒤에 모델과 UTM을 붙입니다. 접수 시 시트에 함께 저장됩니다.
```
https://wwong9977.github.io/seiunglee-benz/consult.html?model=gle&utm_source=meta&utm_medium=paid_social&utm_campaign=2026-12_gle&utm_content=video_a
https://wwong9977.github.io/seiunglee-benz/consult.html?model=e-class&utm_source=naver&utm_medium=cpc&utm_campaign=2026-12_eclass
https://wwong9977.github.io/seiunglee-benz/consult.html?utm_source=naver_blog&utm_medium=blog&utm_campaign=story_gle
```
`model` 값: `e-class`, `s-class`, `glc`, `gle` (없으면 고객이 직접 선택)
