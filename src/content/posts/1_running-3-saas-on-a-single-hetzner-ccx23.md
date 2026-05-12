---
title: "Running 3 SaaS products on a single Hetzner CCX23"
description: "One €30/month box, three products, three phases. The architecture, the trade-offs, and the signals that tell me when to split."
pubDate: 2026-05-12
tags:
  - hetzner
  - infrastructure
  - saas
  - devops
canonical: "https://gil-neto.com/blog/running-3-saas-on-a-single-hetzner-ccx23"
---

I run three SaaS products on a single Hetzner CCX23. The box costs about €30 a month, hosts a closed-beta accounting product, a Phase 0 GRC landing, and a deterministic PDF extraction engine, and absorbs all the inbound mail, outbound transactional email, and analytics for both customer-facing products. This is the boring, opinionated version of how it fits.

The TL;DR: a small dedicated-CPU VPS is enormously capable when you treat it like a single multi-tenant runtime instead of an ad-hoc bag of services. Below is what's actually running, where the seams are, and the signals that tell me when this stops being clever and starts being a liability.

## Why a single VPS

Three reasons.

**Cost discipline.** Pre-revenue, my infra bill is a tax I'm choosing to pay before I know whether the product will return it. €30 a month is a tax I can ignore.

**Operational surface area.** One box means one set of firewall rules, one TLS story, one set of backups, one Docker daemon, one OS to patch. Each additional box doubles every operational rule I have to keep in my head — and I run this alone.

**Co-location wins.** Two products that share a database server, a reverse proxy, an SMTP relay, and an analytics endpoint also share their incident response. If anything goes wrong, I'm SSHed into the one place that matters.

The cost of that decision is a single, well-known failure mode: this box is the blast radius. I'll come back to that.

## The box

Hetzner CCX23, EU region.

- 4 dedicated vCPU cores (AMD EPYC)
- 16 GB RAM
- 160 GB NVMe
- 20 TB monthly traffic included

For €30 or so. "Dedicated CPU" is the important part — the cheaper shared-CPU Hetzner tiers have noisy-neighbour problems that show up exactly when you're trying to demo a product to a customer. The CCX line is steady-state CPU you can plan against. If you're considering this setup, do not start with a CX or CPX shared-CPU instance. The savings are not real once you factor in stalls during workflow runs.

## The stack at a glance

```
                       DNS (Cloudflare / Hetzner)
                                │
                                ▼
                       ┌──────────────────┐
                       │  Nginx (host)    │  TLS, vhost routing
                       └────────┬─────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
 ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
 │  Kelaro stack   │    │  Augur stack    │    │  Koa stack      │
 │                 │    │                 │    │                 │
 │  • Next.js app  │    │  • Fastify API  │    │  • FastAPI eng. │
 │  • Temporal     │    │  • Umami        │    │  • Next.js UI   │
 │  • Postgres 16  │    │  • Postgres 16  │    │  • Postgres 16  │
 └─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  External SaaS   │
                       │  • Brevo (SMTP)  │
                       │  • ImprovMX (in) │
                       └──────────────────┘
```

Each product is its own Docker Compose stack — its own app container(s), its own Postgres 16, its own internal network. Nginx on the host is the single shared piece, handling TLS termination and routing each vhost to the right stack. Outbound transactional mail and inbound forwarding are the only external dependencies, and they're shared SaaS — not infrastructure I own.

The shape of each stack is intentionally the same. Same Postgres version, same base image, same compose layout, same `.env.example` pattern, same deploy story. The products differ in what they do; they don't differ in how they're put together. That consistency is the dial I tune fastest — every time I touch a piece in one stack, I make sure it slots cleanly into the others, because the next product is going to want exactly the same thing.

## Routing layer: Nginx on the host

I run Nginx directly on the host rather than as a container. Two reasons:

1. **TLS termination is a host-level concern.** I want one place that knows about certificates, and I want it to come up before any Docker service tries to bind a port.
2. **Zero-downtime config reloads.** `nginx -s reload` is a battle-tested SIGHUP path. I trust it more than I trust orchestrating a containerized Nginx restart while two products are taking traffic.

Each vhost (`kelaro.io`, `app.kelaro.io`, `tryaugur.eu`) is a one-screen file in `/etc/nginx/sites-available/`. Certificates are Let's Encrypt via `certbot --nginx`, on a renewal cron.

`kelaro.io` lives behind Cloudflare DNS; `tryaugur.eu` uses Hetzner DNS. That's a wart — eventually I'll consolidate to one DNS provider — but right now the cost of leaving it is zero. The cost of migrating either is one nervous Saturday morning.

## Persistence: one Postgres per product, same shape everywhere

Each product runs its own Postgres 16 container, bound to `127.0.0.1` on its own port, inside its own Docker network. Three products, three databases, three independent backup targets. The same image, the same `postgresql.conf` baseline, the same role-and-privileges pattern.

The instinct when you're cost-optimising is to merge them into a single Postgres with multiple logical databases. I don't, for three reasons:

1. **Blast radius per product.** A schema migration that's slower than I expected on Kelaro should not be a thing that touches Augur's lead capture or Koa's extraction state. Containerised isolation gives me a clean answer to "did anything else break?" — no.
2. **Backups are per-product.** Each Postgres has its own `pg_dump` cron and its own restore drill. When I rehearse a restore, I rehearse one product, not a whole-box recovery. The smaller the surface, the more honest the rehearsal.
3. **Migration to managed is a no-op.** The day Kelaro hits a customer count that demands managed Postgres, I lift one container out and point the connection string at RDS or Neon. The other two stacks don't move. Co-tenancy at the *database* level would make that lift a multi-day project; co-tenancy at the *box* level keeps it a Saturday.

Postgres is the resource that scales least gracefully, so I monitor it more aggressively than anything else: connection count, table bloat for the workflow tables, replication slot growth, and the usual disk and CPU metrics. The graphs are per-product, which means I can see exactly which product is misbehaving without having to filter a noisy global view.

This per-product-Postgres pattern is the heart of how the box stays legible. The temptation when you're running multiple products solo is to centralise everything in the name of efficiency. The lesson, twice learned, is that operational legibility beats efficiency at this stage. A small machine running uniformly-shaped stacks is easier to reason about, easier to debug, and dramatically easier to scale out from than a "clever" shared substrate.

## Workflows: Temporal, where it earns its keep

Kelaro's PDF extraction pipeline runs through Temporal. Bank statements come in, get queued as workflow executions, Temporal handles retries, timeouts, durable state, and the operator UI gives me visibility into anything that misbehaves. Augur doesn't need workflows yet — Temporal is dormant from Augur's perspective.

Two things I tell people considering Temporal at small scale:

1. **It's worth it well below 100 requests per second** if your work is multi-step, externally fallible, and operator-visible. The cost is a Temporal Server you don't fully exercise — at this scale, a few hundred MB of RAM and a couple of Postgres schemas living inside the Kelaro stack. Cheap.
2. **It is overkill for fire-and-forget jobs.** If all you have is "send an email when a thing happens", BullMQ on a small Redis is dramatically less infrastructure.

Koa — the extraction engine — is a Python/FastAPI service running in its own stack with its own Postgres, behind a clean HTTP boundary. Kelaro's workflows call into it; Koa never knows it's part of a workflow. That separation is deliberate: Koa is going to outlive any one product that integrates with it.

## Mail: ImprovMX inbound, Brevo outbound

I don't run my own mail server. Two SaaS handle it:

- **ImprovMX** forwards `*@tryaugur.eu` to my real inbox. Free tier, dead simple, one MX record. There is no scenario in which I want to be on call for an inbound SMTP daemon.
- **Brevo** handles transactional outbound — sign-up confirmations, billing receipts, password resets. Better deliverability than my VPS could earn from scratch (a fresh VPS IP is a deliverability cold start I have no patience for) and a working SPF/DKIM/DMARC alignment out of the box.

For Kelaro, I also use Brevo SMTP. For Augur, mail is currently inbound-only — outbound waits until there's an actual app. Until there's an app, there's nothing to send.

## Analytics: self-hosted Umami

Augur targets EU-regulated buyers. Putting Google Analytics on its landing page would be a self-own. I run [Umami](https://umami.is) inside Augur's stack — same Docker Compose, same Postgres pattern, same backup discipline — privacy-clean, cookie-banner-free, GDPR-easy. The analytics endpoint is internal to the stack; nothing leaves the box.

The trade-off is honest: I run my own analytics service. It's a thing I have to update, back up, and reason about. The win for Augur is that I get to truthfully say "we don't ship your visitors to a third-party tracker." For a GRC product, that's a sales line. Across the rest of the portfolio, I'm migrating in the same direction — uniform analytics, uniform privacy posture, no per-product carve-outs.

## Backups and observability

This is the part most "I run my own VPS" posts skip and then regret.

- **Hetzner backups** for the whole VM, enabled. Daily, rolling, included for a small fee. Recovery is "click a button"; it has saved me already.
- **Postgres logical backups** via `pg_dump` to S3-compatible storage off-box. Daily, with 30-day retention. The whole-VM snapshot is for "the box is gone"; the logical backup is for "one database is corrupt and I noticed three days later."
- **Healthchecks.io** pings for every cron job that's supposed to run. If a backup didn't happen, I get a Telegram message before I deploy any new code.
- **Structured logging** to host syslog, with a daily logrotate. Eventually this needs to be Loki or similar; for now `journalctl` is enough.

The thing I do not yet have, and should: a real uptime monitor hitting each product's public endpoint every minute, with a status page. Until then, "Kelaro is down" gets reported to me by a pilot user — which is fine at pilot scale, and absolutely not fine the day there's a paying customer who hasn't agreed to be a beta tester.

## Blast radius

Everything on one box means the box is one blast radius. Three failure modes I plan around:

1. **Disk fills.** A runaway Postgres table or a runaway Docker log can fill 160 GB faster than I'd like. Mitigations: `logrotate` configured aggressively, Postgres autovacuum tuned, disk usage alerts at 70 and 85 percent.
2. **A workflow goes hot and starves the rest.** Temporal can run workers that consume more CPU than I budgeted. Mitigations: Temporal task queues have explicit worker counts; CPU is partitioned implicitly via Docker `cpus:` limits when I remember to set them. (I do not always remember.)
3. **The host goes down.** This is the unmitigated one. There is no failover. The bet is that the products are early enough that an hour of downtime per quarter is acceptable in exchange for €30/month. The day that bet stops being acceptable is the day I split.

The point of being honest about the blast radius is that it tells you exactly when this architecture breaks: the moment a customer is paying enough that "an hour of downtime" is a refund conversation.

## When this stops being clever

There is a list pinned above my desk. When any of the following becomes true, the box gets split:

- **Kelaro hits paying customers.** Then it gets its own VPS, with its own backup strategy. Augur stays here.
- **CPU steady-state above 60%.** Headroom matters more than savings; once I'm consistently above 60% I have no margin to absorb a deploy.
- **Postgres connections regularly above 60% of `max_connections`.** Same logic.
- **Either product needs sub-100ms p99 globally.** A single EU box doesn't serve from US-east; I'd be looking at a CDN or a multi-region split.
- **A regulated buyer asks for SOC 2 or ISO 27001.** Compliance does not love "everything on one box." Some controls are dramatically easier on a managed platform.

None of these is true today. The day one of them is, the migration will be one Postgres database and one set of containers — which is the whole point of treating the box as a multi-tenant runtime in the first place.

## The honest version

I am not running this stack because it is the best possible stack. I am running it because three pre-revenue products on a €30/month box is the right answer to a question that nobody asked me until I asked myself: *what is the smallest infrastructure I can ship through?*

Six months from now, the answer will be different. The point is not to defend this stack forever. The point is to stay cheap, fast, and operationally legible until the products earn the right to be more complicated.

If you're running something similar, or about to, I'd love to hear what your "when to split" list looks like. Mine is pinned above the desk because every founder-engineer I know secretly suspects they're under-engineering and would benefit, mostly, from leaving things alone.

---

*I'm a founder-engineer in Lisbon. I build B2B utilities end-to-end on this box. Open to senior IC, staff, fractional CTO, or contract — remote-first, EU timezones. Reach me at [gilneto8.work@gmail.com](mailto:gilneto8.work@gmail.com) or via [gil-neto.com](https://gil-neto.com).*
