const db = require("../models/collection");
const Business=db.BusinessType;
const ChargingStationType=db.chargingStationType;
const TicketType=db.TicketType;

/**
 * get lookup details 
 */
async function getLookup(key, id, code) {
    var splited_value = key.split(",");

    const lookupdict = {};

    for (i in splited_value) {
        if (splited_value[i] == 'businessType') {
            lookupdict['businessType'] = await getBusinesstype()
        }
        if (splited_value[i] == 'chargingStationType') {
            lookupdict['chargingStationType'] = await getchargingStationType()
        }
        if (splited_value[i] == 'ticketType') {
            lookupdict['ticketType'] = await getTicketType()
        }
    }
    return lookupdict;
}




// get buissness type  list
const getBusinesstype = async () => {
    return await new Promise(async (resolve, reject) => {
        await Business.find()
            .then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
    })
}


// get charging station type  list
const getchargingStationType = async () => {
    return await new Promise(async (resolve, reject) => {
        await ChargingStationType.find()
            .then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
    })
}



// get ticket type  list
const getTicketType = async () => {
    return await new Promise(async (resolve, reject) => {
        await TicketType.find()
            .then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
    })
}





module.exports={
    getLookup,
    getBusinesstype,
    getchargingStationType,
    getTicketType
}