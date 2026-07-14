# Promo V2 release gate

PR #63 may move from Draft only when every required gate is PASS.

## Code and static safety

- [x] Dynamic PDF count; no fixed 212-card requirement.
- [x] Grid supports observed 4/5/6-column layouts and validates one anchor per cell.
- [x] Promotion OCR requires exact multi-evidence Tier agreement.
- [x] Known Product Master requires matching brand, size numbers, title evidence and unit.
- [x] New Product Master requires repeated evidence from at least two cards before AUTO OK.
- [x] Price requires dual OCR and arithmetic validation.
- [x] Repeated Product Master cards use group price consensus and reject repeated price clusters.
- [x] Browser retries one failed OCR Worker run with one Worker.
- [x] Browser records runtime, device information and peak JavaScript heap when available.
- [x] Source-file fingerprint prevents publishing a file different from the audited file.
- [x] Objective Release Gate checks every card before enabling Publish.
- [x] Published-month batch writes and Product Master writes are locked.
- [x] Finalize requires every Card ID, image, title, price, unit, Function, Tier, Product Master link and group price.
- [x] Live page reads only a published month.
- [x] GitHub Web CI passes all Promo safety regressions.
- [x] Preview Edge Function version 5 is ACTIVE.

## Real-file and device proof

- [ ] Deployed browser completes all 258 SEP25 cards.
- [ ] Card-by-card audit confirms zero false AUTO OK for promotion.
- [ ] Card-by-card audit confirms zero false AUTO OK for title and Product Master.
- [ ] Card-by-card audit confirms zero false AUTO OK for price and unit.
- [ ] Android run completes without browser reload, freeze or OCR Worker loss.
- [ ] Runtime and peak memory are recorded from the real Android run.

## Isolated end-to-end proof

- [ ] Upload all test cards to an isolated environment.
- [ ] Incomplete upload leaves the current published month unchanged.
- [ ] Failed final validation leaves the current published month unchanged.
- [ ] Successful finalize publishes the new test month.
- [ ] Successful finalize removes old test-month rows, group links, group prices and Storage files.
- [ ] Live page displays only the newly published test month.

## Production decision

- [ ] User explicitly authorizes Ready for review.
- [ ] User explicitly authorizes merge to main.
- [ ] Production deployment is READY.
- [ ] Production smoke test passes.

No percentage estimate overrides this checklist.
