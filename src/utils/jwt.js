const jwt = require('jsonwebtoken');
const UrlPattern = require('url-pattern');
const userHelper=require('../service/information')
const permission_json=require('../config/permission.json')

/** generate jwt token */
const generateJwtToken = async (payload, tokenExpire) => {
    return await new Promise(async (resolve, reject) => {
        let token = jwt.sign(
            payload,
            process.env.TOKEN_SECRETE_KEY,
            { expiresIn: process.env.TOKEN_EXPIRE_HOURS }
        );
        // //generate refresh token
        // let refreshToken = jwt.sign(
        //     payload,
        //     process.env.REFRESH_TOKEN_SECRETE_KEY,
        //     { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_HOURS }
        // );
        // Remove the refush the jwt Token
        resolve({ token: token }); // 
    })
}

/**
 *Verify jwt token
 */


const   verifyJwtToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //split the space at the bearer
        const bearer = bearerHeader.split(' ');
        //Get token from string
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        jwt.verify(req.token, process.env.TOKEN_SECRETE_KEY, async function (err, decoded) {
            if (err) {
                res.status(401).json(err);
            } else {
                //next middleware
                res.locals.userId = decoded.userId;
                res.locals.emailId = decoded.emailId;
          
                let url = req.originalUrl.split("/?").shift();
                url = url.split("?").shift();
                const method = req.method;
                const userId = decoded.userId;
                let result = await userHelper.getUserDetails(
                    null,userId
                ).catch(error => {
                    return res.status(500).send({ "error": error });;
                })
                if ( result.status === 'ACTIVE' ) {
                    const role = result.role;
                    res.locals.role =role;
                    await ProtectApiRbac(
                        role, url, method
                    ).then(response => {
                        if (response) {
                            next();
                        } else {
                            return res.status(401).send({ "error": "unauthorized" });
                        }
                    }).catch(error => {
                        return res.status(500).send({ "error": error });
                    });
                } else {
                    res.status(401).send({ "error": "User does not exist" });
                }
            }
        });
    } else {
        //Forbidden
        res.status(403).send({ 'error': 'Required token' });
    }
}


/**
 * Verify temp jwt token 
 */
const verifyTempJwtToken = async (req, res, next) => {
    /** Verify Jwt Token */
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //split the space at the bearer
        const bearer = bearerHeader.split(' ');
        //Get token from string
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        jwt.verify(req.token,  process.env.tempSecretKey, function (err, decoded) {
            if (err) {
                res.status(401).send({ "message": "The link has been expired" });
            } else {
                //next middleweare
                res.locals.userId = decoded.userId;
                next();
            }
        });
    } else {
        //Fobidden
        res.status(403).send({ 'error': 'Required token' });
    }
}

/**
 * genarate temp jwt token
 * @param {*} userId  
 */
const generateTempJwtToken = async (userId) => {
    var payload = {
        'userId': userId
    }
    return await new Promise((resolve, reject) => {
        var token = jwt.sign(
            payload,
            process.env.tempSecretKey,
            { expiresIn:  process.env.tempExpireHours }
        );
        console.log(token)
        resolve({ token: token });
    });
}

/**
 * Get access token from refresh token 
 * @param {body} refreshToken
 */
async function GetAccessTokenUsingRefreshToken(refreshToken, tokenExpire, refreshTokenExpire) {
    return await new Promise(async (resolve, reject) => {
        await decodeJwtToken(refreshToken).then((decoded) => {
        console.log(decoded);
            if (decoded) {
                delete decoded.exp;
                delete decoded.iat;

                let token = jwt.sign(decoded, process.env.TOKEN_SECRETE_KEY, {
                    expiresIn: tokenExpire,
                })
                console.log(process.env.TOKEN_SECRETE_KEY);
                let expireIn = 0;
                jwt.verify(token, process.env.TOKEN_SECRETE_KEY, async function (err, decodes) {
                    if (err) {
                        console.log("[routes-utils-jwt_token-generateJwtToken]", err);
                        return { err };
                    }
                    expireIn = decodes.exp * 1000;
                });
                let refreshToken1 = jwt.sign(decoded, process.env.REFRESH_TOKEN_SECRETE_KEY, {
                    expiresIn: refreshTokenExpire,
                });
                resolve({ token: token, refreshToken: refreshToken1, expireIn });
            } else {
                reject("Invalid refresh token");
            }
        }).catch((error) => {
            reject("Invalid refresh token", error);
        });
    });
}

/**
 * Decode refresh token
 * @param {*} userId  
 */
const decodeJwtToken = async (refreshToken) => {
    // Handled promise
    return await new Promise(async (resolve, reject) => {
        //verify token
        jwt.verify(refreshToken,  process.env.REFRESH_TOKEN_SECRETE_KEY, function (err, decoded) {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        });
    });
}


/**
 * Protect api wrt role, scope
*/
const ProtectApiRbac = async (role, url, method) => {
    try {
        // get scopes of user role permission
        let scopes = permission_json.filter(x => x.roles.includes(role));
        // ternary operator define to add default empty arry bcs if not included json then not allow api
        scopes = scopes === null ? [] : scopes;
        if (!scopes.length || !scopes) {
            return false;
        }
        // get scope of urls if * contains then has all access else check particular url
        let scopeUrl = scopes[0]['method'][method.toLowerCase()];
        if (!scopeUrl) {
            return false;
        } else if (scopeUrl === '*') {
            return true;
        } else {
            let isMatched = false;
            scopeUrl.forEach(element => {
                let pattern = new UrlPattern(element);
                if (pattern.match(url)) {
                    isMatched = true;
                    return true
                }
            });
            return isMatched;
        }
    } catch (err) {
        return false
    }
}

module.exports = {
    generateJwtToken,
    verifyJwtToken,
    generateTempJwtToken,
    verifyTempJwtToken,
    GetAccessTokenUsingRefreshToken,
    ProtectApiRbac
}