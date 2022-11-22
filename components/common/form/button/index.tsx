import React from "react";

interface IButton {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<IButton> = ({ children, loading, ...rest }) => {
  return (
    <button disabled={loading} {...rest}>
      {loading ? "load..." : children}
    </button>
  );
};
