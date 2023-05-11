import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import Image from 'next/image';
import { FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import { Project as ProjectType } from '@prisma/client';
import DateComponent from './Date';

type Props = {
  project: ProjectType;
  source?: string;
};

export default function Project({ project, source = 'other' }: Props) {
  let { url } = project;
  url = url.replace('{source}', source);

  return (
    <Card maxW="sm" border="1px" borderColor="gray.200">
      <CardBody>
        <Flex alignItems="center" gap={4}>
          <Image
            src={project.image}
            alt={project.name}
            height={64}
            width={64}
            className="rounded-xl"
          />
          <div>
            <Heading as="h2" size="md">
              {project.name}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              od <DateComponent dateString={new Date(project.publishedAt).toISOString()} fullDate />
            </Text>
          </div>
        </Flex>
        <Box mt="6" w="full" minH="100px">
          <Text>{project.description}</Text>
        </Box>
      </CardBody>
      <Divider />
      <CardFooter>
        <Flex grow={1} justifyContent="flex-end" gap={4}>
          <Link href={`/projekty/${project.slug}`} className="block w-full">
            <Button variant="solid" w="full" colorScheme="yellow">
              Zobacz szczegóły
            </Button>
          </Link>
          {project.url && (
            <Tooltip label="Otwórz stronę" aria-label="Otwórz stronę" placement="top" hasArrow>
              <Link href={url} passHref target="_blank">
                <IconButton
                  aria-label="Otwórz w nowej karcie"
                  icon={<FiExternalLink />}
                  variant="outline"
                  colorScheme="gray"
                />
              </Link>
            </Tooltip>
          )}
        </Flex>
      </CardFooter>
    </Card>
  );
}
