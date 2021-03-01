import axios from 'axios';
import { NextFunction, Request, response, Response } from 'express';

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization: token } = req.headers;

  if (!token) {
    res.status(401).json({ statusCode: 401, error: 'No token provided!' });
    return;
  }

  const { data } = await axios.get('http://localhost:5000/auth/validate', {
    headers: {
      authorization: token,
    },
  });

  const { statusCode, error } = data;

  if (!error) {
    req['userId'] = data.userId;

    next();
    return;
  }

  res.status(statusCode).json({ statusCode: statusCode, error: error });
};

export default validateToken;
