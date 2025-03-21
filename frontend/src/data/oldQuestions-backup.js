// original questions (before the changes)
const questions = {
  easy: [
    {
      question:
        "Retrieve the full names (firstName, lastName), admission reason, and calculate BMI (weight in kg / (height in meters squared)) for all admitted patients sorted by admission date in descending order.",
      concepts: ["SELECT", "FROM", "JOIN", "ORDER BY", "AS"], // Concepts for S1
      columnNames: [
        "firstName",
        "lastName",
        "reason",
        "height",
        "weight",
        "date",
      ], // Columns for S1
      hints: {
        metaphor:
          "Think of JOIN as connecting two puzzle pieces (Patient and Admission tables). You need to specify how they fit together. ORDER BY is like arranging books on a shelf by date or name. You need to decide the order of your results.", // Hint for S2
        english:
          "Your query should retrieve the first and last names of all admitted patients, along with the reason for admission and their BMI. It should sort the results by admission date in descending order.", // Hint for S3
      },
      answer:
        "SELECT P.firstName, P.lastName, A.reason, (P.weight / ((P.height / 100) * (P.height / 100))) AS BMI FROM Patient P JOIN Admission A ON P.healthNum = A.pID ORDER BY A.date DESC;",
      difficulty: "easy",
      points: 20,
      expectedOutput: [
        { firstName: "John", lastName: "Doe", reason: "Fever", BMI: 22.3 },
        { firstName: "Alice", lastName: "Smith", reason: "Injury", BMI: 25.1 },
        {
          firstName: "Robert",
          lastName: "Brown",
          reason: "Surgery",
          BMI: 27.5,
        },
        { firstName: "David", lastName: "Lee", reason: "Asthma", BMI: 19.8 },
        {
          firstName: "Emma",
          lastName: "Johnson",
          reason: "Check-up",
          BMI: 23.4,
        },
      ],
    },
    {
      question:
        "Retrieve the full names (firstName, lastName), admission reason, and calculate BMI (weight in kg / (height in meters squared)) for all admitted patients sorted by admission date in descending order.",
      concepts: ["SELECT", "FROM", "JOIN", "ORDER BY", "AS"], // Concepts for S1
      columnNames: [
        "firstName",
        "lastName",
        "reason",
        "height",
        "weight",
        "date",
      ], // Columns for S1
      hints: {
        metaphor:
          "Think of JOIN as connecting two puzzle pieces (Patient and Admission tables). You need to specify how they fit together. ORDER BY is like arranging books on a shelf by date or name. You need to decide the order of your results.", // Hint for S2
        english:
          "Your query should retrieve the first and last names of all admitted patients, along with the reason for admission and their BMI. It should sort the results by admission date in descending order.", // Hint for S3
      },
      answer:
        "SELECT P.firstName, P.lastName, A.reason, (P.weight / ((P.height / 100) * (P.height / 100))) AS BMI FROM Patient P JOIN Admission A ON P.healthNum = A.pID ORDER BY A.date DESC;",
      difficulty: "easy",
      points: 20,
      expectedOutput: [
        { firstName: "John", lastName: "Doe", reason: "Fever", BMI: 22.3 },
        { firstName: "Alice", lastName: "Smith", reason: "Injury", BMI: 25.1 },
        {
          firstName: "Robert",
          lastName: "Brown",
          reason: "Surgery",
          BMI: 27.5,
        },
        { firstName: "David", lastName: "Lee", reason: "Asthma", BMI: 19.8 },
        {
          firstName: "Emma",
          lastName: "Johnson",
          reason: "Check-up",
          BMI: 23.4,
        },
      ],
    },
    {
      question:
        "Retrieve the full names (firstName, lastName), admission reason, and calculate BMI (weight in kg / (height in meters squared)) for all admitted patients sorted by admission date in descending order.",
      concepts: ["SELECT", "FROM", "JOIN", "ORDER BY", "AS"], // Concepts for S1
      columnNames: [
        "firstName",
        "lastName",
        "reason",
        "height",
        "weight",
        "date",
      ], // Columns for S1
      hints: {
        metaphor:
          "Think of JOIN as connecting two puzzle pieces (Patient and Admission tables). You need to specify how they fit together. ORDER BY is like arranging books on a shelf by date or name. You need to decide the order of your results.", // Hint for S2
        english:
          "Your query should retrieve the first and last names of all admitted patients, along with the reason for admission and their BMI. It should sort the results by admission date in descending order.", // Hint for S3
      },
      answer:
        "SELECT P.firstName, P.lastName, A.reason, (P.weight / ((P.height / 100) * (P.height / 100))) AS BMI FROM Patient P JOIN Admission A ON P.healthNum = A.pID ORDER BY A.date DESC;",
      difficulty: "easy",
      points: 20,
      expectedOutput: [
        { firstName: "John", lastName: "Doe", reason: "Fever", BMI: 22.3 },
        { firstName: "Alice", lastName: "Smith", reason: "Injury", BMI: 25.1 },
        {
          firstName: "Robert",
          lastName: "Brown",
          reason: "Surgery",
          BMI: 27.5,
        },
        { firstName: "David", lastName: "Lee", reason: "Asthma", BMI: 19.8 },
        {
          firstName: "Emma",
          lastName: "Johnson",
          reason: "Check-up",
          BMI: 23.4,
        },
      ],
    },
  ],
  medium: [
    {
      question:
        "Retrieve the firstName, lastName, and the total number of admissions for each patient.",
      concepts: ["SELECT", "FROM", "JOIN", "GROUP BY", "COUNT"], // Concepts for S1
      columnNames: ["firstName", "lastName", "admissions"], // Columns for S1
      hints: {
        metaphor:
          "Think of COUNT as tallying up the number of items in a list. GROUP BY organizes similar items into buckets before counting.",
        english:
          "Your query should retrieve the first and last names of patients, along with the total number of admissions for each patient. Use GROUP BY to group patients and COUNT to tally their admissions.",
      },
      answer:
        "SELECT P.firstName, P.lastName, COUNT(A.pID) AS admissions FROM Patient P JOIN Admission A ON P.healthNum = A.pID GROUP BY P.firstName, P.lastName;",
      difficulty: "medium",
      points: 30,
      expectedOutput: [
        { firstName: "John", lastName: "Doe", reason: "Fever", BMI: 22.3 },
        { firstName: "Alice", lastName: "Smith", reason: "Injury", BMI: 25.1 },
        {
          firstName: "Robert",
          lastName: "Brown",
          reason: "Surgery",
          BMI: 27.5,
        },
        { firstName: "David", lastName: "Lee", reason: "Asthma", BMI: 19.8 },
        {
          firstName: "Emma",
          lastName: "Johnson",
          reason: "Check-up",
          BMI: 23.4,
        },
      ],
    },
    {
      question:
        "Retrieve the firstName, lastName, and the total number of admissions for each patient.",
      concepts: ["SELECT", "FROM", "JOIN", "GROUP BY", "COUNT"], // Concepts for S1
      columnNames: ["firstName", "lastName", "admissions"], // Columns for S1
      hints: {
        metaphor:
          "Think of COUNT as tallying up the number of items in a list. GROUP BY organizes similar items into buckets before counting.",
        english:
          "Your query should retrieve the first and last names of patients, along with the total number of admissions for each patient. Use GROUP BY to group patients and COUNT to tally their admissions.",
      },
      answer:
        "SELECT P.firstName, P.lastName, COUNT(A.pID) AS admissions FROM Patient P JOIN Admission A ON P.healthNum = A.pID GROUP BY P.firstName, P.lastName;",
      difficulty: "medium",
      points: 30,
      expectedOutput: [
        { firstName: "John", lastName: "Doe", reason: "Fever", BMI: 22.3 },
        { firstName: "Alice", lastName: "Smith", reason: "Injury", BMI: 25.1 },
        {
          firstName: "Robert",
          lastName: "Brown",
          reason: "Surgery",
          BMI: 27.5,
        },
        { firstName: "David", lastName: "Lee", reason: "Asthma", BMI: 19.8 },
        {
          firstName: "Emma",
          lastName: "Johnson",
          reason: "Check-up",
          BMI: 23.4,
        },
      ],
    },
    {
      question:
        "Retrieve the firstName, lastName, and the total number of admissions for each patient.",
      concepts: ["SELECT", "FROM", "JOIN", "GROUP BY", "COUNT"], // Concepts for S1
      columnNames: ["firstName", "lastName", "admissions"], // Columns for S1
      hints: {
        metaphor:
          "Think of COUNT as tallying up the number of items in a list. GROUP BY organizes similar items into buckets before counting.",
        english:
          "Your query should retrieve the first and last names of patients, along with the total number of admissions for each patient. Use GROUP BY to group patients and COUNT to tally their admissions.",
      },
      answer:
        "SELECT P.firstName, P.lastName, COUNT(A.pID) AS admissions FROM Patient P JOIN Admission A ON P.healthNum = A.pID GROUP BY P.firstName, P.lastName;",
      difficulty: "medium",
      points: 30,
      expectedOutput: [
        { firstName: "John", lastName: "Doe", reason: "Fever", BMI: 22.3 },
        { firstName: "Alice", lastName: "Smith", reason: "Injury", BMI: 25.1 },
        {
          firstName: "Robert",
          lastName: "Brown",
          reason: "Surgery",
          BMI: 27.5,
        },
        { firstName: "David", lastName: "Lee", reason: "Asthma", BMI: 19.8 },
        {
          firstName: "Emma",
          lastName: "Johnson",
          reason: "Check-up",
          BMI: 23.4,
        },
      ],
    },
  ],
  hard: [
    {
      question:
        "Retrieve the firstName, lastName, and calculate the average BMI for each doctor’s patients.",
      concepts: ["SELECT", "FROM", "JOIN", "GROUP BY", "AVG", "AS"], // Concepts for S1
      columnNames: ["firstName", "lastName", "averageBMI"], // Columns for S1
      hints: {
        metaphor:
          "AVG is like finding the average score of a class. GROUP BY organizes patients by doctor, and AVG calculates the average BMI for each group.",
        english:
          "Your query should retrieve the first and last names of doctors, along with the average BMI of their patients. Use GROUP BY to group patients by their doctors and AVG to calculate the average BMI.",
      },
      answer:
        "SELECT D.firstName, D.lastName, AVG(P.weight / ((P.height / 100) * (P.height / 100))) AS averageBMI FROM Doctor D JOIN Admission A ON D.eID = A.doctorID JOIN Patient P ON A.pID = P.healthNum GROUP BY D.firstName, D.lastName;",
      difficulty: "hard",
      points: 50,
      expectedOutput: [
        { firstName: "John", lastName: "Doe", reason: "Fever", BMI: 22.3 },
        { firstName: "Alice", lastName: "Smith", reason: "Injury", BMI: 25.1 },
        {
          firstName: "Robert",
          lastName: "Brown",
          reason: "Surgery",
          BMI: 27.5,
        },
        { firstName: "David", lastName: "Lee", reason: "Asthma", BMI: 19.8 },
        {
          firstName: "Emma",
          lastName: "Johnson",
          reason: "Check-up",
          BMI: 23.4,
        },
      ],
    },
  ],
};

export default questions;
