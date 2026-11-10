"""assets 파일을 고친 뒤 실행: 모든 HTML의 ?v= 값을 파일 내용 기준으로 갱신해 방문자 브라우저 캐시를 새로 고칩니다.
사용: python3 tools/bump_versions.py"""
import glob, hashlib, re, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
files = ["assets/data.js", "assets/app.js", "assets/style.css", "assets/mou-list.js"]
ver = {f: hashlib.md5(open(f, "rb").read()).hexdigest()[:8] for f in files}
for h in glob.glob("*.html"):
    s = open(h, encoding="utf-8").read(); o = s
    for f, v in ver.items():
        s = re.sub(re.escape(f) + r"\?v=\w+", f"{f}?v={v}", s)
    if s != o: open(h, "w", encoding="utf-8").write(s); print("updated", h)
