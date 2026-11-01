# 敦煌灵境图像生成接入说明

## 已接入的本地生成方案

`ai-tools/` 中已经包含 ComfyUI、便携 Python、Stable Diffusion 1.5 和 PBR 材质生成所需环境。双击项目根目录的 `启动ComfyUI.bat`，访问 `http://127.0.0.1:8188` 即可使用，无需 API Key。

更完整的启动与性能说明见 `docs/LOCAL-AI.md`。

## 本地密钥

不要把 API Key 贴在聊天或提交到网页源码中。推荐在当前 Windows 用户环境里设置：

```powershell
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "你的密钥", "User")
```

设置完成后重新启动 Codex。图像生成 CLI 还需要 Python 3.10+ 和 `openai` 包：

```powershell
python -m pip install --upgrade openai
```

也可使用项目级环境变量，仅在当前 PowerShell 会话生效：

```powershell
$env:OPENAI_API_KEY = "你的密钥"
```

## 第一张：洞窟全景

用途：后续替换当前的程序化洞穴背景。

```text
Use case: stylized-concept
Asset type: wide immersive website background, 16:9
Primary request: Create a cinematic Dunhuang-inspired cave-gallery vista for a premium interactive cultural website. The scene should feel sacred, quiet and physically coherent, not like a low-poly game.
Scene/backdrop: a weathered Mogao-style rock wall opens into a hidden desert oasis. A narrow jade-green stream crosses the foreground, an elegant cinnabar timber bridge spans it, distant mineral-painted cliffs and cave openings recede into warm haze.
Composition: asymmetrical cave frame on both edges, one luminous mural portal opening slightly left of center, an open walking path through the middle, layered foreground-middle-background depth.
Style/medium: contemporary painterly spatial concept art with plausible 3D surfaces and fine Dunhuang mineral-pigment texture.
Lighting/mood: one warm late-afternoon light origin, deep readable charcoal shadows, restrained gold reflected light, fine dust suspended in the air.
Color palette: charcoal cave black, sand mineral white, cinnabar #9B3F2D, malachite #347567, lapis #315C78, ochre gold accents below 10% of the image.
Materials/textures: cracked mineral plaster, dark weathered sandstone, aged wood, quiet water, fine gold leaf, subtle mineral grain.
Constraints: no text, letters, numbers, logos, watermarks, UI, frames, borders or photographic tourists. Keep a clear navigable center path and enough quiet space for overlaid interface panels.
Avoid: low-poly toy trees, uniform orange wash, generic fantasy temple, cyberpunk neon, excessive gold, repetitive lotus wallpaper, tourist souvenir poster.
```

## 第二张：会呼吸的壁画门

用途：后续替换 `images/goddess.mp4` 的静态海报或直接作为低帧率视频首帧。

```text
Use case: stylized-concept
Asset type: luminous mural portal, square or 16:10
Primary request: Create an original contemporary interpretation of a Dunhuang aerial-celestial mural for the central portal of an interactive cultural scene.
Subject: one elegant flying celestial figure with flowing ribbons, represented with restraint and historical respect; no copied face, pose or complete historical mural.
Scene/backdrop: warm mineral-painted plaster recessed inside a dark weathered cave wall, fine caisson geometry at the border.
Composition: figure and ribbons create one continuous diagonal flow across a calm illuminated center; the portal remains readable when cropped to landscape.
Style/medium: refined mineral-pigment mural, subtle hand-painted linework, believable aged plaster, not photoreal tourist photography.
Lighting/mood: soft inner glow, warm gold edge light, deep lapis and malachite shadows.
Color palette: sand white, cinnabar, malachite, lapis, restrained ochre gold.
Constraints: no text, letters, numbers, seals with fake script, logos, watermarks, pseudo-Chinese glyphs, copied archaeological mural, or excessive ornament. Respectful cultural interpretation only.
Avoid: anime, fantasy game splash art, purple glow, plastic 3D rendering, neon, oversaturated gold.
```

## 第三张：地表材质

用途：生成可平铺的岩壁或沙地细节纹理。

```text
Use case: stylized-concept
Asset type: seamless material texture, top-down
Primary request: Create a seamless square texture of weathered Dunhuang sandstone and mineral-pigment residue.
Materials/textures: dark charcoal-brown stone, ochre sand, tiny cinnabar and malachite pigment traces, hairline cracks, natural mineral grain, matte surface.
Lighting/mood: flat neutral lighting suitable for texture mapping, no strong directional shadow.
Composition: even texture density across the full tile, no single focal object, seamless edges.
Constraints: no text, symbols, figures, flowers, landscape composition, perspective, watermark or border.
Avoid: plastic noise, heavy grunge, obvious repetition, bright gold wash, cartoon outlines.
```

生成后优先保存为 WebP 或高质量 JPG。全景建议宽度不低于 2560px，并在实际场景中检查中远景压缩、接缝和文字伪影。
