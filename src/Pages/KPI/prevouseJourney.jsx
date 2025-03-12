import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
} from "@nextui-org/react";
import { FaSearch, FaFileExcel } from "react-icons/fa";
import newRequest from "../../utils/newRequest";
import PickerFilter from "../PatientJourney2/PickerFilter";
import PickerSort from "../PatientJourney2/PickerSort";

const PrevouseJourney = ({ data }) => {
  const [AllRoles, setAllRoles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({});

  const fetchAllRoles = async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await newRequest.get("/api/v1/journeys/previous", {
        params: {
          page,
          sortBy,
          order: sortOrder,
          ...cleanFilters,
          search: search || undefined,
        },
      });
      setAllRoles(response?.data?.data?.journeys || []);
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

  const columns = [
    { name: "Name", uid: "name", sortable: true },
    { name: "MRN Number", uid: "mrnNumber", sortable: true },
    { name: "First Call", uid: "firstCallTime", sortable: true },
    { name: "Vital", uid: "vitalTime", sortable: true },
    { name: "Assign Department", uid: "assignDeptTime", sortable: true },
    { name: "Second Call", uid: "secondCallTime", sortable: true },
    { name: "Begin Time", uid: "beginTime", sortable: true },
    { name: "End Time", uid: "endTime", sortable: true },
  ];

  const renderCell = (journey, columnKey) => {
    switch (columnKey) {
      case "name":
        return <span>{journey?.patient?.name || ""}</span>;
      case "mrnNumber":
        return <span>{journey?.patient?.mrnNumber || ""}</span>;
      case "firstCallTime":
        return <span>{journey?.firstCallTime || "Not Set"}</span>;
      case "vitalTime":
        return <span>{journey?.vitalTime || "Not Set"}</span>;
      case "assignDeptTime":
        return <span>{journey?.assignDeptTime || "Not Set"}</span>;
      case "secondCallTime":
        return <span>{journey?.secondCallTime || "Not Set"}</span>;
      case "beginTime":
        return <span>{journey?.beginTime || "Not Set"}</span>;
      case "endTime":
        return <span>{journey?.endTime || "Not Set"}</span>;
      default:
        return null;
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
              setPage(1);
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
        </div>
      </div>
    ),
    [search]
  );

  const bottomContent = useMemo(
    () => (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-sm text-gray-500">
          {pagination?.total || 0} Previous Patient Journey in total
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
    <div style={{ width: "100%", marginLeft: "20px" }}>
      <Table
        aria-label="Previous Patient Journey"
        bottomContent={bottomContent}
        topContent={topContent}
        classNames={{
          wrapper: "shadow-md rounded-lg bg-white mt-6 w-full",
          base: "h-[480px]",
          table: "min-h-[400px]",
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
          emptyContent="No Previous Patient Journey found"
          isLoading={loading}
          loadingContent={<Spinner color="secondary" size="lg" />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrevouseJourney;
