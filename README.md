# big-a

- 基于成交量的选股策略
- 持股 checklist

需要自己补充 token.js 文件

```js
exports.TOKEN = '***'
```

## 以图搜图

```python
python -m venv venv
pip install -r img_search/requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
```

绘制图片

```bash
python img_search/plot_stock.py -d daily

python img_search/plot_stock.py -d img_search/b1_examples -o img_search/b1_examples
```

通过相似度查找

```bash
python3 img_search/batch_find_similar.py
```
