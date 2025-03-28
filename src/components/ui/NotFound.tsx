import { ReactNode } from "react";
import simon_empty from "@/assets/simon_empty.png";
import { Link } from "react-router-dom";
import { Button } from "..";
import { HomeIcon } from "@heroicons/react/24/outline";

type Props = {
  children?: ReactNode;
  className?: string;
  variant?: "less" | "with-home-button" | "default";
};

export default function NotFound({
  children,
  variant = "default",
  className = "",
}: Props) {
  const renderContent = () => {
    switch (variant) {
      case "less":
        return <></>;
      case "with-home-button":
        return (
          <>
            <p className="text-center">No result found, ¯\_(ツ)_/¯</p>
            <p className="text-center mt-5">
              <Link to={"/"}>
                <Button color="primary">
                  <HomeIcon className="w-6" />
                  <span>Home</span>
                </Button>
              </Link>
            </p>
          </>
        );
      case "default":
        return <p className="text-center">No result found, ¯\_(ツ)_/¯</p>;
    }
  };

  return (
    <div className={`${className}`}>
      <img className="mx-auto" src={simon_empty} alt="" />
      {renderContent()}
      {children}
    </div>
  );
}
