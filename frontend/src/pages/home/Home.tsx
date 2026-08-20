 import Hero from "../../components/home/Hero";
import NewArrivals from "../../components/home/NewArrivals";
 import ShopByRoom from "../../components/home/shopByRoom";
 import WhyTaksham from "../../components/home/WhyTaksham";
 import InteriorConsultation from "../../components/home/InteriorConsultation";
 import Newsletter from "../../components/home/Newsletter";

const Home = () => {
  return (
    <>
      <Hero />
      <ShopByRoom />
      <NewArrivals/>
      <WhyTaksham />
      <InteriorConsultation />
      <Newsletter />
    </>
  );
};

export default Home;