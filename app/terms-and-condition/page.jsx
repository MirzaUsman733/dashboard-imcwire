import { Container, Typography, Box } from '@mui/material';

const Page = () => {
  return (
    <Container className='flex justify-center items-center h-screen'>
      <Box className="my-8 p-6 bg-white rounded-lg shadow-md">
        <Typography variant="h4" component="h1" textAlign="center" fontFamily='serif' className='font-serif text-center' gutterBottom>
          Terms And Conditions
        </Typography>
        <Typography variant="body1" gutterBottom>
          Non-Refundable Payment Policy: Please note that once a payment is made for our press release distribution services, it is not refundable. This policy is in place due to the immediate action we take to distribute your content across our extensive network, including premier sites like Yahoo Finance, Bloomberg, MarketWatch, and many others. We encourage you to review your selections carefully and reach out to our support team for any clarifications before making a payment.
        </Typography>
        <Typography variant="body1">
          For more information about our services and policies, please visit our FAQ section or contact our support team.
        </Typography>
      </Box>
    </Container>
  );
};

export default Page;
