import React from 'react';
import { Filter, X } from 'lucide-react';
import Button from './Button';
import '../styles/FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange, onClearFilters, filterOptions }) => {
  return (
    <div className="filter-panel">
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={18} />
          <span>Filters</span>
        </div>
        <button className="clear-filters-btn" onClick={onClearFilters}>
          <X size={16} />
          Clear All
        </button>
      </div>

      <div className="filter-content">
        {filterOptions.map((option) => (
          <div key={option.key} className="filter-group">
            <label className="filter-label">{option.label}</label>
            {option.type === 'select' ? (
              <select
                className="filter-select"
                value={filters[option.key] || ''}
                onChange={(e) => onFilterChange(option.key, e.target.value)}
              >
                <option value="">All {option.label}</option>
                {option.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : option.type === 'checkbox' ? (
              <div className="filter-checkbox-group">
                {option.options.map((opt) => (
                  <label key={opt.value} className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters[option.key]?.includes(opt.value) || false}
                      onChange={(e) => {
                        const currentValues = filters[option.key] || [];
                        const newValues = e.target.checked
                          ? [...currentValues, opt.value]
                          : currentValues.filter((v) => v !== opt.value);
                        onFilterChange(option.key, newValues);
                      }}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
