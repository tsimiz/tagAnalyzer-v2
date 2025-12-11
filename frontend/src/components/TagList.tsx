import React from 'react';
import type { TagInfo } from '../types';

interface TagListProps {
  tags: TagInfo[];
  loading: boolean;
}

const TagList: React.FC<TagListProps> = ({ tags, loading }) => {
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
              <th>Tag Key</th>
              <th>Tag Value</th>
              <th>Resource Type</th>
              <th>Resource Name</th>
              <th>Resource Group</th>
              <th>Subscription</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag, index) => (
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
