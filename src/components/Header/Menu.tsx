import {Breadcrumb, BreadcrumbItem, Link} from "@chakra-ui/react";
import {linkHoverStyles} from "@/lib/styles";

export function Menu() {
    return <Breadcrumb separator='-' fontSize="14px">
        <BreadcrumbItem>
            <Link href='/' _hover={linkHoverStyles}>Test for Couples</Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
            <Link href='/' _hover={linkHoverStyles}>Statistics</Link>
        </BreadcrumbItem>
    </Breadcrumb>
}