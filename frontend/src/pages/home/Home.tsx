 import Hero from "../../components/home/Hero";
import NewArrivals from "../../components/home/NewArrivals";
 import ShopByRoom from "../../components/home/shopByRoom";
 import ShopTheLook from "../../components/home/ShopTheLook";
 import WhyTaksham from "../../components/home/WhyTaksham";
 import InteriorConsultation from "../../components/home/InteriorConsultation";
 import Newsletter from "../../components/home/Newsletter";

const Home = () => {
  return (
    <>
      <Hero />
      <ShopByRoom />
      <NewArrivals/>
      <ShopTheLook />
      <WhyTaksham />
      <InteriorConsultation />
      <Newsletter />
    </>
  );
};

export default Home;