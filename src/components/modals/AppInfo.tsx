import { Dispatch, SetStateAction } from "react";
import ModalHeader from "./ModalHeader";

export default function AppInfo({
   setIsOpenModal,
}: {
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
   return (
      <div className="w-[400px] max-w-[calc(90vw-40px)]">
         <ModalHeader setIsOpenModal={setIsOpenModal} title={"Zingmp3 Clone"} />
         <div className="">
            <h5 className="text-lg font-bold">Các công nghệ sử dụng:</h5>
            <ul>
               {/* <li className="text-lg my-[10px] ml-[20px]">- React - Vite</li>
                <li className="text-lg my-[10px]  ml-[20px]">- Tailwind css</li> */}
               {/* <li className="text-lg my-[10px]  ml-[20px]">
               - Này tui lấy của người ta nên hông biết &#128535; &#128535; &#128535;
             </li> */}
            </ul>
            <a href="asldj" target="_blank" className="text-lg font-bold">
               #Github
            </a>
         </div>
      </div>
   );
}
