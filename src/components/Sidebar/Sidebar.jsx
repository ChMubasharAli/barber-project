import { useState } from "react";
import freshifyLogo from "../../assets/freshifyLogoMobile.png";
import { Image } from "@mantine/core";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// react icons import
import { MdOutlineSettings } from "react-icons/md";

export default function Sidebar({
  data,
  settingData = { link: "", label: "", activePath: "" }, // Set default value
}) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [active, setActive] = useState(currentPath);

  const links = data.map((item) => (
    <Link
      className={`group flex items-center gap-[10px] no-underline text-[18px] font-[400] px-4 py-2 transition-all duration-300 text-[#b1b1b1] hover:bg-gray-50 hover:text-black dark:hover:bg-[#f5f7fa] dark:hover:text-black ${
        item.activePath === active
          ? "bg-[#f5f7fa] border-l-4 border-black text-black"
          : ""
      }`}
      to={item.link}
      key={item.label}
      onClick={() => setActive(item.activePath)}
    >
      <item.icon
        className={`mr-4 w-[30px] h-[30px] ${
          item.activePath === active
            ? "text-black"
            : "text-[#b1b1b1] group-hover:text-black"
        }`}
      />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className="  flex flex-col   h-screen bg-[black]">
      <div className="flex-1 ">
        <Image className="w-full h-[78px] " src={freshifyLogo} />

        <div className="flex flex-col gap-2">{links}</div>
      </div>

      <div className="pb-1  ">
        <Link
          to={settingData.link || ""}
          className={`group flex items-center gap-[10px] no-underline text-[18px] font-[400] px-4 py-2  text-[#b1b1b1] hover:bg-gray-50 hover:text-black dark:hover:bg-[#f5f7fa]  transition-all duration-300 dark:hover:text-black${
            settingData.activePath === active
              ? " border-l-4 border-black text-black bg-[#f5f7fa]"
              : ""
          }`}
          onClick={() => setActive(settingData.activePath)}
        >
          <MdOutlineSettings
            className={`${
              settingData.activePath === active
                ? "text-black"
                : "text-[#b1b1b1] group-hover:text-black"
            } mr-4 w-[30px] h-[30px]`}
          />
          <span>{settingData.label}</span>
        </Link>
      </div>
    </nav>
  );
}
