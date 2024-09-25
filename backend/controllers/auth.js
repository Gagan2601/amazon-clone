const User = require('../models/user');
const Seller = require('../models/seller');
const Admin = require('../models/admin');
const jwt = require('../utils/jwtService');
const {ControllerResponse, ErrorHandler} = require('../middlewares/errorHandler');
const RefreshToken = require('../models/refreshToken'); 
const { hashPassword, verifyPassword } = require("../middlewares/encryption");

function checkEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

const register = async (req, res, Model) => {
    const {
        email,
        password,
        name,
      } = req.body;
      console.log(req.body);
      if (checkEmail(email) == false) {
        return ErrorHandler(res, 400, "Invalid Email");
      }
      if (password == null || password == undefined || password.length < 6) {
        return ErrorHandler(res, 400, "Invalid Password");
      }
      const userExist = await Model.findOne({ email });
      if (userExist) {
        return ErrorHandler(res, 400, "Email already exists");
      }
      try {
        const user = await Model.create({
          email,
          password: await hashPassword(password),
          name
        });
        user.save();
        const access_token = jwt.sign({
          _id: user._id,
          email });
        const refresh_token = jwt.sign(
          {
            _id: user._id,
            email
    
          },
          process.env.REFRESH_TOKEN_KEY,
          "30d"
        );
        await RefreshToken.create({ token: refresh_token });
        delete user._doc.password;
        return ControllerResponse(res, 200, {
          message: "Signup Successfull!",
          ...user._doc,
          refresh_token,
          access_token,
        });
      } catch (err) {
        console.log(err);
        ErrorHandler(res, 500, "Internal Server Error");
      }
};

const login = async (req, res, Model) => {
    const { email, password } = req.body;

  if (!email || !password) {
    return ErrorHandler(res, 400, "Username/Email and password are required");
  }
  try {
    const user = await Model.findOne({
      email: email ,
    });

    if (!user) {
      return ErrorHandler(res, 403, "Invalid credentials");
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return ErrorHandler(res, 403, "Invalid credentials");
    }
    const access_token = jwt.sign({
      _id: user._id,
      email:user.email
    });

    const refresh_token = jwt.sign(
      {
        _id: user._id,
        email: user.email
      },
      process.env.REFRESH_TOKEN_KEY,
      "30d"
    );
    await RefreshToken.create({ token: refresh_token });

    delete user._doc.password;
    return ControllerResponse(res, 200, {
      message: "Login Successful!",
      ...user._doc,
      refresh_token,
      access_token
    });
  } catch (err) {
    console.log(err);
    ErrorHandler(res, 500, "Internal Server Error");
  }
};

const getData= async (req, res, Model) => {
try {
    const entity = await Model.findById(req.user._id);
    delete entity._doc.password;
    return ControllerResponse(res, 200, {
    ...entity._doc,
    });

} catch (err) {
    console.log(err);
    ErrorHandler(res, 500, "Internal Server Error");
}
};

exports.userRegister = (req, res) => {
    register(req, res, User, 'User already exists');
};

exports.userLogin = (req, res) => {
    login(req, res, User, 'User not found');
};

exports.userData = (req, res) => {
    getData(req, res, User);
};

exports.sellerRegister = (req, res) => {
    register(req, res, Seller, 'Seller already exists');
};

exports.sellerLogin = (req, res) => {
    login(req, res, Seller, 'Seller not found');
};

exports.sellerData = (req, res) => {
    getData(req, res, Seller);
};

exports.adminRegister = (req, res) => {
    register(req, res, Admin, 'Admin already exists');
};

exports.adminLogin = (req, res) => {
    login(req, res, Admin, 'Admin not found');
};
