import StripeResponse from "../../components/ApiResponce/StripeResponse";

const Page = async ({ params, searchParams }) => {
  const isvalid = searchParams.isvalid || "";
  return <StripeResponse orderStatus={isvalid} />;
};

export default Page;
