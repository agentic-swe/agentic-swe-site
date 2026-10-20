import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { SOURCE_REPO } from '../data/project-status'

/** Formspree-compatible endpoint: accepts a POSTed form and answers JSON when asked. */
const FORM_ACTION = String(import.meta.env.VITE_WAITLIST_FORM_ACTION ?? '').trim()
/** Fallback when no endpoint is configured: open the visitor's mail client instead. */
const WAITLIST_EMAIL = String(import.meta.env.VITE_WAITLIST_EMAIL ?? '').trim()

type Tier = 'team' | 'enterprise'

const TIERS: { id: Tier; name: string; summary: string; items: string[] }[] = [
  {
    id: 'team',
    name: 'Team',
    summary: 'For a group that reviews governed AI work across several repositories.',
    items: [
      'One view of work items, approval gates, and hook receipts across repositories',
      'Exportable audit trail per work item: who approved what, against which evidence',
      'Policy drift reports when a repository falls behind the shared policy',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    summary: 'For organisations that must show an auditor how AI-assisted changes were controlled.',
    items: [
      'SSO and role-based access to audit views',
      'Retention controls and signed audit exports for compliance review',
      'Self-hosted deployment and support terms',
    ],
  },
]

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function WaitlistPage() {
  const emailId = useId()
  const tierId = useId()
  const companyId = useId()
  const [status, setStatus] = useState<Status>('idle')

  const enabled = Boolean(FORM_ACTION || WAITLIST_EMAIL)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    if (!FORM_ACTION) {
      const tier = String(data.get('tier') ?? '')
      const company = String(data.get('company') ?? '')
      const body = `Email: ${String(data.get('email') ?? '')}\nTier: ${tier}\nCompany: ${company}`
      window.location.href = `mailto:${WAITLIST_EMAIL}?subject=${encodeURIComponent(
        `Agentic SWE ${tier} waitlist`,
      )}&body=${encodeURIComponent(body)}`
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(FORM_ACTION, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      setStatus(response.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main id="main-content" className="page-main reveal visible waitlist-page">
      <p className="section-label">// waitlist</p>
      <h1>Team and Enterprise waitlist</h1>
      <p className="waitlist-lede">
        Agentic SWE is open core. The workflow pack stays MIT licensed and runs on your machine. We are scoping
        optional paid tiers for teams that need to audit governed AI work across many repositories and people.
        Nothing below is available yet, and there is no pricing.
      </p>

      <div className="product-outcomes">
        {TIERS.map((tier) => (
          <section key={tier.id} className="product-outcome" aria-labelledby={`waitlist-tier-${tier.id}`}>
            <h2 id={`waitlist-tier-${tier.id}`} className="product-outcome__title">
              {tier.name} <span className="waitlist-tag">under consideration</span>
            </h2>
            <p className="product-outcome__body">{tier.summary}</p>
            <ul className="waitlist-features">
              {tier.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <h2>What does not change</h2>
      <p>
        The local state machine, human approval gates, durable memory, and every documented command stay in the free
        pack. No paid tier is required to use anything in the <Link to="/documentation">documentation</Link>. See{' '}
        <Link to="/docs/licensing">licensing</Link> for the current terms.
      </p>

      <h2>Join the waitlist</h2>
      {!enabled ? (
        <p className="waitlist-notice">
          Sign-up is not open on this build yet. To hear when it is, watch releases on{' '}
          <a href={SOURCE_REPO} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      ) : status === 'sent' ? (
        <p className="waitlist-notice" role="status">
          Thanks. You are on the list, and we will email you when there is something to try.
        </p>
      ) : (
        <form className="waitlist-form" onSubmit={(event) => void submit(event)}>
          <div className="waitlist-form__field">
            <label htmlFor={emailId}>Work email</label>
            <input
              id={emailId}
              className="doc-hub-search__input"
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="waitlist-form__field">
            <label htmlFor={tierId}>Tier</label>
            <select id={tierId} className="doc-hub-search__input" name="tier" defaultValue="Team">
              <option value="Team">Team</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
          <div className="waitlist-form__field">
            <label htmlFor={companyId}>Company (optional)</label>
            <input
              id={companyId}
              className="doc-hub-search__input"
              type="text"
              name="company"
              autoComplete="organization"
            />
          </div>
          <input type="text" name="_gotcha" className="waitlist-form__trap" tabIndex={-1} autoComplete="off" aria-hidden />
          <div className="waitlist-form__actions">
            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Joining…' : 'Join the waitlist'}
            </button>
          </div>
          {status === 'error' ? (
            <p className="waitlist-notice" role="alert">
              That did not go through. Please try again in a moment.
            </p>
          ) : null}
          <p className="waitlist-fineprint">
            Joining is not a purchase or a commitment. We use what you submit only to contact you about these tiers.
          </p>
        </form>
      )}
    </main>
  )
}
