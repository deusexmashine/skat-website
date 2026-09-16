import os
from playwright.sync_api import sync_playwright

# ===== НАСТРОЙКИ =====
# Путь к вашему HTML-файлу (укажите правильный путь к seminar_slides.html)
html_path = r"C:\Users\Алексей Борисович\Downloads\skat\seminar.html"

# Куда сохранить PDF
output_path = r"C:\Users\Алексей Борисович\Downloads\skat\seminar.pdf"

# ===== КОД =====
def convert_html_to_pdf():
    with sync_playwright() as p:
        # Запускаем браузер (headless)
        browser = p.chromium.launch(headless=True)

        # Создаём страницу с viewport, соответствующим альбомному слайду
        page = browser.new_page(viewport={"width": 1200, "height": 800})

        # Открываем HTML-файл
        page.goto(f"file:///{html_path.replace('\\', '/')}")

        # Ждём загрузки (картинки, шрифты)
        page.wait_for_timeout(2000)

        # Сохраняем в PDF с учётом альбомной ориентации и CSS-размеров
        page.pdf(
            path=output_path,
            format="A4",
            landscape=True,                  # ВАЖНО: альбомная ориентация
            print_background=True,           # Сохранять фоновые цвета
            prefer_css_page_size=True,       # Использовать размеры из CSS (297×210)
            margin={                         # Отключаем все поля
                "top": "0mm",
                "bottom": "0mm",
                "left": "0mm",
                "right": "0mm"
            }
        )

        browser.close()
        print(f"✅ PDF сохранён: {output_path}")

if __name__ == "__main__":
    convert_html_to_pdf()