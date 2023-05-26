import DateComponent from '@/components/Date';
import SeoTags from '@/components/SeoTags';
import Layout from '@/components/Layouts/Layout';
import { useEffect, useState } from 'react';
import { Button, Divider, Flex, HStack, Heading, IconButton, Tooltip } from '@chakra-ui/react';
import { FiHeart, FiShare2 } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import Image from 'next/image';
import { Image as ImageInterface, Post as PostInterface } from '@prisma/client';
import { UserInterface } from '@/interfaces/UserInterface';

interface Props {
  siteMeta: {
    title: string;
    description: string;
    url: string;
  };
  post: PostInterface & {
    featuredImage?: ImageInterface;
    ogImage?: ImageInterface;
    author: UserInterface;
  };
}

export default function Post({ siteMeta, post }: Props) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isUpdatingLikes, setIsUpdatingLikes] = useState(false);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    // mainEntityOfPage: {
    //   '@type': 'WebPage',
    //   '@id': 'https://piotrdoniak.com',
    // },
    headline: post.title,
    description: post.description,
    image: post.ogImage?.url || 'https://piotrdoniak.com/images/brand/me.png',
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `https://piotrdoniak.com/autorzy/${post.author.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Piotr Doniak',
      url: 'https://piotrdoniak.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://piotrdoniak.com/images/brand/me.png',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
  };

  const updateViews = async () => {
    try {
      await fetch(`/api/posts/views?slug=${post.slug}`, {
        method: 'POST',
      });
    } catch (error) {
      // console.log(error);
    }
  };

  const updateLikes = async () => {
    setIsUpdatingLikes(true);
    try {
      const response = await fetch(`/api/posts/likes?slug=${post.slug}`, {
        method: 'POST',
      });
      const data = await response.json();

      setIsUpdatingLikes(false);
      if (data.status !== 'error') {
        setLikes(data.likes);
        setLiked(data.liked);
      }
    } catch (error) {
      setIsUpdatingLikes(false);
      // console.log(error);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${siteMeta.url}`);
  };

  useEffect(() => {
    updateViews();
    setLikes(post.likes);

    const response = fetch(`/api/posts/likes?slug=${post.slug}`, {
      method: 'GET',
    });
    response
      .then((res) => res.json())
      .then((data) => {
        setLiked(data.liked);
      });
  }, []);

  return (
    <>
      <SeoTags
        title={siteMeta?.title}
        description={siteMeta?.description}
        url={siteMeta?.url}
        type="article"
        image={post.ogImage?.url}
        schema={schema}
      />
      <Layout>
        <div className="mb-20 flex h-full w-full items-start pt-4 md:pt-10">
          <div className="animate__animated animate__fadeIn mx-auto w-full max-w-2xl">
            {post.featuredImageId && post.featuredImage?.url && (
              <div>
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.title || post.featuredImage.name || post.title}
                  title={post.featuredImage.title || post.featuredImage.name || post.title}
                  width={600}
                  height={286}
                  className="mx-auto mb-10 rounded-lg"
                  quality={75}
                  priority={true}
                />
              </div>
            )}
            <div>
              <Heading as="h1" size="lg" fontWeight="bold" mt={4}>
                {post.title}
              </Heading>
              <Flex mt={4} alignItems="center" justifyContent="space-between">
                <HStack spacing={2} className="text-sm text-gray-600">
                  <DateComponent dateString={new Date(post.publishedAt).toISOString()} />
                  <div>•</div>
                  <div>{post.readingTime} min czytania</div>
                  {/* <div>•</div>
                  <div>{post.author.name}</div> */}
                </HStack>
                <HStack spacing={2}>
                  <Tooltip
                    label={liked ? 'Lubisz to!' : 'Lubię to!'}
                    aria-label="Lubię to!"
                    placement="top"
                    hasArrow
                  >
                    <Button
                      leftIcon={liked ? <FaHeart /> : <FiHeart />}
                      variant={liked ? 'solid' : 'outline'}
                      colorScheme="red"
                      size="sm"
                      aria-label="Polub"
                      isLoading={isUpdatingLikes}
                      loadingText={likes.toString()}
                      onClick={() => updateLikes()}
                    >
                      {likes}
                    </Button>
                  </Tooltip>
                  <Tooltip label="Udostępnij" aria-label="Udostępnij" placement="top" hasArrow>
                    <IconButton
                      variant="outline"
                      colorScheme="blue"
                      size="sm"
                      aria-label="Udostępnij"
                      icon={<FiShare2 />}
                      onClick={() => copyLink()}
                    />
                  </Tooltip>
                </HStack>
              </Flex>
            </div>
            <Divider my={4} />
            <div className="mt-4 w-full max-w-2xl text-left text-black">
              <article className="prose prose-p:my-2 prose-p:leading-6 prose-img:rounded-md">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  const { post } = await fetch(`${origin}/api/posts/${slug}`).then((res) => res.json());

  if (!post) return { notFound: true, revalidate: 1 };

  const meta = {
    title: `${post.title} - Piotr Doniak`,
    description: post.description,
    url: `${origin}/post/${post.slug}`,
  };

  return {
    props: {
      post,
      siteMeta: meta,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  const { posts } = await fetch(`${origin}/api/posts?all=1`).then((res) => res.json());
  const paths = posts.map((post: PostInterface) => ({ params: { slug: post.slug } }));

  return {
    paths,
    fallback: 'blocking',
  };
}
