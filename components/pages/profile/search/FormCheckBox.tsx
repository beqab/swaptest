import { NFT_MYTHOLOGIES } from "@constant/s/nft";
import { Button, Checkbox, Col, Row, Select } from "antd";

type FormCheckBoxProps = {
  value: any;
  handleSelectChange: any;
  type: string;
  title: string;
  options: any;
};

const FormCheckBox = ({
  value,
  handleSelectChange,
  type,
  title,
  options,
}: FormCheckBoxProps) => {
  const CheckboxGroup = Checkbox.Group;
  return (
    <>
      <div className="filterNft-title">{title}</div>
      <CheckboxGroup value={value} onChange={handleSelectChange(type)}>
        <Row gutter={[0, 15]}>
          {options?.map((el, idx) => (
            <Col xs={12} span={8} key={idx}>
              <Checkbox value={el.value}>{el.name}</Checkbox>
            </Col>
          ))}
        </Row>
      </CheckboxGroup>
    </>
  );
};

export default FormCheckBox;
