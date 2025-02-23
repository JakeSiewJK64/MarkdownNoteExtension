import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import {
  saveEntry,
  getTodaysEntry,
  getAllEntries,
  Entry,
} from "./utils/entries";
import { cn } from "./utils/cn";
import { useHotKeys } from "./hooks";
import CopySVG from "./assets/icons/copy.svg";
import Tick from "./assets/icons/tick.svg";
import "./App.css";

type ActiveTab = "preview" | "editor";

function CopyClipboardButton(props: { content: string; title: string }) {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (clicked) {
        setClicked(false);
      }
    }, 1500);
  }, [clicked]);

  return (
    <button
      title={props.title}
      className="border rounded p-1 w-[1.5rem] hover:bg-slate-100 cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(props.content);
        setClicked(true);
      }}
    >
      {clicked ? <img src={Tick} /> : <img src={CopySVG} />}
    </button>
  );
}

function Preview() {
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [entries, setEntries] = useState<Record<string, Entry>>();

  useEffect(() => {
    const entriesFromCache = getAllEntries();

    if (entriesFromCache) {
      const json = JSON.parse(entriesFromCache);
      setEntries(json);
    }
  }, []);

  if (!entries) {
    return null;
  }

  return (
    <div className="my-2">
      <div className="flex flex-row gap-1 mx-2 justify-end">
        <button
          disabled={page === 0}
          onClick={() => {
            setPage((prev) => prev - 1);
          }}
          className="disabled:opacity-50 disabled:cursor-not-allowed border rounded px-2 cursor-pointer hover:bg-slate-100"
        >
          prev
        </button>
        <button
          disabled={
            Math.ceil(Object.entries(entries).length / pageSize) - 1 === page
          }
          onClick={() => {
            setPage((prev) => prev + 1);
          }}
          className="disabled:opacity-50 disabled:cursor-not-allowed border rounded px-2 cursor-pointer hover:bg-slate-100"
        >
          next
        </button>
        <select
          className="border rounded px-2 cursor-pointer hover:bg-slate-100"
          onChange={(e) => {
            const val = e.target.value;
            setPageSize(Number(val));
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      {Object.keys(entries)
        .slice(page * pageSize, page * pageSize + pageSize)
        .map((date) => (
          <div key={date} className="border rounded p-2 m-2">
            <div className="flex flex-row justify-between">
              <div>{date}</div>
              <CopyClipboardButton
                content={entries[date].content}
                title="Copy markdown content"
              />
            </div>
            <Markdown remarkPlugins={[remarkGfm]}>
              {entries[date].content}
            </Markdown>
          </div>
        ))}
    </div>
  );
}

function Editor() {
  const [loading, setLoading] = useState(false);
  const [todo, setTodo] = useState("");

  // save to localstorage
  useEffect(() => {
    const handler = setTimeout(() => {
      saveEntry({
        content: todo,
      });
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [todo]);

  useEffect(() => {
    const todayCache = getTodaysEntry();

    // create todays entry and set to empty content
    if (!todayCache) {
      saveEntry({
        content: "",
      });
      return;
    }

    setTodo(todayCache.content);
  }, []);

  return (
    <div className="flex flex-col p-2">
      <div className="h-[1rem] text-end">{loading && "Saving..."}</div>
      <textarea
        value={todo}
        onChange={(e) => {
          setTodo(e.target.value);
          setLoading(true);
        }}
        placeholder=" i.e. - [ ] grocery shopping"
        className="resize-none rounded w-[100%] border h-100"
      />
    </div>
  );
}

function Page(props: { activeTab: ActiveTab }) {
  switch (props.activeTab) {
    case "editor":
      return <Editor />;
    default:
      return <Preview />;
  }
}

function App() {
  const { ctrlKey, key } = useHotKeys(["k", "p"]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("editor");

  useEffect(() => {
    if (ctrlKey) {
      if (key === "k") {
        setActiveTab("editor");
        return;
      }

      if (key === "p") {
        setActiveTab("preview");
        return;
      }
    }
  }, [ctrlKey, key]);

  return (
    <>
      <div className="flex flex-row gap-2 m-2 border-b-1 border-b-slate-300 min-w-[20rem]">
        <button
          onClick={() => {
            setActiveTab("editor");
          }}
          className={cn(
            `cursor-pointer hover:bg-red-100 p-2 rounded-t bg-slate-300 ${
              activeTab === "editor" && "bg-red-300"
            }`
          )}
        >
          Editor (CTRL + K)
        </button>
        <button
          onClick={() => {
            setActiveTab("preview");
          }}
          className={cn(
            `cursor-pointer hover:bg-red-100 p-2 rounded-t bg-slate-300 ${
              activeTab === "preview" && "bg-red-300"
            }`
          )}
        >
          Preview (CTRL + P)
        </button>
      </div>
      <Page activeTab={activeTab} />
      <div className="text-end me-2">@JakeSiewJK64/2025-02-23</div>
    </>
  );
}

export default App;
