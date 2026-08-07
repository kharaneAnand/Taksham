import { useAuth } from "../../context/AuthContext";

const Home = () => {

  const { isAuthenticated } =
    useAuth();

  return (
    <div className="flex h-screen items-center justify-center text-3xl font-bold">
      {isAuthenticated
        ? "Logged In"
        : "Not Logged In"}
    </div>
  );
};

export default Home;