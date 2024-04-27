import React, { useContext, useState } from "react";
import axios from "axios";
import { closeMessage } from "../functions/message";
import { MyContext } from "../context";
import { useRouter } from "next/navigation";

const EmployeeRegister = ({ data }) => {
  // console.log(data);
  // const { token } = useParams();
  // let navigate = useNavigate();
  const { messageApi, setBackDropOpen } = useContext(MyContext);
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setstate] = useState({
    name: "",
    gender: "",
    address: "",
    password: "",
  });
  const Inputchange = (event) => {
    const { name, value } = event.target;
    setstate({
      ...state,
      [name]: value,
    });
  };
  function clear() {
    setstate({
      name: "",
      gender: "",
      address: "",
      password: "",
    });
    setConfirmPassword("");
  }
  async function submitHandler(e) {
    e.preventDefault();
    const details = {
      ...state,
      email: data.email,
      post: data.post.trim(),
      joiningDate: data.joiningDate,
      jobType: data.jobType,
      warehouse: data.warehouse,
      privilegesTemplate: data.privilegesTemplate,
      company: data.company,
    };
    if (state.password === confirmPassword) {
      setBackDropOpen(true);
      const { data } = await axios.post("/api/employee/register", {
        details,
      });
      if (data && data.status === 200) {
        closeMessage(messageApi, data.msg, "success");
        clear();
        router.replace("/");
        // navigate("/", { replace: true });
      } else if (data && data.status === 11000) {
        closeMessage(messageApi, data.msg, "error");
        clear();
        router.replace("/");
        // navigate("/", { replace: true });
      } else closeMessage(messageApi, data.msg, "error");
    } else {
      closeMessage(messageApi, "Password Mismatch", "error");
    }
    setBackDropOpen(false);
    // // console.log(data);
  }
  return (
    <div>
      <div>
        <section className=" gradient-custom">
          <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center h-100">
              <div className="col-12 ">
                <div
                  className="card shadow-2-strong card-registration"
                  style={{ borderRadius: "15px" }}
                >
                  <div className="card-body p-4 p-md-5">
                    <div style={{ textAlign: "center" }}>
                      <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">
                        Employee Registration
                      </h3>
                    </div>
                    <div className="pb-3">
                      <small>
                        Disclaimer: Your Data security is our priority. It will
                        only be used to keep the record. We will not disclose or
                        share you data with anyone.
                      </small>
                    </div>
                    <form onSubmit={submitHandler} class="row g-3">
                      <div class="col-md-4">
                        <label for="inputEmail4" class="form-label">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={data && data.email}
                          required
                          class="form-control"
                          disabled
                          readOnly
                        />
                      </div>
                      <div class="col-md-4">
                        <label for="inputPassword4" class="form-label">
                          Post *
                        </label>
                        <input
                          type="text"
                          value={data && data.post}
                          required
                          class="form-control"
                          disabled
                          readOnly
                        />
                      </div>
                      <div class="col-md-4">
                        <label for="inputPassword4" class="form-label">
                          Joining Date *
                        </label>
                        <input
                          type="date"
                          value={data && data.joiningDate}
                          required
                          class="form-control"
                          disabled
                          readOnly
                        />
                      </div>
                      <div class="col-md-4">
                        <label for="inputPassword4" class="form-label">
                          Job Type *
                        </label>
                        <input
                          type="text"
                          value={data && data.jobType}
                          disabled
                          readOnly
                          required
                          class="form-control"
                        />
                      </div>
                      <div class="col-md-4">
                        <label for="inputPassword4" class="form-label">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={state.name}
                          onChange={Inputchange}
                          required
                          class="form-control"
                        />
                      </div>
                      <div class="col-md-4">
                        <label for="inputPassword4" class="form-label">
                          Gender *
                        </label>
                        <select
                          value={state.gender}
                          onChange={Inputchange}
                          name="gender"
                          required
                          class="form-select"
                        >
                          <option selected value="">
                            Choose...
                          </option>
                          <option value="male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div class="col-12">
                        <label for="inputAddress" class="form-label">
                          Address *
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputAddress"
                          name="address"
                          required
                          value={state.address}
                          onChange={Inputchange}
                          placeholder="Enter address"
                        />
                      </div>

                      <div class="col-md-6">
                        <label for="password" class="form-label">
                          Password *
                        </label>
                        <input
                          type="password"
                          name="password"
                          required
                          value={state.password}
                          onChange={Inputchange}
                          class="form-control"
                          id="password"
                        />
                      </div>
                      <div class="col-md-6">
                        <label for="cpassword" class="form-label">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          name="pincode"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          class="form-control"
                          id="cpassword"
                        />
                      </div>

                      <div class="col-2">
                        <button type="submit" class="btn btn-primary">
                          Register
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployeeRegister;
