# Frontend EV Architecture

- [Prerequisites](#prerequisites)
- [Setup backend](#setup-backend)
- [Getting Started](#getting-started)
- [Project structure](#project-structure)
- [Code style](#code-style)
- [Testing](#testing)
  - [Unit testing](#unit-testing)
    - [How it works](#how-it-works)
    - [How to run manually](#how-to-run-manually)
    - [How to update snapshots](#how-to-update-snapshots)
- [Git commits](#git-commits)
- [Deployment](#deployment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Prerequisites

The following dependencies must be available to be begin project development.

- [Unix-like][] operating system _— [Windows Subsystem for Linux][] also works_
- [Git][]
- [Node][] `=14`
- [Yarn][] `>=1.5.1`

[git]: https://git-scm.com/
[node]: https://nodejs.org
[unix-like]: https://en.wikipedia.org/wiki/Unix-like
[yarn]: https://yarnpkg.com

## Setup backend

You need to install ....

## Getting Started

To get set up, run the following commands:

```bash
git clone https://github.com/goevlatam/frontend
cd name_project
yarn install
yarn dev
```

If you get an error

```bash
  rm -rf node_modules
  rm -rf package-lock.json
  yarn install && yarn dev
```

## Project structure

### Components

In this folder will go all the reusable components of the project. Each component is developed to be used in different pages.

### Pages

In this folder will go all the pages of the project. Each page is a set of components.

### Shared

### Redux

### Public

In this folder will go all the assets that will be used in the project.

## Code style

We use [ESLint][] and [Prettier][] to ensure consistency throughout the source code. Please view our [ESLint configuration][] for details on style rules.

Use the [JSDoc style guide](https://github.com/shri/JSDoc-Style-Guide) for documentation comments.

[eslint]: https://eslint.org/
[eslint configuration]: ./packages/eslint-config
[prettier]: https://prettier.io/

### React

## Testing

### Unit testing

[Jest][] along with [React Testing Library][] is used to run our unit testing suite. While we aim for the highest possible code coverage, every component should be covered with a [snapshot test][] at the very least.

[jest]: http://jestjs.io/
[snapshot test]: http://jestjs.io/docs/en/snapshot-testing.html

#### How it works

Unit tests reside within module specifications (`moduleName.test.js`), which are placed next to their respective modules. Jest runs all of the project's unit tests together, and evaluates code coverage on the project as a whole.

#### How to run manually

```bash
yarn test
```

#### How to update snapshots

```bash
yarn test -u
```

## Git commits

Commit messages should adhere to the [Angular Git Commit Guidelines][].

## Package versioning

Package versioning is automated via [Semantic Release][] and determined by commit messages. Commit messages should adhere to [Angular Git Commit Guidelines][].

[angular git commit guidelines]: https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines
[semantic release]: https://github.com/semantic-release/semantic-release

## Deployment

### How to deploy

1. Create a pull request (PR) to merge `development` into `master`.
   - Begin the PR title with `Release:` for consistency.
   - Add the `release` issue label for discovery.
1. Wait for the PR to receive approval and all automation to finish.
1. Merge the PR with a **merge commit**

   - Merging with a merge commit ensures there's no loss of commit information.
