import { Command } from 'commander'
import type { ReleaseType } from 'semver'

import { execSync } from 'node:child_process'
import { bumpCommand, publishCommand } from './commands/versioning'

const program = new Command('semver-release')
program.version('1.0.0')

const basePathDesc =
  'The base path of the project, where the main package.json is located. ' +
  'Defaults to the current working directory.'

const workspaceDirDesc =
  'The directory (relative to --base-path) where the packages are located. ' + 'Defaults to "packages".'

program
  .command('init')
  .option('-w --workspace-root', 'Initialize in workspace root package.json.')
  .description('Initialize and install required dependencies.')
  .action((options) => {
    const wsParam = options.workspaceRoot ? '-w ' : ''

    execSync(`pnpm add ${wsParam}-D @itsjavi/semver-release changelogen`, {
      stdio: 'inherit',
    })
  })

program
  .command('version:bump <level>')
  .description('Bump the package versions and create a release tag.')
  .option('--base-path <path>', basePathDesc, process.cwd())
  .option('--workspace-dir <dir>', workspaceDirDesc, 'packages')
  .option('--no-commit', 'Do not create a release commit and tag.')
  .action((level: ReleaseType, options) => {
    return bumpCommand(options.basePath, options.workspaceDir, level, options.commit)
  })

program
  .command('version:release')
  .description('Publish a release, including tags, npm packages, and GitHub release notes.')
  .option('--base-path <path>', basePathDesc, process.cwd())
  .option('--filter <pattern>', 'Only publish package names matching the given glob pattern.')
  .option('--tags', 'Push tags to remote repository.')
  .option('--npm', 'Publish npm packages.')
  .option('--github', 'Publish GitHub release notes.')
  .action((options) => {
    publishCommand(options.basePath, options.tags, options.npm, options.github, options.filter)
  })

program.parse(process.argv)
