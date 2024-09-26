import jwt from "jsonwebtoken";

interface JwtPayload {
  _id: string;
  email: string;
}

class JwtService {
  static sign(
    payload: JwtPayload,
    secret: string = process.env.ACCESS_TOKEN_KEY || "",
    expiry = "30m"
  ) {
    const token = jwt.sign(payload, secret, { expiresIn: expiry });
    return token;
  }

  static verify(
    token: string,
    secret: string = process.env.ACCESS_TOKEN_KEY || ""
  ): JwtPayload {
    return jwt.verify(token, secret) as JwtPayload;
  }
}

export default JwtService;
