import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";


const useFetch = <T>(getFunction: () => Promise<T>) => {
const [data, setData] = useState<T | null>(null);
const toast = useToast();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus("pending");
    setData(null);
    setError(null);
    const controller = new AbortController();
    getFunction()
      .then((res) => {
        setData(res);
        setStatus("success");
      })
      .catch((err) => {
        console.log(err);
        // toast({
        //   title: `Oops something went wrong`,
        //   position: 'top-right',
        //   status: 'error',
        //   isClosable: true,
        // });
        if (controller.signal.aborted) {
          setError(err);
          setStatus("error");
        }
        setError(err?.response?.data?.message);
        setStatus("error");
      });
    return () => controller.abort();
  }, [getFunction]);

  return {
    data,
    error,
    isLoading: status === "pending",
    isSuccess: status === "success",
    isError: status === "error",
  };
}

export default useFetch;