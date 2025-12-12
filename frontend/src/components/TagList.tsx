import React, { useState } from 'react';
import type { TagInfo } from '../types';

interface TagListProps {
  tags: TagInfo[];
  loading: boolean;
}

type SortColumn = keyof TagInfo | null;
type SortDirection = 'asc' | 'desc';

const TagList: React.FC<TagListProps> = ({ tags, loading }) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (column: keyof TagInfo) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedTags = React.useMemo(() => {
    if (!sortColumn) return tags;

    return [...tags].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      // Handle null/undefined values
      const aIsNull = aVal === null || aVal === undefined;
      const bIsNull = bVal === null || bVal === undefined;
      
      if (aIsNull && bIsNull) return 0;
      if (aIsNull) return sortDirection === 'asc' ? 1 : -1;
      if (bIsNull) return sortDirection === 'asc' ? -1 : 1;
      
      const comparison = aVal.toString().localeCompare(bVal.toString());
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tags, sortColumn, sortDirection]);

  const getSortIndicator = (column: keyof TagInfo) => {
    if (sortColumn !== column) return ' ↕';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading) {
    return <div className="loading">Loading tags...</div>;
  }

  if (tags.length === 0) {
    return <div className="no-results">No tags found</div>;
  }

  return (
    <div className="tag-list">
      <h2>Tags ({tags.length})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('key')} className="sortable">
                Tag Key{getSortIndicator('key')}
              </th>
              <th onClick={() => handleSort('value')} className="sortable">
                Tag Value{getSortIndicator('value')}
              </th>
              <th onClick={() => handleSort('resourceType')} className="sortable">
                Resource Type{getSortIndicator('resourceType')}
              </th>
              <th onClick={() => handleSort('resourceName')} className="sortable">
                Resource Name{getSortIndicator('resourceName')}
              </th>
              <th onClick={() => handleSort('resourceGroupName')} className="sortable">
                Resource Group{getSortIndicator('resourceGroupName')}
              </th>
              <th onClick={() => handleSort('subscriptionName')} className="sortable">
                Subscription{getSortIndicator('subscriptionName')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTags.map((tag, index) => (
              <tr key={index}>
                <td>{tag.key}</td>
                <td>{tag.value}</td>
                <td>{tag.resourceType}</td>
                <td>{tag.resourceName}</td>
                <td>{tag.resourceGroupName}</td>
                <td>{tag.subscriptionName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TagList;
