import JWT from "jsonwebtoken"


export const isAuthenticated  = async(req, res, next) => {
   try {
     const token = req.cookies.token
    if (!token) {
        return res.status(401).json({message: "user not authenticated"})
    }
    const decode = await JWT.verify(token, process.env.JWT_SCERET )

    if (!decode) {
        return res.status(401).json({message: "Invalid token"})
    }
      req.id = decode.userID
     next()
   } catch (error) {
    console.log(error);
   }
}