const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Barber = require("../models/barberModel");
const authMiddleware = require("../middlewares/authMiddleware");
require("dotenv").config();
router.get("/get-all-barbers", authMiddleware, async (req, res) => {
  try {
    const barbers = await Barber.find({});
    res.status(200).send({
      message: "Barbers fetched successfully",
      success: true,
      data: barbers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying barber account",
      success: false,
      error,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying barber account",
      success: false,
      error,
    });
  }
});

router.post(
  "/change-barber-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { barberId, status } = req.body;
      const barber = await Barber.findByIdAndUpdate(barberId, {
        status,
      });

      const user = await User.findOne({ _id: barber.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "new-barber-request-changed",
        message: `Your barber account has been ${status}`,
        onClickPath: "/notifications",
      });
      user.isBarber = status === "approved" ? true : false;
      await user.save();

      res.status(200).send({
        message: "Barber status updated successfully",
        success: true,
        data: barber,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying barber account",
        success: false,
        error,
      });
    }
  }
);



module.exports = router;
