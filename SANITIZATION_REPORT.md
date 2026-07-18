# SANITIZATION_REPORT.md

## Result

This copy is suitable as a starting point for a public Build Week repository, subject to a final secret scan before publication.

## Removed or changed

- Root `.env.example` removed.
- AI Studio server-side capability metadata removed because the baseline does not use it.
- Company and plant preset identities replaced with fictional demo identities.
- Private IP examples replaced with IANA documentation-only address ranges.

## Retained intentionally

- Chilean renewable-energy context.
- References to CEN as a public operational/regulatory concept.
- Synthetic technical values and demo-only register mappings.
- The clearly labeled presentation-only code `1234`; it is not authentication and Codex should review it before final submission.
- Existing dependencies and package lock, to preserve the verified baseline; Codex may audit unused packages in a separate approved change.

## Final-publication checks

- Secret scan.
- Trademark and branding review.
- Confirm all fixtures are synthetic.
- Confirm README accurately describes final Build Week work.
