import React, { useState, Fragment } from "react";
import MetaData from "../layout/MetaData";
import "./Search.css";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const [keyword, setKeyword] = useState("");
  const history = useNavigate();
  const searchSubmitHandler = (e) => {
    e.preventDefault(); // no reload on form submit
    if (keyword.trim()) {
      history(`/products/${keyword}`);
    } else {
      history("/products");
    }
  };

  return (
    <Fragment>
      <MetaData title="SEARCH : FOOD MANDI" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
