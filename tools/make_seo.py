"""검색엔진(네이버·구글)용 파일을 data.js 기준으로 다시 만듭니다.
출고 후기를 추가하거나 페이지를 추가한 뒤 실행: python3 tools/make_seo.py  (node 필요)

1) stories.html 의 후기 목록을 HTML에 미리 넣어 둡니다 (자바스크립트를 잘 읽지 못하는 검색 로봇도 글 목록을 볼 수 있게)
2) 각 후기 상세 페이지에 글 정보(BlogPosting) 구조화 데이터를 넣습니다
3) sitemap.xml (수정일 포함), rss.xml (네이버 서치어드바이저 RSS 제출용) 을 새로 만듭니다
"""
import glob, html, json, os, re, subprocess, datetime
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SITE = "https://wwong9977.github.io/seiunglee-benz/"
AUTHOR = "이세웅 과장 · HS더클래스 효성 구리전시장"

data = json.loads(subprocess.check_output(["node", "-e",
    "global.window={};require('./assets/data.js');process.stdout.write(JSON.stringify(window.SITE.reviews))"]))
stories = [r for r in data if r.get("link")]
esc = lambda t: html.escape(str(t or ""), quote=True)
sm = lambda p: re.sub(r"^assets/img/(?!sm/)", "assets/img/sm/", p or "") if (p or "").endswith(".jpg") else p

# 1) stories.html 정적 목록
cards = "".join(
    f'<a class="st-card" href="{esc(r["link"])}"><img src="{esc(sm(r.get("thumb") or r.get("photo")))}" alt="" '
    f'{"fetchpriority=\"high\"" if i < 2 else "loading=\"lazy\""}><div><small>{esc(r.get("date"))}</small><b>{esc(r.get("title") or r.get("car"))}</b>'
    f'<p>{esc(r.get("excerpt") or r.get("reason"))}</p><span>이야기 읽기 →</span></div></a>'
    for i, r in enumerate(stories))
p = "stories.html"; s = open(p, encoding="utf-8").read()
s, n = re.subn(r'<!--stories-->.*?<!--/stories-->', lambda m: '<!--stories-->' + cards + '<!--/stories-->', s, count=1, flags=re.S)
assert n == 1, "stories.html 에 <!--stories--> 표시가 없습니다"
open(p, "w", encoding="utf-8").write(s)

# 2) 상세 페이지 BlogPosting 구조화 데이터
for r in stories:
    p = r["link"]
    if not os.path.exists(p): continue
    s = open(p, encoding="utf-8").read()
    ld = {"@context": "https://schema.org", "@type": "BlogPosting", "headline": r.get("title") or r.get("car"),
          "datePublished": r.get("date"), "image": SITE + (r.get("photo") or "assets/img/og.jpg"),
          "description": r.get("excerpt", "").rstrip("…"), "mainEntityOfPage": SITE + p,
          "author": {"@type": "Person", "name": "이세웅", "jobTitle": "메르세데스-벤츠 세일즈 컨설턴트 (과장)"},
          "about": {"@type": "Product", "name": "Mercedes-Benz " + (r.get("car") or ""), "brand": {"@type": "Brand", "name": "Mercedes-Benz"}}}
    tag = '<script type="application/ld+json" data-seo="post">' + json.dumps(ld, ensure_ascii=False) + "</script>"
    s = re.sub(r'<script type="application/ld\+json" data-seo="post">.*?</script>\n?', "", s, flags=re.S)
    s = s.replace("</head>", tag + "\n</head>", 1)
    open(p, "w", encoding="utf-8").write(s)

# 3) sitemap.xml / rss.xml
today = datetime.date.today().isoformat()
latest = max([r.get("date", today) for r in stories] + ["2000-01-01"])
pages = ["", "consult.html", "promotion.html", "e-class.html", "s-class.html", "glc.html", "gle.html", "c-class.html",
         "glb.html", "gls.html", "eqs-eqe.html", "g-class.html", "ev.html", "stories.html", "benz-guri.html", "event-jamsil.html"]
urls = [(SITE + p, latest if p in ("", "stories.html") else today, "1.0" if p == "" else "0.8") for p in pages if p == "" or os.path.exists(p)]
urls += [(SITE + r["link"], r.get("date", today), "0.6") for r in stories]
open("sitemap.xml", "w", encoding="utf-8").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "".join(f"<url><loc>{u}</loc><lastmod>{d}</lastmod><priority>{pr}</priority></url>\n" for u, d, pr in urls) + "</urlset>\n")
rfc = lambda d: datetime.datetime.strptime(d, "%Y-%m-%d").strftime("%a, %d %b %Y 09:00:00 +0900")
items = "".join(f"<item><title>{esc(r.get('title'))}</title><link>{SITE}{r['link']}</link><guid>{SITE}{r['link']}</guid>"
                f"<pubDate>{rfc(r['date'])}</pubDate><description>{esc(r.get('excerpt'))}</description></item>\n" for r in stories)
open("rss.xml", "w", encoding="utf-8").write(f'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n<title>구리 벤츠 이세웅 과장 · 출고 이야기</title>'
    f"<link>{SITE}</link><description>메르세데스-벤츠 HS더클래스 효성 구리전시장 이세웅 과장의 실제 고객 출고 후기</description><language>ko</language>\n{items}</channel></rss>\n")
print(f"stories {len(stories)} · sitemap {len(urls)} urls · rss ok")
