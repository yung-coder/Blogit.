import Image from "next/image";
import React from "react";
import { urlFor } from "../sanity";

interface Props {
  title: string;
  name: string;
  desc: string;
  image: object;
  authorimg: string;
}

const PostCard = (props: Props) => {
  return (
    <div>
      <div className="flex-col border h-fit bg-[#E0FFFF] shadow-md shadow-black md:w-[500px] ">
        <img src={urlFor(props.image).url()} className="w-full h-72" />
        <div className="flex justify-between border ">
          <div className="flex-col p-3">
            <h1 className="text-xl">{props.title}</h1>
            <p className="text-gray-800">{props.desc}</p>
            <h2 className="text-gray-600">{props.name}</h2>
          </div>
          <div className="p-4">
            <img src={urlFor(props.authorimg).url()} className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
