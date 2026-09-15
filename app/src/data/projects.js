import { zoneOf, placeholderGradient } from './zones'

// Mock content for the SE CAMT ShowPro 18th capstone showcase — 38 projects across
// AI / WEB / MOBILE / IOT. Replace the entries below with real project data later;
// the shape (name, zone, tagline, team, advisor, description, stack, links) stays
// the same.

const RAW = [
  ['NEON HARVEST', 'AI', 'Crop disease detection from a phone camera, trained on 40,000 field photos.'],
  ['LORE ENGINE', 'AI', 'Turns lecture recordings into searchable, cited study notes.'],
  ['GHOST WRITER', 'AI', 'Drafts meeting minutes from raw audio, flags action items automatically.'],
  ['SIGNAL FOX', 'AI', 'Spots fraudulent transactions in a live payment stream under 50ms.'],
  ['ECHO TUTOR', 'AI', 'A conversational practice partner for English speaking exams.'],
  ['CROWD LENS', 'AI', 'Counts and tracks foot traffic in campus buildings from ceiling cameras.'],
  ['PAPER TRAIL', 'AI', 'Extracts structured data from scanned receipts for expense reports.'],
  ['MOOD RADAR', 'AI', 'Flags at-risk students from anonymized LMS engagement patterns.'],
  ['QUEUE RUNNER', 'WEB', 'Live campus service queues in one browser tab, no app install required.'],
  ['MARKET PIXEL', 'WEB', 'A storefront builder for street vendors, set up in a single afternoon.'],
  ['SPLIT TAB', 'WEB', 'Group expense splitting for dorm roommates, synced in real time.'],
  ['CLASS FINDER', 'WEB', 'A drag-and-drop timetable planner that flags section conflicts instantly.'],
  ['DESK HIVE', 'WEB', 'Hot-desk booking for the co-working space on the 4th floor.'],
  ['REVIEW REEF', 'WEB', 'Aggregates course reviews from three different student forums into one page.'],
  ['TICKET TIDE', 'WEB', 'Event ticketing with waitlists that auto-release no-show seats.'],
  ['STACK SWAP', 'WEB', 'A textbook exchange marketplace scoped to one campus.'],
  ['POCKET CLINIC', 'MOBILE', 'Medication reminders built for elderly patients and their caregivers.'],
  ['TRAIL MATE', 'MOBILE', 'Offline hiking maps with SOS location sharing for low-signal trails.'],
  ['BUDGET BUDDY', 'MOBILE', 'Expense tracking that reads SMS bank alerts so nothing is typed by hand.'],
  ['STUDY STREAK', 'MOBILE', 'Habit tracking for exam prep with a shared streak leaderboard.'],
  ['PET PULSE', 'MOBILE', 'Vaccination and vet-visit reminders for pet owners in shared households.'],
  ['COMMUTE CO', 'MOBILE', 'Carpool matching for the last-mile trip from the BTS to campus.'],
  ['SIGN SPEAK', 'MOBILE', 'Real-time sign language translation using the phone camera.'],
  ['GRID GHOST', 'IOT', 'Plug-level power monitoring that finds the one appliance wasting your bill.'],
  ['SOIL SCOUT', 'IOT', 'Soil moisture sensors that text a farmer before a crop actually needs water.'],
  ['PARK SENSE', 'IOT', 'Ultrasonic sensors that show free parking spots on a live floor map.'],
  ['AIR WATCH', 'IOT', 'A low-cost PM2.5 sensor network mapping air quality block by block.'],
  ['COLD CHAIN', 'IOT', 'Temperature logging for vaccine shipments with instant breach alerts.'],
  ['FLOW GATE', 'IOT', 'Smart irrigation valves that respond to a shared campus water budget.'],
  ['SHELF WATCH', 'AI', "Detects out-of-stock shelves from a store's existing CCTV feed."],
  ['ROUTE OWL', 'WEB', 'Night-shift shuttle routing that adapts to real-time ridership.'],
  ['FORM FOX', 'WEB', 'Turns a photographed paper form into a fillable digital one in seconds.'],
  ['NOTE NEST', 'MOBILE', 'Collaborative lecture notes that merge automatically after class.'],
  ['GYM GRID', 'MOBILE', 'Live equipment availability for the campus gym, crowd-sourced by check-ins.'],
  ['LEAK LOOKOUT', 'IOT', 'Acoustic sensors that catch pipe leaks in building walls before they flood.'],
  ['DOOR DUTY', 'IOT', 'A visitor log and buzzer system for shared student housing.'],
  ['CAPTION CORE', 'AI', 'Generates accurate Thai-English bilingual captions for lecture videos.'],
  ['DESK DOUBLE', 'WEB', 'A shared calendar that finds the next free meeting room in one click.'],
]

const TEAM_POOL = [
  'Nattapong S.',
  'Chanya P.',
  'Pimchanok T.',
  'Aran W.',
  'Siriwan B.',
  'Kittipat R.',
  'Thanakorn A.',
  'Ploy M.',
  'Jirayu N.',
  'Varis C.',
  'Kanyarat D.',
  'Peerapat H.',
  'Supitcha L.',
  'Ekkarat Y.',
  'Ratchanee K.',
  'Nontawat P.',
  'Busaba S.',
  'Thiraphat V.',
]
const ADVISOR_POOL = ['Dr. Warit K.', 'Asst. Prof. Mint L.', 'Dr. Napat J.', 'Dr. Somsak T.', 'Asst. Prof. Kanya R.']
const STACK_POOL = {
  AI: ['PyTorch', 'TensorFlow Lite', 'FastAPI', 'Whisper', 'LangChain', 'pgvector'],
  WEB: ['Vue', 'SvelteKit', 'Next.js', 'Postgres', 'Redis', 'Docker', 'Cloudflare Workers'],
  MOBILE: ['Flutter', 'React Native', 'Expo', 'Supabase', 'SQLite'],
  IOT: ['ESP32', 'MQTT', 'InfluxDB', 'Grafana', 'LoRaWAN'],
}

function pick(pool, seed, n) {
  const out = []
  for (let i = 0; i < n; i++) out.push(pool[(seed + i * 7) % pool.length])
  return [...new Set(out)]
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const PROJECTS = RAW.map(([name, zone, tagline], i) => {
  const z = zoneOf(zone)
  const team = pick(TEAM_POOL, i * 3, 2)
  return {
    id: i,
    slug: slugify(name),
    name,
    zone,
    zoneColor: z.color,
    zoneLabel: z.label,
    tagline,
    description: `${tagline} Built and refined over one semester as part of the SE CAMT senior capstone, with regular user testing and advisor review.`,
    team,
    teamLine: team.join(' · '),
    advisor: ADVISOR_POOL[i % ADVISOR_POOL.length],
    advisorLine: 'Advisor: ' + ADVISOR_POOL[i % ADVISOR_POOL.length],
    stack: pick(STACK_POOL[zone], i * 5, 4),
    photo: null, // real <img> src drops in later; falls back to placeholderGradient(zone)
    photoFallback: placeholderGradient(zone),
    links: [
      { label: 'LIVE DEMO', href: '#' },
      { label: 'REPO', href: '#' },
    ],
  }
})
