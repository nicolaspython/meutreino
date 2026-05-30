import { useState, useEffect } from "react";

const workouts = {
  A: {
    label: "Treino A",
    tag: "Empurrar",
    days: "Seg & Qui",
    color: "#FF4D00",
    muscles: ["Peito", "Ombro", "Tríceps"],
    exercises: [
      { muscle: "Peito", name: "Supino Inclinado com Barra", series: 4, reps: "8–10", rest: 90 },
      { muscle: "Peito", name: "Crucifixo Reto com Halteres", series: 3, reps: "10–12", rest: 60 },
      { muscle: "Ombro", name: "Desenvolvimento com Halteres", series: 3, reps: "10", rest: 60 },
      { muscle: "Ombro", name: "Elevação Lateral com Halteres", series: 4, reps: "12–15", rest: 60 },
      { muscle: "Tríceps", name: "Tríceps Pulley (Corda ou Barra)", series: 3, reps: "12", rest: 60 },
      { muscle: "Tríceps", name: "Tríceps Testa ou Francês", series: 3, reps: "10", rest: 60 },
      { muscle: "Cardio", name: "Esteira / Caminhada", series: null, reps: "30 min", rest: null },
    ],
  },
  B: {
    label: "Treino B",
    tag: "Puxar",
    days: "Ter & Sex",
    color: "#00C2FF",
    muscles: ["Costas", "Ombro", "Bíceps"],
    exercises: [
      { muscle: "Costas", name: "Puxada Alta (Pulley)", series: 4, reps: "10", rest: 90 },
      { muscle: "Costas", name: "Remada Baixa Sentada (Triângulo)", series: 4, reps: "10–12", rest: 60 },
      { muscle: "Costas", name: "Remada Serrote com Halter", series: 3, reps: "10 (cada)", rest: 60 },
      { muscle: "Ombro", name: "Crucifixo Invertido (Halter ou Polia)", series: 4, reps: "12–15", rest: 60 },
      { muscle: "Bíceps", name: "Rosca Direta (Barra W ou Halter)", series: 3, reps: "10", rest: 60 },
      { muscle: "Bíceps", name: "Rosca Martelo com Halteres", series: 3, reps: "12", rest: 60 },
      { muscle: "Cardio", name: "Esteira / Caminhada", series: null, reps: "30 min", rest: null },
    ],
  },
  C: {
    label: "Treino C",
    tag: "Pernas",
    days: "Qua & Sáb",
    color: "#00E87A",
    muscles: ["Pernas", "Panturrilha"],
    exercises: [
      { muscle: "Pernas", name: "Agachamento Hack ou Leg Press 45°", series: 4, reps: "10", rest: 90 },
      { muscle: "Pernas", name: "Cadeira Extensora", series: 3, reps: "12", rest: 60 },
      { muscle: "Pernas", name: "Cadeira ou Mesa Flexora", series: 4, reps: "10–12", rest: 60 },
      { muscle: "Pernas", name: "Stiff com Halteres ou Barra", series: 3, reps: "10", rest: 60 },
      { muscle: "Panturrilha", name: "Gêmeos Sentado (Máquina)", series: 4, reps: "15", rest: 60 },
      { muscle: "Cardio", name: "Esteira / Caminhada", series: null, reps: "30 min", rest: null },
    ],
  },
};

const weekMap = { 0: null, 1: "A", 2: "B", 3: "C", 4: "A", 5: "B", 6: "C" };

function Timer({ seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onDone(); return; }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);
  const pct = ((seconds - remaining) / seconds) * 100;
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#1a1a1a" strokeWidth="8" />
        <circle cx="50" cy="50" r="44" fill="none" stroke="#FF4D00" strokeWidth="8"
          strokeDasharray={`${2 * Math.PI * 44}`}
          strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
          style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <div style={{ marginTop: -64, fontSize: 28, fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#fff" }}>
        {remaining}s
      </div>
      <div style={{ marginTop: 48, fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase" }}>descanso</div>
    </div>
  );
}

function ExerciseCard({ ex, idx, color, done, onToggle }) {
  const [showTimer, setShowTimer] = useState(false);
  const [seriesDone, setSeriesDone] = useState([]);

  const toggleSerie = (s) => {
    const next = seriesDone.includes(s) ? seriesDone.filter(x => x !== s) : [...seriesDone, s];
    setSeriesDone(next);
    if (ex.series && next.length === ex.series && ex.rest) setShowTimer(true);
  };

  const isCardio = ex.muscle === "Cardio";

  return (
    <div style={{
      background: done ? "#0d0d0d" : "#111",
      border: `1px solid ${done ? "#222" : "#1e1e1e"}`,
      borderRadius: 12,
      padding: "16px 18px",
      marginBottom: 10,
      opacity: done ? 0.5 : 1,
      transition: "all 0.3s",
      position: "relative",
      overflow: "hidden",
    }}>
      {done && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", borderRadius: 12, zIndex: 1 }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: color, marginBottom: 4, fontFamily: "'Space Mono', monospace" }}>
            {ex.muscle}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: done ? "#444" : "#eee", lineHeight: 1.3, fontFamily: "'Bebas Neue', cursive", letterSpacing: 1 }}>
            {ex.name}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {ex.series && <span style={{ fontSize: 11, color: "#555" }}><span style={{ color: "#888" }}>{ex.series}</span> séries</span>}
            <span style={{ fontSize: 11, color: "#555" }}><span style={{ color: "#888" }}>{ex.reps}</span> reps</span>
            {ex.rest && <span style={{ fontSize: 11, color: "#555" }}><span style={{ color: "#888" }}>{ex.rest}s</span> descanso</span>}
          </div>
          {!isCardio && ex.series && (
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {Array.from({ length: ex.series }, (_, i) => (
                <button key={i} onClick={() => toggleSerie(i)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: seriesDone.includes(i) ? color : "#1a1a1a",
                    border: `1px solid ${seriesDone.includes(i) ? color : "#2a2a2a"}`,
                    color: seriesDone.includes(i) ? "#000" : "#555",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11, fontWeight: 700, cursor: "pointer",
                    transition: "all 0.2s",
                  }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={onToggle} style={{
          width: 36, height: 36, borderRadius: 50,
          background: done ? "#1a1a1a" : "transparent",
          border: `2px solid ${done ? color : "#2a2a2a"}`,
          color: done ? color : "#333",
          fontSize: 16, cursor: "pointer", transition: "all 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {done ? "✓" : "○"}
        </button>
      </div>
      {showTimer && (
        <div style={{ marginTop: 12, borderTop: "1px solid #1e1e1e", paddingTop: 12 }}>
          <Timer seconds={ex.rest} onDone={() => setShowTimer(false)} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const todayKey = weekMap[new Date().getDay()];
  const [activeTab, setActiveTab] = useState(todayKey || "A");
  const [doneSets, setDoneSets] = useState({});
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("workout_history") || "[]"); } catch { return []; }
  });
  const [view, setView] = useState("workout"); // workout | history

  const workout = workouts[activeTab];
  const doneKey = (tab, idx) => `${tab}_${idx}`;
  const toggleDone = (idx) => {
    setDoneSets(prev => {
      const k = doneKey(activeTab, idx);
      return { ...prev, [k]: !prev[k] };
    });
  };

  const allDone = workout.exercises.every((_, i) => doneSets[doneKey(activeTab, i)]);
  const progress = workout.exercises.filter((_, i) => doneSets[doneKey(activeTab, i)]).length;

  const finishWorkout = () => {
    const entry = {
      date: new Date().toLocaleDateString("pt-BR"),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      workout: activeTab,
      label: workout.label,
    };
    const updated = [entry, ...history].slice(0, 30);
    setHistory(updated);
    localStorage.setItem("workout_history", JSON.stringify(updated));
    setDoneSets({});
    alert(`✅ ${workout.label} finalizado! Salvo no histórico.`);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#fff", maxWidth: 480, margin: "0 auto",
      paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{ padding: "28px 20px 0", borderBottom: "1px solid #141414" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#444", textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>
              NICOLAS PLANO DE TREINO
            </div>
            <div style={{ fontSize: 30, fontFamily: "'Bebas Neue', cursive", letterSpacing: 2, lineHeight: 1, marginTop: 2 }}>
              DIÁRIO DE TREINO
            </div>
          </div>
          <div style={{
            background: todayKey ? workouts[todayKey].color : "#222",
            color: todayKey ? "#000" : "#555",
            padding: "4px 10px", borderRadius: 6,
            fontSize: 10, fontWeight: 700, letterSpacing: 2,
            fontFamily: "'Space Mono', monospace",
          }}>
            {todayKey ? `HOJE: ${workouts[todayKey].tag.toUpperCase()}` : "DESCANSO"}
          </div>
        </div>

        {/* Nav tabs */}
        <div style={{ display: "flex", gap: 0 }}>
          {["A", "B", "C"].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setView("workout"); }}
              style={{
                flex: 1, padding: "12px 0",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab && view === "workout" ? `2px solid ${workouts[tab].color}` : "2px solid transparent",
                color: activeTab === tab && view === "workout" ? workouts[tab].color : "#444",
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 18, letterSpacing: 2, cursor: "pointer",
                transition: "all 0.2s",
              }}>
              {tab}
            </button>
          ))}
          <button onClick={() => setView("history")}
            style={{
              flex: 1, padding: "12px 0",
              background: "transparent", border: "none",
              borderBottom: view === "history" ? "2px solid #888" : "2px solid transparent",
              color: view === "history" ? "#888" : "#333",
              fontFamily: "'Space Mono', monospace",
              fontSize: 11, letterSpacing: 1, cursor: "pointer",
            }}>
            hist.
          </button>
        </div>
      </div>

      {view === "history" ? (
        <div style={{ padding: "20px 20px" }}>
          <div style={{ fontSize: 22, fontFamily: "'Bebas Neue', cursive", letterSpacing: 2, marginBottom: 16, color: "#888" }}>HISTÓRICO</div>
          {history.length === 0 ? (
            <div style={{ color: "#333", fontSize: 13, fontFamily: "'Space Mono', monospace" }}>Nenhum treino registrado ainda.</div>
          ) : history.map((h, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 16px", background: "#111", borderRadius: 10, marginBottom: 8,
              border: "1px solid #1a1a1a",
            }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, letterSpacing: 1, color: workouts[h.workout]?.color }}>
                  {h.label}
                </div>
                <div style={{ fontSize: 10, color: "#444", fontFamily: "'Space Mono', monospace" }}>{workouts[h.workout]?.tag}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#666" }}>{h.date}</div>
                <div style={{ fontSize: 10, color: "#333", fontFamily: "'Space Mono', monospace" }}>{h.time}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "20px 20px" }}>
          {/* Workout header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 36, fontFamily: "'Bebas Neue', cursive", letterSpacing: 2, color: workout.color, lineHeight: 1 }}>
                  {workout.label}
                </div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#444", textTransform: "uppercase", marginTop: 2 }}>
                  {workout.days} · {workout.tag}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontFamily: "'Space Mono', monospace", color: workout.color }}>
                  {progress}<span style={{ color: "#333" }}>/{workout.exercises.length}</span>
                </div>
                <div style={{ fontSize: 10, color: "#444", letterSpacing: 2 }}>FEITOS</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 14, height: 3, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2,
                background: workout.color,
                width: `${(progress / workout.exercises.length) * 100}%`,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>

          {/* Exercises */}
          {workout.exercises.map((ex, i) => (
            <ExerciseCard
              key={i} ex={ex} idx={i} color={workout.color}
              done={!!doneSets[doneKey(activeTab, i)]}
              onToggle={() => toggleDone(i)}
            />
          ))}

          {/* Finish button */}
          {allDone && (
            <button onClick={finishWorkout} style={{
              width: "100%", padding: "16px",
              background: workout.color, color: "#000",
              border: "none", borderRadius: 12,
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 22, letterSpacing: 3, cursor: "pointer",
              marginTop: 8, transition: "opacity 0.2s",
            }}>
              ✓ FINALIZAR TREINO
            </button>
          )}
        </div>
      )}

      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
    </div>
  );
}
