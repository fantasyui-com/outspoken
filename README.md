# outspoken
Outspoken is a Cucumber Inspired Functional Reactive Programming Language for Normal Humans

## Introduction

Program structure is reduced to "package-name: Package Description" as this allows for moving and reusing lines.
Tests (Unit Tests) are stored within packages themselves
User interfaces are streamed into the DOM


## Example Program

### PROCEDURE DIVISION

#### Main

- Configure Server
  * port: 8081
- Validate configuration object using is-valid-object.
  * fields: repository, commitMessage, isNpm
  * dropPacket: true
- Check if this is a valid github repository using is-github-repo.
- Ensure local availability of git repository using git-get.
- Update NPM Package using npm-update
- Update NPM License field using npm-license-field
  * license: GPL-3.0
- Perform NPM Audit using npm-audit
- Update LICENSE file using gpl-license
- Update npm
- Update github
- Tweet about package update

#### Notification
bork

## Program License

see ./LICENSE file
