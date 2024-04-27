import React, { useContext } from "react";
import { MyContext } from "../context";
import Loading from "../UI-component/loading";
import { Alert } from "@mui/material";

const UserAccessLayout = ({ children }) => {
  const { privileges, loading, isAdmin } = useContext(MyContext);
  // const roles = ["os", "warehouse1", "outOfStock"];
  //   const child = React.Children.only(children);

  //   // Accessing the key prop of the child
  //   const childKey = child.props.role;
  //   console.log(childKey);
  let childRendered = false;
  if (loading) return <Loading />;
  return (
    <>
      {React.Children.map(children, (child) => {
        // console.log(child.props.requiredprivilege);
        // console.log(privileges[child.props.requiredprivilege]);
        if (
          isAdmin ||
          !child.props.requiredprivilege ||
          (child.props.requiredprivilege &&
            privileges[child.props.requiredprivilege])
        ) {
          // console.log("in");
          childRendered = true;
          return child;
        }
      })}
      {!childRendered && (
        <Alert severity="error">
          <b>Permission denied.</b> You do not have the required access to view
          this content.
        </Alert>
      )}
      {/* {roles.includes(childKey) && children} */}
    </>
  );
};

export default UserAccessLayout;
