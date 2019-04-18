# outspoken
Outspoken is a Cucumber Inspired Functional Reactive Programming Language for Normal Humans

## Introduction

Program structure is reduced to "package-name: Package Description" as this allows for moving and reusing lines.
Tests (Unit Tests) are stored within packages themselves
User interfaces are streamed into the DOM


## Example Program

	Configuration:
		Author: Meow
		Program: dragonfly
		Description: A simple dashboard


	Login
		initialize-client-session: Prepare user session.
		create-home-ui: Create base UI for the user.
		populate-home: Stream in user widgets

	Logout
		destroy-client-session: Free up resources used by client session
		redirect-home: Redirect browser to root of the domain

