const User = require('../models/user');
const Seller = require('../models/seller');
const bcrypt = require('bcrypt');
const { signToken } = require('../middlewares/jwtAuth');
const Admin = require('../models/admin');
const errorHandler = require('../middlewares/errorHandler');

const register = async (req, res, Model, errorMessage) => {
    try {
        const { name, email, password } = req.body;
        const existingEntity = await Model.findOne({ email });

        if (existingEntity) {
            return res.status(400).json({ message: errorMessage });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newEntity = new Model({
            name,
            email,
            password: hashedPassword,
        });

        await newEntity.save();
        res.status(201).json({ message: `${Model.modelName} registered successfully` });
    } catch (err) {
        errorHandler(err, req, res);
    }
};

const login = async (req, res, Model, errorMessage) => {
    try {
        const { email, password } = req.body;
        const entity = await Model.findOne({ email });

        if (!entity) {
            return res.status(404).json({ message: errorMessage });
        }

        const passwordMatch = await bcrypt.compare(password, entity.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const tokenPayload = {
            _id: entity._id,
        };

        const token = signToken(tokenPayload);
        res.status(200).json({ token, entity });
    } catch (err) {
        errorHandler(err, req, res);
    }
};

const getData = async (req, res, Model) => {
    const entity = await Model.findById(req.user);
    res.json({ ...entity._doc, token: req.token });
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