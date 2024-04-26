import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Logo } from "../helper/ImageHelper";
import { IconHelper, navbar } from "../helper/Icon_helper";
import { useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { Drawer } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import DefaultHeader from "../pages/DefaultHeader";
import { checkUserRole } from "../helper/api_helper";
import { changeRole } from "../helper/state/slice/user.slice";

const Sidenav = () => {
  const location = useLocation();
  const userData = useSelector((data) => data.userSlice);
  const [navbarData, setNavbarData] = useState([]);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("6F9d2H5s8R3g7P1w") != "4T6s8P3w1R7g9D2h") {
      navigate("/");
      localStorage.clear();
    }

    setNavbarData(
      navbar.filter((res) => {
        return userData.role === "user" ? [4, 5, 6].includes(res.id) : res;
      })
    );
  }, [location.pathname, userData.role]);

  useEffect(() => {
    if (userData.role === "user") {
      if (
        ["/dashboard", "/all_transfer", "/users"].includes(location.pathname)
      ) {
        navigate("/403");
      }
    }
  }, [location.pathname, userData.role]);

  const verifyUserRole = async () => {
    try {
      const result = await checkUserRole();
      if (_.isEmpty(_.get(result, "data.data", []))) {
        localStorage.clear();
        navigate("/");
      }
      dispatch(
        changeRole({
          role: _.get(result, "data.data[0].role", ""),
          name: _.get(result, "data.data[0].name", ""),
        })
      );
    } catch (err) {}
  };

  useEffect(() => {
    verifyUserRole();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  let SideNavbars = () => {
    return (
      <div className="w-full bg-secondary relative  h-full flex items-center flex-col py-10">
        <img src={Logo} alt="" className="w-[80px]" />

        <div className="pt-12 flex flex-col gap-y-8 w-full">
          {navbarData.map((res, index) => {
            return (
              <Link
                key={index}
                to={`/${res.link}`}
                className={`w-full ${
                  location.pathname.split("/")[1] === res.link
                    ? "text-light_yellow  !border-l-light_yellow"
                    : "text-white"
                }  flex items-center font-bold border-l-4 transition-all duration-700 ease-linear border-l-secondary justify-start px-4 gap-x-4 cursor-pointer hover:text-light_yellow font-Texturina`}
              >
                {<res.icons />} <h1>{res.name}</h1>
              </Link>
            );
          })}
        </div>
        <div
          className="absolute bottom-[50px] flex items-center gap-x-2 cursor-pointer border px-4 rounded-md py-1  text-white"
          onClick={handleLogout}
        >
          <span>Logout</span>
          <IconHelper.logout />
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-screen h-screen   items-start bg-white">
      <div className="w-[13vw] h-full lg:block hidden">
        <SideNavbars />
      </div>
      <div className="lg:w-[87vw] w-full  shadow-2xl h-full overflow-y-scroll">
        <DefaultHeader />
        <div className="lg:pt-[80px] pt-[50px]">
          <Outlet />
        </div>
      </div>
      <Drawer
        closable={false}
        open={open}
        onClick={() => {
          setOpen(false);
        }}
      >
        <SideNavbars />
      </Drawer>
      <RxHamburgerMenu
        className="cursor-pointer top-0 right-0 z-50 bg-primary !text-xl p-1 !text-secondary absolute lg:hidden block"
        onClick={() => {
          setOpen(true);
        }}
      />
    </div>
  );
};

export default Sidenav;
