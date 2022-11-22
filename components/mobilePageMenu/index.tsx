import React, { useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { AuthService } from "services/auth/auth.http";
import { useDispatch } from "react-redux";
import { setUserSignOut } from "redux/actions";
import { Carousel } from "antd";

const MobilePageMenu = () => {
  const router = useRouter();
  const { deactivate } = useWeb3React();
  const dispatch = useDispatch();
  const Logout = async () => {
    deactivate();
    await AuthService.logout({
      logout_type: 1,
    });
    localStorage.removeItem("game_access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(setUserSignOut(""));
    router.push("/login");
  };

  const settings = {
    dots: false,
    draggable: true,
    infinite: false,
    slidesToShow: 3,
    swipeToSlide: true,
    className: "service carousel-category",
    variableWidth: true,
  };

  return (
    <div className="mobilePageMenu d-flex d-md-none">
      <ul>
        <li>
          <Link href={"/my-nft"}>
            <a
              className={classNames({
                active: router.pathname === "/my-nft",
              })}
            >
              My NFTs
            </a>
          </Link>
        </li>
        <li>
          <Link href={"https://ageofgods.net/"}>
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href={"/play"}>
            <a>Play</a>
          </Link>
        </li>

        <li>
          <Link href={"/swap"}>
            <a
              className={classNames({
                active:
                  router.pathname === "/swap" ||
                  router.pathname === "/swapHistory",
              })}
            >
              Swap
            </a>
          </Link>
        </li>
        {/* <li>
          <Link href={"/buy"}>
            <a
              className={classNames({
                active: router.pathname === "/buy",
              })}
            >
              Buy
            </a>
          </Link>
        </li> */}
        <li>
          <Link href={"/"}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                Logout();
              }}
            >
              <span>Sign out</span>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MobilePageMenu;
