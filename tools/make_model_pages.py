"""차종별 페이지(s-class.html, glc.html …)를 만듭니다.
- 머리글·상담 폼·푸터는 e-class.html에서 그대로 가져와 모든 페이지가 같은 모양을 유지합니다.
- 트림별 가격표는 assets/data.js의 promotions에서 만들어 HTML에 직접 넣습니다(검색엔진이 읽을 수 있도록).
- 매달 data.js를 고친 뒤: python3 tools/make_model_pages.py && python3 tools/bump_versions.py
"""
import json, os, re, subprocess, html as H
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SITE_URL = "https://wwong9977.github.io/seiunglee-benz"
S = json.loads(subprocess.check_output(["node", "-e", "global.window={};require('./assets/data.js');process.stdout.write(JSON.stringify(window.SITE))"]))
E = H.escape

PAGES = {
  "s-class": dict(file="s-class.html", short="S클래스",
    title="벤츠 S클래스 가격·할인 · S450 S580 롱 트림 비교 | 구리 이세웅 과장",
    desc="벤츠 S클래스 27년식 S 350 d부터 S 580 4MATIC Long까지 트림별 가격과 이달의 재구매·Trade-in 혜택, 운용리스 조건을 HS더클래스 효성 구리전시장 이세웅 과장이 정리했습니다.",
    h1="S-Class,<br>뒷좌석에서 완성되는 <em>플래그십</em>.",
    lead="27년식 S 350 d 4MATIC부터 S 580 4MATIC Long까지 트림별 가격을 한 화면에 정리했습니다. 기존 벤츠 고객이라면 재구매·Trade-in 혜택과 운용리스 조건을 함께 비교해 보세요.",
    guide=[("숏바디 vs Long", "직접 운전하는 시간이 많다면 숏바디(S 350 d · S 450), 뒷좌석 탑승이 잦은 대표·임원 차량이라면 휠베이스가 늘어난 Long 모델이 잘 맞습니다."),
           ("디젤 vs 가솔린", "장거리 주행이 많고 유지비를 중시하면 S 350 d, 정숙성과 부드러운 가속을 원하면 S 450 이상 가솔린 모델을 추천합니다."),
           ("Exclusive vs AMG Line", "같은 S 450 4MATIC Long이라도 Exclusive는 클래식한 크롬 디자인, AMG Line은 스포티한 범퍼·휠 구성입니다. 가격 차이도 있으니 함께 비교해 보세요."),
           ("법인·리스 상담", "S-Class는 법인리스·운용리스 비중이 높은 차종입니다. 명의(개인·개인사업자·법인)와 운용 기간에 따라 유리한 방식이 달라 견적을 나란히 비교해 드립니다.")],
    faq=[("S-Class도 할인이 있나요?", "차종·연식·시기에 따라 다릅니다. 이달 조건은 아래 혜택 표에 반영되어 있으며, 기존 벤츠 보유 고객은 재구매·Trade-in 혜택을 받을 수 있습니다."),
         ("S 450과 S 450 Long은 무엇이 다른가요?", "Long은 휠베이스가 길어 뒷좌석 무릎 공간이 넓습니다. 뒷좌석에 자주 타시거나 기사 운전 차량이라면 Long을 추천합니다."),
         ("법인리스와 개인사업자 리스 중 무엇이 유리한가요?", "사업 형태와 비용 처리 방식에 따라 다릅니다. 명의와 운용 기간을 알려주시면 두 방식의 견적을 함께 정리해 드립니다."),
         ("원거리에 사는데 출고가 가능한가요?", "가능합니다. 상담·계약은 카카오톡과 전화로 진행하고, 출고는 일정에 맞춰 직접 찾아뵙고 있습니다.")]),
  "glc": dict(file="glc.html", short="GLC",
    title="벤츠 GLC 가격·할인 · GLC 300 쿠페 무이자 할부 | 구리 이세웅 과장",
    desc="벤츠 GLC 300 4MATIC SUV·쿠페의 트림별 가격과 27년식·26년식 재고 할인, 무이자 할부 조건을 HS더클래스 효성 구리전시장 이세웅 과장이 정리했습니다.",
    h1="GLC,<br>SUV와 쿠페 중 <em>내 스타일</em>로.",
    lead="GLC 300 4MATIC SUV와 쿠페를 27년식·26년식 재고로 나눠 가격과 이달 조건을 정리했습니다. 연식에 따라 할인율과 무이자 조건이 달라 함께 비교해 보시는 것을 추천합니다.",
    guide=[("SUV vs Coupé", "짐 공간과 뒷좌석 머리 공간을 중시하면 SUV, 날렵한 루프라인과 스타일을 원하면 쿠페가 잘 맞습니다. 쿠페는 같은 트림 기준 가격이 조금 더 높습니다."),
           ("AVANTGARDE vs AMG Line", "AVANTGARDE는 단정하고 고급스러운 디자인, AMG Line은 스포티한 범퍼·휠과 역동적인 실내 구성입니다."),
           ("27년식 vs 26년식 재고", "26년식 재고는 할인율이 더 높은 경우가 많고, 27년식은 최신 사양을 받을 수 있습니다. 원하는 색상 재고가 어느 연식에 있는지가 실제 선택에 가장 큰 영향을 줍니다."),
           ("전기차를 고민 중이라면", "새로운 GLC electric 사전계약 상담도 받고 있습니다. 충전 환경이 있다면 함께 비교해 보세요.")],
    faq=[("GLC SUV와 쿠페 중 무엇이 더 인기 있나요?", "실용성을 중시하는 가족 고객은 SUV, 디자인을 중시하는 고객은 쿠페를 많이 선택합니다. 실제 차량을 보고 결정하시도록 전시장 방문도 도와드립니다."),
         ("무이자 할부 조건은 어떻게 되나요?", "트림·연식마다 다릅니다. 아래 혜택 카드의 '조건·금융 자세히'에서 선수금과 기간을 확인하실 수 있습니다."),
         ("26년식 재고는 언제까지 있나요?", "재고가 소진되면 종료됩니다. 원하는 색상·트림의 재고 여부는 상담 시 바로 확인해 드립니다."),
         ("GLC electric과 비교할 수 있나요?", "네. 전기차 사전계약 페이지에서 GLC electric 정보를 보시고, 내연기관 GLC와 함께 견적을 비교해 드립니다.")]),
  "gle": dict(file="gle.html", short="GLE",
    title="벤츠 GLE 가격·할인 · GLE 450 쿠페 무이자 할부 | 구리 이세웅 과장",
    desc="벤츠 GLE 450 4MATIC·GLE 쿠페·AMG GLE 53 트림별 가격과 이달의 할인, 24·36개월 무이자 할부 조건을 HS더클래스 효성 구리전시장 이세웅 과장이 정리했습니다.",
    h1="GLE,<br>여유로운 공간과 <em>존재감</em>.",
    lead="GLE 300 d부터 Mercedes-AMG GLE 53까지 SUV와 쿠페의 가격과 이달 조건을 정리했습니다. 26년식 재고 할인과 무이자 할부, 새로운 GLE 사전 상담까지 함께 안내해 드립니다.",
    guide=[("SUV vs Coupé", "가족 이동과 적재 공간을 중시하면 SUV, 쿠페형 실루엣의 스타일을 원하면 GLE 쿠페를 추천합니다."),
           ("가솔린 vs 디젤", "GLE 450 4MATIC은 부드럽고 힘 있는 가솔린, GLE 300 d·450 d는 장거리 주행이 많은 분께 맞는 디젤 모델입니다."),
           ("AMG GLE 53", "더 강력한 성능과 AMG 전용 디자인을 원하신다면 Mercedes-AMG GLE 53 4MATIC+ SUV·쿠페를 비교해 보세요."),
           ("26년식 재고 vs 새로운 GLE", "26년식 재고는 이달 할인과 무이자 조건이 큰 편이고, 27년식 The new GLE는 가격이 확정되는 대로 상담 고객님께 먼저 안내해 드립니다.")],
    faq=[("GLE 쿠페와 SUV는 가격 차이가 얼마나 나나요?", "트림에 따라 다릅니다. 아래 트림별 가격표에서 같은 엔진의 SUV와 쿠페 가격을 비교하실 수 있습니다."),
         ("GLE도 무이자 할부가 되나요?", "이달 26년식 재고 다수 트림이 24·36개월 무이자 대상입니다. 트림별 선수금 조건은 혜택 카드에서 확인하세요."),
         ("새로운 GLE(27년식)는 언제 나오나요?", "가격과 출고 일정이 확정되는 대로 안내해 드립니다. 상담을 남겨주시면 먼저 연락드립니다."),
         ("출고까지 얼마나 걸리나요?", "재고 차량은 계약 후 빠르게 출고되는 경우가 많습니다. 원하는 색상 재고를 바로 확인해 드립니다.")]),
  "c-class": dict(file="c-class.html", short="C클래스",
    title="벤츠 C클래스 가격·할인 · C200 무이자 할부 | 구리 이세웅 과장",
    desc="벤츠 C 200 AVANTGARDE·AMG Line 가격과 이달의 할인, 24개월 무이자 할부 조건을 HS더클래스 효성 구리전시장 이세웅 과장이 정리했습니다.",
    h1="C-Class,<br>벤츠 세단의 <em>시작</em>.",
    lead="C 200 AVANTGARDE와 AMG Line의 가격과 이달 조건을 정리했습니다. 첫 벤츠를 고민하는 분께 할인과 무이자 할부를 함께 비교해 드립니다.",
    guide=[("AVANTGARDE vs AMG Line", "AVANTGARDE는 단정하고 클래식한 디자인, AMG Line은 스포티한 범퍼·휠과 역동적인 분위기입니다."),
           ("C-Class vs E-Class", "도심 주행과 합리적인 가격을 중시하면 C-Class, 뒷좌석 공간과 장거리 편안함을 중시하면 E-Class를 함께 비교해 보세요."),
           ("첫 벤츠라면", "무이자 할부와 리스 중 어떤 방식이 월 부담이 적은지 함께 계산해 드립니다.")],
    faq=[("C 200도 무이자 할부가 되나요?", "이달 26년식 재고 기준 24개월 무이자 조건이 있습니다. 선수금 조건은 혜택 카드에서 확인하세요."),
         ("C-Class와 E-Class 중 무엇이 나을까요?", "주 사용 목적과 예산에 따라 다릅니다. 두 차종의 이달 실구매가를 나란히 비교해 드립니다."),
         ("사회초년생도 리스·할부가 가능한가요?", "금융사 심사 결과에 따라 다릅니다. 조건을 미리 확인해 보고 가능한 방식을 안내해 드립니다.")]),
  "glb": dict(file="glb.html", short="GLB",
    title="벤츠 GLB 가격·할인 · GLB 250 무이자 할부 | 구리 이세웅 과장",
    desc="벤츠 GLB 250 4MATIC과 Mercedes-AMG GLB 35 4MATIC 가격, 이달의 할인과 24개월 무이자 할부 조건을 HS더클래스 효성 구리전시장 이세웅 과장이 정리했습니다.",
    h1="GLB,<br>각진 디자인의 <em>실용 SUV</em>.",
    lead="GLB 250 4MATIC과 Mercedes-AMG GLB 35 4MATIC의 가격과 이달 조건을 정리했습니다. 새로운 GLB electric 사전계약도 함께 상담해 드립니다.",
    guide=[("GLB 250 vs AMG GLB 35", "일상 주행과 실용성을 중시하면 GLB 250 4MATIC, 더 높은 출력과 AMG 디자인을 원하면 AMG GLB 35 4MATIC을 추천합니다."),
           ("내연기관 vs GLB electric", "집·회사에 충전 환경이 있다면 새로운 GLB electric도 함께 비교해 보세요.")],
    faq=[("GLB도 무이자 할부가 되나요?", "이달 26년식 재고 기준 24개월 무이자 조건이 있습니다. 트림별 조건은 혜택 카드에서 확인하세요."),
         ("GLB electric은 언제 받을 수 있나요?", "가격·배정 일정이 확정되는 대로 사전 상담 고객님께 먼저 안내해 드립니다.")]),
  "gls": dict(file="gls.html", short="GLS",
    title="벤츠 GLS 가격·할인 · GLS 450 무이자 할부 | 구리 이세웅 과장",
    desc="벤츠 GLS 450 4MATIC, GLS 580 4MATIC, AMG GLS 63 가격과 이달의 할인, 24·36개월 무이자 할부 조건을 HS더클래스 효성 구리전시장 이세웅 과장이 정리했습니다.",
    h1="GLS,<br>3열까지 넉넉한 <em>대형 SUV</em>.",
    lead="GLS 450 4MATIC부터 Mercedes-AMG GLS 63까지 가격과 이달 조건을 정리했습니다. 가족 이동과 의전용 차량을 함께 고민하는 분께 추천합니다.",
    guide=[("GLS 450 vs GLS 580", "GLS 450 4MATIC은 균형 잡힌 선택, GLS 580 4MATIC은 더 높은 출력과 여유를 원하는 분께 맞습니다."),
           ("AMG GLS 63", "대형 SUV에 AMG의 고성능을 원하신다면 Mercedes-AMG GLS 63 4MATIC+를 비교해 보세요."),
           ("GLE와 비교", "3열 시트가 꼭 필요하지 않다면 GLE도 함께 비교해 보시면 선택이 쉬워집니다.")],
    faq=[("GLS도 무이자 할부가 되나요?", "이달 26년식 재고 기준 24·36개월 무이자 조건이 있습니다. 트림별 선수금 조건은 혜택 카드에서 확인하세요."),
         ("법인 명의로 구매할 수 있나요?", "네. 법인 구매·법인리스 견적을 함께 비교해 드립니다.")]),
  "eq": dict(file="eqs-eqe.html", short="EQS·EQE",
    title="벤츠 EQS·EQE 가격·할인 · EQS SUV 무이자 할부 | 구리 이세웅 과장",
    desc="벤츠 전기차 EQS 세단, EQS SUV, EQE 350+ 가격과 이달의 할인, 24·36개월 무이자 할부 조건을 HS더클래스 효성 구리전시장 이세웅 과장이 정리했습니다.",
    h1="EQS · EQE,<br>지금 바로 받는 <em>벤츠 전기차</em>.",
    lead="EQS 세단, EQS SUV, EQE 350+의 가격과 이달 조건을 정리했습니다. 새로 나오는 GLC·GLB·CLA electric 사전계약도 함께 비교해 드립니다.",
    guide=[("EQS vs EQE", "플래그십 전기 세단의 공간과 정숙성을 원하면 EQS, 합리적인 가격의 전기 세단을 원하면 EQE 350+를 추천합니다."),
           ("EQS SUV", "넓은 실내와 사륜구동 SUV를 원하는 분께는 EQS 450·580 4MATIC SUV가 맞습니다."),
           ("새로운 전기차와 비교", "GLC·GLB·CLA electric 사전계약과 지금 받을 수 있는 EQ 재고 차량을 함께 비교해 보세요.")],
    faq=[("전기차 보조금을 받을 수 있나요?", "차량 가격·지역·시점에 따라 다릅니다. 상담 시 해당 조건을 확인해 드립니다."),
         ("EQ 모델도 무이자 할부가 되나요?", "이달 조건은 혜택 카드에서 확인하실 수 있으며, 트림별 선수금 조건이 다릅니다.")]),
  "g-class": dict(file="g-class.html", short="G클래스",
    title="벤츠 G클래스 가격·할인 · AMG G63 무이자 할부 | 구리 이세웅 과장",
    desc="Mercedes-AMG G 63 가격과 이달의 24·36개월 무이자 할부 조건을 HS더클래스 효성 구리전시장 이세웅 과장이 정리했습니다.",
    h1="G-Class,<br>시간이 지나도 변하지 않는 <em>아이콘</em>.",
    lead="Mercedes-AMG G 63의 가격과 이달 금융 조건을 정리했습니다. 색상·옵션 재고는 빠르게 바뀌어 상담 시 바로 확인해 드립니다.",
    guide=[("재고 확인이 먼저", "G-Class는 색상·옵션 조합에 따라 재고 상황이 크게 다릅니다. 원하는 사양을 알려주시면 가능한 차량부터 찾아드립니다."),
           ("무이자 할부 활용", "차량 가격이 높은 만큼 무이자 할부 기간과 선수금 조건에 따라 월 부담 차이가 큽니다. 리스와 함께 비교해 드립니다.")],
    faq=[("G 63도 무이자 할부가 되나요?", "이달 26년식 재고 기준 24·36개월 무이자 조건이 있습니다. 선수금 조건은 혜택 카드에서 확인하세요."),
         ("원하는 색상을 주문할 수 있나요?", "재고 차량과 주문 가능 여부를 상담 시 함께 확인해 드립니다.")]),
}

tpl = open("e-class.html", encoding="utf-8").read()
head_end = tpl.index("</head>") + len("</head>")
HEAD, rest = tpl[:head_end], tpl[head_end:]
hdr_start = rest.index('<header class="hdr">'); hdr_end = rest.index("</header>") + len("</header>")
HEADER = rest[hdr_start:hdr_end].replace(" aria-current=page", "")
TAIL = rest[rest.index('<section class="sec" id="consult"'):]

month = S["promoMeta"]["month"]
def man(won): return f"{won // 10000:,}만원"
def myl(p): return ("27년식" if p["my"] == "MY27" else "26년식") + (" 재고" if p.get("stock") else "")
def head_rate(p): return (p.get("base") or 0) + (p.get("mbm") or 0)

def trims_html(mid):
    ps = [p for p in S["promotions"] if p["model"] == mid]
    ps.sort(key=lambda p: (p["my"] != "MY27", p.get("price") or 10**12))
    rows = []
    for p in ps:
        hr = head_rate(p)
        if p.get("price"):
            price = man(p["price"])
            after = f'<span class="tr-after">이달 {hr}% 적용 시 약 {man(p["price"] - (p["price"] * hr // 100 // 10000) * 10000)}</span>' if hr else '<span class="tr-after">재구매·Trade-in 혜택은 견적 계산에서 확인</span>'
            btn = f'<button class="btn btn-line btn-sm" data-quote="{E(mid)}|{E(p["trim"])}|{E(p["my"])}">견적 계산</button>'
        else:
            price, after = "가격 상담", '<span class="tr-after">가격 확정 시 안내</span>'
            btn = f'<button class="btn btn-line btn-sm" data-consult="{E(mid)}" data-loc="model_trims">가격 상담</button>'
        zero = re.search(r"(\d+(?:·\d+)?개월 무이자)", p.get("finance") or "")
        tag = f'<span class="tr-zero">{E(zero.group(1))}</span>' if zero else ""
        rows.append(f'<div class="trow"><h3>{E(p["trim"])} <small style="color:var(--mut);font-weight:500;font-size:12px">{myl(p)}</small></h3><div class="pr">{price}</div>'
                    f'<div class="spec m-spec">{after} {tag}{btn}</div></div>')
    note = f'<p class="note" style="color:var(--mut)">{E(S["priceBasis"]["label"])} · {E(month)} 조건 기준 · 할인 후 금액은 현금+벤츠 금융 이용 시 예상치이며 탁송·등록비 별도</p>'
    return "\n".join(rows) + note

def page(mid, c):
    m = next(x for x in S["models"] if x["id"] == mid)
    url = f'{SITE_URL}/{c["file"]}'
    head = HEAD
    head = re.sub(r"<title>[^<]*</title>", f"<title>{E(c['title'])}</title>", head)
    for pat, val in [(r'(<meta name="description" content=")[^"]*', c["desc"]), (r'(<meta property="og:description" content=")[^"]*', c["desc"]),
                     (r'(<meta property="og:title" content=")[^"]*', c["title"]), (r'(<link rel="canonical" href=")[^"]*', url), (r'(<meta property="og:url" content=")[^"]*', url)]:
        head = re.sub(pat, lambda mm: mm.group(1) + E(val), head, count=1)
    stories = [r for r in S["reviews"] if r["model"] == mid]
    others = [(x["id"], PAGES[x["id"]]["file"] if x["id"] in PAGES else x.get("page"), x["name"]) for x in S["models"] if not x.get("ev")]
    others_html = " ".join(f'<a class="chip-link" href="{f}">{E(n)}</a>' for i, f, n in others if f and i != mid) + ' <a class="chip-link" href="ev.html">전기차 사전계약</a>'
    guide = "".join(f'<div class="xbox"><h4>{E(t)}</h4><p>{E(d)}</p></div>' for t, d in c["guide"])
    faq = "".join(f"<details><summary>{E(q)}</summary><p>{E(a)}</p></details>" for q, a in c["faq"])
    rv = f'''<section class="sec char" aria-labelledby="mr-h"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Delivery Stories</span><h2 id="mr-h">{E(m["name"])} 출고 이야기</h2></div>
  <div class="grid c3" id="reviews"></div>{'<p class="swipe-hint">← 옆으로 밀어서 더 보기</p>' if len(stories) > 1 else ''}
</div></section>''' if stories else ""
    main = f'''<main id="main">
<div class="wrap crumb"><a href="index.html">홈</a> › 모델 › {E(m["name"])}</div>
<section class="hero" style="padding-top:24px"><div class="wrap hero-grid">
  <div>
    <span class="eyebrow">Mercedes-Benz {E(m["name"])}</span>
    <h1>{c["h1"]}</h1>
    <p class="lead">{E(c["lead"])}</p>
    <div class="ctas" style="margin-top:24px"><button class="btn btn-gold" data-consult="{mid}" data-loc="model_hero">{E(m["name"])} 견적 받기</button><a class="btn btn-line" href="#m-promo"><span data-promo-m>{E(month[-3:].strip())}</span> {E(m["name"])} 혜택</a></div>
  </div>
  <figure class="photo wide"><img src="{E(m.get("image", ""))}" alt="메르세데스-벤츠 {E(m["name"])} 이미지" fetchpriority="high"><figcaption>카탈로그 이미지 · 판매 차량과 색상·사양이 다를 수 있습니다</figcaption></figure>
</div></section>

<section class="sec" style="padding-top:20px" aria-labelledby="trim-h"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Trims & Price</span><h2 id="trim-h">{E(c["short"])} 트림별 가격</h2></div>
  <div class="trim-list">
{trims_html(mid)}
  </div>
</div></section>

<section class="sec char" aria-labelledby="cmp-h"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">How to choose</span><h2 id="cmp-h">이렇게 고르면 쉽습니다</h2></div>
  <div class="cmp">{guide}</div>
</div></section>

<section class="sec light" id="m-promo" aria-labelledby="mp-h"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">{E(m["name"])} Offers</span><h2 id="mp-h"><span data-promo-m>{E(month[-3:].strip())}</span> {E(m["name"])} 혜택</h2><p>할인은 현금 + 금융 이용 시 추가분이며, MOU 제휴사 임직원이라면 <a href="index.html#mou" style="text-decoration:underline">추가 할인(+2%)</a>도 확인해 보세요.</p></div>
  <div id="better" class="basis" style="display:block;background:#fbf8f1;border-color:#eadfc6"></div>
  <div id="promos"></div>
</div></section>

<section class="sec char" id="quote-sec" aria-labelledby="q-h"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Quote</span><h2 id="q-h">내 조건으로 견적 계산</h2><p>트림을 고르고 해당되는 혜택만 체크하면 예상 차량 구매가가 바로 나옵니다.</p></div>
  <div id="quote"></div>
</div></section>
{rv}
<section class="sec" aria-labelledby="faq-h"><div class="wrap" style="max-width:820px">
  <div class="sec-h"><span class="eyebrow">FAQ</span><h2 id="faq-h">{E(m["name"])} 자주 묻는 질문</h2></div>
  <div class="faq">{faq}</div>
  <div class="other-models"><b>다른 차종 보기</b><div>{others_html}</div></div>
</div></section>

'''
    body = f'<body data-mode="live" data-page="model" data-model="{mid}">\n<a class="sr" href="#main">본문 바로가기</a>\n\n'
    return head + "\n" + body + HEADER + "\n" + main + TAIL

for mid, c in PAGES.items():
    open(c["file"], "w", encoding="utf-8").write(page(mid, c))
    print("wrote", c["file"])

# data.js: models[].page 연결
d = open("assets/data.js", encoding="utf-8").read()
for mid, c in PAGES.items():
    d = re.sub(r'(id: "%s",[^\n]*?page: )""' % re.escape(mid), r'\1"%s"' % c["file"], d)
    if f'page: "{c["file"]}"' not in d:
        d = re.sub(r'(\{ id: "%s", )' % re.escape(mid), r'\1page: "%s", ' % c["file"], d, count=1)
open("assets/data.js", "w", encoding="utf-8").write(d)

# sitemap
sm = open("sitemap.xml", encoding="utf-8").read()
for c in PAGES.values():
    loc = f"<url><loc>{SITE_URL}/{c['file']}</loc></url>"
    if loc not in sm: sm = sm.replace("</urlset>", loc + "</urlset>")
open("sitemap.xml", "w", encoding="utf-8").write(sm)
