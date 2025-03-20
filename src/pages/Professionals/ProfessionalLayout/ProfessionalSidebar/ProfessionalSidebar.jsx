import { useState } from "react";
import freshifyLogo from "../.././../../assets/freshifyLogo.png";
import { Image } from "@mantine/core";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// react icons import
import { MdCalendarMonth, MdOutlineSettings } from "react-icons/md";

const data = [
  {
    link: "",
    label: "Calendar",
    activePath: "/ProfessionalDashboard",
    icon: MdCalendarMonth,
  },
];

export default function ProfessionalSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [active, setActive] = useState(currentPath);

  const links = data.map((item) => (
    <Link
      className={`flex items-center gap-[10px] no-underline text-[18px] font-[400] px-4 py-2  text-[#b1b1b1] hover:bg-gray-50 hover:text-black dark:hover:bg-[#f5f7fa] dark:hover:text-black ${
        item.activePath === active
          ? "bg-[#f5f7fa] border-l-4 border-black text-black"
          : ""
      }`}
      to={item.link}
      key={item.label}
      onClick={() => setActive(item.activePath)}
    >
      <item.icon
        className={`${
          item.activePath === active ? "text-black" : "text-[#b1b1b1]"
        } mr-4 w-[30px] h-[30px]`}
      />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className="  flex flex-col  h-screen bg-[#FFFFFF]">
      <div className="flex-1">
        <Image className="w-full h-[78px] " radius="md" src={freshifyLogo} />

        {links}
      </div>

      <div className="pb-1  ">
        <Link
          to={"settings"}
          className={`flex items-center no-underline text-[18px] px-4 py-2 font-medium text-[#b1b1b1] hover:bg-gray-50 hover:text-black dark:hover:bg-[#f5f7fa] dark:hover:text-black${
            "settings" === active
              ? " border-l-4 border-black text-black bg-[#f5f7fa]"
              : ""
          }`}
          onClick={() => setActive("settings")}
        >
          <MdOutlineSettings
            className={`${
              active === "settings" ? "text-black" : "text-[#b1b1b1]"
            } mr-4 w-[30px] h-[30px]`}
          />
          <span>Settings</span>
        </Link>
      </div>
    </nav>
  );
}
