# Déploiement sur le NAS (dev.kryssbee.com)

Ce projet se déploie sur le NAS Synology DS218, servi en **sous-dossier** de
`dev.kryssbee.com` — le certificat SSL existant de `dev.kryssbee.com` couvre
tous les sous-chemins, **aucun certificat à créer par projet**.

## URL après déploiement

```
https://dev.kryssbee.com/<PROJET>/
```

## Prérequis (une seule fois par projet)

1. Copier dans ce projet :
   - `scripts/deploy-nas.ps1` (script de déploiement réutilisable)
   - `scripts/nas-credentials.json` (IP + utilisateur + mot de passe NAS — **gitignoré**)

   Exemple (depuis le dossier de ce projet) :
   ```bash
   mkdir -p scripts
   cp /chemin/vers/optima-mind-v2/scripts/deploy-nas.ps1 scripts/
   # puis créer scripts/nas-credentials.json :
   # { "host": "192.168.0.118", "user": "kryss", "password": "TON_MOT_DE_PASSE" }
   ```

2. Vérifier que **Posh-SSH** est installé sur la machine qui déploie :
   ```powershell
   Install-Module -Name Posh-SSH -Scope CurrentUser -Force
   ```

## Déployer

### Projet Astro avec base path (assets absolus `/fr/`, `/_astro/...`)
```powershell
# depuis la racine du projet
powershell -ExecutionPolicy Bypass -File scripts/deploy-nas.ps1 `
  -Project "<PROJET>" `
  -BuildDir "dist/client" `
  -Base "/<PROJET>/" `
  -BuildCmd "npm run build" `
  -EnvVar "ASTRO_BASE=/<PROJET>/"
```

### Projet statique simple (assets relatifs, pas de base path)
```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-nas.ps1 `
  -Project "<PROJET>" `
  -BuildDir "dist" `
  -BuildCmd "npm run build"
```

### Sans rebuild (déployer un build déjà fait)
```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-nas.ps1 `
  -Project "<PROJET>" `
  -BuildDir "dist" `
  -SkipBuild
```

## Ce que fait le script

1. **Build** : exécute `-BuildCmd` (avec `-EnvVar` si fournie)
2. **Préfixe base** : réécrit les liens internes (`/fr/`, `/pl/`, favicons)
   vers `/<PROJET>/...` (nécessaire pour les projets Astro/multilingues)
3. **Upload** : archive `tar.gz` → SFTP → `/volume1/web/<PROJET>/`
4. **Extraction** : nettoie l'ancien dossier + décompresse (via sudo)

## Vérifier

```
https://dev.kryssbee.com/<PROJET>/
```

## Projets avec backend (Node/PHP/API)

Le sous-dossier statique ne suffit pas : il faut un **reverse proxy** vers un
port dédié sur le NAS (config Nginx DSM). Contacter l'admin NAS pour cette
configuration.

## Sécurité

- `scripts/nas-credentials.json` contient un mot de passe : **ne jamais le
  committer** (il est dans `.gitignore`).
- Penser à changer le mot de passe SSH après usage si le fichier a circulé.
