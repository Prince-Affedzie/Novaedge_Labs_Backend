import { Router } from "express";
import Post from "../models/Post.js";
import { requireAdmin } from "../middleware/auth.js";

const postRoutes = Router();

// Public: published posts only (list view, no full content)
postRoutes.get("/", async (_req, res, next) => {
  try {
    res.json(
      await Post.find({ published: true }).select("-content").sort({ createdAt: -1 })
    );
  } catch (e) { next(e); }
});

// Admin: all posts, including drafts.
// Must come BEFORE "/:slug", or "admin" would be treated as a slug.
postRoutes.get("/admin/all", requireAdmin, async (_req, res, next) => {
  try { res.json(await Post.find().sort({ createdAt: -1 })); }
  catch (e) { next(e); }
});

// Public: one published post by slug
postRoutes.get("/:slug", async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true });
    post ? res.json(post) : res.status(404).json({ message: "Not found" });
  } catch (e) { next(e); }
});

// Admin: create
postRoutes.post("/", requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await Post.create(req.body)); }
  catch (e) { next(e); }
});

// Admin: update
postRoutes.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    post ? res.json(post) : res.status(404).json({ message: "Not found" });
  } catch (e) { next(e); }
});

// Admin: delete
postRoutes.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
});

export default postRoutes;