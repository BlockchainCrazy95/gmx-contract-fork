const { deployContract, contractAt, sendTxn, getFrameSigner } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'goerli');
const deployedAddress = require("../deployedAddresses")[network];

async function getArbValues() {
  const vault = await contractAt("Vault", "0x489ee077994B6658eAfA855C308275EAd8097C4A")
  const tokenManager = { address: "0xddDc546e07f1374A07b270b7d863371e575EA96A" }
  const glpManager = { address: "0x3963FfC9dff443c2A94f21b129D429891E32ec18" }
  const rewardRouter = { address: "0xB95DB5B167D75e6d04227CfFFA61069348d271F5" }

  const positionRouter = { address: "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868" }
  const positionManager = { address: "0x75E42e6f01baf1D6022bEa862A28774a9f8a4A0C" }
  const gmx = { address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a" }

  return { vault, tokenManager, glpManager, rewardRouter, positionRouter, positionManager, gmx }
}

async function getAvaxValues() {
  const vault = await contractAt("Vault", "0x9ab2De34A33fB459b538c43f251eB825645e8595")
  const tokenManager = { address: "0x8b25Ba1cAEAFaB8e9926fabCfB6123782e3B4BC2" }
  const glpManager = { address: "0xD152c7F25db7F4B95b7658323c5F33d176818EE4" }
  const rewardRouter = { address: "0xB70B91CE0771d3f4c81D87660f71Da31d48eB3B3" }

  const positionRouter = { address: "0xffF6D276Bc37c61A23f06410Dce4A400f66420f8" }
  const positionManager = { address: "0xA21B83E579f4315951bA658654c371520BDcB866" }
  const gmx = { address: "0x62edc0692BD897D2295872a9FFCac5425011c661" }

  return { vault, tokenManager, glpManager, rewardRouter, positionRouter, positionManager, gmx }
}

async function getMumbaiValues() {
  const { VAULT, TOKEN_MANAGER, GLP_MANAGER, GMX, REWARD_ROUTER_V2, POSITION_ROUTER, POSITION_MANAGER } = deployedAddress
  const vault = await contractAt("Vault", VAULT)
  const tokenManager = { address: TOKEN_MANAGER }
  const glpManager = { address: GLP_MANAGER }
  const rewardRouter = { address: REWARD_ROUTER_V2 }

  const positionRouter = { address: POSITION_ROUTER }
  const positionManager = { address: POSITION_MANAGER }
  const gmx = { address: GMX }

  return { vault, tokenManager, glpManager, rewardRouter, positionRouter, positionManager, gmx }
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

  // mumbai
  const admin = "0x2cA62Cf3F7D24A31D7125962b55809A61e05560a"
  const buffer = 24 * 60 * 60
  const maxTokenSupply = expandDecimals("13250000", 18)

  const { vault, tokenManager, glpManager, rewardRouter, positionRouter, positionManager, gmx } = await getValues()
  const mintReceiver = tokenManager

  const timelock = await deployContract("Timelock", [
    admin, // admin
    buffer, // buffer
    tokenManager.address, // tokenManager
    mintReceiver.address, // mintReceiver
    glpManager.address, // glpManager
    rewardRouter.address, // rewardRouter
    maxTokenSupply, // maxTokenSupply
    10, // marginFeeBasisPoints 0.1%
    500 // maxMarginFeeBasisPoints 5%
  ], "Timelock")

  ////////// from here: after positionManager, positionRouter
  // const deployedTimelock = await contractAt("Timelock", timelock.address, signer)

  // await sendTxn(deployedTimelock.setShouldToggleIsLeverageEnabled(true), "deployedTimelock.setShouldToggleIsLeverageEnabled(true)")
  // await sendTxn(deployedTimelock.setContractHandler(positionRouter.address, true), "deployedTimelock.setContractHandler(positionRouter)")
  // await sendTxn(deployedTimelock.setContractHandler(positionManager.address, true), "deployedTimelock.setContractHandler(positionManager)")

  // // // update gov of vault
  // // const vaultGov = await contractAt("Timelock", await vault.gov(), signer)

  // // await sendTxn(vaultGov.signalSetGov(vault.address, deployedTimelock.address), "vaultGov.signalSetGov")
  // // await sendTxn(deployedTimelock.signalSetGov(vault.address, vaultGov.address), "deployedTimelock.signalSetGov(vault)")

  // const handlers = [
  //   "0xaEC25A9e0D64b3CafEb256C2942d00013ad6437c", // Account 2
  //   "0xf235710D1A70272a274DA1c3146F16302219C6d3", // Account 3
  //   "0x3E5Cc534379e3887f42BB4B58d138DAC49d85324", // Account 4
  //   "0x484020c219a945aCb104184b026D58651dbF833a", // Account 5
  //   "0x57755Cc5A51dA9A70fe87A8a1e13f5d93082b529", // Account 6
  // ]

  // for (let i = 0; i < handlers.length; i++) {
  //   const handler = handlers[i]
  //   await sendTxn(deployedTimelock.setContractHandler(handler, true), `deployedTimelock.setContractHandler(${handler})`)
  // }

  // const keepers = [
  //   "0x4cdB4ACF8f801fa6B5D65dF7f59B641DBD143739" // Account 7
  // ]

  // for (let i = 0; i < keepers.length; i++) {
  //   const keeper = keepers[i]
  //   await sendTxn(deployedTimelock.setKeeper(keeper, true), `deployedTimelock.setKeeper(${keeper})`)
  // }

  // await sendTxn(deployedTimelock.signalApprove(gmx.address, admin, "1000000000000000000"), "deployedTimelock.signalApprove")
  ////////// to here
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
