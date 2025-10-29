"use client";

import React, { useReducer } from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Radio, Result, Card } from "antd";
import type { RadioChangeEvent } from "antd";
import UiButton from "@/component/common/CustomButton";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correct: "Paris",
  },
  {
    question:
      "Which data type is used to store true or false values in JavaScript?",
    options: ["String", "Number", "Boolean", "Array"],
    correct: "Boolean",
  },
  {
    question: "Which company developed React?",
    options: ["Google", "Facebook", "Microsoft", "Amazon"],
    correct: "Facebook",
  },
  {
    question: "What is the output of 2 + '2' in JavaScript?",
    options: ["4", "22", "NaN", "Error"],
    correct: "22",
  },
  {
    question: "Which HTML tag is used to define an internal style sheet?",
    options: ["<script>", "<style>", "<link>", "<css>"],
    correct: "<style>",
  },
];

const initialState = {
  index: 0,
  isOptionClicked: false,
  optionClicked: "",
  nextButtonText: "Check Answer",
  isAnswered: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "nextQuestion":
      return {
        ...state,
        isOptionClicked: false,
        nextButtonText: "Check Answer",
        optionClicked: "",
        isAnswered: false,
        index: state.index + 1,
      };
    case "isOptionClicked":
      return {
        ...state,
        isOptionClicked: true,
        optionClicked: action.payload,
      };
    case "checkAnswer":
      return {
        ...state,
        nextButtonText: "Next",
        isAnswered: true,
      };
    default:
      return state;
  }
};

export default function QuizPage() {
  const [
    { index, isOptionClicked, nextButtonText, optionClicked, isAnswered },
    dispatch,
  ] = useReducer(reducer, initialState);

  const onChange = (e: RadioChangeEvent) => {
    if (!isAnswered) {
      dispatch({ type: "isOptionClicked", payload: e.target.value });
    }
  };

  if (index >= questions.length)
    return (
      <Result
        icon={<SmileOutlined />}
        title="🎉 Great! You’ve completed all questions!"
        extra={<UiButton type="primary">Restart</UiButton>}
      />
    );

  const currentQuestion = questions[index];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg p-6 shadow-md rounded-2xl">
        <h2 className="text-lg font-semibold mb-6">
          {currentQuestion.question}
        </h2>

        <Radio.Group
          onChange={onChange}
          value={optionClicked}
          className="flex flex-col gap-3 !w-full"
        >
          {currentQuestion.options.map((option, i) => {
            let bgClass = "border-gray-300 hover:bg-blue-50";
            let borderClass = "";

            if (isAnswered) {
              if (option === currentQuestion.correct) {
                // ✅ Correct answer
                bgClass = "bg-green-100";
                borderClass = "border-green-500";
              } else if (option === optionClicked) {
                // ❌ Wrong selected option
                bgClass = "bg-red-100";
                borderClass = "border-red-500";
              }
            } else if (optionClicked === option) {
              // 🟦 Selected before checking
              bgClass = "bg-blue-100 border-blue-400";
              borderClass = "border-blue-400";
            }

            return (
              <div
                key={i}
                onClick={() => {
                  if (!isAnswered)
                    dispatch({ type: "isOptionClicked", payload: option });
                }}
                className={`w-full text-start mb-2 border px-3 py-2 items-center flex rounded-lg cursor-pointer transition-all ${bgClass} ${borderClass}`}
              >
                <Radio value={option}>{option}</Radio>
              </div>
            );
          })}
        </Radio.Group>

        <div className="mt-6 flex justify-end">
          <Button
            type="primary"
            disabled={!isOptionClicked}
            onClick={() => {
              if (nextButtonText === "Next") {
                dispatch({ type: "nextQuestion" });
              } else {
                dispatch({ type: "checkAnswer" });
              }
            }}
          >
            {nextButtonText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
