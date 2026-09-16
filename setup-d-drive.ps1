# SKAT — одноразовая настройка постоянной git-папки на D:
# Запускать один раз. После этого для деплоя используйте deploy-d.ps1.

$ErrorActionPreference = "Stop"

$src    = "C:\Users\Алексей Борисович\Downloads\skat"
$repo   = "https://github.com/deusexmashine/skat-website.git"
$target = "D:\skatwebsite2026"

if (Test-Path $target) {
    Write-Host "Папка $target уже существует."
    if ((Get-ChildItem $target -Force | Measure-Object).Count -gt 0) {
        Write-Host "Она не пустая — прерываю, чтобы ничего не перезаписать случайно."
        Write-Host "Если хотите начать заново, удалите или переименуйте $target и запустите скрипт снова."
        exit 1
    }
}

Write-Host "1/4 Клонирую $repo в $target ..."
git clone $repo $target
Set-Location $target

Write-Host "2/4 Копирую актуальные файлы сайта из $src ..."
robocopy $src $target /E `
  /XD "Claude outputs" "Новая папка" "обучение ИИ" "проект Листовки" "версии" "video" ".git" `
  /XF "*.docx" "~`$*" "Thumbs.db" "desktop.ini" "Новый текстовый документ.txt" "SKAT-project-handoff.md" `
  /NFL /NDL /NJH /NJS /NP
# robocopy возвращает код >0 при успешном копировании — это нормально, не ошибка.

Write-Host "3/4 Проверяю .gitignore ..."
if (-not (Test-Path (Join-Path $target ".gitignore"))) {
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
"@ | Out-File -Encoding utf8 (Join-Path $target ".gitignore")
}

Write-Host "4/4 Готово."
Write-Host ""
$status = git status --short
if ($status) {
    Write-Host "Есть изменения относительно текущей версии на GitHub:"
    git status --short
    Write-Host ""
    Write-Host "Чтобы задеплоить их сейчас — запустите deploy-d.ps1."
} else {
    Write-Host "Изменений нет — D:\skatwebsite2026 полностью совпадает с тем, что уже на GitHub (и на проде)."
}
Write-Host ""
Write-Host "Папка D:\skatwebsite2026 теперь постоянная git-копия сайта, связанная с GitHub."
Write-Host "Для будущих деплоев используйте deploy-d.ps1 — он подтянет свежие файлы из вашей рабочей папки skat и запушит."
