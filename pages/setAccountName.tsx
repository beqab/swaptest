import React from "react";
import Header from "../components/header";
import { FormGroup } from "../components/common/form/formGroup";
import { Button } from "../components/common/form/button";
import { Input } from "../components/common/form/index";
import Link from "next/link";

const setAccountName = () => {
  return (
    <div className="loginPage pageBg aogPage">
      <Header />
      <h2 className="text-center">Set your account name</h2>
      <div className="container formContainer d-flex align-items-center flex-column flex-md-row  ">
        <div className="loginForm loginForm_wrapper m-auto">
          <FormGroup Label="Your account name">
            <Input placeholder="Your account name" />
          </FormGroup>

          <Button className="btn btn-primary w-100 mt-3 mb-3">
            Set Account Name
          </Button>
        </div>
      </div>
    </div>
  );
};

export default setAccountName;
