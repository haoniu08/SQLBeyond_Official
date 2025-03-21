const questions = {
  easy: [
    {
      question:
        "List all technicians ordered by their endDate in descending order.",
      answer: "SELECT * FROM Technician ORDER BY endDate DESC;",
      difficulty: "easy",
      concepts: ["ORDER BY"],
      columnNames: ["*"],
      points: 20,
    },
    {
      question: "Retrieve all technicians with trainingLevel 'Advanced'.",
      answer: "SELECT * FROM Technician WHERE trainingLevel = 'Advanced';",
      difficulty: "easy",
      concepts: ["SELECT", "WHERE"],
      columnNames: ["*"],
      points: 20,
    },
    {
      question: "Retrieve all doctors who specialize in 'Cardiology'.",
      answer: "SELECT * FROM Doctor WHERE specialty = 'Cardiology';",
      difficulty: "easy",
      concepts: ["SELECT", "WHERE"],
      columnNames: ["specialty"], // <--- ADDED
      hints: {}, // <--- ADDED (optional)
      points: 20,
    },
    {
      question:
        "List all employees ordered by their salary in descending order.",
      answer: "SELECT * FROM Employee ORDER BY salary DESC;",
      difficulty: "easy",
      concepts: ["ORDER BY"],
      columnNames: ["salary"], // <--- ADDED
      hints: {},
      points: 20,
    },
    {
      question: "Find all unique training levels of technicians.",
      answer: "SELECT DISTINCT trainingLevel FROM Technician;",
      difficulty: "easy",
      concepts: ["DISTINCT"],
      columnNames: ["trainingLevel"], // <--- ADDED
      hints: {},
      points: 20,
    },
    {
      question: "Find all patients whose first names contain 'an'.",
      answer: "SELECT * FROM Patient WHERE firstName LIKE '%an%';",
      difficulty: "easy",
      concepts: ["LIKE"],
      columnNames: ["firstName"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question: "Retrieve all employees who earn exactly 50,000.",
      answer: "SELECT * FROM Employee WHERE salary = 50000;",
      difficulty: "easy",
      concepts: ["WHERE"],
      columnNames: ["salary"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question:
        "Find all employees who have not been assigned an end date (i.e., currently employed).",
      answer: "SELECT * FROM Employee WHERE endDate IS NULL;",
      difficulty: "easy",
      concepts: ["IS NULL"],
      columnNames: ["endDate"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all medications manufactured by 'Pfizer' or 'Moderna'.",
      answer:
        "SELECT * FROM Medication WHERE manufacturer IN ('Pfizer', 'Moderna');",
      difficulty: "easy",
      concepts: ["IN"],
      columnNames: ["manufacturer"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question: "Find all medications not manufactured by 'Johnson & Johnson'.",
      answer:
        "SELECT * FROM Medication WHERE manufacturer NOT IN ('Johnson & Johnson');",
      difficulty: "easy",
      concepts: ["NOT IN"],
      columnNames: ["manufacturer"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question: "Get the total number of technicians.",
      answer: "SELECT COUNT(*) FROM Technician;",
      difficulty: "easy",
      concepts: ["COUNT()"],
      columnNames: [], // No specific columns used
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question: "Find the highest salary among employees.",
      answer: "SELECT MAX(salary) FROM Employee;",
      difficulty: "easy",
      concepts: ["MAX()"],
      columnNames: ["salary"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question: "Retrieve the lowest medication DIN number.",
      answer: "SELECT MIN(DIN) FROM Medication;",
      difficulty: "easy",
      concepts: ["MIN()"],
      columnNames: ["DIN"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question:
        "Find all technicians whose training level is not recorded (NULL).",
      answer: "SELECT * FROM Technician WHERE trainingLevel IS NULL;",
      difficulty: "easy",
      concepts: ["IS NULL"],
      columnNames: ["trainingLevel"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question:
        "Get all technician IDs and the count of distinct test types they have performed.",
      answer: "SELECT tID, COUNT(DISTINCT ttID) FROM Test GROUP BY tID;",
      difficulty: "easy",
      concepts: ["GROUP BY", "COUNT()", "DISTINCT"],
      columnNames: ["tID", "ttID"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question:
        "Find the total number of distinct manufacturers in the Medication table.",
      answer: "SELECT COUNT(DISTINCT manufacturer) FROM Medication;",
      difficulty: "easy",
      concepts: ["COUNT()", "DISTINCT"],
      columnNames: ["manufacturer"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question: "List all patients along with their weight in ascending order.",
      answer: "SELECT * FROM Patient ORDER BY weight ASC;",
      difficulty: "easy",
      concepts: ["ORDER BY"],
      columnNames: ["weight"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
  ],
  medium: [
    {
      question: "Retrieve the average salary of all employees.",
      answer: "SELECT AVG(salary) FROM Employee;",
      difficulty: "medium",
      concepts: ["AVG()"],
      columnNames: ["salary"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question: "List all medications and their count grouped by manufacturer.",
      answer:
        "SELECT manufacturer, COUNT(*) FROM Medication GROUP BY manufacturer;",
      difficulty: "medium",
      concepts: ["GROUP BY", "COUNT()"],
      columnNames: ["manufacturer"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question: "Find manufacturers who have produced more than 2 medications.",
      answer:
        "SELECT manufacturer, COUNT(*) FROM Medication GROUP BY manufacturer HAVING COUNT(*) > 2;",
      difficulty: "medium",
      concepts: ["GROUP BY", "HAVING"],
      columnNames: ["manufacturer"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all employees whose salary is greater than the average salary.",
      answer:
        "SELECT * FROM Employee WHERE salary > (SELECT AVG(salary) FROM Employee);",
      difficulty: "medium",
      concepts: ["AVG()", "WHERE", "Subquery"],
      columnNames: ["salary"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "Find technicians who are at training level 'Advanced' or 'Expert'.",
      answer:
        "SELECT * FROM Technician WHERE trainingLevel IN ('Advanced', 'Expert');",
      difficulty: "medium",
      concepts: ["IN"],
      columnNames: ["trainingLevel"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "Find all technicians who are not at training level 'Beginner'.",
      answer:
        "SELECT * FROM Technician WHERE trainingLevel NOT IN ('Beginner');",
      difficulty: "medium",
      concepts: ["NOT IN"],
      columnNames: ["trainingLevel"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question: "Retrieve all employees whose last name contains 'son'.",
      answer: "SELECT * FROM Employee WHERE lastName LIKE '%son%';",
      difficulty: "medium",
      concepts: ["LIKE"],
      columnNames: ["lastName"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all medications where the manufacturer does not contain 'Pharma'.",
      answer:
        "SELECT * FROM Medication WHERE manufacturer NOT LIKE '%Pharma%';",
      difficulty: "medium",
      concepts: ["NOT LIKE"],
      columnNames: ["manufacturer"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question: "Retrieve all doctors and employees (with a valid doctor ID).",
      answer:
        "SELECT e.ID, e.firstName, e.lastName, d.specialty FROM Employee e INNER JOIN Doctor d ON e.ID = d.eID;",
      difficulty: "medium",
      concepts: ["INNER JOIN"],
      columnNames: ["ID", "firstName", "lastName", "specialty", "eID"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "Find all employees and doctors, even if they do not have a matching entry in either table.",
      answer: `SELECT e.ID, e.firstName, e.lastName, d.specialty 
               FROM Employee e LEFT JOIN Doctor d ON e.ID = d.eID 
               UNION 
               SELECT e.ID, e.firstName, e.lastName, d.specialty 
               FROM Employee e RIGHT JOIN Doctor d ON e.ID = d.eID;`,
      difficulty: "medium",
      concepts: ["UNION", "OUTER JOINS"],
      columnNames: ["ID", "firstName", "lastName", "specialty", "eID"],
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question: "Find all technicians who have performed at least one test.",
      answer: "SELECT DISTINCT tID FROM Test;",
      difficulty: "medium",
      concepts: ["DISTINCT"],
      columnNames: ["tID"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question: "Retrieve all patients who have never been admitted.",
      answer:
        "SELECT * FROM Patient WHERE NOT EXISTS (SELECT 1 FROM Admission WHERE Admission.pID = Patient.healthNum);",
      difficulty: "medium",
      concepts: ["NOT EXISTS"],
      columnNames: ["healthNum"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question: "Find all technicians who have conducted at least one test.",
      answer:
        "SELECT * FROM Technician WHERE EXISTS (SELECT 1 FROM Test WHERE Test.tID = Technician.tID);",
      difficulty: "medium",
      concepts: ["EXISTS"],
      columnNames: ["tID"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "Find all employees whose salaries are greater than any technician's salary.",
      answer:
        "SELECT * FROM Employee WHERE salary > ANY (SELECT salary FROM Employee WHERE ID IN (SELECT tID FROM Technician));",
      difficulty: "medium",
      concepts: ["ANY", "Subquery"],
      columnNames: ["salary"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all employees whose salaries are greater than all technician salaries.",
      answer:
        "SELECT * FROM Employee WHERE salary > ALL (SELECT salary FROM Employee WHERE ID IN (SELECT tID FROM Technician));",
      difficulty: "medium",
      concepts: ["ALL", "Subquery"],
      columnNames: ["salary"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all test types along with their descriptions, sorted alphabetically.",
      answer: "SELECT * FROM TestType ORDER BY description ASC;",
      difficulty: "medium",
      concepts: ["ORDER BY"],
      columnNames: ["description"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "List all technicians who are assigned tests but do not appear in the Sample table.",
      answer: "SELECT tID FROM Test EXCEPT SELECT tID FROM Sample;",
      difficulty: "medium",
      concepts: ["EXCEPT"],
      columnNames: ["tID"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "Find the total number of technicians who have performed tests, grouped by test type.",
      answer: "SELECT ttID, COUNT(DISTINCT tID) FROM Test GROUP BY ttID;",
      difficulty: "medium",
      concepts: ["GROUP BY", "COUNT()", "DISTINCT"],
      columnNames: ["ttID", "tID"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve the total number of different medications prescribed.",
      answer: "SELECT COUNT(DISTINCT DIN) FROM Prescription;",
      difficulty: "medium",
      concepts: ["COUNT()", "DISTINCT"],
      columnNames: ["DIN"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all patients who have received every type of test available.",
      answer:
        "SELECT pID FROM Test GROUP BY pID HAVING COUNT(DISTINCT ttID) = (SELECT COUNT(*) FROM TestType);",
      difficulty: "medium",
      concepts: ["GROUP BY", "HAVING"],
      columnNames: ["pID", "ttID"], // <--- ADDED
      hints: {},
      points: 30,
      expectedOutput: [],
    },
  ],
  hard: [
    {
      question:
        "Find all employees who earn more than the average salary of all doctors.",
      answer:
        "SELECT * FROM Employee WHERE salary > (SELECT AVG(salary) FROM Employee WHERE ID IN (SELECT eID FROM Doctor));",
      difficulty: "hard",
      concepts: ["Subquery", "AVG()", "WHERE"],
      columnNames: ["salary", "ID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all employees who do not have a matching entry in the Doctor or Technician tables.",
      answer:
        "SELECT * FROM Employee WHERE ID NOT IN (SELECT eID FROM Doctor UNION SELECT tID FROM Technician);",
      difficulty: "hard",
      concepts: ["NOT IN", "UNION"],
      columnNames: ["ID", "eID", "tID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question: "Find the top 3 highest-paid employees.",
      answer: "SELECT * FROM Employee ORDER BY salary DESC LIMIT 3;",
      difficulty: "hard",
      concepts: ["ORDER BY", "LIMIT"],
      columnNames: ["salary"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question: "Retrieve the third highest salary among all employees.",
      answer:
        "SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 2;",
      difficulty: "hard",
      concepts: ["ORDER BY", "LIMIT", "OFFSET"],
      columnNames: ["salary"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question: "Find the doctor(s) with the most admissions.",
      answer: `SELECT doctorID, COUNT(*) AS admission_count 
               FROM Admission 
               GROUP BY doctorID 
               HAVING COUNT(*) = (SELECT MAX(count) 
                                  FROM (SELECT COUNT(*) AS count FROM Admission GROUP BY doctorID) AS subquery);`,
      difficulty: "hard",
      concepts: ["GROUP BY", "HAVING", "Subquery"],
      columnNames: ["doctorID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all patients who have been prescribed every available medication.",
      answer:
        "SELECT pID FROM Prescription GROUP BY pID HAVING COUNT(DISTINCT DIN) = (SELECT COUNT(*) FROM Medication);",
      difficulty: "hard",
      concepts: ["GROUP BY", "HAVING", "COUNT()", "DISTINCT", "Subquery"],
      columnNames: ["pID", "DIN"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question:
        "Find all technicians who have conducted more tests than the average number of tests conducted by all technicians.",
      answer: `SELECT tID 
               FROM Test 
               GROUP BY tID 
               HAVING COUNT(*) > (SELECT AVG(test_count) 
                                  FROM (SELECT tID, COUNT(*) AS test_count FROM Test GROUP BY tID) AS subquery);`,
      difficulty: "hard",
      concepts: ["GROUP BY", "HAVING", "Subquery", "AVG()"],
      columnNames: ["tID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all patients who have not been prescribed any medications.",
      answer:
        "SELECT * FROM Patient WHERE NOT EXISTS (SELECT 1 FROM Prescription WHERE Prescription.pID = Patient.healthNum);",
      difficulty: "hard",
      concepts: ["NOT EXISTS", "Subquery"],
      columnNames: ["healthNum"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question: "Find all medications that have not been prescribed yet.",
      answer:
        "SELECT * FROM Medication WHERE NOT EXISTS (SELECT 1 FROM Prescription WHERE Prescription.DIN = Medication.DIN);",
      difficulty: "hard",
      concepts: ["NOT EXISTS", "Subquery"],
      columnNames: ["DIN"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question: "Retrieve all doctors who have never admitted a patient.",
      answer:
        "SELECT * FROM Doctor WHERE NOT EXISTS (SELECT 1 FROM Admission WHERE Admission.doctorID = Doctor.eID);",
      difficulty: "hard",
      concepts: ["NOT EXISTS", "Subquery"],
      columnNames: ["doctorID", "eID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question: "Find the most frequently prescribed medication.",
      answer:
        "SELECT DIN, COUNT(*) AS prescription_count FROM Prescription GROUP BY DIN ORDER BY COUNT(*) DESC LIMIT 1;",
      difficulty: "hard",
      concepts: ["GROUP BY", "ORDER BY", "LIMIT"],
      columnNames: ["DIN"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all employees whose salary is greater than at least one doctor’s salary.",
      answer:
        "SELECT * FROM Employee WHERE salary > ANY (SELECT salary FROM Employee WHERE ID IN (SELECT eID FROM Doctor));",
      difficulty: "hard",
      concepts: ["ANY", "Subquery"],
      columnNames: ["salary", "ID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all employees whose salary is greater than all doctors' salaries.",
      answer:
        "SELECT * FROM Employee WHERE salary > ALL (SELECT salary FROM Employee WHERE ID IN (SELECT eID FROM Doctor));",
      difficulty: "hard",
      concepts: ["ALL", "Subquery"],
      columnNames: ["salary", "ID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question: "Retrieve technicians who only perform one type of test.",
      answer:
        "SELECT tID FROM Test GROUP BY tID HAVING COUNT(DISTINCT ttID) = 1;",
      difficulty: "hard",
      concepts: ["GROUP BY", "HAVING", "DISTINCT"],
      columnNames: ["tID", "ttID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question:
        "Find the total number of technicians who have never conducted a test.",
      answer:
        "SELECT COUNT(*) FROM Technician WHERE NOT EXISTS (SELECT 1 FROM Test WHERE Test.tID = Technician.tID);",
      difficulty: "hard",
      concepts: ["COUNT()", "NOT EXISTS"],
      columnNames: ["tID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all employees who have the same salary as at least one other employee.",
      answer:
        "SELECT * FROM Employee WHERE salary IN (SELECT salary FROM Employee GROUP BY salary HAVING COUNT(*) > 1);",
      difficulty: "hard",
      concepts: ["IN", "Subquery", "HAVING"],
      columnNames: ["salary"], // <--- ADDED
      hints: {},
      points: 20,
      expectedOutput: [],
    },
    {
      question: "Retrieve all test types that every technician has performed.",
      answer:
        "SELECT ttID FROM Test GROUP BY ttID HAVING COUNT(DISTINCT tID) = (SELECT COUNT(*) FROM Technician);",
      difficulty: "hard",
      concepts: ["GROUP BY", "HAVING", "Subquery", "COUNT()"],
      columnNames: ["ttID", "tID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all patients who have been prescribed at least two different medications.",
      answer:
        "SELECT pID FROM Prescription GROUP BY pID HAVING COUNT(DISTINCT DIN) >= 2;",
      difficulty: "hard",
      concepts: ["GROUP BY", "HAVING", "COUNT()", "DISTINCT"],
      columnNames: ["pID", "DIN"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all technicians who only conducted tests for a single patient.",
      answer:
        "SELECT tID FROM Test GROUP BY tID HAVING COUNT(DISTINCT pID) = 1;",
      difficulty: "hard",
      concepts: ["GROUP BY", "HAVING", "DISTINCT"],
      columnNames: ["tID", "pID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
    {
      question:
        "Find the total number of distinct patients each doctor has admitted.",
      answer:
        "SELECT doctorID, COUNT(DISTINCT pID) FROM Admission GROUP BY doctorID;",
      difficulty: "hard",
      concepts: ["GROUP BY", "COUNT()", "DISTINCT"],
      columnNames: ["doctorID", "pID"], // <--- ADDED
      hints: {},
      points: 40,
      expectedOutput: [],
    },
  ],
};

export default questions;
