import { v4 as uuidv4 } from 'uuid';

export default function uuidGenerator() {
  const uuid = uuidv4();
  return uuid;
}
