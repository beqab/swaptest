import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";

import { setCurrentUser } from "../redux/actions/authActions";
import Header from "../components/header";
import { FormGroup } from "../components/common/form/formGroup";
import { Button } from "../components/common/form/button";
import { Input } from "../components/common/form/index";
import { AuthService } from "../services/auth/auth.http";

interface ILoginForm {
  password: string;
  email: string;
}

interface IErrorMsg {
  email?: string | Array<string>;
  password?: string | Array<string>;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    formState: { errors: errors2 },
  } = useForm<ILoginForm>();
  const [errors, setErrors] = useState<IErrorMsg>({});
  const [load, setLoad] = useState(false);
  const [unVerify, setUnVerify] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const clearError = (key: keyof IErrorMsg) => {
    const errorsClone = { ...errors };
    delete errorsClone[key];

    setErrors(errorsClone);
  };

  const submit = handleSubmit(async (data: any) => {
    setLoad(true);

    try {
      const res = await AuthService.login(data);
      console.log(res);
      setLoad(false);

      dispatch(setCurrentUser(res.data.user));
      router.push("/swap");
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
      // console.log(e.response, "e.response");
      // debugger;
      if (e.response?.data?.message) {
        // setErrors(e.response.data.message);
        toast.error(e.response.data.message.error[0], {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  });

  return (
    <div className="loginPage pageBg aogPage">
      <ToastContainer />
      <Header />
      <h2 className="text-center">Login to Your Account</h2>
      <div className="container formContainer d-flex align-items-center  flex-row  justify-content-center ">
        <form onSubmit={submit} className="loginForm loginForm_wrapper">
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
              type="text"
              name={"email"}
              placeholder="example@mail.com"
              hasError={!!errors2?.email}
              onChange={() => {
                clearError("email");

                setUnVerify(false);
              }}
              // useRef={register("email")}
              {...register("email", {
                required: "email is required",
                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              })}
            />
          </FormGroup>
          <FormGroup errorMessage={errors2?.password?.message} Label="Password">
            <Input
              type="password"
              name={"password"}
              hasError={!!errors2?.password}
              onChange={() => {
                clearError("password");

                setUnVerify(false);
              }}
              placeholder="password"
              {...register("password", {
                required: "password is required",
              })}
            />
          </FormGroup>
          <div className="text-right">
            <Link href="/forgetPass">
              <a className="colorLight" href="">
                Forget password?
              </a>
            </Link>
          </div>
          <Button loading={load} className="btn btn-primary w-100 mt-3 mb-3">
            Log in
          </Button>
          <div className="d-flex justify-content-between">
            <Link href="/register">
              <a className="colorLight">Don`t have an account?</a>
            </Link>

            <Link href="/register">
              <a>
                <b>Create Account</b>
              </a>
            </Link>
          </div>
        </form>
        {/* <div>
          <svg
            className="d-none d-md-block"
            xmlns="http://www.w3.org/2000/svg"
            width="23.821"
            height="59.021"
            viewBox="0 0 23.821 59.021"
          >
            <line
              id="Line_131"
              data-name="Line 131"
              y1="58"
              x2="21"
              transform="translate(1.41 0.511)"
              fill="none"
              stroke="#727272"
              strokeWidth="3"
            />
          </svg>
          <div className="d-block d-md-none mt-5 mb-4">
            <b>OR</b>
          </div>
        </div> */}
        {/* <div> */}
        {/* <div className="socAuth_wrapper d-flex flex-column">
            <button className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19.923"
                height="20.25"
                viewBox="0 0 19.923 20.25"
              >
                <path
                  id="Icon_awesome-google"
                  data-name="Icon awesome-google"
                  d="M19.923,10.924c0,5.777-3.956,9.888-9.8,9.888a10.125,10.125,0,0,1,0-20.25,9.737,9.737,0,0,1,6.789,2.65l-2.756,2.65C10.554,2.383,3.85,5,3.85,10.688a6.342,6.342,0,0,0,6.275,6.393,5.475,5.475,0,0,0,5.748-4.364H10.125V9.234h9.639A8.876,8.876,0,0,1,19.923,10.924Z"
                  transform="translate(0 -0.563)"
                  fill="#fff"
                  opacity="0.8"
                />
              </svg>
              Sign in with Google
            </button>
            <button className="fbBtn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11.977"
                height="22.362"
                viewBox="0 0 11.977 22.362"
              >
                <path
                  id="Icon_awesome-facebook-f"
                  data-name="Icon awesome-facebook-f"
                  d="M12.8,12.579l.621-4.047H9.539V5.905a2.024,2.024,0,0,1,2.282-2.186h1.765V.273A21.528,21.528,0,0,0,10.453,0c-3.2,0-5.288,1.938-5.288,5.447V8.532H1.609v4.047H5.164v9.783H9.539V12.579Z"
                  transform="translate(-1.609)"
                  fill="#fff"
                  opacity="0.8"
                />
              </svg>
              Sign in with Facebook
            </button>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Login;
