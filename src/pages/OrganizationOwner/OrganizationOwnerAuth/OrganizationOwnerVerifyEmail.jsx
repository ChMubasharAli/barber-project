import { useState } from "react";
import {
  Box,
  Button,
  Image,
  Paper,
  Stack,
  Text,
  PinInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import freshifyImage from "../../../assets/freshifyImage.png";

import { apiPost } from "../../../services/useApi";
import { useNavigate, useLocation } from "react-router-dom";

export default function OrganizationOwnerVerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail } = location.state || {};
  const [loading, setLoading] = useState(false);

  console.log(userEmail);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      apiPost("/api/verify-otp", {
        email: userEmail,
        otp: values.pin,
      });
      console.log("Entered PIN:", values.pin);
      setLoading(false);
      navigate("/OrganizationOwnerLogin");
    } catch (error) {
      console.log("Error Verifying email", error);
    }
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { pin: "" },
    validate: {
      pin: (value) =>
        value.length === 4 ? null : "Please enter a 4-digit PIN",
    },
  });

  return (
    <main className="grid h-[100dvh] mx-auto max-w-[1440px] grid-cols-2 bg-[#F5F7FA] py-1">
      {/* Left Side - Image */}
      <section className="rounded-tr-xl rounded-br-xl bg-black flex items-center justify-center">
        <Image
          radius="md"
          height={"full"}
          src={freshifyImage}
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
      </section>

      {/* Right Side - Form */}
      <section className="flex items-center justify-center">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Paper
            bg={"white"}
            shadow="md"
            className="h-[350px] !flex flex-col gap-10 p-8 w-[595px]"
            radius={"md"}
          >
            {/* Heading */}
            <Box>
              <Text size="30px" fw={600} c={"black"} ta={"center"}>
                Verify Email
              </Text>
              <Text c="dimmed" size="sm" ta="center" mt={15}>
                Enter the 4-digit OTP sent to your Email Address.
              </Text>
            </Box>

            {/* PIN Input Field */}
            <Stack
              bg="var(--mantine-color-body)"
              align="center"
              justify="center"
              gap="xs"
              className="flex items-center justify-center"
            >
              <PinInput
                autoFocus
                size="lg"
                placeholder="-"
                type="number"
                length={4}
                {...form.getInputProps("pin")}
              />
            </Stack>

            {/* Verify OTP Button */}
            <Box>
              <Button
                fullWidth
                type="submit"
                bg={"black"}
                c={"white"}
                loading={loading}
                loaderProps={{ type: "dots" }}
              >
                Verify OTP
              </Button>
            </Box>
          </Paper>
        </form>
      </section>
    </main>
  );
}
