const Validator = require("jsonschema").Validator;
const error_utils = require('./error');
const userHelper = require('../service/information');
const lookupHelper = require('../service/lookup');

const validateUserInfo = async (req, res, next) => {
    const body = req.body;
    const v = new Validator();

    const userSchema = {
        "id": "/userSchema",
        "type": "object",
        "properties": {
            "email": {
                "type": "string",
                "required": true,
                "format": "email",
                "maxLength": 100
            },
            "phoneNo": {
                "type": "string",
                "pattern": "^[6-9][0-9]{9}$",
                "required": true
            },
            "password": {
                "type": "string",
                "required": true
            },
            "firstName": {
                "type": "string",
                "required": true
            },
            "lastName": {
                "type": "string",
                "required": true
            },
            "drsDegree": {
                "type": "string",
                "required": true
            },
            "licenseNumber": {
                "type": "string",
                "required": true
            },
            "gender": {
                "type": "string",
                "required": true
            },
            "birthDate": {
                "type": "string",
                "format": "date",
                "required": true
            },
            "address": {
                "type": "string",
                "required": true
            },
            "category": {
                "type": "string",
                "required": true
            },
            "info": {
                "type": "string",
                "required": true
            },
            "photo": {
                "type": "string",
                "required": true
            },
            "license": {
                "type": "string",
                "required": true
            },
            "visitingCard": {
                "type": "string",
                "required": true
            }
        },
        "additionalProperties": false
    };

    const is_valid = v.validate(body, userSchema).valid;
    if (is_valid) {
        try {
            const emailIdExists = await userHelper.getUserDetails(body.email);
            if (!emailIdExists || Object.keys(emailIdExists).length === 0) {
                next();
            } else {
                return res.status(400).send({ "message": "Email already exists" });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send({ "message": "Internal server error" });
        }
    } else {
        const errors = await error_utils.getErrorMessage(v.validate(body, userSchema).errors);
        return res.status(400).send({ "message": errors });
    }
};

const validatePostTicket = async (req, res, next) => {
    const body = req.body;
    const v = new Validator();
    const ticketType = await lookupHelper.getTicketType();

    const ticketSchema = {
        "id": "/ticketSchema",
        "type": "object",
        "properties": {
            "ticketType": {
                "type": "string",
                "enum": ticketType.map(x => String(x.code)),
                "required": true
            },
            "description": {
                "type": "string",
                "required": true
            }
        },
        "additionalProperties": false
    };

    const is_valid = v.validate(body, ticketSchema).valid;
    if (is_valid) {
        next();
    } else {
        const errors = await error_utils.getErrorMessage(v.validate(body, ticketSchema).errors);
        return res.status(400).send({ "message": errors });
    }
};

const validatePutUserInfo = async (req, res, next) => {
    const body = req.body;
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).send({ "message": "User ID required in params" });
    }

    try {
        const userDetails = await userHelper.getUserDetails(null, userId);
        if (!userDetails || Object.keys(userDetails).length === 0) {
            return res.status(400).send({ "message": "User ID does not exist" });
        }

        const v = new Validator();
        const dealerSchema = {
            "id": "/userSchema",
            "type": "object",
            "properties": {
                "fullName": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 150,
                    "pattern": "[A-Z][a-z]* [A-Z][a-z]*"
                },
                "email": {
                    "type": "string",
                    "format": "email",
                    "minLength": 6,
                    "maxLength": 127
                },
                "phoneNo": {
                    "type": "string",
                    "pattern": "^[6-9][0-9]{9}$"
                },
                "role": {
                    "type": "string",
                    "enum": ['DEALER']
                },
                "address": {
                    "type": "string"
                },
                "state": {
                    "type": "string"
                },
                "zipCode": {
                    "type": "string",
                    "pattern": "^[1-9][0-9]{5}$"
                },
                "profileImg": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        };

        const is_valid = v.validate(body, dealerSchema).valid;
        if (is_valid) {
            const result = await userHelper.getUser();
            const duplicatePhoneNo = result.filter(element => element.phoneNo === body.phoneNo && element._id.toString() !== userId);
            const duplicateEmail = result.filter(element => element.email?.toLowerCase() === body.email?.toLowerCase() && element._id.toString() !== userId);

            if (duplicatePhoneNo.length > 0) {
                return res.status(400).send({ "message": "Phone number already exists" });
            }
            if (duplicateEmail.length > 0) {
                return res.status(400).send({ "message": "Email already exists" });
            }
            next();
        } else {
            const errors = await error_utils.getErrorMessage(v.validate(body, dealerSchema).errors);
            return res.status(400).send({ "message": errors });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ "message": "Internal server error" });
    }
};

const validateGetUser = async (req, res, next) => {
    const { fullName, email, phoneNo, userId } = req.query;

    try {
        if (fullName) {
            const userNameExists = await userHelper.getUserDetails(null, null, null, fullName);
            if (!userNameExists) {
                return res.status(400).send({ "message": "User name does not exist" });
            }
        }
        if (email) {
            const userNameExists = await userHelper.getUserDetails(email);
            if (!userNameExists) {
                return res.status(400).send({ "message": "Email ID does not exist" });
            }
        }
        if (phoneNo) {
            const userNameExists = await userHelper.getUserDetails(null, null, phoneNo);
            if (!userNameExists) {
                return res.status(400).send({ "message": "Phone number does not exist" });
            }
        }
        if (userId) {
            const userNameExists = await userHelper.getUserDetails(null, userId);
            if (!userNameExists) {
                return res.status(400).send({ "message": "User ID does not exist" });
            }
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).send({ "message": "Internal server error" });
    }
};

const validateDeleteUser = async (req, res, next) => {
    const userId = req.params.userId;

    if (userId) {
        try {
            const result = await userHelper.getUserDetails(null, userId);
            if (result && Object.keys(result).length > 0) {
                next();
            } else {
                return res.status(400).send({ "message": "User ID does not exist" });
            }
        } catch (err) {
            return res.status(400).send({ "message": "Invalid user ID" });
        }
    } else {
        return res.status(400).send({ "message": "User ID in path param is mandatory" });
    }
};

module.exports = {
    validateUserInfo,
    validatePostTicket,
    validatePutUserInfo,
    validateGetUser,
    validateDeleteUser,
};
