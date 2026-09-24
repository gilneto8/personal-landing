---
title: "I deleted the AI that read my bank statements"
description: "It never crashed. It handed back a clean, plausible ledger with the wrong numbers in it, and there was no way for anyone downstream to tell which rows were the wrong ones."
pubDate: 2026-08-28
draft: true  # held until the Kelaro battery passes and Koa is verified (Gil, 02-set)
tags:
  - llm
  - extraction
  - fintech
  - determinism
  - architecture
canonical: "https://gil-neto.com/blog/i-deleted-the-ai-that-read-my-bank-statements"
---

One of my products takes a bank statement PDF and gives you back a spreadsheet. That's the free door into the rest of it - you convert one statement, you see it works, maybe you stay for the automated syncing. It was priced at 5.99 euros for 50 conversions, which tells you how much of a funnel piece it is rather than a revenue line.

Behind that door I had Docling, IBM's document extraction stack, running as its own Python container on the box. It ate about 4GB of RAM and it sat behind a Temporal workflow so the conversion could take its time without holding a request open. Reasonable setup. Everyone builds some version of it.

The extraction was broken, and the specific way it was broken is the whole reason I'm writing this. It didn't throw. It didn't time out. It didn't come back with an empty result or a low confidence score or anything else I could have caught in a handler. It came back with a clean, well-formed, plausible-looking ledger that had wrong numbers in it.

The TL;DR: for financial documents, accuracy is the wrong thing to be optimising. What you actually need is the ability to know when the extraction failed, and a generic AI extractor structurally cannot give you that, because from the inside a confident wrong answer and a confident right answer are the same event.

## What actually broke

Think about who's downstream of that spreadsheet - it's an accountant, or a bookkeeper, or someone doing their own year-end. They open the file and they see forty rows of transactions with dates and amounts and descriptions. Nothing is flagged. Nothing looks odd.

So how do they check it? They'd have to go back to the PDF and read it line by line against the spreadsheet, which is exactly the work they paid to avoid. In practice nobody does that. They spot-check three rows, the three rows are fine, and the file goes into the accounts.

That's the failure. Not "the extractor is 94% accurate" - I could live with 94% if I knew which 6% are missing. The failure is that the wrongness is invisible at the point where a human still has a chance to catch it.

I pulled Docling out of production on the 26th of June. Not disabled behind a flag - removed from the compose file on the box. Three weeks later I deleted the rest of it from the codebase, about a thousand lines plus its fixtures, in one commit that took the app 352 lines forward and 1257 lines back.

Here's the part I'd rather not write down. That converter is the top of my entire acquisition funnel. I have programmatic per-bank SEO pages pointing at it, one per bank, all of them ending in a call to action for a feature that has returned nothing since June. It is coming up on three months of a dark front door, and the replacement is still sitting on a branch waiting for me to finish testing it.

I'd do it again. But I want the number on the page, because "I chose correctness over uptime" sounds noble and costs nothing to say, and this one cost me the funnel for two months and counting.

## The failure mode nobody screenshots

This isn't a Docling problem, and I want to be careful not to make it sound like one. Any extractor built on a language model has the same shape, and it's now measured well enough that I can stop asserting it from my own scar tissue.

[Fin-RATE](https://arxiv.org/abs/2602.07294) ran the benchmark in February and found cross-entity extraction landing 14 to 19% off. Their line about it stuck with me: formatting quality is uncorrelated with factual accuracy. The output looking clean tells you nothing at all about whether it's true.

There's more of this now. [FinGround](https://arxiv.org/pdf/2604.23588) and [FinVerBench](https://arxiv.org/pdf/2605.29586) both benchmark fabricated figures in financial documents specifically.

So the industry is running hard in one direction. Template OCR was the old way, vision language models are the new way, and the new way is better at almost everything except the one property that matters when money is downstream.

## Confidence scores don't fix this

The obvious answer is to make the extractor tell you when it's unsure. I looked at that seriously, and then I looked at who else was already selling it - ParseField, docupipe, Sheetminer, Veryfi. They all ship some version of "verify before import" with a confidence indicator and a review queue.

Two things follow from that. The first is commercial: everyone ships it already, which makes it the price of entry. You don't win anything by having it.

The second one matters more. A confidence score still hands a human a number and asks them to judge it. You've moved the problem, you haven't removed it, and the human is judging under exactly the conditions where humans are worst - forty rows, all plausible, one of them subtly wrong, and a job to get back to.

There's also a real question of whether the confidence number itself can be trusted. [Jev](https://github.com/scienthoon/jev-ood-calibration) sells calibrated, "epistemically honest" probabilities for exactly this - route the low-confidence cases to a human. A test on 900 synthetic support tickets found it scoring 44.7% on a priority task whose rule isn't in the ticket text, chance plus common sense, while putting an average 0.74 probability on its own answer. Getting honest probabilities back out needed a temperature of 3.4.

## The thing bank statements give you for free

Here's what I built instead, and the reason it works is a property of the document rather than anything clever I did.

A bank statement carries its own checksum. There's an opening balance at the top and a closing balance at the bottom, and every transaction in between. Add the transactions to the opening balance. If you don't land exactly on the closing balance, your extraction is wrong. Not "possibly wrong", not "low confidence" - arithmetically, provably wrong, with no judgement call anywhere in the chain.

```
  generic extractor

  PDF ──▶ model ──▶ ledger ──▶ human eyeballs it ──▶ accounts
                      │                                 ▲
                   plausible                            │
                   but wrong ───────────────────────────┘
                                        survives

  what I run now

  PDF ──▶ template ──▶ ledger ──▶ opening + Σ txns == closing ?
                                        │            │
                                       yes           no
                                        │            │
                                        ▼            ▼
                                    accounts      REJECT
```

That's Koa. Per-bank YAML templates, a Python engine that runs the template over the PDF, out comes a normalized ledger, and the tie-out sits at the end as a hard gate. It refuses rather than guesses, and refusing is a fine outcome - I'd much rather tell someone their statement needs a manual look than hand them a file that quietly poisons their books.

Everything is Decimal, never float, for the same reason. The engine has a 91-test suite behind it and a target of five seconds a page on the same server, no GPU, because the whole point is that this needs no inference at all.

I keep repeating a line from my own docs: this is how the generic tool died, generic enough to attempt anything, unfixable for the specific job.

## The 'state of the art'

A post like this is worth nothing without mentioning what's still broken, so here it is:

- **I don't have a head-to-head benchmark and I can't produce one now.** I deleted Docling. Standing it back up to measure it fairly is a day of work against a container I have no other use for, and I keep deciding I have better uses for the day. So what I've got is a lived account, not a table. Treat it as such.
- **The tie-out only works because bank statements carry that closing balance.** Invoices don't. Receipts don't. Contracts definitely don't. So none of this generalises to document extraction as a category, and if someone tells you deterministic extraction beats models everywhere, they're selling something. It beats models on documents that can check their own arithmetic.
- **There's an open bug I know about and haven't fixed.** Three of the banks come out of the text layer with the characters in reverse order. It's marked critical in my own backlog and it's been sitting there while I ship a different bank first, which is the honest version of prioritisation.
- **One bank in production so far.** The engine went live in July serving a single template. The other nine statement PDFs are on my disk waiting for templates that I write by hand, one per bank per layout variant. That long tail is the real cost of this approach and I don't want to pretend it away.
- **I chose the constraint that suits me.** I'm one person shipping this at maybe eight hours a week, and the deterministic path is the one I can reason about at eleven at night without a GPU bill. Someone with a team and a budget might reasonably conclude that a model plus an aggressive review layer gets them further faster. I'd want to see their silent-error rate before I believed it.

The thing I'd want someone to take from this: before you put an AI extractor anywhere near money, work out how the person downstream is supposed to find out it was wrong. If the answer is that they read the source document line by line, you haven't built them a tool.

## The verification I built and then dropped one function later

Finding this one took going looking for it, which is the only reason I found it at all.

The engine is one half of the story. A TypeScript app calls it and shows the result to an accountant. Earlier this year I fixed a bug in the engine where a statement whose balances were never captured could still ship as `SUCCESS` - a reconciliation that may not have run being reported as one that passed. The engine now caps that case at `PARTIAL` and sets an explicit flag saying whether the tie-out actually ran.

Then I read the calling code.

```typescript
if (metadata.status === 'ERROR')    { throw ... }
if (metadata.status === 'REJECTED') { throw ... }
// PARTIAL falls straight through
```

`PARTIAL` isn't handled. And the type the app maps into has no status field at all, so the information doesn't survive the boundary. And the warning banner in the UI renders on this condition:

```tsx
statement.confidence !== undefined && statement.confidence < 0.5 && statement.warnings?.length > 0
```

Confidence is computed from row parsing, before and independently of the tie-out. So a statement that parses cleanly at 0.9 but whose balance check failed or never ran is handed to the accountant with no warning of any kind.

The engine fails closed. The app fails open on top of it. The whole product promise is verified numbers in the accountant's own sheet, and I'd built the verification and then dropped it one function later.

I want to be clear about how this happened, because it wasn't carelessness at the boundary. Both sides are individually correct. The engine correctly reports PARTIAL. The app correctly handles the two statuses it knows about, and correctly shows warnings on low-confidence parses. There is no line of code you can point at and call wrong. What's wrong is that nothing compares the set of statuses the engine can emit against the set the app handles, and nothing compares what the user needs to be warned about against what actually triggers a warning.

The fix for the calling code is drafted, not shipped. So the tie-out this whole post is about is real in the engine, and not yet visible end to end for the accountant on the other side of it. That's the honest state of it right now.

Same lesson as the rest of this post, one layer up: the measurement was right. The comparison didn't exist.

---

*I'm a founder-engineer in Lisbon. I build B2B utilities end-to-end, and lately I spend a lot of time on the question of what an agent should and shouldn't be allowed to decide for me. Open to fractional build work on bank-data and accounting pipelines. Reach me at [gilneto8.work@gmail.com](mailto:gilneto8.work@gmail.com) or via [gil-neto.com](https://gil-neto.com).*

<!--
LINKEDIN HOOK (not rendered - kept here so it doesn't get lost)

I had an AI reading bank statement PDFs in production. It never crashed once.

It just handed back clean, well-formed spreadsheets with the wrong numbers in them, and there was no way for the accountant downstream to tell which rows were the bad ones.

I pulled it out in June and it cost me my whole acquisition funnel for two months. Wrote up why I'd do it again, what I built instead, and the one property of bank statements that made a fix possible at all.
-->
