import SideMenu from "@components//asideMenu";
import Header from "@components//header";
import MobilePageMenu from "@components//mobilePageMenu";
import React, { useState } from "react";
import classnames from "classnames";
import Link from "next/link";

const SuccessModal = () => {
  const [alert, setAlert] = useState(false);

  const alertTrigger = () => {
    setAlert(true);

    setTimeout(() => {
      return setAlert(false);
    }, 2500);
  };

  return (
    <>
      <div className="d-block d-md-none">
        <Header />
      </div>
      <div className="withAsideMenu pageBg pageBgPoseidon aogPage d-block d-md-flex">
        <MobilePageMenu />
        <SideMenu />
        <section className="d-flex ">
          <div className="pageProfile">
            <div className="profileTitle">
              {" "}
              <svg
                style={{
                  width: "30px",

                  marginRight: "9px",
                }}
                xmlns="http://www.w3.org/2000/svg"
                width={40}
                viewBox="0 0 640 512"
              >
                <path
                  fill="#fff"
                  d="M480.07 96H160a160 160 0 1 0 114.24 272h91.52A160 160 0 1 0 480.07 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z"
                />
              </svg>
              <span>Play AgeOfGods</span>
            </div>
            <div className="text-center mt-5 d-flex playPageContent">
              <Link href="https://play.google.com/store/apps/details?id=com.spidersilk.ageofgods">
                <a target="_blank" className="p-0">
                  <img height={70} src="/img/log-02.png" />
                </a>
              </Link>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  alertTrigger();
                }}
                href=""
                className={classnames("comingSoon", {
                  alertAnimate: alert,
                })}
              >
                <span className="alert">Coming Soon</span>
                <img height={70} src="/img/log-03.png" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SuccessModal;
