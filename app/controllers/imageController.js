const imageModel = require("../models/ImageModel")
const albumModel = require("../models/albumModel")
const sharp = require("sharp");
/*
req.files []
album : number
page [] = size of req.files

*/
exports.createMultipleImage = async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).send("Aucun fichier envoyé");
    }
    // data peut arriver soit en chaîne JSON (champ "data" = '[{...}]'),
    // soit déjà parsé par multer (clés data[0][page], data[0][description]...)
    let data = req.body.data ?? [];
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return res.status(400).send("Le champ data n'est pas un JSON valide");
      }
    }
    if (!Array.isArray(data)) {
      data = Object.values(data);
    }

    const results = [];

    await Promise.all(req.files.map(async (file, pos) => {
      const previewBuffer = await sharp(file.buffer)
        .rotate()
        .resize({ width: 1920, withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      const meta = data[pos] ?? {};
      await imageModel.create({
        image: `data:image/jpeg;base64,${previewBuffer.toString("base64")}`,
        albumId: req.body.albumId,
        page: meta.page !== undefined ? Number(meta.page) : undefined,
        description: meta.description
      });

      results.push({
        filename: file.originalname,
        status: "ok"
      });
      })

    );

    res.json({ message: "Upload terminé", results });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// Add an image to a grid (from selection tool in front)


exports.updateImages = async (req, res) => {
  try {
    const updates = req.body.data; // [{ id, albumId, page,des]

    const bulkOps = updates.map(item => ({
      updateOne: {
        filter: { _id: item.id, "albumId": req.body.albumId },
        update: {
          $set: {
            "page": item.page,
            "description":item.description
          }
        }
      }
    }));
    const result = await imageModel.bulkWrite(bulkOps);
    res.json({
      message: "Images mises à jour",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erreur lors de la mise à jour", error });
  }
};

exports.getImage = async (req, res) => {
  try {
    const image = await imageModel.findById(req.params.imageId)
    if (!image) {
      return res.status(404).json({ message: "Image introuvable" });
    }
    res.status(200).json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Impossible de récupérer l'image", error });
  }
};

exports.rotateImage = async (req, res) => {
  try {
    const image = await imageModel.findById(req.params.imageId);
    if (!image) {
      return res.status(404).json({ message: "Image introuvable" });
    }

    const rotatedBuffer = await sharp(
      Buffer.from(image.image.replace(/^data:.+;base64,/, ""), "base64")
    )
      .rotate(req.body.angle ?? 90)
      .toBuffer();

    const newImage = `data:image/jpeg;base64,${rotatedBuffer.toString("base64")}`;
    image.image = newImage;
    await image.save();

    res.status(200).json({ image: newImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Impossible de faire pivoter l'image", error });
  }
};



exports.removeImage = async (req, res) => {
  try {
    const image = await imageModel.findByIdAndDelete(req.params.imageId);
    if (!image) {
      return res.status(404).json({ message: "Image introuvable" });
    }
    res.status(200).json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Impossible de supprimer l'image", error });
  }
};

exports.findImagesOfAlbum = async (req,res) =>{
  try {
    const { albumId } = req.params;
    if (!albumId) {
      return res.status(400).json({ message: "albumId est requis" });
    }

    const images = await imageModel.find({ "albumId": albumId });
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Impossible de récupérer les images", error });
  }
}