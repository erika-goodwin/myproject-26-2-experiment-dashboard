## Experiment Dashboard / CRO Dashboard 
_A/B testing? Tracking clicks and conversions? No problem!_

<img width="1536" height="1024" alt="Mockup Example" src="https://github.com/user-attachments/assets/5bf417b6-011a-4184-a75b-44f24473e236" />

A lightweight experimentation and feature-flag dashboard that allows product teams to create experiments, track user behavior via a custom event pipeline, and analyze results to support data-driven product decisions.
The site will be fully responsive, fast, and designed with a minimal, professional aesthetic.

- **Tech Stack:** React, Vite, TypeScript, Tailwind CSS / Node.js, Express, REST APIs / PostgreSQL, Supabase

- **Check App:** Currently Building

### Purpose

I built this application to deepen my backend experience while showcasing the parts of CRO and product experimentation work that are usually invisible.
The project combines a full-stack experimentation dashboard with a custom event-tracking pipeline, allowing experiments to be created, users to be assigned to variants, and results to be calculated from raw behavioral data.
The goal was not to build a polished analytics platform, but to demonstrate how frontend, backend, and data collection work together in real product environments, including event instrumentation, backend validation, and analytics-driven decision making.

### Core Features

- Authentication
- Experiment creation & management
- Custom event tracking
- Results aggregation
- Deployed full-stack app

### Out of Scope (By design)
- External Analytics & SDKs (like GA)
- Advanced Statistics & Significance Testing (like multi-metric optimization)
- Larhe Scale Infrastructure
- Full User Management
    - Signup flow
    - Password recovery
    - Oauth Providers
    - Multi-tenant organization
- Marketing Futures / SEO features
- Complex Feature Flag Rules (like user attributes)
- Real Payment
- Data Privacy / Compliance system

### Progress 
- Data Model Planning (Experiments, Variants, Assignments, Events, Users)
- Backend set up (Node.js, Express, Supabase/PostgreSQL)
- [B] Auth/User CRUD API (GET, POST)
- [B] Experiments CRUD API (GET, POST, PUT, DELETE)
- [B] Authentication / Access control (Auth Middleware)
- Variant Assignment & Event Tracking <= Right here right now





