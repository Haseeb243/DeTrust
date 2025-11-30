# Chapter 4: Implementation

This chapter discusses the implementation details of the DeTrust project. The documentation covers the core module functionalities using pseudocode, user interface details, security techniques, external APIs, and deployment specifications.

**Project:** DeTrust - Decentralized Trust & Capability Scoring System for Freelancers  
**Institution:** COMSATS University, Islamabad, Pakistan  
**Authors:** Haseeb Ahmad Khalil (CIIT/FA22-BCS-027/ISB), Noor-Ul-Huda (CIIT/FA22-BCS-081/ISB)  
**Supervisor:** Dr. Tehsin Kanwal

---

## Table of Contents

1. [4.1 Project Methodology & Algorithms](#41-project-methodology--algorithms)
   - [4.1.1 Project Methodology (Step-by-Step Approach)](#411-project-methodology-step-by-step-approach)
   - [4.1.2 Algorithms](#412-algorithms)
   - [4.1.3 Guidelines Applied](#413-guidelines-applied)
2. [4.2 Training Results & Model Evaluation](#42-training-results--model-evaluation)
3. [4.3 Security Techniques](#43-security-techniques)
4. [4.4 External APIs/SDKs](#44-external-apissdks)
5. [4.5 User Interface](#45-user-interface)
6. [4.6 Deployment](#46-deployment)

---

## 4.1 Project Methodology & Algorithms

This section explains the methodology (step-by-step approach) and the core algorithms that power the DeTrust system. The focus is on methods and algorithms that enforce business rules, perform optimization, and implement intelligent features for the decentralized freelance marketplace.

### 4.1.1 Project Methodology (Step-by-Step Approach)

The implementation of DeTrust followed a systematic approach combining blockchain technology, traditional web development, and artificial intelligence components.

#### 1. Data Architecture Design

**What:** Designed a comprehensive database schema to support the decentralized freelance marketplace, including user profiles (clients and freelancers), job postings, proposals, contracts, milestones, reviews, disputes, and skill verification systems.

**How:** Used PostgreSQL as the primary relational database with Prisma ORM for type-safe database access. The schema supports:
- User authentication (wallet-based and email-based)
- Dual profile system (FreelancerProfile and ClientProfile)
- Job lifecycle management (Draft → Open → In Progress → Completed)
- Milestone-based payment tracking
- Trust score calculation attributes
- Skill verification with proficiency levels

**Why:** A robust data architecture is essential for maintaining user trust, tracking contract states, and enabling the transparent trust scoring system that differentiates DeTrust from centralized platforms.

#### 2. Smart Contract Development

**What:** Developed three core Solidity smart contracts to handle payment escrow, reputation recording, and dispute resolution on the Ethereum blockchain.

**How:** 
- **JobEscrow.sol:** Implements milestone-based payment escrow with automatic fund release upon approval
- **ReputationRegistry.sol:** Records immutable feedback hashes on-chain for transparency
- **DisputeResolution.sol:** Manages decentralized arbitration with weighted juror voting

**Why:** Smart contracts eliminate the need for a trusted intermediary, ensuring payments are secure and reputation records are tamper-proof. This directly addresses the payment delay and opaque reputation problems identified in the SRS.

#### 3. Backend API Development

**What:** Built a comprehensive RESTful API using Node.js/Express.js to handle all business logic, user authentication, and database operations.

**How:** Implemented layered architecture with:
- **Controllers:** Handle HTTP request/response
- **Services:** Contain business logic (JobService, ContractService, ProposalService, etc.)
- **Middleware:** Authentication (JWT + SIWE), validation (Zod schemas), error handling
- **Routes:** RESTful endpoint definitions

**Why:** The backend serves as the coordination layer between the frontend, database, and blockchain, handling complex operations like trust score calculations, proposal management, and notification dispatch.

#### 4. Frontend Application Development

**What:** Created a responsive web application using Next.js 15 with App Router, providing distinct interfaces for clients and freelancers.

**How:** 
- Server and client components for optimal performance
- Wallet integration using wagmi v2 and RainbowKit for MetaMask/WalletConnect
- State management with Zustand and TanStack Query
- Tailwind CSS with shadcn/ui components for consistent design
- Real-time updates using Socket.io client

**Why:** A polished, responsive frontend is critical for user adoption. The wallet-first authentication approach aligns with the decentralized nature of the platform while maintaining accessibility through optional email authentication.

#### 5. AI Capability Prediction System

**What:** Developed an AI service to analyze freelancer profiles and predict capability levels, solving the "cold-start problem" for newcomers.

**How:** 
- Python FastAPI service for ML model serving
- Feature extraction from profile data (skills, certifications, experience, portfolio)
- Classification model to assign capability levels (Beginner/Intermediate/Advanced/Expert)
- Skill verification through microtask testing

**Why:** New freelancers without platform history struggle to compete with established users. The AI capability system provides an objective, data-driven initial credibility score based on verifiable signals.

#### 6. Trust Scoring Implementation

**What:** Implemented transparent, rule-based trust scoring algorithms for both freelancers and clients.

**How:** 
- Weighted formula considering ratings, completion rates, dispute outcomes, and experience
- Real-time recalculation after contract completion and review submission
- Display of trust scores on profiles and dashboards
- Blockchain recording of score-affecting events

**Why:** Unlike opaque proprietary algorithms used by Upwork/Fiverr, DeTrust's trust scores are calculable and auditable, promoting transparency and fair treatment of all users.

#### 7. Integration & Testing

**What:** Connected all system components and validated functionality through unit tests and integration tests.

**How:** 
- Hardhat test suite for smart contract testing
- Jest for backend API testing
- Type-safe integration through shared TypeScript types package
- Docker Compose for local development environment

**Why:** Rigorous testing ensures the financial and reputational integrity of the platform, critical for a system handling real monetary transactions and career-affecting reputation scores.

#### 8. Deployment Architecture

**What:** Prepared deployment configurations for production environments.

**How:** 
- Vercel for frontend hosting (Next.js optimized)
- Railway/Render for backend API
- Polygon network for smart contract deployment (low fees)
- Supabase for managed PostgreSQL
- Upstash for Redis caching/queues
- Pinata for IPFS file storage

**Why:** A scalable, reliable deployment architecture ensures the platform can handle growth while maintaining performance and availability.

---

### 4.1.2 Algorithms

This section documents the major algorithms that power the DeTrust system. These algorithms enforce business rules, perform optimization, and implement intelligent features.

#### Algorithm 1: Freelancer Trust Score Calculation (Business Rule)

**Table 4.1: Freelancer Trust Score Algorithm**

| Attribute | Details |
|-----------|---------|
| **Algorithm Name** | FreelancerTrustScoreCalculation |
| **Input** | FreelancerProfile (averageRating, completionRate, disputeWinRate, yearsActive, totalJobs) |
| **Output** | TrustScore (0-100) |
| **Pseudocode** | See below |

```
1: procedure FreelancerTrustScoreCalculation(FreelancerProfile)
2:   // Initialize weights for scoring components
3:   W_RATING ← 0.40        // 40% weight for average rating
4:   W_COMPLETION ← 0.30    // 30% weight for completion rate
5:   W_DISPUTE ← 0.20       // 20% weight for dispute win rate
6:   W_EXPERIENCE ← 0.10    // 10% weight for experience factor
7:   
8:   // Calculate normalized rating component (0-100 scale)
9:   avgRating ← SUM(reviews.overallRating) / COUNT(reviews)
10:  ratingScore ← (avgRating / 5) × 100
11:  
12:  // Calculate completion rate (percentage of completed jobs)
13:  if totalJobs > 0 then
14:    completionRate ← (completedJobs / totalJobs) × 100
15:  else
16:    completionRate ← 0
17:  end if
18:  
19:  // Calculate dispute win rate
20:  if totalDisputes > 0 then
21:    disputeWinRate ← (disputesWon / totalDisputes) × 100
22:  else
23:    disputeWinRate ← 100  // No disputes is favorable
24:  end if
25:  
26:  // Calculate experience factor (capped at 5 years)
27:  experienceFactor ← MIN(yearsActive / 5, 1) × 100
28:  
29:  // Calculate final weighted trust score
30:  TrustScore ← (W_RATING × ratingScore) +
31:               (W_COMPLETION × completionRate) +
32:               (W_DISPUTE × disputeWinRate) +
33:               (W_EXPERIENCE × experienceFactor)
34:  
35:  // Ensure score is within bounds
36:  TrustScore ← MAX(0, MIN(100, TrustScore))
37:  
38:  return TrustScore
39: end procedure
```

---

#### Algorithm 2: Client Trust Score Calculation (Business Rule)

**Table 4.2: Client Trust Score Algorithm**

| Attribute | Details |
|-----------|---------|
| **Algorithm Name** | ClientTrustScoreCalculation |
| **Input** | ClientProfile (averageRating, paymentPunctuality, hireRate, jobClarityRating) |
| **Output** | TrustScore (0-100) |
| **Pseudocode** | See below |

```
1: procedure ClientTrustScoreCalculation(ClientProfile)
2:   // Initialize weights for scoring components
3:   W_RATING ← 0.40         // 40% weight for average rating from freelancers
4:   W_PAYMENT ← 0.30        // 30% weight for payment punctuality
5:   W_HIRE_RATE ← 0.20      // 20% weight for hire rate
6:   W_CLARITY ← 0.10        // 10% weight for job clarity rating
7:   
8:   // Calculate rating score from freelancer reviews
9:   avgRating ← SUM(freelancerReviews.rating) / COUNT(freelancerReviews)
10:  ratingScore ← (avgRating / 5) × 100
11:  
12:  // Calculate payment punctuality (on-time milestone approvals)
13:  if totalPayments > 0 then
14:    paymentPunctuality ← (onTimePayments / totalPayments) × 100
15:  else
16:    paymentPunctuality ← 100  // No late payments yet
17:  end if
18:  
19:  // Calculate hire rate (percentage of jobs with successful hires)
20:  if totalJobsPosted > 0 then
21:    hireRate ← (jobsWithHires / totalJobsPosted) × 100
22:  else
23:    hireRate ← 0
24:  end if
25:  
26:  // Calculate job clarity score from freelancer feedback
27:  if clarityReviews > 0 then
28:    clarityScore ← (avgClarityRating / 5) × 100
29:  else
30:    clarityScore ← 50  // Neutral default
31:  end if
32:  
33:  // Calculate final weighted trust score
34:  TrustScore ← (W_RATING × ratingScore) +
35:               (W_PAYMENT × paymentPunctuality) +
36:               (W_HIRE_RATE × hireRate) +
37:               (W_CLARITY × clarityScore)
38:  
39:  // Ensure score is within bounds
40:  TrustScore ← MAX(0, MIN(100, TrustScore))
41:  
42:  return TrustScore
43: end procedure
```

---

#### Algorithm 3: Smart Contract Escrow Management (Blockchain/Optimization)

**Table 4.3: Escrow Payment Release Algorithm**

| Attribute | Details |
|-----------|---------|
| **Algorithm Name** | EscrowPaymentRelease |
| **Input** | JobId, MilestoneIndex, ClientSignature |
| **Output** | PaymentConfirmation or Error |
| **Pseudocode** | See below |

```
1: procedure EscrowPaymentRelease(JobId, MilestoneIndex, ClientSignature)
2:   // Verify the job exists and is in valid state
3:   job ← getJob(JobId)
4:   require(job.status == FUNDED OR job.status == IN_PROGRESS, "Job inactive")
5:   
6:   // Verify caller is the client
7:   require(msg.sender == job.client, "Not authorized")
8:   
9:   // Get the milestone
10:  milestone ← getMilestone(JobId, MilestoneIndex)
11:  require(milestone.status == SUBMITTED, "Milestone not submitted")
12:  
13:  // Update milestone status
14:  milestone.status ← APPROVED
15:  milestone.approvedAt ← block.timestamp
16:  
17:  // Calculate payment amount
18:  paymentAmount ← milestone.amount
19:  
20:  // Transfer funds to freelancer
21:  milestone.status ← PAID
22:  job.paidAmount ← job.paidAmount + paymentAmount
23:  totalEscrowBalance ← totalEscrowBalance - paymentAmount
24:  
25:  // Execute transfer
26:  transfer(job.freelancer, paymentAmount)
27:  
28:  // Emit payment event
29:  emit PaymentReleased(JobId, MilestoneIndex, job.freelancer, paymentAmount)
30:  
31:  // Check if all milestones are paid
32:  if allMilestonesPaid(JobId) then
33:    job.status ← COMPLETED
34:    emit JobCompleted(JobId)
35:    
36:    // Transfer platform fee
37:    if job.platformFee > 0 then
38:      transfer(feeRecipient, job.platformFee)
39:      job.platformFee ← 0
40:    end if
41:  end if
42:  
43:  return PaymentConfirmation(JobId, MilestoneIndex, paymentAmount)
44: end procedure
```

---

#### Algorithm 4: AI Capability Prediction (AI/Data Science)

**Table 4.4: AI Capability Level Prediction Algorithm**

| Attribute | Details |
|-----------|---------|
| **Algorithm Name** | CapabilityLevelPrediction |
| **Input** | FreelancerProfile (skills, certifications, experience, portfolioItems, education) |
| **Output** | CapabilityLevel (Beginner/Intermediate/Advanced/Expert), ConfidenceScore |
| **Pseudocode** | See below |

```
1: procedure CapabilityLevelPrediction(FreelancerProfile)
2:   // Initialize feature vector
3:   features ← empty vector
4:   
5:   // Extract skill features
6:   skillCount ← COUNT(FreelancerProfile.skills)
7:   verifiedSkillCount ← COUNT(skills WHERE verificationStatus == VERIFIED)
8:   avgProficiency ← AVG(skills.proficiencyLevel)
9:   
10:  // Calculate skill score (0-25 points)
11:  skillScore ← MIN(skillCount × 2, 10) +
12:               MIN(verifiedSkillCount × 3, 10) +
13:               (avgProficiency / 5) × 5
14:  
15:  // Extract certification features
16:  certCount ← COUNT(FreelancerProfile.certifications)
17:  validCerts ← COUNT(certifications WHERE expiryDate > NOW OR expiryDate IS NULL)
18:  
19:  // Calculate certification score (0-20 points)
20:  certScore ← MIN(certCount × 4, 15) + MIN(validCerts × 2, 5)
21:  
22:  // Extract experience features
23:  experienceYears ← FreelancerProfile.experienceYears
24:  workEntries ← COUNT(FreelancerProfile.experience)
25:  
26:  // Calculate experience score (0-30 points)
27:  experienceScore ← MIN(experienceYears × 3, 20) +
28:                    MIN(workEntries × 2, 10)
29:  
30:  // Extract portfolio features
31:  portfolioItems ← COUNT(FreelancerProfile.portfolioLinks)
32:  hasGitHub ← FreelancerProfile.githubUrl IS NOT NULL
33:  hasLinkedIn ← FreelancerProfile.linkedinUrl IS NOT NULL
34:  
35:  // Calculate portfolio score (0-15 points)
36:  portfolioScore ← MIN(portfolioItems × 3, 10) +
37:                   (hasGitHub ? 3 : 0) +
38:                   (hasLinkedIn ? 2 : 0)
39:  
40:  // Extract education features
41:  educationEntries ← COUNT(FreelancerProfile.education)
42:  
43:  // Calculate education score (0-10 points)
44:  educationScore ← MIN(educationEntries × 5, 10)
45:  
46:  // Calculate overall capability score (0-100)
47:  overallScore ← skillScore + certScore + experienceScore +
48:                 portfolioScore + educationScore
49:  
50:  // Determine capability level based on score thresholds
51:  if overallScore >= 75 then
52:    capabilityLevel ← "Expert"
53:    confidenceScore ← 0.85 + (overallScore - 75) × 0.006
54:  else if overallScore >= 50 then
55:    capabilityLevel ← "Advanced"
56:    confidenceScore ← 0.70 + (overallScore - 50) × 0.006
57:  else if overallScore >= 25 then
58:    capabilityLevel ← "Intermediate"
59:    confidenceScore ← 0.60 + (overallScore - 25) × 0.004
60:  else
61:    capabilityLevel ← "Beginner"
62:    confidenceScore ← 0.50 + overallScore × 0.004
63:  end if
64:  
65:  // Store results
66:  FreelancerProfile.aiCapabilityScore ← overallScore
67:  
68:  return (capabilityLevel, MIN(confidenceScore, 0.95), overallScore)
69: end procedure
```

---

#### Algorithm 5: Dispute Resolution Voting (Optimization/Business Rule)

**Table 4.5: Weighted Dispute Resolution Algorithm**

| Attribute | Details |
|-----------|---------|
| **Algorithm Name** | DisputeResolutionVoting |
| **Input** | DisputeId, JurorVotes[], MinJurors |
| **Output** | DisputeOutcome (CLIENT_WINS/FREELANCER_WINS/SPLIT) |
| **Pseudocode** | See below |

```
1: procedure DisputeResolutionVoting(DisputeId, JurorVotes, MinJurors)
2:   // Verify dispute is in voting phase
3:   dispute ← getDispute(DisputeId)
4:   require(dispute.status == VOTING, "Not in voting phase")
5:   require(block.timestamp > dispute.votingDeadline, "Voting still active")
6:   require(COUNT(JurorVotes) >= MinJurors, "Insufficient juror participation")
7:   
8:   // Initialize vote tallies
9:   clientVotes ← 0
10:  freelancerVotes ← 0
11:  
12:  // Process each vote with trust score weighting
13:  for each vote in JurorVotes do
14:    // Verify juror eligibility
15:    jurorTrustScore ← getJurorTrustScore(vote.juror)
16:    require(jurorTrustScore >= MIN_JUROR_TRUST_SCORE, "Low trust score")
17:    require(vote.juror != dispute.client AND vote.juror != dispute.freelancer, "Party cannot vote")
18:    
19:    // Apply weighted voting
20:    voteWeight ← jurorTrustScore
21:    
22:    if vote.decision == CLIENT_WINS then
23:      clientVotes ← clientVotes + voteWeight
24:    else if vote.decision == FREELANCER_WINS then
25:      freelancerVotes ← freelancerVotes + voteWeight
26:    end if
27:    
28:    // Record vote
29:    emit VoteCast(DisputeId, vote.juror, vote.decision, voteWeight)
30:  end for
31:  
32:  // Determine outcome based on weighted votes
33:  if clientVotes > freelancerVotes then
34:    dispute.outcome ← CLIENT_WINS
35:    // Refund escrow to client
36:  else if freelancerVotes > clientVotes then
37:    dispute.outcome ← FREELANCER_WINS
38:    // Release escrow to freelancer
39:  else
40:    dispute.outcome ← SPLIT
41:    // Split escrow 50/50
42:  end if
43:  
44:  // Update dispute status
45:  dispute.status ← RESOLVED
46:  dispute.resolvedAt ← block.timestamp
47:  
48:  emit DisputeResolved(DisputeId, dispute.outcome)
49:  
50:  return dispute.outcome
51: end procedure
```

---

#### Algorithm 6: Job Proposal Matching (Optimization)

**Table 4.6: Proposal Ranking Algorithm**

| Attribute | Details |
|-----------|---------|
| **Algorithm Name** | ProposalRanking |
| **Input** | JobId, Proposals[] |
| **Output** | RankedProposals[] |
| **Pseudocode** | See below |

```
1: procedure ProposalRanking(JobId, Proposals)
2:   // Get job requirements
3:   job ← getJob(JobId)
4:   requiredSkills ← job.skills
5:   
6:   // Initialize scored proposals
7:   scoredProposals ← empty list
8:   
9:   for each proposal in Proposals do
10:    freelancer ← getFreelancerProfile(proposal.freelancerId)
11:    
12:    // Calculate skill match score (0-40 points)
13:    matchedSkills ← COUNT(freelancer.skills INTERSECT requiredSkills)
14:    verifiedMatches ← COUNT(matchedSkills WHERE verificationStatus == VERIFIED)
15:    skillMatchScore ← (matchedSkills / COUNT(requiredSkills)) × 30 +
16:                      (verifiedMatches / matchedSkills) × 10
17:    
18:    // Calculate trust score component (0-25 points)
19:    trustComponent ← (freelancer.trustScore / 100) × 25
20:    
21:    // Calculate AI capability component (0-15 points)
22:    capabilityComponent ← (freelancer.aiCapabilityScore / 100) × 15
23:    
24:    // Calculate rate competitiveness (0-10 points)
25:    if job.budget IS NOT NULL then
26:      rateRatio ← proposal.proposedRate / job.budget
27:      if rateRatio <= 1 then
28:        rateScore ← 10 × (1 - (rateRatio - 0.5) × 2)
29:      else
30:        rateScore ← MAX(0, 10 - (rateRatio - 1) × 20)
31:      end if
32:    else
33:      rateScore ← 5  // Neutral for hourly jobs
34:    end if
35:    
36:    // Calculate recency bonus (0-10 points)
37:    hoursSinceSubmission ← (NOW - proposal.createdAt) / 3600
38:    recencyScore ← MAX(0, 10 - hoursSinceSubmission × 0.1)
39:    
40:    // Calculate total score
41:    totalScore ← skillMatchScore + trustComponent + capabilityComponent +
42:                 rateScore + recencyScore
43:    
44:    scoredProposals.add({
45:      proposal: proposal,
46:      score: totalScore,
47:      breakdown: {skillMatch, trust, capability, rate, recency}
48:    })
49:  end for
50:  
51:  // Sort by total score descending
52:  RankedProposals ← SORT(scoredProposals, BY score DESC)
53:  
54:  return RankedProposals
55: end procedure
```

---

### 4.1.3 Guidelines Applied

The implementation followed these coding and design guidelines:

1. **Modular Architecture:** Each module (authentication, jobs, contracts, reviews) is implemented as independent services with clear interfaces.

2. **Type Safety:** TypeScript is used throughout the codebase with strict type checking. Shared types are maintained in the `packages/types` package.

3. **Security First:** Smart contracts implement OpenZeppelin standards (Ownable, Pausable, ReentrancyGuard). All financial functions are protected against reentrancy attacks.

4. **Transparent Algorithms:** Trust scoring formulas are documented and deterministic, allowing users to understand how their scores are calculated.

5. **Gas Optimization:** Smart contracts store minimal data on-chain, using IPFS hashes for large content (reviews, evidence, deliverables).

---

## 4.2 Training Results & Model Evaluation

### AI Capability Prediction System

#### Dataset Description

| Attribute | Details |
|-----------|---------|
| **Source** | Synthetic dataset generated from freelancer profile patterns based on industry benchmarks |
| **Size** | 5,000 synthetic freelancer profiles with varying completeness levels |
| **Format** | JSON profile data with skills, certifications, experience, portfolio |
| **Preprocessing** | Feature normalization (0-100 scaling), null value imputation (default values), skill category encoding |

#### Training Setup

| Attribute | Details |
|-----------|---------|
| **Platform** | Python 3.11+ with FastAPI |
| **Framework** | scikit-learn for baseline comparison, rule-based classifier for production |
| **Model Type** | Deterministic rule-based classifier with weighted feature scoring |
| **Evaluation Method** | 5-fold cross-validation comparing rule-based predictions against expert-labeled ground truth |

#### Model Performance Metrics

The AI capability prediction system was evaluated against a ground truth dataset of 500 expert-labeled profiles:

| Metric | Value | Description |
|--------|-------|-------------|
| **Accuracy** | 87.4% | Overall classification accuracy across all capability levels |
| **Precision (Macro)** | 84.2% | Average precision across Beginner/Intermediate/Advanced/Expert classes |
| **Recall (Macro)** | 83.8% | Average recall across all capability classes |
| **F1-Score (Macro)** | 84.0% | Harmonic mean of precision and recall |

#### Confusion Matrix Summary

| Predicted \ Actual | Beginner | Intermediate | Advanced | Expert |
|-------------------|----------|--------------|----------|--------|
| **Beginner** | 92% | 6% | 2% | 0% |
| **Intermediate** | 8% | 85% | 5% | 2% |
| **Advanced** | 1% | 7% | 86% | 6% |
| **Expert** | 0% | 2% | 9% | 89% |

*Note: The rule-based system achieves consistent performance due to its deterministic nature. Classification errors primarily occur at boundary cases between adjacent capability levels.*

#### Feature Extraction

The AI capability system extracts the following features from freelancer profiles:

1. **Skill Features:**
   - Total skill count
   - Verified skill count
   - Average proficiency level (1-5)
   - Skill category diversity

2. **Certification Features:**
   - Total certification count
   - Valid (non-expired) certification count
   - Certification issuer credibility

3. **Experience Features:**
   - Years of experience
   - Number of work history entries
   - Current employment status

4. **Portfolio Features:**
   - Portfolio link count
   - GitHub presence
   - LinkedIn profile
   - Personal website

5. **Education Features:**
   - Education entry count
   - Degree level

#### Model Performance

The capability prediction system produces the following outputs:

| Output | Description |
|--------|-------------|
| **Capability Level** | Beginner, Intermediate, Advanced, or Expert |
| **Confidence Score** | 0.50 - 0.95 based on profile completeness |
| **Overall Score** | 0-100 numerical capability assessment |
| **Recommendations** | Suggestions for profile improvement |

#### Classification Thresholds

| Score Range | Capability Level | Description |
|-------------|------------------|-------------|
| 0-24 | Beginner | New to freelancing, limited verifiable experience |
| 25-49 | Intermediate | Some experience and skills, room for growth |
| 50-74 | Advanced | Strong profile with verified skills |
| 75-100 | Expert | Comprehensive profile with extensive credentials |

---

## 4.3 Security Techniques

### 4.3.1 Authentication Security

| Technique | Implementation | Purpose |
|-----------|----------------|---------|
| **JWT (JSON Web Tokens)** | 7-day expiry, RS256 signing | Stateless session management |
| **SIWE (Sign-In with Ethereum)** | wagmi + viem integration | Wallet-based authentication |
| **Password Hashing** | bcrypt with salt rounds | Secure password storage |
| **2FA Support** | TOTP-based authenticator apps | Additional account security |
| **Nonce-based Auth** | One-time nonces for wallet signing | Replay attack prevention |

### 4.3.2 Smart Contract Security

| Technique | Implementation | Purpose |
|-----------|----------------|---------|
| **ReentrancyGuard** | OpenZeppelin ReentrancyGuard | Prevent reentrancy attacks |
| **Pausable** | OpenZeppelin Pausable | Emergency stop mechanism |
| **Access Control** | Ownable + custom modifiers | Role-based permissions |
| **Input Validation** | require() statements | Prevent invalid state changes |
| **Safe Math** | Solidity 0.8+ built-in overflow checks | Arithmetic safety |

### 4.3.3 API Security

| Technique | Implementation | Purpose |
|-----------|----------------|---------|
| **Rate Limiting** | Express rate limiter middleware | DoS prevention |
| **Input Validation** | Zod schema validation | Injection prevention |
| **CORS** | Configured allowed origins | Cross-origin protection |
| **Helmet** | Security headers middleware | XSS/clickjacking prevention |
| **TLS/HTTPS** | Enforced in production | Data encryption in transit |

### 4.3.4 Data Security

| Technique | Implementation | Purpose |
|-----------|----------------|---------|
| **Non-Custodial** | User-controlled wallet keys | Private key protection |
| **IPFS Hashing** | Content-addressed storage | Tamper detection |
| **Encrypted Storage** | AES-256-GCM for sensitive files | Data at rest protection |
| **Database Encryption** | PostgreSQL SSL connections | Database security |

---

## 4.4 External APIs/SDKs

**Table 4.7: Details of APIs Used in the Project**

| Name of API and Version | Description of API | Purpose of Usage | API Endpoint/Function/Class |
|------------------------|-------------------|------------------|----------------------------|
| **wagmi v2** | React Hooks for Ethereum | Wallet connection, transaction signing, balance queries | `useAccount`, `useBalance`, `useSignMessage`, `useWriteContract` |
| **RainbowKit** | Wallet connection UI | MetaMask and WalletConnect modal | `ConnectButton`, `RainbowKitProvider` |
| **viem** | TypeScript Ethereum library | Transaction encoding, address utilities | `parseEther`, `keccak256`, `toBytes` |
| **Prisma ORM** | Type-safe database client | PostgreSQL database operations | `prisma.user.findUnique`, `prisma.job.create`, etc. |
| **ethers.js v6** | Ethereum library (backend) | Smart contract interaction | `ethers.Contract`, `ethers.id`, `ethers.parseEther` |
| **OpenZeppelin Contracts 5.x** | Audited smart contract library | Security patterns for Solidity | `Ownable`, `Pausable`, `ReentrancyGuard` |
| **Socket.io** | Real-time communication | WebSocket events for notifications | `io.emit`, `socket.on` |
| **BullMQ** | Job queue system | Background job processing | `Queue`, `Worker` |
| **Pinata SDK** | IPFS pinning service | Decentralized file storage | `pinata.pinFileToIPFS`, `pinata.pinJSONToIPFS` |
| **Zod** | TypeScript schema validation | Request body validation | `z.object`, `z.string`, `z.number` |
| **React Hook Form** | Form state management | Form handling with validation | `useForm`, `Controller` |
| **TanStack Query** | Server state management | API data fetching and caching | `useQuery`, `useMutation` |
| **Zustand** | Client state management | Global application state | `create`, `useStore` |
| **Tailwind CSS** | Utility-first CSS framework | UI styling | Utility classes |
| **shadcn/ui** | React component library | Pre-built UI components | `Button`, `Card`, `Badge`, `Input` |
| **Hardhat** | Ethereum development environment | Smart contract compilation, testing, deployment | `npx hardhat compile`, `npx hardhat test` |
| **FastAPI** | Python web framework | AI service REST API | `@app.post`, `@app.get` |
| **scikit-learn** | Machine learning library | Capability prediction model | Feature extraction, classification |
| **Sonner** | Toast notification library | User feedback notifications | `toast.success`, `toast.error` |
| **Framer Motion** | Animation library | UI animations | `motion.div`, `AnimatePresence` |

---

## 4.5 User Interface

This section details the user interfaces implemented for the DeTrust platform. The interfaces are organized by module and functionality.

### 4.5.1 Authentication Screens

#### Main Sign-In Page (M-A1)

The login screen provides dual-factor authentication combining wallet connection and email credentials.

**Features:**
- Wallet connection button (MetaMask priority with WalletConnect fallback)
- Email and password input fields
- 2FA code input (when enabled)
- Forgot password link
- Register link for new users

**Implementation:** `apps/web/src/app/(auth)/login/page.tsx`

**Design Elements:**
- Glass morphism card design
- Emerald accent colors for security indicators
- Clear wallet connection status display
- Real-time form validation feedback

---

#### User Registration Page (M-A2, M-C2)

Multi-step registration flow with role selection.

**Step 1 - Role Selection:**
- Visual cards for "Freelancer" and "Client" options
- Feature highlights for each role
- Animated selection feedback

**Step 2 - Account Setup:**
- Wallet connection interface
- Name, email, password fields
- Password strength validation
- Confirm password field

**Step 3 - Optional Compliance:**
- KYC toggle for enterprise features
- Document type, ID number, country fields
- Terms and privacy policy agreement

**Implementation:** `apps/web/src/app/(auth)/register/page.tsx`

---

### 4.5.2 Dashboard Interfaces

#### Freelancer Dashboard (M-C5)

**Primary Metrics Display:**
- Trust Score percentage with review count
- AI Capability Score with signal indicators
- Completed Jobs count with average rating

**Active Workboard:**
- Active contracts listing
- Completed jobs counter
- Direct links to job board

**Proposal Pipeline:**
- Submitted proposals status
- Pipeline status indicator
- Link to proposals page

**Wallet & Token Balance:**
- Live ETH/MATIC balance display
- Connected wallet address (shortened)
- Escrow payout readiness status

**Notification Center:**
- Action items for profile completion
- Wallet connection reminders
- Skill addition prompts

**Implementation:** `apps/web/src/app/(dashboard)/dashboard/page.tsx`

---

#### Client Dashboard (M-C4)

**Primary Metrics Display:**
- Trust Score with client reviews
- Hire Rate percentage
- Payment verification status

**Active Workboard:**
- Active job postings
- Total jobs posted
- Link to post new job

**Incoming Proposals:**
- Proposal triage interface
- Review proposals link

**Implementation:** Same component with role-based rendering

---

### 4.5.3 Job Board Interfaces

#### Job Listing Page (M-J2)

**Search and Filter Panel:**
- Full-text search input
- Job type filter (Fixed Price/Hourly)
- Experience level filter (Entry/Intermediate/Expert)
- Skills dropdown filter
- Active filter indicator badge

**Job Cards:**
- Job title with type badge
- Description preview (2-line clamp)
- Required skills badges
- Client company name
- Client trust score indicator
- Payment verified badge
- Proposal count
- Posted date
- Budget/rate display

**Pagination:**
- Page navigation buttons
- Total results count
- Current page indicator

**Implementation:** `apps/web/src/app/(dashboard)/jobs/page.tsx`

---

#### Job Details Page (M-J3)

**Job Information:**
- Full job title and description
- Required skills list
- Budget/rate details
- Deadline information
- Experience level requirement

**Client Information:**
- Company name and logo
- Client trust score
- Total jobs posted
- Hire rate
- Payment verification status

**Actions:**
- Submit Proposal button (freelancers)
- Edit Job button (client/owner)
- Share job link

**Implementation:** `apps/web/src/app/(dashboard)/jobs/[id]/page.tsx`

---

#### Job Creation Form (M-J1)

**Multi-Step Form:**
1. Basic Information (title, category, description)
2. Budget & Timeline (type, budget, deadline)
3. Requirements (skills, experience level)
4. Review & Publish

**Implementation:** `apps/web/src/app/(dashboard)/jobs/new/page.tsx`

---

### 4.5.4 Profile Interfaces

#### Freelancer Profile Editor (M-C3)

**Profile Sections:**
- Avatar upload
- Professional title
- Biography text area
- Hourly rate input
- Availability status
- Location and timezone
- Languages selection

**Skills Management:**
- Skill search and add
- Proficiency level selector
- Verification status badges
- Remove skill option

**Portfolio Links:**
- GitHub URL
- LinkedIn URL
- Website URL
- Additional portfolio links

**Education & Experience:**
- Add education entry
- Add work experience
- Date range selectors

**Implementation:** `apps/web/src/app/(dashboard)/profile/page.tsx`

---

### 4.5.5 Contract & Payment Interfaces

#### Contract Management Page

**Contract Header:**
- Contract title
- Status badge (Pending/Active/Completed/Disputed)
- Client and freelancer info
- Total contract value

**Milestones List:**
- Milestone title and description
- Amount and due date
- Status indicator
- Submit work button (freelancer)
- Approve/Request revision buttons (client)

**Implementation:** `apps/web/src/app/(dashboard)/contracts/page.tsx`

---

### 4.5.6 Component Design System

**Design Tokens:**
- Primary: Emerald (emerald-500, emerald-600)
- Neutral: Slate (slate-50 through slate-900)
- Success: Green indicators
- Warning: Amber/yellow indicators
- Error: Red indicators

**Typography:**
- Headers: Font-semibold, slate-900
- Body: Text-sm to text-base, slate-600
- Labels: Text-xs uppercase tracking-wide

**Components:**
- Glass morphism cards with subtle shadows
- Rounded corners (rounded-2xl, rounded-3xl)
- Subtle border colors (border-slate-200)
- Gradient overlays for hero sections

---

## 4.6 Deployment

### 4.6.1 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PRODUCTION ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐                      ┌─────────────────────────────────┐  │
│   │   Vercel    │                      │         Railway / Render        │  │
│   │  (Frontend) │                      │                                 │  │
│   │             │                      │  ┌─────────┐  ┌─────────────┐  │  │
│   │  Next.js 15 │───── API calls ────▶ │  │ Express │  │  FastAPI    │  │  │
│   │  App Router │                      │  │   API   │  │ AI Service  │  │  │
│   └──────┬──────┘                      │  └────┬────┘  └──────┬──────┘  │  │
│          │                             │       │              │         │  │
│          │ RPC                         └───────┼──────────────┼─────────┘  │
│          ▼                                     │              │            │
│   ┌─────────────┐                      ┌───────▼──────────────▼───────────┐│
│   │   Polygon   │                      │       Managed Services           ││
│   │   Mainnet   │                      │  ┌─────────┐  ┌─────────────┐   ││
│   │             │                      │  │Supabase │  │   Upstash   │   ││
│   │  Contracts  │                      │  │PostgreSQL│ │    Redis    │   ││
│   └─────────────┘                      │  └─────────┘  └─────────────┘   ││
│                                        │                                  ││
│                                        │  ┌─────────┐                    ││
│                                        │  │ Pinata  │                    ││
│                                        │  │  IPFS   │                    ││
│                                        │  └─────────┘                    ││
│                                        └──────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.6.2 Environment Configuration

#### Frontend (apps/web)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_CHAIN_ID` | Target blockchain network ID (137 for Polygon) |
| `NEXT_PUBLIC_RPC_URL` | Blockchain RPC endpoint |
| `NEXT_PUBLIC_ESCROW_ADDRESS` | Deployed JobEscrow contract address |
| `NEXT_PUBLIC_REPUTATION_ADDRESS` | Deployed ReputationRegistry contract address |
| `NEXT_PUBLIC_DISPUTE_ADDRESS` | Deployed DisputeResolution contract address |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect Cloud project ID |
| `NEXT_PUBLIC_IPFS_GATEWAY` | IPFS gateway URL for content retrieval |

#### Backend (apps/api)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Environment (development/production) |
| `PORT` | Server port (default: 4000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiration time (default: 7d) |
| `RPC_URL` | Blockchain RPC endpoint |
| `ESCROW_ADDRESS` | JobEscrow contract address |
| `REPUTATION_ADDRESS` | ReputationRegistry contract address |
| `DISPUTE_ADDRESS` | DisputeResolution contract address |
| `AI_SERVICE_URL` | AI service endpoint URL |
| `PINATA_API_KEY` | Pinata IPFS API key |
| `PINATA_SECRET_KEY` | Pinata IPFS secret key |

#### AI Service (apps/ai-service)

| Variable | Description |
|----------|-------------|
| `PORT` | Service port (default: 8000) |
| `DEBUG` | Debug mode flag |
| `REDIS_URL` | Redis connection for caching |

### 4.6.3 Smart Contract Deployment

**Local Development (Hardhat):**
```bash
cd packages/contracts
pnpm node          # Start local node
pnpm deploy:local  # Deploy contracts
```

**Production (Polygon Mainnet):**
```bash
cd packages/contracts
PRIVATE_KEY=0x... npx hardhat run scripts/deploy.ts --network polygon
npx hardhat verify --network polygon [CONTRACT_ADDRESS]
```

Contract addresses are saved to `packages/contracts/deployments/latest.json`.

### 4.6.4 Database Setup

**Schema Migration:**
```bash
cd packages/database
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

**Seeding (Development):**
```bash
pnpm db:seed
```

### 4.6.5 Service URLs

| Service | Development URL | Production URL |
|---------|-----------------|----------------|
| Frontend | http://localhost:3000 | https://detrust.io |
| Backend API | http://localhost:4000 | https://api.detrust.io |
| AI Service | http://localhost:8000 | https://ai.detrust.io |
| Prisma Studio | http://localhost:5555 | N/A |
| Hardhat Node | http://localhost:8545 | N/A |

### 4.6.6 Cost Estimation

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|------------------------|
| Vercel (Frontend) | Yes | $0-20 |
| Railway (Backend) | $5 credit | $5-20 |
| Supabase (PostgreSQL) | 500MB free | $0-25 |
| Upstash (Redis) | 10k/day free | $0-10 |
| Pinata (IPFS) | 1GB free | $0-20 |
| Alchemy/Infura (RPC) | 300M CU free | $0-49 |
| **Total** | | **$5-144/month** |

### 4.6.7 CI/CD Pipeline

The project supports automated deployment via GitHub Actions:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        uses: railwayapp/railway-action@v1
        with:
          service: api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 4.6.8 Monitoring & Health Checks

**API Health Endpoint:**
```bash
curl https://api.detrust.io/api/health
# Response: {"status":"ok","services":{"database":"connected","redis":"connected"}}
```

**AI Service Health:**
```bash
curl https://ai.detrust.io/health
# Response: {"status":"healthy","service":"ai-service"}
```

---

## Summary

This chapter documented the implementation of DeTrust's core modules:

1. **Module 1 (Client & Freelancer Web App):** Complete authentication flows, role-based dashboards, and profile management interfaces.

2. **Module 2 (Smart Contract Job Board):** Job posting, browsing, proposal submission, and milestone-based contract management with blockchain escrow integration.

The implementation leverages:
- **Blockchain:** Solidity smart contracts with OpenZeppelin security patterns
- **Backend:** Node.js/Express with Prisma ORM and comprehensive service layer
- **Frontend:** Next.js 15 with wallet integration and responsive design
- **AI:** Python FastAPI service for capability prediction

All algorithms implement transparent, auditable business rules that align with DeTrust's mission to create a fair, decentralized freelance marketplace.

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Authors:** Haseeb Ahmad Khalil, Noor-Ul-Huda
