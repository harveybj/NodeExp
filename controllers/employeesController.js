const data = {
  employees: require("../model/employee.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};
const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstName,
    lastname: req.body.lastName
  };
  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ message: "First and Last names are required" });
  }
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id));
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  if (req.body.firstName) employee.firstname = req.body.firstName;
  if (req.body.lastName) employee.lastname = req.body.lastName;
  const filteredArray = data.employees.filter((emp) => emp.id !== parseInt(req.body.id));
  const unsortedArray = [...filteredArray, employee];
  data.setEmployees(
    unsortedArray.sort((a, b) => a.id > b.id ? 1 : -1)
  );
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id));
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  const filteredArray = data.employees.filter((emp) => emp.id !== parseInt(req.body.id));
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id));
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  res.json(employee); 
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
