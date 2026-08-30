# ============================================================
# deploy-nas.ps1 — Déploie n'importe quel projet statique sur le
# NAS Synology DS218, servi en sous-dossier de dev.kryssbee.com
#
# Usage (depuis n'importe quel workspace) :
#   powershell -File deploy-nas.ps1 -Project "mon-projet" `
#     -BuildDir "dist/client" [-Base "/mon-projet/"] `
#     [-BuildCmd "npm run build"] [-EnvVar "NAME=value"] `
#     [-SshKey "C:\chemin\vers\la\cle"] [-Password "mdp"]
#
# Le résultat est servi sur https://dev.kryssbee.com/<Project>/
# (le certificat SSL existant de dev.kryssbee.com couvre le domaine).
# ============================================================
param(
  [Parameter(Mandatory = $true)][string]$Project,      # nom du sous-dossier cible
  [Parameter(Mandatory = $true)][string]$BuildDir,     # dossier contenant le build (relatif au workspace)
  [string]$Base,                                       # base Astro (ex. "/mon-projet/") si assets absolus
  [string]$BuildCmd,                                   # commande de build (ex. "npm run build")
  [string]$EnvVar,                                     # variable d'env pour le build (ex. "ASTRO_BASE=/x/")
  [string]$SshKey,                                     # clé SSH (optionnel)
  [string]$Password,                                   # mot de passe (optionnel, sinon fichier credentials)
  [string]$Workspace = (Get-Location).Path,            # dossier racine du projet
  [switch]$SkipBuild                                   # ne pas rebuilder (déploie BuildDir tel quel)
)

$ErrorActionPreference = 'Stop'
$HOST_NAS = '192.168.0.118'

# ---------- Identifiants ----------
$credentialsFile = Join-Path $PSScriptRoot 'nas-credentials.json'
$NAS_USER = 'kryss'
if (-not $Password -and (Test-Path $credentialsFile)) {
  $cred = Get-Content $credentialsFile -Raw | ConvertFrom-Json
  $Password = $cred.password
  $HOST_NAS = $cred.host
  if ($cred.user) { $NAS_USER = $cred.user }
}
if (-not $Password) { throw "Mot de passe manquant : passez -Password ou créez scripts/nas-credentials.json" }

# ---------- Vérifications ----------
$buildPath = Join-Path $Workspace $BuildDir
if (-not $SkipBuild -and -not $BuildCmd) { throw "-BuildCmd requis (ou -SkipBuild)" }
if (-not (Test-Path $buildPath)) { throw "Dossier build introuvable : $buildPath" }

# ---------- Build (optionnel) ----------
if (-not $SkipBuild) {
  Write-Host "`n=== [1/4] Build du projet ($Project) ==="
  Push-Location $Workspace
  try {
    if ($EnvVar) { $envParts = $EnvVar -split '=', 2; Set-Item "env:$($envParts[0])" -Value $envParts[1] }
    Invoke-Expression $BuildCmd
    if ($LASTEXITCODE -ne 0) { throw "Build échoué" }
  } finally {
    if ($EnvVar) { $envParts = $EnvVar -split '=', 2; Remove-Item "env:$($envParts[0])" -ErrorAction SilentlyContinue }
    Pop-Location
  }
}

# ---------- Post-traitement base (projets Astro/statiques à liens absolus) ----------
if ($Base) {
  Write-Host "=== [2/4] Préfixe des liens internes ($Base) ==="
  $script = @'
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = process.argv[2], PREFIX = process.argv[3].replace(/\/$/, '');
const exts = ['.html', '.xml', '.txt', '.js', '.css'];
function walk(d){const o=[];for(const n of readdirSync(d)){const p=join(d,n);statSync(p).isDirectory()?o.push(...walk(p)):o.push(p);}return o;}
let count=0;
for(const f of walk(ROOT)){
  if(!exts.some(e=>f.endsWith(e)))continue;
  let t=readFileSync(f,'utf8'), b=t;
  t=t.replace(/(?<=["'(])\/(fr|pl)\//g, PREFIX+'/$1/');
  t=t.replace(/(?<=["'(])\/(favicon\.png|apple-touch-icon\.png)\b/g, PREFIX+'/$1');
  if(b!==t){writeFileSync(f,t);count++;}
}
console.log('Fichiers préfixés:', count);
'@
  $tmpJs = Join-Path $env:TEMP "nas-prefix-$Project.mjs"
  Set-Content -Path $tmpJs -Value $script -Encoding UTF8
  node $tmpJs $buildPath $Base
  Remove-Item $tmpJs -ErrorAction SilentlyContinue
}

# ---------- Archive ----------
Write-Host "=== [3/4] Archive + transfert SFTP ==="
$tmpTar = Join-Path $env:TEMP "nas-$Project.tar.gz"
if (Test-Path $tmpTar) { Remove-Item $tmpTar }
tar -czf $tmpTar -C $buildPath .

# ---------- Transfert + extraction via SSH ----------
Write-Host "=== [4/4] Déploiement sur le NAS ==="
$remoteBase = "/volume1/web/$Project"
$remoteTar = "$remoteBase/nas-$Project.tar.gz"

# Upload via SFTP
$pwSec = ConvertTo-SecureString $Password -AsPlainText -Force
$cred2 = New-Object System.Management.Automation.PSCredential($NAS_USER, $pwSec)
Import-Module Posh-SSH -ErrorAction SilentlyContinue
if (-not (Get-Module Posh-SSH)) {
  $cfile = Join-Path $PSScriptRoot 'nas-credentials.json'
  $c = Get-Content $cfile -Raw | ConvertFrom-Json
  $cred2 = New-Object System.Management.Automation.PSCredential($c.user, $pwSec)
}
$sftp = New-SFTPSession -ComputerName $HOST_NAS -Credential $cred2 -AcceptKey -Force -ErrorAction Stop
try {
  # dossier distant : créer si absent
  $probe = Get-SFTPChildItem -SessionId $sftp.SessionId -Path "/web" | Where-Object { $_.Name -eq $Project }
  if (-not $probe) {
    New-SFTPItem -SessionId $sftp.SessionId -Path "/web/$Project" -ItemType Directory | Out-Null
  }
  # supprimer l'archive existante si présente
  $old = Get-SFTPChildItem -SessionId $sftp.SessionId -Path "/web/$Project" -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq "nas-$Project.tar.gz" }
  if ($old) { Remove-SFTPItem -SessionId $sftp.SessionId -Path "/web/$Project/nas-$Project.tar.gz" }
  Set-SFTPItem -SessionId $sftp.SessionId -Path $tmpTar -Destination "/web/$Project/"
  Write-Host 'Archive transférée.'
} finally {
  Remove-SFTPSession -SessionId $sftp.SessionId | Out-Null
}

# Extraction + nettoyage via SSH (sudo)
$b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("#!/bin/sh`ncd $remoteBase`nfind . -maxdepth 1 ! -name '.' ! -name 'nas-$Project.tar.gz' -exec rm -rf {} +`ntar -xzf nas-$Project.tar.gz`nrm nas-$Project.tar.gz`necho OK"))
$sshCmd = "echo '$Password' | sudo -S sh -c 'echo $b64 | base64 -d > /tmp/deploy-$Project.sh && sh /tmp/deploy-$Project.sh' 2>&1"
Import-Module Posh-SSH -ErrorAction Stop
$session = New-SSHSession -ComputerName $HOST_NAS -Credential $cred2 -AcceptKey -Force -ErrorAction Stop
try {
  $r = Invoke-SSHCommand -SessionId $session.SessionId -Command $sshCmd -TimeOut 120
  Write-Host ($r.Output -join "`n")
} finally {
  Remove-SSHSession -SessionId $session.SessionId | Out-Null
}

Remove-Item $tmpTar -ErrorAction SilentlyContinue
Write-Host "`n✅ Déployé : https://dev.kryssbee.com/$Project/ ($(($r.Output -join '').Trim()) les fichiers)"
