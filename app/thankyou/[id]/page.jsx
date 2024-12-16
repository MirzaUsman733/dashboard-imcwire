import ResponceOfApi from "../../components/ApiResponce/ResponceOfApi";

const Page = async ({ params }) => {
  console.log(params.id);
  
  try {
    const response = await fetch('https://dashboard.imcwire.com/api/orderChecked', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: params.id })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const dataResponse = await response.json();
    console.log("Data Response: ", dataResponse);

    return <ResponceOfApi dataResponse={dataResponse} />;
  } catch (error) {
    console.error("Failed to fetch API:", error);
    // Handle error case appropriately
    return <div>Error loading data</div>; // Or any other error handling component
  }
};

export default Page;
