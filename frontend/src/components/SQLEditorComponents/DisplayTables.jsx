import "../../styles/DisplayTables.css";
import TableTab from "./TableTab";

const DisplayTables = ({ tableContent, removeTable }) => {
    return (
        <div className="display-table-container">
            <div className="pinned-tables-container">
                {
                    tableContent.length === 0 
                    ?
                    <h1>No tables pinned!</h1>
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