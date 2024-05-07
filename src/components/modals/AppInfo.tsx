import ModalHeader from "./ModalHeader";

export default function AppInfo({ close }: { close: () => void }) {
   return (
      <div className="w-[400px] max-w-[calc(90vw-40px)]">
         <ModalHeader close={close} title={"HD Player"} />
         <div className="">
            <h5 className="text-lg font-bold">Các công nghệ sử dụng:</h5>
            <ul>
               <li className="text-lg my-[10px]  ml-[20px]">React - TS</li>
               <li className="text-lg my-[10px]  ml-[20px]">Google firebase</li>
            </ul>
            <a href="asldj" target="_blank" className="text-lg font-bold">
               #Github
            </a>
         </div>
      </div>
   );
}
