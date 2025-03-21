const logToCSV = (data) => {
  const headers = Object.keys(data).join(",");
  const values = Object.values(data).join(",");
  const csvRow = `${values}\n`;

  // Write to localStorage or send it to a backend service
  const existingLog = localStorage.getItem("userLogs") || headers + "\n";
  localStorage.setItem("userLogs", existingLog + csvRow);
};

export default logToCSV;
