// src/components/QueryResult.jsx
import PropTypes from "prop-types";
import "../styles/QueryResult.css"; // Assuming you want to keep the CSS separate

const QueryResult = ({ results }) => {
  if (!results.length) return <p>No results to display</p>;

  const headers = Object.keys(results[0]);

  return (
    <div className="query-result-container">
      <table className="query-result-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

QueryResult.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default QueryResult;
