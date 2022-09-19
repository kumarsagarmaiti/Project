const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");
const isValidEmail = function (data) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(data);
};
const isMobileNumber = function (data) {
  const mobileRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return mobileRegex.test(data);
};
const isValidString = function (data) {
  if (typeof data != "string" || data.trim().length == 0) {
    return false;
  }
  return true;
};

const checkNumbersInString= function(data){
  const checkNumbersInStringRegex =
    /^[a-zA-Z ]*$/;
  return checkNumbersInStringRegex.test(data);
}

const createIntern = async function (req, res) {
  try {
    res.header("Access-Control-Allow-Origin","*")

    let data = req.body;
    // Checking if the data is empty or not
    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .send({ status: false, msg: "required data in the body" });
    }
    //Checking if the required keys are present or not
    const requiredFields = ["name", "email", "mobile", "collegeName"];
    // for (field of requiredFields) {
    //   if (!data.hasOwnProperty(field)) {
    //     return res
    //       .status(400)
    //       .send({ status: false, msg: `please provide ${field}` });
    //   }
    // }
    //Checking if the name contains numbers or not
    if (!checkNumbersInString(data.name)) {
      return res
        .status(400)
        .send({ status: false, msg: "name should only contain letters" });
    }
    //Checking if there is no field other than the specified
    // for (key in data) {
    //   if (!requiredFields.includes(key))
    //     return res.status(400).send({
    //       status: false,
    //       msg: `keys must be among this ${requiredFields.join(",")}`,
    //     });
    // }
    // Checking if the value is a valid string or not
    for (field of requiredFields)
      if (!isValidString(data[field])) {
        return res
          .status(400)
          .send({ status: false, msg: `${field} is invalid` });
      }
    // Checking if the Email is a valid or not
    if (!isValidEmail(data.email.trim())) {
      return res.status(400).send({ status: false, msg: "email is invalid" });
    }
    // Checking if the Mobile is a valid or not
    if (!isMobileNumber(data.mobile.trim())) {
      return res
        .status(400)
        .send({ status: false, msg: "mobile number is invalid" });
    }
    // Checking if the email,mobile already exists or not
    let unique = ["email", "mobile"];
    for (field of unique) {
      let emp = {};
      emp[field] = data[field];
      let document = await internModel.findOne(emp);
      if (document) {
        return res
          .status(400)
          .send({ status: false, msg: `${field} is already taken` });
      }
    }

    let collegeData = await collegeModel.findOne({
      name: data.collegeName.trim(),
    });
    if (!collegeData) {
      return res.status(404).send({ status: false, msg: "no such clg with the give collegeName" });
    }
    data.collegeId = collegeData._id;
    delete data["collegeName"];
    let createInterns = await internModel.create(data);
    return res.status(201).send({ status: true, data: createInterns });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createIntern };
