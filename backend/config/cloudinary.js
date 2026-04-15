import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath); // Delete the file from the local storage after successful upload
        return uploadResult.secure_url;
    } catch (error) {
        fs.unlinkSync(filePath); // Delete the file from the local storage in case of an error
        throw new Error("Failed to upload image to Cloudinary");
    }
};

export default uploadOnCloudinary;
