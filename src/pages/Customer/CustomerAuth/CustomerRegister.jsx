import { Button, Image, PasswordInput, Text, TextInput } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import freshifyImage from "../../../assets/freshifyImage.png";
import { useForm } from "@mantine/form";
import { registerUser } from "./services/AuthServices";
import { toast } from "react-toastify";

export default function CustomerRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      name: "",
      phone: "",
      password: "",
      role: "customer",
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      name: (value) =>
        value.trim().length > 2
          ? null
          : "Full Name must be at least 3 characters",
      phone: (value) =>
        /^\+?\d{10,15}$/.test(value) ? null : "Invalid phone number",
      password: (value) =>
        value.length >= 6 ? null : "Password must have at least 6 characters",
    },
  });

  const handleSubmit = async (values) => {
    try {
      console.log("Form submitted:", values);
      setLoading(true);
      //register
      const userData = await registerUser(values);

      console.log(userData.newUser);
      toast(userData.message, { position: "top-center" });
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        navigate("/CustomerVerifyEmail", {
          state: { userEmail: values.email },
        });
      }, 1500);
    } catch (error) {
      console.log("Signup Error", error);
      toast(error, { position: "top-center" });
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col  lg:grid h-screen  mx-auto  lg:grid-cols-2 lg:gap-x-4  lg:gap-y-0    px-3 lg:px-0">
      {/* This image will be visible on large devices  */}
      <section className=" hidden rounded-tr-xl rounded-br-xl bg-black lg:flex items-center justify-center">
        <Image
          radius="md"
          height={"full"}
          src={freshifyImage}
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
      </section>

      {/* This image will be visible on Mobile devices  */}
      <section className=" lg:hidden h-[85px] md:h-[100px] md:py-2  overflow-hidden bg-black flex items-center justify-center rounded-bl-xl rounded-br-xl">
        <Image
          radius="md"
          className="object-contain  w-full lg:w-[60%]  "
          src={freshifyImage}
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
      </section>

      {/* Right Section - Form */}
      <section className="h-full  flex items-center  justify-center">
        <form
          className="w-full flex flex-col max-w-[547px]  bg-[#FFFFFF] rounded-[25px] gap-[10px] p-[20px]"
          onSubmit={form.onSubmit(handleSubmit)}
        >
          {/* Title & Login Link */}

          <Text
            ta={"center"}
            className="!text-[28px] !font-[400] lg:!text-[32px] lg:!font-[500]"
          >
            Signup
          </Text>
          <Text c="dimmed" size="sm" ta="center">
            Already have an account?{" "}
            <Link
              to={"/CustomerLogin"}
              className="text-black underline underline-offset-4 hover:text-blue-500 transition-all duration-300"
            >
              Login
            </Link>
          </Text>

          {/* Input Fields */}
          <div className="flex flex-col gap-[10px]">
            <span className=" !font-[400] !text-[18px] !text-[#000000]">
              Email Address
            </span>
            <TextInput
              radius={"md"}
              placeholder="Enter your email"
              {...form.getInputProps("email")}
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <span className=" !font-[400] !text-[18px] !text-[#000000]">
              Full Name
            </span>
            <TextInput
              radius={"md"}
              placeholder="Enter your full name"
              {...form.getInputProps("name")}
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <span className=" !font-[400] !text-[18px] !text-[#000000]">
              Phone Number
            </span>
            <TextInput
              radius={"md"}
              placeholder="Enter your phone number"
              {...form.getInputProps("phone")}
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <span className=" !font-[400] !text-[18px] !text-[#000000]">
              Password
            </span>
            <PasswordInput
              radius={"md"}
              placeholder="Enter your password"
              {...form.getInputProps("password")}
            />
          </div>

          {/* Signup Button */}
          <Button
            type="submit"
            fullWidth
            bg={"black"}
            c={"white"}
            radius={"md"}
            className="!text-[18px] !font-[400]"
            loading={loading}
            loaderProps={{ type: "dots" }}
          >
            Signup
          </Button>
        </form>
      </section>
    </main>
  );
}
