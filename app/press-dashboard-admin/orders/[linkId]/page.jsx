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
import { MdInventory } from "react-icons/md";
import Link from "next/link";
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
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
const Page = ({ params }) => {
  const id = params.linkId;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [plans, setPlans] = React.useState([]);
  const [detail, setDetail] = React.useState(null);
  const { data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = React.useState(true); 
  const router = useRouter();
  React.useEffect(() => {
    if (session?.user?.role === "user") {
      router.replace("/press-dashboard/pr-balance");
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

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
      const response = await fetch("/api/compaignData?_id=" + id);
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
    if (session) {
      fetchPlans();
    }
  }, [session]);
  const fetchDetail = React.useCallback(async () => {
    try {
      const response = await fetch("/api/submit-detail");
      if (response.ok) {
        const detailData = await response.json();
        const clientidData = detailData?.filter(
          (data) => data?.storeData?.clientId == plans?.clientId
        );
        const sortedData = clientidData?.sort((a, b) => b.id - a.id);
        setDetail(sortedData);
        setLoading(false);
      } else {
        console.error("Failed to fetch detail");
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    }
  }, [plans]);
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  React.useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);
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

  if (session && sessionStatus === "authenticated" && detail) {
  return (
    <Container>
      <h1 className="text-5xl font-extrabold my-10 text-center text-purple-700">
        <div className="flex justify-center gap-5">
          <MdInventory />
          <h1 className="text-6xl font-serif text-purple-700 font-bold text-center mb-20"> Manage Your Press Release </h1>
        </div>
      </h1>
      <TableContainer component={Paper} className="shadow-lg">
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell className="font-bold">PR No.</StyledTableCell>
              <StyledTableCell className="font-bold">
                Company Name
              </StyledTableCell>
              <StyledTableCell className="font-bold">Email</StyledTableCell>
              <StyledTableCell className="font-bold">Date</StyledTableCell>
              <StyledTableCell className="font-bold">Address</StyledTableCell>
              <StyledTableCell className="font-bold">Status</StyledTableCell>
              <StyledTableCell className="font-bold">See More</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? detail?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                  
                )
              : detail
            )?.map((row, index) => (
              <StyledTableRow key={row?.id}>
                <TableCell style={{ width: 100 }}>{row?.id}</TableCell>
                <TableCell style={{ width: 160 }}>
                  {row?.formData?.companyName}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row?.formData?.email}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {formatDate(row?.updatedAt)}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row?.formData?.address1}
                </TableCell>
                {row?.storeData?.action === "pending" ? (
                  <TableCell style={{ width: 160 }}>
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-lg">
                      {row?.storeData?.action}
                    </span>
                  </TableCell>
                ) : (
                  ""
                )}
                {row?.storeData?.action === "completed" ? (
                  <TableCell style={{ width: 160 }}>
                    <span className="bg-green-600 px-2 py-1 rounded-lg text-white">
                      {row?.storeData?.action}
                    </span>
                  </TableCell>
                ) : (
                  ""
                )}
                {row?.storeData?.action === "inprogress" ? (
                  <TableCell style={{ width: 160 }}>
                    <span className="bg-yellow-600 px-2 py-1 rounded-lg text-white">
                      {row?.storeData?.action}
                    </span>
                  </TableCell>
                ) : (
                  ""
                )}
                <TableCell style={{ width: 160 }}>
                  <Link
                    className=""
                    href={`/press-dashboard-admin/orders/${id}/${row.id}`}
                  >
                    <div className="border border-1 text-center border-purple-700 px-5 py-2 rounded-2xl hover:bg-purple-700 hover:border-0 hover:text-white w-full">
                      Detail
                    </div>
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
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={7}
                count={detail?.length}
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
};
export default Page;
