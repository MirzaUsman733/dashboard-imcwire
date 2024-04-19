"use client";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Container, TableHead } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled, useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { MdInventory } from "react-icons/md";
import { InfinitySpin } from "react-loader-spinner";

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

export default function Page() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [plans, setPlans] = useState([]);
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (session?.user?.role === "user") {
      router.replace("/press-dashboard/pr-balance");
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - plans.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/reports");
      if (response.ok) {
        const plansData = await response.json();
        setPlans(plansData);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchPlans();
    }
  }, [session]);
  if (session && sessionStatus === "authenticated" && plans) {
    return (
      <Container>
        <h1 className="text-5xl font-extrabold my-10 text-center text-purple-700">
          <div className="flex justify-center gap-5">
            <MdInventory />
            <span> Manage Your Press Release Reports </span>
          </div>
        </h1>
        <TableContainer component={Paper} className="shadow-lg">
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell className="font-bold">PR No.</StyledTableCell>
                <StyledTableCell className="font-bold">
                  Press Release Title
                </StyledTableCell>
                <StyledTableCell className="font-bold">
                  Client Email
                </StyledTableCell>
                <StyledTableCell className="font-bold">
                  Package Name
                </StyledTableCell>
                <StyledTableCell className="font-bold">Date</StyledTableCell>
                <StyledTableCell className="font-bold">
                  View Reports
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? plans.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : plans
              ).map((row, i) => (
                <StyledTableRow key={row.id}>
                  <TableCell style={{ width: 100 }}>{i + 1}</TableCell>
                  <TableCell style={{ width: 260 }}>
                    {row.pressReleaseTitle}
                  </TableCell>
                  <TableCell style={{ width: 260 }}>
                    {row.clientEmail}
                  </TableCell>
                  <TableCell style={{ width: 160 }}>
                    {row.packageName}
                  </TableCell>
                  {/*  */}
                  <TableCell style={{ width: 160 }}>
                    {formatDate(row.currentTime)}
                  </TableCell>
                  <TableCell style={{ width: 160 }}>
                    <Link  className="border border-1 border-purple-700 py-1 bg-purple-100 hover:bg-purple-700 hover:text-white hover:border-0 rounded-lg px-2" href={`/press-dashboard-admin/reports/${row.id}`}>
                        Reports
                    </Link>
                  </TableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
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
                  colSpan={6}
                  count={plans.length}
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
