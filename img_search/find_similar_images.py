#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
基于感知哈希相似度进行匹配
"""

import cv2
import numpy as np
from PIL import Image
import argparse
import os
from pathlib import Path


def compute_phash(image, hash_size=8):
    # 转换为灰度图并调整大小
    image = image.convert('L').resize((hash_size + 1, hash_size), Image.LANCZOS)
    pixels = np.array(image)

    # 计算DCT
    diff = pixels[:, 1:] > pixels[:, :-1]

    # 转换为哈希值
    return sum([2 ** i for (i, v) in enumerate(diff.flatten()) if v])


def phash_similarity(img1_path, img2_path):
    """
    返回相似度百分比和汉明距离
    """
    try:
        # 加载图片
        img1 = cv2.imread(img1_path)
        img2 = cv2.imread(img2_path)

        if img1 is None or img2 is None:
            return 0, 64

        # 使用PIL处理
        pil_img1 = Image.fromarray(cv2.cvtColor(img1, cv2.COLOR_BGR2RGB))
        pil_img2 = Image.fromarray(cv2.cvtColor(img2, cv2.COLOR_BGR2RGB))

        # 计算感知哈希
        hash1 = compute_phash(pil_img1)
        hash2 = compute_phash(pil_img2)

        # 计算汉明距离
        hamming_dist = bin(hash1 ^ hash2).count('1')

        # 转换为相似度百分比 (64位哈希)
        similarity = (64 - hamming_dist) / 64 * 100
        return similarity, hamming_dist
    except Exception as e:
        print(f"处理图片时出错 {img2_path}: {e}")
        return 0, 64


def find_similar_images(target_image, search_dir, threshold=80, extensions=None):
    """
    在指定目录中查找与目标图片相似的图片
    """
    if extensions is None:
        extensions = ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff']

    if not os.path.exists(target_image):
        raise FileNotFoundError(f"目标图片不存在: {target_image}")

    if not os.path.exists(search_dir):
        raise FileNotFoundError(f"搜索目录不存在: {search_dir}")

    print(f"目标图片: {target_image}")
    print(f"搜索目录: {search_dir}")
    print(f"相似度阈值: {threshold}%")
    print(f"支持的扩展名: {', '.join(extensions)}")
    print(f"\n开始搜索...\n")

    similar_images = []
    total_files = 0

    # 遍历目录
    for root, dirs, files in os.walk(search_dir):
        for file in files:
            # 检查文件扩展名
            file_ext = os.path.splitext(file)[1].lower()
            if file_ext not in extensions:
                continue

            total_files += 1
            file_path = os.path.join(root, file)

            # 跳过目标图片本身
            if os.path.abspath(file_path) == os.path.abspath(target_image):
                continue

            # 计算相似度
            similarity, hamming_dist = phash_similarity(target_image, file_path)

            # 如果相似度达到阈值，添加到结果列表
            if similarity >= threshold:
                similar_images.append((file_path, similarity, hamming_dist))
                print(f"✓ 找到相似图片: {file_path}")
                print(f"  相似度: {similarity:.2f}% (汉明距离: {hamming_dist})")

    print(f"\n搜索完成!")
    print(f"总共扫描: {total_files} 个图片文件")
    print(f"找到相似图片: {len(similar_images)} 个")

    # 按相似度排序
    similar_images.sort(key=lambda x: x[1], reverse=True)

    return similar_images


def main():
    parser = argparse.ArgumentParser(
        description='Find similar images in a directory based on perceptual hash',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
  python %(prog)s output/000001.SZ.png output --threshold 80
        """
    )

    parser.add_argument('target_image', type=str,
                        help='目标图片路径')
    parser.add_argument('search_dir', type=str,
                        help='搜索目录路径')
    parser.add_argument('--threshold', type=float, default=80,
                        help='相似度阈值 (0-100，默认: 80)')
    parser.add_argument('--extensions', type=str, nargs='+',
                        default=['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff'],
                        help='支持的图片扩展名 (默认: .png .jpg .jpeg .bmp .gif .tiff)')
    parser.add_argument('--output', type=str,
                        help='输出结果到文件')

    args = parser.parse_args()

    # 查找相似图片
    similar_images = find_similar_images(
        args.target_image,
        args.search_dir,
        args.threshold,
        args.extensions
    )

    # 显示结果
    if similar_images:
        print(f"\n{'='*70}")
        print(f"相似图片列表 (相似度 >= {args.threshold}%):")
        print(f"{'='*70}")
        for i, (path, similarity, hamming_dist) in enumerate(similar_images, 1):
            print(f"{i}. {path}")
            print(f"   相似度: {similarity:.2f}% (汉明距离: {hamming_dist})")
        print(f"{'='*70}")

        # 保存结果到文件（只保存前10张）
        if args.output:
            top_10 = similar_images[:10]  # 只取前10张
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(f"目标图片: {args.target_image}\n")
                f.write(f"搜索目录: {args.search_dir}\n")
                f.write(f"相似度阈值: {args.threshold}%\n")
                f.write(f"\n相似度最高的前 {len(top_10)} 张图片:\n\n")
                for i, (path, similarity, hamming_dist) in enumerate(top_10, 1):
                    f.write(f"{i}. {path}\n")
                    f.write(f"   相似度: {similarity:.2f}% (汉明距离: {hamming_dist})\n\n")
            print(f"\n结果已保存到: {args.output} (保存了前10张相似度最高的图片)")
    else:
        print(f"\n未找到相似度 >= {args.threshold}% 的图片")


if __name__ == '__main__':
    main()
