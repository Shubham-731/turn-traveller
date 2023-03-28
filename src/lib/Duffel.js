import { Duffel } from "@duffel/api";

const duffel = new Duffel({
  token: process.env.DUFFEL_TEST_API_KEY,
});

export default duffel;
