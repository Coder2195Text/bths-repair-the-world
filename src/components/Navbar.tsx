"use client";

import {
  Dispatch,
  FC,
  MouseEvent,
  ReactNode,
  SetStateAction,
  createElement,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Collapse,
} from "@material-tailwind/react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import { IconType } from "react-icons";
import { RiAccountCircleLine } from "react-icons/ri";
import {
  BiCalendarCheck,
  BiChevronDown,
  BiPhotoAlbum,
  BiSearch,
  BiSpreadsheet,
} from "react-icons/bi";
import { FaDiscord, FaInstagram } from "react-icons/fa";
import UserForm from "./UserForm";
import { useRouter } from "next/navigation";
import { LiaUserTieSolid } from "react-icons/lia";
import ExecForm from "./ExecForm";
import { useAccount } from "./AccountContext";
import { AiOutlineMail, AiOutlineQuestionCircle } from "react-icons/ai";
import EmailSearcher from "./EmailSearcher";
import { MdOutlineBalance } from "react-icons/md";
import { BsFiles } from "react-icons/bs";

// profile menu component

const profileMenuItems: {
  label: ReactNode;
  icon: IconType;
  onClick?:
    | ((
        event:
          | MouseEvent<HTMLLIElement, globalThis.MouseEvent>
          | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
      ) => any)
    | "openProfile"
    | "openExecProfile"
    | "openEmailSearcher";
}[] = [
  {
    label: "Edit Profile",
    icon: RiAccountCircleLine,
    onClick: "openProfile",
  },
  {
    label: "Edit Exec Profile",
    icon: LiaUserTieSolid,
    onClick: "openExecProfile",
  },
  {
    label: "Email Searcher",
    icon: BiSearch,
    onClick: "openEmailSearcher",
  },

  {
    label: "Sign Out",
    icon: FiLogOut,
    onClick: () => {
      signOut();
    },
  },
];

const ProfileMenu: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const { execData, data: accountData } = useAccount();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editExecProfileOpen, setEditExecProfileOpen] = useState(false);
  const [emailSearchOpen, setEmailSearchOpen] = useState(false);

  const { data, status } = useSession();

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      {editProfileOpen && <UserForm mode="edit" setOpen={setEditProfileOpen} />}
      {editExecProfileOpen &&
        (execData ? (
          <ExecForm
            mode="edit"
            setOpen={setEditExecProfileOpen}
            execData={execData}
          />
        ) : (
          <ExecForm mode="post" setOpen={setEditExecProfileOpen} />
        ))}
      {emailSearchOpen && accountData && accountData.position !== "MEMBER" && (
        <EmailSearcher setOpen={setEmailSearchOpen} />
      )}
      <MenuHandler>
        <Button
          ripple
          variant="text"
          color="blue-gray"
          className="flex gap-1 items-center py-0.5 pr-2 pl-0.5 mr-1 ml-auto text-white rounded-full"
          disabled={status === "loading"}
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="candice wu"
            className="w-8 h-8 rounded-full"
            src={
              data?.user?.image ||
              "https://static.wixstatic.com/media/369c26_b396f2977e5a40839e2fc77a6f9aac2b~mv2.gif"
            }
          />
          <BiChevronDown
            strokeWidth={2.5}
            className={`h-4 w-4 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="z-40 p-2 bg-gray-700 border-none">
        {profileMenuItems.map(({ label, icon, onClick }, key) => {
          if (onClick === "openExecProfile" && accountData?.position !== "EXEC")
            return;

          if (
            onClick === "openEmailSearcher" &&
            accountData?.position === "MEMBER"
          )
            return;
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={key}
              onClick={(event) => {
                closeMenu();
                if (onClick === "openProfile") {
                  setEditProfileOpen(true);
                  return;
                }
                if (onClick === "openExecProfile") {
                  setEditExecProfileOpen(true);
                  return;
                }
                if (onClick === "openEmailSearcher") {
                  setEmailSearchOpen(true);
                  return;
                }

                onClick?.(event);
              }}
              className={`font-figtree flex transition-all text-white items-end gap-2 ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10 bg-red-200"
                  : "mb-2 hover:text-black bg-blue-300"
              }`}
            >
              {createElement(icon, {
                className: `h-5 w-5 ${isLastItem ? "text-red-500" : ""}`,
              })}
              <span className={` ${isLastItem ? "text-red-500" : ""}`}>
                {label}
              </span>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

// nav list menu
// nav list component
const navListLinks: {
  label: string;
  icon: IconType;
  url: string;
}[] = [
  {
    label: "Events",
    icon: BiCalendarCheck,
    url: "/events",
  },
  {
    label: "Gallery",
    icon: BiPhotoAlbum,
    url: "/gallery",
  },
  {
    label: "Executives",
    icon: LiaUserTieSolid,
    url: "/execs",
  },
];

const resourceLinks: {
  label: string;
  icon: IconType;
  url: string;
}[] = [
  {
    label: "FAQ",
    icon: AiOutlineQuestionCircle,
    url: "/faq",
  },
  {
    label: "Spreadsheet",
    icon: BiSpreadsheet,
    url: "/spreadsheet",
  },
  {
    label: "Bylaws",
    icon: MdOutlineBalance,
    url: "/bylaws",
  },
];

const socialLinks: {
  icon: IconType;
  url: string;
}[] = [
  {
    icon: FaDiscord,
    url: "https://discord.gg/zTDeqZd6ne",
  },
  {
    icon: FaInstagram,
    url: "https://www.instagram.com/bths.repair/",
  },
  {
    icon: AiOutlineMail,
    url: "mailto:bthsrepairtheworld@gmail.com",
  },
];

const ResourcesMenu: FC<{
  setNavOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ setNavOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const renderItems = resourceLinks.map(({ label, icon, url }, key) => {
    return (
      <motion.span
        key={url}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="w-full inline"
      >
        <Link
          href={url}
          onClick={() => {
            setNavOpen(false);
          }}
          className="flex justify-center items-center w-full ring-0 border-none font-figtree lg:font-[450] text-[25px] xl:text-[25px] lg:text-[20px] font-[500] xl:font-[500]"
        >
          {createElement(icon, {
            className: "w-8 xl:w-8 lg:w-6 lg:h-6 h-8 xl:h-8 inline mr-2",
          })}{" "}
          {label}
        </Link>
      </motion.span>
    );
  });

  return (
    <>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <a>
            <MenuItem className="items-center gap-2 flex lg:rounded-full justify-center   font-figtree lg:font-[450] text-[25px] xl:text-[25px] lg:text-[20px] font-[500] xl:font-[500]">
              <BsFiles className="w-8 h-8 lg:w-6 lg:h-6 xl:w-8 xl:h-8 inline lg:mr-1 mr-2 xl:mr-2 " />
              Resources
              <BiChevronDown
                strokeWidth={2.5}
                className={`h-4 w-4 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </a>
        </MenuHandler>
        <MenuList className="flex flex-col gap-3 overflow-visible bg-gray-500 border-none">
          {renderItems}
        </MenuList>
      </Menu>
    </>
  );
};

const NavList: FC<{
  setNavOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ setNavOpen }) => {
  const router = useRouter();
  return (
    <ul className="flex flex-col gap-3 items-center mt-1 mb-1 lg:flex-row xl:gap-6 lg:mt-0 lg:mb-0">
      {navListLinks.map(({ label, icon, url }) => (
        <motion.span
          key={label}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-5/6 text-white lg:w-auto"
        >
          <Link
            href={url}
            onClick={(e) => {
              setNavOpen(false);
            }}
            className="flex justify-center items-center w-full font-figtree lg:font-[450] text-[25px] xl:text-[25px] lg:text-[20px] font-[500] xl:font-[500]"
          >
            {createElement(icon, {
              className:
                "w-8 h-8 lg:w-6 lg:h-6 xl:w-8 xl:h-8 inline lg:mr-1 mr-2 xl:mr-2",
            })}
            {label}
          </Link>
        </motion.span>
      ))}
      <ResourcesMenu setNavOpen={setNavOpen} />
      <span className="flex">
        {socialLinks.map(({ icon, url }) => (
          <motion.span
            key={url}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-5/6 text-white lg:w-auto inline"
          >
            <Link
              href={url}
              onClick={() => {
                setNavOpen(false);
              }}
              target="_blank"
              className="flex justify-center items-center w-full"
            >
              {createElement(icon, {
                className: "w-8 xl:w-8 lg:w-6 lg:h-6 h-8 xl:h-8 inline mr-2",
              })}
            </Link>
          </motion.span>
        ))}
      </span>
    </ul>
  );
};

interface Props {
  isNavActive: boolean;
}

const Navbar: FC<Props> = ({ isNavActive }) => {
  const genericHamburgerLine = `absolute h-0.5 rounded-full bg-gray-300 w-6 rounded-full border-white transition ease transform duration-300 -translate-x-1/2 left-1/2`;
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  const { data, status } = useSession();

  if (!isNavActive && isNavOpen) {
    setIsNavOpen(false);
  }

  useEffect(() => {
    addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  return (
    <nav
      className={`transition-all delay-150 duration-300 ease-in-out fixed left-0 z-30 p-2 w-screen bg-gray-700 bg-opacity-90 border-none lg:pl-6 ${
        isNavActive ? "top-0" : "-top-16"
      }`}
    >
      <div className="flex relative items-center mx-auto text-blue-gray-900">
        <Link
          href="/"
          className="font-medium cursor-pointer"
          onClick={() => {
            setIsNavOpen(false);
          }}
        >
          <Image
            src={new Date().getMonth() == 5 ? "/icon-pride.png" : "/icon.png"}
            width={48}
            height={48}
            alt="logo"
            className="rounded-full"
          />
        </Link>
        <div className="hidden absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 lg:block">
          <NavList setNavOpen={setIsNavOpen} />
        </div>
        <Button
          color="blue-gray"
          onClick={toggleIsNavOpen}
          className="relative p-0 mr-2 ml-auto w-10 h-10 rounded-full lg:hidden"
          ripple
        >
          <div
            className={`-translate-y-1/2 ${genericHamburgerLine} ${
              isNavOpen ? "rotate-45" : "opacity-100 top-1/3"
            }`}
          />
          <div
            className={`${genericHamburgerLine}  ${
              isNavOpen ? "opacity-0" : "-translate-y-1/2 top-1/2 opacity-100"
            }`}
          />
          <div
            className={`-translate-y-1/2 ${genericHamburgerLine} ${
              isNavOpen ? "-rotate-45 " : "opacity-100 top-2/3"
            }`}
          />
        </Button>
        {status !== "unauthenticated" ? (
          <ProfileMenu />
        ) : (
          <Button
            className="flex flex-col justify-center items-center p-1 mr-2 ml-auto text-2xl bg-[#2356ff] font-figtree group"
            onClick={() => {
              signIn("auth0");
            }}
            color="blue"
          >
            Login
          </Button>
        )}
      </div>
      <Collapse className="lg:hidden display" open={isNavActive && isNavOpen}>
        <NavList setNavOpen={setIsNavOpen} />
      </Collapse>
    </nav>
  );
};

export default Navbar;
