const bcrypt = require('bcryptjs');
const randomstring = require("randomstring");
const mongoose = require("mongoose");
const db = require("../models/collection");
const User = db.User;


const postDetails= async (bodyObj) => {
    return new Promise(async (resolve, reject) => {
        try {
            const password = randomstring.generate({
                length: 8,
                charset: 'alphabetic'
            });
            console.log("password",password)
            bcrypt.genSalt(parseInt(process.env.salt_rounds), async (error, salt) => {
                bcrypt.hash(password, salt, async (error, hash) => {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: bodyObj.email,
                        fullName: bodyObj.fullName,
                        phoneNo:bodyObj.phoneNo,
                        created: new Date(),
                        saltPass: salt,
                        hashPass: hash,
                        role: bodyObj.role,
                        address:bodyObj.address,
                        state:bodyObj.state,
                        city:bodyObj.city,
                        zipCode:bodyObj.zipCode,
                    })
                    user.save()
                        .then(async(result) => {
                               resolve(result)
                            }).catch((err) => {
                                console.log(err)
                                reject(err)
                            })
                })
            });
    } catch (err) {
    console.log(err, 'Failed to create user [createUser user service]')
    reject(err)
}
})
}

const putDetails= async (bodyObj,dealerId) => {
    return new Promise(async (resolve, reject) => {
        try {
                   await User.updateOne(
                    {_id:dealerId},
                    {email: bodyObj.email,
                   fullName: bodyObj.fullName,
                   phoneNo:bodyObj.phoneNo,
                   modified: new Date(),
                   role: bodyObj.role,
                   address:bodyObj.address,
                   state:bodyObj.state,
                   city:bodyObj.city,
                   zipCode:bodyObj.zipCode,
                   profileImg:bodyObj. profileImg }   
                    ).then(async(result) => {
                               resolve(result)
                            }).catch((err) => {
                                console.log(err)
                                reject(err)
                            })
               
    } catch (err) {
    console.log(err, 'Failed to update user ')
    reject(err)
}
})
}



const getUserDetails = async (email,userId,phoneNo,fullName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clause=''

            if(email){
             clause={email:email}
            }

            if(userId){
                clause={_id:userId}
            }
            if(phoneNo){
                clause={phoneNo:phoneNo}
            }

            if(fullName){
                clause={fullName:fullName}
            }
            await User.findOne(clause)
                .then(result => {
                    if (result) {
                     resolve(result)
                    }
                   resolve({})
                }).catch(error => {
                    reject(error)
                })
            resolve(userDetails)
        } catch (err) {
            reject('Failed to get employee detail', err)
        }
    })
}


const getUser = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            
            await User.find()
                .then(result => {
                    if (result) {
                     resolve(result)
                    }
                }).catch(error => {
                    reject(error)
                })
            resolve(userDetails)
        } catch (err) {
            reject('Failed to get user detail', err)
        }
    })
}



const getUserByphoneNoAndEmail = async (phoneNo,email) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.findOne({phoneNo:phoneNo,email:email})
                .then(result => {
                    console.log("result",result);
                    if (result) {
                     resolve(result)
                    }else{
                        resolve({})
                    }
                }).catch(error => {
                    reject(error)
                })
            resolve(userDetails)
        } catch (err) {
            reject('Failed to get user detail', err)
        }
    })
}
module.exports={
    postDetails,
    getUserDetails,
    putDetails,
    getUser,
    getUserByphoneNoAndEmail
}