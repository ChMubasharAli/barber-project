import { Paper, Tabs, Title, Select } from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Tab from "../../../../components/Tab";
import { FaChevronDown } from "react-icons/fa";

export default function CustomerSettings() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <main className="flex flex-col pt-20 lg:pt-0 bg-[#F5F7FA] max-w-[1720px]  min-h-screen">
      <Title
        px={"lg"}
        py={"sm"}
        c={"black"}
        className="!roboto lg:bg-[#FFFFFF]   lg:!text-[32px] !text-[24px] !font-[500]  "
      >
        Settings
      </Title>
      <section className="lg:p-6 flex   flex-col h-full gap-8">
        <Paper
          p="xl"
          radius="25px"
          // bg={"#F5F7FA"}
          className="lg:shadow-md !bg-[#f5f7fa] lg:!bg-white "
        >
          {/* Desktop Tabs */}
          <section className="max-w-fit mt-3 mb-8 hidden lg:flex">
            <Tabs value={location.pathname} onChange={() => {}}>
              <Tabs.List>
                <Tab
                  path="/CustomerDashboard/settings"
                  text="Customers Settings"
                />
                <Tab
                  path="/CustomerDashboard/settings/email"
                  text="Email Notifications"
                />
                <Tab
                  path="/CustomerDashboard/settings/personal"
                  text="Personal Info"
                />
                <Tab
                  path="/CustomerDashboard/settings/delete"
                  text="Delete Account"
                />
              </Tabs.List>
            </Tabs>
          </section>

          {/* Mobile Dropdown */}
          <section className="flex items-center gap-8 bg-white shadow-sm rounded-[10px] py-4 px-4 justify-between lg:hidden ">
            <Title fz={"h2"} c={"#333B69"}>
              Settings
            </Title>
            <Select
              data={[
                {
                  label: "Customers Settings",
                  value: "/CustomerDashboard/settings",
                },
                {
                  label: "Email Notifications",
                  value: "/CustomerDashboard/settings/email",
                },
                {
                  label: "Personal Info",
                  value: "/CustomerDashboard/settings/personal",
                },
                {
                  label: "Delete Account",
                  value: "/CustomerDashboard/settings/delete",
                },
              ]}
              value={location.pathname} // ✅ Keep the selected value persistent
              onChange={(value) => value && navigate(value)} // ✅ Prevent clearing when clicking again
              rightSection={<FaChevronDown size={14} color="#333B69" />}
              checkIconPosition="right"
              clearable={false} // ✅ Prevent unchecking selected value
              styles={{
                input: {
                  border: "none",
                  borderBottom: "2px solid #333B69",
                  borderRadius: 0,
                  paddingRight: "2rem",
                  color: "#333B69",
                  fontSize: "1.2rem",
                },
              }}
            />
          </section>

          {/* Render the active tab component */}
          <div className="mt-6 lg:mt-0 !text-[18px] !font-normal ">
            <Outlet />
          </div>
        </Paper>
      </section>
    </main>
  );
}
