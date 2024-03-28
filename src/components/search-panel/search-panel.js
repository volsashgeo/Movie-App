import React from 'react';
import './search-panel.css';

function SearchPanel(props) {
  const { onInputChange } = props;

  return (
    <input
      onChange={onInputChange}
      className="search-panel"
      type="text"
      placeholder="Введите название фильма для поиска"
    />
  );
}

export default SearchPanel;
