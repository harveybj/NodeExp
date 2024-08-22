const Employee = require("../model/employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(204).json({ message: "No employees found" });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  if (!req?.body?.firstName || !req?.body?.lastName || !req?.body?.email) {
    return res
      .status(400)
      .json({ message: "First and Last name are required" });
  }

  try {
    const result = await Employee.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create employee" });
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: `Employee ID is required.` });
  }

  try {
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
      return res
        .status(400)
        .json({ message: `Employee ID ${req.body.id} not found` });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  if (req.body?.firstName) employee.firstname = req.body.firstName;
  if (req.body?.lastName) employee.lastname = req.body.lastName;
  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: `Employee ID is required` });
  }

  try {
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
      return res
        .status(400)
        .json({ message: `Employee ID ${req.body.id} not found` });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

//get single employee. Added the try catch block to handle the error related to the Mongo ID.
const getEmployee = async (req, res) => {
  if (req?.params?.id) {
    try {
      const employees = await Employee.find({ _id: req.params.id }).exec();
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  } else {
    return res.status(400).json({ message: `Employee ID requried.` });
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  res.json(employee);

};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
