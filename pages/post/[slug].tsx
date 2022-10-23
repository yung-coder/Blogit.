import { GetStaticProps } from "next";
import React, { useState } from "react";
import Header from "../../components/Header";
import { sanityclient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text"
import { useForm, SubmitHandler } from 'react-hook-form'
interface Props {
  post: [Post];
}

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

const Post = ({ post }: Props) => {
    const [submitted, setSubmitted] = useState(false)

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<IFormInput>()
  
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
      await fetch('/api/createcommnet', {
        method: 'POST',
        body: JSON.stringify(data),
      })
        .then(() => {
          setSubmitted(true)
        })
        .catch((err) => {
          console.log(err)
          setSubmitted(false)
        })
    }
  return (
    <main>
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post[0].mainImage).url()!}
        alt=""
      />
      <article className="mx-auto max-w-3xl p-5 text-white">
        <h1 className="mt-10 mb-3 text-3xl">{post[0].title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post[0].description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-12 w-10 rounded-full"
            src={urlFor(post[0].author.image).url()!}
            alt=""
          />
          <p className="text-sm font-extralight">
            Blog Post by{' '}
            <span className="text-green-600">{post[0].author.name}</span> -
            {/* Published at {new Date(post[0]._createdAt).toLocaleString()} */}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post[0].body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc" {...children}></li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-yellow-500 text-white" />

      {submitted ? (
        <div className="my-10 mx-auto flex max-w-2xl flex-col items-center rounded-xl bg-yellow-500 py-10 text-white">
          <h3 className="font-serif text-3xl font-bold">
            Thank you for submitting your comment
          </h3>
          <p>Once it has been approved, it will appear below!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-10 mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="mt-2 py-3" />

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post[0]._id}
          />

          <label className="mb-5 block text-white">
            <span >Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="John Doe"
              type="text"
            ></input>
          </label>
          <label className="mb-5 block ">
            <span className="text-white">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="John Doe"
              type="email"
            ></input>
          </label>
          <label className="mb-5 block ">
            <span className="text-white">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="John Doe"
              rows={8}
            />
          </label>

          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">- The Name Field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">
                - The Email Field is required
              </span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - The Comment Field is required
              </span>
            )}
          </div>

          <input
            type="submit"
            className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
          />
        </form>
      )}

      {/* Comment */}
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500 text-white">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post[0].comments.map((comment) => (
          <div key={comment._id}>
            <p className="font-mono">
              <span className="text-yellow-500">{comment.name}</span>:
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
          _id,
          slug {
              current
          },
          mainImage
      }`;

  const posts = await sanityclient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug]{
          _id,
          title,
          author -> {
              name,
              image
          },
          'comments': *[_type == "comment" && post._ref == ^._id && approved == true],
          description,
          mainImage,
          slug,
          body,
          _createdAt
      }`;
  const post = await sanityclient.fetch(query, {
    slug: params?.slug,
  });
  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
