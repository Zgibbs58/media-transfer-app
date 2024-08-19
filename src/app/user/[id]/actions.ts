"use server";

export async function onSubmit(formData: FormData) {
  console.log("Form data submitted", formData.get("file"));
}
