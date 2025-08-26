import cloudinary from "../config/cloudinary.config.js";

const uploadReportToCloudinary = (pdfBuffer, publicId="reports") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            resource_type : "raw",
            folder : "reports",
            public_id : publicId
        }, (error, result) => {
            if(error) reject(error);
            else resolve(result.secure_url);
        });
        stream.end(pdfBuffer)
    })
};

export default uploadReportToCloudinary