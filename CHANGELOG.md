# Changelog

All notable changes to this site are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CodeQL and a gitleaks history scan run in CI, and Dependabot keeps dependencies and pinned actions current.
- The site's text comes from `@haruhimemoe/messages` through next-intl, with no locale in the URL: the shared `NEXT_LOCALE` cookie, then the browser's languages. English only for now; pages stay static until a second language lands. `bun run check:keys` checks every key against the catalogs. Card images follow harumin's Accept-Language, and /commands shows the bot's command text from its catalog.

### Changed

- Dependencies are on their latest versions, including msw 3 in the tests.
