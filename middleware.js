import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2ODUxMTQzODMsImV4cCI6MTY4NTExNDQxM30.HmcozW7juF6c_BJjREzl0ObVOecWaqvJmzYfeWBwnEA
    const token = req.headers['authorization']?.split(' ')[1]

    if(!token) return res.status(401).json({message: "Please Login" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) {
            console.log(err)
            return res.status(400).json(err)
        }
        req.tokenPayload = payload;
        next()
    })
}