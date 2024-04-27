import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { signOut, useSession } from "next-auth/react";
import BackdropComponent from "./UI-component/backdrop";
import { closeMessage } from "./functions/message";

// Create the context
const MyContext = createContext();

// Create a provider component
const MyProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useState(null);
  const [warehouses, setWarehouses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [privileges, setPrivileges] = useState("");
  const [productIds, setProductIds] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employees, setEmployees] = useState("");
  const privilegeOptions = {
    Add_Employee: false,
    Add_Warehouse: false,
    Edit_Warehouse: false,
    Add_Shelf: false,
    Delete_Shelf: false,
    Add_Product_To_Shelf: false,
    Out_Of_Stock: false,
    Register_Product: false,
    Update_Product: false,
    Add_Privilege: false,
    Edit_Privilege: false,
    Add_Customer: false,
    Edit_Customer: false,
    View_Customer: false,
    View_Employee: false,
    Edit_Employee: false,
    Create_Order: false,
    View_Orders: false,
  };
  // const [isAuth, setIsAuth] = useState(false);
  // console.log(privileges);
  // const [data, setData] = useState(null);
  // function filterPrivileges(user) {
  //   const privilegeCommon = user.company.privilegesTemplate.filter(
  //     (template) => template.name === user.privilegesTemplate
  //   );
  //   if (privilegeCommon && privilegeCommon.length > 0) {
  //     setPrivileges(privilegeCommon[0].roles);
  //   }
  //   // console.log(privilegeCommon);
  //   // if (privilegeCommon && privilegeCommon.length > 0) {
  //   //   // const newPrivileges = { ...privilegeCommon[0].roles, ...user.privileges };
  //   //   // setPrivileges(newPrivileges);
  //   // } else {
  //   //   setPrivileges(user.privileges);
  //   // }
  // }
  // useEffect(() => {
  //   if (user && privileges === "") filterPrivileges(user);
  // }, [user, privileges]);
  // console.log(privileges);
  async function getUser() {
    // console.log("in");
    flag = 0;
    const { data: da } = await axios.post("/api/user/getDetails", {
      email: data.user.email,
    });
    // console.log(da);
    if (da) {
      if (da.data._id === da.data.company._id) setIsAdmin(true);
      else setPrivileges(da.data.privilegesTemplate.roles);
      setUser(da.data);
      // filterPrivileges(da.data);

      // update(da.data);
    }
    setLoading(false);
  }

  const { data, status, update } = useSession();
  // console.log(data);
  let flag = 1;
  useEffect(() => {
    if (data && data.user && !user) {
      setLoading(true);
      // if (data.user._id === data.user.company._id) setIsAdmin(true);
      // setUser(data.user);
      // filterPrivileges(data.user);
      if (flag) {
        getUser();
      }
      // setLoading(false);
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [data]);

  // useEffect(() => {
  //   if (!user && data) ;
  // }, [data, user]);
  // console.log(user);
  return (
    <MyContext.Provider
      value={{
        messageApi,
        user,
        setUser,
        loading,
        warehouses,
        setWarehouses,
        productIds,
        setProductIds,
        backDropOpen,
        setBackDropOpen,
        privileges,
        isAdmin,
        setIsAdmin,
        employees,
        setEmployees,
        setPrivileges,
        privilegeOptions,
        // filterPrivileges,
      }}
    >
      {contextHolder} {children}
      <BackdropComponent open={backDropOpen} setOpen={setBackDropOpen} />
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };
