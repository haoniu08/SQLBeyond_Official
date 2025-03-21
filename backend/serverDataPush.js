const mysql = require("mysql2");
require("dotenv").config();

// Create a connection to the MySQL database using environment variables
const connection = mysql.createConnection(process.env.MYSQL_URL);

// Array of SQL commands as individual statements
const sqlCommands = [
  `CREATE TABLE IF NOT EXISTS Technician (
      tID INT PRIMARY KEY,
      firstName VARCHAR(50),
      lastName VARCHAR(50),
      startDate DATE,
      endDate DATE,
      trainingLevel VARCHAR(50)
  );`,

  `CREATE TABLE IF NOT EXISTS Patient (
      healthNum INT PRIMARY KEY,
      firstName VARCHAR(50),
      lastName VARCHAR(50),
      dateOfBirth DATE,
      height INT,
      weight INT,
      address VARCHAR(255)
  );`,

  `CREATE TABLE IF NOT EXISTS TestType (
      testTypeID INT PRIMARY KEY,
      description VARCHAR(255)
  );`,

  `CREATE TABLE IF NOT EXISTS Test (
      tID INT,
      pID INT,
      ttID INT,
      PRIMARY KEY (tID, pID, ttID),
      FOREIGN KEY (tID) REFERENCES Technician(tID),
      FOREIGN KEY (pID) REFERENCES Patient(healthNum),
      FOREIGN KEY (ttID) REFERENCES TestType(testTypeID)
  );`,

  `CREATE TABLE IF NOT EXISTS Sample (
      patientID INT,
      tID INT,
      date DATE,
      time TIME,
      PRIMARY KEY (patientID, tID, date, time),
      FOREIGN KEY (patientID) REFERENCES Patient(healthNum),
      FOREIGN KEY (tID) REFERENCES Technician(tID)
  );`,

  `CREATE TABLE IF NOT EXISTS Medication (
      DIN INT PRIMARY KEY,
      name VARCHAR(100),
      manufacturer VARCHAR(100)
  );`,

  `CREATE TABLE IF NOT EXISTS MedicationEquivalent (
      DIN1 INT,
      DIN2 INT,
      PRIMARY KEY (DIN1, DIN2),
      FOREIGN KEY (DIN1) REFERENCES Medication(DIN),
      FOREIGN KEY (DIN2) REFERENCES Medication(DIN)
  );`,

  `CREATE TABLE IF NOT EXISTS Employee (
      ID INT PRIMARY KEY,
      firstName VARCHAR(50),
      lastName VARCHAR(50),
      dateOfBirth DATE,
      startDate DATE,
      endDate DATE,
      salary DECIMAL(10, 2)
  );`,

  `CREATE TABLE IF NOT EXISTS Doctor (
      eID INT PRIMARY KEY,
      graduatedFrom VARCHAR(100),
      specialty VARCHAR(100),
      FOREIGN KEY (eID) REFERENCES Employee(ID)
  );`,

  `CREATE TABLE IF NOT EXISTS Prescription (
      pID INT,
      DIN INT,
      doctorID INT,
      startDate DATE,
      quantity INT,
      PRIMARY KEY (pID, DIN, doctorID, startDate),
      FOREIGN KEY (pID) REFERENCES Patient(healthNum),
      FOREIGN KEY (DIN) REFERENCES Medication(DIN),
      FOREIGN KEY (doctorID) REFERENCES Doctor(eID)
  );`,

  `CREATE TABLE IF NOT EXISTS Admission (
      pID INT,
      doctorID INT,
      date DATE,
      reason VARCHAR(255),
      PRIMARY KEY (pID, doctorID, date),
      FOREIGN KEY (pID) REFERENCES Patient(healthNum),
      FOREIGN KEY (doctorID) REFERENCES Doctor(eID)
  );`,

  // Sample data insertion commands
  `INSERT INTO Technician (tID, firstName, lastName, startDate, endDate, trainingLevel) VALUES
(1, 'Alice', 'Johnson', '2019-01-15', '2022-03-10', 'Advanced'),
(2, 'Bob', 'Smith', '2020-05-10', NULL, 'Intermediate'),
(3, 'Charlie', 'Brown', '2018-06-20', '2021-09-15', 'Advanced'),
(4, 'David', 'Jones', '2021-07-01', NULL, 'Beginner'),
(5, 'Eva', 'Miller', '2019-03-12', '2021-12-01', 'Intermediate'),
(6, 'Frank', 'Wilson', '2018-09-10', NULL, 'Advanced'),
(7, 'Grace', 'Taylor', '2020-01-05', NULL, 'Intermediate'),
(8, 'Helen', 'Anderson', '2019-11-15', '2021-04-20', 'Beginner'),
(9, 'Ian', 'Thomas', '2021-03-10', NULL, 'Advanced'),
(10, 'Jack', 'Martinez', '2018-04-15', '2021-06-18', 'Beginner'),
(11, 'Karen', 'Hernandez', '2019-05-19', NULL, 'Intermediate'),
(12, 'Leo', 'Moore', '2020-07-13', NULL, 'Advanced'),
(13, 'Mia', 'Martin', '2021-02-17', '2022-08-25', 'Beginner'),
(14, 'Nina', 'Garcia', '2018-08-22', NULL, 'Intermediate'),
(15, 'Oscar', 'Martinez', '2019-10-12', NULL, 'Advanced'),
(16, 'Paula', 'Davis', '2020-11-25', NULL, 'Beginner'),
(17, 'Quinn', 'Rodriguez', '2018-12-09', '2021-07-30', 'Intermediate'),
(18, 'Ruth', 'Martinez', '2019-07-08', '2021-02-15', 'Advanced'),
(19, 'Sam', 'Clark', '2020-09-18', NULL, 'Intermediate'),
(20, 'Tina', 'Lewis', '2018-11-28', NULL, 'Advanced'),
(21, 'Uma', 'Walker', '2019-06-10', NULL, 'Beginner'),
(22, 'Victor', 'Hall', '2021-08-02', NULL, 'Intermediate'),
(23, 'Wendy', 'Allen', '2020-10-30', NULL, 'Advanced'),
(24, 'Xander', 'Young', '2018-05-22', '2021-05-25', 'Intermediate'),
(25, 'Yara', 'King', '2019-04-20', '2022-01-05', 'Beginner'),
(26, 'Zane', 'Scott', '2020-12-14', NULL, 'Advanced'),
(27, 'Ann', 'Adams', '2019-03-17', NULL, 'Intermediate'),
(28, 'Ben', 'Baker', '2021-01-28', '2022-04-18', 'Beginner'),
(29, 'Cathy', 'Carter', '2018-07-15', NULL, 'Advanced'),
(30, 'Dan', 'Evans', '2020-02-14', '2021-11-11', 'Intermediate'),
(31, 'Ella', 'Flores', '2019-08-23', NULL, 'Advanced'),
(32, 'Finn', 'Collins', '2018-10-02', NULL, 'Beginner'),
(33, 'Gina', 'Green', '2020-09-07', NULL, 'Intermediate'),
(34, 'Harry', 'Cooper', '2019-02-25', NULL, 'Advanced'),
(35, 'Isla', 'Bell', '2021-05-11', NULL, 'Intermediate'),
(36, 'Jake', 'Russell', '2018-11-09', NULL, 'Beginner'),
(37, 'Kate', 'Griffin', '2020-12-15', NULL, 'Advanced'),
(38, 'Liam', 'Sanders', '2019-01-18', NULL, 'Intermediate'),
(39, 'Maya', 'Reed', '2020-06-20', NULL, 'Advanced'),
(40, 'Nora', 'Powell', '2019-03-25', NULL, 'Beginner'),
(41, 'Owen', 'Rogers', '2021-04-13', NULL, 'Intermediate'),
(42, 'Pia', 'Gray', '2018-06-16', '2021-03-21', 'Advanced'),
(43, 'Quentin', 'James', '2019-09-12', NULL, 'Intermediate'),
(44, 'Rachel', 'Howard', '2020-01-30', NULL, 'Advanced'),
(45, 'Simon', 'Foster', '2018-08-14', NULL, 'Intermediate'),
(46, 'Tara', 'Harrison', '2019-10-05', NULL, 'Beginner'),
(47, 'Umar', 'Cook', '2020-03-18', NULL, 'Intermediate'),
(48, 'Vera', 'Simmons', '2018-12-27', NULL, 'Advanced'),
(49, 'Will', 'Peterson', '2019-05-02', '2021-10-09', 'Intermediate'),
(50, 'Xenia', 'Long', '2020-08-10', NULL, 'Intermediate');`,

  `INSERT INTO Patient (healthNum, firstName, lastName, dateOfBirth, height, weight, address) VALUES
(101, 'John', 'Doe', '1985-06-15', 180, 75, '123 Elm St.'),
(102, 'Jane', 'Smith', '1990-04-22', 165, 65, '456 Maple Ave.'),
(103, 'Alice', 'Johnson', '1978-03-12', 170, 70, '789 Oak St.'),
(104, 'Mark', 'Brown', '1992-08-05', 185, 80, '321 Pine St.'),
(105, 'Sarah', 'Lee', '1987-12-10', 160, 55, '654 Cedar Ln.'),
(106, 'Paul', 'Taylor', '1995-09-18', 172, 68, '987 Birch St.'),
(107, 'Laura', 'Davis', '1982-03-23', 158, 52, '212 Maplewood Ave.'),
(108, 'Tom', 'Evans', '1991-11-12', 175, 72, '314 Walnut St.'),
(109, 'Emma', 'Green', '1993-04-06', 168, 60, '158 Cherry Rd.'),
(110, 'Daniel', 'Scott', '1986-02-17', 182, 78, '410 Elm St.'),
(111, 'Sophia', 'Wright', '1994-07-30', 162, 56, '305 Oak Dr.'),
(112, 'Chris', 'Walker', '1983-10-22', 178, 74, '215 Pine Ave.'),
(113, 'Hannah', 'Roberts', '1989-01-13', 163, 57, '519 Cedar Rd.'),
(114, 'Ryan', 'Baker', '1996-08-19', 169, 61, '623 Maple Ln.'),
(115, 'Olivia', 'Adams', '1981-05-04', 155, 50, '712 Birch Dr.'),
(116, 'Ethan', 'Nelson', '1992-03-29', 183, 79, '413 Elmwood Ave.'),
(117, 'Mia', 'Carter', '1988-12-07', 161, 54, '910 Oakwood St.'),
(118, 'Jack', 'Mitchell', '1984-09-16', 176, 70, '818 Pinewood Ave.'),
(119, 'Amelia', 'Perez', '1995-06-21', 164, 58, '202 Cherry Ln.'),
(120, 'Lucas', 'Young', '1980-11-14', 180, 73, '509 Walnut Dr.'),
(121, 'Ella', 'King', '1987-02-24', 159, 53, '115 Maplewood Ln.'),
(122, 'James', 'Hall', '1991-04-17', 171, 65, '712 Cedar Ave.'),
(123, 'Ava', 'Rivera', '1993-07-25', 167, 59, '610 Birch St.'),
(124, 'Michael', 'Lewis', '1986-10-18', 179, 76, '103 Oakwood Ave.'),
(125, 'Emily', 'Hill', '1990-12-09', 160, 55, '214 Pine Ln.'),
(126, 'Benjamin', 'Clark', '1985-05-22', 184, 77, '417 Maple Ave.'),
(127, 'Lily', 'Hernandez', '1988-09-01', 165, 63, '308 Elmwood Ln.'),
(128, 'Jacob', 'Lopez', '1992-02-16', 177, 69, '506 Oak St.'),
(129, 'Zoe', 'Garcia', '1983-08-11', 162, 57, '219 Cedar Ln.'),
(130, 'William', 'Martinez', '1996-11-30', 175, 71, '327 Birch Ave.'),
(131, 'Avery', 'Anderson', '1984-04-10', 158, 51, '715 Cherry Dr.'),
(132, 'Mason', 'Thomas', '1987-01-28', 181, 74, '624 Walnut Ln.'),
(133, 'Isabella', 'Moore', '1993-06-15', 166, 60, '113 Maple Ave.'),
(134, 'Logan', 'Jackson', '1982-07-20', 168, 64, '914 Pine St.'),
(135, 'Sophie', 'White', '1989-10-03', 159, 52, '721 Cedar Dr.'),
(136, 'Nathan', 'Harris', '1991-12-05', 173, 67, '408 Birch Ln.'),
(137, 'Chloe', 'Martin', '1985-03-07', 157, 54, '209 Elm Ave.'),
(138, 'Liam', 'Thompson', '1994-08-16', 178, 71, '310 Maple Ln.'),
(139, 'Grace', 'Garcia', '1986-09-25', 163, 56, '115 Cherry Ln.'),
(140, 'Noah', 'Martinez', '1990-05-19', 180, 75, '712 Walnut Ave.'),
(141, 'Abigail', 'Brown', '1987-12-02', 161, 53, '218 Pinewood Ln.'),
(142, 'Joshua', 'Jones', '1983-11-17', 176, 69, '614 Oak Ln.'),
(143, 'Samantha', 'Taylor', '1995-06-12', 164, 60, '910 Cedar Ave.'),
(144, 'Alexander', 'Lee', '1989-03-14', 182, 76, '109 Birchwood Dr.'),
(145, 'Brianna', 'Harris', '1984-07-09', 168, 61, '710 Maplewood Ln.'),
(146, 'David', 'Clark', '1991-01-25', 179, 73, '307 Oakwood Ave.'),
(147, 'Natalie', 'Adams', '1988-02-11', 162, 55, '215 Pinewood Ave.'),
(148, 'Henry', 'Wilson', '1993-04-06', 170, 65, '409 Cherrywood St.'),
(149, 'Victoria', 'Miller', '1986-06-23', 158, 52, '813 Walnutwood Ln.'),
(150, 'Jackson', 'Davis', '1987-08-30', 182, 78, '703 Lakeview Dr.');`,

  `INSERT INTO TestType (testTypeID, description) VALUES
(1, 'Blood Test'),
(2, 'X-Ray'),
(3, 'MRI Scan'),
(4, 'Ultrasound'),
(5, 'Urine Test'),
(6, 'CT Scan'),
(7, 'Blood Pressure Check'),
(8, 'Electrocardiogram (ECG)'),
(9, 'Stress Test'),
(10, 'Liver Function Test'),
(11, 'Kidney Function Test'),
(12, 'Lipid Panel'),
(13, 'Complete Blood Count (CBC)'),
(14, 'Thyroid Function Test'),
(15, 'Diabetes Screening'),
(16, 'Bone Density Test'),
(17, 'Allergy Test'),
(18, 'Genetic Test'),
(19, 'Pulmonary Function Test'),
(20, 'Hearing Test'),
(21, 'Vision Test'),
(22, 'Physical Fitness Test'),
(23, 'HIV Test'),
(24, 'Pregnancy Test'),
(25, 'Hemoglobin Test'),
(26, 'Creatinine Test'),
(27, 'Prostate-Specific Antigen (PSA) Test'),
(28, 'Stool Test'),
(29, 'Heart Rate Monitoring'),
(30, 'Lactate Dehydrogenase (LDH) Test'),
(31, 'Calcium Test'),
(32, 'Iron Test'),
(33, 'B12 Test'),
(34, 'Vitamin D Test'),
(35, 'Testosterone Test'),
(36, 'Cortisol Test'),
(37, 'Insulin Test'),
(38, 'Blood Culture'),
(39, 'Fecal Occult Blood Test'),
(40, 'Pap Smear'),
(41, 'Mammogram'),
(42, 'PET Scan'),
(43, 'Brain Function Test'),
(44, 'Lung Function Test'),
(45, 'Cardiac Enzyme Test'),
(46, 'Blood Sugar Test'),
(47, 'Hormone Test'),
(48, 'C-Reactive Protein (CRP) Test'),
(49, 'Antibody Test'),
(50, 'COVID-19 Test');`,

  `INSERT INTO Test (tID, pID, ttID) VALUES
(1, 101, 1),
(2, 102, 2),
(3, 103, 3),
(4, 104, 4),
(5, 105, 5),
(6, 106, 6),
(7, 107, 7),
(8, 108, 8),
(9, 109, 9),
(10, 110, 10),
(1, 111, 11),
(2, 112, 12),
(3, 113, 13),
(4, 114, 14),
(5, 115, 15),
(6, 116, 16),
(7, 117, 17),
(8, 118, 18),
(9, 119, 19),
(10, 120, 20),
(1, 121, 21),
(2, 122, 22),
(3, 123, 23),
(4, 124, 24),
(5, 125, 25),
(6, 126, 26),
(7, 127, 27),
(8, 128, 28),
(9, 129, 29),
(10, 130, 30),
(1, 131, 31),
(2, 132, 32),
(3, 133, 33),
(4, 134, 34),
(5, 135, 35),
(6, 136, 36),
(7, 137, 37),
(8, 138, 38),
(9, 139, 39),
(10, 140, 40),
(1, 141, 41),
(2, 142, 42),
(3, 143, 43),
(4, 144, 44),
(5, 145, 45),
(6, 146, 46),
(7, 147, 47),
(8, 148, 48),
(9, 149, 49),
(10, 150, 50);`,

  `INSERT INTO Sample (patientID, tID, date, time) VALUES
(101, 1, '2023-03-01', '10:00:00'),
(102, 2, '2023-03-01', '11:00:00'),
(103, 3, '2023-03-01', '09:00:00'),
(104, 1, '2023-03-01', '14:00:00'),
(105, 2, '2023-03-02', '08:30:00'),
(106, 3, '2023-04-15', '13:45:00'),
(107, 4, '2023-05-22', '15:00:00'),
(108, 5, '2023-06-11', '16:30:00'),
(109, 6, '2023-07-04', '09:15:00'),
(110, 1, '2023-08-18', '10:45:00');`,
  `INSERT INTO Medication (DIN, name, manufacturer) VALUES
(201, 'Aspirin', 'PharmaCorp'),
(202, 'Ibuprofen', 'HealthMed'),
(203, 'Acetaminophen', 'MedLife'),
(204, 'Antihistamine', 'CarePlus'),
(205, 'Cough Syrup', 'PharmaCorp'),
(206, 'Amoxicillin', 'HealthMed');`,
  `INSERT INTO MedicationEquivalent (DIN1, DIN2) VALUES
(201, 202),
(202, 203),
(203, 204),
(204, 205),
(205, 206);`,
  `INSERT INTO Employee (ID, firstName, lastName, dateOfBirth, startDate, endDate, salary) VALUES
(1, 'Mark', 'Taylor', '1975-02-20', '2010-04-12', NULL, 80000),
(2, 'Sara', 'Lee', '1983-11-15', '2012-09-09', NULL, 85000),
(3, 'Emily', 'Clark', '1992-01-30', '2015-06-23', NULL, 78000),
(4, 'James', 'Wilson', '1980-06-04', '2018-02-18', NULL, 95000),
(5, 'Susan', 'Martin', '1987-07-21', '2016-03-19', NULL, 82000),
(6, 'Michael', 'Brown', '1990-09-25', '2019-01-15', NULL, 88000);`,
  `INSERT INTO Doctor (eID, graduatedFrom, specialty) VALUES
(1, 'Harvard Medical School', 'Cardiology'),
(2, 'Stanford Medical School', 'Neurology'),
(3, 'Johns Hopkins University', 'Orthopedics'),
(4, 'UCLA Medical School', 'Pediatrics'),
(5, 'Yale Medical School', 'Surgery'),
(6, 'Columbia University', 'Oncology');`,
  `INSERT INTO Prescription (pID, DIN, doctorID, startDate, quantity) VALUES
(101, 201, 1, '2023-02-10', 30),
(102, 202, 2, '2023-03-01', 15),
(103, 203, 3, '2023-04-15', 20),
(104, 204, 4, '2023-05-20', 25),
(105, 205, 5, '2023-06-12', 10),
(106, 206, 6, '2023-07-18', 50),
(107, 201, 1, '2023-08-05', 30),
(108, 202, 2, '2023-09-03', 15),
(109, 203, 3, '2023-10-20', 20),
(110, 204, 4, '2023-11-25', 25);`,
  `INSERT INTO Admission (pID, doctorID, date, reason) VALUES
(101, 1, '2023-01-10', 'Routine Checkup'),
(102, 2, '2023-02-15', 'Severe Headache'),
(103, 3, '2023-03-10', 'Back Pain'),
(104, 4, '2023-04-05', 'Annual Physical'),
(105, 5, '2023-05-12', 'Appendicitis'),
(106, 6, '2023-06-17', 'Cancer Screening'),
(107, 1, '2023-07-20', 'Chest Pain'),
(108, 2, '2023-08-22', 'Migraine'),
(109, 3, '2023-09-28', 'Fracture'),
(110, 4, '2023-10-14', 'Flu Symptoms');`,

  // Add additional INSERT commands for other tables as needed
];

// Connect to the database and execute each SQL command individually
connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database.");

  // Execute each command in the sqlCommands array individually
  sqlCommands.forEach((command, index) => {
    connection.query(command, (err, results) => {
      if (err) {
        console.error(`Error executing SQL command ${index + 1}:`, err);
      } else {
        console.log(`SQL command ${index + 1} executed successfully.`);
      }
    });
  });

  // Close the connection after all commands are executed
  connection.end(() => {
    console.log("Database setup completed.");
  });
});
