import { auth } from "@/auth";
import { cache } from "react";

// This is a simple wrapper around the auth function that caches the result for the duration of the request
// This is useful when you need to call auth multiple times in the same request
export default cache(auth);
