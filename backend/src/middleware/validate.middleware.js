import ApiError from "../utils/api-error.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  
  if (!result.success) {
    const errors = {};
    
    result.error.issues.forEach((err) => {
      const field = err.path[0];
      if (!errors[field]) {
        errors[field] = [];
      }
      
      errors[field].push(err.message);
    });

    console.log(errors)
    return res.status(400).json({ errors });
  }
  

  req.body = result.data;
  next();
};
