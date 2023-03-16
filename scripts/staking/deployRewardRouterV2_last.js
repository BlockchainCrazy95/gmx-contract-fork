const { deployContract, contractAt, sendTxn, writeTmpAddresses } = require("../shared/helpers")

const network = (process.env.HARDHAT_NETWORK || 'goerli');
const tokens = require('../core/tokens')[network];
const deployedAddress = require('../deployedAddresses')[network];

async function main() {
  const { nativeToken } = tokens
  const { GMX, GLP, GLP_MANAGER, ESGMX } = deployedAddress

  const vestingDuration = 365 * 24 * 60 * 60
  const rewardRouter_address = "0xfb1f2B71E6778e1a5555dcA344A216774EB02a19";
  const stakedGmxTracker_address = "0x7896102e2ddFE372f8Dc5966C7637C91BFEB98e8";
  const bonusGmxTracker_address = "0x74529B6c90b50Fcbd4bB4140129C5A4FeD20a888";
  const bonusGmxDistributor_address = "0x12E89167f1117d42Cb78c08E4182764f45C29645";
  const feeGmxTracker_address = "0x78d0aeA2fEfd2d406821b525A0c16ed51965EC0F";
  const bnGmx_address = "0x97017e2441725f1cBae9317bbcf22bA8d94d6AAF";
  const feeGlpTracker_address = "0x3B0028ba191b80880a7C6010973e4DE439AaD03b";
  const stakedGlpTracker_address = "0xDEd0DA75B65Aa0170cC9310625AFE2b4215e9A04";
  const gmxVester_address = "0x2d3b66B20E717E0fDEB3D8B40f90a291Aa9cd32c";
  const glpVester_address = "0xB073e3c92bEC4B048a4814d44a6A92a56Fc116fd";
  const stakedGmxDistributor_address = "0xC0d218eAF562809a6131E15bE1676a3767204541";
  const stakedGlpDistributor_address = "0xBd68857023e87490E834E1eC05e1390e0c4BE7ad";

  const glp = await contractAt("GLP", GLP)
  const rewardRouter = await contractAt("RewardRouterV2", rewardRouter_address);
  const glpManager = await contractAt("GlpManager", GLP_MANAGER);
  const stakedGmxTracker = await contractAt("RewardTracker", "0x7896102e2ddFE372f8Dc5966C7637C91BFEB98e8");
  const bonusGmxTracker = await contractAt("RewardTracker", bonusGmxTracker_address);
  const bonusGmxDistributor = await contractAt("BonusDistributor", bonusGmxDistributor_address);
  const feeGmxTracker = await contractAt("RewardTracker", feeGmxTracker_address);
  const esGmx = await contractAt("EsGMX", ESGMX);
  const bnGmx = await contractAt("MintableBaseToken", bnGmx_address);
  const feeGlpTracker = await contractAt("RewardTracker", feeGlpTracker_address);
  const stakedGlpTracker = await contractAt("RewardTracker", stakedGlpTracker_address);
  const gmxVester = await contractAt("Vester", gmxVester_address);
  const glpVester = await contractAt("Vester", glpVester_address);
  /////// here
  // await sendTxn(glpManager.setHandler(rewardRouter.address, true), "glpManager.setHandler(rewardRouter)")

  // // allow rewardRouter to stake in stakedGmxTracker
  // await sendTxn(stakedGmxTracker.setHandler(rewardRouter.address, true), "stakedGmxTracker.setHandler(rewardRouter)")
  // // allow bonusGmxTracker to stake stakedGmxTracker
  // await sendTxn(stakedGmxTracker.setHandler(bonusGmxTracker.address, true), "stakedGmxTracker.setHandler(bonusGmxTracker)")
  // // allow rewardRouter to stake in bonusGmxTracker
  // await sendTxn(bonusGmxTracker.setHandler(rewardRouter.address, true), "bonusGmxTracker.setHandler(rewardRouter)")
  // // allow bonusGmxTracker to stake feeGmxTracker
  // await sendTxn(bonusGmxTracker.setHandler(feeGmxTracker.address, true), "bonusGmxTracker.setHandler(feeGmxTracker)")
  // await sendTxn(bonusGmxDistributor.setBonusMultiplier(10000), "bonusGmxDistributor.setBonusMultiplier")
  // // allow rewardRouter to stake in feeGmxTracker
  // await sendTxn(feeGmxTracker.setHandler(rewardRouter.address, true), "feeGmxTracker.setHandler(rewardRouter)")
  // // allow stakedGmxTracker to stake esGmx
  // await sendTxn(esGmx.setHandler(stakedGmxTracker.address, true), "esGmx.setHandler(stakedGmxTracker)")
  // // allow feeGmxTracker to stake bnGmx
  // await sendTxn(bnGmx.setHandler(feeGmxTracker.address, true), "bnGmx.setHandler(feeGmxTracker")
  // // allow rewardRouter to burn bnGmx
  // await sendTxn(bnGmx.setMinter(rewardRouter.address, true), "bnGmx.setMinter(rewardRouter")

  // // allow stakedGlpTracker to stake feeGlpTracker
  // await sendTxn(feeGlpTracker.setHandler(stakedGlpTracker.address, true), "feeGlpTracker.setHandler(stakedGlpTracker)")
  // // allow feeGlpTracker to stake glp
  // await sendTxn(glp.setHandler(feeGlpTracker.address, true), "glp.setHandler(feeGlpTracker)")

  // // allow rewardRouter to stake in feeGlpTracker
  // await sendTxn(feeGlpTracker.setHandler(rewardRouter.address, true), "feeGlpTracker.setHandler(rewardRouter)")
  // // allow rewardRouter to stake in stakedGlpTracker
  // await sendTxn(stakedGlpTracker.setHandler(rewardRouter.address, true), "stakedGlpTracker.setHandler(rewardRouter)")

  // await sendTxn(esGmx.setHandler(rewardRouter.address, true), "esGmx.setHandler(rewardRouter)")
  // await sendTxn(esGmx.setHandler(stakedGmxDistributor_address, true), "esGmx.setHandler(stakedGmxDistributor)")
  await sendTxn(esGmx.setHandler(stakedGlpDistributor_address, true), "esGmx.setHandler(stakedGlpDistributor)")
  await sendTxn(esGmx.setHandler(stakedGlpTracker.address, true), "esGmx.setHandler(stakedGlpTracker)")
  await sendTxn(esGmx.setHandler(gmxVester.address, true), "esGmx.setHandler(gmxVester)")
  await sendTxn(esGmx.setHandler(glpVester.address, true), "esGmx.setHandler(glpVester)")

  await sendTxn(esGmx.setMinter(gmxVester.address, true), "esGmx.setMinter(gmxVester)")
  await sendTxn(esGmx.setMinter(glpVester.address, true), "esGmx.setMinter(glpVester)")

  await sendTxn(gmxVester.setHandler(rewardRouter.address, true), "gmxVester.setHandler(rewardRouter)")
  await sendTxn(glpVester.setHandler(rewardRouter.address, true), "glpVester.setHandler(rewardRouter)")

  await sendTxn(feeGmxTracker.setHandler(gmxVester.address, true), "feeGmxTracker.setHandler(gmxVester)")
  await sendTxn(stakedGlpTracker.setHandler(glpVester.address, true), "stakedGlpTracker.setHandler(glpVester)")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
