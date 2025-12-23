#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
对指定目录中的每张图片，分别找出与它相似度最高的前10张图片
"""

import os
import sys
from pathlib import Path
from find_similar_images import find_similar_images


def batch_find_similar(reference_dir, search_dir, threshold=60, output_dir='similar_results', extensions=None):
    """
    批量查找相似图片
    """
    if extensions is None:
        extensions = ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff']

    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)

    # 获取参考目录中的所有图片
    reference_images = []
    ref_path = Path(reference_dir)

    for ext in extensions:
        reference_images.extend(ref_path.glob(f'*{ext}'))
        reference_images.extend(ref_path.glob(f'*{ext.upper()}'))

    reference_images = sorted(list(set(reference_images)))

    if not reference_images:
        print(f"错误: 在 {reference_dir} 中未找到图片")
        return

    print(f"="*70)
    print(f"批量查找相似图片")
    print(f"="*70)
    print(f"参考图片目录: {reference_dir}")
    print(f"搜索目录: {search_dir}")
    print(f"相似度阈值: {threshold}%")
    print(f"输出目录: {output_dir}")
    print(f"找到 {len(reference_images)} 张参考图片")
    print(f"="*70)
    print()

    # 为每张参考图片查找相似图片
    for idx, ref_img in enumerate(reference_images, 1):
        ref_img_path = str(ref_img)
        ref_img_name = ref_img.stem  # 不带扩展名的文件名

        print(f"[{idx}/{len(reference_images)}] 处理: {ref_img.name}")

        # 查找相似图片
        similar_images = find_similar_images(
            ref_img_path,
            search_dir,
            threshold,
            extensions
        )

        # 只保留前10张
        top_10 = similar_images[:10]

        # 保存结果到文件
        output_file = os.path.join(output_dir, f'{ref_img_name}_top10.txt')

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"参考图片: {ref_img.name}\n")
            f.write(f"搜索目录: {search_dir}\n")
            f.write(f"相似度阈值: {threshold}%\n")
            f.write(f"\n相似度最高的前 {len(top_10)} 张图片:\n\n")

            for i, (path, similarity, hamming_dist) in enumerate(top_10, 1):
                # 只保存文件名，不保存完整路径
                filename = os.path.basename(path)
                f.write(f"{i}. {filename}\n")
                f.write(f"   相似度: {similarity:.2f}% (汉明距离: {hamming_dist})\n\n")

        print(f"   找到 {len(similar_images)} 张相似图片")
        print(f"   保存前 {len(top_10)} 张到: {output_file}")
        print()

    print(f"="*70)
    print(f"完成! 所有结果已保存到 {output_dir} 目录")
    print(f"="*70)


def main():
    """主函数"""
    import argparse

    parser = argparse.ArgumentParser(
        description='批量查找相似图片 - 对参考目录中的每张图片分别找出最相似的前10张',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
  python %(prog)s b1_examples output --threshold 70 --output-dir results
        """
    )

    parser.add_argument('--reference-dir', type=str, default='img_search/b1_examples',
                        help='参考图片目录（如 b1_examples）')
    parser.add_argument('--search-dir', type=str, default='img_search/output',
                        help='搜索目录（如 output）')               
    parser.add_argument('--threshold', type=float, default=75,
                        help='相似度阈值 (0-100，默认: 75)')
    parser.add_argument('--output-dir', type=str, default='img_search/similar_results',
                        help='结果输出目录 (默认: similar_results)')
    parser.add_argument('--extensions', type=str, nargs='+',
                        default=['.png'],
                        help='支持的图片扩展名')

    args = parser.parse_args()

    # 检查目录是否存在
    if not os.path.exists(args.reference_dir):
        print(f"错误: 参考图片目录不存在 - {args.reference_dir}")
        sys.exit(1)

    if not os.path.exists(args.search_dir):
        print(f"错误: 搜索目录不存在 - {args.search_dir}")
        sys.exit(1)

    # 执行批量查找
    batch_find_similar(
        args.reference_dir,
        args.search_dir,
        args.threshold,
        args.output_dir,
        args.extensions
    )


if __name__ == '__main__':
    main()
