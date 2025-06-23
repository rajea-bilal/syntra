import { useState } from "react";

// Type for a column
interface Column {
  key: string;
  label: string;
}

// Props: columns (array of {key, label}), data (array of objects), loading (bool)
interface MetricsTableProps {
  columns: Column[];
  data: Array<Record<string, string | number>>;
  loading?: boolean;
}

export default function MetricsTable({ columns, data, loading }: MetricsTableProps) {
  // State for sorting
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Sort data if needed
  const sortedData = [...data];
  if (sortKey) {
    sortedData.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  // Handle header click
  function handleSort(key: string) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  // Show loading or empty state
  if (loading) {
    return <div className="p-6 text-zinc-400 text-center">Loading...</div>;
  }
  if (!sortedData.length) {
    return <div className="p-6 text-zinc-400 text-center">No data to show.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left cursor-pointer select-none text-zinc-600 dark:text-zinc-300"
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sortKey === col.key ? (sortAsc ? " ▲" : " ▼") : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2 whitespace-nowrap">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 