import React, { useState } from "react";
import SideNav from "../../components/Sidebar/SideNav";
import Patientsnumberchat from "./Patientsnumberchat";
import PrevouseJourney from "./prevouseJourney";
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
             
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-primary rounded-md shadow-md">
                  <Patientsnumberchat />
                </div>
                
                <div className="bg-primary rounded-md shadow-md">
                  <DepartmentData />
                </div>
                <div className="bg-primary rounded-md shadow-md">
                  <EyeBall />
                </div>
                <div className="bg-primary rounded-md shadow-md">
                  <PrevouseJourney />
                </div>
              </div>
            </div>
          </div>
        </SideNav>
      </>
    );
};

export default Kpi;
