import { useState, useEffect } from 'react'
import {
  Target,
  Lock,
  Cpu,
  Shield,
  Database,
  Code,
  Layers,
  Activity,
  FileText,
  ShieldCheck,
  Server,
  Users
} from 'lucide-react'
import detrustMark from './assets/detrust-mark.svg'

const slides = [
  // SLIDE 1: Title
  () => (
    <div className="slide slide-title">
      <img src={detrustMark} alt="DeTrust Logo" className="logo-img" />
      <h1 className="project-name"><span className="de">De</span><span className="trust">Trust</span></h1>
      <p className="project-subtitle">Decentralized Trust & Capability Scoring System for Freelancers</p>
      <div className="team-card">
        <div className="team-section">
          <h4>GROUP MEMBERS</h4>
          <p>Haseeb Ahmad Khalil</p>
          <span className="id">CIIT/FA22-BCS-027/ISB</span>
          <br /><br />
          <p>Noor-Ul-Huda</p>
          <span className="id">CIIT/FA22-BCS-081/ISB</span>
        </div>
        <div className="team-section">
          <h4>SUPERVISION</h4>
          <p>Dr. Tehsin Kanwal</p>
          <span className="dept">Department of Computer Science<br />COMSATS University, Islamabad<br />Spring 2026</span>
        </div>
      </div>
    </div>
  ),

  // SLIDE 2: System Introduction
  () => (
    <div className="slide">
      <div className="slide-header">
        <h1>System Introduction</h1>
        <div className="underline" />
      </div>
      <div className="intro-layout">
        <div className="intro-left">
          <div className="purpose-box">
            <div className="purpose-header">
              <div className="purpose-icon"><Target size={20} /></div>
              <h3>Purpose</h3>
            </div>
            <p>
              DeTrust is a <strong>decentralized web application</strong> designed to solve
              the "cold-start" problem for new freelancers and eliminate
              payment insecurity. It uses <strong>Blockchain</strong> for secure escrow and <strong>AI</strong>{' '}
              for instant capability scoring.
            </p>
          </div>
          <div className="problems-section">
            <h4><span className="hyphen">—</span> Core Problems Solved</h4>
            <div className="problem-item">
              <span className="problem-x">✕</span> High Commission Fees (Upwork/Fiverr)
            </div>
            <div className="problem-item">
              <span className="problem-x">✕</span> Payment Delays & Insecurity
            </div>
            <div className="problem-item">
              <span className="problem-x">✕</span> Biased Algorithms against Newcomers
            </div>
          </div>
        </div>
        <div className="intro-right">
          <h3>Key Features</h3>
          <div className="feature-column">
            <div className="feature-card f-green">
              <div className="feature-icon"><Lock size={20} strokeWidth={2.5} /></div>
              <div>
                <h4>Smart Contract Escrow</h4>
                <p>Automated payment release (1-3% fee)</p>
              </div>
            </div>
            <div className="feature-card f-purple">
              <div className="feature-icon"><Cpu size={20} strokeWidth={2.5} /></div>
              <div>
                <h4>AI Capability Prediction</h4>
                <p>Solves cold-start by analyzing skills/portfolio</p>
              </div>
            </div>
            <div className="feature-card f-blue">
              <div className="feature-icon"><Shield size={20} strokeWidth={2.5} /></div>
              <div>
                <h4>Decentralized Arbitration</h4>
                <p>Community jurors vote on disputes</p>
              </div>
            </div>
            <div className="feature-card f-orange">
              <div className="feature-icon"><Database size={20} strokeWidth={2.5} /></div>
              <div>
                <h4>Immutable Reputation</h4>
                <p>Transparent trust scores on-chain</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),

  // SLIDE 3: System Modules
  () => (
    <div className="slide">
      <div className="slide-header">
        <h1>System Modules</h1>
        <div className="underline" />
      </div>
      <div className="module-grid">
        <div className="module-card">
          <div className="module-icon"><Code size={20} strokeWidth={2.5} /></div>
          <h4>Web App</h4>
          <p>Wallet login (MetaMask), Profiles, Dashboards for Clients & Freelancers.</p>
        </div>
        <div className="module-card">
          <div className="module-icon"><Layers size={20} strokeWidth={2.5} /></div>
          <h4>Job Board</h4>
          <p>Smart Contract integration for posting jobs and locking funds in escrow.</p>
        </div>
        <div className="module-card">
          <div className="module-icon"><Activity size={20} strokeWidth={2.5} /></div>
          <h4>Trust Scoring</h4>
          <p>Rule-based formula utilizing performance data.</p>
        </div>
        <div className="module-card">
          <div className="module-icon"><FileText size={20} strokeWidth={2.5} /></div>
          <h4>Reviews</h4>
          <p>Double-sided feedback stored immutably on IPFS/Blockchain.</p>
        </div>
        <div className="module-card">
          <div className="module-icon"><ShieldCheck size={20} strokeWidth={2.5} /></div>
          <h4>Dispute Resolution</h4>
          <p>Evidence upload to IPFS, Juror selection, Voting smart contract.</p>
        </div>
        <div className="module-card">
          <div className="module-icon"><Cpu size={20} strokeWidth={2.5} /></div>
          <h4>AI Capability</h4>
          <p>ML model (Python) to predict skill level (Beginner/Expert) from profile data.</p>
        </div>
        <div className="module-card">
          <div className="module-icon"><Server size={20} strokeWidth={2.5} /></div>
          <h4>Admin Dashboard</h4>
          <p>Platform analytics, Contract parameters, dispute monitoring.</p>
        </div>
        <div className="module-card">
          <div className="module-icon"><Users size={20} strokeWidth={2.5} /></div>
          <h4>Notifications</h4>
          <p>Real-time alerts (WebSockets) & Email integration for critical events.</p>
        </div>
      </div>
    </div>
  ),

  // SLIDE 4: Modules & Features Detail
  () => (
    <div className="slide">
      <div className="slide-header">
        <h1>Modules & Key Features Detail</h1>
        <div className="underline" />
      </div>
      <div className="content-grid">
        <div className="content-card">
          <h3>Web App & Job Board</h3>
          <ul>
            <li>Wallet auth via MetaMask </li>
            <li>Role-based dashboards (Client / Freelancer/Admin)</li>
            <li>Job posting with budget & milestone creation</li>
            <li>Proposal submission </li>
          </ul>
        </div>
        <div className="content-card">
          <h3>Smart Contract Escrow</h3>
          <ul>
            <li>Milestone-based payment locking</li>
            <li>Auto-approve after 7-day timeout</li>
            <li>3% platform fee only on completion</li>
            <li>On-chain fund distribution for disputes</li>
          </ul>
        </div>
        <div className="content-card">
          <h3>Trust Score & Reviews</h3>
          <ul>
            <li>4-category star ratings with double-blind window</li>
            <li>Weighted trust formula (Rating, Completion, Disputes)</li>
            <li>Realtime Trust Score and Historic Trends</li>
            <li>IPFS content hashing, blockchain verification</li>
          </ul>
        </div>
        <div className="content-card">
          <h3>Disputes & Admin</h3>
          <ul>
            <li>Evidence upload to IPFS (5 files × 25MB)</li>
            <li>Trust-weighted juror voting (score ≥ 50)</li>
            <li>Admin KPI dashboard with growth charts</li>
            <li>Flagged account detection, user management</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // SLIDE 5: Feedback & Improvements
  () => (
    <div className="slide">
      <div className="slide-header">
        <h1>Changes & Improvements from 30% Feedback</h1>
        <div className="underline" />
      </div>
      <div className="feedback-card">
        <h3>Feedback Received at 30% Evaluation</h3>
        <ul>
          <li>Class diagram needed corrections — relationships and missing entities</li>
          <li>State diagram needed corrections — transitions and state naming</li>
        </ul>
      </div>
      <div className="improvement-card">
        <h3>Improvements Made</h3>
        <ul>
          <li>Class diagram updated — corrected all relationships, added new entities (Review, Dispute, TrustScoreHistory, Message, Notification)</li>
          <li>State diagram updated — fixed all transitions, added dispute and review lifecycle states</li>
          <li>Database schema expanded with 9 new migration tables at 60% milestone</li>

        </ul>
      </div>
    </div>
  ),

  // SLIDE 6: Individual Work - Noor ul Huda
  () => (
    <div className="slide">
      <div className="slide-header">
        <h1>Implemented Modules — Individual Work</h1>
        <div className="underline" />
      </div>
      <div className="member-header">
        <div className="member-avatar">NH</div>
        <div>
          <h2>Noor-Ul-Huda</h2>
          <p>CIIT/FA22-BCS-081/ISB</p>
        </div>
      </div>
      <div className="work-items">
        <div className="work-item">
          <h4>Module 1: Web Application</h4>
          <p>Wallet authentication using SIWE, role-based routing, client & freelancer dashboards, profile management with completeness scoring</p>
        </div>
        <div className="work-item">
          <h4>Module 2: Job Board</h4>
          <p>Job posting & browsing, search filters (category, budget, skills), proposal submission with cover letters</p>
        </div>
        <div className="work-item">
          <h4>Module 3: Trust & Reputation</h4>
          <p>Trust score computation engine with weighted formula, 5-contract eligibility gate, inactivity decay, score history tracking</p>
        </div>
      </div>
    </div>
  ),

  // SLIDE 7: Individual Work - Haseeb
  () => (
    <div className="slide">
      <div className="slide-header">
        <h1>Implemented Modules — Individual Work</h1>
        <div className="underline" />
      </div>
      <div className="member-header">
        <div className="member-avatar">HA</div>
        <div>
          <h2>Haseeb Ahmad Khalil</h2>
          <p>CIIT/FA22-BCS-027/ISB</p>
        </div>
      </div>
      <div className="work-items">
        <div className="work-item">
          <h4>Module 4: Review System</h4>
          <p>4-category ratings, 14-day double-blind reviews, IPFS upload, blockchain-verified badge, one-time rebuttal</p>
        </div>
        <div className="work-item">
          <h4>Module 5: Dispute Resolution</h4>
          <p>Full lifecycle (Open → Voting → Resolved), evidence upload, trust-weighted juror voting, on-chain settlement</p>
        </div>
        <div className="work-item">
          <h4>Module 7: Admin Dashboard</h4>
          <p>8 KPI cards, growth & revenue charts, user management, flagged account detection, review oversight</p>
        </div>
        <div className="work-item">
          <h4>Module 8: Notifications & Messaging</h4>
          <p>Socket.IO real-time messaging, email notifications (Nodemailer), read receipts, conversation threads</p>
        </div>
      </div>
    </div>
  ),

  // SLIDE 8: Implementation Status (~92%)
  () => (
    <div className="slide">
      <div className="slide-header">
        <h1>Implementation Status</h1>
        <div className="underline" />
      </div>
      <div className="progress-section">
        <div className="progress-header">
          <h3>Overall Progress (Active Modules)</h3>
          <span className="progress-pct">~85%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '85%' }} />
        </div>
      </div>
      <div className="content-grid">
        <div className="content-card">
          <h3>Module Status</h3>
          <ul>
            <li><span className="status-done">✓</span> M1: Web Application</li>
            <li><span className="status-done">✓</span> M2: Job Board & Escrow</li>
            <li><span className="status-done">✓</span> M3: Review & Feedback</li>
            <li><span className="status-done">✓</span> M4: Trust Scoring</li>
            <li><span className="status-done">✓</span> M5: Dispute Resolution</li>
            <li><span className="status-done">✓</span> M7: Admin Dashboard</li>
            <li><span className="status-done">✓</span> M8: Notifications</li>
            <li><span className="status-pending">◎</span> M6: AI Capability — Remaining at 100%</li>
          </ul>
        </div>
        <div className="content-card">
          <h3>Tech Stack Used</h3>
          <div className="tags">
            <span className="tag">Next.js 16</span>
            <span className="tag">Ethers.js</span>
            <span className="tag">Solidity</span>
            <span className="tag">Hardhat</span>
            <span className="tag">Prisma ORM</span>
            <span className="tag">Socket.IO</span>
            <span className="tag">IPFS (Pinata)</span>
            <span className="tag">PostgreSQL</span>
            <span className="tag">Nodemailer</span>
          </div>
        </div>
      </div>
    </div>
  ),

  // SLIDE 9: Testing Techniques
  () => (
    <div className="slide">
      <div className="slide-header">
        <h1>Testing Techniques Used</h1>
        <div className="underline" />
      </div>
      <div className="test-grid">
        <div className="test-card">
          <h3>Unit Testing (Hardhat)</h3>
          <p>Individual smart contract functions tested in isolation: <code>recordFeedback()</code>, <code>castVote()</code>, <code>resolveDispute()</code>, trust score computation, milestone release logic</p>
          <div className="test-stat">81 Smart Contract Tests Passing ✓</div>
          <span className="justify-label">Why Unit Testing?</span>
          <span className="justify-text">Smart contracts are immutable once deployed — bugs cannot be patched. Unit tests catch logic errors before deployment.</span>
        </div>
        <div className="test-card">
          <h3>Integration Testing</h3>
          <p>End-to-end pipelines tested: Review → IPFS Upload → Blockchain Recording → Trust Score Recalculation. On-chain dispute settlement with fund distribution across 3 outcomes (client/freelancer/split)</p>
          <div className="test-stat">Full Pipeline Coverage ✓</div>
          <span className="justify-label">Why Integration Testing?</span>
          <span className="justify-text">Our system connects blockchain, IPFS, and PostgreSQL — ensuring data consistency across these layers is critical for trust.</span>
        </div>
        <div className="test-card">
          <h3>Key Test Cases & Results</h3>
          <p>• <strong>Review double-blind:</strong> Verified reviews remain hidden until both submit or window expires<br />
            • <strong>Dispute lifecycle:</strong> Open → Voting → Resolved with correct fund distribution<br />
            • <strong>Juror eligibility:</strong> Only users with trust ≥ 50 can vote<br />
            • <strong>Escrow auto-approve:</strong> Milestones auto-release after 7 days</p>
        </div>
        <div className="test-card">
          <h3>Functional & Business Rules Testing</h3>
          <p>Business constraints validated: 5-contract gate before juror eligibility, inactivity decay after 90 days, one-time rebuttal, payment amounts match milestone values</p>
          <div className="test-stat">All Business Rules Validated ✓</div>
          <span className="justify-label">Why Business Rules Testing?</span>
          <span className="justify-text">Financial transactions and reputation scores require strict rule enforcement — violations could cause monetary manipulation.</span>
        </div>
      </div>
    </div>
  ),

  // SLIDE 10: Next Steps & Remaining Work
  () => (
    <div className="slide">
      <div className="slide-header">
        <h1>Remaining Work & Future Work</h1>
        <div className="underline" />
      </div>
      <div className="next-items">
        <div className="next-item">
          <h3>🤖 Module 6: AI Capability Prediction</h3>
          <p>Implement ML model to analyze freelancer GitHub profiles and predict job success probability using Python FastAPI service</p>
          <span className="tag-remaining">Remaining — 100% Milestone</span>
        </div>
        <div className="next-item">
          <h3>📱 Mobile Application</h3>
          <p>React Native mobile app for job management and messaging on the go with push notifications</p>
          <span className="tag-small">Future Work</span>
        </div>
        <div className="next-item">
          <h3>📊 Advanced Analytics</h3>
          <p>Spending trends, freelancer performance metrics, and market rate analysis dashboards for clients</p>
          <span className="tag-small">Future Work</span>
        </div>
      </div>
    </div>
  ),

  // SLIDE 11: Q&A
  () => (
    <div className="slide slide-qa">
      <div className="qa-pill">
        <span>?</span>
      </div>
      <h1>Q & A</h1>
      <p>Thank you for your attention. We are now open for any questions regarding the design, architecture, or implementation of DeTrust.</p>
      <div className="qa-footer">
        DeTrust FYP Presentation • Spring 2026
      </div>
    </div>
  ),
]

export default function App() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setCurrent((p) => Math.min(p + 1, slides.length - 1))
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrent((p) => Math.max(p - 1, 0))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const SlideComponent = slides[current]
  const currentNum = current + 1

  return (
    <div className="presentation">
      <div className="accent-bar" />
      <div className="slide-wrapper">
        <SlideComponent />
      </div>
      <div className="nav-bar">
        <span className="slide-counter">Slide {currentNum} / {slides.length}</span>
        <div className="nav-buttons">
          <button
            className="nav-btn prev"
            onClick={() => setCurrent((p) => Math.max(p - 1, 0))}
            disabled={current === 0}
          >
            ‹
          </button>
          <button
            className="nav-btn next"
            onClick={() => setCurrent((p) => Math.min(p + 1, slides.length - 1))}
            disabled={current === slides.length - 1}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
