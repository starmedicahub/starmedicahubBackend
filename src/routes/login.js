const express = require("express");
const router = express.Router();
const loginValidation=require('../validation/login')
const loginController=require('../controller/login')

/**
 * user login
 */
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login for dealers, service stations, and customer support.
 *     description: |
 *       This endpoint allows dealers, service stations, and customer support personnel to login. 
 *       Upon successful authentication, a JSON web token (JWT) will be returned.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 6
 *                 maxLength: 127
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 12
 *                 example: "password123"
 *     responses:
 *       '201':
 *         description: JSON web token (JWT) generated successfully.
 *         content:
 *           application/json:
 *             example: {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}
 *       '500':
 *         description: Internal server error.
 *       '400':
 *         description: Invalid password, email address does not exist, or failed to retrieve user details.
 *         content:
 *           application/json:
 *             example: {"error": "Invalid password"}
 */

router.post('/',
 loginValidation.loginValidation,
loginController.GenerateJwtToken
);


/*Send otp to registered user */

router.post('/sendOTP',
    // loginValidation.validateSendOtp,
    loginController.sendOtp
)


/* verify otp */
router.post('/verifyOTP',
//    loginValidation.validateVerifydOtp,
    loginController.verifyOtp
)


/**
 * @swagger
 * /login/refreshToken:
 *   post:
 *     summary: User refreshes their access token.
 *     description: This endpoint is used to refresh a user's expired access token by providing a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: Success response containing the new access token and its expiration time.
 *       '500':
 *         description: Internal server error occurred.
 */

router.post(`/refreshToken`,
loginController.GetAccessTokenUsingRefreshToken)


module.exports = router;