import { Box, Card, CardBody, CardFooter, Divider, Flex, HStack } from '@chakra-ui/react';

export default function ProjectSkeleton() {
  return (
    <Card w="full" border="1px" borderColor="gray.200">
      <CardBody>
        <Flex alignItems="center" gap={4}>
          <Box height={16} width={16} bgColor="gray.300" rounded="lg"></Box>
          <div>
            <Box bgColor="gray.300" height={4} width={48} rounded="sm"></Box>
            <Box fontSize="sm" color="gray.500">
              <HStack spacing={2}>
                <div>od</div>
                <Box bgColor="gray.300" height={4} width={32} rounded="sm"></Box>
              </HStack>
            </Box>
          </div>
        </Flex>
        <Box mt="6">
          <Box bgColor="gray.300" height={24} width="full"></Box>
        </Box>
      </CardBody>
      <Divider />
      <CardFooter>
        <Flex grow={1} justifyContent="flex-end" gap={4}>
          <Box bgColor="yellow.400" height={8} width="full" rounded="md"></Box>
          <Box bgColor="gray.200" height={8} width={16} rounded="md"></Box>
        </Flex>
      </CardFooter>
    </Card>
  );
}
