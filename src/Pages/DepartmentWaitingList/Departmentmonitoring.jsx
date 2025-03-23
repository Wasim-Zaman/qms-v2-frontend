import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideNav from "../../components/Sidebar/SideNav";
import Spinner from "../../components/spinner/spinner";
import newRequest from "../../utils/newRequest";

const Departmentmonitoring = () => {
    const [waitingPatients, setWaitingPatients] = useState([]);
    const [inProgressPatients, setInProgressPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCalledPatients, setShowCalledPatients] = useState(false);
    const [calledPatients, setCalledPatients] = useState([]);
    const [departmentName, setDepartmentName] = useState("");
    const navigate = useNavigate();

    const { id } = useParams();
    // Fetch data from API
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Fetch patients
          const patientsResponse = await newRequest.get(
            `api/v1/patients/by-state?deptId=${id}`
          );
          setWaitingPatients(patientsResponse.data.data.waiting || []);
          setInProgressPatients(patientsResponse.data.data.inProgress || []);
          
          // Fetch department details
          const deptResponse = await newRequest.get(`/api/v1/departments/all`);
          const departments = deptResponse?.data?.data || [];
          const department = departments.find(dept => dept.tblDepartmentID === id);
          setDepartmentName(department?.deptname || "Unknown Department");
          
        } catch (err) {
          setError("Error fetching data: " + err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [id]);

    const fetchCalledPatients = async () => {
        try {
            setLoading(true);
            const response = await newRequest.get('api/v1/patients/called');
            setCalledPatients(response.data.data || []);
            setShowCalledPatients(true);
        } catch (err) {
            setError("Error fetching called patients: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SideNav>
                <div className="bg-blue-50 min-h-screen p-6">
                    {/* Header Section */}
                    <div className="bg-purple-500 text-white p-4 flex justify-between items-center">
                        <h1 className="text-lg font-bold">DEPARTMENT MONITORING</h1>
                        <h2 className="font-semibold text-xl text-white">{departmentName}</h2>
                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                placeholder="Scan the Barcode"
                                className="p-2 rounded-lg text-black w-80"
                            />
                            <button 
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                onClick={fetchCalledPatients}
                            >
                                Called Patients List
                            </button>
                        </div>
                    </div>

                    {/* Loading Spinner */}
                    {loading && <Spinner />}

                    {/* Called Patients Modal */}
                    {showCalledPatients && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-blue-700">Called Patients List</h2>
                                    <button 
                                        onClick={() => setShowCalledPatients(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    {calledPatients.map((patient) => (
                                        <div
                                            key={patient.id}
                                            className="bg-blue-100 border-l-4 border-blue-500 rounded-lg p-4 text-center cursor-pointer"
                                            onClick={() => window.open(`/Servings/${patient.id}`, '_blank')}
                                        >
                                            <strong className="text-gray-700 mt-2">
                                                {patient.department?.deptname ?? "TR"}
                                            </strong>
                                            <h3 className="text-blue-600 font-bold">
                                                {patient.ticketNumber}
                                            </h3>
                                            <p className="text-black-700 mt-2">{patient.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Waiting Patients Section */}
                    <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-blue-700 text-xl font-bold">WAITING PATIENTS</h2>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 font-medium">
                                    Number of Patients
                                </span>
                                <input
                                    type="text"
                                    value={waitingPatients.length}
                                    readOnly
                                    className="w-12 text-center p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {waitingPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    className="bg-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4 text-center cursor-pointer"
                                    onClick={() => window.open(`/Servings/${patient.id}`, '_blank')}
                                >
                                    <strong className="text-gray-700 mt-2">
                                        {patient.department?.deptname ?? "TR"}
                                    </strong>
                                    <h3 className="text-blue-600 font-bold">
                                        {patient.ticketNumber}
                                    </h3>
                                    <p className="text-black-700 mt-2">{patient.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* In Progress Patients Section */}
                    <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-blue-700 text-xl font-bold">IN PROGRESS</h2>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 font-medium">
                                    Number of Patients
                                </span>
                                <input
                                    type="text"
                                    value={inProgressPatients.length}
                                    readOnly
                                    className="w-12 text-center p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {inProgressPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    className="bg-green-100 border-l-4 border-green-500 rounded-lg p-4 text-center cursor-pointer"
                                    onClick={() => window.open(`/Servings/${patient.id}`, '_blank')}
                                >
                                    <strong className="text-gray-700 mt-2">
                                        {patient.department?.deptname ?? "TR"}
                                    </strong>
                                    <h3 className="text-blue-600 font-bold">
                                        {patient.ticketNumber}
                                    </h3>
                                    <p className="text-black-700 mt-2">{patient.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="mt-6 flex justify-end">
                        <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"  onClick={() => navigate(-1)}>
                            Close
                        </button>
                    </div>
                </div>
            </SideNav>
        </>
    );
};

export default Departmentmonitoring;
