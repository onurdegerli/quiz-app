import { Router, Request, Response } from "express";
import Container from "typedi";

import { QuestionService } from "../services/QuestionService";
const questionService = Container.get(QuestionService);

export default (app: Router) => {
  app.get("/question", (request: Request, response: Response) => {
    questionService.getFirstQuestion(function(result) {
      response.status(200).send(result).end();
    });
  });

  app.get("/question/:id", (request: Request, response: Response) => {
    const questionId: number = +request.params.id;
    questionService.getNextQuestion(questionId, function(result) {
      response.status(200).send(result).end();
    });
  });
};