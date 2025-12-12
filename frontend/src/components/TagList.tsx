import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import type { TagInfo } from '../types';

interface TagListProps {
  tags: TagInfo[];
  loading: boolean;
  highlightedResources?: Set<string>;
  missingTagsMap?: Map<string, string[]>;
}

type SortColumn = keyof TagInfo | null;
type SortDirection = 'asc' | 'desc';

const TagList: React.FC<TagListProps> = ({ tags, loading, highlightedResources, missingTagsMap }) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const getResourceKey = (tag: TagInfo): string => {
    return `${tag.subscriptionId}|${tag.resourceGroupName}|${tag.resourceName}|${tag.resourceType}`;
  };

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

  const handleExportToExcel = () => {
    // Guard against empty data
    if (sortedTags.length === 0) return;

    // Convert the tags data to worksheet format
    const worksheetData = sortedTags.map(tag => ({
      'Tag Key': tag.key,
      'Tag Value': tag.value,
      'Resource Type': tag.resourceType,
      'Resource Name': tag.resourceName,
      'Resource Group': tag.resourceGroupName,
      'Subscription': tag.subscriptionName,
      'Subscription ID': tag.subscriptionId,
    }));

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Azure Tags');

    // Auto-size columns for better readability
    const maxWidth = 50;
    const columnWidths = Object.keys(worksheetData[0]).map(key => {
      const maxLength = Math.max(
        key.length,
        ...worksheetData.map(row => String(row[key as keyof typeof row] || '').length)
      );
      return { wch: Math.min(maxLength + 2, maxWidth) };
    });
    worksheet['!cols'] = columnWidths;

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `azure-tags-export-${timestamp}.xlsx`;

    // Write the file
    XLSX.writeFile(workbook, filename);
  };

  if (loading) {
    return <div className="loading">Loading tags...</div>;
  }

  if (tags.length === 0) {
    return <div className="no-results">No tags found</div>;
  }

  return (
    <div className="tag-list">
      <div className="tag-list-header">
        <h2>Tags ({tags.length})</h2>
        <button 
          className="export-button" 
          onClick={handleExportToExcel}
          disabled={tags.length === 0}
          title="Export table to Excel"
        >
          📊 Export to Excel
        </button>
      </div>
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
            {sortedTags.map((tag, index) => {
              const resourceKey = getResourceKey(tag);
              const isHighlighted = highlightedResources && highlightedResources.has(resourceKey);
              const missingTags = missingTagsMap && missingTagsMap.get(resourceKey);
              
              // Check if this is the first tag for this resource
              const isFirstTagForResource = index === 0 || getResourceKey(sortedTags[index - 1]) !== resourceKey;
              
              return (
                <React.Fragment key={index}>
                  {/* Show missing tags indicator row before the first tag of each highlighted resource */}
                  {isFirstTagForResource && isHighlighted && missingTags && (
                    <tr className="missing-tags-row">
                      <td colSpan={6} className="missing-tags-cell">
                        ⚠️ Missing required tag{missingTags.length > 1 ? 's' : ''}: <strong>{missingTags.join(', ')}</strong>
                      </td>
                    </tr>
                  )}
                  <tr className={isHighlighted ? 'highlighted-row' : ''}>
                    <td>{tag.key}</td>
                    <td>{tag.value}</td>
                    <td>{tag.resourceType}</td>
                    <td>{tag.resourceName}</td>
                    <td>{tag.resourceGroupName}</td>
                    <td>{tag.subscriptionName}</td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TagList;
