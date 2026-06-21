export default (req, res, id) => {
  try {
    if (id.toString() !== req.auth.userId) throw Error("requête non autorisée");
  } catch (error) {
    console.error(error.message);
    res.status(403).json({ error });
  }
};
