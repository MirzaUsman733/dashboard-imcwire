"use client";
import * as React from "react";
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
import { Container, Menu, MenuItem, TableHead } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { InfinitySpin } from "react-loader-spinner";
import { truncate } from "lodash";
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

const rows = [];

export default function Page() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [dense, setDense] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [loadingDeletion, setLoadingDeletion] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(
    new Array(rows.length).fill(null)
  );
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (session?.user?.role === "user") {
      router.replace("/press-dashboard/pr-balance");
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };
  const fetchEmailCounts = async () => {
    try {
      const response = await fetch("/api/email-counts");
      if (response.ok) {
        const emailCounts = await response.json();
        return emailCounts;
      } else {
        console.error("Failed to fetch email counts");
        return [];
      }
    } catch (error) {
      console.error("Error fetching email counts:", error);
      return [];
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/register");
      if (response.ok) {
        const usersData = await response.json();
        const sortedData = usersData?.sort((a, b) => b.id - a.id);
        setUsers(sortedData);
        setLoading(false);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  React.useEffect(() => {
    fetchPlans();
  }, []);

  const handleDeleteClick = (id, index) => {
    setLoadingDeletion(true);
    fetch("/api/register?_id=" + id, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Update the users state after successful deletion
          const updatedUsers = users.filter((user) => user.id !== id);
          setUsers(updatedUsers);
          setSnackbarSeverity("success");
          setSnackbarMessage("User deleted successfully.");
          setSnackbarOpen(true);
          setLoadingDeletion(false);
        } else {
          setSnackbarSeverity("error");
          setSnackbarMessage("Failed to delete user.");
          setSnackbarOpen(true);
        }
      })
      .catch((error) => console.error("Error deleting:", error))
      .finally(() => {
        handleMenuClose(index);
      });
  };

  const handleStatusChange = (id, status) => {
    fetch("/api/register?_id=" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => {
        if (response.ok) {
          // Update the status locally after successful update in the database
          const updatedUsers = users.map((user) => {
            if (user.id === id) {
              return { ...user, status };
            }
            return user;
          });
          setUsers(updatedUsers);
          setSnackbarSeverity("success");
          setSnackbarMessage("User availability successfully changed.");
          setSnackbarOpen(true);
        } else {
          setSnackbarSeverity("error");
          setSnackbarMessage("Failed to update user availability.");
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        setSnackbarSeverity("error");
        setSnackbarMessage(
          `An error occurred while updating user availability. ${error}`
        );
        setSnackbarOpen(true);
      })
      .finally(() => {
        handleMenuClose();
      });
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl((prevAnchorEl) => {
      const newAnchorEl = [...prevAnchorEl];
      newAnchorEl[index] = event.currentTarget;
      return newAnchorEl;
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(new Array(users.length).fill(null));
  };
  if (loading) {
    return (
      <div className="h-[80vh] flex justify-center items-center w-full">
        <InfinitySpin
          visible={true}
          width="200"
          color="#7E22CE"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }
  if (
    session &&
    sessionStatus === "authenticated" &&
    users &&
    loading === false
  ) {
    return (
      <Container>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
        <h1 className="text-6xl font-serif text-purple-700 font-bold text-center mb-20 mt-10">
          Manage All Users
        </h1>

        <TableContainer component={Paper} className="shadow-lg">
          <Table
            sx={{ minWidth: 500 }}
            aria-label="custom pagination table"
            size={dense ? "small" : "medium"}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? users.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : users
              ) // Sort all data by descending order of row.id
                .map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <TableCell style={{ width: 160 }}>{row.id}</TableCell>
                    <TableCell style={{ width: 260 }}>{row.name}</TableCell>
                    <TableCell style={{ width: 160 }}>{row.email}</TableCell>
                    <TableCell style={{ width: 160 }}>{row.status}</TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.isAgency ? "Agency" : "Client"}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
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
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() => handleStatusChange(row.id, "active")}
                        >
                          Active
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleStatusChange(row.id, "Temporary Block")
                          }
                        >
                          Temporary Block
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleStatusChange(row.id, "Permanent Block")
                          }
                        >
                          Permanent Block
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleDeleteClick(row.id, index)}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </StyledTableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[
                    25,
                    50,
                    100,
                    { label: "All", value: -1 },
                  ]}
                  colSpan={5}
                  count={users.length}
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
      <div className="h-[80vh] flex justify-center items-center w-full">
        <p>Failed to fetch data.</p>
      </div>
    );
  }
}
