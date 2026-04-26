import prisma from "../utils/db.util.js";
import type { Request, Response } from "express";

interface IVhsDesign {
  name: string;
  titleBackgroundColor: string;
  baseColor: string;
  borderColor: string;
  discColor: string;
  sideColor: string;
}

const GetVhsDesign = async (req: Request, res: Response)=> {
    try {
        const result = await prisma.vHSDesign.findMany()

        return res.status(200).json({message:"Success", data: result})
    } catch (error) {
        console.error("Get VHS design error:", error)
        return res.status(500).json({ message: "Failed to load VHS designs" })
    }
}

const CreateVHSDesign = async (
  req: Request<{}, {}, IVhsDesign>,
  res: Response
) => {
  const body = req.body;

  const result = await prisma.vHSDesign.create({
    data: body,
  });

  return res.status(201).json({ message: "Success", data: result });
};

const ReadVHSDesign = {};

export { CreateVHSDesign, GetVhsDesign, ReadVHSDesign };
