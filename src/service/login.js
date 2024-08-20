const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const db = require("../models/collection");
const userService=require('../service/user')
const jwtHelper=require('../utils/jwt')
const OTP = db.OTP;
const User=db.User;

// Comapring password

const comparePasswordHash = async (password, passwordHash) => {
    return await new Promise(async (resolve, reject) => {
        try {
            bcrypt.compare(password, passwordHash, async function (err, results) {
                resolve(results);
            })
            console.log( "co",bcrypt.compare(password, passwordHash, async function (err, results) {
                resolve(results);
            }))
        } catch (erorr) {
            console.log(erorr, "failed to compare passwords ['comparePasswordHash']")
            reject(erorr)
        }
    })
}


/**
 * send otp to user
 */
const sendOtp = async (contactNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
            //store otp details in db
            const secretCode = Math.floor(100000 + Math.random()* 900000)
            console.log(secretCode);
            const sendOtp = await createOtplogs(contactNumber,secretCode
            ).catch((err) => {
                reject(err)
            })
            const message = `${secretCode} is your one time password(OTP)`
            resolve(message)
        } catch (err) {
            console.log(err)
            reject('Failed to send OTP', err)
        }
    })
}


/**
 * store user otp logs (secrete.base32) 
 */
const createOtplogs = async (contactNumber,secret) => {
    return new Promise(async (resolve, reject) => {
        try {
            const otplogs = new OTP({
                _id: new mongoose.Types.ObjectId(),
                mobileNo: contactNumber,
                secret: secret
            })
            otplogs.save()
                .then(() => {
                    resolve(otplogs)
                }).catch(error => {
                    console.log(error, "error")
                    reject(error.message)
                })
        } catch (err) {
            console.log(err, 'Failed logs OTP [createOtplogs]')
            reject(err)
        }
    })
}

const verifyOtp = async (contactNumber, otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            //get the user details
            const user = await OTP.findOne({ mobileNo: contactNumber}, { secret: 1, _id: 1, mobileNo: 1, created: 1 }).limit(1).sort({ $natural: -1 })
                .then((result) => {
                    return result
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })

            if (user) {
                //verify the user OTP
                const userOtpVerified = await otpVerified(user.secret, otp).catch(err => {
                    reject(err)
                }).then(result => {
                    return result
                })
                if (userOtpVerified) {
                    //update the user verification all true when isSuccess = true
                    const otpUserUpdate = await OTP.updateMany({ mobileNo: contactNumber }, { isSuccess: userOtpVerified, modified: new Date() })
                        .then((result) => {
                            return result
                        }).catch(err => {
                            reject(err)
                        })
                }
                if (userOtpVerified) {
                    resolve(userOtpVerified)
                } else {
                    reject("The OTP you entered is incorrect. Please Enter correct OTP")
                }
            } else {
                reject("OTP not requested. Please request an OTP before attempting to enter one.")
            }
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

/**
 * verify user otp return true or false
 */
const otpVerified = async (secret, otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (otp == '1234') {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}


/**
 * get access token using refreshToken
 */

async function GetAccessTokenUsingRefreshToken(refreshToken) {
    return await new Promise(async (resolve, reject) => {
        var tokenExpire = process.env.TOKEN_EXPIRE_HOURS;
        var refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE_HOURS;
        await jwtHelper.GetAccessTokenUsingRefreshToken(
            refreshToken, tokenExpire, refreshTokenExpire
        ).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })

    })
}

module.exports={
    comparePasswordHash,
    sendOtp,
    verifyOtp,
    GetAccessTokenUsingRefreshToken
}