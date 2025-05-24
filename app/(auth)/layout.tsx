import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center h-screen w-full justify-center">
      {children}
    </div>
  );
};
export default layout;
