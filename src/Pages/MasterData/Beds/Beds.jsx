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
import SideNav from "../../../components/Sidebar/SideNav";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import newRequest from "../../../utils/newRequest";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddBed from "./AddBed";
import UpdateBed from "./UpdateBed";

function Beds() {
    const [getallbeds, setgetallbeds] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isAddbedsModalOpen, setisAddbedsModalOpen] =
        useState(false);
    const [editBed, seteditBed] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);

    const fetchbeds = async () => {
        setLoading(true);
        try {
            const response = await newRequest.get("/api/v1/beds", {
                params: { page, search },
            });
            setgetallbeds(response?.data?.data?.beds || []);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error("Error fetching Bed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchbeds();
    }, [page, search]);

    const handleDelete = async (bedss) => {
        Swal.fire({
            title: `Are you sure to delete this record?`,
            text: `You will not be able to recover this! ${bedss?.bedNumber || ""
                }`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, Delete!`,
            cancelButtonText: `No, keep it!`,
            confirmButtonColor: "#1E3B8B",
            cancelButtonColor: "#FF0032",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await newRequest.delete(`/api/v1/beds/${bedss?.id}`);
                    toast.success(response?.data?.message ||"Bed has been deleted successfully");
                    fetchbeds();
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message || "An unexpected error occurred";
                    toast.error(errorMessage);
                }
            }
        });
    };

    const handleedit = (bedss) => {
        setSelectedBed(bedss);
        seteditBed(true);
    };

    const columns = [
        { name: "BED NUMBER", uid: "bednumber" },
        { name: "STATUS", uid: "status" },
        { name: "CREATED DATE", uid: "createdAt" },
        { name: "UPDATED DATE", uid: "updatedAt" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const renderCell = (bedss, columnKey) => {
        switch (columnKey) {
            case "bednumber":
                return <span>{bedss.bedNumber || ""}</span>;
            case "status":
                return <span
                    className={`border rounded-lg px-3 py-1 ${bedss.bedStatus === "Available"
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-600"
                        }`}
                >{bedss.bedStatus || ""}</span>;
            case "createdAt":
                return (
                    <p className="text-sm">
                        {new Date(bedss.createdAt).toLocaleDateString()}
                    </p>
                );
            case "updatedAt":
                return (
                    <p className="text-sm">
                        {new Date(bedss.updatedAt).toLocaleDateString()}
                    </p>
                );
            case "actions":
                return (
                    <div className="relative flex justify-center items-center">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <BsThreeDotsVertical className="text-default-300" size={20} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu className="bg-slate-300 w-[120px] rounded-md shadow-lg">
                                <DropdownItem
                                    key="edit"
                                    className="py-1 px-3 flex items-center gap-2 hover:bg-gray-400 rounded-md transition-all duration-200"
                                    startContent={<FaEdit className="text-gray-600" />}
                                    onClick={() => handleedit(bedss)}
                                >
                                    Edit
                                </DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="py-1 px-3 hover:bg-gray-400 rounded-md text-red-600 transition-all duration-200"
                                    startContent={<FaTrash className="text-red-600" />}
                                    onClick={() => handleDelete(bedss)}
                                >
                                    Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return bedss[columnKey];
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
                        placeholder="Search by Bed name..."
                        startContent={<FaSearch className="text-default-300 me-2" />}
                    />

                    <Button
                        className="bg-navy-600 border border-green-700 outline-none bg-transparent hover:bg-green-700 text-green-700 hover:text-white transition-all duration-300 rounded-lg py-2"
                        startContent={<FaPlus />}
                        onClick={() => setisAddbedsModalOpen(true)}
                    >
                        Add New Bed
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
                    {pagination?.total || 0} Beds in total
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
            aria-label="Beds table"
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
              items={getallbeds}
              emptyContent="No Beds found"
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
        {isAddbedsModalOpen && (
          <AddBed
            isVisible={isAddbedsModalOpen}
            setVisibility={() => setisAddbedsModalOpen(false)}
            refreshbeds={fetchbeds}
          />
        )}
        {editBed && (
          <UpdateBed
            isVisible={editBed}
            setVisibility={() => seteditBed(false)}
            refreshBeds={fetchbeds}
            selectdataBed={selectedBed}
          />
        )}
      </SideNav>
    );
}

export default Beds;
