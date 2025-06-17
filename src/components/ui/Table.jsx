import { useState } from 'react';
import { ChevronUp, ChevronDown, Edit, Trash, Plus } from 'lucide-react';
import { Button } from './Button';

export const Table = ({
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
  addButtonText = 'Agregar',
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === bValue) return 0;

    const comparison = aValue > bValue ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="overflow-x-auto">
      {onAdd && (
        <div className="mb-4">
          <Button
            variant="success"
            size="sm"
            onClick={onAdd}
            className="flex items-center"
          >
            <Plus size={16} className="mr-1" />
            {addButtonText}
          </Button>
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.field}
                onClick={() => column.sortable !== false && handleSort(column.field)}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''}
                `}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable !== false && sortField === column.field && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={`${row.id}-${column.field}`} className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {column.render ? column.render(row) : row[column.field]}
                  </div>
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  {onEdit && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(row)}
                      className="flex items-center"
                    >
                      <Edit size={16} />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(row)}
                      className="flex items-center"
                    >
                      <Trash size={16} />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};