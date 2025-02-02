import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { baseUrl } from "../../utils/config";
import SideNav from "../../components/Sidebar/SideNav";
import Spinner from "../../components/spinner/spinner";

const PatientMonitoring = () => {
  const [waitingPatients, setWaitingPatients] = useState([]);
  const [nowServing, setNowServing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${baseUrl}/api/v1/patients/by-state`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (response.data.success) {
          setWaitingPatients(response.data.data.waiting || []);
          setNowServing(response.data.data.inProgress || []);
        } else {
          setError("Failed to fetch patient data.");
        }
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

 

  return (
    <>
    <SideNav>
    <div className="bg-blue-50 min-h-screen p-6">
     
      {/* Header Section */}
      <div className="bg-purple-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Monitoring</h1>
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

      {/* Waiting Patients Section */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-yellow-500 text-xl font-bold">WAITING PATIENTS</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Number of Patients</span>
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
              className="bg-green-100 border-l-4 border-green-500 rounded-lg p-4 text-center cursor-pointer"
              onClick={() => window.open(`/waiting-area/${patient.id}`, '_blank')}
            >
            <strong className="text-gray-700 mt-2">{patient.department ? patient.department?.deptname : "TR"?? "TR"}</strong>
              <h3 className="text-green-600 font-bold">{patient.ticketNumber}</h3>
              <p className="text-black-700 mt-2">{patient.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Now Serving Section */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-blue-700 text-xl font-bold">ASSIGNED</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Number of Patients</span>
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
              <strong className="text-gray-700 mt-2">{patient.department ? patient.department?.deptname : "TR"?? "TR"}</strong>
              <h3 className="text-blue-600 font-bold">{patient.ticketNumber}</h3>
              <p className="text-black-700 mt-2">{patient.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-6 flex justify-end">
        {/* <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
          Close
        </button> */}
      </div>
    </div>
    </SideNav>
    </>
  );
};

export default PatientMonitoring;
