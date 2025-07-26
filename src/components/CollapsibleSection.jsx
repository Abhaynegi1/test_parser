import React from 'react';

const CollapsibleSection = ({ 
  title, 
  isExpanded, 
  onToggle, 
  children, 
  downloadButtons = [],
  itemCount = null 
}) => {
  const displayTitle = itemCount ? `${title} (${itemCount})` : title;
  
  return (
    <div className="border border-gray-300 rounded-lg mb-4 bg-gray-50">
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        className="w-full px-4 py-3 text-left font-bold text-gray-800 bg-gray-100 rounded-t-lg hover:bg-gray-200 flex justify-between items-center cursor-pointer"
      >
        <span className="text-base font-bold text-gray-800">{displayTitle}</span>
        <span className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-normal">
            {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </span>
          {downloadButtons.map((button, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                button.onClick();
              }}
              className={`ml-2 ${button.className || 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm'}`}
            >
              {button.label}
            </button>
          ))}
        </span>
      </div>
      {isExpanded && (
        <div className="p-4 bg-white rounded-b-lg">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection; 