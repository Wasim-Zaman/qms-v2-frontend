import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Spinner } from "@heroui/spinner";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaSearch, FaFileExcel, } from "react-icons/fa";
import newRequest from "../../utils/newRequest";
import SideNav from "../../components/Sidebar/SideNav";
import PickerFilter from "./PickerFilter";
import PickerSort from "./PickerSort";
import PatientJourneyDetails from "./PatientJourneyDetails"


export const VerticalDotsIcon = ({ size = 24, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <path
                d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="currentColor"
            />
        </svg>
    );
};

function PatientJourney() {
    const [AllRoles, setAllRoles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [filters, setFilters] = useState({});
    const [Detailspatient, setDetailspatient] = useState(false);
    
    const [selectedData, setselectedData] = useState(null);

        const handledetaild = (Roless) => {
            setselectedData(Roless);
          setDetailspatient(true);
        };

    const fetchAllRoles = async () => {
        setLoading(true);
        try {
            const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
                if (value !== "" && value !== null && value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const response = await newRequest.get("/api/v2/patients/journeys", {
                params: { 
                    page,
                    sortBy, 
                    order: sortOrder,
                    ...cleanFilters,
                    search: search || undefined  // Add search parameter
                },
            });
            setAllRoles(response?.data?.data?.data || []);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error("Error fetching Role:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllRoles();
    }, [page, sortBy, sortOrder, filters, search]);

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

    const calculateTotalHours = (treatmentEnded, registration) => {
        const treatmentEndedtime = new Date(treatmentEnded);
        const registrationtime = new Date(registration);
        const totalTime = treatmentEndedtime - registrationtime; // Difference in milliseconds
        const hours = Math.floor(totalTime / 3600000); // Convert to hours
        const minutes = Math.floor((totalTime % 3600000) / 60000); // Convert to minutes
        // If the total time is less than an hour, show "0 hrs"
        const displayHours = hours > 0 ? `${hours} hrs` : "0 hrs";
        return `${displayHours} ${minutes} min`; // Return formatted result
    };

    const columns = [
      { name: "Name", uid: "name", sortable: true },
      { name: "MRN Number", uid: "mrnNumber", sortable: true },
      { name: "Mobile Number", uid: "mobileNumber", sortable: true },
      { name: "Gender", uid: "sex", sortable: true },
      { name: "Blood Group", uid: "bloodGroup", sortable: true },
      // { name: "Bed", uid: "bed" },
      { name: "status", uid: "status", sortable: true },
      { name: "ACTIONS", uid: "actions" },
    ];

    const renderCell = (Roless, columnKey) => {
        switch (columnKey) {
            case "name":
                return <span>{Roless?.name || ""}</span>;
            case "mrnNumber":
                return <span>{Roless?.mrnNumber || ""}</span>;
            case "mobileNumber":
                return <span>{Roless?.mobileNumber || ""}</span>;
            case "sex":
                return <span>{Roless?.sex || ""}</span>;
            case "bloodGroup":
                return <span>{Roless?.bloodGroup || ""}</span>;
            // case "bed":
            //     return <span>{Roless?.bed.bedNumber || ""}</span>;
            case "status":
                return (
                  <span
                    className={`border rounded-lg px-3 py-1 ${
                      Roless?.status === "Urgent"
                        ? "border-[#FF0000] text-[#FF0000]" // Red for Non-urgent
                        : Roless?.status === "Critical"
                        ? "border-[#FF5722] text-[#FF5722]" // Orange for Critical
                        : "border-[#4CAF50] text-[#4CAF50]" // Green for Urgent (default)
                    }`}
                  >
                    {Roless?.status || ""}
                  </span>
                );
             case "actions":
                return (
                    <div className="relative flex justify-center items-center">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem
                                    key="edit"
                                    className="py-1 px-3 flex items-center gap-2 hover:bg-gray-400 rounded-md transition-all duration-200"
                                    startContent={<BiSolidUserDetail  className="text-gray-600" size={24}/>}
                                    onClick={() => handledetaild(Roless)}
                                >
                                    Details
                                </DropdownItem>
                              
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return PatientJourney[columnKey];
        }
    };

    const topContent = useMemo(
        () => (
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center">
                    <Input
                        isClearable
                        value={search}
                        onValueChange={(value) => {
                            setSearch(value);
                            setPage(1); // Reset to first page when searching
                        }}
                        className="w-full sm:max-w-[44%] border-green-700 border py-1 rounded-lg focus:outline-none"
                        placeholder="Search by patient name or MRN ..."
                        startContent={<FaSearch className="text-default-300 me-2" />}
                    />

                    <PickerFilter
                        onFilterChange={(newFilters) => {
                            setFilters(newFilters);
                            fetchAllRoles();
                        }}
                    />

                    <PickerSort
                        onSort={({ sortBy: newSortBy, sortOrder: newSortOrder }) => {
                            setSortBy(newSortBy);
                            setSortOrder(newSortOrder);
                        }}
                        currentSortBy={sortBy}
                        currentSortOrder={sortOrder}
                    />

                    <Button
                        className="bg-navy-600 border border-green-700 outline-none bg-transparent hover:bg-green-700 text-green-700 hover:text-white transition-all duration-300 rounded-lg py-2 ms-2"
                        startContent={<FaFileExcel />}
                        onClick={() => {
                            // Add your export logic here
                            console.log("Export to Excel clicked");
                        }}
                    >
                        Export to Excel
                    </Button>
                </div>
            </div>
        ),
        [search]
    );

    const bottomContent = useMemo(
      () => (
        <div className="py-2 px-2 flex justify-between items-center">
          <span className="w-[30%] text-sm text-gray-500">
            {pagination?.total || 0} Patient Journey in total
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pagination?.totalPages || 1}
            onChange={setPage}
          />
        </div>
      ),
      [page, pagination]
    );

    const handleColumnSort = (descriptor) => {
        const newSortBy = descriptor.column;
        const newSortOrder = descriptor.direction === "ascending" ? "asc" : "desc";
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    return (
      <SideNav>
        <div className="p-6 bg-blue-50 min-h-screen">
          <Table
            aria-label="Patient Journey"
            bottomContent={bottomContent}
            topContent={topContent}
            classNames={{
              wrapper: "shadow-md rounded-lg bg-white mt-6 w-full ",
            }}
            sortDescriptor={{
              column: sortBy,
              direction: sortOrder === "asc" ? "ascending" : "descending",
            }}
            onSortChange={handleColumnSort}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  className="bg-gray-50 text-gray-600"
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={AllRoles}
              emptyContent="No Patient Journey found"
              isLoading={loading}
              loadingContent={<Spinner color="secondary" size="lg" />}
            >
              {(item) => (
                <TableRow key={item.patientId}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {Detailspatient && (
          <PatientJourneyDetails
            isVisible={Detailspatient}
            setVisibility={() => setDetailspatient(false)}
            selectdataPatientJourney={selectedData}
          />
        )}
      </SideNav>
    );
}

export default PatientJourney;
