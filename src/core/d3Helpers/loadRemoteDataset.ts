import { json } from 'd3-fetch';

const loadRemoteDataset = async (filename: string) => {
  return await json(filename);
};

export default loadRemoteDataset;
