# 素材与开源资源

## 项目内主题插画

- `images/postcard_feitian1.jpg` 至 `postcard_feitian4.jpg`：由项目原作者提供，用于四个主题章节。
- `images/gen/portal.jpg`：项目手工生成素材，用于壁画门静态首帧、AR 背景与入窟章节。
- `images/gen/texture-stone.jpg`：项目手工生成素材，用于崖壁、沙地微表面和建筑基座。
- `images/feitian1.mp4`、`postcard_feitian1.jpg`：项目原有飞天影像与海报，现作为“活壁画”神女主演出及静态兜底。

## PBR 材质

以下材质来自 [Poly Haven](https://polyhaven.com/)，采用 CC0 许可：

- Dense Sand — Dimitrios Savva
  - https://polyhaven.com/a/dense_sand
- Cliff Side — James Ray Cock, Jenelle van Heerden, Dario Barresi
  - https://polyhaven.com/a/cliff_side
- Dark Rock 02 — Amal Kumar
  - https://polyhaven.com/a/dark_rock_02

## 本地 AI 生成图像

- `images/generated/dunhuang-hero-v1.png`：使用项目内 ComfyUI 和 Stable Diffusion 1.5 生成，现作为归档候选素材。
- `images/generated/dunhuang-mogao-caves-v1.png`：使用项目内 ComfyUI 和 Stable Diffusion 1.5 生成，现作为归档候选素材。

## 三维场景设计

鸣沙山、月牙泉、莫高窟崖壁与楼阁由 Three.js 程序化构建。楼阁在聚合前以可点击发光云雾存在，聚合后显示真实建筑模型。飞天魔女以项目原有飞天影像作为洞窟中的动态壁画演出，并以粒子光晕、点击重播和自动分镜补充互动。旧版河流、桥、树木及其场景生成函数已移除。

## Codex Skills

- `han-design` — https://github.com/you-want/han-design (MIT)
- `dunhuang-aura-skill` — https://github.com/govin-ai/dunhuang-aura-skill (MIT)
- `img2threejs` — https://github.com/img2threejs/img2threejs (Apache-2.0)
