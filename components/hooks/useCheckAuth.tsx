import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ProfileService } from "../../services/profile/profile.http";
import { setAuthorizationToken } from "../../services/axios-with-token";
import { setCurrentUser } from "../../redux/actions/authActions";

export const UseCheckAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!(window as any).hasCheckedAuth) {
        // debugger;
        setAuthorizationToken(localStorage.getItem("token")!);
        // if (localStorage.getItem("user")) {
        //   dispatch(setCurrentUser(JSON.parse(localStorage.getItem("user"))));
        // } else {
        // ProfileService.getUser(localStorage.getItem("token"))
        //   .then((res) => {
        //     (window as any).hasCheckedAuth = true;
        //     dispatch(setCurrentUser(res.data.user));
        //   })
        //   .catch((err) => {
        //     localStorage.removeItem("token");
        //     localStorage.removeItem("user");
        //     router.push("/login");

        //     console.log(err);
        //   });
        // }
      }
    } else {
      router.push("/login");
    }
  }, []);
};
