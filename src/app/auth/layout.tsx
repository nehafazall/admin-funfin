import React from "react";
import Otp from "./otp/otp";

interface Props {
  children: React.ReactNode;
  // otp: React.ReactNode
}

const layout = ({ children }: Props) => {
  return (
    <>
      <Otp /> {/* {otp} */}
      {children}
    </>
  );
};

export default layout;
