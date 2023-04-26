import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";

// import { ToastContainer, toast } from "react-toastify";
import Product from "./ProductCard.js";
import "./Home.css";
import MetaData from "../layout/MetaData.js";
import {
  clearErrors,
  getProduct,
  getProductDetails,
} from "../../actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import AnimatedLoader from "../layout/Loader/AnimatedLoader.js";
import { useAlert } from "react-alert";

function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  useEffect(() => {
    if (error) {
      return alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct());
  }, [dispatch, error, alert]);
  return (
    <Fragment>
      {loading ? (
        <AnimatedLoader />
      ) : (
        <Fragment>
          <MetaData title="Food Mandi" />
          <div className="banner">
            <p>Welcome to Farmers Mandi</p>
            <h1>Find amazing deals below</h1>
            <a href="#container">
              <button>
                Scroll
                <CgMouse />
              </button>
            </a>
          </div>
          <h2 className="homeHeading">Featured Product</h2>
          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <Product product={product} key={product._id} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default Home;
