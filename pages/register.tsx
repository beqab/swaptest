import React, { useState } from "react";
import Header from "../components/header";
import { FormGroup } from "../components/common/form/formGroup";
import { Button } from "../components/common/form/button";
import { Input } from "../components/common/form/index";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

import { AuthService } from "../services/auth/auth.http";

import Link from "next/link";

interface IRegister {
  password: string;
  email: string;
  password_repeat: string;
}

interface IErrorMsg {
  email?: string | Array<string>;
  password?: string | Array<string>;
  password_repeat?: string | Array<string>;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    watch,
    setError,
    formState: { errors: errors2 },
  } = useForm<IRegister>();
  const [load, setLoad] = useState(false);
  // const [errors, setErrors] = useState<IErrorMsg>({});

  const submit = handleSubmit(async (data) => {
    setLoad(true);
    try {
      const res = await AuthService.register({
        ...data,
        type: "customer",
      });

      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoad(false);
    } catch (e) {
      setLoad(false);
      if (e.response?.status === 500 || !e.response?.data) {
        toast.error("sever error try again", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      if (e.response?.data?.message) {
        // setErrors(e.response.data.message);
        if (e.response?.data?.message.password) {
          setError("password", {
            message: e.response?.data?.message.password,
          });
        }
      }
    }
    // console.log(data, "dddd");
    // debugger;
  });

  console.log(errors2);
  // debugger;

  return (
    <div className="loginPage pageBg aogPage">
      <ToastContainer />
      <Header />
      <h2 className="text-center">Create New Account</h2>
      <div className="container formContainer d-flex align-items-center flex-column flex-md-row  ">
        <form onSubmit={submit} className="loginForm loginForm_wrapper m-auto">
          <FormGroup
            errorMessage={
              errors2?.email?.message
                ? errors2?.email?.message
                : errors2?.email?.type === "pattern"
                ? "please enter valid email address"
                : ""
            }
            Label="Email"
          >
            <Input
              onChange={() => clearErrors("email")}
              useRef={register("email", {
                required: "email is require",
                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              })}
              hasError={!!errors2.email}
              name="email"
              type="text"
              placeholder="example@mail.com"
            />
          </FormGroup>
          <FormGroup errorMessage={errors2?.password?.message} Label="Password">
            <Input
              type="password"
              name="password"
              onChange={() => clearErrors("password")}
              useRef={register("password", {
                required: "password is required",
              })}
              placeholder="Password"
              hasError={!!errors2?.password}
            />
          </FormGroup>
          <FormGroup
            errorMessage={
              errors2?.password_repeat ? "wrong password confirmation" : ""
            }
            Label="Confirm Password"
          >
            <Input
              type="password"
              name="password_repeat"
              onChange={() => clearErrors("password_repeat")}
              useRef={register("password_repeat")}
              {...register("password_repeat", {
                // min: 3,
                required: true,
                validate: (value) => value === watch("password"),
              })}
              placeholder="Repeat Password"
              hasError={!!errors2?.password_repeat}
            />
          </FormGroup>
          <div className="text-right">
            <Link href="/">
              <a className="colorLight" href="">
                Forget password?
              </a>
            </Link>
          </div>
          <Button loading={load} className="btn btn-primary w-100 mt-3 mb-3">
            Sign Up
          </Button>
          <div className="d-flex justify-content-between">
            <Link href="/login">
              <a className="colorLight">Already have an account?</a>
            </Link>

            <Link href="/login">
              <a>
                <b>Log in</b>
              </a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
