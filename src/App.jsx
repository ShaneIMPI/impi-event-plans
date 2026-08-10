import { useEffect, useState } from "react";
import "./App.css";
import ModuleToggles from "./components/ModuleToggles";
import Questionnaire from "./components/Questionnaire";
import DraftList from "./components/DraftList";
import { saveDraft, listDrafts, getDraft, deleteDraft, newDraftId } from "./lib/db";
import { generateSelectedDocuments } from "./docgen/generate";
import { CORE_FIELDS } from "./data/questionnaire";

function emptyAnswers() {
  const answers = {};
  for (const f of CORE_FIELDS) {
    if (f.default) answers[f.id] = f.default;
  }
  return answers;
}

export default function App() {
  const [drafts, setDrafts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [toggledModules, setToggledModules] = useState(["safety", "security"]);
  const [answers, setAnswers] = useState(emptyAnswers());
  const [status, setStatus] = useState("");
  const [generating, setGenerating] = useState(false);

  const refreshDrafts = async () => setDrafts(await listDrafts());

  useEffect(() => {
    refreshDrafts();
  }, []);

  // Autosave whenever answers or toggles change (debounced)
  useEffect(() => {
    if (!activeId) return;
    const timeout = setTimeout(async () => {
      await saveDraft({ id: activeId, toggledModules, answers, eventName: answers.eventName || "Untitled Event" });
      refreshDrafts();
      setStatus("Draft saved");
      setTimeout(() => setStatus(""), 1500);
    }, 800);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, toggledModules]);

  const handleNew = async () => {
    const id = newDraftId();
    const fresh = emptyAnswers();
    await saveDraft({ id, toggledModules: ["safety", "security"], answers: fresh, eventName: "Untitled Event" });
    setActiveId(id);
    setAnswers(fresh);
    setToggledModules(["safety", "security"]);
    refreshDrafts();
  };

  const handleSelect = async (id) => {
    const draft = await getDraft(id);
    if (!draft) return;
    setActiveId(id);
    setAnswers(draft.answers || {});
    setToggledModules(draft.toggledModules || []);
  };

  const handleDelete = async (id) => {
    await deleteDraft(id);
    if (activeId === id) {
      setActiveId(null);
      setAnswers(emptyAnswers());
    }
    refreshDrafts();
  };

  const handleFieldChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async () => {
    if (!activeId) return;
    setGenerating(true);
    setStatus("Generating documents…");
    try {
      const files = await generateSelectedDocuments(answers, toggledModules);
      setStatus(`Generated: ${files.join(", ")}`);
    } catch (err) {
      console.error(err);
      setStatus("Error generating documents — check console.");
    } finally {
      setGenerating(false);
    }
  };

  const missingRequired = CORE_FIELDS.filter((f) => f.required && !answers[f.id]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>IMPI Event Plan Generator</h1>
        <p>Safety &amp; Security Management Plans — SASREA aligned</p>
      </header>

      <div className="app-body">
        <aside>
          <DraftList drafts={drafts} activeId={activeId} onSelect={handleSelect} onNew={handleNew} onDelete={handleDelete} />
        </aside>

        <main>
          {!activeId && <p className="hint">Select "New Event" to get started, or resume a saved draft.</p>}
          {activeId && (
            <>
              <ModuleToggles toggled={toggledModules} onChange={setToggledModules} />
              <Questionnaire toggledModules={toggledModules} answers={answers} onChange={handleFieldChange} />

              <div className="generate-bar">
                {missingRequired.length > 0 && (
                  <p className="warning">
                    Missing required: {missingRequired.map((f) => f.label).join(", ")}
                  </p>
                )}
                <button
                  className="btn-generate"
                  disabled={generating || toggledModules.length === 0 || missingRequired.length > 0}
                  onClick={handleGenerate}
                >
                  {generating ? "Generating…" : "Generate Selected Documents (.docx)"}
                </button>
                {status && <span className="status">{status}</span>}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
