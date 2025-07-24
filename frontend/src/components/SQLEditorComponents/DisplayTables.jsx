import "../../styles/DisplayTables.css";
import TableTab from "./TableTab";

const DisplayTables = ({ tableContent, removeTable }) => {
    return (
        <div className="display-table-container">
            <div className="pinned-tables-container">
                {
                    tableContent.length === 0 
                    ?
                    <p className="no-tables-message">
                    No tables pinned. Click the 📌 icon beside any table on the left to pin it here.
                    </p>
                    :
                    tableContent.map((table, index) => {
                        return (
                            <TableTab key={index} table={table} removeTable={removeTable}/>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default DisplayTables;