#!/usr/bin/env node
"use strict";

const logSymbols = require("log-symbols");
const chalk = require("chalk");
const meow = require("meow");
const ora = require("ora");
const url = require("url");
const Joi = require("joi");
const https = require("https");

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

const puppeteer = require("puppeteer");

const spinner = ora(`Checking if ${urlToCheck} is built using Gatsby`).start();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(urlToCheck, { waitUntil: "networkidle2" });

  const gatsbyNode = await page.$("#___gatsby");
  spinner.stop();
  if (gatsbyNode !== null) {
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

  await browser.close();
  process.exit(1);
})().catch(error => {
  spinner.stop();
  console.error(red(error.message));
  process.exit(1);
});
