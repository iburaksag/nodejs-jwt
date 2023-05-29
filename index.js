import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import { authMiddleware } from './middleware.js'

dotenv.config()

const app = express()
app.use(express.json())

const user = {
    username: "admin",
    email: "admin@gmail.com",
    password: "123456"
}

const animalsArray = [
    {
        name: "Giraffe",
        createdAt: new Date()
    },
    {
        name: "Elephant", 
        createdAt: new Date()
    },
    {
        name: "Lion",
        createdAt: new Date()
    },
];

let refreshTokens = [];

app.get("/animals", authMiddleware, (req, res) => {
    console.log(req.user)
    res.json(animalsArray)
})
app.post("/refresh", async (req,res) => {
    const { refreshToken } = req.body
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshToken.includes(refreshToken)) return res.sendStatus(401)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if (err){
            console.log(err);
            return res.status(400).json(err);
        }

        //create a new access token
        const accessToken = jwt.sign({ email: data.email, username: data.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });

        return res.status(200).json({ accessToken})
    })
})

//Login process
app.post("/login", async(req, res) => {
    const { email, password } = req.body

    if (email !== user.email || password !== user.password)
        return res.status(401).json({ message: "Invalid Information"});
       
    //creation of access and refresh token for user

    const accessToken = jwt.sign({ email: user.email, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });

    const refreshToken = jwt.sign({ email: user.email, username: user.username }, process.env.REFRESH_TOKEN_SECRET);

    refreshTokens.push(refreshToken)

    return res.status(200).json({ accessToken, refreshToken })
})

app.post("/logout", async(req, res) => {
    console.log(refreshTokens)
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken)
    res.sendStatus(200);
})

app.listen(6000, () => {
    console.log("Server is ready on Port 6000")
})

