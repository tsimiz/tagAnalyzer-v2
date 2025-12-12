import React, { useState } from 'react';

interface TagSearchProps {
  onSearch: (tagKey: string, tagValue: string) => void;
  loading: boolean;
}

const TagSearch: React.FC<TagSearchProps> = ({ onSearch, loading }) => {
  const [tagKey, setTagKey] = useState('');
  const [tagValue, setTagValue] = useState('');

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTagKey(newValue);
    onSearch(newValue, tagValue);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTagValue(newValue);
    onSearch(tagKey, newValue);
  };

  const handleClear = () => {
    setTagKey('');
    setTagValue('');
    onSearch('', '');
  };

  return (
    <div className="tag-search">
      <h2>Search Tags</h2>
      <div>
        <div className="form-group">
          <label htmlFor="tagKey">Tag Key:</label>
          <input
            type="text"
            id="tagKey"
            value={tagKey}
            onChange={handleKeyChange}
            placeholder="Start typing to filter by tag key..."
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tagValue">Tag Value:</label>
          <input
            type="text"
            id="tagValue"
            value={tagValue}
            onChange={handleValueChange}
            placeholder="Start typing to filter by tag value..."
            disabled={loading}
          />
        </div>
        <div className="button-group">
          <button type="button" onClick={handleClear} disabled={loading}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagSearch;
