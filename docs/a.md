4.0 System Architecture

This section presents the hybrid monolithic architecture of the DeTrust system. The architecture combines a traditional monolithic backend with decentralized blockchain components and an AI microservice, creating a robust and scalable system.

### 4.0.1 High-Level Architecture Diagram

The following Mermaid diagram illustrates the complete system architecture:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#4F46E5', 'primaryTextColor': '#fff', 'primaryBorderColor': '#3730A3', 'lineColor': '#6366F1', 'secondaryColor': '#10B981', 'tertiaryColor': '#F3F4F6'}}}%%
flowchart TB
    subgraph CLIENT["🌐 Client Layer"]
        direction TB
        WEB["🖥️ Next.js 15 Web App<br/>(Port: 3000)"]
        WALLET["🦊 Web3 Wallets<br/>(MetaMask / WalletConnect)"]
    end

    subgraph MONOLITH["📦 Hybrid Monolithic Backend"]
        direction TB
        
        subgraph API["🔧 Express.js API Server (Port: 4000)"]
            direction LR
            
            subgraph CONTROLLERS["Controllers"]
                AUTH_CTRL["Auth<br/>Controller"]
                USER_CTRL["User<br/>Controller"]
                JOB_CTRL["Job<br/>Controller"]
                CONTRACT_CTRL["Contract<br/>Controller"]
                PROPOSAL_CTRL["Proposal<br/>Controller"]
                REVIEW_CTRL["Review<br/>Controller"]
                DISPUTE_CTRL["Dispute<br/>Controller"]
                MSG_CTRL["Message<br/>Controller"]
                ADMIN_CTRL["Admin<br/>Controller"]
            end
            
            subgraph SERVICES["Services"]
                AUTH_SVC["Auth<br/>Service"]
                USER_SVC["User<br/>Service"]
                JOB_SVC["Job<br/>Service"]
                CONTRACT_SVC["Contract<br/>Service"]
                PROPOSAL_SVC["Proposal<br/>Service"]
                REVIEW_SVC["Review<br/>Service"]
                DISPUTE_SVC["Dispute<br/>Service"]
                BLOCKCHAIN_SVC["Blockchain<br/>Service"]
                TRUST_SVC["Trust Score<br/>Service"]
                NOTIFICATION_SVC["Notification<br/>Service"]
                IPFS_SVC["IPFS<br/>Service"]
            end
            
            subgraph MIDDLEWARE["Middleware"]
                AUTH_MW["JWT Auth"]
                RATE_MW["Rate Limiter"]
                VALIDATION_MW["Zod Validation"]
                ERROR_MW["Error Handler"]
            end
        end
        
        subgraph REALTIME["⚡ Real-Time Layer"]
            SOCKET["Socket.io Server"]
            EVENTS["Event Emitter"]
        end
        
        subgraph JOBS["⏰ Background Jobs"]
            BULL["BullMQ Queue"]
            WORKER["Job Workers"]
        end
    end

    subgraph AI["🤖 AI Microservice"]
        direction TB
        FASTAPI["FastAPI Server<br/>(Port: 8000)"]
        ML_MODEL["ML Models"]
        PREDICTION["Capability<br/>Prediction"]
        VERIFICATION["Skill<br/>Verification"]
    end

    subgraph BLOCKCHAIN["⛓️ Blockchain Layer (Polygon/Ethereum)"]
        direction TB
        
        subgraph CONTRACTS["Smart Contracts"]
            ESCROW["JobEscrow.sol<br/>• createJob()<br/>• lockPayment()<br/>• releaseFunds()"]
            REPUTATION["ReputationRegistry.sol<br/>• recordFeedback()<br/>• getUserRating()"]
            DISPUTE_SC["DisputeResolution.sol<br/>• createDispute()<br/>• castVote()<br/>• resolveDispute()"]
            FACTORY["DeTrustFactory.sol<br/>• deployContracts()"]
        end
        
        RPC["JSON-RPC Provider<br/>(Infura/Alchemy)"]
    end

    subgraph DATA["💾 Data Layer"]
        direction TB
        POSTGRES[("PostgreSQL<br/>Primary Database")]
        REDIS[("Redis<br/>Cache & Sessions")]
        IPFS_STORAGE["IPFS (Pinata)<br/>File Storage"]
    end

    subgraph SHARED["📚 Shared Packages"]
        direction LR
        PRISMA["@detrust/database<br/>(Prisma ORM)"]
        TYPES["@detrust/types<br/>(TypeScript Types)"]
        CONTRACT_PKG["@detrust/contracts<br/>(ABIs & Typechain)"]
        CONFIG["@detrust/config<br/>(Shared Config)"]
    end

    %% Client connections
    WEB -->|"HTTP/REST"| API
    WEB -->|"WebSocket"| SOCKET
    WALLET -->|"JSON-RPC"| RPC
    WEB -.->|"Sign Transactions"| WALLET

    %% API internal flow
    CONTROLLERS --> SERVICES
    MIDDLEWARE --> CONTROLLERS
    
    %% Services to Data
    SERVICES -->|"Prisma"| POSTGRES
    SERVICES -->|"Cache"| REDIS
    IPFS_SVC -->|"Pin Files"| IPFS_STORAGE
    BLOCKCHAIN_SVC -->|"ethers.js"| RPC
    
    %% Real-time connections
    EVENTS --> SOCKET
    NOTIFICATION_SVC --> EVENTS
    
    %% Background jobs
    SERVICES --> BULL
    BULL --> WORKER
    WORKER -->|"Process Tasks"| SERVICES
    
    %% AI Service connections
    API -->|"HTTP"| FASTAPI
    FASTAPI --> ML_MODEL
    ML_MODEL --> PREDICTION
    ML_MODEL --> VERIFICATION
    
    %% Blockchain connections
    RPC --> CONTRACTS
    ESCROW -.->|"Events"| BLOCKCHAIN_SVC
    REPUTATION -.->|"Events"| BLOCKCHAIN_SVC
    DISPUTE_SC -.->|"Events"| BLOCKCHAIN_SVC
    
    %% Shared package usage
    PRISMA -.-> API
    TYPES -.-> WEB
    TYPES -.-> API
    CONTRACT_PKG -.-> WEB
    CONTRACT_PKG -.-> API

    %% Styling
    classDef clientStyle fill:#818CF8,stroke:#4F46E5,color:#fff
    classDef apiStyle fill:#34D399,stroke:#10B981,color:#fff
    classDef blockchainStyle fill:#FBBF24,stroke:#F59E0B,color:#000
    classDef dataStyle fill:#60A5FA,stroke:#3B82F6,color:#fff
    classDef aiStyle fill:#F472B6,stroke:#EC4899,color:#fff
    
    class WEB,WALLET clientStyle
    class API,SOCKET,BULL apiStyle
    class ESCROW,REPUTATION,DISPUTE_SC,FACTORY,RPC blockchainStyle
    class POSTGRES,REDIS,IPFS_STORAGE dataStyle
    class FASTAPI,ML_MODEL,PREDICTION,VERIFICATION aiStyle
```

### 4.0.2 Component Architecture Diagram

The following diagram shows the detailed component relationships within each module:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#6366F1'}}}%%
flowchart LR
    subgraph MODULE1["Module 1: Client & Freelancer Web App"]
        direction TB
        M1_AUTH["Authentication<br/>• Wallet Connect<br/>• Email/Password<br/>• 2FA"]
        M1_PROFILE["Profile Management<br/>• Freelancer Profile<br/>• Client Profile<br/>• Skills & Portfolio"]
        M1_DASHBOARD["Dashboard<br/>• Stats Display<br/>• Activity Feed<br/>• Notifications"]
    end

    subgraph MODULE2["Module 2: Smart Contract Job Board"]
        direction TB
        M2_JOBS["Job Management<br/>• Create Job<br/>• Browse Jobs<br/>• Filter & Search"]
        M2_PROPOSALS["Proposal System<br/>• Submit Proposal<br/>• Review Proposals<br/>• Accept/Reject"]
        M2_ESCROW["Escrow System<br/>• Fund Escrow<br/>• Milestone Tracking<br/>• Release Payment"]
    end

    subgraph MODULE3["Module 3: Review & Feedback"]
        direction TB
        M3_REVIEW["Review System<br/>• Star Ratings<br/>• Written Feedback<br/>• Double-Blind"]
        M3_ONCHAIN["On-Chain Storage<br/>• Hash Recording<br/>• Immutability<br/>• Verification"]
    end

    subgraph MODULE4["Module 4: Trust Scoring"]
        direction TB
        M4_FREELANCER["Freelancer Score<br/>• Avg Rating (40%)<br/>• Completion (30%)<br/>• Disputes (20%)<br/>• Experience (10%)"]
        M4_CLIENT["Client Score<br/>• Avg Rating (40%)<br/>• Payment Speed (30%)<br/>• Hire Rate (20%)<br/>• Job Clarity (10%)"]
    end

    subgraph MODULE5["Module 5: Dispute Resolution"]
        direction TB
        M5_INITIATE["Dispute Initiation<br/>• Evidence Upload<br/>• Reason Statement"]
        M5_JURORS["Juror Selection<br/>• Trust Score > 50<br/>• No Prior History"]
        M5_VOTING["Voting System<br/>• Weighted Votes<br/>• Smart Contract"]
    end

    subgraph MODULE6["Module 6: AI Capability"]
        direction TB
        M6_SCAN["Profile Scanning<br/>• Skills Analysis<br/>• Portfolio Review"]
        M6_PREDICT["Capability Prediction<br/>• ML Classification<br/>• Score Generation"]
        M6_VERIFY["Skill Verification<br/>• Microtasks<br/>• Test Validation"]
    end

    subgraph MODULE7["Module 7: Admin Dashboard"]
        direction TB
        M7_ANALYTICS["Platform Analytics<br/>• User Stats<br/>• Transaction Volume"]
        M7_MANAGEMENT["System Management<br/>• Dispute Oversight<br/>• Configuration"]
    end

    subgraph MODULE8["Module 8: Communication"]
        direction TB
        M8_MESSAGING["In-App Messaging<br/>• Real-Time Chat<br/>• File Sharing"]
        M8_NOTIFICATIONS["Notifications<br/>• In-App Alerts<br/>• Email & Push"]
    end

    %% Inter-module connections
    M1_AUTH --> M1_DASHBOARD
    M1_PROFILE --> M4_FREELANCER
    M1_PROFILE --> M4_CLIENT
    
    M2_JOBS --> M2_PROPOSALS
    M2_PROPOSALS --> M2_ESCROW
    M2_ESCROW --> M3_REVIEW
    
    M3_REVIEW --> M4_FREELANCER
    M3_REVIEW --> M4_CLIENT
    M3_REVIEW --> M3_ONCHAIN
    
    M2_ESCROW --> M5_INITIATE
    M5_INITIATE --> M5_JURORS
    M5_JURORS --> M5_VOTING
    M5_VOTING --> M4_FREELANCER
    M5_VOTING --> M4_CLIENT
    
    M1_PROFILE --> M6_SCAN
    M6_SCAN --> M6_PREDICT
    M6_PREDICT --> M6_VERIFY
    M6_VERIFY --> M4_FREELANCER
    
    M7_ANALYTICS --> M1_DASHBOARD
    M5_INITIATE --> M7_MANAGEMENT
    
    M2_JOBS --> M8_MESSAGING
    M2_ESCROW --> M8_NOTIFICATIONS
    M5_VOTING --> M8_NOTIFICATIONS
```

### 4.0.3 Database Schema Diagram

```mermaid
%%{init: {'theme': 'base'}}%%
erDiagram
    USER ||--o| FREELANCER_PROFILE : has
    USER ||--o| CLIENT_PROFILE : has
    USER ||--o{ JOB : posts
    USER ||--o{ PROPOSAL : submits
    USER ||--o{ REVIEW : writes
    USER ||--o{ NOTIFICATION : receives
    
    JOB ||--o{ PROPOSAL : has
    JOB ||--o| CONTRACT : has
    JOB ||--o{ MILESTONE : has
    JOB }|--|| JOB_SKILL : requires
    
    CONTRACT ||--o{ DISPUTE : may_have
    
    DISPUTE ||--o{ DISPUTE_VOTE : has
    
    FREELANCER_PROFILE }|--|| USER_SKILL : has
    
    SKILL ||--o{ JOB_SKILL : used_in
    SKILL ||--o{ USER_SKILL : acquired_by

    USER {
        string id PK
        string walletAddress UK
        string email UK
        string name
        enum role "FREELANCER|CLIENT|ADMIN"
        boolean is2FAEnabled
        datetime createdAt
    }
    
    FREELANCER_PROFILE {
        string id PK
        string userId FK
        string title
        text bio
        decimal hourlyRate
        int trustScore
        int aiCapabilityScore
        enum capabilityLevel "BEGINNER|INTERMEDIATE|ADVANCED|EXPERT"
        int completedJobs
        decimal avgRating
    }
    
    CLIENT_PROFILE {
        string id PK
        string userId FK
        string companyName
        text description
        int trustScore
        decimal totalSpent
        int jobsPosted
        decimal hireRate
    }
    
    JOB {
        string id PK
        string clientId FK
        string title
        text description
        string category
        enum type "FIXED_PRICE|HOURLY"
        decimal budget
        datetime deadline
        enum status "DRAFT|OPEN|IN_PROGRESS|COMPLETED|CANCELLED"
        int viewCount
        datetime createdAt
    }
    
    PROPOSAL {
        string id PK
        string jobId FK
        string freelancerId FK
        text coverLetter
        decimal proposedRate
        enum status "SUBMITTED|VIEWED|ACCEPTED|REJECTED"
        datetime createdAt
    }
    
    CONTRACT {
        string id PK
        string jobId FK
        string clientId FK
        string freelancerId FK
        string escrowAddress
        string blockchainJobId
        decimal totalAmount
        decimal paidAmount
        enum status "PENDING|ACTIVE|COMPLETED|DISPUTED|CANCELLED"
        datetime createdAt
    }
    
    MILESTONE {
        string id PK
        string contractId FK
        string title
        text description
        decimal amount
        int orderIndex
        enum status "PENDING|IN_PROGRESS|SUBMITTED|APPROVED|PAID"
        string deliverableHash
        datetime submittedAt
        datetime approvedAt
    }
    
    REVIEW {
        string id PK
        string authorId FK
        string subjectId FK
        string jobId FK
        int overallRating
        int communicationRating
        int qualityRating
        text comment
        string ipfsHash
        string blockchainTxHash
        datetime createdAt
    }
    
    DISPUTE {
        string id PK
        string contractId FK
        string initiatorId FK
        string reason
        text description
        enum status "OPEN|EVIDENCE_PERIOD|VOTING|RESOLVED"
        enum outcome "PENDING|CLIENT_WINS|FREELANCER_WINS|SPLIT"
        datetime votingDeadline
        datetime createdAt
    }
    
    DISPUTE_VOTE {
        string id PK
        string disputeId FK
        string jurorId FK
        enum vote "CLIENT|FREELANCER"
        int weight
        datetime createdAt
    }
    
    SKILL {
        string id PK
        string name UK
        string category
        int usageCount
    }
    
    NOTIFICATION {
        string id PK
        string userId FK
        string type
        string title
        text message
        boolean isRead
        datetime createdAt
    }
```

### 4.0.4 Data Flow Diagram

```mermaid
%%{init: {'theme': 'base'}}%%
sequenceDiagram
    autonumber
    participant C as Client
    participant W as Web App
    participant API as Express API
    participant DB as PostgreSQL
    participant BC as Blockchain
    participant IPFS as IPFS
    participant F as Freelancer

    rect rgb(230, 240, 255)
        Note over C, F: Job Posting & Proposal Flow
        C->>W: Create Job
        W->>API: POST /api/jobs
        API->>DB: Save Job (status: OPEN)
        API-->>W: Job Created
        W-->>C: Success Notification
        
        F->>W: Browse Jobs
        W->>API: GET /api/jobs
        API->>DB: Query Jobs
        API-->>W: Job List
        
        F->>W: Submit Proposal
        W->>API: POST /api/jobs/:id/proposals
        API->>DB: Save Proposal
        API-->>W: Proposal Submitted
    end

    rect rgb(255, 240, 230)
        Note over C, F: Contract & Escrow Flow
        C->>W: Accept Proposal
        W->>API: POST /api/proposals/:id/accept
        API->>DB: Create Contract
        API-->>W: Contract Created
        
        C->>W: Fund Escrow
        W->>BC: Sign Transaction
        BC->>BC: Lock Funds in Smart Contract
        BC-->>API: JobFunded Event
        API->>DB: Update Contract Status
        API-->>W: Escrow Funded
    end

    rect rgb(230, 255, 230)
        Note over C, F: Milestone & Payment Flow
        F->>W: Submit Milestone
        W->>IPFS: Upload Deliverables
        IPFS-->>W: IPFS Hash
        W->>API: POST /api/milestones/:id/submit
        API->>DB: Update Milestone
        API-->>W: Milestone Submitted
        
        C->>W: Approve Milestone
        W->>BC: Sign Release Transaction
        BC->>BC: Transfer Funds to Freelancer
        BC-->>API: PaymentReleased Event
        API->>DB: Update Payment Status
        API-->>W: Payment Released
    end

    rect rgb(255, 230, 255)
        Note over C, F: Review Flow
        C->>W: Submit Review
        W->>API: POST /api/reviews
        API->>BC: Record Review Hash
        BC-->>API: FeedbackRecorded Event
        API->>DB: Save Review
        API->>API: Recalculate Trust Score
        API-->>W: Review Submitted
    end
```

### 4.0.5 Smart Contract Interaction Diagram

```mermaid
%%{init: {'theme': 'base'}}%%
flowchart TB
    subgraph FRONTEND["Frontend (Next.js)"]
        UI["User Interface"]
        WAGMI["wagmi Hooks"]
        WALLET_CONNECT["Wallet Connection"]
    end

    subgraph BACKEND["Backend (Express)"]
        API_SERVER["API Server"]
        BC_SERVICE["Blockchain Service"]
        EVENT_LISTENER["Event Listener"]
    end

    subgraph BLOCKCHAIN["Blockchain (Polygon)"]
        subgraph ESCROW_CONTRACT["JobEscrow Contract"]
            CREATE_JOB["createJob()"]
            SUBMIT_MS["submitMilestone()"]
            APPROVE_MS["approveMilestone()"]
            RELEASE_FUNDS["releaseFunds()"]
        end
        
        subgraph REPUTATION_CONTRACT["ReputationRegistry Contract"]
            RECORD_FB["recordFeedback()"]
            GET_RATING["getUserRating()"]
        end
        
        subgraph DISPUTE_CONTRACT["DisputeResolution Contract"]
            CREATE_DISP["createDispute()"]
            CAST_VOTE["castVote()"]
            RESOLVE["resolveDispute()"]
        end
    end

    subgraph EVENTS["Emitted Events"]
        E1["JobCreated"]
        E2["JobFunded"]
        E3["MilestoneSubmitted"]
        E4["PaymentReleased"]
        E5["FeedbackRecorded"]
        E6["DisputeRaised"]
        E7["DisputeResolved"]
    end

    %% Frontend to Blockchain (Direct Transactions)
    UI -->|"Connect"| WALLET_CONNECT
    WALLET_CONNECT -->|"Sign Tx"| WAGMI
    WAGMI -->|"Fund Escrow"| CREATE_JOB
    WAGMI -->|"Approve Payment"| APPROVE_MS
    WAGMI -->|"Submit Review"| RECORD_FB
    WAGMI -->|"Cast Vote"| CAST_VOTE

    %% Backend to Blockchain (Server Operations)
    BC_SERVICE -->|"Read State"| ESCROW_CONTRACT
    BC_SERVICE -->|"Read Ratings"| REPUTATION_CONTRACT
    BC_SERVICE -->|"Read Disputes"| DISPUTE_CONTRACT

    %% Events Flow
    CREATE_JOB -->|"emit"| E1
    CREATE_JOB -->|"emit"| E2
    SUBMIT_MS -->|"emit"| E3
    APPROVE_MS -->|"emit"| E4
    RECORD_FB -->|"emit"| E5
    CREATE_DISP -->|"emit"| E6
    RESOLVE -->|"emit"| E7

    %% Event Listener
    E1 --> EVENT_LISTENER
    E2 --> EVENT_LISTENER
    E3 --> EVENT_LISTENER
    E4 --> EVENT_LISTENER
    E5 --> EVENT_LISTENER
    E6 --> EVENT_LISTENER
    E7 --> EVENT_LISTENER

    EVENT_LISTENER -->|"Update DB"| API_SERVER
```
