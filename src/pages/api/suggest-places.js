import duffel from "@/lib/Duffel";

async function handler(req, res) {
  const { method } = req;
  if (method.toUpperCase() === "POST") {
    try {
      const { query } = req.body;

      const suggestions = await duffel.suggestions.list({
        query,
      });

      res.status(200).json({ msg: "Success", suggestions });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error!" });
    }
  } else {
    res.status(405).json({ msg: "Method not allowed!" });
  }
}

export default handler;
