let Validator = require("jsonschema").Validator;
const loginHelper = require(`../../src/service/login`);
const userHelper = require(`../service/information`);
let error_utils = require('./error')


/**
 * validate login details
 */
const loginValidation = async (req, res, next) => {
    let body = req.body;
    let v = new Validator();
    // Create a json scehma
    let schema = {
      id: "/schema",
      type: "object",
      properties: {
        email:{
            "type": "string",
            "required": true,
            "format": "email"
        },
        password: {
          "type": "string",
          "required": true
        },
      },
    };
  
    let is_valid = v.validate(body, schema).valid;
    if (is_valid) {
      //check user exists or not
      let userId_exists = await userHelper.getUserDetails(body.email).catch((err) => {
        console.log(err);
      });
      if (Object.keys(userId_exists).length > 0) {
        //compare passwords
        const password = await loginHelper.comparePasswordHash(body.password, userId_exists.hashPass).catch((err) => {
          console.log(err);
          return err;
        });
        if(userId_exists.status === 'INACTIVE'){
          return res.status(400).send({ "message": "user does not exist" }) 
        }
        if (password) {
            console.log(userId_exists. _id);
          res.locals.userId = userId_exists. _id;
          res.locals.role=userId_exists.role;
          next()
        } else {
          return res.status(400).send({ "message": "Password is invalid" })
        }
  
      } else {
        return res.status(400).send({ "message": "email does not exists" })
      }
    } else {
      const errors = await error_utils.getErrorMessage(v.validate(body, schema).errors);
      return res.status(400).send({ "message": errors })
    }
  }


  module.exports={
    loginValidation
  }