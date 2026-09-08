import { useState } from "react";
import { BsPalette } from "react-icons/bs";

function hexToHsv(hex) {
  const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(
    (part) => parseInt(part, 16) / 255,
  );
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const difference = max - min;
  let h = 0;
  if (difference) {
    if (max === r) h = 60 * (((g - b) / difference) % 6);
    else if (max === g) h = 60 * ((b - r) / difference + 2);
    else h = 60 * ((r - g) / difference + 4);
  }
  return {
    h: Math.round((h + 360) % 360),
    s: max ? Math.round((difference / max) * 100) : 0,
    v: Math.round(max * 100),
  };
}

function hsvToHex({ h, s, v }) {
  const c = (v / 100) * (s / 100);
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v / 100 - c;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return `#${[r, g, b]
    .map((item) =>
      Math.round((item + m) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`.toUpperCase();
}

function NoteCreate({ onCreateNote }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#F9A8D4");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [hsv, setHsv] = useState(() => hexToHsv("#F9A8D4"));
  const [hexInput, setHexInput] = useState("#F9A8D4");

  const updateColor = (nextHsv) => {
    setHsv(nextHsv);
    setColor(hsvToHex(nextHsv));
  };

  const updateSpectrum = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const s = Math.round(
      Math.min(
        100,
        Math.max(0, ((event.clientX - rect.left) / rect.width) * 100),
      ),
    );
    const v = Math.round(
      Math.min(
        100,
        Math.max(0, 100 - ((event.clientY - rect.top) / rect.height) * 100),
      ),
    );
    updateColor({ ...hsv, s, v });
  };

  const updateHex = (value) => {
    const nextValue = value.startsWith("#") ? value : `#${value}`;
    setHexInput(nextValue.toUpperCase());
    if (/^#[0-9A-Fa-f]{6}$/.test(nextValue)) {
      const nextColor = nextValue.toUpperCase();
      setHsv(hexToHsv(nextColor));
      setColor(nextColor);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() && !content.trim()) return;
    const created = await onCreateNote({
      title: title.trim(),
      content: content.trim(),
      color,
    });
    if (created) {
      setTitle("");
      setContent("");
      setColor("#F9A8D4");
      setHsv(hexToHsv("#F9A8D4"));
      setHexInput("#F9A8D4");
      setIsPickerOpen(false);
    }
  };

  return (
    <div className="note-create">
      <input
        type="text"
        placeholder="Not başlığı"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="note-input"
      />
      <textarea
        placeholder="Not yaz..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="note-textarea"
      />

      <div className="note-form-row">
        <div className="note-color-picker">
          <span className="note-color-label">Not rengi</span>
          <button
            type="button"
            className="note-color-trigger"
            onClick={() => setIsPickerOpen((open) => !open)}
            aria-expanded={isPickerOpen}
            aria-controls="note-color-popup"
          >
            <span
              className="note-color-preview"
              style={{ backgroundColor: color }}
            />
            <BsPalette aria-hidden="true" />
          </button>

          {isPickerOpen && (
            <div className="note-color-popup" id="note-color-popup">
              <div
                className="color-spectrum"
                style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
                onPointerDown={updateSpectrum}
                onPointerMove={(event) =>
                  event.buttons === 1 && updateSpectrum(event)
                }
              >
                <span
                  className="color-spectrum-handle"
                  style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }}
                />
              </div>
              <input
                className="hue-slider"
                type="range"
                min="0"
                max="359"
                value={hsv.h}
                onChange={(event) =>
                  updateColor({ ...hsv, h: Number(event.target.value) })
                }
                aria-label="Renk tonu"
              />
              <div className="hex-field">
                <span
                  className="hex-color-preview"
                  style={{ backgroundColor: color }}
                />
                <input
                  type="text"
                  value={hexInput}
                  onChange={(event) => updateHex(event.target.value)}
                  maxLength="7"
                  aria-label="HEX renk kodu"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <button onClick={handleCreate} className="primary-button">
        Not ekle
      </button>
    </div>
  );
}

export default NoteCreate;
