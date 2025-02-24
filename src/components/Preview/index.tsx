import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { useState, useEffect } from "react";
import { Entry, getAllEntries } from "../../utils/entries";
import { exportEntriesToCSV } from "../../utils/export";
import CopySVG from "../../assets/icons/copy.svg";
import Tick from "../../assets/icons/tick.svg";
import DownloadSVG from "../../assets/icons/download.svg";

function ExportCSVButton() {
  return (
    <button
      title="Export notes to csv"
      className="border rounded p-1 w-[1.5rem] hover:bg-slate-100 cursor-pointer"
      onClick={() => exportEntriesToCSV()}
    >
      <img src={DownloadSVG} />
    </button>
  );
}

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

export function Preview() {
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
        <ExportCSVButton />
      </div>
      {Object.keys(entries)
        .sort(
          (dateA, dateB) =>
            new Date(dateB).getDate() - new Date(dateA).getDate()
        )
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
