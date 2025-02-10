import React, { useEffect, useState } from "react";
import SideNav from "../../components/Sidebar/SideNav";
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
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import newRequest from "../../utils/newRequest";

const Home = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [userRoles, setUserRoles] = useState([]);

    const sidebarItems = [
        {
            label: `${t("Registered Patients")}`,
            path: "/patient-table",
            icon: (
                <img
                    src={Registration}
                    alt="Registered Patients"
                    className="w-20 h-20"
                />
            ),
            requiredRole: "Registered Patients",
            color: "bg-gradient-to-br from-blue-50 to-blue-100",
        },
        {
            label: `${t("Triage Waiting List")}`,
            path: "/monitoring",
            icon: (
                <img
                    src={CentralWaitingArea}
                    alt="Triage Waiting List"
                    className="w-20 h-20"
                />
            ),
            requiredRole: "Triage Waiting List",
            color:
                "bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-cyan-500/10 hover:from-teal-500/20 hover:via-emerald-500/20 hover:to-cyan-500/20 border-l-4 border-teal-500 transition-all duration-300 shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)]",
        },
        {
            label: `${t("Department Waiting List")}`,
            path: "/location-assignment",
            icon: (
                <img
                    src={LocationAssignment}
                    alt="Location Assignment"
                    className="w-20 h-20"
                />
            ),
            requiredRole: "Department Waiting List",
            color: "bg-gradient-to-br from-green-50 to-green-100",
        },
        {
            label: `${t("MasterData")}`,
            path: "#",
            icon: (
                <img
                    src={MasterData}
                    alt="Location Waiting Area"
                    className="w-20 h-20"
                />
            ),
            requiredRole: "MasterData",
            color: "bg-gradient-to-br from-yellow-50 to-yellow-100",
            subItems: [
                // {
                //   label: `${t("Location")}`,
                //   path: "/location",
                //   icon: <img src={Location} alt="Location" className="w-20 h-20" />,
                // },
                {
                    label: `${t("Users")}`,
                    path: "/users",
                    icon: <img src={Usersicon} alt="Users" className="w-20 h-20" />,
                    color: "bg-gradient-to-br from-teal-50 to-teal-100",
                },
                {
                    label: `${t("Roles")}`,
                    path: "/Roles",
                    icon: <img src={Rolesicon} alt="Roles" className="w-20 h-20" />,
                    color: "bg-gradient-to-br from-orange-50 to-orange-100",
                },
                {
                    label: `${t("Beds")}`,
                    path: "/Beds",
                    icon: <img src={Beds} alt="Beds" className="w-20 h-20" />,
                     color: "bg-gradient-to-br from-blue-50 to-blue-100",
                },
                {
                    label: `${t("Department")}`,
                    path: "/Department",
                    icon: (
                        <img src={Department} alt="Department" className="w-20 h-20" />
                    ),
                },
            ],
        },
        {
            label: `${t("TV Screen")}`,
            path: "/patient-display",
            icon: <img src={TVscreeen} alt="TV Screen" className="w-20 h-20" />,
            requiredRole: "TV Screen",
            color: "bg-gradient-to-br from-red-50 to-red-100",
        },
        {
            label: `${t("KPI")}`,
            path: "/kpi",
            icon: <img src={KPI} alt="KPI" className="w-20 h-20" />,
            requiredRole: "KPI",
            color: "bg-gradient-to-br from-purple-50 to-purple-100",
        },
        {
            label: `${t("Patient Journey")}`,
            path: "/PatientJourney",
            icon: <img src={PatientJourneyicon} alt="KPI" className="w-20 h-20" />,
            requiredRole: "Patient Journey",
            color: "bg-gradient-to-br from-indigo-50 to-indigo-100",
        },
    ];

    const storedUserData = JSON.parse(localStorage.getItem("userdata"));
    const getAllRegisteredMembers = async () => {
        try {
            const res = await newRequest.get(`/api/v1/user/${storedUserData?.user?.id || ""}`);
            const response = res.data?.data?.roles?.map((role) => role.name) || [];
            setUserRoles(response);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllRegisteredMembers();
    }, [storedUserData?.user?.id]);


    const [expandedItem, setExpandedItem] = useState(null); // New state for expanded menu

    const handleItemClick = (page) => {
        if (page.subItems) {
            setExpandedItem(expandedItem === page.label ? null : page.label);
        } else if (userRoles.includes(page.requiredRole)) {
            navigate(page.path);
        }
    };

    return (
        <>
            <SideNav>
                <div className="min-h-screen bg-green-100 p-8">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex w-full flex-col gap-4 p-6">
                            {/* Header Section with Back Button */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-navy-700">
                                            User Roles
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            Manage user roles and permissions to control access within the system. Assign specific roles to users to define their level of access and responsibilities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sidebarItems.map((page) => {
                                    const hasAccess = userRoles.includes(page.requiredRole);
                                    const isExpanded = expandedItem === page.label;
                                    return (
                                        <>
                                            <Card
                                                key={page.title}
                                                isPressable
                                                onPress={() => handleItemClick(page)}
                                                className={`border-none shadow-md transition-shadow ${hasAccess
                                                    ? `${page.color} hover:shadow-xl cursor-pointer`
                                                    : "bg-gray-100 opacity-75 cursor-not-allowed"
                                                    }`}
                                            >
                                                <CardBody className="overflow-visible p-6">
                                                    <div className="flex flex-col items-center gap-4">
                                                        {page.icon}
                                                        <div className="text-center">
                                                            <h2 className="text-xl font-semibold text-navy-700 my-4">
                                                                {page.label}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                                <CardFooter className="justify-center pb-6">
                                                    <Button
                                                        onPress={() => handleItemClick(page)}
                                                        disabled={!hasAccess}
                                                        className="bg-[#13BA8885] text-black shadow-lg hover:bg-navy-700"
                                                        size="sm"
                                                        endContent={hasAccess && (
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M9 5l7 7-7 7"
                                                                />
                                                            </svg>
                                                        )}
                                                    >
                                                        {hasAccess
                                                            ? "Manage Content"
                                                            : "Access Denied"}
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                            {isExpanded && page.subItems && (
                                                <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pl-3">
                                                    {page.subItems.map((subItem) => {
                                                        const subHasAccess = userRoles.includes(subItem.requiredRole) || hasAccess;

                                                        return (
                                                          <Card
                                                            key={subItem.label}
                                                            isPressable={
                                                              subHasAccess
                                                            }
                                                            onPress={() =>
                                                              subHasAccess &&
                                                              navigate(
                                                                subItem.path
                                                              )
                                                            }
                                                            className={`ml-8 border-none shadow-md transition-shadow ${
                                                              subHasAccess
                                                                ? `${subItem.color} hover:shadow-xl cursor-pointer`
                                                                : "bg-gray-100 opacity-75 cursor-not-allowed"
                                                            }`}
                                                          >
                                                            <CardBody className="overflow-visible p-6">
                                                              <div className="flex flex-col items-center gap-4">
                                                                <div
                                                                  className={
                                                                    !subHasAccess
                                                                      ? "grayscale"
                                                                      : ""
                                                                  }
                                                                >
                                                                  {subItem.icon}
                                                                </div>
                                                                <div className="text-center">
                                                                  <h2
                                                                    className={`text-lg font-semibold ${
                                                                      subHasAccess
                                                                        ? "text-navy-700"
                                                                        : "text-gray-400"
                                                                    } my-4`}
                                                                  >
                                                                    {
                                                                      subItem.label
                                                                    }
                                                                  </h2>
                                                                </div>
                                                              </div>
                                                            </CardBody>
                                                            <CardFooter className="justify-center pb-6">
                                                              <Button
                                                                onClick={() =>
                                                                  navigate(
                                                                    subItem.path
                                                                  )
                                                                }
                                                                className="bg-[#13BA8885] text-black shadow-lg hover:bg-navy-700"
                                                                size="sm"
                                                                endContent={
                                                                  hasAccess && (
                                                                    <svg
                                                                      className="w-4 h-4"
                                                                      fill="none"
                                                                      stroke="currentColor"
                                                                      viewBox="0 0 24 24"
                                                                    >
                                                                      <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                          2
                                                                        }
                                                                        d="M9 5l7 7-7 7"
                                                                      />
                                                                    </svg>
                                                                  )
                                                                }
                                                              >
                                                                {hasAccess
                                                                  ? "Manage Content"
                                                                  : "Access Denied"}
                                                              </Button>
                                                            </CardFooter>
                                                          </Card>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </SideNav>
        </>
    );
};

export default Home;
