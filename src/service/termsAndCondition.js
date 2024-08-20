const mongoose = require("mongoose");
const db = require("../models/collection");
const Terms=db.Terms;

const postTermsAndCondition= async (bodyObj,adminId) => {
    return new Promise(async (resolve, reject) => {
        try {
                const terms = new Terms({
                        _id: new mongoose.Types.ObjectId(),
                        termsAndCondition:bodyObj.termsAndCondition,
                        privacyPolicy: bodyObj.privacyPolicy,
                        createdId: adminId
                    })
                    terms.save().then(result=>{
                        resolve(result)}
                        ).catch(err=>{
                          reject(err)
                        })
                        
    } catch (err) {
    reject(err)
}
})
}


const getTermsAndCondition = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            Terms.aggregate([
                {
                    $project: {
                        termsAndConditionId: "$_id",
                        _id: 0,
                        termsAndCondition:1,
                        privacyPolicy:1
                        
                    }
                }
            ])
            .then(result => {
                resolve(result[0]);
            })
            .catch(err => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

const putTermsAndCondition= async (bodyObj,adminId,termsAndConditionId) => {
    return new Promise(async (resolve, reject) => {
        try {
              Terms.updateOne({_id:termsAndConditionId},{ termsAndCondition:bodyObj.termsAndCondition,
                privacyPolicy: bodyObj.privacyPolicy,modified:Date.now(),modifiedId:adminId}).then(result=>{
                        resolve(result[0])
                        }).catch(err=>{
                          reject(err)
                        })
                        
    } catch (err) {
    reject(err)
}
})
}

module.exports={
    postTermsAndCondition,
    getTermsAndCondition,
    putTermsAndCondition
}