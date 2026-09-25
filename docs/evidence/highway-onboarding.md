# Highway onboarding: before and after

Verified on September 25, 2026 using React's server renderer and the existing
synthetic portal fixture. The before render loaded component source from main
commit `83ed4f4`; the after render loaded the changed working-tree components.
The sample carrier was `Example Carrier & Sons`, with a draft profile and
`awaiting_invitation` Highway status. No real account, credentials, email send,
database write, or signup was used.

| Rendered behavior | Before | After |
| --- | --- | --- |
| Setup, no configured Highway URL | One link to `chris@shipfivenines.com`; subject `Highway setup invitation` | Checklist and panel both link to `onboarding@shipfivenines.com`; an **Email onboarding** button is visible |
| Setup, configured `https://app.highway.com/setup` | Direct Highway link; no email action | Same onboarding email actions; zero direct Highway links |
| Blocked load board, Highway incomplete | Zero email links | One link to `onboarding@shipfivenines.com` |
| Email subject | Generic invitation request | `Highway setup request - Example Carrier & Sons` |
| Carrier already verified in Highway | Status badge and generic setup instructions | States that verification is complete; no instruction to complete it again |

The after render contains:

> To complete Highway setup, email onboarding@shipfivenines.com with your company
> name and DOT/MC number. Our onboarding team will send you the next steps.

The draft body prompts for carrier company, DOT number, optional MC number,
contact name, and phone. A focused helper check confirmed that a carrier name
containing query-like text and line breaks stays encoded within the subject/body;
the recipient remains exactly `onboarding@shipfivenines.com` and there are only
two query fields (`subject` and `body`). An empty company uses the subject
`Highway setup request`.

All render assertions passed, including the configured-link case and verified
carrier case. Email is temporarily the sole setup action. `HIGHWAY_SETUP_URL`
validation, API data, and component prop compatibility remain available for a
later workflow; the UI does not render that link.

Verification and approval rules were not changed. Opening the draft does not
send email, mark Highway verified, approve a carrier, or open load-board access.
These are local rendered-output checks, not live mailbox-delivery evidence.
