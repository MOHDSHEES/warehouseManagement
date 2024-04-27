"use client";
import { MyContext } from "@/src/components/context";
import { Alert, Container, Skeleton, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { closeMessage } from "@/src/components/functions/message";
import PrivilegesCard from "@/src/components/employee/privilegesCard";
import EditPrivilegesModel from "@/src/components/employee/privilages/editPrivilegesModel";
import UpdatePrivileges from "@/src/components/update/privileges";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";

const Page = () => {
  const { user, messageApi } = useContext(MyContext);
  const [selectedPrivilege, setSelectedPrivilege] = useState("");
  const [openEditPrivilegesModel, setOpenEditPrivilegesModel] = useState(false);
  const [openUpdatePrivileges, setOpenUpdatePrivileges] = useState(false);
  const [loading, setLoading] = useState(false);

  function openEditModel(template) {
    // console.log(template);
    setSelectedPrivilege(template);
    setOpenEditPrivilegesModel(true);
  }
  //   console.log(user);
  const [privilegesTemplates, setPrivilegesTemplates] = useState("");
  async function getTemplates() {
    setLoading(true);
    flag = 0;
    const { data } = await axios.post("/api/user/privilegeTemplate/get", {
      company: user.company._id,
    });
    if (data.status === 200) setPrivilegesTemplates(data.data);
    else
      closeMessage(
        messageApi,
        `Data is not updated. Please try later. error: ${error}`,
        error
      );
    setLoading(false);
  }
  let flag = 1;
  useEffect(() => {
    if (flag && user) getTemplates();
  }, [user]);
  return (
    <UserAccessLayout>
      <Container requiredprivilege="Edit_Privilege" maxWidth="xl">
        <Typography variant="h4">Privileges Templates</Typography>

        <Stack spacing={3} className="mt-5">
          {loading ? (
            <Stack spacing={2}>
              <Skeleton variant="rounded" height={140} />
              <Skeleton variant="rounded" height={140} />
            </Stack>
          ) : privilegesTemplates && privilegesTemplates.length > 0 ? (
            privilegesTemplates.map((template, idx) => {
              return (
                <PrivilegesCard
                  key={idx}
                  template={template}
                  setOpen={openEditModel}
                />
              );
            })
          ) : (
            <Alert icon={false} severity="info">
              No templates were found. Consider adding templates for more
              organized privilege control..
            </Alert>
          )}
        </Stack>
      </Container>
      <EditPrivilegesModel
        requiredprivilege="Edit_Privilege"
        open={openEditPrivilegesModel}
        setOpen={setOpenEditPrivilegesModel}
        setUpdateModel={setOpenUpdatePrivileges}
        setData={setSelectedPrivilege}
        privilegesTemplates={privilegesTemplates}
        setPrivilegesTemplates={setPrivilegesTemplates}
        data={selectedPrivilege}
      />
      <UpdatePrivileges
        requiredprivilege="Edit_Privilege"
        open={openUpdatePrivileges}
        setOpen={setOpenUpdatePrivileges}
        setData={setSelectedPrivilege}
        data={selectedPrivilege}
        privilegesTemplates={privilegesTemplates}
        setPrivilegesTemplates={setPrivilegesTemplates}
        setOpenEditPrivilegesModel={setOpenEditPrivilegesModel}
      />
    </UserAccessLayout>
  );
};

export default Page;
