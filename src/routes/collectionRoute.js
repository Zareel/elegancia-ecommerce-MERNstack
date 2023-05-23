import express from "express";
import { requireSignIn } from "../middleware/authMiddleware";
import AuthRoles from "../utils/authRoles";
import {
  createCollection,
  deleteCollection,
  getAllCollections,
  updateCollection,
} from "../controllers/collectionController";

const router = express.Router();

router.post("/", requireSignIn, autherize(AuthRoles.ADMIN), createCollection);
router.put("/:id", requireSignIn, autherize(AuthRoles.ADMIN), updateCollection);
// delete a single collection
router.delete(
  "/:id",
  requireSignIn,
  autherize(AuthRoles(ADMIN), deleteCollection)
);

//get all collection
router.get("/", getAllCollections);

export default router;
