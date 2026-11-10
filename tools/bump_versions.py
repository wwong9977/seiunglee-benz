"""assets 파일을 고친 뒤 실행:
1) assets/img/*.jpg 의 작은 사진(assets/img/sm/, 가로 640px)을 새로 만들거나 갱신합니다 (카드·목록용, 로딩 속도 개선)
2) 모든 HTML의 ?v= 값을 파일 내용 기준으로 갱신해 방문자 브라우저 캐시를 새로 고칩니다.
사용: python3 tools/bump_versions.py   (작은 사진 생성에는 Pillow 필요: pip install pillow)"""
import glob, hashlib, re, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
def make_small():
    try:
        from PIL import Image, ImageOps
    except ImportError:
        print("Pillow가 없어 작은 사진 생성을 건너뜁니다"); return
    os.makedirs("assets/img/sm", exist_ok=True)
    for src in glob.glob("assets/img/**/*.jpg", recursive=True):
        if src.startswith("assets/img/sm/") or os.sep + "sm" + os.sep in src: continue
        dst = src.replace("assets/img/", "assets/img/sm/", 1); os.makedirs(os.path.dirname(dst), exist_ok=True)
        if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src): continue
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        if im.width > 640: im = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS)
        im.save(dst, "JPEG", quality=76, optimize=True, progressive=True); print("small", dst)
make_small()
files = ["assets/data.js", "assets/app.js", "assets/style.css", "assets/mou-list.js"]
ver = {f: hashlib.md5(open(f, "rb").read()).hexdigest()[:8] for f in files}
for h in glob.glob("*.html"):
    s = open(h, encoding="utf-8").read(); o = s
    for f, v in ver.items():
        s = re.sub(re.escape(f) + r"\?v=\w+", f"{f}?v={v}", s)
    if s != o: open(h, "w", encoding="utf-8").write(s); print("updated", h)
