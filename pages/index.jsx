import { createClient } from "contentful";
import React, { useEffect, useRef, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Head from "next/head";
import Image from "next/image";
import { wordsLetters, wordsLettersJsx } from "../components/words_letters";
import gsap, { Back, Power4, TweenMax } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Category from "../components/category";
import TitleWord from "../components/TitleWord";
gsap.registerPlugin(ScrollTrigger);

export const getStaticProps = async () => {
  const myContentfulAccount = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });
  const res = await myContentfulAccount.getEntries({ content_type: "recipe" });
  return { props: { recipes: res.items }, revalidate: 1 };
};

export default function Recipes({ recipes }) {
  const [categories, setCategories] = useState([]);
  const [filterWord, setFilterWord] = useState("All");
  let text = useRef(null);
  let recipiesBigBox = useRef(null);
  let categoriesElement = useRef(null);
  let img = useRef(null);

  const recipeArr =
    filterWord && filterWord !== "All"
      ? recipes
          .filter((item) => {
            if (item?.fields?.categories?.includes(filterWord))
              return { recipe: item.fields };
          })
          .map((item) => {
            return { recipe: item.fields };
          })
      : recipes.map((item) => {
          return { recipe: item.fields };
        });

  // const paths = recipes.map((recipe) => {
  //   return { params: { slug: recipe.fields.slug } };
  // });

  useEffect(() => {
    let myCategories = [];
    recipeArr.map((recipe) =>
      recipe?.recipe?.categories?.map((children) =>
        myCategories.push(children.replace(/\s/g, ""))
      )
    );
    setCategories(["All", ...new Set(myCategories)]);
  }, []);

  const [length, setlength] = useState(recipeArr?.length);

  useEffect(() => {
    setlength(recipeArr?.length);
  }, [recipeArr]);

  useEffect(() => {
    gsap.fromTo(
      img,
      2,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        delay: 0.2,
        y: 0,
        ease: Power4.easeInOut,
      }
    );
    gsap.fromTo(
      categoriesElement,
      2,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        delay: 0.4,
        y: 0,
        ease: Back.easeInOut,
      }
    );

    TweenMax.staggerFromTo(
      [...text.children],
      1,
      {
        opacity: 0,
        scale: 2,
      },
      {
        opacity: 1,
        scale: 1,
        ease: Power4.easeInOut,
        stagger: {
          each: 0.02,
          from: "random",
        },
      }
    );
    gsap.utils
      .toArray([...recipiesBigBox?.children[0]?.children[0]?.children])
      .forEach((card, i) => {
        gsap.fromTo(
          card,
          2,
          {
            opacity: 0,
            skewX: 20,
            x: 200,
            rotateY: 180,
          },
          {
            opacity: 1,
            skewX: 0,
            x: 0,
            rotateY: 0,
            delay: 0.2 * i,
            ease: Power4.easeInOut,
            scrollTrigger: {
              trigger: recipiesBigBox?.children[0]?.children[0],
              start: "center bottom",
            },
          }
        );
      });

    return () => ScrollTrigger.update();
  }, []);

  return (
    <>
      <Head title={"Recipes"} />
      <div className="recipe-list">
        <div className="title">
          <TitleWord />
          <div className="text" ref={(e) => (text = e)}>
            {wordsLettersJsx(
              "He collected the plastic trash on a daily basis. It never seemed to end. Even if he cleaned the entire beach, more plastic would coverit effort that would never be done, he continued to pick up thetrash each day."
            )}
          </div>
          <a
            ref={(e) => (img = e)}
            href="https://www.linkedin.com/in/moncef-lak-198020204"
            className="link-me"
          >
            <div className="img">
              <Image
                src="https://www.svgrepo.com/show/382108/male-avatar-boy-face-man-user-4.svg"
                alt="img"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            By LM Moncef Lakehal
          </a>
        </div>
        <div className="categories" ref={(e) => (categoriesElement = e)}>
          <div className="cover">
            {categories.map((category, key) => (
              <Category
                key={key}
                setFilterWord={setFilterWord}
                filterWord={filterWord}
                category={category}
              />
            ))}
          </div>
        </div>
        {recipeArr && (
          <div className="all-recipes-box" ref={(e) => (recipiesBigBox = e)}>
            <Swiper
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 0,
                },
                650: {
                  slidesPerView: length <= 5 ? 1 : 2,
                  width: 600,
                },
                950: {
                  slidesPerView: length <= 5 ? 1 : 3,
                  width: 900,
                },
              }}
            >
              {recipeArr.map((recipe, id) => {
                return (
                  <SwiperSlide key={id}>
                    <RecipeCard recipes={recipe} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>
    </>
  );
}
