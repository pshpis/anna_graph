import {useCallback, useMemo} from "react";
import {Box, Button, Center, CircularProgress, CircularProgressLabel, Text, useToast, VStack} from "@chakra-ui/react"
import axios from "axios";

export function ResultBlock({answers}: any) {
    const result = useMemo(() => {
        let ans: number = 0;
        let len: number = answers[0].length;
        for (let i = 0; i < len; i++) {
            let isGood: boolean = true;
            for (let j = 1; j < answers.length; j++) {
                if (answers[j][i] != answers[0][i]) isGood = false;
            }
            if (isGood) ans++;
        }
        return Math.round(ans / len * 100);
    }, [answers]);

    const toast = useToast()

    const sendData = useCallback(async () => {
        const response = await axios.post('/api/insert_stats', {
            data: answers,
        });
        if (response.status === 200){
            toast({
                title: 'Data sending is successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        }
        else {
            toast({
                title: 'Error with data sending',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [answers, toast]);

    return <Box minW="50%" maxW="700px" padding="0 20px">
        <Text textAlign="center" fontWeight="bold" fontSize="18px" mt="10px">
            Your result is
        </Text>
        <VStack as={Center}>
            <CircularProgress value={result} size="100px" thickness="5px" color={result > 50 ? "green.400" : "blue"}>
                <CircularProgressLabel>{result}%</CircularProgressLabel>
            </CircularProgress>
            <Button onClick={sendData}>
                Send data to statistic
            </Button>
        </VStack>


    </Box>
}