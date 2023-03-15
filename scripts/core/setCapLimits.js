const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const {
  ARBITRUM_SERVER_CONFIG_ADMIN_KEY,
  ARBITRUM_SERVER_URL,
  AVAX_SERVER_CONFIG_ADMIN_KEY,
  AVAX_SERVER_URL,
} = require("../../env.json")

const network = (process.env.HARDHAT_NETWORK || 'goerli');
const tokens = require('./tokens')[network];

async function getArbValues() {
  const apiKey = ARBITRUM_SERVER_CONFIG_ADMIN_KEY
  const capLimitUrl = ARBITRUM_SERVER_URL + "/cap_limits"

  const { btc, eth, link, uni } = tokens
  const tokenArr = [btc, eth, link, uni]

  return { apiKey, capLimitUrl, tokenArr }
}

async function getAvaxValues() {
  const apiKey = AVAX_SERVER_CONFIG_ADMIN_KEY
  const capLimitUrl = AVAX_SERVER_URL + "/cap_limits"

  const { avax, eth, btc, btcb } = tokens
  const tokenArr = [avax, eth, btc, btcb]

  return { apiKey, capLimitUrl, tokenArr }
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }

  if (network === "avax") {
    return getAvaxValues()
  }
}

async function postFees({ apiKey, feeUrl, feeUsd, timestamp }) {
  timestamp = parseInt(timestamp)

  if (isNaN(timestamp)) {
    throw new Error("Invalid timestamp")
  }

  const id = (parseInt(timestamp / SECONDS_PER_DAY) * SECONDS_PER_DAY).toString()
  feeUsd = parseInt(feeUsd.replaceAll(",", ""))

  if (isNaN(feeUsd)) {
    throw new Error("Invalid feeUsd")
  }

  const body = JSON.stringify({
    key: apiKey,
    id,
    timestamp,
    feeUsd
  })

  console.log("sending update", { id, timestamp, feeUsd })
  const result = await fetch(feeUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body
  })

  const resultContent = await result.text()
  console.log("result", result.status, resultContent)
}

async function main() {
  const { apiKey, capLimitUrl, tokenArr } = await getValues()

  for (let i = 0; i < tokenArr.length; i++) {
    const token = tokenArr[i]

    const body = JSON.stringify({
      key: apiKey,
      token: token.address,
      openInterestLimitLong: token.openInterestLimitLong,
      openInterestLimitShort: token.openInterestLimitShort,
    })

    const result = await fetch(capLimitUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body
    })

    const resultContent = await result.text()
    console.log(token.name, result.status, resultContent)
  }
}

main()

module.exports = {
  postFees
}
