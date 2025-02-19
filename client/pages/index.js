import styles from "../styles/Home.module.css";
import Image from "next/image";
import homepage from "../public/images/homepage.png";
import Search from "../components/Search";
import Links from "../components/Links";
import Post from "../components/Post";
import axios from "axios";
import Question from "../components/Question";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "next/link";
import Footer from "../components/Footer";
import adbox from "/public/images/pillow.jpg";

export default function Home({ posts, questions }) {
  return (
    <div className={styles.homepage}>
      <Image src={adbox} layout="fill" className="b-radius-8" />
    </div>
  );
}

export const getStaticProps = async () => {
  try {
    const posts = await axios.get(`${process.env.server}/post`);
    const questions = await axios.get(`${process.env.server}/question`);
    return {
      props: {
        posts: posts.data ? posts.data : [],
        questions: questions.data ? questions.data : [],
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
