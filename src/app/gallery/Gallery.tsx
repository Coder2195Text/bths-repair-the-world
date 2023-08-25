"use client";

import { FC, ReactNode, createElement, useState } from "react";
import PhotoCaptions from "./captions.json";

import Layout from "@/components/Layout";
import { AutoPlayPlugin } from "@/utils/keen-utils";
import { useKeenSlider } from "keen-slider/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import Image from "next/image";

const Gallery: FC = () => {
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },

    [
      AutoPlayPlugin(2000),
      // add plugins here
    ]
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const rangeList = [...Array(5).keys()].reverse();
  return (
    <Layout>
      <h1>Gallery</h1>
      <div className="relative">
        <div
          className="inline-block relative my-3 w-full rounded-2xl h-[50vw] keen-slider lg:h-[600px]"
          ref={sliderRef}
        >
          <div className="flex absolute justify-center items-center w-full h-full">
            <HashLoader color="#2563EB" size={100} />
          </div>
          {rangeList.map((i) => (
            <div className="keen-slider__slide">
              <Image
                src={`/images/${i + 1}.jpg`}
                fill
                className="object-cover"
                alt=""
              />
            </div>
          ))}
        </div>
        <button
          className="absolute left-0 top-1/2 bg-transparent -translate-y-1/2"
          onClick={(e) => {
            e.stopPropagation();
            instanceRef.current?.prev();
          }}
        >
          <FaChevronLeft className="lg:w-10 lg:h-10 w-[4vw] h-[4vw]" />
        </button>
        <button
          className="absolute right-0 top-1/2 bg-transparent -translate-y-1/2"
          onClick={(e) => {
            e.stopPropagation();
            instanceRef.current?.next();
          }}
        >
          <FaChevronRight className="lg:w-10 lg:h-10 w-[4vw] h-[4vw]" />
        </button>
      </div>
      <div>
        <h3>
          {PhotoCaptions[currentSlide].title} - (
          {PhotoCaptions[currentSlide].date})
        </h3>
        <p>{PhotoCaptions[currentSlide].description}</p>
      </div>
    </Layout>
  );
};

export default Gallery;
