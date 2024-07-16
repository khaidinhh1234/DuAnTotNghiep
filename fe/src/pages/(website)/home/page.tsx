import Banner from "./_components/Banner";
import Bestseller from "./_components/Bestseller";
import Categories from "./_components/Categories";
import Customer from "./_components/Customer";
import DealsOfTheMonth from "./_components/DealsOfTheMonth";
import InstagramStories from "./_components/InstagramStories";
import Method from "./_components/Method";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <Categories />
      <Bestseller />
      <DealsOfTheMonth />
      <Customer />
      <InstagramStories />
      <Method />
    </div>
  );
};

export default HomePage;
