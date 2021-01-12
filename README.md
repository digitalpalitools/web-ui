[![Continuous Deployment](https://github.com/digitalpalitools/dpt-tools/workflows/Continuous%20Deployment/badge.svg)](https://github.com/digitalpalitools/dpt-tools/actions?query=workflow%3A%22Continuous+Deployment%22)

# Digital Pāli Tools

A set of Digital Pāli Tools. Deployed at [apps](https://d.pali.tools/apps).

Create from the [cra-template-kitamstudios](https://github.com/kitamstudios/cra-template-kitamstudios) template. See [template README.md](https://github.com/kitamstudios/cra-template-kitamstudios/blob/358acedc91c62b31910087d54ffa2623761506e0/README.md) for template features available out of the box.

# Instructions

## Install utilities

> Do only once on a given machine

1. In bash and run the following
1. ```sudo apt-get install nodejs zip wget```
1. ```node -v # should show v14.15.1 or something similar```

## Download latest

> Do every time there is a new feature or bug fix

1. In bash and run the following
1. Go to the working folder (say /home/bdhrs/dpt-tools)
1. ```wget https://apps.kitamstudios.com/apps/dpt-tools-cli.zip && unzip dpt-tools-cli.zip```

## Regenerate DPD artefacts

1. In bash and run the following
1. ```node --max-old-space-size=8192 /home/bdhrs/dpt-tools/index-cli.js generate-files '/home/bdhrs/dpt-tools/Pāli English Dictionary.ods' PALI 40```

## Features

- 3 workflows
  - [v] ODS -> vocab.csv => **Outcome** The CSV is identical to goldendict cvs + with all the rows having empty "Meaning IN CONTEXT" (column 11) removed
  - [v] ODS -> roots.cvs => **Outcome** The CSV is identical goldendict cvs + with all the rows having empty "Meaning IN CONTEXT" (column 11) removed **AND** any row with empty "Pāli Root" (column 15) removed
  - [v] ODS -> stardict => **Outcome** The dpd.zip that is consumable by goldendict (there may be future enhancements here, but none right now)
- [v] Must be doable offline

### TODO

- PWA
  - [ ] Update available check
- Telemetry
  - [ ] BUG: TypeError: Cannot read property 'trackMetric' of null
  - [ ] Add AppInsightsErrorBoundary
  - [ ] Track feature metrics
