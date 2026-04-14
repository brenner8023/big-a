function calculateFundFlow(data) {
  const results = []

  for (let i = 0; i < data.length; i++) {
    const volume = data[i][6]
    const high = data[i][2]
    const low = data[i][3]
    const close = data[i][4]
    const open = data[i][1]

    // VAR1 = VOL / ((HIGH-LOW)*2 - ABS(CLOSE-OPEN))
    const var1 = volume / ((high - low) * 2 - Math.abs(close - open))

    // VAR2 calculation
    let var2
    if (close > open) {
      var2 = var1 * (high - low)
    } else if (close < open) {
      var2 = var1 * (high - open + (close - low))
    } else {
      var2 = volume / 2
    }

    // VAR3 calculation
    let var3
    if (close > open) {
      var3 = -var1 * (high - close + (open - low))
    } else if (close < open) {
      var3 = -var1 * (high - low)
    } else {
      var3 = -volume / 2
    }

    // 净流入
    const netFlow = var2 + var3

    // 资金入
    const moneyIn = netFlow > 0 ? netFlow : 0

    // 资金出
    const moneyOut = netFlow < 0 ? -netFlow : 0

    results.push({
      date: data[i][0],
      var1,
      var2,
      var3,
      netFlow,
      moneyIn,
      moneyOut,
    })
  }

  // 计算资金入20和资金出20
  for (let i = 0; i < results.length; i++) {
    let moneyIn20 = 0
    let moneyOut20 = 0

    // 计算前20天的累加
    for (let j = Math.max(0, i - 19); j <= i; j++) {
      moneyIn20 += results[j].moneyIn
      moneyOut20 += results[j].moneyOut
    }

    // 红肥
    const redFat = moneyIn20 > 1.2 * moneyOut20

    results[i].moneyIn20 = moneyIn20
    results[i].moneyOut20 = moneyOut20
    results[i].redFat = redFat
  }

  return results
}

module.exports = calculateFundFlow
