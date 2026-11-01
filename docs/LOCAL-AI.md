# 本地图像生成

项目已经内置：

- ComfyUI 0.43.0
- Python 3.12 便携环境
- PyTorch 2.15.0 CPU
- Stable Diffusion 1.5 基础模型

## 启动

双击项目根目录的 `启动ComfyUI.bat`，然后打开：

```text
http://127.0.0.1:8188
```

模型位置：

```text
ai-tools/ComfyUI/models/checkpoints/v1-5-pruned-emaonly.safetensors
```

模型 SHA-256：

```text
6ce0161689b3853acaa03779ec93eafe75a02f4ced659bee03f50797806fa2fa
```

## 性能说明

当前电脑使用 Intel Iris Xe 核显，本项目以 CPU 模式运行，稳定性优先。512×512 或 768×512 的测试图通常需要数分钟；不要在浏览器标签页重复提交任务。

## 图像用途

建议使用 AI 生成洞窟全景、岩壁纹理和壁画背景，建筑、女神轮廓、点击聚合与真实建筑显形继续由 Three.js 粒子系统实时绘制。这样页面进入后仍然可交互，而不是静态视频。

提示词见 `docs/IMAGE-GENERATION.md`。

## 许可

Stable Diffusion 1.5 模型来自 ModelScope 的 `AI-ModelScope/stable-diffusion-v1-5` 镜像。使用和分发前请阅读模型卡及 CreativeML Open RAIL-M 许可。
