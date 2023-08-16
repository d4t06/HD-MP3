import {
   HomeIcon,
   MagnifyingGlassIcon,
   ClipboardDocumentIcon,
   PlusCircleIcon,
   HeartIcon,
   Cog6ToothIcon,
   QuestionMarkCircleIcon,
   ClockIcon,
} from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import Button from "./ui/Button";
import Divider from "./ui/Divider";
import { Link } from "react-router-dom";
import Modal from "./Modal";

interface Props { }

const Sidebar: FC<Props> = () => {
   const [isOpenSetting, setIsOpenSetting] = useState(false);

   return (
      <div className="text-gray-300 text-md p-4 w-[12rem] border-r border-gray-900 h-screen overflow-y-auto max-[549px]:hidden">

         <div className="flex flex-col gap-3 items-start">
            <Button>
               <Link to="/">
                  <HomeIcon className="w-6 h-6 mr-2 inline" />
                  Home
               </Link>
            </Button>
         </div>

         <Divider className="border-gray-900 my-4" />

         <div className="flex flex-col gap-3 items-start">
            <Button>
               <Link to="/playlist">
                  <ClipboardDocumentIcon className="w-6 h-6 mr-2 inline" />
                  My Playlist
               </Link>
            </Button>
            <Button>
               <Link to="/favorite">
                  <HeartIcon className="w-6 h-6 mr-2 inline" />
                  Liked
               </Link>
            </Button>
            <Button>
               <ClockIcon className="w-6 h-6 mr-2" />
               Last Play
            </Button>
         </div>

         <Divider className="border-gray-900 my-4" />

         <div className="flex flex-col gap-3 items-start">
            <Button onClick={() => setIsOpenSetting(true)}>
               <Cog6ToothIcon className="w-6 h-6 mr-2" />
               Settings
            </Button>
            <Button>
               <QuestionMarkCircleIcon className="w-6 h-6 mr-2" />
               Info
            </Button>
         </div>

         {/* {
            isOpenSetting &&
            <Modal setOpenModal={setIsOpenSetting}  >
               <div className="max-w-[1000px] bg-zinc-900">
                  <h1 className="text-white">Setting screen</h1>
               </div>
            </Modal>
         } */}

      </div>
   );
};

export default Sidebar;
