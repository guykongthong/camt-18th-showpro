export const ZONES = [
  { key: 'ALL', label: 'ALL ZONES', color: '#f4f4f0' },
  { key: 'AI', label: 'AI ZONE', color: '#ff2e6c' },
  { key: 'WEB', label: 'WEB ZONE', color: '#00e5ff' },
  { key: 'MOBILE', label: 'MOBILE ZONE', color: '#ffd23f' },
  { key: 'IOT', label: 'IOT ZONE', color: 'oklch(0.82 0.16 155)' },
]

export function zoneOf(key) {
  return ZONES.find((z) => z.key === key) || ZONES[0]
}

const TINTS = {
  AI: ['rgba(255,46,108,.28)', 'rgba(10,14,23,.9)'],
  WEB: ['rgba(0,229,255,.26)', 'rgba(10,14,23,.9)'],
  MOBILE: ['rgba(255,210,63,.24)', 'rgba(10,14,23,.9)'],
  IOT: ['rgba(120,230,170,.24)', 'rgba(10,14,23,.9)'],
}

export function placeholderGradient(zoneKey) {
  const [a, b] = TINTS[zoneKey] || TINTS.WEB
  return `repeating-linear-gradient(135deg,${a} 0 10px,${b} 10px 20px)`
}
