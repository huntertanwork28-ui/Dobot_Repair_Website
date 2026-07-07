# Repair Tracking Portal Requirements

## MVP scope

The first version is a customer-facing repair tracking portal for service cases, warranty validation, logistics visibility, repair logs, parts pricing, and SLA tracking.

## Roles

- Customer: read case information, warranty, logistics, repair status, parts quote, and final result. Can submit questions or suggestions.
- Engineer: update repair status, upload daily text/photo logs, select used parts, and choose end-customer or dealer pricing.
- Admin: all engineer permissions plus warranty edits, SLA settings, and audit review.

## Core data objects

- RMA / service ticket
- Sales order
- Product serial number
- Customer account
- Warranty period
- UPS tracking number
- Repair SLA timer
- Testing timer
- Repair log
- Customer message
- Parts catalog and selected parts
- Audit log

## SLA rules

- The repair SLA starts when UPS tracking reports Delivered or when the admin manually confirms receipt.
- Diagnosis and repair must complete within 5 working days by default.
- A 3-day testing phase is displayed as Testing but excluded from repair SLA days.
- Admin can configure repair SLA days and testing days per case.

## Parts pricing

The BOM upload should support:

- `partNumber`
- `description`
- `endCustomerPrice`
- `dealerPrice`

Engineer selects whether the repair is for an end customer or dealer. The UI shows the matching price and keeps internal pricing separated by role in later backend versions.

## Recommended next features

- Real login and RBAC with server-side authorization
- UPS Tracking API integration
- Sales order import from ERP/CRM
- PDF repair report export
- Email notifications
- Holiday calendar for working-day SLA calculation
- Customer quote approval workflow
- Serial-number repair history
- Attachment visibility controls
