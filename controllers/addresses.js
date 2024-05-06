const Address = require("../models/addresses");
const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

const getAllAddresses = asyncWrapper(async (req, res) => {
  const addressDoc = await Address.findOneOrCreate();
  const allAddresses = addressDoc.getAllAddresses();

  res.status(200).json({ allAddresses });
});

const addAddress = asyncWrapper(async (req, res) => {
  const { currency, address } = req.body;
  const addressDoc = await Address.findOneOrCreate();

  await addressDoc.addAddress(currency, address);

  res.status(200).json({ addressDoc });
});

const deleteAddress = asyncWrapper(async (req, res) => {
  const { currency, address } = req.body;
  const addressDoc = await Address.findOneOrCreate();

  await addressDoc.removeAddress(currency, address);

  res.status(200).json({ addressDoc });
});
module.exports = {
  getAllAddresses,
  addAddress,
  deleteAddress,
};
