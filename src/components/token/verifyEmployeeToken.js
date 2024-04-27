import jwt from "jsonwebtoken";

export default function verifyEmployeeToken(token) {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithm: "RS256",
    });
    if (decoded.email) {
      return { status: 200, msg: "User Verified", data: decoded };
    } else {
      return { status: 404, msg: "Access forbidden" };
    }
  } catch (error) {
    return { status: 404, msg: "Access forbidden" };
  }
}
