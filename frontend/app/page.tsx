import Breadcrumb from "./components/Breadcrumb";
import ChannelList from "./components/ChannelList";

export default function Home() {

  return (
    <div className="p-6">
      <Breadcrumb />
      <ChannelList />
    </div>
  );
}
