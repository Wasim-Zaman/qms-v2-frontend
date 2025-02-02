import React, { useState } from "react";
import SideNav from "../../components/Sidebar/SideNav";
import Patientsnumberchat from "./Patientsnumberchat";
import Categorychat from "./Categorychat";
import DepartmentData from "./departmentData";
import EyeBall from "./eyeBall";
const Kpi = () => {
     const dummyData = [
       { month: "January", GTIN: 100, GLN: 200, BrandName: 150 },
       { month: "February", GTIN: 120, GLN: 220, BrandName: 180 },
       { month: "March", GTIN: 140, GLN: 240, BrandName: 190 },
       { month: "April", GTIN: 160, GLN: 260, BrandName: 200 },
       { month: "May", GTIN: 180, GLN: 280, BrandName: 220 },
       { month: "June", GTIN: 200, GLN: 300, BrandName: 250 },
     ];
    return (
      <>
        <SideNav>
          <div className="min-h-screen bg-green-100 p-8 shadow-md">
            <div className="bg-white shadow-lg rounded-lg p-6">
              {/* Top button section */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
                <button className="bg-[#13BA88] text-white font-semibold py-2 rounded hover:bg-yellow-600">
                  Graph
                </button>
                <button className="bg-[#13BA88] text-white font-semibold py-2 rounded hover:bg-blue-600">
                  Values
                </button>
                <button className="bg-[#13BA88] text-white font-semibold py-2 rounded hover:bg-green-600">
                  Search
                </button>
              </div>
              <div className="flex justify-between my-auto mt-6">
                <div className="grid grid-cols-3 md:grid-cols-3 gap-2 ">
                  <button className="bg-white text-black shadow-md  font-semibold py-2 rounde-lg px-2">
                    Today
                  </button>
                  <button className="bg-white text-black shadow-md  font-semibold py-2 rounde-lg px-2">
                    This Week
                  </button>
                  <button className="bg-white text-black shadow-md  font-semibold py-2 rounde-lg px-2">
                    This Month
                  </button>
                </div>
                <div className="flex my-auto ">
                  <p className="text-black text-lg w-full">Date Range</p>
                  <input
                    type="date"
                    className="w-full border border-green-500 rounded px-2 ms-2"
                  />
                  <p className="text-black text-lg mx-3 my-auto">To</p>
                  <input
                    type="date"
                    className="w-full border border-green-500 rounded px-2 "
                  />
                  <button className="bg-[#13BA88] text-white hover:text-[#13BA88] ms-3 font-semibold px-4 rounded hover:bg-transparent hover:border-[#13BA88] border">
                    Refresh
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-primary rounded-md shadow-md">
                  <Patientsnumberchat data={dummyData} />
                </div>
                <div className="bg-primary rounded-md shadow-md">
                  <Categorychat data={dummyData} />
                </div>
                <div className="bg-primary rounded-md shadow-md">
                  <DepartmentData />
                </div>
                <div className="bg-primary rounded-md shadow-md">
                  <EyeBall />
                </div>
              </div>
            </div>
          </div>
        </SideNav>
      </>
    );
};

export default Kpi;
