"use client";

import EmployeeQuickDial from "@/src/components/UI-component/employeeQuickDial";
import QuickDial from "@/src/components/UI-component/speeDial";
import { MyContext } from "@/src/components/context";
import { closeMessage } from "@/src/components/functions/message";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import { Box, CircularProgress } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function NavbarLayout({ children }) {
  const params = useParams();
  const router = useRouter();
  const employeeRegex = /^\/dashboard\/employee(?:\/.*)?$/;
  const { messageApi, isAdmin, user, privileges } = useContext(MyContext);
  const pathname = usePathname();
  const { data, status } = useSession();
  const [loading, setLoading] = useState(true);
  function checkIfAuthentic() {
    setLoading(true);
    // if user in context
    if (params && params.id && user) {
      if (!isAdmin && !privileges.Add_Warehouse) {
        return user.warehouse.some((warehouse) => warehouse._id === params.id);
      } else if (isAdmin || (privileges && privileges.Add_Warehouse)) {
        return user.company.warehouses.includes(params.id);
      }
    }
    // if user is not in context(i.e page refreshed)
    else if (params && params.id && data && data.user) {
      const privilegeCommon = data.user.company.privilegesTemplate.filter(
        (template) => template.name === data.user.privilegesTemplate
      );
      let privileges = null;
      if (privilegeCommon && privilegeCommon.length > 0) {
        privileges = privilegeCommon[0].roles;
      }
      // console.log(privileges);
      if (
        !(data.user._id === data.user.company._id) &&
        privileges &&
        !privileges.Add_Warehouse
      ) {
        return data.user.warehouse.some(
          (warehouse) => warehouse._id === params.id
        );
      } else if (
        data.user._id === data.user.company._id ||
        (privileges && privileges.Add_Warehouse)
      ) {
        return data.user.company.warehouses.includes(params.id);
      }
    } else if (pathname === "/dashboard/warehouses") return true;
    return false;
  }

  useEffect(() => {
    if (status !== "loading" && user) {
      const isWarehouseIdPresent = checkIfAuthentic();
      if (!isWarehouseIdPresent && params.id) {
        // router.replace("/dashboard");
        router.replace("/dashboard", undefined, {
          onComplete: () => setLoading(false),
        });
        // return null;
      } else {
        setLoading(false);
      }
    }
  }, [params.id, data, status, user]);

  useEffect(() => {
    if (status === "unauthenticated") {
      closeMessage(messageApi, "Token Expired", "error");
      signOut();
    }
  }, [status]);

  if (loading)
    return (
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </div>
    );

  return (
    <DashboardLayout>
      {children}
      {params && params.id && (
        <div style={{ position: "fixed", bottom: "30px", right: "10px" }}>
          <QuickDial id={params.id} />
        </div>
      )}
      {employeeRegex.test(pathname) && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "10px",
            zIndex: "8888",
          }}
        >
          <EmployeeQuickDial />
        </div>
      )}
    </DashboardLayout>
  );
}
