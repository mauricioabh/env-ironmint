// Basic test to verify Jest is working
describe("Basic Tests", () => {
  it("should pass a simple test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle strings", () => {
    expect("hello").toBe("hello");
  });

  it("should handle arrays", () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it("should handle objects", () => {
    const obj = { name: "test", value: 123 };
    expect(obj).toHaveProperty("name");
    expect(obj.name).toBe("test");
  });
});
