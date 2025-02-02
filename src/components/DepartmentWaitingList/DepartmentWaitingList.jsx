import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DepartmentWaitingList = ({
    isVisible,
    setVisibility,
    selectdatauser,
    refreshuser,
}) => {

    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState(null);
    const { t } = useTranslation();
    const modalRef = useRef(null);
    if (!isVisible) return null;

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await newRequest.get(`/api/v1/departments/all`);
                setDepartments(response?.data?.data || []);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    const departmentserach = () => {
        if (selectedDeptId) {
            navigate(`/Department-monitoring/${selectedDeptId}`);
            setVisibility(false);
        } else {
            toast.error("Please select a department");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Modal Container */}
            <div
                ref={modalRef} // Attach the ref to the modal
                className="bg-white rounded-lg shadow-lg w-full max-w-lg"
            >
                {/* Modal Header */}
                <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ backgroundColor: "#5B4DF5" }}
                >
                    <h2 className="text-white text-xl font-semibold">
                        {t("Assign Location")}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setVisibility(false)}>
                            <CloseIcon style={{ color: "white" }} />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <label
                                htmlFor="Location"
                                className="text-lg font-medium text-gray-700"
                            >
                                {t("Department Code")}
                            </label>
                            <select
                                value={selectedDeptId}
                                onChange={(e) => setSelectedDeptId(e.target.value)}
                                className="border border-gray-300 p-2 w-full mb-4 py-3"
                            >
                                <option value="">Select Department</option>
                                {departments.map((department) => (
                                    <option
                                        key={department.tblDepartmentID}
                                        value={department.tblDepartmentID}
                                    >
                                        {department.deptcode}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-400"
                            onClick={() => setVisibility(false)}
                        >
                            {t("Cancel")}
                        </button>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: "#13BA88", color: "#ffffff" }}
                            onClick={departmentserach}
                        >
                            {t("Department")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentWaitingList;
