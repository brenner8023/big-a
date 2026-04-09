function calculateFundFlow(data) {
  const results = []

  for (let i = 0; i < data.length; i++) {
    const { volume, high, low, close, open } = data[i]

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
      date: data[i].date,
      var1,
      var2,
      var3,
      netFlow,
      moneyIn,
      moneyOut,
    })
  }

  // 计算资金入30和资金出30
  for (let i = 0; i < results.length; i++) {
    let moneyIn30 = 0
    let moneyOut30 = 0

    // 计算前30天的累加
    for (let j = Math.max(0, i - 29); j <= i; j++) {
      moneyIn30 += results[j].moneyIn
      moneyOut30 += results[j].moneyOut
    }

    // 红肥
    const redFat = moneyIn30 > 1.2 * moneyOut30

    results[i].moneyIn30 = moneyIn30
    results[i].moneyOut30 = moneyOut30
    results[i].redFat = redFat
  }

  return results
}

// 示例用法
/*
const sampleData = [
  { date: '2023-01-01', open: 100, high: 110, low: 95, close: 105, volume: 1000000 },
  { date: '2023-01-02', open: 105, high: 115, low: 100, close: 110, volume: 1200000 },
  // 更多数据...
];

const result = calculateFundFlow(sampleData);
console.log(result);
*/

export default calculateFundFlow
