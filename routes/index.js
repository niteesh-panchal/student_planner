import sessionRoutes from "./session.js";
import academicPlannerRoute from "./academic_planner.js";
import homeRoutes from "./home_page_routes.js";
import qnaRoutes from "./qna.js";
import calendarRoutes from "./calendar.js";
import authRoutes from "./auth_routes.js";
import proofRoutes from "./proofreading.js";
import todoRoutes from "./todo.js";
import fileConversionRoutes from "./file_conversion.js";

const constructorMethod = (app) => {
  app.use("/", authRoutes);
  app.use("/home", homeRoutes);
  app.use("/ap", academicPlannerRoute);
  app.use("/qna", qnaRoutes);
  app.use("/calendar", calendarRoutes);
  app.use("/proofread", proofRoutes);
  app.use("/todo", todoRoutes);
  app.use("/file_conversion", fileConversionRoutes);
  app.use("/session", sessionRoutes);

  app.use("*", (req, res) => {
    return res.status(404).render("notFound");
  });
};

export default constructorMethod;
