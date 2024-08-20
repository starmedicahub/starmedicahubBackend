const lookupService = require('../service/lookup')

/**
 * get Lookup details 
 *  @param {query} key
 */
async function getLookup(req, res, next) {
    var key = req.query.key;
    await lookupService.getLookup(
        key
    ).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(500).send(error)
    })
}

module.exports={
    getLookup
}