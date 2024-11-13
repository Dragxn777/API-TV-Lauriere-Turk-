import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${searchTerm}`
      );
      const results = await response.json();
      onSearch(results);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    }
  };

  return (
    <nav className="p-4 flex bg-black justify-between items-center shadow-lg">
      <div className="text-white text-2xl font-bold flex items-center space-x-2">
        <img
          onClick={() => window.location.reload()}
          src="src/assets/Logo.svg"
          className="h-10 w-auto hover:cursor-pointer"
          alt="Logo"
        />
        <span
          onClick={() => window.location.reload()}
          className="hidden sm:inline text-white hover:cursor-pointer"
        >
          NetFrog
        </span>
      </div>

      <div className="flex-1 mx-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Rechercher un film ou une série"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full p-3 pl-10 rounded-lg bg-gray-100 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow duration-300 ease-in-out"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z"
              />
            </svg>
          </div>
        </form>
      </div>

      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;
