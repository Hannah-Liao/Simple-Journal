const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { isLoggedIn } = require("../middleware/checkAuth");

router.get("/dashboard", isLoggedIn, dashboardController.dashboard);
router.get("/dashboard/item/:id", isLoggedIn, dashboardController.dashboardViewJournal);
router.put("/dashboard/item/:id", isLoggedIn, dashboardController.dashboardUpdateJournal);
router.delete("/dashboard/item-delete/:id", isLoggedIn, dashboardController.dashboardDeleteJournal);
router.get("/dashboard/add", isLoggedIn, dashboardController.dashboardAddJournal);
router.post("/dashboard/add", isLoggedIn, dashboardController.dashboardAddJournalSubmit);
router.get("/dashboard/search", isLoggedIn, dashboardController.dashboardSearch);
router.post("/dashboard/search", isLoggedIn, dashboardController.dashboardSearchSubmit);




module.exports = router; 