"use client";

import React, { FC, ReactNode } from "react";
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
import { BiChevronDown, BiCode, BiCube } from "react-icons/bi";

// profile menu component

const profileMenuItems: {
  label: ReactNode;
  icon: IconType;
  onClick?: (
    event:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => any;
}[] = [
    {
      label: "Sign Out",
      icon: FiLogOut,
      onClick: () => {
        signOut();
      },
    },
  ];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  const { data } = useSession();

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          ripple
          variant="text"
          color="blue-gray"
          className="flex gap-1 items-center py-0.5 pr-2 pl-0.5 ml-auto text-white rounded-full"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="candice wu"
            className="p-0.5 w-12 h-12 rounded-full border border-blue-500"
            src={
              data?.user?.image ||
              "https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png"
            }
          />
          <BiChevronDown
            strokeWidth={2.5}
            className={`h-6 w-6 transition-transform ${isMenuOpen ? "rotate-180" : ""
              }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="z-40 p-2 bg-gray-700 border-none">
        {profileMenuItems.map(({ label, icon, onClick }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={key}
              onClick={(event) => {
                closeMenu();
                onClick?.(event);
              }}
              className={`flex transition-all text-white items-center gap-2 ${isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10 bg-red-200"
                  : "mb-2 hover:text-black bg-blue-300"
                }`}
            >
              {React.createElement(icon, {
                className: `h-10 w-10 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <span
                className={`text-2xl font-figtree ${isLastItem ? "text-red-500" : ""
                  }`}
              >
                {label}
              </span>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

// nav list menu
// nav list component
const navListItems = [
  {
    label: "Account",
    icon: RiAccountCircleLine,
    url: "/test",
  },
  {
    label: "Blocks",
    icon: BiCube,
    url: "",
  },
  {
    label: "Docs",
    icon: BiCode,
    url: "",
  },
];

const NavList: FC = () => {
  return (
    <ul className="flex flex-col gap-4 items-center mt-1 mb-1 lg:flex-row lg:gap-10 lg:mt-0 lg:mb-0">
      {navListItems.map(({ label, icon, url }) => (
        <motion.span
          key={label}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-5/6 text-white lg:w-auto"
        >
          <Link href={url} className="flex justify-center items-center w-full">
            {React.createElement(icon, {
              className: "h-[30px] w-[30px] inline mr-2",
            })}
            <h6>{label}</h6>
          </Link>
        </motion.span>
      ))}
    </ul>
  );
};

const Navbar: FC = () => {
  const genericHamburgerLine = `border-2 w-[24px] my-0.5 rounded-full border-white transition ease transform duration-300`;
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  const { data, status } = useSession();

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  return (
    <nav className="fixed top-0 left-0 z-30 p-2 w-screen bg-gray-700 bg-opacity-90 border-none lg:pl-6">
      <div className="flex relative items-center mx-auto text-blue-gray-900">
        <Link href="/" className="font-medium cursor-pointer">
          <Image
            src="/favicon.ico"
            width={60}
            height={60}
            alt="logo"
            className="rounded-full"
          />
        </Link>
        <div className="hidden absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 lg:block">
          <NavList />
        </div>
        <Button
          color="blue-gray"
          onClick={toggleIsNavOpen}
          className="flex flex-col justify-center items-center mr-2 ml-auto w-12 h-12 rounded-full lg:hidden group"
          ripple
        >
          <div
            className={`${genericHamburgerLine} ${isNavOpen
                ? "rotate-45 translate-y-[6px] opacity-50 group-hover:opacity-100"
                : "opacity-50 group-hover:opacity-100"
              }`}
          />
          <div
            className={`${genericHamburgerLine} ${isNavOpen ? "opacity-0" : "opacity-50 group-hover:opacity-100"
              }`}
          />
          <div
            className={`${genericHamburgerLine} ${isNavOpen
                ? "-rotate-45 -translate-y-[6px] opacity-50 group-hover:opacity-100"
                : "opacity-50 group-hover:opacity-100"
              }`}
          />
        </Button>
        {status === "authenticated" ? (
          <ProfileMenu />
        ) : (
          <Button
            className="flex flex-col justify-center items-center mr-2 ml-auto text-2xl bg-lime-700 rounded-full font-tyros group"
            onClick={() => {
              signIn("auth0");
            }}
          >
            Login
          </Button>
        )}
      </div>
      <Collapse open={isNavOpen}>
        <NavList />
      </Collapse>
    </nav>
  );
};

export default Navbar;
