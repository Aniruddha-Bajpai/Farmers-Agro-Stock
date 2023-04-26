import React from "react";
import playstore from "../../../images/playstore.png";
import appstore from "../../../images/Appstore.png";
import logo from "../../../images/logo.png";
import "./footer.css";
function Footer() {
  return (
    <div id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download our App for android and IOS mobiles phones</p>
        <img src={playstore} alt="playstore" />
        <img src={appstore} alt="appstore" />
      </div>
      <div className="midFooter">
        <h1>
          <img src={logo} alt="Farmer mandi" />
        </h1>
        <p>Revolutising the indian farm community over the </p>
        <p>Copyrights &copy; FarmerMandi </p>
      </div>
      <div className="rightFooter">
        <h4>Follow us</h4>
        <a href="#">Instagram</a>
        <a href="#">Facebook</a>
        <a href="#">Youtube</a>
      </div>
    </div>
  );
}

export default Footer;
