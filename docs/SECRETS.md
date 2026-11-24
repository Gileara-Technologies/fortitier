# Secrets policy — Fortitier site

## Rules

1. **No secrets in git.** API keys, private keys, and tokens never land in source, `wrangler.toml` `[vars]`, or committed `.env` files.
2. **Local only:** `.env.local` (gitignored). Start from `.env.example`.
3. **Cloudflare:** set production secrets with `npx wrangler secret put NAME`.
4. **Public config** (email address, phone, domain) lives in `src/content/site-config.ts` or non-secret `[vars]`.

## Contact form

| Name | Where | Purpose |
|------|--------|---------|
| `CONTACT_EMAIL` | env / CF var | Destination inbox (default `info@fortitier.com`) |
| `RESEND_API_KEY` | secret only | Optional email delivery via Resend |
| `RESEND_FROM` | env / CF var | Verified sender identity |

Without `RESEND_API_KEY`, submissions are validated and logged server-side only. Wire delivery before launch if email confirmation is required.

## Scanning

```bash
npm run secrets:scan
```

Run before push on public repos.
