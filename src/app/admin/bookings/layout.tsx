import React, { Suspense } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={<div></div>}>{children}</Suspense>
    </>
  );
};

export default layout;
