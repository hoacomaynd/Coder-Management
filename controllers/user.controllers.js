const { sendResponse, AppError } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

const userController = {};

userController.getUsers = async (req, res, next) => {
    const { name } = req.query;
    const allowedQueries = "name";
    let users = [];
    try {
        const keys = Object.keys(req.query);
        if (keys.length !== 0) {
            keys.forEach((item) => {
                if (item !== allowedQueries) {
                    throw new AppError(400, "Queries not allow");
                }
            });
            users = await User.find({ name: name });
        } else {
            users = await User.find();
        }
        sendResponse(res, 200, true, users, null, "Get users successfully");
    } catch (error) {
        next(error);
    }
};

userController.getUserByName = async (req, res, next) => {
    const { name } = req.params;
    try {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const user = await User.findOne({ name: name });
            sendResponse(res, 200, true, user, null, "Get user successfully");
        } else {
            const errors = result.array();
            const errorMsgs = errors.map((item) => item.msg);
            const errorMsgsText = errorMsgs.join(",");
            throw new AppError(400, `${errorMsgsText}`, "Get User Error");
        }
    } catch (error) {
        next(error);
    }
};

userController.getTasks = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!ObjectId.isValid(id)) {
            throw new AppError(400, "Invalid User ID", "Get Task Error");
        }

        const user = await User.findById(id).populate({
            path: "tasks",
            match: { isDeleted: false },
        });

        if (!user) {
            throw new AppError(404, "User not found", "Get Task Error");
        }

        sendResponse(
            res,
            200,
            true,
            user.tasks,
            null,
            "Get user tasks successfully"
        );
    } catch (error) {
        next(error);
    }
};

userController.createUser = async (req, res, next) => {
    const { name, role } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMsgs = errors.array().map((item) => item.msg);
            const errorMsgsText = errorMsgs.join(",");
            return next(new AppError(400, errorMsgsText, "Create User Error"));
        }

        const existingUser = await User.findOne({ name: name });
        if (existingUser) {
            return next(new AppError(400, "User name already exists", "Create User Error"));
        }

        const userCreate = await User.create({
            name: name,
            role: role,
        });

        return sendResponse(res, 200, true, userCreate, null, "Create user successfully");

    } catch (error) {
        return next(error);
    }
};


module.exports = userController;
