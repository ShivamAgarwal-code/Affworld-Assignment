import { useContext, useState } from "react";
import { GlobalContext } from "../../context";
import { useForm } from "react-hook-form";

export default function SecretInput() {
  const { fetchListOfSecrets, user } = useContext(GlobalContext);
  const [exhaustedSecret, setExhaustedSecret] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function handleSaveSecret(content) {
    const secret = {
      title: content.title,
      description: content.description,
      userId: user._id,
    };

    try {
      const response = await fetch("http://localhost:5000/api/secrets/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(secret),
      });
      if (response.ok) {
        reset({
          title: "",
          description: "",
        });
        setExhaustedSecret(null);
        fetchListOfSecrets();
      } else {
        const error = await response.json();
        setExhaustedSecret(error.message);
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container px-4 md:px-6">
      <div className="space-y-2 text-center ">
        <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
          Hi, {user.username}
        </h1>
        <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
          Share Your Secret
        </h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
          Share your secret with us. Your identity will remain anonymous.
        </p>
      </div>
      <form
        className="flex flex-col items-center justify-center mt-5 space-y-4"
        noValidate
        onSubmit={handleSubmit((data, e) => {
          e.preventDefault();
          handleSaveSecret(data);
        })}
      >
        <div className="flex flex-col w-full max-w-md gap-2">
          <div>
            <input
              placeholder="Title of your secret..."
              type="text"
              id="title"
              {...register("title", {
                required: "Secret Title is required",
              })}
            />
            {errors.title && (
              <p className="m-2 text-red-500 text-start">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <textarea
              placeholder="Type your secret here..."
              id="description"
              {...register("description", {
                required: "Secret Description is required",
              })}
            ></textarea>
            {errors.description && (
              <p className="mx-2 text-red-500 text-start">
                {errors.description.message}
              </p>
            )}
            {exhaustedSecret && (
              <p className="mx-2 text-red-500 text-start">{exhaustedSecret}</p>
            )}
          </div>

          <button
            className="w-full mt-2 bg-[#18181B] hover:bg-[#2c2c31] text-white py-2 rounded-md"
            type="submit"
          >
            Share Secret
          </button>
        </div>
      </form>
    </div>
  );
}
