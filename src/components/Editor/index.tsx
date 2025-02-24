import { useState, useEffect } from "react";
import { saveEntry, getTodaysEntry, getTodaysDate } from "../../utils/entries";

export function Editor() {
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

    // if today cache available, load todays cache
    if (todayCache) {
      setTodo(todayCache.content);
    }
  }, []);

  return (
    <div className="flex flex-col p-2">
      <div className="h-[2rem] justify-end flex flex-row gap-2">
        <div>Time: {getTodaysDate()}</div>
        <div>{loading && "Saving..."}</div>
      </div>
      <textarea
        value={todo}
        onChange={(e) => {
          setTodo(e.target.value);
          setLoading(true);
        }}
        placeholder=" i.e. - [ ] grocery shopping"
        className="p-2 resize-none rounded w-[100%] border h-100"
      />
    </div>
  );
}
