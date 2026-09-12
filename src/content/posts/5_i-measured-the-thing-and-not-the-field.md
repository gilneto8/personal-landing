---
title: "I measured the thing and not the field"
description: "Four systems failed me in one Saturday. A test nobody read, an index that printed half a sentence, a market scan that scored one app and ignored the four better ones beside it, and a product that threw away its own verification. Same bug, four costumes."
pubDate: 2026-09-06
draft: true
tags:
  - llm
  - agents
  - evals
  - second-brain
  - product
  - judgment
canonical: "https://gil-neto.com/blog/i-measured-the-thing-and-not-the-field"
---

Four days ago I published a postmortem about my second brain answering confidently from stale indexes while a nightly test had been reporting the decay for a month. The lesson I drew was that a test nobody reads is a test that doesn't exist.

I spent this Saturday finding three more instances of the same bug. One of them was in the fix.

The TL;DR: all four measurements were correct. Every conclusion drawn from them was wrong, because in all four cases the measurement covered the thing and not the thing's context. That is not a data problem, and adding more data doesn't touch it.

## One - the gate that wasn't a gate

The nightly eval runs 32 questions against my vault, grades them, and writes a line like `total=32 pass=25 miss=2` into a history file. Post #5 was about not reading that number.

So I went to add the obvious fix, and looked at what the night script actually does with it:

```bash
EVAL_LINE="${summary#EVAL_SUMMARY }"      # sets a variable
log "  eval: ${EVAL_LINE:-no summary line}"   # writes a log line
```

That's it. `EVAL_LINE` never reaches `worst()`, the function that decides the night's exit code. Every other stage in that pipeline has teeth - lint reverts files, a failed stage raises the exit code, and my session-start hook warns me the next morning. The eval was the one stage that could collapse in total silence.

I'd written a whole post about a number that asked nobody for anything, and the number still asked nobody for anything, because I fixed the reading habit and not the wiring.

The fix is about five lines. But picking the threshold is where it got interesting.

My first instinct was a floor at 70% and a drift check against the previous night. Then I backtested it over all 47 runs in the history file, which I should have done before writing any of it:

| floor | fires on the broken era | fires on the healthy era |
|---|---|---|
| 70% | 35/35 | **2/12** |
| 65% | 35/35 | 0/12 |
| 60% | 35/35 | 0/12 |

At 70% the gate cries on one healthy night in six, which is how a gate becomes wallpaper - the exact failure I was fixing, one level up. The two eras turn out not to overlap at all: the broken system ran 23-57%, the fixed one runs 66-88%. Anything between 58 and 65 separates them cleanly.

The night-over-night drift check was worse. The documented failure in post #5 was a *slide* - 17/30 in July down to 9/30 in August, a couple of points a week. I checked what a night-over-night delta would have caught, and the answer is nothing, not a single step of it. So the drift check compares against the median of the previous runs instead, and the self-check asserts exactly that case:

```python
slide = [17/30, 16/30, 15/30, 14/30, 13/30, 12/30, 11/30, 9/30]
ok, why = verdict(slide, floor=0.0)
assert not ok, f"the drift check has to catch the slide, got: {why}"
assert slide[-2] - slide[-1] < DRIFT   # ...and a delta gate would not have
```

Threshold picked from the thing (last night's number). Should have been picked from the field (the distribution of every night).

## Two - the index that printed half a sentence

With the gate in, I went looking at the two questions the eval had actually missed that morning. One of them asked what my active next step was and got back an answer about a record player and a work presentation.

The trail led to this function, which every generated index in the vault depends on:

```python
def now_first(body: str) -> str | None:
    for l in now_lines(body):
        s = l.strip()
        if s and not s.startswith("<!--"):
            return re.sub(r"^(?:[-*]|>|\d+\.)\s+", "", s)
    return None
```

It returns the first **physical line** of the first bullet. Markdown bullets soft-wrap. So any bullet longer than one editor line got truncated wherever the line break happened to fall, and the truncated text was projected into every index that reads that note.

Three of my project notes had been shipping rows like this for days:

```
Cashew  →  "…is the REVIEW LAYER of the one product**, not a"
Kelaro  →  "…Cashew and Augur are ONE product** (Gil's"
```

Those rows were in the daily briefing I read. I read "(Gil's" as a row ending and my eye slid over it, because the surrounding row was fine and the sentence sounded like something I'd written.

Nothing failed. No error, no warning, no lint complaint. The data was there, the function was returning a string, the string was rendering. The only thing wrong was that it was half a sentence, and nothing in the system had an opinion about whether a row was a complete thought.

I fixed the join, and then wrote the check I actually wanted, which is not "did this function work" but "is the row usable":

- `row-cut` - the row ends mid-sentence
- `row-undated` - the row carries no date, so it can't be aged
- `row-stalest` - a newer dated bullet sits below the one being projected, so the freshest state is the one thing the indexes never show

That last one fired on seven notes immediately. Seven owner notes where the current truth was sitting in the file, two bullets down, invisible to everything that reads it.

Two of those seven were false positives, both for the same reason: a bullet dated in the *future* isn't newer state, it's a scheduled commitment. A revival check in 2027 is not news. Excluding future dates fixed both, and I only found it because I ran the rule against real data instead of trusting that it was obviously correct.

Same shape as the gate. I checked the function and not the output. The function was fine.

## Three - the market scan that scored one app

Different project entirely. I keep a side thesis about Atlassian Marketplace apps: find one that's abandoned but still installed, build a working replacement, sell it monthly. In June a scan picked a target - a label-colouring app with 388 installs, 2.3 stars, and a review page that is one long complaint that the core feature does not function. Textbook.

Today I re-verified it before committing to a build. The target checks out and then some:

```
Colorful Labels for Jira    2.29★   12 reviews   344 installs
```

Down from 388 in June. Newest review, June 2025. Genuinely abandoned, genuinely bleeding, exactly as scored.

Then I pulled every app in the same niche, which the original scan never did:

| App | ★ | reviews | installs |
|---|---:|---:|---:|
| Advanced Label Manager for Jira | 3.99 | 41 | **1425** |
| Label Manager for Jira | 4.31 | 18 | 760 |
| Colored Label Manager | **4.67** | 46 | 468 |
| **Colorful Labels (the target)** | **2.29** | 12 | **344** |
| Label Management for Jira | 4.58 | 3 | 166 |

The thesis needs three things: an abandoned incumbent, a captive base, and no good alternative. The scan verified the first one thoroughly and never looked at the other two. Those 344 users aren't captive. They're inert. Everyone who cared already left, which is precisely *why* the install count is falling - the number I was reading as an opportunity is the receipt for one.

A working replacement would enter that table in fifth place, behind something already rated 4.67.

And the scan is the actual product here. It's meant to be a repeatable workflow, not one app. So the defect isn't the pick, it's that the scoring function takes a candidate and returns a verdict without ever loading the candidate's neighbours. Every future pick has the same hole. Two more targets were already selected the same way.

## Four - the one that reaches customers

<!-- GIL: this section discloses a live, unfixed bug in Kelaro. PAYG is closed so there are no
     paying customers right now, and the fix is already drafted. Your call whether it stays. Cutting
     it costs the post its strongest example; keeping it is the same move as posts #4 and #5. -->

The last one I found by going looking, which is the only reason I found it at all.

My reconciliation product has two halves. A Python engine does deterministic extraction and the balance tie-out - opening balance plus the sum of the transactions has to equal the closing balance, or the statement is not trustworthy. A TypeScript app calls it and shows the result to an accountant.

Earlier the same day I'd fixed a bug in the engine where a statement whose balances were never captured could still ship as `SUCCESS` - a reconciliation that may not have run being reported as one that passed. The engine now caps that case at `PARTIAL` and sets an explicit flag saying whether the tie-out actually ran.

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

The engine fails closed. The app fails open on top of it. The whole product promise is *verified numbers in the accountant's own sheet*, and I'd built the verification and then dropped it one function later.

I want to be clear about how this happened, because it wasn't carelessness at the boundary. Both sides are individually correct. The engine correctly reports PARTIAL. The app correctly handles the two statuses it knows about, and correctly shows warnings on low-confidence parses. There is no line of code you can point at and call wrong. What's wrong is that nothing compares the set of statuses the engine can emit against the set the app handles, and nothing compares "what does the user need to be warned about" against "what triggers a warning".

Again: the measurement was right. The comparison didn't exist.

## The thing they have in common

I want to be precise about this, because "add more checks" is the wrong lesson and it's the one I'd have taken a year ago.

In all three cases the measurement was accurate. The eval's 25-of-32 was true. `now_first` returned exactly the string it was written to return. The target app really does have 344 installs and 2.29 stars. Nothing was broken, no data was missing, no model hallucinated anything.

What was missing in each case was the comparison that turns a number into a judgment:

- a pass rate is not a verdict until you compare it to the distribution of pass rates
- a row is not an answer until you compare it to what a complete row looks like
- an install count is not an opportunity until you compare it to the alternatives one search away

Each system did the measuring and left the comparing to me. And I was the one component that had no alarm, no threshold and no memory. So the number sat in a report I skimmed, the fragment sat in a briefing I read, and the scan sat in a note I trusted, for weeks.

There's a fashionable version of this point about AI systems needing human judgment in the loop. I think that's backwards, or at least it was backwards in my case. Judgment wasn't missing from the loop. I was right there, reading the outputs every morning. What was missing is that judgment is *comparative* and none of these systems handed me anything to compare against. They handed me a value.

A friend asked me last night what I actually think the AI-and-judgment split is. This is the sharpest version I have: **the model can do the measuring, and determinism can do the comparing, and the human is the worst possible place to put either.** I'm not slow at comparison, I'm inconsistent at it - I did it thoroughly on the Marketplace scan today and not at all on the same scan in June, for no better reason than which one I happened to be suspicious of.

Every fix I shipped today is a comparison moved out of my head and into a script. The gate compares tonight's rate to the median of the last seven. The lint rule compares the projected row to a shape. The scan fix will compare a candidate to its neighbours before returning a verdict. None of them are clever. All three are things I was already doing, unreliably, in my head, on the days I remembered.

## What I'd take from this if I were you

Look at anything in your system that emits a number nobody can fail. Then ask what it would have to be compared against for that number to mean something, and whether anything in the system is doing that comparison, or whether you are.

If it's you, it isn't happening on the days you're busy. That's not a discipline problem. It's an architecture one.
