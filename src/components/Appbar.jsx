import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Appbar = () => {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl">
          Home
        </Link>
        <div>
          {loading ? (
            <span className="text-white">Loading...</span>
          ) : user ? (
            <>
              <span className="text-white mr-4">Welcome, {user.firstName}</span>
              <button
                onClick={logout}
                className="text-white bg-red-500 hover:bg-red-700 px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-white bg-green-500 hover:bg-green-700 px-3 py-2 rounded m-3"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-white bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
