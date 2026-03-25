const express = require("express");

const {
  getAllData,
  getByState,
  getByYear,
  normalizeStateName,
  computeInsights,
} = require("../services/datasetService");

const router = express.Router();

// GET /data
router.get("/data", (req, res) => {
  res.json(getAllData());
});

// GET /state/:name
router.get("/state/:name", (req, res) => {
  const stateName = normalizeStateName(req.params.name);
  const rows = getByState(stateName);

  if (!rows.length) {
    return res.status(404).json({
      error: "Not Found",
      message: `No records found for state "${stateName}"`,
    });
  }

  res.json(rows);
});

// GET /year/:year
router.get("/year/:year", (req, res) => {
  const year = Number(req.params.year);
  if (!Number.isInteger(year) || year <= 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: `Invalid year "${req.params.year}"`,
    });
  }

  const rows = getByYear(year);

  if (!rows.length) {
    return res.status(404).json({
      error: "Not Found",
      message: `No records found for year "${year}"`,
    });
  }

  res.json(rows);
});

// GET /insights?state=&year=&category=
router.get("/insights", (req, res) => {
  const { state, year, category } = req.query;
  const y = year != null && year !== "" && year !== "All" ? Number(year) : null;

  if (y != null && (!Number.isInteger(y) || y <= 0)) {
    return res.status(400).json({
      error: "Bad Request",
      message: `Invalid year "${year}"`,
    });
  }

  const insights = computeInsights({
    state: state && state !== "All" ? String(state) : null,
    year: y,
    category: category && category !== "All" ? String(category) : null,
  });

  res.json(insights);
});

module.exports = router;

