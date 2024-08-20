const express = require('express');
const app = express.Router();
const lookupController = require('../controller/lookup');
const lookupValidation = require('../validation/lookup');

/*get country look up details */
/**
 * @swagger
 * /lookup:
 *   get:
 *     summary: Get lookup details
 *     description: Retrieve lookup details based on the provided query parameters.
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: The key used to retrieve lookup details enum('buissnessType','chargingStationType').
 *     responses:
 *       '200':
 *         description: Returns the lookup details.
 *         content:
 *           application/json:
 *             example:
 *               buissnessType:
 *                 - _id: "6617be3fb7c89b34054b9133"
 *                   code: "PARTNERSHIP"
 *                   description: "partnership"
 *                 - _id: "6617be5eb7c89b34054b9135"
 *                   code: "LIMITED LIABILITY PARTNERSHIP (LLP)"
 *                   description: "limited_liability_partnership (LLP)"
 *                 - _id: "6617be76b7c89b34054b9137"
 *                   code: "PRIVATE LIMITED COMPANIES"
 *                   description: "private_limited_companies"
 *                 - _id: "6617be9bb7c89b34054b9139"
 *                   code: "PUBLIC LIMITED COMPANIES"
 *                   description: "Public_limited_companies"
 *                 - _id: "6617bee6b7c89b34054b913b"
 *                   code: "ONE PERSON COMPANIES"
 *                   description: "one_person_companies"
 *                 - _id: "6617bf02b7c89b34054b913d"
 *                   code: "JOINT VENTURE"
 *                   description: "joint_venture"
 *               chargingStationType:
 *                 - _id: "661f6d3e9279272bfcbed8e4"
 *                   code: "PUBLIC"
 *                   description: "public"
 *                 - _id: "661f6dac9279272bfcbed8e6"
 *                   code: "PRIVATE"
 *                   description: "Private"
 *                 - _id: "661f6dbd9279272bfcbed8e8"
 *                   code: "COMMERCIAL"
 *                   description: "Commercial"
 *                 - _id: "661f6de19279272bfcbed8ea"
 *                   code: "RESIDENTIAL"
 *                   description: "Residential"
 *       '401':
 *         description: Invalid key provided.
 *       '500':
 *         description: Internal server error occurred.
 */
    



app.get('/',
    lookupValidation.lookupValidation,
    lookupController.getLookup
)

module.exports = app;