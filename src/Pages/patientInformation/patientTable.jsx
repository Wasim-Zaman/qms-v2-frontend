import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf, FaTrash } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import Swal from "sweetalert2";
import toast from 'react-hot-toast';
import SideNav from '../../components/Sidebar/SideNav';
import Spinner from '../../components/spinner/spinner';
import newRequest from '../../utils/newRequest';
import { baseUrl } from '../../utils/config';

function PatientTable() {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const fetchPatients = async (page) => {
    try {
      const response = await newRequest.get(`/api/v1/patients?page=${page}&limit=10${searchTerm ? `&search=${searchTerm}` : ''}`);
      setPatients(response?.data?.data?.data || []);
      setTotalPages(response?.data?.data?.pagination?.totalPages);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPatients(currentPage);
  }, [currentPage, searchTerm]);
  const toggleDropdown = (patientId) => {
    setDropdownVisible((prev) => (prev === patientId ? null : patientId));
  };

  const handleDelete = async (patient) => {
    setDropdownVisible(null);
    Swal.fire({
      title: `Are you sure to delete this record?`,
      text: `You will not be able to recover this! ${patient?.name || ""}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, Delete!`,
      cancelButtonText: `No, keep it!`,
      confirmButtonColor: "#1E3B8B",
      cancelButtonColor: "#FF0032",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await newRequest.delete(`/api/v1/patients/` + patient?.id);
          toast.success(response?.data?.message || "Patient information has been deleted successfully");
          fetchPatients(currentPage);
        } catch (error) {
          const errorMessage = error.response?.data?.message || "An unexpected error occurred";
          toast.error(errorMessage);
        }
      }
    });
  };
  const handleupdated = (patient) => {
    navigate("/update/patient-information/" + patient.id);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    setLoading(true);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    setLoading(true);
  };
  return (
    <>
      <div className="font-[sans-serif] ">
        <SideNav>
          <div className="w-11/12 mx-auto">
            <div className="flex items-center mb-4 justify-between w-full mt-10">
              {/* <h3 className="text-2xl font-bold text-left mt-10">
                Patients Informaation
              </h3> */}
              <input
                type="text"
                placeholder="Search patients..."
                className="w-80 border border-green-500 rounded px-3 py-2 "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="font-[sans-serif] space-x-4 space-y-4 text-center ">
                <button
                  type="button"
                  className=" px-5 py-2.5 rounded-lg text-sm tracking-wider font-medium border border-green-700 outline-none bg-transparent hover:bg-green-700 text-green-700 hover:text-white transition-all duration-300"
                  onClick={() => navigate("/patient-information")}
                >
                  Register New Patient
                </button>
              </div>
            </div>

            <div className="max-h-[500px] sm:max-h-[300px] md:max-h-[450px] lg:max-h-[500px] overflow-y-scroll border border-gray-300 rounded-md mt-4">
              <table className="min-w-full bg-white  overflow-y-scroll">
                <thead className="whitespace-nowrap">
                  <tr>
                    <th className="pl-4 w-8"> {/* Checkbox Header */} </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800">
                      Name
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800">
                      Status
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800">
                      Age
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800">
                      Contact
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800">
                      ID Number
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800">
                      PDF
                    </th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-800">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                  {loading ? (
                    <Spinner />
                  ) : (
                    patients
                      .filter(
                        (patient) =>
                          patient.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          patient.status
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          patient.age.toString().includes(searchTerm) ||
                          patient.mobileNumber.includes(searchTerm)
                      )
                      .map((patient) => (
                        <tr
                          key={patient.id}
                          className={`odd:bg-blue-50 ${
                            selectedPatientId === patient.id ? "bg-white" : ""
                          }`}
                          onClick={() => setSelectedPatientId(patient.id)}
                        >
                          <td className="pl-4 w-8">
                            <input
                              id={`checkbox-${patient.id}`}
                              type="checkbox"
                              className="hidden peer"
                            />
                            <label
                              htmlFor={`checkbox-${patient.id}`}
                              className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before-w-full before-h-full before:bg-white w-5 h-5 cursor-pointer bg-white-500 border border-gray-400 rounded overflow-hidden"
                            >
                              {selectedPatientId === patient.id && (
                                <span>✔️</span>
                              )}
                            </label>
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            {patient.name}
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            <span
                              className={`w-[68px] block text-center py-1 border ${
                                patient.status === "Active"
                                  ? "border-green-500 text-green-600"
                                  : "border-yellow-500 text-yellow-600"
                              } rounded text-xs`}
                            >
                              {patient.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            {patient.age}
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            {patient.mobileNumber}
                          </td>
                          <td className="p-4 text-sm text-gray-800">
                            {patient.idNumber}
                          </td>
                          <td className="p-4 text-gray-800">
                            <FaFilePdf
                              size={30}
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                const fileUrl = baseUrl + "/" + patient.ticket;
                                window.open(fileUrl, "_blank");
                              }}
                            />
                          </td>

                          <td className="relative text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(patient.id);
                              }}
                              className="text-gray-500 text-lg hover:text-blue-600"
                            >
                              ⋮
                            </button>
                            {dropdownVisible === patient.id && (
                              <div className="absolute bg-white border rounded shadow-lg w-40 z-10">
                                <ul>
                                  <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex my-auto"
                                    onClick={() => handleupdated(patient)}
                                  >
                                    <CiEdit className="my-auto me-4" />{" "}
                                    <p className="text-lg ">Edit</p>
                                  </li>
                                  <li
                                    className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer flex my-auto"
                                    onClick={() => handleDelete(patient)}
                                  >
                                    <FaTrash className="my-auto me-4" />{" "}
                                    <p className="text-lg ">Delete</p>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mb-4 mt-6">
              <button
                onClick={handlePreviousPage}
                className={`px-4 py-2 bg-green-500 text-white rounded mr-2 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === 1}
              >
                Previous Page
              </button>
              <button
                onClick={handleNextPage}
                className={`px-4 py-2 bg-green-500 text-white rounded ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentPage === totalPages}
              >
                Next Page
              </button>
            </div>
          </div>
        </SideNav>
      </div>
    </>
  );
}

export default PatientTable;
