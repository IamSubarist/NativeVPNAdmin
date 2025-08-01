import React from "react";
import { useDataGrid } from "..";
const DataGridLoader = () => {
  const { props } = useDataGrid();
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-center gap-2 px-4 py-2 font-medium leading-none text-2sm border border-gray-200 shadow-default rounded-md text-gray-500 bg-light">
        <svg
          className="animate-spin -ml-1 h-5 w-5 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {props.messages?.loading}
      </div>
    </div>
  );
};
export { DataGridLoader };
