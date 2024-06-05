import axios from "axios";
import ResponceOfApi from "../../components/ApiResponce/ResponceOfApi";

const Page = async ({ params }) => {
  const authResponse = await axios.post(
    "https://dashboard.imcwire.com/api/orderChecked",
    {
      id: params.id,
    }
  );

  const dataResponce = authResponse.data;

  return <ResponceOfApi dataResponce={dataResponce} />;
};

export default Page;
