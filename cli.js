#!/usr/bin/env node
"use strict";

const logSymbols = require("log-symbols");
const fetch = require("node-fetch");
const chalk = require("chalk");
const meow = require("meow");
const ora = require("ora");
const Joi = require("joi");

const cli = meow(`
	Usage
	  $ is-gatsby <url> 
	Examples
	  $ is-gatsby reactjs.org
`);

const green = chalk.green;
const red = chalk.red;
const blue = chalk.blue;

const { input } = cli;
const urlToCheck = input[0];

if (urlToCheck === undefined) {
  console.error(
    `Specify a valid URL. Example: ${blue(`is-gatsby https://reactjs.org`)}`
  );
  process.exit(1);
}

const { error } = Joi.validate(
  { url: urlToCheck },
  {
    url: Joi.string()
      .uri()
      .required()
  },
  {
    language: {
      string: {
        uri: `!!Please provide a valid URL. Example: ${blue(
          `is-gatsby https://reactjs.org`
        )}`
      }
    }
  }
);
if (error && error.details) {
  error.details.forEach(error => {
    console.log(error.message);
  });
  process.exit(1);
}

const spinner = ora(`Checking if ${urlToCheck} is built using Gatsby`).start();

(async () => {
  const response = await fetch(urlToCheck);
  const text = await response.text();
  const isGatsby = text.includes("___gatsby");
  spinner.stop();
  if (isGatsby) {
    console.log(
      green(
        `${logSymbols.success} ${urlToCheck} seems to be built using Gatsby :-)`
      )
    );
  } else {
    console.log(
      red(
        `${
          logSymbols.error
        } ${urlToCheck} doesn't seem to be built using Gatsby :-(`
      )
    );
  }
  process.exit(1);
})().catch(error => {
  spinner.stop();
  console.error(red(error.message));
  process.exit(1);
});
