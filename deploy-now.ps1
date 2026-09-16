# SKAT — деплой текущей папки в GitHub (main), однократный скрипт.
# Запускать в PowerShell из любой директории. Требуется установленный git.
#
# Что делает:
#  1. Клонирует deusexmashine/skat-website во временную папку.
#  2. Удаляет все файлы кроме .git и video/ (video трогать нельзя — доработаем отдельно).
#  3. Копирует актуальное содержимое вашей папки skat (без служебных/черновых файлов и без video/).
#  4. Добавляет .gitignore, коммитит.
#  5. Просит вас запустить push с вашим PAT-токеном (последняя строка, вручную — токен нигде не сохраняется скриптом).

$ErrorActionPreference = "Stop"

$src  = "C:\Users\Алексей Борисович\Downloads\skat"
$repo = "https://github.com/deusexmashine/skat-website.git"
$work = Join-Path $env:TEMP ("skat-deploy-" + (Get-Date -Format "yyyyMMdd-HHmmss"))

Write-Host "1/5 Клонирую $repo во временную папку $work ..."
git clone --depth 1 $repo $work
Set-Location $work

Write-Host "2/5 Очищаю старое содержимое (кроме .git и video/) ..."
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" -and $_.Name -ne "video" } | Remove-Item -Recurse -Force

Write-Host "3/5 Копирую актуальные файлы сайта из $src ..."
robocopy $src $work /E `
  /XD "Claude outputs" "Новая папка" "обучение ИИ" "проект Листовки" "версии" "video" ".git" `
  /XF "*.docx" "~`$*" "Thumbs.db" "desktop.ini" "Новый текстовый документ.txt" "SKAT-project-handoff.md" `
  /NFL /NDL /NJH /NJS /NP
# robocopy возвращает код >0 при успешном копировании — это нормально, не ошибка.

# README репозитория (не часть сайта, но был в репо изначально)
@"
# skat-website
Eng. version of IEF SKAT website
"@ | Out-File -Encoding utf8 (Join-Path $work "README.md")

@"
# Рабочие/черновые файлы — не нужны в проде
Claude outputs/
Новая папка/
обучение ИИ/
проект Листовки/
версии/
SKAT-project-handoff.md
~`$*.docx
*.docx
*.tmp
Thumbs.db
desktop.ini

# Локальный dev-сервер — не часть сайта
server_range.py
start_skat.bat
"@ | Out-File -Encoding utf8 (Join-Path $work ".gitignore")

Write-Host "4/5 Коммичу ..."
git add -A
git commit -m "Deploy full i18n rollout: 22-language support, specs tables, content fixes"

Write-Host ""
Write-Host "5/5 Готово. Осталось запушить вручную (Git спросит логин/пароль —"
Write-Host "     логин: ваш GitHub-логин, пароль: ваш PAT-токен):"
Write-Host ""
Write-Host "     cd `"$work`""
Write-Host "     git push $repo main"
Write-Host ""
Write-Host "После успешного push — Vercel обновится автоматически (обычно 1-3 минуты)."
