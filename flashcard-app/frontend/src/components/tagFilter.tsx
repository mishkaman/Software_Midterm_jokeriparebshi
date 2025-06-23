import React from 'react';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagChange: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ availableTags, selectedTags, onTagChange }) => {
  return (
    <div id="tag-filter" style={{ marginBottom: '1rem' }}>
      <strong>Filter by tags:</strong>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        {availableTags.map(tag => (
          <label key={tag}>
            <input
              type="checkbox"
              value={tag}
              checked={selectedTags.includes(tag)}
              onChange={() => onTagChange(tag)}
            />{' '}
            {tag}
          </label>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
