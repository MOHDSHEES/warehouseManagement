import jwt from "jsonwebtoken";

export default function getEmployeeToken(user) {
  return jwt.sign(
    {
      email: user.state.email,
      post: user.state.post,
      joiningDate: user.state.joiningDate,
      jobType: user.state.jobType,
      privilegesTemplate: user.privilegesTemplate,
      warehouse: user.warehouse,
      company: user.company,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "864000s",
    }
  );
}
