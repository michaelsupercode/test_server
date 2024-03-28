const { findUserByEmail } = require("../db-access/users-dao");
const { makeUser } = require("../domain/User");
const { createPasswordHash, createToken } = require("../utils/hash");

async function login({ email, password }) {

    const invalidLoginMsg = "Invalid login."

    const foundUser = await findUserByEmail(email)
    if (!foundUser) {
        throw new Error(invalidLoginMsg)
    }

    const user = makeUser(foundUser)
    const passwordHash = createPasswordHash(password, user.passwordSalt)
    const correctPassword = user.passwordHash === passwordHash
    if (!correctPassword) {
        throw new Error(invalidLoginMsg)
    }

    const token = createToken(user)
    return token
}

module.exports = {
    login
}