const should = require('chai').should()
const utils = require('../index')
const deckUtils = utils.deckUtils
const infectionDeck = require('../data/infectionDeck')

describe('#shuffle', function () {
  it('shuffles an array of cards', function () {
    let deck = infectionDeck.slice(0, 10)
    // shuffle modifies original array, keep original
    let deckOriginal = infectionDeck.slice(0, 10)
    deckUtils.shuffle(deck)
    deckOriginal.join().should.not.equal(deck.join())
  });
})