const { deployContract, contractAt , sendTxn, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'goerli');
const tokens = require('./tokens')[network];
const deployedAddress = require('../deployedAddresses')[network];

async function main() {
  const { nativeToken } = tokens
  const { ROUTER, VAULT, USDG } = deployedAddress

  const orderBook = await deployContract("OrderBook", []);

  // Arbitrum mainnet addresses
  await sendTxn(orderBook.initialize(
    ROUTER, // router
    VAULT, // vault
    nativeToken.address, // weth
    USDG, // usdg
    "10000000000000000", // 0.01 AVAX
    expandDecimals(10, 30) // min purchase token amount usd
  ), "orderBook.initialize");

  writeTmpAddresses({
    orderBook: orderBook.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
