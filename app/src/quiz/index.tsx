import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container as ServiceContainer } from "typedi";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { selectQuestion, selectIsResetClicked, selectSelectedAnswers } from "./store";
import { setQuestion } from "./slices/questionSlice";
import { setIsResetClicked } from "./slices/resetQuizSlice";
import { resetSelectedAnswers } from "./slices/selectedAnswersSlice";

import NavigationButtonsComponent from "./components/NavigationButtonsComponent";
import ResetButtonComponent from "./components/ResetButtonComponent";
import QuestionComponent from "./components/QuestionComponent";
import AnswersComponent from "./components/AnswersComponent";
import AnswerResultComponent from "./components/AnswerResultComponent";
import InfoComponent from "./components/InfoComponent";
import TimerComponent from "./components/TimerComponent";

import { QuestionService } from "./services/QuestionService";
const questionService = ServiceContainer.get(QuestionService);

import { AnswerService } from "./services/AnswerService";
const answerService = ServiceContainer.get(AnswerService);

import { TimerService } from "./services/TimerService";
const timerService = ServiceContainer.get(TimerService);

import "./assets/Quiz.css";

function getEmptyAnswerResult(): IAnswerResult {
  return {
    isAnswered: false,
    isCorrect: false,
    message: ""
  };
}

function Quiz(): ReactElement {
  const dispatch = useDispatch();
  const question = useSelector(selectQuestion);
  const isResetClicked = useSelector(selectIsResetClicked);
  const selectedAnswers = useSelector(selectSelectedAnswers);

  const [answerResult, setAnswerResult] = React.useState<IAnswerResult>(getEmptyAnswerResult());
  const [isAnswerSelected, setIsAnswerSelected]: [boolean, (isAnswerSelected: boolean) => void] = React.useState<boolean>(false);
  const [totalQuestionCount, setTotalQuestionCount]: [number, (totalQuestionCount: number) => void] = React.useState<number>(0);
  const [answeredQuestionCount, setAnsweredQuestionCount]: [number, (answeredQuestionCount: number) => void] = React.useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount]: [number, (correctAnswersCount: number) => void] = React.useState<number>(0);
  const [isExamFinished, setIsQuizFinished]: [boolean, (isExamFinished: boolean) => void] = React.useState<boolean>(false);
  const [timer, setTimer]: [ITimer, (timer: ITimer) => void] = React.useState<ITimer>(timerService.getTimer());

  React.useEffect(() => {
    questionService.getCurrentQuestion(function (currentQuestion: IQuestion | null) {
      if (currentQuestion) {
        dispatch(setQuestion(currentQuestion));
      } else {
        questionService.getRandomQuestion(function (currentQuestion: IQuestion) {
          dispatch(setQuestion(currentQuestion));
        });
      }
    });

    setTotalQuestionCount(questionService.getMaxQuestionCount());
    setAnsweredQuestionCount(questionService.getAnsweredQuestionsCount());
    setCorrectAnswersCount(answerService.getCorrectAnswersCount());
    setAnswerResult(getEmptyAnswerResult());
  }, []);

  const checkAnswer = () => {
    if (question === null) {
      return;
    }

    questionService.saveAnsweredQuestion(question.id);
    setAnsweredQuestionCount(questionService.getAnsweredQuestionsCount());
    questionService.getRandomQuestion(() => ({}));

    if (answerService.isAnswerCorrect(selectedAnswers, question.correct_answers)) {
      setAnswerResult({
        isAnswered: true,
        isCorrect: false,
        message: "Wrong! The correct answer is " + question.correct_answers
      });
      return;
    }

    setCorrectAnswersCount(answerService.incrementCorrectAnswersCount());
    setAnswerResult({
      isAnswered: true,
      isCorrect: true,
      message: "Correct!"
    });
  };

  const getNextQuestion = () => {
    if (question === null) {
      return;
    }

    if (questionService.isQuizFinished()) {
      setIsQuizFinished(true);
    } else {
      questionService.getRandomQuestion(function (nextQuestion: IQuestion) {
        dispatch(setQuestion(nextQuestion));
        setAnswerResult(getEmptyAnswerResult());
        dispatch(resetSelectedAnswers());
        setIsAnswerSelected(false);
      });
    }
  };

  const resetQuiz = () => {
    const isResetConfirmed = window.confirm("Are you sure to reset the quiz?");
    if (isResetConfirmed == true) {
      dispatch(setIsResetClicked(true));
      // timerService.resetTimer();
      // setTimer(timerService.getTimer());
      questionService.resetData();
      answerService.resetData();
      questionService.getRandomQuestion(function (currentQuestion: IQuestion) {
        dispatch(setQuestion(currentQuestion));
        setAnswerResult(getEmptyAnswerResult());
        setAnsweredQuestionCount(0);
        setCorrectAnswersCount(0);
        dispatch(resetSelectedAnswers());
        setIsAnswerSelected(false);
        setIsQuizFinished(false);
      });
    }
  };

  if (isExamFinished) {
    return (
      <Container fluid className="container mt-5">
        <Row>Quiz is over.</Row>
        <Row>{correctAnswersCount} correct answers out of {totalQuestionCount}.</Row>
        <ResetButtonComponent onResetClick={() => { resetQuiz(); }} />
      </Container>
    );
  }

  return (
    <Container fluid className="container mt-5">
      <Row>
        <TimerComponent 
          onTimerReset={() => { dispatch(setIsResetClicked(false)); }}
          onUpdateTimer={(updatedTime: any) => { 
            timerService.updateTimer(updatedTime);
          }}
          isResetClicked={isResetClicked}
          timer={timer}
        />
      </Row>
      <Row>
        <InfoComponent
          totalQuestionCount={totalQuestionCount}
          answeredQuestionCount={answeredQuestionCount}
          correctAnswersCount={correctAnswersCount}
        />
      </Row>
      <AnswerResultComponent answerResult={answerResult} />
      {question !== null &&
        <QuestionComponent
          question={question.question}
          questionBody={question.question_body}
        >{{}}</QuestionComponent>
      }
      {question !== null &&
        <AnswersComponent
          questionId={question.id}
          answers={question.answers}
          correctAnswers={question.correct_answers}
          isAnswered={answerResult.isAnswered}
          onIsAnswerSelected={() => {
            setIsAnswerSelected(true);
          }}
        />
      }
      {answerResult !== null &&
        <NavigationButtonsComponent
          isAnswered={answerResult.isAnswered}
          isAnswerSelected={isAnswerSelected}
          onAnswerClick={() => { checkAnswer(); }}
          onNextClick={() => { getNextQuestion(); }}
        />
      }
      <ResetButtonComponent onResetClick={() => { resetQuiz(); }}>{{}}</ResetButtonComponent>
    </Container >
  );
}

export default Quiz;