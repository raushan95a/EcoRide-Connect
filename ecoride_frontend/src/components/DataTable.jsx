import React from 'react';
import '../styles/index.css';

const DataTable = ({ columns, data, onRowClick }) => {
  return (
    <div style={{ overflowX: 'auto', background: 'var(--card-bg)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
            {columns.map((col, index) => (
              <th key={index} style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                borderBottom: '1px solid var(--border-color)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => { if (onRowClick) e.currentTarget.style.backgroundColor = '#f9fafb' }}
              onMouseOut={(e) => { if (onRowClick) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;