---
title: "Three exchanges died this year. The mess lands on accountants"
description: "AscendEX, BitMEX and CoinEx all shut in 2026. The tax year outlives the venue, and the only record left is whatever the client remembered to export."
pubDate: 2026-09-23
draft: true
tags:
  - crypto
  - accounting
  - mica
  - reconciliation
canonical: "https://gil-neto.com/blog/three-exchanges-died-this-year"
---

Three mid-tier crypto exchanges shut down in 2026. [AscendEX](https://ascendexannouncement.com/) stopped operating on 1 July. [BitMEX](https://www.bitmex.com/blog/bitmex-closure/) announced its closure on 23 July and shut on 23 September. [CoinEx](https://www.coinex.com/en/announcements/detail/53539656293908) is winding down in steps: spot trading ends on 29 September and withdrawals stay open until 22 December. By mid-year, [RootData's tracker counted 99](https://www.bitget.com/news/detail/12560605545942) crypto projects that had died in total, but those three are the ones that matter here, because people used them like accounts.

Most of the coverage stops at the closure. Who lost access and how long the withdrawal window is. That's the front office. I want to write about the back office, because that's where I spend my time: I build a tool that takes a small accounting practice's bank data and puts it into the spreadsheet the practice already runs on. I looked hard at crypto as a source for it in August, and I decided not to build it. The reasons I said no are the same reasons this is going to hurt someone in about a year.

## What actually closed them

The easy story is "MiCA killed them". It's close, but the date people quote is wrong. [MiCA](https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica) started applying to crypto-asset service providers on 30 December 2024. The 1 July 2026 date that keeps showing up is only the outer limit of the grandfathering window (Article 143(3)), the grace period for providers already operating under national rules, and several member states ended it earlier than that.

So, the regulation didn't arrive in July. It arrived eighteen months earlier, and July was when the last excuse ran out. For a mid-tier venue the choice was a full licence, with the compliance cost that comes with it, or leave. Three of them left.

## The tax year outlives the venue

Here is the part that makes it an accounting problem and not a news story.

The EU's crypto reporting directive ([DAC8](https://taxation-customs.ec.europa.eu/taxation/tax-transparency-cooperation/administrative-co-operation-and-mutual-assistance/directive-administrative-cooperation-dac/dac8_en)) has been in force since 1 January 2026. Exchanges collect data through 2026 and file the first reports between January and September 2027. So 2026 is the first year in which a European's crypto activity becomes visible to their tax authority as a matter of routine.

Put the two timelines next to each other. A client traded on BitMEX in the first half of 2026. The exchange closed in September. Their accountant sees the numbers in spring 2027, maybe prompted by a letter from the tax authority, which by then has data the client never looked at. At that point the venue that produced the history doesn't exist anymore. Nobody can log in and re-download the statement. Whatever the client exported before the doors shut is now the only record, and I'd guess most clients won't export anything until someone asks them to.

## Why an exchange export is worse than a bank statement

When I looked at crypto for my own tool, I expected it to be another source. Bank statement in, rows out. It isn't, for three reasons.

1. **An exchange export is incomplete by design.** It shows what happened inside that venue. Internal transfers, failed transactions and staking rewards show up inconsistently or not at all, depending on the venue and on which export you picked.
2. **Cost basis lives across venues.** Bought on one exchange, moved to a wallet, sold on another. No single exchange knows what the asset cost. The number the tax return actually needs is stitched together from several sources, and one of those sources just disappeared.
3. **There is no authoritative statement to check against.** With a bank, I can take the opening balance, add the transactions and check that I land on the closing balance the bank printed. If it doesn't tie out, something is missing and I know it. With an exchange, the export IS the unreliable object. There's nothing independent to reconcile it against, and after closure there never will be.

The third one is the one that bothers me most. A bank reconciliation fails loudly when rows are missing. An exchange history just looks shorter.

## What I'd do this week, if I had a client on one of them

None of this needs a product. It needs a checklist, and it needs to happen before 22 December.

1. Export everything the venue still offers: trade history, deposits, withdrawals, fees and any staking or earn records. Separate files are fine, keep all of them.
2. Save the final balance screen (a screenshot is fine) the day before the last withdrawal. It's the closest thing to a closing statement you're going to get.
3. Note where every withdrawal went. That address or account is where the cost basis continues, and it's the thread the accountant will need to pull next year.
4. Convert to fiat at the transaction date, and keep the rate you used next to each row. Doing that in 2027 from memory is much harder.
5. Check it yourself, once: deposits minus withdrawals, plus or minus trades and fees, should land on zero after the final withdrawal. If it doesn't, something is missing, and today you can still go back and look. In January you can't.

## Why I'm not building this

I'd argue the demand is real and it has a date on it. Even so, it's the wrong thing for me to build right now. It expires by design (after 22 December there's nothing left to export), the buyer is a crypto holder and not the accountant I sell to, and cost basis across venues is a different product from the one I'm building. The tools that already do cost basis are mature and cheap.

So, I'm writing it down instead. If you're an accountant with a client on AscendEX, BitMEX or CoinEx, send them the checklist above now, while the withdrawal window is still open.
