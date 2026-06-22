import { Book } from "../../models/Book.js";

export default async (req, res, desiredResult) => {
  try {
    let result;
    switch (desiredResult) {
      case "all":
        result = await Book.find();
        break;
      case "one":
        result = await Book.findById(req.params.id);
        break;
      case "best":
        const books = await Book.find().sort({ averageRating: -1 });
        result = books.slice(0, 3);
        break;
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error });
  }
};
