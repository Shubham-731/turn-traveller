import duffel from "@/lib/Duffel";

async function handler(req, res) {
  const { method } = req;
  if (method.toUpperCase() === "POST") {
    try {
      const { options } = req.body;

      const response = await duffel.offerRequests.create(options);
      const offers = response.data?.offers;

      res.status(200).json({ msg: "Success", offers });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error!" });
    }
  } else {
    res.status(405).json({ msg: "Method not allowed!" });
  }
}

export default handler;
