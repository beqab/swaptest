import { EXTERNAL_URL } from "@constant/s";
import { NFT_LEVELS, NFT_MYTHOLOGIES } from "@constant/s/nft";
import { Col, Row } from "antd";
import Link from "next/link";
import React, { useEffect } from "react";
import { formatCurrency } from "utils/number";

type MyNftProps = {
  listNfts: any;
  loading: boolean;
  total: any;
  params: any;
};

const MyNft = ({ listNfts, loading, total, params }: MyNftProps) => {
  return (
    <div className="myNft">
      <Row gutter={[{ xs: 12, sm: 26 }, 20]}>
        {loading ? (
          <Col span={24}>
            <div className="loading_icon">
              <img src="/icons/loading_icon.svg" alt="" />
            </div>
          </Col>
        ) : total > 0 ? (
          <>
            {listNfts.map((el, idx) => (
              <Col xs={12} sm={12} xl={6} key={idx}>
                <div className="myNft-contain">
                  <Link href={`${EXTERNAL_URL.AGE_OF_GOD}/${el._id}`}>
                    <a target="_blank">
                      <div className="myNft-header">
                        <div className="myNft-header__left">{el?.class}</div>
                        <div className="myNft-header__right">
                          <img
                            src={
                              NFT_LEVELS.find((e: any) => e.name === el.level)
                                ?.icon
                            }
                            alt=""
                            className="myNft-logo"
                          />
                          <img
                            className="myNft-logo"
                            src={
                              NFT_MYTHOLOGIES.find(
                                (e: any) => e.name === el.mythology
                              )?.icon
                            }
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="myNft-main">
                        <img
                          src={el?.avatarUrl}
                          className="myNft-image"
                          alt=""
                        />
                        <div className="myNft-god">{el.god}</div>
                      </div>
                      <div className="myNft-footer">
                        <div className="myNft-name">{el?.name}</div>
                        <div className="myNft-sub">
                          {el?.totalCopies === 1 ? "Edition" : "Editions"} of{" "}
                          {formatCurrency(el?.totalCopies?.toString())}
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              </Col>
            ))}
          </>
        ) : !params?.searched && total === 0 ? (
          <div className="myNft-connect">
            <img src="/icons/icon-wallet-solid.svg" alt="" />
            <div className="titleConnect">
              You do not have any NFTs in your wallet
            </div>
            <a
              target="_blank"
              href="https://nft.ageofgods.net/"
              rel="noreferrer"
              className="btn aogBtn btn-primary w-100 mt-3 mb-3 btnConnectWallet"
            >
              Buy now
            </a>
          </div>
        ) : (
          <div className="noData">
            There are no matched NFTs <br />
            Please try again
          </div>
        )}
      </Row>
    </div>
  );
};

export default MyNft;
