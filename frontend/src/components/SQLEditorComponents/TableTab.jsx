import closeBtn from "../../assets/closeBtn.svg";

const TableTab = ({ table, removeTable }) => {
    return (
        <div className="table-tabs">
            <div className="tab-header">
                <h3>{table.name}</h3>
                <img src={closeBtn} alt="close btn" onClick={() => removeTable(table)}/>
            </div>
            <div className="tab-content">
                <ul>
                    {table.columns.map((column, idx) => (
                        <li key={idx} className="tab-column">
                            <strong>{column.name}</strong>: {column.type}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default TableTab;