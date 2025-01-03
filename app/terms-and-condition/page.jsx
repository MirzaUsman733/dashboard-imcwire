import { Container, Typography, Box } from "@mui/material";

const Page = () => {
  return (
    <Container className="flex justify-center bg-gray-50 items-center h-screen">
      <Box className="my-8 p-6 bg-white rounded-lg shadow-lg">
        <Typography
          variant="h4"
          component="h1"
          textAlign="center"
          fontFamily="serif"
          className="font-serif text-center"
          gutterBottom
        >
          Terms And Conditions
        </Typography>
        <Typography variant="body1" gutterBottom>
          Terms and Conditions Non-Refundable Payment Policy: All payments made
          for our press release distribution services are non-refundable. This
          policy is enforced due to the upfront costs we incur, including
          payments to third-party websites for publication slots. Once a press
          release is processed for distribution across our extensive network,
          including premier sites such as Yahoo Finance, Bloomberg, MarketWatch,
          among others, we cannot offer refunds as we do not receive refunds
          from these websites.
        </Typography>
        <Typography variant="body1">
          Publication on Specific Topics: Please note that if your press release
          covers topics such as Cryptocurrency, NFTs, Mining, Finance, Gambling,
          Casinos, and similar areas, we will submit your article to the
          websites you select. However, if your content is rejected three times
          by these platforms, we cannot refund your payment. We urge you to
          choose your topics and target websites carefully and consult with our
          support team if you have any questions or require guidance.
        </Typography>
        <Typography variant="body1">
          For further details about our services and specific policies, please
          visit our FAQ section or contact our support team for assistance.
        </Typography>
      </Box>
    </Container>
  );
};

export default Page;
