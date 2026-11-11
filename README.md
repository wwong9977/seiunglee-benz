# 이세웅 과장 · 메르세데스-벤츠 구매 상담 사이트

HS더클래스 효성 구리전시장 이세웅 과장의 개인 상담 페이지입니다. (메르세데스-벤츠 코리아 공식 홈페이지가 아닙니다)

- `index.html` 홈 · `promotion.html` 11월 혜택 전체 · `e-class.html` E-Class
- `consult.html` 광고 전용 상담 페이지 (메타·인스타·네이버 광고 연결용, `?model=gle` 로 모델 지정)
- 매달 수정: `assets/data.js` (가격·할인·후기), `assets/mou-list.js` (MOU 목록) → 자세한 방법은 [OPERATIONS.md](OPERATIONS.md)
- 상담 접수 저장: `backend/apps-script/` (구글 시트 연결, [SETUP.md](backend/apps-script/SETUP.md))
- 파일 수정 후: `python3 tools/bump_versions.py` (캐시 버전 갱신)
