import { Button, Title } from "@/components";
import { Link } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/20/solid";

function Unauthorized() {
  return (
    <div
      className={`bg-[--layout-cl] text-[--text-cl] flex flex-col justify-center items-center min-h-screen`}
    >
      <Title title="Unauthorized" />

      <Link to={"/"}>
        <Button variant={"primary"} color="primary" className="mt-10">
          <HomeIcon className="w-6" />
          <span>Go home</span>
        </Button>
      </Link>
    </div>
  );
}

export default Unauthorized;
