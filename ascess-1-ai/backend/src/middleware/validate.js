import { ApiError } from '../utils/response.js';

export const validateRequest = (schema) => (req, res, next) => {
  try {
    const result = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.validated = result;
    next();
  } catch (err) {
    const formattedErrors = err.errors ? err.errors.map(e => ({ field: e.path.join('.'), message: e.message })) : err;
    next(new ApiError(400, 'Validation Error', formattedErrors));
  }
};
