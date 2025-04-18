import { useParams } from "react-router-dom";
import Locations from "../../../../components/Locations";

export default function SuperAdminLocations() {
  // const { id } = JSON.parse(localStorage.getItem("data"));
  const { ownerId } = useParams();
  // endpoint: `/api/delete-location/${delId}`
  //  endpoint: `/api/update-location/${selectedLocation._id}`
  // endpoint: `/api/get-locations-by-owner/${ownerId}`
  // endpoint: "/api/create-location-by-superadmin",
  return (
    <Locations
      endpointCreate="/api/create-location-by-superadmin"
      endPointGet={`/api/get-locations-by-owner/${ownerId}`}
      id={ownerId}
      mode="superadmin"
    />
  );
}

// import {
//   Box,
//   Button,
//   Loader,
//   Modal,
//   Paper,
//   Table,
//   Text,
//   Title,
// } from "@mantine/core";
// import { FiUpload } from "react-icons/fi";
// import { BsTrash } from "react-icons/bs";
// import Popup from "../../../../components/PopUp";
// import { useForm } from "@mantine/form";
// import { useState } from "react";
// import {
//   useDeleteMutation,
//   usePostMutation,
//   useQueryHook,
//   useUpdateMutation,
// } from "../../../../services/reactQuery";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";

// export default function SuperAdminLocations() {
//   // const { id } = JSON.parse(localStorage.getItem("data"));
//   const { ownerId } = useParams();

//   // Query logic
//   const { mutate: deleteLocation } = useDeleteMutation(["locations", ownerId]);
//   const { mutate: createLocation } = usePostMutation(["locations", ownerId]);
//   const { mutate: updateLocation } = useUpdateMutation(["locations", ownerId]);

//   const [isDeleting, setIsDeleting] = useState(null); // Track deleting state
//   const [toggleTitle, setToggleTitle] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [opened, setOpened] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalContent, setModalContent] = useState("");
//   const [modalTitle, setModalTitle] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   const copyToClipboard = (text) => {
//     navigator.clipboard
//       .writeText(text)
//       .then(() => {
//         //console.log("link copied");
//       })
//       .catch((err) => {
//         console.error("Failed to copy: ", err);
//       });
//   };

//   const DelLocation = (delId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete?");
//     if (confirmDelete) {
//       setIsDeleting(delId);
//       deleteLocation(
//         { endpoint: `/api/delete-location/${delId}` },
//         {
//           onSuccess: () => {
//             setIsDeleting(null);
//             toast.success("Location Deleted Successfully", {
//               position: "top-center",
//             });
//           },
//           onError: () => {
//             setIsDeleting(null);
//             //console.error("Error deleting location:", error);
//             toast.error("Error deleting location", { position: "top-center" });
//           },
//         }
//       );
//     }
//   };

//   // Fetch locations
//   const {
//     data: locations = [],
//     isLoading,
//     error,
//   } = useQueryHook({
//     queryKey: ["locations", ownerId],
//     endpoint: `/api/get-locations-by-owner/${ownerId}`,
//     staleTime: 0 * 60 * 1000, // Cache for 15 minutes
//   });

//   // Form logic
//   const form = useForm({
//     mode: "uncontrolled",
//     initialValues: {
//       name: "",
//       image: "",
//       address: "",
//       googleLink: "",
//       enableCashPayments: "false", // Default to string "false"
//       workingHours: "",
//       description: "",
//     },
//     validate: {
//       name: (value) => (value.length < 1 ? "Name is required" : null),
//       address: (value) => (value.length < 1 ? "Address is required" : null),
//       googleLink: (value) =>
//         value.length < 1 ? "Google Link is required" : null,
//       description: (value) =>
//         value.length < 1 ? "Description is required" : null,
//       workingHours: (value) =>
//         value < 1 ? "Working hours must be a valid number" : null,
//     },
//   });

//   const handleSubmit = (values) => {
//     setLoading(true);

//     // Convert "enableCashPayments" from string to boolean
//     const payload = {
//       ...values,
//       enableCashPayments: values.enableCashPayments === "true", // Convert to boolean
//     };

//     //console.log(payload);
//     try {
//       if (selectedLocation) {
//         updateLocation(
//           {
//             endpoint: `/api/update-location/${selectedLocation._id}`,
//             payload: payload,
//           },
//           {
//             onSuccess: () =>
//               toast.success("Location Updated Successfully", {
//                 position: "top-center",
//               }),
//             onError: () =>
//               toast.error("Error Updated Location", { position: "top-center" }),
//           }
//         );
//       } else {
//         createLocation(
//           {
//             endpoint: "/api/create-location-by-superadmin",
//             payload: { ...payload, organizationOwnerId: ownerId },
//           },
//           {
//             onSuccess: () =>
//               toast.success("Location Created Successfully", {
//                 position: "top-center",
//               }),
//             onError: () =>
//               toast.error("Error While Creating Location", {
//                 position: "top-center",
//               }),
//           }
//         );
//       }

//       setTimeout(() => {
//         setLoading(false);
//         setOpened(false);
//       }, 1000);
//     } catch {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="flex flex-col pt-20 lg:pt-0 bg-[#F5F7FA]   min-h-screen">
//       <Title
//         py={"sm"}
//         c={"black"}
//         className="lg:px-6 px-2 lg:bg-[#FFFFFF] lg:!text-[32px] !text-[24px] !font-[500] !py-[18px] "
//       >
//         Locations
//       </Title>
//       <section className="p-6  max-w-[1440px] w-full mx-auto flex flex-col h-full gap-10">
//         <section className="flex justify-between items-center">
//           <Text className="!text-[18px] !font-[400] lg:!text-[22px] lg:!font-[700]">
//             All Locations
//           </Text>
//           <Button
//             onClick={() => {
//               setLoading(true);
//               setToggleTitle("Add Location");
//               setSelectedLocation(null);
//               form.reset();
//               setOpened(true);
//               setLoading(false);
//             }}
//             bg="black"
//             radius="md"
//             loading={loading}
//             loaderProps={{ type: "bars" }}
//             className="!text-[18px] !px-[40px] !font-[400]  !py-[10px]"
//           >
//             Add Location
//           </Button>
//         </section>

//         <Table.ScrollContainer minWidth={950}>
//           <Box
//             className="flex flex-col
//            gap-4 p-2 justify-center items-center"
//           >
//             {isLoading ? (
//               <Loader className="mx-auto" color="blue" type="bars" />
//             ) : error ? (
//               <Paper p={"md"} mt={30} className="!bg-[#F5F7FA] font-[1.2rem]">
//                 {error}
//               </Paper>
//             ) : (
//               locations?.map((val, index) => (
//                 <section
//                   key={val._id}
//                   className="min-w-full grid grid-cols-7 justify-between gap-x-2  items-center  p-2 rounded-xl specialBorder min-h-[120px]   bg-[#FFFFFF] "
//                 >
//                   <div className=" col-span-2  flex gap-3 ">
//                     {index % 3 === 0 ? (
//                       <div className="min-h-[100px] flex items-center justify-center min-w-[100px] bg-[#E7EDFF] rounded-[20px]">
//                         <img
//                           className="w-[40.83px] h-[58.33px]"
//                           src="/usaLocationIcon.png"
//                           alt=""
//                         />
//                       </div>
//                     ) : index % 3 === 1 ? (
//                       <div className="min-h-[100px] flex items-center justify-center min-w-[100px] bg-[#FFE7E7] rounded-[20px]">
//                         <img
//                           className="w-[40.83px] h-[58.33px]"
//                           src="/canadaLocationIcon.png"
//                           alt=""
//                         />
//                       </div>
//                     ) : (
//                       <div className="min-h-[100px] flex items-center justify-center min-w-[100px] bg-[#E7FFEB] rounded-[20px]">
//                         <img
//                           className="w-[40.83px] h-[58.33px]"
//                           src="/australiaLocationIcon.png"
//                           alt=""
//                         />
//                       </div>
//                     )}
//                     <div className=" flex flex-col justify-center">
//                       <Text
//                         tt={"capitalize"}
//                         className="!text-[22px] !font-[700]"
//                       >
//                         {val.name}
//                       </Text>
//                       <Text
//                         c={"#718EBF"}
//                         className="!cursor-pointer !underline !text-[18px] !font-[400]"
//                         onClick={() => {
//                           setModalTitle("Address");
//                           setModalContent(val.address);
//                           setModalOpen(true);
//                         }}
//                       >
//                         View Address
//                       </Text>
//                     </div>
//                   </div>
//                   {/* google places  */}
//                   <div className=" col-span-1">
//                     <Text
//                       tt={"capitalize"}
//                       className="!text-[22px] !font-[700]"
//                     >
//                       Google Places
//                     </Text>
//                     <Text
//                       c={"#718EBF"}
//                       className="cursor-pointer !text-[18px] !font-[400]"
//                       td={"underline"}
//                       onClick={() => copyToClipboard(val.googleLink)}
//                     >
//                       Copy Link
//                     </Text>
//                   </div>

//                   {/* Onsite Payment  */}
//                   <div className=" col-span-1">
//                     <Text
//                       tt={"capitalize"}
//                       className="!text-[22px] !font-[700]"
//                     >
//                       On-site Payments
//                     </Text>
//                     <Text c={"#718EBF"} className="!text-[18px] !font-[400]">
//                       {val.enableCashPayments ? "Yes" : "No"}
//                     </Text>
//                   </div>
//                   <div>
//                     <Text
//                       tt={"capitalize"}
//                       className="!text-[22px] !font-[700]"
//                     >
//                       Working Hours
//                     </Text>
//                     <Text
//                       c={"#718EBF"}
//                       className="cursor-pointer !text-[18px] !font-[400]"
//                     >
//                       {/* {val.workingHours} Hours */}
//                       Working Hours
//                     </Text>
//                   </div>
//                   <div>
//                     <Text
//                       tt={"capitalize"}
//                       className="!text-[22px] !font-[700]"
//                     >
//                       Description
//                     </Text>
//                     <Text
//                       td={"underline"}
//                       c={"#718EBF"}
//                       className="cursor-pointer !text-[18px] !font-[400]"
//                       onClick={() => {
//                         setModalTitle("Description");
//                         setModalContent(val.description);
//                         setModalOpen(true);
//                       }}
//                     >
//                       View Description
//                     </Text>
//                   </div>
//                   <div className="flex h-fit justify-end gap-2 rounded-xl">
//                     <button
//                       className="bg-[#427B42] rounded p-2 cursor-pointer"
//                       onClick={() => {
//                         setToggleTitle("Update Location");
//                         setSelectedLocation(val);
//                         form.setValues({
//                           name: val.name,
//                           image: val.image,
//                           address: val.address,
//                           googleLink: val.googleLink,
//                           enableCashPayments: val.enableCashPayments.toString(), // Convert boolean to string
//                           workingHours: val.workingHours,
//                           description: val.description,
//                         });
//                         setOpened(true);
//                       }}
//                     >
//                       <FiUpload size={18} style={{ color: "white" }} />
//                     </button>

//                     <button
//                       className="bg-[#622929] rounded p-2 cursor-pointer"
//                       onClick={() => DelLocation(val._id)}
//                     >
//                       {isDeleting === val._id ? (
//                         <Loader color="#FFFFFF" size="xs" type="dots" />
//                       ) : (
//                         <BsTrash size={18} style={{ color: "white" }} />
//                       )}
//                     </button>
//                   </div>
//                 </section>
//               ))
//             )}
//           </Box>
//         </Table.ScrollContainer>

//         {/* Popup for Adding/Editing Locations */}
//         <Popup
//           form={form}
//           opened={opened}
//           setOpened={setOpened}
//           handleSubmit={handleSubmit}
//           title={toggleTitle}
//         >
//           <Popup.TextInputField
//             label="Location Name"
//             placeholder="Enter Location Name"
//             id="name"
//           />
//           <Popup.TextInputField
//             label="Address"
//             placeholder="Enter Address"
//             id="address"
//           />
//           <Popup.TextInputField
//             label="Google Link"
//             placeholder="Enter Google Link"
//             id="googleLink"
//           />
//           <Popup.Input
//             label="Working Hours"
//             type="number"
//             placeholder="Enter Working Hours"
//             id="workingHours"
//           />
//           <Popup.FileInputField
//             label="Upload Image"
//             placeholder="Select an image"
//             filetype="image/*"
//             id="image"
//           />
//           <Popup.SingleSelector
//             id="enableCashPayments"
//             label="Enable Cash Payment"
//             placeholder="Select an option"
//             data={[
//               { value: "true", label: "Yes" }, // Use string "true"
//               { value: "false", label: "No" }, // Use string "false"
//             ]}
//           />
//           <Popup.TextArea
//             label="Description"
//             placeholder="Enter Location Description"
//             id="description"
//           />
//           <Popup.SubmitButton loading={loading}>Submit</Popup.SubmitButton>
//         </Popup>

//         {/* Modal for Address & Description */}
//         <Modal
//           closeOnClickOutside={false}
//           opened={modalOpen}
//           onClose={() => setModalOpen(false)}
//           title={modalTitle}
//           centered
//         >
//           <p>{modalContent}</p>
//         </Modal>
//       </section>
//     </main>
//   );
// }
