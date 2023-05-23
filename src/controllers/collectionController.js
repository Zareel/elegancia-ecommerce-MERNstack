import Collection from "../models/collectionSchema.js";

/**********************************************************
 * @CREATE_COLLECTION
 * @route https://localhost:5000/api/collection/
 * @description Controller used for creating a new collection
 * @description Only admin can create the collection
 *********************************************************/

export const createCollection = async (req, res) => {
  //get data from the user
  const { name } = req.body;
  //validation
  if (!name) {
    return res.send({ error: "Collection name is required" });
  }
  const collection = await Collection.create({
    name,
  });
  res.status(200).json({
    success: true,
    message: "Collection created successfully",
    collection,
  });
};

/**
 * @UPDATE_COLLECTION
 * @route http://localhost:5000/api/collection/:collectionId
 * @description Controller for updating the collection details
 * @description Only admin can update the collection
 */

export const updateCollection = async (req, res) => {
  const { name } = req.body;
  const { id: collectionId } = req.params;

  if (!name) {
    return res.status(400).send({
      success: false,
      message: "Collection name is required",
    });
  }
  let updateCollection = await Collection.findByIdAndUpdate(
    collectionId,
    { name },
    { new: true, runValidators: true }
  );
  if (!updateCollection) {
    return res.status(404).send({
      success: false,
      message: "Collection not found",
    });
  }
  res.status(200).send({
    success: true,
    message: "Collectin updated successfully",
    updateCollection,
  });
};

/**
 * @DELETE_COLLECTION
 * @route http://localhost:5000/api/collection/:collectionId
 * @description Controller for deleting the collection
 * @description Only admin can delete the collection
 */

export const deleteCollection = async (req, res) => {
  const { id: collectionId } = req.params;
  const collectionToDelete = await Collection.findById(collectionId);

  if (!collectionToDelete) {
    return res.status(404).send({
      success: false,
      message: "Collection not found",
    });
  }
  collectionToDelete.remove();
  res.status(200).send({
    success: true,
    message: "Collection has been deleted successfully",
  });
};

/**
 * @GET_ALL_COLLECTION
 * @route http://localhost:5000/api/collection/
 * @description Controller for getting all collection list
 * @description Only admin can get collection list
 * @returns Collection Object with available collection in DB
 */

export const getAllCollections = async (req, res) => {
  const collections = await Collection.find();
  if (!collections) {
    return res.status(404).send({
      success: false,
      message: "No collections found",
    });
  }
  res.status(200).send({
    success: true,
    collections,
  });
};
