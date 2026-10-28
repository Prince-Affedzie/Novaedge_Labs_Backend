import { Router } from "express";
import Project from "../models/Project.js";
import { requireAdmin } from "../middleware/auth.js";

const projectRoutes = Router();

projectRoutes.get("/", async (_req, res, next) => {
  try { res.json(await Project.find().sort({ featured: -1, createdAt: -1 })); }
  catch (e) { next(e); }
});

projectRoutes.get("/:slug", async (req, res, next) => {
  try {
    const p = await Project.findOne({ slug: req.params.slug });
    p ? res.json(p) : res.status(404).json({ message: "Not found" });
  } catch (e) { next(e); }
});

projectRoutes.post("/", requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await Project.create(req.body)); } catch (e) { next(e); }
});

projectRoutes.put("/:id", requireAdmin, async (req, res, next) => {
  try { res.json(await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); }
  catch (e) { next(e); }
});

projectRoutes.delete("/:id", requireAdmin, async (req, res, next) => {
  try { await Project.findByIdAndDelete(req.params.id); res.status(204).end(); }
  catch (e) { next(e); }
});

export default projectRoutes;