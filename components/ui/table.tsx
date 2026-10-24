export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty = "Nada por aqui ainda.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  empty?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-[24px] border border-line-subtle bg-card">
      <table className="w-full border-collapse text-left text-[14.5px]">
        <thead>
          <tr className="border-b border-line-subtle">
            {columns.map((c) => (
              <th
                key={c.header}
                className={`lf-eyebrow px-5 py-3 ${c.className ?? ""}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-10 text-center text-muted"
              >
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-line-subtle last:border-0 hover:bg-sunken"
            >
              {columns.map((c) => (
                <td
                  key={c.header}
                  className={`px-5 py-3 align-middle ${c.className ?? ""}`}
                >
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
