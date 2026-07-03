# "I Need Customers" Webinar Landing Pages — Design

Date: 2026-07-03

## Goal

Add two new lead-capture landing pages for the "I Need Customers" webinar, each with its own form, its own thank-you page, and email delivery to `hello@edgidesignhub.com`. Visuals must match the existing Edgi Design Hub brand and the reference mockups, and must work on both mobile (the mockups' native format) and desktop.

## Source material

- `.vscode/Webinar Landing Page Details/01 Registration Application Form Content.docx` — Form 1 copy/fields
- `.vscode/Webinar Landing Page Details/04 QR Code Landing Page Copy.docx` — Form 2 copy/fields
- `.vscode/Webinar Landing Page Details/03 Registration Application Form Design JPG/*.jpg` — original mockups
- `.vscode/rewebinarlandingpagedetails/Registration-Application-Form-Design.jpg` — revised Form 1 mockup (adds QR code + social icons footer) — treated as the authoritative visual reference over the original, since it's newer and more complete
- `.vscode/rewebinarlandingpagedetails/{EDH Website QR Code.png, instagraam-icon_Red.png, linkedin_circle_Red-512.png}` — real image assets to use as-is (not recreated)

## Existing system this plugs into

- Site is static HTML/CSS/JS served by nginx (`root /var/www/html/edgi-studio`, `try_files $uri $uri/ =404`, `index index.html index.htm ...`). Clean URLs like `/en/career/` already work today as plain directories containing an `index.html`/`index.htm` — no nginx rewrite rules involved. New routes follow the same pattern.
- `/api/*` is proxied by nginx to `http://localhost:3000`, which is an Express app (`/var/www/html/node_service/server.js`) running under pm2 as `api-server` (not committed to this repo — lives only on the production server, reached via `ssh EDGILS`).
- The one currently-working form on the site (`index.html`'s "Let's Talk" form) POSTs form-urlencoded data to `https://edgidesignhub.com/api/send-email`, which validates fields and sends mail via a `nodemailer` Gmail transporter already configured with `hello@edgidesignhub.com` credentials, returning `{success: true}` / an error JSON. CORS on the Express app already allows `edgidesignhub.com` and subdomains, so new endpoints on the same app need no CORS changes.
- Brand red is `#e62d44` (from `themes/homesociete/dist/images/edgi_main.svg` / `sprite.svg`). Brand font is Gotham (`themes/homesociete/dist/fonts/`). Real social links already used site-wide: Instagram `https://www.instagram.com/edgidesignhub`, LinkedIn `https://www.linkedin.com/company/edgi-design-hub-edh/`.
- The homepage's scroll-jacking/animation JS framework (`o-scroll`, `js-animate`, the `Form`/`Header`/`Scroll` modules in `app.js`) is intentionally **not** reused for these two pages — it's built for the one-page SPA-style homepage and is unnecessary complexity/risk for two standalone conversion forms. These pages get their own minimal, isolated CSS/JS.

## Decisions already confirmed with the user

- Desktop layout: **split screen** — left panel (logo, headline/context copy, QR code, social icons) sticky, right panel holds the scrollable form. Mobile stacks single-column in the same order as the mockups.
- **No reCAPTCHA for now.** No secret key exists anywhere on the server (confirmed via SSH — no `.env`, no config), and the public site key already in the codebase is unverified for the `edgidesignhub.com` domain. Ship without it; leave a one-line comment in `server.js` marking where server-side token verification would go if a verified key pair is added later.
- Social icons (Instagram + LinkedIn) use the **provided red PNG assets** from `rewebinarlandingpagedetails/` (not the site's sprite icons), linking to the real profile URLs above, matching the mockup pixel-for-pixel. Shown on all four new pages (both forms and both thank-you pages) for consistent branding.
- The QR code image (`EDH Website QR Code.png`, links back to the main site) is shown on both form pages, in the same left-panel/footer position as the revised Form 1 mockup.

## Routes and files (all new, all in this repo)

| Route | File |
|---|---|
| `/i-need-customers-1` | `i-need-customers-1/index.html` |
| `/thank-you-1` | `thank-you-1/index.html` |
| `/i-need-customers-2` | `i-need-customers-2/index.html` |
| `/thank-you-2` | `thank-you-2/index.html` |

Shared new assets:
- `themes/homesociete/dist/styles/webinar.css` — all layout/visual styling for the 4 pages (split-screen desktop, stacked mobile, bordered inputs, radio/checkbox lists, dropdowns, buttons — matching the mockups' look using brand red/Gotham, without touching `main.css`)
- `themes/homesociete/dist/scripts/webinar-form.js` — small vanilla JS shared by both forms: submit via `fetch`, enforce each "select up to 2" checkbox cap, show/hide the "Other" free-text field when an "Other" option is chosen, redirect to the matching thank-you page on success, show an inline error message on failure (no `alert()`)
- `themes/homesociete/dist/images/webinar-qr.png`, `webinar-instagram.png`, `webinar-linkedin.png` — copies of the three reference PNGs above

## Form 1 — Registration Application Form (`/i-need-customers-1`)

Call-to-action copy: "Complete this short 3-minute application to request a seat for the live session on Wednesday, 15 July 2026 at 11:00 AM GST."

| # | Field | Type | Required |
|---|---|---|---|
| 1 | Full Name | short text | Yes |
| 2 | Business Name | short text | Yes |
| 3 | Email Address | email | Yes |
| 4 | Mobile / WhatsApp Number | tel | Yes |
| 5 | Your Role / Title | radio: Founder/Co-Founder/Owner; Managing Partner/CEO/C-Suite; Marketing Director/Growth Lead; Other | Yes |
| 6 | Company Website / Corporate LinkedIn URL | short text | No |
| 7 | Single biggest bottleneck holding back growth (select up to 2) | checkboxes: "We aren't getting enough qualified inbound leads." / "Prospects look at us but constantly compare us on price or ask for discounts." / "Our digital footprint doesn't look as premium or professional as our actual service." / "We depend entirely on referrals and have no predictable outbound/inbound pipeline." / "Our brand messaging sounds exactly like our direct competitors in Dubai." | Yes (at least 1, max 2) |
| 8 | Looking to upgrade brand assets/strategy in next 90 days if roadmap makes sense | radio: "Yes, if the roadmap makes sense." / "Maybe, depending on resources and alignment." / "No, I am strictly looking for educational insights right now." | Yes |

Note: field 4's required status is stated explicitly as "required" in the source docx even though it lacks an asterisk in the mockup image — the docx text is treated as authoritative and field 4 is required. Field 6 has no required/asterisk marking in either source and is optional.

Submit button: **"Apply For A Vetted Seat"**

### Thank-you page 1 (`/thank-you-1`)

> **Thank you for applying.**
>
> Your application for, "I Need Customers" has been received.
>
> Arun will personally review the responses and confirm the most relevant attendees.
>
> Because the session is capped at 20 verified founders / decision-makers, not every application may be accepted.
>
> If your seat is confirmed, you will receive a calendar invite and webinar link by email or WhatsApp.
>
> In the meantime, ask yourself one honest question:
> Is my current brand helping customers choose me faster?

## Form 2 — Brand Clarity Call Application (`/i-need-customers-2`)

Heading: "Complimentary Brand Clarity Call"
Subheading: "For selected founders, business owners, and decision-makers from the 'I Need Customers' session. Please complete the short form below. It should take 3–5 minutes. I will personally review the responses and confirm 5 slots where I feel I can add the most practical value."

All 20 fields below are **required**:

1. Full Name — short text
2. Business Name — short text
3. Email Address — email
4. Mobile / WhatsApp Number — tel
5. Website / LinkedIn / Instagram Link — short text. Helper text: "Please share the most relevant link where I can review your business presence."
6. Industry — dropdown: Technology/SaaS/AI; Fintech/Financial Services; Retail/E-commerce; Real Estate/Property; Healthcare/Clinic/Aesthetics; Education/EdTech; Tourism/Hospitality/Entertainment; F&B; Professional Services/Consulting; Creative/Media/Marketing; Other (reveals a short-text field if chosen)
7. How long has your business been operating? — radio: Not launched yet; Less than 1 year; 1–3 years; 3–5 years; 5+ years
8. Which stage best describes your business right now? — radio: Idea/pre-launch; Newly launched; Getting some clients; Growing but inconsistent; Established and looking to scale; Repositioning/premiumising
9. Are you the founder, owner, partner, or final decision-maker? — radio: Yes, I am the final decision-maker; I influence the decision; I need approval from someone else; No
10. What is your biggest current challenge? (choose up to 2) — checkboxes: We are not getting enough qualified leads; People compare us mainly on price; Our brand does not look as premium as our service/product; Our website or social media does not convert; We depend too much on referrals; Marketing spend is not giving enough return; Our message sounds similar to competitors; We are launching a new business/product; We are trying to reposition or attract a better customer segment; Other (reveals short-text)
11. Based on today's session, which problem do you think your business has most? — radio: Visibility problem — the right people don't know we exist; Trust problem — people find us but don't fully believe us; Positioning problem — people don't understand why they should choose us; Marketing execution problem — the strategy may be right, but campaigns/funnels are not converting; I'm not sure yet
12. What was your total score on the Brand Building Diagnostic? — dropdown: 24–30: Strong brand foundation; 15–23: Positioning or trust gap; 6–14: Significant visibility, trust, and positioning gaps; I did not complete the diagnostic
13. What are you currently using to get leads? (choose all that apply) — checkboxes: Referrals; Networking/business meet-ups; LinkedIn; Instagram; WhatsApp groups; Google Ads; Meta Ads; SEO/website; Email marketing; Partnerships; Influencers; Cold outreach; Other (reveals short-text)
14. Current monthly marketing/branding spend — radio: AED 0; AED 1–2,500; AED 2,500–5,000; AED 5,000–10,000; AED 10,000–25,000; AED 25,000+; Prefer not to say
15. Which statement best describes your current approach to growth? — radio: "I mainly want fast, low-cost marketing execution such as more posts, templates, or quick campaigns"; "I want to step back, fix our brand positioning, and build a more trusted business asset"; "I am not sure yet, but I know our current approach is not working"
16. How soon are you looking to improve your brand, website, content, or marketing? — radio: Immediately; In the next 30 days; In the next 90 days; In 3–6 months; Just exploring for now
17. What is the one thing you most want to fix in the next 90 days? — radio: More qualified leads; Better positioning; More premium perception; Better website conversion; Stronger social media content direction; Stronger proposal/sales deck; Better brand identity; Clearer founder profile/LinkedIn presence; Launch or repositioning support; Other (reveals short-text)
18. Why does this matter now? — paragraph/textarea. Helper text: "In 2–3 lines, tell me what is happening in the business that makes this important now."
19. If the Brand Clarity Call identifies a clear growth opportunity, are you open to investing in brand/marketing support in the next 90 days? — radio: Yes, if the value is clear; Maybe, depending on scope and cost; Not right now; I only want free advice at this stage
20. Consent to contact — single checkbox: "I agree that Arun / EDH may contact me by email or WhatsApp regarding my Brand Clarity Call application and related brand-growth resources."

Submit button: **"Apply for a Brand Clarity Call"**

### Thank-you page 2 (`/thank-you-2`)

> **Thank you for applying.**
>
> I have received your Brand Clarity Call application.
>
> I will personally review the responses and confirm 5 slots where I feel I can add the most practical value.
>
> If selected, you will receive a confirmation by email or WhatsApp.
>
> In the meantime, take one honest look at your business and ask:
> Is my brand helping customers choose me faster?

## Backend (production server only, not committed here)

Add two new routes to `/var/www/html/node_service/server.js`, alongside the existing `/api/send-email`:

- `POST /api/send-registration` — Form 1. Validates the 7 required fields above (name, business, email format, phone present, role selected, at least 1 and at most 2 bottleneck checkboxes, upgrade-intent selected); website field optional.
- `POST /api/send-brand-clarity` — Form 2. Validates all 20 fields present per the required list above (checkbox-group questions 10/13 require at least one selection; question 10 max 2).

Both:
- Reuse a single module-scoped `nodemailer` transporter (currently the code creates a new transporter per-request in `/api/send-email` — hoisting it to be created once and reused by all three routes is a small cleanup bundled into this change, not a behavior change).
- Send a plain-text email to `hello@edgidesignhub.com` listing every question and answer in order, human-readable labels, with a clear subject line identifying which form it came from and the applicant's name.
- Respond `{ success: true }` on success / `{ error: "..." }` with 400/500 status on failure, matching the existing endpoint's contract so the shared client JS can handle both forms identically.
- No CORS or nginx changes required.

Deployment process for the server-side change: back up `server.js` on the server before editing, apply the change, `pm2 reload api-server` (graceful, not a hard kill/restart), confirm `pm2` shows it online, then send one real test submission per new endpoint and confirm the email arrives before considering the work done.

## Out of scope

- reCAPTCHA (explicitly deferred, see above)
- Any changes to `main.css`, `app.js`, or existing pages/forms
- A French (`/fr/`) version of these two pages (site-wide `/fr/` is reserved but not implemented anywhere else either)
