# Mass Peaks

Find particle peaks by comparing pairs of muons with opposite and matching charges. [Open Mass Peaks](https://coolcode.ca/masspeaks/).

<!-- coolcode:guide -->
Select the J/ψ window, 0.10 GeV/c² bins and both charge selections. In the 3.00 to under 3.10 interval there are 4,512 opposite-charge and 558 same-charge pairs. Switch to percentages to compare each bin with its full charge sample.
<!-- /coolcode:guide -->

## Data and interpretation

The [CMS outreach release by Thomas McCauley](https://opendata.cern.ch/record/303) contains 100,000 two-muon events selected from CMS 2010 data and released under CC0. The collector reads the original CSV, retains the two recorded charges and reconstructed M column, and counts integer hundredths of a GeV/c² using decimal arithmetic. Each displayed bin includes its lower edge and excludes its upper edge. Every zoom and width reaggregates those fine bins. Normalization uses the entire sample of the same charge. Signal and background would require a model for a quantitative particle measurement. The source paper links, raw CSV and release checksum are available from the tool.

## Reproducing the edition

Run `python3 scripts/refresh.py` from the repository. The monthly GitHub Action checks the sources, validates the offline build and publishes changes. A failed retrieval leaves the previous release available. The retrieval date is separate from the observation period. Results are calculated locally in the browser from the bundled edition. Visitor selections are not uploaded.

Run `node --test tests/*.test.mjs`, `python3 -m unittest discover -s tests` and `python3 scripts/build.py`. Serve `dist/` to preview the standalone site. The Pages workflow also exercises the main interaction and responsive layout in Chromium.
