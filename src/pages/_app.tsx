import "@/styles/globals.css";
import { NextSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  let router = useRouter();

  return (
    <>
      <NextSeo
        title={"Arrayly"}
        description={"Array's personal portfolio - Full Stack Developer"}
        canonical={`https://arrayly.dev${router.asPath.split("?")[0] === "/" ? "" : router.asPath.split("?")[0]}`}
        themeColor={"#2563eb"}
        openGraph={{
          url: `https://arrayly.dev${router.asPath.split("?")[0] === "/" ? "" : router.asPath.split("?")[0]}`,
          title: "Arrayly",
          description: "Array's personal portfolio - Full Stack Developer",
          images: [
            {
              url: "https://i.imgur.com/M88xZgN.png",
              alt: "Arrayly",
            },
          ],
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
