import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

export default (req, res, next) => {
  const authToken = req.headers.authorization

  if (!authToken) {
    res.status(401).json({ error: 'Token not provided!' })
  }

  const token = authToken.split(' ')[1]
  try {
    jwt.verify(token, authConfig.secret, function (err, decoded) {
      if (err) {
        throw new Error()
      }
      //   console.log(decoded)
      req.userId = decoded.id
      req.userName = decoded.name
      return next()
    })
  } catch (err) {
    res.status(401).send({ error: 'Invalid Token!' })
  }
}
