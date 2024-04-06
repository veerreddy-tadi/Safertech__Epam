import React, { useState } from "react";
import "./App.css";

const students = [
  {
    id: 1,
    name: "Veer Reddy",
    ticketNumber: "CU123",
    ticketTopic: "CSC",
    examGrade: 4.5,
    ratingGrade: 3.8,
    comments: "Good effort",
  },
  {
    id: 2,
    name: "Ram Kumar",
    ticketNumber: "CU124",
    ticketTopic: "Epam",
    examGrade: 3.8,
    ratingGrade: 4.2,
    comments: "Excellent work",
  },
  {
    id: 3,
    name: "Raj kumar",
    ticketNumber: "CU125",
    ticketTopic: "ADC",
    examGrade: 4.2,
    ratingGrade: 3.5,
    comments: "Needs improvement",
  },
];

const App = () => {
  const [showStatistics, setShowStatistics] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [sortOrder, setSortOrder] = useState({ column: "id", ascending: true });
  const [displayOption, setDisplayOption] = useState("all");

  const toggleStatistics = () => {
    setShowStatistics(!showStatistics);
  };

  const handleRowClick = (index) => {
    setSelectedRow(index);
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSort = (column) => {
    if (sortOrder.column === column) {
      setSortOrder({ ...sortOrder, ascending: !sortOrder.ascending });
    } else {
      setSortOrder({ column, ascending: true });
    }
  };

  const handleDisplayOptionChange = (option) => {
    setDisplayOption(option);
  };

  const filteredStudents = students
    .filter((student) => {
      if (displayOption === "all") return true;
      const finalGrade = 0.6 * student.examGrade + 0.4 * student.ratingGrade;
      return (
        (displayOption === "passed" && finalGrade > 4) ||
        (displayOption === "failed" && finalGrade <= 4)
      );
    })
    .filter((student) =>
      student.name.toLowerCase().includes(filterText.toLowerCase())
    );

  const sortedStudents = filteredStudents.sort((a, b) => {
    const aValue =
      sortOrder.column === "name"
        ? a[sortOrder.column].toLowerCase()
        : sortOrder.column === "finalGrade"
        ? 0.6 * a.examGrade + 0.4 * a.ratingGrade
        : a[sortOrder.column];
    const bValue =
      sortOrder.column === "name"
        ? b[sortOrder.column].toLowerCase()
        : sortOrder.column === "finalGrade"
        ? 0.6 * b.examGrade + 0.4 * b.ratingGrade
        : b[sortOrder.column];
    return sortOrder.ascending
      ? typeof aValue === "string"
        ? aValue.localeCompare(bValue)
        : aValue > bValue
        ? 1
        : -1
      : typeof bValue === "string"
      ? bValue.localeCompare(aValue)
      : bValue > aValue
      ? 1
      : -1;
  });

  const totalStudents = students.length;
  const passedStudents = students.filter(
    (student) => 0.6 * student.examGrade + 0.4 * student.ratingGrade > 4
  ).length;
  const failedStudents = students.filter(
    (student) => 0.6 * student.examGrade + 0.4 * student.ratingGrade <= 4
  ).length;
  const averageGrade =
    students.reduce(
      (acc, student) =>
        acc + (0.6 * student.examGrade + 0.4 * student.ratingGrade),
      0
    ) / totalStudents;
  const maxGrade = Math.max(
    ...students.map(
      (student) => 0.6 * student.examGrade + 0.4 * student.ratingGrade
    )
  );
  const minGrade = Math.min(
    ...students.map(
      (student) => 0.6 * student.examGrade + 0.4 * student.ratingGrade
    )
  );

  return (
    <div className="App">
      <header>
        <h1>Gradebook Project</h1>
      </header>
      <main>
        <div className="options">
          <select onChange={(e) => handleDisplayOptionChange(e.target.value)}>
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>
          <input
            type="text"
            placeholder="Filter by name"
            value={filterText}
            onChange={handleFilterChange}
          />
          <button onClick={toggleStatistics}>
            {showStatistics ? "Hide Statistics" : "Show Statistics"}
          </button>
          <button onClick={() => handleSort("name")}>
            {sortOrder.column === "name"
              ? sortOrder.ascending
                ? "Sort by Name ↓"
                : "Sort by Name ↑"
              : "Sort by Name"}
          </button>
          <button onClick={() => handleSort("finalGrade")}>
            {sortOrder.column === "finalGrade"
              ? sortOrder.ascending
                ? "Sort by Final Grade ↓"
                : "Sort by Final Grade ↑"
              : "Sort by Final Grade"}
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>ID</th>
              <th onClick={() => handleSort("name")}>Name</th>
              <th onClick={() => handleSort("ticketNumber")}>Ticket Number</th>
              <th onClick={() => handleSort("ticketTopic")}>Ticket Topic</th>
              <th onClick={() => handleSort("examGrade")}>Exam Grade</th>
              <th onClick={() => handleSort("ratingGrade")}>Rating Grade</th>
              <th onClick={() => handleSort("finalGrade")}>Final Grade</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student, index) => (
              <tr
                key={student.id}
                onClick={() => handleRowClick(index)}
                className={selectedRow === index ? "selected" : ""}
              >
                <td>{student.id}</td>
                <td>
                  {selectedRow === index
                    ? student.name.toUpperCase()
                    : student.name}
                </td>
                <td>{student.ticketNumber}</td>
                <td>{student.ticketTopic}</td>
                <td>{student.examGrade}</td>
                <td>{student.ratingGrade}</td>
                <td>
                  {(
                    0.6 * student.examGrade +
                    0.4 * student.ratingGrade
                  ).toFixed(2)}
                </td>
                <td>{student.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      {showStatistics && (
        <aside className="statistics">
          <h2>Statistics</h2>
          <p>Total Students: {totalStudents}</p>
          <p>Passed Students: {passedStudents}</p>
          <p>Failed Students: {failedStudents}</p>
          <p>Average Grade: {averageGrade.toFixed(2)}</p>
          <p>Max Grade: {maxGrade.toFixed(2)}</p>
          <p>Min Grade: {minGrade.toFixed(2)}</p>
        </aside>
      )}
    </div>
  );
};

export default App;
