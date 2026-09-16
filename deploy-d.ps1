# SKAT — повторный деплой из постоянной git-папки D:\skatwebsite2026
# Запускать каждый раз, когда нужно выложить изменения на прод.
# Перед первым использованием один раз запустите setup-d-drive.ps1.

$ErrorActionPreference = "Stop"

$src    = "C:\Users\Алексей Борисович\Downloads\skat"
$target = "D:\skatwebsite2026"

if (-not (Test-Path (Join-Path $target ".git"))) {
    Write-Host "В $target нет git-репозитория. Сначала запустите setup-d-drive.ps1."
    exit 1
}

Set-Location $target

Write-Host "1/3 Обновляю файлы из $src ..."
robocopy $src $target /E `
  /XD "Claude outputs" "Новая папка" "обучение ИИ" "проект Листовки" "версии" "video" ".git" `
  /XF "*.docx" "~`$*" "Thumbs.db" "desktop.ini" "Новый текстовый документ.txt" "SKAT-project-handoff.md" `
  /NFL /NDL /NJH /NJS /NP

Write-Host "2/3 Проверяю изменения ..."
$status = git status --short
if (-not $status) {
    Write-Host "Изменений нет — деплоить нечего."
    exit 0
}
git status --short
Write-Host ""
$msg = Read-Host "Введите сообщение коммита (Enter — стандартное 'Update site content')"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "Update site content" }

git add -A
git commit -m "$msg"

Write-Host "3/3 Отправляю на GitHub ..."
git push origin main

Write-Host ""
Write-Host "Готово. Vercel обновится автоматически (обычно 1-3 минуты)."
