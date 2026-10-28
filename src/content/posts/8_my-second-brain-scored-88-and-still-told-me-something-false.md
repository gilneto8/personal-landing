---
title: "My second brain scored 88% and still told me something false"
description: "My agent's nightly exam passed 42 of 48 questions on the same morning it showed me a payment as unconfirmed. The exam checked whether it could find what my notes say. It never checked whether the notes were true."
pubDate: 2026-10-29
draft: true
tags:
  - llm
  - agents
  - evals
  - memory
  - second-brain
canonical: "https://gil-neto.com/blog/my-second-brain-scored-88-and-still-told-me-something-false"
---

On 21 October a group of researchers published a benchmark for how personal agents remember what their users want ([arXiv 2610.30485](https://arxiv.org/abs/2610.30485)). They tested several memory systems against simulated users and measured whether the agent applied the right preference at the right moment. Two lines from the abstract stuck with me. The first: "Retrieval-based systems (i.e. Mem0, MemOS, simple RAG) do not outperform No Memory." The second: "File-based memory improves accuracy but applies preferences beyond relevant contexts."

My second brain is file memory. It's markdown notes in a git repo, an agent that reads them, and a night job that routes whatever I said during the day into the right note. I wrote about how it gets tested [back in September](https://gil-neto.com/blog/the-index-was-lying-and-the-eval-knew). Their benchmark is about preferences (when to ask, when to just act) and mine failed on a plain fact. However, the shape of the failure was close enough that I went and looked at my own numbers.

## The morning it was wrong

Every night the brain sits an exam. There's a set of questions with known answers, an answerer that only gets the notes, and a judge that grades what comes back. On 28 October it passed 42 of 48. The tier that searches the notes had zero misses on every night since 20 October.

The same morning, it told me something false.

A few days before, I'd issued an invoice on a friend's behalf. The client paid me and I sent her share on to her, and I told her so in a message. The night job routed the part about sending the money, but it couldn't find a line saying the client had paid me first, so it raised a flag: not recorded whether the payment came in. Then my morning briefing read that same chat, saw my message, and still put the flag on my screen as an open item.

So nothing was missing from the notes. The note said "unconfirmed", and the exam would have graded an answer of "unconfirmed" as correct, because that's what the note said.

## What the exam measured

The exam answers one question: can the agent find what the notes say. It got good at that, which is exactly why it went quiet. A week of zero misses meant the test had stopped finding anything.

What it never asked is whether the notes are true. Things change in my inbox, my calendar and my chats, and the notes only catch up at night, through a model that summarises. Every gap between the two is invisible to an exam built out of the notes themselves.

There was a second, smaller problem. The night job proposes new exam questions from what it learned that day, and those waited for me to approve them. On the 28th there were 31 waiting. I wasn't reading them, so the exam stayed frozen at whatever I had last bothered to approve.

## What I changed

Both of these shipped on the 28th.

1. **Questions with one checkable answer promote themselves.** A proposed question gets in on its own when it has a single factual answer (a date, an amount, a name, a status, a recorded decision) and every key token of that answer is actually in the note it came from. Questions that ask for a reading or a conclusion still wait for me, and expired or duplicate ones get dropped. Of the 31 that were waiting, 27 went in by that rule and 4 are held. There's no model in that decision, so the same question gets the same verdict every night.
2. **A truth check against the sources.** Every night, after it reads my mail, calendar and WhatsApp, the brain takes the claims it currently makes about the outside world (the flags it raised, the current state of each project, the "next days" lines) and checks each one against those sources, read-only. A claim comes back as matching, behind the world or with no evidence either way. "Behind" needs a verbatim quote and a source, otherwise it doesn't count. Every claim that's behind goes into the same inbox I capture into, so the routing step that runs right after it fixes the note the same night.

I ran the truth check for the first time on the afternoon of the 28th. It took 21 claims: 3 matched, 5 were behind and 13 had no evidence either way, which is normal for things like the state of a build that no email talks about. The five that were behind were all real. A call that had moved that morning was still written down for 10:00 in three different places. An invoice approval my notes called unidentified had a number and an amount sitting in my work mail. And a concert my notes listed as "date to check" was already in my calendar.

It didn't catch the payment. That claim came back with no evidence, and when I looked at why, that's the right answer. No chat, no email and no calendar entry says the client paid me. My message to my friend implies it, and I know it happened, but the only place that actually records it is my bank account, and the brain doesn't read my bank.

## The same gap, somewhere else

So the one miss that started all of this can only be settled by a bank statement. That's the problem I work on in Damasqo Flow, former Kelaro. An accounting tool can check that its own ledger adds up and still disagree with the bank, and the check that matters is the one against the statement. Flow is built around that check.

---

*I'm a founder-engineer in Lisbon. I build B2B utilities end-to-end, and lately I spend a lot of time on the question of what an agent should and shouldn't be allowed to decide for me. Open to fractional and contract build work, on whatever the product needs. Reach me at [gilneto8.work@gmail.com](mailto:gilneto8.work@gmail.com) or via [gil-neto.com](https://gil-neto.com).*
