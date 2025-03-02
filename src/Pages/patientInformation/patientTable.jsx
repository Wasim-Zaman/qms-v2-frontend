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
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const fetchPatients = async (page) => {
    try {
      const response = await newRequest.get(`/api/v1/patients?page=${page}&limit=10${searchTerm ? `&search=${searchTerm}` : ''}`);
      setPatients(response?.data?.data?.data || []);
      setTotalPages(response?.data?.data?.pagination?.totalPages);
      setTotal(response?.data?.data?.pagination?.total);
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

            <div className="h-[500px] overflow-y-auto border border-gray-300 rounded-lg shadow-lg relative">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-green-300 sticky top-0 z-10">
                  <tr>
                    <th className="pl-4 w-8 py-3"> {/* Checkbox Header */} </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      PDF
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 relative">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                          <Spinner />
                        </div>
                      </td>
                    </tr>
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
                          className={`hover:bg-gray-50 transition-colors duration-200 ${
                            selectedPatientId === patient.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => setSelectedPatientId(patient.id)}
                        >
                          <td className="pl-4 w-8 py-4">
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {patient.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                patient.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {patient.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {patient.age}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {patient.mobileNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {patient.idNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <FaFilePdf
                              size={24}
                              className="text-red-500 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                const fileUrl = baseUrl + "/" + patient.ticket;
                                window.open(fileUrl, "_blank");
                              }}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center relative">
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
            <div className="flex justify-between items-center mb-4 mt-6">
              {/* Pagination Information */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => {
                        setCurrentPage(index + 1);
                        setLoading(true);
                      }}
                      className={`w-8 h-8 rounded-full ${
                        currentPage === index + 1
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } flex items-center justify-center text-sm font-medium transition-colors duration-200`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  Total Records: {total}
                </span>
              </div>

              {/* Previous/Next Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handlePreviousPage}
                  className={`px-4 py-2 bg-green-500 text-white rounded ${
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
          </div>
        </SideNav>
      </div>
    </>
  );
}

export default PatientTable;
