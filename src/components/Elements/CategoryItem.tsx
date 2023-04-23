/* eslint-disable no-underscore-dangle */
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { CategoryInterface } from '@/interfaces/CategoryInterface';

export default function CategoryItem({ category }: { category: CategoryInterface }) {
  return (
    <Link
      as={NextLink}
      href={`/wiedza/${category.slug}`}
      className="block"
      style={{ textDecoration: 'none' }}
    >
      <div className="transform rounded border border-gray-200 bg-white p-4 transition duration-300 hover:scale-105 hover:bg-gray-100">
        <div className="text-center">
          <div className="-mt-1 text-lg font-bold">{category.name}</div>
          <div className="mt-2 text-xs text-gray-500">
            {category._count.posts} {category._count.posts === 1 && 'post'}
            {category._count.posts > 1 && category._count.posts < 5 && 'posty'}
            {(category._count.posts >= 5 || category._count.posts === 0) && 'postów'}
          </div>
        </div>
      </div>
    </Link>
  );
}
