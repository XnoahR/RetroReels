import mongoose, { mongo, version } from "mongoose";
import VideoTape from "../models/VideoTape.js";

const getVideoTape = async (req, res) => {
  try {
    const data = await VideoTape.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createVideoTape = async (req, res) => {
  const body = new VideoTape(req.body);
  try {
    const newVideoTape = await body.save();
    return res.status(201).json({ message: "Video Tape Added Successfully", newVideoTape });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

const updateVideoTape = async (req, res) => {
    const { id } = req.params;
    try {
      const updatedVideoTape = await VideoTape.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedVideoTape) {
        return res.status(404).json({ message: "Video tape not found" });
      }
      return res.status(200).json({message:"Video Tape Updated Successfully" ,updatedVideoTape});
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

export { getVideoTape, createVideoTape, updateVideoTape };
