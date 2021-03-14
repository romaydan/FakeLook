import axios from 'axios';
import { NextFunction, Request, response, Response } from 'express';

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization: token } = req.headers;

    if (!token) {
      res.status(401).json({ statusCode: 401, error: 'No token provided!' });
      return;
    }

    const { data } = await axios.get(process.env.AUTH_SERVICE_API_URL + '/auth/validate', {
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
  } catch (error) {
    res.status(error.status).json(error.resoponse);
  }
};

export default validateToken;
