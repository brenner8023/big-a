#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
个股K线图和成交量绘图工具
"""

import json
import os
import sys
from datetime import datetime
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import Rectangle
from matplotlib.lines import Line2D
import numpy as np

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False


def load_zsz_map(zsz_file='code/zsz.json'):
    """
    加载总市值映射数据
    """
    try:
        with open(zsz_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"警告: 未找到 {zsz_file} 文件，将跳过总市值过滤")
        return {}
    except Exception as e:
        print(f"警告: 加载 {zsz_file} 失败: {e}")
        return {}


def load_stock_data(json_file):
    """
    加载股票数据
    """
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 从文件名提取股票代码
    stock_code = os.path.basename(json_file).replace('.json', '')

    return stock_code, data


def parse_data(data, days=30):
    """
    数据格式: [日期, 开盘, 最高, 最低, 收盘, 涨跌幅, 成交量(万)]
    """
    dates = []
    opens = []
    highs = []
    lows = []
    closes = []
    volumes = []

    for item in data:
        date_str = item[0]
        # 转换日期格式 YYYYMMDD -> YYYY-MM-DD
        date = datetime.strptime(date_str, '%Y%m%d')
        dates.append(date)
        opens.append(item[1])
        highs.append(item[2])
        lows.append(item[3])
        closes.append(item[4])
        volumes.append(item[6])  # 成交量(万)

    # 只保留最近N天的数据
    if days and len(dates) > days:
        dates = dates[-days:]
        opens = opens[-days:]
        highs = highs[-days:]
        lows = lows[-days:]
        closes = closes[-days:]
        volumes = volumes[-days:]

    return {
        'dates': dates,
        'opens': np.array(opens),
        'highs': np.array(highs),
        'lows': np.array(lows),
        'closes': np.array(closes),
        'volumes': np.array(volumes)
    }


def plot_candlestick(ax, data, stock_code, width=0.6):
    """
    绘制K线图
    """
    dates = data['dates']
    opens = data['opens']
    highs = data['highs']
    lows = data['lows']
    closes = data['closes']

    n = len(dates)
    x = np.arange(n)

    # 绘制K线
    for i in range(n):
        # 判断涨跌
        if closes[i] >= opens[i]:
            # 上涨或平盘 - 红色
            color = 'red'
            height = closes[i] - opens[i]
            bottom = opens[i]
        else:
            # 下跌 - 绿色
            color = 'green'
            height = opens[i] - closes[i]
            bottom = closes[i]

        # 绘制实体
        rect = Rectangle((x[i] - width/2, bottom), width, height,
                         facecolor=color, edgecolor=color, alpha=0.8)
        ax.add_patch(rect)

        # 绘制上下影线
        ax.plot([x[i], x[i]], [lows[i], highs[i]], color=color, linewidth=0.5)

    # 设置x轴
    ax.set_xlim(-1, n)
    ax.set_xticks(x[::max(1, n//10)])  # 显示约10个日期标签
    ax.set_xticklabels([dates[i].strftime('%Y-%m-%d') for i in range(0, n, max(1, n//10))],
                       rotation=45, ha='right')

    # 设置y轴
    ax.set_ylabel('价格 (元)', fontsize=10)
    ax.grid(True, alpha=0.3, linestyle='--')

    # 设置标题
    ax.set_title(f'{stock_code} K线图', fontsize=12, fontweight='bold')

    # 添加图例
    red_patch = mpatches.Patch(color='red', label='上涨', alpha=0.8)
    green_patch = mpatches.Patch(color='green', label='下跌', alpha=0.8)
    ax.legend(handles=[red_patch, green_patch], loc='upper left', fontsize=8)


def plot_volume(ax, data, width=0.6):
    """
    绘制成交量图
    """
    dates = data['dates']
    volumes = data['volumes']
    opens = data['opens']
    closes = data['closes']

    n = len(dates)
    x = np.arange(n)

    # 根据涨跌设置颜色
    colors = ['red' if closes[i] >= opens[i] else 'green' for i in range(n)]

    # 绘制成交量柱状图
    ax.bar(x, volumes, width=width, color=colors, alpha=0.6)

    # 设置x轴
    ax.set_xlim(-1, n)
    ax.set_xticks(x[::max(1, n//10)])
    ax.set_xticklabels([dates[i].strftime('%Y-%m-%d') for i in range(0, n, max(1, n//10))],
                       rotation=45, ha='right')

    # 设置y轴
    ax.set_ylabel('成交量 (万)', fontsize=10)
    ax.grid(True, alpha=0.3, linestyle='--', axis='y')

    # 设置标题
    ax.set_title('成交量', fontsize=12, fontweight='bold')


def plot_stock(json_file, output_dir='output', figsize=(14, 10), dpi=100, days=30, zsz_map=None):
    """
    绘制个股K线图和成交量图
    """
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)

    # 加载数据
    print(f"加载数据: {json_file}")
    stock_code, raw_data = load_stock_data(json_file)

    # 检查总市值是否符合条件（zsz > 40）
    if zsz_map is not None:
        if stock_code not in zsz_map:
            print(f"跳过: {stock_code} - 未在总市值数据中找到")
            return None

        zsz = zsz_map[stock_code].get('zsz', 0)
        if zsz <= 40:
            print(f"跳过: {stock_code} - 总市值为 {zsz}亿，不满足>40亿的条件")
            return None

    # 检查最近一天的涨跌幅是否符合条件（-3% < 涨跌幅 < 2.5%）
    if not raw_data:
        print(f"跳过: {stock_code} - 数据为空")
        return None

    latest_change = raw_data[-1][5]  # 涨跌幅在索引5
    if latest_change <= -3 or latest_change >= 2.5:
        print(f"跳过: {stock_code} - 最近一天涨跌幅为 {latest_change}%，不在[-3, 2.5]区间")
        return None

    # 解析数据（只保留最近N天）
    data = parse_data(raw_data, days=days)

    # 创建图形
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=figsize,
                                     gridspec_kw={'height_ratios': [3, 1]})

    # 绘制K线图
    plot_candlestick(ax1, data, stock_code)

    # 绘制成交量图
    plot_volume(ax2, data)

    # 调整布局
    plt.tight_layout()

    # 保存图片
    output_file = os.path.join(output_dir, f'{stock_code}.png')
    plt.savefig(output_file, dpi=dpi, bbox_inches='tight')
    print(f"图片已保存: {output_file} (最近{days}天数据)")

    # 关闭图形
    plt.close()

    return output_file


def plot_multiple_stocks(json_dir, output_dir='img_search/output', pattern='*.json',
                        figsize=(14, 10), dpi=100, days=30, zsz_file='code/zsz.json'):
    """
    批量绘制多个股票的K线图
    """
    import glob

    # 加载总市值数据
    zsz_map = load_zsz_map(zsz_file)
    if zsz_map:
        print(f"已加载 {len(zsz_map)} 个股票的总市值数据")

    # 查找所有JSON文件
    json_files = glob.glob(os.path.join(json_dir, pattern))

    if not json_files:
        print(f"未找到匹配的JSON文件: {json_dir}/{pattern}")
        return 0

    print(f"找到 {len(json_files)} 个股票数据文件")

    success_count = 0
    skipped_count = 0
    for i, json_file in enumerate(json_files, 1):
        try:
            print(f"\n[{i}/{len(json_files)}] 处理: {os.path.basename(json_file)}")
            result = plot_stock(json_file, output_dir, figsize, dpi, days, zsz_map)
            if result:
                success_count += 1
            else:
                skipped_count += 1
        except Exception as e:
            print(f"处理失败: {e}")
            continue

    print(f"\n完成! 成功处理 {success_count}/{len(json_files)} 个股票，跳过 {skipped_count} 个")
    return success_count


def main():
    """主函数"""
    import argparse

    parser = argparse.ArgumentParser(
        description='根据个股每日数据绘制K线图和成交量',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
  python plot_stock.py -d daily
        """
    )

    parser.add_argument('-f', '--file', help='单个JSON文件路径')
    parser.add_argument('-d', '--dir', help='JSON文件目录(批量处理)')
    parser.add_argument('-o', '--output', default='img_search/output', help='输出目录(默认: output)')
    parser.add_argument('-r', '--dpi', type=int, default=100, help='图片分辨率(默认: 100)')
    parser.add_argument('-w', '--width', type=int, default=14, help='图片宽度(默认: 14)')
    parser.add_argument('-H', '--height', type=int, default=10, help='图片高度(默认: 10)')
    parser.add_argument('--days', type=int, default=30, help='绘制最近N天的数据(默认: 30)')
    parser.add_argument('--zsz-file', default='code/zsz.json', help='总市值数据文件路径(默认: code/zsz.json)')

    args = parser.parse_args()

    figsize = (args.width, args.height)

    if args.file:
        # 处理单个文件
        if not os.path.exists(args.file):
            print(f"错误: 文件不存在 - {args.file}")
            sys.exit(1)
        # 加载总市值数据
        zsz_map = load_zsz_map(args.zsz_file)
        plot_stock(args.file, args.output, figsize, args.dpi, args.days, zsz_map)
    elif args.dir:
        # 批量处理
        if not os.path.exists(args.dir):
            print(f"错误: 目录不存在 - {args.dir}")
            sys.exit(1)
        plot_multiple_stocks(args.dir, args.output, '*.json', figsize, args.dpi, args.days, args.zsz_file)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == '__main__':
    main()
