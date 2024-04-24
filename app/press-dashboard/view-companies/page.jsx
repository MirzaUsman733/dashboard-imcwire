'use client'
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Container, TableHead } from "@mui/material";
import { FaBuilding, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteButton from "../../components/DeleteButton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InfinitySpin } from "react-loader-spinner";
import TawkTo from "../../components/TawkTo";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#7E22CE",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const fetchDataFromAPI = async (session) => {
  try {
    const response = await fetch("/api/add-company");
    const data = await response.json();
    console.log(data)
    // Filter data based on session email
    const filteredData = data.filter((plan) => plan?.user?.user?.email === session?.email);
    console.log(filteredData)
    return filteredData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default function CompaniesTable() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(new Array(rows.length).fill(null));

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    fetchDataFromAPI().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const handleDeleteClick = (id, index) => {
    fetch(`/api/add-company`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => {
        if (response.ok) {
          fetchDataFromAPI().then((data) => setRows(data));
        } else {
          console.error("Failed to delete");
        }
      })
      .catch((error) => console.error("Error deleting:", error))
      .finally(() => {
        handleMenuClose(index);
      });
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl((prevAnchorEl) => {
      const newAnchorEl = [...prevAnchorEl];
      newAnchorEl[index] = event.currentTarget;
      return newAnchorEl;
    });
  };

  const handleMenuClose = (index) => {
    setAnchorEl((prevAnchorEl) => {
      const newAnchorEl = [...prevAnchorEl];
      newAnchorEl[index] = null;
      return newAnchorEl;
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
console.log(rows)
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  if (loading) {
    return (
      <div className="h-[100vh] flex justify-center items-center w-full">
      <TawkTo/>

        <InfinitySpin
          visible={true}
          width="200"
          color="#7E22CE"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  } else if (session && sessionStatus === "authenticated" && rows) {
    return (
      <Container>
        <h1 className="text-5xl font-extrabold my-10 text-center text-purple-700">
          <div className="flex justify-center gap-5">
            <FaBuilding /> <span> View Companies </span>
          </div>
        </h1>
        <TableContainer
          component={Paper}
          className="shadow-lg"
        >
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell className="font-bold">#</StyledTableCell>
                <StyledTableCell className="font-bold">
                  Company Name
                </StyledTableCell>
                <StyledTableCell className="font-bold">Name</StyledTableCell>
                <StyledTableCell className="font-bold">Country</StyledTableCell>
                <StyledTableCell className="font-bold">
                  Address1 / Address2
                </StyledTableCell>
                <StyledTableCell className="font-bold">State</StyledTableCell>
                <StyledTableCell className="font-bold">
                  Email / Phone
                </StyledTableCell>
                <StyledTableCell className="font-bold">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row, index) => (
                <StyledTableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.companyName}</TableCell>
                  <TableCell>{row.contactName}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>
                    <div> {row.address1} </div>
                    <div> {row.address2} </div>
                  </TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell>
                    <div> {row.email} </div> {row.phone}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      aria-controls={`actions-menu-${index}`}
                      aria-haspopup="true"
                      onClick={(event) => handleMenuOpen(event, index)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id={`actions-menu-${index}`}
                      anchorEl={anchorEl[index]}
                      open={Boolean(anchorEl[index])}
                      onClose={() => handleMenuClose(index)}
                    >
                      <MenuItem>
                        <Link
                          className="flex"
                          href={`/press-dashboard/view-companies/${row.id}`}
                        >
                          <FaEdit
                            title="Edit"
                            size={20}
                            className="text-blue-500"
                            cursor="pointer"
                          />
                          &nbsp; <span className="text-blue-500">Edit </span>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <MdDelete
                          title="Delete"
                          size={20}
                          color="#C82333"
                          className="cursor-pointer"
                        />
                        <DeleteButton
                          label="Delete"
                          onDelete={() => handleDeleteClick(row.id, index)}
                        />
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={8}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
    );
  } else {
    return (
      <div className="h-[100vh] flex justify-center items-center w-full">
        <InfinitySpin
          visible={true}
          width="200"
          color="#7E22CE"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }
}
