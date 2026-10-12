const albumModel = require("../models/albumModel")


exports.findAlbum = async (req,res) =>{
  try {
    const { albumId } = req.params;
    if (!albumId) {
      return res.status(400).json({ message: "albumId est requis" });
    }
    const album = await albumModel.findById(albumId);
    res.status(200).json(album);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Impossible de récupérer les images", error });
  }
}
exports.createAlbum = async (req,res) =>{
    let album = new albumModel({id:req.body.albumId,numero:req.body.numero,description:req.body.description});
    album.save((error) => {
        if (error) {
            res.status(401);
            res.json({message:"Impossible de créer l'album"})
        }
        else {
            res.status(200);
            res.json({message:"L'album a bien été crée"});
        }
    })

    
    
}