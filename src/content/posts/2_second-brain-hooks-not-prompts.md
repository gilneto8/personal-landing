---
title: "Running a second brain on an LLM agent that forgets"
description: "I told the agent to save my context. Sometimes it did. The fix wasn't a better prompt - it was hooks, structure, and economics."
pubDate: 2026-07-17
tags:
  - llm
  - agents
  - claude
  - second-brain
  - architecture
canonical: "https://gil-neto.com/blog/second-brain-hooks-not-prompts"
---

I keep my life in a folder of markdown files - projects, tasks, finances, ideas, the personal stuff. An LLM agent is the frontend to it. I talk, it answers from the notes and writes back to them. That part works now. It didn't for a long time, and the reason it didn't is the interesting part.

The TL;DR: I spent months writing better and better instructions telling the agent to save my context, and it kept losing things anyway. The trick is not in instructions - it's in hooks, in structure, in economics. Enforcement has to live outside the model, the data has to be shaped so that capture is cheap and routing is separate, and the whole thing has to cost little enough that you don't quietly stop running it.

## What actually broke

The setup was the obvious one. A long instructions file, loaded every session, that said: when I tell you something new, write it down; at the end of the session, update the indexes and commit.

It worked most of the time. That's the problem.

An agent that follows an instruction 90% of the time doesn't fail 10% of the time - it fails *silently* 10% of the time, and you find out three weeks later when you ask what the state of something was and get a confident answer built on notes that stopped being updated in April. There's no exception, no red build, no failed job. Just a fact you told it once, that no longer exists anywhere, and no signal that it's gone.

Two things caused it, and both are structural rather than moral:

1. **Instructions compete with the task.** The session is about a bug in a payment webhook. The instruction file says "capture new facts as they arrive." The model is doing the bug. Something has to lose, and it's never the thing the user is visibly waiting for.
2. **The expensive step is at the end.** "Update the indexes and commit" is a real chunk of work, and it lands exactly when the session is winding down, when context is longest and everyone - me included - wants to be done. The most skippable step is scheduled at the most skippable moment.

You cannot fix either of those by writing the instruction more emphatically. I tried. **Instructions aren't a contract. They're a suggestion with good intentions.**

## Hooks: enforcement outside the model

The first fix was to stop asking.

Most agent harnesses can run your code on lifecycle events - session start, session end, before or after a tool call, when the agent stops. That's a place to put things that must happen, that isn't the model's judgment.

So the rule "the vault must never be left with uncommitted work" stopped being a line in an instructions file and became a stop hook: when the agent finishes a turn, a shell script checks whether the vault is dirty and commits it. Not "please remember to commit". A script, on an event, whether or not the model was thinking about it.

The distinction that matters:

- **Judgment goes to the model.** What does this new fact mean? Which note does it belong in? Is this a task or an idea? That's genuinely fuzzy work and the model is good at it.
- **Guarantees go to the harness.** Did the commit happen? Did today's batch run? Is there unrouted input? That's a checkable condition and the model should never be the thing that checks it.

Every time I've been tempted to solve a reliability problem with a firmer instruction, the right answer has been a hook. Every time.

The corollary is the honest one: **if it can't be enforced outside the model, don't design as if it will happen.** Treat model-side steps as best-effort, and make sure the thing that catches the failure is somewhere else.

## The shape at a glance

```
  INTERACTIVE (all day, cheap)          BATCH (03:00, once, expensive)
  ┌──────────────────────────┐          ┌────────────────────────────┐
  │  session (any project)   │          │  headless agent, on cron   │
  │                          │          │                            │
  │  I state a fact ─────────┼──┐       │  read whole day's inbox    │
  │                          │  │       │  route each line ──────────┼──┐
  │  reads: INDEX files only │  │       │  rewrite indexes (capped)  │  │
  │  (bounded, no fan-out)   │  │       │  quality + link pass       │  │
  └──────────┬───────────────┘  │       │  write the morning report  │  │
             │                  │       └──────────┬─────────────────┘  │
       ┌─────┴─────┐            │                  │                    │
       │ STOP HOOK │            ▼                  ▼                    ▼
       │  commits  │      ┌───────────┐     ┌────────────┐      ┌─────────────┐
       │ (no ask)  │      │ _inbox.md │     │ INDEX files│◄─────┤ notes (the  │
       └───────────┘      │ (queue)   │     │(projection)│      │  real data) │
                          └───────────┘     └────────────┘      └─────────────┘
```

The only thing an interactive session may do is append one line and let a hook commit. Everything that requires judgment across the whole picture happens once, at night, when nobody is waiting.

## Structure: capture and routing are two different jobs

The second fix was noticing that "save this" is actually two jobs with completely different cost profiles, and I'd been welding them together.

**Capture** is: I just said something that matters. Write it down *now*, before the thought is gone. It needs to be atomic, cheap, and never blocked on anything. It happens mid-session, while the model is busy with something else, so it has to cost almost nothing - one append, one line, no reading, no thinking, no decisions.

**Routing** is: figure out what that line means, which of the fifty notes it belongs in, whether it changes a project's status, whether it makes a task obsolete, then rewrite the indexes. That's expensive, it needs the whole picture, and it is absolutely not something you want to do while the human is waiting.

So: an inbox file. One append-only list. Anything I state that the system should know gets one timestamped line appended, in the same turn, in any session, regardless of what that session is even about. Format's fixed, the line is dumb on purpose, and the timestamp has seconds in it so ordering is never ambiguous.

Nothing else happens at capture time. The inbox is allowed to be messy - it's a queue, not a record. The invariant is only this: **an empty inbox means everything was routed.** A non-empty one is a visible, checkable backlog rather than a fact that quietly evaporated.

That one split fixed more than any prompt engineering I did in six months. Capture became so cheap that it stopped competing with the task in front of it, which was the whole reason it was being skipped.

The same instinct applies to the instructions themselves. I had procedures spread across several files, described in prose, slightly differently in each place - which is how you get an agent improvising a *slightly different* save procedure every time. Now there's one canonical written procedure per job, in one place, and everything else points at it. The prose files say *when*; the procedure says *how*, once.

## Structure, part two: indexes are projections, not documents

The other structural piece: how does the agent know what's going on without reading everything?

Naively, you let it search the vault. That's slow, it's expensive, and it's non-deterministic in a bad way - two sessions ask the same question and read different subsets of files, so they give different answers.

Instead there are a handful of index files - active projects, all open tasks, personal state - and those are the only entry points for any "what's going on?" question. Three properties make them work:

1. **They're projections, not documents.** The notes are the source of truth. An index is a derived view, and it gets *fully rewritten* by the nightly job, never appended to. Anything appended-to grows without bound and drifts from its source; anything rewritten is either correct or obviously broken.
2. **They have hard caps.** Ten recent sessions. Sixty words per project row. The caps are written into the file itself, so the thing generating them reads its own constraint. Detail lives in the notes it points at.
3. **Reading them is the rule, not an option.** "For broad questions, read only these files - no fan-out." A bounded, predictable read cost per session, no matter how big the vault gets.

The caps are the part people push back on, and they're the part that makes it work. An index without a cap becomes a second copy of the vault within a month, and then you have two sources of truth, which is one more than the maximum useful number.

## Economics: the reason it runs at all

Here's the thing nobody tells you about agent systems: **the token budget is an architectural constraint, not a billing detail.**

Routing the inbox properly - reading it, deciding where each line goes, updating the notes, rewriting four indexes, committing - is expensive. Doing that at the end of every interactive session means every session pays for it, and I have a lot of small sessions. The cost lands on the wrong side of the trade: I'm paying premium interactive tokens, at the moment I'm most impatient, for work that has no deadline.

So it moved. Interactive sessions only capture. The expensive routing runs **once a night**, on a cron, in a headless agent process, over the whole day's inbox at once.

That change did several things at once, which is usually the sign you've found the right seam:

- The batch sees the *whole day*, so it routes better than fourteen separate sessions each seeing one line. It can tell that a task created at 11:00 was made obsolete by a decision at 16:00.
- The expensive work happens when nobody's waiting, so it can afford to be thorough - a quality pass, a link check, a contradiction check between indexes.
- My interactive sessions got cheaper *and* faster, because the last thing before "done" is now one file append instead of a full sync.
- It produces a report. I read it in the morning: what got routed, what changed, anything it wants me to look at.

And then the one I want to defend because it sounds absurd and isn't: **the laptop wakes itself up at 02:28 to run it.**

The batch is at 03:00. The laptop is suspended at 03:00, because I'm asleep. Systemd timers with `Persistent=true` are helpful about this - they run the missed job at the next boot instead. Which meant the whole overnight batch fired the moment I opened the lid at 9am: my machine busy, my agent busy, and the day's first hour of token allowance spent on last night's chores before I'd had coffee.

The fix is an RTC alarm - `WakeSystem=true` on a system timer, which arms the hardware clock to wake the box from suspend. It wakes at 02:28, the jobs run, a guard checks it's still the middle of the night and nobody's touched the machine, and it suspends again. I wake up to a finished report and a full budget.

This is the least glamorous part of the system and it's the one that changed my mornings. **The economics aren't a footnote to the architecture. They're the reason it survives contact with a real week** - a system you keep flinching away from because of what it costs you at 9am is a system you'll stop running by March.

## The same bet, three times

I noticed while writing this that the vault isn't where I first made this decision. It's just where I made it most recently. The two products I'm actually developing on the same sentence.

**Kelaro and Koa - never silently wrong about money.** Kelaro is an accounting product; Koa is the engine underneath it that turns a bank statement PDF into a ledger. The whole market is currently sprinting toward vision-LLM extraction: hand the page to a model, get structured data back, no templates to maintain. It's genuinely seductive. It also puts a non-deterministic system in charge of arithmetic, which is a category of decision I'm not willing to make on someone else's books - the failure isn't a model that says "I don't know", it's a model that returns a plausible total. [FinGround](https://arxiv.org/abs/2604.23588) (ACL 2026 Industry Track) is blunt about the failure modes it set out to fix in financial LLM systems: fabricated metrics, invented citations, arithmetic errors.

Koa uses fixed templates, forces the balances to reconcile, and refuses - loudly - when it can't. It would rather reject a statement than guess at a number. Around it, Kelaro's pipeline runs on durable workflows: retries, timeouts, operator-visible state. The model isn't in the arithmetic anywhere. That's not purism. It's that "never silently wrong about money" is worth more than the convenience of skipping template work.

**Augur - evidence you can check, not evidence you're asked to trust.** Augur is an EU AI Act evidence product: the deliverable is a bundle you can hand a reviewer. The interesting design constraint is the same one. The judgment - does this system's documentation actually satisfy the obligation? - is human work, and I'm not pretending otherwise. But what comes out the end has to be *checkable*: a fixed record structure, a signed bundle, a verification anyone can run without taking my word for anything. A regulator does not want a confident summary. They want the artifact and the ability to check it themselves.

Which is the same sentence as this post. **Put the model where judgment belongs, and determinism where correctness belongs.** Koa's model doesn't get to invent a number. Augur's doesn't get to be the reason you believe the evidence. The vault's doesn't get to decide whether the commit happened. In every case the LLM does the genuinely hard, fuzzy, valuable part - and something dumb, deterministic and checkable stands behind it making sure the failure mode is loud instead of silent.

I didn't plan the symmetry. I noticed it, which is a slightly embarrassing thing to admit and a fairly good argument that it's real.

## The honest version

What's still broken, because a post like this is worthless without it:

- **The inbox has lag.** Facts captured today aren't reflected in the indexes until tomorrow's batch. Sessions have to account for it - read the raw inbox as well as the index, treat it as "true but not yet filed". It's a real cost of the batching decision, and I pay it knowingly.
- **The routing is still the model's judgment.** It's better at it overnight with the full day in view, but it's not correct by construction. So there's a weekly drift check: another job that audits the indexes against the notes and reports contradictions. Enforcement outside the model, again, one level up.
- **Nothing here proves the model didn't misunderstand a fact at capture time.** Garbage in, faithfully routed garbage out. The system guarantees nothing is *lost*. It doesn't guarantee it was *right*.
- **It did this to me while I was writing this post.** Part of the nightly batch is a research pass that surfaces things worth reading. It handed me a tidy claim - the 2026 research shows vision-LLM extraction confidently fabricating figures that pass review - with four sources attached. Every URL was real, which is the part that makes this dangerous. But when I actually opened them: one paper genuinely supports it. One is about something else entirely, and its headline result arguably cuts *against* my framing. Two are vendor marketing from companies selling the fix, one of which does no original research and one of which admits its benchmark contradicts the public ones. The claim was a confident synthesis that none of its sources quite made. I nearly published it, in this post, about this exact failure mode. I checked because the post told me to.
- **It's a single user's system.** I have no idea what any of this looks like with two people writing into the same vault, and I'm suspicious of anyone who claims to.

I put most of my life in this thing - the work, the money, the personal history - as context the agent reads before it answers. That's a decision with an obvious privacy dimension, and each person has to make it for themselves, on their own terms, with their own provider settings. I've made mine deliberately. I'm not going to pretend my answer generalises to yours.

But the architecture does generalise, and it's the part worth stealing:

**Capture cheaply and atomically. Route expensively and rarely. Enforce with hooks, not adjectives. Cap the things the agent reads. Let the batch see the whole day. And put the model where judgment belongs, not where guarantees belong.**

None of that is about prompts. I wish someone had told me that a year ago - I'd have written considerably fewer instructions and considerably more shell scripts.

---

*I'm a founder-engineer in Lisbon. I build B2B utilities end-to-end - and, apparently, the tooling that keeps me sane while doing it. Open to fractional CTO and consultancy work (not full-time - my days are spoken for). Reach me at [gilneto8.work@gmail.com](mailto:gilneto8.work@gmail.com) or via [gil-neto.com](https://gil-neto.com).*
