import { HStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { PostInterface } from '@/interfaces/PostInterface';
import DateComponent from '../Date';

export default function PostItem({ post }: { post: PostInterface }) {
  return (
    <Link
      as={NextLink}
      href={`/post/${post.slug}`}
      className="block"
      style={{ textDecoration: 'none' }}
    >
      <div className="transform rounded border border-gray-200 bg-white p-4 transition duration-300 hover:scale-105 hover:bg-gray-100">
        <div>
          <div className="-mt-1 text-lg font-bold">{post.title}</div>
          <div>{post.description}</div>
          <div className="mt-2 text-xs text-gray-500">
            <HStack spacing={1}>
              <DateComponent dateString={post.publishedAt} />
              <div>•</div>
              <div>{post.readingTime} min czytania</div>
              <div>•</div>
              <div>{post.author.name}</div>
            </HStack>
          </div>
        </div>
      </div>
    </Link>
  );
}
