import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import {
  Table,
  Pagination,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import newRequest from "../../utils/newRequest";
import getTotalTimeString from "../../utils/Funtions/totalTimeCalculator";
const PatientJourneyDetails = ({
  isVisible,
  setVisibility,
  selectdataPatientJourney,
}) => {
  const patientsDate = selectdataPatientJourney;
  const { t } = useTranslation();
  const modalRef = useRef(null);
  if (!isVisible) return null;

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [patientsDateget, setpatientsDateget] = useState([]);
  const [patientdatelenght, setpatientdatelenght] = useState("");

  const refreshUsersWithoutSearch = async () => {
    setLoading(true);
    try {
      const response = await newRequest.get(
        `/api/v1/journeys/patient/${patientsDate?.id || ""}`
      );
      setpatientsDateget(response?.data?.data || []);
      setpatientdatelenght(response?.data?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching User:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsersWithoutSearch();
  }, []);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return ""; // Handle empty values
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return ""; // Check for valid date
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric", // Fix: Use "numeric" instead of "4-digit"
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const columns = [
    { name: "NAME", uid: "name", sortable: true },
    { name: "MRN NUMBER", uid: "mrnNumber", sortable: true },
    { name: "REGISTRATION", uid: "registration", sortable: true },
    { name: "TRIAGE", uid: "firstCall", sortable: true },
    { name: "Dept. Call", uid: "secondCall", sortable: true },
    { name: "Vital Signs", uid: "vitalSigns" },
    { name: "Department Assigned", uid: "departmentAssigned", sortable: true },
    { name: "Treatment Began", uid: "treatmentBegan", sortable: true },
    { name: "Treatment Ended", uid: "treatmentEnded", sortable: true },
    { name: "Total Hrs", uid: "totalHrs", sortable: false },
  ];

  const renderCell = (Roless, columnKey) => {
    switch (columnKey) {
      case "name":
        return <span>{Roless?.patient?.name || ""}</span>;
      case "mrnNumber":
        return <span>{Roless?.patient?.mrnNumber || ""}</span>;
      case "registration":
        return <span>{formatDateTime(Roless?.createdAt) || ""}</span>;
      case "firstCall":
        return <span>{formatDateTime(Roless?.firstCallTime) || ""}</span>;
      case "secondCall":
        return <span>{formatDateTime(Roless?.secondCallTime) || ""}</span>;
      case "vitalSigns":
        return <span>{formatDateTime(Roless?.vitalTime) || ""}</span>;
      case "departmentAssigned":
        return <span>{formatDateTime(Roless?.assignDeptTime) || ""}</span>;
      case "treatmentBegan":
        return <span>{formatDateTime(Roless?.beginTime) || ""}</span>;
      case "treatmentEnded":
        return <span>{formatDateTime(Roless?.endTime) || ""}</span>;
      case "totalHrs":
        return (
          <span>
            {getTotalTimeString(
              Roless.registrationDate,
              Roless.firstCallTime,
              Roless.vitalTime,
              Roless.assignDeptTime,
              Roless.secondCallTime,
              Roless.beginTime,
              Roless.endTime
            ) || ""}
          </span>
        );
      default:
        return PatientJourneyDetails[columnKey];
    }
  };
  console.log(patientdatelenght, "patientsDateget?.length");

  const bottomContent = useMemo(
    () => (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-sm text-gray-500">
          {patientdatelenght} Patient Journey in total
        </span>
        {/* <Pagination
             isCompact
             showControls
             showShadow
             color="secondary"
             //  page={page}
             //  total={pagination?.totalPages || 1}
             //  onChange={setPage}
           /> */}
      </div>
    ),
    [page, pagination]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div
        ref={modalRef} // Attach the ref to the modal
        className="bg-white rounded-lg shadow-lg w-full max-w-7xl"
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: "#5B4DF5" }}
        >
          <h2 className="text-white text-xl font-semibold">
            {t("Journey History")}
          </h2>
          <div className="flex items-center gap-4">
            <button onClick={() => setVisibility(false)}>
              <CloseIcon style={{ color: "white" }} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <Table
            aria-label="Patient Journey"
            // bottomContent={bottomContent}
            classNames={{
              wrapper: "shadow-md rounded-lg bg-white mt-6 w-full  ",
              td: "border-b border-divider py-4",
              tr: "hover:bg-default-100",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  className="border-b border-divider uppercase "
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={patientsDateget}
              emptyContent="No Patient Journey found"
              isLoading={loading}
              loadingContent={<Spinner color="secondary" size="lg" />}
            >
              {(item) => (
                <TableRow key={item.patientId}>
                  {(columnKey) => (
                    <TableCell className="whitespace-nowrap">
                      {renderCell(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-400"
              onClick={() => setVisibility(false)}
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientJourneyDetails;
