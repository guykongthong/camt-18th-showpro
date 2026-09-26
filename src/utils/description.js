// Splits a description into paragraph / list blocks for rendering.
// Only markup is interpreted (**bold**, "1." style list lines), words are never changed.
const ITEM = /^\s*(\d+\.|Feature\s*#?\d+\s*:)\s+/;

function parts(text) {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((t, i) => ({ text: t, strong: i % 2 === 1 }))
    .filter((p) => p.text !== "");
}

export function formatDescription(text) {
  const blocks = [];
  for (const para of text.split(/\n\s*\n/)) {
    if (!para.trim()) continue;
    const items = [];
    const plain = [];
    for (const line of para.split("\n")) {
      const m = line.match(ITEM);
      if (m) items.push({ marker: m[1], text: line.slice(m[0].length) });
      else if (items.length) items[items.length - 1].text += " " + line.trim();
      else plain.push(line.trim());
    }
    if (plain.length) blocks.push({ type: "p", parts: parts(plain.join(" ").trim()) });
    if (items.length) {
      blocks.push({
        type: "list",
        items: items.map((it) => ({ marker: it.marker, parts: parts(it.text.trim()) })),
      });
    }
  }
  return blocks;
}
