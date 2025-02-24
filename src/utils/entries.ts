export type Entry = {
  content: string;
};

export function getTodaysDate() {
  return new Date().toISOString().split("T")[0];
}

export function saveEntry(content: { content: string }) {
  const todaysDate = getTodaysDate();
  const allCache = getAllEntries();
  const newContent = { [todaysDate]: content.content };

  localStorage.setItem(
    "todoCache",
    JSON.stringify({
      ...(allCache && JSON.parse(allCache)),
      ...newContent,
    })
  );

  return newContent;
}

export function getAllEntries() {
  return localStorage.getItem("todoCache");
}

export function getTodaysEntry() {
  const todoLocalStorage = localStorage.getItem("todoCache");
  const todaysDate = getTodaysDate();

  // handle first time cache setup
  if (!todoLocalStorage) {
    const content = saveEntry({ content: "" });
    return content;
  }

  const todoCache = JSON.parse(todoLocalStorage);
  const todayCache = todoCache[todaysDate];

  return todayCache;
}
