![](media/image1.jpeg){width="1.3125in" height="1.3125in"}

> **COMSATS University, Islamabad Pakistan**

**DeTrust**

(Decentralized Trust & Capability Scoring System for Freelancers)

***By***

**Haseeb Ahmad Khalil CIIT/FA22-BCS-027/ISB**

**Noor-Ul-Huda CIIT/FA22-BCS-081/ISB**

***Supervisor\
*Dr. Tehsin Kanwal**

***Bachelor of Science in Computer Science (2022-2026)***

**The candidate confirms that the work submitted is their own and
appropriate\
credit has been given where reference has been made to the work of
others**.

> ![](media/image1.jpeg){width="1.3125in" height="1.3125in"}
>
> **COMSATS University, Islamabad Pakistan**

**DeTrust**

(Decentralized Trust & Capability Scoring System for Freelancers)

**A project presented to**

**COMSATS University, Islamabad**

**In partial fulfillment**

**of the requirement for the degree of**

***Bachelors of Science in Computer Science (2022-2026)***

**By**

**Haseeb Ahmad Khalil CIIT/FA22-BCS-027/ISB**

**Noor-Ul-Huda CIIT/FA22-BCS-081/ISB**

**DECLARATION**

We hereby declare that this software, neither whole nor as a part, has
been copied out from any source. It is further declared that we have
developed this software and accompanied report entirely on the basis of
our personal efforts. If any part of this project is proved to be copied
out from any source or found to be a reproduction of some other, we will
stand by the consequences. No Portion of the work presented has been
submitted of any application for any other degree or qualification of
this or any other university or institute of learning.

Student Name 1 Student Name 2

NOOR-UL-HUDA HASEEB AHMAD KHALIL

**CERTIFICATE OF APPROVAL**

It is to certify that the final year project of BS (CS) DeTrust was
developed by\
**NOOR-UL-HUDA (CIIT/FA22-BCS-081)** and **HASEEB AHMAD KHALIL
(CIIT/FA22-BCS-027)** under the supervision of DR. TEHSIN KANWAL and
that in her opinion; it is fully adequate, in scope and quality for the
degree of Bachelors of Science in Computer Sciences.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

**Supervisor**

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

**External Examiner**

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

**Head of Department**

**(Department of Computer Science)**

**EXECUTIVE SUMMARY**

The freelance marketplace ecosystem is fraught with challenges that
undermine trust and efficiency for both clients and freelancers.
Centralized platforms impose high commission fees, create significant
payment delays, and utilize opaque reputation systems that are often
biased against new talent. This \"cold-start\" problem effectively
excludes skilled newcomers who lack a platform-specific work history,
while lengthy and often unfair dispute resolution processes further
erode confidence.

To address these systemic issues, DeTrust is developed. It is a
decentralized web application that provides a transparent, secure, and
equitable solution. The system is built on blockchain technology,
utilizing smart contracts to automate payment escrow and release, which
guarantees timely compensation and drastically reduces transaction fees.

DeTrust introduces a transparent, mathematical trust scoring system for
both freelancers and clients, ensuring all reputation metrics are
auditable and tamper-proof. To solve the newcomer problem, it integrates
an AI-powered capability prediction system that analyzes a user\'s
skills and portfolio to provide an instant credibility score. By
recording all agreements, feedback, and dispute outcomes on the
blockchain, DeTrust establishes a meritocratic marketplace where
verified talent and fair processes are the cornerstones of success

**\
**

# Abstract {#abstract .list-paragraph}

This project was created to resolve the systemic issues of high fees,
payment insecurity, and biased reputation systems that plague the
current freelance marketplace ecosystem. Current centralized platforms
like Upwork and Fiverr charge exorbitant commissions, with 58% of
freelancers reporting payment delays or non-payment. Their proprietary
scoring algorithms and opaque dispute resolution processes create
significant barriers for new talent and can lead to unfair outcomes. The
proposed project aims to solve the \"cold-start problem\" that prevents
new freelancers from securing work and addresses the financial risk both
parties face due to insecure payment handling and prolonged disputes. It
also targets the lack of transparency and portability in current
reputation systems, which locks users into a single platform. The
project fills the gap for a unified freelance platform that combines
automated smart-contract escrow, transparent on-chain reputation, and an
AI-driven solution to instantly assess newcomer capability. The system
aims to eliminate cold-start barriers for new users through AI-powered
capability assessment and guarantee universal payment security with
automated escrow smart contracts. Furthermore, it will deliver
auditable, transparent trust scores for both clients and freelancers and
ensure fair dispute outcomes via decentralized community arbitration. As
a final product, DeTrust creates a sustainable, transparent, and
meritocratic marketplace where talent, not platform algorithms, drives
success for all participants.

**Acknowledgement**

All praise is to Almighty Allah who bestowed upon us a minute portion of
His boundless knowledge by virtue of which we were able to accomplish
this challenging task.

We are greatly indebted to our project supervisor Dr. Tehsin Kanwal.
Without her personal supervision, advice and valuable guidance,
completion of this project would have been doubtful. We are grateful to
them for their encouragement and continual help during this work.

And we are also thankful to our parents and family who have been a
constant source of encouragement for us and brought us with the values
of honesty & hard work.

Student Name 1 Student Name 2

NOOR-UL-HUDA HASEEB AHMAD KHALIL

**Abbreviations**

  -----------------------------------------------------------------------
  **SRS**             Software Require Specification
  ------------------- ---------------------------------------------------
  **AI**              Artificial Intelligence

  **API**             Application Programming Interface

  **DApp**            Decentralized Application

  **IPFS**            InterPlanetary File System

  **ML**              Machine Learning

  **UI**              User Interface

  **UX**              User Experience

  **REL**             Reliability

  **USE**             Usability

  **PERF**            Performance

  **SEC**             Security

  **MAIN**            maintainability

  **SI**              Software interface

  **CI**              Communication interface
  -----------------------------------------------------------------------

  : *Table 1 Related System Analysis with proposed project solution*

**Table of Contents**

[Abstract [v](#abstract)](#abstract)

[1 Chapter 1: Introduction and Problem Definition
[6](#chapter-1-introduction-and-problem-definition)](#chapter-1-introduction-and-problem-definition)

[1.1 Overview of the Project
[6](#overview-of-the-project)](#overview-of-the-project)

[1.2 Vision Statement [6](#vision-statement)](#vision-statement)

[1.3 Problem Statement [6](#problem-statement)](#problem-statement)

[1.4 Problem Solution [7](#problem-solution)](#problem-solution)

[1.5 Objectives of the Proposed System
[7](#objectives-of-the-proposed-system)](#objectives-of-the-proposed-system)

[1.6 Scope [8](#scope)](#scope)

[1.6.1 Limitations/Constraints [8](#_Toc223897135)](#_Toc223897135)

[1.7 Modules [8](#modules)](#modules)

[1.7.1 Module 1: Client & Freelancer Web App
[8](#module-1-client-freelancer-web-app)](#module-1-client-freelancer-web-app)

[1.7.2 Module 2: Smart Contract Job Board
[8](#module-2-smart-contract-job-board)](#module-2-smart-contract-job-board)

[1.7.3 Module 3: Review & Feedback System
[9](#module-3-review-feedback-system)](#module-3-review-feedback-system)

[1.7.4 Module 4: Trust Scoring Module
[9](#module-4-trust-scoring-module)](#module-4-trust-scoring-module)

[*1.7.5* Module 5: Dispute Resolution
[9](#module-5-dispute-resolution)](#module-5-dispute-resolution)

[*1.7.6* Module 6: AI Capability Prediction System
[9](#module-6-ai-capability-prediction-system)](#module-6-ai-capability-prediction-system)

[1.7.7 Module 7: Admin Dashboard
[10](#module-7-admin-dashboard)](#module-7-admin-dashboard)

[1.7.8 Module 8: Notification and Communication System
[10](#module-8-notification-and-communication-system)](#module-8-notification-and-communication-system)

[1.8 Related System Analysis/Literature Review
[10](#related-system-analysisliterature-review)](#related-system-analysisliterature-review)

[1.8.1 Literature Review [10](#literature-review)](#literature-review)

[1.8.2 Related System Analysis
[10](#related-system-analysis)](#related-system-analysis)

[1.9 Tools and Technologies
[11](#tools-and-technologies)](#tools-and-technologies)

[1.10 Project Contribution
[12](#project-contribution)](#project-contribution)

[1.11 Relevance to Course Modules
[13](#relevance-to-course-modules)](#relevance-to-course-modules)

[2 Chapter 2: Requirement Analysis [14](#_Toc223897151)](#_Toc223897151)

[2.1 User Classes and Characteristics
[14](#user-classes-and-characteristics)](#user-classes-and-characteristics)

[2.1.1 Use case Diagram [14](#use-case-diagram)](#use-case-diagram)

[2.1.2 Requirement Identifying Technique
[16](#requirement-identifying-technique)](#requirement-identifying-technique)

[2.2 Functional Requirements
[20](#functional-requirements)](#functional-requirements)

[2.3 Non-Functional Requirements
[50](#non-functional-requirements)](#non-functional-requirements)

[2.3.1 Reliability [50](#reliability)](#reliability)

[2.3.2 Usability [50](#usability)](#usability)

[2.3.3 Performance [51](#performance)](#performance)

[2.3.4 Security [51](#security)](#security)

[2.3.5 Maintainability [51](#maintainability)](#maintainability)

[2.4 External Interface Requirements
[51](#external-interface-requirements)](#external-interface-requirements)

[2.4.1 User Interfaces Requirements
[52](#user-interfaces-requirements)](#user-interfaces-requirements)

[2.4.2 Software interfaces
[52](#software-interfaces)](#software-interfaces)

[2.4.3 Hardware interfaces
[52](#hardware-interfaces)](#hardware-interfaces)

[2.4.4 Communications interfaces
[53](#communications-interfaces)](#communications-interfaces)

[3 Chapter 3: Design and Architecture
[54](#chapter-3-design-and-architecture)](#chapter-3-design-and-architecture)

[3.1 System Architecture Overview [54](#_Toc223897168)](#_Toc223897168)

[1.1.1 Purpose [54](#purpose)](#purpose)

[3.2 Conceptual Architectural Diagram
[54](#conceptual-architectural-diagram)](#conceptual-architectural-diagram)

[3.2.1 Technologies and Services
[56](#technologies-and-services)](#technologies-and-services)

[3.3 Architecture Style / Pattern
[57](#architecture-style-pattern)](#architecture-style-pattern)

[3.3.1 Architectural diagram
[57](#architectural-diagram)](#architectural-diagram)

[3.4 Design Models [60](#design-models)](#design-models)

[3.4.1 Design Models for Object Oriented Development Approach
[60](#design-models-for-object-oriented-development-approach)](#design-models-for-object-oriented-development-approach)

[3.4.2 Activity Diagrams: [61](#activity-diagrams)](#activity-diagrams)

[3.4.3 Class Diagram: [68](#_Toc223897177)](#_Toc223897177)

[3.4.4 Sequence Diagrams: [69](#sequence-diagrams)](#sequence-diagrams)

[3.4.5 State diagrams: [78](#state-diagrams)](#state-diagrams)

[3.5 Data Design [82](#data-design)](#data-design)

[4 Chapter 4: Implementation
[87](#chapter-4-implementation)](#chapter-4-implementation)

[4.1 Project Methodology & Algorithms
[87](#project-methodology-algorithms)](#project-methodology-algorithms)

[4.1.1 Project Methodology
[87](#project-methodology)](#project-methodology)

[4.1.2 Algorithm [91](#algorithm)](#algorithm)

[4.2 Training Results & Model Evaluation
[98](#training-results-model-evaluation)](#training-results-model-evaluation)

[4.3 Security Techniques
[98](#security-techniques)](#security-techniques)

[4.3.1 Authentication (Wallet-Based)
[99](#authentication-wallet-based)](#authentication-wallet-based)

[4.3.2 Encryption (HTTPS/TLS)
[99](#encryption-httpstls)](#encryption-httpstls)

[4.3.3 Attack Prevention [99](#attack-prevention)](#attack-prevention)

[4.3.4 Intrusion/Anomaly Detection
[100](#intrusionanomaly-detection)](#intrusionanomaly-detection)

[4.3.5 IPFS Content Integrity
[100](#ipfs-content-integrity)](#ipfs-content-integrity)

[4.3.6 Double-Blind Review System
[100](#double-blind-review-system)](#double-blind-review-system)

[4.3.7 Dispute Evidence Access Control
[101](#dispute-evidence-access-control)](#dispute-evidence-access-control)

[4.3.8 Juror Trust Score Gate
[101](#juror-trust-score-gate)](#juror-trust-score-gate)

[4.4 External APIs/SDKs [101](#external-apissdks)](#external-apissdks)

[4.5 User Interface [103](#user-interface)](#user-interface)

[4.5.1 Onboarding/Landing Page
[103](#onboardinglanding-page)](#onboardinglanding-page)

[4.5.2 Login [105](#login)](#login)

[4.5.3 Client Dashboard [105](#client-dashboard)](#client-dashboard)

[4.5.4 Freelancer Dashboard
[106](#freelancer-dashboard)](#freelancer-dashboard)

[4.5.5 Job Board [107](#job-board)](#job-board)

[4.5.6 Contract Management
[108](#contract-management)](#contract-management)

[4.5.7 Profile Management for freelancers
[109](#profile-management-for-freelancers)](#profile-management-for-freelancers)

[4.5.8 Profile Management for client
[110](#profile-management-for-client)](#profile-management-for-client)

[4.5.9 Review & Feedback System
[110](#review-feedback-system)](#review-feedback-system)

[4.5.10 Trust Score Dashboard
[111](#trust-score-dashboard)](#trust-score-dashboard)

[4.5.11 Dispute Resolution
[112](#dispute-resolution-1)](#dispute-resolution-1)

[4.5.12 In-Platform Messaging
[113](#in-platform-messaging)](#in-platform-messaging)

[4.5.13 Admin Dashboard [113](#admin-dashboard)](#admin-dashboard)

[4.6 Deployment [114](#deployment)](#deployment)

[4.6.1 Environment [114](#environment)](#environment)

[4.6.2 Smart Contract Deployment Details
[115](#smart-contract-deployment-details)](#smart-contract-deployment-details)

[4.6.3 Monitoring [116](#monitoring)](#monitoring)

[5 Chapter 5: Testing and Evaluation
[116](#chapter-5-testing-and-evaluation)](#chapter-5-testing-and-evaluation)

[5.1 Unit Testing [116](#unit-testing)](#unit-testing)

[5.2 Functional Testing [121](#functional-testing)](#functional-testing)

[5.3 Business Rules Testing
[124](#business-rules-testing)](#business-rules-testing)

[5.4 Integration Testing
[126](#integration-testing)](#integration-testing)

[6 Chapter 6: Conclusion and Future Work
[130](#chapter-6-conclusion-and-future-work)](#chapter-6-conclusion-and-future-work)

[6.1 Future Work [131](#future-work)](#future-work)

[7 Chapter 7: References
[132](#chapter-7-references)](#chapter-7-references)

[8 Chapter 8: Plagiarism Report
[133](#chapter-8-plagiarism-report)](#chapter-8-plagiarism-report)

**List of Figures**

[Figure 1 Use case Diagram [15](#_Toc223897223)](#_Toc223897223)

[Figure 2 Mockup: M-A1 --- Main Sign-In Page
[20](#_Toc223897224)](#_Toc223897224)

[Figure 3 Mockup: M-A2 --- Email Sign-Up Page
[21](#_Toc223897225)](#_Toc223897225)

[Figure 4 Mockup: M-A3 --- Email Sign-In Page
[22](#_Toc223897226)](#_Toc223897226)

[Figure 5 Mockup: M-A4 --- Forgot Password Flow
[23](#_Toc223897227)](#_Toc223897227)

[Figure 6 Mockup: M-A5 --- 2FA Setup & Verification
[24](#_Toc223897228)](#_Toc223897228)

[Figure 7 Mockup: M-C2 --- User Onboarding
[25](#_Toc223897229)](#_Toc223897229)

[Figure 8 Mockup: M-C3 --- Freelancer Profile Creation/Editing
[27](#_Toc223897230)](#_Toc223897230)

[Figure 9 Mockup: M-C5 --- Freelancer Dashboard
[27](#_Toc223897231)](#_Toc223897231)

[Figure 10 Mockup: M-C3.1 --- Client Profile Creation/Editing
[28](#_Toc223897232)](#_Toc223897232)

[Figure 11 Mockup: M-C4 --- Client Dashboard
[29](#_Toc223897233)](#_Toc223897233)

[Figure 12 Mockup: M-P1 --- Public Profile & Analytics
[30](#_Toc223897234)](#_Toc223897234)

[Figure 13 Mockup: M-P1.1 --- Client Public Profile & Analytics
[31](#_Toc223897235)](#_Toc223897235)

[Figure 14 Mockup: M-J1 --- Job Posting Form
[32](#_Toc223897236)](#_Toc223897236)

[Figure 15 Mockup: M-J2 --- Job Board
[33](#_Toc223897237)](#_Toc223897237)

[Figure 16 Mockup: M-J3 --- Job Details Page
[34](#_Toc223897238)](#_Toc223897238)

[Figure 17 Mockup: M-J4 --- Proposal Submission Form
[36](#_Toc223897239)](#_Toc223897239)

[Figure 18 Mockup: M-J5 --- Active Project Management
[37](#_Toc223897240)](#_Toc223897240)

[Figure 19 Mockup: M-J6 --- Submit Work/Milestone
[38](#_Toc223897241)](#_Toc223897241)

[Figure 20 Mockup: M-J7 --- Review & Feedback Form
[39](#_Toc223897242)](#_Toc223897242)

[Figure 21 Mockup: M-P2 --- Dispute Initiation Form
[40](#_Toc223897243)](#_Toc223897243)

[Figure 22 Mockup: M-P3 --- Dispute Voting Page
[41](#_Toc223897244)](#_Toc223897244)

[Figure 23 Mockup: M-P4 --- AI Capability Score Display
[42](#_Toc223897245)](#_Toc223897245)

[Figure 24 Mockup: M-P5 --- Skill Verification Hube
[43](#_Toc223897246)](#_Toc223897246)

[Figure 25 Mockup: M-P6 --- Skill Verification Test (Microtask)
[44](#_Toc223897247)](#_Toc223897247)

[Figure 26 Mockup: M-P7 --- Test Results Page
[45](#_Toc223897248)](#_Toc223897248)

[Figure 27 Mockup: M-S1 --- Admin Dashboard
[46](#_Toc223897249)](#_Toc223897249)

[Figure 28 Mockup: M-S2 --- In-App Messaging
[47](#_Toc211345240)](#_Toc211345240)

[Figure 29 Mockup: M-S3 --- Notification Center
[48](#_Toc223897251)](#_Toc223897251)

[Figure 30 Mockup: M-S4 --- Notification Settings Page
[49](#_Toc223897252)](#_Toc223897252)

[Figure 31 Conceptual Architectural Diagram
[55](#_Toc223897253)](#_Toc223897253)

[Figure 32 Architectural diagram [59](#_Toc223897254)](#_Toc223897254)

[Figure 33 Activity Diagrams for Client Job Posting & Escrow Funding
[61](#_Toc223897255)](#_Toc223897255)

[Figure 34 Activity Diagrams for Freelancer Proposal & Contract
Formation [62](#_Toc223897256)](#_Toc223897256)

[Figure 35 Activity Diagrams Milestone Delivery & Payment Release
[63](#_Toc223897257)](#_Toc223897257)

[Figure 36 Activity Diagrams Dispute Resolution Process
[64](#_Toc223897258)](#_Toc223897258)

[Figure 37 Activity Diagrams Automated AI Capability Assessment
[65](#_Toc223897259)](#_Toc223897259)

[Figure 38 Activity Diagrams Skill Verification (Microtask)
[66](#_Toc223897260)](#_Toc223897260)

[Figure 39 Activity Diagrams Review & Trust Score Update
[67](#_Toc223897261)](#_Toc223897261)

[Figure 40 Class Diagram [68](#_Toc223897262)](#_Toc223897262)

[Figure 41 sequence diagram for Job posting and proposal submission
[69](#_Toc223897263)](#_Toc223897263)

[Figure 42 sequence diagram for Escrow creation and work completion
approval [70](#_Toc223897264)](#_Toc223897264)

[Figure 43 sequence diagram for Feedback submission (client and
freelancer) [71](#_Toc223897265)](#_Toc223897265)

[Figure 44 Sequence Diagram for Feedback retrieval
[72](#_Toc223897266)](#_Toc223897266)

[Figure 45 sequence diagram Trust scoring
[73](#_Toc223897267)](#_Toc223897267)

[Figure 46 Sequence Diagram for Dispute Creation & Evidence
[74](#_Toc223897268)](#_Toc223897268)

[Figure 47 Sequence Diagram for Jury Voting & Resolution Execution
[75](#_Toc223897269)](#_Toc223897269)

[Figure 48 sequence diagram for AI capability prediction system
[76](#_Toc223897270)](#_Toc223897270)

[Figure 49 Sequence Diagram for Notification and Communication
[77](#_Toc223897271)](#_Toc223897271)

[Figure 50 State diagrams Dispute Resolution
[78](#_Toc223897272)](#_Toc223897272)

[Figure 51 State diagrams for Skill Verification Lifecycle
[79](#_Toc223897273)](#_Toc223897273)

[Figure 52 State diagrams for Freelancer Proposal Lifecycle
[80](#_Toc223897274)](#_Toc223897274)

[Figure 53 State diagrams for User Profile & Trust State
[81](#_Toc223897275)](#_Toc223897275)

[Figure 54 User Interface for Onboarding/Landing Page
[104](#_Toc223897276)](#_Toc223897276)

[Figure 55 User Interface for Login
[105](#_Toc223897277)](#_Toc223897277)

[Figure 56 User Interface for Client Dashboard
[106](#_Toc223897278)](#_Toc223897278)

[Figure 57 User Interface for Freelancer Dashboard
[107](#_Toc223897279)](#_Toc223897279)

[Figure 58 User Interface for Job Board
[108](#_Toc223897280)](#_Toc223897280)

[Figure 59 User Interface for Contract Management
[108](#_Toc223897281)](#_Toc223897281)

[Figure 60 User Interface for Management for freelancers
[109](#_Toc223897282)](#_Toc223897282)

[Figure 61 User Interface for Profile Management for client
[110](#_Toc223897283)](#_Toc223897283)

[Figure 62 User Interface for Review & Feedback System
[111](#_Toc223897284)](#_Toc223897284)

[Figure 63 User Interface for Trust Score Dashboard
[111](#_Toc223897285)](#_Toc223897285)

[Figure 64 User Interface for Dispute Resolution
[112](#_Toc223897286)](#_Toc223897286)

[Figure 65 User Interface for In-Platform Messaging
[113](#_Toc223897287)](#_Toc223897287)

[Figure 66 User Interface for Admin Dashboard
[114](#_Toc223897288)](#_Toc223897288)

[Figure 67 Plagiarism Report [133](#_Toc223897289)](#_Toc223897289)

# Chapter 1: Introduction and Problem Definition

This chapter provides an overview of the DeTrust project. It outlines
the project\'s vision, defines the problems within the current freelance
ecosystem, presents the proposed solution and objectives, and details
the project\'s scope, limitations, and core modules.

## Overview of the Project

DeTrust is a decentralized web application designed to overcome systemic
inefficiencies and trust deficits prevalent in current freelance
platforms. The project is a web-based information system that
incorporates problem-solving through artificial intelligence and
blockchain technology. Users, including freelancers and clients,
authenticate via crypto wallets to create profiles and interact within
the marketplace. The system leverages blockchain-based smart contracts
to secure payments in escrow, ensuring funds are released only upon job
completion or a binding arbitration decision. All transactions, reviews,
and dispute records are stored immutably on the blockchain, fostering
transparency and reducing fraud. To address the challenges faced by
newcomers, DeTrust provides an instant capability assessment using
AI-powered profile analysis, creating a fair and meritocratic ecosystem.

## Vision Statement

**For** freelancers and clients who require a transparent, reliable, and
equitable digital marketplace to collaborate effectively, **Who**
currently struggle with the systemic inefficiencies of centralized
platforms, including opaque commission fees, persistent payment delays,
biased reputation systems that create entry barriers (the \"cold-start
problem\"), and slow, often unfair, dispute resolution processes,
**The** **DeTrust** **Is** a fully decentralized, blockchain-powered
freelance marketplace **That** fundamentally redefines trust and
capability by securing all payments through automated smart contract
escrows, recording feedback as immutable on-chain records, and providing
an instant, objective capability assessment for newcomers via an
AI-powered analysis of their skills and portfolio. It delivers a
progressive and fully transparent trust score for all participants,
ensuring that reputation is earned through verifiable performance.
**Unlike** existing centralized platforms such as Upwork and Fiverr,
which operate as opaque intermediaries that control user data, dictate
high fees, and foster an environment of uncertainty, **our product**
empowers its users by combining automated financial security, auditable
reputation scoring, and community-driven arbitration. This creates a
truly meritocratic ecosystem where verified talent and fair, transparent
processes drive sustainable success and foster long-term professional
relationships.

## Problem Statement

Current freelance marketplaces are hindered by persistent issues that
limit fairness, trust, and efficiency. New freelancers face the
\"cold-start problem,\" where a lack of reviews prevents them from
securing jobs, as platform algorithms favor established workers.
Centralized platforms impose high fees; for instance, Upwork charges a
sliding commission of up to 15% \[3\], while Fiverr deducts a flat 20%
from freelancer earnings \[4\].

Payment insecurity is a major risk, with 58% of freelancers reporting
delayed or missing payments, and 40% waiting over 30 days for their
compensation \[5\]. Dispute resolution processes are often slow and
opaque; on platforms like Upwork, resolving a dispute can involve
multiple stages and paid arbitration, extending timelines significantly
\[6, 7\]. Finally, platform-specific reputation systems are proprietary,
preventing freelancers from transferring their hard-earned credibility
to other platforms, which creates vendor lock-in \[1\]. These combined
problems of newcomer exclusion, high fees, payment delays, opaque
scoring, and lengthy disputes erode trust for all participants.

*.*

## Problem Solution

DeTrust addresses the core problems of the freelance industry by
leveraging blockchain technology and artificial intelligence. To counter
high fees and payment delays, the system uses blockchain-based smart
contracts that automatically hold client funds in escrow and release
them upon completion, reducing transaction fees to just 1--3%. All
feedback is stored on-chain via cryptographic hashing, creating portable
and tamper-proof reputation records that cannot be altered.

To solve the \"cold-start problem,\" a machine learning model analyzes
new freelancers\' profiles based on skills, certifications, and projects
to generate an objective credibility score, allowing them to compete
fairly from day one. Finally, dispute resolution is decentralized and
unbiased, with juror selection and voting weighted by reputation,
ensuring fair outcomes are reached within days instead of weeks.

## Objectives of the Proposed System

***BO-1:** Secure client payments in escrow, releasing funds only upon
client approval or verified arbitration.*

***BO-2:** Store feedback immutably on-chain to prevent review
alteration.*

***BO-3:** Automate fair dispute resolution through decentralized,
reputation-weighted voting.*

***BO-4:** Implement an initial rule-based trust score (weighted-average
of ratings, completion rate, dispute rate) for transparency.*

***BO-5:** Use a transparent, rule-based trust scoring system for both
freelancers and clients.*

***BO-6:** Provide instant capability assessment for new users via
AI-powered profile analysis and lightweight microtask verification to
reduce cold-start risk.*

***BO-7:** Deliver real-time dashboards showing trust scores, AI
capability predictions, and historical trends.*

***BO-8:** Deliver real-time, event-driven notifications and
wallet-linked messaging to keep participants informed and responsive.*

## Scope

DeTrust is a decentralized web application (DApp) designed to be
accessed via Ethereum-compatible wallets like MetaMask on Layer-2
networks to ensure low fees and fast transactions. The platform\'s scope
includes functionalities for clients to post detailed job listings and
for freelancers to browse, filter, and submit proposals for those jobs.
A core feature is the smart contract-based payment system, which locks
funds in escrow and automates their release upon mutual agreement or the
conclusion of an arbitration process. The system will establish trust
through transparent, rule-based scoring models for both freelancers and
clients. For new users, an AI capability module will analyze profile
signals and use microtasks to generate an initial credibility score,
effectively solving the cold-start problem. The scope also includes a
complete dispute resolution system where evidence is stored on IPFS and
juror voting is enforced by smart contracts. Finally, users will have
access to real-time dashboards to track their trust scores, earnings,
and project history, ensuring a fair and efficient freelance ecosystem.

### Limitations/Constraints

***LI-1:** The platform only supports Ethereum-compatible wallets and
networks.*

***LI-2:** The accuracy of the machine learning-based scoring depends on
the volume and quality of available historical data.*

***LI-3:** AI capability predictions for new users require sufficiently
detailed profiles to be reliable.*

***LI-4:** Storing data directly on-chain incurs gas costs; therefore,
large file uploads (like dispute evidence) will use IPFS.*

***LI-5:** The speed of dispute resolution may be affected by the
availability of community jurors.*

## Modules

### Module 1: Client & Freelancer Web App

***FE-1:** Wallet-based login and authentication (e.g., MetaMask,
WalletConnect integration).*

***FE-2:** User role selection (Client or Freelancer) during
onboarding.*

***FE-3:** Profile creation and editing.*

***FE-4:** User dashboard displaying active jobs, proposals,
notifications, and token balance*

### Module 2: Smart Contract Job Board

***FE-1:** Functionality for clients to post detailed job listings
(description, budget, deadlines, required skills).*

***FE-2:** Interface for freelancers to browse, search, and filter job
listings and submit proposals.*

***FE-3:** Smart contract logic for locking client payments into escrow
upon job agreement and releasing funds upon verified completion and
approval.*

***FE-4:** Clear visual tracking of job status (e.g., Open, In Progress,
Awaiting Approval, Completed, In Dispute) driven by smart contract
events.*

### Module 3: Review & Feedback System

***FE-1:** Interface for clients to submit ratings and textual comments
for completed jobs.*

***FE-2:** Interface for freelancers to submit a \"Job Clarity\" rating
for the client after job completion.*

***FE-3:** Smart contract integration to store hashes of feedback
content immutably on the blockchain (content stored on IPFS).*

***FE-4:** Public display of aggregated ratings and individual reviews
on user profiles.*

***FE-5:** Mechanism to view feedback history for specific jobs.*

### Module 4: Trust Scoring Module

***FE-1:** Collect performance data for freelancers (average ratings,
completion rates, dispute outcomes) and clients (payment punctuality,
job clarity ratings, cancellation rate, dispute behavior).*

***FE-2:** Compute a rule-based trust score for freelancers using the
formula: .*

***FE-3:** Compute a rule-based trust score for clients using the
formula: .*

***FE-4:** Display real-time trust scores and historical trends on user
dashboards.*

### Module 5: Dispute Resolution

***FE-1:** Interface to launch a dispute case with evidence upload to
IPFS.*

***FE-2:** System for selecting jurors based on their reputation
scores.*

***FE-3:** A voting smart contract to record juror decisions and
automatically execute the result.*

### Module 6: AI Capability Prediction System

***FE-1:** Extract and process user profile data such as skills,
certifications, projects, and education.*

***FE-2:** Implement microtask and skill verification tests.*

***FE-3:** Run a classification model to assign an initial capability
level (Beginner/Intermediate/Expert) to new users.*

***FE-4:** Display the initial AI-generated capability score on the
user\'s dashboard.*

### Module 7: Admin Dashboard

***FE-1:** Interface to view key platform analytics and statistics
(e.g., number of users, active jobs, dispute rates).*

***FE-2:** Functionality to configure smart contract parameters.*

***FE-3:** Tools to monitor disputes and flagged accounts for manual
review if necessary.*

### Module 8: Notification and Communication System

***FE-1:** Real-time notification system for job updates, payments, and
disputes.*

***FE-2:** In-platform messaging system between clients and
freelancers.*

***FE-3:** Email notification integration for critical events.*

***FE-4:** Push notification support for web apps.*

## Related System Analysis/Literature Review

### Literature Review

*Existing literature on online labor platforms highlights significant
challenges related to algorithmic fairness and entry barriers for new
participants. Research has identified the \"cold-start problem,\" where
new freelancers without a reputation struggle to attract clients, as
recommendation algorithms inherently favor those with an established
history \[1\]. Furthermore, studies from institutions like the Kellogg
School of Management have pointed to algorithmic bias in gig economy
platforms, where opaque, proprietary systems can perpetuate inequalities
in job distribution \[2\]. Many existing systems are centralized,
leading to a lack of transparency in how reputations are calculated, and
disputes are handled. Our project addresses these gaps by introducing a
decentralized architecture where reputation is recorded immutably on a
blockchain, ensuring it is both transparent and tamper-proof.
Additionally, we directly tackle the cold-start problem by integrating
an AI-driven capability assessment model to provide new users with an
objective, verifiable measure of their skills from the outset.*

### Related System Analysis

+------------+----------------------------+----------------------------+
| A          | Key Features & Weaknesses  | DeTrust Solution           |
| pplication |                            |                            |
+============+============================+============================+
| Upwork     | \- Centralized reputation  | \- On-chain, tamper-proof  |
|            | system                     | feedback stored via smart  |
|            |                            | contracts.                 |
|            | \- 10--20% service fees    |                            |
|            | reduce freelancer          | \- Automated escrow with   |
|            | earnings.                  | conditional release        |
|            |                            | eliminates hidden fees.    |
|            | \- Dispute resolution      |                            |
|            | relies on Upwork           | \- Decentralized           |
|            | mediation, which can be    | arbitration with           |
|            | opaque and time-consuming. | transparent,               |
|            |                            | reputation-weighted        |
|            |                            | voting.                    |
+------------+----------------------------+----------------------------+
| Fiverr     | \- Gig-based fixed-price   | \- Flexible                |
|            | model limits complex       | milestone-based payments   |
|            | project scope.             | via smart contracts.       |
|            |                            |                            |
|            | \- 20% seller commission   | \- Lower transaction       |
|            | plus buyer service         | overhead with minimal      |
|            |                            | on-chain fees.             |
|            |                            |                            |
|            |                            | \- AI-driven capability    |
|            |                            | prediction prevents fake   |
|            |                            | profiles and ensures valid |
|            |                            | skill assessment.          |
+------------+----------------------------+----------------------------+
| [[F        | \- Tiered milestone escrow | \- Smart contract escrow   |
| reelancer. | with additional            | without extra arbitration  |
| com]{.unde | arbitration fees (5% or    | charges.                   |
| rline}](ht | \$5 minimum).              |                            |
| tp://Freel |                            | \- Immutable review        |
| ancer.com) | \- Centralized dispute     | hashing and free           |
|            | resolution charges extra   | community-driven dispute   |
|            | for escalation.            | handling.                  |
|            |                            |                            |
|            | \- Reputation metrics are  | \- Dual-phase trust        |
|            | proprietary and opaque.    | scoring: AI for newcomers  |
+------------+----------------------------+----------------------------+

: Table 2 Tools and Technologies for Proposed Project

## Tools and Technologies

+-----------+--------------------+-----------------+------------------+
| >         | > **Tools**        | > **Version**   | > **Rationale**  |
| **Tools** |                    |                 |                  |
| >         |                    |                 |                  |
| > **And** |                    |                 |                  |
| >         |                    |                 |                  |
| > **Techn |                    |                 |                  |
| ologies** |                    |                 |                  |
+===========+====================+=================+==================+
|           | > IDE              | > VS Code       | > Code           |
|           |                    |                 | > development    |
+-----------+--------------------+-----------------+------------------+
|           | > Smart Contracts  | > x.x.x         | > Contract logic |
|           | > (Solidity)       |                 |                  |
+-----------+--------------------+-----------------+------------------+
|           | > Blockchain       | > Ethereum      | > Low-cost       |
|           | > Network          | > Testne        | > testing and    |
|           |                    | t/Polygon/local | > deployment     |
|           |                    | > deployment    |                  |
+-----------+--------------------+-----------------+------------------+
|           | > Frontend         | > R             | > Responsive UI  |
|           | > Framework        | eact.js/Next.js |                  |
+-----------+--------------------+-----------------+------------------+
|           | > Backend          | > Node.js +     | > API services   |
|           |                    | > Express       |                  |
+-----------+--------------------+-----------------+------------------+
|           | > ML Framework     | > TensorFlow or | > AI capability  |
|           |                    | > scikit-learn  | > prediction     |
+-----------+--------------------+-----------------+------------------+
|           | > Database         | > IPFS/Postgres | > Storage        |
+-----------+--------------------+-----------------+------------------+
|           | > Design           | > Figma         | > Mockup and UI  |
|           |                    |                 | > design         |
+-----------+--------------------+-----------------+------------------+
|           |                    |                 |                  |
+-----------+--------------------+-----------------+------------------+

: Table 3 User Classes and Characteristics

## Project Contribution

*The DeTrust system introduces several key technical and conceptual
contributions to the freelance marketplace ecosystem:*

-   ***AI-Powered Newcomer Assessment:** The system directly addresses
    the \"cold-start problem\" by using an AI model to analyze a new
    user\'s profile and skills, providing an instant and objective
    capability score. This allows new talent to compete on merit rather
    than being excluded due to a lack of platform-specific history.*

-   ***Decentralized and Transparent Trust Scoring:** Unlike the opaque,
    proprietary algorithms of existing platforms, DeTrust implements a
    transparent, rule-based mathematical formula for calculating trust
    scores for both freelancers and clients. All data feeding into this
    score is derived from on-chain actions, ensuring it is auditable and
    fair.*

-   ***Automated Financial Security via Smart Contracts:** By using
    smart contract-based escrow, the system automates payment security,
    eliminating the risks of delayed or non-payment that plague the
    industry. This \"trustless\" mechanism significantly reduces the
    need for intermediaries and lowers transaction fees.*

-   ***Immutable and Portable Reputation:** All feedback, project
    completions, and dispute outcomes are recorded on the blockchain.
    This creates a tamper-proof, permanent record of a user\'s
    reputation that is owned by the user and is inherently portable.*

-   ***Fair and Efficient Community-Driven Arbitration:** The project
    introduces a decentralized dispute resolution system where
    reputation-weighted community jurors vote on outcomes. This removes
    the potential for platform bias and dramatically speeds up the
    resolution process compared to traditional, centralized mediation.*

***Contribution Impact:** By integrating AI and blockchain technology,
the DeTrust system transforms the conventional freelance platform from a
centralized, opaque intermediary into a decentralized, transparent, and
meritocratic ecosystem. These contributions significantly improve
efficiency through automated escrow, enhance fairness via auditable
trust scoring and community arbitration, and boost user confidence by
providing immutable reputation records. This holistic approach creates a
more sustainable and equitable environment for both freelancers and
clients compared to traditional freelance solutions.*

## Relevance to Course Modules

The development of the DeTrust project aligns with and applies knowledge
from several core Computer Science courses:

-   **Software Engineering:** The project follows the complete Software
    Development Life Cycle (SDLC), from requirement analysis and system
    design (as documented here) to development, testing, and deployment.

-   **Web Application Development:** The frontend will be built using
    modern frameworks like React.js/Next.js, and the backend services
    will be developed with Node.js, directly applying principles of web
    technologies.

-   **Artificial Intelligence:** This project involves creating a
    predictive model for freelancer capability using frameworks like
    TensorFlow or scikit-learn, which is a direct application of machine
    learning concepts.

-   **Database Systems:** The project requires a hybrid data storage
    approach, utilizing a traditional database like Postgres for
    off-chain data and a decentralized storage solution like IPFS for
    large files and evidence.

-   **Blockchain and Distributed Systems:** The core of the project
    relies on developing and deploying Solidity smart contracts on an
    Ethereum-compatible network, demonstrating a practical understanding
    of decentralized application architecture and principles.

# Chapter 2: Requirement Analysis

This chapter outlines the detailed requirements for the DeTrust system.
It begins by identifying the different user classes and their
characteristics, followed by a Use Case Diagram to visualize their
interactions with the system. The chapter then specifies the functional
and non-functional requirements, which will guide the design,
development, and testing phases of the project.

## User Classes and Characteristics

The DeTrust platform is designed to serve several distinct user classes,
each with specific roles, permissions, and interactions within the
decentralized ecosystem.

  ---------------------------------------------------------------------------
  **User Class**    **Characteristics**
  ----------------- ---------------------------------------------------------
  **Freelancer**    The primary user who seeks job opportunities. Freelancers
                    will create detailed profiles showcasing their skills,
                    experience, and portfolio. They are expected to have a
                    basic understanding of cryptocurrency wallets (e.g.,
                    MetaMask) for authentication and receiving payments.
                    Their main goal is to secure work, build a verifiable
                    on-chain reputation, and receive timely payments without
                    high intermediary fees.

  **Client**        A user or organization seeking to hire talent for
                    specific projects. Clients post job listings, review
                    proposals from freelancers, and fund projects via smart
                    contract escrows. They require a transparent system to
                    assess a freelancer\'s trustworthiness and capability,
                    especially for newcomers. Their primary motivation is to
                    find skilled professionals and ensure project funds are
                    secure until work is satisfactorily completed.

  **System          A technical user responsible for monitoring the
  Administrator**   platform\'s health, managing smart contract parameters
                    (e.g., platform fees, juror selection criteria), and
                    overseeing the dispute resolution system. The
                    Administrator does not interfere with individual
                    contracts but ensures the underlying infrastructure
                    operates smoothly and securely.
  ---------------------------------------------------------------------------

  : Table 4 Mockup-Based Requirement Analysis

### Use case Diagram

![](media/image2.png){width="5.38078302712161in"
height="8.54385498687664in"}

[]{#_Toc223897223 .anchor}Figure 1 Use case Diagram

### Requirement Identifying Technique

To ensure comprehensive coverage of all system requirements, a
dual-technique approach is adopted:

a.  **Mockup-Based Requirement Analysis:** For all user-facing
    interactions, this technique will be used. User interface (UI)
    mockups for key screens of the DApp will be designed using Figma.
    Functional requirements will then be derived directly from the
    interactive elements (buttons, forms, dashboards) on each screen.
    This ensures that the requirements are user-centric and grounded in
    the visual design.

+-------------------+----------------+---------------------------------+
| **Mockup ID**     | **Screen       | **Primary Functional Focus**    |
|                   | Name**         |                                 |
+===================+================+=================================+
| **Module 1:       |                |                                 |
| Client &          |                |                                 |
| Freelancer Web    |                |                                 |
| App**             |                |                                 |
+-------------------+----------------+---------------------------------+
| M-A1              | Main Sign-In   | Provides dual entry points:     |
|                   | Page           | Web3 wallet connection and      |
|                   |                | traditional email login.        |
+-------------------+----------------+---------------------------------+
| M-A2              | Email Sign-Up  | Form for creating an account    |
|                   | Page           | with email, password, and terms |
|                   |                | agreement.                      |
+-------------------+----------------+---------------------------------+
| M-A3              | Email Sign-In  | Standard form for               |
|                   | Page           | email/password authentication.  |
+-------------------+----------------+---------------------------------+
| M-A4              | Forgot         | Screens for entering email,     |
|                   | Password Flow  | confirming a reset link, and    |
|                   |                | setting a new password.         |
+-------------------+----------------+---------------------------------+
| M-A5              | 2FA Setup &    | QR code display for             |
|                   | Verification   | authenticator app setup and a   |
|                   |                | verification code input screen. |
+-------------------+----------------+---------------------------------+
| M-C1              | Landing Page   | Hero section, \"How it Works,\" |
|                   |                | features, and testimonials.     |
+-------------------+----------------+---------------------------------+
| M-C2              | User           | Simple, full-screen selection   |
|                   | Onboarding     | for \"I\'m a Client\" or \"I\'m |
|                   |                | a Freelancer.\"                 |
+-------------------+----------------+---------------------------------+
| M-C3              | Freelancer     | A comprehensive form for users  |
|                   |                | to build their identity (name,  |
|                   | Profile        | bio, skills, portfolio).        |
|                   | Cr             |                                 |
|                   | eation/Editing |                                 |
+-------------------+----------------+---------------------------------+
| M-C3.1            | Client Profile | A form for clients to build     |
|                   | Cr             | their identity (company name,   |
|                   | eation/Editing | logo, description).             |
+-------------------+----------------+---------------------------------+
| M-C4              | Client         | An overview of active jobs,     |
|                   | Dashboard      | proposals received, total       |
|                   |                | spending, and recent activity.  |
+-------------------+----------------+---------------------------------+
| M-C5              | Freelancer     | An overview of active projects, |
|                   | Dashboard      | submitted proposals, total      |
|                   |                | earnings, and recent activity.  |
+-------------------+----------------+---------------------------------+
| M-P1              | Freelancer     | The public-facing view of a     |
|                   | Public Profile | user\'s profile, showcasing     |
|                   | & Analytics    | their trust score, AI           |
|                   |                | capability score (for           |
|                   |                | freelancers), reviews, and work |
|                   |                | history.                        |
+-------------------+----------------+---------------------------------+
| M-P1.1            | Client Public  | The public-facing view of a     |
|                   | Profile &      | client\'s profile, showcasing   |
|                   | Analytics      | their trust score, hire rate,   |
|                   |                | and reviews.                    |
+-------------------+----------------+---------------------------------+
| **Module 2: Smart |                |                                 |
| Contract Job      |                |                                 |
| Board**           |                |                                 |
+-------------------+----------------+---------------------------------+
| M-J1              | Job Posting    | A clean, multi-step form for    |
|                   | Form           | clients to create a job         |
|                   |                | listing.                        |
+-------------------+----------------+---------------------------------+
| M-J2              | Job Board      | The main job browsing interface |
|                   |                | with search and filter          |
|                   |                | capabilities.                   |
+-------------------+----------------+---------------------------------+
| M-J3              | Job Details    | A detailed view of a single     |
|                   | Page           | job, including project          |
|                   |                | description, client history,    |
|                   |                | and trust score.                |
+-------------------+----------------+---------------------------------+
| M-J4              | Proposal       | A modal or page for freelancers |
|                   | Submission     | to write their proposal and set |
|                   | Form           | their fee.                      |
+-------------------+----------------+---------------------------------+
| M-J5              | Active Project | The central workspace for an    |
|                   | Management     | ongoing project, featuring      |
|                   |                | milestones, deliverables, and a |
|                   |                | chat window.                    |
+-------------------+----------------+---------------------------------+
| M-J6              | Submit         | A form for freelancers to       |
|                   | Work/Milestone | upload files and formally       |
|                   |                | submit work for approval.       |
+-------------------+----------------+---------------------------------+
| **Module 3:       |                |                                 |
| Review & Feedback |                |                                 |
| System**          |                |                                 |
+-------------------+----------------+---------------------------------+
| M-J7              | Review &       | A simple modal for both parties |
|                   | Feedback Form  | to leave a rating (1-5 stars)   |
|                   |                | and a comment.                  |
+-------------------+----------------+---------------------------------+
| **Module 5:       |                |                                 |
| Dispute           |                |                                 |
| Resolution**      |                |                                 |
+-------------------+----------------+---------------------------------+
| M-P2              | Dispute        | A guided form to open a         |
|                   | Initiation     | dispute, state the reason, and  |
|                   | Form           | upload initial evidence.        |
+-------------------+----------------+---------------------------------+
| M-P3              | Dispute Voting | A neutral interface for jurors  |
|                   | Page           | to review evidence from both    |
|                   |                | parties and cast their vote.    |
+-------------------+----------------+---------------------------------+
| **Module 6: AI    |                |                                 |
| Capability        |                |                                 |
| Prediction        |                |                                 |
| System**          |                |                                 |
+-------------------+----------------+---------------------------------+
| M-P4              | AI Capability  | Displays the AI-generated score |
|                   | Score Display  | on the freelancer\'s            |
|                   |                | profile/dashboard.              |
+-------------------+----------------+---------------------------------+
| M-P5              | Skill          | A dashboard page for            |
|                   | Verification   | freelancers listing their       |
|                   | Hub            | skills with verification        |
|                   |                | status.                         |
+-------------------+----------------+---------------------------------+
| M-P6              | Skill          | An interface for a short,       |
|                   | Verification   | skill-based test (e.g., quiz,   |
|                   | Test           | coding challenge).              |
+-------------------+----------------+---------------------------------+
| M-P7              | Test Results   | A clear screen showing the      |
|                   | Page           | outcome of the skill            |
|                   |                | verification test.              |
+-------------------+----------------+---------------------------------+
| **Module 7: Admin |                |                                 |
| Dashboard**       |                |                                 |
+-------------------+----------------+---------------------------------+
| M-S1              | Admin          | A data-rich dashboard for       |
|                   | Dashboard      | administrators showing platform |
|                   |                | health and key metrics.         |
+-------------------+----------------+---------------------------------+
| **Module 8:       |                |                                 |
| Notification and  |                |                                 |
| Communication     |                |                                 |
| System**          |                |                                 |
+-------------------+----------------+---------------------------------+
| M-S2              | In-App         | A real-time chat interface for  |
|                   | Messaging      | direct communication between    |
|                   |                | clients and freelancers.        |
+-------------------+----------------+---------------------------------+
| M-S3              | Notification   | A dropdown list showing recent, |
|                   | Center         | unread notifications, triggered |
|                   |                | by a bell icon.                 |
+-------------------+----------------+---------------------------------+
| M-S4              | Notification   | A settings page with toggles    |
|                   | Settings Page  | for managing in-app and email   |
|                   |                | notification preferences.       |
+-------------------+----------------+---------------------------------+

: Table 5 Event-Response Tables

a)  **Event-Response Tables:** For backend and blockchain-level
    processes that do not have a direct UI, this technique is employed
    to define system behaviors triggered by events such as smart
    contract execution or AI model processing.

+---------+----------+--------------+---------+----------+-----------+
| **      | **System | **Response** | **Event | **Data   | **System  |
| Event** | State**  |              | Freq    | Elements | State     |
|         |          |              | uency** | Re       | (After    |
|         |          |              |         | quired** | Event)**  |
+=========+==========+==============+=========+==========+===========+
| Client  | Job      | 1\. System   | Once    | Client   | Contract  |
| funds   | proposal | prompts      | per     | wallet   | active;   |
| escrow  | a        | clients to   | c       | address, | Funds in  |
|         | ccepted; | sign         | ontract | Fr       | escrow;   |
|         | contract | transaction  |         | eelancer | F         |
|         | created  | to deploy    |         | wallet   | reelancer |
|         | on       | smart        |         | address, | notified  |
|         | backend. | contract.    |         | Payment  | to begin  |
|         |          |              |         | amount,  | work.     |
|         |          | 2\. Smart    |         | Contract |           |
|         |          | contract     |         | terms    |           |
|         |          | locks funds  |         |          |           |
|         |          | from         |         |          |           |
|         |          | client\'s    |         |          |           |
|         |          | wallet into  |         |          |           |
|         |          | escrow.      |         |          |           |
+---------+----------+--------------+---------+----------+-----------+
| Fre     | Contract | 1\. System   | Per     | Contract | Milestone |
| elancer | active;  | receives     | mi      | ID,      | marked    |
| co      | m        | work         | lestone | M        | \"Sub     |
| mpletes | ilestone | submission   |         | ilestone | mitted\"; |
| mi      | deadline | from         |         | ID, Link | Awaiting  |
| lestone | appr     | freelancer.  |         | to work  | client    |
|         | oaching. |              |         | (IPFS    | approval. |
|         |          | 2\. Notifies |         | hash)    |           |
|         |          | client to    |         |          |           |
|         |          | review       |         |          |           |
|         |          | submitted    |         |          |           |
|         |          | work.        |         |          |           |
+---------+----------+--------------+---------+----------+-----------+
| Client  | M        | 1\. Client   | Per     | Contract | Funds     |
| a       | ilestone | signs        | mi      | ID,      | tra       |
| pproves | work     | transaction  | lestone | M        | nsferred; |
| payment | su       | to release   | a       | ilestone | Milestone |
|         | bmitted. | funds.       | pproval | ID,      | marked    |
|         |          |              |         | C        | \"Com     |
|         |          | 2\. Smart    |         | lient\'s | pleted.\" |
|         |          | contract     |         | s        |           |
|         |          | transfers    |         | ignature |           |
|         |          | milestone    |         |          |           |
|         |          | payment from |         |          |           |
|         |          | escrow to    |         |          |           |
|         |          | f            |         |          |           |
|         |          | reelancer\'s |         |          |           |
|         |          | wallet.      |         |          |           |
|         |          |              |         |          |           |
|         |          | 3\. Deducts  |         |          |           |
|         |          | platform     |         |          |           |
|         |          | fee.         |         |          |           |
+---------+----------+--------------+---------+----------+-----------+
| Trust   | Contract | 1\. Backend  | After   | User ID, | User\'s   |
| score   | c        | service      | each    | old      | trust     |
| is      | ompleted | retrieves    | co      | score,   | score     |
| recal   | and      | new rating,  | mpleted | new      | updated   |
| culated | feedback | completion   | c       | rating,  | in the    |
|         | s        | status, and  | ontract | co       | database  |
|         | ubmitted | dispute      |         | mpletion | and       |
|         | by both  | outcome.     |         | rate,    | displayed |
|         | parties. |              |         | dispute  | on their  |
|         |          | 2\.          |         | history  | profile.  |
|         |          | Recalculates |         |          |           |
|         |          | trust score  |         |          |           |
|         |          | for both     |         |          |           |
|         |          | users based  |         |          |           |
|         |          | on the       |         |          |           |
|         |          | weighted     |         |          |           |
|         |          | formula.     |         |          |           |
+---------+----------+--------------+---------+----------+-----------+
| Dispute | Dispute  | 1\. System   | Once    | Contract | Jurors    |
| period  | in       | locks the    | per     | ID, list | selected; |
| expires | itiated; | contract.    | dispute | of       | Voting    |
|         | evidence |              |         | p        | period    |
|         | s        | 2\. Selects  |         | otential | begins.   |
|         | ubmitted | qualified    |         | jurors,  |           |
|         | by both  | jurors based |         | trust    |           |
|         | parties. | on           |         | score    |           |
|         |          | reputation   |         | t        |           |
|         |          | score via a  |         | hreshold |           |
|         |          | smart        |         |          |           |
|         |          | contract     |         |          |           |
|         |          | function.    |         |          |           |
|         |          |              |         |          |           |
|         |          | 3\. Notifies |         |          |           |
|         |          | selected     |         |          |           |
|         |          | jurors to    |         |          |           |
|         |          | vote.        |         |          |           |
+---------+----------+--------------+---------+----------+-----------+
| AI      | New      | 1\. Backend  | On      | User ID, | AI        |
| cap     | fr       | service      | -demand | profile  | c         |
| ability | eelancer | scrapes and  | by      | data     | apability |
| scan    | profile  | processes    | fre     | (text,   | score is  |
| re      | created  | profile data | elancer | links),  | generated |
| quested | or       | (skills,     |         | skill    | and       |
|         | signi    | portfolio,   |         | list     | stored;   |
|         | ficantly | cert         |         |          | displayed |
|         | updated. | ifications). |         |          | on        |
|         |          |              |         |          | free      |
|         |          | 2\. Feeds    |         |          | lancer\'s |
|         |          | data into    |         |          | profile.  |
|         |          | the ML       |         |          |           |
|         |          | cl           |         |          |           |
|         |          | assification |         |          |           |
|         |          | model.       |         |          |           |
|         |          |              |         |          |           |
|         |          | 3\. Stores   |         |          |           |
|         |          | and returns  |         |          |           |
|         |          | the          |         |          |           |
|         |          | capability   |         |          |           |
|         |          | score (e.g., |         |          |           |
|         |          | \"Inte       |         |          |           |
|         |          | rmediate\"). |         |          |           |
+---------+----------+--------------+---------+----------+-----------+
| Skill   | Fr       | 1\. System   | Per     | User ID, | Skill     |
| mi      | eelancer | auto-grades  | skill   | Skill    | status is |
| crotask | c        | the test     | test    | ID, Test | \"Ve      |
| passed  | ompletes | (e.g., quiz  | attempt | results  | rified\"; |
|         | and      | score, code  |         |          | AI score  |
|         | submits  | execution).  |         |          | may be    |
|         | a skill  |              |         |          | p         |
|         | veri     | 2\. If       |         |          | ositively |
|         | fication | passed,      |         |          | impacted. |
|         | test.    | updates the  |         |          |           |
|         |          | skill\'s     |         |          |           |
|         |          | status to    |         |          |           |
|         |          | \"Verified\" |         |          |           |
|         |          | in the       |         |          |           |
|         |          | database.    |         |          |           |
+---------+----------+--------------+---------+----------+-----------+

: Table 6 Functional Requirements Derived from Mockup: M-A1

## Functional Requirements

**Module 1: Client & Freelancer Web App**

**Mockup: M-A1 --- Main Sign-In Page**

![A screenshot of a login form AI-generated content may be
incorrect.](media/image3.png){width="3.7532556867891516in"
height="3.9518405511811023in"}

[]{#_Toc223897224 .anchor}Figure 2 Mockup: M-A1 --- Main Sign-In Page

**Functional Requirements Derived from** **Mockup: M-A1 --- Main Sign-In
Page**

  ------------------------------------------------------------------------
  **Feature     **Functional Requirement (FR-ID:   **Business Rule**
  (derived from Statement)**                       
  UI)**                                            
  ------------- ---------------------------------- -----------------------
  Wallet        FR-A1.1: The system shall provide  Wallet connection is
  Connection    a \"Connect Wallet\" button to     the primary and
                initiate a connection with the     recommended
                user\'s browser-based Ethereum     authentication method.
                wallet.                            

  Email Login   FR-A1.2: The system shall provide  This option will be
  Option        a \"Sign in with Email\" option    visually secondary to
                for users who prefer traditional   the wallet connection.
                authentication.                    
  ------------------------------------------------------------------------

  : Table 7 Functional Requirements Derived from Mockup: M-A2

**Mockup: M-A2 --- Email Sign-Up Page**

![A screenshot of a login form AI-generated content may be
incorrect.](media/image4.png){width="3.3903947944007in"
height="4.4981233595800525in"}

[]{#_Toc223897225 .anchor}Figure 3 Mockup: M-A2 --- Email Sign-Up Page

**Functional Requirements Derived from Mockup: M-A2 --- Email Sign-Up
Page**

  -------------------------------------------------------------------------
  **Feature      **Functional Requirement        **Business Rule**
  (derived from  (FR-ID: Statement)**            
  UI)**                                          
  -------------- ------------------------------- --------------------------
  Registration   FR-A2.1: The system shall       The email must be in a
  Form           provide fields for a new user   valid format and unique
                 to enter their full name, email within the system.
                 address, and create a password. 

  Password       FR-A2.2: The system shall       Password must be at least
  Strength       enforce password complexity     12 characters and include
                 rules and provide real-time     uppercase, lowercase, a
                 feedback on password strength.  number, and a special
                                                 character.

  Terms          FR-A2.3: The system requires    The \"Sign Up\" button
  Agreement      users to agree to the Terms of  remains disabled until the
                 Service and Privacy Policy via  checkbox is ticked.
                 a checkbox before creating an   
                 account.                        
  -------------------------------------------------------------------------

  : Table 8 Functional Requirements Derived from Mockup: M-A3

**Mockup: M-A3 --- Email Sign-In Page**

![A screenshot of a login form AI-generated content may be
incorrect.](media/image5.png){width="2.989432414698163in"
height="3.6137325021872266in"}

[]{#_Toc223897226 .anchor}Figure 4 Mockup: M-A3 --- Email Sign-In Page

**Functional Requirements Derived from Mockup: M-A3 --- Email Sign-In
Page**

  -------------------------------------------------------------------------
  **Feature        **Functional Requirement       **Business Rule**
  (derived from    (FR-ID: Statement)**           
  UI)**                                           
  ---------------- ------------------------------ -------------------------
  User             FR-A3.1: The system shall      Authentication is
  Authentication   authenticate users by          case-sensitive for the
                   validating their provided      password field.
                   email and password against     
                   stored records.                

  Failed Login     FR-A3.2: The system shall      After 5 failed login
  Handling         display an error message for   attempts, the account
                   invalid credentials.           will be temporarily
                                                  locked for 15 minutes.
  -------------------------------------------------------------------------

  : Table 9 Functional Requirements Derived from Mockup: M-A4

**Mockup: M-A4 --- Forgot Password Flow**

![A screenshot of a login form AI-generated content may be
incorrect.](media/image6.png){width="3.6665474628171477in"
height="3.4262576552930883in"}

[]{#_Toc223897227 .anchor}Figure 5 Mockup: M-A4 --- Forgot Password Flow

**Functional Requirements Derived from Mockup: M-A4 --- Forgot Password
Flow**

  -----------------------------------------------------------------------
  **Feature    **Functional Requirement (FR-ID:   **Business Rule**
  (derived     Statement)**                       
  from UI)**                                      
  ------------ ---------------------------------- -----------------------
  Recovery     FR-A4.1: The system shall allow a  An email will only be
  Initiation   user to initiate password recovery sent if the address
               by entering their registered email exists in the system.
               address.                           

  Secure Reset FR-A4.2: The system shall email a  The password reset link
  Link         unique, single-use link to the     must expire 60 minutes
               user for resetting their password. after being issued.

  New Password FR-A4.3: The system shall provide  The new password cannot
  Form         a secure form for the user to      be the same as the
               enter and confirm a new password.  user\'s last three
                                                  passwords.
  -----------------------------------------------------------------------

  : Table 10 Functional Requirements Derived from Mockup: M-A5

**Mockup: M-A5 --- 2FA Setup & Verification**

![A screenshot of a computer AI-generated content may be
incorrect.](media/image7.png){width="2.6292891513560805in"
height="4.339479440069991in"}

[]{#_Toc223897228 .anchor}Figure 6 Mockup: M-A5 --- 2FA Setup &
Verification

**Functional Requirements Derived from Mockup: M-A5 --- 2FA Setup &
Verification**

  -------------------------------------------------------------------------
  **Feature      **Functional Requirement (FR-ID:   **Business Rule**
  (derived from  Statement)**                       
  UI)**                                             
  -------------- ---------------------------------- -----------------------
  2FA Setup      FR-A5.1: The system shall display  This option is only
                 a QR code and a secret key for the available for
                 user to set up 2FA with an         email-based accounts.
                 authenticator app (e.g., Google    
                 Authenticator).                    

  2FA            FR-A5.2: The system shall require  2FA is mandatory for
  Verification   users with 2FA enabled to enter a  any user performing
                 6-digit code from their            actions valued over
                 authenticator app during login.    \$1,000 in a single
                                                    transaction.
  -------------------------------------------------------------------------

  : Table 11 Functional Requirements Derived from Mockup: M-C2

**Mockup: M-C2 --- User Onboarding**

![A screenshot of a computer AI-generated content may be
incorrect.](media/image8.png){width="5.576455599300087in"
height="3.4012806211723534in"}

[]{#_Toc223897229 .anchor}Figure 7 Mockup: M-C2 --- User Onboarding

**Functional Requirements Derived from Mockup: M-C2 --- User
Onboarding**

  -----------------------------------------------------------------------
  **Feature   **Functional Requirement (FR-ID: **Business Rule**
  (derived    Statement)**                     
  from UI)**                                   
  ----------- -------------------------------- --------------------------
  Role        FR-C2.1: The system shall        This selection tailors the
  Selection   present new users with a clear   initial dashboard view and
              choice to identify as either     onboarding tips. Users can
              \"I\'m a Client\" or \"I\'m a    use both roles later.
              Freelancer\".                    

  -----------------------------------------------------------------------

  : Table 12 Functional Requirements Derived from Mockup: M-C3

**Mockup: M-C3 --- freelancer Profile Creation/Editing**

![](media/image9.png){width="3.772681539807524in"
height="3.9109350393700786in"}

![A screenshot of a computer AI-generated content may be
incorrect.](media/image10.png){width="3.8010509623797026in"
height="3.340132327209099in"}

[]{#_Toc223897230 .anchor}Figure 8 Mockup: M-C3 --- Freelancer Profile
Creation/Editing

**Functional Requirements Derived from Mockup: M-C3 --- freelancer
Profile Creation/Editing**

  ------------------------------------------------------------------------
  **Feature       **Functional Requirement (FR-ID:   **Business Rule**
  (derived from   Statement)**                       
  UI)**                                              
  --------------- ---------------------------------- ---------------------
  Comprehensive   FR-C3.1: The system shall provide  A profile must be at
  Profile Form    a form with fields for name,       least 70% complete
                  professional title, biography,     before a freelancer
                  skills, and links to external      can submit proposals.
                  portfolios (e.g., GitHub).         

  Skill Tagging   FR-C3.2: The system shall allow    Users can add a
                  users to add relevant skills from  maximum of 15 skills
                  a predefined list or create new    to their profile.
                  ones.                              
  ------------------------------------------------------------------------

  : Table 13 Functional Requirements Derived from Mockup: M-C5

**Mockup: M-C5 --- Freelancer Dashboard**

![A screenshot of a computer AI-generated content may be
incorrect.](media/image11.png){width="6.332954943132108in"
height="3.438468941382327in"}

[]{#_Toc223897231 .anchor}Figure 9 Mockup: M-C5 --- Freelancer Dashboard

**Functional Requirements Derived from Mockup: M-C5 --- Freelancer
Dashboard**

  ------------------------------------------------------------------------
  **Feature    **Functional Requirement (FR-ID:      **Business Rule**
  (derived     Statement)**                          
  from UI)**                                         
  ------------ ------------------------------------- ---------------------
  Data Widgets FR-C5.1: The system shall display key Earnings can be
               metrics for freelancers, including    filtered by date
               active projects, submitted proposals, range (e.g., Last 30
               and total earnings.                   Days, All Time).

  Proposal     FR-C5.2: The system shall display a   N/A
  Status       list of submitted proposals with      
               their current status (e.g.,           
               Submitted, Viewed, Accepted,          
               Declined).                            
  ------------------------------------------------------------------------

  : Table 14 Functional Requirements Derived from Mockup M-C3.1

**Mockup: M-C3.1 --- Client Profile Creation/Editing**

![](media/image12.png){width="4.300270122484689in"
height="5.5217465004374455in"}

[]{#_Toc223897232 .anchor}Figure 10 Mockup: M-C3.1 --- Client Profile
Creation/Editing

**Functional Requirements Derived from Mockup M-C3.1 --- Client Profile
Creation/Editing**

  ------------------------------------------------------------------------
  Feature     Functional Requirement (FR-ID:       Business Rule
  (derived    Statement)                           
  from UI)                                         
  ----------- ------------------------------------ -----------------------
  Corporate   FR-C3.3: The system shall provide a  A client profile must
  Identity    form for clients with fields for     have a company name
  Form        company name, company logo, a brief  before a job can be
              description, and official website.   posted.

  Hiring      FR-C3.4: The system shall            This data is generated
  History     automatically populate and display   from on-chain activity
  Display     hiring statistics on the client\'s   and cannot be manually
              profile, including total spend,      edited by the client.
              number of jobs posted, and hire      
              rate.                                

  Payment     FR-C3.5: The system shall display a  The badge is
  Method      \"Verified Payment Method\" badge on automatically applied
  Status      the client profile once they have    and cannot be manually
              successfully connected their wallet  added.
              and funded at least one project.     
  ------------------------------------------------------------------------

  : Table 15 Functional Requirements Derived from Mockup: M-C4

**Mockup: M-C4 --- Client Dashboard**

![](media/image13.png){width="6.2134230096237975in"
height="3.3934853455818024in"}

[]{#_Toc223897233 .anchor}Figure 11 Mockup: M-C4 --- Client Dashboard

**Functional Requirements Derived from Mockup: M-C4 --- Client
Dashboard**

  -----------------------------------------------------------------------
  **Feature   **Functional Requirement (FR-ID:       **Business Rule**
  (derived    Statement)**                           
  from UI)**                                         
  ----------- -------------------------------------- --------------------
  Data        FR-C4.1: The system shall display key  Data displayed must
  Widgets     metrics for clients, including the     be updated in near
              number of active jobs, total proposals real-time (latency
              received, and total amount spent.      \< 1 minute).

  Recent      FR-C4.2: The system shall show a feed  The feed displays
  Activity    of recent activities, such as new      the 10 most recent
              proposals received or milestones       activities.
              approved.                              
  -----------------------------------------------------------------------

  : Table 16 Functional Requirements Derived from Mockup: M-P1

**Mockup: M-P1 --- freelancer Public Profile & Analytics**

![A screenshot of a computer AI-generated content may be
incorrect.](media/image14.png){width="5.6412379702537185in"
height="3.583030402449694in"}

[]{#_Toc223897234 .anchor}Figure 12 Mockup: M-P1 --- Public Profile &
Analytics

**Functional Requirements Derived from Mockup: M-P1 --- freelancer
Public Profile & Analytics**

  ------------------------------------------------------------------------
  **Feature     **Functional Requirement (FR-ID:       **Business Rule**
  (derived from Statement)**                           
  UI)**                                                
  ------------- -------------------------------------- -------------------
  Reputation    FR-P1.1: The system shall prominently  Users cannot hide
  Display       display the user\'s Trust Score, AI    their primary
                Capability Score (for freelancers),    reputation scores.
                and average star rating.               

  Work History  FR-P1.2: The system shall list the     Users can choose to
                user\'s completed projects, including  hide the budget of
                project title, client/freelancer, and  completed projects.
                feedback received.                     
  ------------------------------------------------------------------------

  : Table 17 Functional Requirements Derived from Mockup M-P1.1

**Mockup: M-P1.1 --- Client Public Profile & Analytics**

![](media/image15.png){width="5.551630577427821in"
height="3.5901727909011374in"}

[]{#_Toc223897235 .anchor}Figure 13 Mockup: M-P1.1 --- Client Public
Profile & Analytics

**Functional Requirements Derived from Mockup M-P1.1 --- Client Public
Profile & Analytics**

  ------------------------------------------------------------------------
  Feature      Functional Requirement (FR-ID:     Business Rule
  (derived     Statement)                         
  from UI)                                        
  ------------ ---------------------------------- ------------------------
  Reputation   FR-P1.3: The system shall          The AI Capability Score
  Display      prominently display the client\'s  is exclusive to
               Trust Score and their average star freelancers and will not
               rating as rated by freelancers.    be displayed on a
                                                  client\'s profile.

  Hiring       FR-P1.4: The system shall display  These statistics provide
  Analytics    key hiring metrics, including the  transparency for
               total number of jobs posted, the   freelancers and cannot
               overall hire rate, and the total   be hidden by the client.
               amount spent on the platform.      

  Review       FR-P1.5: The system shall display  The client\'s own
  History      a list of completed jobs with the  feedback left for
               feedback and ratings left by the   freelancers is visible
               freelancers for that client.       on the respective
                                                  freelancer\'s profile.
  ------------------------------------------------------------------------

  : Table 18 Functional Requirements Derived from Mockup: M-J1

**Module 2: Smart Contract Job Board**

**Mockup: M-J1 --- Job Posting Form**

![A screenshot of a computer AI-generated content may be
incorrect.](media/image16.png){width="3.281323272090989in"
height="2.9777307524059493in"} ![A screenshot of a computer AI-generated
content may be
incorrect.](media/image17.png){width="3.1807316272965878in"
height="2.934021216097988in"}

![A screenshot of a computer AI-generated content may be
incorrect.](media/image18.png){width="3.1213790463692037in"
height="2.834251968503937in"}

[]{#_Toc223897236 .anchor}Figure 14 Mockup: M-J1 --- Job Posting Form

**Functional Requirements Derived from Mockup: M-J1 --- Job Posting
Form**

  ------------------------------------------------------------------------
  **Feature    **Functional Requirement (FR-ID:      **Business Rule**
  (derived     Statement)**                          
  from UI)**                                         
  ------------ ------------------------------------- ---------------------
  Job Creation FR-J1.1: The system shall provide a   The job description
  Form         multi-step form for clients to enter  must contain a
               job details, including title,         minimum of 100
               description, category, and required   characters.
               skills.                               

  Budget &     FR-J1.2: The system shall allow the   The budget must be
  Deadline     client to set a project budget (fixed specified in a
               price or hourly) and a delivery       supported stablecoin
               deadline.                             (e.g., USDC).
  ------------------------------------------------------------------------

  : Table 19 Functional Requirements Derived from Mockup: M-J2

**Mockup: M-J2 --- Job Board**

![](media/image19.png){width="6.5in" height="3.64375in"}

[]{#_Toc223897237 .anchor}Figure 15 Mockup: M-J2 --- Job Board

**Functional Requirements Derived from Mockup: M-J2 --- Job Board**

  ------------------------------------------------------------------------
  **Feature    **Functional Requirement (FR-ID:        **Business Rule**
  (derived     Statement)**                            
  from UI)**                                           
  ------------ --------------------------------------- -------------------
  Search and   FR-J2.1: The system shall provide a     Search results can
  Filter       search bar and advanced filters (e.g.,  be sorted by
               by skill, budget range, client rating)  \"Newest\" or
               for freelancers to find jobs.           \"Best Match\".

  Job Listings FR-J2.2: The system shall display a     N/A
               list of jobs, with each entry showing   
               the job title, budget, and required     
               skills at a glance.                     
  ------------------------------------------------------------------------

  : Table 20 Functional Requirements Derived from Mockup: M-J3

**Mockup: M-J3 --- Job Details Page**

![A screenshot of a computer AI-generated content may be
incorrect.](media/image20.png){width="6.034201662292213in"
height="3.6998162729658794in"}

[]{#_Toc223897238 .anchor}Figure 16 Mockup: M-J3 --- Job Details Page

**Functional Requirements Derived from Mockup: M-J3 --- Job Details
Page**

  ------------------------------------------------------------------------
  **Feature    **Functional Requirement (FR-ID:   **Business Rule**
  (derived     Statement)**                       
  from UI)**                                      
  ------------ ---------------------------------- ------------------------
  Detailed     FR-J3.1: The system shall display  The page must also show
  View         the full job description,          the number of proposals
               client\'s work history, average    already submitted for
               rating, and total jobs posted.     the job.

  Apply Button FR-J3.2: The system shall provide  The button is disabled
               a clear call-to-action button for  if the freelancer has
               freelancers to submit a proposal.  already applied for the
                                                  job.
  ------------------------------------------------------------------------

  : Table 21 Functional Requirements Derived from Mockup: M-J4

**Mockup: M-J4 --- Proposal Submission Form**

![A screenshot of a computer AI-generated content may be
incorrect.](media/image21.png){width="4.001342957130359in"
height="4.173441601049869in"}

![A screenshot of a web page AI-generated content may be
incorrect.](media/image22.png){width="4.109206036745407in"
height="2.2645625546806647in"}

[]{#_Toc223897239 .anchor}Figure 17 Mockup: M-J4 --- Proposal Submission
Form

**Functional Requirements Derived from Mockup: M-J4 --- Proposal
Submission Form**

  ------------------------------------------------------------------------
  **Feature     **Functional Requirement (FR-ID:      **Business Rule**
  (derived from Statement)**                          
  UI)**                                               
  ------------- ------------------------------------- --------------------
  Proposal Form FR-J4.1: The system shall provide a   The proposal must
                text editor for freelancers to write  contain a minimum of
                their cover letter and outline their  50 words.
                approach.                             

  Fee           FR-J4.2: The system shall allow the   The proposed fee
  Submission    freelancer to specify their proposed  cannot be lower than
                fee, which breaks down the total      the platform\'s
                amount into the platform fee and      minimum project
                their final earnings.                 value.
  ------------------------------------------------------------------------

  : Table 22 Functional Requirements Derived from Mockup: M-J5

**Mockup: M-J5 --- Active Project Management**

![](media/image23.png){width="6.025577427821522in"
height="4.087864173228346in"}

[]{#_Toc223897240 .anchor}Figure 18 Mockup: M-J5 --- Active Project
Management

**Functional Requirements Derived from Mockup: M-J5 --- Active Project
Management**

  ------------------------------------------------------------------------
  **Feature     **Functional Requirement (FR-ID:     **Business Rule**
  (derived from Statement)**                         
  UI)**                                              
  ------------- ------------------------------------ ---------------------
  Milestone     FR-J5.1: The system shall display a  Milestones must be
  Tracking      list of project milestones with      funded in escrow
                their status (e.g., To Do, In        before work on them
                Progress, Awaiting Approval,         can begin.
                Complete).                           

  Deliverable   FR-J5.2: The system shall provide an All uploaded files
  Upload        interface for freelancers to upload  are stored on IPFS.
                and submit deliverables for each     
                milestone.                           
  ------------------------------------------------------------------------

  : Table 23 Functional Requirements Derived from Mockup: M-J6

**Mockup: M-J6 --- Submit Work/Milestone**

![A screenshot of a computer AI-generated content may be
incorrect.](media/image24.png){width="3.743623140857393in"
height="4.478219597550306in"}

[]{#_Toc223897241 .anchor}Figure 19 Mockup: M-J6 --- Submit
Work/Milestone

**Functional Requirements Derived from Mockup: M-J6 --- Submit
Work/Milestone**

  -------------------------------------------------------------------------
  **Feature      **Functional Requirement      **Business Rule**
  (derived from  (FR-ID: Statement)**          
  UI)**                                        
  -------------- ----------------------------- ----------------------------
  Submission     FR-J6.1: The system shall     A milestone can only be
  Form           provide a modal for           submitted if it is currently
                 freelancers to add comments   \"In Progress\".
                 and attach files when         
                 submitting a milestone for    
                 approval.                     

  Client         FR-J6.2: Upon submission, the The client has 7 days to
  Notification   system shall send an in-app   review and approve/request
                 and email notification to the revisions. If no action is
                 client to review the work.    taken, the milestone is
                                               auto-approved.
  -------------------------------------------------------------------------

  : Table 24 Functional Requirements Derived from Mockup: M-J7

**Module 3: Review & Feedback System**

**Mockup: M-J7 --- Review & Feedback Form**

![](media/image25.png){width="3.7022430008748906in"
height="4.025650699912511in"}

[]{#_Toc223897242 .anchor}Figure 20 Mockup: M-J7 --- Review & Feedback
Form

**Functional Requirements Derived from Mockup: M-J7 --- Review &
Feedback Form**

  -----------------------------------------------------------------------
  **Feature   **Functional Requirement (FR-ID: **Business Rule**
  (derived    Statement)**                     
  from UI)**                                   
  ----------- -------------------------------- --------------------------
  Rating      FR-J7.1: The system shall allow  A rating is mandatory to
  System      users to provide a 1-5 star      complete the feedback
              rating across multiple           process.
              categories (e.g., Communication, 
              Quality, Deadline).              

  Comment Box FR-J7.2: The system shall        The feedback is
              provide a text area for users to double-blind; neither
              leave a public comment about     party sees the other\'s
              their experience.                feedback until both have
                                               submitted or a 14-day
                                               window closes.
  -----------------------------------------------------------------------

  : Table 25 Functional Requirements Derived from Mockup: M-P2

**Module 5: Dispute Resolution**

**Mockup: M-P2 --- Dispute Initiation Form**

![A screenshot of a chat AI-generated content may be
incorrect.](media/image26.png){width="4.782731846019248in"
height="6.391811023622047in"}

[]{#_Toc223897243 .anchor}Figure 21 Mockup: M-P2 --- Dispute Initiation
Form

**Functional Requirements Derived from Mockup: M-P2 --- Dispute
Initiation Form**

  ------------------------------------------------------------------------
  **Feature    **Functional Requirement (FR-ID:      **Business Rule**
  (derived     Statement)**                          
  from UI)**                                         
  ------------ ------------------------------------- ---------------------
  Guided Form  FR-P2.1: The system shall guide the   A dispute can only be
               user through initiating a dispute by  initiated on an
               asking for the reason and a           active, funded
               description of the issue.             milestone.

  Evidence     FR-P2.2: The system shall allow the   Maximum of 5 files,
  Upload       user to upload initial evidence files 25MB each.
               (e.g., screenshots, documents) to     
               support their claim.                  
  ------------------------------------------------------------------------

  : Table 26 Functional Requirements Derived from Mockup: M-P3

**Mockup: M-P3 --- Dispute Voting Page**

![](media/image27.png){width="4.176587926509186in"
height="3.6344346019247595in"}

![A screenshot of a chat AI-generated content may be
incorrect.](media/image28.png){width="4.333297244094489in"
height="2.5536832895888013in"}

[]{#_Toc223897244 .anchor}Figure 22 Mockup: M-P3 --- Dispute Voting Page

**Functional Requirements Derived from Mockup: M-P3 --- Dispute Voting
Page**

  -----------------------------------------------------------------------
  **Feature     **Functional Requirement (FR-ID:    **Business Rule**
  (derived from Statement)**                        
  UI)**                                             
  ------------- ----------------------------------- ---------------------
  Evidence      FR-P3.1: The system shall present a Jurors must not have
  Review        neutral interface for jurors to     any prior work
                view all case details and evidence  history with either
                submitted by both parties.          party involved.

  Anonymous     FR-P3.2: The system shall provide   A juror\'s voting
  Voting        buttons for jurors to cast a        power is weighted
                confidential vote for either the    based on their trust
                \"Client\" or the \"Freelancer\".   score.
  -----------------------------------------------------------------------

  : Table 27 Functional Requirements Derived from Mockup: M-

**Module 6: AI Capability Prediction System**

**Mockup: M-P4 --- AI Capability Score Display**

![A screenshot of a computer AI-generated content may be
incorrect.](media/image29.png){width="6.283923884514436in"
height="4.040910979877515in"}

[]{#_Toc223897245 .anchor}Figure 23 Mockup: M-P4 --- AI Capability Score
Display

**Functional Requirements Derived from Mockup: M-P4 --- AI Capability
Score Display**

  --------------------------------------------------------------------------
  **Feature       **Functional Requirement (FR-ID:     **Business Rule**
  (derived from   Statement)**                         
  UI)**                                                
  --------------- ------------------------------------ ---------------------
  Score           FR-P4.1: The system shall display    The score is only
  Visualization   the AI-generated score (e.g.,        displayed for
                  \"Beginner,\" \"Intermediate,\"      freelancers who have
                  \"Expert\") with a clear label and   opted-in to the
                  an official-looking badge.           profile scan.

  Explanatory     FR-P4.2: The system shall provide a  N/A
  Tooltip         tooltip explaining that the score is 
                  an AI-generated estimate based on    
                  the freelancer\'s profile data and   
                  skill verifications.                 
  --------------------------------------------------------------------------

  : Table 28 Functional Requirements Derived from Mockup: M-P5

**Mockup: M-P5 --- Skill Verification Hub**

![](media/image30.png){width="6.5in" height="3.1152777777777776in"}

[]{#_Toc223897246 .anchor}Figure 24 Mockup: M-P5 --- Skill Verification
Hube

**Functional Requirements Derived from Mockup: M-P5 --- Skill
Verification Hub**

  ------------------------------------------------------------------------
  **Feature    **Functional Requirement (FR-ID:     **Business Rule**
  (derived     Statement)**                         
  from UI)**                                        
  ------------ ------------------------------------ ----------------------
  Skill List & FR-P5.1: The system shall list all   Verified skills will
  Status       of a freelancer\'s skills, each with be given more weight
               a status tag (\"Verified\" or \"Not  by the AI capability
               Verified\").                         model.

  Test         FR-P5.2: The system shall provide a  A freelancer can
  Initiation   \"Start Verification Test\" button   attempt a specific
               next to each unverified skill that   skill test once every
               has a test available.                30 days.
  ------------------------------------------------------------------------

  : Table 29 Functional Requirements Derived from Mockup: M-P6

**Mockup: M-P6 --- Skill Verification Test (Microtask)**

![](media/image31.png){width="5.277615923009624in"
height="4.1533070866141735in"}

[]{#_Toc223897247 .anchor}Figure 25 Mockup: M-P6 --- Skill Verification
Test (Microtask)

**Functional Requirements Derived from Mockup: M-P6 --- Skill
Verification Test (Microtask)**

  -----------------------------------------------------------------------
  **Feature   **Functional Requirement (FR-ID:   **Business Rule**
  (derived    Statement)**                       
  from UI)**                                     
  ----------- ---------------------------------- ------------------------
  Test        FR-P6.1: The system shall present  The test must be
  Interface   a clean, focused interface for the completed in a single,
              skill test, such as a              timed session.
              multiple-choice quiz or an         
              embedded code editor.              

  Timer       FR-P6.2: The system shall display  If the timer runs out,
              a countdown timer for the duration the test is
              of the test.                       automatically submitted
                                                 with the completed
                                                 answers.
  -----------------------------------------------------------------------

  : Table 30 Functional Requirements Derived from Mockup: M-P7

**Mockup: M-P7 --- Test Results Page**

![](media/image32.png){width="3.7424343832020996in"
height="4.469850174978128in"}

[]{#_Toc223897248 .anchor}Figure 26 Mockup: M-P7 --- Test Results Page

**Functional Requirements Derived from Mockup: M-P7 --- Test Results
Page**

  ------------------------------------------------------------------------
  **Feature     **Functional Requirement (FR-ID:         **Business Rule**
  (derived from Statement)**                             
  UI)**                                                  
  ------------- ---------------------------------------- -----------------
  Outcome       FR-P7.1: The system shall immediately    The result is
  Display       display a clear result after the test is final and cannot
                submitted (\"Skill Verified!\" or \"Try  be appealed.
                Again\").                                

  Status Update FR-P7.2: Upon a successful result, the   N/A
                system shall automatically update the    
                skill\'s status to \"Verified\" across   
                the platform.                            
  ------------------------------------------------------------------------

  : Table 31 Functional Requirements Derived from Mockup: M-S1

**Module 7: Admin Dashboard**

**Mockup: M-S1 --- Admin Dashboard**

![A screenshot of a computer AI-generated content may be
incorrect.](media/image33.png){width="6.5in"
height="4.214583333333334in"}

[]{#_Toc223897249 .anchor}Figure 27 Mockup: M-S1 --- Admin Dashboard

**Functional Requirements Derived from Mockup: M-S1 --- Admin
Dashboard**

  ------------------------------------------------------------------------
  **Feature   **Functional Requirement (FR-ID: **Business Rule**
  (derived    Statement)**                     
  from UI)**                                   
  ----------- -------------------------------- ---------------------------
  Platform    FR-S1.1: The system shall        Access is restricted to
  Metrics     display high-level platform      users with the
              health metrics, including total  \"Administrator\" role.
              users, total value in escrow,    
              and active disputes.             

  Flagged     FR-S1.2: The system shall        Administrators cannot
  Disputes    provide a section for            overturn a jury\'s decision
              administrators to review         but can suspend users who
              disputes that have been flagged  repeatedly abuse the
              for potential collusion or       system.
              arbitration abuse.               
  ------------------------------------------------------------------------

  : Table 32 Functional Requirements Derived from Mockup: M-S2

**Module 8: Notification and Communication System**

**Mockup: M-S2 --- In-App Messaging**

![A screenshot of a chat AI-generated content may be
incorrect.](media/image34.png){width="5.853222878390201in"
height="4.185429790026247in"}

[]{#_Toc211345240 .anchor}Figure 28 Mockup: M-S2 --- In-App Messaging

**Functional Requirements Derived from Mockup: M-S2 --- In-App
Messaging**

  -----------------------------------------------------------------------
  **Feature   **Functional Requirement (FR-ID:     **Business Rule**
  (derived    Statement)**                         
  from UI)**                                       
  ----------- ------------------------------------ ----------------------
  Real-Time   FR-S2.1: The system shall provide a  All chat history is
  Chat        real-time chat interface within the  archived and can be
              project workspace for clients and    submitted as evidence
              freelancers to communicate.          in a dispute.

  File        FR-S2.2: The system shall allow      Shared files are
  Sharing     users to share files directly within stored on IPFS.
              the chat interface.                  
  -----------------------------------------------------------------------

  : Table 33 Functional Requirements Derived from Mockup: M-S3

**Mockup: M-S3 --- Notification Center**

![A screenshot of a computer AI-generated content may be
incorrect.](media/image35.png){width="4.23216426071741in"
height="3.4553641732283467in"}

[]{#_Toc223897251 .anchor}Figure 29 Mockup: M-S3 --- Notification Center

**Functional Requirements Derived from Mockup: M-S3 --- Notification
Center**

  --------------------------------------------------------------------------
  Feature        Functional Requirement (FR-ID:    Business Rule
  (derived from  Statement)                        
  UI)                                              
  -------------- --------------------------------- -------------------------
  Notification   FR-S3.1: The system shall display The list shall display a
  List           a chronological list of the       maximum of the 10 most
                 user\'s most recent notifications recent notifications.
                 (e.g., new proposal, milestone    
                 approved).                        

  Unread         FR-S3.2: The system shall         Clicking on a
  Indicator      visually distinguish between read notification shall mark
                 and unread notifications and      it as read and navigate
                 display a badge with a count of   the user to the relevant
                 unread notifications on the bell  page.
                 icon.                             

  Mark All as    FR-S3.3: The system shall provide Clicking this button will
  Read           a \"Mark all as read\" button     update the status of all
                 within the notification center.   unread items and remove
                                                   the count badge from the
                                                   bell icon.
  --------------------------------------------------------------------------

  : Table 34 Functional Requirements Derived from Mockup: M-S4

**Mockup: M-S4 --- Notification Settings Page**

![](media/image36.png){width="4.4205500874890635in"
height="3.6823720472440944in"}

[]{#_Toc223897252 .anchor}Figure 30 Mockup: M-S4 --- Notification
Settings Page

**Functional Requirements Derived from Mockup: M-S4 --- Notification
Settings Page**

  -------------------------------------------------------------------------
  Feature        Functional Requirement (FR-ID:      Business Rule
  (derived from  Statement)                          
  UI)                                                
  -------------- ----------------------------------- ----------------------
  Notification   FR-S4.1: The system shall provide   Users can set
  Controls       toggle switches for users to enable preferences for each
                 or disable notifications for        channel independently
                 specific event categories (e.g.,    (In-App, Email).
                 \"New Proposals,\" \"Project        
                 Messages,\" \"Payment Updates\").   

  Channel        FR-S4.2: The system shall allow     Critical security
  Preferences    users to choose their preferred     notifications (e.g.,
                 channel for receiving notifications password reset) are
                 (e.g., enable email but disable     mandatory and cannot
                 in-app for certain events).         be disabled.
  -------------------------------------------------------------------------

  : Table 35 Technologies, Components, and Security Mechanisms Used in
  System Architecture

## Non-Functional Requirements

This section specifies non-functional requirements (NFRs) other than
constraints (recorded in Section 2.3) and external interface
requirements (described in Section 7). Non-functional requirements
define the quality attributes of the system, such as reliability,
usability, performance, and security.

.

### Reliability 

***REL-1:** The system\'s off-chain components (web server, APIs) shall
be highly available. The application should handle temporary connection
losses to the blockchain network gracefully, informing the user of the
status without crashing.*

***REL-2:** The smart contracts shall be developed following industry
security best practices (e.g., OpenZeppelin standards) and tested
against common vulnerabilities (e.g., reentrancy). The contracts shall
include an emergency-stop (pausable) mechanism controllable by the
system administrator.*

***REL-3:** The system shall ensure all on-chain actions are atomic. All
feedback and transaction records stored on-chain shall be considered
final and irreversible once confirmed by the network.*

### Usability

***USE-1:** A new user familiar with crypto wallets should be able to
connect their wallet, create a profile, and perform a core action (post
a job or submit a proposal) in under 10 minutes.*

***USE-2:** The user interface shall abstract away blockchain
complexities. Users will interact with clear buttons (e.g., \"Fund
Project,\" \"Approve Milestone\") and will not need to manually handle
smart contract addresses or technical transaction details.*

***USE-3:** The system shall provide immediate and clear visual feedback
for the status of all significant actions, especially asynchronous ones
like blockchain transactions (e.g., \"Funding Escrow\...\",
\"Transaction Confirmed\").*

### Performance

***PERF-1:** The user interface shall update to reflect the confirmed
status of on-chain transactions (e.g., escrow funded) within 60 seconds
of the user signing the transaction, contingent on the Layer-2
network\'s confirmation time.*

***PERF-2:** The AI capability score for a freelancer profile shall be
generated and displayed within 60 seconds of the user initiating the
scan.*

***PERF-3:** The web application\'s main pages (Dashboard, Job Board)
shall achieve a Largest Contentful Paint (LCP) of under 4 seconds on a
standard broadband connection.*

### Security 

***SEC-1:** All communication between the client-side DApp and any
off-chain backend services shall be encrypted using TLS 1.3 (HTTPS) when
deployed .*

***SEC-2:** The system shall operate non-custodially. User private keys
will never be stored or handled by the system; all transactions must be
signed by the user through their external wallet application.*

***SEC-3:** The system will implement role-based access control for
administrative functions to prevent unauthorized changes to
platform-level smart contract parameters.*

***SEC-4:** To ensure data integrity and reduce on-chain costs, large
files (e.g., portfolio items, dispute evidence) will be stored on IPFS,
with only the resulting hash being logged on the blockchain.*

### Maintainability

***MAIN-1:** The source code for both the smart contracts and the web
application will be well-commented, particularly for complex logic
involving financial calculations or state changes.*

***MAIN-2:** The application will be architected in a modular fashion to
allow for future upgrades or changes to individual components (e.g., the
trust scoring algorithm, the AI model) with minimal impact on the rest
of the system.*

## External Interface Requirements

This section provides information to ensure that the system will
communicate properly with users and with external hardware or software
elements. A complex system with multiple subcomponents should create a
separate interface specification or system architecture specification.
The interface documentation could incorporate material from other
documents by reference. For instance, it could point to a hardware
device manual that lists the error codes that the device could send to
the software.

### User Interfaces Requirements

***UI-1: GUI Standards and Style Guide:** The application will adhere to
a consistent and modern design system to ensure a professional and
intuitive user experience. This includes standardized fonts (e.g.,
Inter), icons, button styles, color schemes, and component layouts.*

***UI-2: Responsive Design:** The web application must be fully
responsive, providing an optimal and seamless user experience on all
major devices, including desktops, tablets, and mobile phones.*

***UI-3: Navigational Consistency:** The system will feature a
persistent and clear navigation structure for logged-in users, allowing
easy access to the Dashboard, Job Board, Active Projects, and Profile
settings.*

***UI-4: Message Display Conventions:** The system will use
non-intrusive \"toast\" notifications to provide feedback to the user
for actions like successful submissions, pending transactions, or
errors. Critical alerts may use modals to ensure they are acknowledged.*

### Software interfaces

SI-1: Blockchain Network Interface

*SI-1.1: The system shall interface with a public JSON-RPC endpoint of
an Ethereum-compatible Layer-2 network (e.g., Polygon) to read data from
smart contracts and to broadcast signed transactions for execution.*

SI-2: User Wallet Interface

*SI-2.1: The system shall integrate with browser-based Ethereum wallet
extensions via the window.ethereum provider API (for wallets like
MetaMask) and WalletConnect for connections to mobile and other desktop
wallets. This interface is used exclusively for authentication and
prompting the user to sign transactions.*

SI-3: Decentralized Storage Interface

*SI-3.1: The system shall use a client-side library or a gateway API to
interact with the InterPlanetary File System (IPFS) for uploading and
retrieving large files, such as portfolio items and dispute evidence.*

### Hardware interfaces

As DeTrust is a web-based decentralized application, it does not
directly interface with any specialized hardware components. All
interactions are handled through the user\'s standard computer or mobile
device.

### Communications interfaces

CI-1: Blockchain Node Communication

*CI-1.1: The client-side application will communicate with a blockchain
node provider (e.g., Infura, Alchemy) over a secure WebSocket (WSS) or
HTTPS connection to receive real-time event updates from the smart
contracts and to query the state of the blockchain.*

CI-2: Off-Chain Notifications

*CI-2.1: The system may use a lightweight backend service to manage
off-chain notifications. This service will use WebSockets to push
real-time alerts to the user\'s browser (e.g., \"You have received a new
proposal\").*

*CI-2.2: For critical asynchronous events (e.g., dispute resolution
outcomes, password resets for email accounts), the system shall send
notifications to the user\'s registered email address via an external
email service.*

# Chapter 3: Design and Architecture

This chapter explains the overall architectural design of the DeTrust
system in a clear and structured way. It describes how the system is
organized, how its main components interact with each other, and which
architectural style guides the solution. The chapter also includes UML
diagrams to illustrate how key processes flow through the system. In
addition, it outlines the data design, covering both on-chain and
off-chain storage. Together, these details provide a complete technical
blueprint that supports the development, testing, and deployment of the
platform.

## System Architecture Overview

This section describes the overall external architecture of the software
system, which reflects the system\'s conceptual design, major
components, services, technologies, and security considerations. The
system adopts Hybrid **Monolithic Architecture**, combining the
simplicity and unified development of a monolith with specific
decentralized and microservice components where necessary (Blockchain
and AI).

### Purpose

To provide a conceptual view of the system that illustrates the
big-picture design, showing where each module resides, what technologies
are used, and how data and control flow between system components.

## Conceptual Architectural Diagram

**\
**The DeTrust system is built as a decentralized web application (DApp)
within a monorepo structure. It unifies the frontend and backend API
into a cohesive development unit while integrating specialized services
for AI and Blockchain interactions.

![](media/image37.png){width="7.231405293088364in"
height="7.81007217847769in"}

**Module Descriptions:**

-   **Frontend (Web App)**: Built with Next.js 15, this module serves as
    the presentation layer. It handles user interactions, wallet
    connectivity (via RainbowKit/Wagmi), and real-time updates. It is
    tightly integrated with the backend in the monorepo for type safety
    and shared utilities.

-   **Backend Services/API**: The core logic hub built with Express.js.
    It manages traditional business operations (User profiles, Job CRUD,
    Chat) and acts as an orchestrator for off-chain data.

-   **Database Layer**: Utilizes PostgreSQL for structured, relational
    data (Users, Jobs, Reviews) and Redis for high-performance caching
    and session management.

-   **Authentication and Authorization**: A hybrid system supporting
    both Web3 (Wallet Signatures) and Web2 (Email/Password)
    authentication. It uses JWT for session management across the
    platform.

-   **Admin Panel**: Integrated directly into the web application,
    providing privileged access to system metrics, dispute oversight,
    and user management.

-   **AI Capability Service**: A specialized Python microservice that
    performs heavy computational tasks---analyzing freelancer profiles
    and running capability prediction models---keeping the main
    application lightweight.

-   **Blockchain Layer**: Consists of Solidity smart contracts deployed
    on Polygon. This \"decentralized backend\" handles high-trust
    operations: Escrow, Reputation Registry, and Dispute Voting.

-   **External Integrations**:

    -   **IPFS**: Used for decentralized, immutable storage of large
        files (Evidence, Portfolios).

        1.  ### Technologies and Services

  -----------------------------------------------------------------------
  **Component**     **Description**   **Technology      **Security
                                      Used**            Mechanism**
  ----------------- ----------------- ----------------- -----------------
  **Frontend App**  User-facing       React.js /        SSL/TLS, Zod
                    interface for     Next.js, Tailwind Validation,
                    clients and                         Wallet
                    freelancers to                      integration
                    manage jobs,                        
                    proposals,                          
                    reviews,                            
                    disputes, and                       
                    dashboards                          

  **Admin Panel**   Administrative    React.js,         Role-Based
                    interface for     TanStack Query    Access(Admin
                    managing users,                     Only)
                    disputes,                           
                    analytics, and                      
                    system settings                     

  **Backend API**   Handles core      Node.js /         JWT Tokens, Rate
                    business logic:   Express.js        Limiting, API Key
                    job posting,                        Validation,
                    proposals, escrow                   Helmet
                    workflow,                           
                    reviews,                            
                    disputes, trust                     
                    scoring,                            
                    notifications                       

  **Database        Primary Data      PostgreSQL 16,    Encryption
  Layer**           Storage           Prisma            Storage,
                                                        Parameterized
                                                        Queries

  **Blockchain      Handles smart     Solidity,         Audited
  Service**         contract          Polygon, Hardhat  Contracts,
                    interactions,                       Reentrancy Guards
                    escrow payments,                    
                    dispute voting,                     
                    and on-chain                        
                    review hashing                      

  **IPFS Storage**  Decentralized     IPFS Network      CID Validation,
                    storage for                         Immutable Hash
                    dispute evidence,                   Storage
                    review comments,                    
                    and large assets                    

  **AI Capability   Generates         Python 3.11/ Fast Internal API
  Engine**          capability and    API               Keys, Input
                    skill predictions                   Sanitization
                    based on user                       
                    profiles and                        
                    achievements                        
  -----------------------------------------------------------------------

  : Table 36 Data Dictionary for User Entity

##  Architecture Style / Pattern

### Architectural diagram

After presenting the conceptual architecture, we describe the internal
architecture pattern used to decompose the system.

-   **Selected Pattern**: **Hybrid Monolithic Architecture**.

-   **Justification**:

    -   **Unified Development**: The core application (Frontend +
        Backend) resides in a Turborepo monorepo, allowing for shared
        types, config, and streamlined CI/CD. This reduces complexity
        compared to a full microservices architecture.

    -   **Specialized Scaling**: While the core is monolithic, the **AI
        Service** is separated (Microservice pattern) to handle distinct
        computational loads (Python/ML stack vs Node.js/IO stack).

    -   **Decentralized Extension**: The **Blockchain** acts as a third,
        decentralized component, handling trust-critical logic (Escrow,
        Reputation) that cannot reside in a centralized server.

    -   **Performance**: This hybrid approach offers the low latency of
        a monolith for standard user actions (browsing jobs, chatting)
        while leveraging the security of

> blockchain for payments.

![](media/image38.png){width="8.36111111111111in"
height="8.626388888888888in"}

[]{#_Toc223897254 .anchor}Figure 32 Architectural diagram

**Interactions among Components:**

1.  **User Interaction**: The user interacts with the **Presentation
    Layer**. Standard requests (e.g., \"View Profile\") are sent to
    the **Business Logic Layer** via REST API.

2.  **Financial Transactions**: For payments, the Presentation Layer
    bypasses the backend and interacts directly with the **Decentralized
    Logic Layer** (Smart Contracts) via the user\'s wallet.

3.  **Data Synchronization**: The Business Logic Layer listens for
    events from the Decentralized Layer (e.g., \"PaymentReleased\") and
    updates the **Data Persistence Layer** (PostgreSQL) to keep the UI
    in sync.

4.  **AI Analysis**: When a freelancer updates their profile, the
    Business Logic Layer asynchronously triggers the external AI Service
    to re-calculate capability scores.

## Design Models

### Design Models for Object Oriented Development Approach

This section includes essential design diagrams for core areas of the
system.

### Activity Diagrams:

#### *Client Job Posting & Escrow Funding*

![A flowchart of a document AI-generated content may be
incorrect.](media/image39.png){width="4.526906167979003in"
height="7.598591426071741in"}

[]{#_Toc223897255 .anchor}Figure 33 Activity Diagrams for Client Job
Posting & Escrow Funding

#### *Freelancer Proposal & Contract Formation*

> ![A diagram of a work flow AI-generated content may be
> incorrect.](media/image40.png){width="6.5in"
> height="7.522916666666666in"}

[]{#_Toc223897256 .anchor}Figure 34 Activity Diagrams for Freelancer
Proposal & Contract Formation

#### Milestone Delivery & Payment Release

![A flowchart of a work process AI-generated content may be
incorrect.](media/image41.png){width="5.04929571303587in"
height="7.668132108486439in"}

[]{#_Toc223897257 .anchor}Figure 35 Activity Diagrams Milestone Delivery
& Payment Release

#### Dispute Resolution Process

![PLDBRzf04BvRydyOvLAGAaNjqLoI4YorwYC5qXoY7hRs01FMEtHt34NAZ\--ilGuayG7PpBVVOsRsAeZnqZOspuJ48bnNGdkI8zoGMNlJ5FeITgqWp36mRONOmQtd2aF8ipnx-kn8o0Xx64qjePFBqYDQuohquwSywmJohD1YjOMB1CU1zcAYjGLQhEHCoGHsiN2tisngcEsfHYLKYOqHiBmExw4aYs4yYIQAHQCYC6KdtYZHLwws8RfyZBHbw-hGoHo3O0EzMe0lhMSVO4z65LNOTDaM5NkCwEyij3ecDDO9tkkbetFS4nxEx7sov6fxZAu6pDG4WL-iiKQbsMkRtdQfutmNxTVKUVXGn1Farl2ZbOeRp3DQmMWCia47euUVBVks0NKOUrLjiBvS4luUvndeKyp-2RfweBX5JrnFKcsEVrjKHzTrhsNiALW7k3Sai5AV9SNY3LOKg9i6sg0X7hwPH_RTXgJIuE5P_zKqbiPgvD0rOP3fVyypVopWdfn3hxo2lb7r-7yFV97-l8s3Pigsqb73B5IU3_tOGJWXat0AqNESPl2An-e6uXkY4tmWK_Ehyq25hh1u-XEtUCbRZBqv6DyVVzddgUNmV0lYbiIbIuJnrl0kpwxqM-\_cVm00
(683×899)](media/image42.png){width="5.823943569553806in"
height="7.6694378827646545in"}

[]{#_Toc223897258 .anchor}Figure 36 Activity Diagrams Dispute Resolution
Process

#### Automated AI Capability Assessment

![LL8zRzim4Dq5y3ySjDG6KWHTxIMAd2OU6XWrqgNeG5Cdvn2AP8-dfWRoutkIR1NM9jpJ-zHT5ilITzuKGk8HAYVqX-G46x97jjqAgbvYPmKRgBPGssGFv0U0AKpnyPKHlGqE-SCK8vSfLdNiaaT1s75iIKbleOuXe1FOHPOsUefhnNt7tprcWVAQUEziADS3_Mf_oe8TFFmLjauoRAnOKopsR-Hzle57agV-C7k-WHfPg2LdXMB8oq5an_WvSNIOfy-XZJma-HORzAFAfy5TGyCdy6KrWVPzgpI4mPrCGIqibY2l663nSnlovIOZzjVI5A2Fnf6U0vIr3I6A9lAkzrfS2G_CaTTdc9RI9O6NZ0mIeMeQzS886nHBFYiCVKPLkZOY_tNw0BMtESz9vp3Z_H43ikfUTweIqtrnZqVIDLXdsGP1xh2X0NwhFISjS7acEjEzf6QuZdulWxwJl4wS5z5AxHmr_0zajOLD2VUsEI9eTpObhqOFVWO_HrtfD5765fxnVIP3NQ8TLiaIaodkz5t_pdy0
(497×696)](media/image43.png){width="5.176388888888889in"
height="7.253472222222222in"}

[]{#_Toc223897259 .anchor}Figure 37 Activity Diagrams Automated AI
Capability Assessment

#### Skill Verification (Microtask)

![bLDDRzD04BrRydyO-K8YbHJeBG7Ku524H52fKow8mzIUs4isNcjdJ6hK7y_u8rOQJlYmrkw-UVFcpUmr2tgfzpOCn8WbMAPYVXjfO6KmzxYV0oGxOory9s-s9aKnhWo3C7YwyKGMovJyKnXqD64mJyXIAaE8k3wgWGdDyja5t16cCll5quL2OslI7KH96_cC7JR44YtQ92yWTcLckjFNS_XeJMuUZ6trnGMbkp0mMvXCGGegOVAZ3QGCJ0aMMU3g5MJOyCzf681-yvNXoc83KUoSpToXxAkb2DR4Z3aj1c1Ik0EiK0YspiDNUXHOYj2-4aMGPT9SlHPB8_iNXnciJUgT8E_W4hxLveykgadbyyZTrHkxkfHEmiRioG-N0-IUoSEov0Dv_eUWNq-DUJFlI7f7eC2gef8XgxqfSn2DlXY3j4mgnQ2r3LZ2h4CuuFfXRvYxplOYsmCPDKpMMDPeGSrOrk9UTdYPZYKrQliUFddCY24PoReMdgkzciCjCb_UeB7zxRCM9gdp16yxJAjkKtZYGjjrzBdBk4Q_qsdYsWeWGzIIKHOjJY1tf4pPiM-WcM-zsohi59JKUQu6GI9rri1QE-xLdAFLGwTxIU_V\_QUc5dscwRxAsg7gNuSEWjJSsX_rqty6_k2SAbj-XXWh78Q-at9KfuvkTHpxN_i4NHK6rxhNv_mN
(692×786)](media/image44.png){width="6.5in"
height="7.382638888888889in"}

[]{#_Toc223897260 .anchor}Figure 38 Activity Diagrams Skill Verification
(Microtask)

#### Review & Trust Score Update

![LLAnRkCm3DqD-1-83dVsS2WotE8iRPC6mHL5W_YA3iKDiipOH6J9aEWK0VhnHocDWNeJ-VpUuoFl0YlFqs3oZ8aDmhrcEX6VOKsgysge0FPu8lo07_3NJu6XriuZl8wjOiopFFjy3UYXM1b2oxSRZsYKrUZBppnBx7bM_N4DF2j_n1PKW9KRHeECxL9QBoDQs22sZT97s3W_n6ezDGCnx1MJxQ1O_FeDjN25Kcp8xuD8BQDuLPy3um2FLllpo65cIYGSdSxSMnLwS1OUZDD7tIkoYUAd4DgMcAIrg63Les3f08vxcMkK0SxGYskVOi0spwHPb21j2yNxIuBj4co7GcIxVsMUWNnLtRiFk7bJbAOuE3-RkOdZy1IMNyWdnF4Qz9RQ5gCtD055uK6S907209TW9BjPP8rfT4Ym2yLCkviQGs4k0pj89Gqxxmvay8hymk-HFU49nKEGy4Wh8qDvSJx4dS9QiLhEMEdgoSWPVBkCuWsfwyKXt9-wyeg-tCiteEIzbfKqJlbu2J6xGro8A8zvTYTlkSl\_
(537×722)](media/image45.png){width="5.591666666666667in"
height="7.520833333333333in"}

[]{#_Toc223897261 .anchor}Figure 39 Activity Diagrams Review & Trust
Score Update

### ![](media/image46.png){width="8.165277777777778in" height="8.330555555555556in"}Class Diagram:

### Sequence Diagrams:

#### Job posting and proposal submission:

> ![A diagram of a job posting AI-generated content may be
> incorrect.](media/image47.png){width="6.5in"
> height="5.618055555555555in"}

[]{#_Toc223897263 .anchor}Figure 41 sequence diagram for Job posting and
proposal submission

#### Escrow creation and work completion approval:

> ![A screenshot of a computer program AI-generated content may be
> incorrect.](media/image48.png){width="6.62405949256343in"
> height="7.476828521434821in"}

[]{#_Toc223897264 .anchor}Figure 42 sequence diagram for Escrow creation
and work completion approval

#### Feedback submission (client and freelancer):

#### ![A diagram of a customer feedback system AI-generated content may be incorrect.](media/image49.png){width="6.815533683289589in" height="7.308270997375328in"} {#a-diagram-of-a-customer-feedback-system-ai-generated-content-may-be-incorrect. .list-paragraph}

[]{#_Toc223897265 .anchor}Figure 43 sequence diagram for Feedback
submission (client and freelancer)

#### Feedback retrieval/viewing:

![A diagram of a customer feedback system AI-generated content may be
incorrect.](media/image50.png){width="6.967420166229221in"
height="7.466165791776028in"}

[]{#_Toc223897266 .anchor}Figure 44 Sequence Diagram for Feedback
retrieval

####  Trust scoring 

> ![A diagram of a trust scoring diagram AI-generated content may be
> incorrect.](media/image51.png){width="6.612742782152231in"
> height="7.090225284339458in"}

[]{#_Toc223897267 .anchor}Figure 45 sequence diagram Trust scoring

#### Dispute creation and evidence submission:

> ![A diagram of a system AI-generated content may be
> incorrect.](media/image52.png){width="6.56875in"
> height="7.030075459317585in"}

[]{#_Toc223897268 .anchor}Figure 46 Sequence Diagram for Dispute
Creation & Evidence

#### Juror voting and resolution execution:

![A screenshot of a diagram AI-generated content may be
incorrect.](media/image53.png){width="6.879166666666666in"
height="7.421052055993001in"}

[]{#_Toc223897269 .anchor}Figure 47 Sequence Diagram for Jury Voting &
Resolution Execution

#### AI capability prediction:

> ![A diagram of a software application AI-generated content may be
> incorrect.](media/image54.png){width="6.295138888888889in"
> height="6.413533464566929in"}

[]{#_Toc223897270 .anchor}Figure 48 sequence diagram for AI capability
prediction system

#### ![](media/image55.png){width="6.90625in" height="7.157638888888889in"}Notification and Communication Sequence Diagram:

### State diagrams:

#### Dispute Resolution

> ![A diagram of voting process AI-generated content may be
> incorrect.](media/image56.png){width="6.17837489063867in"
> height="6.926345144356955in"}

[]{#_Toc223897272 .anchor}Figure 50 State diagrams Dispute Resolution

#### Skill Verification Lifecycle

![](media/image57.png){width="5.834722222222222in"
height="7.602996500437445in"}

[]{#_Toc223897273 .anchor}Figure 51 State diagrams for Skill
Verification Lifecycle

#### Freelancer Proposal Lifecycle

![TPF1Ri8m38RlbVeE4IUOX7RdC85WI9CsWK3Q3jCE9dKXB4rHOc1x-oLfwZB6Rh7_pqxoEnax0al7IkSPAT8erWI4OgPWQw4QYRb5r60aMh6qzQ5seCMpAb5-IurvbcSkyhsPXP9w0fo8AywlZvjA4M4HDOvOVrLuJcApx2ftjIMj7DTsCJDFXj2UV9qosmXnWf69b7XeUxG1golSespLDc3rJT6ki70sKUQ8zSUlWxAfEAs39Uzt7s8uV6YS42CHBMxTwmy2qaW1Oai26DUNPCVnxfuhK2DXr9fsNPE0DaPwJcg5XXO7D2vmlwdBXYLFUOLaGT8DFbtGq_jwCzMrmw8_4FV-C51ePN09BgR2UT89ulswiVdI2kpdnCtXL5j56E0BjFK_tb26dbS0JpTuXQPuGUTWYyc3Yut-m642qnr4kwx1szlcMTSWKEtJILiloXAjlxzN82efSLtsNtDk5w3mO4PYMflelPXQXFWCkJX1UTODZLFjN3YHPsD_GF-bVm00
(650×962)](media/image58.png){width="5.255638670166229in"
height="7.77546697287839in"}

[]{#_Toc223897274 .anchor}Figure 52 State diagrams for Freelancer
Proposal Lifecycle

#### User Profile & Trust State

![](media/image59.png){width="6.247623578302712in"
height="8.127819335083114in"}

[]{#_Toc223897275 .anchor}Figure 53 State diagrams for User Profile &
Trust State

## Data Design

This section explains how the information domain of the system is
transformed into data structures and describes how major data entities
are stored, processed, and organized.

**Data Storage and Management**

The DeTrust platform utilizes a hybrid data storage approach to balance
performance, security, and decentralization.

**Data Storage Items:**

1.  **Relational Database (PostgreSQL)**:

    -   **Purpose**: Stores structured, mutable data that requires
        complex querying and high integrity but does not need to be
        on-chain.

    -   **Entities**: User Profiles, Job Listings (Draft/Open), Chat
        Messages, Notifications, Skill Metadata.

    -   **Hosting**: Managed PostgreSQL instance (e.g., Supabase/AWS
        RDS).

2.  **In-Memory Cache (Redis)**:

    -   **Purpose**: Provides high-speed access for frequently accessed
        data and manages ephemeral state.

    -   **Usage**: User Sessions (JWT blacklists), Job Queues (BullMQ
        for background tasks), Real-time socket presence.

3.  **Decentralized Storage (IPFS)**:

    -   **Purpose**: Stores large, immutable files to avoid bloating the
        blockchain or centralized database.

    -   **Entities**: User Portfolios, Job Attachments, Dispute
        Evidence, Contract Deliverables.

    -   **Mechanism**: Files are uploaded to IPFS (via Pinata), and only
        the content hash (CID) is stored in the Database or Smart
        Contract.

4.  **Blockchain Ledger (Polygon)**:

    -   **Purpose**: Acts as the immutable \"source of truth\" for
        high-value transactions and trust metrics.

    -   **Entities**: Escrow Balances, Smart Contract States (Funded,
        Disputed), Reputation Scores (hashes), Dispute Resolutions.

**Data Dictionary**

The following tables define the data structure for the core system
entities.

**User Entity**

Represents the core identity of a platform user.

  ------------------------------------------------------------------------------
  Attribute       Type      Constraints       Description
  --------------- --------- ----------------- ----------------------------------
  id              String    PK, CUID          Unique identifier for the user.

  walletAddress   String    Unique, Nullable  Ethereum wallet address (Primary
                                              Identity).

  email           String    Unique, Nullable  User\'s email address for
                                              notifications.

  role            Enum      Default:          User
                            FREELANCER        role: CLIENT, FREELANCER, ADMIN.

  status          Enum      Default: ACTIVE   Account status: ACTIVE, SUSPENDED.

  isVerified      Boolean   Default: False    Indicates if identity/email is
                                              verified.
  ------------------------------------------------------------------------------

  : Table 37 Data Dictionary for FreelancerProfile Entity

**FreelancerProfile Entity**

Extended profile information for freelancer users.

  ------------------------------------------------------------------------------------
  Attribute           Type         Constraints   Description
  ------------------- ------------ ------------- -------------------------------------
  id                  String       PK, CUID      Unique identifier for the profile.

  userId              String       FK (User)     Reference to the parent User entity.

  title               String       Nullable      Professional headline (e.g., \"Full
                                                 Stack Dev\").

  hourlyRate          Decimal      Nullable      Freelancer\'s standard hourly rate.

  trustScore          Decimal      Default: 0    Calculated reputation score (0-100).

  aiCapabilityScore   Decimal      Default: 0    AI-predicted skill capability score.

  skills              String\[\]   \-            List of claimed skills.
  ------------------------------------------------------------------------------------

  : Table 38 FreelancerProfile Entity Job Entity

**Job Entity**

Represents a work opportunity posted by a Client.

  -----------------------------------------------------------------------------
  Attribute     Type       Constraints   Description
  ------------- ---------- ------------- --------------------------------------
  id            String     PK, CUID      Unique identifier for the job.

  clientId      String     FK (User)     Reference to the Client posting the
                                         job.

  title         String     Required      Job title.

  description   Text       Required      Detailed job description.

  budget        Decimal    Nullable      Fixed budget amount.

  status        Enum       Default:      DRAFT, OPEN, IN_PROGRESS, COMPLETED.
                           DRAFT         

  createdAt     DateTime   Default: Now  Timestamp of job creation.
  -----------------------------------------------------------------------------

  : Table 39 Data Dictionary for Proposal Entity

**Proposal Entity**

A bid submitted by a Freelancer for a Job.

  ---------------------------------------------------------------------------
  Attribute      Type      Constraints       Description
  -------------- --------- ----------------- --------------------------------
  id             String    PK, CUID          Unique identifier for the
                                             proposal.

  jobId          String    FK (Job)          Reference to the Job.

  freelancerId   String    FK (User)         Reference to the Freelancer.

  coverLetter    Text      Required          Pitch to the client.

  proposedRate   Decimal   Required          Bid amount.

  status         Enum      Default: PENDING  PENDING, ACCEPTED, REJECTED.
  ---------------------------------------------------------------------------

  : Table 40 Data Dictionary for Contract Entity

**Contract Entity**

Represents an active agreement, linked to a Smart Contract.

  ------------------------------------------------------------------------------
  Attribute         Type      Constraints    Description
  ----------------- --------- -------------- -----------------------------------
  id                String    PK, CUID       Unique identifier for the contract.

  contractAddress   String    Unique         On-chain address of the Escrow
                                             Smart Contract.

  totalAmount       Decimal   Required       Total value of the contract.

  status            Enum      Default:       ACTIVE, COMPLETED, DISPUTED.
                              PENDING        

  jobId             String    FK (Job)       Reference to the associated Job.
  ------------------------------------------------------------------------------

  : Table 41 Data Dictionary for Milestone Entity

**Milestone Entity**

A specific deliverable and payment stage within a Contract.

  ----------------------------------------------------------------------------
  Attribute         Type      Constraints       Description
  ----------------- --------- ----------------- ------------------------------
  id                String    PK, CUID          Unique identifier for the
                                                milestone.

  contractId        String    FK (Contract)     Reference to the parent
                                                Contract.

  amount            Decimal   Required          Payment amount for this
                                                milestone.

  status            Enum      Default: PENDING  PENDING, SUBMITTED, PAID.

  deliverableHash   String    Nullable          IPFS CID of the submitted
                                                work.
  ----------------------------------------------------------------------------

  : Table 42 Data Dictionary for Dispute Entity

**Dispute Entity**

Records a conflict requiring arbitration.

  ---------------------------------------------------------------------------------
  Attribute    Type         Constraints      Description
  ------------ ------------ ---------------- --------------------------------------
  id           String       PK, CUID         Unique identifier for the dispute.

  contractId   String       FK (Contract)    Reference to the disputed Contract.

  reason       String       Required         Reason for the dispute.

  evidence     String\[\]   \-               Array of IPFS CIDs for evidence files.

  outcome      Enum         Default: PENDING CLIENT_WINS, FREELANCER_WINS, SPLIT.
  ---------------------------------------------------------------------------------

  : Table 43 Data Dictionary for Review Entity

**Review Entity**

Post-engagement feedback and rating.

  ----------------------------------------------------------------------------
  Attribute          Type      Constraints   Description
  ------------------ --------- ------------- ---------------------------------
  id                 String    PK, CUID      Unique identifier for the review.

  contractId         String    FK (Contract) Reference to the completed
                                             Contract.

  overallRating      Decimal   Required      Rating from 1.0 to 5.0.

  comment            Text      Nullable      Text feedback.

  blockchainTxHash   String    Nullable      Transaction hash of the on-chain
                                             record.
  ----------------------------------------------------------------------------

  : Table 44 Implemented Algorithms

# Chapter 4: Implementation

This chapter presents the work completed during the 60% implementation
phase of the DeTrust system. It describes all major components
developed, the algorithms designed to enforce business rules, the
security mechanisms employed, the external tools and libraries
integrated, and the user interface screens delivered. The 60% milestone
represents a significant expansion beyond the initial 30% foundation,
introducing a complete review and reputation system, a trust scoring
engine, a dispute resolution system with on-chain settlement, real-time
messaging, email notifications, an admin analytics dashboard, and a
comprehensive smart contract suite. This chapter should be read as a
continuation and extension produced for the 30% milestone.

## Project Methodology & Algorithms

This section outlines the step-by-step approach used during
implementation and highlights the key algorithms that drive the
system\'s core functionality. The focus is on meaningful logic rather
than basic operations, emphasizing the processes that enforce business
rules, maintain secure and consistent workflows, and support the
system\'s decision-making capabilities.

### Project Methodology 

The methodology for the implemented DeTrust system is given below:

1.  **Data Collection**

> **What:**

-   User profile information was collected, including wallet address,
    > display name, role, skills, bio, and portfolio links.

-   Job data was gathered, such as job ID, title, summary, required
    > skills, budget, deadline, client wallet, and on-chain references.

-   Smart-contract events and transactions were captured,
    > including JobCreated, PaymentLocked, and JobStatusUpdated with
    > logs and timestamps.

-   Payment records were stored, covering amount, token type,
    > transaction hash, payer wallet, and timestamp.

-   Application logs were maintained for authentication attempts, API
    > requests, and system errors.

-   Review data including per-category star ratings (Communication,
    > Quality, Timeliness, Professionalism), overall rating, comment
    > text, IPFS content hash, and blockchain transaction hash.

-   Trust score history with daily snapshots of computed scores for
    > every active user, stored with each component\'s raw value,
    > normalized value, and weighted contribution.

-   Dispute data including reason, description, structured evidence
    > items (with party attribution, file name, file size, CID),
    > weighted vote tallies, outcome, resolution text, and on-chain
    > settlement transaction hash.

-   Messaging data with conversation threads, message content, optional
    > job context, and read timestamps.

-   Notification records with type-coded events (MILESTONE_SUBMITTED,
    > REVIEW_RECEIVED, DISPUTE_OPENED, etc.) and delivery status.

-   Admin analytics with platform-wide monthly snapshots of
    > registrations, job postings, contract completions, and revenue.

> **How:**

-   The frontend sends profile and job data as JSON over secure REST
    > endpoints to the backend.

-   A backend event listener (using ethers.js) captures smart-contract
    > events, processes them, and stores structured records in the
    > database.

-   Transaction receipts are monitored until confirmed and then saved
    > with their metadata.

-   All data is stored in PostgreSQL, with JSONB fields used for
    > flexible job and event detail.

-   Reviews are submitted via REST API; the backend asynchronously
    > uploads review JSON to Pinata IPFS, then calls
    > ReputationRegistry.recordFeedback() on-chain via a relayer wallet.
    > Trust scores are recomputed after every review and on a daily cron
    > schedule. Dispute evidence is uploaded as multipart files via
    > Multer middleware, then pushed to IPFS. Real-time data flows
    > through Socket.IO and is persisted to PostgreSQL.

> **Why:**

-   Profile and job data are essential for rendering the job board and
    > enabling accurate searching and filtering.

-   On-chain events and receipts provide a verifiable audit trail and
    > serve as the trusted source for job lifecycle and payments.

-   Application logs help in debugging, preventing replay attacks
    > through nonce verification, and supporting basic analytics.

-   On-chain review hashes make feedback immutable and independently
    > verifiable. Trust score history enables trend visualisation and
    > supports the future ML training phase. Structured dispute evidence
    > with party attribution enables procedural fairness.

2.  **Data Preprocessing**

> **Missing Values:**

-   Required fields are validated at the API level, and submissions
    > missing essentials are rejected.

-   Optional fields (e.g., portfolio links, secondary skills) are stored
    > as null or empty arrays.

-   Missing numeric values are flagged and excluded from aggregated
    > calculations.

-   All required review fields are validated at the API boundary using
    > Zod schemas. Ratings enforce a 0.5-increment scale between 1
    > and 5. Optional fields (e.g., individual rating categories)
    > default to null and are excluded from aggregates

> **Duplicates:**

-   Each job is uniquely identified through its on-chain jobId, with
    > checks on both jobId and transaction hash.

-   User profiles remain unique through the wallet address constraint.

    -   Reviews are deduplicated via a unique constraint on (contractId,
        authorId). Dispute evidence uses a combination of disputeId and
        file CID to prevent re-uploads. Smart contract-level duplicate
        prevention is enforced by the
        feedbackSubmitted\[jobId\]\[sender\] mapping.

> **Normalization:**

-   Skill tags are standardized by trimming, lowercasing, and removing
    > duplicates.

-   Dates are converted to ISO 8601 in UTC for consistency.

-   Monetary values are stored in the smallest unit to avoid precision
    > issues.

-   Job summaries are trimmed for UI previews, with full versions saved
    > in JSONB.

-   Trust score components are normalized to a 0--100 scale before
    > weighting (e.g., rating 4.2/5 → 84.0). Inactivity decay is applied
    > post-formula: decayFactor = max(0.5, 1 − (inactiveDays − 90) /
    > 365), capping the penalty at 50% for users inactive longer than
    > one year. Dispute evidence URLs are normalised: real IPFS CIDs are
    > stored separately from SHA-256 fallback hashes (prefixed sha256:)

3.  **Feature Extraction & Selection**

> **What:**

-   Profile features like skill count, portfolio items, profile
    > completeness, and account age.

-   Job features include budget, number of required skills, deadline
    > duration, and summary length.

-   Transaction features such as payment lock status, time to lock, and
    > confirmation count.

-   Event-based features like status change counts, with placeholders
    > for future dispute or response-time metrics

-   The following features are now computed: freelancer trust scoring
    > features (avgRating normalised, completionRate, disputeWinRate
    > with neutral default of 50, experienceScore capped at 50
    > contracts, inactivityDecayFactor); client trust scoring features
    > (avgRating normalised, paymentPunctuality, hireRate capped at
    > 100%, jobClarityRating, cancellationPenalty up to −10 pts,
    > disputeBehaviourPenalty up to −15 pts); review analytics
    > (ratingDistribution, categoryAverages,
    > blockchainVerificationStatus); dispute analytics (voteWeight per
    > juror, jurorCount, outcomeConfidence); and AI capability score
    > components (skillsBreadth 25 pts, completedJobs 25 pts,
    > successRate 20 pts, avgRating 15 pts, certificationCount 10 pts,
    > profileCompleteness 5 pts).

> **How:**

-   A backend worker processes database records and generates feature
    > values stored in a JSONB features table.

-   Counts, averages, and time differences are computed via SQL, while
    > text-based measures are handled in the application logic.

-   Each feature set is saved with its jobId and timestamp for
    > traceability.

-   Trust score features are computed from aggregate database queries
    > across contracts, reviews, and disputes. The weighted formula
    > combines normalised components with role-specific weights (e.g.,
    > 0.4 × AvgRating + 0.3 × CompletionRate + 0.2 × DisputeWinRate +
    > 0.1 × Experience for freelancers). Irrelevant features are
    > filtered by the 5-contract eligibility gate --- users below this
    > threshold receive no score.

4.  **Model Training**

> **Status:** *Not applicable at this stage.*
>
> AI/ML model training is not implemented in the 60% milestone because
> the system has not yet generated enough user activity data to support
> model development. The full training process will be completed in
> later phases once adequate data is available.

5.  **Advanced Techniques**

> **Blockchain:**

-   Three Solidity contracts are now deployed and tested on the Hardhat
    local node (chain 31337):

    -   DeTrustUSD.sol (ERC-20 payment token),

    -   JobEscrow.sol (manages escrow funds, milestone payments, and
        dispute settlement), 

    -   ReputationRegistry.sol (stores immutable review content hashes
        with duplicate prevention).

    -   DisputeResolution.sol (records the full on-chain dispute
        lifecycle with weighted juror voting).

    -   A relayer pattern is used for all backend-initiated blockchain
        transactions so end-users never need to approve individual
        on-chain call.

**IPFS:**

-   Review content and dispute evidence are uploaded to Lighthouse IPFS
    (JSON and binary files respectively). If Pinata is unavailable, a
    SHA-256 content hash is used as a fallback identifier.

-   A dual-provider upload chain is used for dispute evidence: Pinata →
    Lighthouse → SHA-256 fallback, ensuring zero data loss under partial
    outages.

6.  **Deployment**

> **What:**

-   The system consists of a Next.js 16.1 frontend, a Node.js/Express
    backend API with Socket.IO real-time server, four Solidity smart
    contracts, and PostgreSQL database with Prisma ORM

**How:**

-   Four scheduled background jobs run in the backend process:

```{=html}
<!-- -->
```
-   Milestone auto-approve (cron.service.ts, hourly): finds milestones
    > in SUBMITTED status for \> 7 days and auto-approves them.

-   Trust score recalculation (trustScore.job.ts, every 24h): recomputes
    > scores for all users; records history snapshots for eligible users
    > (≥ 5 contracts).

-   Blockchain retry (blockchain.job.ts, every 6h): retries failed IPFS
    > uploads and blockchain writes in batches of 50.

-   Dispute auto-resolve (dispute.job.ts, hourly): auto-resolves VOTING
    > disputes past their 7-day deadline if ≥ 3 jurors voted; notifies
    > admin if insufficient jurors.

**Why:**

-   Background jobs ensure system consistency without manual
    > intervention. The milestone auto-approve prevents clients from
    > blocking freelancer payments indefinitely. The blockchain retry
    > ensures all review hashes eventually reach the chain even under
    > transient failures.

### Algorithm 

This section outlines the main algorithms implemented at this stage,
focusing on those that enforce core business rules and support essential
system operations. Each algorithm is described with its name, inputs,
outputs, and pseudocode. The algorithms included here cover wallet
authentication, job creation, escrow payment locking, blockchain event
synchronization, and job filtering.

+------------------+---------------------------------------------------+
| **Algorithm      | **Details**                                       |
| Name**           |                                                   |
+==================+===================================================+
| +-------------+  | +----------------------------------------------+  |
| | **Wallet    |  | | **Input:** VerifyWalletSignature**\          |  |
| | Authe       |  | | Output:** sessionToken or \"Failure\"\       |  |
| | ntication** |  | | **Pseudocode:\                               |  |
| |             |  | | **procedure                                  |  |
| | *(Auth      |  | | VerifyWalletSignature(walletAddress,         |  |
| | entication* |  | | signature)                                   |  |
| | R*ule       |  | |                                              |  |
| | En          |  | | 2: nonce \<- GetStoredNonce(walletAddress)   |  |
| | forcement*) |  | |                                              |  |
| +=============+  | | 3: if nonce is null then                     |  |
| +-------------+  | |                                              |  |
|                  | | 4: return \"Expired or missing nonce\"       |  |
| : Table          | |                                              |  |
| Environment      | | 5: end if                                    |  |
| Table            | |                                              |  |
|                  | | 6: expectedMessage \<- \"Login verification: |  |
|                  | | \" + nonce                                   |  |
|                  | |                                              |  |
|                  | | 7: signer \<- RecoverSigner(expectedMessage, |  |
|                  | | signature)                                   |  |
|                  | |                                              |  |
|                  | | 8: if signer == walletAddress then           |  |
|                  | |                                              |  |
|                  | | 9: DeleteNonce(walletAddress)                |  |
|                  | |                                              |  |
|                  | | 10: token \<-                                |  |
|                  | | GenerateUserSession(walletAddress)           |  |
|                  | |                                              |  |
|                  | | 11: return token                             |  |
|                  | |                                              |  |
|                  | | 12: else                                     |  |
|                  | |                                              |  |
|                  | | 13: return \"Invalid signature\"             |  |
|                  | |                                              |  |
|                  | | 14: end if                                   |  |
|                  | |                                              |  |
|                  | | 15: end procedure                            |  |
|                  | +==============================================+  |
|                  | +----------------------------------------------+  |
|                  |                                                   |
|                  | : Table Smart Contract Deployment Details table   |
+------------------+---------------------------------------------------+
| **Job Creation** | **Input:** clientWallet, jobData\                 |
|                  | **Output:** jobId\                                |
| *(Business Rule  | **Pseudocode:**\                                  |
| Enforcement)*    | 1: procedure CreateJob(clientWallet, jobData)     |
|                  |                                                   |
|                  | 2: Validate(jobData)                              |
|                  |                                                   |
|                  | 3: summaryHash \<- Hash(jobData.title +           |
|                  | jobData.description)                              |
|                  |                                                   |
|                  | 4: tx \<- SmartContract.CreateJob(summaryHash,    |
|                  | jobData.budget)                                   |
|                  |                                                   |
|                  | 5: jobId \<- ExtractEvent(tx, \"JobCreated\")     |
|                  |                                                   |
|                  | 6: SaveOffChain(jobId, jobData, \"Open\")         |
|                  |                                                   |
|                  | 7: return jobId                                   |
|                  |                                                   |
|                  | 8: end procedure                                  |
+------------------+---------------------------------------------------+
| ** Escrow        | **Input:** jobId, amount\                         |
| Payment Lock **  | **Output:** \"Success\" or \"Failure\"\           |
|                  | **Pseudocode:**\                                  |
| (*Business Rule  | 1: procedure LockJobPayment(jobId, amount)        |
| Enforcement*)    |                                                   |
|                  | 2: job \<- FetchJob(jobId)                        |
|                  |                                                   |
|                  | 3: if job.status != \"Open\" then                 |
|                  |                                                   |
|                  | 4: return \"Payment not allowed\"                 |
|                  |                                                   |
|                  | 5: end if                                         |
|                  |                                                   |
|                  | 6: tx \<- SmartContract.LockPayment(jobId,        |
|                  | amount)                                           |
|                  |                                                   |
|                  | 7: if tx.success then                             |
|                  |                                                   |
|                  | 8: UpdateJobStatus(jobId, \"In Progress\")        |
|                  |                                                   |
|                  | 9: return \"Success\"                             |
|                  |                                                   |
|                  | 10: else                                          |
|                  |                                                   |
|                  | 11: return \"Transaction failed\"                 |
|                  |                                                   |
|                  | 12: end if                                        |
|                  |                                                   |
|                  | 13: end procedure                                 |
+------------------+---------------------------------------------------+
| **Blockchain     | **Input:** contractEvents (stream)                |
| Event            |                                                   |
| S                | **Output:** Updated off-chain records\            |
| ynchronization** | **Pseudocode:**                                   |
|                  |                                                   |
| **(***           | 1: process ListenToContractEvents()               |
| Scheduling/State |                                                   |
| M                | 2: On Event JobCreated(jobId):                    |
| aintenance***)** |                                                   |
|                  | 3: EnsureOffChainRecord(jobId)                    |
|                  |                                                   |
|                  | 4: On Event PaymentLocked(jobId):                 |
|                  |                                                   |
|                  | 5: UpdateJobStatus(jobId, \"In Progress\")        |
|                  |                                                   |
|                  | 6: On Event JobStatusUpdated(jobId, newStatus):   |
|                  |                                                   |
|                  | 7: UpdateJobStatus(jobId, newStatus)              |
|                  |                                                   |
|                  | 8: end process                                    |
+------------------+---------------------------------------------------+
| **Job            | **Input:** criteria (skills, budgetRange, status) |
| Filtering**      |                                                   |
|                  | **Output:** filteredJobList                       |
| *(Optimization)* |                                                   |
|                  | **Pseudocode:**                                   |
|                  |                                                   |
|                  | 1: function FilterJobs(criteria)                  |
|                  |                                                   |
|                  | 2: results \<- QueryJobs(criteria.budgetRange,    |
|                  | criteria.status)                                  |
|                  |                                                   |
|                  | 3: if criteria.skills is not empty then           |
|                  |                                                   |
|                  | 4: results \<- FilterBySkillMatch(results,        |
|                  | criteria.skills)                                  |
|                  |                                                   |
|                  | 5: end if                                         |
|                  |                                                   |
|                  | 6: return results                                 |
|                  |                                                   |
|                  | 7: end function                                   |
+------------------+---------------------------------------------------+
| **Review         | **Input:**                                        |
| Submission       | contractI                                         |
| Pipeline**       | d, authorId, subjectId, ratings (object), comment |
|                  |                                                   |
| *(Integrity &    | **Output:** reviewId, ipfsHash, blockchainTxHash  |
| Auditability)*   |                                                   |
|                  | **Pseudocode:**                                   |
|                  |                                                   |
|                  | procedure SubmitReview(contractId, authorId,      |
|                  | subjectId, ratings, comment)                      |
|                  |                                                   |
|                  | 1: ValidateInput(ratings, comment) // Zod:        |
|                  | ratings 1-5 (0.5 increments), comment 10-2000     |
|                  | chars                                             |
|                  |                                                   |
|                  | 2: if HasAlreadyReviewed(contractId, authorId)    |
|                  | then                                              |
|                  |                                                   |
|                  | 3: raise \"Duplicate review\"                     |
|                  |                                                   |
|                  | 4: end if                                         |
|                  |                                                   |
|                  | 5: review \<- PersistReview(contractId, authorId, |
|                  | subjectId, ratings, comment)                      |
|                  |                                                   |
|                  | 6: SendNotification(subjectId,                    |
|                  | \"REVIEW_RECEIVED\", review)                      |
|                  |                                                   |
|                  | 7: RecalculateTrustScore(authorId)                |
|                  |                                                   |
|                  | 8: RecalculateTrustScore(subjectId)               |
|                  |                                                   |
|                  | 9:                                                |
|                  |                                                   |
|                  | 10: // Async pipeline --- does not block response |
|                  |                                                   |
|                  | 11: spawn UploadToIpfsAndBlockchain(review):      |
|                  |                                                   |
|                  | 12: ipfsHash \<- Pinata.uploadJSON(review) //     |
|                  | fallback: sha256(content)                         |
|                  |                                                   |
|                  | 13: if ipfsHash is valid then                     |
|                  |                                                   |
|                  | 14: txHash \<-                                    |
|                  | ReputationRegistry.recordFeedback(contractId,     |
|                  | subjectId, ipfsHash, rating)                      |
|                  |                                                   |
|                  | 15: UpdateReview(review.id, ipfsHash, txHash)     |
|                  |                                                   |
|                  | 16: end if                                        |
|                  |                                                   |
|                  | 17: end spawn                                     |
|                  |                                                   |
|                  | 18:                                               |
|                  |                                                   |
|                  | 19: return review.id                              |
|                  |                                                   |
|                  | 20: end procedure                                 |
+------------------+---------------------------------------------------+
| **Freelancer     | **Input:** userId                                 |
| Trust Score      |                                                   |
| Computation**    | **Output:** TrustScoreBreakdown { totalScore,     |
| *(Rule-Based     | eligible, components }                            |
| Scoring)*        |                                                   |
|                  | **Pseudocode:**                                   |
|                  |                                                   |
|                  | function ComputeFreelancerTrustScore(userId)      |
|                  |                                                   |
|                  | 1: profile \<- FetchFreelancerProfile(userId)     |
|                  |                                                   |
|                  | 2: completedContracts \<- CountContracts(userId,  |
|                  | status=\"COMPLETED\")                             |
|                  |                                                   |
|                  | 3:                                                |
|                  |                                                   |
|                  | 4: if completedContracts \< 5 then                |
|                  |                                                   |
|                  | 5: return { totalScore: null, eligible: false }   |
|                  | // eligibility gate                               |
|                  |                                                   |
|                  | 6: end if                                         |
|                  |                                                   |
|                  | 7:                                                |
|                  |                                                   |
|                  | 8: // Normalise all components to 0-100 scale     |
|                  |                                                   |
|                  | 9: avgRating \<- (profile.avgRating / 5) × 100    |
|                  |                                                   |
|                  | 10: completionRate \<- (completedContracts /      |
|                  | totalContracts) × 100                             |
|                  |                                                   |
|                  | 11: totalDisputes \<- CountDisputes(userId)       |
|                  |                                                   |
|                  | 12: wonDisputes \<- CountDisputes(userId,         |
|                  | outcome=\"FREELANCER_WINS\")                      |
|                  |                                                   |
|                  | 13: disputeWinRate \<- (totalDisputes \> 0) ?     |
|                  | (wonDisputes / totalDisputes) × 100 : 50 //       |
|                  | neutral default                                   |
|                  |                                                   |
|                  | 14: experienceScore \<- min((completedContracts / |
|                  | 50) × 100, 100)                                   |
|                  |                                                   |
|                  | 15:                                               |
|                  |                                                   |
|                  | 16: rawScore \<- (0.4 × avgRating) + (0.3 ×       |
|                  | completionRate)                                   |
|                  |                                                   |
|                  | 17: + (0.2 × disputeWinRate) + (0.1 ×             |
|                  | experienceScore)                                  |
|                  |                                                   |
|                  | 18:                                               |
|                  |                                                   |
|                  | 19: // Inactivity decay: max(0.5, 1 -             |
|                  | (inactiveDays - 90) / 365) if inactive \> 90 days |
|                  |                                                   |
|                  | 20: decayFactor \<-                               |
|                  | GetInactivityDecayFactor(userId)                  |
|                  |                                                   |
|                  | 21: totalScore \<- rawScore × decayFactor         |
|                  |                                                   |
|                  | 22:                                               |
|                  |                                                   |
|                  | 23: PersistTrustScore(userId, totalScore)         |
|                  |                                                   |
|                  | 24: AppendTrustScoreHistory(userId, totalScore,   |
|                  | components)                                       |
|                  |                                                   |
|                  | 25: EmitWebSocket(userId,                         |
|                  | \"trust-score:updated\", totalScore)              |
|                  |                                                   |
|                  | 26:                                               |
|                  |                                                   |
|                  | 27: return { totalScore, eligible: true,          |
|                  | components }                                      |
|                  |                                                   |
|                  | 28: end function                                  |
+------------------+---------------------------------------------------+
| **Client Trust   | **Input:** userId                                 |
| Score            |                                                   |
| Computation with | **Output:** TrustScoreBreakdown { totalScore,     |
| Penalties**      | eligible, components }                            |
|                  |                                                   |
| *(Rule-Based     | **Pseudocode:**                                   |
| Scoring)*        |                                                   |
|                  | function ComputeClientTrustScore(userId)          |
|                  |                                                   |
|                  | 1: profile \<- FetchClientProfile(userId)         |
|                  |                                                   |
|                  | 2: completedContracts \<- CountContracts(userId,  |
|                  | role=\"CLIENT\", status=\"COMPLETED\")            |
|                  |                                                   |
|                  | 3:                                                |
|                  |                                                   |
|                  | 4: if completedContracts \< 5 then                |
|                  |                                                   |
|                  | 5: return { totalScore: null, eligible: false }   |
|                  | // eligibility gate                               |
|                  |                                                   |
|                  | 6: end if                                         |
|                  |                                                   |
|                  | 7:                                                |
|                  |                                                   |
|                  | 8: // Normalise components to 0-100 scale         |
|                  |                                                   |
|                  | 9: avgRating \<- (profile.avgRating / 5) × 100    |
|                  |                                                   |
|                  | 10: paymentPunctuality \<- (completedContracts /  |
|                  | totalContracts) × 100                             |
|                  |                                                   |
|                  | 11: hireRate \<- min((totalContracts /            |
|                  | jobsPosted) × 100, 100)                           |
|                  |                                                   |
|                  | 12: jobClarityRating \<-                          |
|                  | (AvgQualityRatingFromFreelancerReviews(userId) /  |
|                  | 5) × 100                                          |
|                  |                                                   |
|                  | 13:                                               |
|                  |                                                   |
|                  | 14: rawScore \<- (0.4 × avgRating) + (0.3 ×       |
|                  | paymentPunctuality)                               |
|                  |                                                   |
|                  | 15: + (0.2 × hireRate) + (0.1 × jobClarityRating) |
|                  |                                                   |
|                  | 16:                                               |
|                  |                                                   |
|                  | 17: // Post-formula penalty deductions            |
|                  |                                                   |
|                  | 18: cancelledContracts \<- CountContracts(userId, |
|                  | status=\"CANCELLED\")                             |
|                  |                                                   |
|                  | 19: cancellationRate \<- cancelledContracts /     |
|                  | totalContracts                                    |
|                  |                                                   |
|                  | 20: cancellationPenalty \<- cancellationRate × 10 |
|                  | // up to -10 pts                                  |
|                  |                                                   |
|                  | 21:                                               |
|                  |                                                   |
|                  | 22: lostDisputes \<- CountDisputes(userId,        |
|                  | outcome=\"FREELANCER_WINS\")                      |
|                  |                                                   |
|                  | 23: disputePenalty \<- (lostDisputes /            |
|                  | totalContracts) × 15 // up to -15 pts             |
|                  |                                                   |
|                  | 24:                                               |
|                  |                                                   |
|                  | 25: penalisedScore \<- max(0, rawScore -          |
|                  | cancellationPenalty - disputePenalty)             |
|                  |                                                   |
|                  | 26: decayFactor \<-                               |
|                  | GetInactivityDecayFactor(userId)                  |
|                  |                                                   |
|                  | 27: totalScore \<- penalisedScore × decayFactor   |
|                  |                                                   |
|                  | 28:                                               |
|                  |                                                   |
|                  | 29: PersistTrustScore(userId, totalScore)         |
|                  |                                                   |
|                  | 30: AppendTrustScoreHistory(userId, totalScore,   |
|                  | components)                                       |
|                  |                                                   |
|                  | 31: EmitWebSocket(userId,                         |
|                  | \"trust-score:updated\", totalScore)              |
|                  |                                                   |
|                  | 32:                                               |
|                  |                                                   |
|                  | 33: return { totalScore, eligible: true,          |
|                  | components }                                      |
|                  |                                                   |
|                  | 34: end function                                  |
+------------------+---------------------------------------------------+
| **Dispute        | **Input:**                                        |
| Resolution       | contractId, initiatorId, reason, description      |
| Lifecycle**      |                                                   |
|                  | **Output:** Final fund distribution transaction   |
| *(Governance &   | hash                                              |
| On-Chain         |                                                   |
| Settlement)*     | **Pseudocode:**                                   |
|                  |                                                   |
|                  | process DisputeResolutionLifecycle                |
|                  |                                                   |
|                  | // Phase 1: OPEN                                  |
|                  |                                                   |
|                  | 1: ValidateParty(initiatorId, contractId) // only |
|                  | client or freelancer                              |
|                  |                                                   |
|                  | 2: EnsureNoActiveDispute(contractId) // one       |
|                  | dispute at a time                                 |
|                  |                                                   |
|                  | 3: dispute \<- CreateDispute(contractId, reason,  |
|                  | description, status=\"OPEN\")                     |
|                  |                                                   |
|                  | 4: NotifyBothParties(dispute, \"DISPUTE_OPENED\") |
|                  |                                                   |
|                  | 5:                                                |
|                  |                                                   |
|                  | 6: // Evidence submission (either party, OPEN     |
|                  | phase only)                                       |
|                  |                                                   |
|                  | 7: On SubmitEvidence(disputeId, files):           |
|                  |                                                   |
|                  | 8: ipfsUrls \<- IPFS.uploadFiles(files) // Pinata |
|                  | → Lighthouse → SHA-256 fallback                   |
|                  |                                                   |
|                  | 9: SaveEvidenceItems(disputeId, uploadedById,     |
|                  | ipfsUrls)                                         |
|                  |                                                   |
|                  | 10:                                               |
|                  |                                                   |
|                  | // Phase 2: VOTING (admin-triggered)              |
|                  |                                                   |
|                  | 11: On AdminStartVoting(disputeId):               |
|                  |                                                   |
|                  | 12: UpdateStatus(disputeId, \"VOTING\")           |
|                  |                                                   |
|                  | 13: votingDeadline \<- now + 7 days               |
|                  |                                                   |
|                  | 14: eligibleJurors \<- FindUsers(trustScore \>=   |
|                  | 50, notParty)                                     |
|                  |                                                   |
|                  | 15: NotifyJurors(eligibleJurors,                  |
|                  | \"DISPUTE_VOTING\")                               |
|                  |                                                   |
|                  | 16:                                               |
|                  |                                                   |
|                  | 17: // Juror votes (trust-score weighted)         |
|                  |                                                   |
|                  | 18: On CastVote(disputeId, jurorId, vote):        |
|                  |                                                   |
|                  | 19: CheckEligibility(jurorId, disputeId) // trust |
|                  | \>= 50, not party, not voted                      |
|                  |                                                   |
|                  | 20: weight \<- jurorTrustScore / 10               |
|                  |                                                   |
|                  | 21: Accumulate(disputeId, vote, weight)           |
|                  |                                                   |
|                  | 22:                                               |
|                  |                                                   |
|                  | // Phase 3: RESOLVED (auto or admin)              |
|                  |                                                   |
|                  | 23: On VotingDeadlineExpired(disputeId):          |
|                  |                                                   |
|                  | 24: if voteCount \>= 3 then                       |
|                  |                                                   |
|                  | 25: outcome \<- (clientVotes \> freelancerVotes)  |
|                  | ? CLIENT_WINS                                     |
|                  |                                                   |
|                  | 26: : (freelancerVotes \> clientVotes) ?          |
|                  | FREELANCER_WINS : SPLIT                           |
|                  |                                                   |
|                  | 27: else                                          |
|                  |                                                   |
|                  | 28: NotifyAdmin(\"Insufficient jurors --- manual  |
|                  | resolution required\")                            |
|                  |                                                   |
|                  | 29: return                                        |
|                  |                                                   |
|                  | 30: end if                                        |
|                  |                                                   |
|                  | 31:                                               |
|                  |                                                   |
|                  | 32: // On-chain fund settlement                   |
|                  |                                                   |
|                  | 33: txHash \<- JobEscrow.resolveDispute(jobId,    |
|                  | outcome)                                          |
|                  |                                                   |
|                  | 34: // outcome=0 → CLIENT_WINS: refund            |
|                  | remaining + platformFee to client                 |
|                  |                                                   |
|                  | 35: // outcome=1 → FREELANCER_WINS: release       |
|                  | remaining to freelancer, fee to feeRecipient      |
|                  |                                                   |
|                  | 36: // outcome=2 → SPLIT: 50/50 of remaining,     |
|                  | platformFee returned to client                    |
|                  |                                                   |
|                  | 37: UpdateDispute(disputeId, outcome,             |
|                  | \"RESOLVED\", txHash)                             |
|                  |                                                   |
|                  | 38: NotifyBothParties(dispute,                    |
|                  | \"DISPUTE_RESOLVED\")                             |
|                  |                                                   |
|                  | 39: return txHash                                 |
|                  |                                                   |
|                  | 40: end process                                   |
+------------------+---------------------------------------------------+
| **Milestone      | **Input: **Periodic trigger (hourly cron)\        |
| Auto-Approve**   | **Output: **Updated milestone statuses and        |
|                  | payment releases                                  |
| *(Scheduling /   |                                                   |
| Business Rule)*  | **Pseudocode:**                                   |
|                  |                                                   |
|                  | process MilestoneAutoApprove                      |
|                  |                                                   |
|                  | 1: cutoff \<- now - 7 days                        |
|                  |                                                   |
|                  | 2: staleMilestones \<-                            |
|                  | QueryMilestones(status=\"SUBMITTED\", submittedAt |
|                  | \< cutoff)                                        |
|                  |                                                   |
|                  | 3: for each milestone in staleMilestones do       |
|                  |                                                   |
|                  | 4: UpdateStatus(milestone, \"APPROVED\")          |
|                  |                                                   |
|                  | 5: UpdateStatus(milestone, \"PAID\")              |
|                  |                                                   |
|                  | 6: job.paidAmount += milestone.amount             |
|                  |                                                   |
|                  | 7: Notify(client, \"MILESTONE_AUTO_APPROVED\",    |
|                  | milestone)                                        |
|                  |                                                   |
|                  | 8: Notify(freelancer,                             |
|                  | \"MILESTONE_AUTO_APPROVED\", milestone)           |
|                  |                                                   |
|                  | 9: if                                             |
|                  | AllMilestonesCompleted(milestone.contractId) then |
|                  |                                                   |
|                  | 10: UpdateContractStatus(milestone.contractId,    |
|                  | \"COMPLETED\")                                    |
|                  |                                                   |
|                  | 11: end if                                        |
|                  |                                                   |
|                  | 12: end for                                       |
|                  |                                                   |
|                  | 13: end process                                   |
+------------------+---------------------------------------------------+
| **Blockchain     | **Input: **Periodic trigger (every 6 hours)       |
| Retry**          |                                                   |
| *(Reliability /  | **Output: **Recovered IPFS hashes and blockchain  |
| Fault            | transaction hashes for failed reviews             |
| Tolerance)*      |                                                   |
|                  | **Pseudocode:**                                   |
|                  |                                                   |
|                  | process BlockchainRetryJob                        |
|                  |                                                   |
|                  | 1: // Retry IPFS uploads                          |
|                  |                                                   |
|                  | 2: pendingIpfs \<- QueryReviews(ipfsHash=null,    |
|                  | limit=50)                                         |
|                  |                                                   |
|                  | 3: for each review in pendingIpfs do              |
|                  |                                                   |
|                  | 4: hash \<- Pinata.uploadJSON(review)             |
|                  |                                                   |
|                  | 5: if hash then UpdateReview(review.id,           |
|                  | ipfsHash=hash) end if                             |
|                  |                                                   |
|                  | 6: end for                                        |
|                  |                                                   |
|                  | 7:                                                |
|                  |                                                   |
|                  | 8: // Retry blockchain writes (IPFS done but no   |
|                  | tx hash)                                          |
|                  |                                                   |
|                  | 9: pendingTx \<- QueryReviews(ipfsHash!=null,     |
|                  | blockchainTxHash=null, limit=50)                  |
|                  |                                                   |
|                  | 10: for each review in pendingTx do               |
|                  |                                                   |
|                  | 11: txHash \<-                                    |
|                  | Rep                                               |
|                  | utationRegistry.recordFeedback(review.contractId, |
|                  | review.subjectId, review.ipfsHash,                |
|                  | review.overallRating)                             |
|                  |                                                   |
|                  | 12: if txHash then UpdateReview(review.id,        |
|                  | blockchainTxHash=txHash) end if                   |
|                  |                                                   |
|                  | 13: end for                                       |
|                  |                                                   |
|                  | 14: end process                                   |
+------------------+---------------------------------------------------+
| **Juror          | **Input: **userId, disputeId                      |
| Eligibility      |                                                   |
| Check**          | **Output: **{ eligible: boolean, reason?: string  |
|                  | }                                                 |
| *(Access         |                                                   |
| Control)*        | **Pseudocode:**                                   |
|                  |                                                   |
|                  | function CheckJurorEligibility(userId, disputeId) |
|                  |                                                   |
|                  | 1: dispute \<- FetchDispute(disputeId)            |
|                  |                                                   |
|                  | 2: if dispute.status != \"VOTING\" then           |
|                  |                                                   |
|                  | 3: return { eligible: false, reason: \"Voting has |
|                  | not started or has ended\" }                      |
|                  |                                                   |
|                  | 4: end if                                         |
|                  |                                                   |
|                  | 5: if userId == dispute.initiatorId or userId ==  |
|                  | dispute.respondentId then                         |
|                  |                                                   |
|                  | 6: return { eligible: false, reason: \"Contract   |
|                  | parties cannot vote\" }                           |
|                  |                                                   |
|                  | 7: end if                                         |
|                  |                                                   |
|                  | 8: if HasAlreadyVoted(userId, disputeId) then     |
|                  |                                                   |
|                  | 9: return { eligible: false, reason: \"You have   |
|                  | already cast a vote\" }                           |
|                  |                                                   |
|                  | 10: end if                                        |
|                  |                                                   |
|                  | 11: trustScore \<- GetTrustScore(userId)          |
|                  |                                                   |
|                  | 12: if trustScore \< 50 then                      |
|                  |                                                   |
|                  | 13: return { eligible: false, reason: \"Trust     |
|                  | score below minimum threshold of 50\" }           |
|                  |                                                   |
|                  | 14: end if                                        |
|                  |                                                   |
|                  | 15: if now \> dispute.votingDeadline then         |
|                  |                                                   |
|                  | 16: return { eligible: false, reason: \"Voting    |
|                  | deadline has passed\" }                           |
|                  |                                                   |
|                  | 17: end if                                        |
|                  |                                                   |
|                  | 18: return { eligible: true }                     |
|                  |                                                   |
|                  | 19: end function                                  |
+------------------+---------------------------------------------------+

: Table 45 External APIs/SDKs

## Training Results & Model Evaluation 

AI/ML training and evaluation are not part of the 30% milestone because
the system has not yet generated enough user activity data to support
model development. At this stage, no dataset has been compiled, no
preprocessing steps have been carried out, and no models have been
trained. The full training process, along with performance metrics and
evaluation visuals, will be completed in later phases once adequate data
is available.

## Security Techniques

This section describes the security measures implemented in the DeTrust
system to protect user data, prevent common attacks, and ensure secure
transactions.

### Authentication (Wallet-Based)

A wallet-based authentication approach is implemented, where users
verify their identity by signing a server-generated nonce instead of
using traditional passwords. The backend checks this signature against
the user\'s wallet address and, once validated, issues a secure session
token. This method protects against credential theft, replay attacks,
and unauthorized access.

**Implementation Details:**

-   Server generates a unique nonce for each login attempt

-   User signs the nonce message using their wallet\'s private key (via
    MetaMask or WalletConnect)

-   Backend uses ethers.js to recover the signer\'s address from the
    signature

-   One-time nonces are invalidated immediately after use

-   Session tokens are issued as JWT with configurable expiration

### Encryption (HTTPS/TLS)

All communication between the frontend and backend is secured using
HTTPS (TLS 1.2+), ensuring encrypted transfer of profile, job, and event
data. Sensitive identifiers such as wallet addresses, transaction
hashes, and session tokens are stored securely. Additional encryption
layers are not required at this stage, as authentication already relies
on the strong cryptographic signing provided by blockchain wallets
(ECDSA).

### Attack Prevention

> **SQL Injection Prevention:**

-   User inputs are handled through parameterized queries and ORM-level
    > sanitization (Prisma ORM)

-   All database operations use prepared statements

-   Input validation rejects malformed data at the API boundary

> **XSS Prevention:**

-   All user-submitted text such as names, bios, job titles, and
    > summaries is sanitized

-   Unsafe HTML is removed before being displayed in the interface

-   React\'s built-in escaping prevents injection in rendered components

> **Replay Attack Prevention:**

-   Each login request uses a one-time verification nonce that becomes
    > invalid immediately after use

-   Nonces are stored with timestamps and automatically expire

-   Prevents attackers from reusing captured signatures

> **Rate Limiting and Input Validation:**

-   API endpoints enforce strict size limits and input type checks

-   Request rate caps protect against brute-force attempts and request
    > flooding

-   Express middleware implements per-IP and per-endpoint rate limiting

### Intrusion/Anomaly Detection

Intrusion detection mechanisms are not implemented at this stage because
the system has not yet collected enough real user activity or behavioral
patterns to support meaningful analysis. These capabilities will be
introduced in later phases once sufficient logs and interaction data are
available to train and validate anomaly-detection models.

### IPFS Content Integrity

Review content and dispute evidence uploaded to IPFS are protected at
multiple layers:

-   **Content addressing:** IPFS assigns each uploaded object a CID
    (Content Identifier) derived from a cryptographic hash of the
    content. Any tampering with the file would produce a different CID,
    making falsification immediately detectable.

-   **On-chain anchoring:** After IPFS upload, the backend alls
    ReputationRegistry.recordFeedback(jobId, reviewed, contentHash,
    rating). The contentHash is an ethers.keccak256-hashed combination
    of the contract ID and IPFS CID, stored as a bytes32 value on-chain.
    The @@unique constraint feedbackSubmitted\[jobId\]\[sender\] in the
    smart contract prevents duplicate submissions.

-   **Relayer pattern:** The backend wallet (RELAYER_PRIVATE_KEY) signs
    all blockchain transactions on behalf of the platform. User sessions
    never carry signing authority over on-chain operations, reducing the
    blast radius of a compromised session token.

-   **Graceful degradation:** If Pinata is unavailable,
    a sha256:\... prefixed local hash is stored. The UI flags these
    items and prompts re-upload when the service resumes. No review is
    lost, but its on-chain verifiability is temporarily deferred.

### Double-Blind Review System

To prevent strategic review manipulation --- where a party waits to see
the other\'s review before deciding what to submit --- the system
implements a 14-day double-blind window:

-   Reviews submitted during the window are stored in the database but
    are not returned in API responses to either party.

-   Reviews become visible only when both parties have submitted, or
    when the 14-day window has elapsed since the first submission.

-   This is enforced at the query layer in review.service.ts using a
    batch counterpart lookup that avoids N+1 queries.

-   Reviews cannot be updated or deleted after submission (no UPDATE or
    DELETE endpoints exist). The one-time immutable rebuttal
    (responseText) can be added by the reviewed party within their own
    submission.

### Dispute Evidence Access Control

-   Evidence files uploaded during a dispute are associated with the
    uploading party via the DisputeEvidence.uploadedById field,
    providing a clear chain of custody for each piece of evidence.

-   Dispute evidence is accessible only to the contract parties,
    assigned jurors, and administrators. Non-party users receive a 403
    Forbidden response.

-   Secure file URLs are generated via an authenticated endpoint
    (/api/uploads/:fileId) using
    a SecureFileVisibility.AUTHENTICATED policy. Direct object reference
    to storage paths is not exposed to the client.

### Juror Trust Score Gate

-   The smart
    contract DisputeResolution.sol enforces jurorTrustScores\[msg.sender\]
    \>= minJurorTrustScore (default: 50) on every castVote() call. This
    is also enforced at the API layer in dispute.service.ts before any
    vote is persisted.

-   A dedicated eligibility check endpoint (GET
    /api/disputes/:id/eligibility) returns the specific reason for
    ineligibility, enabling the frontend to display an informative
    banner rather than a generic error.

## External APIs/SDKs

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Name of API/SDK  **Description of  **Purpose of       **API Endpoint/Function/Class Used**
  and Version**      API/SDK**         Usage**            
  ------------------ ----------------- ------------------ ------------------------------------------------------------------------------------------------------------
  **MetaMask         Browser Ethereum  Wallet             eth_requestAccounts, personal_sign
  (v11+)**           wallet            authentication and 
                                       transaction        
                                       signing            

  **WalletConnect    Cross-platform    Alternative wallet connect(), signMessage()
  (v2.0)**           wallet protocol   login              
                                       (non-MetaMask      
                                       users)             

  **RainbowKit**     Wallet connection User-facing wallet ConnectButton, RainbowKitProvider
                     UI                connection modal   

  **wagmi (v2)**     React Hooks for   Frontend wallet    useAccount(), useSignMessage(), useBalance()
                     Ethereum          state and          
                                       blockchain reads   

  **Ethers.js (v6)** Ethereum          Smart contract     contract.createJob(), contract.lockPayment(), contract.resolveDispute(), provider.on(), ethers.keccak256()
                     JavaScript SDK    calls, event       
                                       listening, key     
                                       management         

  **Node.js Express  REST API          Backend routing    app.post(), app.get(), app.patch()
  (v4)**             framework         and middleware     

  **Prisma ORM       Type-safe         All database       prisma.user.create(), prisma.dispute.findMany(), prisma.trustScoreHistory.create()
  (v5)**             PostgreSQL client operations with    
                                       full type safety   

  **PostgreSQL (pg   Relational        Persistent storage Parameterised queries via Prisma
  v8)**              database          for all off-chain  
                                       data               

  **Socket.IO (v4)** WebSocket library Real-time push     io.to(room).emit(), socket.on()
                                       notifications,     
                                       message delivery,  
                                       contract status    
                                       events, trust      
                                       score updates      

  **Pinata IPFS**    IPFS pinning      Immutable storage  pinJSONToIPFS(), pinFileToIPFS()
                     service           for review content 
                                       and dispute        
                                       evidence JSON      

  **Lighthouse       Decentralised     Secondary fallback lighthouse.upload()
  IPFS**             file storage      for binary         
                                       evidence file      
                                       uploads            

  **Nodemailer /     Email transport   HTML email digests transporter.sendMail()
  Google SMTP**                        for disputes,      
                                       milestones,        
                                       messages, and      
                                       welcome events     

  **Multer**         Multipart file    Handling evidence  multer({ storage, limits }), evidenceUpload.array()
                     upload middleware file uploads (5    
                                       files × 25 MB)     

  **Hardhat**        Ethereum          Smart contract     68 tests passing across 3 contracts
                     development       compilation, local 
                     environment       node, testing (npx 
                                       hardhat test)      

  **OpenZeppelin     Audited Solidity  Security patterns  Ownable, Pausable, ReentrancyGuard, SafeERC20
  Contracts (v5)**   libraries         used in all three  
                                       contracts          

  **TanStack Query   Server state      All frontend API   useQuery(), useMutation(), QueryClientProvider
  (v5)**             management        calls, caching,    
                                       mutation           
                                       invalidation       

  **Recharts**       React charting    Trust score trend  LineChart, AreaChart, PieChart, BarChart
                     library           charts, review     
                                       analytics, admin   
                                       KPI dashboards     

  **Zod**            TypeScript        API request /      z.object(), z.string(), schema.parse(), .refine()
                     validation        response schema    
                     library           enforcement        

  **JWT              JSON Web Token    Session token      jwt.sign(), jwt.verify()
  (jsonwebtoken)**   library           generation, 401    
                                       auto-refresh       

  **Framer Motion    Animation library Page transitions   motion.div, AnimatePresence
  (v11)**                              and                
                                       micro-animations   
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------

  : Table 48 Unit Testing 1: createJob() Smart Contract Function Testing

## User Interface

### Onboarding/Landing Page

The entry point for the application

![](media/image60.png){width="7.15625in" height="3.3602263779527557in"}

![](media/image61.png){width="5.864583333333333in"
height="2.4651443569553804in"}

![](media/image62.png){width="5.8125in"
height="2.729267279090114in"}![](media/image63.png){width="5.875in"
height="3.0520833333333335in"}

[]{#_Toc223897276 .anchor}Figure User Interface for Onboarding/Landing
Page

###  Login 

Users can choose to connect their wallet or sign in via email.

-   **Features:** Wallet connection (RainbowKit), Role selection
    (Client/Freelancer), SIWE authentication. 

![Screens screenshot of a chat AI-generated content may be
incorrect.](media/image64.png){width="6.5in"
height="4.211111111111111in"}

[]{#_Toc223897277 .anchor}Figure User Interface for Login

###  Client Dashboard

A comprehensive view for clients to manage their hiring.

-   **Features:** Active Jobs Widget, Proposals List, Spending
    Overview. 

![](media/image65.png){width="6.5in"
height="3.0520833333333335in"}![](media/image66.png){width="6.5in"
height="3.0520833333333335in"}

[]{#_Toc223897278 .anchor}Figure User Interface for Client Dashboard

### Freelancer Dashboard

The workspace for freelancers.

-   **Features:** Earnings Overview, Active Projects, Job Feed.

![](media/image67.png){width="6.5in"
height="3.0520833333333335in"}![](media/image68.png){width="6.5in"
height="3.0520833333333335in"}

[]{#_Toc223897279 .anchor}Figure User Interface for Freelancer Dashboard

### Job Board

A searchable list of available jobs.

-   **Features:** Search bar, Filters (Category, Budget, Skills), Job
    Cards. 

![A screenshot of a computer AI-generated content may be
incorrect.](media/image69.png){width="6.5in"
height="3.0680555555555555in"}

[]{#_Toc223897280 .anchor}Figure User Interface for Job Board

### Contract Management

The central hub for managing active projects.

-   **Features:** Milestone tracking, Deliverable submission (File/URL),
    Approval & Payment release, Dispute initiation. 

![A screenshot of a chat AI-generated content may be
incorrect.](media/image70.png){width="6.5in"
height="3.109722222222222in"}

[]{#_Toc223897281 .anchor}Figure User Interface for Contract Management

### Profile Management for freelancers

Interface for users to manage their professional identity.

-   **Features:** Bio editing, Skill verification status, Portfolio
    links, Trust Score display. 

![A screenshot of a computer AI-generated content may be
incorrect.](media/image71.png){width="5.892323928258968in"
height="6.966917104111986in"}

[]{#_Toc223897282 .anchor}Figure User Interface for Management for
freelancers

### Profile Management for client 

Interface for users to manage their professional identity.

-   **Features:** Company Name & Description, Location, Website,
    Industry, Profile Completeness Scoring.

![A screenshot of a computer AI-generated content may be
incorrect.](media/image72.png){width="6.5in"
height="4.533333333333333in"}

[]{#_Toc223897283 .anchor}Figure User Interface for Profile Management
for client

### Review & Feedback System

End-to-end review submission and display for completed contracts.

-   **Features**: 4-Category Star Rating (Communication, Quality,
    Timeliness, Professionalism), Double-Blind 14-Day Window,
    Blockchain-Verified Badge, One-Time Rebuttal, Aggregated Rating
    Summary Card, Analytics Charts, Search & Rating Filter.

![](media/image73.png){width="6.5in" height="3.0520833333333335in"}

[]{#_Toc223897284 .anchor}Figure User Interface for Review & Feedback
System

### Trust Score Dashboard

Transparent reputation display for freelancers and clients.

-   **Features:** Numeric Score (0--100) with Colour Coding (Excellent /
    Good / Developing / Not Eligible), Component Breakdown with Weighted
    Progress Bars, Client Penalty Section, Historical Trend Chart, Admin
    Manual-Adjustment Panel.

![](media/image74.png){width="6.008333333333334in"
height="2.74419072615923in"}

[]{#_Toc223897285 .anchor}Figure User Interface for Trust Score
Dashboard

### Dispute Resolution

Full dispute management interface for clients, freelancers, jurors, and
admins.

-   **Features:** Status Tabs (Open / Voting / Resolved), IPFS Evidence
    Upload (5 Files × 25 MB), Juror Eligibility Banner with Reason,
    Trust-Weighted Voting UI, On-Chain Settlement Hash, Dispute History
    Archive with Outcome Filter & Date Range.

![](media/image75.png){width="6.5in"
height="3.0520833333333335in"}![](media/image76.png){width="6.5in"
height="3.0520833333333335in"}

[]{#_Toc223897286 .anchor}Figure User Interface for Dispute Resolution

### In-Platform Messaging

Real-time messaging between clients and freelancers.

-   **Features:** Conversation Sidebar with Unread Badges, Chat Panel
    with Message Bubbles & Timestamps, Participant Search, Real-Time
    Delivery (Socket.IO), Read Receipts, Mobile-Responsive Layout.

![](media/image77.png){width="6.5in" height="3.0520833333333335in"}

[]{#_Toc223897287 .anchor}Figure User Interface for In-Platform
Messaging

### Admin Dashboard

Platform management interface accessible only to administrators.

-   **Features:** 8 KPI Cards, 6-Month Growth & Revenue Charts, User
    Management (Suspend / Activate), Flagged Account Auto-Detection
    (LOW_TRUST / HIGH_DISPUTE_RATE / MULTIPLE_DISPUTES), Review
    Oversight with Blockchain Status Filter, Analytics & Reports Page,
    Platform Settings View.

![](media/image78.png){width="6.5in"
height="3.0520833333333335in"}![](media/image78.png){width="6.523053368328959in"
height="3.7256364829396325in"}

[]{#_Toc223897288 .anchor}Figure User Interface for Admin Dashboard

## Deployment

### Environment

  --------------------------------------------------------------------------
  **Layer**   **Technology**   **Details**
  ----------- ---------------- ---------------------------------------------
  Frontend    Next.js 16.1 +   Server Components for landing and auth
              React 19.2       pages; \'use client\' for interactive
                               dashboard pages; Suspense boundaries
                               throughout

  Backend API Node.js /        REST endpoints, Socket.IO server, background
              Express v4 +     job scheduler
              TypeScript       

  Database    PostgreSQL (via  Managed by Prisma ORM v5; all models migrated
              Docker Compose   
              locally)         

  Smart       Hardhat local    Three contracts are deployed: JobEscrow,
  Contracts   node (chain      ReputationRegistry, DisputeResolution
              31337)           

  File        Pinata IPFS +    Review content and dispute evidence; SHA-256
  Storage     Lighthouse IPFS  fallback ensures zero data loss

  Real-time   Socket.IO (v4)   JWT authentication from httpOnly cookies;
                               user-scoped rooms

  Email       Google SMTP via  HTML templates for welcome, dispute,
              Nodemailer       milestone, and message events

  Caching     In-process Redis 5-minute TTL on user status lookups
              client           in auth.middleware.ts
  --------------------------------------------------------------------------

  : Table 49 Unit Testing 2: validateWalletAddress() Utility Function
  Testing

### Smart Contract Deployment Details

  ----------------------------------------------------------------------------------
  **Contract**             **Address (Hardhat local)**                  **Test
                                                                        Coverage**
  ------------------------ -------------------------------------------- ------------
  DeTrustUSD.sol           0x5FbDB2315678afecb367f032d93F642f64180aa3   ERC-20
                                                                        payment
                                                                        token
                                                                        (tested via
                                                                        JobEscrow)

  JobEscrow.sol            0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9   26 tests
                                                                        passing

  ReputationRegistry.sol   0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512   13 tests
                                                                        passing

  DisputeResolution.sol    0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0   42 tests
                                                                        passing
  ----------------------------------------------------------------------------------

  : Table 50 Unit Testing 3: emergencyWithdraw() Smart Contract Function
  Testing

### Monitoring

-   API health exposed via GET /api/health (returns server uptime,
    database connectivity, blockchain RPC status).

-   Background job lifecycle (start, completion, error) is logged to
    stdout with structured JSON entries.

# Chapter 5: Testing and Evaluation

Once the **DeTrust** system has been successfully developed, testing has
to be performed to ensure that the platform works as intended. This is
also to check that the system meets the requirements stated in the SRS.
Besides that, system testing will help in finding the errors that may be
hidden from the user. The testing must be completed before the smart
contracts and web application are deployed for use.

There are few types of testing which includes unit testing, functional
testing and integration testing. We have performed each of these
in-depth to ensure the quality of the DeTrust ecosystem.

## Unit Testing

Unit testing verifies the smallest testable components of the software
(e.g., individual functions, methods, or classes) in isolation. The
purpose is to ensure that each unit performs as expected, independent of
the full system.

**Unit Testing 1: createJob() Smart Contract Function** **Testing**

**Objective:** To ensure the job creation logic correctly initializes
state and validates inputs.

  -------------------------------------------------------------------------------------
  **No.**   **Test case/Test      **Attribute and Value**  **Expected        **Actual
            script**                                       Result**          Result**
  --------- --------------------- ------------------------ ----------------- ----------
  1         Call createJob with   jobId:                   Job created,      Pass
            valid data            \"0x123\...\", amount:   Funds locked,     
                                  1000                     Event emitted     

  2         Call createJob with   amount: 0                Revert with       Pass
            zero amount                                    \"Invalid         
                                                           amount\" error    

  3         Call createJob with   freelancer:              Revert with       Pass
            invalid freelancer    \"0x000\...\"            \"Invalid         
                                                           address\" error   
  -------------------------------------------------------------------------------------

  : Table 51 Unit Testing 4: calculateProfileCompletion() Utility
  Function Testing

**Unit Testing 2: validateWalletAddress() Utility Function** **Testing**

**Objective:** To ensure the frontend correctly identifies valid
Ethereum addresses before submission.

  -------------------------------------------------------------------------------
  **No.**   **Test case/Test     **Attribute and     **Expected      **Actual
            script**             Value**             Result**        Result**
  --------- -------------------- ------------------- --------------- ------------
  1         Validate correct     \"0x71C\...9C98\"   Returns true    true
            address                                                  

  2         Validate short       \"0x123\"           Returns false   false
            address                                                  

  3         Validate non-hex     \"Hello World\"     Returns false   false
            string                                                   
  -------------------------------------------------------------------------------

  : Table 52 Unit Testing 5: verifyWallet() Backend Service Testing

**Unit Testing 3: emergencyWithdraw() Smart Contract
Function** **Testing**

**Objective:** To verify that only the owner can withdraw funds from a
cancelled job and that fees are handled correctly.

  --------------------------------------------------------------------------------------
  **No.**   **Test case/Test **Attribute and Value**     **Expected Result**  **Actual
            script**                                                          Result**
  --------- ---------------- --------------------------- -------------------- ----------
  1         Owner withdraws  jobId:                      Job Cancelled, Funds Pass
            from active job  \"0x123\...\", recipient:   sent to Owner, Fee   
                             Owner                       retained             

  2         Non-owner        caller: Freelancer          Revert with          Pass
            attempts                                     \"Ownable: caller is 
            withdraw                                     not the owner\"      

  3         Withdraw amount  amount: Total + 1 ETH       Amount capped at     Pass
            \> remaining                                 remaining balance    
  --------------------------------------------------------------------------------------

  : Table Unit Testing 6: recordFeedback() Smart Contract Function
  Testing

**Unit Testing 4: calculateProfileCompletion() Utility
Function** **Testing**

**Objective:** To ensure the profile completion percentage is calculated
accurately based on filled fields.

  ------------------------------------------------------------------------------
  **No.**   **Test          **Attribute and        **Expected         **Actual
            case/Test       Value**                Result**           Result**
            script**                                                  
  --------- --------------- ---------------------- ------------------ ----------
  1         Full Profile    Name, Bio, Skills,     Returns 100%       100%
                            Portfolio present                         

  2         Minimal Profile Only Name and Email    Returns \< 50%     30%

  3         Empty Fields    Null Bio, Empty Skills Returns correct    Pass
                            array                  partial score      
  ------------------------------------------------------------------------------

  : Table Unit Testing 7: castVote() Dispute Voting Function Testing

**Unit Testing 5: verifyWallet() Backend Service** **Testing**

**Objective:** To ensure the backend correctly verifies SIWE signatures
and issues session tokens.

  ----------------------------------------------------------------------------------
  **No.**   **Test         **Attribute and Value**     **Expected         **Actual
            case/Test                                  Result**           Result**
            script**                                                      
  --------- -------------- --------------------------- ------------------ ----------
  1         Verify valid   address:                    Returns User       Pass
            signature      \"0x123\...\", signature:   object + JWT Token 
                           Valid                                          

  2         Verify expired nonce: Old/Used             Throws \"Nonce     Pass
            nonce                                      expired\" error    

  3         Verify invalid signature: Random string    Throws \"Invalid   Pass
            signature                                  signature\" error  
  ----------------------------------------------------------------------------------

  : Table Unit Testing 8: resolveDispute() Fund Distribution Testing

**Unit Testing 6: recordFeedback() --- ReputationRegistry Smart
Contract **

**Objective: **To ensure the ReputationRegistry contract correctly
stores immutable review content hashes on-chain, prevents duplicate
submissions, validates inputs, and emits the FeedbackRecorded event.

  ---------------------------------------------------------------------------------
  **No.**   **Test Case /  **Attribute and     **Expected Result**       **Actual
            Test Script**  Value**                                       Result**
  --------- -------------- ------------------- ------------------------- ----------
  1         Record valid   jobId: valid,       FeedbackRecorded event    Pass
            feedback       reviewed: valid     emitted with correct      
                           address,            args, feedbackCount       
                           contentHash: IPFS   incremented to 1, stored  
                           hash, rating: 4     data matches inputs       

  2         Duplicate      Same jobId and      Revert with \"Already     Pass
            submission     reviewer as prior   submitted\" error         
            (same job +    submission                                    
            same reviewer)                                               

  3         Self-review    reviewed ==         Revert with \"Invalid     Pass
            attempt        reviewer            reviewed\" error          
                           (msg.sender)                                  

  4         Rating out of  rating: 0           Revert with \"Rating out  Pass
            range (0)                          of range\" error          

  5         Rating out of  rating: 6           Revert with \"Rating out  Pass
            range (6)                          of range\" error          

  6         Invalid jobId  jobId:              Revert with \"Invalid     Pass
            (bytes32(0))   ethers.ZeroHash     jobId\" error             

  7         Average rating Two feedbacks:      getAverageRating returns  Pass
            calculation    rating 5 and rating (400, 2) --- average ×    
                           3                   100 for precision         
  ---------------------------------------------------------------------------------

  : Table Unit Testing 9: computeFreelancerTrustScore() Service Function
  Testing

**Unit Testing 7: castVote() --- DisputeResolution Smart Contract**

**Objective:** To ensure that the DisputeResolution contract correctly
enforces juror eligibility (trust score ≥ 50), prevents duplicate
voting, blocks contract parties from voting, validates vote options, and
accumulates trust-weighted vote tallies.

  -----------------------------------------------------------------------------------
  **No.**   **Test Case /    **Attribute and Value**  **Expected Result**  **Actual
            Test Script**                                                  Result**
  --------- ---------------- ------------------------ -------------------- ----------
  1         Eligible juror   juror1 (trustScore=80),  VoteCast event       Pass
            votes ClientWins vote=1 (ClientWins)      emitted with         
                                                      weight=80            

  2         Eligible juror   juror2 (trustScore=60),  VoteCast event       Pass
            votes            vote=2 (FreelancerWins)  emitted with         
            FreelancerWins                            weight=60            

  3         Low trust score  outsider (trustScore=30, Revert with \"Low    Pass
            juror            below 50 threshold)      trust score\"        

  4         Duplicate vote   juror1 votes twice on    Revert with          Pass
                             same dispute             \"Already voted\"    

  5         Client attempts  client (party to         Revert with \"Party  Pass
            to vote          dispute)                 cannot vote\"        

  6         Freelancer       freelancer (party to     Revert with \"Party  Pass
            attempts to vote dispute)                 cannot vote\"        

  7         Invalid vote     vote=0                   Revert with          Pass
            option                                    \"Invalid vote\"     
            (Pending=0)                                                    

  8         Invalid vote     vote=3                   Revert with          Pass
            option (Split=3)                          \"Invalid vote\"     

  9         Vote after       7 days + 1 second        Revert with          Pass
            deadline         elapsed                  \"Deadline passed\"  

  10        Weighted tally   juror1(80)→Client,       clientVotes=170,     Pass
            accumulation     juror2(60)→Freelancer,   freelancerVotes=60   
                             juror3(90)→Client                             
  -----------------------------------------------------------------------------------

  : Table Unit Testing 10: computeClientTrustScore() with Penalties

**Unit Testing 8: resolveDispute() --- JobEscrow Fund Distribution**

**Objective:** To verify that the JobEscrow dispute resolution function
correctly distributes escrowed funds based on three possible outcomes
(CLIENT_WINS, FREELANCER_WINS, SPLIT), handles partial payments, and
enforces access control.

  ----------------------------------------------------------------------------------------------
  **No.**   **Test Case /     **Attribute    **Expected Result**                      **Actual
            Test Script**     and Value**                                             Result**
  --------- ----------------- -------------- ---------------------------------------- ----------
  1         CLIENT_WINS       Job total:     Client receives 1030 dUSD (remaining +   Pass
            (outcome=0), no   1000,          fee), freelancer receives 0, job status  
            prior payments    platformFee:   → Cancelled, platformFee → 0             
                              30                                                      

  2         FREELANCER_WINS   Job total:     Freelancer receives 1000 dUSD,           Pass
            (outcome=1), no   1000,          feeRecipient receives 30 dUSD, job       
            prior payments    platformFee:   status → Completed                       
                              30                                                      

  3         SPLIT             Job total:     Client receives 530 dUSD (500 + 30 fee), Pass
            (outcome=2), no   1000,          freelancer receives 500 dUSD, job status 
            prior payments    platformFee:   → Cancelled                              
                              30                                                      

  4         CLIENT_WINS after Milestone 0    Client receives 530 dUSD (remaining      Pass
            partial payment   (500) already  500 + 30 fee), freelancer keeps prior    
                              paid to        500, paidAmount = totalAmount            
                              freelancer                                              

  5         Non-owner calls   caller: client Revert                                   Pass
            resolveDispute    (not owner)    with OwnableUnauthorizedAccount custom   
                                             error                                    

  6         Job not in        Job status:    Revert with \"Not disputed\" error       Pass
            Disputed status   Funded                                                  

  7         Invalid outcome   outcome: 3     Revert with \"Invalid outcome\" error    
            \> 2                                                                      
  ----------------------------------------------------------------------------------------------

  : Table 58 Functional Testing 1: User Login and Role Redirection

**Unit Testing 9: computeFreelancerTrustScore() --- Trust Score
Service *(NEW at 60%)***

**Objective:** To ensure the trust score computation for freelancers
correctly normalises all components to a 0--100 scale, applies the
weighted formula (0.4 × AvgRating) + (0.3 × CompletionRate) + (0.2 ×
DisputeWinRate) + (0.1 × Experience), enforces the 5-contract
eligibility gate, and applies inactivity decay

  ----------------------------------------------------------------------------------
  **No.**   **Test Case  **Attribute and Value** **Expected Result**      **Actual
            / Test                                                        Result**
            Script**                                                      
  --------- ------------ ----------------------- ------------------------ ----------
  1         Full profile avgRating: 4.5,         Normalised: rating=90,   Pass
            with 10      completedContracts: 10, completion=83.3,         
            completed    totalContracts: 12,     dispute=100,             
            contracts    wonDisputes: 1,         experience=20. rawScore  
                         totalDisputes: 1        ≈ 83. Returns            
                                                 eligible=true            

  2         Fewer than 5 completedContracts: 3   Returns { totalScore:    Pass
            completed                            null, eligible: false,   
            contracts                            minimumContracts: 5,     
                                                 currentContracts: 3 }.   
                                                 Profile trustScore set   
                                                 to 0                     

  3         No disputes  totalDisputes: 0        disputeWinRate defaults  Pass
            (neutral                             to 50 (neutral).         
            default)                             Freelancer is neither    
                                                 penalised nor rewarded   

  4         Inactivity   lastContractActivity:   decayFactor = max(0.5, 1 Pass
            \> 90 days   180 days ago            − (180−90)/365) = 0.753. 
                                                 totalScore = rawScore ×  
                                                 0.753                    
  ----------------------------------------------------------------------------------

  : Table 59 Functional Testing 2: Job Posting Flow

**Unit Testing 10: computeClientTrustScore() --- Client Penalty
Modifiers**

**Objective:** To ensure the client trust score computation applies the
weighted formula (0.4 × AvgRating) + (0.3 × PaymentPunctuality) + (0.2 ×
HireRate) + (0.1 × JobClarityRating) and correctly applies post-formula
penalty deductions for cancellations (up to −10 pts) and lost disputes
(up to −15 pts).

  -----------------------------------------------------------------------------------
  **No.**   **Test Case /  **Attribute and Value**  **Expected Result**    **Actual
            Test Script**                                                  Result**
  --------- -------------- ------------------------ ---------------------- ----------
  1         Clean record   avgRating: 4.0, 10       rawScore ≈ 76. No      Pass
            client         completed, 0 cancelled,  penalties applied.     
                           0 lost disputes          totalScore = rawScore  

  2         High           5 cancelled out of 10    cancellationRate =     Pass
            cancellation   total contracts          0.5, penalty = 0.5 ×   
            rate                                    10 = −5 pts.           
                                                    penalisedScore =       
                                                    rawScore − 5           

  3         Lost disputes  3 disputes lost          disputeRate = 0.3,     Pass
            penalty        (FREELANCER_WINS) out of penalty = 0.3 × 15 =   
                           10 contracts             −4.5 pts.              
                                                    penalisedScore =       
                                                    rawScore − 4.5         

  4         Score floored  Extreme penalties        penalisedScore =       Pass
            at 0           exceeding raw score      max(0, rawScore −      
                                                    penalties). Score      
                                                    never goes negative    
  -----------------------------------------------------------------------------------

  : Table 60 Functional Testing 3: Proposal Submission Flow

## Functional Testing

Functional testing validates that the system modules work correctly as a
whole, ensuring that the developed system meets its specifications and
requirements. Unlike unit testing, which focuses on internal functions,
functional testing evaluates user-facing features through the UI or
APIs.

**Functional Testing 1: User Login and Role Redirection** 

**Objective:** To ensure that users are redirected to the correct
dashboard based on their registered role.

  ---------------------------------------------------------------------------------------
  **No.**   **Test Case**    **Attribute   **Expected Result** **Actual      **Result**
                             and value**                       Result**      
  --------- ---------------- ------------- ------------------- ------------- ------------
  1         Login as         Wallet:       Client Dashboard    Redirected to Pass
            \'Client\'       0xABC\...     with \"Post Job\"   Client        
                             (Registered   button is displayed Dashboard     
                             Client)                                         

  2         Login as         Wallet:       Freelancer          Redirected to Pass
            \'Freelancer\'   0xDEF\...     Dashboard with      Freelancer    
                             (Registered   \"Find Work\"       Dashboard     
                             Freelancer)   button is displayed               

  3         Login with       Wallet:       Onboarding/Role     Redirected to Pass
            Unregistered     0x999\...     Selection page is   Onboarding    
            Wallet           (New User)    displayed                         
  ---------------------------------------------------------------------------------------

  : Table Functional Testing 4: Review Submission with Double-Blind
  Window

**Functional Testing 2: Job Posting Flow** 

**Objective:** To verify that a client can successfully post a job and
it appears on the board.

  ------------------------------------------------------------------------------------
  **No.**   **Test     **Attribute and **Expected Result** **Actual       **Result**
            Case**     value**                             Result**       
  --------- ---------- --------------- ------------------- -------------- ------------
  1         Submit Job Title: \"React  Job saved to DB,    Job Created    Pass
            Form       Dev\", Budget:  \"Job Created\"     Successfully   
                       \$500           toast appears                      

  2         Check Job  Filter:         The new \"React     Job is visible Pass
            Board      \"Recent\"      Dev\" job appears                  
                                       at the top                         

  3         Invalid    Budget: -100    Form validation     Error          Pass
            Budget                     error \"Budget must displayed      
            Input                      be positive\"                      
  ------------------------------------------------------------------------------------

  : Table Functional Testing 5: Dispute Lifecycle

**Functional Testing 3: Proposal Submission Flow** 

**Objective:** To verify that freelancers can submit proposals only when
eligible.

  -------------------------------------------------------------------------------------
  **No.**   **Test Case**    **Attribute and **Expected        **Actual    **Result**
                             value**         Result**          Result**    
  --------- ---------------- --------------- ----------------- ----------- ------------
  1         Submit Valid     Job: Open,      Proposal created, Success     Pass
            Proposal         Profile:        Client notified               
                             Complete                                      

  2         Submit to Own    Freelancer =    Error: \"Cannot   Error       Pass
            Job              Client          submit to own     displayed   
                                             job\"                         

  3         Submit with      Profile:        Error: \"Complete Error       Pass
            Incomplete       Missing Skills  profile first\"   displayed   
            Profile                                                        
  -------------------------------------------------------------------------------------

  : Table 63 Business Rule 1: Milestone Payment Release Conditions

**Functional Testing 4: Review Submission with Double-Blind Window**

**Objective:** To verify the review submission flow including the 14-day
double-blind window, IPFS upload, blockchain hash recording, and
one-time rebuttal.

  -------------------------------------------------------------------------------------------------------
  **No.**   **Test Case**   **Attribute    **Expected Result**                   **Actual    **Result**
                            and Value**                                          Result**    
  --------- --------------- -------------- ------------------------------------- ----------- ------------
  1         Submit valid    Contract:      Review created, IPFS upload triggered Success     Pass
            review          COMPLETED,     async,                                            
                            ratings: 4.5   ReputationRegistry.recordFeedback()               
                            overall,       called, trust scores recalculated for             
                            comment: 200   both parties, subject notified                    
                            chars          (REVIEW_RECEIVED)                                 

  2         Double-blind:   1 review       Subject cannot see the review; author Review      Pass
            only one party  submitted,     can see their own                     hidden      
            reviewed        \<14 days                                                        
                            elapsed                                                          

  3         Double-blind:   Both client    Both reviews become visible to both   Both        Pass
            both parties    and freelancer parties                               visible     
            reviewed        submitted                                                        

  4         Double-blind:   1 review       Review becomes visible to all         Review      Pass
            14-day window   submitted,     regardless                            visible     
            expires         \>14 days                                                        
                            elapsed                                                          

  5         Duplicate       Same           ValidationError: \"You have already   Error       Pass
            review attempt  authorId +     submitted a review for this           displayed   
                            contractId     contract\"                                        

  6         One-time        Subject        Response saved with timestamp, cannot Response    Pass
            rebuttal        submits        be edited or resubmitted              saved       
                            responseText                                                     
  -------------------------------------------------------------------------------------------------------

  : Table 64 Business Rule 2: Proposal Creation Eligibility Conditions

**Functional Testing 5: Dispute Lifecycle**

**Objective:** To verify the complete dispute lifecycle from creation
through evidence submission, voting phase, and resolution with on-chain
settlement.

  ---------------------------------------------------------------------------------------------
  **No.**   **Test Case**   **Attribute and **Expected Result**      **Actual      **Result**
                            Value**                                  Result**      
  --------- --------------- --------------- ------------------------ ------------- ------------
  1         Create dispute  Contract        Dispute created (OPEN),  Success       Pass
            on active       status: ACTIVE, Contract → DISPUTED, Job               
            contract        initiator:      → DISPUTED, other party                
                            client          notified, Socket.IO                    
                                            event emitted                          

  2         Submit evidence 3 files, each   Files uploaded via       Evidence      Pass
            (upload)        \< 25 MB        storageService,          attached      
                                            DisputeEvidence records                
                                            created with                           
                                            uploadedById, CIDs                     
                                            stored                                 

  3         Admin starts    Admin calls     Status → VOTING,         Voting        Pass
            voting          startVoting     votingDeadline = now + 7 started       
                                            days, eligible jurors                  
                                            notified via BullMQ                    

  4         Juror           User:           Returns { eligible:      Eligibility   Pass
            eligibility     trustScore=45   false,                   denied        
            check           (below 50)      meetsScoreRequirement:                 
                                            false }                                

  5         Admin resolves  Outcome:        Contract → CANCELLED,    Resolution    Pass
            (CLIENT_WINS)   CLIENT_WINS     escrow refund via        complete      
                                            on-chain                               
                                            resolveDispute(), trust                
                                            scores recalculated via                
                                            BullMQ                                 
  ---------------------------------------------------------------------------------------------

  : Table 65 Test Cases based on Decision Table

## 5.3 Business Rules Testing {#business-rules-testing .list-paragraph}

Decision table based testing technique is used to test business rules.
The business rules were defined in FRs and Use Cases. Decision based
testing uses a systematic approach where input and outputs are provided
in tabular form. It is a precise and compact way to model complicated
logic.

**Business Rule 1: Milestone Payment Release** **Conditions:**

1.  Is the caller the Client?

2.  Is the Milestone status \'Submitted\'?

3.  Is the Contract active?

**Decision Table:**

  --------------------------------------------------------------------------
  **Conditions**     **Rule   **Rule 2**      **Rule 3**     **Rule 4**
                     1**                                     
  ------------------ -------- --------------- -------------- ---------------
  Caller is Client?  Yes      No              Yes            Yes

  Milestone          Yes      Yes             No             Yes
  Submitted?                                                 

  Contract Active?   Yes      Yes             Yes            No

  **Actions**                                                

  Release Payment    **X**                                   

  Revert Transaction          **X**           **X**          **X**

  Error Message               \"Not           \"Not          \"Contract
                              Authorized\"    Submitted\"    Paused\"
  --------------------------------------------------------------------------

  : Table Business Rule 3: Juror Eligibility Decision Table

**Business Rule 2: Proposal Creation Eligibility** **Conditions:**

1.  Is Job Status \'OPEN\'?

2.  Is Freelancer != Client?

3.  Is Profile Complete?

**Decision Table:**

  -------------------------------------------------------------------------
  **Conditions**        **Rule    **Rule 2**    **Rule 3**    **Rule 4**
                        1**                                   
  --------------------- --------- ------------- ------------- -------------
  Job Open?             Yes       No            Yes           Yes

  Not Own Job?          Yes       Yes           No            Yes

  Profile Complete?     Yes       Yes           Yes           No

  **Actions**                                                 

  Create Proposal       **X**                                 

  Throw Error                     **X**         **X**         **X**

  Error Type                      Forbidden     Forbidden     Forbidden
  -------------------------------------------------------------------------

  : Table Juror Eligibility Test Cases

**Test Cases based on Decision Table:**

  ---------------------------------------------------------------------------------
  **No.**   **Rule**   **Inputs**           **Expected Output**        **Actual
                                                                       Output**
  --------- ---------- -------------------- -------------------------- ------------
  1         Rule 1     Open Job, Valid      Proposal Created           Pass
                       Freelancer                                      

  2         Rule 2     Closed Job           Error: \"Job not accepting Pass
                                            proposals\"                

  3         Rule 3     Client attempts      Error: \"Cannot submit to  Pass
                       submission           own job\"                  
  ---------------------------------------------------------------------------------

  : Table 68 Integration Testing 1: Secure Job Funding Testing

**Business Rule 3: Juror Eligibility for Dispute Voting **

**Conditions:**

1.  Is Trust Score ≥ 50?

2.  Is User not a party to the dispute?

3.  Has User not already voted?

4.  Is Dispute in VOTING status?

5.  Is voting deadline not passed?

  ------------------------------------------------------------------------------
  **Conditions**   **Rule   **Rule 2**    **Rule 3**     **Rule 4**   **Rule 5**
                   1**                                                
  ---------------- -------- ------------- -------------- ------------ ----------
  Trust ≥ 50?      Yes      No            Yes            Yes          Yes

  Not Party?       Yes      Yes           No             Yes          Yes

  Not Voted?       Yes      Yes           Yes            No           Yes

  Status VOTING?   Yes      Yes           Yes            Yes          No

  Within Deadline? Yes      Yes           Yes            Yes          Yes

  **Actions**                                                         

  Allow Vote       ✓                                                  

  Deny Vote                 ✓             ✓              ✓            ✓

  Reason                    \"Low trust   \"Party cannot \"Already    \"Not
                            score\"       vote\"         voted\"      voting\"
  ------------------------------------------------------------------------------

  : Table 69 Integration Testing 2: Dispute Escalation Testing

**Test Cases Based on Decision Table:**

  ---------------------------------------------------------------------------------
  **No.**   **Rule**   **Inputs**                    **Expected         **Actual
                                                     Output**           Output**
  --------- ---------- ----------------------------- ------------------ -----------
  1         Rule 1     Trust=80, not party, not      Vote accepted,     Pass
                       voted, VOTING phase           weight=8           

  2         Rule 2     Trust=30 (\<50 threshold)     Revert: \"Low      Pass
                                                     trust score\"      

  3         Rule 3     Client tries to vote on own   Revert: \"Party    Pass
                       dispute                       cannot vote\"      

  4         Rule 4     Juror votes twice             Revert: \"Already  Pass
                                                     voted\"            

  5         Rule 5     Deadline passed (\>7 days)    Revert: \"Deadline Pass
                                                     passed\"           
  ---------------------------------------------------------------------------------

  : Table 70 Integration Testing 3: Platform Fee Payout Testing

## 5.4 Integration Testing {#integration-testing .list-paragraph}

Integration testing verifies that different modules of the system work
together correctly. Unlike unit testing (which checks isolated
functions) and functional testing (which checks features from a user's
perspective), integration testing focuses on the interfaces, linkages,
and data flow between modules.

**Integration Testing 1: Secure Job Funding** **Testing**

**Objective:** To ensure the interface between the Frontend, Smart
Contract, and Database is synchronized during job funding.

  ----------------------------------------------------------------------------------------
  **No.**   **Test        **Attribute and     **Expected        **Actual      **Result**
            case/Test     value**             result**          result**      
            script**                                                          
  --------- ------------- ------------------- ----------------- ------------- ------------
  1         Client Funds  Amount: 1.5 ETH     Wallet prompts    Transaction   Pass
            Job (Web -\>                      signature,        Hash          
            Contract)                         Transaction       generated     
                                              broadcasted                     

  2         Backend Sync  Event: JobCreated   Database updates  Status        Pass
            (Contract -\>                     Job status to     updated in \< 
            DB)                               \"Funded\"        5s            

  3         UI Update (DB Page Refresh        Job card shows    Badge visible Pass
            -\> Web)                          \"Funded\" badge                
  ----------------------------------------------------------------------------------------

  : Table 71 Integration Testing 4: Proposal Acceptance & Contract
  Generation Testinge

**Integration Testing 2: Dispute Escalation** **Testing**

**Objective:** To verify that raising a dispute on the web app correctly
triggers the smart contract and notifies the admin.

  -----------------------------------------------------------------------------------------
  **No.**   **Test          **Attribute and value** **Expected      **Actual   **Result**
            case/Test                               result**        result**   
            script**                                                           
  --------- --------------- ----------------------- --------------- ---------- ------------
  1         Raise Dispute   Reason: \"No delivery\" Contract state  State      Pass
            (Web -\>                                changes         updated    
            Contract)                               to Disputed     on-chain   

  2         Admin           Event: DisputeCreated   Admin receives  Alert      Pass
            Notification                            alert/email     received   
            (Contract -\>                                                      
            API)                                                               
  -----------------------------------------------------------------------------------------

  : Table Integration Testing 5: Review Integrity Pipeline

**Integration Testing 3: Platform Fee Payout** **Testing**

**Objective:** To ensure the platform fee is correctly calculated and
transferred to the admin wallet upon job completion.

  ---------------------------------------------------------------------------------------
  **No.**   **Test        **Attribute   **Expected result**       **Actual   **Result**
            case/Test     and value**                             result**   
            script**                                                         
  --------- ------------- ------------- ------------------------- ---------- ------------
  1         Complete Last Job Total:    JobCompleted event        Event      Pass
            Milestone     1000, Fee: 3% emitted                   emitted    

  2         Check Fee     Before: 100,  Balance increases by 30   Balance =  Pass
            Recipient     Fee: 30                                 130        
            Balance                                                          

  3         Check         Before: 1030  Balance decreases by 1030 Balance =  Pass
            Contract                    (1000 to freelancer, 30   0          
            Balance                     to admin)                            
  ---------------------------------------------------------------------------------------

  : Table Integration Testing 6: On-Chain Dispute Settlement

**Integration Testing 4: Proposal Acceptance & Contract
Generation** **Testing**

**Objective:** To verify that accepting a proposal correctly triggers
contract creation, notification, and job status update.

  ---------------------------------------------------------------------------------------
  **No.**   **Test       **Attribute   **Expected result**    **Actual       **Result**
            case/Test    and value**                          result**       
            script**                                                         
  --------- ------------ ------------- ---------------------- -------------- ------------
  1         Client       Proposal ID:  1\. Proposal Status    All actions    Pass
            Accepts      \"123\"       -\> ACCEPTED\          completed      
            Proposal                   2. Job Status -\>      atomically     
                                       IN_PROGRESS\                          
                                       3. Contract Record                    
                                       Created\                              
                                       4. Freelancer Notified                

  2         Reject Other Job ID:       All other proposals    Status updated Pass
            Proposals    \"ABC\"       for Job \"ABC\" set to                
                                       REJECTED                              
  ---------------------------------------------------------------------------------------

  : Table Smart Contract Test Suite Summary

**Integration Testing 5: Review → IPFS → Blockchain → Trust Score
Pipeline**

**Objective:** To verify the end-to-end pipeline from review submission
through IPFS upload, on-chain hash recording via ReputationRegistry, and
trust score recalculation.

  ----------------------------------------------------------------------------------------------------
  **No.**   **Test Case /  **Attribute   **Expected Result**                   **Actual   **Result**
            Test Script**  and Value**                                         Result**   
  --------- -------------- ------------- ------------------------------------- ---------- ------------
  1         Review         Review JSON   Pinata.uploadJSON() returns valid     IPFS hash  Pass
            submission     with ratings  IPFS CID, ipfsHash stored on Review   attached   
            triggers IPFS  and comment   record                                           
            upload                                                                        

  2         IPFS hash      ipfsHash:     ReputationRegistry.recordFeedback()   Tx hash    Pass
            recorded on    valid CID     emits FeedbackRecorded event,         recorded   
            blockchain                   blockchainTxHash stored                          

  3         Trust scores   Both author   Trust scores recomputed for both      Scores     Pass
            recalculated   and subject   parties, TrustScoreHistory snapshot   updated    
                           userId        created, Socket.IO event emitted                 

  4         IPFS failure   Pinata        SHA-256 content hash used as fallback Fallback   Pass
            fallback       unavailable   (prefix sha256:), blockchain retry    hash       
                                         job picks up later                    stored     
  ----------------------------------------------------------------------------------------------------

**Integration Testing 6: On-Chain Dispute Resolution Fund Settlement**

**Objective:** To verify the complete integration between the off-chain
dispute resolution (API + DB) and on-chain fund distribution
(JobEscrow.resolveDispute) across all three outcomes.

  -------------------------------------------------------------------------------------------------
  **No.**   **Test Case / Test **Attribute and      **Expected Result**   **Actual     **Result**
            Script**           Value**                                    Result**     
  --------- ------------------ -------------------- --------------------- ------------ ------------
  1         CLIENT_WINS (juror 3 jurors:            DisputeResolution →   Settlement   Pass
            voting)            ClientWins(80+90),   outcome=ClientWins.   complete     
                               FreelancerWins(60)   JobEscrow refunds                  
                                                    1030 dUSD to client.               
                                                    Contract → CANCELLED               

  2         FREELANCER_WINS    3 jurors all vote    1000 dUSD released to Settlement   Pass
            (juror voting)     FreelancerWins       freelancer, 30 dUSD   complete     
                                                    to feeRecipient.                   
                                                    Contract → COMPLETED,              
                                                    unpaid milestones →                
                                                    PAID                               

  3         SPLIT (tied votes) 2 jurors with equal  Client receives 530   Settlement   Pass
                               weights vote each    dUSD (500 + 30 fee),  complete     
                               way                  freelancer receives                
                                                    500 dUSD                           

  4         Insufficient       Only 1 juror voted   Revert: \"Not enough  Resolution   Pass
            jurors             (minJurors=3)        jurors\", admin       blocked      
                                                    notified for manual                
                                                    resolution                         
  -------------------------------------------------------------------------------------------------

**Smart Contract Test Coverage Summary**

The complete Hardhat test suite is run via npx hardhat test and produces
the following results:

  -------------------------------------------------------------------------------------------
  **Contract**             **Test File**                **Tests   **Tests   **New Categories
                                                        (30%)**   (60%)**   at 60%**
  ------------------------ ---------------------------- --------- --------- -----------------
  JobEscrow.sol            JobEscrow.test.ts            26        **26**    resolveDispute (7
                                                                            new tests for
                                                                            dispute fund
                                                                            distribution)

  ReputationRegistry.sol   ReputationRegistry.test.ts   ---       **13**    *(Entire contract
                                                                            is new at 60%)*

  DisputeResolution.sol    DisputeResolution.test.ts    ---       **42**    *(Entire contract
                                                                            is new at 60%)*

  **Total**                                             **26**    **81**    **+55 new tests**
  -------------------------------------------------------------------------------------------

# Chapter 6: Conclusion and Future Work

The implementation of **DeTrust**, a decentralized freelance
marketplace, successfully addresses the core issues of trust and payment
security in the gig economy. By leveraging blockchain technology for
escrow services and identity management, the system eliminates the need
for traditional intermediaries, reducing fees and enhancing
transparency.

-   **Core Functionality:** Successfully implemented 

-   **Module 1 (Web App),** **Module 2 (Smart Contract Job Board)**,
    **Module 3 (Review & Reputation System), Module 4 (Trust Score)**,
    and **Module 5 (Dispute Resolution)**. Users can register via
    Ethereum wallets, post jobs, submit proposals with eligibility
    gates, manage milestone-based contracts with full escrow protection,
    submit double-blind reviews, and resolve disputes through
    trust-weighted community voting.

-   **Smart Contract Suite:** Three Solidity contracts (JobEscrow.sol,
    ReputationRegistry.sol, DisputeResolution.sol) are deployed on the
    Hardhat local node with 81 passing tests (up from 26 at 30%)
    covering all critical paths including fund distribution, access
    control, weighted voting, and on-chain review integrity.

-   **Problem Solving:** The Smart Contract Escrow system ensures that
    freelancers are paid only when work is verified and approved
    (milestone-based), and clients can recover funds through dispute
    resolution if terms are not met. The on-chain ReputationRegistry
    makes review feedback immutable and independently verifiable.
    problems identified in Chapter 1.

-   **Major Features:**

    -   **Wallet-Based Auth:** Secure, non-custodial login using SIWE.

    -   **Milestone Payments:** Granular control over project funds.

    -   **Dispute Resolution:** A decentralized mechanism for conflict
        arbitration.

    -   **Review & Reputation System:** 4-category star ratings, 14-day
        double-blind window, IPFS content hashing, blockchain-verified
        badge, one-time rebuttal.

    -   **Trust Score Engine**: Weighted formula with role-specific
        components, 5-contract eligibility gate, inactivity decay,
        client penalty modifiers (cancellation, dispute behavior).

    -   **Dispute Resolution**: Full lifecycle (OPEN → VOTING →
        RESOLVED), IPFS evidence upload with party attribution,
        trust-weighted juror voting, on-chain fund settlement with three
        outcomes.

    -   **Real-Time Messaging**: Socket.IO-based conversations with read
        receipts.

    -   **Admin Dashboard:** KPI cards, growth charts, user management,
        flagged account detection.

    -   **Email Notifications:** HTML digests for disputes, milestones,
        messages, and welcome events.

-   **User Experience:** The Next.js 16.1 + React 19.2 frontend provides
    a modern, responsive interface that abstracts the complexities of
    blockchain interactions, making the platform accessible to
    non-technical users.

**Limitations:**

-   **Transaction Costs:** While the system is designed for Polygon to
    reduce fees, production deployment is still on the Hardhat local
    node. Users will need MATIC for gas on mainnet, which can be a
    friction point for onboarding..

-   **AI Features:** The AI Capability Prediction (Module 6) remains a
    static rule-based score (100-point scale). The full ML model with
    profile analysis and transaction history prediction is deferred to
    100%..

## Future Work

The future work section outlines possible enhancements, extensions, or
research directions that can improve the system beyond its current
scope. This demonstrates forward-thinking and helps future developers or
researchers build upon the foundation laid by your project.

-   **AI Capability Prediction (Module 6):**

    -   **Plan:** Implement the Machine Learning model to analyze
        freelancer profiles and transaction history to predict \"Success
        Probability\" for jobs.

    -   **Tech:** Python (FastAPI), Scikit-learn/TensorFlow.

-   **Mobile Application:**

    -   **Plan:** Develop a native mobile app (React Native) to allow
        users to manage jobs and chat on the go.

    -   **Enhancement:** Push notifications for milestone updates and
        messages.

-   **Mainnet Launch:**

    -   **Plan:** Migrate from Polygon Amoy Testnet to the Polygon
        Mainnet.

    -   **Enhancement:** Implement fiat on-ramps (e.g., Stripe/MoonPay)
        to allow clients to pay with credit cards while settling in
        crypto.

-   **DAO Governance:**

    -   **Plan:** Transition the platform administration to a
        Decentralized Autonomous Organization (DAO), allowing token
        holders to vote on fee structures and dispute resolution
        policies.

-   **Advanced Analytics:**

    -   **Plan:** Provide clients with detailed dashboards showing
        spending trends, freelancer performance metrics, and market rate
        analysis.

#  {#section .list-paragraph}

# Chapter 7: References

**Article in a Journal**

Nguyen, T., Lee, G. M., Sun, K., Guitton, F., & Guo, Y. "A
Blockchain-based Trust System for Decentralised Applications: When
trustless needs trust." Future Generation Computer Systems, vol. 124,
pp. 68--79, May 2021

\[1\] IEEE, \"MIG: Addressing the Cold-Start Problem in Task
Recommendations,\" 2024,
<https://ieeexplore.ieee.org/document/10831509/>

**Articles from Conference Proceedings**

Radosavljevic, M., Pesic, A., Petrovic, N., & Tosic, M. "Freelancing
Blockchain: A Practical Case-Study of Trust-Driven Applications
Development." Proceedings of the 2021 International Conference on
Electrical, Electronic, and Computing Engineering (IcETRAN), Ethno
Village Stanisic, Bosnia and Herzegovina, pp. 8--10, September 2021.

**World Wide Web**

\[2\] Kellogg School of Management. (2022). *Algorithmic Bias in Online
Labor Platforms*. Retrieved from:
[[https://insight.kellogg.northwestern.edu/article/algorithmic-bias-gig-economy]{.underline}](https://insight.kellogg.northwestern.edu/article/algorithmic-bias-gig-economy)

\[3\] Upwork. (2025). *Upwork Service Fees*. Retrieved from:
[[https://support.upwork.com/hc/en-us/articles/211062538-Freelancer-Service-Fees]{.underline}](https://support.upwork.com/hc/en-us/articles/211062538-Freelancer-Service-Fees)

\[4\] Fiverr. (2025). *Fiverr Seller Fees*. Retrieved from:
[[https://www.fiverr.com/terms_of_service/seller]{.underline}](https://www.fiverr.com/terms_of_service/seller)

\[5\] Freelancers Union & Upwork. (2025). *Survey: Freelancers and
Payment Challenges*. Retrieved from:
[[https://www.freelancersunion.org/resources/freelancing-in-america/]{.underline}](https://www.freelancersunion.org/resources/freelancing-in-america/)

\[6\] Upwork. (2025). *Dispute Assistance Process*. Retrieved from:
[[https://support.upwork.com/hc/en-us/articles/211067788-Dispute-Assistance]{.underline}](https://support.upwork.com/hc/en-us/articles/211067788-Dispute-Assistance)

\[7\] Upwork. (2025). *Arbitration Rules*. Retrieved from:
[[https://www.upwork.com/legal#arb]{.underline}](https://www.upwork.com/legal#arb)

\[8\] public dataset :[Freelance Contracts Dataset (1.3 Million
Entries)](https://www.kaggle.com/datasets/asaniczka/freelance-contracts-dataset-1-3-million-entries)

# Chapter 8: Plagiarism Report

![](media/image79.jpeg){width="5.493946850393701in"
height="7.1098479877515315in"}

[]{#_Toc223897289 .anchor}Figure 67 Plagiarism Report
