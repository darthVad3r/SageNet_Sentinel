# Contributing

## Local Authentication Setup

The Angular app in [ai-automation-landing](ai-automation-landing) uses Supabase as its authentication provider.

1. Copy [ai-automation-landing/.env.local.example](ai-automation-landing/.env.local.example) to `ai-automation-landing/.env.local`.
2. Set these values from your Supabase project:
   - `LAB_AUTH_ENABLED=true`
   - `LAB_SUPABASE_URL`
   - `LAB_SUPABASE_ANON_KEY`
3. Create at least one email/password user in Supabase Authentication.
4. Run dependencies and start the app:

```bash
cd ai-automation-landing
npm install
npm start
```

## Runtime Auth Config

Before start, build, test, and typecheck, the project runs `npm run auth:config`.

That script reads `ai-automation-landing/.env.local` and generates:

- `src/assets/runtime/auth-config.js`

The Angular entry page loads that file before bootstrapping the app, which makes the provider config available on `window.__LAB_AUTH_CONFIG__`.

## Verification

After signing in, open `/auth-test` to confirm:

- the provider initialized successfully
- the authenticated session is available globally
- user email, display name, and avatar metadata are present

## Security Notes

- Do not commit `.env.local`.
- The Supabase anon key is safe for browser use, but service role keys must never be exposed to the client.
- Protect backend endpoints by validating the bearer token sent by the Angular app.
