// API CALLS
async function addQuestionApiCall(
  userId,
  title,
  description,
  courseCode,
  createdAt
) {
  try {
    let response = await axios.post(
      "http://localhost:3000/qna/questions/post",
      {
        userId,
        title,
        description,
        courseCode,
        createdAt,
      }
    );
    if (response.data.boolean) {
      console.log(`questionId: ${response.data.questionId}`);
      return response.data.boolean;
    } else {
      console.error(response);
      return response.data.boolean;
    }
  } catch (error) {
    console.error(`Something went wrong ${error}`);
    return false;
  }
}

async function updateMeToo(questionId, func) {
  try {
    let response = await axios.patch(
      `http://localhost:3000/qna/questions/meToo/${func}/${questionId}`
    );
    if (response.data.boolean) {
      return true;
    } else {
      false;
    }
  } catch (error) {
    console.error(`Something went wrong in updateMeToo ${error}`);
    return false;
  }
}

async function checkIfQuestionLiked(questionId) {
  try {
    let response = await axios.get(
      `http://localhost:3000/qna/questions/meToo/checkMeTooState/${questionId}`
    );
    return response.data.boolean;
  } catch (error) {
    console.error(`Something went wrong in updateMeToo ${error}`);
    return false;
  }
}

async function deleteQuesiton(questionId) {
  try {
    const response = await axios.delete(
      `http://localhost:3000/qna/questions/delete/${questionId}`
    );
    if (response.data.boolean) {
      return response.data.boolean;
    } else {
      console.error(response.data.error);
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Question onCLick Event
async function addQuestion() {
  const title = document.getElementById("question-title").value;
  if (title.trim().length === 0) return false;
  const description = document.getElementById("question-description").value;
  if (description.trim().length === 0) return false;
  const createdAt = new Date().toISOString().split("T")[0];
  const courseCodeName =
    document.getElementById("course-name-code").textContent;
  const courseCode = courseCodeName.split("-")[1].trim(); // Splitting the course "XYZ-CS123"
  const userId = "123";
  let questionAdded = await addQuestionApiCall(
    userId,
    title,
    description,
    courseCode,
    createdAt
  );
  return questionAdded;
}

// POST Button
let modalElement = document.getElementById("exampleModal");
const modalInstance = new bootstrap.Modal(modalElement);
let addQuestionBtn = document.getElementById("add-question");
addQuestionBtn.addEventListener("click", async () => {
  if (await addQuestion()) {
    modalInstance.hide();
    document.getElementById("add-question").focus();
    window.location.reload();
  } else {
    console.log(`title or description missing`);
  }
});

// Delete Button
// START FROM HERE
document.addEventListener("click", async (event) => {
  if (event.target.closest("#q-id")) {
    const cardBody = event.target.closest("[data-question-id]");
    if (cardBody) {
      try {
        const questionId = cardBody.getAttribute("data-question-id");
        if (await deleteQuesiton(questionId)) {
          window.location.reload();
        } else {
          console.log("Could not delete question"); //CHANGE THIS
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
});

async function updateMeTooCount() {
  // Update button states on DOM load
  document.addEventListener("DOMContentLoaded", async () => {
    const meTooButtonList = document.querySelectorAll("[data-question-id]");

    for (const buttonContainer of meTooButtonList) {
      const questionId = buttonContainer.getAttribute("data-question-id");
      const meTooButton = buttonContainer.querySelector("#me-too");
      const meTooCountElement = buttonContainer.querySelector("#me-too-count");

      if (questionId && meTooButton && meTooCountElement) {
        const liked = await checkIfQuestionLiked(questionId);

        // Update button state
        if (liked) {
          meTooButton.setAttribute("aria-pressed", "true");
          meTooButton.classList.add("active");
          meTooButton.classList.remove("deactive");
        } else {
          meTooButton.setAttribute("aria-pressed", "false");
          meTooButton.classList.add("deactive");
          meTooButton.classList.remove("active");
        }
      }
    }

    // Add a click event listener
    document.addEventListener("click", async (event) => {
      //
      if (event.target.closest("#me-too")) {
        const cardBody = event.target.closest("[data-question-id]");
        if (cardBody) {
          try {
            const questionId = cardBody.getAttribute("data-question-id");
            const meTooButton = cardBody.querySelector("#me-too");
            const meTooCountElement = cardBody.querySelector("#me-too-count");

            let meTooCount = parseInt(meTooCountElement.textContent, 10);
            const isPressed =
              meTooButton.getAttribute("aria-pressed") === "true";

            if (!isPressed && (await updateMeToo(questionId, "inc"))) {
              meTooCount++;
              meTooButton.setAttribute("aria-pressed", "true");
              meTooButton.classList.add("active");
              meTooButton.classList.remove("deactive");
            } else if (isPressed && (await updateMeToo(questionId, "dec"))) {
              meTooCount = Math.max(meTooCount - 1, 0);
              meTooButton.setAttribute("aria-pressed", "false");
              meTooButton.classList.add("deactive");
              meTooButton.classList.remove("active");
            }

            // Update count
            meTooCountElement.textContent = meTooCount;
          } catch (error) {
            console.error("An error occurred:", error);
          }
        }
      }
    });
  });
}

await updateMeTooCount();
