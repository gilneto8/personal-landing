---
title: "The index was lying and the eval knew"
description: "Six weeks after I fixed capture with hooks, my second brain was still confidently wrong. The nightly test had been saying so for a month. Nobody read the number."
pubDate: 2026-09-02
draft: false
tags:
  - llm
  - agents
  - claude
  - second-brain
  - evals
  - architecture
canonical: "https://gil-neto.com/blog/the-index-was-lying-and-the-eval-knew"
---

Six weeks ago I wrote that the way to stop an LLM agent from losing your context is hooks, structure and economics, not prompts. Capture cheaply, route once a night, enforce with scripts, cap what the agent reads. I still think that's right. This is the post about what it didn't cover.

The problem: capture never lost a fact again, and the agent was still wrong about a lot of things. It answered "what's going on with X" from an index that hadn't matched the underlying notes for weeks, and it did that with total confidence, because the rule said "read only the indexes" and it followed the rule. A nightly test I'd built in July had been reporting the decay the whole time. I had stopped reading it.

The TL;DR: the cap without a fallback produced amnesia. Three second-order failures did the damage - one fact written into six files, no way to read below the index, and diary files living in the config folder. And the test that measured all of this was itself rotting, which is a separate lesson I'd rather have learned some other way.

## What held

Credit where it's due, the previous post promised things and some of them delivered.

The inbox held. Every fact I stated in any session, in any repo, got its one timestamped line, and the nightly batch routed it. In six weeks I couldn't find a single "I told you this" that had actually evaporated. The stop hook committed every turn. The batch ran every night, on a laptop that woke itself around 2am to do it. The morning report was there when I opened the lid.

So the mechanism from post #2 works. The part I'd underwritten is what happens to a fact *after* it's captured - and it turns out a fact that is filed but wrong is worse than one that is missing, because the missing one at least makes the agent say "I don't know".

## What the eval saw before I did

In July I set up a golden set: thirty questions about my own vault with the answers I'd accept, graded nightly by a model that reads only the index files, exactly the way an interactive session would. First run, 19th of July: 17 of 30 passed, and the index-only tier missed 1 question out of 18.

Six weeks later, 28th of August: 9 of 30. Index-tier misses had gone from 1 to 6 out of 18.

That's a straight line down, and it was printed at the bottom of a report I read most mornings. I read the routed lines, I read the flags, and I skimmed past the eval because it was a number that never asked me for anything. A test nobody reads is a test that doesn't exist, and I'd built the second kind while congratulating myself on building the first.

When I finally sat down with it, about half of the decay was the vault and about half was the test. Some golden answers were July's truth - a project that was "next" in July was parked by August, and the grader was marking the correct new answer as a miss. That's its own failure: I'd written questions with a shelf life and no expiry date on them. The other half was real, and the real half is what the rest of this post is about.

## Autopsy 1 - copies

Here is the path one fact took through the vault. I say something in a session. It gets an inbox line. The batch writes it into a session file, a change-log entry, a dated status block at the top of the project note, a row in that note's "recent sessions" block, a row in the projects index and a row in the master index. Six places. Each one hand-written by a model, each one paraphrased slightly differently, each one drifting on its own clock as later sessions updated some of them and not others.

I had caps. Ten recent sessions, sixty words per project row. The caps bounded the *size* of each index. They did nothing about the *multiplicity* of the fact. Bounded size, unbounded copies. The change log alone reached 214 KB, one entry per session, every entry a copy of a session file that already existed.

The tell, in hindsight, was the status blocks. Project notes had grown into stacks of "Status - 21 Aug", "Status - 17 Aug", "Status - 13 Aug", newest on top, each one a paragraph. The current state of the project was whichever block a reader happened to reach first. My largest project note was 59 KB; the largest note in the vault, a dossier, was 98 KB. Nobody, human or model, reads 98 KB to answer "where does this stand".

## Autopsy 2 - no rung under the index

"For broad questions, read only the index files, no fan-out." I defended that rule in the last post and I'd defend it again. It makes the read cost of a session predictable. What it also does, if you stop there, is make everything below the cap invisible.

A fact that fell off an index - because a row got rewritten, because a cap bit, because the batch judged it less important than the newest thing - was gone as far as the agent was concerned. It wasn't gone from the vault. It was sitting in the owner note, correct, and the agent had no permitted way to reach it. So it did what a model does with a question it can't answer from what it's allowed to read: it answered anyway, from the nearest thing, in a confident voice.

The design had named this gap on day one. The roadmap literally said "search rung under the indexes - deferred until baseline". Deferred until baseline is where good ideas go to be forgotten. It stayed deferred for five weeks while the eval reported the consequences of not having it.

## Autopsy 3 - config in the data's bed

This one is embarrassing in a different way, because it's a category error rather than a trade-off.

Two files that change every time I talk - a corpus of my own writing that a style skill learns from, and the thread index a reflective skill maintains - lived inside the agent's config tree, next to the skills that read them. Reasonable place for them, if you squint. But I also had a hook whose job was "you changed your instructions, run the sanity check before continuing", and it decided what counted as an instruction by looking at *where the file lived*.

So every time the diary index was updated, the agent's config was "dirty". The hook fired at the end of the turn, blocked it and demanded a config review. Over four days in mid-August it blocked thirty-plus turns. Worse, it fired inside the headless nightly runs, which don't have a human to say "no, skip it". Five cron runs each spent about sixty turns running a config sanity check on itself, unsupervised, one of which edited my instructions file. Roughly three hundred night turns in a month, spent by a hook that was working exactly as written.

The fix was one move: data out of the config tree. The hook stopped firing because nothing it watched changed anymore. Nothing about the hook's logic was wrong. Its *scope* was wrong, and scope isn't a thing a prompt or a hook can see.

## The fix

None of the three failures needed a new idea. They needed the old idea applied one level further down.

**One home per fact; links everywhere else.** Every project note now opens with a `## Now` block - at most fifteen lines, rewritten never appended, every volatile line carrying an "as of" date. Under it, `## Never drift`: the three to six invariants the agent kept getting wrong about that project, so the correction lives next to the thing it corrects instead of in a memory file in another tree. Then `## Decisions`, dated, append-only. The stacked status blocks moved, verbatim, into a history file beside the note. 59 KB became 41 KB; the 98 KB dossier became 8 KB with a diary file next to it. Nothing deleted, everything findable, one place that is current.

**Indexes are generated.** The task index, the project registry, the personal-sphere index and the child lists in every hub note are now produced by a script from frontmatter plus the first line of each note's `## Now` block. The model can't drift a row, because it can't write a row. It edits the owner note. The only prose left in an index is a banner, and the banner has a word cap the linter checks. The change log is frozen; git and the session files were already the log.

**A rung under the index.** A keyword search over every note - SQLite full-text search, no embeddings, a hundred and fifty lines of Python, because at six hundred notes keyword recall is the documented sweet spot and I didn't want a vector database in the loop. The router rule got one clause longer: if the indexes don't hold the answer, run one search, read the one owner note it points at, answer with file and line. Still nothing, say so. Cost: one script call and one file read. The "I don't know" is now a real outcome instead of the thing that got papered over.

**A linter for everything checkable.** Frontmatter enums, required fields, links that resolve, caps, language-by-path, whether a generated index is stale, whether a task file has grown into a dossier, whether a `## Now` block has a first line short enough to be an index row. It runs before and after the night's routing, and an error in a file the night touched reverts that file to the pre-night commit and flags it. The model routes; the linter decides pass or fail.

**Eval questions that expire.** Each golden question can carry an expiry date. Expired is its own grade, never a miss. And the tiers are graded separately now - answerable from the index, answerable with one search, deep - so a search-tier miss can't hide behind an index-tier pass or the other way round.

```
  before                                after

  fact ──▶ inbox ──▶ session file       fact ──▶ inbox ──▶ owner note (## Now)
                  ├▶ change log                             │
                  ├▶ status block                   generated from it, nightly
                  ├▶ recent-sessions row                    ▼
                  ├▶ project-index row            index rows · hub lists · search index
                  └▶ master-index row                       │
                                                  linter: pass / fail
        six copies, six clocks                              │
                                                  eval: index / search / deep
```

**The night is one script.** Ten stages, each logged with a result and a duration, each with an exit code: lint, pull, route, regenerate, banner, lint again, eval, report, explore, commit. Every prompt the night uses is a file in a folder, not a string inside a shell script, so changing one is a diff. The report the batch writes is assembled by the script from git's own view of what changed, not from the model's memory of what it did.

**And the report proves the routing.** This was the last thing I added, the same evening, after asking the obvious question: the linter proves the night was well-formed and the eval proves recall, but nothing proved a routed fact actually landed anywhere. So now it does, without a model in the loop. For every inbox line the night removed, a script searches git's diff for the added line that shares its words and reports the file and line it landed in. Below a threshold it prints NO ECHO, which is the one line in the morning report I now read first. The same stage proposes up to two golden questions from what it routed, with an expiry date, into a candidates file. I promote them with one word. The test set grows from the facts that actually moved, instead of from what I thought mattered in July.

## The numbers

Before is August, measured from the transcripts and the git log. After is the 29th of August, the day the changes landed. That was one day in, so the first version of this post carried a single data point and a promise to come back. Five nights of history have run since. The last column is that follow-up, and it is less flattering than the first one, which is the point of measuring at all.

| | before | day one | five nights in |
|---|---|---|---|
| Eval, all tiers | 17/30 in July, 9/30 by late August | 26/30 | 22, 28, 21, 24 — out of 32 |
| Eval, index tier | 1 miss of 18, then 6 of 18 | 0 of 13 | 3, 3, 4, 4 misses of 16 |
| Eval, search tier | didn't exist | 3 misses of 17 | 2, 3, 1, 0 misses of 16 |
| Task index | 4.8 KB in June, 21 KB by August, hand-written | 8.1 KB, generated | — |
| Places one fact was written | 6 | 1, plus links | — |
| Largest living note | 98 KB | 8 KB, diary alongside | — |
| Turns blocked by the config hook | 30+ in four days | 0 | — |
| Night turns spent on the wrong job | ~300 in August | 0 | — |
| Memory files restating vault facts | 10 of 39 | 0 of 30 | — |
| Lint errors on the first run | 51 | 0 | 0 every night since |

I said at the time that the 26/30 was the number I trusted least, because I had fixed the rotten golden answers in the same week, and one day of data cannot separate a better vault from a friendlier test.

Five nights later that caution was right. The all-tiers score went 26, then 22, 28, 21, 24. It did not hold at 26 and it did not decay back to 9 either. It wanders in the low-to-mid twenties out of thirty-two, which is roughly a two-thirds pass rate and nothing like the "fixed" the day-one number implied.

The tier split is more useful than the headline. The search tier improved steadily and reached zero misses. The index tier did not: it sits at three or four misses out of sixteen and has not moved. That is a real finding rather than noise. Retrieval by search is working; the generated index files still cannot answer questions they ought to own. The number that made me feel good was the aggregate, and the aggregate was hiding the tier that is actually broken.

## The honest version

What's still broken, because a post like this is worth nothing without it:

- **The `## Now` blocks are still written by a model.** The generator can't drift a row, but the line it generates from is a paraphrase. What's new is that there's exactly one such line per fact, dated, and a monthly audit that spot-checks five of them against the newest session on that project. That's a check, not a guarantee.
- **One day of after-numbers.** Everything in the right column of that table was measured hours after the change. The previous version of this system also looked great on day one. The eval runs nightly and the lint history is a file now; if the line bends down again I'll say so.
- **The eval is thirty-three questions, mostly written by the person being graded.** Small, and biased toward what I thought mattered in July. The candidates mechanism above is the fix, and it has run for exactly zero nights as I write this.
- **The night still depends on one laptop being asleep in the right room.** A missed night used to surface at my next session start, not before. Now a failed or stale run shows as a desktop notification at login, which is the whole fix and took twenty minutes. I'd built the fancy part first and the boring part last, which is a habit worth naming.
- **Staleness was invisible until I wrote this paragraph.** A "current state" block dated six weeks ago is true and useless, and nothing flagged it. Now any active note whose block has no date newer than thirty days gets a stale marker in every generated row, and the linter says so. The first run flagged four notes. All four were exactly as stale as it said.
- **One person, one vault, one provider.** Same caveat as last time. I put most of my life in this thing on purpose, with my own provider settings, and I don't claim my answer to the privacy question is yours.

The thing I'd want someone to take from this, one clause longer than last time: put the model where judgment belongs, determinism where correctness belongs, and a test where the guarantee is claimed - then read the test. A guarantee you don't measure is a hope, and a measurement you don't read is a number.

---

*I'm a founder-engineer in Lisbon. I build B2B utilities end-to-end, and the tooling that keeps me honest while doing it. Open to fractional CTO and consultancy work (not full-time - my days are spoken for). Reach me at [gilneto8.work@gmail.com](mailto:gilneto8.work@gmail.com) or via [gil-neto.com](https://gil-neto.com).*

<!--
LINKEDIN HOOK (not rendered - kept here so it doesn't get lost)

Six weeks ago I wrote that hooks, not prompts, fixed my second brain. Capture never lost a fact again.

The agent was still confidently wrong about my life. It answered from an index that hadn't matched the notes for weeks, because the rule said "read only the indexes" and it obeyed.

A nightly test had been reporting the decay the whole time: 17/30 in July, 9/30 by late August. I stopped reading it.

The autopsy found three things, none of them the original thesis: one fact hand-written into six files, no way to read below the index, and diary files living in the config folder so a "you changed your instructions" hook fired on every diary write - including inside the nightly cron.

Wrote up the fix (one home per fact, generated indexes, a search rung, a linter, eval questions that expire) and the one lesson I'd rather not have learned: a test nobody reads is a test that doesn't exist.
-->
