const tables = [
  {
    name: "Technician",
    columns: [
      { name: "tID", type: "INT" },
      { name: "firstName", type: "VARCHAR(50)" },
      { name: "lastName", type: "VARCHAR(50)" },
      { name: "startDate", type: "DATE" },
      { name: "endDate", type: "DATE" },
      { name: "trainingLevel", type: "VARCHAR(50)" },
    ],
  },
  {
    name: "Sample",
    columns: [
      { name: "patientID", type: "INT" },
      { name: "tID", type: "INT" },
      { name: "date", type: "DATE" },
      { name: "time", type: "TIME" },
    ],
  },
  {
    name: "TestType",
    columns: [
      { name: "testTypeID", type: "INT" },
      { name: "description", type: "VARCHAR(255)" },
    ],
  },
  {
    name: "Test",
    columns: [
      { name: "tID", type: "INT" },
      { name: "pID", type: "INT" },
      { name: "ttID", type: "INT" },
    ],
  },
  {
    name: "Patient",
    columns: [
      { name: "healthNum", type: "INT" },
      { name: "firstName", type: "VARCHAR(50)" },
      { name: "lastName", type: "VARCHAR(50)" },
      { name: "dateOfBirth", type: "DATE" },
      { name: "height", type: "INT" },
      { name: "weight", type: "INT" },
      { name: "address", type: "VARCHAR(255)" },
    ],
  },
  {
    name: "Medication",
    columns: [
      { name: "DIN", type: "INT" },
      { name: "name", type: "VARCHAR(100)" },
      { name: "manufacturer", type: "VARCHAR(100)" },
    ],
  },
  {
    name: "MedicationEquivalent",
    columns: [
      { name: "DIN1", type: "INT" },
      { name: "DIN2", type: "INT" },
    ],
  },
  {
    name: "Employee",
    columns: [
      { name: "ID", type: "INT" },
      { name: "firstName", type: "VARCHAR(50)" },
      { name: "lastName", type: "VARCHAR(50)" },
      { name: "dateOfBirth", type: "DATE" },
      { name: "startDate", type: "DATE" },
      { name: "endDate", type: "DATE" },
      { name: "salary", type: "DECIMAL(10, 2)" },
    ],
  },
  {
    name: "Doctor",
    columns: [
      { name: "eID", type: "INT" },
      { name: "graduatedFrom", type: "VARCHAR(100)" },
      { name: "specialty", type: "VARCHAR(100)" },
    ],
  },
  {
    name: "Prescription",
    columns: [
      { name: "pID", type: "INT" },
      { name: "DIN", type: "INT" },
      { name: "doctorID", type: "INT" },
      { name: "startDate", type: "DATE" },
      { name: "quantity", type: "INT" },
    ],
  },
  {
    name: "Admission",
    columns: [
      { name: "pID", type: "INT" },
      { name: "doctorID", type: "INT" },
      { name: "date", type: "DATE" },
      { name: "reason", type: "VARCHAR(255)" },
    ],
  },
];

export default tables;
