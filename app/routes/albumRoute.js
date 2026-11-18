module.exports = (server,corsConfig) => {
    const albumController = require("../controllers/albumController");
    const cors = require('cors');

    
    
    server.get("/album/:albumId",cors(corsConfig),albumController.findAlbum);
    server.post("/album/create/",cors(corsConfig),albumController.createAlbum);


    
}