# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: **Astro**, with MDX for posts. Chosen because the site is content-led (long posts mixing images and text), Astro ships almost no JavaScript on reading pages, and an interactive piece can still be added to a single post when one earns it. Static output, so it deploys anywhere. Hosting is undecided.

## Users

- **Primary: Fikri and peers.** It is a personal playground and record: a place to gather experiments and creative design work, and to write about each project after building it.
- **Secondary: peers in design and engineering** who arrive via links (GitHub, LinkedIn, social posts), skim the landing page, and read a post about a specific project.
- Not aimed at recruiters or clients; no hiring or sales goal.

## Product Purpose

A landing page plus a blog. Every project Fikri builds gets a post that explains what it is, what was done and learned, how it was built, and what could be improved. The site is itself a creative project: an expressive, interactive piece of work, not a neutral container. Success means Fikri enjoys adding to it, and a visitor both remembers the site and finishes reading a post.

## Positioning

A design-and-engineering playground by someone who builds across the whole stack (realtime data, data visualisation, backend architecture, UI design) and writes up each build honestly, including what broke. Several projects use Malaysian public data and places (KTMB trains, LRT Kelana Jaya line, Malaysian birthdates). The previous site's intro ("this is where I break things (and occasionally fix them)", "a place where I can test ideas that sound cool in my head") shows the spirit, but its wording is a reference, not a commitment.

## Operating Context

- Fikri writes posts in the repo (MDX), one per project, often with screenshots, diagrams, code and links to a live demo and GitHub repos.
- Visitors read on desktop and phone; posts are long-form with images and text interleaved.
- Content is still being gathered; the site launches with a small set of posts and grows over time.

## Capabilities and Constraints

- **Landing page:** introduces Fikri and the playground; leads into the posts. Exact content still undecided (Fikri is "still thinking what to put").
- **Blog:** one post per project. The previous site's post structure (Introduction → what was done/learned → stack/architecture → improvements → resources) is a known working template, not a requirement.
- Posts must support rich content: images placed with text, captions, code blocks, embedded live/interactive demos, external links.
- Motion is quiet and never required: reading a post must never depend on an interaction completing.
- Undecided: about/contact page, tags or categories, RSS, hosting, domain.

## Brand Commitments

- **Name:** Fikri.
- **Voice:** casual and curious. The previous site's wording ("break things (and occasionally fix them)") is a reference only; copy, structure and flow may be rewritten freely.
- **Binding visual constraints from Fikri** (the surface brief holds the full direction):
  - Elegant and formal. Typography must be top-notch and built for long content with images and text interlinked.
  - A print effect with real illustration, but **not riso** (Fikri has already done a riso project). Ink should look pressed into paper, uneven rather than smooth.
  - Avoid: the generic editorial blog look, hard-to-read type, wedding-invitation fanciness.
  - Motion stays quiet and refined.
- **Direction history:** a first, interactive "lattice" edition (pop-up tiles and wayang-kulit-style cast shadows) was built, then replaced on 2026-11-07 by the formal private-press edition Fikri preferred. The lattice code is archived in `.impeccable/archive/lattice-edition/`.

## Evidence on Hand

Projects from the previous site (https://fikri-mauve.vercel.app/), GitHub account `ahmadanwar93`:

- **KTMB Tracker** (Nov 2025): realtime train tracking with GTFS Realtime + Protocol Buffers. Live: https://ktmb-tracker.vercel.app/ · Repo: github.com/ahmadanwar93/ktmb-tracker · React/TS, Vite, Tailwind, Leaflet, protobufjs, PapaParse.
- **Event replay** (Nov 2025): event-driven order system with event replay and idempotent listeners; Pest tests. Repo: github.com/ahmadanwar93/event-replay-simple.
- **Task management app** (Nov 2025, in progress): Laravel + React; workspaces, sprints, tasks. Repos: task-management-backend, task-management-frontend.
- **Birthday visualisation** (Aug 2024): birthdates in Malaysia.
- **LRT Visualisation** (Aug 2024): travel times on the LRT Kelana Jaya line.
- **Dictionary exploration** (Aug 2023): learning to design in Figma.

Existing post text and cover images live on the old site. They are reference material, not copy to migrate verbatim: wording, post structure and site flow can all change. Project facts (names, dates, stacks, links) stay true. LinkedIn: https://www.linkedin.com/in/afaw/ (not read; requires login).

Absent, do not fabricate: role/job title, work history, testimonials, metrics, contact details beyond the links above.

## Product Principles

1. **The site is an experiment too.** It may be playful and unconventional where that makes it more memorable, as long as it still works.
2. **Reading comes first inside posts.** Expression lives in the landing page and around the edges of posts; the body text, images and code are always easy to read.
3. **Honest build logs.** Posts document real projects, including what broke and what's next; no inflated claims.
4. **Easy to grow.** Adding a post should be writing one MDX file with images, nothing more.
