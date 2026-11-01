(function (THREE) {
'use strict';

const CHAPTERS = [
    {
        id: 'feitian1',
        name: '散花飞天',
        subtitle: '以花雨为引，穿过千年丝路',
        description: '衣带当风，花雨漫天。散花飞天以莲为心、以云为路，在洞窟顶部留下了最轻盈的祈愿。她掌中的花瓣，也像是丝路往来间从未停歇的交流与想象。',
        image: 'images/postcard_feitian1.jpg',
        href: 'feitian1.html',
        stamp: '散花',
        x: -9.4,
        z: 16.5,
        camera: { azimuth: -0.12, elevation: 0.25, radius: 13.5, targetX: -9.4, targetZ: 16.5 }
    },
    {
        id: 'feitian2',
        name: '伎乐飞天',
        subtitle: '琵琶反抱，奏一曲天籁',
        description: '不鼓自鸣，弦音穿云。伎乐飞天执琵琶、奏箜篌，将乐舞与想象交织成一处流动的极乐世界。今天，我们仍能从凝固的壁画里听见盛唐的回响。',
        image: 'images/postcard_feitian2.jpg',
        href: 'feitian2.html',
        stamp: '伎乐',
        x: -3.6,
        z: 3.9,
        camera: { azimuth: 0.08, elevation: 0.2, radius: 12.4, targetX: -3.6, targetZ: 3.9 }
    },
    {
        id: 'feitian3',
        name: '九色鹿',
        subtitle: '一念守信，跃入恒河之光',
        description: '神鹿踏莲而来，九色皮毛映照善恶与信义。九色鹿的故事穿越洞窟与时间，把知恩、守诺、向善的愿望留在了鸣沙山的风里。',
        image: 'images/postcard_feitian3.jpg',
        href: 'feitian3.html',
        stamp: '神鹿',
        x: 11.2,
        z: -4.8,
        camera: { azimuth: 0.34, elevation: 0.23, radius: 13.1, targetX: 11.2, targetZ: -4.8 }
    },
    {
        id: 'feitian4',
        name: '供养人',
        subtitle: '把姓氏与心愿留在佛前',
        description: '他们未必留下姓名，却把一整段生活画进石窟。供养人的衣冠、车队与仪仗，让宗教艺术成为一部可以凝视的唐宋社会史，也让普通人的心愿获得了千年尺度。',
        image: 'images/postcard_feitian4.jpg',
        href: 'feitian4.html',
        stamp: '供养',
        x: -7.1,
        z: -12.8,
        camera: { azimuth: -0.22, elevation: 0.22, radius: 13.7, targetX: -7.1, targetZ: -12.8 }
    },
    {
        id: 'ar',
        name: '入窟问境',
        subtitle: '当飞天越过屏幕，与你相遇',
        description: '穿过最后一道石窟门，把壁画里的神女带到现实。数字技术没有替代洞窟，而是为另一代人打开了一条更轻、更近的观看路径。',
        image: 'images/postcard_feitian1.jpg',
        href: 'ar.html',
        stamp: '入窟',
        x: -4.7,
        z: -25.2,
        camera: { azimuth: 0.015, elevation: 0.16, radius: 13.4, targetX: -7.3, targetZ: -28.1 }
    }
];

const STORAGE_KEY = 'dunhuang_route_seals_v1';
const EXPLORE_RETURN_KEY = 'dunhuang_explore_return_v1';
const DANCER_MANIFESTED_KEY = 'dunhuang_dancer_manifested_v1';
const ARCHITECTURE_FORMED_KEY = 'dunhuang_architecture_formed_v1';
const DANCER_MODEL_PATH = 'models/feitian-dancer-lite.glb';
const DANCER_MODEL_CDN = 'https://cdn.jsdelivr.net/gh/YDH548/dunhuang-realm@main/models/feitian-dancer-lite.glb';
const GENERATED_ASSETS = Object.freeze({
    stone: 'images/gen/texture-stone.jpg'
});
const assetState = {
    [GENERATED_ASSETS.stone]: 'pending'
};
const canvas = document.getElementById('scene-canvas');
const nodeLayer = document.getElementById('node-layer');
const introScreen = document.getElementById('introScreen');
const enterWorld = document.getElementById('enterWorld');
const loadingState = document.getElementById('loadingState');
const chapterCard = document.getElementById('chapterCard');
const chapterClose = document.getElementById('chapterClose');
const chapterImage = document.getElementById('chapterImage');
const chapterIndex = document.getElementById('chapterIndex');
const chapterTitle = document.getElementById('chapterTitle');
const chapterSubtitle = document.getElementById('chapterSubtitle');
const chapterDescription = document.getElementById('chapterDescription');
const chapterStamp = document.getElementById('chapterStamp');
const enterStory = document.getElementById('enterStory');
const collectSeal = document.getElementById('collectSeal');
const collectLabel = document.getElementById('collectLabel');
const architectureStory = document.getElementById('architectureStory');
const architectureStoryClose = document.getElementById('architectureStoryClose');
const architectureStoryOverview = document.getElementById('architectureStoryOverview');
const architectureStoryIndex = document.getElementById('architectureStoryIndex');
const architectureStoryTag = document.getElementById('architectureStoryTag');
const architectureStoryTitle = document.getElementById('architectureStoryTitle');
const architectureStorySubtitle = document.getElementById('architectureStorySubtitle');
const architectureStoryDescription = document.getElementById('architectureStoryDescription');
const architectureStoryFacts = document.getElementById('architectureStoryFacts');
const architectureStoryHint = document.getElementById('architectureStoryHint');
const autoTourButton = document.getElementById('autoTour');
const soundButton = document.getElementById('soundToggle');
const resetViewButton = document.getElementById('resetView');
const bgMusic = document.getElementById('bgMusic');
const compassNeedle = document.getElementById('compassNeedle');
const sceneCaption = document.getElementById('sceneCaption');
const journeyStory = document.getElementById('journeyStory');
const journeyStoryIndex = document.getElementById('journeyStoryIndex');
const journeyStoryTitle = document.getElementById('journeyStoryTitle');
const journeyStoryText = document.getElementById('journeyStoryText');
const journeyStoryProgress = document.getElementById('journeyStoryProgress');
const collectedCount = document.getElementById('collectedCount');
const chapterCount = document.getElementById('chapterCount');
const webglError = document.getElementById('webglError');
const particleWhisper = document.getElementById('particleWhisper');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const clock = new THREE.Clock();

const appState = {
    started: false,
    activeChapter: -1,
    autoTour: false,
    soundOn: false,
    dragging: false,
    dragged: false,
    pointerDownAt: 0,
    lastPointerWasDrag: false,
    lastPointerDuration: 0,
    interactionMode: 'camera',
    pauseAutoUntil: 0,
    marks: loadMarks()
};

let renderer;
let scene;
let camera;
let skyMaterial;
let skyMesh;
let lakeMaterial;
let worldGroup;
let routeCurve;
let sunSprite;
let dustPoints;
let lakeGlints;
let ribbons = [];
const atmosphereVeils = [];
let chapterMarkers = [];
let raycastMeshes = [];
const architectureHitTargets = [];
const architectureMeshTargets = [];
let groundPath;
let muralPortal;
let muralPortalVideo;
let muralPortalTexture;
let muralPortalVideoMaterial;
let muralPortalVideoPlane;
const architectureEntries = [];
let activeArchitectureStory = null;
const dancerHitTargets = [];
let celestialDancer;
let dancerAura;
let dancerAuraMaterial;
let dancerCue;
let dancerDanceStartedAt = -1;
let dancerDanceEnergy = 0;
let dancerModelMount;
let dancerModelOrbit;
let dancerAnimationMixer;
let dancerModelMaterials = [];
let dancerModelYaw = 0;
let dancerModelYawTarget = 0;
let dancerManifestation;
let dancerStoryEntry;
const dancerFormation = {
    forming: false,
    formed: false,
    startedAt: -1,
    danceOnComplete: false
};
let dancerHighlightUntil = 0;
let dancerFpsProbe;
const dancerModelState = {
    status: 'idle',
    ready: false,
    file: 'models/feitian-dancer-lite.glb',
    fileSize: 0,
    moduleMs: 0,
    networkMs: 0,
    parseDecodeMs: 0,
    webglUploadMs: 0,
    firstRenderMs: 0,
    stableFps: null,
    triangles: 0,
    vertices: 0,
    drawCalls: 0,
    modelMeshes: 0,
    textureCount: 0,
    animations: 0,
    error: null
};
window.__FEITIAN_PERF__ = dancerModelState;
let journeyCurve;
let journeyRunner;
let caravanGroup;
let caravanBaseX = 0;
let caravanBaseY = 0;
let skyCraneGroup;
let skyCraneBaseX = 0;
let desertReeds;
let journeyState = {
    active: false,
    index: -1,
    nextAt: 0
};

const cameraRig = {
    azimuth: 0.04,
    elevation: 0.19,
    radius: 32,
    target: new THREE.Vector3(-2.2, 4.8, -16.8),
    desiredAzimuth: 0.04,
    desiredElevation: 0.19,
    desiredRadius: 29.5,
    desiredTarget: new THREE.Vector3(-2.2, 4.8, -16.8)
};

const pointerState = {
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    id: null
};

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();
const tempVector = new THREE.Vector3();
const tempVector2 = new THREE.Vector3();

function getOverviewRadius() {
    if (window.innerWidth < 640) return 88;
    if (window.innerWidth < 900) return 44;
    return 36;
}

function loadMarks() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (error) {
        return {};
    }
}

function saveMarks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.marks));
    } catch (error) {
        // Local storage can be unavailable in a private browsing context.
    }
}

function loadFormedArchitectureNames() {
    try {
        const names = JSON.parse(localStorage.getItem(ARCHITECTURE_FORMED_KEY) || '[]');
        return new Set(Array.isArray(names) ? names : []);
    } catch (error) {
        return new Set();
    }
}

async function fetchDancerModelBuffer() {
    const sources = window.location.hostname.endsWith('github.io')
        ? [DANCER_MODEL_CDN, DANCER_MODEL_PATH]
        : [DANCER_MODEL_PATH];
    let lastError;
    for (const source of sources) {
        try {
            const response = await fetch(source, { cache: 'force-cache' });
            if (!response.ok) throw new Error(`GLB request failed: HTTP ${response.status}`);
            return {
                buffer: await response.arrayBuffer(),
                source
            };
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError || new Error('Unable to fetch dancer model');
}

function persistArchitectureFormation(name) {
    try {
        const names = loadFormedArchitectureNames();
        names.add(name);
        localStorage.setItem(ARCHITECTURE_FORMED_KEY, JSON.stringify([...names]));
    } catch (error) {
        // The current visit still keeps the formed architecture visible.
    }
}

function randomFactory(seed) {
    let value = seed >>> 0;
    return function random() {
        value += 0x6D2B79F5;
        let result = value;
        result = Math.imul(result ^ result >>> 15, result | 1);
        result ^= result + Math.imul(result ^ result >>> 7, result | 61);
        return ((result ^ result >>> 14) >>> 0) / 4294967296;
    };
}

const random = randomFactory(1688);

function terrainHeight(x, z) {
    const longSwell = Math.sin(x * 0.17 + z * 0.1) * 0.24;
    const crossSwell = Math.sin(z * 0.29 - x * 0.085) * 0.13;
    const windRipple = Math.sin(x * 0.62 + z * 0.18) * 0.035;
    const basin = Math.exp(-((x - 10) ** 2 + (z + 17) ** 2) / 160) * -0.36;
    return 0.26 + longSwell + crossSwell + windRipple + basin;
}

function makeRadialTexture() {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 256;
    textureCanvas.height = 256;
    const context = textureCanvas.getContext('2d');
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 226, 164, 0.95)');
    gradient.addColorStop(0.2, 'rgba(239, 181, 92, 0.5)');
    gradient.addColorStop(0.55, 'rgba(220, 137, 61, 0.13)');
    gradient.addColorStop(1, 'rgba(220, 137, 61, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

function makeGrottoTexture() {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 768;
    textureCanvas.height = 768;
    const context = textureCanvas.getContext('2d');

    const wall = context.createLinearGradient(0, 0, 768, 768);
    wall.addColorStop(0, '#b8734d');
    wall.addColorStop(0.5, '#8e4d35');
    wall.addColorStop(1, '#5a3026');
    context.fillStyle = wall;
    context.fillRect(0, 0, 768, 768);

    for (let i = 0; i < 620; i += 1) {
        const alpha = 0.015 + random() * 0.06;
        context.fillStyle = random() > 0.45
            ? `rgba(255, 218, 164, ${alpha})`
            : `rgba(45, 20, 14, ${alpha})`;
        context.beginPath();
        context.arc(random() * 768, random() * 768, 1 + random() * 8, 0, Math.PI * 2);
        context.fill();
    }

    context.strokeStyle = 'rgba(245, 199, 119, 0.34)';
    context.lineWidth = 2;
    context.strokeRect(24, 24, 720, 720);
    context.strokeStyle = 'rgba(70, 31, 22, 0.52)';
    context.strokeRect(42, 42, 684, 684);

    const archCenters = [246, 522];
    archCenters.forEach((cx, index) => {
        context.save();
        context.beginPath();
        context.moveTo(cx - 105, 590);
        context.lineTo(cx - 105, 315);
        context.quadraticCurveTo(cx - 102, 182, cx, 176);
        context.quadraticCurveTo(cx + 102, 182, cx + 105, 315);
        context.lineTo(cx + 105, 590);
        context.closePath();
        const voidGradient = context.createLinearGradient(cx, 170, cx, 590);
        voidGradient.addColorStop(0, '#26120e');
        voidGradient.addColorStop(1, '#080505');
        context.fillStyle = voidGradient;
        context.fill();
        context.strokeStyle = index === 0 ? '#d7a65c' : '#7d9a85';
        context.lineWidth = 7;
        context.stroke();
        context.restore();
    });

    context.fillStyle = 'rgba(244, 199, 118, 0.52)';
    for (let i = 0; i < 11; i += 1) {
        const x = 80 + i * 61;
        context.beginPath();
        context.arc(x, 681, 8, 0, Math.PI * 2);
        context.fill();
    }

    context.strokeStyle = 'rgba(248, 205, 127, 0.42)';
    context.lineWidth = 3;
    for (let i = 0; i < 26; i += 1) {
        const x = 48 + i * 27;
        context.beginPath();
        context.moveTo(x, 90);
        context.quadraticCurveTo(x + 10, 112, x, 135);
        context.stroke();
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

function makeTerrainTexture() {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 768;
    textureCanvas.height = 768;
    const context = textureCanvas.getContext('2d');
    const base = context.createLinearGradient(0, 0, 768, 768);
    base.addColorStop(0, '#6c4838');
    base.addColorStop(0.48, '#8e6448');
    base.addColorStop(1, '#54372e');
    context.fillStyle = base;
    context.fillRect(0, 0, 768, 768);

    for (let i = 0; i < 6200; i += 1) {
        const tone = random();
        context.fillStyle = tone > 0.62
            ? `rgba(232, 196, 139, ${0.015 + random() * 0.06})`
            : `rgba(39, 25, 22, ${0.015 + random() * 0.065})`;
        const radius = 0.35 + random() * 2.4;
        context.beginPath();
        context.arc(random() * 768, random() * 768, radius, 0, Math.PI * 2);
        context.fill();
    }

    for (let i = 0; i < 34; i += 1) {
        const y = random() * 768;
        context.beginPath();
        context.moveTo(-40, y);
        context.bezierCurveTo(180, y - 40 + random() * 80, 480, y + 35 - random() * 70, 808, y - 10);
        context.strokeStyle = random() > 0.45
            ? `rgba(238, 198, 135, ${0.025 + random() * 0.055})`
            : `rgba(35, 21, 19, ${0.035 + random() * 0.065})`;
        context.lineWidth = 0.6 + random() * 2.5;
        context.stroke();
    }

    for (let i = 0; i < 16; i += 1) {
        let x = random() * 768;
        let y = random() * 768;
        context.beginPath();
        context.moveTo(x, y);
        for (let step = 0; step < 5; step += 1) {
            x += (random() - 0.5) * 44;
            y += 10 + random() * 34;
            context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(24, 17, 16, ${0.08 + random() * 0.13})`;
        context.lineWidth = 0.8 + random();
        context.stroke();
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5.2, 5.2);
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return texture;
}

function makeRockTexture() {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 512;
    const context = textureCanvas.getContext('2d');
    const base = context.createLinearGradient(0, 0, 512, 512);
    base.addColorStop(0, '#463733');
    base.addColorStop(0.5, '#65493b');
    base.addColorStop(1, '#302825');
    context.fillStyle = base;
    context.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 4200; i += 1) {
        context.fillStyle = random() > 0.7
            ? `rgba(208, 163, 96, ${random() * 0.055})`
            : `rgba(18, 15, 15, ${random() * 0.08})`;
        context.fillRect(random() * 512, random() * 512, 1 + random() * 3, 1 + random() * 3);
    }

    for (let i = 0; i < 22; i += 1) {
        context.beginPath();
        let x = random() * 512;
        let y = -20;
        context.moveTo(x, y);
        while (y < 532) {
            x += (random() - 0.5) * 18;
            y += 25 + random() * 42;
            context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(17, 14, 14, ${0.1 + random() * 0.15})`;
        context.lineWidth = 0.7 + random() * 2.4;
        context.stroke();
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2.4, 2.4);
    return texture;
}

function makeRockGeometry(seed, detail = 2) {
    const geometry = new THREE.IcosahedronGeometry(1, detail);
    const positions = geometry.attributes.position;
    const localRandom = randomFactory(seed);
    const point = new THREE.Vector3();

    for (let i = 0; i < positions.count; i += 1) {
        point.fromBufferAttribute(positions, i);
        const wave =
            Math.sin(point.x * 3.7 + seed * 0.01) * 0.075 +
            Math.cos(point.y * 4.2 - seed * 0.013) * 0.055 +
            Math.sin(point.z * 5.1 + point.y * 2.3) * 0.045 +
            (localRandom() - 0.5) * 0.04;
        point.multiplyScalar(1 + wave);
        positions.setXYZ(i, point.x, point.y, point.z);
    }
    geometry.computeVertexNormals();
    return geometry;
}

function loadPbrTextureSet(name, repeatX = 2.5, repeatY = 2.5) {
    const loader = new THREE.TextureLoader();
    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const map = loader.load(`images/textures/${name}_diff_1k.jpg`);
    const normalMap = loader.load(`images/textures/${name}_nor_1k.jpg`);
    const roughnessMap = loader.load(`images/textures/${name}_rough_1k.jpg`);

    [map, normalMap, roughnessMap].forEach((texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);
        texture.anisotropy = maxAnisotropy;
    });
    map.colorSpace = THREE.SRGBColorSpace;
    return { map, normalMap, roughnessMap };
}

function updateAssetState() {
    const states = Object.values(assetState);
    let status = 'ready';
    if (states.includes('error')) {
        status = 'error';
    } else if (states.some((state) => state !== 'loaded')) {
        status = 'loading';
    }
    const root = document.documentElement;
    root.dataset.sceneAssets = status;
    root.dataset.sceneAssetStone = assetState[GENERATED_ASSETS.stone];
}

function configureGeneratedTexture(texture, options = {}) {
    const {
        repeatX = 1,
        repeatY = 1,
        dataTexture = false,
        mirrored = texture.name === GENERATED_ASSETS.stone
    } = options;
    texture.wrapS = mirrored ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
    texture.wrapT = mirrored ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.colorSpace = dataTexture ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
    return texture;
}

function loadGeneratedTexture(path, options = {}, onLoad = null) {
    if (assetState[path] !== 'loaded') {
        assetState[path] = 'loading';
        updateAssetState();
    }
    const texture = new THREE.TextureLoader().load(
        path,
        (loadedTexture) => {
            configureGeneratedTexture(loadedTexture, options);
            if (onLoad) onLoad(loadedTexture);
            assetState[path] = 'loaded';
            updateAssetState();
        },
        undefined,
        () => {
            assetState[path] = 'error';
            updateAssetState();
            console.warn(`场景图片加载失败: ${path}`);
        }
    );
    texture.name = path;
    return configureGeneratedTexture(texture, options);
}

function fitTextureToAspect(texture, sourceAspect, targetAspect) {
    texture.repeat.set(1, 1);
    texture.offset.set(0, 0);
    if (sourceAspect > targetAspect) {
        texture.repeat.x = targetAspect / sourceAspect;
        texture.offset.x = (1 - texture.repeat.x) * 0.5;
    } else if (sourceAspect < targetAspect) {
        texture.repeat.y = sourceAspect / targetAspect;
        texture.offset.y = (1 - texture.repeat.y) * 0.5;
    }
    texture.needsUpdate = true;
}

function init() {
    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: !isCoarsePointer,
            powerPreference: 'high-performance'
        });
    } catch (error) {
        showWebglError();
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCoarsePointer ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.48;
    renderer.shadowMap.enabled = !isCoarsePointer;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x140c08, 1);

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xc2ad94, 0.0068);
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 180);
    worldGroup = new THREE.Group();
    scene.add(worldGroup);

    buildEnvironmentMap();
    buildSky();
    buildLights();
    buildMountains();
    buildAtmosphereVeils();
    buildCaveFrame();
    buildMuralPortal();
    buildTerrain();
    buildCrescentLake();
    buildRoute();
    buildArchitectureSystem();
    buildAmbientLife();
    createCelestialDancer();
    buildJourneyThread();
    buildRibbons();
    buildDust();
    buildChapterMarkers();

    updateCamera(true);
    bindEvents();
    const params = new URLSearchParams(window.location.search);
    let resumeOverview = params.get('view') === 'explore';
    try {
        resumeOverview = resumeOverview || sessionStorage.getItem(EXPLORE_RETURN_KEY) === '1';
    } catch (error) {
        // URL-based return still works when session storage is unavailable.
    }
    if (resumeOverview) {
        enterWorldScene(true);
        history.replaceState(null, '', window.location.pathname);
    }
    updateRouteUI();
    animate();
    loadCelestialDancerModel();

    window.__DUNHUANG_SCENE__ = {
        startDancerDance: startCelestialDance,
        setDancerView(azimuth = 0, elevation = 0.14, radius = 12.4) {
            if (!celestialDancer) return;
            const target = celestialDancer.root.position;
            cameraRig.desiredTarget.set(target.x, target.y + 3.25, target.z);
            cameraRig.desiredAzimuth = azimuth;
            cameraRig.desiredElevation = elevation;
            cameraRig.desiredRadius = radius;
            cameraRig.azimuth = azimuth;
            cameraRig.elevation = elevation;
            cameraRig.radius = radius;
            cameraRig.target.copy(cameraRig.desiredTarget);
            appState.pauseAutoUntil = performance.now() + 60000;
            updateCamera();
        },
        getDancerPose() {
            if (!celestialDancer) return null;
            return {
                modelStatus: dancerModelState.status,
                modelReady: dancerModelState.ready,
                torsoY: celestialDancer.torso.rotation.y,
                torsoZ: celestialDancer.torso.rotation.z,
                leftShoulderZ: celestialDancer.arms.left.shoulder.rotation.z,
                leftElbowZ: celestialDancer.arms.left.elbow.rotation.z,
                rightShoulderZ: celestialDancer.arms.right.shoulder.rotation.z,
                rightElbowZ: celestialDancer.arms.right.elbow.rotation.z,
                headY: celestialDancer.head.rotation.y,
                energy: dancerDanceEnergy
            };
        },
        getDancerModelState() {
            return {
                ...dancerModelState,
                mountRotationY: dancerModelMount?.rotation.y ?? null,
                mountY: dancerModelMount?.position.y ?? null,
                modelVisible: Boolean(dancerModelMount?.visible),
                manifestationVisible: Boolean(dancerManifestation?.points.visible),
                formation: {
                    forming: dancerFormation.forming,
                    formed: dancerFormation.formed
                },
                highlightActive: clock.elapsedTime < dancerHighlightUntil,
                videoBackdropVisible: Boolean(muralPortalVideoPlane?.visible),
                videoFallbackVisible: Boolean(muralPortalVideoPlane?.visible)
            };
        },
        getDancerModelScreenRect() {
            if (!dancerModelMount) return null;
            dancerModelMount.updateWorldMatrix(true, true);
            const box = new THREE.Box3().setFromObject(dancerModelMount);
            const points = [];
            [box.min.x, box.max.x].forEach((x) => {
                [box.min.y, box.max.y].forEach((y) => {
                    [box.min.z, box.max.z].forEach((z) => {
                        points.push(new THREE.Vector3(x, y, z).project(camera));
                    });
                });
            });
            const xs = points.map((point) => (point.x * 0.5 + 0.5) * window.innerWidth);
            const ys = points.map((point) => (-point.y * 0.5 + 0.5) * window.innerHeight);
            const projectedCenter = box.getCenter(new THREE.Vector3()).project(camera);
            return {
                left: Math.min(...xs),
                right: Math.max(...xs),
                top: Math.min(...ys),
                bottom: Math.max(...ys),
                centerX: (projectedCenter.x * 0.5 + 0.5) * window.innerWidth,
                centerY: (-projectedCenter.y * 0.5 + 0.5) * window.innerHeight
            };
        },
        getDancerScreenCenter() {
            if (!celestialDancer) return null;
            const box = new THREE.Box3().setFromObject(celestialDancer.root);
            const center = box.getCenter(new THREE.Vector3()).project(camera);
            return {
                x: (center.x * 0.5 + 0.5) * window.innerWidth,
                y: (-center.y * 0.5 + 0.5) * window.innerHeight
            };
        },
        setDancerReviewMode(enabled) {
            if (!celestialDancer) return false;
            if (!this._reviewVisibility) {
                this._reviewVisibility = new Map();
                this._reviewFog = scene.fog;
            }
            if (enabled) {
                worldGroup.children.forEach((child) => {
                    if (!this._reviewVisibility.has(child)) {
                        this._reviewVisibility.set(child, child.visible);
                    }
                    child.visible = child === celestialDancer.root;
                });
                if (skyMesh) {
                    if (!this._reviewVisibility.has(skyMesh)) this._reviewVisibility.set(skyMesh, skyMesh.visible);
                    skyMesh.visible = false;
                }
                if (sunSprite) {
                    if (!this._reviewVisibility.has(sunSprite)) this._reviewVisibility.set(sunSprite, sunSprite.visible);
                    sunSprite.visible = false;
                }
                scene.fog = null;
                renderer.setClearColor(0xf3eee5, 1);
            } else {
                this._reviewVisibility.forEach((visible, object) => { object.visible = visible; });
                this._reviewVisibility.clear();
                scene.fog = this._reviewFog;
                renderer.setClearColor(0x140c08, 1);
            }
            dancerCue.classList.toggle('is-visible', !enabled);
            return true;
        },
        frameDancerForReview() {
            if (!celestialDancer) return null;
            celestialDancer.root.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(celestialDancer.root);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            camera.fov = 34;
            camera.updateProjectionMatrix();
            const verticalDistance = size.y / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)));
            const horizontalDistance = size.x / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * camera.aspect * 0.5)));
            const radius = Math.max(verticalDistance, horizontalDistance) * 1.08;
            cameraRig.target.copy(center);
            cameraRig.desiredTarget.copy(center);
            cameraRig.azimuth = 0;
            cameraRig.desiredAzimuth = 0;
            cameraRig.elevation = 0;
            cameraRig.desiredElevation = 0;
            cameraRig.radius = radius;
            cameraRig.desiredRadius = radius;
            updateCamera();
            return { center: center.toArray(), size: size.toArray(), radius };
        },
        hitTestDancer(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointerNdc, camera);
            return raycaster.intersectObjects(dancerHitTargets, false).length;
        },
        getArchitectureState() {
            return architectureEntries.map((entry) => ({
                name: entry.name,
                forming: entry.forming,
                formed: entry.formed,
                particleOpacity: entry.cloud.material.uniforms.uOpacity.value
            }));
        },
        focusArchitectureByName(name) {
            const entry = architectureEntries.find((item) => item.name === name);
            if (!entry) return false;
            focusArchitecture(entry);
            return true;
        },
        getArchitectureScreenCenter(name) {
            const entry = architectureEntries.find((item) => item.name === name);
            if (!entry) return null;
            const bounds = getProjectedObjectBounds(entry.finalGroup.visible ? entry.finalGroup : entry.cloud.points);
            return {
                x: (bounds.left + bounds.right) * 0.5,
                y: (bounds.top + bounds.bottom) * 0.5
            };
        },
        getArchitectureScreenRect(name) {
            const entry = architectureEntries.find((item) => item.name === name);
            if (!entry) return null;
            return getProjectedObjectBounds(entry.finalGroup.visible ? entry.finalGroup : entry.cloud.points);
        },
        getArchitectureStoryState() {
            const rect = architectureStory.getBoundingClientRect();
            return {
                active: activeArchitectureStory?.name || null,
                visible: architectureStory.classList.contains('is-visible'),
                ariaHidden: architectureStory.getAttribute('aria-hidden'),
                inert: architectureStory.inert,
                title: architectureStoryTitle.textContent,
                subtitle: architectureStorySubtitle.textContent,
                description: architectureStoryDescription.textContent,
                facts: [...architectureStoryFacts.children].map((item) => item.textContent),
                rect: {
                    left: Math.round(rect.left),
                    top: Math.round(rect.top),
                    right: Math.round(rect.right),
                    bottom: Math.round(rect.bottom)
                }
            };
        },
        getOverviewScreenState() {
            const dancer = this.getDancerScreenCenter();
            const architecture = Object.fromEntries(architectureEntries.map((entry) => [
                entry.name,
                this.getArchitectureScreenCenter(entry.name)
            ]));
            return {
                dancer,
                architecture,
                autoTour: appState.autoTour,
                journeyActive: journeyState.active
            };
        }
    };

    setTimeout(() => loadingState.classList.add('is-hidden'), 420);
}

function buildSky() {
    const skyGeometry = new THREE.SphereGeometry(92, 32, 20);
    skyMaterial = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
            topColor: { value: new THREE.Color(0x142534) },
            upperColor: { value: new THREE.Color(0x485d68) },
            horizonColor: { value: new THREE.Color(0xe0b77f) },
            lowColor: { value: new THREE.Color(0x5a3b2d) },
            sunColor: { value: new THREE.Color(0xffd7a0) }
        },
        vertexShader: `
            varying vec3 vDirection;
            void main() {
                vDirection = normalize(position);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 upperColor;
            uniform vec3 horizonColor;
            uniform vec3 lowColor;
            uniform vec3 sunColor;
            varying vec3 vDirection;

            void main() {
                float height = vDirection.y;
                vec3 color = mix(lowColor, horizonColor, smoothstep(-0.35, -0.01, height));
                color = mix(color, upperColor, smoothstep(0.0, 0.43, height));
                color = mix(color, topColor, smoothstep(0.36, 0.95, height));

                vec3 sunDirection = normalize(vec3(-0.42, 0.12, -1.0));
                float sun = pow(max(dot(vDirection, sunDirection), 0.0), 250.0);
                float sunGlow = pow(max(dot(vDirection, sunDirection), 0.0), 16.0);
                color += sunColor * sun * 1.2;
                color += sunColor * sunGlow * 0.13;

                float haze = smoothstep(-0.04, 0.09, height) * (1.0 - smoothstep(0.09, 0.25, height));
                color += vec3(0.055, 0.038, 0.03) * haze;
                gl_FragColor = vec4(color, 1.0);
            }
        `
    });
    skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyMesh);

    const haloTexture = makeRadialTexture();
    const spriteMaterial = new THREE.SpriteMaterial({
        map: haloTexture,
        color: 0xffcc86,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.5
    });
    sunSprite = new THREE.Sprite(spriteMaterial);
    sunSprite.position.set(-39, 20, -82);
    sunSprite.scale.set(27, 27, 1);
    scene.add(sunSprite);
}

function buildLights() {
    const hemisphere = new THREE.HemisphereLight(0xd1dde0, 0x4a2d1e, 1.12);
    scene.add(hemisphere);

    const sun = new THREE.DirectionalLight(0xffc986, 3.45);
    sun.position.set(-24, 34, 15);
    sun.castShadow = !isCoarsePointer;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -35;
    sun.shadow.camera.right = 35;
    sun.shadow.camera.top = 35;
    sun.shadow.camera.bottom = -35;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 90;
    sun.shadow.bias = -0.0007;
    scene.add(sun);

    const ambientFill = new THREE.DirectionalLight(0x75a0bb, 0.9);
    ambientFill.position.set(24, 12, 18);
    scene.add(ambientFill);

    const portalSpill = new THREE.PointLight(0xffbd72, 30, 38, 1.65);
    portalSpill.position.set(-7.5, 6.5, -27);
    scene.add(portalSpill);
}

function buildEnvironmentMap() {
    const environmentCanvas = document.createElement('canvas');
    environmentCanvas.width = 1024;
    environmentCanvas.height = 512;
    const context = environmentCanvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#173246');
    gradient.addColorStop(0.38, '#6f8390');
    gradient.addColorStop(0.56, '#d3ab7c');
    gradient.addColorStop(0.72, '#5c3b2b');
    gradient.addColorStop(1, '#17110e');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1024, 512);
    const glow = context.createRadialGradient(280, 228, 0, 280, 228, 180);
    glow.addColorStop(0, 'rgba(255, 226, 166, 0.92)');
    glow.addColorStop(0.25, 'rgba(238, 180, 104, 0.32)');
    glow.addColorStop(1, 'rgba(238, 180, 104, 0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, 1024, 512);
    const environmentSource = new THREE.CanvasTexture(environmentCanvas);
    environmentSource.mapping = THREE.EquirectangularReflectionMapping;
    environmentSource.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(environmentSource).texture;
    environmentSource.dispose();
    pmrem.dispose();
}

function buildAtmosphereVeils() {
    const veilPalette = [0xe2bd83, 0x7fa9a2, 0x6a86a0, 0xb3684f];
    for (let index = 0; index < 7; index += 1) {
        const veil = new THREE.Sprite(new THREE.SpriteMaterial({
            map: makeRadialTexture(),
            color: veilPalette[index % veilPalette.length],
            transparent: true,
            opacity: 0.055 + (index % 3) * 0.012,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        veil.position.set(
            -18 + index * 6.2,
            2.8 + (index % 3) * 2.1,
            -22 - (index % 4) * 4.8
        );
        veil.scale.set(17 + (index % 2) * 6, 5.5 + (index % 3) * 1.8, 1);
        veil.userData.phase = index * 1.37;
        atmosphereVeils.push(veil);
        worldGroup.add(veil);
    }
}

function createDuneGeometry(width, depth, height, seed) {
    const geometry = new THREE.PlaneGeometry(width, depth, 54, 24);
    geometry.rotateX(-Math.PI / 2);
    const positions = geometry.attributes.position;
    const colors = [];
    const low = new THREE.Color(0x8b6245);
    const high = new THREE.Color(0xd9b47d);
    const color = new THREE.Color();

    for (let i = 0; i < positions.count; i += 1) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const across = z / depth + 0.5;
        const crest = Math.pow(Math.max(0, Math.sin(across * Math.PI)), 1.35);
        const drift = Math.sin(x * 0.17 + seed) * height * 0.08;
        const ripple = Math.sin(x * 0.72 + z * 0.34 + seed * 2.1) * 0.09;
        const y = height * crest * (0.78 + drift / Math.max(height, 0.1)) + ripple;
        positions.setY(i, y);
        color.copy(low).lerp(high, THREE.MathUtils.clamp(y / Math.max(height, 0.1), 0, 1));
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    return geometry;
}

function createMountainSilhouette(width, height, seed, color) {
    const shape = new THREE.Shape();
    shape.moveTo(-width * 0.5, 0);
    const steps = 28;
    for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        const x = -width * 0.5 + t * width;
        const ridge = height * (
            0.28 +
            Math.sin(t * Math.PI) * 0.5 +
            Math.sin(t * Math.PI * 3.1 + seed) * 0.12 +
            Math.sin(t * Math.PI * 7.7 - seed) * 0.045
        );
        shape.lineTo(x, ridge);
    }
    shape.lineTo(width * 0.5, 0);
    shape.closePath();
    return new THREE.Mesh(
        new THREE.ShapeGeometry(shape),
        new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.76,
            depthWrite: false,
            side: THREE.DoubleSide
        })
    );
}

function buildMountains() {
    const silhouettes = [
        { z: -69, y: 1.2, width: 104, height: 22, seed: 1.2, color: 0x1b2931 },
        { z: -61, y: 0.8, width: 92, height: 17, seed: 3.4, color: 0x293b43 },
        { z: -53, y: 0.5, width: 78, height: 12, seed: 5.1, color: 0x3d4543 }
    ];
    silhouettes.forEach((layer) => {
        const ridge = createMountainSilhouette(layer.width, layer.height, layer.seed, layer.color);
        ridge.position.set(0, layer.y, layer.z);
        worldGroup.add(ridge);
    });

    const sandTextures = loadPbrTextureSet('dense_sand', 4.8, 4.8);
    const duneMaterial = new THREE.MeshStandardMaterial({
        ...sandTextures,
        color: 0xd0aa7b,
        vertexColors: true,
        roughness: 1,
        metalness: 0,
        normalScale: new THREE.Vector2(0.42, 0.42)
    });

    const dunes = [
        { x: -22, z: 9, width: 33, depth: 34, height: 7.2, rotation: 0.2, seed: 0.8 },
        { x: 34, z: 11, width: 22, depth: 24, height: 4.8, rotation: -0.28, seed: 2.2 },
        { x: -30, z: -15, width: 24, depth: 27, height: 7.2, rotation: 0.48, seed: 4.4 },
        { x: 38, z: -16, width: 20, depth: 23, height: 5.5, rotation: -0.42, seed: 6.1 },
        { x: -4, z: -46, width: 46, depth: 17, height: 7.4, rotation: 0.04, seed: 8.2 }
    ];
    dunes.forEach((dune) => {
        const mesh = new THREE.Mesh(
            createDuneGeometry(dune.width, dune.depth, dune.height, dune.seed),
            duneMaterial
        );
        mesh.position.set(dune.x, terrainHeight(dune.x, dune.z) - 0.35, dune.z);
        mesh.rotation.y = dune.rotation;
        mesh.castShadow = !isCoarsePointer;
        mesh.receiveShadow = true;
        worldGroup.add(mesh);
    });

    const cliffTextures = loadPbrTextureSet('cliff_side', 2.8, 1.5);
    const stoneDetail = loadGeneratedTexture(GENERATED_ASSETS.stone, {
        repeatX: 2.8,
        repeatY: 1.55
    });
    const cliffMaterial = new THREE.MeshStandardMaterial({
        ...cliffTextures,
        map: stoneDetail,
        color: 0xa98f7f,
        roughness: 0.99,
        normalScale: new THREE.Vector2(0.58, 0.58)
    });
    const cliffWall = new THREE.Mesh(makeRockGeometry(411, 3), cliffMaterial);
    cliffWall.position.set(-0.5, 8.1, -37.5);
    cliffWall.scale.set(39, 12.5, 3.8);
    cliffWall.rotation.z = -0.018;
    cliffWall.receiveShadow = true;
    worldGroup.add(cliffWall);
}

function buildCaveFrame() {
    const cliffTextures = loadPbrTextureSet('cliff_side', 1.5, 1.8);
    const darkRockTextures = loadPbrTextureSet('dark_rock_02', 1.7, 2.2);
    const cliffStone = loadGeneratedTexture(GENERATED_ASSETS.stone, {
        repeatX: 2.1,
        repeatY: 2.7
    });
    const darkStone = loadGeneratedTexture(GENERATED_ASSETS.stone, {
        repeatX: 1.55,
        repeatY: 2.2
    });
    const materials = [
        new THREE.MeshStandardMaterial({
            ...cliffTextures,
            map: cliffStone,
            color: 0xc8b39f,
            roughness: 0.98,
            metalness: 0.01,
            normalScale: new THREE.Vector2(0.62, 0.62)
        }),
        new THREE.MeshStandardMaterial({
            ...darkRockTextures,
            map: darkStone,
            color: 0xb8aa9c,
            roughness: 0.99,
            metalness: 0,
            normalScale: new THREE.Vector2(0.6, 0.6)
        }),
        new THREE.MeshStandardMaterial({
            ...cliffTextures,
            map: cliffStone,
            color: 0xb99e8c,
            roughness: 0.97,
            metalness: 0,
            normalScale: new THREE.Vector2(0.7, 0.7)
        })
    ];
    const cliffBacking = new THREE.Mesh(
        new THREE.PlaneGeometry(54, 24, 24, 12),
        new THREE.MeshStandardMaterial({
            ...cliffTextures,
            map: cliffStone,
            color: 0x715a4c,
            roughness: 1,
            metalness: 0,
            normalScale: new THREE.Vector2(0.42, 0.42),
            side: THREE.DoubleSide
        })
    );
    cliffBacking.position.set(-0.5, 7.5, -35.9);
    cliffBacking.receiveShadow = true;
    worldGroup.add(cliffBacking);

    const formations = [
        [-30.0, 11.0, -38.0, 5.0, 8.0, 5.2, 0.14],
        [30.0, 11.0, -38.0, 5.0, 8.0, 5.2, -0.14]
    ];

    formations.forEach((data, index) => {
        const [x, y, z, sx, sy, sz, rotation] = data;
        const rock = new THREE.Mesh(
            makeRockGeometry(900 + index * 37, isCoarsePointer ? 2 : 3),
            materials[index % materials.length]
        );
        rock.position.set(x, y, z);
        rock.scale.set(sx, sy, sz);
        rock.rotation.set((random() - 0.5) * 0.15, rotation, (random() - 0.5) * 0.1);
        rock.castShadow = !isCoarsePointer;
        rock.receiveShadow = true;
        worldGroup.add(rock);
    });

    const ledgeMaterial = materials[0];
    [-1, 1].forEach((side) => {
        const ledge = new THREE.Mesh(makeRockGeometry(side > 0 ? 1222 : 1333, 2), ledgeMaterial);
        ledge.position.set(side * 27.0, 0.55, 0);
        ledge.scale.set(3.2, 0.48, 11.5);
        ledge.rotation.z = side * 0.03;
        ledge.castShadow = !isCoarsePointer;
        ledge.receiveShadow = true;
        worldGroup.add(ledge);
    });
}

function makePortalMaskTexture() {
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = 512;
    maskCanvas.height = 512;
    const context = maskCanvas.getContext('2d');
    context.clearRect(0, 0, 512, 512);
    context.fillStyle = '#fff';
    context.shadowColor = '#fff';
    context.shadowBlur = 12;
    context.beginPath();
    context.moveTo(18, 500);
    context.lineTo(18, 226);
    context.bezierCurveTo(18, 66, 144, 18, 256, 18);
    context.bezierCurveTo(368, 18, 494, 66, 494, 226);
    context.lineTo(494, 500);
    context.closePath();
    context.fill();
    const texture = new THREE.CanvasTexture(maskCanvas);
    texture.needsUpdate = true;
    return texture;
}

function buildMuralPortal() {
    const group = new THREE.Group();
    group.position.set(-7.8, 0, 0);
    const portalPlaneAspect = 16.2 / 9.2;
    const portalMask = makePortalMaskTexture();
    const fallbackTexture = new THREE.TextureLoader().load(
        'images/postcard_feitian1.jpg',
        (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            const imageAspect = texture.image.naturalWidth / Math.max(1, texture.image.naturalHeight);
            fitTextureToAspect(texture, imageAspect, portalPlaneAspect);
        }
    );

    const outer = new THREE.Mesh(
        new THREE.PlaneGeometry(18.8, 11.6),
        new THREE.MeshStandardMaterial({
            color: 0x221917,
            roughness: 0.92,
            emissive: 0x130b08,
            emissiveIntensity: 0.2,
            alphaMap: portalMask,
            alphaTest: 0.08,
            transparent: true
        })
    );
    outer.position.set(0, 6.2, -31.7);
    group.add(outer);

    const videoMaterial = new THREE.MeshBasicMaterial({
        map: fallbackTexture,
        toneMapped: false,
        transparent: true,
        opacity: 0.96,
        alphaMap: portalMask,
        alphaTest: 0.08
    });
    muralPortalVideoMaterial = videoMaterial;
    const portalPlane = new THREE.Mesh(new THREE.PlaneGeometry(16.2, 9.2), videoMaterial);
    portalPlane.position.set(0, 6.25, -31.35);
    portalPlane.visible = true;
    muralPortalVideoPlane = portalPlane;
    group.add(portalPlane);

    muralPortalVideo = document.createElement('video');
    muralPortalVideo.src = 'images/feitian1.mp4';
    muralPortalVideo.poster = 'images/postcard_feitian1.jpg';
    muralPortalVideo.muted = true;
    muralPortalVideo.loop = true;
    muralPortalVideo.playsInline = true;
    muralPortalVideo.preload = 'auto';
    muralPortalVideo.setAttribute('aria-hidden', 'true');
    muralPortalVideo.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-10px;bottom:-10px;';
    document.body.appendChild(muralPortalVideo);

    muralPortalVideo.addEventListener('loadedmetadata', () => {
        muralPortalTexture = new THREE.VideoTexture(muralPortalVideo);
        muralPortalTexture.colorSpace = THREE.SRGBColorSpace;
        muralPortalTexture.minFilter = THREE.LinearFilter;
        muralPortalTexture.magFilter = THREE.LinearFilter;

        const videoAspect = muralPortalVideo.videoWidth / Math.max(1, muralPortalVideo.videoHeight);
        fitTextureToAspect(muralPortalTexture, videoAspect, portalPlaneAspect);
        videoMaterial.map = muralPortalTexture;
        videoMaterial.needsUpdate = true;
    });
    muralPortalVideo.addEventListener('canplay', () => {
        muralPortalVideo.play().catch(() => {});
    });
    muralPortalVideo.load();

    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xd0a05a,
        emissive: 0x6b4121,
        emissiveIntensity: 0.62,
        roughness: 0.38,
        metalness: 0.52,
        transparent: true,
        opacity: 0.74
    });
    const arch = new THREE.Mesh(
        new THREE.TorusGeometry(8.25, 0.075, 8, 92, Math.PI),
        goldMaterial
    );
    arch.position.set(0, 3.2, -30.98);
    group.add(arch);

    [-8.25, 8.25].forEach((x) => {
        const column = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.13, 6.4, 10), goldMaterial);
        column.position.set(x, 0.05, -30.98);
        group.add(column);

        const capital = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.22, 0.55), goldMaterial);
        capital.position.set(x, 0.52, -30.92);
        group.add(capital);
    });

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeRadialTexture(),
        color: 0xffa955,
        transparent: true,
        opacity: 0.26,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    halo.position.set(0, 6.3, -31.05);
    halo.scale.set(27, 21, 1);
    group.add(halo);

    for (let i = 0; i < 11; i += 1) {
        const t = i / 10;
        const drifter = new THREE.Sprite(new THREE.SpriteMaterial({
            map: makeRadialTexture(),
            color: i % 3 === 0 ? 0x69a294 : 0xffc069,
            transparent: true,
            opacity: 0.24 + random() * 0.34,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        const angle = Math.PI * (0.08 + t * 0.84);
        drifter.position.set(Math.cos(angle) * (9.5 + random() * 1.7), 3.0 + Math.sin(angle) * 8.4, -30.7);
        drifter.scale.setScalar(0.22 + random() * 0.42);
        group.add(drifter);
    }

    muralPortal = group;
    worldGroup.add(group);
}

function setPortalVideoBackdrop(enabled) {
    if (!muralPortalVideoPlane || !muralPortalVideoMaterial || !muralPortalVideo) return;
    muralPortalVideoPlane.visible = enabled;
    muralPortalVideoMaterial.opacity = enabled ? 0.84 : 0;
    if (enabled) {
        try {
            if (muralPortalVideo.paused && muralPortalVideo.readyState < 2) {
                muralPortalVideo.load();
            }
        } catch (error) {
            // The poster remains usable until the background video is ready.
        }
        muralPortalVideo.play().catch(() => {});
    } else {
        muralPortalVideo.pause();
    }
}

function buildTerrain() {
    const geometry = new THREE.PlaneGeometry(82, 88, 88, 88);
    geometry.rotateX(-Math.PI / 2);

    const positions = geometry.attributes.position;
    const colors = [];
    const lowColor = new THREE.Color(0x997253);
    const highColor = new THREE.Color(0xd2ad7a);
    const coldColor = new THREE.Color(0x786a57);
    const color = new THREE.Color();

    for (let i = 0; i < positions.count; i += 1) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const y = terrainHeight(x, z);
        positions.setY(i, y);

        const distance = Math.abs(x);
        const mix = THREE.MathUtils.clamp((y + 0.3) / 5.3, 0, 1);
        color.copy(lowColor).lerp(highColor, mix);
        if (distance < 3.8) {
            color.lerp(coldColor, 0.2);
        }
        const grain = 0.92 + random() * 0.12;
        colors.push(color.r * grain, color.g * grain, color.b * grain);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const sandTextures = loadPbrTextureSet('dense_sand', 5.5, 5.5);
    const stoneBump = loadGeneratedTexture(GENERATED_ASSETS.stone, {
        repeatX: 6.5,
        repeatY: 6.5,
        dataTexture: true
    });
    const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        ...sandTextures,
        bumpMap: stoneBump,
        bumpScale: 0.16,
        roughness: 0.97,
        metalness: 0,
        flatShading: false,
        normalScale: new THREE.Vector2(0.5, 0.5)
    });
    const terrain = new THREE.Mesh(geometry, material);
    terrain.receiveShadow = true;
    worldGroup.add(terrain);

    const rockGeometry = makeRockGeometry(775, isCoarsePointer ? 1 : 2);
    const smallRockTextures = loadPbrTextureSet('dark_rock_02', 1.4, 1.4);
    const smallRockStone = loadGeneratedTexture(GENERATED_ASSETS.stone, {
        repeatX: 1.8,
        repeatY: 1.8
    });
    const rockMaterials = [
        new THREE.MeshStandardMaterial({ ...smallRockTextures, map: smallRockStone, color: 0xad9988, roughness: 1 }),
        new THREE.MeshStandardMaterial({ ...smallRockTextures, map: smallRockStone, color: 0xc3a68d, roughness: 1 }),
        new THREE.MeshStandardMaterial({ ...smallRockTextures, map: smallRockStone, color: 0x9da69d, roughness: 1 })
    ];

    for (let i = 0; i < 32; i += 1) {
        const z = -33 + random() * 62;
        const side = random() > 0.5 ? 1 : -1;
        const x = side * (8.5 + random() * 16);
        const scale = 0.28 + random() * 0.9;
        const rock = new THREE.Mesh(rockGeometry, rockMaterials[i % rockMaterials.length]);
        rock.position.set(x, terrainHeight(x, z) + scale * 0.35, z);
        rock.scale.set(scale * (0.8 + random() * 0.9), scale * (0.5 + random() * 0.8), scale);
        rock.rotation.set(random(), random() * Math.PI, random());
        rock.castShadow = !isCoarsePointer && scale > 0.5;
        rock.receiveShadow = true;
        worldGroup.add(rock);
    }
}

function buildCrescentLake() {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 5.1, 0.48, Math.PI * 2 - 0.48, false);
    shape.absarc(-1.45, 0, 4.05, Math.PI * 2 - 0.66, 0.66, true);
    lakeMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
            time: { value: 0 },
            deepColor: { value: new THREE.Color(0x173e59) },
            lightColor: { value: new THREE.Color(0x6c98a4) },
            glintColor: { value: new THREE.Color(0xe3bd75) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            uniform vec3 deepColor;
            uniform vec3 lightColor;
            uniform vec3 glintColor;

            void main() {
                float longWave = sin(vUv.x * 34.0 + vUv.y * 18.0 + time * 0.72);
                float crossWave = sin(vUv.x * 16.0 - vUv.y * 42.0 - time * 0.48);
                float glint = smoothstep(0.8, 1.0, longWave * 0.58 + crossWave * 0.42);
                float depthMix = 0.38 + longWave * 0.045 + crossWave * 0.03;
                vec3 color = mix(deepColor, lightColor, depthMix);
                color += glintColor * glint * 0.48;
                float edge = smoothstep(0.0, 0.035, vUv.x) * smoothstep(0.0, 0.035, 1.0 - vUv.x);
                gl_FragColor = vec4(color, (0.82 + glint * 0.12) * edge);
            }
        `
    });
    const lakeGeometry = new THREE.ShapeGeometry(shape, 64);
    lakeGeometry.computeBoundingBox();
    const uv = lakeGeometry.attributes.uv;
    const lakeBounds = lakeGeometry.boundingBox;
    const lakeWidth = Math.max(0.001, lakeBounds.max.x - lakeBounds.min.x);
    const lakeHeight = Math.max(0.001, lakeBounds.max.y - lakeBounds.min.y);
    for (let index = 0; index < uv.count; index += 1) {
        const sourceIndex = index * 2;
        const u = (lakeGeometry.attributes.position.getX(index) - lakeBounds.min.x) / lakeWidth;
        const v = (lakeGeometry.attributes.position.getY(index) - lakeBounds.min.y) / lakeHeight;
        uv.setXY(index, u, v);
    }
    uv.needsUpdate = true;
    const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
    lake.position.set(10.4, 0.58, -15.2);
    lake.rotation.x = -Math.PI / 2;
    lake.rotation.z = -0.32;
    lake.scale.set(1.28, 0.86, 1);
    lake.renderOrder = 2;
    worldGroup.add(lake);

    const rimGeometry = new THREE.BufferGeometry();
    const rimPoints = [];
    for (let i = 0; i <= 52; i += 1) {
        const angle = 0.48 + (Math.PI * 2 - 0.96) * (i / 52);
        rimPoints.push(new THREE.Vector3(Math.cos(angle) * 5.1, Math.sin(angle) * 5.1, 0));
    }
    rimGeometry.setFromPoints(rimPoints);
    const rim = new THREE.Line(
        rimGeometry,
        new THREE.LineBasicMaterial({ color: 0xd6ad69, transparent: true, opacity: 0.34 })
    );
    rim.position.set(10.4, 0.63, -15.2);
    rim.rotation.x = -Math.PI / 2;
    rim.rotation.z = -0.32;
    rim.scale.set(1.28, 0.86, 1);
    worldGroup.add(rim);

    const lakeGlow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeRadialTexture(),
        color: 0x6f9db0,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    lakeGlow.position.set(10.4, 0.76, -15.2);
    lakeGlow.scale.set(22, 12, 1);
    worldGroup.add(lakeGlow);

    const glintPositions = [];
    for (let index = 0; index < 86; index += 1) {
        const angle = 0.55 + random() * (Math.PI * 2 - 1.1);
        const radius = 3.55 + random() * 1.28;
        glintPositions.push(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0.025
        );
    }
    const glintGeometry = new THREE.BufferGeometry();
    glintGeometry.setAttribute('position', new THREE.Float32BufferAttribute(glintPositions, 3));
    lakeGlints = new THREE.Points(
        glintGeometry,
        new THREE.PointsMaterial({
            map: makeRadialTexture(),
            color: 0xffd99a,
            size: 0.16,
            transparent: true,
            opacity: 0.48,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            alphaTest: 0.02
        })
    );
    lakeGlints.position.set(10.4, 0.67, -15.2);
    lakeGlints.rotation.x = -Math.PI / 2;
    lakeGlints.rotation.z = -0.32;
    lakeGlints.scale.set(1.28, 0.86, 1);
    worldGroup.add(lakeGlints);
}

function chapterPosition(index) {
    const chapter = CHAPTERS[index];
    return new THREE.Vector3(chapter.x, terrainHeight(chapter.x, chapter.z), chapter.z);
}

function buildRoute() {
    const points = CHAPTERS.map((chapter, index) => {
        const position = chapterPosition(index);
        return new THREE.Vector3(position.x, position.y + 0.11, position.z);
    });
    routeCurve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.22);

    groundPath = new THREE.Mesh(
        new THREE.TubeGeometry(routeCurve, 150, 0.07, 5, false),
        new THREE.MeshBasicMaterial({
            color: 0xffd28b,
            transparent: true,
            opacity: 0.34,
            depthWrite: false
        })
    );
    groundPath.renderOrder = 3;
    worldGroup.add(groundPath);

    const dashGeometry = new THREE.PlaneGeometry(0.42, 0.055);
    const dashMaterial = new THREE.MeshBasicMaterial({
        color: 0xffe1ad,
        transparent: true,
        opacity: 0.36,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    for (let i = 0; i < 48; i += 1) {
        const point = routeCurve.getPoint(i / 47);
        const tangent = routeCurve.getTangent(i / 47);
        const dash = new THREE.Mesh(dashGeometry, dashMaterial);
        dash.position.copy(point);
        dash.position.y = terrainHeight(point.x, point.z) + 0.16;
        dash.rotation.x = -Math.PI / 2;
        dash.rotation.z = Math.atan2(tangent.z, tangent.x);
        worldGroup.add(dash);
    }
}

function buildGrotto() {
    const texture = makeGrottoTexture();
    const facade = new THREE.Mesh(
        new THREE.PlaneGeometry(10.5, 9.2),
        new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.87,
            metalness: 0,
            emissive: 0x4b2116,
            emissiveIntensity: 0.15
        })
    );
    facade.position.set(17.3, 4.7, -30.2);
    facade.rotation.y = -0.32;
    worldGroup.add(facade);

    const cliffMaterial = new THREE.MeshStandardMaterial({
        color: 0x7f4532,
        roughness: 1,
        flatShading: true
    });
    const rockPositions = [];
    rockPositions.forEach((rockData, index) => {
        const [x, y, z, sx, sy, sz, rotation] = rockData;
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 0), cliffMaterial);
        rock.position.set(x, y, z);
        rock.scale.set(sx, sy, sz);
        rock.rotation.set(0.1 * index, rotation, 0.07);
        rock.castShadow = true;
        rock.receiveShadow = true;
        worldGroup.add(rock);
    });

    const caveGlow = new THREE.PointLight(0xff9a4a, 11, 16, 2);
    caveGlow.position.set(16.2, 3.2, -29);
    worldGroup.add(caveGlow);
}

function createUpturnedRoofGeometry(halfWidth, halfDepth, height) {
    const rings = 5;
    const sides = 8;
    const positions = [];
    const indices = [];

    for (let ring = 0; ring < rings; ring += 1) {
        const t = ring / (rings - 1);
        const width = halfWidth * (1 - t) + 0.015;
        const depth = halfDepth * (1 - t) + 0.015;
        const y = Math.pow(t, 1.55) * height;
        const corners = [
            [width, depth],
            [0, depth],
            [-width, depth],
            [-width, 0],
            [-width, -depth],
            [0, -depth],
            [width, -depth],
            [width, 0]
        ];
        corners.forEach(([x, z], side) => {
            const cornerLift = side % 2 === 0 ? Math.pow(1 - t, 3) * 0.3 : Math.pow(1 - t, 3) * 0.08;
            positions.push(x, y + cornerLift, z);
        });
    }

    for (let ring = 0; ring < rings - 1; ring += 1) {
        for (let side = 0; side < sides; side += 1) {
            const nextSide = (side + 1) % sides;
            const a = ring * sides + side;
            const b = ring * sides + nextSide;
            const c = (ring + 1) * sides + nextSide;
            const d = (ring + 1) * sides + side;
            indices.push(a, b, c, a, c, d);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
}

function createArchitectureHotspot(name, index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'architecture-hotspot';
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `点击将星尘聚合成${name}`);
    button.innerHTML = `
        <span class="architecture-orbit" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="architecture-label">
            <small>STARDUST ARCHIVE · ${String(index).padStart(2, '0')}</small>
            <strong>${name}</strong>
            <em class="architecture-state">点击粒子云聚合</em>
        </span>
    `;
    button.addEventListener('pointerenter', () => {
        button.style.filter = 'brightness(1.25)';
    });
    button.addEventListener('pointerleave', () => {
        button.style.filter = '';
    });
    nodeLayer.appendChild(button);
    return button;
}

function createSpatialHitTarget(label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'spatial-hit-target';
    button.setAttribute('aria-label', label);
    nodeLayer.appendChild(button);
    return button;
}

function projectObjectBounds(object, width, height) {
    object.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) return null;
    const bounds = {
        left: Infinity,
        top: Infinity,
        right: -Infinity,
        bottom: -Infinity
    };
    [
        [box.min.x, box.min.y, box.min.z],
        [box.min.x, box.min.y, box.max.z],
        [box.min.x, box.max.y, box.min.z],
        [box.min.x, box.max.y, box.max.z],
        [box.max.x, box.min.y, box.min.z],
        [box.max.x, box.min.y, box.max.z],
        [box.max.x, box.max.y, box.min.z],
        [box.max.x, box.max.y, box.max.z]
    ].forEach(([x, y, z]) => {
        const point = new THREE.Vector3(x, y, z).project(camera);
        const screenX = (point.x * 0.5 + 0.5) * width;
        const screenY = (-point.y * 0.5 + 0.5) * height;
        bounds.left = Math.min(bounds.left, screenX);
        bounds.top = Math.min(bounds.top, screenY);
        bounds.right = Math.max(bounds.right, screenX);
        bounds.bottom = Math.max(bounds.bottom, screenY);
    });
    return bounds;
}

function updateSpatialHitTarget(button, object, width, height, visible) {
    if (!button) return;
    const bounds = visible ? projectObjectBounds(object, width, height) : null;
    const inViewport = bounds
        && bounds.right > 0
        && bounds.left < width
        && bounds.bottom > 0
        && bounds.top < height;
    button.classList.toggle('is-visible', Boolean(visible && inViewport));
    button.tabIndex = visible && inViewport ? 0 : -1;
    if (!inViewport) return;
    button.style.left = `${Math.max(0, bounds.left)}px`;
    button.style.top = `${Math.max(0, bounds.top)}px`;
    button.style.width = `${Math.min(width, bounds.right) - Math.max(0, bounds.left)}px`;
    button.style.height = `${Math.min(height, bounds.bottom) - Math.max(0, bounds.top)}px`;
}

function createConstellationMaterial() {
    return new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uOpacity: { value: 0.96 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
        },
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
            attribute vec3 color;
            attribute float aSize;
            attribute float aPhase;
            attribute float aAlpha;
            uniform float uTime;
            uniform float uPixelRatio;
            varying vec3 vColor;
            varying float vAlpha;

            void main() {
                vColor = color;
                float flutter = 0.74 + 0.26 * sin(uTime * 1.35 + aPhase);
                vAlpha = aAlpha * flutter;
                vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = clamp(
                    aSize * uPixelRatio * (58.0 / max(5.0, -viewPosition.z)),
                    1.0,
                    16.0
                );
                gl_Position = projectionMatrix * viewPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vAlpha;
            uniform float uOpacity;

            void main() {
                float distanceToCenter = length(gl_PointCoord - vec2(0.5));
                if (distanceToCenter > 0.5) discard;
                float halo = smoothstep(0.5, 0.08, distanceToCenter);
                float core = smoothstep(0.2, 0.0, distanceToCenter);
                float alpha = (halo * 0.7 + core * 0.58) * vAlpha * uOpacity;
                vec3 warmCore = mix(vColor, vec3(1.0, 0.84, 0.58), core * 0.72);
                gl_FragColor = vec4(warmCore, alpha);
            }
        `
    });
}

function createArchitecturePlaque(name, accent, roof) {
    const plaqueCanvas = document.createElement('canvas');
    plaqueCanvas.width = 512;
    plaqueCanvas.height = 176;
    const context = plaqueCanvas.getContext('2d');
    const background = context.createLinearGradient(0, 0, 512, 176);
    background.addColorStop(0, `#${accent.toString(16).padStart(6, '0')}`);
    background.addColorStop(1, `#${roof.toString(16).padStart(6, '0')}`);
    context.fillStyle = background;
    context.fillRect(0, 0, 512, 176);
    context.strokeStyle = '#d8b06c';
    context.lineWidth = 5;
    context.strokeRect(12, 12, 488, 152);
    context.strokeStyle = 'rgba(255, 232, 186, 0.42)';
    context.lineWidth = 1;
    context.strokeRect(23, 23, 466, 130);
    context.fillStyle = '#f2d69d';
    context.font = '64px KaiTi, STKaiti, serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(name, 256, 90);
    const texture = new THREE.CanvasTexture(plaqueCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0
    });
}

function createPagodaFacadeTexture(accent) {
    const facadeCanvas = document.createElement('canvas');
    facadeCanvas.width = 512;
    facadeCanvas.height = 256;
    const context = facadeCanvas.getContext('2d');
    const base = context.createLinearGradient(0, 0, 0, 256);
    base.addColorStop(0, '#d8b087');
    base.addColorStop(0.48, '#bd7c5d');
    base.addColorStop(1, '#874739');
    context.fillStyle = base;
    context.fillRect(0, 0, 512, 256);
    context.strokeStyle = 'rgba(241, 202, 132, 0.42)';
    context.lineWidth = 3;
    context.strokeRect(9, 9, 494, 238);
    for (let index = 0; index < 6; index += 1) {
        const x = 42 + index * 86;
        context.fillStyle = 'rgba(99, 41, 32, 0.7)';
        context.fillRect(x, 18, 16, 220);
        context.fillStyle = 'rgba(242, 200, 132, 0.18)';
        context.fillRect(x + 4, 18, 2, 220);
    }
    for (let row = 0; row < 5; row += 1) {
        const y = 42 + row * 43;
        context.strokeStyle = 'rgba(67, 33, 27, 0.38)';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(18, y);
        context.lineTo(494, y);
        context.stroke();
    }
    context.strokeStyle = `#${accent.toString(16).padStart(6, '0')}`;
    context.globalAlpha = 0.58;
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(35, 220);
    context.bezierCurveTo(105, 182, 120, 230, 184, 204);
    context.bezierCurveTo(254, 176, 290, 224, 360, 197);
    context.bezierCurveTo(410, 178, 454, 215, 482, 191);
    context.stroke();
    context.globalAlpha = 1;
    const texture = new THREE.CanvasTexture(facadeCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return texture;
}

function createPagodaAssembly(spec, stoneTexture) {
    const group = new THREE.Group();
    group.position.set(spec.x, terrainHeight(spec.x, spec.z), spec.z);
    group.rotation.y = spec.rotation || 0;
    group.visible = false;

    const facadeTexture = createPagodaFacadeTexture(spec.accent || 0x873b29);
    const wallMaterial = new THREE.MeshStandardMaterial({
        map: facadeTexture,
        color: 0xffffff,
        roughness: 0.8,
        metalness: 0,
        emissive: 0x35170e,
        emissiveIntensity: 0.18,
        transparent: true,
        opacity: 0
    });
    const lacquerMaterial = new THREE.MeshStandardMaterial({
        color: spec.accent || 0x923d2b,
        roughness: 0.58,
        metalness: 0.03,
        transparent: true,
        opacity: 0
    });
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: spec.roof || 0x263f45,
        roughness: 0.62,
        metalness: 0.2,
        transparent: true,
        opacity: 0
    });
    const brassMaterial = new THREE.MeshStandardMaterial({
        color: 0xc7954d,
        emissive: 0x5c3618,
        emissiveIntensity: 0.3,
        roughness: 0.43,
        metalness: 0.5,
        transparent: true,
        opacity: 0
    });
    const windowMaterial = new THREE.MeshBasicMaterial({
        color: spec.light || 0xffd38c,
        transparent: true,
        opacity: 0
    });
    const stoneMaterial = new THREE.MeshStandardMaterial({
        map: stoneTexture,
        color: spec.stone || 0xa9866d,
        roughness: 1,
        transparent: true,
        opacity: 0
    });
    const plaqueMaterial = createArchitecturePlaque(spec.name, spec.accent || 0x6e3b2b, spec.roof || 0x44312d);
    const materials = [
        wallMaterial,
        lacquerMaterial,
        roofMaterial,
        brassMaterial,
        windowMaterial,
        stoneMaterial,
        plaqueMaterial
    ];
    materials.forEach((material) => {
        material.userData.targetOpacity = 1;
    });
    brassMaterial.userData.targetOpacity = 0.88;
    windowMaterial.userData.targetOpacity = 0.9;

    const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(spec.width * 1.16, 0.55, spec.depth * 1.12),
        stoneMaterial
    );
    foundation.position.y = 0.275;
    foundation.castShadow = !isCoarsePointer;
    foundation.receiveShadow = true;
    group.add(foundation);

    const tiers = [];
    let tierY = 0.55;
    for (let index = 0; index < spec.tiers; index += 1) {
        const progress = spec.tiers === 1 ? 0 : index / (spec.tiers - 1);
        const width = THREE.MathUtils.lerp(spec.width, spec.topWidth, progress);
        const depth = THREE.MathUtils.lerp(spec.depth, spec.topDepth, progress);
        const bodyHeight = spec.bodyHeight * (1 - progress * 0.16);
        const roofHeight = spec.roofHeight * (1 - progress * 0.12);
        const tier = { index, y: tierY, width, depth, bodyHeight, roofHeight };
        tiers.push(tier);

        const body = new THREE.Mesh(new THREE.BoxGeometry(width, bodyHeight, depth), wallMaterial);
        body.position.y = tierY + bodyHeight * 0.5;
        body.castShadow = !isCoarsePointer;
        body.receiveShadow = true;
        group.add(body);

        if (index > 0) {
            const balcony = new THREE.Mesh(
                new THREE.BoxGeometry(width + 0.5, 0.09, depth + 0.46),
                lacquerMaterial
            );
            balcony.position.y = tierY + 0.04;
            group.add(balcony);
        }

        const eaveY = tierY + bodyHeight + 0.03;
        const eaveWidth = width + 0.74;
        const eavePlate = new THREE.Mesh(
            new THREE.BoxGeometry(width + 0.92, 0.12, depth + 0.88),
            roofMaterial
        );
        eavePlate.position.set(0, eaveY, 0);
        group.add(eavePlate);
        [-1, 1].forEach((side) => {
            const beam = new THREE.Mesh(new THREE.BoxGeometry(eaveWidth, 0.075, 0.075), brassMaterial);
            beam.position.set(0, eaveY, side * depth * 0.62);
            group.add(beam);
            const sideBeam = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.075, depth + 0.72), brassMaterial);
            sideBeam.position.set(side * width * 0.62, eaveY, 0);
            group.add(sideBeam);
        });

        const roof = new THREE.Mesh(
            createUpturnedRoofGeometry(width * 0.68, depth * 0.9, roofHeight),
            roofMaterial
        );
        roof.position.y = eaveY + roofHeight * 0.43;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = !isCoarsePointer;
        group.add(roof);

        [-1, 1].forEach((sideX) => {
            [-1, 1].forEach((sideZ) => {
                const eaveCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(
                        sideX * width * 0.67,
                        eaveY + roofHeight * 0.06,
                        sideZ * depth * 0.88
                    ),
                    new THREE.Vector3(
                        sideX * width * 0.74,
                        eaveY + roofHeight * 0.25,
                        sideZ * depth * 0.94
                    ),
                    new THREE.Vector3(
                        sideX * width * 0.82,
                        eaveY + roofHeight * 0.46,
                        sideZ * depth * 0.98
                    )
                ]);
                const upturn = new THREE.Mesh(
                    new THREE.TubeGeometry(eaveCurve, 10, 0.028, 5, false),
                    brassMaterial
                );
                group.add(upturn);
            });
        });

        const windowWidth = Math.min(1.2, width * 0.35);
        const frontWindow = new THREE.Mesh(
            new THREE.PlaneGeometry(windowWidth, Math.min(0.62, bodyHeight * 0.55)),
            windowMaterial
        );
        frontWindow.position.set(0, tierY + bodyHeight * 0.53, depth * 0.505);
        group.add(frontWindow);

        const railY = tierY + bodyHeight * 0.82;
        const frontRail = new THREE.Mesh(new THREE.BoxGeometry(width * 0.92, 0.035, 0.035), brassMaterial);
        frontRail.position.set(0, railY, depth * 0.59);
        group.add(frontRail);
        for (let railIndex = -2; railIndex <= 2; railIndex += 1) {
            const railPost = new THREE.Mesh(new THREE.BoxGeometry(0.022, bodyHeight * 0.3, 0.022), brassMaterial);
            railPost.position.set(railIndex * width * 0.17, railY - bodyHeight * 0.14, depth * 0.59);
            group.add(railPost);
        }

        [-width * 0.4, width * 0.4].forEach((columnX) => {
            [-depth * 0.38, depth * 0.38].forEach((columnZ) => {
                const column = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.055, 0.075, bodyHeight, 8),
                    lacquerMaterial
                );
                column.position.set(columnX, tierY + bodyHeight * 0.5, columnZ);
                group.add(column);
            });
        });

        tierY += bodyHeight + roofHeight * 1.52;
    }

    const topTier = tiers[tiers.length - 1];
    const finialBase = topTier.y + topTier.bodyHeight + topTier.roofHeight * 0.9;
    const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.09, 1.2, 8), brassMaterial);
    finial.position.y = finialBase + 0.52;
    group.add(finial);
    for (let index = 0; index < 4; index += 1) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.15 - index * 0.02, 0.013, 5, 24),
            brassMaterial
        );
        ring.position.y = finialBase + 0.22 + index * 0.15;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
    }

    const plaque = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 0.44), plaqueMaterial);
    plaque.position.set(0, 0.55 + spec.bodyHeight * 0.75, spec.depth * 0.515);
    group.add(plaque);

    const light = new THREE.PointLight(spec.light || 0xffb86a, 0, 14, 2);
    light.position.set(0, tiers[0].y + tiers[0].bodyHeight * 0.8, tiers[0].depth * 0.68);
    group.add(light);
    group.userData.light = light;

    const height = finialBase + 1.2;
    return { group, materials, tiers, height };
}

function buildArchitectureParticleGeometry(spec, assembly) {
    const targets = [];
    const colors = [];
    const pushParticle = (x, y, z, color, jitter = 0.035) => {
        targets.push(
            x + (random() - 0.5) * jitter,
            y + (random() - 0.5) * jitter,
            z + (random() - 0.5) * jitter
        );
        const particleColor = new THREE.Color(color);
        colors.push(particleColor.r, particleColor.g, particleColor.b);
    };

    for (let index = 0; index < 180; index += 1) {
        const edge = random();
        const level = random() * 0.55;
        const x = (random() - 0.5) * spec.width * 1.15;
        const z = (random() - 0.5) * spec.depth * 1.1;
        const px = edge < 0.48 ? x : (edge > 0.74 ? spec.width * 0.57 : -spec.width * 0.57);
        const pz = edge >= 0.48 && edge <= 0.74 ? z : (random() > 0.5 ? spec.depth * 0.56 : -spec.depth * 0.56);
        pushParticle(px, level, pz, 0xd2ad7a, 0.055);
    }

    assembly.tiers.forEach((tier, tierIndex) => {
        const wallColor = tierIndex % 2 === 0 ? 0xd0aa78 : 0xc28f63;
        const roofColor = tierIndex % 3 === 0 ? 0xc08b4b : (tierIndex % 3 === 1 ? 0x486d76 : 0x8f4633);
        const wallCount = isCoarsePointer ? 60 : 92;
        for (let index = 0; index < wallCount; index += 1) {
            const side = Math.floor(random() * 4);
            const alongX = (random() - 0.5) * tier.width;
            const alongZ = (random() - 0.5) * tier.depth;
            const y = tier.y + random() * tier.bodyHeight;
            if (side === 0 || side === 1) {
                pushParticle(alongX, y, (side === 0 ? 1 : -1) * tier.depth * 0.51, wallColor);
            } else {
                pushParticle((side === 2 ? 1 : -1) * tier.width * 0.51, y, alongZ, wallColor);
            }
        }

        [-tier.width * 0.42, tier.width * 0.42].forEach((px) => {
            [-tier.depth * 0.39, tier.depth * 0.39].forEach((pz) => {
                for (let index = 0; index < 28; index += 1) {
                    pushParticle(px, tier.y + random() * tier.bodyHeight, pz, 0xa6422c, 0.022);
                }
            });
        });

        const roofCount = isCoarsePointer ? 72 : 125;
        for (let index = 0; index < roofCount; index += 1) {
            const t = random();
            const halfWidth = tier.width * 0.68 * (1 - t);
            const halfDepth = tier.depth * 0.9 * (1 - t);
            const edge = Math.floor(random() * 4);
            const along = (random() - 0.5) * 2;
            const px = edge < 2 ? along * halfWidth : (edge === 2 ? -halfWidth : halfWidth);
            const pz = edge >= 2 ? along * halfDepth : (edge === 0 ? -halfDepth : halfDepth);
            pushParticle(
                px,
                tier.y + tier.bodyHeight + 0.06 + t * tier.roofHeight * 1.05,
                pz,
                roofColor,
                0.025
            );
        }

        for (let index = 0; index < 24; index += 1) {
            pushParticle(
                (random() - 0.5) * Math.min(0.9, tier.width * 0.38),
                tier.y + tier.bodyHeight * (0.32 + random() * 0.42),
                tier.depth * 0.515,
                spec.light || 0xffc477,
                0.018
            );
        }
    });

    return { targets, colors };
}

function createConstellationCloud(spec, assembly, particleData) {
    const targets = particleData.targets;
    const count = targets.length / 3;
    const current = new Float32Array(targets.length);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const alphas = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
        const tx = targets[index * 3];
        const ty = targets[index * 3 + 1];
        const tz = targets[index * 3 + 2];
        const angle = random() * Math.PI * 2;
        const heightRatio = THREE.MathUtils.clamp(ty / Math.max(assembly.height, 1), 0, 1);
        const orbit = random() < 0.52
            ? 0.18 + random() * 0.75
            : 0.9 + random() * (2.2 - heightRatio * 0.7);
        current[index * 3] = tx + Math.cos(angle) * orbit;
        current[index * 3 + 1] = ty + 0.3 + random() * (1.2 + (1 - heightRatio) * 1.7);
        current[index * 3 + 2] = tz + Math.sin(angle) * orbit * 0.72;
        sizes[index] = 1.25 + random() * 2.15;
        phases[index] = random() * Math.PI * 2;
        alphas[index] = 0.35 + random() * 0.65;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(current, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(particleData.colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

    const material = createConstellationMaterial();
    const points = new THREE.Points(geometry, material);
    points.position.copy(assembly.group.position);
    points.rotation.y = spec.rotation || 0;
    points.renderOrder = 4;

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeRadialTexture(),
        color: spec.halo || 0xddb36f,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    halo.position.copy(assembly.group.position);
    halo.position.y += assembly.height * 0.45;
    halo.scale.set(spec.width * 2.45, assembly.height * 1.28, 1);
    worldGroup.add(halo);

    const orbitRing = new THREE.Mesh(
        new THREE.TorusGeometry(Math.max(spec.width, spec.depth) * 0.72, 0.022, 6, 88),
        new THREE.MeshBasicMaterial({
            color: spec.halo || 0xd6aa62,
            transparent: true,
            opacity: 0.36,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    orbitRing.position.copy(assembly.group.position);
    orbitRing.position.y += 0.1;
    orbitRing.rotation.x = Math.PI / 2;
    orbitRing.rotation.z = spec.rotation || 0;
    worldGroup.add(orbitRing);

    const mistCount = isCoarsePointer ? 92 : 150;
    const mistPositions = new Float32Array(mistCount * 3);
    const mistColors = new Float32Array(mistCount * 3);
    const mistSizes = new Float32Array(mistCount);
    const mistPhases = new Float32Array(mistCount);
    const mistAlphas = new Float32Array(mistCount);
    const mistPalette = [0xf0d193, 0xd8aa66, 0x77b5ac, 0x6a91ae, 0xba664d];
    for (let index = 0; index < mistCount; index += 1) {
        const angle = random() * Math.PI * 2;
        const vertical = Math.pow(random(), 0.78);
        const radius = spec.width * (0.28 + random() * 0.62);
        mistPositions[index * 3] = Math.cos(angle) * radius;
        mistPositions[index * 3 + 1] = assembly.height * (0.08 + vertical * 0.9);
        mistPositions[index * 3 + 2] = Math.sin(angle) * spec.depth * (0.3 + random() * 0.5);
        const mistColor = new THREE.Color(mistPalette[Math.floor(random() * mistPalette.length)]);
        mistColors[index * 3] = mistColor.r;
        mistColors[index * 3 + 1] = mistColor.g;
        mistColors[index * 3 + 2] = mistColor.b;
        mistSizes[index] = 4.2 + random() * 8.2;
        mistPhases[index] = random() * Math.PI * 2;
        mistAlphas[index] = 0.1 + random() * 0.25;
    }
    const mistGeometry = new THREE.BufferGeometry();
    mistGeometry.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));
    mistGeometry.setAttribute('color', new THREE.BufferAttribute(mistColors, 3));
    mistGeometry.setAttribute('aSize', new THREE.BufferAttribute(mistSizes, 1));
    mistGeometry.setAttribute('aPhase', new THREE.BufferAttribute(mistPhases, 1));
    mistGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(mistAlphas, 1));
    const mistMaterial = createConstellationMaterial();
    mistMaterial.uniforms.uOpacity.value = 0.48;
    const mist = new THREE.Points(mistGeometry, mistMaterial);
    mist.position.copy(assembly.group.position);
    mist.rotation.y = spec.rotation || 0;
    mist.renderOrder = 3;
    worldGroup.add(mist);

    return {
        points,
        material,
        mist,
        mistMaterial,
        halo,
        orbitRing,
        current,
        cloud: new Float32Array(current),
        targets: new Float32Array(targets),
        phases
    };
}

function renderArchitectureStory(entry) {
    if (!entry) return;
    architectureStoryIndex.textContent = entry.archiveLabel
        || `STARDUST ARCHIVE · ${String(entry.index + 1).padStart(2, '0')}`;
    architectureStoryTag.textContent = entry.tag || '敦煌楼阁';
    architectureStoryTitle.textContent = entry.name;
    architectureStorySubtitle.textContent = entry.subtitle || '';
    architectureStoryDescription.textContent = entry.description || '';
    architectureStoryHint.textContent = entry.footerHint || '点击其他楼阁可切换';
    architectureStoryFacts.replaceChildren();
    (entry.facts || []).forEach((fact) => {
        const item = document.createElement('span');
        item.textContent = fact;
        architectureStoryFacts.appendChild(item);
    });
}

function getProjectedObjectBounds(object) {
    object.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(object);
    const points = [];
    [box.min.x, box.max.x].forEach((x) => {
        [box.min.y, box.max.y].forEach((y) => {
            [box.min.z, box.max.z].forEach((z) => {
                points.push(new THREE.Vector3(x, y, z).project(camera));
            });
        });
    });
    const xs = points.map((point) => (point.x * 0.5 + 0.5) * window.innerWidth);
    const ys = points.map((point) => (-point.y * 0.5 + 0.5) * window.innerHeight);
    return {
        left: Math.min(...xs),
        right: Math.max(...xs),
        top: Math.min(...ys),
        bottom: Math.max(...ys)
    };
}

function positionArchitectureStory(entry = activeArchitectureStory) {
    if (!entry) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width <= 900) {
        architectureStory.style.removeProperty('--story-x');
        architectureStory.style.removeProperty('--story-y');
        return;
    }

    const cardWidth = architectureStory.offsetWidth || 330;
    const cardHeight = architectureStory.offsetHeight || 300;
    const bounds = getProjectedObjectBounds(entry.finalGroup.visible ? entry.finalGroup : entry.cloud.points);
    const gap = 34;
    const sideMargin = 24;
    const topLimit = 92 + cardHeight * 0.5;
    const bottomLimit = height - 84 - cardHeight * 0.5;
    const rightCandidate = bounds.right + gap;
    const leftCandidate = bounds.left - cardWidth - gap;
    let left = rightCandidate;
    if (rightCandidate + cardWidth > width - sideMargin) {
        left = leftCandidate;
    }
    left = THREE.MathUtils.clamp(left, sideMargin, width - cardWidth - sideMargin);
    const buildingCenterY = (bounds.top + bounds.bottom) * 0.5;
    const top = THREE.MathUtils.clamp(
        buildingCenterY - 18,
        Math.min(topLimit, height * 0.5),
        Math.max(bottomLimit, height * 0.5)
    );
    architectureStory.style.setProperty('--story-x', `${left}px`);
    architectureStory.style.setProperty('--story-y', `${top}px`);
    architectureStory.classList.toggle('is-left', left + cardWidth <= bounds.left);
}

function showArchitectureStory(entry) {
    if (!entry) return;
    activeArchitectureStory = entry;
    renderArchitectureStory(entry);
    architectureStory.classList.add('is-visible');
    architectureStory.setAttribute('aria-hidden', 'false');
    architectureStory.inert = false;
    journeyStory.classList.remove('is-visible');
    positionArchitectureStory(entry);
    requestAnimationFrame(() => positionArchitectureStory(entry));
    setTimeout(() => {
        if (activeArchitectureStory === entry) positionArchitectureStory(entry);
    }, 80);
}

function hideArchitectureStory() {
    if (!activeArchitectureStory) return;
    activeArchitectureStory = null;
    architectureStory.classList.remove('is-visible', 'is-left');
    architectureStory.setAttribute('aria-hidden', 'true');
    architectureStory.inert = true;
}

function triggerArchitectureFormation(entry, autoAdvance = false) {
    if (!entry) return;
    if (!autoAdvance && journeyState.active) stopGuidedJourney();
    if (!entry.forming && !entry.formed) {
        entry.forming = true;
        entry.startedAt = clock.elapsedTime;
        entry.starts = new Float32Array(entry.cloud.current);
        entry.finalGroup.visible = true;
        entry.button.classList.add('is-forming');
        entry.button.setAttribute('aria-pressed', 'true');
        entry.button.setAttribute('aria-label', `${entry.name}正在由粒子聚合`);
        entry.state.textContent = '星尘汇聚中';
        particleWhisper.textContent = `${entry.name}正在由星尘聚合 · 请静候片刻`;
    } else {
        entry.button.classList.remove('is-tapped');
        void entry.button.offsetWidth;
        entry.button.classList.add('is-tapped');
        setTimeout(() => entry.button.classList.remove('is-tapped'), 620);
        particleWhisper.textContent = `${entry.name} · 已聚焦楼体，可拖动画廊继续环游`;
    }
    focusArchitecture(entry, !autoAdvance);
    showArchitectureStory(entry);
}

function updateArchitectureEntry(entry, elapsed) {
    const { cloud } = entry;
    cloud.material.uniforms.uTime.value = elapsed;
    cloud.mistMaterial.uniforms.uTime.value = elapsed;
    cloud.orbitRing.rotation.z += 0.0025;
    cloud.mist.rotation.y += 0.0018;
    cloud.orbitRing.material.opacity = 0.18 + Math.sin(elapsed * 1.15 + entry.index) * 0.05;
    cloud.halo.material.opacity = 0.2 + Math.sin(elapsed * 0.72 + entry.index * 1.7) * 0.045;
    cloud.mistMaterial.uniforms.uOpacity.value = entry.formed
        ? 0.08
        : 0.52 + Math.sin(elapsed * 0.6 + entry.index) * 0.08;

    if (!entry.forming && !entry.formed) {
        cloud.points.rotation.y = (entry.rotation || 0) + Math.sin(elapsed * 0.22 + entry.index) * 0.085;
        cloud.points.position.y = entry.anchor.y + Math.sin(elapsed * 0.48 + entry.index * 1.4) * 0.12;
        cloud.material.uniforms.uOpacity.value = 0.92;
        cloud.mist.position.y = entry.anchor.y + Math.sin(elapsed * 0.36 + entry.index) * 0.13;
        return;
    }

    if (entry.forming) {
        const progress = THREE.MathUtils.clamp((elapsed - entry.startedAt) / 3.25, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const positions = cloud.points.geometry.attributes.position.array;
        for (let index = 0; index < positions.length; index += 3) {
            const particleIndex = index / 3;
            const trail = Math.sin(elapsed * 2.1 + cloud.phases[particleIndex]) * (1 - eased) * 0.16;
            positions[index] = THREE.MathUtils.lerp(entry.starts[index], cloud.targets[index], eased) + trail;
            positions[index + 1] = THREE.MathUtils.lerp(entry.starts[index + 1], cloud.targets[index + 1], eased);
            positions[index + 2] = THREE.MathUtils.lerp(entry.starts[index + 2], cloud.targets[index + 2], eased) + trail * 0.55;
        }
        cloud.points.geometry.attributes.position.needsUpdate = true;
        cloud.points.rotation.y = THREE.MathUtils.lerp(cloud.points.rotation.y, entry.rotation || 0, 0.08);
        cloud.points.position.y = entry.anchor.y;
        cloud.material.uniforms.uOpacity.value = THREE.MathUtils.lerp(0.94, 0.28, eased);
        cloud.mistMaterial.uniforms.uOpacity.value = THREE.MathUtils.lerp(0.52, 0.06, eased);
        cloud.halo.material.opacity = THREE.MathUtils.lerp(0.16, 0.045, eased);
        cloud.orbitRing.material.opacity = THREE.MathUtils.lerp(0.34, 0.05, eased);
        entry.finalGroup.visible = progress > 0.16;
        entry.finalGroup.scale.setScalar(THREE.MathUtils.lerp(0.88, 1, eased));
        entry.materials.forEach((material) => {
            material.opacity = material.userData.targetOpacity * THREE.MathUtils.clamp((progress - 0.18) / 0.72, 0, 1);
        });
        const light = entry.finalGroup.userData.light;
        if (light) light.intensity = 7.2 * eased;

        if (progress >= 1) {
            entry.forming = false;
            entry.formed = true;
            persistArchitectureFormation(entry.name);
            entry.button.classList.remove('is-forming');
            entry.button.classList.add('is-formed');
            entry.button.setAttribute('aria-label', `${entry.name}已由粒子聚合成形，点击聚焦`);
            entry.state.textContent = '楼阁已显形';
            particleWhisper.textContent = `${entry.name}已落成 · 沙海上的星尘归入楼阁`;
        }
        return;
    }

    cloud.material.uniforms.uOpacity.value = 0.26;
    cloud.halo.material.opacity = 0.045;
}

function buildArchitectureSystem() {
    const persistedFormedNames = loadFormedArchitectureNames();
    const definitions = [
        {
            name: '九层楼',
            x: 7.6,
            z: -26.8,
            rotation: -0.04,
            tiers: 9,
            width: 5.7,
            depth: 4.1,
            topWidth: 2.35,
            topDepth: 1.6,
            bodyHeight: 0.76,
            roofHeight: 0.57,
            accent: 0x873b29,
            roof: 0x47362f,
            halo: 0xd5a35f,
            focusRadius: 20.5,
            focusAzimuth: 0.24,
            tag: '崖壁楼阁',
            subtitle: '九重檐宇，依崖而上',
            description: '以莫高窟九层楼意象为灵感，九重飞檐沿崖壁层层收束。它以垂直轴线连接沙海、洞窟与天光，是进入敦煌灵境最醒目的方位标记。',
            facts: ['九重飞檐', '崖壁中轴', '莫高窟意象']
        },
        {
            name: '月泉阁',
            x: 13.7,
            z: -12.8,
            rotation: -0.23,
            tiers: 2,
            width: 4.15,
            depth: 3.5,
            topWidth: 2.8,
            topDepth: 2.35,
            bodyHeight: 0.95,
            roofHeight: 0.76,
            accent: 0x306572,
            roof: 0x324b53,
            halo: 0x74a9b5,
            focusRadius: 12.8,
            focusAzimuth: 0.31,
            tag: '泉畔楼影',
            subtitle: '一阁临泉，沙海生辉',
            description: '取月牙泉与月泉阁的空间意象，木构、泉光与倒影在沙丘之间展开。它让原本辽阔的鸣沙山多了一处安静、可停驻的水意。',
            facts: ['月牙泉', '泉光倒影', '沙海木构']
        },
        {
            name: '藏经阁',
            x: -12.2,
            z: -21.8,
            rotation: 0.22,
            tiers: 3,
            width: 4.5,
            depth: 3.6,
            topWidth: 2.5,
            topDepth: 2.1,
            bodyHeight: 0.92,
            roofHeight: 0.72,
            accent: 0x94432f,
            roof: 0x4c3830,
            halo: 0xd2a364,
            focusRadius: 13.8,
            focusAzimuth: -0.28,
            tag: '经卷守护',
            subtitle: '一卷经声，藏于崖影',
            description: '以敦煌藏经洞的文化记忆为线索，将经卷、守护与丝路交流收进一座静谧楼阁。这里是数字场景中的当代楼阁意象，不是对某一历史建筑的复原。',
            facts: ['藏经记忆', '经卷守护', '丝路交流']
        }
    ];

    const stoneTexture = loadGeneratedTexture(GENERATED_ASSETS.stone, {
        repeatX: 1.3,
        repeatY: 1.8
    });

    definitions.forEach((spec, index) => {
        const assembly = createPagodaAssembly(spec, stoneTexture);
        const anchor = assembly.group.position.clone();
        const particleData = buildArchitectureParticleGeometry(spec, assembly);
        const cloud = createConstellationCloud(spec, assembly, particleData);
        const hitMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false,
            colorWrite: false
        });
        const hitTarget = new THREE.Mesh(
            new THREE.BoxGeometry(spec.width + 2.1, assembly.height + 2, spec.depth + 2.4),
            hitMaterial
        );
        hitTarget.position.copy(anchor);
        hitTarget.position.y += assembly.height * 0.5;
        hitTarget.rotation.y = spec.rotation || 0;

        const button = createArchitectureHotspot(spec.name, index + 1);
        const surfaceHitButton = createSpatialHitTarget(`点击${spec.name}楼体聚合或聚焦`);
        const entry = {
            ...spec,
            index,
            anchor,
            height: assembly.height,
            finalGroup: assembly.group,
            materials: assembly.materials,
            cloud,
            hitTarget,
            button,
            surfaceHitButton,
            state: button.querySelector('.architecture-state'),
            forming: false,
            formed: persistedFormedNames.has(spec.name),
            startedAt: -1
        };
        if (entry.formed) {
            entry.finalGroup.visible = true;
            entry.finalGroup.scale.setScalar(1);
            entry.cloud.points.geometry.attributes.position.array.set(entry.cloud.targets);
            entry.cloud.points.geometry.attributes.position.needsUpdate = true;
            entry.cloud.points.position.y = entry.anchor.y;
            entry.materials.forEach((material) => {
                material.opacity = material.userData.targetOpacity;
            });
            const light = entry.finalGroup.userData.light;
            if (light) light.intensity = 7.2;
            entry.button.classList.add('is-formed');
            entry.button.setAttribute('aria-label', `${entry.name}已经显形，点击聚焦`);
            entry.state.textContent = '楼阁已显形';
        }
        hitTarget.userData.architectureEntry = entry;
        assembly.group.traverse((child) => {
            if (!child.isMesh) return;
            child.userData.architectureEntry = entry;
            architectureMeshTargets.push(child);
        });
        button.dataset.architecture = spec.name;
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            triggerArchitectureFormation(entry);
        });
        surfaceHitButton.addEventListener('click', (event) => {
            event.stopPropagation();
            triggerArchitectureFormation(entry);
        });
        worldGroup.add(assembly.group);
        worldGroup.add(cloud.points);
        worldGroup.add(hitTarget);
        architectureHitTargets.push(hitTarget);
        architectureEntries.push(entry);

    });
}

function createDancerLimb(length, topRadius, bottomRadius, material, radialSegments = 12) {
    const geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, length, radialSegments, 4);
    geometry.translate(0, -length * 0.5, 0);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = !isCoarsePointer;
    mesh.receiveShadow = true;
    return mesh;
}

function createDancerSkirtGeometry(topRadius, length, segments = 48, rings = 12) {
    const positions = [];
    const colors = [];
    const indices = [];
    const cinnabar = new THREE.Color(0xb95138);
    const shadow = new THREE.Color(0x682c25);
    const color = new THREE.Color();

    for (let ring = 0; ring <= rings; ring += 1) {
        const v = ring / rings;
        const radius = THREE.MathUtils.lerp(topRadius, topRadius * 2.62, Math.pow(v, 0.72));
        for (let segment = 0; segment < segments; segment += 1) {
            const angle = segment / segments * Math.PI * 2;
            const fold = 1 + Math.sin(angle * 7 + v * 2.8) * (0.035 + v * 0.055);
            const flare = Math.sin(v * Math.PI) * 0.12;
            positions.push(
                Math.cos(angle) * radius * fold * (1 + flare),
                -v * length,
                Math.sin(angle) * radius * fold * 0.82
            );
            color.copy(cinnabar).lerp(shadow, 0.2 + (0.5 + 0.5 * Math.sin(angle * 7)) * 0.32);
            colors.push(color.r, color.g, color.b);
        }
    }
    for (let ring = 0; ring < rings; ring += 1) {
        for (let segment = 0; segment < segments; segment += 1) {
            const next = (segment + 1) % segments;
            const a = ring * segments + segment;
            const b = ring * segments + next;
            const c = (ring + 1) * segments + next;
            const d = (ring + 1) * segments + segment;
            indices.push(a, b, d, b, c, d);
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
}

function createDancerRibbon(side, variant, root, materials) {
    const sign = side === 'l' ? 1 : -1;
    const controlPoints = [
        new THREE.Vector3(sign * 0.35, 1.2, -0.13),
        new THREE.Vector3(sign * (1.2 + variant * 0.14), 1.65 + variant * 0.1, -0.32),
        new THREE.Vector3(sign * (2.25 + variant * 0.08), 0.95 + variant * 0.12, -0.5),
        new THREE.Vector3(sign * (2.0 + variant * 0.16), -0.1, 0.05),
        new THREE.Vector3(sign * (2.65 + variant * 0.12), -0.85 - variant * 0.18, 0.26)
    ];
    const curve = new THREE.CatmullRomCurve3(controlPoints);
    const samples = curve.getPoints(54);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(samples.length * 6), 3));
    const uvs = [];
    const indices = [];
    for (let index = 0; index < samples.length; index += 1) {
        const v = index / (samples.length - 1);
        uvs.push(0, v, 1, v);
        if (index < samples.length - 1) {
            const a = index * 2;
            indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }
    }
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    const frontMaterial = new THREE.MeshPhysicalMaterial({
        color: variant % 2 === 0 ? 0x3c7c76 : 0x315f73,
        roughness: 0.46,
        metalness: 0.02,
        clearcoat: 0.18,
        clearcoatRoughness: 0.42,
        side: THREE.FrontSide,
        transparent: true,
        opacity: 0.86
    });
    const backMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xd5a652,
        emissive: 0x5b3817,
        emissiveIntensity: 0.2,
        roughness: 0.34,
        metalness: 0.38,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.9
    });
    const front = new THREE.Mesh(geometry, frontMaterial);
    const back = new THREE.Mesh(geometry, backMaterial);
    front.renderOrder = back.renderOrder = 3;
    root.add(front, back);
    return { front, back, geometry, samples, width: 0.17 + variant * 0.025, phase: variant * 1.7 + (sign > 0 ? 0 : 0.8) };
}

function updateDancerRibbon(ribbon, elapsed, energy) {
    const positions = ribbon.geometry.attributes.position.array;
    const points = ribbon.samples.map((point, index) => {
        const t = index / Math.max(1, ribbon.samples.length - 1);
        return point.clone().add(new THREE.Vector3(
            Math.sin(elapsed * 1.1 + ribbon.phase + t * 4.6) * (0.08 + energy * 0.2) * t,
            Math.sin(elapsed * 1.4 + ribbon.phase + t * 5.2) * (0.06 + energy * 0.18) * t,
            Math.cos(elapsed * 0.95 + ribbon.phase + t * 3.8) * (0.04 + energy * 0.12) * t
        ));
    });
    const tangent = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    for (let index = 0; index < points.length; index += 1) {
        const t = index / (points.length - 1);
        const before = points[Math.max(0, index - 1)];
        const after = points[Math.min(points.length - 1, index + 1)];
        tangent.subVectors(after, before).normalize();
        normal.crossVectors(tangent, up).normalize();
        const width = ribbon.width * Math.pow(Math.sin(Math.PI * t), 0.6);
        const a = points[index].clone().addScaledVector(normal, width);
        const b = points[index].clone().addScaledVector(normal, -width);
        positions[index * 6] = a.x;
        positions[index * 6 + 1] = a.y;
        positions[index * 6 + 2] = a.z;
        positions[index * 6 + 3] = b.x;
        positions[index * 6 + 4] = b.y;
        positions[index * 6 + 5] = b.z;
    }
    ribbon.geometry.attributes.position.needsUpdate = true;
    ribbon.geometry.computeVertexNormals();
}

function createDancerHand(side) {
    const hand = new THREE.Group();
    const skin = new THREE.MeshPhysicalMaterial({
        color: 0xefc59e,
        roughness: 0.46,
        metalness: 0,
        clearcoat: 0.12,
        clearcoatRoughness: 0.52
    });
    const palm = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), skin);
    palm.scale.set(0.105, 0.16, 0.052);
    palm.position.y = -0.12;
    hand.add(palm);
    const fingerOffsets = [-0.075, -0.038, 0, 0.038, 0.074];
    fingerOffsets.forEach((offset, index) => {
        const finger = createDancerLimb(
            0.2 + (index === 2 ? 0.035 : 0) - Math.abs(index - 2) * 0.008,
            0.018,
            0.012,
            skin,
            8
        );
        finger.position.x = offset;
        finger.position.y = -0.2;
        finger.rotation.z = (index - 2) * 0.075;
        hand.add(finger);
    });
    hand.userData.side = side;
    return hand;
}

function collectModelMaterials(model) {
    const materials = new Set();
    const textures = new Set();
    const meshes = [];
    let triangles = 0;
    let vertices = 0;

    model.traverse((child) => {
        if (!child.isMesh || !child.geometry) return;
        meshes.push(child);
        const geometry = child.geometry;
        vertices += geometry.getAttribute('position')?.count || 0;
        triangles += geometry.index
            ? geometry.index.count / 3
            : (geometry.getAttribute('position')?.count || 0) / 3;

        const childMaterials = Array.isArray(child.material) ? child.material : [child.material];
        childMaterials.filter(Boolean).forEach((material) => {
            materials.add(material);
            ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap']
                .forEach((key) => {
                    if (material[key]?.isTexture) textures.add(material[key]);
                });
        });
    });

    return {
        materials: [...materials],
        textures: [...textures],
        meshes,
        triangles: Math.round(triangles),
        vertices
    };
}

function styleLoadedDancerModel(model) {
    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const modelInfo = collectModelMaterials(model);
    const styledMaterials = new Map();

    modelInfo.meshes.forEach((mesh) => {
        mesh.castShadow = !isCoarsePointer;
        mesh.receiveShadow = false;
        mesh.frustumCulled = true;
        const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const materials = sourceMaterials.map((source) => {
            if (!source) return source;
            if (styledMaterials.has(source)) return styledMaterials.get(source);
            const material = source.clone();
            if (material.emissive) {
                const sourceEmissive = material.emissive.getHex();
                material.userData.dancerBaseEmissive = sourceEmissive;
                material.userData.dancerBaseEmissiveIntensity = sourceEmissive === 0
                    ? 0
                    : (material.emissiveIntensity || 0);
                material.emissive.set(0xffc36f);
                material.emissiveIntensity = material.userData.dancerBaseEmissiveIntensity;
            }
            material.userData.dancerBaseRoughness = material.roughness ?? 1;
            material.userData.dancerBaseOpacity = material.opacity ?? 1;
            material.userData.dancerBaseTransparent = material.transparent;
            material.roughness = Math.min(0.82, material.userData.dancerBaseRoughness);
            material.envMapIntensity = 1.2;
            ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap']
                .forEach((key) => {
                    if (material[key]?.isTexture) {
                        material[key].anisotropy = maxAnisotropy;
                        material[key].needsUpdate = true;
                    }
                });
            styledMaterials.set(source, material);
            return material;
        });
        mesh.material = Array.isArray(mesh.material) ? materials : materials[0];
    });

    return {
        ...modelInfo,
        materials: [...styledMaterials.values()]
    };
}

function createLoadedDancerAtmosphere() {
    const orbit = new THREE.Group();
    orbit.position.y = 4.05;
    const ringColors = [0xffd18a, 0x76c9bb, 0x6e9cc3];

    ringColors.forEach((color, index) => {
        const radius = 2.7 + index * 0.46;
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(radius, 0.012 + index * 0.003, 5, 120),
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.22 + index * 0.035,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );
        ring.rotation.x = Math.PI * (0.43 + index * 0.075);
        ring.rotation.y = index * 1.03;
        ring.userData.dancerOrbitSpeed = 0.045 + index * 0.016;
        ring.userData.dancerOrbitPhase = index * 2.1;
        orbit.add(ring);
    });

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeRadialTexture(),
        color: 0xffc879,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    halo.position.set(0, 4.0, -0.85);
    halo.scale.set(8.8, 10.6, 1);
    orbit.add(halo);
    orbit.userData.halo = halo;

    const rimWarm = new THREE.PointLight(0xffc27b, 3.8, 9, 2);
    rimWarm.position.set(-2.3, 5.3, 1.15);
    orbit.add(rimWarm);
    const rimCool = new THREE.PointLight(0x7ecdc2, 2.4, 8, 2);
    rimCool.position.set(2.15, 2.7, -0.55);
    orbit.add(rimCool);
    return orbit;
}

function createDancerManifestationCloud(model) {
    const sampleLimit = isCoarsePointer ? 520 : 900;
    const meshes = [];
    let totalVertices = 0;
    model.updateWorldMatrix(true, true);
    celestialDancer.root.updateWorldMatrix(true, true);

    model.traverse((child) => {
        const count = child.isMesh ? child.geometry?.getAttribute('position')?.count || 0 : 0;
        if (!count) return;
        meshes.push({ mesh: child, count });
        totalVertices += count;
    });
    if (!totalVertices) return null;

    const targetPositions = [];
    const tempPoint = new THREE.Vector3();
    meshes.forEach(({ mesh, count }) => {
        const attribute = mesh.geometry.getAttribute('position');
        const meshSamples = Math.max(1, Math.round(sampleLimit * count / totalVertices));
        const step = Math.max(1, Math.floor(count / meshSamples));
        for (let index = 0; index < count && targetPositions.length < sampleLimit * 3; index += step) {
            tempPoint.fromBufferAttribute(attribute, index).applyMatrix4(mesh.matrixWorld);
            celestialDancer.root.worldToLocal(tempPoint);
            targetPositions.push(tempPoint.x, tempPoint.y, tempPoint.z);
        }
    });

    const particleCount = targetPositions.length / 3;
    const starts = new Float32Array(targetPositions.length);
    const targets = new Float32Array(targetPositions);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    const palette = [0xf0ca7a, 0x6ec2b2, 0x5d91b8, 0xd77a55, 0xe8e0c2];
    for (let index = 0; index < particleCount; index += 1) {
        const targetX = targets[index * 3];
        const targetY = targets[index * 3 + 1];
        const targetZ = targets[index * 3 + 2];
        const angle = random() * Math.PI * 2;
        const radius = 1.8 + random() * 3.8;
        starts[index * 3] = targetX * 0.35 + Math.cos(angle) * radius;
        starts[index * 3 + 1] = 1.0 + random() * 7.8;
        starts[index * 3 + 2] = targetZ * 0.35 + Math.sin(angle) * radius * 0.68;
        const color = new THREE.Color(palette[Math.floor(random() * palette.length)]);
        colors[index * 3] = color.r;
        colors[index * 3 + 1] = color.g;
        colors[index * 3 + 2] = color.b;
        sizes[index] = 0.55 + random() * 1.25;
        phases[index] = random() * Math.PI * 2;
        alphas[index] = 0.45 + random() * 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(starts, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    const material = createConstellationMaterial();
    material.uniforms.uOpacity.value = 0.88;
    const points = new THREE.Points(geometry, material);
    points.renderOrder = 5;
    points.userData.manifestation = true;
    celestialDancer.root.add(points);

    return {
        points,
        material,
        starts,
        targets,
        count: particleCount
    };
}

function startDancerFpsProbe() {
    return new Promise((resolve) => {
        dancerFpsProbe = {
            startedAt: performance.now(),
            lastAt: performance.now(),
            frames: 0,
            resolve
        };
    });
}

function updateDancerFpsProbe() {
    if (!dancerFpsProbe) return;
    const now = performance.now();
    dancerFpsProbe.frames += 1;
    dancerFpsProbe.lastAt = now;
    const duration = now - dancerFpsProbe.startedAt;
    if (duration < 2200 || dancerFpsProbe.frames < 72) return;
    const fps = (dancerFpsProbe.frames - 1) * 1000 / duration;
    dancerModelState.stableFps = Math.round(fps * 10) / 10;
    const resolve = dancerFpsProbe.resolve;
    dancerFpsProbe = null;
    resolve(dancerModelState.stableFps);
}

async function measureDancerUpload(textures) {
    const gl = renderer.getContext();
    const uploadStartedAt = performance.now();
    textures.forEach((texture) => renderer.initTexture(texture));
    renderer.compile(scene, camera);
    renderer.render(scene, camera);
    gl.finish();
    dancerModelState.webglUploadMs = Math.round((performance.now() - uploadStartedAt) * 10) / 10;
}

async function loadCelestialDancerModel() {
    if (!celestialDancer) return;
    let dancerAlreadyManifested = false;
    try {
        dancerAlreadyManifested = localStorage.getItem(DANCER_MANIFESTED_KEY) === '1';
    } catch (error) {
        // The particle manifestation remains available if storage is unavailable.
    }
    dancerModelState.status = 'loading';
    celestialDancer.cue.classList.add('is-loading');
    celestialDancer.state.textContent = '星灵凝聚中';
    particleWhisper.textContent = '飞天神女正穿过流沙与星尘，缓缓降临';
    setPortalVideoBackdrop(true);

    try {
        const moduleStartedAt = performance.now();
        const { GLTFLoader } = await import('./vendor/GLTFLoader.js');
        dancerModelState.moduleMs = Math.round((performance.now() - moduleStartedAt) * 10) / 10;
        const loader = new GLTFLoader();

        const networkStartedAt = performance.now();
        const modelResponse = await fetchDancerModelBuffer();
        const buffer = modelResponse.buffer;
        dancerModelState.modelSource = modelResponse.source;
        dancerModelState.networkMs = Math.round((performance.now() - networkStartedAt) * 10) / 10;
        dancerModelState.fileSize = buffer.byteLength;

        const parseStartedAt = performance.now();
        const gltf = await new Promise((resolve, reject) => {
            loader.parse(buffer, 'models/', resolve, reject);
        });
        dancerModelState.parseDecodeMs = Math.round((performance.now() - parseStartedAt) * 10) / 10;
        dancerModelState.animations = gltf.animations.length;

        const model = gltf.scene;
        const rawBounds = new THREE.Box3().setFromObject(model);
        const rawSize = rawBounds.getSize(new THREE.Vector3());
        const rawCenter = rawBounds.getCenter(new THREE.Vector3());
        const targetHeight = isCoarsePointer ? 7.15 : 7.55;
        const modelScale = targetHeight / Math.max(0.001, rawSize.y);
        model.scale.setScalar(modelScale);
        model.position.set(
            -rawCenter.x * modelScale,
            -rawBounds.min.y * modelScale + 0.78,
            -rawCenter.z * modelScale + 0.28
        );
        const styled = styleLoadedDancerModel(model);

        if (gltf.animations.length > 0) {
            dancerAnimationMixer = new THREE.AnimationMixer(model);
            dancerAnimationMixer.clipAction(gltf.animations[0]).play();
        }

        dancerModelMount = new THREE.Group();
        dancerModelMount.position.y = 0.08;
        dancerModelYaw = 0;
        dancerModelYawTarget = 0;
        dancerModelMount.add(model);
        celestialDancer.root.add(dancerModelMount);

        dancerModelOrbit = createLoadedDancerAtmosphere();
        celestialDancer.root.add(dancerModelOrbit);

        if (celestialDancer.hitTarget) {
            const modelWidth = rawSize.x * modelScale;
            celestialDancer.hitTarget.geometry.dispose();
            celestialDancer.hitTarget.geometry = new THREE.BoxGeometry(
                Math.max(4.6, modelWidth * 1.16),
                8.1,
                3.1
            );
            celestialDancer.hitTarget.position.set(0, 4.05, 0);
        }

        dancerModelState.triangles = styled.triangles;
        dancerModelState.vertices = styled.vertices;
        dancerModelState.textureCount = styled.textures.length;
        dancerModelState.drawCalls = styled.meshes.length;
        dancerModelState.modelMeshes = styled.meshes.length;
        dancerModelMaterials = styled.materials;
        dancerManifestation = createDancerManifestationCloud(model);
        dancerStoryEntry = {
            archiveLabel: 'LIVING MURAL · 01',
            name: '飞天神女',
            tag: '飞天乐舞',
            subtitle: '流云为衣，星尘聚形',
            description: '以敦煌飞天的飘带、莲台与散花意象构成数字舞者。她由散落星尘聚合显形，保留壁画中轻盈、回旋而向上的动态气质。',
            facts: ['散花飞天', '飘带回旋', '敦煌壁画意象'],
            footerHint: '拖动神女查看 · 点击再次起舞',
            index: 0,
            anchor: celestialDancer.root.position.clone(),
            height: targetHeight,
            finalGroup: dancerModelMount,
            cloud: { points: dancerManifestation?.points || dancerAura }
        };
        dancerModelMount.visible = true;
        dancerModelOrbit.visible = true;
        await measureDancerUpload(styled.textures);
        dancerFormation.formed = dancerAlreadyManifested;
        dancerModelMount.visible = dancerAlreadyManifested;
        dancerModelOrbit.visible = dancerAlreadyManifested;
        if (dancerManifestation) {
            dancerManifestation.material.uniforms.uOpacity.value = dancerAlreadyManifested ? 0.12 : 0.82;
        }
        dancerModelState.drawCalls = renderer.info.render.calls;
        const firstRenderStartedAt = performance.now();
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        dancerModelState.firstRenderMs = Math.round((performance.now() - firstRenderStartedAt) * 10) / 10;

        dancerModelState.status = 'ready';
        dancerModelState.ready = true;
        setPortalVideoBackdrop(true);
        celestialDancer.cue.classList.remove('is-loading');
        celestialDancer.cue.classList.add(dancerAlreadyManifested ? 'is-formed' : 'is-cloud');
        celestialDancer.cue.setAttribute('aria-label', dancerAlreadyManifested
            ? '拖动飞天神女旋转查看，点击开始起舞'
            : '点击聚拢星尘，让飞天神女显形');
        celestialDancer.state.textContent = dancerAlreadyManifested
            ? '拖动查看 · 点击起舞'
            : '点击云气聚形';
        particleWhisper.textContent = dancerAlreadyManifested
            ? '飞天神女已在此守候 · 拖动查看，点击起舞'
            : '飞天神女藏于流转星尘 · 点击云团让她显形';

        setTimeout(() => {
            if (dancerModelState.status === 'ready' && !dancerFpsProbe) {
                startDancerFpsProbe();
            }
        }, 2400);
    } catch (error) {
        dancerModelState.status = 'error';
        dancerModelState.ready = false;
        dancerModelState.error = error?.message || String(error);
        setPortalVideoBackdrop(true);
        celestialDancer.cue.classList.remove('is-loading');
        celestialDancer.cue.setAttribute('aria-label', '飞天神女模型未能载入，点击播放壁画视频');
        celestialDancer.state.textContent = '壁画回响';
        particleWhisper.textContent = '星灵暂未凝聚，已用飞天壁画接引光影';
        console.error('Unable to load feitian dancer GLB.', error);
    }
}

function createCelestialDancer() {
    const dancer = new THREE.Group();
    const dancerX = -2.2;
    const dancerZ = -17.8;
    dancer.position.set(dancerX, terrainHeight(dancerX, dancerZ) + 0.08, dancerZ);
    dancer.rotation.y = -0.04;
    dancer.scale.setScalar(1.08);

    const skin = new THREE.MeshPhysicalMaterial({
        color: 0xecc49e,
        roughness: 0.47,
        metalness: 0,
        clearcoat: 0.18,
        clearcoatRoughness: 0.5,
        sheen: 0.35,
        sheenColor: new THREE.Color(0xffd8bd)
    });
    const teal = new THREE.MeshPhysicalMaterial({
        color: 0x3f7a73,
        roughness: 0.52,
        metalness: 0.02,
        clearcoat: 0.22,
        clearcoatRoughness: 0.44,
        side: THREE.DoubleSide
    });
    const red = new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        color: 0xd06043,
        roughness: 0.68,
        metalness: 0,
        side: THREE.DoubleSide
    });
    const gold = new THREE.MeshPhysicalMaterial({
        color: 0xd5a24c,
        emissive: 0x6e411d,
        emissiveIntensity: 0.34,
        roughness: 0.28,
        metalness: 0.72
    });
    const hair = new THREE.MeshPhysicalMaterial({
        color: 0x20140f,
        roughness: 0.28,
        metalness: 0.02,
        clearcoat: 0.34,
        clearcoatRoughness: 0.36
    });
    const lapis = new THREE.MeshPhysicalMaterial({
        color: 0x296d88,
        emissive: 0x123644,
        emissiveIntensity: 0.3,
        roughness: 0.16,
        metalness: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.12
    });
    const lotusCinnabar = new THREE.MeshStandardMaterial({
        color: 0xc6604b,
        roughness: 0.54,
        metalness: 0.02
    });
    const lotusIvory = new THREE.MeshStandardMaterial({
        color: 0xe7c69f,
        roughness: 0.5,
        metalness: 0.02
    });

    const lotus = new THREE.Group();
    const lotusBase = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.76, 0.1, 48), gold);
    lotusBase.position.y = 0.05;
    lotus.add(lotusBase);
    const lotusDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.62, 0.08, 48), teal);
    lotusDisc.position.y = 0.13;
    lotus.add(lotusDisc);

    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(-0.18, 0.11, -0.2, 0.38, 0, 0.62);
    petalShape.bezierCurveTo(0.2, 0.38, 0.18, 0.11, 0, 0);
    const petalGeometry = new THREE.ExtrudeGeometry(petalShape, {
        depth: 0.025,
        bevelEnabled: true,
        bevelRadius: 0.012,
        bevelSegments: 2,
        curveSegments: 8
    });
    petalGeometry.rotateX(-Math.PI / 2);
    for (let index = 0; index < 22; index += 1) {
        const angle = index / 22 * Math.PI * 2;
        const pivot = new THREE.Group();
        pivot.rotation.y = angle;
        const petal = new THREE.Mesh(petalGeometry, index % 3 === 0 ? lotusIvory : lotusCinnabar);
        const inner = index < 12;
        petal.scale.setScalar(inner ? 0.8 : 1);
        petal.rotation.x = inner ? -0.12 : -0.24;
        petal.position.z = inner ? 0.27 : 0.36;
        petal.position.y = 0.16 + (index % 3) * 0.008;
        pivot.add(petal);
        lotus.add(pivot);
    }
    lotus.userData.petals = lotus.children.filter((child) => child.isGroup);
    dancer.add(lotus);

    const standingLeg = new THREE.Group();
    const shin = createDancerLimb(1.15, 0.11, 0.07, skin);
    shin.position.set(-0.18, 1.25, 0.02);
    standingLeg.add(shin);
    const foot = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 10), skin);
    foot.scale.set(0.15, 0.065, 0.31);
    foot.position.set(-0.18, 0.26, 0.13);
    standingLeg.add(foot);
    const anklet = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.016, 6, 24), gold);
    anklet.rotation.x = Math.PI / 2;
    anklet.position.set(-0.18, 0.32, 0.03);
    standingLeg.add(anklet);
    dancer.add(standingLeg);

    const hiddenLeg = createDancerLimb(1.0, 0.09, 0.065, skin);
    hiddenLeg.position.set(0.17, 1.16, -0.16);
    hiddenLeg.rotation.z = -0.2;
    dancer.add(hiddenLeg);

    const torso = new THREE.Group();
    torso.position.y = 2.75;
    torso.rotation.z = -0.025;
    dancer.add(torso);

    const abdomen = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.25, 0.67, 18, 4), skin);
    abdomen.position.y = 0.35;
    abdomen.scale.z = 0.72;
    torso.add(abdomen);

    const chest = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 16), skin);
    chest.scale.set(0.44, 0.42, 0.25);
    chest.position.y = 0.83;
    torso.add(chest);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.125, 0.3, 14), skin);
    neck.position.y = 1.25;
    torso.add(neck);

    const head = new THREE.Group();
    head.position.y = 1.65;
    head.rotation.y = 0.08;
    torso.add(head);
    const face = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), skin);
    face.scale.set(0.27, 0.34, 0.24);
    face.position.y = 0.05;
    head.add(face);
    const earGeometry = new THREE.SphereGeometry(0.055, 12, 10);
    [-1, 1].forEach((side) => {
        const ear = new THREE.Mesh(earGeometry, skin);
        ear.scale.set(0.45, 1, 0.62);
        ear.position.set(side * 0.255, 0.05, 0);
        head.add(ear);
    });
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.105, 10), skin);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, -0.01, 0.245);
    head.add(nose);
    [-0.095, 0.095].forEach((x) => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 8), hair);
        eye.scale.set(0.058, 0.009, 0.008);
        eye.position.set(x, 0.07, 0.236);
        head.add(eye);
    });
    const lowerLip = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 8), new THREE.MeshPhysicalMaterial({
        color: 0xa94b43,
        roughness: 0.4,
        clearcoat: 0.24
    }));
    lowerLip.scale.set(0.066, 0.018, 0.012);
    lowerLip.position.set(0, -0.105, 0.235);
    head.add(lowerLip);

    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.67), hair);
    hairCap.scale.set(0.285, 0.35, 0.25);
    hairCap.position.set(0, 0.08, -0.025);
    head.add(hairCap);
    const bun = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), hair);
    bun.scale.set(0.2, 0.16, 0.17);
    bun.position.set(0, 0.34, -0.08);
    head.add(bun);
    const sideLocks = [
        [[-0.21, 0.17, 0.02], [-0.29, -0.02, 0.03], [-0.22, -0.22, 0.06]],
        [[0.21, 0.18, 0.02], [0.29, 0, 0.04], [0.22, -0.2, 0.07]],
        [[-0.12, 0.31, -0.12], [-0.18, 0.43, -0.2], [-0.3, 0.5, -0.18]],
        [[0.1, 0.31, -0.12], [0.16, 0.45, -0.22], [0.29, 0.48, -0.16]]
    ];
    sideLocks.forEach((points) => {
        const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
        const lock = new THREE.Mesh(new THREE.TubeGeometry(curve, 18, 0.035, 7, false), hair);
        head.add(lock);
    });

    const crown = new THREE.Group();
    crown.position.set(0, 0.24, 0.02);
    head.add(crown);
    const crownBand = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.018, 6, 32), gold);
    crownBand.rotation.x = Math.PI / 2;
    crown.add(crownBand);
    for (let index = 0; index < 5; index += 1) {
        const angle = (index - 2) * 0.25;
        const arch = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.011, 5, 24, Math.PI), gold);
        arch.position.set(Math.sin(angle) * 0.15, 0.08, Math.cos(angle) * 0.08);
        arch.rotation.z = -angle;
        crown.add(arch);
    }
    const crownJewel = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 10), lapis);
    crownJewel.position.set(0, 0.055, 0.2);
    crown.add(crownJewel);

    const bodice = new THREE.Group();
    torso.add(bodice);
    [-0.19, 0.19].forEach((x) => {
        const cup = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), teal);
        cup.scale.set(0.21, 0.18, 0.12);
        cup.position.set(x, 0.91, 0.175);
        cup.rotation.z = x > 0 ? -0.17 : 0.17;
        bodice.add(cup);
    });
    const bodiceBand = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.32, 0.16, 24, 2, true), teal);
    bodiceBand.position.y = 0.72;
    bodiceBand.scale.z = 0.72;
    bodice.add(bodiceBand);
    [-0.22, 0.22].forEach((x) => {
        const piping = new THREE.Mesh(
            new THREE.TorusGeometry(0.16, 0.012, 5, 28, Math.PI),
            gold
        );
        piping.position.set(x, 0.9, 0.285);
        piping.rotation.z = x > 0 ? -0.18 : 0.18;
        bodice.add(piping);
    });
    const chestGem = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12), lapis);
    chestGem.scale.set(0.85, 1.15, 0.55);
    chestGem.position.set(0, 0.83, 0.29);
    bodice.add(chestGem);

    const necklace = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.009, 5, 36, Math.PI), gold);
    necklace.position.set(0, 1.12, 0.12);
    necklace.rotation.z = Math.PI;
    torso.add(necklace);
    for (let index = -2; index <= 2; index += 1) {
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), index === 0 ? lapis : gold);
        bead.position.set(index * 0.055, 1.06 - Math.abs(index) * 0.012, 0.235);
        torso.add(bead);
    }

    const waist = new THREE.Group();
    waist.position.set(0, 2.77, 0);
    dancer.add(waist);
    const sash = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.045, 7, 36), teal);
    sash.rotation.x = Math.PI / 2;
    waist.add(sash);
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), teal);
    knot.scale.set(1.15, 0.72, 0.6);
    knot.position.set(0, 0.02, 0.31);
    waist.add(knot);
    [-0.07, 0.07].forEach((x) => {
        for (let index = 0; index < 5; index += 1) {
            const bead = new THREE.Mesh(new THREE.SphereGeometry(0.022 - index * 0.0015, 8, 6), index % 2 ? gold : lapis);
            bead.position.set(x, -0.09 - index * 0.075, 0.32);
            waist.add(bead);
        }
    });

    const skirt = new THREE.Mesh(createDancerSkirtGeometry(0.35, 2.2), red);
    skirt.position.y = -0.03;
    waist.add(skirt);

    const overskirtPanels = new THREE.Group();
    waist.add(overskirtPanels);
    [-1, 1].forEach((side, panelIndex) => {
        const panelCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(side * 0.24, 0.02, 0.16),
            new THREE.Vector3(side * 0.5, -0.45, 0.28),
            new THREE.Vector3(side * 0.66, -1.0, 0.2),
            new THREE.Vector3(side * 0.78, -1.48, 0.08)
        ]);
        const samples = panelCurve.getPoints(20);
        const positions = [];
        const indices = [];
        samples.forEach((point, index) => {
            const t = index / (samples.length - 1);
            const width = (0.18 + t * 0.19) * (1 - Math.max(0, t - 0.82) * 1.9);
            positions.push(point.x - width, point.y, point.z, point.x + width, point.y, point.z + 0.02);
            if (index < samples.length - 1) {
                const a = index * 2;
                indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
            }
        });
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        const panel = new THREE.Mesh(geometry, teal);
        panel.userData.side = side;
        panel.userData.phase = panelIndex * 1.8;
        overskirtPanels.add(panel);
    });

    const arms = {};
    const makeArm = (side) => {
        const sign = side === 'l' ? 1 : -1;
        const shoulder = new THREE.Group();
        shoulder.position.set(sign * 0.53, 1.03, 0.02);
        torso.add(shoulder);
        const upper = createDancerLimb(1.03, 0.105, 0.085, skin);
        shoulder.add(upper);
        const elbow = new THREE.Group();
        elbow.position.y = -1.03;
        shoulder.add(elbow);
        const forearm = createDancerLimb(0.92, 0.082, 0.055, skin);
        elbow.add(forearm);
        const wrist = new THREE.Group();
        wrist.position.y = -0.92;
        elbow.add(wrist);
        const hand = createDancerHand(side);
        wrist.add(hand);

        const armband = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.017, 6, 24), gold);
        armband.rotation.x = Math.PI / 2;
        armband.position.y = -0.38;
        shoulder.add(armband);
        for (let index = 0; index < 3; index += 1) {
            const bangle = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.009, 5, 22), gold);
            bangle.rotation.x = Math.PI / 2;
            bangle.position.y = -0.79 - index * 0.035;
            elbow.add(bangle);
        }
        return { shoulder, elbow, wrist, hand };
    };
    arms.left = makeArm('l');
    arms.right = makeArm('r');
    arms.left.shoulder.rotation.set(0.1, -0.08, 2.42);
    arms.left.elbow.rotation.z = 0.2;
    arms.left.wrist.rotation.set(0.1, 0, -0.38);
    arms.right.shoulder.rotation.set(0.12, -0.12, -0.67);
    arms.right.elbow.rotation.z = -0.24;
    arms.right.wrist.rotation.set(-0.18, 0.1, 0.3);

    const ribbons = [];
    [
        ['l', 0],
        ['l', 1],
        ['r', 0],
        ['r', 1]
    ].forEach(([side, variant]) => {
        ribbons.push(createDancerRibbon(side, variant, torso, { teal, gold }));
    });
    const proceduralFigureParts = [...dancer.children];

    const auraGeometry = new THREE.BufferGeometry();
    const auraCount = isCoarsePointer ? 220 : 360;
    const auraPositions = new Float32Array(auraCount * 3);
    const auraColors = new Float32Array(auraCount * 3);
    const auraSizes = new Float32Array(auraCount);
    const auraPhases = new Float32Array(auraCount);
    const auraAlphas = new Float32Array(auraCount);
    const auraPalette = [0xe3bf75, 0x4d8e8a, 0x477b98, 0xb8583d];
    for (let index = 0; index < auraCount; index += 1) {
        const angle = random() * Math.PI * 2;
        const radius = 0.35 + random() * 2.2;
        auraPositions[index * 3] = Math.cos(angle) * radius;
        auraPositions[index * 3 + 1] = 0.2 + random() * 6.4;
        auraPositions[index * 3 + 2] = Math.sin(angle) * radius * 0.55;
        const auraColor = new THREE.Color(auraPalette[Math.floor(random() * auraPalette.length)]);
        auraColors[index * 3] = auraColor.r;
        auraColors[index * 3 + 1] = auraColor.g;
        auraColors[index * 3 + 2] = auraColor.b;
        auraSizes[index] = 0.7 + random() * 1.5;
        auraPhases[index] = random() * Math.PI * 2;
        auraAlphas[index] = 0.25 + random() * 0.7;
    }
    auraGeometry.setAttribute('position', new THREE.BufferAttribute(auraPositions, 3));
    auraGeometry.setAttribute('color', new THREE.BufferAttribute(auraColors, 3));
    auraGeometry.setAttribute('aSize', new THREE.BufferAttribute(auraSizes, 1));
    auraGeometry.setAttribute('aPhase', new THREE.BufferAttribute(auraPhases, 1));
    auraGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(auraAlphas, 1));
    dancerAuraMaterial = createConstellationMaterial();
    dancerAuraMaterial.uniforms.uOpacity.value = 0.42;
    dancerAura = new THREE.Points(auraGeometry, dancerAuraMaterial);
    dancer.add(dancerAura);

    const light = new THREE.PointLight(0xffca8d, 5.5, 11, 2);
    light.position.set(0, 4.2, 1.2);
    dancer.add(light);

    const hitMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        colorWrite: false
    });
    const hitTarget = new THREE.Mesh(new THREE.BoxGeometry(4.8, 8.1, 3.1), hitMaterial);
    hitTarget.position.set(0, 4.05, 0);
    dancer.add(hitTarget);
    dancerHitTargets.push(hitTarget);

    const cue = document.createElement('button');
    cue.type = 'button';
    cue.className = 'architecture-hotspot dancer-hotspot';
    cue.dataset.dancer = 'true';
    cue.setAttribute('aria-label', '飞天神女正在凝聚，点击开始舞蹈');
    cue.innerHTML = `
        <span class="architecture-orbit" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="architecture-label">
            <small>LIVING MURAL · 01</small>
            <strong>飞天神女</strong>
            <em class="dancer-state">星灵凝聚中</em>
        </span>
    `;
    cue.addEventListener('click', (event) => {
        event.stopPropagation();
        if (appState.lastPointerWasDrag || appState.lastPointerDuration >= 500) return;
        triggerDancerManifestation();
    });
    cue.addEventListener('pointerdown', onDancerSurfacePointerDown);
    nodeLayer.appendChild(cue);
    const dancerSurfaceHit = createSpatialHitTarget('拖动飞天神女旋转查看，点击开始舞蹈');
    dancerSurfaceHit.classList.add('dancer-surface-hit');
    dancerSurfaceHit.addEventListener('pointerdown', onDancerSurfacePointerDown);
    dancerSurfaceHit.addEventListener('click', (event) => {
        event.stopPropagation();
        if (appState.lastPointerWasDrag || appState.lastPointerDuration >= 500) return;
        triggerDancerManifestation();
    });

    celestialDancer = {
        root: dancer,
        torso,
        head,
        arms,
        ribbons,
        lotus,
        skirt: overskirtPanels,
        aura: dancerAura,
        cue,
        surfaceHit: dancerSurfaceHit,
        state: cue.querySelector('.dancer-state'),
        hitTarget
    };
    proceduralFigureParts.forEach((part) => {
        part.visible = false;
    });
    dancerCue = cue;
    dancerHitTargets[0].userData.dancerEntry = celestialDancer;
    worldGroup.add(dancer);
}

function triggerDancerManifestation(manual = true, danceOnComplete = false) {
    if (!celestialDancer) return;
    if (dancerModelState.status === 'loading' || dancerModelState.status === 'idle') {
        particleWhisper.textContent = '飞天神女的星尘仍在汇聚，请稍候片刻';
        return;
    }
    if (dancerModelState.status === 'error') {
        setPortalVideoBackdrop(true);
        particleWhisper.textContent = '星灵暂未凝聚，飞天壁画正在接引光影';
        return;
    }
    if (dancerFormation.formed) {
        showArchitectureStory(dancerStoryEntry);
        startCelestialDance(manual, true);
        return;
    }

    if (!dancerFormation.forming) {
        dancerFormation.forming = true;
        dancerFormation.startedAt = clock.elapsedTime;
        dancerFormation.danceOnComplete = danceOnComplete;
        dancerModelMount.visible = true;
        dancerModelOrbit.visible = false;
        celestialDancer.cue.classList.add('is-forming');
        celestialDancer.cue.setAttribute('aria-label', '飞天神女正在由星尘聚合成形');
        celestialDancer.state.textContent = '云气凝形中';
        particleWhisper.textContent = '飞天的轮廓正从星尘中浮现 · 云气正在汇聚';
    } else {
        dancerFormation.danceOnComplete ||= danceOnComplete;
    }

    if (manual && journeyState.active) stopGuidedJourney();
    if (appState.activeChapter >= 0) closeChapter();
    const dancerPosition = celestialDancer.root.position;
    cameraRig.desiredTarget.set(dancerPosition.x, dancerPosition.y + 4.55, dancerPosition.z - 0.2);
    cameraRig.desiredAzimuth = -0.025;
    cameraRig.desiredElevation = 0.13;
    cameraRig.desiredRadius = window.innerWidth < 640 ? 22.4 : 15.2;
    appState.pauseAutoUntil = manual ? performance.now() + 12000 : 0;
    if (manual) updateCamera(true);
    showArchitectureStory(dancerStoryEntry);
}

function startCelestialDance(manual = true, preserveStory = false) {
    if (!celestialDancer) return;
    if (dancerModelState.status === 'ready' && !dancerFormation.formed) {
        triggerDancerManifestation(manual, true);
        return;
    }
    if (!preserveStory) hideArchitectureStory();
    dancerDanceStartedAt = clock.elapsedTime;
    dancerDanceEnergy = 0;
    dancerHighlightUntil = clock.elapsedTime + (manual ? 5.8 : 4.2);
    if (appState.activeChapter >= 0) closeChapter();
    const dancerPosition = celestialDancer.root.position;
    cameraRig.desiredTarget.set(dancerPosition.x, dancerPosition.y + 4.55, dancerPosition.z - 0.2);
    cameraRig.desiredAzimuth = -0.025;
    cameraRig.desiredElevation = 0.13;
    cameraRig.desiredRadius = window.innerWidth < 640 ? 22.4 : 15.2;
    appState.pauseAutoUntil = manual ? performance.now() + 12000 : 0;
    if (manual) updateCamera(true);
    celestialDancer.cue.classList.add('is-dancing');
    celestialDancer.cue.setAttribute('aria-label', '飞天神女正在随星环起舞，点击可重新聚焦');
    celestialDancer.state.textContent = dancerModelState.status === 'ready'
        ? '星灵起舞'
        : (dancerModelState.status === 'error' ? '壁画回响' : '星灵凝聚中');
    particleWhisper.textContent = dancerModelState.status === 'ready'
        ? '飞天神女已应声起舞 · 星环、呼吸光影与薄星尘正在汇聚'
        : '飞天神女正在穿过星尘，稍候片刻';
    if (dancerModelState.status === 'error') {
        setPortalVideoBackdrop(true);
    }
}

function updateDancerFormation(elapsed) {
    if (!dancerModelMount || !dancerModelOrbit) return 0.72;

    if (!dancerFormation.forming && !dancerFormation.formed) {
        dancerModelMount.visible = false;
        dancerModelOrbit.visible = false;
        if (dancerManifestation) {
            dancerManifestation.material.uniforms.uTime.value = elapsed;
            dancerManifestation.material.uniforms.uOpacity.value = 0.82 + Math.sin(elapsed * 1.1) * 0.08;
        }
        return 0.7 + Math.sin(elapsed * 1.25) * 0.05;
    }

    if (dancerFormation.formed) {
        dancerModelMount.visible = true;
        dancerModelOrbit.visible = true;
        dancerModelMaterials.forEach((material) => {
            material.opacity = material.userData.dancerBaseOpacity ?? 1;
            material.transparent = material.userData.dancerBaseTransparent ?? false;
        });
        if (dancerManifestation) {
            dancerManifestation.material.uniforms.uOpacity.value = 0.12
                + Math.sin(elapsed * 1.4) * 0.035;
        }
        return null;
    }

    const progress = THREE.MathUtils.clamp((elapsed - dancerFormation.startedAt) / 2.9, 0, 1);
    const eased = progress * progress * (3 - 2 * progress);
    dancerModelMount.visible = progress > 0.24;
    dancerModelOrbit.visible = progress > 0.34;

    dancerModelMaterials.forEach((material) => {
        const baseOpacity = material.userData.dancerBaseOpacity ?? 1;
        const reveal = THREE.MathUtils.smoothstep(progress, 0.2, 0.82);
        material.transparent = true;
        material.opacity = baseOpacity * reveal;
    });
    dancerModelOrbit.traverse((child) => {
        if (!child.material || child.isLight) return;
        if (child.userData.dancerRevealOpacity === undefined) {
            child.userData.dancerRevealOpacity = child.material.opacity ?? 1;
        }
        child.material.opacity = child.userData.dancerRevealOpacity * Math.min(1, progress * 1.3);
    });

    if (dancerManifestation) {
        const positions = dancerManifestation.points.geometry.attributes.position.array;
        for (let index = 0; index < positions.length; index += 1) {
            positions[index] = THREE.MathUtils.lerp(
                dancerManifestation.starts[index],
                dancerManifestation.targets[index],
                eased
            );
        }
        dancerManifestation.points.geometry.attributes.position.needsUpdate = true;
        dancerManifestation.points.rotation.y = Math.sin(elapsed * 1.2) * (1 - eased) * 0.3;
        dancerManifestation.material.uniforms.uTime.value = elapsed;
        dancerManifestation.material.uniforms.uOpacity.value = 0.96 - eased * 0.66;
    }

    if (progress >= 1) {
        dancerFormation.forming = false;
        dancerFormation.formed = true;
        try {
            localStorage.setItem(DANCER_MANIFESTED_KEY, '1');
        } catch (error) {
            // The current visit still shows the completed manifestation.
        }
        dancerModelMaterials.forEach((material) => {
            material.opacity = material.userData.dancerBaseOpacity ?? 1;
            material.transparent = material.userData.dancerBaseTransparent ?? false;
        });
        dancerCue.classList.remove('is-forming');
        dancerCue.classList.add('is-formed');
        dancerCue.setAttribute('aria-label', '拖动飞天神女旋转查看，点击开始起舞');
        celestialDancer.state.textContent = '拖动查看 · 点击起舞';
        particleWhisper.textContent = '飞天神女已由星尘凝形 · 拖动查看，点击起舞';
        const shouldDance = dancerFormation.danceOnComplete;
        dancerFormation.danceOnComplete = false;
        if (shouldDance) startCelestialDance(false, true);
    }
    return 0.94 - eased * 0.52;
}

function updateCelestialDancer(elapsed, delta) {
    if (!celestialDancer) return;
    const { torso, head, arms, ribbons, lotus, skirt, aura, cue, state } = celestialDancer;
    const hasDance = dancerDanceStartedAt >= 0;
    const sinceDance = hasDance ? elapsed - dancerDanceStartedAt : 0;
    const entry = hasDance ? THREE.MathUtils.smoothstep(sinceDance, 0, 0.7) : 0;
    const settle = hasDance ? 1 - THREE.MathUtils.smoothstep(sinceDance, 8.5, 11.5) : 0;
    dancerDanceEnergy = entry * settle;
    const energy = dancerDanceEnergy;
    const pulse = Math.sin(elapsed * 1.15);
    const breath = Math.sin(elapsed * 1.4) * 0.5 + 0.5;

    torso.rotation.z = -0.025 + Math.sin(elapsed * 0.75) * 0.012 + Math.sin(elapsed * 1.55) * 0.045 * energy;
    torso.rotation.y = Math.sin(elapsed * 0.62) * 0.025 + Math.sin(elapsed * 1.1) * 0.13 * energy;
    torso.position.y = 2.75 + Math.sin(elapsed * 1.35) * 0.012 + breath * 0.018 * energy;
    head.rotation.z = -0.035 + Math.sin(elapsed * 0.82 + 0.8) * 0.018 + Math.sin(elapsed * 1.9) * 0.055 * energy;
    head.rotation.y = 0.08 + Math.sin(elapsed * 0.7) * 0.035 * energy;

    arms.left.shoulder.rotation.z = 2.42 + Math.sin(elapsed * 1.45) * 0.17 * energy;
    arms.left.shoulder.rotation.x = 0.1 + Math.sin(elapsed * 1.08) * 0.12 * energy;
    arms.left.elbow.rotation.z = 0.2 + Math.sin(elapsed * 1.7 + 0.5) * 0.2 * energy;
    arms.left.wrist.rotation.z = -0.38 + Math.sin(elapsed * 2.1) * 0.22 * energy;
    arms.right.shoulder.rotation.z = -0.67 + Math.sin(elapsed * 1.22 + Math.PI) * 0.15 * energy;
    arms.right.shoulder.rotation.x = 0.12 + Math.sin(elapsed * 1.65 + Math.PI) * 0.1 * energy;
    arms.right.elbow.rotation.z = -0.24 + Math.sin(elapsed * 1.8 + 1.2) * 0.17 * energy;
    arms.right.wrist.rotation.z = 0.3 + Math.sin(elapsed * 2.25 + 0.4) * 0.25 * energy;

    skirt.children.forEach((panel, index) => {
        panel.rotation.y = Math.sin(elapsed * 1.0 + panel.userData.phase + index) * 0.045 * energy;
        panel.rotation.z = Math.sin(elapsed * 1.15 + index * 1.6) * 0.025 * energy;
    });
    lotus.userData.petals.forEach((petal, index) => {
        petal.rotation.y += delta * (0.025 + energy * 0.02);
        petal.position.y = Math.sin(elapsed * 0.8 + index * 0.34) * 0.012;
    });
    ribbons.forEach((ribbon) => updateDancerRibbon(ribbon, elapsed, energy));
    aura.rotation.y = elapsed * (dancerFormation.forming ? 0.28 : 0.06);
    dancerAuraMaterial.uniforms.uTime.value = elapsed;
    const formationAuraOpacity = updateDancerFormation(elapsed);
    dancerAuraMaterial.uniforms.uOpacity.value = formationAuraOpacity
        ?? (0.38 + energy * 0.38 + Math.sin(elapsed * 1.4) * 0.045);

    if (dancerAnimationMixer) {
        dancerAnimationMixer.update(delta);
    }
    if (dancerModelMount) {
        const focused = elapsed < dancerHighlightUntil;
        const focusEnergy = focused ? Math.max(energy, 0.62) : energy;
        dancerModelYaw = THREE.MathUtils.damp(dancerModelYaw, dancerModelYawTarget, 7.5, delta);
        dancerModelMount.rotation.y = dancerModelYaw
            + Math.sin(elapsed * 0.24) * 0.045
            + Math.sin(elapsed * 1.05) * 0.018 * focusEnergy;
        dancerModelMount.rotation.z = Math.sin(elapsed * 0.62) * 0.008
            + Math.sin(elapsed * 1.18) * 0.018 * focusEnergy;
        dancerModelMount.position.y = 0.08
            + Math.sin(elapsed * 1.08) * 0.07
            + Math.sin(elapsed * 1.72) * 0.055 * focusEnergy;
    }
    if (dancerModelOrbit) {
        dancerModelOrbit.rotation.y = elapsed * 0.045;
        dancerModelOrbit.children.forEach((child) => {
            if (child.userData.dancerOrbitSpeed) {
                child.rotation.z = elapsed * child.userData.dancerOrbitSpeed
                    + child.userData.dancerOrbitPhase;
            }
        });
        if (dancerModelOrbit.userData.halo) {
            dancerModelOrbit.userData.halo.material.opacity = 0.16
                + Math.sin(elapsed * 1.2) * 0.035
                + energy * 0.08;
        }
    }
    if (dancerModelMaterials.length > 0) {
        const highlight = Math.max(0, Math.min(1, (dancerHighlightUntil - elapsed) / 5.8));
        const shimmer = 0.5 + Math.sin(elapsed * 2.4) * 0.5;
        dancerModelMaterials.forEach((material) => {
            if (!material.emissive) return;
            const base = material.userData.dancerBaseEmissiveIntensity || 0;
            material.emissiveIntensity = base + energy * 0.08 + highlight * (0.16 + shimmer * 0.16);
        });
    }
    if (muralPortalVideoMaterial) {
        muralPortalVideoMaterial.opacity = muralPortalVideoPlane?.visible
            ? 0.82 + Math.sin(elapsed * 1.25) * 0.02 + energy * 0.05
            : 0;
    }

    if (hasDance && sinceDance > 11.5) {
        dancerDanceStartedAt = -1;
        dancerDanceEnergy = 0;
        cue.classList.remove('is-dancing');
        cue.setAttribute('aria-label', dancerModelState.status === 'error'
            ? '点击播放飞天神女壁画'
            : '拖动飞天神女旋转查看，点击开始起舞');
        state.textContent = dancerModelState.status === 'error' ? '壁画回响' : '拖动查看 · 点击起舞';
    }
}

function buildJourneyThread() {
    if (!celestialDancer || architectureEntries.length < 3) return;
    const dancerPoint = celestialDancer.root.position.clone().add(new THREE.Vector3(0, 4.2, -0.3));
    const stops = [
        celestialDancer.root.position.clone().add(new THREE.Vector3(-0.4, 1.3, 0.9)),
        architectureEntries[2].anchor.clone().add(new THREE.Vector3(0, 3.1, 0.7)),
        architectureEntries[0].anchor.clone().add(new THREE.Vector3(0, 5.2, 0.7)),
        architectureEntries[1].anchor.clone().add(new THREE.Vector3(0, 2.3, 0.7)),
        dancerPoint
    ];
    const control = [
        stops[0],
        stops[0].clone().lerp(stops[1], 0.5).add(new THREE.Vector3(-1.2, 2.4, 1.5)),
        stops[1],
        stops[1].clone().lerp(stops[2], 0.5).add(new THREE.Vector3(1.6, 2.8, -1.1)),
        stops[2],
        stops[2].clone().lerp(stops[3], 0.5).add(new THREE.Vector3(2.2, 1.8, 1.2)),
        stops[3],
        stops[3].clone().lerp(stops[4], 0.5).add(new THREE.Vector3(-1.1, 2.1, 1.5)),
        stops[4]
    ];
    journeyCurve = new THREE.CatmullRomCurve3(control, false, 'catmullrom', 0.32);

    const threadPoints = journeyCurve.getPoints(220);
    const positions = [];
    const colors = [];
    const palette = [new THREE.Color(0xe7c17e), new THREE.Color(0x61a49a), new THREE.Color(0x5a88a5)];
    threadPoints.forEach((point, index) => {
        const t = index / (threadPoints.length - 1);
        positions.push(point.x, point.y, point.z);
        const color = palette[Math.floor(t * 8) % palette.length].clone();
        colors.push(color.r, color.g, color.b);
    });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const line = new THREE.Line(
        lineGeometry,
        new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.48,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    worldGroup.add(line);

    const threadTube = new THREE.Mesh(
        new THREE.TubeGeometry(journeyCurve, 180, 0.018, 4, false),
        new THREE.MeshBasicMaterial({
            color: 0xd9b06c,
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    worldGroup.add(threadTube);

    journeyRunner = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeRadialTexture(),
        color: 0xffdd9d,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    journeyRunner.scale.set(0.68, 0.68, 1);
    worldGroup.add(journeyRunner);
}

const JOURNEY_STAGES = [
    {
        title: '神女启舞',
        text: '月光拂过莲台，飞天应声而动',
        body: '飞天一舞，衣带当风；石窟中的第一束光由此苏醒。'
    },
    {
        title: '九层楼',
        text: '九重檐宇自崖壁与星尘中显形',
        body: '九层楼依崖而起，层层叠檐像一部向上展开的经卷。'
    },
    {
        title: '月泉阁',
        text: '泉光映阁，风把建筑轮廓一笔笔点亮',
        body: '月牙泉收住天光，楼阁在水意中显形，沙海因此有了呼吸。'
    },
    {
        title: '藏经阁',
        text: '最后一缕星尘归入藏经阁',
        body: '藏经阁藏在崖影深处，记录丝路上往来不息的故事。'
    },
    {
        title: '星路同辉',
        text: '神女、楼阁与月泉连成一线',
        body: '循着星路回望，鸣沙、月泉与洞窟共同组成敦煌灵境。'
    }
];

function setJourneyStage(index) {
    const stage = JOURNEY_STAGES[index];
    if (!stage) return;
    journeyStoryIndex.textContent = `${String(index + 1).padStart(2, '0')} / 05`;
    journeyStoryTitle.textContent = stage.title;
    journeyStoryText.textContent = stage.text;
    [...journeyStoryProgress.children].forEach((item, itemIndex) => {
        item.classList.toggle('is-current', itemIndex === index);
        item.classList.toggle('is-past', itemIndex < index);
    });
    journeyStory.classList.add('is-visible');
    sceneCaption.querySelector('span').textContent = String(index).padStart(2, '0');
    sceneCaption.querySelector('b').textContent = stage.title;
    sceneCaption.querySelector('small').textContent = stage.text;
}

function advanceJourney(elapsed) {
    if (!journeyState.active || !appState.started) return;
    if (performance.now() < appState.pauseAutoUntil) return;
    if (elapsed < journeyState.nextAt) return;

    journeyState.index += 1;
    if (journeyState.index >= JOURNEY_STAGES.length) journeyState.index = 0;
    setJourneyStage(journeyState.index);

    if (journeyState.index === 0) {
        triggerDancerManifestation(false, true);
        cameraRig.desiredTarget.set(-2.2, 5.0, -19.2);
        cameraRig.desiredAzimuth = 0.04;
        cameraRig.desiredElevation = 0.17;
        cameraRig.desiredRadius = 26.8;
        appState.pauseAutoUntil = 0;
    } else if (journeyState.index <= 3) {
        triggerArchitectureFormation(architectureEntries[journeyState.index - 1], true);
        appState.pauseAutoUntil = 0;
    } else {
        if (appState.activeChapter >= 0) closeChapter();
        hideArchitectureStory();
        cameraRig.desiredTarget.set(-2.2, 4.8, -16.8);
        cameraRig.desiredAzimuth = 0.04;
        cameraRig.desiredElevation = 0.18;
        cameraRig.desiredRadius = getOverviewRadius();
    }
    journeyState.nextAt = elapsed + (journeyState.index === 0 ? 6.2 : 5.9);
}

function startGuidedJourney() {
    if (!appState.started) return;
    journeyState.active = true;
    journeyState.index = -1;
    journeyState.nextAt = clock.elapsedTime + 0.45;
    autoTourButton.setAttribute('aria-pressed', 'true');
    autoTourButton.setAttribute('aria-label', '暂停星路巡游');
    appState.autoTour = true;
}

function stopGuidedJourney() {
    journeyState.active = false;
    autoTourButton.setAttribute('aria-pressed', 'false');
    autoTourButton.setAttribute('aria-label', '开始星路巡游');
    appState.autoTour = false;
}

function createRibbon(color, offset, phase) {
    const points = [];
    for (let i = 0; i <= 26; i += 1) {
        const t = i / 26;
        points.push(new THREE.Vector3(
            -19 + t * 36 + Math.sin(t * Math.PI * 2.4 + phase) * 1.15,
            7.6 + Math.sin(t * Math.PI * 1.8 + phase) * 2.1 + offset,
            -12 + t * 3.5 + Math.cos(t * Math.PI * 1.5 + phase) * 4.8
        ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const ribbonPoints = curve.getPoints(100);
    const positions = [];
    const uvs = [];
    const indices = [];
    const tangent = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    ribbonPoints.forEach((point, index) => {
        const t = index / (ribbonPoints.length - 1);
        curve.getTangentAt(t, tangent);
        normal.crossVectors(tangent, up).normalize();
        const envelope = Math.pow(Math.sin(Math.PI * t), 0.72);
        const width = (0.12 + 0.46 * Math.sin(t * Math.PI * 2.6 + phase)) * envelope;
        const left = point.clone().addScaledVector(normal, width);
        const right = point.clone().addScaledVector(normal, -width * 0.72);
        positions.push(left.x, left.y, left.z, right.x, right.y, right.z);
        uvs.push(0, t, 1, t);
        if (index < ribbonPoints.length - 1) {
            const a = index * 2;
            indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    mesh.renderOrder = 2;
    mesh.userData.phase = phase;
    mesh.userData.baseY = 0;
    ribbons.push(mesh);
    worldGroup.add(mesh);
}

function buildRibbons() {
    createRibbon(0xd09a4f, 0.35, 0);
    createRibbon(0xa44a33, 1.7, 2.3);
    createRibbon(0x315f7e, -1.25, 4.1);
    createRibbon(0x397b72, 2.8, 5.5);
}

function buildDust() {
    const count = isCoarsePointer ? 420 : 780;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const dustPalette = [0xffd89a, 0xe7c17e, 0x83a9a0, 0xd77657, 0x6e91aa];

    for (let i = 0; i < count; i += 1) {
        positions[i * 3] = (random() - 0.5) * 52;
        positions[i * 3 + 1] = 0.6 + random() * 18;
        positions[i * 3 + 2] = -30 + random() * 60;
        const color = new THREE.Color(dustPalette[Math.floor(random() * dustPalette.length)]);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    dustPoints = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            map: makeRadialTexture(),
            vertexColors: true,
            size: 0.085,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.58,
            depthWrite: false,
            alphaTest: 0.02,
            blending: THREE.AdditiveBlending
        })
    );
    worldGroup.add(dustPoints);
}

function appendParticleEllipsoid(points, center, radius, count) {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let index = 0; index < count; index += 1) {
        const y = 1 - (index / Math.max(1, count - 1)) * 2;
        const ring = Math.sqrt(Math.max(0, 1 - y * y));
        const angle = index * goldenAngle;
        points.push(
            center[0] + Math.cos(angle) * ring * radius[0],
            center[1] + y * radius[1],
            center[2] + Math.sin(angle) * ring * radius[2]
        );
    }
}

function appendParticleLine(points, from, to, count) {
    for (let index = 0; index < count; index += 1) {
        const t = index / Math.max(1, count - 1);
        points.push(
            THREE.MathUtils.lerp(from[0], to[0], t),
            THREE.MathUtils.lerp(from[1], to[1], t),
            THREE.MathUtils.lerp(from[2], to[2], t)
        );
    }
}

function buildAmbientLife() {
    const camelPoints = [];
    const addCamel = (offsetX) => {
        appendParticleEllipsoid(camelPoints, [offsetX, 0.78, 0], [0.72, 0.38, 0.3], 42);
        appendParticleEllipsoid(camelPoints, [offsetX - 0.18, 1.1, 0], [0.3, 0.22, 0.2], 18);
        appendParticleEllipsoid(camelPoints, [offsetX + 0.2, 1.1, 0], [0.27, 0.2, 0.18], 16);
        appendParticleLine(camelPoints, [offsetX + 0.53, 0.9, 0], [offsetX + 0.84, 1.55, 0], 16);
        appendParticleEllipsoid(camelPoints, [offsetX + 0.9, 1.63, 0], [0.2, 0.11, 0.12], 14);
        [-0.43, 0.4].forEach((legX) => {
            appendParticleLine(camelPoints, [offsetX + legX, 0.65, -0.17], [offsetX + legX - 0.04, 0.04, -0.15], 9);
            appendParticleLine(camelPoints, [offsetX + legX, 0.65, 0.17], [offsetX + legX + 0.04, 0.04, 0.15], 9);
        });
    };
    addCamel(0);
    addCamel(1.75);
    addCamel(3.48);

    const camelCount = camelPoints.length / 3;
    const camelColors = new Float32Array(camelCount * 3);
    const camelSizes = new Float32Array(camelCount);
    const camelPhases = new Float32Array(camelCount);
    const camelAlphas = new Float32Array(camelCount);
    const camelPalette = [0xd9ad68, 0xb77b45, 0x7ea79a, 0xe7d4a5];
    for (let index = 0; index < camelCount; index += 1) {
        const color = new THREE.Color(camelPalette[index % camelPalette.length]);
        camelColors[index * 3] = color.r;
        camelColors[index * 3 + 1] = color.g;
        camelColors[index * 3 + 2] = color.b;
        camelSizes[index] = 0.58 + random() * 0.52;
        camelPhases[index] = random() * Math.PI * 2;
        camelAlphas[index] = 0.42 + random() * 0.3;
    }

    const camelGeometry = new THREE.BufferGeometry();
    camelGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(camelPoints), 3));
    camelGeometry.setAttribute('color', new THREE.BufferAttribute(camelColors, 3));
    camelGeometry.setAttribute('aSize', new THREE.BufferAttribute(camelSizes, 1));
    camelGeometry.setAttribute('aPhase', new THREE.BufferAttribute(camelPhases, 1));
    camelGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(camelAlphas, 1));
    const camelMaterial = createConstellationMaterial();
    camelMaterial.uniforms.uOpacity.value = 0.56;
    const camelCloud = new THREE.Points(camelGeometry, camelMaterial);
    camelCloud.renderOrder = 2;

    const dustPositions = [];
    for (let index = 0; index < 110; index += 1) {
        dustPositions.push(
            -0.9 + random() * 5.8,
            0.08 + random() * 0.75,
            (random() - 0.5) * 1.15
        );
    }
    const caravanDustCount = dustPositions.length / 3;
    const caravanDustColors = new Float32Array(caravanDustCount * 3);
    const caravanDustSizes = new Float32Array(caravanDustCount);
    const caravanDustPhases = new Float32Array(caravanDustCount);
    const caravanDustAlphas = new Float32Array(caravanDustCount);
    for (let index = 0; index < caravanDustCount; index += 1) {
        const color = new THREE.Color(index % 4 === 0 ? 0xe7c17e : 0xb98157);
        caravanDustColors[index * 3] = color.r;
        caravanDustColors[index * 3 + 1] = color.g;
        caravanDustColors[index * 3 + 2] = color.b;
        caravanDustSizes[index] = 1.3 + random() * 2.4;
        caravanDustPhases[index] = random() * Math.PI * 2;
        caravanDustAlphas[index] = 0.12 + random() * 0.22;
    }
    const caravanDustGeometry = new THREE.BufferGeometry();
    caravanDustGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dustPositions), 3));
    caravanDustGeometry.setAttribute('color', new THREE.BufferAttribute(caravanDustColors, 3));
    caravanDustGeometry.setAttribute('aSize', new THREE.BufferAttribute(caravanDustSizes, 1));
    caravanDustGeometry.setAttribute('aPhase', new THREE.BufferAttribute(caravanDustPhases, 1));
    caravanDustGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(caravanDustAlphas, 1));
    const caravanDustMaterial = createConstellationMaterial();
    caravanDustMaterial.uniforms.uOpacity.value = 0.42;
    const caravanDust = new THREE.Points(caravanDustGeometry, caravanDustMaterial);

    caravanGroup = new THREE.Group();
    caravanGroup.position.set(18.4, terrainHeight(18.4, -26.4) + 0.28, -26.4);
    caravanGroup.rotation.y = -0.22;
    caravanGroup.scale.setScalar(1.16);
    caravanGroup.add(camelCloud, caravanDust);
    caravanBaseX = caravanGroup.position.x;
    caravanBaseY = caravanGroup.position.y;
    worldGroup.add(caravanGroup);

    const reedPositions = [];
    for (let tuft = 0; tuft < 26; tuft += 1) {
        const angle = random() * Math.PI * 2;
        const radius = 6.5 + random() * 2.9;
        const x = 10.4 + Math.cos(angle) * radius * 1.12;
        const z = -15.2 + Math.sin(angle) * radius * 0.76;
        const groundY = terrainHeight(x, z);
        for (let blade = 0; blade < 3; blade += 1) {
            const height = 0.35 + random() * 0.9;
            reedPositions.push(
                x + (random() - 0.5) * 0.12,
                groundY + 0.03,
                z + (random() - 0.5) * 0.12,
                x + (random() - 0.5) * 0.34,
                groundY + height,
                z + (random() - 0.5) * 0.34
            );
        }
    }
    const reedGeometry = new THREE.BufferGeometry();
    reedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(reedPositions, 3));
    desertReeds = new THREE.LineSegments(
        reedGeometry,
        new THREE.LineBasicMaterial({
            color: 0x92714d,
            transparent: true,
            opacity: 0.3,
            depthWrite: false
        })
    );
    worldGroup.add(desertReeds);

    const craneVertices = [];
    const craneOffsets = [
        [0, 0],
        [1.1, 0.7],
        [-1.0, 0.55],
        [2.15, 1.35],
        [-2.05, 1.2]
    ];
    craneOffsets.forEach(([x, y], index) => {
        const size = 0.36 + (index % 2) * 0.08;
        craneVertices.push(
            x - size, y + size * 0.42, 0, x, y, 0,
            x, y, 0, x + size, y + size * 0.42, 0,
            x - size * 0.2, y + 0.01, 0, x + size * 0.2, y + 0.01, 0
        );
    });
    const craneGeometry = new THREE.BufferGeometry();
    craneGeometry.setAttribute('position', new THREE.Float32BufferAttribute(craneVertices, 3));
    skyCraneGroup = new THREE.LineSegments(
        craneGeometry,
        new THREE.LineBasicMaterial({
            color: 0xd8b879,
            transparent: true,
            opacity: 0.34,
            depthWrite: false
        })
    );
    skyCraneGroup.position.set(17, 15.8, -29.5);
    skyCraneBaseX = skyCraneGroup.position.x;
    worldGroup.add(skyCraneGroup);
}

function makeMarkerHalo() {
    const texture = makeRadialTexture();
    return new THREE.SpriteMaterial({
        map: texture,
        color: 0xffd194,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
}

function buildChapterMarkers() {
    const loader = new THREE.TextureLoader();
    const frameMaterial = new THREE.MeshBasicMaterial({
        color: 0x2c1713,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xc99651,
        emissive: 0x5d351d,
        emissiveIntensity: 0.58,
        roughness: 0.48,
        metalness: 0.34
    });

    CHAPTERS.forEach((chapter, index) => {
        const position = chapterPosition(index);
        const group = new THREE.Group();
        group.position.copy(position);

        const halo = new THREE.Sprite(makeMarkerHalo());
        halo.position.y = 2.95;
        halo.scale.set(7.4, 7.4, 1);
        group.add(halo);

        const beam = new THREE.Mesh(
            new THREE.CylinderGeometry(0.018, 0.1, 2.5, 8, 1, true),
            new THREE.MeshBasicMaterial({
                color: 0xf5c982,
                transparent: true,
                opacity: 0.16,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );
        beam.position.y = 1.25;
        group.add(beam);

        const frame = new THREE.Mesh(new THREE.PlaneGeometry(3.05, 2.22), frameMaterial);
        frame.position.y = 2.92;
        group.add(frame);

        const imageMaterial = new THREE.MeshBasicMaterial({
            color: 0xd5b17e,
            side: THREE.DoubleSide,
            transparent: false
        });
        const image = new THREE.Mesh(new THREE.PlaneGeometry(2.72, 1.72), imageMaterial);
        image.position.set(0, 2.92, 0.025);
        image.userData.chapterIndex = index;
        group.add(image);
        raycastMeshes.push(image);

        loader.load(chapter.image, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
            imageMaterial.map = texture;
            imageMaterial.color.set(0xffffff);
            imageMaterial.needsUpdate = true;
        }, undefined, () => {
            imageMaterial.color.set(0xa96243);
        });

        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.03, 7, 72), goldMaterial);
        ring.position.y = 2.92;
        ring.material = goldMaterial.clone();
        ring.material.transparent = true;
        ring.material.opacity = 0.64;
        group.add(ring);

        [1.86, 3.98].forEach((rodY) => {
            const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 3.18, 9), goldMaterial);
            rod.rotation.z = Math.PI / 2;
            rod.position.set(0, rodY, 0.08);
            group.add(rod);
        });
        [-1.24, 1.24].forEach((tasselX) => {
            const thread = new THREE.Mesh(
                new THREE.CylinderGeometry(0.011, 0.011, 0.34, 5),
                new THREE.MeshBasicMaterial({ color: 0xbf8d4b })
            );
            thread.position.set(tasselX, 1.67, 0.1);
            group.add(thread);
            const bead = new THREE.Mesh(
                new THREE.SphereGeometry(0.045, 8, 6),
                new THREE.MeshBasicMaterial({ color: 0x8f3527 })
            );
            bead.position.set(tasselX, 1.48, 0.1);
            group.add(bead);
        });

        const temple = new THREE.Mesh(
            new THREE.CylinderGeometry(0.62, 0.9, 0.18, 16),
            new THREE.MeshStandardMaterial({
                color: 0x5d4032,
                roughness: 0.8,
                emissive: 0x22110c,
                emissiveIntensity: 0.22
            })
        );
        temple.position.y = 0.1;
        temple.receiveShadow = true;
        group.add(temple);

        const light = new THREE.PointLight(0xffb968, 4.1, 7.5, 2);
        light.position.y = 2.4;
        group.add(light);

        group.userData = { index, ring, image, halo, beam };
        group.scale.setScalar(0.72);
        worldGroup.add(group);
        chapterMarkers.push(group);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'scene-node';
        button.dataset.chapter = String(index);
        button.setAttribute('aria-label', `前往第${index + 1}站：${chapter.name}`);
        button.innerHTML = `
            <span class="node-halo" aria-hidden="true"></span>
            <span class="node-label">
                <b>${chapter.name}</b>
                <small>CHAPTER ${String(index + 1).padStart(2, '0')}</small>
            </span>
        `;
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            focusChapter(index);
        });
        nodeLayer.appendChild(button);
        group.userData.button = button;
    });
}

function updateCamera(immediate = false) {
    if (immediate) {
        cameraRig.azimuth = cameraRig.desiredAzimuth;
        cameraRig.elevation = cameraRig.desiredElevation;
        cameraRig.radius = cameraRig.desiredRadius;
        cameraRig.target.copy(cameraRig.desiredTarget);
    }

    const horizontal = Math.cos(cameraRig.elevation) * cameraRig.radius;
    camera.position.set(
        cameraRig.target.x + Math.sin(cameraRig.azimuth) * horizontal,
        cameraRig.target.y + Math.sin(cameraRig.elevation) * cameraRig.radius,
        cameraRig.target.z + Math.cos(cameraRig.azimuth) * horizontal
    );
    camera.lookAt(cameraRig.target);
}

function smoothCamera(delta) {
    const response = 1 - Math.exp(-delta * 2.9);
    cameraRig.azimuth = THREE.MathUtils.lerp(cameraRig.azimuth, cameraRig.desiredAzimuth, response);
    cameraRig.elevation = THREE.MathUtils.lerp(cameraRig.elevation, cameraRig.desiredElevation, response);
    cameraRig.radius = THREE.MathUtils.lerp(cameraRig.radius, cameraRig.desiredRadius, response);
    cameraRig.target.lerp(cameraRig.desiredTarget, response);
    updateCamera();
}

function enterWorldScene(restored = false) {
    if (appState.started) return;
    appState.started = true;
    try {
        sessionStorage.setItem(EXPLORE_RETURN_KEY, '1');
    } catch (error) {
        // The scene still enters if session storage is unavailable.
    }
    introScreen.classList.add('is-leaving');
    if (restored) introScreen.classList.add('is-instant');
    introScreen.setAttribute('aria-hidden', 'true');
    introScreen.inert = true;
    cameraRig.desiredRadius = getOverviewRadius();
    cameraRig.desiredElevation = 0.18;
    cameraRig.desiredTarget.set(-2.2, 4.8, -16.8);
    if (muralPortalVideo) muralPortalVideo.play().catch(() => {});
    particleWhisper.classList.add('is-visible');
    if (!restored) startSound();
    setTimeout(() => {
        sceneCaption.classList.add('is-visible');
    }, restored ? 0 : 900);
}

function bindEvents() {
    enterWorld.addEventListener('click', () => enterWorldScene());

    chapterClose.addEventListener('click', closeChapter);
    collectSeal.addEventListener('click', collectActiveSeal);
    autoTourButton.addEventListener('click', toggleAutoTour);
    soundButton.addEventListener('click', toggleSound);
    resetViewButton.addEventListener('click', resetView);
    architectureStoryClose.addEventListener('click', () => {
        hideArchitectureStory();
        resetView();
    });
    architectureStoryOverview.addEventListener('click', () => {
        hideArchitectureStory();
        resetView();
    });
    enterStory.addEventListener('click', () => {
        try {
            sessionStorage.setItem(EXPLORE_RETURN_KEY, '1');
        } catch (error) {
            // The return URL still restores the overview if storage is unavailable.
        }
    });

    document.querySelectorAll('.route-node').forEach((button) => {
        button.addEventListener('click', () => focusChapter(Number(button.dataset.route)));
    });

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('click', onCanvasClick);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('contextmenu', (event) => event.preventDefault());
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && appState.soundOn) {
            bgMusic.pause();
        } else if (!document.hidden && appState.soundOn) {
            bgMusic.play().catch(() => {});
        }
        if (document.hidden && muralPortalVideo) {
            muralPortalVideo.pause();
        } else if (!document.hidden && muralPortalVideo && appState.started) {
            muralPortalVideo.play().catch(() => {});
        }
    });

    chapterCard.addEventListener('pointerenter', () => {
        appState.pauseAutoUntil = performance.now() + 2500;
    });

    window.addEventListener('error', (event) => {
        if (!renderer && event.message) {
            showWebglError();
        }
    });
}

function isDancerAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    return raycaster.intersectObjects(dancerHitTargets, false).length > 0;
}

function beginPointerGesture(event, mode = 'camera') {
    if (mode === 'dancer' && !dancerFormation.formed) mode = 'camera';
    appState.interactionMode = mode;
    appState.dragging = true;
    appState.dragged = false;
    appState.pointerDownAt = performance.now();
    appState.pauseAutoUntil = performance.now() + 4500;
    if (mode === 'dancer' && journeyState.active) stopGuidedJourney();
    pointerState.id = event.pointerId;
    pointerState.x = event.clientX;
    pointerState.y = event.clientY;
    pointerState.lastX = event.clientX;
    pointerState.lastY = event.clientY;
    event.currentTarget?.setPointerCapture?.(event.pointerId);
    canvas.style.cursor = 'grabbing';
}

function onPointerDown(event) {
    if (event.target !== canvas) return;
    beginPointerGesture(event, isDancerAt(event.clientX, event.clientY) ? 'dancer' : 'camera');
}

function onDancerSurfacePointerDown(event) {
    event.stopPropagation();
    beginPointerGesture(event, 'dancer');
}

function onPointerMove(event) {
    if (!appState.dragging) {
        if (event.target === canvas && appState.started) {
            updateArchitectureHover(event.clientX, event.clientY);
        }
        return;
    }
    if (event.pointerId !== pointerState.id) return;
    const dx = event.clientX - pointerState.lastX;
    const dy = event.clientY - pointerState.lastY;
    if (Math.abs(event.clientX - pointerState.x) + Math.abs(event.clientY - pointerState.y) > 4) {
        appState.dragged = true;
    }
    if (appState.interactionMode === 'dancer') {
        dancerModelYawTarget -= dx * 0.011;
    } else {
        cameraRig.desiredAzimuth -= dx * 0.0045;
        cameraRig.desiredElevation = THREE.MathUtils.clamp(cameraRig.desiredElevation + dy * 0.0032, 0.08, 0.65);
    }
    pointerState.lastX = event.clientX;
    pointerState.lastY = event.clientY;
    if (event.cancelable) event.preventDefault();
}

function updateArchitectureHover(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    const dancerHit = raycaster.intersectObjects(dancerHitTargets, false)[0];
    const hit = raycaster.intersectObjects([...architectureHitTargets, ...architectureMeshTargets], false)[0];
    const hoveredEntry = hit ? hit.object.userData.architectureEntry : null;
    canvas.style.cursor = hoveredEntry ? 'pointer' : (dancerHit ? 'ew-resize' : 'grab');
    architectureEntries.forEach((entry) => {
        entry.button.classList.toggle('is-near', entry === hoveredEntry);
    });
    if (dancerCue) dancerCue.classList.toggle('is-near', Boolean(dancerHit));
}

function onPointerUp(event) {
    if (!appState.dragging) return;
    if (event.pointerId !== undefined && pointerState.id !== null && event.pointerId !== pointerState.id) return;
    const wasDragged = appState.dragged;
    const clickDuration = performance.now() - appState.pointerDownAt;
    appState.dragging = false;
    appState.interactionMode = 'camera';
    pointerState.id = null;
    canvas.style.cursor = 'grab';
    appState.lastPointerWasDrag = wasDragged;
    appState.lastPointerDuration = clickDuration;
}

function onCanvasClick(event) {
    if (appState.lastPointerWasDrag || appState.lastPointerDuration >= 500) return;
    pickScene(event.clientX, event.clientY);
}

function onWheel(event) {
    if (!appState.started) return;
    appState.pauseAutoUntil = performance.now() + 4500;
    cameraRig.desiredRadius = THREE.MathUtils.clamp(cameraRig.desiredRadius + event.deltaY * 0.018, 9.5, 76);
    if (event.cancelable) event.preventDefault();
}

function onKeyDown(event) {
    if (event.key === 'Escape') {
        if (activeArchitectureStory) {
            hideArchitectureStory();
            resetView();
            return;
        }
        closeChapter();
        return;
    }
    if (!appState.started) return;
    if (event.key === 'ArrowLeft') {
        cameraRig.desiredAzimuth += 0.12;
        appState.pauseAutoUntil = performance.now() + 4000;
    } else if (event.key === 'ArrowRight') {
        cameraRig.desiredAzimuth -= 0.12;
        appState.pauseAutoUntil = performance.now() + 4000;
    } else if (event.key === '+' || event.key === '=') {
        cameraRig.desiredRadius = Math.max(9.5, cameraRig.desiredRadius - 1.5);
    } else if (event.key === '-') {
        cameraRig.desiredRadius = Math.min(76, cameraRig.desiredRadius + 1.5);
    }
}

function focusArchitecture(building = architectureEntries[0], immediate = true) {
    if (!building) return;
    if (appState.activeChapter >= 0) closeChapter();
    appState.pauseAutoUntil = performance.now() + 9000;
    const target = building.anchor;
    cameraRig.desiredTarget.set(target.x, target.y + building.height * 0.48, target.z);
    cameraRig.desiredAzimuth = building.x >= 0 ? 0.08 : -0.08;
    cameraRig.desiredElevation = 0.17;
    cameraRig.desiredRadius = Math.max(15.5, building.focusRadius * 1.08);
    if (immediate) updateCamera(true);
}

function pickScene(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    const dancerHits = raycaster.intersectObjects(dancerHitTargets, false);
    if (dancerHits.length > 0) {
        triggerDancerManifestation();
        return;
    }
    const architectureHits = raycaster.intersectObjects([...architectureHitTargets, ...architectureMeshTargets], false);
    if (architectureHits.length > 0) {
        triggerArchitectureFormation(architectureHits[0].object.userData.architectureEntry);
        return;
    }
    const intersections = raycaster.intersectObjects(raycastMeshes, false);
    if (intersections.length > 0) {
        focusChapter(intersections[0].object.userData.chapterIndex);
    }
}

function focusChapter(index, recordVisit = false) {
    const chapter = CHAPTERS[index];
    if (!chapter) return;
    hideArchitectureStory();
    appState.activeChapter = index;
    if (recordVisit) markVisited(index);

    chapterImage.src = chapter.image;
    chapterImage.alt = `${chapter.name}主题插画`;
    chapterIndex.textContent = `CHAPTER ${String(index + 1).padStart(2, '0')}`;
    chapterTitle.textContent = chapter.name;
    chapterSubtitle.textContent = chapter.subtitle;
    chapterDescription.textContent = chapter.description;
    chapterStamp.textContent = chapter.stamp;
    enterStory.href = chapter.href;
    updateSealButton();

    chapterCard.classList.add('is-open');
    chapterCard.setAttribute('aria-hidden', 'false');
    appState.pauseAutoUntil = performance.now() + 60000;

    cameraRig.desiredTarget.set(
        chapter.camera.targetX,
        terrainHeight(chapter.camera.targetX, chapter.camera.targetZ) + 3.1,
        chapter.camera.targetZ
    );
    cameraRig.desiredAzimuth = chapter.camera.azimuth;
    cameraRig.desiredElevation = chapter.camera.elevation;
    cameraRig.desiredRadius = chapter.camera.radius;

    document.querySelectorAll('.route-node').forEach((button, buttonIndex) => {
        button.classList.toggle('is-current', buttonIndex === index);
        if (buttonIndex === index) {
            button.setAttribute('aria-current', 'step');
        } else {
            button.removeAttribute('aria-current');
        }
    });

    chapterMarkers.forEach((marker, markerIndex) => {
        marker.userData.button.classList.toggle('is-active', markerIndex === index);
    });

    sceneCaption.querySelector('span').textContent = String(index + 1).padStart(2, '0');
    sceneCaption.querySelector('b').textContent = chapter.name;
    sceneCaption.querySelector('small').textContent = chapter.subtitle;
    sceneCaption.classList.add('is-visible');
}

function closeChapter() {
    if (appState.activeChapter < 0) return;
    appState.activeChapter = -1;
    chapterCard.classList.remove('is-open');
    chapterCard.setAttribute('aria-hidden', 'true');
    appState.pauseAutoUntil = performance.now() + 2200;
    chapterMarkers.forEach((marker) => {
        marker.userData.button.classList.remove('is-active');
    });
    document.querySelectorAll('.route-node').forEach((button, index) => {
        button.classList.toggle('is-current', index === currentRouteIndex());
    });
    const routeIndex = currentRouteIndex();
    sceneCaption.querySelector('span').textContent = String(routeIndex + 1).padStart(2, '0');
    sceneCaption.querySelector('b').textContent = CHAPTERS[routeIndex].name;
    sceneCaption.querySelector('small').textContent = CHAPTERS[routeIndex].subtitle;
}

function collectActiveSeal() {
    const index = appState.activeChapter;
    if (index < 0) return;
    const chapter = CHAPTERS[index];
    if (appState.marks[chapter.id]) {
        return;
    }
    appState.marks[chapter.id] = {
        collected: true,
        time: new Date().toISOString()
    };
    persistExistingMedal(chapter.id);
    saveMarks();
    updateRouteUI();
    updateSealButton();
    collectSeal.animate(
        [
            { transform: 'scale(1)' },
            { transform: 'scale(1.05)' },
            { transform: 'scale(1)' }
        ],
        { duration: 380, easing: 'ease-out' }
    );
}

function persistExistingMedal(id) {
    try {
        const key = 'dunhuang_medals_default';
        const medals = JSON.parse(localStorage.getItem(key)) || {};
        medals[id] = { obtained: true, time: new Date().toISOString() };
        localStorage.setItem(key, JSON.stringify(medals));
    } catch (error) {
        // The new route's own storage still records the seal.
    }
}

function markVisited(index) {
    const chapter = CHAPTERS[index];
    if (!appState.marks[chapter.id]) {
        appState.marks[chapter.id] = {
            visited: true,
            time: new Date().toISOString()
        };
        saveMarks();
        updateRouteUI();
    }
}

function updateSealButton() {
    const index = appState.activeChapter;
    const collected = index >= 0 && Boolean(appState.marks[CHAPTERS[index].id]);
    collectSeal.classList.toggle('is-collected', collected);
    collectSeal.disabled = collected;
    collectLabel.textContent = collected ? '已收录此印' : '收录此印';
}

function countMarks() {
    return CHAPTERS.reduce((total, chapter) => total + (appState.marks[chapter.id] ? 1 : 0), 0);
}

function currentRouteIndex() {
    return appState.activeChapter >= 0 ? appState.activeChapter : 0;
}

function updateRouteUI() {
    const count = countMarks();
    collectedCount.textContent = String(count);
    chapterCount.textContent = count === 0 ? '未寻印记' : count === 5 ? '五印俱齐' : '已寻印记';

    document.querySelectorAll('.route-node').forEach((button, index) => {
        const chapter = CHAPTERS[index];
        button.classList.toggle('is-visited', Boolean(appState.marks[chapter.id]));
        const marker = chapterMarkers[index];
        if (marker) {
            marker.userData.button.classList.toggle('is-visited', Boolean(appState.marks[chapter.id]));
        }
    });
}

function toggleAutoTour() {
    if (appState.autoTour) {
        stopGuidedJourney();
    } else {
        hideArchitectureStory();
        if (appState.activeChapter >= 0) closeChapter();
        appState.pauseAutoUntil = 0;
        startGuidedJourney();
    }
}

function startSound() {
    appState.soundOn = true;
    bgMusic.volume = 0.28;
    bgMusic.play().then(() => {
        soundButton.setAttribute('aria-pressed', 'true');
        soundButton.setAttribute('aria-label', '关闭环境声音');
    }).catch(() => {
        appState.soundOn = false;
        soundButton.setAttribute('aria-pressed', 'false');
    });
}

function toggleSound() {
    if (appState.soundOn) {
        bgMusic.pause();
        appState.soundOn = false;
        soundButton.setAttribute('aria-pressed', 'false');
        soundButton.setAttribute('aria-label', '开启环境声音');
    } else {
        startSound();
    }
}

function resetView() {
    if (appState.activeChapter >= 0) closeChapter();
    hideArchitectureStory();
    cameraRig.desiredTarget.set(-2.2, 4.8, -16.8);
    cameraRig.desiredAzimuth = 0.04;
    cameraRig.desiredElevation = 0.18;
    cameraRig.desiredRadius = getOverviewRadius();
    appState.pauseAutoUntil = performance.now() + 3500;
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCoarsePointer ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    architectureEntries.forEach((entry) => {
        entry.cloud.material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    });
    if (appState.started && !activeArchitectureStory && appState.activeChapter < 0 && !journeyState.active) {
        cameraRig.desiredRadius = getOverviewRadius();
    }
    if (activeArchitectureStory) positionArchitectureStory(activeArchitectureStory);
}

function updateMarkers() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    chapterMarkers.forEach((marker, index) => {
        const position = marker.position.clone().add(new THREE.Vector3(0, 2.65, 0));
        position.project(camera);
        const button = marker.userData.button;
        const inView = position.z < 1 && position.x > -1.18 && position.x < 1.18 && position.y > -1.18 && position.y < 1.18;
        const tooClose = camera.position.distanceTo(marker.position) < 8.5;
        marker.visible = appState.started && inView && !tooClose;
        button.classList.toggle('is-visible', marker.visible);
        button.style.left = `${(position.x * 0.5 + 0.5) * width}px`;
        button.style.top = `${(-position.y * 0.5 + 0.5) * height}px`;

        marker.userData.ring.quaternion.copy(camera.quaternion);
        marker.userData.image.quaternion.copy(camera.quaternion);
        const pulse = 1 + Math.sin(clock.elapsedTime * 1.8 + index * 1.1) * 0.035;
        marker.userData.ring.scale.setScalar(pulse);
        marker.userData.halo.material.opacity = 0.3 + Math.sin(clock.elapsedTime * 1.25 + index) * 0.08;
    });

    architectureEntries.forEach((building) => {
        const projection = building.anchor.clone();
        projection.y += building.height * 0.92;
        projection.project(camera);
        const visible = appState.started
            && projection.z < 1
            && projection.x > -1.12
            && projection.x < 1.12
            && projection.y > -1.12
            && projection.y < 1.12;
        const cueHalfWidth = width < 640 ? 62 : 108;
        const markerX = THREE.MathUtils.clamp(
            (projection.x * 0.5 + 0.5) * width,
            cueHalfWidth,
            width - cueHalfWidth
        );
        building.button.classList.toggle('is-visible', visible);
        building.button.style.left = `${markerX}px`;
        building.button.style.top = `${(-projection.y * 0.5 + 0.5) * height}px`;
        updateSpatialHitTarget(
            building.surfaceHitButton,
            building.finalGroup.visible ? building.finalGroup : building.cloud.points,
            width,
            height,
            visible
        );
    });

    if (activeArchitectureStory) {
        positionArchitectureStory(activeArchitectureStory);
    }

    if (celestialDancer && dancerCue) {
        const projection = celestialDancer.root.position.clone();
        projection.y += 6.35;
        projection.project(camera);
        const visible = appState.started
            && projection.z < 1
            && projection.x > -1.16
            && projection.x < 1.16
            && projection.y > -1.16
            && projection.y < 1.16;
        dancerCue.classList.toggle('is-visible', visible);
        dancerCue.style.left = `${(projection.x * 0.5 + 0.5) * width}px`;
        dancerCue.style.top = `${(-projection.y * 0.5 + 0.5) * height}px`;
        updateSpatialHitTarget(celestialDancer.surfaceHit, celestialDancer.root, width, height, visible);
    }
}

function animateScene(delta, elapsed) {
    if (lakeMaterial) lakeMaterial.uniforms.time.value = elapsed;
    if (sunSprite) sunSprite.material.opacity = 0.58 + Math.sin(elapsed * 0.35) * 0.05;
    if (lakeGlints) lakeGlints.material.opacity = 0.42 + Math.sin(elapsed * 0.9) * 0.1;
    if (muralPortal) {
        muralPortal.position.y = Math.sin(elapsed * 0.18) * 0.05;
    }
    updateCelestialDancer(elapsed, delta);
    architectureEntries.forEach((entry) => updateArchitectureEntry(entry, elapsed));
    if (dustPoints) {
        dustPoints.rotation.y = elapsed * 0.006;
        dustPoints.position.y = Math.sin(elapsed * 0.18) * 0.16;
    }
    ribbons.forEach((ribbon) => {
        ribbon.position.y = Math.sin(elapsed * 0.25 + ribbon.userData.phase) * 0.32;
        ribbon.rotation.y = Math.sin(elapsed * 0.08 + ribbon.userData.phase) * 0.035;
    });
    if (caravanGroup) {
        caravanGroup.position.x = caravanBaseX + Math.sin(elapsed * 0.045) * 2.4;
        caravanGroup.position.y = caravanBaseY + Math.sin(elapsed * 0.7) * 0.035;
        caravanGroup.children.forEach((child) => {
            if (child.material?.uniforms?.uTime) child.material.uniforms.uTime.value = elapsed;
        });
    }
    if (skyCraneGroup) {
        skyCraneGroup.position.x = skyCraneBaseX + Math.sin(elapsed * 0.032) * 3.2;
        skyCraneGroup.position.y = 15.8 + Math.sin(elapsed * 0.18) * 0.22;
    }
    if (desertReeds) {
        desertReeds.material.opacity = 0.24 + Math.sin(elapsed * 0.46) * 0.045;
    }
    atmosphereVeils.forEach((veil, index) => {
        veil.position.x += Math.sin(elapsed * 0.09 + veil.userData.phase) * delta * (0.12 + index * 0.008);
        veil.material.opacity = 0.045 + (index % 3) * 0.012 + Math.sin(elapsed * 0.35 + veil.userData.phase) * 0.012;
    });
    if (journeyRunner && journeyCurve) {
        journeyRunner.position.copy(journeyCurve.getPoint((elapsed * 0.038) % 1));
        journeyRunner.material.opacity = 0.62 + Math.sin(elapsed * 2.6) * 0.18;
    }
    advanceJourney(elapsed);

    if (appState.autoTour && !journeyState.active && appState.started && !appState.dragging && performance.now() > appState.pauseAutoUntil) {
        cameraRig.desiredAzimuth += delta * (appState.activeChapter >= 0 ? 0.018 : 0.032);
    }

    const heading = THREE.MathUtils.radToDeg(cameraRig.azimuth + Math.PI);
    compassNeedle.style.transform = `rotate(${heading}deg)`;
}

function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;
    smoothCamera(delta);
    animateScene(delta, elapsed);
    updateMarkers();
    renderer.render(scene, camera);
    updateDancerFpsProbe();
}

function showWebglError() {
    loadingState.classList.add('is-hidden');
    webglError.hidden = false;
    introScreen.style.display = 'none';
}

init();

})(window.THREE);
