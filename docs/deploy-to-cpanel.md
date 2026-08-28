# Deploying to cPanel

The site is a **static export** (`output: 'export'` in `next.config.ts`).
`next build` writes `out/` — plain HTML/CSS/JS plus `sendmail.php` and
`.htaccess`. No Node.js runs on the server; PHP handles form mail.

Two ways to ship files: automated (see [`ci-cd.md`](./ci-cd.md)) or manual (below).
Both need the one-time setup first.

## One-time setup

1. **Domain** `macanco.com` added in cPanel. Document root (**DOCROOT**):
   `public_html` if primary, `public_html/macanco.com` if an addon domain.
2. **PHP** 8.1+ selected for the domain (cPanel → MultiPHP Manager).
3. **Mailboxes** (cPanel → Email Accounts):
   - `contact@macanco.com` — where inquiries land
   - `website@macanco.com` — envelope sender for `sendmail.php` (mailbox or alias to `contact@`)
   - `dmarc@macanco.com` — alias, for DMARC reports
4. **DNS**: point the A record to the server IP; add **SPF / DKIM / DMARC** —
   see [`email-dns.md`](./email-dns.md).
5. **SSL**: wait for AutoSSL, then cPanel → Domains → **Force HTTPS Redirect**.
6. *(Optional)* create `sendmail.config.php` in DOCROOT from
   `public/sendmail.config.example.php` if you want to change mail addresses
   without a rebuild.

## Manual upload

```bash
npm run package        # -> macan-site.zip
```

1. cPanel → **File Manager** → DOCROOT. Delete any placeholder `index.html`.
2. Upload `macan-site.zip` → **Extract** here → delete the zip.
3. File Manager → Settings → **Show Hidden Files**. Confirm DOCROOT has, at top
   level: `index.html`, `404.html`, `.htaccess`, `sendmail.php`, `_next/`,
   `downloads/`, `robots.txt`, `sitemap.xml`.
4. Set `sendmail.php` permissions to **644**.

## Verify

- `https://macanco.com` loads; `http://` and `www.` redirect to it
- Tab shows the gold "M" icon; EN/AR/ZH switch works; Arabic is RTL
- Phone: the `☰` menu navigates
- Submit a form → success message → mail arrives at `contact@macanco.com`
  (check Spam the first few times)
- Industrial form: attach a PDF → arrives as an attachment
- `/robots.txt`, `/sitemap.xml`, `/downloads/macan-group-prospectus.html` load

If a form shows the red error line: PHP isn't executing — check the PHP version,
that `sendmail.php` is at DOCROOT top level, and its permissions.
