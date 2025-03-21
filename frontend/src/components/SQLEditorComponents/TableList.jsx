// src/components/TableList.jsx
// import React from "react";
import PropTypes from "prop-types";

const TableList = ({ tables, onTableSelect }) => (
  <div>
    <h4>Available Tables</h4>
    <ul>
      {tables.map((table) => (
        <li key={table} onClick={() => onTableSelect(table)}>
          {table}
        </li>
      ))}
    </ul>
  </div>
);

// Define prop types for validation
TableList.propTypes = {
  tables: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTableSelect: PropTypes.func.isRequired,
};

export default TableList;
