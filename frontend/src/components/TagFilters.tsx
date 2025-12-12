import React from 'react';

interface TagFiltersProps {
  showOnlyNull: boolean;
  onShowOnlyNullChange: (value: boolean) => void;
  includeResourceGroups: boolean;
  onIncludeResourceGroupsChange: (value: boolean) => void;
  includeResources: boolean;
  onIncludeResourcesChange: (value: boolean) => void;
}

const TagFilters: React.FC<TagFiltersProps> = ({
  showOnlyNull,
  onShowOnlyNullChange,
  includeResourceGroups,
  onIncludeResourceGroupsChange,
  includeResources,
  onIncludeResourcesChange,
}) => {
  return (
    <div className="tag-filters">
      <h3>Filters</h3>
      <div className="filters-group">
        <div className="filter-item">
          <label>
            <input
              type="checkbox"
              checked={showOnlyNull}
              onChange={(e) => onShowOnlyNullChange(e.target.checked)}
            />
            <span>Show only tags with null/empty values</span>
          </label>
        </div>
        
        <div className="filter-section">
          <h4>Resource Type</h4>
          <div className="filter-item">
            <label>
              <input
                type="checkbox"
                checked={includeResourceGroups}
                onChange={(e) => onIncludeResourceGroupsChange(e.target.checked)}
              />
              <span>Include Resource Groups</span>
            </label>
          </div>
          <div className="filter-item">
            <label>
              <input
                type="checkbox"
                checked={includeResources}
                onChange={(e) => onIncludeResourcesChange(e.target.checked)}
              />
              <span>Include Resources</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagFilters;
