import * as yargs from 'yargs'

yargs
  .commandDir('cli/commands', { extensions: ['ts', 'js'] })
  .demandCommand()
  .alias('help', 'h')
  .alias('version', 'V')
  .parse(process.argv.slice(2))
