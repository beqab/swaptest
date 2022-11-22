import SideMenu from "@components//asideMenu";
import MobilePageMenu from "@components//mobilePageMenu";
import { Button } from "antd";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProfileService } from "services/profile/profile.http";

const packages = [
  {
    id: 1,
    name: "package 1",
    currency: "USD",
    amount: 100,
    price: 10,
    position: 1,
    created_at: "2022-11-03T08:04:31.000000Z",
    updated_at: "2022-11-03T08:04:31.000000Z",
  },
  {
    id: 2,
    name: "package 2",
    currency: "USD",
    amount: 50,
    price: 5,
    position: 2,
    created_at: "2022-11-03T08:04:46.000000Z",
    updated_at: "2022-11-03T08:04:46.000000Z",
  },
  {
    id: 3,
    name: "package 3",
    currency: "USD",
    amount: 10,
    price: 1,
    position: 4,
    created_at: "2022-11-03T08:05:00.000000Z",
    updated_at: "2022-11-03T08:05:00.000000Z",
  },
];
// { key: 1, value: "$25" },

const Buy = () => {
  const [usdRate, setUsdRate] = useState(0.04);
  const [gAog, setGAog] = useState<string | number>("");
  const [usd, setUsd] = useState("");
  const [gAogValue, setAogValue] = useState("");
  const [usdValue, setUsdValue] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(0);

  const { authReducer } = useSelector((state: any) => state);

  console.log(authReducer, "authReducer");

  const [newPackagers, setNewPackagers] = useState([]);

  useEffect(() => {
    const closeSelect = () => setOpenDropdown(false);
    window.addEventListener("click", closeSelect);

    ProfileService.getPackages().then((res) => {
      setNewPackagers(res.data);
    });

    return () => window.removeEventListener("click", closeSelect);
  }, []);

  useEffect(() => {
    if ((window as any)?.cryptopay) {
      (window as any)?.cryptopay
        .Button({
          createPayment: function (actions) {
            return actions.payment.create({
              currency: "USD",
              amount: selectedPackage,
              order_id: 1,
              metadata: {
                user_id: authReducer.user.id,
              },
            });
          },
          onApprove: function (data, actions) {
            console.log("hereee approved");
            // Optional: add logic such as browser redirection or check data object content
          },
          defaultLang: "en-US", // Optional: default language for payment page
        })
        .render("#pay-button");
    }
  }, []);

  return (
    <div className="swapPage">
      <div className="withAsideMenu pageBg pageBgPoseidon aogPage d-block d-md-flex">
        <MobilePageMenu />
        <SideMenu />
        <section>
          <h2 className="text-center mt-5 pt-5">Buy GAOG tokens</h2>
          <p className="text-center">Buy tokens in an instant</p>
          <div className="swapWrapper swaptoken">
            <div className="swapInputWrapper swapInputWrapper_buy">
              <div className="d-flex flex-column">
                <div className="swapInputContain">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="label">USD</div>
                    <span className="font12">RATE: 1 GAOG = $0.04</span>
                  </div>
                  <div className="dropDown">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(true);
                      }}
                      className="dropDown_input"
                    >
                      {selectedPackage
                        ? selectedPackage + "$"
                        : "select package"}
                    </div>
                    <ul
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className={classNames("dropDown_options list-unstyle", {
                        isOpen: openDropdown,
                      })}
                    >
                      {newPackagers.length > 0
                        ? newPackagers.map((el, i) => {
                            return (
                              <li
                                key={i}
                                onClick={(e) => {
                                  setSelectedPackage(el.amount);
                                  setOpenDropdown(false);
                                }}
                              >
                                {el.amount}$
                              </li>
                            );
                          })
                        : packages.reverse().map((el, i) => {
                            return (
                              <li
                                key={i}
                                onClick={(e) => {
                                  setSelectedPackage(el.amount);
                                  setOpenDropdown(false);
                                }}
                              >
                                {el.amount}$
                              </li>
                            );
                          })}
                    </ul>
                  </div>
                </div>
                {/* <div className="text-center">
                  <img src="/icons/Component 42 – 13.svg" />
                </div> */}
                <br />
                <div className="swapInputContain">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="label">GAog</div>
                  </div>
                  <input
                    onChange={(e) => {
                      // setUsd(e.target.value);
                      setUsdValue((selectedPackage * usdRate).toString());
                      // setAogValue((selectedPackage / usdRate).toString());
                    }}
                    placeholder="0"
                    type="number"
                    value={(selectedPackage / usdRate).toString()}
                    name="gaog"
                  />
                </div>
                <div className="w-100 d-flex align-items-center justify-content-center">
                  <div id="pay-button"></div>
                </div>
                {/* <div>
                  <Button className="ant-btn ant-btn-default mt-2 buttonSwap">
                    <b> Buy with crypto.com </b>
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Buy;
