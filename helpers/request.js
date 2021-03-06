
const createQueryObject = (req) => {
  let reqQuery = Object.assign({}, req.query)
  if (reqQuery.hasOwnProperty('filter')) delete reqQuery.filter
  if (reqQuery.hasOwnProperty('page')) delete reqQuery.page
  if (reqQuery.hasOwnProperty('limit')) delete reqQuery.limit
  return reqQuery
}

module.exports = {
  createQueryObject: createQueryObject
}
