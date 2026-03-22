import * as THREE from "three";

/**
 * Simplified continent outlines as [longitude, latitude] polygon arrays.
 * ~15-30 vertices per landmass — enough to be recognizable, light enough
 * to render on a canvas at runtime.
 */

type Polygon = [number, number][];

const AFRICA: Polygon = [
  [-17, 15], [-16, 19], [-13, 25], [-8, 32], [-5, 36], [0, 36], [10, 37],
  [12, 33], [25, 32], [33, 32], [35, 30], [40, 22], [44, 12], [51, 12],
  [50, 8], [42, 0], [44, -4], [40, -11], [36, -20], [33, -27], [28, -33],
  [18, -35], [15, -30], [12, -18], [10, -5], [9, 4], [5, 5], [1, 5],
  [-5, 5], [-10, 5], [-15, 10], [-17, 15],
];

const EUROPE: Polygon = [
  [-10, 36], [-9, 39], [-9, 43], [-2, 44], [0, 48], [-5, 48], [-10, 52],
  [-6, 54], [-5, 58], [0, 51], [5, 52], [8, 54], [6, 57], [10, 58],
  [12, 56], [15, 55], [18, 55], [22, 54], [24, 58], [20, 60], [18, 63],
  [15, 65], [15, 69], [20, 70], [28, 71], [32, 70], [42, 68],
  [45, 65], [40, 62], [30, 60], [32, 55], [28, 52], [28, 48],
  [24, 42], [22, 40], [26, 40], [28, 42], [30, 41], [36, 41], [41, 41],
  [42, 38], [35, 37], [28, 37], [25, 38], [22, 37], [15, 38],
  [12, 44], [8, 44], [7, 48], [3, 47], [0, 44], [-1, 43], [-2, 40],
  [-5, 36], [-10, 36],
];

const ASIA: Polygon = [
  [42, 41], [44, 43], [50, 40], [51, 36], [55, 26], [52, 23], [48, 18],
  [43, 13], [45, 12], [51, 12], [56, 17], [57, 21], [60, 22], [62, 25],
  [67, 25], [68, 24], [71, 21], [73, 17], [75, 15], [77, 8],
  [80, 7], [80, 13], [83, 16], [88, 22], [89, 26], [92, 23],
  [97, 17], [99, 14], [101, 6], [104, 2], [103, 5], [105, 11],
  [109, 12], [109, 22], [117, 24], [120, 26], [121, 31],
  [117, 34], [118, 38], [122, 40], [125, 43], [130, 43],
  [132, 46], [140, 48], [143, 52], [145, 55], [137, 55],
  [135, 48], [130, 50], [125, 53], [120, 55], [113, 55],
  [100, 55], [88, 50], [80, 50], [73, 42], [65, 40], [62, 43],
  [55, 42], [52, 44], [50, 45], [55, 52], [62, 55], [70, 58],
  [72, 62], [68, 67], [60, 68], [55, 62], [50, 55], [45, 52],
  [42, 48], [42, 41],
];

const RUSSIA_NORTH: Polygon = [
  [28, 71], [30, 73], [40, 73], [50, 70], [55, 72], [65, 73],
  [75, 73], [85, 75], [95, 76], [110, 74], [120, 73], [135, 72],
  [150, 68], [160, 65], [170, 63], [178, 64], [180, 66], [180, 72],
  [175, 72], [170, 70], [162, 67], [152, 70], [140, 73], [130, 73],
  [120, 75], [100, 78], [80, 76], [65, 75], [50, 73], [40, 75],
  [30, 74], [28, 71],
];

const NORTH_AMERICA: Polygon = [
  [-168, 66], [-162, 64], [-152, 60], [-148, 62], [-138, 60],
  [-137, 56], [-130, 54], [-125, 50], [-124, 42], [-118, 34],
  [-112, 32], [-107, 32], [-105, 30], [-98, 26], [-97, 26],
  [-95, 29], [-90, 30], [-85, 30], [-82, 25], [-80, 25], [-82, 29],
  [-76, 35], [-75, 38], [-70, 41], [-67, 44], [-65, 47],
  [-60, 47], [-57, 50], [-55, 52], [-60, 53], [-65, 58],
  [-75, 58], [-80, 62], [-85, 65], [-90, 68], [-95, 70],
  [-105, 70], [-115, 72], [-125, 72], [-135, 70], [-145, 63],
  [-155, 59], [-160, 60], [-163, 61], [-168, 66],
];

const GREENLAND: Polygon = [
  [-55, 60], [-48, 60], [-42, 62], [-35, 66], [-20, 70], [-18, 73],
  [-18, 78], [-20, 82], [-30, 83], [-45, 82], [-55, 78],
  [-58, 75], [-60, 72], [-55, 68], [-48, 63], [-55, 60],
];

const CENTRAL_AMERICA: Polygon = [
  [-105, 30], [-105, 20], [-97, 16], [-92, 15], [-87, 14],
  [-84, 10], [-80, 8], [-78, 8], [-82, 10], [-84, 12],
  [-87, 16], [-90, 18], [-93, 18], [-97, 20], [-100, 22],
  [-100, 25], [-98, 26], [-105, 30],
];

const SOUTH_AMERICA: Polygon = [
  [-80, 10], [-76, 12], [-72, 12], [-68, 10], [-62, 10], [-60, 8],
  [-52, 4], [-50, 0], [-46, -2], [-40, -3], [-35, -5], [-35, -10],
  [-37, -13], [-39, -17], [-41, -22], [-48, -28], [-53, -33],
  [-58, -37], [-65, -40], [-67, -44], [-66, -48], [-70, -52],
  [-74, -50], [-73, -44], [-72, -38], [-71, -30], [-70, -18],
  [-75, -14], [-76, -6], [-78, 0], [-80, 5], [-80, 10],
];

const AUSTRALIA: Polygon = [
  [115, -14], [120, -14], [130, -12], [136, -12], [142, -11],
  [146, -15], [150, -22], [153, -28], [150, -34], [147, -38],
  [141, -38], [136, -35], [133, -32], [130, -31], [125, -33],
  [116, -34], [114, -32], [113, -25], [114, -22], [115, -14],
];

const JAPAN: Polygon[] = [
  // Honshu
  [130, 31], [132, 34], [134, 35], [136, 36], [139, 36],
  [140, 38], [140, 40], [141, 42], [140, 43], [138, 40],
  [137, 37], [135, 35], [133, 34], [131, 32], [130, 31],
].map((_, __, arr) => arr) as unknown as Polygon[];

const JAPAN_MAIN: Polygon = [
  [130, 31], [132, 34], [134, 35], [136, 36], [139, 36],
  [140, 38], [140, 40], [141, 42], [140, 43], [138, 40],
  [137, 37], [135, 35], [133, 34], [131, 32], [130, 31],
];

const HOKKAIDO: Polygon = [
  [140, 42], [141, 43], [143, 44], [145, 44], [145, 43],
  [143, 42], [141, 42], [140, 42],
];

const UK: Polygon = [
  [-6, 50], [-5, 52], [-4, 54], [-5, 56], [-4, 57], [-3, 58],
  [-2, 57], [0, 53], [2, 52], [1, 51], [-1, 51], [-4, 50], [-6, 50],
];

const IRELAND: Polygon = [
  [-10, 52], [-10, 54], [-8, 55], [-6, 54], [-6, 52], [-8, 51], [-10, 52],
];

const MADAGASCAR: Polygon = [
  [44, -13], [50, -15], [50, -20], [48, -24], [44, -26],
  [43, -22], [44, -17], [44, -13],
];

const BORNEO: Polygon = [
  [108, 4], [110, 7], [114, 7], [117, 6], [118, 3], [118, 0],
  [115, -3], [112, -3], [110, -1], [108, 1], [108, 4],
];

const SUMATRA: Polygon = [
  [95, 5], [98, 4], [102, 2], [105, -2], [106, -5], [104, -6],
  [101, -4], [98, -1], [96, 2], [95, 5],
];

const NEW_GUINEA: Polygon = [
  [131, -2], [135, -4], [140, -5], [145, -6], [149, -6],
  [150, -4], [147, -2], [142, -3], [139, -2], [135, -2], [131, -2],
];

const PHILIPPINES: Polygon = [
  [118, 7], [120, 10], [121, 14], [123, 18], [124, 18],
  [125, 15], [124, 11], [122, 8], [120, 7], [118, 7],
];

const NEW_ZEALAND_N: Polygon = [
  [173, -35], [175, -37], [178, -38], [177, -40], [175, -41],
  [173, -39], [173, -37], [173, -35],
];

const NEW_ZEALAND_S: Polygon = [
  [167, -44], [169, -44], [172, -42], [174, -42], [172, -44],
  [170, -46], [167, -46], [167, -44],
];

const ICELAND: Polygon = [
  [-24, 64], [-22, 66], [-18, 66], [-14, 65], [-14, 64],
  [-18, 63], [-22, 63], [-24, 64],
];

const SRI_LANKA: Polygon = [
  [80, 10], [82, 8], [82, 7], [80, 6], [79, 7], [80, 10],
];

const TAIWAN: Polygon = [
  [120, 22], [121, 23], [122, 25], [121, 26], [120, 25], [120, 22],
];

const CUBA: Polygon = [
  [-85, 22], [-82, 23], [-79, 23], [-75, 20], [-77, 20],
  [-80, 21], [-83, 21], [-85, 22],
];

const ANTARCTICA: Polygon = [
  [-180, -65], [-150, -72], [-120, -70], [-90, -73], [-60, -68],
  [-50, -70], [-25, -70], [0, -70], [30, -68], [60, -67], [80, -66],
  [100, -66], [120, -66], [140, -66], [160, -70], [180, -65],
  [180, -90], [-180, -90], [-180, -65],
];

const ALL_POLYGONS: Polygon[] = [
  AFRICA, EUROPE, ASIA, RUSSIA_NORTH, NORTH_AMERICA, GREENLAND,
  CENTRAL_AMERICA, SOUTH_AMERICA, AUSTRALIA, JAPAN_MAIN, HOKKAIDO,
  UK, IRELAND, MADAGASCAR, BORNEO, SUMATRA, NEW_GUINEA, PHILIPPINES,
  NEW_ZEALAND_N, NEW_ZEALAND_S, ICELAND, SRI_LANKA, TAIWAN, CUBA,
  ANTARCTICA,
];

/**
 * Renders continent outlines to a canvas texture.
 * Returns an equirectangular map: green land on deep blue ocean.
 */
export function createEarthTexture(width = 2048, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Ocean
  ctx.fillStyle = "#0a2a50";
  ctx.fillRect(0, 0, width, height);

  // Shallow ocean noise (subtle variation)
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 10 + Math.random() * 40;
    ctx.fillStyle = "#1a4a70";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Convert lon/lat to pixel coordinates
  const toX = (lon: number) => ((lon + 180) / 360) * width;
  const toY = (lat: number) => ((90 - lat) / 180) * height;

  // Draw all land polygons
  for (const poly of ALL_POLYGONS) {
    ctx.beginPath();
    ctx.moveTo(toX(poly[0][0]), toY(poly[0][1]));
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(toX(poly[i][0]), toY(poly[i][1]));
    }
    ctx.closePath();

    // Land fill — earthy green
    ctx.fillStyle = "#2d6a1e";
    ctx.fill();
  }

  // Biome overlay: desert bands (~20-30° N/S)
  ctx.globalAlpha = 0.35;
  ctx.globalCompositeOperation = "source-atop";
  const desertY1N = toY(32);
  const desertY2N = toY(15);
  const gradN = ctx.createLinearGradient(0, desertY1N, 0, desertY2N);
  gradN.addColorStop(0, "transparent");
  gradN.addColorStop(0.3, "#9a8540");
  gradN.addColorStop(0.7, "#9a8540");
  gradN.addColorStop(1, "transparent");
  ctx.fillStyle = gradN;
  ctx.fillRect(0, desertY1N, width, desertY2N - desertY1N);

  const desertY1S = toY(-15);
  const desertY2S = toY(-32);
  const gradS = ctx.createLinearGradient(0, desertY1S, 0, desertY2S);
  gradS.addColorStop(0, "transparent");
  gradS.addColorStop(0.3, "#9a8540");
  gradS.addColorStop(0.7, "#9a8540");
  gradS.addColorStop(1, "transparent");
  ctx.fillStyle = gradS;
  ctx.fillRect(0, desertY1S, width, desertY2S - desertY1S);

  // Tundra at high latitudes
  ctx.globalAlpha = 0.3;
  const tundraYN = toY(70);
  const gradTN = ctx.createLinearGradient(0, toY(80), 0, tundraYN);
  gradTN.addColorStop(0, "#6a7a60");
  gradTN.addColorStop(1, "transparent");
  ctx.fillStyle = gradTN;
  ctx.fillRect(0, toY(80), width, tundraYN - toY(80));

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  // Polar ice caps
  ctx.fillStyle = "#d8e0e8";
  ctx.globalAlpha = 0.7;
  // North pole
  ctx.fillRect(0, 0, width, toY(82));
  // South pole (Antarctica is already drawn, add ice sheen)
  ctx.fillRect(0, toY(-72), width, height - toY(-72));
  ctx.globalAlpha = 1;

  // Subtle coastline outline
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = "#8ab4cc";
  ctx.lineWidth = 1.5;
  for (const poly of ALL_POLYGONS) {
    ctx.beginPath();
    ctx.moveTo(toX(poly[0][0]), toY(poly[0][1]));
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(toX(poly[i][0]), toY(poly[i][1]));
    }
    ctx.closePath();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
