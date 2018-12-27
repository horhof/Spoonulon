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

### Andrew Jackson

* Ackson Jandrew
* An Jacksondrew
* Andrackson Jew
* Andron Jacksew
* Andreckson Jaw
* Andren Jacksow

([Link](https://horhof.github.io/Spoonulon/#!#Andrew%20Jackson))

### Conan the Barbarian

* Carbarian Bonan
* Carian Barbonan
* Cian Barbaronan
* Corbarian Banan
* Corian Barbanan
* Con Barbarianan
* Conarbarian Ban
* Conarian Barban
* Conian Barbaran

([Link](https://horhof.github.io/Spoonulon/#!#Conan%20Barbarian))

### Luke Skywalker

* Lalker Skywuke
* Ler Skywalkuke
* Lulker Skywake
* Lur Skywalkeke
* Lukalker Skywe
* Luker Skywalke

([Link](https://horhof.github.io/Spoonulon/#!#Luke%20Skywalker))

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