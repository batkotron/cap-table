# Cap Table

The free, open-source cap table tool for early-stage founders. Tracks founders, options pool, SAFEs, and priced rounds in one place.

**Live tool:** [batkotron.github.io/cap-table](https://batkotron.github.io/cap-table)

By [Michael Batko](https://batko.ai) - founder of [batko.ai](https://batko.ai), the platform helping founders raise smarter.

## What it does

- Track **founders, employees, advisors, and option pool**
- Add **SAFEs** with cap and discount, see fully-diluted ownership
- Model **priced rounds** with new investors and option pool top-up
- See your **dilution waterfall** across multiple rounds
- Export to CSV

## Why this exists

Most founders manage their cap table in a spreadsheet that breaks the moment a SAFE converts. Carta and Pulley are powerful but expensive ($300+/month) and overkill for pre-seed and seed companies.

This tool fills the gap: more structured than a spreadsheet, free, and open-source.

## Run it locally

```bash
git clone https://github.com/batkotron/cap-table
cd cap-table
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
```

The static export is written to `out/`. The GitHub Actions workflow auto-deploys this to GitHub Pages on every push to `main`.

## Disclaimer

This is not legal or financial advice. Real cap tables have complexity (different share classes, vesting schedules, anti-dilution provisions) this tool doesn't model. Always verify with your lawyer and accountant before making decisions based on this output.

## Companion tool

Looking to model SAFE conversions? Check out [SAFE Calculator](https://github.com/batkotron/safe-calculator) - the sister project that handles stacked SAFEs in detail.

## More resources

- [batko.ai/raise](https://batko.ai/raise) - All the raising tools in one place
- [batko.ai/blog](https://batko.ai/blog) - Writing on fundraising and dilution math

## Licence

MIT. Use it however you want. Attribution appreciated but not required.
