// lớp quản lí kết nối giữa ứng dụng và mongodb
import { MongoClient } from "mongodb";

// object uri: địa chỉ kết nối tới MongoDB
export async function connectDatabase({ uri, databaseName }) {
  // Tạo MongoDB Client từ URI (chỉ tạo đối tượng, chưa tạo kết nối)
  const client = new MongoClient(uri);

  // Mở kểt nối tới MongoDB
  await client.connect();

  // Đối tượng đại diện cho database
  const database = client.db(databaseName);

  await database.command({ ping: 1 });
  console.log(`Connected to MongoDB database ${databaseName}`)

  return {client, database};
}

