import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideNav from "../../components/Sidebar/SideNav";
import Spinner from "../../components/spinner/spinner";
import newRequest from "../../utils/newRequest";

const Departmentmonitoring = () => {
    const [nowServing, setNowServing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { id } = useParams();
    // Fetch data from API
    useEffect(() => {
      const fetchPatients = async () => {
        try {
          setLoading(true);
          const response = await newRequest.get(
            `/api/v1/patients/by-department?deptId=${id}`
          );
          setNowServing(response.data.data || []);
        } catch (err) {
          setError("Error fetching data: " + err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPatients();
    }, [id]);

    return (
        <>
            <SideNav>
                <div className="bg-blue-50 min-h-screen p-6">
                    {/* Header Section */}
                    <div className="bg-purple-500 text-white p-4 flex justify-between items-center">
                        <h1 className="text-lg font-bold">DEPARTMENT MONITORING</h1>
                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                placeholder="Scan the Barcode"
                                className="p-2 rounded-lg text-black w-80"
                            />
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                Called Patients List
                            </button>
                        </div>
                    </div>

                    {/* Loading Spinner */}
                    {loading && <Spinner />}

                    {/* Now Serving Section */}
                    <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-blue-700 text-xl font-bold">DEPARTMENT</h2>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 font-medium">
                                    Number of Patients
                                </span>
                                <input
                                    type="text"
                                    value={nowServing.length}
                                    readOnly
                                    className="w-12 text-center p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {nowServing.map((patient) => (
                                <div
                                    key={patient.id}
                                    className="bg-blue-100 border-l-4 border-blue-500 rounded-lg p-4 text-center cursor-pointer"
                                    onClick={() => window.open(`/Servings/${patient.id}`, '_blank')}
                                >
                                    <strong className="text-gray-700 mt-2">
                                        {patient.department
                                            ? patient.department?.deptname
                                            : "TR" ?? "TR"}
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
