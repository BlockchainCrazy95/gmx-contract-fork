const { getFrameSigner, deployContract, contractAt, sendTxn, readTmpAddresses, callWithRetries } = require("../shared/helpers")
const { bigNumberify, expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'goerli');
const tokens = require('./tokens')[network];
const deployedAddress = require('../deployedAddresses')[network];

async function getArbValues() {
  const vault = await contractAt("Vault", "0x489ee077994B6658eAfA855C308275EAd8097C4A")
  const vaultPriceFeed = await contractAt("VaultPriceFeed", await vault.priceFeed())
  // const vaultPriceFeed = await contractAt("VaultPriceFeed", "0xfe661cbf27Da0656B7A1151a761ff194849C387A")

  const { btc, eth, usdc, link, uni, usdt, mim, frax, dai } = tokens
  const fastPriceTokens = [btc, eth, link, uni]

  return { vaultPriceFeed, fastPriceTokens }
}

async function getAvaxValues() {
  const vault = await contractAt("Vault", "0x9ab2De34A33fB459b538c43f251eB825645e8595")
  const vaultPriceFeed = await contractAt("VaultPriceFeed", await vault.priceFeed())
  // const vaultPriceFeed = await contractAt("VaultPriceFeed", "0x205646B93B9D8070e15bc113449586875Ed7288E")

  const { avax, btc, btcb, eth, mim, usdce, usdc } = tokens
  const fastPriceTokens = [avax, btc, btcb, eth]

  return { vaultPriceFeed, fastPriceTokens }
}

async function getMumbaiValues() {
  const { VAULT } = deployedAddress
  const vault = await contractAt("Vault", VAULT)
  const vaultPriceFeed = await contractAt("VaultPriceFeed", await vault.priceFeed())
  // const vaultPriceFeed = await contractAt("VaultPriceFeed", "0x205646B93B9D8070e15bc113449586875Ed7288E")

  const { btc, eth, dai } = tokens
  const fastPriceTokens = [btc, eth, dai]

  return { vault, vaultPriceFeed, fastPriceTokens }
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }

  if (network === "avax") {
    return getAvaxValues()
  }

  if (network === "mumbai") {
    return getMumbaiValues()
  }
}

async function main() {
  const { vault, vaultPriceFeed } = await getValues()
  // const secondaryPriceFeed = await contractAt("FastPriceFeed", await vaultPriceFeed.secondaryPriceFeed())

  const priceFeedConfig = [
    { 
      label: "BTC/USD",
      token: "0x0d787a4a1548f673ed375445535a6c7A1EE56180", // BTC
      priceFeed: "0x007A22900a3B98143368Bd5906f8E17e9867581b", // BTC/USD Feed
      priceDecimals: 8,
      isStrictStable: false
    },
    { 
      label: "DAI/USD",
      token: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F", // DAI
      priceFeed: "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046", // DAI/USD Feed
      priceDecimals: 8,
      isStrictStable: true
    },
    { 
      label: "ETH/USD",
      token: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa", // ETH
      priceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A", // ETH/USD Feed
      priceDecimals: 8,
      isStrictStable: false
    }
  ]

  const vaultTokenConfig = [
    {
      label: "BTC",
      token: "0x0d787a4a1548f673ed375445535a6c7A1EE56180", // BTC
      tokenDecimals: 18,
      tokenWeight: 25000,
      minProfitBps: 150,
      maxUsdgAmount: 50000000,
      isStable: false,
      isShortable: true
    },
    {
      label: "DAI",
      token: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F", // DAI
      tokenDecimals: 18,
      tokenWeight: 25000,
      minProfitBps: 150,
      maxUsdgAmount: 50000000,
      isStable: true,
      isShortable: false
    },
    {
      label: "ETH",
      token: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa", // ETH
      tokenDecimals: 18,
      tokenWeight: 15000,
      minProfitBps: 150,
      maxUsdgAmount: 30000000,
      isStable: false,
      isShortable: true
    }
  ]
  

  // console.log("vaultPriceFeedContract", vaultPriceFeedContract.address)
  // console.log("setMaxDeviationBasisPoints", 1000)
  // console.log("setPriceDataInterval", 1 * 60)
  // console.log("setMaxCumulativeDeltaDiffs")
  // console.log("[", fastPriceTokens.map(t => `"${t.address}"`).join(",\n"), "]")
  // console.log("[", fastPriceTokens.map(t => t.maxCumulativeDeltaDiff).join(",\n"), "]")
  
  
  // for(let i = 0;i<priceFeedConfig.length;i ++) {
  //   console.log(priceFeedConfig[i]);
  //   await sendTxn(vaultPriceFeed.setTokenConfig(
  //     priceFeedConfig[i].token,
  //     priceFeedConfig[i].priceFeed,
  //     priceFeedConfig[i].priceDecimals,
  //     priceFeedConfig[i].isStrictStable,
  //   ), "VaultPriceFeed.setTokenConfig(" + priceFeedConfig[i].label + ")")
  // }

  for(let i = 0;i<vaultTokenConfig.length;i ++) {
    console.log(vaultTokenConfig[i]);
    await sendTxn(vault.setTokenConfig(
      vaultTokenConfig[i].token,
      vaultTokenConfig[i].tokenDecimals,
      vaultTokenConfig[i].tokenWeight,
      vaultTokenConfig[i].minProfitBps,
      vaultTokenConfig[i].maxUsdgAmount,
      vaultTokenConfig[i].isStable,
      vaultTokenConfig[i].isStrictStable
    ), "Vault.setTokenConfig(" + vaultTokenConfig[i].label+")")
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
