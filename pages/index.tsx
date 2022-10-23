import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import { sanityclient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  console.log(posts);
  return (
    <div className="max-w-7xl  mx-auto ">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex flex-col justify-center items-center space-y-3 p-5 mt-5">
        <div className="flex flex-col space-y-14">
          {posts.map((post) => {
            return (
              <Link key={post._id} href={`/post/${post.slug.current}`}>
                <div className="cursor-pointer">
                  <PostCard
                    title={post.title}
                    name={post.author.name}
                    desc={post.description}
                    image={post.mainImage}
                    authorimg={post.author.image}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
     _id,
     title,
     author->{
       name,
       image,
     },
     description,
     mainImage,
     slug
   }`;

  const posts = await sanityclient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
