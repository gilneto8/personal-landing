---
title: "My agent had two rules and obeyed neither"
description: "Both rules were well written. They contradicted each other and I hadn't noticed, because writing a rule and making a decision are not the same job."
pubDate: 2026-08-18
tags:
  - llm
  - agents
  - specs
  - spec-driven-development
  - architecture
canonical: "https://gil-neto.com/blog/specification-is-not-decision-making"
---

I have a rule file that tells my agent to write tersely. Drop the articles, drop the filler, drop the pleasantries. Fragments are fine. It's precise about what to cut and it has examples.

I have a second rule file that tells it not to write convoluted sentences. One idea per sentence, break at around twenty words, no stacked clauses, gloss the jargon on first use. Also precise, also with examples.

Both files are good. Neither is wrong. And for a couple of months the agent obeyed whichever one it happened to weigh more that session, which meant I got compressed-and-unreadable on one day and readable-and-padded on the other, from the same setup, with no change in between. I kept editing the rules. The rules were never the problem.

The TL;DR: I had specified both behaviours completely and decided nothing. Specification describes what the thing does. Decision picks one option and kills the others. A document can be a hundred percent specified and zero percent decided, and from the outside those two look identical - which is exactly why nobody catches it until something has to execute.

## What actually broke

Go back to the two rules. Read them side by side and the conflict is obvious in about four seconds. Terse says cut words. Readable says add the connective tissue back. These don't go well together.

Neither file said. Each one described its own behaviour thoroughly and stopped at its own edge. The question "what happens when these two pull in opposite directions" wasn't answered badly, it was never asked, because writing each file felt like finishing a job.

That's the shape of the failure and it generalizes past agent config. **The parts of a spec that feel finished are the parts where one person wrote one thing and nobody argued.** The parts where two things touch are where a decision has to happen, and a decision costs something that writing a spec doesn't: you have to give something up, on the record, and be wrong about it later in public.

So it gets deferred. Not maliciously. It gets deferred by being written around.

## Specifying and deciding are different jobs

The distinction I'd draw, having got this wrong for a while:

**Specification** answers *what does this do*. It's descriptive, it's additive, and you can do it well without ever facing a trade-off. Two people can specify two conflicting behaviours in the same document and both be doing good work.

**Decision** answers *which of these live options survives, and what do we lose by picking it*. It's subtractive. It's uncomfortable. It leaves a scar in the document, in the form of an option that used to be there and isn't.

The tell that a decision happened is that something got killed. If you read a spec end to end and nothing was ever ruled out, no alternative is named as rejected, no cost is written down, then it isn't a spec that made hard calls. It's a spec that described a wish.

```
  what should happen

  ┌─────────────┐    ┌──────────────────────┐    ┌──────────┐
  │ open        │───▶│ DECIDE               │───▶│ specify  │
  │ question    │    │  resolve it, OR      │    │ the      │
  │             │    │  rule it out of scope│    │ winner   │
  └─────────────┘    └──────────────────────┘    └──────────┘

  what usually happens

  ┌─────────────┐                               ┌──────────┐
  │ open        │──────────────────────────────▶│ specify  │
  │ question    │      (skipped, silently)      │ both     │
  └─────────────┘                               └──────────┘
                                                      │
                                                      ▼
                                          looks complete, executes
                                          differently every time
```

## Three tells

Ways I now spot an undecided spec from the outside, without having written it:

**1. A quantity with no source.** A weight, a threshold, a score component named to two decimal places and computed by nothing. The number is precise because precision was easy. Where the number comes from is the decision, and it's missing. Anything of the form "this factor counts for 25%" with no paragraph anywhere explaining what produces the 25% is a decision that was postponed by being written down.

**2. Version-churn asymmetry.** Look at revision counts across a document set. The ones revised over and over are usually the operational ones, and that churn is healthy - people are using them and correcting them. Now find the one or two documents that define what the thing fundamentally *is*, and check how many times those were touched. If the identity documents have the lowest churn in the set, that's not stability. Nobody argued about them, which usually means nobody had to commit to them.

**3. Vocabulary collisions.** The same word carrying two meanings in two sections, and no glossary entry, because a glossary entry would force somebody to choose. I hit this in my own vault with the word "phase", used for three unrelated things across two projects. Every one of those usages was clear locally. Together they were a trap, and the trap only sprang when something tried to act on all three at once.

## Why agents make this worse

Here's the part that's new, and the reason I bothered writing this instead of filing it as a lesson - a human handed an undecided spec usually stalls. They read it, feel the ambiguity, and go and ask someone. The stall is annoying and it is also the safety mechanism. The question gets escalated to whoever can actually decide it.

An agent doesn't stall, it picks. It picks quickly, it picks plausibly, and it doesn't flag that it picked, because from where it sits there was nothing to flag: two instructions, both valid, one has to go first. Then it picks differently next session, because nothing pinned it.

So you get non-determinism exactly where you thought you had a rule. And you get it at speed, which is the new abyss. My terse-versus-readable oscillation was harmless, it just made me squint at my own output for a while. The same failure inside a build pipeline produces a lot of confident, internally consistent, mutually incompatible code, fast, all of it correctly implementing a spec that had no decisions.

**AI accelerates what's decided. What's undecided, it improvises, at the same speed.** That trade is fine when you know which half you're in. Most specs I've read, including several of mine, don't say.

## What I do now

So I made two changes, none of them taking a lot of time.

**The decision comes before the spec, and it's a separate artifact.** Before anything gets specified, every open question is either resolved or explicitly marked out of scope. Out of scope is a real answer and it's often the right one - what's not allowed is leaving it unmarked, because unmarked reads as decided to everything downstream.

**The resolution gets written into the thing it resolves, with the reason and a stop sign.** When I finally settled the terse-versus-readable fight, I didn't write a third rule file. I wrote the decision into both existing files: which one wins, on which axis, why, the date, my name on it, and a line saying not to reopen it. Six months from now some version of me or some audit pass is going to look at those two rules, see the tension, and start helpfully resolving it again. The stop sign is there for that.

The second half is the part that gets underrated every time. A decision that isn't attached to the thing it constrains isn't a decision, it's a memory, and it lasts about as long as one.

## Where I got this, and what I built out of it

I didn't arrive at any of this on my own. The thing that named it for me was [Matt Pocock's wayfinder skill](https://github.com/mattpocock/skills).

Wayfinder treats a plan as a map instead of a document. The unknowns are marked as fog of war, the open questions are decision tickets you have to actually close, and "not yet specified" is a first-class state on the map rather than a gap you skim past. That last part is the whole idea - most planning formats have no way to say *this is undecided* out loud, so undecided and decided end up looking the same on the page, which is the failure this entire post is about.

What I already had was the other half. I'd been running a spec-driven flow for a while - constitution, then spec, then plan, then tasks, then tickets, with traceability from any artifact back to the thing above it. It works well, and it has one condition nobody had written down: it assumes the decisions are already made. Feed it something unsettled and it will specify the ambiguity beautifully. Every question stated with precision, none of them answered.

So the two compose rather than compete. Wayfinder clears the fog and produces settled decisions. Spec-flow turns settled decisions into artifacts. I glued them together into one command I call `midas` - scout the ground first, refine what survives - and put the gate between the halves:

```
  /midas
    │
    ├─ scout        chart the idea, close every decision ticket,
    │               then accept or kill it
    │
    │               ▼ verdict gate - nothing touches a repo before this
    │
    └─ spec-flow    constitution → spec → plan → tasks → tickets
```

Two things about that gate that I'd defend. **Everything before it is free to throw away**, so the map lives outside any repo and abandoning an idea costs nothing and leaves nothing behind. And **creating the repo is the ceremony that marks commitment**, which turns the exit ramp into a structural fact instead of a note in a document that everyone ignores.

One honest caveat about wayfinder that isn't a criticism of it: it's built for a team with a tracker, and it assumes concurrency and handoff that a solo operator running eight hours a week does not have. Pointed at a one-person project it's coordination machinery against a problem that isn't there, and paying that cost anyway is how a process gets quietly abandoned. So the ceremony is tiered in my version, and the tier is worked out *after* charting, because before you've charted the thing nobody knows how foggy it is. The tool wasn't too heavy - my default consumption of it was just wrong.

## The 'state of the art'

What's still broken, because a post like this is worth nothing without it:

- **Decisions rot and nothing tells you.** The terse-versus-readable call was right right now. If my needs change it'll be quietly wrong and it will keep executing, with a stop sign on it that I put there. I don't have a good answer for this. Dating the decision and naming who made it is the whole mitigation, and it moves nothing.
- **You can't decide everything up front, and pretending otherwise is the same disease.** Some things genuinely have to be discovered by building. The move isn't to resolve every question before writing a line, it's to mark which ones you deliberately left open, so the agent doesn't get to quietly close them for you.
- **This one I can't enforce outside the model.** My last post was an argument for putting guarantees in hooks rather than in instructions, and I stand by it. This doesn't fit. No script can look at a document and tell whether a human made a hard call or wrote around one. So it's a manual gate, which means it's a gate I'll skip on a bad week, and I know that about myself.
- **I've run this on small things, not big ones.** `midas` has gone through a handful of small features on Kelaro and Koa, the two products I actually ship, and it did what it says on the tin. What I haven't done is put a large build through it end to end, so I can tell you the gate works and I can't yet tell you what it costs at scale. The diagnosis is the part I'd defend hardest, because I got to it by being burned by it rather than by designing it.
- **One person, one setup.** I've run this on my own config and on my own products. I have no idea what the decision-before-spec gate looks like when six people are writing the spec and the person who has to decide is in a different timezone. I'd guess it's harder in a way that changes the answer.

The thing I'd want someone to take from this: when a spec feels finished, check what it gave up. If the answer is nothing, it isn't finished, it's just written.

---

*I'm a founder-engineer in Lisbon. I build B2B utilities end-to-end, and lately I spend a lot of time on the question of what an agent should and shouldn't be allowed to decide for me. Open to fractional CTO and consultancy work (not full-time - my days are spoken for). Reach me at [gilneto8.work@gmail.com](mailto:gilneto8.work@gmail.com) or via [gil-neto.com](https://gil-neto.com).*

<!--
LINKEDIN HOOK (not rendered - kept here so it doesn't get lost)

I have a rule file telling my agent to write tersely. I have another telling it not to write convoluted sentences.

For two months it obeyed whichever one it felt like that day. Same setup, nothing changed in between. I kept rewriting the rules.

The rules were never the problem. I'd written both of them completely and decided nothing - and from the outside, a spec that made hard calls and a spec that wrote around them look exactly the same.

The bit that actually worries me is what happens when you point an agent at one. A human stalls on an ambiguous spec and goes and asks someone. An agent doesn't stall. It picks, quickly, plausibly, and it doesn't tell you it picked.

Wrote up the three tells I use to spot it now, what I built on top of Matt Pocock's wayfinder to stop doing it, and the one part of this I can't fix with a hook - which is awkward, given my last post was an argument for hooks.
-->
