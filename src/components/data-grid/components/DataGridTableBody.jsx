import React from "react";
const DataGridTableBody = ({ children, bodyPaddingRight }) => {
  return (
    <tbody
      style={bodyPaddingRight ? { paddingRight: bodyPaddingRight } : undefined}
    >
      {children}
    </tbody>
  );
};
export { DataGridTableBody };
