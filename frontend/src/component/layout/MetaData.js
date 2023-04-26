import React from "react";
import Helmet from "react-helmet";

// ---> changes the title of the web page in tab
const MetaData = ({ title }) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default MetaData;
