import { Typography } from "@mui/material";
import NewsArticle from "./NewsArticle";
import LoadingArticle from "./LoadingArticle";

const NewsFeed = (props) => {
  const { articles, loading } = props;

  if (!loading && !articles.length) {
    return (
      <Typography align="center" variant="h6" color="textSecondary" margin={4}>
        Not articles found
      </Typography>
    );
  }

  return (
    <div>
      {loading && [...Array(5)].map((_, i) => <LoadingArticle key={i} />)}
      {!loading &&
        articles.map((article) => (
          <NewsArticle key={JSON.stringify(article)} {...article} />
        ))}
    </div>
  );
};

export default NewsFeed;
