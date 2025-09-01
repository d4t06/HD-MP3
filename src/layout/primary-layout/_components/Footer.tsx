import { PEmoji } from "@/components";

function Footer() {
  const classes = {
    container: `pt-[30px] pb-[calc(127px+30px)] md:mt-auto md:pb-[120px]`,
    copyRightText: "text-xs font-semibold text-center md:text-right",
  };

  return (
    <div className={`${classes.container}`}>
      <PEmoji size={"4"} className={classes.copyRightText}>
        Make with ❤️ by{" "}
        <a className="underline" href="https://dat-nguyen.vercel.app" target="_blank">
          Nguyen Huu Dat
        </a>{" "}
        <br /> © 2025
      </PEmoji>
    </div>
  );
}

export default Footer;
