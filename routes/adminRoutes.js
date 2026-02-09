import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createDonorController } from "./controllers/create/createDonor.controller.js";
import { editUserController } from "./controllers/edit/editUser.controller.js";
import { editDonorController } from "./controllers/edit/editDonor.controller.js";
import { deleteUserController } from "./controllers/delete/deleteUser.controller.js";
import { createUserController } from "./controllers/create/createUser.controller.js";
import { createExpenseController } from "./controllers/create/createExpense.controller.js";
import { createDonationController } from "./controllers/create/createDonation.controller.js";
import { authController } from "./controllers/auth.controller.js";
import { checkTokenController } from "./controllers/checkToken.controller.js";
import { loadLogsController } from "./controllers/load/loadLogs.controller.js";
import { loadDonationsController } from "./controllers/load/loadDonations.controller.js";
import { loadDonorsController } from "./controllers/load/loadDonors.controller.js";
import { loadExpensesController } from "./controllers/load/loadExpenses.controller.js";
import { loadProjectsController } from "./controllers/load/loadProjects.controller.js";
import { loadUsersController } from "./controllers/load/loadUsers.controller.js";
import { voidDonationController } from "./controllers/void/voidDonation.controller.js";
import { voidExpenseController } from "./controllers/void/voidExpense.controller.js";
import { deleteDonorController } from "./controllers/delete/deleteDonor.controller.js";
import { loadStatsController } from "./controllers/load/loadStats.controller.js";
import { createProjectController } from "./controllers/create/createProject.controller.js";
import { deleteProjectController } from "./controllers/delete/deleteProject.controller.js";
import { editProjectController } from "./controllers/edit/editProject.controller.js";
import { editDonoationController } from "./controllers/edit/editDonation.controller.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "../.env") });

const router = express.Router();

router.post("/delete-donor", deleteDonorController);

router.post("/delete-user", deleteUserController);

router.post("/delete-project", deleteProjectController);

router.post("/void-expense", voidExpenseController);

router.post("/void-donation", voidDonationController);

router.get("/load-users", loadUsersController);

router.get("/load-projects", loadProjectsController);

router.get("/load-expenses", loadExpensesController);

router.get("/load-donors", loadDonorsController);

router.get("/load-donations", loadDonationsController);

router.get("/load-logs", loadLogsController);

router.get("/load-stats", loadStatsController);

router.post("/auth", authController);

router.post("/check-token", checkTokenController)

router.post("/create-donor", createDonorController);

router.post("/create-donation", createDonationController);

router.post("/create-expense", createExpenseController);

router.post("/create-project", createProjectController);

router.post("/create-user", createUserController);

router.post("/edit-user", editUserController);

router.post("/edit-donation", editDonoationController);

router.post("/edit-donor", editDonorController);

router.post("/edit-project", editProjectController);

export default router;
