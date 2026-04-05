import { authClient } from "./src/lib/auth-client";

// Mock fetch to inject headers
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options = {}) => {
  if (!options.headers) options.headers = {};
  if (options.headers instanceof Headers) {
    options.headers.set('origin', 'http://localhost:3000');
  } else {
    options.headers['origin'] = 'http://localhost:3000';
  }
  return originalFetch(url, options);
};

async function testAuth() {
  console.log("Registering user");
  try {
    const signup = await authClient.signUp.email({
      email: "test2@test.com",
      password: "password123",
      name: "Test User 2"
    });
    console.log("Signup:", signup);
    
    console.log("\nLogging in user");
    const login = await authClient.signIn.email({
      email: "test2@test.com",
      password: "password123"
    });
    console.log("Login data:", login.data?.user?.email);
    console.log("Login error:", login.error);
  } catch (e) {
    console.error("Test failed:", e);
  }
}

testAuth();
