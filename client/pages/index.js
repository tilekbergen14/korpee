import styles from "../styles/Home.module.css";
import Image from "next/image";
import homepage from "../public/images/homepage.png";
import Search from "../components/Search";
import Links from "../components/Links";
import Post from "../components/Post";
import axios from "axios";
import Question from "../components/Question";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "next/Link";
import Footer from "../components/Footer";
import adbox from "/public/images/adbox.png";

export default function Home({ posts, questions }) {
  return (
    <div className={styles.homepage}>
      <div className={styles.header}>
        <div className={styles.openingText}>
          <h1 className={styles.bigText}>
            <span className={styles.learn}>Learn</span>
            <span className={styles.teach}>Teach</span>
            <span className={styles.explore}>Explore with us!</span>
          </h1>
          <p className={styles.optSmall}>
            We are the comminity of code learners from Kazakhstan! We learn,
            teach and much more. Join the team.
          </p>
        </div>
        <div className="flex flex-end w-100 tablet-none">
          <div className={styles.headerImgBox}>
            <Image src={homepage} layout="fill" className={styles.headerImg} />
          </div>
        </div>
        <div className={styles.searchBox}>
          <Search />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.bodyRight}>
          <h3 className="title">Posts</h3>
          {posts && posts.map((post) => <Post post={post} key={post.id} />)}
          <div className="flex flex-end align-center">
            <Link href="posts">
              <h3 className="title flex align-center c-pointer ">
                See All <ArrowForwardIosIcon fontSize="14px" />
              </h3>
            </Link>
          </div>
          <h3 className="title">Questions</h3>
          {questions &&
            questions.map((question) => (
              <Question key={question.id} question={question} />
            ))}
          <div className="flex flex-end align-center ">
            <Link href="questions">
              <h3 className="title flex align-center c-pointer">
                See All <ArrowForwardIosIcon fontSize="14px" />
              </h3>
            </Link>
          </div>
        </div>
        <div className={`mobile-none ${styles.third}`}>
          <Links />
          <div className="adbox-300-600 mt-8">
            <Image src={adbox} layout="fill" className="b-radius-8" />
          </div>
        </div>
      </div>
      <Footer />
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
