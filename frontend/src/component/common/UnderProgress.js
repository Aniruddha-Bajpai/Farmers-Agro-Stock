import React, { Fragment } from "react";
import logo from "./en-construction.gif";
import "./UnderProgress.css";
function UnderProgress() {
  return (
    <Fragment>
      <div className="underProgress">
        <img src={logo} alt="under-construction" />
      </div>
    </Fragment>
  );
}

export default UnderProgress;
