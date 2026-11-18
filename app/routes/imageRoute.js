const multer = require("multer");
module.exports = (server,corsConfig) => {
    const imageController = require("../controllers/imageController");
    const cors = require('cors');

    const upload = multer({ storage: multer.memoryStorage() });

    
    server.post("/images/create",upload.array('files',10),cors(corsConfig),imageController.createMultipleImage)
    server.post("/images/update",cors(corsConfig),imageController.updateImages)
    server.post("/images/getByAlbum/:albumId",cors(corsConfig),imageController.findImagesOfAlbum)

    server.get("/image/:imageId",cors(corsConfig),imageController.getImage)
    server.post("/image/:imageId/rotate",cors(corsConfig),imageController.rotateImage)
    server.delete("/image/:imageId",cors(corsConfig),imageController.removeImage)

    
}