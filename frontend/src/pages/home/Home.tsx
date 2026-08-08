 import Hero from "../../components/home/Hero";
import NewArrivals from "../../components/home/NewArrivals";
 import ShopByRoom from "../../components/home/shopByRoom";
 import ShopTheLook from "../../components/home/ShopTheLook";

const Home = () => {
  return (
    <>
      <Hero />
      <ShopByRoom />
      <NewArrivals/>
      <ShopTheLook />
    </>
  );
};

export default Home;