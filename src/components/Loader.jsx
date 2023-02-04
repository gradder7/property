import { ReactComponent as LoaderIcon } from "../assets/svg/loader.svg";
import React from "react";
export default function Loader() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <LoaderIcon className="w-16 h-16" />
    </div>
  );
}
