const { getFrameSigner, deployContract, contractAt , sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")

const network = (process.env.HARDHAT_NETWORK || 'goerli');
const tokens = require('./tokens')[network];
const deployedAddress = require('../deployedAddresses')[network];

const {
  ARBITRUM_URL,
  ARBITRUM_CAP_KEEPER_KEY,
  AVAX_URL,
  AVAX_CAP_KEEPER_KEY,
} = require("../../env.json")

async function getArbValues(signer) {
  const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_URL)
  const capKeeperWallet = new ethers.Wallet(ARBITRUM_CAP_KEEPER_KEY).connect(provider)

  const { btc, eth, usdc, link, uni, usdt, mim, frax, dai } = tokens
  const tokenArr = [btc, eth, usdc, link, uni, usdt, mim, frax, dai]
  const fastPriceTokens = [btc, eth, link, uni]

  const priceFeedTimelock = { address: "0x7b1FFdDEEc3C4797079C7ed91057e399e9D43a8B" }

  const updater1 = { address: "0x18eAc44875EC92Ed80EeFAa7fa7Ac957b312D366" }
  const updater2 = { address: "0x2eD9829CFF68c7Bb40812f70c4Fc06A4938845de" }
  const keeper1 = { address: "0xbEe27BD52dB995D3c74Dc11FF32D93a1Aad747f7" }
  const keeper2 = { address: "0x94577665926885f47ddC1Feb322bc51470daA8E8" }
  const updaters = [updater1.address, updater2.address, keeper1.address, keeper2.address]

  const tokenManager = { address: "0x2c247a44928d66041D9F7B11A69d7a84d25207ba" }

  const positionRouter1 = await contractAt("PositionRouter", "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868", capKeeperWallet)
  const positionRouter2 = await contractAt("PositionRouter", "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868", capKeeperWallet)

  const fastPriceEvents = await contractAt("FastPriceEvents", "0x4530b7DE1958270A2376be192a24175D795e1b07", signer)
  // const fastPriceEvents = await deployContract("FastPriceEvents", [])

  const chainlinkFlags = { address: "0x3C14e07Edd0dC67442FA96f1Ec6999c57E810a83" }

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter1,
    positionRouter2,
    chainlinkFlags,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}

async function getAvaxValues(signer) {
  const provider = new ethers.providers.JsonRpcProvider(AVAX_URL)
  const capKeeperWallet = new ethers.Wallet(AVAX_CAP_KEEPER_KEY).connect(provider)

  const { avax, btc, btcb, eth, mim, usdce, usdc } = tokens
  const tokenArr = [avax, btc, btcb, eth, mim, usdce, usdc]
  const fastPriceTokens = [avax, btc, btcb, eth]

  const priceFeedTimelock = { address: "0xCa8b5F2fF7B8d452bE8972B44Dc026Be96b97228" }

  const updater1 = { address: "0x2b249Bec7c3A142431b67e63A1dF86F974FAF3aa" }
  const updater2 = { address: "0x63ff41E44d68216e716d236E2ECdd5272611D835" }
  const keeper1 = { address: "0x5e0338CE6597FCB9404d69F4286194A60aD442b7" }
  const keeper2 = { address: "0x8CD98FF48831aa8864314ae8f41337FaE9941C8D" }
  const updaters = [updater1.address, updater2.address, keeper1.address, keeper2.address]

  const tokenManager = { address: "0x9bf98C09590CeE2Ec5F6256449754f1ba77d5aE5" }

  const positionRouter1 = await contractAt("PositionRouter", "0xffF6D276Bc37c61A23f06410Dce4A400f66420f8", capKeeperWallet)
  const positionRouter2 = await contractAt("PositionRouter", "0xffF6D276Bc37c61A23f06410Dce4A400f66420f8", capKeeperWallet)

  // const fastPriceEvents = await deployContract("FastPriceEvents", [])
  const fastPriceEvents = await contractAt("FastPriceEvents", "0x02b7023D43bc52bFf8a0C54A9F2ecec053523Bf6", signer)

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter1,
    positionRouter2,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}

async function getMumbaiValues() {
  // const provider = new ethers.providers.JsonRpcProvider(AVAX_URL)
  // const capKeeperWallet = new ethers.Wallet(AVAX_CAP_KEEPER_KEY).connect(provider)
  const capKeeperWallet = "0x2cA62Cf3F7D24A31D7125962b55809A61e05560a"

  const { btc, dai, eth } = tokens
  const tokenArr = [btc, dai, eth]
  const fastPriceTokens = [btc, dai, eth]

  const {  PRICE_FEED_TIME_LOCK, TOKEN_MANAGER, POSITION_ROUTER, VAULT_PRICE_FEED, POSITION_UTILS, FAST_PRICE_EVENT } = deployedAddress;

  const priceFeedTimelock = { address: PRICE_FEED_TIME_LOCK }

  const updater1 = { address: "0x3E5Cc534379e3887f42BB4B58d138DAC49d85324" } // Account 4
  const updater2 = { address: "0x484020c219a945aCb104184b026D58651dbF833a" } // Account 5
  const keeper1 = { address: "0x57755Cc5A51dA9A70fe87A8a1e13f5d93082b529" } // Account 6
  const keeper2 = { address: "0x4cdB4ACF8f801fa6B5D65dF7f59B641DBD143739" } // Account 7
  const updaters = [updater1.address, updater2.address, keeper1.address, keeper2.address]

  const tokenManager = { address: TOKEN_MANAGER }

  const positionRouter1 = await contractAt("PositionRouter", POSITION_ROUTER, null, {
    libraries: {
      PositionUtils: POSITION_UTILS
    }
  })
  const positionRouter2 = await contractAt("PositionRouter", POSITION_ROUTER, null, {
    libraries: {
      PositionUtils: POSITION_UTILS
    }
  })

  // const fastPriceEvents = await deployContract("FastPriceEvents", [])
  const fastPriceEvents = await contractAt("FastPriceEvents", FAST_PRICE_EVENT)

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter1,
    positionRouter2,
    tokenArr,
    updaters,
    priceFeedTimelock,
    VAULT_PRICE_FEED
  }
}

async function getValues(signer) {
  if (network === "arbitrum") {
    return getArbValues(signer)
  }

  if (network === "avax") {
    return getAvaxValues(signer)
  }

  if (network === "mumbai") {
    return getMumbaiValues()
  }
}

async function main() {
  // const signer = await getFrameSigner()
  const deployer = { address: "0x5F799f365Fa8A2B60ac0429C48B153cA5a6f0Cf8" }

  const {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter1,
    positionRouter2,
    chainlinkFlags,
    tokenArr,
    updaters,
    priceFeedTimelock,
    VAULT_PRICE_FEED
  } = await getValues()

  const signers = [
    "0x3E5Cc534379e3887f42BB4B58d138DAC49d85324", // Account 4
    "0x484020c219a945aCb104184b026D58651dbF833a", // Account 5
    "0x57755Cc5A51dA9A70fe87A8a1e13f5d93082b529", // Account 6
    "0x4cdB4ACF8f801fa6B5D65dF7f59B641DBD143739", // Account 7
    "0x9d08f124583DaF11E8AAe84fAbB492eb48CFEd53", // Account 8
    "0x45A16D04E4771c713844f9AF95Bd1aF6ee845bD1", // Account 9
    "0xEd1973F50129f3735Ffb6650c71474ae868ce6D8", // Account 10
    "0xa8b7EB755181131e68AdDB47837B5D6dE1A8E041", // Account 11
    "0x04a8E7D5CE11361E06a777577E6BCBA58b238Ad4" // Account 12
  ]

  if (fastPriceTokens.find(t => !t.fastPricePrecision)) {
    throw new Error("Invalid price precision")
  }

  if (fastPriceTokens.find(t => !t.maxCumulativeDeltaDiff)) {
    throw new Error("Invalid price maxCumulativeDeltaDiff")
  }

  // const secondaryPriceFeed = await deployContract("FastPriceFeed", [
  //   5 * 60, // _priceDuration
  //   60 * 60, // _maxPriceUpdateDelay
  //   1, // _minBlockInterval
  //   250, // _maxDeviationBasisPoints
  //   fastPriceEvents.address, // _fastPriceEvents
  //   deployer.address // _tokenManager
  // ], "SecondaryPriceFeed")
  const SecondaryPriceFeed_address = "0x22E38bE1016378CDcb0dEad91dc37C84C26152D6";
  const secondaryPriceFeed = await contractAt("FastPriceFeed", SecondaryPriceFeed_address);

  let vaultPriceFeed

  if(VAULT_PRICE_FEED) {
    vaultPriceFeed = await contractAt("VaultPriceFeed", VAULT_PRICE_FEED)
  } else {
    vaultPriceFeed = await deployContract("VaultPriceFeed", [], "VaultPriceFeed")
  }

  // await sendTxn(vaultPriceFeed.setMaxStrictPriceDeviation(expandDecimals(1, 28)), "vaultPriceFeed.setMaxStrictPriceDeviation") // 0.01 USD
  // await sendTxn(vaultPriceFeed.setPriceSampleSpace(1), "vaultPriceFeed.setPriceSampleSpace")
  // await sendTxn(vaultPriceFeed.setSecondaryPriceFeed(secondaryPriceFeed.address), "vaultPriceFeed.setSecondaryPriceFeed")
  // await sendTxn(vaultPriceFeed.setIsAmmEnabled(false), "vaultPriceFeed.setIsAmmEnabled")

  // if (chainlinkFlags) {
  //   await sendTxn(vaultPriceFeed.setChainlinkFlags(chainlinkFlags.address), "vaultPriceFeed.setChainlinkFlags")
  // }

  // for (const [i, tokenItem] of tokenArr.entries()) {
  //   if (tokenItem.spreadBasisPoints === undefined) { continue }
  //   await sendTxn(vaultPriceFeed.setSpreadBasisPoints(
  //     tokenItem.address, // _token
  //     tokenItem.spreadBasisPoints // _spreadBasisPoints
  //   ), `vaultPriceFeed.setSpreadBasisPoints(${tokenItem.name}) ${tokenItem.spreadBasisPoints}`)
  // }

  // for (const token of tokenArr) {
  //   await sendTxn(vaultPriceFeed.setTokenConfig(
  //     token.address, // _token
  //     token.priceFeed, // _priceFeed
  //     token.priceDecimals, // _priceDecimals
  //     token.isStrictStable // _isStrictStable
  //   ), `vaultPriceFeed.setTokenConfig(${token.name}) ${token.address} ${token.priceFeed}`)
  // }

  // await sendTxn(secondaryPriceFeed.initialize(1, signers, updaters), "secondaryPriceFeed.initialize")
  // await sendTxn(secondaryPriceFeed.setTokens(fastPriceTokens.map(t => t.address), fastPriceTokens.map(t => t.fastPricePrecision)), "secondaryPriceFeed.setTokens")
  // await sendTxn(secondaryPriceFeed.setVaultPriceFeed(vaultPriceFeed.address), "secondaryPriceFeed.setVaultPriceFeed")
  // await sendTxn(secondaryPriceFeed.setMaxTimeDeviation(60 * 60), "secondaryPriceFeed.setMaxTimeDeviation")
  // await sendTxn(secondaryPriceFeed.setSpreadBasisPointsIfInactive(50), "secondaryPriceFeed.setSpreadBasisPointsIfInactive")
  // await sendTxn(secondaryPriceFeed.setSpreadBasisPointsIfChainError(500), "secondaryPriceFeed.setSpreadBasisPointsIfChainError")
  ////// not done
  console.log(fastPriceTokens.map(t => t.address), fastPriceTokens.map(t => t.maxCumulativeDeltaDiff));
  await sendTxn(secondaryPriceFeed.setMaxCumulativeDeltaDiffs(fastPriceTokens.map(t => t.address), fastPriceTokens.map(t => t.maxCumulativeDeltaDiff)), "secondaryPriceFeed.setMaxCumulativeDeltaDiffs")
  await sendTxn(secondaryPriceFeed.setPriceDataInterval(1 * 60), "secondaryPriceFeed.setPriceDataInterval")

  await sendTxn(positionRouter1.setPositionKeeper(secondaryPriceFeed.address, true), "positionRouter.setPositionKeeper(secondaryPriceFeed)")
  await sendTxn(positionRouter2.setPositionKeeper(secondaryPriceFeed.address, true), "positionRouter.setPositionKeeper(secondaryPriceFeed)")
  await sendTxn(fastPriceEvents.setIsPriceFeed(secondaryPriceFeed.address, true), "fastPriceEvents.setIsPriceFeed")

  await sendTxn(vaultPriceFeed.setGov(priceFeedTimelock.address), "vaultPriceFeed.setGov")
  await sendTxn(secondaryPriceFeed.setGov(priceFeedTimelock.address), "secondaryPriceFeed.setGov")
  await sendTxn(secondaryPriceFeed.setTokenManager(tokenManager.address), "secondaryPriceFeed.setTokenManager")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
