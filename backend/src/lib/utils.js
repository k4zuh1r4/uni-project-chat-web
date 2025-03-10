import jwt from 'jsonwebtoken';
export const generateToken = (userID, res) => {
    const token = jwt.sign({ userID }, process.env.TOKEN_KEY, {
        expiresIn: "30d"
    })
    res.cookie("jwt", token, {
        sameSite: "strict",
        httpOnly: true,
        maxAge: (7 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV !== "development"
    })
    return token
}