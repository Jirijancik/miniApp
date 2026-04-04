import { getErrorMessage } from "@/utils/errors";

describe("getErrorMessage", () => {
  it("extracts message from Axios error response.data.message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 400, data: { message: "Invalid email format" } },
    };
    expect(getErrorMessage(error)).toBe("Invalid email format");
  });

  it("extracts message from Axios error response.data.message array", () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 422,
        data: { message: ["Field required", "Too short"] },
      },
    };
    expect(getErrorMessage(error)).toBe("Field required");
  });

  it("extracts message from Axios error response.data.error", () => {
    const error = {
      isAxiosError: true,
      response: { status: 400, data: { error: "Bad request body" } },
    };
    expect(getErrorMessage(error)).toBe("Bad request body");
  });

  it("returns status code message when no server message for 400", () => {
    const error = {
      isAxiosError: true,
      response: { status: 400, data: {} },
    };
    expect(getErrorMessage(error)).toBe("Bad request");
  });

  it("returns generic message for 500 errors", () => {
    const error = {
      isAxiosError: true,
      response: { status: 500, data: {} },
    };
    expect(getErrorMessage(error)).toBe("Something went wrong, please try again");
  });

  it("returns generic message for 502 errors", () => {
    const error = {
      isAxiosError: true,
      response: { status: 502, data: {} },
    };
    expect(getErrorMessage(error)).toBe("Something went wrong, please try again");
  });

  it("returns network error message when no response", () => {
    const error = { isAxiosError: true };
    expect(getErrorMessage(error)).toBe("No internet connection");
  });

  it("uses Error.message for standard errors", () => {
    const error = new Error("Something specific broke");
    expect(getErrorMessage(error)).toBe("Something specific broke");
  });

  it("returns fallback for unknown non-error values", () => {
    expect(getErrorMessage("oops")).toBe("Something went wrong");
    expect(getErrorMessage(null)).toBe("Something went wrong");
    expect(getErrorMessage(42)).toBe("Something went wrong");
  });
});
