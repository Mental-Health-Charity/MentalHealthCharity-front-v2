import { Box } from "@mui/material";
import Container from "../modules/shared/components/Container";
import UserProfileHeading from "../modules/users/components/Profile";
import wave_bg from "../assets/static/wave_bg.webp";
import UserProfileSettings from "../modules/users/components/UserProfileSettings";
import UserProfileDescription from "../modules/users/components/UserProfileDescription";
import UserProfileArticles from "../modules/users/components/UserProfileArticles";
import { useQuery } from "@tanstack/react-query";
import { articlesByUserQueryOptions } from "../modules/articles/queries/articlesByUserQueryOptions";
import { ArticleStatus } from "../modules/articles/constants";
import { useNavigate, useParams } from "react-router-dom";

const ProfileScreen = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  if (!userId) {
    navigate("/404");
  }

  const { data: articles } = useQuery(
    articlesByUserQueryOptions({
      status: ArticleStatus.SENT,
      author: userId,
      page: 1,
      size: 24,
    })
  );
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxHeight: "280px",
          overflow: "hidden",
          marginTop: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          "& img": {
            opacity: "0.8",
          },
        }}
      >
        <img width="100%" src={wave_bg} alt="" height="700px" aria-disabled />
      </Box>
      <Container
        parentProps={{
          sx: {
            marginTop: "-185px",
          },
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <UserProfileHeading />
        <UserProfileSettings />
        <UserProfileDescription
          content="Z doświadczenia wiemy, jak ogromną rolę odgrywają w takiej sytuacji towarzyszące nam osoby. Jesteśmy także świadomi potencjału kryjącego się w trudnych momentach życia, który, choć na początku niedostrzegalny, może stanowić przełom ku zmianie na lepsze.
Fundację Peryskop współtworzymy z myślą o wszystkich, którzy pomimo dynamicznego rozwoju mediów społecznościowych i rosnącego zainteresowania psychologią w przestrzeni publicznej, w kryzysie psychicznym wciąż czują się pozostawieni sami sobie. Chcemy przestrzeni bez tabu, w której spotykamy się na najgłębszym poziomie. Wiemy, że posiadamy idealne warunki, by zadbać o dobrostan psychiczny osób takich jak my, bo tak naprawdę wszystkich nas łączą podobne troski i wyzwania, świadczące o naszym człowieczeństwie.
Z psychologią jesteśmy za pan brat. Dołącz do nas, jeśli potrzebujesz pomocy lub chcesz pomagać. Rola, w którą się u nas wcielisz, nie musi pozostać na zawsze taka sama. Każdy z nas, bez wyjątku, podlega procesowi ciągłych zmian, a kryzys często okazuje się stanem przejściowym.
Możemy tworzyć wspólnie unikalne miejsce, w którym osoby doświadczające trudnych emocji będą zaopiekowane przez naszych wolontariuszy, pozostających pod stałą opieką superwizyjną. Razem widzimy więcej, możemy więcej i jesteśmy lepiej przygotowani do stawiania czoła nieustannej podróży, jaką jest życie."
        />
        {articles && <UserProfileArticles articles={articles.items} />}
      </Container>
    </Box>
  );
};

export default ProfileScreen;
