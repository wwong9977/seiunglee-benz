"""차종별 공유 썸네일(카톡·SNS 미리보기, 1200x630)을 만듭니다: assets/img/og/og-<차종>.jpg"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
F = "/usr/share/fonts/opentype/noto/NotoSansCJK-%s.ttc"
def font(w, s): return ImageFont.truetype(F % w, s, index=1)  # index 1 = KR
ITEMS = {  # 파일명: (사진, 큰 제목, 작은 설명)
  "e-class": ("assets/img/cat-e-pair.jpg", "E-Class", "E 200 · E 300 · E 450 가격과 이달 혜택"),
  "s-class": ("assets/img/gallery/g-s-1.jpg", "S-Class", "S 350 d부터 S 580 Long까지"),
  "glc": ("assets/img/gallery/g-glc-1.jpg", "GLC", "SUV · Coupé 가격과 무이자 할부"),
  "gle": ("assets/img/gallery/g-gle-1.jpg", "GLE", "SUV · Coupé · AMG GLE 53"),
  "c-class": ("assets/img/gallery/g-c-1.jpg", "C-Class", "C 200 가격과 무이자 할부"),
  "glb": ("assets/img/gallery/g-glb-2.jpg", "GLB", "GLB 250 · AMG GLB 35"),
  "gls": ("assets/img/gallery/g-gls-1.jpg", "GLS", "3열 대형 SUV · AMG GLS 63"),
  "eq": ("assets/img/gallery/g-eqs-2.jpg", "EQS · EQE", "벤츠 전기차 가격과 무이자 할부"),
  "g-class": ("assets/img/gallery/g-g-1.jpg", "G-Class", "Mercedes-AMG G 63"),
}
W, H = 1200, 630
logo = Image.open("assets/img/logo-light.png").convert("RGBA")
os.makedirs("assets/img/og", exist_ok=True)
for k, (src, title, sub) in ITEMS.items():
    ph = Image.open(src).convert("RGB")
    # 사진을 오른쪽 760px 영역에 채우기
    pw = 780; r = max(pw / ph.width, H / ph.height)
    ph = ph.resize((round(ph.width * r), round(ph.height * r)), Image.LANCZOS)
    x0 = (ph.width - pw) // 2; y0 = (ph.height - H) // 2
    ph = ph.crop((x0, y0, x0 + pw, y0 + H))
    im = Image.new("RGB", (W, H), (11, 15, 21)); im.paste(ph, (W - pw, 0))
    # 왼쪽으로 어두워지는 그라데이션
    g = Image.new("L", (W, 1)); 
    for x in range(W): g.putpixel((x, 0), 255 if x < 420 else max(0, int(255 * (1 - (x - 420) / 260))))
    mask = g.resize((W, H)); dark = Image.new("RGB", (W, H), (11, 15, 21)); im = Image.composite(dark, im, mask)
    d = ImageDraw.Draw(im)
    lg = logo.copy(); lg.thumbnail((300, 60)); im.paste(lg, (64, 60), lg)
    d.text((64, 150), "이세웅 과장 · HS더클래스 효성 구리전시장", font=font("Regular", 22), fill=(184, 190, 200))
    d.text((60, 225), title, font=font("Bold", 84 if len(title) < 8 else 72), fill=(255, 255, 255))
    d.text((64, 345), sub, font=font("Medium", 30), fill=(230, 226, 217))
    d.rounded_rectangle((64, 470, 480, 540), radius=35, fill=(214, 180, 122))
    d.text((272, 505), "이달 할인 · 견적 계산하기", font=font("Bold", 26), fill=(11, 15, 21), anchor="mm")
    im.save(f"assets/img/og/og-{k}.jpg", quality=86, optimize=True, progressive=True); print("og", k)
