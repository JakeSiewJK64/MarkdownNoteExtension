import { getAllEntries, getTodaysDate } from "./entries";

export function downloadCSV(props: { data: string; name: string }) {
  const { data, name } = props;
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
}

export function exportEntriesToCSV() {
  const cacheString = getAllEntries();

  if (!cacheString) {
    return;
  }

  const cacheJSON = JSON.parse(cacheString);

  let csv = "date,content\n";

  Object.keys(cacheJSON).forEach((date) => {
    csv = csv.concat(`${date},${cacheJSON[date].content}\n`);
  });

  downloadCSV({
    data: csv,
    name: `markdown_export_${getTodaysDate()}.csv`,
  });
}
