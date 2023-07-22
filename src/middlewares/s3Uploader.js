const { S3Client, AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidV4 } = require("uuid");

const s3Config = new S3Client();

const isAllowedMimetype = (mime) =>
  [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/x-ms-bmp",
    "image/webp"
  ].includes(mime.toString());

let fileDirectory;
let fileSize;

const fileFilter = (req, file, cb) => {
  const fileMime = file.mimetype;
  if (isAllowedMimetype(fileMime)) {
    const fileType = file.mimetype.split("/")[0];
    switch (fileType) {
      case "image":
        fileDirectory = awsConfigs.directories.images;
        fileSize = 1024 * 1024 * awsConfigs.maxFileSizeMB.images;
        break;
    }
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const getUniqFileName = (originalname) => {
  const name = uuidV4();
  const ext = originalname.split(".").pop();

  return `${name}.${ext}`;
};

const multerS3Config = (mainDirectory) =>
  multerS3({
    s3: s3Config,
    bucket: awsConfigs.bucket,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = getUniqFileName(file.originalname);
      const s3InnerDirectory = `${mainDirectory}/${fileDirectory}`;
      const finalPath = `${s3InnerDirectory}/${fileName}`;
      file.newName = fileName;
      cb(null, finalPath);
    }
  });

const upload = (mainDirectory) =>
  multer({
    storage: multerS3Config(mainDirectory),
    fileFilter: fileFilter,
    limits: {
      fileSize
    }
  });

exports.productUpload = upload("product-images");
