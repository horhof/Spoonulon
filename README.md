# Spoonulon

![Example screenshot](doc/screenshot.png)

Spoonulon is a program for generating Spoonerisms from two words.

>  A spoonerism is an error in speech in which corresponding consonants, vowels, or morphemes are switched between two words in a phrase, such as saying "The Lord is a shoving leopard" instead of "The Lord is a loving shepherd." 
>
> These are named after the Oxford don and ordained minister William Archibald Spooner, who was famous for doing this.
>
> &mdash;[Spoonerism](https://en.wikipedia.org/wiki/Spoonerism)

## Usage

* Use the [web app](https://horhof.github.io/Spoonulon/#!#Luke%20Skywalker) or 
* use `npm start "<first word> <second word>"` (or call `ts-node` on `Cli.ts` directly):

```shell
$ npm start "Han Solo"
Holo San
Ho Solan
Halo Son
```

## Examples

People's names, e.g. [Matsuo Basho](https://horhof.github.io/Spoonulon/#!#Matsuo%20Basho):

* Mo Bashatsuo
* Matsasho Buo
* Matso Bashuo

Characters, e.g. [Conan the Barbarian](https://horhof.github.io/Spoonulon/#!#Conan%20Barbarian):

* Carbarian Bonan
* Conarian Barban
* Conian Barbaran

Phrases, e.g. [ohayo gozaimasu](https://horhof.github.io/Spoonulon/#!#Ohayo%20gozaimasu):

* Osu Gozaimahayo
* Ohozaimasu Gayo
* Ohayasu Gozaimo

Things, e.g. [automated testing](https://horhof.github.io/Spoonulon/#!#automated%20testing):

* Auting Testomated
* Autosting Temated
* Automatesting Ted

## Project details

* [![Build Status](https://travis-ci.org/horhof/Spoonulon.svg?branch=master)](https://travis-ci.org/horhof/Spoonulon)
* [Test coverage](https://horhof.github.io/Spoonulon/coverage) (nyc)
* [Code documentation](https://horhof.github.io/Spoonulon/code-docs) (typedoc)

## Building

```bash
npm run compile  # Compile .ts files for use with Node.
npm run compile-client  # Compile .ts files for use in the browser.
npm run report  # Generate code coverage report in coverage/ with nyc.
npm run gen-docs  # Generate typedoc code documentation.
```