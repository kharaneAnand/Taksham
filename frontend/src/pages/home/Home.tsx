 import Hero from "../../components/home/Hero";
import NewArrivals from "../../components/home/NewArrivals";
 import ShopByRoom from "../../components/home/shopByRoom";
 import ShopTheLook from "../../components/home/ShopTheLook";
 import WhyTaksham from "../../components/home/WhyTaksham";

const Home = () => {
  return (
    <>
      <Hero />
      <ShopByRoom />
      <NewArrivals/>
      <ShopTheLook />
      <WhyTaksham />
    </>
  );
};

export default Home;