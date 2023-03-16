const { deployContract, contractAt, writeTmpAddresses, sendTxn } = require("../shared/helpers")

async function main() {
  const tokenManager = await deployContract("TokenManager", [4], "TokenManager")

  const signers = [
    "0xaEC25A9e0D64b3CafEb256C2942d00013ad6437c", // Account 2
    "0xf235710D1A70272a274DA1c3146F16302219C6d3", // Account 3
    "0x3E5Cc534379e3887f42BB4B58d138DAC49d85324", // Account 4
    "0x484020c219a945aCb104184b026D58651dbF833a", // Account 5
    "0x57755Cc5A51dA9A70fe87A8a1e13f5d93082b529", // Account 6
  ]

  await sendTxn(tokenManager.initialize(signers), "tokenManager.initialize")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
