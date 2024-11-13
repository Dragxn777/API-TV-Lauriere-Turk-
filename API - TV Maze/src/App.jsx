import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import useFetch from "./useFetch";

export default function Home() {
  const {
    data: seriesData,
    isLoading: seriesLoading,
    error: seriesError,
  } = useFetch("https://api.tvmaze.com/shows/184");
  const {
    data: episodesData,
    isLoading: episodesLoading,
    error: episodesError,
  } = useFetch("https://api.tvmaze.com/shows/184/episodes");
  const {
    data: castData,
    isLoading: castLoading,
    error: castError,
  } = useFetch("https://api.tvmaze.com/shows/184/cast");

  const [state, setState] = useState({
    selectedSeason: 1,
  });
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedCastMember, setSelectedCastMember] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (setter) => (item) =>
    setter((prev) => (prev?.id === item.id ? null : item));
  const handleSearch = (results) => setSearchResults(results);
  const filteredEpisodes =
    episodesData?.filter(({ season }) => season === state.selectedSeason) || [];

  const handleSeasonChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      selectedSeason: Number(e.target.value),
    }));
  };

  if (seriesLoading || episodesLoading || castLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-bgall">
        <motion.div className="w-20 h-20 bg-greenshadow rounded-full" />
        <p className="ml-4 text-textcolorwhite text-xl font-bold">
          Chargement en cours...
        </p>
      </div>
    );
  }

  if (seriesError || episodesError || castError) {
    return (
      <div className="text-red-500 text-center text-2xl">
        Erreur 404 : Page non trouvée
      </div>
    );
  }

  const renderInfoCard = (title, content) => (
    <Card className="shadow-md bg-slate-900 shadow-greenshadow rounded-3xl p-6 md:p-8 ">
      <CardHeader>
        <CardTitle className="text-2xl text-textcolorwhite md:text-4xl mb-4 md:mb-6 font-extrabold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-5 text-greenshadow  text-sm md:text-base">
          {content}
        </div>
      </CardContent>
    </Card>
  );

  const renderCast = () =>
    castData?.map((castMember) => (
      <motion.li
        key={castMember.person.id}
        className="flex flex-col items-center p-6 bg-slate-900 shadow-greenshadow rounded-2xl shadow-lg"
        onClick={() => handleChange(setSelectedCastMember)(castMember.person)}
      >
        <img
          src={
            castMember.person.image?.medium || "https://via.placeholder.com/150"
          }
          alt={castMember.person.name}
          className="rounded-full w-32 h-32 mb-4 object-cover border-4 border-textcolorwhite shadow-md"
        />

        <p className="text-textcolorwhite text-lg font-bold">
          {castMember.person.name}
        </p>
        <p className="text-textcolorwhite text-sm">
          {castMember.character.name}
        </p>
        {selectedCastMember?.id === castMember.person.id && (
          <div className="mt-4  bg-textcolorwhite bg-opacity-70 p-3 rounded-lg">
            <p>
              <strong>Nom du personnage :</strong> {castMember.character.name}
            </p>
            <p>
              <strong>Acteur :</strong> {castMember.person.name}
            </p>
            <p>
              <strong>Date de naissance :</strong> {castMember.person.birthday}
            </p>
          </div>
        )}
      </motion.li>
    ));

  const renderEpisodes = () =>
    filteredEpisodes.map((episode) => (
      <motion.li
        key={episode.id}
        className="flex flex-col justify-between items-start p-6 bg-textcolorwhite rounded-2xl shadow-lg"
        onClick={() => handleChange(setSelectedEpisode)(episode)}
      >
        <div className="flex items-center space-x-4">
          <span className="bg-greenshadow text-textcolorwhite px-3 py-1 rounded-full text-lg font-bold">
            {episode.number}
          </span>
          <p className="text-lg md:text-xl font-bold text-bgall">
            {episode.name}
          </p>
        </div>
        {selectedEpisode?.id === episode.id && (
          <div className="mt-4  bg-opacity-70 p-3 rounded-lg">
            <p>
              <strong>Durée :</strong> {episode.runtime} minutes
            </p>
            <p dangerouslySetInnerHTML={{ __html: episode.summary }} />
          </div>
        )}
      </motion.li>
    ));

  return (
    <div className="h-fill pb-10 bg-bggradient">
      <div className="sticky top-0 z-50">
        <Navbar onSearch={handleSearch} />
      </div>
      <div className="container mx-auto px-4 py-12">
        {selectedMovie ? (
          <>
            <button
              onClick={() => setSelectedMovie(null)}
              className="mb-4 px-6 py-3 bg-green-500 hover:bg-green-700 text-bgall rounded-full font-bold transition duration-300 transform hover:scale-105"
            >
              ← Retour
            </button>
            <motion.h1 className="text-5xl md:text-7xl font-extrabold text-center mb-12 md:mb-16 text-textcolorwhite ">
              {selectedMovie.show.name}
            </motion.h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-12 md:mb-16">
              {selectedMovie.show.image && (
                <CardContent>
                  <motion.img
                    className="w-full sm:w-3/4 h-auto rounded mx-auto"
                    src={selectedMovie.show.image.original}
                  />
                </CardContent>
              )}
              {renderInfoCard(
                "Informations",
                <>
                  <p>
                    <strong>Genres :</strong>{" "}
                    {selectedMovie.show.genres.join(", ")}
                  </p>
                  <p>
                    <strong>Langue :</strong> {selectedMovie.show.language}
                  </p>
                  <p>
                    <strong>Durée :</strong> {selectedMovie.show.runtime}{" "}
                    minutes
                  </p>
                  <p>
                    <strong>Première diffusion :</strong>{" "}
                    {selectedMovie.show.premiered}
                  </p>
                  <p>
                    <strong>Score :</strong> {selectedMovie.show.rating.average}
                    /10
                  </p>
                  <CardDescription
                    dangerouslySetInnerHTML={{
                      __html: selectedMovie.show.summary,
                    }}
                  />
                </>
              )}
            </div>
          </>
        ) : searchResults.length > 0 ? (
          <>
            <h2 className="text-5xl font-extrabold mb-12 text-center text-textcolorwhite">
              Résultats de recherche
            </h2>
            <motion.ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((result) => (
                <motion.li
                  key={result.show.id}
                  className="flex flex-col  bg-slate-900 shadow-greenshadow p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  onClick={() => setSelectedMovie(result)}
                >
                  <div className="flex items-center justify-center mb-4">
                    {result.show.image ? (
                      <img
                        src={result.show.image.medium}
                        alt={result.show.name}
                        className="rounded-lg object-cover w-full h-auto max-w-[200px] transition-transform duration-300 ease-in-out"
                      />
                    ) : (
                      <div className="bg-gray-600 h-48 w-full rounded-lg flex items-center justify-center">
                        <p className="text-gray-300">Image non disponible</p>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-textcolorwhite mb-2">
                      {result.show.name}
                    </h3>
                    <p className="text-textcolorwhite text-sm line-clamp-3">
                      {result.show.summary?.replace(/<\/?[^>]+(>|$)/g, "") ||
                        "Résumé non disponible"}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </>
        ) : (
          <>
            <motion.h1 className="text-5xl md:text-7xl font-extrabold text-center text-white mb-12 md:mb-16 bg-clip-text bg-green-500">
              {seriesData.name}
            </motion.h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 mb-16 md:mb-24">
              {seriesData.image && (
                <CardContent>
                  <motion.img
                    className="w-full h-auto rounded-3xl shadow-2xl"
                    src={seriesData.image.original}
                  />
                </CardContent>
              )}
              {renderInfoCard(
                "Informations",
                <>
                  <p className="">
                    <strong>Genres :</strong> {seriesData.genres.join(", ")}
                  </p>
                  <p>
                    <strong>Langue :</strong> {seriesData.language}
                  </p>
                  <p>
                    <strong>Durée :</strong> {seriesData.runtime} minutes
                  </p>
                  <p>
                    <strong>Première diffusion :</strong> {seriesData.premiered}
                  </p>
                  <p>
                    <strong>Score :</strong> {seriesData.rating.average}/10
                  </p>
                  <CardDescription
                    className="text-greenshadow"
                    dangerouslySetInnerHTML={{ __html: seriesData.summary }}
                  />
                </>
              )}
            </div>

            <h2 className="text-4xl font-extrabold text-textcolorwhite mb-8 md:mb-12 text-center">
              Saisons
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[1, 2, 3, 4, 5, 6].map((season) => (
                <button
                  key={season}
                  onClick={handleSeasonChange}
                  value={season}
                  className={`px-6 py-3 rounded-full text-lg font-bold transition duration-300 transform hover:scale-110 ${
                    state.selectedSeason === season
                      ? "bg-green-500 text-textcolorwhite shadow-lg"
                      : "bg-greenshadow text-colorwhite hover:text-textcolorwhite "
                  }`}
                >
                  Saison {season}
                </button>
              ))}
            </div>

            <motion.ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderEpisodes()}
            </motion.ul>
            <h2 className="text-4xl font-extrabold text-textcolorwhite mt-16 mb-8 md:mb-12 text-center">
              Distribution
            </h2>
            <motion.ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderCast()}
            </motion.ul>
          </>
        )}
      </div>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-900 hover:bg-green-600 text-white p-4 rounded-full transition duration-300 transform hover:scale-110 shadow-lg"
        >
          ↑
        </button>
      )}
    </div>
  );
}
