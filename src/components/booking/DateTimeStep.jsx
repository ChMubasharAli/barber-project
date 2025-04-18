import { useState, useEffect, useCallback } from "react";
import { useBookingContext } from "./BookingContext";
import CalendarComp from "../CustomerCalendar";
import { format } from "date-fns";
import { useQueryHook } from "../../services/reactQuery";
import generateTimeSlots from "./TimeSlotsGenerator";
import { Button, Loader } from "@mantine/core";
import { apiGet } from "../../services/useApi";

const formatMidnightHours = (time24) => {
  if (!time24) return "";
  if (time24 === "00:00") return "12:00";
  if (time24 === "00:30") return "12:30";
  return time24; // Return original for all other times
};

export default function DateTimeStep() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const { bookingData, updateBookingData } = useBookingContext();

  const formattedUTC = selectedDate
    ? format(new Date(selectedDate), "yyyy-MM-dd")
    : null;

  const {
    data: unavailableSlots = { bookedSlots: [], unavailablePeriods: [] },
    isLoading: isLoadingSlots,
    refetch,
  } = useQueryHook({
    queryKey: ["unavailable", formattedUTC],
    endpoint: formattedUTC
      ? `/api/unavailable-slots/${bookingData?.professional?._id}/${formattedUTC}`
      : null,
    enabled: !!formattedUTC,
    staleTime: 5 * 60 * 1000,
  });

  const generateAvailableSlots = useCallback(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    try {
      const DateOBJ = new Date(selectedDate);
      const dayName = format(DateOBJ, "EEEE").toLowerCase();

      const filterData = bookingData?.location?.workingHours?.find(
        (val) => val.day.toLowerCase() === dayName
      );

      if (!filterData) {
        setTimeSlots([]);
        return;
      }

      const safeBlockedSlots = [
        ...(unavailableSlots.bookedSlots ?? []),
        ...(unavailableSlots.unavailablePeriods ?? []),
      ]
        .map((val) => {
          if (!val?.startTime || !val?.endTime) return null;
          return `${val.startTime}-${val.endTime}`;
        })
        .filter(Boolean);

      const slots = generateTimeSlots({
        openingTime: filterData.start,
        closingTime: filterData.end,
        serviceDuration: bookingData.services.reduce(
          (total, service) => total + service.duration,
          0
        ),
        blockedSlots: safeBlockedSlots,
        date: DateOBJ,
      });

      setTimeSlots(slots);
    } catch (error) {
      console.error("Error generating slots:", error);
      setTimeSlots([]);
    }
  }, [
    selectedDate,
    bookingData?.location?.workingHours,
    bookingData?.services,
    unavailableSlots,
  ]);

  useEffect(() => {
    generateAvailableSlots();
  }, [generateAvailableSlots]);

  const OnClickDay = async (date) => {
    const DateOBJ = new Date(date);
    setSelectedDate(DateOBJ);
    setSelectedDay(DateOBJ.toDateString());
    updateBookingData({ date: DateOBJ, time: null });
    setIsFetching(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error fetching unavailable slots:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleMonthChange = () => {
    setTimeSlots([]);
    setSelectedDay("");
    setSelectedDate(null);
  };

  const handleConnectGoogle = async () => {
    try {
      const { url } = await apiGet(`/api/auth/google`);
      window.location.href = url;
    } catch (err) {
      console.error("Error connecting to Google:", err);
    }
  };

  const isLoading = isLoadingSlots || isFetching;

  return (
    <div className="px-3 lg:px-0 h-full flex flex-col justify-center">
      <h1 className="text-[28px] lg:text-[32px] font-[500] text-center sm:text-left">
        Select Date And Time
      </h1>
      <div className="mb-8">
        <CalendarComp
          onClickDay={OnClickDay}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          handleMonthChange={handleMonthChange}
          workingHours={bookingData?.location?.workingHours}
        />
        <Button
          bg={"black"}
          radius={"md"}
          className="flex"
          onClick={handleConnectGoogle}
        >
          Connect with Google
        </Button>
      </div>
      <h2 className="text-[28px] lg:text-[32px] font-[500] text-center sm:text-left mb-4">
        Available Time Slots
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader />
        </div>
      ) : timeSlots.length > 0 ? (
        <div className="max-w-[458px] grid grid-cols-3 pb-[100px] lg:pb-0 md:grid-cols-4 lg:grid-cols-4 gap-[10px]">
          {timeSlots.map((time) => {
            const displayTime = formatMidnightHours(time);
            return (
              <button
                key={time}
                onClick={() => updateBookingData({ time })}
                className={`!py-[5px] !px-[25px] border rounded-full text-center !text-[22px] !font-bold transition-colors ${
                  bookingData.time === time
                    ? "bg-black text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                {displayTime}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          {selectedDate
            ? "No available slots for this date"
            : "Select a date to see available slots"}
        </div>
      )}
    </div>
  );
}
