import {Card} from "@chakra-ui/card";
import {Button, Center, Input, Progress, Text, useToast} from '@chakra-ui/react'
import {useCallback, useState} from "react";
import {ResultBlock} from "@/components/TestForCouples/ResultBlock";

const questions = [
    {
        text: 'Write your association on word "Warm"'
    },
    {
        text: 'Write your association on word "Cold"'
    },
    {
        text: 'Write your association on word "Love"'
    },
]

export function TestBlock({step, setStep, maxStep}: any) {
    const [questionId, setQuestionId] = useState(0);
    const [answer, setAnswer] = useState("");
    const [answers, setAnswers] = useState<Array<Array<string>>>([])
    const toast = useToast()

    const onAnswerChange = useCallback((evt: any) => {
        setAnswer(evt.target.value)
    }, [setAnswer]);

    const onNextQuestion = useCallback(() => {
        if (answer === "") {
            toast({
                title: 'Please write your answer.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        if (questionId === 0) answers.push([]);
        answers[step].push(answer);
        setAnswers(answers);
        setAnswer("");
        if (questionId === questions.length - 1) {
            setQuestionId(0)
            if (step === maxStep) {
                setQuestionId(questions.length);
            }
            setStep(step + 1);
            console.log(answers)
            return;
        }
        setQuestionId(questionId + 1)
    }, [answer, questionId, answers, step, toast, maxStep, setStep]);

    return <Card minW="50%" maxW="700px" pb="20px">
        <Progress hasStripe value={questionId / questions.length * 100} borderRadius="5px"/>
        {(questionId < questions.length) ?
            <>
                <Text padding="10px" textAlign="center" fontWeight="500" fontSize="18px">
                    {questions[questionId].text}
                </Text>
                <Center>
                    <Input type="text" placeholder="Please answer the question" maxW="90%"
                           value={answer} onChange={onAnswerChange}/>
                </Center>
                <Center>
                    <Button mt="20px" maxW="50%" onClick={onNextQuestion}>
                        {
                            questionId === questions.length - 1 ?
                                (step === maxStep ? "Finish" : "Next block") :
                                "Next question"
                        }
                    </Button>
                </Center>
            </> :
            <ResultBlock answers={answers}/>
        }
    </Card>
}