# Repair Tracking Portal

Customer-facing repair status portal MVP for RMA tracking, warranty checks, UPS logistics status, SLA timing, BOM-based repair pricing, customer questions, and mobile-friendly repair logs.

## Run locally

```bash
npm run dev
```

Then open:

```text
http://localhost:4173
```

## What is included

- Sales order / serial number / RMA / UPS lookup
- Customer, Engineer, and Admin role views
- Warranty status with admin-editable expiration
- UPS status sync mock and receipt-triggered SLA timer
- 5-working-day repair SLA plus separate 3-day testing phase
- BOM CSV upload with end-customer and dealer pricing
- Engineer daily repair logs with mobile photo upload
- Customer question and suggestion thread
- Audit log for admin changes

## Demo lookup values

- `SO-2026-1048`
- `DR-CR20A-1129`
- `RMA-1001`
- `1Z999AA10123456784`

## GitHub setup

This project is ready for Git. If GitHub CLI is available and authenticated:

```bash
gh repo create repair-tracking-portal --private --source=. --remote=origin --push
```

If you already created a GitHub repository, connect it manually:

```bash
git remote add origin https://github.com/YOUR_ORG_OR_USER/repair-tracking-portal.git
git push -u origin main
```
