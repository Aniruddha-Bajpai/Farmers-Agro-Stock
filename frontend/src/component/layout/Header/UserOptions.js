import React, { Fragment, useState } from "react";
import "./Header.css";
import { Backdrop } from "@material-ui/core";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";
function UserOptions({ user }) {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];
  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    }); // --> adding at the start of the array
  }
  function orders() {
    navigate("/orders");
  }
  function account() {
    navigate("/account");
  }
  function dashboard() {
    navigate("/dashboard");
  }
  function logoutUser() {
    dispatch(logout());
    alert.success("Logout Successfully");
  }

  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        style={{ zIndex: 11 }}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
            alt="profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
}

export default UserOptions;
