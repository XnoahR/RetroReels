import mongoose from "mongoose";
const { Schema } = mongoose;

const rentalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tapeId: { type: Schema.Types.ObjectId, ref: "VideoTape", required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: { type: String, enum: ["borrowed", "returned"], default: "borrowed" },
});

const Rental = mongoose.model('Rental', rentalSchema);
export default Rental;