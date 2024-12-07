import express from "express";
import axios from "axios";
const router = express.Router();
import { getCourseNameAndPrereq } from "../data/academic_planner.js";
import {
  addQuestionByUserId,
  getAllQuestions,
  updateMeToo,
  getQuestionsByCourseCode,
} from "../data/qna.js";

router.route("/").get(async (req, res) => {
  try {
    let coursesData = await getCourseNameAndPrereq();
    if (coursesData.boolean) {
      let courses = coursesData.data;
      return res.status(200).render("qna", { courses: courses });
    } else {
      return res.status(200).render("qna");
    }
  } catch (error) {
    return res.status(500).render("error");
  }
});

router.route("/questions/:courseCode/:courseName").get(async (req, res) => {
  try {
    // const response = await axios.get("http://localhost:3000/qna/questions/get");
    let courseCodeDisplay = req.params.courseCode;
    let courseNameDisplay = req.params.courseName;
    const result = await getQuestionsByCourseCode(courseCodeDisplay);
    if (result.boolean) {
      let questionData = result.data;
      let courseDisplay = {
        courseCodeDisplay: courseCodeDisplay,
        courseNameDisplay: courseNameDisplay,
      };
      let coursesData = await getCourseNameAndPrereq();
      if (coursesData.boolean) {
        return res.status(200).render("qnaCourseQuestions", {
          courseDisplay: courseDisplay,
          coursesData: coursesData.data,
          questionsData: questionData,
        });
      }
    } else {
      let courseCodeDisplay = req.params.courseCode;
      let courseNameDisplay = req.params.courseName;
      let courseDisplay = {
        courseCodeDisplay: courseCodeDisplay,
        courseNameDisplay: courseNameDisplay,
      };
      let coursesData = await getCourseNameAndPrereq();
      if (coursesData.boolean) {
        return res.status(200).render("qnaCourseQuestions", {
          courseDisplay: courseDisplay,
          coursesData: coursesData.data,
        });
      }
    }
  } catch (error) {
    //
  }
});

router.route("/ans").get(async (req, res) => {
  return res.status(200).render("qnaCoursesAnswers");
});

router.route("/questions/post").post(async (req, res) => {
  try {
    let { userId, title, description, courseCode, createdAt } = req.body;
    let response = await addQuestionByUserId(
      userId,
      title,
      description,
      courseCode,
      createdAt
    );
    if (response.boolean) {
      return res
        .status(200)
        .json({ boolean: response.boolean, questionId: response.questionId });
    } else {
      return res
        .status(200)
        .json({ boolean: response.boolean, error: response.error });
    }
  } catch (error) {
    return res.status(500).json({
      boolean: false,
      error: `Something went wrong ${error}`,
    });
  }
});

router.route("/questions/get").get(async (req, res) => {
  try {
    let response = await getAllQuestions();
    // console.log(response);
    if (response.boolean) {
      return res
        .status(200)
        .json({ boolean: response.boolean, data: response });
    } else {
      return res
        .status(200)
        .json({ boolean: response.boolean, data: response });
    }
  } catch (error) {
    return res.status(500).json({
      boolean: false,
      error: `Something went wrong in /questions/get route ${error}`,
    });
  }
});

router.route("/questions/meToo/:questionId").patch(async (req, res) => {
  try {
    let questionId = req.params.questionId;
    let result = await updateMeToo(questionId);
    if (result.boolean) {
      return res.status(200).json({ boolean: true, message: "meTooUpdated" });
    } else {
      return res.status(200).json({ boolean: false, error: result.error });
    }
  } catch (error) {
    return res.status(500).json({
      boolean: false,
      error: `Something went wrong in updating meToo ${error}`,
    });
  }
});

export default router;
