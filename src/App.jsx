import { Button, Container, Typography } from "@mui/material";
import NewsHeader from "./components/NewsHeader";
import NewsFeed from "./components/NewsFeed";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { styled } from "@mui/material/styles";

const Footer = styled("div")(({ theme }) => ({
  margin: theme.spacing(2, 0),
  display: "flex",
  justifyContent: "space-between",
}));

const PAGE_SIZE = 5;

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("general");
  const pageNumber = useRef(1);
  const queryValue = useRef("");
  const [error, setError] = useState("");

  async function loadData(currentCategory) {
    setLoading(true);
    const response = await fetch(
      ` https://newsapi.org/v2/top-headlines?category=${currentCategory}&q=${
        queryValue.current
      }&page=${pageNumber.current}&pageSize=${PAGE_SIZE}&country=us&apiKey=${
        import.meta.env.VITE_NEWS_API_KEY
      }`
    );
    const data = await response.json();
    if (data.status === "error") {
      throw new Error(data.message);
    }
    return data.articles.map((article) => {
      const { publishedAt, title, description, author, urlToImage, url } =
        article;
      return {
        publishedAt,
        title,
        description,
        author,
        image: urlToImage,
        url,
      };
    });
  }

  const fetchAndUpdateArticles = (currentCategory) => {
    setLoading(true);
    setError("");
    loadData(currentCategory ?? category)
      .then((newData) => {
        setArticles(newData);
      })
      .catch((errorMessage) => {
        setError(errorMessage.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const debouncedLoaded = debounce(fetchAndUpdateArticles, 700);

  useEffect(() => {
    fetchAndUpdateArticles();
  }, []);

  const handleSearchChanage = (newQuery) => {
    pageNumber.current = 1;
    queryValue.current = newQuery;
    debouncedLoaded();
  };

  const handleNextClick = () => {
    pageNumber.current += 1;
    fetchAndUpdateArticles();
  };

  const handlePreviousClick = () => {
    pageNumber.current -= 1;
    fetchAndUpdateArticles();
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    pageNumber.current = 1;
    fetchAndUpdateArticles();
  };

  return (
    <Container>
      <NewsHeader
        onSearchChange={handleSearchChanage}
        category={category}
        onCategoryChange={handleCategoryChange}
      />
      {error.length === 0 ? (
        <NewsFeed articles={articles} loading={loading} />
      ) : (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      <Footer>
        <Button
          variant="outlined"
          onClick={handlePreviousClick}
          disabled={loading || pageNumber.current === 1}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          onClick={handleNextClick}
          disabled={loading || articles.length < PAGE_SIZE}
        >
          Next
        </Button>
      </Footer>
    </Container>
  );
}
export default App;
