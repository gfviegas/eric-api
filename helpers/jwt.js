const jwt = require('jsonwebtoken')

const getTokenFromRequest = (req) => {
  const authorization = req.header('authorization')
  return authorization.split(' ')[1] // Bearer
}

const middleware = (req, res, next) => {
  const token = getTokenFromRequest(req)
  if (token && token.length > 0) {
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({error: err.message.split(' ').join('_').toLowerCase()})
        return false
      }
      next()
    })
  } else {
    res.status(401).json({error: 'no_token'})
    return false
  }
}

module.exports = {
  getTokenFromRequest,
  middleware
}
