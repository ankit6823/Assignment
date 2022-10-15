const userModel = require("../Model/userModel.js");
const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value == null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value != "string") return false;
  return true;
};

const createUser = async function (req, res) {
  try {
    let data = req.body;
    let { fname, lname, email, phone } = data;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter detail" });
    }

    if (!isValid(fname)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter first name " });
    }
    if (!/^[a-zA-Z ]{2,20}$/.test(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "please valid name" });
    }

    if (!isValid(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter last name" });
    }

    if (!/^[a-zA-Z ]{2,20}$/.test(lname))
      return res
        .status(400)
        .send({ status: false, message: "please enter valid last name" });

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter  email" });
    }
    if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid email" });
    }
    const usedEmail = await userModel.findOne({ email: email });
    if (usedEmail)
      return res
        .status(409)
        .send({ status: false, message: "emailId is already used" });

    if (!isValid(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter phone number" });
    }
    if (!/^([9876]{1})(\d{1})(\d{8})$/.test(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid phone number" });
    }

    if (!isValid(role)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter Role Number" });
    }

    let savedData = await userModel.create(data);
    console.log(savedData);
    res.status(201).send({ status: true, msg: "Success", data: savedData });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const getUser = async function (req, res) {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ msg: "inavalid id format" });
    if (req.userId != userId)
      return res
        .status(403)
        .send({ status: false, message: "you are not authorized" });

    const user = await userModel.findOne({ _id: userId });

    return res
      .status(200)
      .send({ status: true, message: "User profile details", data: user });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
///  update Api //
const updatedUser = async function (req, res) {
  try {
    let userId = req.params.userId;

    //check the userId is Valid or Not ?
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ msg: "inavalid id format" });

    if (req.userId != userId)
      return res
        .status(403)
        .send({ status: false, message: "you are not authorized" });

    let data = req.body;
    let { fname, lname, email, phone } = data;

    //check if body is empty or not ?
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter field to be Updated" });
    }

    //check if userid is present in Db or Not ?
    let user = await userModel.findById(userId);
    if (!user)
      return res.status(404).send({ status: false, msg: "No user found" });

    var regEx = /^[a-zA-Z ]{2,15}$/;

    if (fname != null) {
      if (!regEx.test(fname))
        return res
          .status(400)
          .send({ status: false, msg: "fname text is invalid" });
      user.fname = fname;
    }

    if (lname != null) {
      if (!regEx.test(lname))
        return res
          .status(400)
          .send({ status: false, msg: "lname text is invalid" });
      user.lname = lname;
    }
    //check the email unique or not
    if (email != null) {
      if (!isValid(email))
        return res
          .status(400)
          .send({ status: false, message: "please enter email" });
      if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email))
        return res
          .status(400)
          .send({ status: false, message: "please enter valid email" });
      let findEmail = await userModel.findOne({ email: email });
      if (findEmail) {
        return res
          .status(400)
          .send({ status: false, msg: "This EmailId is already taken" });
      }
      user.email = email;
    }

    //check the phone unique or not
    if (phone != null) {
      if (!isValid(phone))
        return res
          .status(400)
          .send({ status: false, message: "please enter phone number" });
      if (!/^([9876]{1})(\d{1})(\d{8})$/.test(phone))
        return res
          .status(400)
          .send({ status: false, message: "please enter valid phone number" });
      let findPhone = await userModel.findOne({ phone: phone });
      if (findPhone)
        return res
          .status(400)
          .send({ status: false, msg: "phone is Already Present in DB" });
      user.phone = phone;
    }
    const updatedUser = await user.save();
    return res.status(200).send({ status: true, data: updatedUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
/// delete Api ///
const deleteUser = async function (req, res) {
  try {
    let userId = req.params.userId;

    if (userId) {
      if (!mongoose.isValidObjectId(bookId))
        return res
          .status(400)
          .send({ status: false, msg: "The Format of userId is invalid" });
      let data = await userModel.findById(userId);
      if (!data)
        return res
          .status(404)
          .send({ status: false, msg: "The userId is not found" });
    }
    let find = await userModel.findById(userId);
    if (!find)
      return res
        .status(404)
        .send({
          status: false,
          msg: "The Id You Have Entered Is doesnot exists",
        });
    let data = await userModel.findOneAndUpdate({ _id: userId });
    return res
      .status(200)
      .send({ status: true, message: "Success", data: "The book is deleted" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.updateUser = updatedUser;
module.exports.deleteUser = deleteUser;