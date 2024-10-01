import mongoose from "mongoose";

const { Schema } = mongoose;

const videoTapeSchema = new Schema({
    title: String,
    director: String,
    duration: Number,
    category: {
        type: String,
        enum: [
            'Action', 'Comedy', 'Fantasy', 'Documentary', 'Thriller', 
            'Suspense', 'Adventure', 'Urban', 'Retro', 'Tragic', 
            'Family', 'Disaster', 'Romantic', 'Advert', 'Interview', 'Trendy'
        ]
    },
    image: String
});

const VideoTape = mongoose.model("VideoTape", videoTapeSchema)
export default VideoTape;

