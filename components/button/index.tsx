import React, { MouseEventHandler, ReactNode } from "react";
import { Button } from "antd";
import classNames from "classnames";

declare const ButtonVarients: ["default", "primary", "link", "secondary"];
declare type ButtonVarient = typeof ButtonVarients[number];

type AppButtonProps = {
  variant?: ButtonVarient | undefined;
  prefixIcon?: ReactNode;
  afterIcon?: ReactNode;
  className?: string | undefined;
  onClick?: MouseEventHandler<HTMLElement>;
  text: ReactNode;
  disabled?: boolean;
  htmlType?: string | any;
  loading?: boolean;
  href?: string;
};

function AppButton({
  variant = "default",
  prefixIcon,
  afterIcon,
  text,
  className,
  disabled,
  ...props
}: AppButtonProps) {
  return (
    <Button
      className={classNames("button", `button--${variant}`, className)}
      disabled={disabled}
      {...props}
    >
      <div className="button--left">
        {prefixIcon}
        <span>{text}</span>
      </div>

      {afterIcon}
    </Button>
  );
}

export default AppButton;
