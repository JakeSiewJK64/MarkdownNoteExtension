import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router";
import { Editor } from "./components/Editor/index.tsx";
import { Preview } from "./components/Preview/index.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Editor />} />
          <Route path="/preview" element={<Preview />} />
        </Route>
      </Routes>
    </HashRouter>
    <div className="text-end me-2">@JakeSiewJK64/2025-02-23</div>
  </StrictMode>
);
