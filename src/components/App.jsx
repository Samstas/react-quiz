import Header from "./Header";
import MainComponent from "./MainComponent";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "../utils/Timer";
import {  useQuiz } from "../context/QuizContext";

export default function App() {
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />
      <MainComponent>
          {status === "loading" && <Loader />}
          {status === "error" && <Error />}
          {status === "ready" && <StartScreen />}
          {status === "active" && (
            <>
              <Progress />
              <Question />
              <Footer>
                <Timer />
                <NextButton />
              </Footer>
            </>
          )}
          {status === "finished" && <FinishScreen />}
      </MainComponent>
    </div>
  );
}
