/**
 * https://fund.eastmoney.com/data/fundsearch.html?spm=search&key=%E9%87%8F%E5%8C%96#key%E9%87%8F%E5%8C%96
 *
 *
let result = []
let aList = Array.from(document.querySelectorAll('#jj tr a')).filter($a => $a.title.includes('量化')).map($a => ({ url: $a.href, name: $a.title.replace(/[AC]$/, '') }))
aList.forEach(item => {
    if (result.every(subItem => item.name !== subItem.name)) {
        result.push(item)
    }
})
console.log(result)
 */

exports.FUND_LIST = [
  {
    url: 'http://fund.eastmoney.com/519983.html',
    name: '长信量化先锋混合',
  },
  {
    url: 'http://fund.eastmoney.com/001917.html',
    name: '招商量化精选股票',
  },
  {
    url: 'http://fund.eastmoney.com/001421.html',
    name: '南方量化成长股票',
  },
  {
    url: 'http://fund.eastmoney.com/398041.html',
    name: '中海量化策略混合',
  },
  {
    url: 'http://fund.eastmoney.com/008960.html',
    name: '长信国防军工量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/001974.html',
    name: '景顺长城量化新动力股票',
  },
  {
    url: 'http://fund.eastmoney.com/001291.html',
    name: '大摩量化多策略股票',
  },
  {
    url: 'http://fund.eastmoney.com/001244.html',
    name: '华泰柏瑞量化智慧混合',
  },
  {
    url: 'http://fund.eastmoney.com/016858.html',
    name: '国金量化多因子股票',
  },
  {
    url: 'http://fund.eastmoney.com/014805.html',
    name: '国金量化精选混合',
  },
  {
    url: 'http://fund.eastmoney.com/005457.html',
    name: '景顺长城量化小盘股票',
  },
  {
    url: 'http://fund.eastmoney.com/005235.html',
    name: '银华食品饮料量化股票发起式',
  },
  {
    url: 'http://fund.eastmoney.com/005225.html',
    name: '广发量化多因子混合',
  },
  {
    url: 'http://fund.eastmoney.com/519965.html',
    name: '长信量化多策略股票',
  },
  {
    url: 'http://fund.eastmoney.com/481017.html',
    name: '工银量化策略混合',
  },
  {
    url: 'http://fund.eastmoney.com/000753.html',
    name: '华宝量化对冲混合',
  },
  {
    url: 'http://fund.eastmoney.com/007903.html',
    name: '长城量化小盘股票',
  },
  {
    url: 'http://fund.eastmoney.com/002804.html',
    name: '华泰柏瑞量化对冲',
  },
  {
    url: 'http://fund.eastmoney.com/016702.html',
    name: '银华海外数字经济量化选股混合发起式(QDII)',
  },
  {
    url: 'http://fund.eastmoney.com/012080.html',
    name: '易方达中证500指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/580007.html',
    name: '东吴安享量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/009840.html',
    name: '东财量化精选',
  },
  {
    url: 'http://fund.eastmoney.com/004641.html',
    name: '万家量化睿选混合',
  },
  {
    url: 'http://fund.eastmoney.com/161038.html',
    name: '富国新兴成长量化精选混合(LOF)',
  },
  {
    url: 'http://fund.eastmoney.com/011948.html',
    name: '东吴智慧医疗量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/016466.html',
    name: '国泰海通量化选股混合发起',
  },
  {
    url: 'http://fund.eastmoney.com/006926.html',
    name: '长城量化精选股票',
  },
  {
    url: 'http://fund.eastmoney.com/011228.html',
    name: '西部利得量化成长混合',
  },
  {
    url: 'http://fund.eastmoney.com/005437.html',
    name: '易方达易百智能量化策略',
  },
  {
    url: 'http://fund.eastmoney.com/005707.html',
    name: '富国港股通量化精选股票',
  },
  {
    url: 'http://fund.eastmoney.com/014135.html',
    name: '中欧金安量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/005269.html',
    name: '华泰柏瑞港股通量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/003070.html',
    name: '光大创业板量化优选',
  },
  {
    url: 'http://fund.eastmoney.com/005635.html',
    name: '博时量化多策略股票',
  },
  {
    url: 'http://fund.eastmoney.com/020902.html',
    name: '招商成长量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/013466.html',
    name: '博时智选量化多因子股票',
  },
  {
    url: 'http://fund.eastmoney.com/004250.html',
    name: '银河量化优选混合',
  },
  {
    url: 'http://fund.eastmoney.com/166109.html',
    name: '信澳量化先锋(LOF)',
  },
  {
    url: 'http://fund.eastmoney.com/005616.html',
    name: '东方量化成长灵活配置混合',
  },
  {
    url: 'http://fund.eastmoney.com/022754.html',
    name: '易方达科鑫量化选股股票发起式',
  },
  {
    url: 'http://fund.eastmoney.com/005114.html',
    name: '平安沪深300指数量化',
  },
  {
    url: 'http://fund.eastmoney.com/002217.html',
    name: '易方达量化策略',
  },
  {
    url: 'http://fund.eastmoney.com/005638.html',
    name: '农银汇理量化智慧动力混合',
  },
  {
    url: 'http://fund.eastmoney.com/004805.html',
    name: '长信消费精选量化股票',
  },
  {
    url: 'http://fund.eastmoney.com/015526.html',
    name: '大成动态量化配置策略混合',
  },
  {
    url: 'http://fund.eastmoney.com/021991.html',
    name: '中加专精特新量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/005600.html',
    name: '汇安量化优选灵活配置',
  },
  {
    url: 'http://fund.eastmoney.com/014996.html',
    name: '中欧量化先锋混合',
  },
  {
    url: 'http://fund.eastmoney.com/011411.html',
    name: '中信建投量化进取',
  },
  {
    url: 'http://fund.eastmoney.com/014702.html',
    name: '中欧量化动能混合',
  },
  {
    url: 'http://fund.eastmoney.com/010304.html',
    name: '华泰柏瑞量化创盈混合',
  },
  {
    url: 'http://fund.eastmoney.com/025657.html',
    name: '国金智远量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/004510.html',
    name: '九泰久盛量化先锋混合',
  },
  {
    url: 'http://fund.eastmoney.com/167702.html',
    name: '德邦量化优选股票(LOF)',
  },
  {
    url: 'http://fund.eastmoney.com/003865.html',
    name: '创金合信量化多因子股票',
  },
  {
    url: 'http://fund.eastmoney.com/007775.html',
    name: '汇安量化先锋混合',
  },
  {
    url: 'http://fund.eastmoney.com/017095.html',
    name: '易方达中证1000量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/005167.html',
    name: '嘉实润泽量化定期混合',
  },
  {
    url: 'http://fund.eastmoney.com/018130.html',
    name: '博时ESG量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/008838.html',
    name: '德邦量化对冲混合',
  },
  {
    url: 'http://fund.eastmoney.com/010120.html',
    name: '九泰久福量化股票',
  },
  {
    url: 'http://fund.eastmoney.com/006022.html',
    name: '富国大盘价值量化精选混合',
  },
  {
    url: 'http://fund.eastmoney.com/005399.html',
    name: '长信量化价值驱动混合',
  },
  {
    url: 'http://fund.eastmoney.com/018971.html',
    name: '富国致弘量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/005961.html',
    name: '博时量化价值股票',
  },
  {
    url: 'http://fund.eastmoney.com/016491.html',
    name: '华安事件驱动量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/021980.html',
    name: '兴全红利量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/019777.html',
    name: '鹏扬消费量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/005189.html',
    name: '海富通量化前锋股票',
  },
  {
    url: 'http://fund.eastmoney.com/024385.html',
    name: '国金红利量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/006878.html',
    name: '天治量化核心精选混合',
  },
  {
    url: 'http://fund.eastmoney.com/001789.html',
    name: '国泰量化收益灵活配置混合',
  },
  {
    url: 'http://fund.eastmoney.com/007528.html',
    name: '融通量化多策略混合',
  },
  {
    url: 'http://fund.eastmoney.com/166108.html',
    name: '信澳量化多因子混合(LOF)',
  },
  {
    url: 'http://fund.eastmoney.com/021757.html',
    name: '中欧沪深300指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/012879.html',
    name: '中信建投量化精选6个月持有混合',
  },
  {
    url: 'http://fund.eastmoney.com/011224.html',
    name: '九泰盈泰量化股票',
  },
  {
    url: 'http://fund.eastmoney.com/021571.html',
    name: '华夏红利量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/011500.html',
    name: '九泰量化新兴产业',
  },
  {
    url: 'http://fund.eastmoney.com/018963.html',
    name: '国泰海通量化选股混合发起D',
  },
  {
    url: 'http://fund.eastmoney.com/020769.html',
    name: '中信保诚国企红利量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/012911.html',
    name: '同泰沪深300量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/024858.html',
    name: '天弘创业板指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/010138.html',
    name: '华泰柏瑞量化创享混合',
  },
  {
    url: 'http://fund.eastmoney.com/008077.html',
    name: '九泰天奕量化价值混合',
  },
  {
    url: 'http://fund.eastmoney.com/025411.html',
    name: '安信红利量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/011108.html',
    name: '九泰天兴量化智选',
  },
  {
    url: 'http://fund.eastmoney.com/016048.html',
    name: '华商新量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/024901.html',
    name: '西部利得专精特新量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/002300.html',
    name: '长盛医疗量化股票',
  },
  {
    url: 'http://fund.eastmoney.com/011295.html',
    name: '中信保诚量化阿尔法股票',
  },
  {
    url: 'http://fund.eastmoney.com/002496.html',
    name: '前海开源量化优选',
  },
  {
    url: 'http://fund.eastmoney.com/020117.html',
    name: '南华丰元量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/026678.html',
    name: '恒越嘉润量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/002270.html',
    name: '东吴安盈量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/023366.html',
    name: '南华丰利量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/002449.html',
    name: '民生加银量化中国混合',
  },
  {
    url: 'http://fund.eastmoney.com/023106.html',
    name: '光大红利量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/002561.html',
    name: '东吴安鑫量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/020224.html',
    name: '创金合信均益量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/021919.html',
    name: '国泰海通红利量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/021975.html',
    name: '创金合信红利甄选量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/021984.html',
    name: '中信保诚红利领航量化股票',
  },
  {
    url: 'http://fund.eastmoney.com/021148.html',
    name: '财通华臻量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/022909.html',
    name: '国投瑞银中证500指数量化增强Y',
  },
  {
    url: 'http://fund.eastmoney.com/025014.html',
    name: '天弘中证500指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/013918.html',
    name: '申万菱信量化小盘股票(LOF)',
  },
  {
    url: 'http://fund.eastmoney.com/025480.html',
    name: '华夏沪深300指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/020923.html',
    name: '汇泉智享量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/025877.html',
    name: '易米远景量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/023313.html',
    name: '国泰聚鑫量化选股混合发起',
  },
  {
    url: 'http://fund.eastmoney.com/023130.html',
    name: '富国致盛量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/025711.html',
    name: '汇添富中证A500指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/026811.html',
    name: '天弘智航量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/020803.html',
    name: '东方红量化选股混合发起',
  },
  {
    url: 'http://fund.eastmoney.com/020816.html',
    name: '湘财红利量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/025486.html',
    name: '中邮新锐量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/026867.html',
    name: '广发汇智量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/020561.html',
    name: '万家高端装备量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/027790.html',
    name: '国金智启量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/024805.html',
    name: '华夏量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/016399.html',
    name: '九泰久睿量化股票',
  },
  {
    url: 'http://fund.eastmoney.com/025387.html',
    name: '万家智胜量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/025705.html',
    name: '广发沪深300指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/025379.html',
    name: '汇添富沪深300指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/026756.html',
    name: '鑫元鑫锐量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/021656.html',
    name: '海富通量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/021405.html',
    name: '长江汇智量化选股混合发起',
  },
  {
    url: 'http://fund.eastmoney.com/021167.html',
    name: '中泰红利量化选股股票发起',
  },
  {
    url: 'http://fund.eastmoney.com/026467.html',
    name: '西部利得智享量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/027447.html',
    name: '兴银新锐量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/027199.html',
    name: '景顺长城量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/019987.html',
    name: '万家红利量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/023605.html',
    name: '申万菱信量化对冲策略灵活配置混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/025983.html',
    name: '鹏华中证500指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/025012.html',
    name: '财通华裕量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/024855.html',
    name: '天弘沪深300指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/026743.html',
    name: '中欧中证A500指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/024594.html',
    name: '财通华晟量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/026847.html',
    name: '易方达中证港股通综合量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/027594.html',
    name: '东兴中证全指指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/024047.html',
    name: '富国致享量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/026258.html',
    name: '平安新锐量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/025704.html',
    name: '浙商汇金量化精选混合',
  },
  {
    url: 'http://fund.eastmoney.com/027713.html',
    name: '华宝质量量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/026986.html',
    name: '汇泉科创创业量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/027202.html',
    name: '华泰柏瑞嘉锐量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/002952.html',
    name: '建信多因子量化股票',
  },
  {
    url: 'http://fund.eastmoney.com/027327.html',
    name: '长信汇众量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/027632.html',
    name: '苏新睿盈量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/027302.html',
    name: '苏新睿哲量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/025501.html',
    name: '万家沪深300指数量化增强发起式',
  },
  {
    url: 'http://fund.eastmoney.com/023404.html',
    name: '海富通致远量化选股股票发起',
  },
  {
    url: 'http://fund.eastmoney.com/021693.html',
    name: '招商资管智达量化选股混合发起',
  },
  {
    url: 'http://fund.eastmoney.com/026699.html',
    name: '新华大盘成长量化选股混合发起',
  },
  {
    url: 'http://fund.eastmoney.com/018694.html',
    name: '大成智惠量化多策略混合',
  },
  {
    url: 'http://fund.eastmoney.com/023270.html',
    name: '景顺长城量化对冲策略三个月定期开放混合',
  },
  {
    url: 'http://fund.eastmoney.com/028225.html',
    name: '贝莱德行业轮动量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/028577.html',
    name: '易方达智远量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/019010.html',
    name: '泰康致远量化选股股票发起',
  },
  {
    url: 'http://fund.eastmoney.com/021827.html',
    name: '国投瑞银磐睿量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/026775.html',
    name: '中欧中证500指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/027335.html',
    name: '建信新锐量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/026421.html',
    name: '大摩ESG量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/027525.html',
    name: '中加安衡量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/028916.html',
    name: '长盛睿见量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/027307.html',
    name: '富荣中证500指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/029062.html',
    name: '大成智选量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/028618.html',
    name: '路博迈锐翼量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/019722.html',
    name: '中银量化选股混合发起',
  },
  {
    url: 'http://fund.eastmoney.com/519975.html',
    name: '长信量化中小盘股票',
  },
  {
    url: 'http://fund.eastmoney.com/000172.html',
    name: '华泰柏瑞量化增强混合',
  },
  {
    url: 'http://fund.eastmoney.com/007685.html',
    name: '华商电子行业量化股票发起式',
  },
  {
    url: 'http://fund.eastmoney.com/110030.html',
    name: '易方达沪深300量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/080005.html',
    name: '长盛量化红利混合',
  },
  {
    url: 'http://fund.eastmoney.com/004925.html',
    name: '长信低碳环保行业量化股票',
  },
  {
    url: 'http://fund.eastmoney.com/001637.html',
    name: '嘉实量化精选股票',
  },
  {
    url: 'http://fund.eastmoney.com/005443.html',
    name: '国金量化多策略',
  },
  {
    url: 'http://fund.eastmoney.com/005055.html',
    name: '华泰柏瑞量化阿尔法',
  },
  {
    url: 'http://fund.eastmoney.com/004394.html',
    name: '华泰柏瑞量化创优混合',
  },
  {
    url: 'http://fund.eastmoney.com/006401.html',
    name: '先锋量化优选混合',
  },
  {
    url: 'http://fund.eastmoney.com/014062.html',
    name: '景顺长城专精特新量化优选股票',
  },
  {
    url: 'http://fund.eastmoney.com/006267.html',
    name: '诺德量化核心',
  },
  {
    url: 'http://fund.eastmoney.com/003957.html',
    name: '安信量化沪深300增强',
  },
  {
    url: 'http://fund.eastmoney.com/009557.html',
    name: '申万菱信创业板量化精选股票',
  },
  {
    url: 'http://fund.eastmoney.com/000199.html',
    name: '国泰量化策略收益混合',
  },
  {
    url: 'http://fund.eastmoney.com/004495.html',
    name: '博时量化平衡混合',
  },
  {
    url: 'http://fund.eastmoney.com/007143.html',
    name: '国投瑞银沪深300指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/009992.html',
    name: '景顺长城量化成长演化混合',
  },
  {
    url: 'http://fund.eastmoney.com/003241.html',
    name: '创金合信量化发现混合',
  },
  {
    url: 'http://fund.eastmoney.com/007354.html',
    name: '创金合信港股通量化股票',
  },
  {
    url: 'http://fund.eastmoney.com/003717.html',
    name: '中银量化精选混合',
  },
  {
    url: 'http://fund.eastmoney.com/015006.html',
    name: '中欧量化动力混合',
  },
  {
    url: 'http://fund.eastmoney.com/020434.html',
    name: '金信量化精选混合',
  },
  {
    url: 'http://fund.eastmoney.com/012350.html',
    name: '万家元贞量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/005238.html',
    name: '银华医疗健康量化优选',
  },
  {
    url: 'http://fund.eastmoney.com/005632.html',
    name: '鹏华量化先锋混合',
  },
  {
    url: 'http://fund.eastmoney.com/005255.html',
    name: '浦银港股通量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/006106.html',
    name: '景顺长城量化港股通股票',
  },
  {
    url: 'http://fund.eastmoney.com/010690.html',
    name: '万家互联互通核心资产量化',
  },
  {
    url: 'http://fund.eastmoney.com/014139.html',
    name: '易方达高质量增长量化精选股票',
  },
  {
    url: 'http://fund.eastmoney.com/020476.html',
    name: '泰康半导体量化选股股票发起式',
  },
  {
    url: 'http://fund.eastmoney.com/014668.html',
    name: '银华专精特新量化优选股票发起',
  },
  {
    url: 'http://fund.eastmoney.com/014188.html',
    name: '华夏量化优选股票',
  },
  {
    url: 'http://fund.eastmoney.com/011589.html',
    name: '九泰天利量化',
  },
  {
    url: 'http://fund.eastmoney.com/018440.html',
    name: '汇添富量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/021650.html',
    name: '东方红红利量化选股混合发起',
  },
  {
    url: 'http://fund.eastmoney.com/005866.html',
    name: '浦银量化多策略混合',
  },
  {
    url: 'http://fund.eastmoney.com/013166.html',
    name: '东兴宸祥量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/005947.html',
    name: '德邦民裕进取量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/008252.html',
    name: '汇安宜创量化精选混合',
  },
  {
    url: 'http://fund.eastmoney.com/005651.html',
    name: '万家量化同顺多策略混合',
  },
  {
    url: 'http://fund.eastmoney.com/007479.html',
    name: '光大量化股票',
  },
  {
    url: 'http://fund.eastmoney.com/013153.html',
    name: '长信电子信息量化灵活配置混合',
  },
  {
    url: 'http://fund.eastmoney.com/012206.html',
    name: '中泰沪深300量化优选增强',
  },
  {
    url: 'http://fund.eastmoney.com/024378.html',
    name: '易方达科智量化选股股票发起式',
  },
  {
    url: 'http://fund.eastmoney.com/019561.html',
    name: '富国致航量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/012297.html',
    name: '东兴宸瑞量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/002562.html',
    name: '泓德泓益量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/002906.html',
    name: '南方中证500量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/007827.html',
    name: '华润元大量化优选混合',
  },
  {
    url: 'http://fund.eastmoney.com/015842.html',
    name: '国投瑞银专精特新量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/023290.html',
    name: '鹏华沪深300指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/020698.html',
    name: '国泰海通科创板量化选股股票发起',
  },
  {
    url: 'http://fund.eastmoney.com/014724.html',
    name: '东方量化多策略混合',
  },
  {
    url: 'http://fund.eastmoney.com/025776.html',
    name: '鹏华启航量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/020772.html',
    name: '中信建投量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/022488.html',
    name: '浦银红利量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/026093.html',
    name: '易方达中证A500量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/010246.html',
    name: '华泰柏瑞量化先行混合',
  },
  {
    url: 'http://fund.eastmoney.com/005083.html',
    name: '诺德量化蓝筹增强混合',
  },
  {
    url: 'http://fund.eastmoney.com/017716.html',
    name: '华宝量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/010802.html',
    name: '长江量化消费精选股票',
  },
  {
    url: 'http://fund.eastmoney.com/022116.html',
    name: '鑫元致远量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/022344.html',
    name: '景顺长城红利量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/014692.html',
    name: '中加量化研选混合',
  },
  {
    url: 'http://fund.eastmoney.com/023387.html',
    name: '国泰聚智量化选股混合发起',
  },
  {
    url: 'http://fund.eastmoney.com/011934.html',
    name: '中航量化阿尔法六个月持有',
  },
  {
    url: 'http://fund.eastmoney.com/026859.html',
    name: '华安智优量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/021815.html',
    name: '华泰柏瑞红利量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/024597.html',
    name: '财通成长量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/021050.html',
    name: '易方达高股息量化选股股票发起式',
  },
  {
    url: 'http://fund.eastmoney.com/018705.html',
    name: '财通鼎欣量化选股18个月定开混合',
  },
  {
    url: 'http://fund.eastmoney.com/025447.html',
    name: '万家元晟量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/158908.html',
    name: '均衡量化主动ETF天弘',
  },
  {
    url: 'http://fund.eastmoney.com/024892.html',
    name: '中欧上证科创板综合指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/027586.html',
    name: '鹏华领航成长量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/013034.html',
    name: '泰信智选量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/025599.html',
    name: '国泰海通新锐量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/014021.html',
    name: '诺德量化先锋一年持有混合',
  },
  {
    url: 'http://fund.eastmoney.com/027262.html',
    name: '易方达沪深300量化增强Y',
  },
  {
    url: 'http://fund.eastmoney.com/025749.html',
    name: '招商医药量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/027775.html',
    name: '鹏扬量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/018725.html',
    name: '长信汇智量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/020976.html',
    name: '万家科技量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/025276.html',
    name: '汇泉中证A500指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/026940.html',
    name: '南方智汇量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/027053.html',
    name: '兴全价值量化选股股票发起式',
  },
  {
    url: 'http://fund.eastmoney.com/026941.html',
    name: '中加量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/026744.html',
    name: '交银红利量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/026779.html',
    name: '诺安智泉量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/027235.html',
    name: '交银智远量化选股股票发起',
  },
  {
    url: 'http://fund.eastmoney.com/019215.html',
    name: '景顺长城量化平衡混合',
  },
  {
    url: 'http://fund.eastmoney.com/025405.html',
    name: '苏新睿见量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/028677.html',
    name: '交银科创创业量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/028406.html',
    name: '万家景明红利量化选股股票发起式',
  },
  {
    url: 'http://fund.eastmoney.com/028982.html',
    name: '路博迈红利量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/025984.html',
    name: '鹏华中证500指数量化增强I',
  },
  {
    url: 'http://fund.eastmoney.com/028681.html',
    name: '富国致泰回报量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/027224.html',
    name: '建信领航量化选股股票型发起',
  },
  {
    url: 'http://fund.eastmoney.com/028568.html',
    name: '泰信全景智选量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/028994.html',
    name: '国金成长量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/001143.html',
    name: '华商量化进取混合',
  },
  {
    url: 'http://fund.eastmoney.com/630015.html',
    name: '华商大盘量化精选混合',
  },
  {
    url: 'http://fund.eastmoney.com/007853.html',
    name: '华商计算机行业量化股票发起式',
  },
  {
    url: 'http://fund.eastmoney.com/233015.html',
    name: '大摩量化配置混合',
  },
  {
    url: 'http://fund.eastmoney.com/005994.html',
    name: '国投瑞银中证500指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/001980.html',
    name: '中欧量化驱动混合',
  },
  {
    url: 'http://fund.eastmoney.com/070017.html',
    name: '嘉实量化阿尔法混合',
  },
  {
    url: 'http://fund.eastmoney.com/010293.html',
    name: '华商量化优质精选混合',
  },
  {
    url: 'http://fund.eastmoney.com/001073.html',
    name: '华泰柏瑞量化绝对收益混合',
  },
  {
    url: 'http://fund.eastmoney.com/006336.html',
    name: '泓德量化精选混合',
  },
  {
    url: 'http://fund.eastmoney.com/008835.html',
    name: '富国量化对冲策略三个月持有期混合',
  },
  {
    url: 'http://fund.eastmoney.com/018824.html',
    name: '国金智享量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/009043.html',
    name: '九泰久信量化股票',
  },
  {
    url: 'http://fund.eastmoney.com/005347.html',
    name: '诺德量化优选6个月持有期混合',
  },
  {
    url: 'http://fund.eastmoney.com/005075.html',
    name: '富国研究量化精选混合',
  },
  {
    url: 'http://fund.eastmoney.com/010779.html',
    name: '西部利得量化优选一年持有',
  },
  {
    url: 'http://fund.eastmoney.com/008353.html',
    name: '宏利消费量化混合',
  },
  {
    url: 'http://fund.eastmoney.com/005126.html',
    name: '银河量化稳进混合',
  },
  {
    url: 'http://fund.eastmoney.com/005120.html',
    name: '摩根量化多因子混合',
  },
  {
    url: 'http://fund.eastmoney.com/007137.html',
    name: '鹏扬元合量化大盘',
  },
  {
    url: 'http://fund.eastmoney.com/000877.html',
    name: '华泰柏瑞量化优选混合',
  },
  {
    url: 'http://fund.eastmoney.com/015205.html',
    name: '银华全球新能源车量化优选股票(QDII)',
  },
  {
    url: 'http://fund.eastmoney.com/007808.html',
    name: '华银量化优选灵活配置',
  },
  {
    url: 'http://fund.eastmoney.com/016267.html',
    name: '建信中证500指数量化增强发起',
  },
  {
    url: 'http://fund.eastmoney.com/000978.html',
    name: '景顺长城量化精选股票',
  },
  {
    url: 'http://fund.eastmoney.com/016498.html',
    name: '易方达MSCI中国A50互联互通量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/022866.html',
    name: '博道沪深300指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/025659.html',
    name: '国金科创创业量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/011849.html',
    name: '西部利得量化价值一年持有期混合',
  },
  {
    url: 'http://fund.eastmoney.com/011824.html',
    name: '浙商汇金量化臻选股票',
  },
  {
    url: 'http://fund.eastmoney.com/023806.html',
    name: '招商红利量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/026109.html',
    name: '广发中证500指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/012977.html',
    name: '瑞达鑫红量化6个月持有混合',
  },
  {
    url: 'http://fund.eastmoney.com/021995.html',
    name: '南华丰睿量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/021884.html',
    name: '太平量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/021205.html',
    name: '华夏医药量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/021812.html',
    name: '东兴宸泰量化选股混合发起',
  },
  {
    url: 'http://fund.eastmoney.com/020491.html',
    name: '万家医药量化选股混合发起式',
  },
  {
    url: 'http://fund.eastmoney.com/026520.html',
    name: '财通资管量化选股股票发起式',
  },
  {
    url: 'http://fund.eastmoney.com/024415.html',
    name: '长信沪深300指数量化增强',
  },
  {
    url: 'http://fund.eastmoney.com/028466.html',
    name: '长信汇优量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/022908.html',
    name: '国投瑞银沪深300指数量化增强Y',
  },
  {
    url: 'http://fund.eastmoney.com/021381.html',
    name: '华宝量化对冲混合D',
  },
  {
    url: 'http://fund.eastmoney.com/020779.html',
    name: '湘财新能源量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/020830.html',
    name: '东兴医药生物量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/025467.html',
    name: '百嘉瑞丰量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/027352.html',
    name: '华安智享量化选股股票',
  },
  {
    url: 'http://fund.eastmoney.com/020353.html',
    name: '富国量化对冲策略三个月持有期混合E',
  },
  {
    url: 'http://fund.eastmoney.com/027909.html',
    name: '汇添富睿启量化选股混合',
  },
  {
    url: 'http://fund.eastmoney.com/024158.html',
    name: '鹏华沪深300指数量化增强I',
  },
  {
    url: 'http://fund.eastmoney.com/027925.html',
    name: '安信量化沪深300增强Y',
  },
  {
    url: 'http://fund.eastmoney.com/024260.html',
    name: '长信汇智量化选股混合E',
  },
  {
    url: 'http://fund.eastmoney.com/029400.html',
    name: '天弘智航信瑞量化选股混合',
  },
]

exports.CLOSE_TEXTS = ['限大额', '不开放购买', '已终止', '暂停申购', '认购期']
