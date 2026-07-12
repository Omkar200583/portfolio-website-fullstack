import express from "express";

const router = express.Router();

router.get("/about", async (req, res) => {
  try {
    const projectsCount = 6;
    const internshipsCount = 2;
    const techStackCount = 4;

    res.json({
      success: true,
      data: {
        stats: [
          { value: `${projectsCount}+`, label: "Projects Shipped" },
          { value: `${internshipsCount}`, label: "Internships" },
          { value: `${techStackCount}+`, label: "Tech Stacks" },
          { value: "100%", label: "Ownership" },
        ],
      },
    });
  } catch (err) {
    console.error("Error fetching about stats:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load stats",
    });
  }
});

export default router;

