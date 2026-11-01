# 手工生成图片交接说明(给 Codex 补场景背景,不需要 OPENAI_API_KEY)

## 你要做的:把 3 张图放进这个文件夹(images\gen\),文件名必须一模一样:

| 文件名 | 内容 | 尺寸要求 | 替换目标 |
|---|---|---|---|
| `bg-cave.jpg` | 洞窟全景(横向 16:9) | 宽 ≥2560px | 程序化洞穴背景 |
| `portal.jpg` | 壁画门(16:9 或方形) | 宽 ≥1600px | goddess.mp4 静态海报/首帧 |
| `texture-stone.jpg` | 可平铺岩壁纹理(正方形) | ≥1024px | 地表材质细节 |

生成工具用即梦 / 通义万相 / 文心一格 网页版任意一个,不用 API。
提示词见本文件夹 `提示词-网页工具版.md`。
生成后检查:图里不能有文字/水印/边框;全景图中景别太满,要留出中间行走的通路。

## 放好图片后,把这句话发给 Codex:

```
三张手工生成的图片已就位:
- myhtml/images/gen/bg-cave.jpg —— 洞窟全景,用来替换程序化洞穴背景
- myhtml/images/gen/portal.jpg —— 壁画门,用作 goddess.mp4 的静态海报/首帧
- myhtml/images/gen/texture-stone.jpg —— 正方形可平铺岩壁纹理,用于地表材质
请直接读取并按 docs/IMAGE-GENERATION.md 中各图的"用途"接入场景,
压缩为 WebP 或高质量 JPG,尺寸不符合要求时先等比预处理。
图像 API 方案已取消,不要再要求 OPENAI_API_KEY。
```
