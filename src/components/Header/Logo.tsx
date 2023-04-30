import {Box, HStack, Image, Link} from "@chakra-ui/react";
import {linkHoverStyles} from "@/lib/styles";

export function Logo() {
    return <Link as={HStack} href="/" textDecoration="none" _hover={linkHoverStyles}>
        <Image src="logo.svg" alt="logo" width="30px" height={"30px"}/>
        <Box fontFamily="Inter" fontWeight="700" fontSize="19px" color="white">ASOC2EMO</Box>
    </Link>
}