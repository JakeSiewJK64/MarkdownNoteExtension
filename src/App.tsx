import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { cn } from "./utils/cn";
import { useHotKeys } from "./hooks";
import "./App.css";

function App() {
  const { ctrlKey, key } = useHotKeys(["k", "p"]);
  const navigate = useNavigate();
  const { pathname: pathName } = useLocation();

  useEffect(() => {
    if (ctrlKey) {
      if (key === "k") {
        navigate("/");
        return;
      }

      if (key === "p") {
        navigate("/preview");
        return;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrlKey, key]);

  return (
    <>
      <div className="flex flex-row gap-2 m-2 border-b-1 border-b-slate-300 min-w-[20rem]">
        <button
          onClick={() => {
            navigate("/");
          }}
          className={cn(
            `cursor-pointer hover:bg-red-100 p-2 rounded-t bg-slate-300 ${
              pathName === "/" && "bg-red-300"
            }`
          )}
        >
          Editor (CTRL + K)
        </button>
        <button
          onClick={() => {
            navigate("/preview");
          }}
          className={cn(
            `cursor-pointer hover:bg-red-100 p-2 rounded-t bg-slate-300 ${
              pathName === "/preview" && "bg-red-300"
            }`
          )}
        >
          Preview (CTRL + P)
        </button>
      </div>
      <Outlet />
    </>
  );
}

export default App;
