import React, { useCallback, useEffect, useState } from "react";
import FormKeywork from "./FormKeywork";
import { debounce } from "lodash";
import { Button } from "antd";
import SortNft from "./SortNft";
import FilterNft from "./FilterNft";
import Link from "next/link";

type SearchProps = {
  onSetParams: any;
  params: any;
  initParams: any;
};
const SearchNft = ({ onSetParams, params, initParams }: SearchProps) => {
  const [keyword, setKeyword] = useState("");
  const [activeModalSort, setActiveModalSort] = useState(false);
  const [activeModalFilter, setActiveModalFilter] = useState(false);
  const handleDebounceParams = useCallback(
    debounce((name: string, value: string | number) => {
      onSetParams({
        ...params,
        [name]: value.toString().trim(),
        page: 1,
        searched: true,
      });
    }, 1000),
    [params]
  );

  const handleSelectChange = (name: string) => (value: any) =>
    onSetParams({
      ...params,
      [name]: value,
      page: 1,
      searched: true,
    });

  return (
    <div className="search">
      {activeModalSort && (
        <SortNft
          setActiveModalSort={setActiveModalSort}
          onSetParams={onSetParams}
          params={params}
        />
      )}
      {activeModalFilter && (
        <FilterNft
          params={params}
          handleSelectChange={handleSelectChange}
          setActiveModalFilter={setActiveModalFilter}
        />
      )}
      <div className="search--left">
        <FormKeywork
          keyword={keyword}
          setKeyword={setKeyword}
          onDebounceParams={handleDebounceParams}
          placeholder="Search by NFT Name God..."
        />
      </div>
      <div className="search--right">
        <Link href={"https://nft.ageofgods.net/"}>
          <a target="_blank">
            <Button className="button-search">Buy More NFTs</Button>
          </a>
        </Link>
        <Button
          className="button-search button-sort"
          onClick={() => setActiveModalSort(true)}
        >
          <img src="/icons/sort.svg" alt="" /> Sort By
        </Button>
        <Button
          className="button-search btnFilter"
          onClick={() => {
            setActiveModalFilter(true), setActiveModalSort(false);
          }}
        >
          <img src="/icons/filter.svg" alt="" /> Filter
        </Button>
      </div>
    </div>
  );
};

export default SearchNft;
