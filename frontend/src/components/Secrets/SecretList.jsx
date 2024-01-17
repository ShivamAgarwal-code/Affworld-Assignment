import { useContext } from "react";
import { GlobalContext } from "../../context";

export default function SecretList() {
  const { secretList, pending } = useContext(GlobalContext);
  return (
    <div className="container px-4 m-auto md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
            Secrets Shared
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
            Read the secrets shared by others. Remember, respect everyone's
            privacy.
          </p>
        </div>
      </div>
      <div className="grid w-full max-w-2xl gap-4 m-auto">
        {secretList && !secretList.length && (
          <p className="mt-4 text-center">No Secrets available</p>
        )}
        {secretList && secretList.length && pending ? (
          <p className="mt-4 text-center">Loading Secrets Please wait...</p>
        ) : (
          <div className="p-4">
            {secretList.map((secret) => (
              <div
                key={secret._id}
                className="px-10 py-5 m-4 bg-white shadow-md hover:shadow-lg"
              >
                <h3 className="text-xl font-bold lg:text-2xl">
                  Anonymous User
                </h3>
                <h2 className="text-xl font-bold text-gray-700 ">
                  {secret.title}
                </h2>
                <p className="mt-2 text-gray-600 ">{secret.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
