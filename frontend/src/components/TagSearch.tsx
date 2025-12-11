import React, { useState } from 'react';

interface TagSearchProps {
  onSearch: (tagKey: string, tagValue: string) => void;
  loading: boolean;
}

const TagSearch: React.FC<TagSearchProps> = ({ onSearch, loading }) => {
  const [tagKey, setTagKey] = useState('');
  const [tagValue, setTagValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(tagKey, tagValue);
  };

  const handleClear = () => {
    setTagKey('');
    setTagValue('');
    onSearch('', '');
  };

  return (
    <div className="tag-search">
      <h2>Search Tags</h2>
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="tagKey">Tag Key:</label>
          <input
            type="text"
            id="tagKey"
            value={tagKey}
            onChange={(e) => setTagKey(e.target.value)}
            placeholder="Enter tag key to search..."
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tagValue">Tag Value:</label>
          <input
            type="text"
            id="tagValue"
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
            placeholder="Enter tag value to search..."
            disabled={loading}
          />
        </div>
        <div className="button-group">
          <button type="submit" disabled={loading}>
            Search
          </button>
          <button type="button" onClick={handleClear} disabled={loading}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default TagSearch;
