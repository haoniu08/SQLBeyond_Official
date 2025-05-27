import { useState } from "react";
import PropTypes from "prop-types";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "../../../styles/LeftSidebar.css";
import tables from "../../../data/tables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";

const LeftSidebar = ({
  message,
  handleTableContent,
  expectedOutput,
  handleAnimationClick,
  gameData,
}) => {
  const [expandedTable, setExpandedTable] = useState(null);

  // Safely compute adjustedPoints with optional chaining:
  // If gameData or currentQuestion is undefined, fallback to 0
  const adjustedPoints = (gameData?.currentQuestion?.points ?? 0) - (gameData?.hintsUsedForQuestion ?? 0);

  const handleToggle = (tableName, index) => {
    setExpandedTable(expandedTable === tableName ? null : tableName);
  };

  return (
    <div className="left-sidebar">
      <div className="left-sidebar-top">
        <div className="message-container">
          {message && (
            <div className="message">
              {/* Now "adjustedPoints" won't crash if gameData is missing */}
              <p>
                Points for this question: <span>{adjustedPoints}</span>
              </p>

              {/* Update */}
              {gameData?.currentQuestion?.difficulty && (
                <p>
                  <span className={`difficulty-label ${gameData.currentQuestion.difficulty.toLowerCase()}`}>
                    {gameData.currentQuestion.difficulty}
                  </span>
                </p>
              )}

              <h3 className="section-header">📝 Current Task</h3>
              <p className="task-message">
                {message}
              </p>

              <h3 className="section-header">🔍 Expected Output (Top 5 Rows)</h3>

              <div className="sample-table-container">
                <table className="sample-table">
                  <thead>
                    <tr>
                      {expectedOutput.length > 0 &&
                        Object.keys(expectedOutput[0]).map((col, index) => (
                          <th key={index}>{col}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expectedOutput.length > 0 ? (
                      expectedOutput.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((val, colIndex) => (
                            <td key={colIndex}>{val}</td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="100%">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className="sidebar-heading">Tables</h2>
      <div className="left-sidebar-bottom">
        <ul>
          {tables.map((table, index) => {
            const isExpanded = expandedTable === table.name;

            return (
              <li key={index}>
                <div
                  onClick={() => handleToggle(table.name, index)}
                  className="table-name"
                >
                  {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                  <span className="tables-headers">
                    <div>{table.name}</div>
                    {isExpanded && (
                      <div className="tooltip-container">
                        <FontAwesomeIcon
                          icon={faThumbtack}
                          className="pin-icon"
                          onClick={() => {
                            handleAnimationClick();
                            handleTableContent(table);
                          }}
                        />
                        <span className="tooltip">Pin this table</span>
                      </div>
                    )}
                  </span>
                </div>

                <div
                  className={`table-columns ${isExpanded ? "expanded" : ""}`}
                >
                  <ul>
                    {table.columns.map((column, idx) => (
                      <li key={idx} className="column">
                        <strong>{column.name}</strong>: {column.type}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

LeftSidebar.propTypes = {
  message: PropTypes.string,
  handleTableContent: PropTypes.func.isRequired,
  expectedOutput: PropTypes.array,
  handleAnimationClick: PropTypes.func.isRequired,
  gameData: PropTypes.object, // The shape containing currentQuestion, hintsUsedForQuestion, etc.
};

export default LeftSidebar;
