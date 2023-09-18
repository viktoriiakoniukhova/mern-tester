const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const fileUpload = multer();

let streamUpload = (file) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const upload = async (file) => {
  const result = await streamUpload(file);
  if (result) return result.secure_url;
};

const destroy = async (imageUrl) => {
  const public_id = imageUrl.split("/").pop().split(".").shift();
  const result = await cloudinary.uploader.destroy(public_id);
  if (result) return result;
};
module.exports = { fileUpload, upload, destroy };
