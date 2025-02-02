import React, { useState, useEffect, useMemo } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Input,
    Pagination,
    Spinner,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { FaSearch, FaPlus, FaEye, FaTrash, FaEdit } from "react-icons/fa";
import SideNav from "../../components/Sidebar/SideNav";
import AddDepartment from "./AddDepartment";
import Swal from "sweetalert2";
import UpdateDepartment from "./UpdateDepartment";
import toast from "react-hot-toast";
import newRequest from "../../utils/newRequest";

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

function Department() {
    const [departments, setDepartments] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isAdddepartmentModalOpen, setIsAdddepartmentModalOpen] = useState(false);
    const [editDepartment, seteditDepartment] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await newRequest.get("/api/v1/departments", {
                params: { page, search },
            });
            setDepartments(response?.data?.data?.data || []);
            setPagination(response.data.data.pagination);

        } catch (error) {
            console.error("Error fetching departments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [page, search]);

    const handleDelete = async (department) => {
        Swal.fire({
            title: `Are you sure to delete this record?`,
            text: `You will not be able to recover this! ${department?.deptname || ""}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, Delete!`,
            cancelButtonText: `No, keep it!`,
            confirmButtonColor: "#1E3B8B",
            cancelButtonColor: "#FF0032",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await newRequest.delete(`/api/v1/departments/${department?.deptcode}`);
                    toast.success(response?.data?.message || "Department has been deleted successfully");
                    fetchDepartments();
                } catch (error) {
                    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
                    toast.error(errorMessage);
                }
            }
        });
    };

    const handleedit = (department) => {
      setSelectedDepartment(department);
      seteditDepartment(true);
    };

    const columns = [
        { name: "DEPARTMENT NAME", uid: "name" },
        { name: "DEPARTMENT CODE", uid: "code" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const renderCell = (department, columnKey) => {
        switch (columnKey) {
            case "name":
                return <span>{department.deptname || "Uncategorized"}</span>;
            case "code":
                return <span>{department.deptcode || "Uncategorized"}</span>;
            case "actions":
                return (
                    <div className="relative flex justify-center items-center">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu className="bg-slate-300 w-[120px] rounded-md shadow-lg">
                                <DropdownItem
                                    key="edit"
                                    className="py-1 px-3 flex items-center gap-2 hover:bg-gray-400 rounded-md transition-all duration-200"
                                    startContent={<FaEdit className="text-gray-600" />}
                                    onClick={() => handleedit(department)}
                                >
                                    Edit
                                </DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="py-1 px-3 hover:bg-gray-400 rounded-md text-red-600 transition-all duration-200"
                                    startContent={<FaTrash className="text-red-600" />}
                                    onClick={() => handleDelete(department)}
                                >
                                    Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return department[columnKey];
        }
    };


    const topContent = useMemo(
        () => (
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex justify-between items-center">
                    <Input
                        isClearable
                        value={search}
                        onValueChange={setSearch}
                        className="w-full sm:max-w-[44%] border-green-700 border py-1 rounded-lg focus:outline-none"
                        placeholder="Search by department name..."
                        startContent={<FaSearch className="text-default-300 me-2" />}
                    />

                    <Button
                        className="bg-navy-600 border border-green-700 outline-none bg-transparent hover:bg-green-700 text-green-700 hover:text-white transition-all duration-300 rounded-lg py-2"
                        startContent={<FaPlus />}
                        onClick={() => setIsAdddepartmentModalOpen(true)}
                    >
                        Add New Department
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
                    {pagination?.total || 0} departments in total
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    classNames={{
                        wrapper: "gap-0 overflow-visible h-8",
                        item: "w-8 h-8 text-sm rounded-none",
                        cursor: "bg-navy-600 text-white font-bold",
                    }}
                    page={page}
                    total={pagination?.totalPages || 1}
                    onChange={setPage}
                />
            </div>
        ),
        [page, pagination]
    );

    return (
      <SideNav>
        <div className="p-6 bg-blue-50 min-h-screen">
          {/* <h1 className="text-2xl font-bold mb-4">Departments</h1> */}
          <Table
            aria-label="Departments table"
            bottomContent={bottomContent}
            topContent={topContent}
            classNames={{
              wrapper: "shadow-md rounded-lg bg-white mt-6",
            }}
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
              items={departments}
              emptyContent="No departments found"
              isLoading={loading}
              loadingContent={<Spinner label="Loading..." />}
            >
              {(item) => (
                <TableRow key={item.deptcode}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {isAdddepartmentModalOpen && (
          <AddDepartment
            isVisible={isAdddepartmentModalOpen}
            setVisibility={() => setIsAdddepartmentModalOpen(false)}
            refreshDepartments={fetchDepartments}
          />
        )}
        {editDepartment && (
          <UpdateDepartment
            isVisible={editDepartment}
            setVisibility={() => seteditDepartment(false)}
            refreshDepartments={fetchDepartments}
            selectdatadepartment={selectedDepartment}
          />
        )}
      </SideNav>
    );
}

export default Department;
