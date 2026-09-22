export const TRACKS = [
  { label: "GAME", color: "#ff7300", range: "B-01 / 06" },
  { label: "WEB", color: "#ffc21a", range: "B-07 / 12" },
  { label: "AI / ML", color: "#8fb6d6", range: "B-13 / 18" },
  { label: "IOT", color: "#3f8fd0", range: "B-19 / 24" },
  { label: "MOBILE", color: "#d43c00", range: "B-25 / 30" },
  { label: "DATA", color: "#c9b493", range: "B-31 / 36" },
];

const TRACK_LABELS = TRACKS.map((t) => t.label);
const TAGS = [
  ["UNITY", "C#", "BLENDER"],
  ["REACT", "NODE", "POSTGRES"],
  ["PYTORCH", "FASTAPI", "OPENCV"],
  ["ESP32", "MQTT", "GRAFANA"],
  ["FLUTTER", "FIREBASE", "FIGMA"],
  ["SPARK", "DBT", "LOOKER"],
];

export const PROJECT_COUNT = 38;

export function buildProjects(count = PROJECT_COUNT) {
  return Array.from({ length: count }, (_, i) => {
    const t = i % TRACK_LABELS.length;
    const num = String(i + 1).padStart(2, "0");
    return {
      i,
      num,
      name: "PROJECT NAME " + num,
      short: "PROJECT " + num,
      team: "Student A & Student B",
      advisor: "Advisor Name",
      category: TRACK_LABELS[t],
      tags: TAGS[t],
      booth: "B-" + num,
      students: [
        { name: "Student A", role: "MEMBER 1" },
        { name: "Student B", role: "MEMBER 2" },
      ],
    };
  });
}
