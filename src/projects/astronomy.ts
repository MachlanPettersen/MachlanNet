/**
 * Client-side astronomical calculations.
 * All math derived from standard solar/lunar position algorithms.
 * No external APIs required.
 */

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

/** Convert Date to Julian Date number */
function toJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Days since J2000.0 epoch (Jan 1, 2000 12:00 TT) */
function daysSinceJ2000(date: Date): number {
  return toJulianDate(date) - 2451545.0;
}

/** Normalize angle to [0, 360) */
function normDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Solar declination in degrees — the latitude where the sun is directly overhead */
export function getSolarDeclination(date: Date): number {
  const d = daysSinceJ2000(date);
  // Mean longitude of the sun
  const L = normDeg(280.46 + 0.9856474 * d);
  // Mean anomaly
  const g = normDeg(357.528 + 0.9856003 * d);
  // Ecliptic longitude
  const lambda = L + 1.915 * Math.sin(g * DEG) + 0.020 * Math.sin(2 * g * DEG);
  // Obliquity of the ecliptic
  const epsilon = 23.439 - 0.0000004 * d;
  // Declination
  return Math.asin(Math.sin(epsilon * DEG) * Math.sin(lambda * DEG)) * RAD;
}

/** Equation of time in minutes — correction between mean solar time and apparent solar time */
function equationOfTime(date: Date): number {
  const d = daysSinceJ2000(date);
  const L = normDeg(280.46 + 0.9856474 * d);
  const g = normDeg(357.528 + 0.9856003 * d);
  const lambda = L + 1.915 * Math.sin(g * DEG) + 0.020 * Math.sin(2 * g * DEG);
  const epsilon = 23.439 - 0.0000004 * d;
  const ra = Math.atan2(
    Math.cos(epsilon * DEG) * Math.sin(lambda * DEG),
    Math.cos(lambda * DEG)
  ) * RAD;
  let eot = L - normDeg(ra);
  if (eot > 180) eot -= 360;
  if (eot < -180) eot += 360;
  return eot * 4; // 1 degree = 4 minutes of time
}

/**
 * Subsolar point: the latitude/longitude where the sun is directly overhead right now.
 */
export function getSubsolarPoint(date: Date): { lat: number; lon: number } {
  const lat = getSolarDeclination(date);
  // UTC hours as fractional
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const eot = equationOfTime(date);
  // The subsolar longitude: sun is overhead where local apparent solar time = 12:00
  const lon = -(utcHours - 12) * 15 - eot / 4;
  return { lat, lon: ((lon + 180) % 360 + 360) % 360 - 180 };
}

/**
 * Sun's orbit angle for the 3D scene.
 * Based on actual solar hour angle from the user's local time + equation of time correction.
 */
export function getSunAngle(date: Date): number {
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const eot = equationOfTime(date);
  // Local apparent solar time
  const tzOffset = -date.getTimezoneOffset() / 60;
  const solarTime = utcHours + tzOffset + eot / 60;
  // Map: noon (12) = top (PI/2), midnight (0) = bottom (-PI/2)
  return ((solarTime - 6) / 24) * Math.PI * 2;
}

/**
 * Solar declination mapped to a Y-offset for the 3D sun position,
 * representing the tilt of the earth relative to the sun.
 */
export function getSunTilt(date: Date): number {
  const decl = getSolarDeclination(date);
  // Scale: ±23.44° maps to a small vertical offset
  return (decl / 23.44) * 0.5;
}

// --- Moon calculations ---

const KNOWN_NEW_MOON = new Date("2000-01-06T18:14:00Z").getTime();
const SYNODIC_PERIOD_MS = 29.53058770576 * 24 * 60 * 60 * 1000;

/** Moon phase as a fraction [0, 1). 0 = new moon, 0.5 = full moon */
export function getMoonPhaseFraction(date: Date): number {
  const elapsed = date.getTime() - KNOWN_NEW_MOON;
  return (((elapsed % SYNODIC_PERIOD_MS) + SYNODIC_PERIOD_MS) % SYNODIC_PERIOD_MS) / SYNODIC_PERIOD_MS;
}

/** Moon illumination percentage [0, 100] */
export function getMoonIllumination(date: Date): number {
  const phase = getMoonPhaseFraction(date);
  return Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);
}

/** Moon phase name */
export function getMoonPhaseName(date: Date): string {
  const phase = getMoonPhaseFraction(date);
  if (phase < 0.0625) return "New Moon";
  if (phase < 0.1875) return "Waxing Crescent";
  if (phase < 0.3125) return "First Quarter";
  if (phase < 0.4375) return "Waxing Gibbous";
  if (phase < 0.5625) return "Full Moon";
  if (phase < 0.6875) return "Waning Gibbous";
  if (phase < 0.8125) return "Last Quarter";
  if (phase < 0.9375) return "Waning Crescent";
  return "New Moon";
}

/** Moon phase emoji */
export function getMoonPhaseEmoji(date: Date): string {
  const phase = getMoonPhaseFraction(date);
  if (phase < 0.0625) return "\uD83C\uDF11";
  if (phase < 0.1875) return "\uD83C\uDF12";
  if (phase < 0.3125) return "\uD83C\uDF13";
  if (phase < 0.4375) return "\uD83C\uDF14";
  if (phase < 0.5625) return "\uD83C\uDF15";
  if (phase < 0.6875) return "\uD83C\uDF16";
  if (phase < 0.8125) return "\uD83C\uDF17";
  if (phase < 0.9375) return "\uD83C\uDF18";
  return "\uD83C\uDF11";
}

/**
 * Moon's orbit angle for the 3D scene.
 * Offset from sun by the phase angle.
 */
export function getMoonAngle(date: Date): number {
  const phase = getMoonPhaseFraction(date);
  return getSunAngle(date) + phase * Math.PI * 2;
}

/**
 * Find the nearest city/region name to a given lat/lon for the subsolar point.
 * Lightweight lookup — no API needed.
 */
export function getNearestRegion(lat: number, lon: number): string {
  const regions: { name: string; lat: number; lon: number }[] = [
    { name: "mid-Atlantic", lat: 25, lon: -40 },
    { name: "eastern Brazil", lat: -10, lon: -45 },
    { name: "western Africa", lat: 10, lon: -5 },
    { name: "central Africa", lat: 0, lon: 25 },
    { name: "eastern Africa", lat: -5, lon: 38 },
    { name: "western Europe", lat: 48, lon: 2 },
    { name: "central Europe", lat: 50, lon: 15 },
    { name: "eastern Europe", lat: 55, lon: 35 },
    { name: "the Middle East", lat: 30, lon: 45 },
    { name: "the Indian Ocean", lat: -10, lon: 70 },
    { name: "India", lat: 22, lon: 78 },
    { name: "central Asia", lat: 42, lon: 65 },
    { name: "western China", lat: 35, lon: 90 },
    { name: "eastern China", lat: 35, lon: 115 },
    { name: "Southeast Asia", lat: 10, lon: 105 },
    { name: "Japan", lat: 36, lon: 140 },
    { name: "Australia", lat: -25, lon: 135 },
    { name: "New Zealand", lat: -42, lon: 174 },
    { name: "the western Pacific", lat: 10, lon: 160 },
    { name: "the central Pacific", lat: 10, lon: -170 },
    { name: "Hawaii", lat: 20, lon: -155 },
    { name: "Alaska", lat: 62, lon: -150 },
    { name: "the western US", lat: 37, lon: -120 },
    { name: "the central US", lat: 38, lon: -98 },
    { name: "the eastern US", lat: 38, lon: -78 },
    { name: "eastern Canada", lat: 47, lon: -65 },
    { name: "Mexico", lat: 23, lon: -100 },
    { name: "the Caribbean", lat: 18, lon: -75 },
    { name: "Colombia", lat: 5, lon: -74 },
    { name: "Peru", lat: -12, lon: -77 },
    { name: "Argentina", lat: -35, lon: -64 },
    { name: "the south Atlantic", lat: -35, lon: -20 },
    { name: "the north Atlantic", lat: 45, lon: -35 },
    { name: "Siberia", lat: 60, lon: 100 },
    { name: "the Arctic", lat: 75, lon: 0 },
    { name: "Antarctica", lat: -75, lon: 0 },
    { name: "the southern Indian Ocean", lat: -40, lon: 80 },
    { name: "the south Pacific", lat: -30, lon: -130 },
    { name: "Indonesia", lat: -5, lon: 115 },
    { name: "the Philippines", lat: 12, lon: 122 },
    { name: "Korea", lat: 36, lon: 128 },
    { name: "Mongolia", lat: 47, lon: 105 },
    { name: "Iran", lat: 33, lon: 53 },
    { name: "Egypt", lat: 27, lon: 31 },
    { name: "Nigeria", lat: 10, lon: 8 },
    { name: "South Africa", lat: -30, lon: 25 },
    { name: "Madagascar", lat: -19, lon: 47 },
    { name: "Scandinavia", lat: 62, lon: 15 },
    { name: "the UK", lat: 53, lon: -2 },
    { name: "Spain", lat: 40, lon: -4 },
    { name: "Turkey", lat: 39, lon: 35 },
  ];

  let closest = regions[0];
  let minDist = Infinity;

  for (const r of regions) {
    // Simple spherical distance approximation
    const dLat = (r.lat - lat) * DEG;
    const dLon = (r.lon - lon) * DEG;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * DEG) * Math.cos(r.lat * DEG) * Math.sin(dLon / 2) ** 2;
    const dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (dist < minDist) {
      minDist = dist;
      closest = r;
    }
  }

  return closest.name;
}

/** Format degrees as DMS string */
export function formatCoord(deg: number, posLabel: string, negLabel: string): string {
  const label = deg >= 0 ? posLabel : negLabel;
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const m = Math.floor((abs - d) * 60);
  return `${d}\u00B0${m.toString().padStart(2, "0")}'${label}`;
}

/** Intermediate calculation values for the math explanation */
export interface AstroIntermediates {
  julianDate: number;
  daysSinceJ2000: number;
  meanLongitude: number;
  meanAnomaly: number;
  eclipticLongitude: number;
  obliquity: number;
  rightAscension: number;
  equationOfTimeMinutes: number;
  utcDecimalHours: number;
  localSolarTime: number;
  lunarElapsedDays: number;
  lunarCycleDays: number;
}

/** Full snapshot of astronomical data at a given moment */
export interface AstroSnapshot {
  date: Date;
  sunAngle: number;
  sunTilt: number;
  moonAngle: number;
  subsolarPoint: { lat: number; lon: number };
  solarDeclination: number;
  middayRegion: string;
  moonPhaseFraction: number;
  moonPhaseName: string;
  moonPhaseEmoji: string;
  moonIllumination: number;
  intermediates: AstroIntermediates;
}

function getIntermediates(date: Date): AstroIntermediates {
  const jd = toJulianDate(date);
  const d = jd - 2451545.0;
  const L = normDeg(280.46 + 0.9856474 * d);
  const g = normDeg(357.528 + 0.9856003 * d);
  const lambda = L + 1.915 * Math.sin(g * DEG) + 0.020 * Math.sin(2 * g * DEG);
  const epsilon = 23.439 - 0.0000004 * d;
  const ra = Math.atan2(
    Math.cos(epsilon * DEG) * Math.sin(lambda * DEG),
    Math.cos(lambda * DEG)
  ) * RAD;
  let eot = L - normDeg(ra);
  if (eot > 180) eot -= 360;
  if (eot < -180) eot += 360;
  const eotMin = eot * 4;

  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const tzOffset = -date.getTimezoneOffset() / 60;
  const solarTime = utcHours + tzOffset + eotMin / 60;

  const elapsed = date.getTime() - KNOWN_NEW_MOON;
  const lunarCycleDays = 29.53058770576;
  const elapsedDays = elapsed / (24 * 60 * 60 * 1000);
  const lunarElapsedDays = ((elapsedDays % lunarCycleDays) + lunarCycleDays) % lunarCycleDays;

  return {
    julianDate: jd,
    daysSinceJ2000: d,
    meanLongitude: L,
    meanAnomaly: g,
    eclipticLongitude: lambda,
    obliquity: epsilon,
    rightAscension: normDeg(ra),
    equationOfTimeMinutes: eotMin,
    utcDecimalHours: utcHours,
    localSolarTime: solarTime,
    lunarElapsedDays,
    lunarCycleDays,
  };
}

export function getAstroSnapshot(date: Date): AstroSnapshot {
  const sub = getSubsolarPoint(date);
  return {
    date,
    sunAngle: getSunAngle(date),
    sunTilt: getSunTilt(date),
    moonAngle: getMoonAngle(date),
    subsolarPoint: sub,
    solarDeclination: getSolarDeclination(date),
    middayRegion: getNearestRegion(sub.lat, sub.lon),
    moonPhaseFraction: getMoonPhaseFraction(date),
    moonPhaseName: getMoonPhaseName(date),
    moonPhaseEmoji: getMoonPhaseEmoji(date),
    moonIllumination: getMoonIllumination(date),
    intermediates: getIntermediates(date),
  };
}
