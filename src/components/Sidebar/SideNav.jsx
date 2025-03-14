import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Registration from "../../Images/Registration.png";
import CentralWaitingArea from "../../Images/Central Waiting Area.png";
import LocationAssignment from "../../Images/Location Assignment.png";
import KPI from "../../Images/KPI.png";
import Location from "../../Images/Location.png";
import logo from "../../Images/logo.png";
import LocationWaitingArea from "../../Images/Location Waiting Area.png";
import MasterData from "../../Images/masterdata.png";
import Usersicon from "../../Images/users.png";
import TVscreeen from "../../Images/TV screen.jpg";
import Rolesicon from "../../Images/Roles.png";
import Department from "../../Images/Department.png";
import Beds from "../../Images/Beds.jpg";
import logout from "../../Images/logout.png";
import PatientJourneyicon from "../../Images/PatientJourneyicon.png";
import axios from "axios";
import { baseUrl } from "../../utils/config";
import newRequest from "../../utils/newRequest";
import { useQuery } from "react-query";
import UpdatedRoles from "../../Pages/MasterData/Roles/UpdatedRoles";
import DepartmentWaitingList from "../DepartmentWaitingList/DepartmentWaitingList";
function SideNav({ children }) {
  const { t, i18n } = useTranslation();
  const [Masterdatashow, setMasterdatashow] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const getTabClass = (path) => {
    return `flex items-center py-1 rounded transition-all duration-300 relative group cursor-pointer ${
      activeTab === path
        ? "bg-[#13BA8885] text-black"
        : "hover:bg-gray-100 text-gray-700"
    } ${
      i18n.language === "ar"
        ? "pr-3 pl-4 justify-end"
        : "pl-3 pr-4 justify-start"
    }`;
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const sidebarItems = [
    {
      label: `${t("Registered Patients")}`,
      path: "/patient-table",
      icon: (
        <img src={Registration} alt="Registered Patients" className="w-6 h-6" />
      ),
      requiredRole: "Registered Patients",
    },
    {
      label: `${t("Triage Waiting List")}`,
      path: "/monitoring",
      icon: (
        <img
          src={CentralWaitingArea}
          alt="Triage Waiting List"
          className="w-6 h-6"
        />
      ),
      requiredRole: "Triage Waiting List",
    },
    {
      label: `${t("Department Waiting List")}`,
      path: "/location-assignment",
      icon: (
        <img
          src={LocationAssignment}
          alt="Location Assignment"
          className="w-6 h-6"
        />
      ),
      requiredRole: "Department Waiting List",
    },
    {
      label: `${t("MasterData")}`,
      path: "#",
      icon: (
        <img src={MasterData} alt="Location Waiting Area" className="w-6 h-6" />
      ),
      requiredRole: "MasterData",
      subItems: [
        // {
        //   label: `${t("Location")}`,
        //   path: "/location",
        //   icon: <img src={Location} alt="Location" className="w-6 h-6" />,
        // },
        {
          label: `${t("Users")}`,
          path: "/users",
          icon: <img src={Usersicon} alt="Users" className="w-6 h-6" />,
        },
        {
          label: `${t("Roles")}`,
          path: "/Roles",
          icon: <img src={Rolesicon} alt="Roles" className="w-6 h-6" />,
        },
        {
          label: `${t("Beds")}`,
          path: "/Beds",
          icon: <img src={Beds} alt="Beds" className="w-6 h-6" />,
        },
        {
          label: `${t("Department")}`,
          path: "/Department",
          icon: <img src={Department} alt="Department" className="w-6 h-6" />,
        },
      ],
    },
    {
      label: `${t("TV Screen")}`,
      path: "/patient-display",
      icon: <img src={TVscreeen} alt="TV Screen" className="w-6 h-6" />,
      requiredRole: "TV Screen",
    },
    {
      label: `${t("KPI")}`,
      path: "/kpi",
      icon: <img src={KPI} alt="KPI" className="w-6 h-6" />,
      requiredRole: "KPI",
    },
    {
      label: `${t("Patient Journey")}`,
      path: "/PatientJourney",
      icon: <img src={PatientJourneyicon} alt="KPI" className="w-6 h-6" />,
      requiredRole: "Patient Journey",
    },
  ];

  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userdata");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  // const {
  //   data: userRoles = [],
  // } = useQuery(
  //   ["userRoles", userData?.user?.id],
  //   () => fetchUserRoles(userData?.user?.id),
  //   {
  //     enabled: !!userData?.user?.id,
  //   }
  // );

  //   const fetchUserRoles = async (userId) => {
  //     if (!userId) return [];
  //     try {
  //       const response = await newRequest.get(`/api/v1/user/${userId}`);
  //       return response.data?.data?.roles?.map((role) => role.name) || [];
  //     } catch (error) {
  //       return [];
  //     }
  //   };

  //    useEffect(() => {
  //      const handleStorageChange = (e) => {
  //        if (e.key === "userdata") {
  //          setUserData(e.newValue ? JSON.parse(e.newValue) : null);
  //        }
  //      };

  //      window.addEventListener("storage", handleStorageChange);
  //      return () => window.removeEventListener("storage", handleStorageChange);
  //    }, []);

  const [showPopup, setShowPopup] = useState(false);
  const handleItemClick = (item) => {
    if (item.label === t("Department Waiting List")) {
      setShowPopup(true);
    } else if (item.subItems) {
      setMasterdatashow(!Masterdatashow);
    } else {
      navigate(item.path);
    }
  };

  const logoutbutton = () => {
    localStorage.removeItem("userdata");
    localStorage.removeItem("sidebarOpen");
    navigate("/");
  };
  const accessToken = localStorage.getItem("accessToken");
  const storedUserData = JSON.parse(localStorage.getItem("userdata"));
  const getAllRegisteredMembers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/user/${storedUserData?.user?.id || ""}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const response = res.data?.data?.roles?.map((role) => role.name) || [];
      setUserRoles(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRegisteredMembers();
  }, [storedUserData?.user?.id]);

  return (
    <>
      <div className="p-0 lg:h-screen">
        <div className="body-content ">
          <nav
            className={`fixed top-0 transition-all duration-300 ease-in-out bg-white lg:mt-0 mt-16 bottom-0 flex flex-col shadow-lg overflow-hidden z-50 ${
              i18n.language === "ar" ? "right-0" : "left-0"
            } ${isOpen ? "w-[280px]" : "w-[80px]"}`}
            id="sidenav"
          >
            <div
              className={`flex items-center w-full px-4 pt-4 pb-4 border-b border-gray-200 justify-center `}
            >
              <div
                className={`transition-opacity duration-300 justify-center cursor-pointer ${
                  !isOpen ? "opacity-0 w-0" : "opacity-100"
                }`}
                onClick={() => navigate("/Home")}
              >
                <img src={logo} alt="logo" className="w-12 h-12" />
              </div>
              <div
                className={`transition-opacity duration-300 cursor-pointer ${
                  isOpen ? "opacity-0 w-0" : "opacity-100"
                }`}
                onClick={() => navigate("/Home")}
              >
                <img src={logo} alt="logo" className="w-10 h-10 " />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ul className="p-4 space-y-6">
                {sidebarItems.map((item, index) =>
                  userRoles.includes(item.requiredRole) ? (
                    <li key={index} className="my-2">
                      <div
                        // className="flex px-3 cursor-pointer my-2"
                        className={`flex items-center py-1 rounded transition-all duration-300 relative group cursor-pointer ${
                          activeTab === item.path
                            ? "bg-[#13BA8885] text-black"
                            : "hover:bg-gray-100 text-gray-700"
                        } ${
                          i18n.language === "ar"
                            ? "pr-3 pl-4 justify-end"
                            : "pl-3 pr-4 justify-start"
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        {item.icon}
                        <span
                          className={`font-medium text-gray-700 whitespace-nowrap transition-all duration-300 ms-3 ${
                            !isOpen && "opacity-0 w-0 overflow-hidden"
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.subItems && (
                          <div
                            className={`${
                              i18n.language === "ar"
                                ? "mr-auto ml-2"
                                : "ml-auto mr-2"
                            }`}
                          >
                            {Masterdatashow ? (
                              <i className="fas fa-chevron-up"></i>
                            ) : (
                              <i className="fas fa-chevron-down"></i>
                            )}
                          </div>
                        )}
                      </div>

                      {item.subItems && Masterdatashow && (
                        <ul className="ms-3 space-y-3">
                          {item.subItems.map((subItem, subIndex) => (
                            <li
                              key={subIndex}
                              onClick={() => navigate(subItem.path)}
                              className={getTabClass(subItem.path)}
                            >
                              {subItem.icon}
                              <span
                                className={`font-medium text-gray-700 whitespace-nowrap transition-all duration-300 ms-3 mt-2 ${
                                  !isOpen && "opacity-0 w-0 overflow-hidden"
                                }`}
                              >
                                {subItem.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : null
                )}
                <li
                  onClick={logoutbutton}
                  className="flex mt-10  cursor-pointer"
                >
                  <img
                    src={logout}
                    alt="Registered Patients"
                    className="w-6 h-6"
                  />
                  <span
                    className={`font-medium text-gray-700 whitespace-nowrap transition-all duration-300 ms-3 ${
                      !isOpen && "opacity-0 w-0 overflow-hidden"
                    }`}
                  >
                    {t("Log-out")}
                  </span>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div
          className={`mx-auto transition-all duration-300 content-wrapper ${
            isOpen ? "lg:ml-[280px]" : "lg:ml-[80px]"
          }`}
        >
          <section className="sticky top-0 z-40 px-3 py-3 bg-white shadow-sm flex my-auto">
            <button
              onClick={toggleSidebar}
              className="me-5 rounded-lg hover:bg-gray-100"
            >
              {!isOpen ? (
                <Menu size={24} className="text-gray-600" />
              ) : (
                <X size={24} className="text-gray-600" />
              )}
            </button>
            {/* <h2 className="text-xl font-semibold text-gray-800">
              {t(
                location.pathname.substring(1).replace(/-/g, " ").toUpperCase() ===
                  "PATIENT TABLE"
                  ? "Registered Patients"
                  : location.pathname.substring(1).replace(/-/g, " ").toUpperCase()
              ) || "Dashboard"}
            </h2> */}
          </section>
          {children}
        </div>
      </div>
      {showPopup && (
        <DepartmentWaitingList
          isVisible={showPopup}
          setVisibility={() => setShowPopup(false)}
          // refreshroles={fetchAllRoles}
          // selectdataroles={selectedDepartment}
        />
      )}
    </>
  );
}

export default SideNav;
