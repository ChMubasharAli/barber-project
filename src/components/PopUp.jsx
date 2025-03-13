import {
  Button,
  Paper,
  TextInput,
  Stack,
  Textarea,
  Group,
  Modal,
  FileInput,
  Checkbox,
  MultiSelect,
  Select,
  Loader,
} from "@mantine/core";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { FiUpload } from "react-icons/fi";

// Popup Component (Parent Component)
const PopupContext = createContext();

const Popup = ({
  opened,
  setOpened,
  handleSubmit,
  children,
  form,
  title = "Add Your Title",
}) => {
  // Access form from context

  return (
    <PopupContext.Provider value={form}>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={title}
        centered
        size="xl"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Paper bg={"white"} shadow="md" className="p-8" radius={"md"}>
            <Stack spacing="md">{children}</Stack>
          </Paper>
        </form>
      </Modal>
    </PopupContext.Provider>
  );
};

function Input({ label, placeholder, id, type = "text" }) {
  const form = usePopupForm();

  // Handle checkbox separately
  if (type === "checkbox") {
    return (
      <Checkbox
        color="black"
        label={label}
        onChange={(event) =>
          form.setFieldValue(id, event.currentTarget.checked)
        }
      />
    );
  }

  // Handle all other inputs
  return (
    <TextInput
      type={type}
      label={label}
      placeholder={placeholder}
      {...form.getInputProps(id)}
    />
  );
}

function TextInputField({ label, placeholder, id }) {
  const form = usePopupForm();
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      {...form.getInputProps(id)}
    />
  );
}

function TextArea({ label, placeholder, id }) {
  const form = usePopupForm();
  return (
    <Textarea
      label={label}
      placeholder={placeholder}
      {...form.getInputProps(id)}
    />
  );
}

function SubmitButton({ loading, children }) {
  return (
    <Group position="right" mt="xl">
      <Button
        fullWidth
        type="submit"
        bg={"black"}
        c={"white"}
        loading={loading}
        loaderProps={{ type: "dots" }}
      >
        {children}
      </Button>
    </Group>
  );
}

function FileInputField({ label, placeholder, filetype, id }) {
  const [loading, setLoading] = useState(false);
  const form = usePopupForm(); // ✅ Get form context

  const handleUploadToCloudinary = async (file) => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    ); // ✅ Cloudinary Upload Preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      const uploadedUrl = response.data.secure_url;
      form.setFieldValue(id, uploadedUrl); // ✅ Update form field with image URL
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FileInput
      rightSection={loading ? <Loader size="sm" /> : <FiUpload size={18} />}
      label={label}
      placeholder={placeholder}
      rightSectionPointerEvents="none"
      mt="md"
      accept={filetype}
      onChange={(file) => handleUploadToCloudinary(file)}
    />
  );
}

function MutltiSelector({ data, label, placeholder, id }) {
  const form = usePopupForm();
  console.log(data, label, placeholder, id);
  return (
    <MultiSelect
      checkIconPosition="right"
      data={Array.isArray(data) ? data : []}
      label={label}
      placeholder={placeholder}
      {...form.getInputProps(id)}
    />
  );
}

function SingleSelector({ data, label, placeholder, id }) {
  const form = usePopupForm();

  return (
    <Select
      data={Array.isArray(data) ? data : []}
      label={label}
      placeholder={placeholder}
      {...form.getInputProps(id)}
    />
  );
}

//eslint ignore
export function usePopupForm() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopupForm must be used within a PopupProvider");
  }
  return context;
}

Popup.Input = Input;
Popup.TextInputField = TextInputField;
Popup.FileInputField = FileInputField;
Popup.TextArea = TextArea;
Popup.MutltiSelector = MutltiSelector;
Popup.SingleSelector = SingleSelector;
Popup.SubmitButton = SubmitButton;

export default Popup;
