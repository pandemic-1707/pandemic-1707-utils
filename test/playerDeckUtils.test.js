const should = require('chai').should()
const utils = require('../index')
const pdUtils = utils.playerDeckUtils
const citiesDeck = require('../data/infectionDeck') // using only city names for simple testing
const citiesDeckFullObject = require('../data/cities')
const citiesDeckFull = Object.keys(citiesDeckFullObject).map((cityName) => {
  return { city: cityName, props: citiesDeckFullObject[cityName] }
})
const eventsDeck = require('../data/events')

const NUM_PLAYERS_4 = 4
const NUM_EPIDEMICS = 4

describe('#initShufflePlayerDeck', function () {
  it('returns shuffled deck of player and event cards', function () {
    // events (8) and cities (48) total to 56 card deck
    const initialDeck = pdUtils.initShufflePlayerDeck(NUM_PLAYERS_4)
    const stringDeck = citiesDeck.join()
    initialDeck.length.should.equal(56)
    // test for randomized
    initialDeck.join().should.not.equal(stringDeck)
    // still have our elements in there
    initialDeck.includes(citiesDeck[0])
    initialDeck.includes(eventsDeck[0])
  });
})

describe('#initDealPlayerCards', function () {
  it('returns object with deck with playerHand cards removed and playerHand cards as attributes', function () {
    // TODO: find more efficient way to pass decks thru tests
    const initialDeck = pdUtils.initShufflePlayerDeck(NUM_PLAYERS_4)
    const deckAndHands = pdUtils.initDealPlayerCards(NUM_PLAYERS_4, initialDeck)
    const deck = deckAndHands.playerDeck
    const hands = deckAndHands.playerHands // array of hand arrays
    // with 4 players, we will take out 2 cards per player 
    // deck.length.should.equal(48)
    hands.forEach(function (hand) {
      hand.length.should.equal(2)
    });
    // if card not in deck, should be in hand
    let foundCard = false

    // TODO: not recognizing card if in deck, debug 
    // if (!deck.includes(citiesDeckFull[0])) {
    //   hands.forEach((hand) => {
    //     hand.forEach((card) => {
    //       console.log("cards", card.city, citiesDeckFull[0].city)
    //       if (card.city === citiesDeckFull[0].city) foundCard = true
    //     })
    //   })
    // } else {
    //   foundCard = true // it's in deck
    // }
    // foundCard.should.equal(true)
  });
})

describe('#shuffleInEpidemicsPlayerDeck', function () {
  it('returns deck with epidemic cards in portions', function () {
    let playerDeck = pdUtils.initShufflePlayerDeck(NUM_PLAYERS_4)
    let playerHandsAndDeck = pdUtils.initDealPlayerCards(NUM_PLAYERS_4, playerDeck)
    const initialPlayerDeck = pdUtils.shuffleInEpidemicsPlayerDeck(playerHandsAndDeck.playerDeck, NUM_EPIDEMICS)
    let epidemicCount = 0;
    for (let i = 0; i < initialPlayerDeck.length; i++) {
      if (initialPlayerDeck[i].Epidemic === 'epidemic') epidemicCount++
    }
    epidemicCount.should.equal(4)
  });
})