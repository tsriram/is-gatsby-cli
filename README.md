# is-gatsby-cli

This is a CLI tool which tells whether a site / page is built using Gatsby.
There's a browser extension that does exactly the same which can be found here -
https://github.com/tsriram/is-gatsby

## Usage

First, install the tool globally using `npm` or `yarn`

```sh
npm i -g is-gatsby-cli
```

or

```sh
yarn global add is-gatsby-cli
```

You can then use the tool by passing a URL to `is-gatsby` command, like this:

```sh
is-gatsby https://reactjs.org
```

## TODO:

- Handle humanized & non-humanized formats of URL
