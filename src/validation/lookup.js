/**
 * validation for lookup keys
 */
const lookupValidation = async (req, res, next) => {
    // requesting event_id from query
    const req_key = req.query.key;
    // if event_id exists in thes query(condtion)
    if (req_key && (typeof req_key === "string" || req_key instanceof String)) {
        const splited_value = req_key.split(",");
        const allowedLookups = [
            "businessType",
            "chargingStationType",
            "ticketType"
        ];
        //var is_error = false;
        var is_error = splited_value.every((x) => {
            return allowedLookups.includes(x)
        })
    } else {
        return res.status(400).send({ "message": "Required key in query param" })
    }
    if (is_error) {
        next();
    }
    else {
        return res.status(401).send({ "message": "key is not valid" })
    }
}

module.exports = {
    lookupValidation
}