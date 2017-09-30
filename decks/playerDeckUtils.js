const cities = require('../data/cities.js')
const events = require('../data/events.js')
const deckUtils = require('./deckUtils.js')
const playerUtils = require('../players/playerUtils.js')

  // initial shuffle: returns a deck object of all city & event
  // cards shuffled together
  const initShufflePlayerDeck = () => {
    // turn objects into arrays & shuffle
    const citiesArr = Object.keys(cities).map((cityName) => {
      return { city: cityName, props: cities[cityName] }
    })
    let playerDeck = citiesArr.concat(events)
    deckUtils.shuffle(playerDeck)
    return playerDeck
  }

  // pick playerhands and remove cards from deck
  const initDealPlayerCards = (numPlayers, playerDeck) => {
    // pick playerhands and remove cards from deck
    let numPlayerHandCards = 0
    // game specifies specific num of cards per player hand depending on
    // num of players
    if (numPlayers === 2) numPlayerHandCards = 4
    if (numPlayers === 3) numPlayerHandCards = 3
    if (numPlayers === 4) numPlayerHandCards = 2
    let playerHands = [] // all player hands
    for (let i = 0; i < numPlayers; i++) {
      let playerHand = [] // individual player hand
      for (let j = 0; j < numPlayerHandCards; j++) {
        playerHand.push(playerDeck.pop())
      }
      playerHands.push(playerHand)
    }
    // return playedeck and playerhands for firebase update
    return { playerDeck: playerDeck, playerHands: playerHands }
  }

  // referenced from:
  // https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
  const flatten = (arr) => {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
  }

  // add epidemic cards & shuffle
  const shuffleInEpidemicsPlayerDeck = (playerDeck, numEpidemics) => {
    // split deck into numEpidemics
    const numPerPiles = Math.floor(playerDeck.length / numEpidemics)
    let piles = []
    for (let i = 0; i < playerDeck.length; i += numPerPiles) { // num of piles = num of epidemics
      let epidemicDeck = playerDeck.slice(i, i + numPerPiles)
      // insert epidemics into each pile
      epidemicDeck.push({ Epidemic: 'epidemic' })
      // shuffle each pile
      deckUtils.shuffle(epidemicDeck)
      piles.push(epidemicDeck)
    }
    // put piles back together
    // const epidemicDeck = [].concat.apply([], piles)
    const epidemicDeckFull = flatten(piles)
    return epidemicDeckFull
  }

  const initPlayerDeck = (numPlayers, numEpidemics) => {
    let initialPlayerDeck = initShufflePlayerDeck(numPlayers)
    let playerHandsAndDeck = initDealPlayerCards(numPlayers, initialPlayerDeck)
    const playerdeck = shuffleInEpidemicsPlayerDeck(playerHandsAndDeck.playerDeck, numEpidemics)
    return { playerDeck: playerdeck, playerHands: playerHandsAndDeck.playerHands }
  }

module.exports = {
  initPlayerDeck, initShufflePlayerDeck, initDealPlayerCards, shuffleInEpidemicsPlayerDeck
}
