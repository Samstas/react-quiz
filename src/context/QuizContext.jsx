import { createContext, useContext, useEffect, useReducer } from "react";
import { questions } from "../../data/questions";
const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  //loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload.questions, status: "ready" };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "setAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          // answer index number === correctOption number ?
          action.payload === question.correctOption
            ? state.points + question.points // 0 + points of correct question
            : state.points, // leave 0 points
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unknown");
  }
}

function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // You can dispatch "dataReceived" action with the imported 'questions' array.
    dispatch({ type: "dataReceived", payload: { questions } });
  }, []);

  const contextValue = {
    ...state,
    numQuestions: questions.length,
    maxPossiblePoints: questions.reduce((prev, cur) => prev + cur.points, 0),
    dispatch,
  };

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside of the QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };

// function QuizProvider({ children }) {
//   const [
//     { questions, status, index, answer, points, highscore, secondsRemaining },
//     dispatch,
//   ] = useReducer(reducer, initialState);

//   const numQuestions = questions.length;
//   const maxPossiblePoints = questions.reduce(
//     (prev, cur) => prev + cur.points,
//     0
//   );

//   useEffect(() => {
//     fetch("./data/questions.json")
//       .then((res) => res.json())
//       .then((data) => dispatch({ type: "dataReceived", payload: data }))
//       .catch((err) => dispatch({ type: "dataFailed" }));
//   }, []);

//   const contextValue = {
//     questions,
//     status,
//     index,
//     answer,
//     points,
//     highscore,
//     secondsRemaining,
//     numQuestions,
//     maxPossiblePoints,
//     dispatch,
//   };
//   return (
//     <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
//   );
// }

// function useQuiz() {
//   const context = useContext(QuizContext);
//   if (context === undefined)
//     throw new Error("QuizContext was used outside of the QuizProvider");
//   return context;
// }

// export { QuizProvider, useQuiz };
