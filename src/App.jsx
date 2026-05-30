import { useState, useEffect, useRef } from "react";

// ─── DEFAULT DATA ────────────────────────────────────────────────────────────
const DEFAULT_WORKOUTS = {
  A: {
    label: "Treino A", tag: "Empurrar", days: "Seg & Qui", color: "#FF4500",
    exercises: [
      { id: 1, muscle: "Peito",    name: "Supino Inclinado com Barra",       series: 4, reps: "8–10",  rest: 90 },
      { id: 2, muscle: "Peito",    name: "Crucifixo Reto com Halteres",      series: 3, reps: "10–12", rest: 60 },
      { id: 3, muscle: "Ombro",    name: "Desenvolvimento com Halteres",     series: 3, reps: "10",    rest: 60 },
      { id: 4, muscle: "Ombro",    name: "Elevação Lateral com Halteres",    series: 4, reps: "12–15", rest: 60 },
      { id: 5, muscle: "Tríceps",  name: "Tríceps Pulley (Corda ou Barra)",  series: 3, reps: "12",    rest: 60 },
      { id: 6, muscle: "Tríceps",  name: "Tríceps Testa ou Francês",         series: 3, reps: "10",    rest: 60 },
      { id: 7, muscle: "Cardio",   name: "Esteira Inclinada / Caminhada",    series: null, reps: "30 min", rest: null },
    ],
  },
  B: {
    label: "Treino B", tag: "Puxar", days: "Ter & Sex", color: "#00BFFF",
    exercises: [
      { id: 1, muscle: "Costas",   name: "Puxada Alta (Pulley)",             series: 4, reps: "10",       rest: 90 },
      { id: 2, muscle: "Costas",   name: "Remada Baixa Sentada (Triângulo)", series: 4, reps: "10–12",    rest: 60 },
      { id: 3, muscle: "Costas",   name: "Remada Serrote com Halter",        series: 3, reps: "10 (cada)",rest: 60 },
      { id: 4, muscle: "Ombro",    name: "Crucifixo Invertido",              series: 4, reps: "12–15",    rest: 60 },
      { id: 5, muscle: "Bíceps",   name: "Rosca Direta (Barra W ou Halter)", series: 3, reps: "10",       rest: 60 },
      { id: 6, muscle: "Bíceps",   name: "Rosca Martelo com Halteres",       series: 3, reps: "12",       rest: 60 },
      { id: 7, muscle: "Cardio",   name: "Esteira Inclinada / Caminhada",    series: null, reps: "30 min", rest: null },
    ],
  },
  C: {
    label: "Treino C", tag: "Pernas", days: "Qua & Sáb", color: "#00E676",
    exercises: [
      { id: 1, muscle: "Pernas",      name: "Leg Press 45° ou Hack",         series: 4, reps: "10",    rest: 90 },
      { id: 2, muscle: "Pernas",      name: "Cadeira Extensora",             series: 3, reps: "12",    rest: 60 },
      { id: 3, muscle: "Pernas",      name: "Cadeira ou Mesa Flexora",       series: 4, reps: "10–12", rest: 60 },
      { id: 4, muscle: "Pernas",      name: "Stiff com Halteres ou Barra",   series: 3, reps: "10",    rest: 60 },
      { id: 5, muscle: "Panturrilha", name: "Gêmeos Sentado (Máquina)",      series: 4, reps: "15",    rest: 60 },
      { id: 6, muscle: "Cardio",      name: "Esteira / Caminhada Rápida",    series: null, reps: "30 min", rest: null },
    ],
  },
};

const WEEK_MAP = { 0: null, 1: "A", 2: "B", 3: "C", 4: "A", 5: "B", 6: "C" };

function loadWorkouts() {
  try {
    const saved = localStorage.getItem("workouts_v2");
    return saved ? JSON.parse(saved) : DEFAULT_WORKOUTS;
  } catch { return DEFAULT_WORKOUTS; }
}
function saveWorkouts(w) {
  localStorage.setItem("workouts_v2", JSON.stringify(w));
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Syne:wght@400;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080808; color: #fff; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  .fade-up  { animation: fadeSlideUp 0.4s ease both; }
  .slide-in { animation: slideIn 0.35s ease both; }
  .scale-in { animation: scaleIn 0.3s ease both; }
`;

// ─── TIMER ─────────────────────────────────────────────────────────────────────
function Timer({ seconds, color, onDone }) {
  const [rem, setRem] = useState(seconds);
  useEffect(() => {
    if (rem <= 0) { onDone(); return; }
    const t = setTimeout(() => setRem(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [rem]);
  const r = 38, circ = 2 * Math.PI * r;
  const pct = (seconds - rem) / seconds;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 0 6px" }}>
      <div style={{ position: "relative", width: 96, height: 96 }}>
        <svg width="96" height="96" style={{ transform: "rotate(-90deg)", position: "absolute", inset: 0 }}>
          <circle cx="48" cy="48" r={r} fill="none" stroke="#1c1c1c" strokeWidth="5" />
          <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: rem <= 5 ? "#ff4444" : "#fff", lineHeight: 1 }}>{rem}</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#555", letterSpacing: 2 }}>SEG</span>
        </div>
      </div>
      <span style={{ fontSize: 10, letterSpacing: 3, color: "#444", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>descansando</span>
      <button onClick={onDone} style={{
        marginTop: 2, padding: "4px 14px", background: "transparent",
        border: "1px solid #2a2a2a", borderRadius: 20,
        color: "#444", fontSize: 10, fontFamily: "'DM Mono', monospace",
        letterSpacing: 2, cursor: "pointer",
      }}>PULAR</button>
    </div>
  );
}

// ─── EDIT MODAL ────────────────────────────────────────────────────────────────
function EditModal({ ex, color, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({ ...ex });
  const isCardio = ex.muscle === "Cardio";
  const inp = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const labelStyle = { fontSize: 10, letterSpacing: 3, color: "#555", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 6, display: "block" };
  const inputStyle = {
    width: "100%", background: "#111", border: "1px solid #222", borderRadius: 8,
    color: "#eee", padding: "10px 12px", fontFamily: "'Syne', sans-serif", fontSize: 14,
    outline: "none", transition: "border-color 0.2s",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div className="scale-in" onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 480,
        background: "#0e0e0e",
        borderTop: `2px solid ${color}`,
        borderRadius: "20px 20px 0 0",
        padding: "24px 20px 36px",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: color, fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>editando</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 1, lineHeight: 1.1, marginTop: 2 }}>{ex.name}</div>
          </div>
          <button onClick={onClose} style={{ background: "#1a1a1a", border: "none", borderRadius: 8, color: "#555", width: 34, height: 34, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Nome do exercício</label>
            <input style={inputStyle} value={form.name} onChange={e => inp("name", e.target.value)}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = "#222"} />
          </div>
          <div>
            <label style={labelStyle}>Músculo alvo</label>
            <input style={inputStyle} value={form.muscle} onChange={e => inp("muscle", e.target.value)}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = "#222"} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {!isCardio && <>
              <div>
                <label style={labelStyle}>Séries</label>
                <input style={inputStyle} type="number" value={form.series ?? ""} onChange={e => inp("series", parseInt(e.target.value) || null)}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = "#222"} />
              </div>
            </>}
            <div>
              <label style={labelStyle}>Reps</label>
              <input style={inputStyle} value={form.reps} onChange={e => inp("reps", e.target.value)}
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = "#222"} />
            </div>
            {!isCardio && <div>
              <label style={labelStyle}>Descanso (s)</label>
              <input style={inputStyle} type="number" value={form.rest ?? ""} onChange={e => inp("rest", parseInt(e.target.value) || null)}
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = "#222"} />
            </div>}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button onClick={() => onDelete(ex.id)} style={{
            flex: "0 0 auto", padding: "12px 16px", background: "transparent",
            border: "1px solid #2a2a2a", borderRadius: 10,
            color: "#ff4444", fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer",
          }}>🗑</button>
          <button onClick={() => onSave(form)} style={{
            flex: 1, padding: "13px", background: color,
            border: "none", borderRadius: 10,
            color: "#000", fontFamily: "'Bebas Neue', cursive",
            fontSize: 20, letterSpacing: 2, cursor: "pointer",
          }}>SALVAR</button>
        </div>
      </div>
    </div>
  );
}

// ─── EXERCISE CARD ─────────────────────────────────────────────────────────────
function ExerciseCard({ ex, color, done, onToggle, onEdit, editMode, delay = 0 }) {
  const [seriesDone, setSeriesDone] = useState([]);
  const [showTimer, setShowTimer] = useState(false);
  const isCardio = ex.muscle === "Cardio";

  const toggleSerie = (s) => {
    const next = seriesDone.includes(s) ? seriesDone.filter(x => x !== s) : [...seriesDone, s];
    setSeriesDone(next);
    if (ex.series && next.length === ex.series && ex.rest) setShowTimer(true);
  };

  return (
    <div className="fade-up" style={{
      animationDelay: `${delay}ms`,
      background: done ? "#0b0b0b" : "#111",
      border: `1px solid ${done ? "#161616" : "#1c1c1c"}`,
      borderLeft: `3px solid ${done ? "#1c1c1c" : color}`,
      borderRadius: 14,
      padding: "14px 16px",
      marginBottom: 8,
      opacity: done ? 0.45 : 1,
      transition: "all 0.3s ease",
      position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: done ? "#333" : color, fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 3 }}>
            {ex.muscle}
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: 15, color: done ? "#333" : "#f0f0f0",
            lineHeight: 1.25, transition: "color 0.3s",
          }}>
            {ex.name}
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
            {ex.series && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500, color: done ? "#2a2a2a" : "#fff", lineHeight: 1 }}>{ex.series}</span>
                <span style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "'DM Mono', monospace" }}>SÉR</span>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500, color: done ? "#2a2a2a" : "#fff", lineHeight: 1 }}>{ex.reps}</span>
              <span style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "'DM Mono', monospace" }}>REPS</span>
            </div>
            {ex.rest && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500, color: done ? "#2a2a2a" : "#fff", lineHeight: 1 }}>{ex.rest}s</span>
                <span style={{ fontSize: 9, color: "#444", letterSpacing: 2, fontFamily: "'DM Mono', monospace" }}>DESC</span>
              </div>
            )}
          </div>

          {/* Series dots */}
          {!isCardio && ex.series && !done && !editMode && (
            <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
              {Array.from({ length: ex.series }, (_, i) => (
                <button key={i} onClick={() => toggleSerie(i)} style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: seriesDone.includes(i) ? color : "#181818",
                  border: `1px solid ${seriesDone.includes(i) ? color : "#252525"}`,
                  color: seriesDone.includes(i) ? "#000" : "#555",
                  fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {seriesDone.includes(i) ? "✓" : i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action button */}
        {editMode ? (
          <button onClick={() => onEdit(ex)} style={{
            width: 36, height: 36, borderRadius: 10,
            background: "#1a1a1a", border: "1px solid #2a2a2a",
            color: color, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>✎</button>
        ) : (
          <button onClick={onToggle} style={{
            width: 36, height: 36, borderRadius: 50,
            background: done ? color + "22" : "transparent",
            border: `2px solid ${done ? color : "#252525"}`,
            color: done ? color : "#333",
            fontSize: 14, cursor: "pointer", transition: "all 0.25s",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            {done ? "✓" : ""}
          </button>
        )}
      </div>

      {showTimer && (
        <div style={{ borderTop: "1px solid #1a1a1a", marginTop: 12, paddingTop: 4 }}>
          <Timer seconds={ex.rest} color={color} onDone={() => setShowTimer(false)} />
        </div>
      )}
    </div>
  );
}

// ─── ADD EXERCISE FORM ─────────────────────────────────────────────────────────
function AddExerciseForm({ color, onAdd, onClose }) {
  const [form, setForm] = useState({ muscle: "", name: "", series: 3, reps: "10", rest: 60 });
  const inp = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const labelStyle = { fontSize: 10, letterSpacing: 3, color: "#555", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 6, display: "block" };
  const inputStyle = {
    width: "100%", background: "#111", border: "1px solid #222", borderRadius: 8,
    color: "#eee", padding: "10px 12px", fontFamily: "'Syne', sans-serif", fontSize: 14, outline: "none",
    transition: "border-color 0.2s",
  };
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div className="scale-in" onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 480, background: "#0e0e0e",
        borderTop: `2px solid ${color}`, borderRadius: "20px 20px 0 0",
        padding: "24px 20px 36px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: color, fontFamily: "'DM Mono', monospace" }}>NOVO</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 1 }}>EXERCÍCIO</div>
          </div>
          <button onClick={onClose} style={{ background: "#1a1a1a", border: "none", borderRadius: 8, color: "#555", width: 34, height: 34, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Nome</label>
            <input style={inputStyle} value={form.name} onChange={e => inp("name", e.target.value)} placeholder="Ex: Supino Reto"
              onFocus={e => e.target.style.borderColor = color} onBlur={e => e.target.style.borderColor = "#222"} />
          </div>
          <div>
            <label style={labelStyle}>Músculo</label>
            <input style={inputStyle} value={form.muscle} onChange={e => inp("muscle", e.target.value)} placeholder="Ex: Peito"
              onFocus={e => e.target.style.borderColor = color} onBlur={e => e.target.style.borderColor = "#222"} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelStyle}>Séries</label>
              <input style={inputStyle} type="number" value={form.series} onChange={e => inp("series", parseInt(e.target.value) || 3)}
                onFocus={e => e.target.style.borderColor = color} onBlur={e => e.target.style.borderColor = "#222"} />
            </div>
            <div>
              <label style={labelStyle}>Reps</label>
              <input style={inputStyle} value={form.reps} onChange={e => inp("reps", e.target.value)}
                onFocus={e => e.target.style.borderColor = color} onBlur={e => e.target.style.borderColor = "#222"} />
            </div>
            <div>
              <label style={labelStyle}>Desc (s)</label>
              <input style={inputStyle} type="number" value={form.rest} onChange={e => inp("rest", parseInt(e.target.value) || 60)}
                onFocus={e => e.target.style.borderColor = color} onBlur={e => e.target.style.borderColor = "#222"} />
            </div>
          </div>
        </div>
        <button onClick={() => { if (form.name && form.muscle) onAdd(form); }} style={{
          width: "100%", marginTop: 22, padding: "13px",
          background: color, border: "none", borderRadius: 10,
          color: "#000", fontFamily: "'Bebas Neue', cursive",
          fontSize: 20, letterSpacing: 2, cursor: "pointer",
        }}>+ ADICIONAR</button>
      </div>
    </div>
  );
}

// ─── HISTORY VIEW ──────────────────────────────────────────────────────────────
function HistoryView({ history, workouts, onClear }) {
  const grouped = history.reduce((acc, h) => {
    if (!acc[h.date]) acc[h.date] = [];
    acc[h.date].push(h);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#444", fontFamily: "'DM Mono', monospace" }}>SEU</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, letterSpacing: 2 }}>HISTÓRICO</div>
        </div>
        {history.length > 0 && (
          <button onClick={onClear} style={{ background: "transparent", border: "1px solid #2a2a2a", borderRadius: 8, color: "#555", padding: "6px 12px", fontFamily: "'DM Mono', monospace", fontSize: 10, cursor: "pointer", letterSpacing: 2 }}>LIMPAR</button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <div style={{ fontSize: 40 }}>🏋️</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#333", marginTop: 12, letterSpacing: 2 }}>NENHUM TREINO AINDA</div>
        </div>
      ) : Object.entries(grouped).map(([date, entries], gi) => (
        <div key={date} className="fade-up" style={{ animationDelay: `${gi * 60}ms`, marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#444", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>{date}</div>
          {entries.map((h, i) => {
            const w = workouts[h.workout];
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "#0f0f0f", border: "1px solid #1a1a1a",
                borderLeft: `3px solid ${w?.color || "#333"}`,
                borderRadius: 12, padding: "12px 16px", marginBottom: 6,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 1, color: w?.color, lineHeight: 1 }}>{h.label}</div>
                  <div style={{ fontSize: 10, color: "#444", fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginTop: 2 }}>{w?.tag}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#555" }}>{h.time}</div>
                  <div style={{ fontSize: 9, color: "#333", fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginTop: 2 }}>{h.duration || "—"} min</div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const todayKey = WEEK_MAP[new Date().getDay()];
  const [workouts, setWorkouts] = useState(loadWorkouts);
  const [activeTab, setActiveTab] = useState(todayKey || "A");
  const [view, setView] = useState("workout");
  const [doneSets, setDoneSets] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingEx, setEditingEx] = useState(null);
  const [addingEx, setAddingEx] = useState(false);
  const [history, setHistory] = useState(() => { try { return JSON.parse(localStorage.getItem("wh_v2") || "[]"); } catch { return []; } });
  const startRef = useRef(Date.now());

  useEffect(() => { startRef.current = Date.now(); }, [activeTab]);
  useEffect(() => { saveWorkouts(workouts); }, [workouts]);

  const workout = workouts[activeTab];
  const dKey = (tab, id) => `${tab}_${id}`;
  const toggleDone = (id) => setDoneSets(p => ({ ...p, [dKey(activeTab, id)]: !p[dKey(activeTab, id)] }));

  const progress = workout.exercises.filter(ex => doneSets[dKey(activeTab, ex.id)]).length;
  const allDone = workout.exercises.every(ex => doneSets[dKey(activeTab, ex.id)]);

  const saveExercise = (updated) => {
    setWorkouts(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        exercises: prev[activeTab].exercises.map(e => e.id === updated.id ? updated : e),
      },
    }));
    setEditingEx(null);
  };

  const deleteExercise = (id) => {
    setWorkouts(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], exercises: prev[activeTab].exercises.filter(e => e.id !== id) },
    }));
    setEditingEx(null);
  };

  const addExercise = (form) => {
    const newEx = { ...form, id: Date.now(), series: parseInt(form.series), rest: parseInt(form.rest) };
    setWorkouts(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], exercises: [...prev[activeTab].exercises, newEx] },
    }));
    setAddingEx(false);
  };

  const finishWorkout = () => {
    const mins = Math.round((Date.now() - startRef.current) / 60000);
    const entry = {
      date: new Date().toLocaleDateString("pt-BR"),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      workout: activeTab, label: workout.label, duration: mins,
    };
    const updated = [entry, ...history].slice(0, 60);
    setHistory(updated);
    localStorage.setItem("wh_v2", JSON.stringify(updated));
    setDoneSets({});
    setEditMode(false);
  };

  const NavBtn = ({ tab, label }) => (
    <button onClick={() => { setActiveTab(tab); setView("workout"); setEditMode(false); }} style={{
      flex: 1, padding: "13px 0", background: "transparent", border: "none",
      borderBottom: activeTab === tab && view === "workout" ? `2px solid ${workouts[tab].color}` : "2px solid transparent",
      color: activeTab === tab && view === "workout" ? workouts[tab].color : "#383838",
      fontFamily: "'Bebas Neue', cursive", fontSize: 20, letterSpacing: 2,
      cursor: "pointer", transition: "all 0.2s",
    }}>{label}</button>
  );

  return (
    <>
      <style>{GS}</style>
      <div style={{ minHeight: "100vh", background: "#080808", maxWidth: 480, margin: "0 auto", paddingBottom: 100, position: "relative" }}>

        {/* Header */}
        <div style={{ padding: "28px 20px 0", borderBottom: "1px solid #121212", position: "sticky", top: 0, background: "#080808", zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 5, color: "#2a2a2a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>DIÁRIO DE</div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 34, letterSpacing: 3, lineHeight: 0.95, color: "#fff" }}>TREINO</div>
            </div>
            <div style={{ textAlign: "right" }}>
              {todayKey ? (
                <div style={{
                  background: workouts[todayKey].color + "18",
                  border: `1px solid ${workouts[todayKey].color}44`,
                  color: workouts[todayKey].color,
                  padding: "5px 12px", borderRadius: 20,
                  fontSize: 9, fontWeight: 700, letterSpacing: 3,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  HOJE · {workouts[todayKey].tag.toUpperCase()}
                </div>
              ) : (
                <div style={{ background: "#111", border: "1px solid #1a1a1a", color: "#444", padding: "5px 12px", borderRadius: 20, fontSize: 9, letterSpacing: 3, fontFamily: "'DM Mono', monospace" }}>
                  DESCANSO
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <div style={{ display: "flex" }}>
            <NavBtn tab="A" label="A" />
            <NavBtn tab="B" label="B" />
            <NavBtn tab="C" label="C" />
            <button onClick={() => { setView("history"); setEditMode(false); }} style={{
              flex: 1, padding: "13px 0", background: "transparent", border: "none",
              borderBottom: view === "history" ? "2px solid #555" : "2px solid transparent",
              color: view === "history" ? "#888" : "#2a2a2a",
              fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, cursor: "pointer",
            }}>HIST</button>
          </div>
        </div>

        {/* Content */}
        {view === "history" ? (
          <HistoryView history={history} workouts={workouts} onClear={() => { setHistory([]); localStorage.removeItem("wh_v2"); }} />
        ) : (
          <div style={{ padding: "20px 20px 0" }}>

            {/* Workout Header */}
            <div className="fade-up" style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, letterSpacing: 3, color: workout.color, lineHeight: 0.9 }}>{workout.label}</div>
                  <div style={{ fontSize: 10, letterSpacing: 4, color: "#333", fontFamily: "'DM Mono', monospace", marginTop: 6, textTransform: "uppercase" }}>
                    {workout.days} · {workout.tag}
                  </div>
                </div>
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 500, lineHeight: 1 }}>
                    <span style={{ color: workout.color }}>{progress}</span>
                    <span style={{ color: "#222" }}>/{workout.exercises.length}</span>
                  </div>
                  {/* Edit toggle */}
                  <button onClick={() => setEditMode(e => !e)} style={{
                    padding: "5px 12px", borderRadius: 20,
                    background: editMode ? workout.color + "22" : "transparent",
                    border: `1px solid ${editMode ? workout.color : "#222"}`,
                    color: editMode ? workout.color : "#444",
                    fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, cursor: "pointer",
                    transition: "all 0.2s",
                  }}>
                    {editMode ? "✓ PRONTO" : "✎ EDITAR"}
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 14, height: 2, background: "#141414", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 2, background: workout.color,
                  width: `${(progress / workout.exercises.length) * 100}%`,
                  transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: `0 0 12px ${workout.color}88`,
                }} />
              </div>
            </div>

            {/* Exercise list */}
            {workout.exercises.map((ex, i) => (
              <ExerciseCard key={ex.id} ex={ex} color={workout.color}
                done={!!doneSets[dKey(activeTab, ex.id)]}
                onToggle={() => toggleDone(ex.id)}
                onEdit={setEditingEx}
                editMode={editMode}
                delay={i * 40} />
            ))}

            {/* Add exercise button (edit mode) */}
            {editMode && (
              <button onClick={() => setAddingEx(true)} className="fade-up" style={{
                width: "100%", padding: "13px",
                background: "transparent",
                border: `1px dashed ${workout.color}55`,
                borderRadius: 14, color: workout.color,
                fontFamily: "'DM Mono', monospace", fontSize: 11,
                letterSpacing: 3, cursor: "pointer", marginBottom: 10,
                transition: "all 0.2s",
              }}>+ NOVO EXERCÍCIO</button>
            )}

            {/* Finish button */}
            {allDone && !editMode && (
              <button onClick={finishWorkout} className="fade-up" style={{
                width: "100%", padding: "16px",
                background: `linear-gradient(135deg, ${workout.color}, ${workout.color}cc)`,
                border: "none", borderRadius: 14,
                color: "#000", fontFamily: "'Bebas Neue', cursive",
                fontSize: 24, letterSpacing: 4, cursor: "pointer",
                marginTop: 8, boxShadow: `0 8px 32px ${workout.color}44`,
              }}>
                ✓ TREINO CONCLUÍDO
              </button>
            )}

            {/* Reset button */}
            {progress > 0 && !editMode && (
              <button onClick={() => setDoneSets({})} style={{
                width: "100%", padding: "10px", background: "transparent",
                border: "1px solid #1a1a1a", borderRadius: 10,
                color: "#333", fontFamily: "'DM Mono', monospace",
                fontSize: 9, letterSpacing: 3, cursor: "pointer", marginTop: 8,
              }}>REINICIAR TREINO</button>
            )}
          </div>
        )}

        {/* Modals */}
        {editingEx && (
          <EditModal ex={editingEx} color={workout.color}
            onSave={saveExercise} onDelete={deleteExercise}
            onClose={() => setEditingEx(null)} />
        )}
        {addingEx && (
          <AddExerciseForm color={workout.color}
            onAdd={addExercise}
            onClose={() => setAddingEx(false)} />
        )}
      </div>
    </>
  );
}