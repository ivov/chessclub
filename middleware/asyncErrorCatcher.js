const asyncErrorCatcher = passedFunction => {
  return async (request, response, next) => {
    try {
      await passedFunction(request, response);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = asyncErrorCatcher;
