import { NFT_CLASSES, NFT_LEVELS, NFT_MYTHOLOGIES } from "@constant/s/nft";
import { Button, Checkbox, Select } from "antd";
import FormCheckBox from "./FormCheckBox";
type FilterNftProps = {
  params: any;
  handleSelectChange: any;
  setActiveModalFilter: any;
};

const FilterNft = ({
  params,
  handleSelectChange,
  setActiveModalFilter,
}: FilterNftProps) => {
  const dataSearch = [
    {
      value: params?.mythologies,
      type: "mythologies",
      title: "Mythology",
      options: NFT_MYTHOLOGIES,
    },
    {
      value: params?.levels,
      type: "levels",
      title: "God",
      options: NFT_LEVELS,
    },
    {
      value: params?.classes,
      type: "classes",
      title: "Class",
      options: NFT_CLASSES,
    },
  ];

  return (
    <div className="filterNft sortNft">
      <img
        src="/icons/icon_close.svg"
        alt=""
        onClick={() => {
          setActiveModalFilter(false);
        }}
        className="iconClose"
      />
      <div className="sortNft-contain">
        {dataSearch.map((el, idx) => (
          <FormCheckBox
            key={idx}
            value={el.value}
            handleSelectChange={handleSelectChange}
            type={el.type}
            title={el.title}
            options={el.options}
          />
        ))}
      </div>
    </div>
  );
};
export default FilterNft;
