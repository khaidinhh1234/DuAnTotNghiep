import Banner from "./_components/Banner";
import Bestdispensary from "./_components/Bestdispensary";
import Chooseyour from "./_components/chooseyour";
import Customer from "./_components/Customer";
import Howto from "./_components/Howto";
import Intyca from "./_components/intyca";
import Recenty from "./_components/Recenty";
import Shiping from "./_components/Shiping";
import Weed from "./_components/Weed";
import Whatmake from "./_components/Whatmake";

type Props = {};

const HomePage = () => {
  return (
    <div>
      <Banner />
      <Shiping />
      <Bestdispensary />
      <Customer />
      <Chooseyour />
      <Howto />

      <Whatmake />
      <Recenty />
      <Intyca />
      <Weed />
    </div>
  );
};

export default HomePage;
