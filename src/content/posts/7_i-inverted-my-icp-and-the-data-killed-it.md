---
title: "I inverted my ICP, and the data killed it"
description: "The targeting idea was to find the companies that hadn't signed. Then the list came out, and absence turned out to be the default state of the entire market."
pubDate: 2026-08-20
draft: true
tags:
  - eu-ai-act
  - product
  - validation
  - market-research
  - founder
canonical: "https://gil-neto.com/blog/i-inverted-my-icp-and-the-data-killed-it"
---

For about a year I was building compliance-evidence tooling for the EU AI Act. Not the document generator - there are a dozen of those and several are free. The layer underneath: proving the document is backed by real artifacts, with the claim traced to the event traced to the version of the rule that was in force when it happened.

The hardest part of that was never the engineering. It was working out who to call.

## The idea

In July I thought I had it. The Commission runs a Code of Practice on Transparency for AI-generated content - voluntary, free to sign, and signing is a public reputational marker. The obvious move is to target the signatories: they've self-identified as caring about this.

So I inverted it. **Target the ones who are obligated and did not sign.** Use the signatory list as an exclusion filter, not a lead list. A company in scope that skipped a free, reputational, zero-cost commitment is either unaware or exposed, and both of those are a conversation.

I liked it a lot. It's cheap to compute, it inverts the thing everyone else does, and it turns a public list into a targeting primitive rather than a directory. I built a watcher to track the list and wrote the tiering around it.

The list hadn't been published yet when I designed all this. That detail matters.

## What the list actually said

It dropped on 31 July: [83 section-1 providers and 152 section-2 deployers](https://digital-strategy.ec.europa.eu/en/news/strong-backing-code-practice-transparency-ai-generated-content), around 190 organisations, with the Commission noting that about half are "small and recent companies" and that the list stays open.

I went through the 152 deployers by hand. Roughly **ten** are large enterprises: Deutsche Lufthansa, Bulgari, Getty Images, Iberdrola, Lenovo, Fastweb, E. Breuninger, the National Bank of Romania, the European Court of Auditors, Barcelona Provincial Council.

The rest are micro-agencies, `.gr` news sites, one-person GmbHs and ApS shells, and - a good number of them - **named individuals**. Not companies. People, signing in their own name.

So the exclusion filter excludes 152 names from a universe of hundreds of thousands of in-scope organisations across the EU.

```
  what I designed

  ┌────────────────────┐   remove   ┌──────────────┐   what's left:
  │ every in-scope org │ ─────────▶ │  signatories │ ─▶ a qualified
  │ in the EU          │            │              │    target list
  └────────────────────┘            └──────────────┘

  what the data gave me

  ┌────────────────────┐   remove   ┌──┐   what's left:
  │ every in-scope org │ ─────────▶ │  │ ─▶ every in-scope org
  │ in the EU          │            │  │    in the EU, minus 152
  └────────────────────┘            └──┘
```

**Absence was the default state of the entire market.** A filter that removes a rounding error from the universe isn't a filter. Every company I would have called was "absent", including every company I'd never want to call.

The primitive was dead about forty minutes after the list went up.

## The generalisation, which is the part worth keeping

A targeting signal only works if the attribute is **rare in the direction you're reading it**. I was reading absence as meaningful, and absence is only meaningful when presence is common. I never checked which one I was in, because until the list existed there was nothing to check against, and I built the tiering anyway.

The test is one question, and it costs nothing: *what fraction of the universe has this property?* If it's most of them, the property is a description of the market, not a way to cut it. Presence would have been a perfectly good signal here - 190 names is a lead list. I inverted the one that worked into the one that didn't, because inverting it made a better sentence.

That's the actual failure mode. **The inversion read well.** I have caught myself doing this more than once now: preferring the framing with the better rhetorical shape, then discovering the data was never asked.

## The thing underneath it, which was worse

Killing the primitive was fine. What the same list said about the market was not.

Ten large enterprises, EU-wide, signed a free and reputational commitment days before a deadline attached to penalties of €15M or 3% of global turnover.

That is not a market waiting to be served. That's a market that isn't scared yet.

I had a note in my own docs from a month earlier saying enforcement would probably start soft, GDPR-slow, and that this was a credibility play rather than a revenue line. I'd written the honest version down and then kept building past it. The list didn't tell me something new. It made the thing I already knew impossible to keep working around.

Then a second source landed on the same answer from a completely different direction. I tore down the nearest occupant of the primitive I'd been treating as my moat - a French company doing file-level integrity with eIDAS-qualified signatures and blockchain anchoring. Twelve years old. Ten people. About $1.38M raised, still seed. Société Générale, Thales, SNCF, Orange as customers.

Read that carefully, because the instinct is to read it as a competitor being bad at business. Real enterprise logos and a working product and twelve years to ten people isn't a company failing. **It's a category moving at that speed.** Two independent measurements - the signature count, and a competitor's twelve-year growth curve - agreeing on buyer urgency in the same week is about as clear as a market signal gets.

## What survived

One signal did. The list stays open, so it keeps changing. A company that signs **late** - months after the deadline, no external pressure to do it - is a company that just got scared about something. Absence can never tell you that. A delta can.

I rewrote the watcher to track exactly that: snapshot, diff, log the changes. Then I turned the daily timer off, because a nightly job pointed at a market that wakes up in December 2027 has nothing to report for a year. The script and the baseline snapshot are sitting in the repo waiting to be re-armed.

The project is parked. Not dead, and not disproven - the differentiator survived the teardown, the regulation is still coming, the deadline is real. What binds is capacity: about eight hours a week against a compliance product with an eighteen-month runway to a market that isn't buying, versus another product of mine that is one QA battery away from taking payments. That's not a close call, and pretending it was would have cost me the year.

## What I'd still push back on, including at myself

- **I don't know that late-signing is a buying signal either.** It's the surviving hypothesis, not a tested one, and I turned off the instrument that would have tested it. Ask me again in 2027.
- **"The category is slow" is a read, not a measurement.** Two sources agreeing is better than one, and it is still two. A regulation with teeth landing on a specific enforcement date could compress it fast, which is precisely the scenario I'm parked for rather than out of.
- **Parking is easier to write about than to do.** This is the fifth time in two years I've had to take something off the board, and the thing that made it possible was having somewhere honest to put the reasoning. The analysis becoming a post is not a consolation prize; it's the only thing that made the decision feel like a decision instead of a loss.
- **I got the useful information for free and nearly walked past it.** The list cost me nothing. Building the tiering on top of an unpublished list cost me a week. The order was wrong, and it was wrong in the direction I always get it wrong: build the clever thing, check the boring thing later.

The next time I have a targeting idea good enough that I want to build on it immediately, that's the tell. Count the universe first.

---

*I'm a founder-engineer in Lisbon. I build B2B utilities end-to-end, and I write up the ones that don't work as often as the ones that do. Open to fractional CTO and consultancy work (not full-time - my days are spoken for). Reach me at [gilneto8.work@gmail.com](mailto:gilneto8.work@gmail.com) or via [gil-neto.com](https://gil-neto.com).*

<!--
LINKEDIN HOOK (not rendered - kept here so it doesn't get lost)

I spent a week building a targeting system on top of a list that hadn't been published yet.

The idea: instead of selling to the companies that signed the EU's voluntary AI transparency code, target the obligated ones that didn't. Absence as the buying signal. Use the list as an exclusion filter.

The list came out on 31 July. 152 deployers. About ten of them are large enterprises - the rest are micro-agencies, one-person shells and named individuals.

So my exclusion filter removed 152 names from a universe of hundreds of thousands. Absence wasn't a signal. It was the default state of the entire market.

The primitive died in forty minutes. What the same list said about buyer urgency took longer to accept, and it's why the project is now parked.

Wrote up what killed it, the one-question test I should have run first, and the part where a competitor's twelve-year growth curve independently said the same thing.
-->
