import { execSync } from 'child_process'
import fs from 'node:fs'
import path from 'node:path'

import semver, { type ReleaseType } from 'semver'

function getSemver(basePath: string, desiredLevel?: ReleaseType | 'current'): string {
  const rootPackagePath = path.resolve(path.join(basePath, 'package.json'))
  const rootPackageContent = fs.readFileSync(rootPackagePath, 'utf-8')
  const rootPackage = JSON.parse(rootPackageContent)
  const currentVersion = rootPackage.version || '0.0.0'

  // Get the desired level (major, minor, patch)
  const _desiredLevel = desiredLevel ?? 'patch'

  if (_desiredLevel === 'current') {
    return currentVersion.trim()
  }

  if (!['major', 'minor', 'patch'].includes(_desiredLevel)) {
    throw new Error(`Invalid version level: ${_desiredLevel}, must be one of: major, minor, patch`)
  }

  /// Calculate the next version based on the desired level
  const nextVersion = semver.inc(currentVersion, _desiredLevel)

  if (!nextVersion) {
    throw new Error(`Unexpected error calculating the next version. Desired level: ${_desiredLevel}`)
  }

  return nextVersion.trim()
}

function setPackageVersion(packageFile: string, version: string): void {
  const packageJson = fs.readFileSync(packageFile, 'utf-8')
  const packageData = JSON.parse(packageJson)

  packageData.version = version

  fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2))
}

function setRootPackageVersion(basePath: string, version: string): void {
  const rootPackagePath = path.resolve(path.join(basePath, 'package.json'))
  setPackageVersion(rootPackagePath, version)
}

function setWorkspacePackageVersions(basePath: string, workspaceDir: string, version: string) {
  const packagesDir = path.resolve(path.join(basePath, workspaceDir))
  const packageDirs = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  setRootPackageVersion(basePath, version)

  // Update versions in each package's package.json
  packageDirs.forEach((packageName) => {
    const packagePath = path.join(packagesDir, packageName, 'package.json')
    if (!fs.existsSync(packagePath)) {
      console.log(`No package.json found in ${packageName}`)

      return
    }

    setPackageVersion(packagePath, version)
  })
}

function publishGithubRelease(basePath: string): void {
  execSync('pnpm exec changelogen gh release', {
    cwd: basePath,
    stdio: 'inherit',
  })
}

function createReleaseTag(basePath: string) {
  // Check if there are changes in package.json & **/package.json
  const hasPackageChanges =
    execSync("git diff -- package.json '**/package.json'", {
      cwd: basePath,
      encoding: 'utf-8',
    }).trim() !== ''

  if (!hasPackageChanges) {
    console.error('Error: None of the package.json files have been changed.')

    return
  }

  const currentVersion = getSemver(basePath, 'current')

  console.log(`Current Version: ${currentVersion}`)

  // Prepend content to CHANGELOG.md
  const existingChangelog = fs.readFileSync(path.join(basePath, 'CHANGELOG.md'), 'utf-8')
  const newChangelog = execSync(`pnpm exec changelogen -r "${currentVersion}"`, {
    cwd: basePath,
    encoding: 'utf-8',
  })

  fs.writeFileSync(path.join(basePath, 'CHANGELOG.md'), `${newChangelog}\n${existingChangelog}`)

  // Create a new commit and tag with the current version
  execSync("git add CHANGELOG.md package.json '**/package.json' pnpm-lock.yaml", {
    cwd: basePath,
    stdio: 'inherit',
  })
  execSync(`git commit -m "chore(releases): bump version to v${currentVersion}"`, {
    cwd: basePath,
    stdio: 'inherit',
  })
  execSync(`git tag -a "v${currentVersion}" -m "v${currentVersion}"`, {
    cwd: basePath,
    stdio: 'inherit',
  })
}

export function bumpCommand(basePath: string, workspaceDir: string, desiredLevel?: ReleaseType, commit = true): void {
  const nextVersion = getSemver(basePath, desiredLevel)

  setWorkspacePackageVersions(basePath, workspaceDir, nextVersion)

  if (commit) {
    createReleaseTag(basePath)
  }
}

export function publishCommand(basePath: string, tags: boolean, npm: boolean, github: boolean, filter?: string): void {
  if (tags) {
    execSync('git push && git push --tags --no-verify', {
      cwd: basePath,
      stdio: 'inherit',
    })
  }

  if (npm) {
    const filterArg = filter ? `--filter '${filter}' ` : ''
    execSync(`pnpm -r ${filterArg}exec pnpm publish`, {
      cwd: basePath,
      stdio: 'inherit',
    })
  }

  if (github) {
    publishGithubRelease(basePath)
  }
}
