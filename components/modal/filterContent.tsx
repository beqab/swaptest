import React, { useEffect, useState } from "react";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { Checkbox, Col, Radio, Row } from "antd";
import { TRANSACTION_STATUS_HISTORY } from "../../constants";
import moment from "moment";
import { useRouter } from "next/router";

const FilterContent = ({
  changeFilter,
  dayFrom,
  dayTo,
  setDayFrom,
  setDayTo,
}) => {
  const [minDay, setMinDay] = useState();
  const [checkBox, setCheckBox] = useState([]);
  const maxDate = moment().toDate();
  const [checkAll, setCheckAll] = useState(false);
  const router = useRouter();
  const {
    query: { name },
  } = router;

  useEffect(() => {
    if (name === "0") {
      changeFilter({ type: "status", value: 0 });
      const newCheckBox = listsStatus.map((el) => Number(el.value));
      setCheckBox(newCheckBox);
      setCheckAll(true);
    } else if (name && name !== "0") {
      changeFilter({ type: "status", value: name });
      const dataCheckBox = name && name.toString().split(",");
      const newData = dataCheckBox && dataCheckBox?.map((el) => Number(el));
      setCheckBox(newData || []);
    } else if (!name) {
      changeFilter({ type: "status", value: 0 });
    }
  }, [name]);

  const changeDatePicker = (flag, d) => {
    changeFilter({ type: "date", flag, value: d.value });
    setMinDay(d.value);
    if (flag === "from") {
      setDayFrom(moment(d.value).format("DD.MM.YYYY"));
    } else setDayTo(moment(d.value).format("DD.MM.YYYY"));
  };

  const changeStatus = (event: any) => {
    const convertType = event.toString("&&");
    setCheckBox(event);

    setCheckAll(event.length === listsStatus.length);

    router.push(
      {
        pathname: "/swap",
        query: { name: convertType },
      },
      undefined,
      { shallow: false }
    );
  };

  // const onCheckAllChange = (e) => {
  //   const newCheckBox = listsStatus.map((el) => Number(el.value));
  //   setCheckBox(e.target.checked ? newCheckBox : []);
  //   setCheckAll(e.target.checked);

  //   router.push(
  //     {
  //       pathname: "/swap",
  //       query: { name: 0 },
  //     },
  //     undefined,
  //     { shallow: false }
  //   );
  // };

  const listsStatus = [
    {
      name: "In Progress",
      value: TRANSACTION_STATUS_HISTORY.PENDING,
      status: "pending",
    },
    {
      name: "Completed",
      value: TRANSACTION_STATUS_HISTORY.SUCCESS,
      status: "success",
    },
    {
      name: "Cancelled",
      value: TRANSACTION_STATUS_HISTORY.CANCEL,
      status: "cancel",
    },
    {
      name: "Failed",
      value: TRANSACTION_STATUS_HISTORY.FAILED,
      status: "failed",
    },
  ];
  return (
    <div className="sortBy">
      <b className="transactionTitle">Transaction Date</b>
      <div className=" d-flex align-items-center transactionDate">
        <DatePickerComponent
          onChange={(e) => changeDatePicker("from", e)}
          openOnFocus
          placeholder="Start Date"
          allowEdit={false}
          max={maxDate}
          value={dayFrom}
        />{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13.012"
          height="1"
          viewBox="0 0 13.012 1"
          className="mx-2"
        >
          <line
            id="Line_135"
            data-name="Line 135"
            x2="12.012"
            transform="translate(0.5 0.5)"
            fill="none"
            stroke="#bdc4cf"
            strokeLinecap="round"
            strokeWidth="1"
          />
        </svg>
        <DatePickerComponent
          onChange={(e) => changeDatePicker("to", e)}
          openOnFocus
          placeholder="End Date"
          allowEdit={false}
          min={minDay}
          max={maxDate}
          value={dayTo}
        />
      </div>
      <div className="filterBy">
        <b>Transaction Status</b>
        {/* <Checkbox
          value={TRANSACTION_STATUS_HISTORY.ALL}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          All
        </Checkbox> */}
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={changeStatus}
          value={checkBox}
        >
          <Row>
            <Col span={24}></Col>
            {listsStatus.map((el, idx) => (
              <Col span={24} key={idx}>
                <Checkbox value={el.value}>{el.name}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </div>
    </div>
  );
};

export default FilterContent;
