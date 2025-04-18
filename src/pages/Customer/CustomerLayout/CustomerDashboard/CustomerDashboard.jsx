import { Title } from "@mantine/core";
import CustomerTable from "../../../../components/CustomerTable";
import { usePostMutation } from "../../../../services/reactQuery";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function CustomerDashboard() {
  const { role } = JSON.parse(localStorage.getItem("data")) || {};
  const {
    data: bookings = [],
    mutate: getMutateBookings,
    isPending: isLoading,
    error,
  } = usePostMutation("bookings");

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        getMutateBookings({
          endpoint: `/api/get-all-bookings`,
          payload: { role },
        });
      } catch {
        toast.error("Error fetching bookings");
      }
    };
    fetchBookings();
  }, [getMutateBookings, role]);
  return (
    <main className="pt-20 grid grid-cols-1 gap-y-5 max-w-[1440px] mx-auto lg:pt-0 lg:gap-6  p-6  ">
      <Title
        c={"black"}
        className="lg:!px-6  hidden lg:!block  lg:bg-[#FFFFFF] lg:!text-[32px] !text-[24px] !font-[500] py-[18px] !rounded-[16px]"
      >
        Appointments
      </Title>
      <CustomerTable bookings={bookings} isLoading={isLoading} error={error} />
    </main>
  );
}
