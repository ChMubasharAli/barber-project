import { useState } from "react";
import {
  Box,
  Button,
  Image,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import freshifyImage from "../../../../../assets/freshifyImage.png";
import { apiPost } from "../../../../../services/useApi";

export default function OrganizationOwnerUserResetPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Store success/error message

  // Form validation
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "" },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email address",
    },
  });

  // Handle Forgot Password Request
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setMessage(""); // Reset message

      // API call to request password reset
      const resetRequest = await apiPost("/api/forgot-password-user", values);
      console.log("Reset Request Sent:", resetRequest);

      // Show success message
      setMessage("Password reset link sent! Check your email.");
    } catch (error) {
      console.error("Error in forgot password request:", error);

      // Handle error cases
      if (error.response && error.response.status === 404) {
        setMessage("User not found. Please enter a valid email.");
      } else {
        setMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid h-[100dvh] max-w-[1440px] grid-cols-2 bg-[#F5F7FA] py-1">
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
                Forgot Password
              </Text>
              <Text c="dimmed" size="sm" ta="center" mt={15}>
                Enter your email address to receive a password reset link.
              </Text>
            </Box>

            {/* Email Input Field */}
            <Stack
              bg="var(--mantine-color-body)"
              align="stretch"
              justify="center"
              gap="xs"
            >
              <TextInput
                radius={"md"}
                label="Email"
                placeholder="Enter your email"
                key={form.key("email")}
                {...form.getInputProps("email")}
              />
            </Stack>

            {/* Success/Error Message */}
            {message && (
              <Text size="sm" c={message.includes("sent") ? "green" : "red"}>
                {message}
              </Text>
            )}

            {/* Submit Button */}
            <Box>
              <Button
                fullWidth
                type="submit"
                bg={"black"}
                c={"white"}
                loading={loading}
                loaderProps={{ type: "dots" }}
              >
                Send Reset Link
              </Button>
            </Box>
          </Paper>
        </form>
      </section>
    </main>
  );
}
