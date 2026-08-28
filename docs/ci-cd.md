# CI / CD

## Pipelines

| Workflow | File | Trigger | Does |
|---|---|---|---|
| **CI** | `.github/workflows/ci.yml` | every PR + push to `main` | `npm ci` → lint → typecheck → `next build` (static export) → `php -l` on `sendmail.php` → uploads `out/` as a build artifact |
| **Deploy to cPanel** | `.github/workflows/deploy.yml` | push to `main`, or manual **Run workflow** | builds, then FTPS-mirrors `out/` into the cPanel document root (incremental; deletes files removed from the build) |

`dependabot.yml` opens weekly PRs for npm + Actions updates — CI gates them.

## Local equivalents

```bash
npm run check      # lint + typecheck + build (what CI runs)
npm run package    # build -> macan-site.zip for manual upload
npm run deploy      # build -> FTPS mirror to cPanel (needs scripts/deploy.env + lftp)
```

`npm run deploy` and the Deploy workflow do the same thing by the same method;
use whichever is convenient.

---

## One-time manual setup

### 1. FTP account (cPanel)
cPanel → **FTP Accounts** → create one scoped to the site's document root, e.g.
`deploy@macanco.com`. Note the host (`ftp.macanco.com` or the server hostname),
username (often the full `deploy@macanco.com`), password, and the directory
(`public_html` for a primary domain, `public_html/macanco.com` for an addon).

> Prefer FTPS (port 21 with TLS). If the host only offers SFTP, tell me and
> I'll switch the workflow to an SSH/rsync action instead.

### 2. GitHub repo settings
**Settings → Secrets and variables → Actions**

Secrets:
| Name | Value |
|---|---|
| `FTP_SERVER` | `ftp.macanco.com` (or server hostname) |
| `FTP_USERNAME` | `deploy@macanco.com` |
| `FTP_PASSWORD` | the FTP account password |

Variables:
| Name | Value |
|---|---|
| `FTP_SERVER_DIR` | `public_html/` (must end with `/`) — or `public_html/macanco.com/` |

(Non-standard FTP port? Add `port:` under `with:` in `deploy.yml`.)

*(Optional)* To make each deploy wait for your approval: **Settings →
Environments → New environment** `production`, add yourself as a required
reviewer, then uncomment `environment: production` in `deploy.yml`.

### 3. Local deploy (optional)
```bash
brew install lftp
cp scripts/deploy.env.example scripts/deploy.env   # then edit
npm run deploy
```

### 4. Branch protection (optional but recommended)
**Settings → Branches → add rule** for `main`: require the **CI / verify**
check to pass before merging.

---

## Notes

- **First deploy** still needs the one-time cPanel work in
  [`deploy-to-cpanel`](./deploy-to-cpanel.md) / the chat guide: domain added,
  SSL, `Force HTTPS`, mailboxes, and the SPF/DKIM/DMARC records
  (`docs/email-dns.md`). CI only handles files.
- The deploy **preserves** a server-only `sendmail.config.php` (see
  `public/sendmail.config.example.php`) so you can change mail addresses on the
  server without a rebuild.
- Stale hashed `_next/…` chunks from older builds are deleted automatically by
  the incremental sync.
- Forms need PHP, so they only work on cPanel — not in `next dev` or the CI
  artifact preview (they fall back to the `mailto:` link there).
