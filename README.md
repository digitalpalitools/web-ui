[![Continuous Deployment](https://github.com/digitalpalitools/dpd-tools/workflows/Continuous%20Deployment/badge.svg)](https://github.com/digitalpalitools/dpd-tools/actions?query=workflow%3A%22Continuous+Deployment%22)

# Digital Pāli Dictionary Tools

A set of tools for Digital Pāli Dictionary. Deployed at [dpd-tools](https://apps.kitamstudios.com/dpd-tools).

Create from the [dpd-tools](https://github.com/kitamstudios/dpd-tools) template. See [template README.md](https://github.com/kitamstudios/dpd-tools/blob/358acedc91c62b31910087d54ffa2623761506e0/README.md) for template features available out of the box.

## Features

- 3 workflows
  - [ ] ODS -> vocab.csv => **Outcome** The CSV is identical to goldendict cvs + with all the rows having empty "Meaning IN CONTEXT" (column 11) removed
  - [ ] ODS -> roots.cvs => **Outcome** The CSV is identical goldendict cvs + with all the rows having empty "Meaning IN CONTEXT" (column 11) removed **AND** any row with empty "Pāli Root" (column 15) removed
  - [ ] ODS -> stardict => **Outcome** The dpd.zip that is consumable by goldendict (there may be future enhancements here, but none right now)
- Must be doable offline
- Ok with running 🐍
- ODS -> stardict requirements
  - [ ] When there are more than one word eg dhamma 1-10, TOC at the top with format 'Pāli1: POS, Meaning IN CONTEXT'
  - [ ] Clicking on TOC element should scroll to the corresponding entry.

### TODO

- PWA
  - [ ] Update available check
- Telemetry
  - [ ] BUG: TypeError: Cannot read property 'trackMetric' of null
  - [ ] Add AppInsightsErrorBoundary
  - [ ] Track feature metrics
