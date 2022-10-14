import { Request } from 'express';
import jwt from 'jsonwebtoken';

export const getUser = async (req: Request) => {
  const bearerHeader = req.headers.authorization;
  req.headers.authorization;

  if (bearerHeader) {
    const [, accesToken] = bearerHeader.split(' ');

    try {
      const payload = jwt.verify(
        accesToken,
        process.env.SECRET || 'gCtvpTciwl/nPSvvWQrqn+kIXB7A/SpvRXX5CtfJNDI=',
      );

      return payload;
      // const user = await User.findOne((payload as any).userId);

      // return user;
    } catch (err) {
      return undefined;
    }
  }
  return undefined;
};