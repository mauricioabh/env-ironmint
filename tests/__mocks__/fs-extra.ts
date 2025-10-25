// Mock for fs-extra
export const mockReadFileSync = jest.fn();
export const mockWriteFileSync = jest.fn();
export const mockExistsSync = jest.fn();

export default {
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
  existsSync: mockExistsSync,
};

