import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl w-96">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-3xl font-bold">1ClickProject</h1>
          <p className="text-base-content/60">Tauri + React + DaisyUI</p>

          <div className="form-control w-full mt-4">
            <input
              type="text"
              placeholder="Entre ton nom..."
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") greet();
              }}
            />
          </div>

          <button className="btn btn-primary w-full mt-2" onClick={greet}>
            Saluer
          </button>

          {greetMsg && (
            <div className="alert alert-success mt-4">
              <span>{greetMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
