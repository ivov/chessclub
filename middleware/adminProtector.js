const adminProtector = (request, response, next) => {
  if (!request.decodedPayload.is_admin)
    return response.status(403).send("Forbidden. User is not admin.");
  next();
};

module.exports = adminProtector;
