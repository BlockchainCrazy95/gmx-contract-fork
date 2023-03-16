const { deployContract, contractAt, sendTxn, getFrameSigner } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'goerli');

async function getArbValues() {
  const tokenManager = { address: "0xddDc546e07f1374A07b270b7d863371e575EA96A" }

  return { tokenManager }
}

async function getAvaxValues() {
  const tokenManager = { address: "0x8b25Ba1cAEAFaB8e9926fabCfB6123782e3B4BC2" }

  return { tokenManager }
}

async function getMumbaiValues() {
  const tokenManager = { address: "0xb13DAE716771285317dAd37DCD22DFa7bC25808E" }

  return { tokenManager }
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
  // const signer = await getFrameSigner()

  const admin = "0x2cA62Cf3F7D24A31D7125962b55809A61e05560a"
  const buffer = 24 * 60 * 60

  const { tokenManager } = await getValues()

  const timelock = await deployContract("PriceFeedTimelock", [
    admin,
    buffer,
    tokenManager.address
  ], "Timelock")

  const deployedTimelock = await contractAt("PriceFeedTimelock", timelock.address)

  const signers = [
    "0x3E5Cc534379e3887f42BB4B58d138DAC49d85324", // Account 4
    "0x484020c219a945aCb104184b026D58651dbF833a", // Account 5
    "0x57755Cc5A51dA9A70fe87A8a1e13f5d93082b529", // Account 6
    "0x4cdB4ACF8f801fa6B5D65dF7f59B641DBD143739", // Account 7
    "0x9d08f124583DaF11E8AAe84fAbB492eb48CFEd53" // Account 8
  ]

  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i]
    await sendTxn(deployedTimelock.setContractHandler(signer, true), `deployedTimelock.setContractHandler(${signer})`)
  }

  const keepers = [
    "0x45A16D04E4771c713844f9AF95Bd1aF6ee845bD1" // Account 9
  ]

  for (let i = 0; i < keepers.length; i++) {
    const keeper = keepers[i]
    await sendTxn(deployedTimelock.setKeeper(keeper, true), `deployedTimelock.setKeeper(${keeper})`)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
