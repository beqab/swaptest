import { Input } from "antd";

import { MAX_INPUT_LENGTH } from "constants/size";
import { FC } from "react";

type FormKeyworkType = {
  keyword: string;
  placeholder: string;
  setKeyword: any;
  onDebounceParams: any;
};

const FormKeywork: FC<FormKeyworkType> = ({
  keyword,
  setKeyword,
  onDebounceParams,
  placeholder,
}) => {
  const handleInputChange = (event: any) => {
    setKeyword(event?.target?.value);
    onDebounceParams("keyword", event?.target?.value);
  };

  const handleInputBlur = (event: any) =>
    setKeyword(event?.target?.value?.trim());

  return (
    <Input
      prefix={<img src="/icons/search_icon.svg"  alt="search_icon"/>}
      placeholder={placeholder}
      className="body__input"
      maxLength={MAX_INPUT_LENGTH}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      value={keyword}
    />
  );
};

export default FormKeywork;
