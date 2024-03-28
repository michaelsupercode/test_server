const crypto = require("crypto");
const jwt = require("jsonwebtoken")

function hash(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

function createRandomSalt() {
    return crypto.randomBytes(64).toString('hex');
}

function createPasswordHash(password, salt) {
    return hash(password + salt)
}

function createToken(user) {
    const TEN_MINUTES = 60 * 10
    const initiatedAt = Math.floor(Date.now() / 1000)
    const expiresAt = initiatedAt + TEN_MINUTES

    const tokenPayload = {
        sub: user._id,
        tokenType: "access",
        iat: initiatedAt,
        exp: expiresAt
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET)
    return token
}

function imageBufferToBase64(imgBuffer, mimeType) {
    return "data:" + mimeType + ";base64," + imgBuffer.toString('base64')
}

module.exports = {
    hash,
    createRandomSalt,
    createPasswordHash,
    createToken,
    imageBufferToBase64
}