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
import { Container, TableHead } from "@mui/material";
import { GrTransaction } from "react-icons/gr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(0);
  const [compaignData, setCompaignData] = React.useState([]);
  const [plans, setPlans] = React.useState([]);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/stripe-webhooks");
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
  React.useEffect(() => {
    if (session?.user?.role === "user") {
      router.replace("/press-dashboard/pr-balance");
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);
  // Fetch campaign data based on user email
  const fetchCompaignData = async () => {
    try {
      const response = await fetch("/api/compaignData");
      if (response.ok) {
        const plansData = await response.json();
        const filteredCompaignData = filterCompaignData(
          plansData,
          session.user.email
        );
        setCompaignData(filteredCompaignData);
      } else {
        console.error("Failed to fetch campaign data");
      }
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    }
  };

  // Filter campaign data based on user email
  const filterCompaignData = (data, email) => {
    return data.filter((plan) => plan.status === "paid");
  };

  // Filter webhook data based on transaction IDs
  const filterWebhookData = (data, ids) => {
    return data.filter((item) => ids.includes(item.eventData.id));
  };

  // Fetch compaignData on session change
  React.useEffect(() => {
    if (session) {
      fetchCompaignData();
    }
  }, [session]);

  React.useEffect(() => {
    fetchPlans();
  }, []);

  const compaignTransactionIds = compaignData.flatMap(
    (item) => item.transactionIds
  );

  const filteredWebhookData = filterWebhookData(plans, compaignTransactionIds);
  if (
    session &&
    sessionStatus === "authenticated" &&
    filteredWebhookData &&
    plans
  ) {
    return (
      <Container>
        <h1 className="text-5xl font-extrabold my-10 text-center text-purple-700">
          <div className="flex justify-center gap-5">
            <GrTransaction /> <span> Transaction History </span>
          </div>
        </h1>
        <TableContainer component={Paper} className="shadow-lg">
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell className="font-bold">
                  Invoice Id
                </StyledTableCell>
                <StyledTableCell className="font-bold">
                  Customer Name
                </StyledTableCell>
                <StyledTableCell className="font-bold">
                  Customer Email
                </StyledTableCell>
                <StyledTableCell className="font-bold">
                  Payment Intent
                </StyledTableCell>
                <StyledTableCell className="font-bold">
                  Paid Amount
                </StyledTableCell>
                <StyledTableCell className="font-bold">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {(rowsPerPage > 0
              ? filteredWebhookData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredWebhookData
            ).map((row) => ( */}
              {(rowsPerPage > 0
                ? filteredWebhookData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .sort((a, b) => b.id - a.id) // Sort by descending order of row.id
                : filteredWebhookData.sort((a, b) => b.id - a.id)
              ) // Sort all data by descending order of row.id
                .map((row) => (
                  <StyledTableRow key={row.id}>
                    <TableCell style={{ width: 160 }}>{row.id}</TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row?.eventData?.object?.customer_details?.name}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row?.eventData?.object?.customer_details?.email}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row?.eventData?.object?.payment_intent}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row?.eventData?.object?.amount_total}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row?.eventData?.object?.payment_status}
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
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={9}
                  count={filteredWebhookData.length}
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
