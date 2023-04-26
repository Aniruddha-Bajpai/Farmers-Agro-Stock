import "./App.css";
import React from "react";
import ReactDOM from "react-dom";

import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import webFont from "webfontloader";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";

/** Components */
import Loader from "./component/layout/Loader/AnimatedLoader";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp.js";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UnderProgress from "./component/common/UnderProgress.js";
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
  }, []);
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/contact" element={<UnderProgress />} />
        <Route path="/about" element={<UnderProgress />} />
        <Route path="/cart" element={<UnderProgress />} />
        <Route path="/dashboard" element={<UnderProgress />} />
        <Route path="/orders" element={<UnderProgress />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
