const mongoose = require("mongoose");
const Secret = require("../model/Secret");

//fetch secrets list
const fetchSecrets = async (req, res) => {
  let secrets;
  try {
    secrets = await Secret.find();
  } catch (e) {
    console.log(e);
  }

  if (!secrets) {
    return res.status(404).json({ message: "No Secrets Found" });
  }

  return res.status(200).json({ secrets });
};

//add a new secret
const addSecret = async (req, res) => {
  const { title, description, userId, content } = req.body;
  const currentDate = new Date();

  // checking if user already has a secret
  const existingSecret = await Secret.findOne({ userId });

  if (existingSecret) {
    return res.status(400).json({ message: "You already have a secret" });
  }

  const newSecret = new Secret({
    title,
    description,
    userId,
    content,
    date: currentDate,
  });

  try {
    await newSecret.save();
  } catch (e) {
    return res.status(500).json({ message: e });
  }

  // try {
  //   const session = await mongoose.startSession();
  //   session.startTransaction();
  //   await newSecret.save(session);
  //   session.commitTransaction();
  // } catch (e) {
  //   return res.status(500).json({ message: e });
  // }

  return res.status(201).json({ newSecret });
};

//delete a blog
const deleteSecret = async (req, res) => {
  const id = req.params.id;

  try {
    const findCurrentSecret = await Secret.findByIdAndDelete(id);
    if (!findCurrentSecret) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Unable to delete! Please try again" });
  }
};

//update a blog
const updateSecret = async (req, res) => {
  const id = req.params.id;

  const { title, description } = req.body;

  let currentSecretTOUpdate;

  try {
    currentSecretTOUpdate = await Secret.findByIdAndUpdate(id, {
      title,
      description,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong while updating! Please try again",
    });
  }

  if (!currentSecretTOUpdate) {
    return res.status(404).json({ message: "Unable to update" });
  }

  return res.status(200).json({ currentSecretTOUpdate });
};

module.exports = { fetchSecrets, addSecret, deleteSecret, updateSecret };
