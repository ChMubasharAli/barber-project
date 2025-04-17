import { Text, Modal } from "@mantine/core";
import { BsDot } from "react-icons/bs";
import TableCom from "./Table";
import { useState, useEffect, useMemo, useCallback } from "react";
import AppointmentDetails from "./AppointmentDetails";

export default function CustomerTable({ bookings, error, isLoading }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // // Debugging: Only log when bookings actually changes
  // useEffect(() => {
  //   if (bookings && bookings.length > 0) {
  //     console.log("Bookings data updated:", {
  //       count: bookings.length,
  //       firstItem: bookings[0],
  //     });
  //   }
  // }, [bookings]);

  // Memoized table columns
  const columns = useMemo(
    () => [
      "",
      "Customer Name",
      "Professional",
      "Location",
      "Price",
      "Payment",
      "Date",
      "Time",
      "Status",
    ],
    []
  );

  // Transform bookings data for the table
  const data = bookings?.map((booking) => ({
    // Status dot (red if unseen, green if seen)
    "": (
      <BsDot
        size={24}
        color={booking.isSeen ? "green" : "red"}
        className="ml-[-10px]"
      />
    ),
    "Customer Name": booking.userId?.name || "Guest",
    Professional: booking.professionalId?.name || "N/A",
    Location: booking.location?.name || booking.location || "N/A",
    Price: `$${booking.totalPrice}`,
    Payment: booking.paymentMethod,
    Date: new Date(booking.bookingDate).toLocaleDateString(),
    Time: booking.bookingTime,
    Status: (
      <Text
        className="rounded-[3px] !p-[4px]   "
        bg={
          booking.status === "completed"
            ? "#A3E8AE"
            : booking.status === "cancelled"
              ? "red"
              : booking.status === "pending"
                ? "orange"
                : "gray"
        }
        c={
          booking.status === "completed"
            ? "#427B42"
            : booking.status === "cancelled"
              ? "red"
              : booking.status === "pending"
                ? "white"
                : "white"
        }
        weight={500}
      >
        {booking.status}
      </Text>
    ),
  }));

  return (
    <div className="flex flex-col pt-20 lg:pt-0 bg-[#F5F7FA]  ">
      <Text className="!text-[18px] !font-[400] lg:!text-[22px] lg:!font-[700] mb-6">
        All Bookings
      </Text>

      <TableCom
        data={data}
        error={error}
        columns={columns}
        isLoading={isLoading}
        handleFunction={handleSubmit}
      />

      <Modal
        opened={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="Booking Details"
        size="lg"
        centered
      >
        {selectedData ? (
          <AppointmentDetails booking={selectedData} />
        ) : (
          <Text>No data available.</Text>
        )}
      </Modal>
    </div>
  );
}
