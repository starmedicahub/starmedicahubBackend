const jwtHelper = require(`../../src/utils/jwt`);
const LoginService = require('../../src/service/login')

/**
* generate JWT token by email and userId
 * @param {body} phoneNo
 * @param {locals} userId
*/

const GenerateJwtToken = async (req, res, next) => {
    // assigning body
    const { email } = req.body;
    const { userId } = res.locals;
    const {role}=res.locals;
    const tokenExpire = process.env.TOKEN_EXPIRE_HOURS;
    // post method to login
    const userObj = {
        emailId: email,
        userId: userId,
        role:role
    };
    console.log(userObj);
    await jwtHelper.generateJwtToken(
        userObj, tokenExpire
    ).then(response => {
        res.status(201).send(response)
    }).catch(error => {
        res.status(500).send(error)
    })
};

/**
 * send otp to registered users
 */
const sendOtp = async (req, res) => {
    try {
        var contactNumber = req.body.phoneNo;
        await LoginService.sendOtp(
            contactNumber
        ).then(response => {
            res.status(201).send({ "message": "OTP send successfully." })
        }).catch(error => {
            res.status(400).send({ "message": error })
        })
    } catch (err) {
        res.status(500).send({ "message": err })
    }
}



/**
 * send otp for users
 */
const verifyOtp = async (req, res) => {
    try {
        const contactNumber = req.body.phoneNo;
        const otp = req.body.otp;
        await LoginService.verifyOtp(
            contactNumber, otp
        ).then(response => {
            res.status(201).send(response)
        }).catch(error => {
            res.status(400).send({ "message": error })
        })
    } catch (err) {
        res.status(500).send({ "message": err })
    }
}




async function GetAccessTokenUsingRefreshToken(req, res, next) {
    // assigning body
    let refreshToken = req.body.refreshToken;
    // post method to login
    await LoginService.GetAccessTokenUsingRefreshToken(
        refreshToken
    ).then(response => {
        res.status(201).send(response)
    }).catch(error => {
        res.status(400).send({ "message": error })
    })
}
module.exports={
    GenerateJwtToken,
    sendOtp,
    verifyOtp,
    GetAccessTokenUsingRefreshToken
}