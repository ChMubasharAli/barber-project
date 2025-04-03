import {
  Box,
  Button,
  Flex,
  Group,
  Loader,
  Modal,
  Paper,
  Switch,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { FiUpload } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import Popup from "../../../../components/PopUp";
import { useForm } from "@mantine/form";
import { useState } from "react";
import {
  useDeleteMutation,
  usePostMutation,
  useQueryHook,
  useUpdateMutation,
} from "../../../../services/reactQuery";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import TimePicker from "../../../../components/DayTimePicker";

export default function OrganizationOwnerLocations() {
  const { id } = JSON.parse(localStorage.getItem("data"));

  // Query logic
  const { mutate: deleteLocation } = useDeleteMutation(["locations", id]);
  const { mutate: createLocation } = usePostMutation(["locations", id]);
  const { mutate: updateLocation } = useUpdateMutation(["locations", id]);

  const [toggleTitle, setToggleTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  //workign hours

  // const [workingHoursModalOpen, setWorkingHoursModalOpen] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("link copied");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  const {
    data: locations = [],
    isLoading,
    error,
  } = useQueryHook({
    queryKey: ["locations", id],
    endpoint: `/api/get-locations-by-owner/${id}`,
    staleTime: 0 * 60 * 1000, // Cache for 15 minutes
  });
  console.log(locations);
  const queryClient = useQueryClient();

  const DelLocation = (delId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (confirmDelete) {
      setIsDeleting(delId);
      deleteLocation(
        { endpoint: `/api/delete-location/${delId}` },
        {
          onSuccess: () => {
            //console.log(responseData);
            queryClient.invalidateQueries({ queryKey: ["locations", id] });
            window.location.reload();
            toast.success("Location Deleted Successfully", {
              position: "top-center",
            });
          },
          onError: () => {
            setIsDeleting(null);
            toast.error("Error deleting location", { position: "top-center" });
          },
        }
      );
    }
  };

  // Fetch locations
  const [defaultWorkingHours] = useState([
    { day: "monday", start: "08:00", end: "18:00", closed: false },
    { day: "tuesday", start: "08:00", end: "18:00", closed: false },
    { day: "wednesday", start: "08:00", end: "18:00", closed: false },
    { day: "thursday", start: "08:00", end: "18:00", closed: false },
    { day: "friday", start: "08:00", end: "18:00", closed: false },
    { day: "saturday", start: "08:00", end: "18:00", closed: false },
    { day: "sunday", start: "08:00", end: "18:00", closed: false },
  ]);

  const [workingHoursModalOpen, setWorkingHoursModalOpen] = useState(false);
  const [workingHoursData, setWorkingHoursData] = useState([
    ...defaultWorkingHours,
  ]);
  const handleTimeChange = (index, field, value) => {
    const updatedHours = [...workingHoursData];
    updatedHours[index][field] = value;
    setWorkingHoursData(updatedHours);
  };

  const handleDayToggle = (index, closed) => {
    const updatedHours = [...workingHoursData];
    updatedHours[index].closed = closed;
    setWorkingHoursData(updatedHours);
  };

  const openWorkingHoursModal = (location) => {
    setSelectedLocation(location);
    if (location.workingHours && Array.isArray(location.workingHours)) {
      setWorkingHoursData(location.workingHours);
    } else {
      setWorkingHoursData([...defaultWorkingHours]);
    }
    setWorkingHoursModalOpen(true);
  };
  // Form logic
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      image: "",
      address: "",
      googleLink: "",
      enableCashPayments: "false",
      startTime: "08:00", // Default start time
      endTime: "18:00", // Default end time
      description: "",
    },
  });
  const handleSubmit = (values) => {
    setLoading(true);
    console.log(values);

    // Convert "enableCashPayments" from string to boolean
    let payload = {
      ...values,
      enableCashPayments: values.enableCashPayments === "true", // Convert to boolean
    };

    try {
      if (selectedLocation) {
        updateLocation(
          {
            endpoint: `/api/update-location/${selectedLocation._id}`,
            payload: payload,
          },
          {
            onSuccess: () =>
              toast.success("Location Updated Successfully", {
                position: "top-center",
              }),
            onError: () =>
              toast.error("Error Updated Location", { position: "top-center" }),
          }
        );
      } else {
        //   startTime: "08:00", // Default start time
        // endTime: "18:00",
        const workingHoursCreate = defaultWorkingHours.map((val) => ({
          ...val,
          start: values.startTime,
          end: values.endTime,
        }));
        payload = { ...payload, workingHours: workingHoursCreate };
        createLocation(
          {
            endpoint: "/api/create-location",
            payload: payload,
          },
          {
            onSuccess: () =>
              toast.success("Location Created Successfully", {
                position: "top-center",
              }),
            onError: () =>
              toast.error("Error While Creating Location", {
                position: "top-center",
              }),
          }
        );
      }

      setTimeout(() => {
        setLoading(false);
        setOpened(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Error Creating/Updating location", error);
    }
  };

  return (
    <main className="flex flex-col pt-20 lg:pt-0 bg-[#F5F7FA]   min-h-screen">
      <Title
        py={"sm"}
        c={"black"}
        className="lg:px-6 px-2 lg:bg-[#FFFFFF] lg:!text-[32px] !text-[24px] !font-[500] !py-[18px] "
      >
        Locations
      </Title>
      <section className="p-6  max-w-[1440px] w-full mx-auto flex flex-col h-full gap-10">
        <section className="flex justify-between items-center">
          <Text className="!text-[18px] !font-[400] lg:!text-[22px] lg:!font-[700]">
            All Locations
          </Text>
          <Button
            onClick={() => {
              setLoading(true);
              setToggleTitle("Add Location");
              setSelectedLocation(null);
              form.reset();
              setOpened(true);
              setLoading(false);
            }}
            loading={loading}
            loaderProps={{ type: "bars" }}
            bg="black"
            radius="md"
            className="!text-[18px] !px-[40px] !font-[400]  !py-[10px]"
          >
            Add Location
          </Button>
        </section>
        <Table.ScrollContainer minWidth={950}>
          <Box
            className="flex flex-col 
              gap-4 p-2 justify-center items-center"
          >
            {isLoading ? (
              <Loader className="mx-auto" color="blue" type="bars" />
            ) : error ? (
              <Paper p={"md"} mt={30} className="!bg-[#F5F7FA] font-[1.2rem]">
                {error}
              </Paper>
            ) : (
              locations?.map((val, index) => (
                <section
                  key={val._id}
                  className="min-w-full grid grid-cols-7 justify-between gap-x-2  items-center  p-2 rounded-xl specialBorder min-h-[120px]   bg-[#FFFFFF] "
                >
                  <div className=" col-span-2  flex gap-3 ">
                    {index % 3 === 0 ? (
                      <div className="min-h-[100px] flex items-center justify-center min-w-[100px] bg-[#E7EDFF] rounded-[20px]">
                        <img
                          className="w-[40.83px] h-[58.33px]"
                          src="/usaLocationIcon.png"
                          alt=""
                        />
                      </div>
                    ) : index % 3 === 1 ? (
                      <div className="min-h-[100px] flex items-center justify-center min-w-[100px] bg-[#FFE7E7] rounded-[20px]">
                        <img
                          className="w-[40.83px] h-[58.33px]"
                          src="/canadaLocationIcon.png"
                          alt=""
                        />
                      </div>
                    ) : (
                      <div className="min-h-[100px] flex items-center justify-center min-w-[100px] bg-[#E7FFEB] rounded-[20px]">
                        <img
                          className="w-[40.83px] h-[58.33px]"
                          src="/australiaLocationIcon.png"
                          alt=""
                        />
                      </div>
                    )}
                    <div className=" flex flex-col justify-center">
                      <Text
                        tt={"capitalize"}
                        className="!text-[22px] !font-[700]"
                      >
                        {val.name}
                      </Text>
                      <Text
                        c={"#718EBF"}
                        className="!cursor-pointer !underline !text-[18px] !font-[400]"
                        onClick={() => {
                          setModalTitle("Address");
                          setModalContent(val.address);
                          setModalOpen(true);
                        }}
                      >
                        View Address
                      </Text>
                    </div>
                  </div>
                  {/* google places  */}
                  <div className=" col-span-1">
                    <Text
                      tt={"capitalize"}
                      className="!text-[22px] !font-[700]"
                    >
                      Google Places
                    </Text>
                    <Text
                      c={"#718EBF"}
                      className="cursor-pointer !text-[18px] !font-[400]"
                      td={"underline"}
                      onClick={() => copyToClipboard(val.googleLink)}
                    >
                      Copy Link
                    </Text>
                  </div>

                  {/* Onsite Payment  */}
                  <div className=" col-span-1">
                    <Text
                      tt={"capitalize"}
                      className="!text-[22px] !font-[700]"
                    >
                      On-site Payments
                    </Text>
                    <Text c={"#718EBF"} className="!text-[18px] !font-[400]">
                      {val.enableCashPayments ? "Yes" : "No"}
                    </Text>
                  </div>
                  <div>
                    <Text
                      tt={"capitalize"}
                      className="!text-[22px] !font-[700]"
                    >
                      Working Hours
                    </Text>
                    <Text
                      c={"#718EBF"}
                      className="cursor-pointer !text-[18px] !font-[400]"
                      onClick={() => openWorkingHoursModal(val)}
                    >
                      {val.workingHours} Hours
                    </Text>
                  </div>
                  <div>
                    <Text
                      tt={"capitalize"}
                      className="!text-[22px] !font-[700]"
                    >
                      Description
                    </Text>
                    <Text
                      td={"underline"}
                      c={"#718EBF"}
                      className="cursor-pointer !text-[18px] !font-[400]"
                      onClick={() => {
                        setModalTitle("Description");
                        setModalContent(val.description);
                        setModalOpen(true);
                      }}
                    >
                      View Description
                    </Text>
                  </div>
                  <div className="flex h-fit justify-end gap-2 rounded-xl">
                    <button
                      className="bg-[#427B42] rounded p-2 cursor-pointer"
                      onClick={() => {
                        setToggleTitle("Update Location");
                        setSelectedLocation(val);
                        form.setValues({
                          name: val.name,
                          image: val.image,
                          address: val.address,
                          googleLink: val.googleLink,
                          enableCashPayments: val.enableCashPayments.toString(), // Convert boolean to string
                          workingHours: val.workingHours,
                          description: val.description,
                        });
                        setOpened(true);
                      }}
                    >
                      <FiUpload size={18} style={{ color: "white" }} />
                    </button>

                    <button
                      className="bg-[#622929] rounded p-2 cursor-pointer"
                      onClick={() => DelLocation(val._id)}
                    >
                      {isDeleting === val._id ? (
                        <Loader color="#FFFFFF" size="xs" type="dots" />
                      ) : (
                        <BsTrash size={18} style={{ color: "white" }} />
                      )}
                    </button>
                  </div>
                </section>
              ))
            )}
          </Box>
        </Table.ScrollContainer>
        {/* Popup for Adding/Editing Locations */}
        <Popup
          form={form}
          opened={opened}
          setOpened={setOpened}
          handleSubmit={handleSubmit}
          title={toggleTitle}
        >
          <Popup.TextInputField
            label="Location Name"
            placeholder="Enter Location Name"
            id="name"
          />
          <Popup.TextInputField
            label="Address"
            placeholder="Enter Address"
            id="address"
          />
          <Popup.TextInputField
            label="Google Link"
            placeholder="Enter Google Link"
            id="googleLink"
          />
          {/* <Popup.Input
            label="Working Hours"
            type="number"
            placeholder="Enter Working Hours"
            id="workingHours"
          /> */}
          <Popup.FileInputField
            label="Upload Image"
            placeholder="Select an image"
            filetype="image/*"
            id="image"
          />
          {selectedLocation ? (
            ""
          ) : (
            <>
              <TimePicker
                label="Opening Time (All Days)"
                value={form.values.startTime}
                onChange={(value) => form.setFieldValue("startTime", value)}
              />
              <TimePicker
                label="Closing Time (All Days)"
                value={form.values.endTime}
                onChange={(value) => form.setFieldValue("endTime", value)}
              />
            </>
          )}
          <Popup.SingleSelector
            id="enableCashPayments"
            label="Enable Cash Payment"
            placeholder="Select an option"
            data={[
              { value: "true", label: "Yes" }, // Use string "true"
              { value: "false", label: "No" }, // Use string "false"
            ]}
          />
          <Popup.TextArea
            label="Description"
            placeholder="Enter Location Description"
            id="description"
          />
          <Popup.SubmitButton loading={loading}>Submit</Popup.SubmitButton>
        </Popup>
        {/* Modal for Address & Description */}
        <Modal
          closeOnClickOutside={false}
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalTitle}
          centered
        >
          <p>{modalContent}</p>
        </Modal>
        <Modal
          opened={workingHoursModalOpen}
          onClose={() => setWorkingHoursModalOpen(false)}
          title="Edit Working Hours"
          centered
          size="lg"
        >
          <div className="space-y-4">
            {workingHoursData.map((dayData, index) => (
              <div key={dayData.day} className="border-b pb-4">
                <Flex justify="space-between" align="center" mb="sm">
                  <Text tt="capitalize" fw={500}>
                    {dayData.day}
                  </Text>
                  <Switch
                    checked={!dayData.closed}
                    onChange={(e) =>
                      handleDayToggle(index, !e.currentTarget.checked)
                    }
                    label={dayData.closed ? "Closed" : "Open"}
                  />
                </Flex>

                {!dayData.closed && (
                  <Flex gap="md" align="center">
                    <TimePicker
                      label="Opening Time"
                      value={dayData.start}
                      onChange={(value) =>
                        handleTimeChange(index, "start", value)
                      }
                    />
                    <TimePicker
                      label="Closing Time"
                      value={dayData.end}
                      onChange={(value) =>
                        handleTimeChange(index, "end", value)
                      }
                    />
                  </Flex>
                )}
              </div>
            ))}
          </div>

          <Group justify="flex-end" mt="md">
            <Button
              onClick={async () => {
                if (selectedLocation) {
                  setLoading(true);
                  try {
                    await updateLocation({
                      endpoint: `/api/update-location/${selectedLocation._id}`,
                      payload: {
                        workingHours: workingHoursData,
                      },
                    });
                    toast.success("Working Hours Updated Successfully", {
                      position: "top-center",
                    });
                    setWorkingHoursModalOpen(false);
                  } catch {
                    toast.error("Error Updating Working Hours", {
                      position: "top-center",
                    });
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              loading={loading}
            >
              Save Hours
            </Button>
          </Group>
        </Modal>{" "}
      </section>
    </main>
  );
}
