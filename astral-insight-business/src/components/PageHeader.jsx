import React from 'react';

const PageHeader = ({ title, description, action }) => {
  return (
    <div className="flex items-end justify-between border-b border-white/5 pb-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;