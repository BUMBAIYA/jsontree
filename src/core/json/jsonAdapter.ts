const contentToJson = async (value: string): Promise<object> => {
  try {
    let json: object = JSON.parse(value);
    return Promise.resolve(json);
  } catch (error: any) {
    throw error;
  }
};

const jsonToContent = async (json: string): Promise<string> => {
  try {
    let contents = json;
    if (!json) return json;
    return Promise.resolve(contents);
  } catch (error: any) {
    throw error;
  }
};

export { contentToJson, jsonToContent };
