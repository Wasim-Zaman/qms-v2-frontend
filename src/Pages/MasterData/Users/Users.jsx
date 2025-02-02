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
import { FaSearch,  FaTrash, FaUserPlus } from "react-icons/fa";
import SideNav from "../../../components/Sidebar/SideNav";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import newRequest from "../../../utils/newRequest";
import AssignRoles from "./AssignRoles";
import { IoPersonRemove } from "react-icons/io5";
import Removeassignrole from "./Removeassignrole";


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

function Users() {
    const [Userdata, setUserdata] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [UserAssignRoles, setUserAssignRoles] = useState(false);
    const [selectedUsers, setselectedUsers] = useState(null);
    const [removeUserAssignRoles, setremoveUserAssignRoles] = useState(false)
    const [removeselectedUsers, setremoveselectedUsers] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await newRequest.get("/api/v1/user", {
                params: { page, search },
            });
            setUserdata(response?.data?.data?.users || []);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error("Error fetching User:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const handleDelete = async (User) => {
        Swal.fire({
            title: `Are you sure to delete this record?`,
            text: `You will not be able to recover this! ${User?.name || ""}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, Delete!`,
            cancelButtonText: `No, keep it!`,
            confirmButtonColor: "#1E3B8B",
            cancelButtonColor: "#FF0032",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await newRequest.delete(`/api/v1/user/${User?.id}`);
                    toast.success(response?.data?.message || "User has been deleted successfully");
                    fetchUsers();
                } catch (error) {
                    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
                    toast.error(errorMessage);
                }
            }
        });
    };

    const handleAssignrole = (department) => {
        setselectedUsers(department);
        setUserAssignRoles(true);
    };

     const handleAssignroleremove = (roles) => {
       setremoveselectedUsers(roles);
       setremoveUserAssignRoles(true);
     };

    const columns = [
        { name: "NAME", uid: "name" },
        { name: "EMAIL", uid: "email" },
        { name: "ROLE", uid: "role" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const renderCell = (Roles, columnKey) => {
        switch (columnKey) {
          case "name":
            return <span>{Roles.name || ""}</span>;
          case "email":
            return <span>{Roles.email || ""}</span>;
          case "role":
            return (
              <span
                className="border-green-500 text-green-600 border rounded-lg px-3 py-1 block w-[500px] break-words" // w-72 is equivalent to 300px
                title={
                  Roles.roles && Roles.roles.length > 0
                    ? Roles.roles.map((role) => role.name).join(", ")
                    : "No Role Assigned"
                }
              >
                {Roles.roles && Roles.roles.length > 0
                  ? Roles.roles.map((role) => role.name).join(", ")
                  : "No Role Assigned"}
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
                  <DropdownMenu className="bg-slate-300 w-full pe-5 rounded-md shadow-lg">
                    <DropdownItem
                      key="Assign"
                      className="py-1 px-3 flex items-center gap-2 hover:bg-gray-400 rounded-md transition-all duration-200"
                      startContent={<FaUserPlus className="text-gray-600" />}
                      onClick={() => handleAssignrole(Roles)}
                    >
                      Assign Role
                    </DropdownItem>
                    <DropdownItem
                      key="Assign"
                      className="py-1 px-3 flex items-center gap-2 hover:bg-gray-400 rounded-md transition-all duration-200"
                      startContent={
                        <IoPersonRemove className="text-gray-600" />
                      }
                      onClick={() => handleAssignroleremove(Roles)}
                    >
                      Remove Role
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="py-1 px-3 hover:bg-gray-400 rounded-md text-red-600 transition-all duration-200"
                      startContent={<FaTrash className="text-red-600" />}
                      onClick={() => handleDelete(Roles)}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            );
          default:
            return Roles[columnKey];
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
                        placeholder="Search by Users name..."
                        startContent={<FaSearch className="text-default-300 me-2" />}
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
                    {pagination?.total || 0} Users in total
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
                <Table
                    aria-label="Users table"
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
                        items={Userdata}
                        emptyContent="No Users found"
                        isLoading={loading}
                        loadingContent={<Spinner label="Loading..." />}
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
            {UserAssignRoles && (
                <AssignRoles
                    isVisible={UserAssignRoles}
                    setVisibility={() => setUserAssignRoles(false)}
                    refreshDepartments={fetchUsers}
                    selectdatauser={selectedUsers}
                />
            )}
             {removeUserAssignRoles && (
                <Removeassignrole
                    isVisible={removeUserAssignRoles}
                    setVisibility={() => setremoveUserAssignRoles(false)}
                    refreshuser={fetchUsers}
                    selectdatauser={removeselectedUsers}
                />
            )}
        </SideNav>
    );
}

export default Users;
