import { Link } from 'react-router-dom'
import { HOST_BOUNDARIES, STABLE_LIFECYCLE_HOSTS } from '../data/host-coverage'
import { CROSS_HOST_PR, SOURCE_REPO, SOURCE_VERSION } from '../data/project-status'
import { CATALOG_TOTAL } from '../data/catalog-counts'

const AUDIENCES: ReadonlyArray<{
  id: string
  title: string
  fit: string
  look: string
  next: { to: string; label: string }
}> = [
  {
    id: 'developers',
    title: 'Developers',
    fit: 'You want the workflow in the editor you already use, with commands and files you can read.',
    look: 'Install with the setup CLI, run one work item, and read the workspace demo so the gates look familiar before you start.',
    next: { to: '/docs/installation', label: 'Installation guide' },
  },
  {
    id: 'managers',
    title: 'Engineering managers',
    fit: 'You need effort to match the change, a stop for review, and a record of who decided.',
    look: 'Tracks choose the ceremony. Budgets cap spend. approval-wait holds until a person responds. After approval, the same workflow can continue to completed.',
    next: { to: '/guide', label: 'How the loop works' },
  },
  {
    id: 'security',
    title: 'Security and compliance',
    fit: 'You need to see what an assistant did, which evidence it cited, and where a person stayed in the loop.',
    look: 'State, audit log, and receipts are files. Unevaluated procedures are not replayed. There is no hosted runtime holding a copy of the work.',
    next: { to: '/docs/privacy', label: 'Privacy notes' },
  },
  {
    id: 'stakeholders',
    title: 'Non-technical stakeholders',
    fit: 'You need the idea without the state-machine vocabulary.',
    look: 'The assistant does the drafting. The project writes down the steps. A person still approves before the work counts as done. The workspace page is a picture of that, using sample data.',
    next: { to: '/workspace', label: 'See the demo' },
  },
  {
    id: 'business',
    title: 'Business evaluators',
    fit: 'You are deciding whether a team should try it. This page will not invent a payback period.',
    look: 'Adoption cost is local: the pack is MIT, you run it yourself, and you keep paying whichever model host you already use. There is no Agentic SWE subscription in this project.',
    next: { to: '/product', label: 'What it is and is not' },
  },
  {
    id: 'partners',
    title: 'Investors and ecosystem partners',
    fit: 'You want project health, not a traction slide.',
    look: 'This is an open-source repository with a documented pack version and a merged cross-host lifecycle change. It does not publish customers, revenue, or ROI because those figures are not claimed here.',
    next: { to: SOURCE_REPO, label: 'Source repository' },
  },
]

export function EvaluatePage() {
  return (
    <main id="main-content" className="page-main reveal visible evaluate-page">
      <p className="section-label">// evaluate</p>
      <h1>Is this project for you?</h1>
      <p className="evaluate-lede">
        Agentic SWE is an open-source local workflow. You install it beside a repository and run it in your own
        editor. There is no hosted runtime, no account on this site, and no usage graph. The notes below are
        project facts a reader can check. They are not a customer list or a return-on-investment claim.
      </p>

      <nav className="guide-toc" aria-label="Audiences">
        <strong>Start from your role</strong>
        <ul>
          {AUDIENCES.map((audience) => (
            <li key={audience.id}>
              <a href={`#${audience.id}`}>{audience.title}</a>
            </li>
          ))}
          <li>
            <a href="#evidence">Project evidence</a>
          </li>
          <li>
            <a href="#next">Next actions</a>
          </li>
        </ul>
      </nav>

      {AUDIENCES.map((audience) => (
        <section key={audience.id} id={audience.id} aria-labelledby={`${audience.id}-title`}>
          <h2 id={`${audience.id}-title`}>{audience.title}</h2>
          <p>{audience.fit}</p>
          <p>{audience.look}</p>
          {audience.next.to.startsWith('/') ? (
            <p>
              <Link to={audience.next.to}>{audience.next.label}</Link>
            </p>
          ) : (
            <p>
              <a href={audience.next.to} target="_blank" rel="noopener noreferrer">
                {audience.next.label}
              </a>
            </p>
          )}
        </section>
      ))}

      <h2 id="evidence">Project evidence</h2>
      <p>
        Confirm anything version-sensitive on the source repository before you depend on it. Maintainer
        material — the release checklist and distribution notes — is linked from the footer, separate from
        this evaluation.
      </p>
      <dl className="evaluate-evidence">
        <div>
          <dt>What it is</dt>
          <dd>A local workflow and runtime package: policy, phases, commands, engines, and host adapters.</dd>
        </div>
        <div>
          <dt>License</dt>
          <dd>MIT. Source and copyright: Suraj Gupta.</dd>
        </div>
        <div>
          <dt>Pack version</dt>
          <dd>
            {SOURCE_VERSION}. This is the package version in the source tree, not a measure of adoption.
          </dd>
        </div>
        <div>
          <dt>Specialist prompts</dt>
          <dd>{CATALOG_TOTAL} catalog agents, generated from the pack. A file count, not a user count.</dd>
        </div>
        <div>
          <dt>Work records</dt>
          <dd>
            Per-work files live in <code>.worklogs/</code>. Setup gitignores that directory by default. Pass{' '}
            <code>--no-gitignore</code> when you want those files committed.
          </dd>
        </div>
        <div>
          <dt>Approval</dt>
          <dd>
            <code>approval-wait</code> stops until a person approves, requests changes, or rejects. After approval,
            the governed workflow can continue to completed, including the merge step. The project does not approve
            itself.
          </dd>
        </div>
        <div>
          <dt>Native lifecycle hosts</dt>
          <dd>{STABLE_LIFECYCLE_HOSTS.join(', ')}.</dd>
        </div>
        <div>
          <dt>Not native</dt>
          <dd>{HOST_BOUNDARIES.filter((item) => item.id !== 'native').map((item) => item.body).join(' ')}</dd>
        </div>
        <div>
          <dt>Cross-host runtime</dt>
          <dd>
            <a href={CROSS_HOST_PR}>Pull request 71</a> is merged in version {SOURCE_VERSION}. It is the
            cross-host lifecycle change. A merged change is not an adoption metric.
          </dd>
        </div>
        <div>
          <dt>Not on this page</dt>
          <dd>No customer count, revenue, uptime SLO, or ROI. Those numbers are not published because they are not claimed.</dd>
        </div>
      </dl>

      <h2 id="next">Next actions</h2>
      <ul>
        <li>
          <Link to="/docs/installation">Install the pack</Link> if you are ready to try a repository.
        </li>
        <li>
          <Link to="/guide">Read how a run moves</Link> before you treat the homepage as the whole product.
        </li>
        <li>
          <Link to="/workspace">Open the workspace demo</Link> to see a sample gate without changing a repo.
        </li>
        <li>
          <Link to="/support">Use support</Link> when a host or a check fails.
        </li>
        <li>
          <a href={SOURCE_REPO} target="_blank" rel="noopener noreferrer">
            Read the source
          </a>{' '}
          for the behavior this page describes.
        </li>
      </ul>

      <div className="product-cta">
        <Link className="btn btn-primary" to="/docs/installation">
          Install
        </Link>
        <Link className="btn btn-ghost" to="/product">
          Product boundaries
        </Link>
      </div>
    </main>
  )
}
