import React, { useMemo } from "react";
import { ClipboardList } from "lucide-react";
import { renderCell } from "../../utils/tableUtils.jsx";

function DataTable({ rows, emptyMessage = "No records found." }) {
  const columns = useMemo(() => {
    const first = rows[0];
    return first ? Object.keys(first) : [];
  }, [rows]);

  if (!rows.length) {
    return (
      <div className="empty-state">
        <ClipboardList size={22} />
        <span>{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>{renderCell(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
